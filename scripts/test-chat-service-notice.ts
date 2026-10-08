import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as icons from "lucide-react";
import { transformSync } from "esbuild";
import { chatUnavailableNotice, type ChatServiceStatus } from "../shared/chat-service";

// Render the actual component offline; no sign-in, AI, email or SMS requests.
const context = {
  module: { exports: {} },
  React,
  require(name: string) {
    if (name === "lucide-react") return icons;
    if (name === "@shared/chat-service") return { chatUnavailableNotice };
    throw new Error(`Unexpected dependency: ${name}`);
  },
};
vm.runInNewContext(transformSync(
  fs.readFileSync("client/src/components/ui/chat-service-notice.tsx", "utf8"),
  { loader: "tsx", format: "cjs", jsx: "transform" },
).code, context);
const { ChatServiceNotice, AutomaticReplyLabel } = context.module.exports as {
  ChatServiceNotice: React.ComponentType<{ status?: ChatServiceStatus; language: string; forceUnavailable?: boolean }>;
  AutomaticReplyLabel: React.ComponentType<{ language: string }>;
};
const connection = (provider: "replit" | "openai", state: "available" | "unknown" | "unavailable") =>
  ({ provider, state, reason: null });
for (const language of ["es", "en", "fr", "de", "it", "pt", "ca", "eu", "gl"]) {
  const render = (status?: ChatServiceStatus, forceUnavailable = false) =>
    renderToStaticMarkup(React.createElement(ChatServiceNotice, { status, language, forceUnavailable }));
  assert.equal(render(), "");
  assert.equal(render({ state: "unknown", connections: [connection("replit", "unknown")] }), "");
  assert.equal(render({ state: "available", connections: [connection("replit", "available")] }), "");
  assert.equal(render({
    state: "limited", connections: [connection("openai", "unavailable"), connection("replit", "unknown")],
  }), "");
  const limited = render({
    state: "limited", connections: [connection("openai", "unavailable"), connection("replit", "available")],
  });
  assert(limited.includes('role="status"'));
  const unavailable = render({ state: "unavailable", connections: [connection("replit", "unavailable")] });
  assert(unavailable.includes('role="alert"'));
  // All notice text is delivered, including question-quota and automatic-reply wording.
  assert.equal(unavailable.replace(/<[^>]*>/g, "").replaceAll("&#x27;", "'").replaceAll("&amp;", "&"), chatUnavailableNotice(language));
  assert(render({ state: "available", connections: [connection("replit", "available")] }, true).includes('role="alert"'));
  assert(render(undefined, true).includes('role="alert"'));
  assert(renderToStaticMarkup(React.createElement(AutomaticReplyLabel, { language })).includes("<span"));
}
console.log("PASS: no unknown/available banners, confirmed alternative only, actual outages and automatic labels preserved in all nine languages. No external calls.");
