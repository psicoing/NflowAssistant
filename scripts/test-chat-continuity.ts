import assert from "node:assert/strict";
import { boundedChatHistory, CHAT_HISTORY_BYTES } from "../server/chat-cost-policy";
import { conversationCases } from "./fixtures/chat-conversation-cases";

const history = [
  { isUser: true, content: "Mi objetivo es aprender a hablar más con mi pareja." },
  { isUser: false, content: "Podemos preparar una frase para comenzar." },
  // A recent long correction must not silently disappear while older facts survive.
  { isUser: true, content: "Corrijo lo anterior: no tengo pareja y no quiero ese plan. " + "x".repeat(CHAT_HISTORY_BYTES) },
  { isUser: false, content: "Gracias por aclararlo; no retomaremos ese plan." },
];
const selected = boundedChatHistory(history, "Hoy quiero hablar del trabajo.");
assert.deepEqual(selected, [{ role: "assistant", content: history[3].content }],
  "Context must remain a contiguous recent suffix, not stitch older facts across a missing correction.");
const current = { isUser: true, content: "Hoy quiero hablar del trabajo." };
assert.deepEqual(boundedChatHistory([...history, current], current.content), selected,
  "The already-saved current turn is sent once, not counted as omitted context.");
assert.equal(conversationCases.length, 12);
assert.equal(new Set(conversationCases.map(item => item.id)).size, 12);
for (const item of conversationCases) {
  assert(item.criteria.length >= 3);
  assert.deepEqual(
    boundedChatHistory(item.history, item.question),
    item.history.map(turn => ({ role: turn.isUser ? "user" : "assistant", content: turn.content })),
    `Short fixture context is preserved: ${item.id}`,
  );
}
console.log("PASS: coherent bounded continuity, current-turn deduplication and twelve synthetic review scenarios. No external calls.");
