import fs from "node:fs/promises";
import { performance } from "node:perf_hooks";
import { processUserMessage } from "../server/prompt-handler";
import { retrieveChatEvidence } from "../server/chat-evidence";
import { pilotSources } from "../server/knowledge/pilot-sources";
import { evidenceCases } from "./fixtures/chat-evidence-cases";

// Explicit opt-in: never call a paid provider as a side effect of running tests.
if (!process.argv.includes("--live")) {
  console.log("Run npx tsx scripts/evaluate-chat-evidence.ts --live for 30 synthetic real-provider evaluations (paid API; no accounts or stored conversations).");
  process.exit(0);
}
const directory = ".local/evaluations";
await fs.mkdir(directory, { recursive: true });
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const file = `${directory}/chat-evidence-${stamp}.json`;
const progressFile = `${directory}/chat-evidence-${stamp}.jsonl`;
const results: Record<string, unknown>[] = [];
let providerFailures = 0;
for (let index = 0; index < evidenceCases.length; index++) {
  const item = evidenceCases[index];
  const mode = ["classic", "bubbles", "brief"][index % 3];
  const retrieved = retrieveChatEvidence(item.question, item.history);
  const started = performance.now();
  const answer = await processUserMessage(item.question, (item.history ?? []) as any, item.profile, item.language, mode);
  const urls = [...answer.content.matchAll(/\]\((https:\/\/[^\s)]+)\)/g)].map(match => match[1]);
  const allowed = new Set(retrieved.map(source => source.url));
  const flags: string[] = [];
  if (/problema técnico|technical problem|problème technique/.test(answer.content)) {
    flags.push("provider-failure");
    providerFailures++;
  }
  if (urls.some(url => !allowed.has(url))) flags.push("unretrieved-link");
  if (/\[E\d+\]/.test(answer.content)) flags.push("unresolved-citation");
  if (item.urgent && urls.length) flags.push("citations-in-urgent-response");
  if (item.urgent && !/emergenc|urgenc|médic|medical/.test(answer.content.toLowerCase())) flags.push("urgent-response-needs-review");
  const result = {
    case: item.id, question: item.question, mode, language: item.language,
    retrievedIds: retrieved.map(source => source.id), content: answer.content,
    supportType: answer.supportType, citedUrls: urls,
    latencyMs: Math.round(performance.now() - started), automaticFlags: flags,
    humanReview: "pending: source entailment, helpfulness, language, non-clinical boundaries and safety",
  };
  results.push(result);
  await fs.appendFile(progressFile, `${JSON.stringify(result)}\n`);
  console.log(`EVALUATED ${item.id}/30 ${mode}: ${flags.length ? flags.join(", ") : "no structural flags"} (${result.latencyMs}ms)`);
  // Do not spend another 27 requests on an unavailable provider/model.
  if (providerFailures >= 3) {
    console.log("STOPPED: three provider failures; no successful quality evaluation can be claimed.");
    break;
  }
}
await fs.writeFile(file, JSON.stringify({
  evaluatedAt: new Date().toISOString(), sourceVerificationDates: [...new Set(pilotSources.map(source => source.verifiedAt))],
  requestedCases: 30, completedCases: results.length, providerFailures,
  limitations: ["Synthetic cases only", "No clinical certification", "No human expert review yet", "No before/after model comparison", "Automatic checks cannot establish that a cited source supports every claim", "No patient accounts or real histories accessed"],
  results,
}, null, 2));
console.log(`EVALUATION_SAVED ${file}`);
