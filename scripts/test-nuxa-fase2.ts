import assert from "node:assert/strict";
import fs from "node:fs";
import { internationalPages, getPageJsonLd, getInternationalPage, SEO_SITE_URL } from "../shared/seo";
import { entityDefinition, nuxaHomeDescription } from "../shared/seo/entity-definition";
import { renderInternationalPage } from "../shared/seo/render";
import { internationalSeoPaths } from "../shared/seo/paths";
import { classifyDiscoveryReferral, isPublicDiscoveryEntry } from "../shared/seo/referral";
import { observationRow } from "./record-ai-observation";
import { startDiscoveryTracking } from "../client/src/lib/discovery-tracking";
import { injectRouteMetadata } from "../server/vite";

const escape = (value: string) => value.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
assert.equal(internationalPages.length, 100);
assert.equal(new Set(internationalSeoPaths).size, 100);
// Fixed acceptance baseline: never depend on HEAD, which advances at checkpoints.
const institutionalIds = ["about-nuxa", "how-nuxa-works", "science", "safety", "privacy", "for-organizations", "for-professionals", "editorial-policy"];
const oldPaths = [
  ...["es", "en-us", "en-gb", "fr"].flatMap(market => [`/${market}/`, ...institutionalIds.map(id => `/${market}/${id}`)]),
  "/bienestar-emocional", "/en-us/emotional-wellbeing", "/en-gb/emotional-wellbeing", "/fr/bien-etre-emotionnel",
  "/ansiedad", "/en-us/anxiety", "/en-gb/anxiety", "/fr/anxiete",
  "/ansiedad-antes-de-dormir", "/en-us/anxiety-before-sleep", "/en-gb/anxiety-before-sleep", "/fr/anxiete-avant-de-dormir",
  "/estres-laboral", "/en-us/work-stress", "/en-gb/work-stress", "/fr/stress-au-travail",
  "/duelo", "/en-us/grief", "/en-gb/grief", "/fr/deuil",
  "/soledad", "/en-us/loneliness", "/en-gb/loneliness", "/fr/solitude",
  "/autoestima", "/en-us/self-esteem", "/en-gb/self-esteem", "/fr/estime-de-soi",
  "/ruptura-de-pareja", "/en-us/breakup", "/en-gb/breakup", "/fr/rupture-amoureuse",
  "/limites-sin-culpa", "/en-us/healthy-boundaries", "/en-gb/healthy-boundaries", "/fr/poser-ses-limites",
  "/ansiedad-adolescentes", "/en-us/teen-anxiety", "/en-gb/teen-anxiety", "/fr/anxiete-chez-les-adolescents",
  "/es/agotamiento-emocional", "/en-us/emotional-exhaustion", "/en-gb/emotional-exhaustion", "/fr/epuisement-emotionnel",
  "/es/conflictos-familiares", "/en-us/family-conflict", "/en-gb/family-conflict", "/fr/conflits-familiaux",
];
assert.equal(oldPaths.length, 84);
for (const path of oldPaths) assert(getInternationalPage(path), `Preserved URL: ${path}`);

for (const page of internationalPages) {
  const html = renderInternationalPage(page);
  assert(html.includes(escape(entityDefinition[page.market].text)), `Visible identity: ${page.path}`);
  assert(html.includes('href="/prueba-gratis"') && html.includes('href="/precios"'));
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1);
  assert.equal(new Set(page.faqs.map(faq => faq.question)).size, page.faqs.length, `Unique FAQs: ${page.path}`);
  const faq = getPageJsonLd(page).find(schema => (schema as any)["@type"] === "FAQPage") as any;
  assert.equal(faq.mainEntity.length, page.faqs.length);
  for (const [index, item] of faq.mainEntity.entries()) {
    assert.equal(item.name, page.faqs[index].question);
    assert.equal(item.acceptedAnswer.text, page.faqs[index].answer);
    assert(html.includes(escape(item.name)) && html.includes(escape(item.acceptedAnswer.text)), `Visible FAQ/schema parity: ${page.path}`);
  }
}
const template = fs.readFileSync("client/index.html", "utf8");
const root = injectRouteMetadata(template, "/");
assert(root.includes(nuxaHomeDescription));
assert(root.includes(entityDefinition.es.text));
assert(!root.includes("5 consultas gratuitas sin registro"));
assert(!root.includes("Totalmente confidencial y seguro"));
console.log("Content block: 100 pages; all 84 original URLs preserved; identity and visible FAQ/schema parity.");

const bank = fs.readFileSync("docs/nuxa-consultas-ia.csv", "utf8").trim().split("\n");
assert.equal(bank.length, 51);
assert.equal(new Set(bank.slice(1).map(line => line.split(";")[0])).size, 50);
for (const line of bank.slice(1)) {
  const values = line.split(";");
  assert.equal(values.length, 6);
  assert(values.slice(2).every(value => value.length > 12 && !/nuxa/i.test(value)));
}
const options = ["--query=16", "--market=es-ES", "--engine=chatgpt", "--mentioned=no", "--citation=no", "--recommended=no", "--evidence=Test fixture, not a real observation"];
assert.equal(observationRow(options, new Date("2026-10-05T12:00:00Z"))[5], "");
assert.throws(() => observationRow(options.map(arg => arg === "--query=16" ? "--query=51" : arg)));
assert.throws(() => observationRow(options.filter(arg => !arg.startsWith("--evidence="))));
for (const url of ["https://nuxa.life/chat", "https://nuxa.life/api/user", "https://nuxa.life/stripe-return", "https://nuxa.life/partners/dashboard", "https://nuxa.life/?token=secret", "https://another-site.example/"]) {
  assert.throws(() => observationRow(options.map(arg => arg === "--citation=no" ? `--citation=${url}` : arg === "--mentioned=no" ? "--mentioned=yes" : arg)));
}
console.log("Evaluation block: 50 non-brand intents / 200 variants; evidence and public-citation guards.");

for (const [host, engine] of [
  ["www.google.es", "google"], ["www.bing.com", "bing"], ["chatgpt.com", "chatgpt"],
  ["chat.openai.com", "chatgpt"], ["www.perplexity.ai", "perplexity"],
  ["copilot.microsoft.com", "copilot"], ["gemini.google.com", "gemini"], ["claude.ai", "claude"],
  ["chatgpt.com.attacker.example", "other_external"], ["notchatgpt.com", "other_external"],
]) {
  assert.deepEqual(classifyDiscoveryReferral(`https://${host}/?private=ignored`, "/fr/ressources-gratuites-bien-etre", SEO_SITE_URL), { engine, market: "fr" });
}
assert.deepEqual(classifyDiscoveryReferral("", "/en-us/anxiety", SEO_SITE_URL), { engine: "unknown", market: "en-us" });
assert.equal(classifyDiscoveryReferral("https://nuxa.life/blog", "/ansiedad", SEO_SITE_URL), null);
for (const path of ["/chat", "/admin", "/account", "/api/user", "/login", "/registro/planes", "/stripe-return", "/acceso/token", "/partners/dashboard", "/unknown-page"]) {
  assert(!isPublicDiscoveryEntry(path));
  assert.equal(classifyDiscoveryReferral("https://chatgpt.com", path, SEO_SITE_URL), null);
}

// Cheap browser-boundary tests: no real accounts, external traffic or analytics.
const listeners = new Map<string, Function>();
const events: { name: string; data: unknown }[] = [];
let consent = "{}";
const fakeLocation = { pathname: "/en-us/anxiety", origin: SEO_SITE_URL, search: "", hash: "" };
const fakeWindow: any = {
  location: fakeLocation,
  addEventListener: (name: string, callback: Function) => listeners.set(name, callback),
  removeEventListener: (name: string) => listeners.delete(name),
};
(globalThis as any).window = fakeWindow;
(globalThis as any).document = {
  referrer: "https://chatgpt.com/share/not-recorded",
  addEventListener: (name: string, callback: Function) => listeners.set(name, callback),
  removeEventListener: (name: string) => listeners.delete(name),
};
(globalThis as any).localStorage = { getItem: () => consent };
fakeWindow.umami = { track: (name: string, data: unknown) => events.push({ name, data }) };
const denied = startDiscoveryTracking();
assert.equal(events.length, 0);
denied();
consent = '{"analytics":false}';
const rejected = startDiscoveryTracking();
assert.equal(events.length, 0);
rejected();
fakeLocation.pathname = "/chat";
consent = '{"analytics":true}';
startDiscoveryTracking();
assert.equal(events.length, 0);
fakeLocation.pathname = "/en-us/anxiety";
fakeLocation.search = "?token=private";
startDiscoveryTracking();
assert.equal(events.length, 0);
fakeLocation.search = "";
consent = "{}";
const leavePublic = startDiscoveryTracking();
fakeLocation.pathname = "/chat";
consent = '{"analytics":true}';
listeners.get("click")?.();
await Promise.resolve();
assert.equal(events.length, 0);
leavePublic();
fakeLocation.pathname = "/en-us/anxiety";
consent = "{}";
delete fakeWindow.umami;
const late = startDiscoveryTracking();
consent = '{"analytics":true}';
listeners.get("click")?.();
await Promise.resolve();
assert.equal(events.length, 0, "Provider missing is not collected data");
fakeWindow.umami = { track: (name: string, data: unknown) => events.push({ name, data }) };
listeners.get("load")?.();
assert.deepEqual(events, [{ name: "public_discovery_entry", data: { engine: "chatgpt", market: "en-us" } }]);
startDiscoveryTracking();
assert.equal(events.length, 1, "No duplicate entry");
late();
console.log("Tracking block: source classification, consent, delayed provider, no sensitive URL/private route events, deduplication.");
