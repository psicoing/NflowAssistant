import assert from "node:assert/strict";
import { certaintyCases, type ClaimStatus } from "./fixtures/chat-certainty-cases";
import { boundedChatHistory } from "../server/chat-cost-policy";

assert.equal(certaintyCases.length, 6);
assert.equal(new Set(certaintyCases.map(item => item.id)).size, 6);
const categories = new Set<ClaimStatus>();
for (const item of certaintyCases) {
  assert(item.criteria.length >= 3);
  assert(item.expectedClaims.length >= 2);
  for (const claim of item.expectedClaims) {
    assert(claim.claim && claim.rationale);
    categories.add(claim.status);
  }
  assert.deepEqual(boundedChatHistory(item.history, item.question),
    item.history.map(turn => ({ role: turn.isUser ? "user" : "assistant", content: turn.content })));
}
assert.deepEqual([...categories].sort(), ["possibility", "supported-hypothesis", "unknown", "user-reported"].sort());
assert(certaintyCases.some(item => item.priority === "safety"));
assert.deepEqual([...new Set(certaintyCases.map(item => item.language))].sort(), ["en", "es", "fr"]);
console.log("PASS: six synthetic certainty scenarios, four review categories, ES/EN/FR and urgent-safety coverage. Fixture consistency only, NOT model quality or a deployed classifier. No external calls.");
