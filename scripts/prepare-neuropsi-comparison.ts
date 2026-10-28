import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs/promises";

// Intentionally NO handler, provider, database or network import.
// This prepares an experiment; it cannot run one or spend AI credit.
assert.equal(process.argv.slice(2).length, 0,
  "Offline preparation only; this command does not accept --live or run AI.");
const manifest = JSON.parse(await fs.readFile("docs/evaluations/neuropsi-reserved-manifest.json", "utf8"));
const raw = await fs.readFile(manifest.file, "utf8");
const hash = (text: string) => createHash("sha256").update(text).digest("hex");
assert.equal(hash(raw), manifest.sha256, "Reserved cases changed; do not silently reuse the old evaluation designation.");
const cases = JSON.parse(raw);
assert.equal(cases.length, manifest.caseCount);
assert.equal(new Set(cases.map((item: any) => item.id)).size, cases.length);
for (const item of cases) {
  assert(["es", "en", "fr"].includes(item.language));
  assert(["classic", "brief", "bubbles"].includes(item.mode));
  assert(Array.isArray(item.history) && item.history.every((turn: any) =>
    typeof turn.isUser === "boolean" && typeof turn.content === "string"));
  assert(typeof item.question === "string" && item.question.trim());
  assert(item.criteria.length >= 3 && item.criteria.every((criterion: unknown) => typeof criterion === "string"));
}
const paths = [
  "server/prompt-handler.ts", "server/chat-working-context.ts", "server/chat-cost-policy.ts",
  "server/chat-grounding.ts", "server/chat-conversation-strategy.ts", "server/chat-policy.ts",
  "server/chat-evidence.ts", "server/chat-ai-client.ts", "server/chat-completion-router.ts",
  "server/chat-history-security.ts", "server/routes.ts", "server/storage.ts", "shared/schema.ts",
];
// Include the actual editorial corpus and retrieval modules, not merely a label.
const knowledgePaths = (await fs.readdir("server/knowledge"))
  .filter(name => name.endsWith(".ts")).sort().map(name => `server/knowledge/${name}`);
const versions = Object.fromEntries(await Promise.all([...paths, ...knowledgePaths].map(async file =>
  [file, hash(await fs.readFile(file, "utf8"))],
)));
console.log(JSON.stringify({
  status: "prepared-not-executed",
  paidCalls: 0,
  reservedSuiteSha256: manifest.sha256,
  sourceHashes: versions,
  comparison: {
    control: "Same model/provider, common identity/safety and presentation; no NEUROPSI strategy, retrieval or review.",
    neuropsi: "Real handler including its context policy, scientific retrieval and review.",
    guardrails: "Both arms retain urgent-help safeguards. No evaluation bypass is added to the product.",
    nextGate: "Fix version, effective model/provider, repetitions, paired order, budget and independent reviewers before paid execution.",
  },
  reviewTemplate: cases.map((item: any) => ({
    id: item.id, language: item.language, mode: item.mode,
    criteria: item.criteria,
    A: { response: null, reviewer1: null, reviewer2: null },
    B: { response: null, reviewer1: null, reviewer2: null },
    severeSafetyFailure: null, resolvedDisagreement: null,
    tokensAllCalls: null, latencyMsAllCalls: null, cost: null,
  })),
  conclusion: "No responses, scores, superiority or clinical benefit have been measured.",
}, null, 2));
