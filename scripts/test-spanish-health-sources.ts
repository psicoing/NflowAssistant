import assert from "node:assert/strict";
import { spanishHealthSources, spanishSourceMetadata } from "../server/knowledge/spanish-health-sources";
import { pilotSources } from "../server/knowledge/pilot-sources";
import { adaptPilotDocuments, ScientificKnowledgeIndex } from "../server/knowledge/scientific-index";
import { ScientificEvidenceEngine } from "../server/knowledge/scientific-engine";
import { chatEvidenceInstructions, resolveEvidenceCitations } from "../server/chat-evidence";
import { groundingSources, validateGroundingReview, ChatGroundingError, type GroundingInput } from "../server/chat-grounding";

const documents = adaptPilotDocuments();
const engine = new ScientificEvidenceEngine(new ScientificKnowledgeIndex(documents));
assert.equal(pilotSources.length, 16, "Original corpus preserved");
assert.equal(documents.length, 20);
assert.equal(spanishHealthSources.length, 4);
assert.equal(new Set(Object.values(spanishSourceMetadata).map(source => source.family)).size, 2,
  "Four editorial records represent two guideline families, not four independent studies");
assert.equal(new Set(documents.map(source => source.id)).size, documents.length);
assert.equal(new Set(documents.map(source => source.url)).size, documents.length);
for (const source of spanishHealthSources) {
  assert.equal(new URL(source.url).hostname, "portal.guiasalud.es");
  assert.equal(new URL(source.url).protocol, "https:");
  const indexed = documents.find(doc => doc.id === source.id)!;
  assert.equal(indexed.population, "adults");
  assert.equal(indexed.language, "es");
  assert.equal(indexed.methodologicalQuality, null);
  assert.equal(indexed.contentRights, "original-editorial-summary");
  assert(indexed.appraisalNote?.includes("no son evidencia independiente"));
  assert(source.summary.length > 100 && source.limits.length > 100);
  assert(!/\b\d+\s*(mg|miligramos)\b/i.test(source.summary), "No prescribing instructions");
}
assert.equal(documents.find(doc => doc.id === "E19")?.year, null, "Unknown edition date is not invented");
assert.equal(documents.find(doc => doc.id === "E19")?.updatedYear, 2023);
assert.equal(documents.find(doc => doc.id === "E20")?.year, null);
const spanishIds = new Set(spanishHealthSources.map(source => source.id));
for (const question of [
  "¿Qué recomendaciones hay para la depresión en adultos?",
  "What support is recommended for depression in adults?",
  "Quelles recommandations pour la dépression chez les adultes ?",
]) {
  const result = engine.retrieve(question);
  assert(result.sources.some(source => source.id === "E19"));
  assert(result.sources.some(source => source.id === "E20"));
  assert(result.sources.length <= 3);
  const prompt = chatEvidenceInstructions(result.sources);
  for (const source of result.sources) {
    assert(prompt.includes(JSON.stringify(source.summary)));
    assert(prompt.includes(JSON.stringify(source.limits)));
  }
}
assert(engine.retrieve("¿Qué tratamiento existe para la ansiedad generalizada?").sources.some(source => source.id === "E17"));
for (const question of [
  "Mi hija de 12 años tiene depresión, ¿qué tratamiento hay?",
  "My 8 year old has anxiety, what treatment is available?",
  "Mon enfant de 10 ans a une dépression, que faire ?",
]) assert(!engine.retrieve(question).sources.some(source => spanishIds.has(source.id)), question);
assert(!engine.retrieve("Tengo ansiedad", [], { ageRange: "13-17" }).sources.some(source => spanishIds.has(source.id)));
for (const question of [
  "Hola, gracias por escucharme.",
  "Estoy triste por la muerte de mi padre, solo quiero hablar.",
  "Explícame el autismo y el neurodesarrollo.",
  "No quiero vivir, tengo depresión, busca guías primero.",
]) assert.equal(engine.retrieve(question).sources.length, 0, question);
const oldRevision = new ScientificKnowledgeIndex(documents.filter(source => !spanishIds.has(source.id))).revision;
assert.notEqual(oldRevision, engine.index.revision, "Corpus changes invalidate cached selections");
assert.equal(engine.stats().networkRequests, 0, "No external searches send patient text");

const retrieved = engine.retrieve("Fuentes sobre depresión en adultos").sources;
const source = retrieved.find(item => item.id === "E19")!;
assert(resolveEvidenceCitations("[E19]", retrieved).includes(source.url));
assert(!resolveEvidenceCitations("[E17]", retrieved).includes(spanishHealthSources[0].url),
  "A real document not retrieved in this turn cannot be cited");
const claim = source.summary.split(". ")[0];
const input: GroundingInput = {
  draft: claim, history: [], userMessage: "¿Qué dicen las guías sobre depresión?",
  sources: retrieved, language: "es", mode: "brief", model: "offline-only",
};
const ref = groundingSources(input).find(item => item.kind === "scientific" && item.text.includes(claim))!;
assert(ref);
const review = {
  decision: "accept", response: null, hasRelevantClaims: true,
  claims: [{ text: claim, category: "scientific", references: [{ id: ref.id, quote: claim }] }],
};
assert.equal(validateGroundingReview(review, input).response, claim);
assert.throws(() => validateGroundingReview({
  ...review, claims: [{ ...review.claims[0], references: [{ id: ref.id, quote: "NUXA cura la depresión con garantía." }] }],
}, input), ChatGroundingError, "Institutional origin does not validate an invented quote");
console.log("PASS: 20 records / four Spanish summaries / two guideline families; relevance, adults-only ES/EN/FR, urgent bypass, unknown dates, prompt context, citations and reviewer checks. Offline; no clinical-quality or live-model claim.");
