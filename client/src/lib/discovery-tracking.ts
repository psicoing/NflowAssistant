import { classifyDiscoveryReferral, isPublicDiscoveryEntry } from "@shared/seo/referral";
import { trackEvent } from "./analytics";

let sent = false;
/** One consented entry per document, not an event on each SPA page transition.
 * No persistent identifier, raw URL, search terms or conversation data.
 * Absence of a referrer is explicitly unknown, never "no AI traffic".
 */
export function startDiscoveryTracking(): () => void {
  if (sent || typeof window === "undefined") return () => {};
  // Skip URL parameters/fragments: never add events to token-bearing URLs.
  if (window.location.search || window.location.hash) return () => {};
  const referral = classifyDiscoveryReferral(document.referrer, window.location.pathname, window.location.origin);
  if (!referral) return () => {};
  let active = true;
  let ticks = 0;
  let timer: ReturnType<typeof setInterval> | undefined;
  const stop = () => {
    active = false;
    if (timer !== undefined) clearInterval(timer);
    document.removeEventListener("click", afterClick);
    window.removeEventListener("storage", attempt);
    window.removeEventListener("load", attempt);
  };
  function attempt() {
    if (!active) return;
    if (sent) { stop(); return; }
    // Consent may be given after arrival. Never emit after entering a private
    // page, or let default tracker metadata pick up functional URL parameters.
    if (!isPublicDiscoveryEntry(window.location.pathname) || window.location.search || window.location.hash) { stop(); return; }
    let consent = false;
    try { consent = JSON.parse(localStorage.getItem("cookie-consent") || "{}").analytics === true; } catch { /* no valid consent */ }
    if (!consent || !window.umami?.track) return;
    trackEvent("public_discovery_entry", { engine: referral!.engine, market: referral!.market });
    sent = true;
    stop();
  }
  function afterClick() {
    // Wait until a cookie preference handler has saved the user's choice.
    queueMicrotask(attempt);
  }
  document.addEventListener("click", afterClick);
  window.addEventListener("storage", attempt);
  window.addEventListener("load", attempt);
  timer = setInterval(() => {
    attempt();
    if (++ticks >= 30 && timer !== undefined) clearInterval(timer);
  }, 1000);
  attempt();
  return stop;
}
