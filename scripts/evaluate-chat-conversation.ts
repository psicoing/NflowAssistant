import fs from "node:fs/promises";
import { performance } from "node:perf_hooks";
import { processUserMessage, buildChatPrompt } from "../server/prompt-handler";
import { chatAiReadiness } from "../server/chat-ai-client";
import { boundedChatHistory, quoteChatRequest } from "../server/chat-cost-policy";
import { needsUrgentConversationSupport } from "../server/chat-evidence";
import type { Message } from "../shared/schema";
import { conversationCases } from "./fixtures/chat-conversation-cases";
import { certaintyCases } from "./fixtures/chat-certainty-cases";

// Default is an offline inventory and conservative cost preview, not generation.
// --live uses the real production handler/router and its unchanged budget limits.
const live = process.argv.includes("--live");
const suite = process.argv.includes("--certainty") ? "certainty" : "continuity";
const cases = suite === "certainty" ? certaintyCases : conversationCases;
const limitArg = process.argv.find(arg => arg.startsWith("--limit="));
const limit = limitArg ? Number(limitArg.slice(8)) : 4;
const labelArg = process.argv.find(arg => arg.startsWith("--label="));
const label = labelArg?.slice(8) ?? "baseline";
if (!Number.isInteger(limit) || limit < 1 || limit > cases.length || !/^[a-z0-9-]{1,32}$/.test(label)) {
  throw new Error(`Use --limit=1..${cases.length} and an alphanumeric --label.`);
}
const readiness = chatAiReadiness();
if (live && (readiness.provider !== "replit" || !readiness.configured)) {
  throw new Error("Live evaluation requires the existing configured Replit chat; no provider switch is allowed.");
}
const selected = cases.slice(0, limit);
let conservativeMaximumUsd = 0;
for (const [index, item] of selected.entries()) {
  const mode = ["classic", "bubbles", "brief"][index % 3];
  const history = boundedChatHistory(item.history, item.question);
  const promptHistory = history.map(message => ({ content: message.content, isUser: message.role === "user" })) as Message[];
  const urgent = needsUrgentConversationSupport(item.question, item.history as Message[]);
  const prompt = buildChatPrompt(item.question, promptHistory, {}, item.language, mode, urgent,
    history.length < item.history.length);
  conservativeMaximumUsd += quoteChatRequest(readiness.model, [
    { role: "system", content: prompt }, ...history, { role: "user", content: item.question },
  ], mode === "brief" ? (urgent ? 1000 : 500) : 4000).maximumNanoUsd / 1e9;
}
console.log(JSON.stringify({
  live, suite, configuredProvider: readiness.provider, model: readiness.model,
  totalCases: cases.length, requestedCases: selected.map(item => item.id),
  conservativeMaximumUsd: Number(conservativeMaximumUsd.toFixed(4)),
  review: "Human qualitative review required. No automatic claim of clinical quality or superiority.",
}, null, 2));
if (!live) {
  console.log(`No AI calls. Use${suite === "certainty" ? " --certainty" : ""} --live --limit=4 --label=baseline to run the small initial sample.`);
  process.exit(0);
}
// Separate from the global allowance: never let a single evaluation exceed this
// conservative local ceiling, even if the monthly ledger has enough credit.
if (conservativeMaximumUsd > 3) throw new Error("Evaluation exceeds the $3 conservative ceiling; lower --limit.");
const directory = ".local/evaluations";
await fs.mkdir(directory, { recursive: true });
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const file = `${directory}/conversation-${suite}-${label}-${stamp}.json`;
const results: Record<string, unknown>[] = [];
let providerFailures = 0;
for (const [index, item] of selected.entries()) {
  const mode = ["classic", "bubbles", "brief"][index % 3];
  const start = performance.now();
  const response = await processUserMessage(item.question, item.history as Message[], {}, item.language, mode);
  const generated = response.responseKind === "ai";
  results.push({
    id: item.id, priority: item.priority, language: item.language, mode,
    history: item.history, question: item.question, content: response.content,
    responseKind: response.responseKind, latencyMs: Math.round(performance.now() - start),
    criteria: item.criteria, humanReview: generated ? "pending" : "not-evaluable",
    ...("expectedClaims" in item ? { expectedClaims: item.expectedClaims } : {}),
  });
  await fs.writeFile(file, JSON.stringify({
    evaluatedAt: new Date().toISOString(), suite, label, model: readiness.model, provider: readiness.provider,
    conservativeMaximumUsd, requestedCases: limit, completedCases: results.length,
    results, limitations: [
      "Synthetic cases; no real accounts or stored conversations.",
      "Human review required; a successful AI request does not mean criteria passed.",
      "No clinical validation or same-model control comparison.",
      "All calls use the existing router and monthly budget accounting.",
    ],
  }, null, 2));
  console.log(`${item.id}: ${generated ? "AI response; review pending" : "automatic response; stop"} (${results.at(-1)!.latencyMs}ms)`);
  if (!generated) {
    providerFailures++;
    break;
  }
}
console.log(`Report: ${file}`);
process.exit(providerFailures ? 2 : 0);
