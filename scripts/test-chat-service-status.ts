import assert from "node:assert/strict";
import { getChatServiceStatus } from "../server/chat-service-status";
import { chatUnavailableNotice } from "../shared/chat-service";
import { countDeliveredChatQuestion } from "../server/chat-question-quota";

const env = {
  NUXA_CHAT_AI_PROVIDER: "dual", OPENAI_API_KEY: "synthetic-key",
  AI_INTEGRATIONS_OPENAI_API_KEY: "synthetic-managed-key",
  AI_INTEGRATIONS_OPENAI_BASE_URL: "https://example.invalid/v1",
};
const record = (lastOutcome: string | null, availableUsd = 10, blockedForAccountingReview = false) =>
  ({ lastOutcome, availableUsd, blockedForAccountingReview });
const status = (openai: ReturnType<typeof record>, replit: ReturnType<typeof record>, config = env) =>
  getChatServiceStatus(config, async provider => provider === "openai" ? openai : replit);

assert.equal((await status(record("settled"), record("settled"))).state, "available");
assert.equal((await status(record(null), record(null))).state, "unknown");
assert.equal((await status(record("rejected_unbilled"), record("settled"))).state, "limited");
assert.equal((await status(record("rejected_unbilled"), record(null), { ...env, AI_INTEGRATIONS_OPENAI_API_KEY: "" })).state, "unavailable");
assert.equal((await status(record("settled", 0), record("settled", 0))).state, "unavailable");
assert.equal((await status(record("settled", 10, true), record("settled"))).state, "unavailable");
assert.equal((await status(record("uncertain"), record(null))).state, "unknown");
assert.equal((await status(record("settled"), record("settled"), { ...env, OPENAI_API_KEY: "" })).state, "unavailable");
assert.equal((await status(record("settled"), record("settled"), { ...env, NUXA_CHAT_AI_PROVIDER: "replit", OPENAI_API_KEY: "" })).state, "available");
assert.equal((await getChatServiceStatus(env, async () => { throw Error("synthetic database outage"); })).state, "unavailable");
assert.equal((await status(record("settled"), record("settled"), { ...env, OPENAI_CHAT_MODEL: "unpriced-synthetic-model" } as typeof env)).state, "unavailable");
for (const language of ["es", "en", "fr", "de", "it", "pt", "ca", "eu", "gl"]) {
  assert.ok(chatUnavailableNotice(language).length > 120);
}
let increments = 0;
const remaining = await countDeliveredChatQuestion({ countsTowardQuestionQuota: false }, { remaining: 4 }, async () => { increments++; return 4; });
assert.equal(increments, 0);
assert.equal(remaining, 5);
console.log("PASS: outage/partial/unknown/recovery, missing keys, billing, budgets, accounting, provider modes, nine-language notice and free-question preservation. No real AI or notifications.");
