import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { pool } from "../server/db";
import { ChatCreditAlerts, creditAlertReason } from "../server/chat-credit-alerts";
import { ChatBudgetLedger } from "../server/chat-budget-ledger";
import { routedChatCompletion } from "../server/chat-completion-router";
import { chatUnavailableNotice } from "../shared/chat-service";

const schema = `credit_alert_test_${randomUUID().replaceAll("-", "").slice(0, 16)}`;
let created = false;
let deliveries = 0;
try {
  await pool.query(`CREATE SCHEMA "${schema}"`); created = true;
  const sender = async () => { deliveries++; };
  const alerts = new ChatCreditAlerts(pool, sender, schema);
  await Promise.all(Array.from({ length: 24 }, () => alerts.notify("openai", "billing")));
  assert.equal(deliveries, 1, "Concurrent instances must send only one incident email");
  const restarted = new ChatCreditAlerts(pool, sender, schema);
  await restarted.notify("openai", "billing");
  assert.equal(deliveries, 1, "Deduplication survives restart");
  await restarted.recovered("openai");
  await restarted.notify("openai", "budget");
  assert.equal(deliveries, 2, "New outage after recovery must alert again");
  await restarted.notify("replit", "billing");
  assert.equal(deliveries, 3, "Each provider has its own incident");

  await alerts.recovered("replit");
  let uncertainAttempts = 0;
  const uncertain = new ChatCreditAlerts(pool, async () => { uncertainAttempts++; throw Error("Synthetic lost receipt"); }, schema);
  assert.equal(await uncertain.notify("replit", "billing"), "uncertain");
  await uncertain.notify("replit", "billing");
  assert.equal(uncertainAttempts, 1, "Do not duplicate possibly delivered email");

  await alerts.recovered("replit");
  let rejectedAttempts = 0;
  const rejected = new ChatCreditAlerts(pool, async () => {
    rejectedAttempts++;
    if (rejectedAttempts === 1) throw Object.assign(Error("Synthetic rejection"), { code: 429 });
  }, schema);
  assert.equal(await rejected.notify("replit", "billing"), "failed");
  await rejected.notify("replit", "billing");
  assert.equal(rejectedAttempts, 1, "Safe retry has a cooldown");
  await pool.query(`UPDATE "${schema}".nuxa_chat_credit_alerts SET retry_after=NOW()-INTERVAL '1 second' WHERE provider='replit'`);
  assert.equal(await rejected.notify("replit", "billing"), "accepted");
  assert.equal(rejectedAttempts, 2);

  const billing = Object.assign(Error("Synthetic billing rejection"), { status: 429, code: "insufficient_quota" });
  assert.equal(creditAlertReason(billing, "openai"), "billing");
  assert.equal(creditAlertReason({ status: 402 }, "replit"), "billing");
  assert.equal(creditAlertReason({ code: "NUXA_CHAT_MONTHLY_BUDGET_EXCEEDED" }, "openai"), "budget");
  for (const failure of [{ status: 429 }, { status: 500 }, { code: "ETIMEDOUT" }, { code: "NUXA_CHAT_AI_NOT_CONFIGURED" }]) {
    assert.equal(creditAlertReason(failure, "openai"), null);
  }
  const notices: string[] = [];
  const recoveries: string[] = [];
  const stores = {
    openai: new ChatBudgetLedger(pool, schema, () => "2098-01", "openai"),
    replit: new ChatBudgetLedger(pool, schema, () => "2098-01", "replit"),
  };
  await routedChatCompletion({
    model: "gpt-5.5-2026-04-23", messages: [{ role: "user", content: "Synthetic question" }], max_completion_tokens: 500,
  }, {
    env: { NUXA_CHAT_AI_PROVIDER: "dual" },
    ledgerForProvider: async provider => stores[provider],
    clientForProvider: provider => ({
      chat: { completions: { create: async () => {
        if (provider === "openai") throw billing;
        return { model: "gpt-5.5-2026-04-23", service_tier: "default", usage: { prompt_tokens: 10, completion_tokens: 10 },
          choices: [{ message: { content: '{"response":"Synthetic"}' } }] };
      } } },
    }) as any,
    creditAlerts: { notify: async (provider, reason) => { notices.push(`${provider}:${reason}`); }, recovered: async provider => { recoveries.push(provider); } },
  });
  assert.deepEqual(notices, ["openai:billing"]);
  assert.deepEqual(recoveries, ["replit"]);
  assert(!/\b(días|fecha|days|date)\b/.test(chatUnavailableNotice("es")));
  console.log("PASS: per-provider alerts, 24 concurrent deduplication, restart persistence, recovery/new incident, uncertain-delivery protection, safe retries, no false credit alerts, actual router hook and generic notice. Fake email/AI only.");
} finally {
  if (created) await pool.query(`DROP SCHEMA "${schema}" CASCADE`);
  await pool.end();
}
