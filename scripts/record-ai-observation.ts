import fs from "node:fs";
import { pathToFileURL } from "node:url";
import { isPublicDiscoveryEntry } from "../shared/seo/referral";

export function observationRow(args: string[], now = new Date()): string[] {
  const allowed = new Set(["query", "market", "engine", "mentioned", "citation", "recommended", "evidence", "dry-run"]);
  const params = new Map<string, string>();
  for (const arg of args) {
    const match = arg.match(/^--([a-z-]+)(?:=(.*))?$/);
    if (!match || !allowed.has(match[1]) || params.has(match[1])) throw new Error(`Invalid or duplicate argument: ${arg}`);
    params.set(match[1], match[2] ?? "");
  }
  const bank = fs.readFileSync("docs/nuxa-consultas-ia.csv", "utf8").trim().split("\n").slice(1);
  const query = params.get("query") || "";
  if (!/^\d+$/.test(query) || !bank.some(line => line.split(";")[0] === query)) throw new Error("Unknown query ID");
  const market = params.get("market") || "";
  if (!["es-ES", "en-US", "en-GB", "fr-FR"].includes(market)) throw new Error("Unknown market");
  const engine = params.get("engine") || "";
  if (!["google", "bing", "chatgpt", "perplexity", "copilot", "gemini", "claude"].includes(engine)) throw new Error("Unknown engine");
  const mentioned = params.get("mentioned") || "";
  const recommended = params.get("recommended") || "";
  if (![mentioned, recommended].every(value => ["yes", "no"].includes(value))) throw new Error("Explicit mentioned/recommended yes or no required");
  const citation = params.get("citation");
  if (!citation) throw new Error("Use --citation=no or a verified public NUXA URL");
  let url = "";
  if (citation !== "no") {
    const parsed = new URL(citation);
    if (parsed.protocol !== "https:" || parsed.hostname !== "nuxa.life" || parsed.username || parsed.password || parsed.search || parsed.hash) throw new Error("Citation must be a public canonical NUXA URL without credentials, parameters or fragments");
    if (mentioned !== "yes") throw new Error("A citation requires mentioned=yes");
    if (!isPublicDiscoveryEntry(parsed.pathname)) throw new Error("Citation is not a recognised public document");
    url = parsed.href;
  }
  if (recommended === "yes" && mentioned !== "yes") throw new Error("A recommendation requires mentioned=yes");
  const evidence = params.get("evidence")?.trim() || "";
  if (!evidence || evidence.length > 300 || /[\r\n\u0000]/.test(evidence)) throw new Error("A short internal evidence reference is required (max 300 characters, no personal data)");
  return [now.toISOString(), query, market, engine, mentioned, url, recommended, evidence];
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = process.argv.slice(2);
  const row = observationRow(args);
  if (args.includes("--dry-run")) console.log(JSON.stringify({ mode: "dry-run", row }));
  else {
    const csv = row.map(value => {
      const safe = /^[=+\-@]/.test(value) ? "'" + value : value;
      return `"${safe.replace(/"/g, '""')}"`;
    }).join(";");
    fs.appendFileSync("docs/nuxa-observaciones-ia.csv", csv + "\n");
    console.log("Observation recorded; this command does not query any external engine.");
  }
}
