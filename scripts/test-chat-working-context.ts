import assert from "node:assert/strict";
import { boundedChatHistory, CHAT_HISTORY_BYTES } from "../server/chat-cost-policy";
import { prepareChatWorkingContext, workingMemoryInstructions } from "../server/chat-working-context";
import { groundingSources, groundingRequest, validateGroundingReview, ChatGroundingError } from "../server/chat-grounding";

type Turn = { content: string; isUser: boolean };
const user = (content: string): Turn => ({ isUser: true, content });
const assistant = (content: string): Turn => ({ isUser: false, content });
const current = "¿Cómo seguimos con lo que te conté?";
const filler = Array.from({ length: 10 }, (_, index) => [
  user(`Detalle ${index}: hoy sigo pensando en ello.`),
  assistant(`Respuesta anterior ${index}: ` + "Contenido de apoyo general. ".repeat(45)),
]).flat();
// Development fixtures only: the reserved set is not imported or opened here.
const history = [
  user("Mi objetivo es hablar en una reunión sin quedarme bloqueado."),
  assistant("Quizá sea por un conflicto con tu pareja."),
  user("Corrijo: no tengo pareja. Descartamos esa explicación."),
  assistant("Podríamos preparar una primera frase."),
  user("La preparé y la usé una vez; me ayudó un poco, pero sigo nervioso."),
  ...filler,
];
const context = prepareChatWorkingContext(history, current);
assert(context.memoryTurnCount > 0);
assert(context.history.filter(turn => turn.role === "user").length >
  boundedChatHistory(history, current).filter(turn => turn.role === "user").length);
assert(context.history.some(turn => turn.content === history[2].content), "Recover the complete correction.");
assert(context.history.some(turn => turn.content === history[4].content), "Recover the literal partial outcome.");
assert(!context.history.some(turn => turn.content === history[1].content), "Do not store an old assistant hypothesis as personal memory.");
assert.equal(context.historyIncomplete, true);
assert.equal(context.omittedUserTurns, 0);
assert(context.omittedAssistantTurns > 0);
assert(workingMemoryInstructions(context.memoryTurnCount).includes("correcciones posteriores prevalecen"));
assert.equal(workingMemoryInstructions(0), "");
assert.deepEqual(prepareChatWorkingContext([...history, user(current)], current), context);

const short = [user("No he probado aún la propuesta."), assistant("Podemos escuchar primero.")];
assert.deepEqual(prepareChatWorkingContext(short, current).history, boundedChatHistory(short, current));
assert.equal(prepareChatWorkingContext(short, current).memoryTurnCount, 0);
assert.equal(prepareChatWorkingContext(short, current).historyIncomplete, false);
const before = JSON.stringify(history);
prepareChatWorkingContext(history, current);
assert.equal(JSON.stringify(history), before, "No mutation or persistent summary.");
const other = prepareChatWorkingContext([user("Esta es otra conversación.")], current);
assert(!JSON.stringify(other).includes("pareja"), "No cross-conversation state.");

// The latest correction is too large: never leap over it to retrieve an old story.
const barrier = [
  user("OLD_UNSUPPORTED_STORY"),
  user("Corrección extensa: " + "é".repeat(CHAT_HISTORY_BYTES) + " no ocurrió."),
  assistant("Gracias por aclararlo."),
];
const blocked = prepareChatWorkingContext(barrier, current);
assert(!JSON.stringify(blocked.history).includes("OLD_UNSUPPORTED_STORY"));
assert(blocked.omittedUserTurns > 0);
// A correction fitting the original budget, but not the smaller recent lane,
// must not disappear because the extractor reserved memory space.
const largeCorrection = [
  user("OLD_PLAN"),
  user("No quiero ese plan. " + "x".repeat(6800)),
  assistant("De acuerdo."),
];
assert.deepEqual(prepareChatWorkingContext(largeCorrection, current).history,
  boundedChatHistory(largeCorrection, current));
assert.throws(() => boundedChatHistory([], current, CHAT_HISTORY_BYTES + 1), RangeError);

// Same bytes, roles and quotes reach the reviewer. Memory is not a new class
// of evidence with weaker author/reference checks.
const input = {
  draft: "Según lo que cuentas, no tienes pareja.",
  history: context.history, userMessage: current, sources: [],
  language: "es", mode: "brief", model: "gpt-5.5",
  memoryTurnCount: context.memoryTurnCount, historyIncomplete: context.historyIncomplete,
};
const sources = groundingSources(input);
const correction = sources.find(source => source.text === history[2].content)!;
assert(correction && correction.kind === "user");
assert.equal(correction.metadata?.context, "literal-earlier-user-turn");
const request = groundingRequest(input);
const payload = JSON.parse(request[1].content);
assert.equal(payload.contextIncomplete, true);
assert.deepEqual(payload.sources.filter((source: any) => source.kind === "user" || source.kind === "assistant")
  .map((source: any) => source.text), [...context.history.map(turn => turn.content), current]);
const valid = {
  decision: "accept", response: null, hasRelevantClaims: true,
  claims: [{ text: "no tienes pareja", category: "reported",
    references: [{ id: correction.id, quote: "no tengo pareja" }] }],
};
assert.equal(validateGroundingReview(valid, input).response, input.draft);
const fake = structuredClone(valid);
fake.claims[0].references[0].id = "U99999";
assert.throws(() => validateGroundingReview(fake, input), ChatGroundingError);
fake.claims[0].references[0] = { id: correction.id, quote: "Tengo un diagnóstico confirmado." };
assert.throws(() => validateGroundingReview(fake, input), ChatGroundingError);

// Deterministic property sweep, with complete repeated text, Unicode and barriers.
for (let seed = 1; seed <= 120; seed++) {
  const turns: Turn[] = Array.from({ length: seed % 70 + 2 }, (_, index) => ({
    isUser: index % 3 !== 1,
    content: `${index}: ` + (index % 5 ? "dato é🙂 " : "no ocurrió ") .repeat((seed * (index + 1)) % 1400),
  }));
  const chosen = prepareChatWorkingContext(turns, current);
  const selectedUsers = chosen.history.filter(turn => turn.role === "user").map(turn => turn.content);
  const previousUsers = turns.filter(turn => turn.isUser).map(turn => turn.content);
  assert.deepEqual(selectedUsers, selectedUsers.length ? previousUsers.slice(-selectedUsers.length) : [],
    `Never skip a user correction: ${seed}`);
  assert(chosen.history.reduce((sum, turn) => sum + Buffer.byteLength(turn.content, "utf8"), 0) <= CHAT_HISTORY_BYTES);
  assert(selectedUsers.length >= boundedChatHistory(turns, current).filter(turn => turn.role === "user").length);
  assert(chosen.history.every(turn => turns.some(original =>
    original.content === turn.content && original.isUser === (turn.role === "user"))));
  assert.equal(chosen.omittedUserTurns, previousUsers.length - selectedUsers.length);
  assert(chosen.omittedAssistantTurns >= 0);
}
console.log("PASS: extractive working context, corrections/outcomes, unchanged byte bound, 120 property scenarios, same reviewer sources, forged references rejected. No external calls.");
