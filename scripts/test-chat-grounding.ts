import assert from "node:assert/strict";
import { requiresUrgentHumanSupport } from "../server/knowledge/scientific-query";
import {
  ChatGroundingError, validateGroundingReview, groundingSources, groundingRequest,
  chatGroundingNotice, groundingCostBound, type GroundingInput,
} from "../server/chat-grounding";

const input: GroundingInput = {
  draft: "Según lo que cuentas, no tienes pareja. No sabemos qué causa el cansancio.",
  history: [{ role: "assistant", content: "Te preocupan los conflictos con tu pareja." }],
  userMessage: "No tengo pareja. Estoy cansada, pero no sé por qué.",
  sources: [], profile: { age: "30-40", password: "synthetic-private-field" },
  language: "es", mode: "brief", model: "gpt-5.5",
};
const accepted = {
  decision: "accept", response: null, hasRelevantClaims: true,
  claims: [
    { text: "no tienes pareja", category: "reported", references: [{ id: "U2", quote: "No tengo pareja." }] },
    { text: "No sabemos qué causa el cansancio.", category: "unknown", references: [] },
  ],
};
assert.equal(validateGroundingReview(accepted, input).response, input.draft);
assert(!JSON.stringify(groundingSources(input)).includes("synthetic-private-field"));
assert(groundingSources(input).some(source => source.id === "P0"));
assert(!groundingRequest(input)[0].content.includes(input.userMessage), "User data is not interpolated into trusted instructions.");
const copy = () => structuredClone(accepted);
let invalid = copy();
invalid.claims[0].references[0].id = "U999";
assert.throws(() => validateGroundingReview(invalid, input), ChatGroundingError);
invalid = copy();
invalid.claims[0].references[0] = { id: "U2", quote: "Tengo una pareja." };
assert.throws(() => validateGroundingReview(invalid, input), ChatGroundingError);
invalid = copy();
invalid.claims[0].references[0] = { id: "A1", quote: "Te preocupan los conflictos" };
assert.throws(() => validateGroundingReview(invalid, input), ChatGroundingError, "Assistant's claim cannot establish a user fact.");
invalid = copy();
invalid.claims[0].category = "scientific";
assert.throws(() => validateGroundingReview(invalid, input), ChatGroundingError);
invalid = copy();
invalid.hasRelevantClaims = false;
assert.throws(() => validateGroundingReview(invalid, input), ChatGroundingError);
invalid = copy();
invalid.claims[0].text = "Una frase que no se entregará";
assert.throws(() => validateGroundingReview(invalid, input), ChatGroundingError);
assert.throws(() => validateGroundingReview({ ...accepted, decision: "approve" }, input), ChatGroundingError);
assert.throws(() => validateGroundingReview({ ...accepted, response: "Changed without revision." }, input), ChatGroundingError);
assert.throws(() => validateGroundingReview(null, input), ChatGroundingError);
assert.throws(() => validateGroundingReview({
  decision: "revise", response: "Consulta https://invented.invalid/psychology", hasRelevantClaims: false, claims: [],
}, input), ChatGroundingError);
assert.throws(() => validateGroundingReview({
  decision: "revise", response: "Lo sé por [U2]", hasRelevantClaims: false, claims: [],
}, input), ChatGroundingError, "Private reference IDs must not leak into chat text.");
const revised = {
  decision: "revise", response: "Por lo que cuentas, estás cansada. No sé qué lo causa.",
  hasRelevantClaims: true,
  claims: [
    { text: "estás cansada", category: "reported", references: [{ id: "U2", quote: "Estoy cansada" }] },
    { text: "No sé qué lo causa.", category: "unknown", references: [] },
  ],
};
assert.equal(validateGroundingReview(revised, input).decision, "revise");
const unicodeInput = { ...input, draft: "Según lo que cuentas, estás cansada." };
assert.equal(validateGroundingReview({ ...revised, decision: "accept", response: null, claims: [revised.claims[0]] }, unicodeInput).response, unicodeInput.draft);
assert(groundingCostBound(input).maximumNanoUsd > 0);
const generalInput = { ...input, sources: [], draft: "El refuerzo positivo favorece que se repita una conducta." };
assert.equal(validateGroundingReview({
  decision: "accept", response: null, hasRelevantClaims: true,
  claims: [{ text: generalInput.draft, category: "general", references: [] }],
}, generalInput).response, generalInput.draft, "General education without retrieved evidence is not an individual claim or a verified citation.");
for (const adjective of ["fuerte", "intenso", "repentino", "insoportable"]) {
  assert(requiresUrgentHumanSupport(`Tengo dolor ${adjective} en el pecho y me cuesta respirar.`));
}
for (const language of ["es", "en", "fr", "de", "it", "pt", "ca", "eu", "gl", "en-US"]) {
  assert(chatGroundingNotice(language).length > 100);
}
console.log("PASS: actual source IDs/quotes, author separation, correction, final-text anchoring, unknowns, malformed reviews, unapproved URLs, profile privacy, cost bound and ten locale inputs. Structural validation is NOT semantic entailment.");
