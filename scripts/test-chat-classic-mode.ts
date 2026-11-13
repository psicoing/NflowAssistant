import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { build } from "esbuild";
import { chatModeStyle, compactChatPresentation } from "../server/chat-presentation";
import { groundingRequest, GROUNDING_OUTPUT_TOKENS } from "../server/chat-grounding";
import { installOfflineManagedChatConfiguration } from "./fixtures/chat-provider-offline";

installOfflineManagedChatConfiguration();
const classic = chatModeStyle("classic");
const brief = "Responde brevemente, normalmente en 2-4 frases; amplía lo necesario para seguridad.";
const bubbles = "Usa 2-4 párrafos cortos separados por una línea en blanco, con una idea por párrafo.";
assert.equal(chatModeStyle("brief"), brief);
assert.equal(chatModeStyle("bubbles"), bubbles);
assert.equal(chatModeStyle("unrecognised"), classic);
assert(classic.includes("subtítulos Markdown"));
assert(classic.includes("dos a cuatro instrucciones"));
assert(classic.includes("fuentes recuperadas con sus marcadores autorizados"));
assert(classic.includes("no inventes títulos, autores ni enlaces"));
assert(classic.includes("no cinco secciones obligatorias"));
assert(classic.includes("no repitas lo rechazado"));
assert(classic.includes("No propongas dietas"));

const scenarios = [
  { language: "es", question: "Me preocupa el estrés en el trabajo. Quiero entenderlo y un ejercicio concreto.", history: [] },
  { language: "en", question: "Explain work stress and give me one practical exercise with helpful reading.", history: [] },
  { language: "fr", question: "Explique le stress au travail et propose un exercice et une lecture utile.", history: [] },
  { language: "es", question: "No quiero técnicas ni lecturas, solo que me escuches.", history: [] },
  { language: "es", question: "Eso ya lo probé y no me ayuda. ¿Qué podemos cambiar?", history: [
    { isUser: false, content: "Podrías anotar las preocupaciones antes de acostarte." },
    { isUser: true, content: "Lo hice tres días y no me ayudó." },
  ] },
  { language: "es", question: "Me preocupa tener un problema con la comida; ¿cómo preparo la consulta?", history: [] },
  { language: "es", question: "Tengo dolor fuerte en el pecho y dificultad para respirar.", history: [] },
];
const state = { requests: [] as any[], revise: false };
(globalThis as any).__classicModeTest = state;
const directory = await fs.mkdtemp(path.join(os.tmpdir(), "nuxa-classic-"));
const fixture = "## Comprender la situación\nPodemos ordenar lo que te preocupa.\n\n" +
  "## Un paso práctico\nObjetivo: preparar lo que quieres comunicar.\n1. Anota una preocupación.\n" +
  "2. Elige qué necesitas aclarar.\n\n## Recursos\nPuedes explorar /recursos.";
try {
  const outfile = path.join(directory, "handler.mjs");
  await build({
    entryPoints: ["server/prompt-handler.ts"], outfile, bundle: true, platform: "node", format: "esm",
    plugins: [{
      name: "classic-offline-router",
      setup(builder) {
        builder.onResolve({ filter: /(^|\/)chat-completion-router$/ }, () => ({ path: "router", namespace: "classic-router" }));
        builder.onLoad({ filter: /.*/, namespace: "classic-router" }, () => ({
          contents: `export async function routedChatCompletion(request) {
            const state = globalThis.__classicModeTest;
            state.requests.push(request);
            const review = request.messages[0].content.startsWith("NUXA_GROUNDING_REVIEW");
            const fixture = ${JSON.stringify(fixture)};
            return {choices:[{message:{content:JSON.stringify(review ? {
              decision:state.revise ? "revise" : "accept",
              response:state.revise ? fixture : null,
              hasRelevantClaims:false,claims:[]
            } : {response:fixture})}}]};
          }`, loader: "js",
        }));
      },
    }],
  });
  const { generateChatResponse, processUserMessage } = await import(pathToFileURL(outfile).href);
  for (const item of scenarios) {
    for (const mode of ["classic", "brief", "bubbles"]) {
      const start = state.requests.length;
      await generateChatResponse(item.question, item.history, {}, item.language, mode);
      const request = state.requests[start]!;
      const prompt = request.messages[0].content as string;
      const presentation = prompt.split("\n\nFORMATO DE PRESENTACIÓN:\n")[1];
      assert(presentation.startsWith(chatModeStyle(mode)));
      assert(prompt.includes("No diagnostiques"));
      assert(prompt.includes("profundidad propia del modo elegido"));
      assert(!prompt.includes("Conserva el tono breve, cálido y prudente"));
      if (mode !== "classic") assert(!presentation.includes("MODO CLÁSICO"));
      assert.equal(request.messages.at(-1).content, item.question);
      assert.equal(request.response_format.type, "json_object");
      if (mode === "classic") assert.equal(request.max_completion_tokens, 4000);
      if (item === scenarios.at(-1)) assert(presentation.includes("La seguridad prevalece"));
    }
  }
  for (const mode of ["classic", "brief", "bubbles"]) {
    const input = { draft: fixture, history: [], userMessage: "Quiero organizar mis dudas.",
      sources: [], language: "es", mode, model: "offline" };
    assert(groundingRequest(input)[0].content.includes(chatModeStyle(mode)));
    if (mode !== "classic") assert(!groundingRequest(input)[0].content.includes("MODO CLÁSICO"));
  }
  for (const revise of [false, true]) {
    state.revise = revise;
    const start = state.requests.length;
    const result = await processUserMessage("Quiero preparar lo que voy a preguntar en una consulta.", [], {}, "es", "classic");
    assert.equal(result.responseKind, "ai");
    assert.equal(result.content, fixture, "Neither acceptance nor a rewrite strips Markdown sections or steps.");
    const [generation, review] = state.requests.slice(start);
    assert.equal(state.requests.length - start, 2);
    assert(generation.messages[0].content.includes(classic));
    assert(review.messages[0].content.includes(classic));
    assert(review.messages[0].content.includes("sin convertir una respuesta clásica en un resumen Q&A"));
    assert.equal(generation.max_completion_tokens, 4000);
    assert.equal(review.max_completion_tokens, GROUNDING_OUTPUT_TOKENS);
  }
  assert(compactChatPresentation("classic", true, false, false, true).includes("sin evaluar ni diagnosticar"));
  console.log("PASS: seven contrasts × three modes, ES/EN/FR prompt delivery, preserved brief/bubbles styles, shared classic contract in generation/review, exercise/reading limits, urgent precedence and accepted/revised structured output. Offline fixtures, NOT a semantic model evaluation.");
} finally {
  delete (globalThis as any).__classicModeTest;
  await fs.rm(directory, { recursive: true, force: true });
}
