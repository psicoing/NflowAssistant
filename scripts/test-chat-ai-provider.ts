import assert from "node:assert/strict";
import { build } from "esbuild";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

const dir = await fs.mkdtemp(path.join(os.tmpdir(), "nuxa-chat-provider-"));
const constructed: Record<string, string>[] = [];
(globalThis as any).__offlineChatProviderConstructors = constructed;
try {
  const outfile = path.join(dir, "client.mjs");
  await build({
    entryPoints: ["server/chat-ai-client.ts"], outfile, platform: "node", bundle: true, format: "esm",
    plugins: [{
      name: "offline-provider-options",
      setup(builder) {
        builder.onResolve({ filter: /^openai$/ }, () => ({ path: "openai", namespace: "offline" }));
        builder.onLoad({ filter: /.*/, namespace: "offline" }, () => ({
          contents: `export default class OpenAI { constructor(options) { globalThis.__offlineChatProviderConstructors.push(options); } }`,
          loader: "js",
        }));
      },
    }],
  });
  const { chatAiReadiness, createChatAiClient } = await import(pathToFileURL(outfile).href);
  const personalOnly = { OPENAI_API_KEY: "synthetic-personal-key" };
  const unconfigured = chatAiReadiness(personalOnly);
  assert.equal(unconfigured.provider, "replit");
  assert.equal(unconfigured.configured, false);
  assert.equal(unconfigured.model, "gpt-5.5-2026-04-23");
  assert(!JSON.stringify(unconfigured).includes("synthetic-personal-key"));
  assert.throws(() => createChatAiClient(personalOnly), { code: "NUXA_CHAT_AI_NOT_CONFIGURED" });
  assert.equal(constructed.length, 0, "Never send an SDK request to the personal key as fallback");
  const managed = {
    ...personalOnly,
    AI_INTEGRATIONS_OPENAI_BASE_URL: "https://managed-test.invalid/v1",
    AI_INTEGRATIONS_OPENAI_API_KEY: "synthetic-managed-key",
    OPENAI_CHAT_MODEL: "configured-model-unchanged",
  };
  assert(chatAiReadiness(managed).configured);
  assert.equal(chatAiReadiness(managed).model, "configured-model-unchanged");
  createChatAiClient(managed);
  assert.deepEqual(constructed[0], { apiKey: managed.AI_INTEGRATIONS_OPENAI_API_KEY, baseURL: managed.AI_INTEGRATIONS_OPENAI_BASE_URL });
  assert(!JSON.stringify(chatAiReadiness(managed)).includes("synthetic-managed-key"));
  assert.throws(() => createChatAiClient({ ...managed, AI_INTEGRATIONS_OPENAI_API_KEY: "" }));
  assert.throws(() => createChatAiClient({ ...managed, AI_INTEGRATIONS_OPENAI_BASE_URL: "not-a-url" }));
  assert.throws(() => createChatAiClient({ ...managed, AI_INTEGRATIONS_OPENAI_BASE_URL: "https://user:password@invalid.test" }));
  assert.throws(() => createChatAiClient({ ...managed, NUXA_CHAT_AI_PROVIDER: "unsupported" }));
  const count = constructed.length;
  assert.throws(() => createChatAiClient(personalOnly));
  assert.equal(constructed.length, count);
  createChatAiClient({ ...personalOnly, NUXA_CHAT_AI_PROVIDER: "openai" });
  assert.deepEqual(constructed.at(-1), { apiKey: personalOnly.OPENAI_API_KEY, baseURL: "https://api.openai.com/v1" });
  const voice = await fs.readFile("server/voiceDemoBridge.ts", "utf8");
  assert(!voice.includes("createChatAiClient"), "Do not migrate voice credentials");
  console.log("PASS: written chat defaults to managed Replit credentials/endpoint, no silent personal-key fallback, explicit direct mode only, model preserved, invalid/partial config blocked, readiness contains no credentials. No network or paid AI calls.");
} finally {
  delete (globalThis as any).__offlineChatProviderConstructors;
  await fs.rm(dir, { recursive: true, force: true });
}
