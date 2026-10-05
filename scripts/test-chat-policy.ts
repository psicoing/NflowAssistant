import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { build } from "esbuild";
import { chatFailureMessage, hasSafetySignal } from "../server/chat-policy";
import { installOfflineManagedChatConfiguration } from "./fixtures/chat-provider-offline";

installOfflineManagedChatConfiguration();

// Exercise the actual handler/API request boundary without accounts or OpenAI calls.
const state = { fail: false, invalid: false, requests: [] as any[] };
(globalThis as any).__nuxaChatPolicyTest = state;
const dir = await fs.mkdtemp(path.join(os.tmpdir(), "nuxa-chat-policy-"));
const outfile = path.join(dir, "handler.mjs");
try {
  await build({
    entryPoints: ["server/prompt-handler.ts"], outfile, bundle: true, platform: "node", format: "esm",
    plugins: [{
      name: "offline-openai",
      setup(builder) {
        builder.onResolve({ filter: /^openai$/ }, () => ({ path: "openai", namespace: "offline" }));
        builder.onLoad({ filter: /.*/, namespace: "offline" }, () => ({
          contents: `export default class OpenAI {
            chat = { completions: { create: async (request) => {
              const state = globalThis.__nuxaChatPolicyTest;
              state.requests.push(request);
              if (state.fail) throw new Error("Simulated provider outage");
              return {choices: [{message: {content: state.invalid ? '{}' : JSON.stringify({response: 'Offline fixture response'})}}]};
            }}};
          }`,
          loader: "js",
        }));
      },
    }],
  });
  const { buildChatPrompt, processUserMessage } = await import(pathToFileURL(outfile).href);
  const profile = { age: "13-17", gender: "prefiero-no-contestar" };
  const history = [{ content: "Elijo técnica rápida", isUser: true }];
  const modes = ["classic", "bubbles", "brief"];
  const languages = ["es", "en", "fr", "de", "it", "pt", "ca", "eu", "gl"];
  const languageSamples: Record<string, string> = {
    es: "No quiero vivir por la presión en el trabajo y el fútbol",
    en: "I want to kill myself after work. Explain football",
    fr: "Je veux me tuer à cause du travail. Football",
  };
  const requestsBefore = state.requests.length;
  for (const language of languages) {
    let policy: string | undefined;
    for (const mode of modes) {
      const prompt = buildChatPrompt("Me preocupa mi trabajo", history, profile, language, mode);
      const prefix = prompt.split("\n\nFORMATO DE PRESENTACIÓN:\n")[0];
      if (policy) assert.equal(prefix, policy, `Same policy in ${language}/${mode}`);
      policy = prefix;
      assert(prompt.includes("Eres NUXA, un asistente de bienestar emocional"));
      assert(prompt.includes('"edad":"13-17"') && !prompt.includes("undefined"));
      assert(prefix.includes("Respuestas concisas y técnicas implementables"), `Recent preferences in ${mode}`);
      assert(prompt.includes("No diagnostiques"));
      assert(prompt.includes("No deduzcas país por idioma"));
      assert(prompt.includes("adulto de confianza"));
      assert(!/NEUROPSI|Orientación Diagnóstica|Explicación del Grupo Diagnóstico|Hablas como un psicólogo/.test(prompt));
      const response = await processUserMessage("Me preocupa mi trabajo", history, profile, language, mode);
      assert.equal(response.content, "Offline fixture response");
      const request = state.requests.at(-1)!;
      assert.equal(request.messages[0].content, prompt);
      assert.equal(request.response_format.type, "json_object");
      assert.equal(request.max_completion_tokens, mode === "brief" ? 500 : 4000);
    }
  }
  assert.equal(state.requests.length - requestsBefore, 27);
  for (const [language, message] of Object.entries(languageSamples)) {
    for (const mode of modes) {
      const response = await processUserMessage(message, [], profile, language, mode);
      assert.equal(response.supportType, "crisis", "Safety takes priority over work and off-topic");
      assert.equal(response.content, "Offline fixture response");
      if (mode === "brief") assert.equal(state.requests.at(-1)!.max_completion_tokens, 1000);
    }
  }
  for (const message of ["Qué es la ansiedad", "Mi hijo tiene cáncer", "Diagnostica al alumno con TDAH"]) {
    for (const mode of modes) {
      const prompt = buildChatPrompt(message, [], profile, "es", mode);
      assert(prompt.includes("No diagnostiques") && !prompt.includes("Soy Lumo"));
      assert(!prompt.includes("Su observación sobre la inconsistencia conductual es clínicamente relevante"));
    }
  }
  assert(!hasSafetySignal("Estoy triste por la muerte de mi padre"));
  assert(!hasSafetySignal("Tengo una crisis laboral"));
  for (const message of Object.values(languageSamples)) assert(hasSafetySignal(message));

  state.fail = true;
  for (const language of languages) {
    for (const mode of modes) {
      const response = await processUserMessage("Quiero hacerme daño. Trabajo", [], profile, language, mode);
      assert.equal(response.supportType, "crisis");
      assert.equal(response.content, chatFailureMessage(language, true));
      assert(!response.content.includes("717 003 717"));
      const normal = await processUserMessage("Me preocupa mi trabajo", [], profile, language, mode);
      assert.equal(normal.content, chatFailureMessage(language, false));
    }
  }
  state.fail = false;
  state.invalid = true;
  assert.equal((await processUserMessage("Me siento triste", [], profile, "fr", "brief")).content, chatFailureMessage("fr", false));
  const regional = buildChatPrompt("I feel stressed", [], {}, "en-US", "brief");
  assert(regional.startsWith("ALWAYS RESPOND IN ENGLISH"));
  assert(!regional.includes("undefined"));
  for (const file of ["chat-interface.tsx", "chat-bubble-interface.tsx", "chat-language-banner.tsx"]) {
    const source = await fs.readFile(`client/src/components/ui/${file}`, "utf8");
    assert(!source.includes("NEUROPSI-AI"), `Current chat identity: ${file}`);
  }
  console.log("PASS: 3 modes × 9 languages, shared identity/profile/preferences/safety, provider-request wiring, crisis precedence, localised outage handling, invalid response, regional language and chat labels. No external AI calls.");
} finally {
  delete (globalThis as any).__nuxaChatPolicyTest;
  await fs.rm(dir, { recursive: true, force: true });
}
