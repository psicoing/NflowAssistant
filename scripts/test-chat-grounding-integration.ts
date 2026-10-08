import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { build } from "esbuild";
import { installOfflineManagedChatConfiguration } from "./fixtures/chat-provider-offline";
import { chatGroundingNotice } from "../server/chat-grounding";

installOfflineManagedChatConfiguration();
const state = {
  requests: [] as any[], draft: "Tu pareja causa tu ansiedad.",
  audit: JSON.stringify({
    decision: "revise", response: "Según lo que cuentas, no tienes pareja. Podemos hablar de lo que te preocupa.",
    hasRelevantClaims: true,
    claims: [{ text: "no tienes pareja", category: "reported", references: [{ id: "U1", quote: "No tengo pareja." }] }],
  }),
  blockedReview: false, crisisDraft: false,
};
(globalThis as any).__groundingIntegration = state;
const directory = await fs.mkdtemp(path.join(os.tmpdir(), "nuxa-grounding-"));
try {
  const outfile = path.join(directory, "handler.mjs");
  await build({
    entryPoints: ["server/prompt-handler.ts"], outfile, bundle: true, platform: "node", format: "esm",
    plugins: [{
      name: "grounding-mock-router",
      setup(builder) {
        builder.onResolve({ filter: /(^|\/)chat-completion-router$/ }, () => ({ path: "router", namespace: "grounding-router" }));
        builder.onLoad({ filter: /.*/, namespace: "grounding-router" }, () => ({
          contents: `export async function routedChatCompletion(request) {
            const state=globalThis.__groundingIntegration; state.requests.push(request);
            const review=request.messages[0].content.startsWith("NUXA_GROUNDING_REVIEW");
            if(review && state.blockedReview) {
              const error=new Error("Synthetic budget limit");error.code="NUXA_CHAT_MONTHLY_BUDGET_EXCEEDED";throw error;
            }
            return {choices:[{message:{content:review ? state.audit : JSON.stringify({
              response:state.draft,...(state.crisisDraft?{supportType:"crisis"}:{})
            })}}]};
          }`, loader: "js",
        }));
      },
    }],
  });
  const { processUserMessage } = await import(pathToFileURL(outfile).href);
  const question = "No tengo pareja. Me preocupa mi ansiedad en el trabajo.";
  const result = await processUserMessage(question, [], {}, "es", "brief");
  assert.equal(result.content, "Según lo que cuentas, no tienes pareja. Podemos hablar de lo que te preocupa.");
  assert.equal(result.responseKind, "ai");
  assert.equal(result.countsTowardQuestionQuota, true);
  assert.equal(state.requests.length, 2);
  assert.equal(state.requests[0].max_completion_tokens, 500);
  assert.equal(state.requests[1].max_completion_tokens, 1600);
  assert(!result.content.includes("references") && !result.content.includes("reported"));
  // Broken audit must not deliver the already-created, unsupported draft.
  state.audit = "{}";
  const rejected = await processUserMessage(question, [], {}, "fr", "classic");
  assert.equal(rejected.content, chatGroundingNotice("fr"));
  assert.equal(rejected.responseKind, "automatic");
  assert.equal(rejected.countsTowardQuestionQuota, false);
  assert.equal(rejected.aiUnavailable, false, "Quality failure is not an AI outage.");
  assert(!rejected.content.includes(state.draft));
  state.blockedReview = true;
  const blocked = await processUserMessage(question, [], {}, "es", "brief");
  assert.equal(blocked.countsTowardQuestionQuota, false, "Global router budget governs the audit too.");
  assert.equal(blocked.responseKind, "automatic");
  state.blockedReview = false;
  // Emergency advice is not delayed or rewritten by a second provider call.
  state.draft = "Busca ayuda humana urgente ahora.";
  const before = state.requests.length;
  const urgent = await processUserMessage("Tengo dolor fuerte en el pecho y me cuesta respirar.", [], {}, "es", "brief");
  assert.equal(urgent.content, state.draft);
  assert.equal(urgent.supportType, "crisis");
  assert.equal(state.requests.length - before, 1);
  assert.equal(state.requests.at(-1)!.max_completion_tokens, 1000);
  state.crisisDraft = true;
  const beforeModelCrisis = state.requests.length;
  const modelCrisis = await processUserMessage("Necesito hablar de algo que me preocupa.", [], {}, "es", "brief");
  assert.equal(modelCrisis.content, state.draft);
  assert.equal(state.requests.length - beforeModelCrisis, 1, "A crisis signalled by the draft also avoids review delay.");
  console.log("PASS: real handler/router boundary, corrected output, hidden metadata, unverified draft never delivered, no client quota charge on failure, budget-preserving review, and one-call emergency path. No external calls.");
} finally {
  delete (globalThis as any).__groundingIntegration;
  await fs.rm(directory, { recursive: true, force: true });
}
