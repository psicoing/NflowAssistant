import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { pool } from "../server/db";
import { ChatBudgetLedger } from "../server/chat-budget-ledger";
import { budgetedChatCompletion } from "../server/chat-budget";
import { boundedChatHistory, CHAT_MONTHLY_BUDGET_USD, meteredChatCost, quoteChatRequest } from "../server/chat-cost-policy";
import { countDeliveredChatQuestion } from "../server/chat-question-quota";

// Real SQL transactions, but isolated tables; never real AI or patient records.
// The only dropped schema is this newly created, random test schema.
const schema = `chat_budget_test_${randomUUID().replaceAll("-", "").slice(0, 16)}`;
let created = false;
let month = "2099-10";
try {
  assert.equal(CHAT_MONTHLY_BUDGET_USD, 20);
  let quotaDeductions = 0;
  const deduct = async () => { quotaDeductions++; };
  assert.equal(await countDeliveredChatQuestion({ countsTowardQuestionQuota: false }, { remaining: 99 }, deduct), 100);
  assert.equal(await countDeliveredChatQuestion({ countsTowardQuestionQuota: false }, { remaining: 0 }, deduct), 1);
  assert.equal(quotaDeductions, 0, "Blocked/static responses do not consume subscription or prepaid questions");
  assert.equal(await countDeliveredChatQuestion({ countsTowardQuestionQuota: true }, { remaining: 99 }, deduct), 99);
  assert.equal(quotaDeductions, 1);
  const messages = [{ role: "system" as const, content: "Synthetic instructions" }, { role: "user" as const, content: "Synthetic anxiety question" }];
  const quote = quoteChatRequest("gpt-5.5-2026-04-23", messages, 500);
  assert(quote.maximumNanoUsd > meteredChatCost({ prompt_tokens: 100, completion_tokens: 100 }, "default")!.nanoUsd);
  assert.throws(() => quoteChatRequest("unpriced-model", messages, 500), { code: "NUXA_CHAT_PRICING_UNVERIFIED" });
  assert.throws(() => quoteChatRequest(quote.model, [{ role: "user", content: "x".repeat(16_385) }], 500), { code: "NUXA_CHAT_INPUT_TOO_LARGE" });
  assert.throws(() => quoteChatRequest(quote.model, messages, 4001));
  const history = [{ content: "x".repeat(20_000), isUser: true }, { content: "Recent anxiety", isUser: true }];
  assert.equal(boundedChatHistory(history).length, 1);
  assert.equal(history[0].content.length, 20_000, "Never delete or mutate stored history");
  assert.equal(boundedChatHistory([{ content: "Current question", isUser: true }], "Current question").length, 0, "Do not bill the saved current message twice");
  assert.equal(meteredChatCost(undefined), null);
  assert.equal(meteredChatCost({ prompt_tokens: -1, completion_tokens: 5 }), null);
  assert(meteredChatCost({ prompt_tokens: 100, completion_tokens: 100 })!.nanoUsd > meteredChatCost({ prompt_tokens: 100, completion_tokens: 100 }, "default")!.nanoUsd);

  await pool.query(`CREATE SCHEMA "${schema}"`);
  created = true;
  const store = new ChatBudgetLedger(pool, schema, () => month);
  await store.ensureTables();
  const largeQuote = { ...quote, maximumNanoUsd: 8_000_000_000 };
  const attempts = await Promise.allSettled(Array.from({ length: 12 }, () => store.reserve(largeQuote)));
  const accepted = attempts.filter(result => result.status === "fulfilled").map(result => (result as PromiseFulfilledResult<any>).value);
  assert.equal(accepted.length, 2, "Concurrent reservations must not exceed $20");
  assert(attempts.filter(result => result.status === "rejected").every(result => (result as PromiseRejectedResult).reason.code === "NUXA_CHAT_MONTHLY_BUDGET_EXCEEDED"));
  assert.equal((await store.status()).reservedUpperBoundUsd, 16);
  const usage = { prompt_tokens: 100, completion_tokens: 100, total_tokens: 200 };
  await Promise.all([store.settle(accepted[0], usage, "default"), store.settle(accepted[0], usage, "default")]);
  assert.equal((await store.status()).inputTokens, 100, "Settlement is idempotent, including concurrency");
  await store.settle(accepted[1], undefined);
  const restored = new ChatBudgetLedger(pool, schema, () => month);
  assert.equal((await restored.status()).reservedUpperBoundUsd, 8, "Unknown charge survives process/store restart");
  assert.equal((await restored.status()).uncertainRequests, 1);

  month = "2099-11";
  assert.equal((await restored.status()).availableUsd, 20, "New calendar month gets a separate budget");
  const full = await restored.reserve({ ...quote, maximumNanoUsd: 20_000_000_000 });
  let providerCalls = 0;
  const fakeClient = { chat: { completions: { create: async (request: any) => {
    providerCalls++;
    assert.equal(request.service_tier, "default");
    return { model: quote.model, usage, service_tier: "default", choices: [{ message: { content: '{"response":"Synthetic answer"}' } }] };
  } } } } as any;
  const request = { model: quote.model, messages, max_completion_tokens: 500, response_format: { type: "json_object" as const } };
  await assert.rejects(budgetedChatCompletion(request, fakeClient, restored), { code: "NUXA_CHAT_MONTHLY_BUDGET_EXCEEDED" });
  assert.equal(providerCalls, 0);
  await restored.settle(full, usage, "default");
  await budgetedChatCompletion(request, fakeClient, restored);
  assert.equal(providerCalls, 1);
  assert.equal((await restored.status()).inputTokens, 200);
  assert.equal((await restored.status()).outputTokens, 200);
  assert.equal((await restored.status()).reservedUpperBoundUsd, 0);

  month = "2099-12";
  const failingClient = { chat: { completions: { create: async () => { throw new Error("Synthetic transport failure after submission"); } } } } as any;
  await assert.rejects(budgetedChatCompletion(request, failingClient, restored));
  assert.equal((await restored.status()).reservedUpperBoundUsd, quote.maximumNanoUsd / 1e9, "Timeout does not erase a potentially billed request");
  const overBound = await restored.reserve(quote);
  await restored.settle(overBound, { prompt_tokens: quote.inputTokenBound + 1, completion_tokens: 1 }, "default");
  assert.equal((await restored.status()).blockedForAccountingReview, true);
  await assert.rejects(restored.reserve(quote));
  console.log("PASS: $20 Replit calendar-month cap, atomic PostgreSQL reservations under 12 concurrent calls, durable/restart-safe uncertain costs, idempotent settlement, monthly rollover, both token counters, provider blocked before call, no unpriced models, input/output limits, standard tier, failed-call retention and accounting-breach stop. Only synthetic provider calls; no paid AI requests or user data.");
} finally {
  if (created) await pool.query(`DROP SCHEMA "${schema}" CASCADE`);
  await pool.end();
}
