import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { build } from "esbuild";
import { CHAT_HISTORY_BYTES, boundedChatHistory } from "../server/chat-cost-policy";
import { conversationCases } from "./fixtures/chat-conversation-cases";
import { installOfflineManagedChatConfiguration, offlineChatBudgetPlugin } from "./fixtures/chat-provider-offline";

installOfflineManagedChatConfiguration();
const requests: any[] = [];
(globalThis as any).__conversationWiringRequests = requests;
const directory = await fs.mkdtemp(path.join(os.tmpdir(), "nuxa-conversation-"));
try {
  const outfile = path.join(directory, "handler.mjs");
  await build({
    entryPoints: ["server/prompt-handler.ts"], outfile, bundle: true, platform: "node", format: "esm",
    plugins: [offlineChatBudgetPlugin, {
      name: "offline-conversation-provider",
      setup(builder) {
        builder.onResolve({ filter: /^openai$/ }, () => ({ path: "sdk", namespace: "conversation-mock" }));
        builder.onLoad({ filter: /.*/, namespace: "conversation-mock" }, () => ({
          contents: `export default class OpenAI {
            chat = { completions: { create: async (request) => {
              globalThis.__conversationWiringRequests.push(request);
              return { choices: [{ message: { content: JSON.stringify({response:"Offline boundary fixture."}) }}] };
            }}};
          }`, loader: "js",
        }));
      },
    }],
  });
  const { generateChatResponse } = await import(pathToFileURL(outfile).href);
  for (const item of conversationCases) {
    for (const mode of ["classic", "bubbles", "brief"]) {
      await generateChatResponse(item.question, item.history, {}, item.language, mode);
      const request = requests.at(-1)!;
      assert.deepEqual(request.messages.slice(1), [
        ...boundedChatHistory(item.history, item.question), { role: "user", content: item.question },
      ]);
      assert(request.messages[0].content.includes("Una propuesta del asistente NO demuestra"));
      assert(request.messages[0].content.includes("no la sustituyas automáticamente por otra técnica"));
      assert(!request.messages[0].content.includes("LÍMITE DEL CONTEXTO DE ESTA CONVERSACIÓN"));
      assert.equal(request.response_format.type, "json_object");
      assert.equal(request.max_completion_tokens, mode === "brief" ? (item.priority === "safety" ? 1000 : 500) : 4000);
    }
  }
  const history = [
    { isUser: true, content: "Mi objetivo es aprender a hablar más con mi pareja." },
    { isUser: true, content: "Corrijo: no tengo pareja ni quiero ese plan. " + "x".repeat(CHAT_HISTORY_BYTES) },
    { isUser: false, content: "Gracias por aclararlo; no retomaremos ese plan." },
  ];
  const question = "Hoy quiero hablar del trabajo.";
  await generateChatResponse(question, [...history, { isUser: true, content: question }], {}, "es", "classic");
  const truncated = requests.at(-1)!;
  assert(truncated.messages[0].content.includes("LÍMITE DEL CONTEXTO DE ESTA CONVERSACIÓN"));
  assert(!truncated.messages[0].content.includes("Mi objetivo es aprender"));
  assert.deepEqual(truncated.messages.slice(1), [
    { role: "assistant", content: history[2].content }, { role: "user", content: question },
  ]);
  const short = [{ isUser: true, content: "Me preocupa mi trabajo." }];
  await generateChatResponse(question, [...short, { isUser: true, content: question }], {}, "es", "brief");
  assert(!requests.at(-1)!.messages[0].content.includes("LÍMITE DEL CONTEXTO DE ESTA CONVERSACIÓN"),
    "Deduplicating the current turn is not context loss.");
  const manyTurns = Array.from({ length: 35 }, (_, index) => ({ isUser: index % 2 === 0, content: `Turno ${index}` }));
  await generateChatResponse(question, manyTurns, {}, "es", "classic");
  assert(requests.at(-1)!.messages[0].content.includes("LÍMITE DEL CONTEXTO DE ESTA CONVERSACIÓN"));
  assert.equal(requests.at(-1)!.messages.length, 34);
  console.log("PASS: 12 synthetic cases × 3 modes, actual provider-boundary prompt/history, safety token limits, gap handling and deduplication. Mock responses are NOT a quality evaluation.");
} finally {
  delete (globalThis as any).__conversationWiringRequests;
  await fs.rm(directory, { recursive: true, force: true });
}
