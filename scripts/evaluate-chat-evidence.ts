import fs from "node:fs/promises";
import { performance } from "node:perf_hooks";
import { processUserMessage } from "../server/prompt-handler";
import { scientificEvidenceEngine } from "../server/knowledge/scientific-engine";
import { pilotSources } from "../server/knowledge/pilot-sources";
import { evidenceCases, scientificEvidenceCases } from "./fixtures/chat-evidence-cases";

// Explicit opt-in: never call a paid provider as a side effect of running tests.
if (!process.argv.includes("--live")) {
  console.log("Use --live for 30 synthetic real-provider evaluations, or --live --scientific for 5 scientific-engine cases. Optional --limit=N. Paid API; no accounts or stored conversations.");
  process.exit(0);
}
const scientific = process.argv.includes("--scientific");
const cases = scientific ? scientificEvidenceCases : evidenceCases;
const limitOption = process.argv.find(argument => argument.startsWith("--limit="));
const limit = limitOption ? Number(limitOption.slice("--limit=".length)) : cases.length;
if (!Number.isInteger(limit) || limit < 1 || limit > cases.length) {
  console.error(`--limit must be an integer between 1 and ${cases.length}`);
  process.exit(1);
}
const directory = ".local/evaluations";
await fs.mkdir(directory, { recursive: true });
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const label = scientific ? "scientific-engine" : "chat-evidence";
const file = `${directory}/${label}-${stamp}.json`;
const progressFile = `${directory}/${label}-${stamp}.jsonl`;
const results: Record<string, unknown>[] = [];
let providerFailures = 0;
const failureLimit = scientific ? 1 : 3;
for (let index = 0; index < limit; index++) {
  const item = cases[index];
  const mode = ["classic", "bubbles", "brief"][index % 3];
  const retrieval = scientificEvidenceEngine.retrieve(item.question, item.history, item.profile);
  const retrieved = retrieval.sources;
  const started = performance.now();
  const answer = await processUserMessage(item.question, (item.history ?? []) as any, item.profile, item.language, mode);
  const urls = [...answer.content.matchAll(/\]\((https:\/\/[^\s)]+)\)/g)].map(match => match[1]);
  const allowed = new Set(retrieved.map(source => source.url));
  const flags: string[] = [];
  if (/problema técnico|technical problem|problème technique|problema tècnic/.test(answer.content)) {
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
    conceptualAnalysis: retrieval.analysis, documentaryCoverage: retrieval.coverage,
    uncoveredConcepts: retrieval.uncoveredConcepts,
    supportType: answer.supportType, citedUrls: urls,
    latencyMs: Math.round(performance.now() - started), automaticFlags: flags,
    humanReview: "pending: source entailment, helpfulness, language, non-clinical boundaries and safety",
  };
  results.push(result);
  await fs.appendFile(progressFile, `${JSON.stringify(result)}\n`);
  console.log(`EVALUATED ${index + 1}/${limit} ${mode}/${item.language}: ${flags.length ? flags.join(", ") : "no structural flags"} (${result.latencyMs}ms)`);
  // A small connectivity smoke test stops at its first failure. The full
  // evaluation preserves its existing three-failure circuit breaker.
  if (providerFailures >= failureLimit) {
    console.log(`STOPPED: ${providerFailures} provider failure(s); no successful quality evaluation can be claimed.`);
    break;
  }
}
await fs.writeFile(file, JSON.stringify({
  evaluatedAt: new Date().toISOString(), sourceVerificationDates: [...new Set(pilotSources.map(source => source.verifiedAt))],
  querySet: label, requestedCases: limit, completedCases: results.length, providerFailures,
  limitations: ["Synthetic cases only", "No clinical certification", "No human expert review yet", "No before/after model comparison", "Automatic checks cannot establish that a cited source supports every claim", "No patient accounts or real histories accessed"],
  results,
}, null, 2));
console.log(`EVALUATION_SAVED ${file}`);
