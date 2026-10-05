import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { pool } from "../server/db";
import { ChatBudgetLedger } from "../server/chat-budget-ledger";
import { routedChatCompletion } from "../server/chat-completion-router";
import { createChatAiClient, type ChatProvider } from "../server/chat-ai-client";
import { CHAT_COMBINED_BUDGET_USD, CHAT_PROVIDER_BUDGET_USD, quoteChatRequest } from "../server/chat-cost-policy";
import { isConfirmedOpenAiBillingRejection } from "../server/chat-billing-errors";

// Real SQL in an isolated, random schema. All SDK completions are synthetic.
const schema = `chat_dual_test_${randomUUID().replaceAll("-", "").slice(0, 16)}`;
let created = false;
let month = "2098-01";
const request = {
  model: "gpt-5.5-2026-04-23",
  messages: [{ role: "user" as const, content: "Synthetic wellbeing question" }],
  max_completion_tokens: 500,
  response_format: { type: "json_object" as const },
};
const quote = quoteChatRequest(request.model, request.messages, request.max_completion_tokens);
const usage = { prompt_tokens: 100, completion_tokens: 100, total_tokens: 200 };
const stores = {
  openai: new ChatBudgetLedger(pool, schema, () => month, "openai"),
  replit: new ChatBudgetLedger(pool, schema, () => month, "replit"),
};
const calls: ChatProvider[] = [];
const payloads: unknown[] = [];
let failure: unknown;
let returnedModel = request.model;
const env = { NUXA_CHAT_AI_PROVIDER: "dual" };
const billingFailure = Object.assign(new Error("Synthetic quota rejection"), { status: 429, code: "insufficient_quota" });
const clientForProvider = (provider: ChatProvider) => ({
  chat: { completions: { create: async (payload: unknown) => {
    calls.push(provider);
    payloads.push(payload);
    if (provider === "openai" && failure) throw failure;
    return { model: returnedModel, usage, service_tier: "default", choices: [{ message: { content: '{"response":"Synthetic answer"}' } }] };
  } } },
}) as any;
const dependencies = { env, clientForProvider, ledgerForProvider: async (provider: ChatProvider) => stores[provider] };
function reset(nextMonth: string, nextFailure?: unknown) {
  month = nextMonth;
  failure = nextFailure;
  calls.length = 0;
  payloads.length = 0;
  returnedModel = request.model;
}

try {
  assert.deepEqual(CHAT_PROVIDER_BUDGET_USD, { openai: 25, replit: 20 });
  assert.equal(CHAT_COMBINED_BUDGET_USD, 45);
  await pool.query(`CREATE SCHEMA "${schema}"`);
  created = true;
  await Promise.all(Object.values(stores).map(store => store.ensureTables()));
  const reservations = await Promise.all((["openai", "replit"] as const).map(async provider => {
    const results = await Promise.allSettled(Array.from({ length: 12 }, () =>
      stores[provider].reserve({ ...quote, maximumNanoUsd: 8_000_000_000 })));
    return results.filter(result => result.status === "fulfilled").length;
  }));
  assert.deepEqual(reservations, [3, 2], "Concurrent calls respect independent $25/$20 ceilings");
  assert.equal((await new ChatBudgetLedger(pool, schema, () => month, "openai").status()).reservedUpperBoundUsd, 24);
  assert.equal((await new ChatBudgetLedger(pool, schema, () => month, "replit").status()).reservedUpperBoundUsd, 16);

  reset("2098-02");
  await routedChatCompletion(request, dependencies);
  assert.deepEqual(calls, ["openai"], "Successful primary must not call or charge backup");
  assert.equal((await stores.replit.status()).requests, 0);
  assert.equal((await stores.openai.status()).inputTokens, 100);
  assert.equal((await stores.openai.status()).outputTokens, 100);

  reset("2098-03", billingFailure);
  await routedChatCompletion(request, dependencies);
  assert.deepEqual(calls, ["openai", "replit"]);
  assert.deepEqual(payloads[0], payloads[1], "Identical model, context, format and output cap on backup");
  assert.equal((await stores.openai.status()).reservedUpperBoundUsd, 0);
  assert.equal((await stores.openai.status()).accountedUpperBoundUsd, 0);
  assert.equal((await stores.replit.status()).inputTokens, 100);
  const rejected = await stores.openai.reserve(quote);
  await Promise.all([stores.openai.rejectUnbilled(rejected, billingFailure), stores.openai.rejectUnbilled(rejected, billingFailure)]);
  assert.equal((await stores.openai.status()).reservedUpperBoundUsd, 0, "Unbilled release is concurrent-safe and idempotent");
  await assert.rejects(stores.replit.rejectUnbilled(rejected, billingFailure));
  assert(isConfirmedOpenAiBillingRejection({ status: 429, code: "billing_not_active" }));
  assert(!isConfirmedOpenAiBillingRejection({ status: 429, code: "rate_limit_exceeded" }));

  for (const [index, error] of [
    Object.assign(new Error("Synthetic rate limit"), { status: 429, code: "rate_limit_exceeded" }),
    new Error("Synthetic timeout after submission"),
    Object.assign(new Error("Synthetic 500"), { status: 500, code: "insufficient_quota" }),
    Object.assign(new Error("Synthetic invalid key"), { status: 401, code: "invalid_api_key" }),
  ].entries()) {
    reset(`2098-0${index + 4}`, error);
    await assert.rejects(routedChatCompletion(request, dependencies));
    assert.deepEqual(calls, ["openai"], "Ambiguous failures cannot trigger a second charge");
    assert.equal((await stores.openai.status()).reservedUpperBoundUsd, quote.maximumNanoUsd / 1e9);
    assert.equal((await stores.replit.status()).requests, 0);
  }

  reset("2098-08");
  await stores.openai.reserve({ ...quote, maximumNanoUsd: 25_000_000_000 });
  await routedChatCompletion(request, dependencies);
  assert.deepEqual(calls, ["replit"], "Approved OpenAI budget exhaustion uses independently capped backup");
  assert.equal((await stores.openai.status()).reservedUpperBoundUsd, 25);
  calls.length = 0;
  await stores.replit.reserve({ ...quote, maximumNanoUsd: 19_990_000_000 });
  await assert.rejects(routedChatCompletion(request, dependencies), { code: "NUXA_CHAT_MONTHLY_BUDGET_EXCEEDED" });
  assert.equal(calls.length, 0, "No upstream request after both allowances cannot cover the quote");
  assert((await stores.replit.status()).accountedUpperBoundUsd + (await stores.replit.status()).reservedUpperBoundUsd <= 20);

  reset("2098-09", billingFailure);
  await assert.rejects(routedChatCompletion(request, {
    ...dependencies,
    clientForProvider: provider => provider === "openai" ? clientForProvider(provider) : createChatAiClient({}, "replit"),
  }), { code: "NUXA_CHAT_AI_NOT_CONFIGURED" });
  assert.deepEqual(calls, ["openai"], "Missing backup fails closed without another payer");
  assert.equal((await stores.replit.status()).requests, 0);
  calls.length = 0;
  await assert.rejects(routedChatCompletion({ ...request, model: "unpriced-model" }, dependencies), { code: "NUXA_CHAT_PRICING_UNVERIFIED" });
  assert.equal(calls.length, 0);

  reset("2098-10");
  await stores.openai.reserve(quote);
  await pool.query(`UPDATE "${schema}".chat_ai_openai_budget_months SET faulted=true WHERE month=$1`, [month]);
  await assert.rejects(routedChatCompletion(request, dependencies), { code: "NUXA_CHAT_ACCOUNTING_REVIEW_REQUIRED" });
  assert.equal(calls.length, 0, "Accounting fault stops both providers, not a budget-exhaustion fallback");
  reset("2098-11");
  assert.equal((await stores.openai.status()).availableUsd, 25);
  assert.equal((await stores.replit.status()).availableUsd, 20);
  await assert.rejects(routedChatCompletion(request, dependencies), { code: "NUXA_CHAT_ACCOUNTING_REVIEW_REQUIRED" });
  assert.equal(calls.length, 0, "Month rollover does not resolve a pricing/accounting fault");
  // Simulate an explicit review only inside this isolated synthetic schema.
  await pool.query(`UPDATE "${schema}".chat_ai_openai_budget_months SET faulted=false WHERE month=$1`, ["2098-10"]);
  await routedChatCompletion(request, { ...dependencies, env: { NUXA_CHAT_AI_PROVIDER: "replit" } });
  assert.deepEqual(calls, ["replit"], "Explicit managed-only mode must not charge personal OpenAI");
  reset("2098-12");
  returnedModel = "unverified-model-returned-by-provider";
  await assert.rejects(routedChatCompletion(request, dependencies), { code: "NUXA_CHAT_PRICING_UNVERIFIED" });
  assert.deepEqual(calls, ["openai"], "An unexpected returned model must not trigger paid backup");
  assert.equal((await stores.openai.status()).blockedForAccountingReview, true);
  assert.equal((await stores.openai.status()).reservedUpperBoundUsd, quote.maximumNanoUsd / 1e9);
  console.log("PASS: independent $25 OpenAI/$20 Replit caps, 24 concurrent reservations, restart persistence, UTC rollover, OpenAI first, sequential identical backup on explicit billing rejection or approved cap exhaustion, idempotent zero-charge rejection, no backup on generic 429/timeouts/500/401, retained uncertain charges, both-budget block, missing gateway, unpriced-model and accounting-fault block. Only synthetic AI, real isolated SQL, no paid calls or patient data.");
} finally {
  if (created) await pool.query(`DROP SCHEMA "${schema}" CASCADE`);
  await pool.end();
}
