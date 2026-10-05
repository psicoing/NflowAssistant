import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { build } from "esbuild";
import { CitationText, linkifyCitations } from "../client/src/lib/citation-links";
import { pilotSources } from "../server/knowledge/pilot-sources";
import { retrieveChatEvidence, resolveEvidenceCitations } from "../server/chat-evidence";
import { evidenceCases } from "./fixtures/chat-evidence-cases";
import { installOfflineManagedChatConfiguration, offlineChatBudgetPlugin } from "./fixtures/chat-provider-offline";

installOfflineManagedChatConfiguration();

assert.equal(evidenceCases.length, 30);
assert(pilotSources.length >= 15 && pilotSources.length <= 20);
assert.equal(new Set(pilotSources.map(source => source.id)).size, pilotSources.length);
assert.equal(new Set(pilotSources.map(source => source.url)).size, pilotSources.length);
const publishers = new Set(["www.who.int", "www.nimh.nih.gov", "www.nhs.uk", "www.nice.org.uk", "www.insst.es", "www.hse.gov.uk", "www.ccohs.ca"]);
for (const source of pilotSources) {
  assert.equal(new URL(source.url).protocol, "https:");
  assert(publishers.has(new URL(source.url).hostname));
  assert(source.summary && source.limits && source.verifiedAt);
}
const state = { fail: false, requests: [] as any[] };
(globalThis as any).__nuxaEvidenceTest = state;
const dir = await fs.mkdtemp(path.join(os.tmpdir(), "nuxa-evidence-"));
try {
  const outfile = path.join(dir, "handler.mjs");
  await build({
    entryPoints: ["server/prompt-handler.ts"], outfile, bundle: true, platform: "node", format: "esm",
    plugins: [offlineChatBudgetPlugin, {
      name: "offline-evidence-provider",
      setup(builder) {
        builder.onResolve({ filter: /^openai$/ }, () => ({ path: "openai", namespace: "offline" }));
        builder.onLoad({ filter: /.*/, namespace: "offline" }, () => ({
          contents: `export default class OpenAI {
            chat = { completions: { create: async request => {
              const state = globalThis.__nuxaEvidenceTest; state.requests.push(request);
              if (state.fail) throw new Error("Synthetic provider failure");
              const id = request.messages[0].content.match(/"id":"(E\\d+)"/)?.[1];
              return {choices:[{message:{content:JSON.stringify({response: "Respuesta sintética" + (id ? " [" + id + "]" : "")})}}]};
            }}};
          }`, loader: "js",
        }));
      },
    }],
  });
  const { buildChatPrompt, processUserMessage } = await import(pathToFileURL(outfile).href);
  for (const item of evidenceCases) {
    const sources = retrieveChatEvidence(item.question, item.history, item.profile);
    assert(sources.length <= 3, `Bounded context: ${item.id}`);
    for (const topic of item.topics) assert(sources.some(source => source.topics.includes(topic)), `Topic ${topic}: ${item.id}`);
    if (!item.topics.length) assert.equal(sources.length, 0, `No unrelated/urgent citations: ${item.id}`);
    let commonPrefix: string | undefined;
    for (const mode of ["classic", "bubbles", "brief"]) {
      const prompt = buildChatPrompt(item.question, item.history ?? [], item.profile, item.language, mode);
      const prefix = prompt.split("\n\nFORMATO DE PRESENTACIÓN:\n")[0];
      if (commonPrefix) assert.equal(prefix, commonPrefix);
      commonPrefix = prefix;
      for (const source of sources) {
        assert(prefix.includes(JSON.stringify(source.summary)));
        assert(prefix.includes(JSON.stringify(source.limits)));
      }
      const answer = await processUserMessage(item.question, item.history ?? [], item.profile, item.language, mode);
      if (item.urgent) assert.equal(answer.supportType, "crisis");
      if (sources.length) assert(answer.content.includes(`](${sources[0].url})`), `Visible verified link: ${item.id}/${mode}`);
      else assert(!answer.content.includes("[E"));
    }
  }
  assert.equal(retrieveChatEvidence("¿Y las fuentes?", [{ content: "No quiero vivir por el trabajo", isUser: true }]).length, 0);
  const breathing = retrieveChatEvidence("ansiedad: ejercicio de respiración");
  assert.equal(breathing[0].id, "E05");
  const rendered = resolveEvidenceCitations("Apoyo [E05]. Inventada [E99]. [Falsa](https://www.who.int/inventada) https://example.com/falso", breathing);
  assert(rendered.includes(pilotSources[4].url));
  assert(!rendered.includes("E99") && !rendered.includes("inventada)") && !rendered.includes("example.com"));
  assert.equal(resolveEvidenceCitations("No hay documentación [E01]", []), "No hay documentación");
  const markup = linkifyCitations(rendered);
  assert(markup.includes('target="_blank"') && markup.includes('rel="noopener noreferrer"'));
  assert(!linkifyCitations("[malo](javascript:alert(1))").includes("<a"));
  assert(!linkifyCitations('[malo](https://user:password@example.com)').includes("<a"));
  assert(!linkifyCitations('<a href="https://example.com">Ancla cruda</a>').includes("<a"));
  assert(resolveEvidenceCitations("[E05](https://inventado.example)", breathing).includes(pilotSources[4].url));
  const briefHtml = renderToStaticMarkup(React.createElement(CitationText, { content: rendered }));
  assert(briefHtml.includes("<a") && briefHtml.includes(pilotSources[4].url));
  state.fail = true;
  const failure = await processUserMessage(evidenceCases[28].question, [], undefined, "es", "brief");
  assert.equal(failure.supportType, "crisis");
  assert(failure.content.includes("No esperes"));
  console.log("PASS: 16 documented sources; 30 synthetic cases × 3 modes; topic relevance, bounded/shared context, minors' context, urgent and unrelated bypass, real handler wiring, verified citations, clickable rendering and provider failure. Offline tests, not model quality or clinical validation.");
} finally {
  delete (globalThis as any).__nuxaEvidenceTest;
  await fs.rm(dir, { recursive: true, force: true });
}
