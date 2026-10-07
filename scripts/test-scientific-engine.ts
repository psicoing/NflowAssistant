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
import { installOfflineManagedChatConfiguration, offlineChatBudgetPlugin } from "./fixtures/chat-provider-offline";
import { boundedChatHistory, CHAT_HISTORY_BYTES } from "../server/chat-cost-policy";

installOfflineManagedChatConfiguration();

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
    plugins: [offlineChatBudgetPlugin, {
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
      assert(common.includes("ESTRATEGIA CONVERSACIONAL"));
      for (const approach of ["ESCUCHAR:", "ACLARAR:", "ACTUAR:", "EXPLICAR:"]) {
        assert(common.includes(approach), `Active prompt includes ${approach} in ${language}/${mode}`);
      }
      assert(common.includes("Una respuesta completa puede terminar sin pregunta"));
      assert(common.includes("No inventes recuerdos de otras sesiones"));
      assert(!common.includes('"id":"E08"'));
      const strategyStart = common.indexOf("ESTRATEGIA CONVERSACIONAL");
      assert(common.slice(0, strategyStart).length < 10_000, "Existing scientific context remains bounded");
      assert(common.slice(strategyStart).length < 5_000, "Conversational strategy remains bounded");
      for (const priority of ["COMPRENSIÓN COMPARTIDA:", "CONTINUIDAD DEL TRABAJO:", "ADAPTACIÓN SEGÚN RESULTADOS:"]) {
        assert(common.includes(priority), `Active prompt includes ${priority} in ${language}/${mode}`);
      }
      assert(!/NEUROPSI-AI|grupo diagnóstico más probable"\s*:/.test(prompt));
      await processUserMessage(equivalent[position], [], { age: "13-17" }, language, mode);
      assert.equal(requests.at(-1).messages[0].content, prompt);
    }
  }
  const continuityHistory = [
    { content: "No es ansiedad por la reunión; me cuesta empezar el correo. Respirar no me ayuda.", isUser: true },
    { content: "Podrías escribir solo una frase del correo.", isUser: false },
    { content: "Lo intentaré.", isUser: true },
    { content: "Puedes empezar por el saludo.", isUser: false },
    { content: "Escribí el saludo; el temporizador me agobió.", isUser: true },
    { content: "Podemos conservar ese inicio sin temporizador.", isUser: false },
    { content: "Hoy no quiero más pasos, solo que me escuches.", isUser: true },
    { content: "Te escucho.", isUser: false },
  ];
  const snapshot = JSON.stringify(continuityHistory);
  const retained = boundedChatHistory(continuityHistory, "Sigo frustrado");
  assert.equal(retained.length, 8, "Earlier corrections/outcomes survive more than six short turns");
  assert.equal(JSON.stringify(continuityHistory), snapshot, "Stored dialogue is never mutated");
  assert.equal(boundedChatHistory([...continuityHistory, { content: "Sigo frustrado", isUser: true }], "Sigo frustrado").length, 8);
  const longHistory = Array.from({ length: 40 }, (_, i) => ({ content: `${i}: ` + "á".repeat(350), isUser: i % 2 === 0 }));
  const bounded = boundedChatHistory(longHistory);
  assert(bounded.length <= 32);
  assert(bounded.reduce((bytes, item) => bytes + Buffer.byteLength(item.content, "utf8"), 0) <= CHAT_HISTORY_BYTES);
  assert.equal(bounded.at(-1)?.content, longHistory.at(-1)?.content);
  for (const [message, language, mode] of [
    ["No me entendiste: lo difícil no es la reunión, sino empezar.", "es", "classic"],
    ["I accepted the suggestion, but I haven't tried it yet.", "en", "brief"],
    ["Ça ne m'a pas aidé. Je ne veux pas refaire cet exercice.", "fr", "bubbles"],
    ["Me ayudó escribir el saludo, pero el temporizador me agobió.", "es", "brief"],
    ["Ahora solo quiero que me escuches, no otro plan.", "es", "bubbles"],
    ["No sé si eso me ayudó.", "es", "classic"],
  ]) {
    await processUserMessage(message, continuityHistory, undefined, language, mode);
    const sent = requests.at(-1).messages;
    assert(sent[0].content.includes("COMPRENSIÓN COMPARTIDA:"));
    assert(sent[0].content.includes("Ante una corrección"));
    assert(sent[0].content.includes("NO demuestra que la persona la haya realizado"));
    assert(sent[0].content.includes("Si ayudó parcialmente"));
    assert(sent[0].content.includes("NO tres apartados visibles"));
    assert(sent.some((item: any) => item.content === continuityHistory[0].content));
    assert.equal(sent.at(-1).content, message);
    assert.equal(sent.filter((item: any) => item.content === message).length, 1);
  }
  // Old material outside the transmitted window must not influence retrieval
  // or inferred preferences in the actual final system prompt.
  const staleHistory = [
    { content: "Elijo plan estructurado. osteoporosis osteopenia", isUser: true },
    ...Array.from({ length: 32 }, (_, i) => ({ content: `Turno reciente ${i}: estoy organizando un correo.`, isUser: i % 2 === 0 })),
  ];
  await processUserMessage("Quiero escribir un saludo.", staleHistory, undefined, "es", "brief");
  assert(!requests.at(-1).messages[0].content.includes("Plan detallado paso a paso con cronograma semanal"));
  await processUserMessage("¿Y ahora?", [
    { content: "No quiero vivir. " + "x".repeat(CHAT_HISTORY_BYTES), isUser: true },
  ], undefined, "es", "brief");
  assert(requests.at(-1).messages[0].content.includes("El turno o contexto reciente contiene señales de seguridad"));
  assert.equal(requests.at(-1).max_completion_tokens, 1000, "Pruning dialogue must not suppress existing safety handling");
  // Check the actual sent prompt for diverse needs and contextual continuations.
  for (const [message, history] of [
    ["Desde que murió mi madre no soporto llegar a casa", []],
    ["No consigo concentrarme", []],
    ["Necesito algo para calmarme antes de esta reunión", []],
    ["¿Qué diferencia hay entre estrés y ansiedad?", []],
    ["Solo quiero que me escuches", [{ content: "La respiración no me ayuda, no quiero repetirla", isUser: true }]],
    ["¿Y ahora?", [{ content: "No quiero vivir", isUser: true }]],
  ] as [string, { content: string; isUser: boolean }[]][]) {
    await processUserMessage(message, history, undefined, "es", "classic");
    const sent = requests.at(-1).messages;
    assert(sent[0].content.includes("ESTRATEGIA CONVERSACIONAL"));
    assert(sent[0].content.includes("No vuelvas a recomendar lo rechazado"));
    assert(sent[0].content.includes("sin retrasar la orientación urgente"));
    assert.equal(sent.at(-1).content, message);
    if (history.length) assert(sent.some((item: any) => item.content === history[0].content));
    assert(!sent[0].content.includes("tu respuesta completa siguiendo la estructura de 10 puntos"));
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
