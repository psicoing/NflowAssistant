import { isPublishedSeoPath } from "./paths";
import { isNonIndexablePath } from "./policy";

export type DiscoveryEngine = "google" | "bing" | "chatgpt" | "perplexity" | "copilot" | "gemini" | "claude" | "other_external" | "unknown";
export type DiscoveryReferral = { engine: DiscoveryEngine; market: "es" | "en-us" | "en-gb" | "fr" };
const legacyPublic = new Set([
  "/", "/blog", "/blog/1", "/blog/2", "/blog/3", "/recursos",
  "/recursos-gratuitos", "/precios", "/prueba-gratis", "/ejemplos-chat",
  "/nosotros", "/quienes-somos", "/app-movil", "/novedades",
  "/empresa-privada", "/sector-publico", "/control-parental", "/competencia-nuxa",
  "/legal/privacidad", "/legal/terminos", "/legal/cookies", "/legal/aviso-legal",
]);
export function isPublicDiscoveryEntry(pathname: string): boolean {
  if (isNonIndexablePath(pathname)) return false;
  const path = pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
  return isPublishedSeoPath(path) || legacyPublic.has(path);
}
const domains: [DiscoveryEngine, string[]][] = [
  ["chatgpt", ["chatgpt.com", "chat.openai.com"]],
  ["perplexity", ["perplexity.ai"]],
  ["copilot", ["copilot.microsoft.com"]],
  ["gemini", ["gemini.google.com"]],
  ["claude", ["claude.ai"]],
  ["google", ["google.com", "google.es", "google.co.uk", "google.fr", "google.ca", "google.de", "google.com.au"]],
  ["bing", ["bing.com"]],
];
export function classifyDiscoveryReferral(referrer: string, pathname: string, origin: string): DiscoveryReferral | null {
  if (!isPublicDiscoveryEntry(pathname)) return null;
  const prefix = pathname.split("/")[1];
  const market: DiscoveryReferral["market"] = prefix === "en-us" || prefix === "en-gb" || prefix === "fr" ? prefix : "es";
  if (!referrer) return { engine: "unknown", market };
  try {
    const url = new URL(referrer);
    if (!["http:", "https:"].includes(url.protocol)) return { engine: "unknown", market };
    const host = url.hostname.toLowerCase();
    const ownHost = new URL(origin).hostname.toLowerCase();
    if (host === ownHost || host === "nuxa.life" || host === "www.nuxa.life") return null;
    const engine = domains.find(([, hosts]) => hosts.some(domain => host === domain || host.endsWith("." + domain)))?.[0] || "other_external";
    return { engine, market };
  } catch {
    return { engine: "unknown", market };
  }
}
