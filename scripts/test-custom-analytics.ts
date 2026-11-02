import assert from "node:assert/strict";
import { trackEvent } from "../client/src/lib/analytics";

async function main() {
  // No browser: safe during server rendering.
  trackEvent("test_event");
  let consent: string | null = null;
  const calls: unknown[][] = [];
  Object.assign(globalThis, {
    localStorage: { getItem: () => consent },
    window: { umami: { track: (...args: unknown[]) => { calls.push(args); } } },
  });
  trackEvent("test_event");
  consent = '{"analytics":false}';
  trackEvent("test_event");
  consent = "invalid json";
  trackEvent("test_event");
  assert.equal(calls.length, 0);
  consent = '{"analytics":true}';
  trackEvent("trial_code_requested", { channel: "sms" });
  assert.deepEqual(calls, [["trial_code_requested", { channel: "sms" }]]);
  const browser = (globalThis as any).window;
  browser.umami = undefined;
  trackEvent("test_event");
  browser.umami = { track: () => { throw new Error("tracker unavailable"); } };
  assert.doesNotThrow(() => trackEvent("test_event"));
  browser.umami = { track: () => Promise.reject(new Error("offline")) };
  trackEvent("test_event");
  await new Promise(resolve => setTimeout(resolve, 0));
  console.log("PASS: consent, SSR, absent tracker, sync and async failures; no network requests.");
}

main().catch(error => { console.error(error); process.exitCode = 1; });
