import assert from "node:assert/strict";
import { analyseScientificQuery } from "../server/knowledge/scientific-query";
import { ScientificKnowledgeIndex, adaptPilotDocuments, canRetrieveDocument } from "../server/knowledge/scientific-index";
import { ScientificEvidenceEngine, scientificAnalysisInstructions } from "../server/knowledge/scientific-engine";
import { proposedJournals, bibliographicConnectors } from "../server/knowledge/scientific-catalogue";
import { scientificDomains, type ScientificDocument } from "../server/knowledge/scientific-types";
import { build } from "esbuild";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

const corpus = adaptPilotDocuments();
const index = new ScientificKnowledgeIndex(corpus);
let clock = 0;
const engine = new ScientificEvidenceEngine(index, 100, 4, () => clock);
assert.equal(index.documents.length, 16);
assert.equal(scientificDomains.length, 15);
assert.equal(proposedJournals.length, 17);
assert(proposedJournals.every(journal => journal.status === "catalogue-only" && journal.indexedDocuments === 0 && journal.url === null));
for (const connector of bibliographicConnectors) {
  const result = await connector.searchConcepts(["attention"]);
  assert.equal(result.status, "not-configured");
  assert.equal(result.records.length, 0);
}

const equivalent = [
  "No puedo dejar de pensar por la noche y tengo ansiedad.",
  "I cannot stop thinking at night and have anxiety.",
  "Je ne peux pas arrêter de penser la nuit et j'ai de l'anxiété.",
  "No puc deixar de pensar a la nit i tinc ansietat.",
];
for (const text of equivalent) {
  const query = analyseScientificQuery(text);
  for (const concept of ["rumination", "sleep", "anxiety"]) assert(query.concepts.includes(concept), `${concept}: ${text}`);
  const answer = engine.retrieve(text);
  assert(answer.sources.length > 0 && answer.sources.length <= 3);
  assert(answer.sources.some(source => source.primaryConcepts.includes("sleep")));
  assert(scientificAnalysisInstructions(answer).includes("no conclusiones sobre la persona"));
}
const child = engine.retrieve("My 8-year-old cannot concentrate at school. Is it ADHD?");
assert.equal(child.analysis.population, "children-adolescents");
assert(child.analysis.concepts.includes("attention"));
assert(child.analysis.concepts.includes("adhd"));
assert(child.analysis.alternatives.length >= 4);
assert(child.uncoveredConcepts.includes("adhd"));
assert(!child.sources.some(source => source.population === "adults"));
assert(scientificAnalysisInstructions(child).includes("sin atribuir trastornos"));
assert.equal(analyseScientificQuery("My son likes football").intent, "conversation");
assert(!analyseScientificQuery("Mi hijo sufre acoso en la escuela").concepts.includes("work-stress"));
assert(!engine.retrieve("Mi hijo sufre acoso en la escuela").sources.some(source => source.topics.length === 1 && source.topics[0] === "work-stress"));

const treatment = "¿Qué tratamiento existe para la ansiedad?";
const adult = engine.retrieve(treatment, [], { age: "18-25" });
const minor = engine.retrieve(treatment, [], { age: "13-17" });
assert(adult.sources.some(source => source.id === "E08"));
assert(!minor.sources.some(source => source.id === "E08"));
assert(!minor.cacheHit, "Age group must partition the cache");
assert(engine.retrieve(treatment, [], { age: "13-17" }).cacheHit);
assert.equal(engine.retrieve("Hola, gracias por escucharme").sources.length, 0);
assert.equal(engine.retrieve("Explícame neurodesarrollo y autismo").coverage, "none");
assert.equal(engine.retrieve("¿Y las fuentes?", [{ content: "Tengo ansiedad", isUser: true }]).analysis.followUp, true);
assert.equal(engine.retrieve("Ara parlem del dol", [{ content: "Tinc ansietat", isUser: true }]).analysis.followUp, false);
for (const danger of ["No vull viure", "No puc respirar i tinc dolor al pit", "Mi pareja me amenaza con matarme", "I took an overdose", "Je veux me tuer"]) {
  const result = engine.retrieve(danger);
  assert.equal(result.analysis.intent, "urgent");
  assert.equal(result.sources.length, 0);
}
assert.equal(engine.retrieve("¿Y ahora?", [{ content: "No quiero vivir", isUser: true }]).analysis.intent, "urgent");

const ids = (documents: ScientificDocument[]) => documents.map(source => source.id);
const cachedFirst = engine.retrieve("Tengo ansiedad", [], { age: "18-25" });
assert.deepEqual(ids(cachedFirst.sources), ids(engine.retrieve("Siento ansiedad", [], { age: "18-25" }).sources));
assert(engine.retrieve("Siento ansiedad", [], { age: "18-25" }).cacheHit);
clock = 101;
assert(!engine.retrieve("Siento ansiedad", [], { age: "18-25" }).cacheHit, "TTL expiration");
assert(engine.stats().cacheEntries <= 4);
assert.equal(engine.stats().networkRequests, 0);
assert(!JSON.stringify(engine.stats()).includes("Tengo ansiedad"));
assert.throws(() => new ScientificEvidenceEngine(index, 0));
assert.throws(() => new ScientificKnowledgeIndex([corpus[0], corpus[0]]));
assert.throws(() => new ScientificKnowledgeIndex([{ ...corpus[0], doi: "not-a-doi" }]));
for (const changed of [
  { disabled: true }, { obsolete: true }, { accessStatus: "restricted" },
  { accessStatus: "unconfirmed" }, { contentRights: "metadata-only" },
  { contentRights: "unconfirmed" }, { methodologicalQuality: 1, appraisalNote: null },
] as Partial<ScientificDocument>[]) assert(!canRetrieveDocument({ ...corpus[0], ...changed }));

// Same relevance: evidence hierarchy outranks theoretical material.
const empirical: ScientificDocument = { ...corpus[0], id: "E80", evidenceLevel: "systematic-review", year: 2020 };
const theoretical: ScientificDocument = { ...empirical, id: "E81", evidenceLevel: "theoretical-literature", year: 2026 };
const ranking = new ScientificKnowledgeIndex([theoretical, empirical]).rank(analyseScientificQuery("ansiedad"));
assert.equal(ranking[0].source.id, "E80");
assert(ranking[0].reasons.includes("calidad metodológica no evaluada"));
const disabledIndex = new ScientificKnowledgeIndex(corpus.map(source => source.id === "E01" ? { ...source, disabled: true } : source));
assert.notEqual(disabledIndex.revision, index.revision);
assert(!new ScientificEvidenceEngine(disabledIndex).retrieve("ansiedad").sources.some(source => source.id === "E01"));
assert.throws(() => { (index.documents[0] as any).disabled = true; });

// Verify the actual prompt/provider boundary in four languages and three modes.
const requests: any[] = [];
(globalThis as any).__scientificEngineRequests = requests;
(globalThis as any).__scientificEngineFailure = false;
const dir = await fs.mkdtemp(path.join(os.tmpdir(), "nuxa-scientific-"));
try {
  const outfile = path.join(dir, "handler.mjs");
  await build({
    entryPoints: ["server/prompt-handler.ts"], outfile, bundle: true, platform: "node", format: "esm",
    plugins: [{
      name: "offline-scientific-provider",
      setup(builder) {
        builder.onResolve({ filter: /^openai$/ }, () => ({ path: "openai", namespace: "offline" }));
        builder.onLoad({ filter: /.*/, namespace: "offline" }, () => ({
          contents: `export default class OpenAI { chat = { completions: { create: async request => {
            globalThis.__scientificEngineRequests.push(request);
            if (globalThis.__scientificEngineFailure) throw new Error("Offline failure");
            return {choices:[{message:{content:JSON.stringify({response:"Synthetic scientific-engine fixture"})}}]};
          }}}; }`, loader: "js",
        }));
      },
    }],
  });
  const { buildChatPrompt, processUserMessage } = await import(pathToFileURL(outfile).href);
  for (const [position, language] of ["es", "en", "fr", "ca"].entries()) {
    let prefix: string | undefined;
    for (const mode of ["classic", "bubbles", "brief"]) {
      const prompt = buildChatPrompt(equivalent[position], [], { age: "13-17" }, language, mode);
      const common = prompt.split("\n\nFORMATO DE PRESENTACIÓN:\n")[0];
      if (prefix) assert.equal(prefix, common);
      prefix = common;
      assert(common.includes("rumination") && common.includes("sleep"));
      assert(common.includes("children-adolescents"));
      assert(!common.includes('"id":"E08"'));
      assert(common.length < 10_000, "Bounded scientific context");
      assert(!/NEUROPSI-AI|grupo diagnóstico más probable"\s*:/.test(prompt));
      await processUserMessage(equivalent[position], [], { age: "13-17" }, language, mode);
      assert.equal(requests.at(-1).messages[0].content, prompt);
    }
  }
  (globalThis as any).__scientificEngineFailure = true;
  const crisisFollowUp = await processUserMessage("¿Y ahora?", [{ content: "No quiero vivir", isUser: true }], undefined, "es", "brief");
  assert.equal(crisisFollowUp.supportType, "crisis");
  assert(crisisFollowUp.content.includes("No esperes"));
  assert.equal(requests.at(-1).max_completion_tokens, 1000);
} finally {
  delete (globalThis as any).__scientificEngineRequests;
  delete (globalThis as any).__scientificEngineFailure;
  await fs.rm(dir, { recursive: true, force: true });
}
console.log("PASS: concepts in ES/EN/FR/CA, 15 domains, population filtering, alternative explanations, relevance/evidence ranking, unknown quality, rights/obsolete/disabled filters, cache TTL/bounds/revision/privacy, 17 catalogue-only journals, unconfigured connectors, urgent priority and actual provider boundary across 3 modes. No live AI or external database calls.");
