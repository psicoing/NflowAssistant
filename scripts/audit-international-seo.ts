import assert from "node:assert/strict";
import fs from "node:fs";
import { getLegacyRouteMetadata, injectRouteMetadata } from "../server/vite";
import { buildSitemap, readPublicAsset } from "../server/seo-discovery";
import {
  getAlternates, getInternationalPage, getPageById, getPageJsonLd,
  internationalPages, markets, seoAliases, SEO_SITE_URL,
} from "../shared/seo";
import { isNonIndexablePath } from "../shared/seo/policy";
import { INDEXNOW_KEY } from "../shared/seo/indexnow";
import { renderInternationalPage } from "../shared/seo/render";
import { internationalSeoPaths } from "../shared/seo/paths";

const args = process.argv.slice(2);
const base = args.find(arg => arg.startsWith("--base="))?.slice(7)?.replace(/\/$/, "");
const developmentProxy = Boolean(base && new URL(base).hostname.endsWith(".replit.dev"));
const template = fs.readFileSync("client/index.html", "utf8");
const sitemap = buildSitemap();
const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
const errors: string[] = [];
const results: string[] = [];
const esc = (value: unknown) => String(value ?? "").replace(/[&<>"']/g, character =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!);
const decode = (value: string) => value.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const tagText = (html: string, tag: string) => decode(html.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, "i"))?.[1]?.replace(/<[^>]*>/g, "") || "");
const canonicalOf = (html: string) => decode(html.match(/<link rel="canonical" href="([^"]+)"/)?.[1] || "");
const metaDescription = (html: string) => decode(html.match(/<meta name="description" content="([^"]*)"/)?.[1] || "");
const normalUrl = (url: string) => url.replace(/\/$/, "");

assert.equal(new Set(internationalPages.map(page => page.path)).size, internationalPages.length, "Duplicate paths");
assert.deepEqual([...internationalSeoPaths].sort(), internationalPages.map(page => page.path).sort(), "Exact lightweight routing manifest equals catalogue");
for (const page of internationalPages) {
  const html = injectRouteMetadata(template, page.path);
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `One H1: ${page.path}`);
  assert.equal(tagText(html, "h1"), page.h1);
  assert.equal(tagText(html, "title"), page.title);
  assert.equal(metaDescription(html), page.description);
  assert.equal(canonicalOf(html), SEO_SITE_URL + page.path);
  assert(html.includes(`<html lang="${markets[page.market].language}"`));
  assert(html.includes(renderInternationalPage(page)), `Same browser/server content: ${page.path}`);
  assert(!html.includes("_s.parentNode.removeChild"), `Persistent initial HTML: ${page.path}`);
  assert(page.sections.length >= 4, `Substantive sections: ${page.path}`);
  assert(page.sources.length > 0, `Sources: ${page.path}`);
  assert(page.faqs.length >= 2, `Useful FAQs: ${page.path}`);
  assert.equal(getAlternates(page).length, 5, `Four markets plus x-default: ${page.path}`);
  for (const alternate of getAlternates(page)) {
    const target = getInternationalPage(new URL(alternate.href).pathname);
    assert(target && target.id === page.id);
    assert(getAlternates(target).some(candidate => candidate.href === SEO_SITE_URL + page.path), "Reciprocal hreflang");
    assert(locations.includes(alternate.href), "Hreflang target in sitemap");
  }
  for (const id of page.relatedIds) assert(getPageById(id, page.market), `Related page ${id}: ${page.path}`);
  for (const schema of getPageJsonLd(page)) assert(JSON.parse(JSON.stringify(schema)), "Valid JSON-LD");
}
for (const loc of locations) assert(!isNonIndexablePath(new URL(loc).pathname), `No private/functional sitemap URLs: ${loc}`);
results.push(`Catalogue validated: ${internationalPages.length} pages, reciprocal hreflang, canonical, H1, schema and identical initial/visible content.`);

const httpStatuses = new Map<string, number>();
if (base) {
  // Concurrent reads only. No account creation, real payments or campaign sends.
  const previous = args.includes("--retry-failed") && fs.existsSync("reports/nuxa-seo-validacion.json")
    ? JSON.parse(fs.readFileSync("reports/nuxa-seo-validacion.json", "utf8")) : null;
  const failedPaths = previous?.errors.map((error: string) => error.split(":")[0]);
  if (previous) {
    for (const row of previous.rows) {
      if (/^\d+$/.test(row.http)) httpStatuses.set(new URL(row.url).pathname, Number(row.http));
    }
    results.push(`Recomprobación dirigida de fallos de transporte anteriores: ${failedPaths.join(", ")}. Se conservan las comprobaciones previas que no han cambiado.`);
  }
  const queue = locations.filter(loc => !previous || failedPaths.includes(new URL(loc).pathname));
  await Promise.all(Array.from({ length: 4 }, async () => {
    while (queue.length) {
      const loc = queue.shift()!;
      const pathname = new URL(loc).pathname;
      try {
        const response = await fetch(base + pathname, { redirect: "manual", signal: AbortSignal.timeout(25000) });
        const html = await response.text();
        httpStatuses.set(pathname, response.status);
        if (response.status !== 200) errors.push(`${pathname}: HTTP ${response.status}`);
        if (!tagText(html, "h1")) errors.push(`${pathname}: missing initial H1`);
        if (!metaDescription(html)) errors.push(`${pathname}: missing description`);
        if (normalUrl(canonicalOf(html)) !== normalUrl(loc)) errors.push(`${pathname}: canonical mismatch ${canonicalOf(html)}`);
        if (!developmentProxy && response.headers.get("x-robots-tag")?.includes("noindex")) errors.push(`${pathname}: noindex in sitemap`);
        const page = getInternationalPage(pathname);
        if (page && !html.includes(renderInternationalPage(page))) errors.push(`${pathname}: initial content mismatch`);
      } catch (error) {
        errors.push(`${pathname}: ${(error as Error).message}`);
      }
    }
  }));
  for (const ua of ["Googlebot", "Bingbot", "OAI-SearchBot"]) {
    for (const pathname of ["/es/", "/en-us/", "/en-gb/", "/fr/", "/en-us/anxiety"]) {
      const response = await fetch(base + pathname, { headers: { "User-Agent": ua }, signal: AbortSignal.timeout(20000) });
      if (response.status !== 200 || !(await response.text()).includes("nuxa-international")) errors.push(`${ua} cannot read ${pathname}`);
    }
  }
  // Do not invoke payment return handlers: HEAD can still run their GET logic.
  assert(isNonIndexablePath("/stripe-return"), "Payment returns are non-indexable");
  for (const pathname of ["/admin", "/admin/dashboard", "/account", "/private", "/chat", "/login", "/registro/planes", "/api/user"]) {
    try {
      const response = await fetch(base + pathname, { method: "HEAD", redirect: "manual", signal: AbortSignal.timeout(20000) });
      if (!response.headers.get("x-robots-tag")?.includes("noindex")) errors.push(`${pathname}: missing X-Robots-Tag`);
    } catch (error) { errors.push(`${pathname}: ${(error as Error).message}`); }
  }
  for (const pathname of ["/api/admin/users", "/api/empresa-contacts", "/api/institutions"]) {
    const response = await fetch(base + pathname, { redirect: "manual", signal: AbortSignal.timeout(20000) });
    const type = response.headers.get("content-type") || "";
    // Do not mistake the SPA fallback for protected API data.
    if (response.status === 200 && type.includes("application/json")) errors.push(`Unexpected anonymous API access: ${pathname}`);
    await response.body?.cancel();
  }
  for (const [alias, target] of Object.entries(seoAliases)) {
    const response = await fetch(base + alias, { redirect: "manual" });
    if (response.status !== 301 || response.headers.get("location") !== target) errors.push(`Alias redirect: ${alias}`);
    await response.body?.cancel();
  }
  const missing = await fetch(base + "/fr/not-a-published-page", { redirect: "manual" });
  if (missing.status !== 404) errors.push("Unknown localized URL is not a true 404");
  await missing.body?.cancel();
  const key = await fetch(base + `/${INDEXNOW_KEY}.txt`);
  if (!key.ok || (await key.text()).trim() !== INDEXNOW_KEY) errors.push("IndexNow public verification key unavailable");
  results.push(`HTTP checked ${locations.length} sitemap URLs; search-bot samples, alias redirects, localized 404, noindex and anonymous API-access samples.`);
  if (developmentProxy) results.push("El proxy .replit.dev añade noindex a todas las URLs por política de desarrollo; no es un fallo de indexabilidad de nuxa.life. Comprobar cabeceras privadas en el servidor de origen para no confundir capas.");
}

const legacy = getLegacyRouteMetadata();
const allPaths = [...new Set([...Object.keys(legacy), ...internationalPages.map(page => page.path)])];
const rows = allPaths.map(pathname => {
  const page = getInternationalPage(pathname);
  const html = injectRouteMetadata(template, pathname);
  const jsonLd = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
    .map(match => JSON.parse(match[1])["@type"]).join(", ");
  const loc = page ? SEO_SITE_URL + page.path : legacy[pathname]?.canonical;
  const indexable = !isNonIndexablePath(pathname);
  return {
    url: loc,
    country: page ? markets[page.market].country : "España",
    language: page ? markets[page.market].language : "es-ES",
    title: tagText(html, "title"),
    description: metaDescription(html),
    h1: tagText(html, "h1"),
    canonical: canonicalOf(html),
    hreflang: page ? getAlternates(page).map(item => `${item.hreflang}: ${item.href}`).join("\n") : "— (sin equivalentes internacionales)",
    schema: jsonLd || "—",
    sitemap: locations.some(url => normalUrl(url) === normalUrl(loc || "")) ? "YES" : "NO",
    indexable: indexable ? "YES" : "NO",
    http: base ? String(httpStatuses.get(pathname) ?? "No incluido en sitemap") : "Pendiente de prueba HTTP",
  };
});
const headers = ["URL", "País", "Idioma", "Title", "Meta description", "H1", "Canonical", "hreflang", "Schema", "Sitemap", "Indexable", "HTTP"];
const keys = ["url", "country", "language", "title", "description", "h1", "canonical", "hreflang", "schema", "sitemap", "indexable", "http"] as const;
const htmlReport = `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>NUXA · Auditoría y entrega SEO internacional</title><style>
body{font:15px/1.6 system-ui,sans-serif;margin:0;background:#10232d;color:#dcece7}main{padding:30px;max-width:1700px;margin:auto}h1,h2{color:#8de0c1}a{color:#f5a385}section{margin:28px 0}table{border-collapse:collapse;background:#173640}th,td{padding:12px;border:1px solid #31535a;vertical-align:top;min-width:170px}th{text-align:left;color:#8de0c1}td{white-space:pre-wrap;overflow-wrap:anywhere}pre{white-space:pre-wrap;overflow-wrap:anywhere;background:#173640;padding:20px;border-radius:12px}.table{overflow:auto}.notice{border-left:4px solid #f5a385;padding:14px;background:#173640}.error{color:#ffc0a5}
</style></head><body><main><h1>NUXA · Entrega SEO internacional</h1>
<p>Generado ${esc(new Date().toISOString())}. ${internationalPages.length} páginas del catálogo; ${locations.length} URLs públicas en sitemap. Las URLs españolas anteriores se conservan.</p>
<p class="notice">Validación: ${base ? "entorno de desarrollo, no publicación" : "contenido y configuración locales"}. No se garantiza indexación, posicionamiento ni citación por IA. El despliegue publicado conserva la versión anterior hasta volver a publicar.</p>
<section><h2>Resultados</h2><ul>${results.map(result => `<li>${esc(result)}</li>`).join("")}</ul><h3>Errores de validación</h3><pre class="error">${esc(errors.length ? errors.join("\n") : "No se detectaron errores en las comprobaciones ejecutadas.")}</pre></section>
<section><h2>Qué se encontró y se corrigió</h2><ul>
<li>Faltaban URLs por mercado y hreflang: se añadieron variantes adaptadas, autocanonical y referencias recíprocas es-ES/en-US/en-GB/fr-FR/x-default.</li>
<li>Contenido SEO y contenido visible se mantenían por separado: el catálogo internacional y el blog revisado ahora comparten fuente. Las nuevas páginas tienen contenido persistente en el HTML inicial para todos los visitantes.</li>
<li>Metadatos de confianza contenían autores, credenciales, valoraciones y resultados sin respaldo visible: se retiraron esas afirmaciones del blog revisado y los schemas generales.</li>
<li>OAI-SearchBot no estaba reconocido en la ruta prerenderizada: se añadió sin cambiar la política existente de entrenamiento/GPTBot.</li>
<li>El sitemap incluía login/registro: se excluyeron del sitemap, sin eliminar sus rutas; se añadieron directivas noindex a documentos privados/transaccionales.</li>
<li>IndexNow no existía: hay clave pública y comando de envío explícito con validación de la publicación. No se han enviado URLs ni modificado DNS.</li>
</ul></section>
<section><h2>Inventario completo por URL</h2><div class="table"><table><thead><tr>${headers.map(header => `<th>${header}</th>`).join("")}</tr></thead><tbody>${rows.map(row => `<tr>${keys.map(key => `<td>${esc(row[key])}</td>`).join("")}</tr>`).join("")}</tbody></table></div></section>
<section><h2>Crawlers y políticas</h2><p>Googlebot, Bingbot y OAI-SearchBot pueden rastrear el contenido público según robots.txt y las pruebas indicadas. GPTBot conserva la política anterior; permitir búsqueda no exige permitir entrenamiento. Robots/noindex no son mecanismos de autenticación.</p></section>
<section><h2>Comprobaciones de compilación y errores preexistentes</h2><p>La compilación de producción (Vite y servidor) se completó. La comprobación global TypeScript sigue mostrando ocho errores en cuatro archivos ajenos al cambio SEO: declaraciones incompatibles de Google Translate y un evento sin tipo en los dos componentes de traducción, y campos subscriptionPlan fuera del contrato de usuario en server/routes.ts y server/routes_clean.ts. No se alteraron registro o autenticación para resolverlos. Los errores introducidos durante la separación del catálogo y la construcción del sitemap sí se corrigieron.</p><p>El proxy de desarrollo de Replit añade noindex a todas las páginas; el servidor de origen permite verificar la política de la app sin confundirla con esa protección de desarrollo. El retorno de Stripe sin identificador de sesión no respondió en una muestra HTTP; no se repitieron pruebas de pago ni se modificó ese proceso, ya cubierto por la tarea de verificación de checkout existente.</p></section>
<section><h2>Acciones manuales y límites</h2><ol>
<li>Publicar los cambios y repetir comprobaciones contra nuxa.life, incluyendo posibles reglas externas de CDN/firewall/rate limiting que no son visibles desde este repositorio.</li>
<li>En Google Search Console y Bing Webmaster Tools, verificar acceso a la propiedad, enviar https://nuxa.life/sitemap.xml y usar sus inspecciones de URL e informes por país/consulta/página/CTR. Los informes de citaciones IA solo cuando cada plataforma los ofrezca.</li>
<li>Después de publicar, ejecutar el comando IndexNow con --submit. La respuesta de aceptación no garantiza indexación.</li>
<li>La atribución editorial es institucional, no aprobación clínica. Confirmar documentalmente credenciales, identidad, cualquier certificación y afirmaciones del resto de páginas comerciales antes de anunciarlas como verificadas.</li>
<li>Revisión legal de privacidad, edad/menores, condiciones y coherencia del aviso legal (menciona un dominio antiguo). Las guías localizadas de privacidad no sustituyen los documentos legales españoles.</li>
<li>Medición de altas orgánicas: conservar consentimiento de analítica y eventos existentes; vincular informes de tráfico/landing pages a registros solo con una configuración y base legal confirmadas. No se conectaron cuentas externas ni se añadieron rastreadores.</li>
<li>Login, registro, chat, Stripe y PWA no se han rediseñado ni modificado en su lógica. Las verificaciones HTTP no equivalen a un pago real ni a una sesión de chat completa.</li>
</ol></section>
<section><h2>robots.txt final</h2><pre>${esc(readPublicAsset("robots.txt"))}</pre></section>
<section><h2>sitemap.xml final</h2><pre>${esc(sitemap)}</pre></section>
<section><h2>llms.txt final</h2><pre>${esc(readPublicAsset("llms.txt"))}</pre><p>llms.txt es complementario y no garantiza que ningún motor lo consulte.</p></section>
</main></body></html>`;
fs.mkdirSync("reports", { recursive: true });
fs.writeFileSync("reports/nuxa-seo-internacional.html", htmlReport);
fs.writeFileSync("reports/nuxa-seo-inventario.csv", "\ufeff" + [headers, ...rows.map(row => keys.map(key => row[key]))]
  .map(row => row.map(value => `"${String(value ?? "").replace(/"/g, '""')}"`).join(";")).join("\n"));
fs.writeFileSync("reports/nuxa-sitemap-final.xml", sitemap);
fs.writeFileSync("reports/nuxa-seo-validacion.json", JSON.stringify({ results, errors, rows }, null, 2));
console.log(results.join("\n"));
console.log(`Report saved: reports/nuxa-seo-internacional.html; errors=${errors.length}`);
if (errors.length) { console.error(errors.join("\n")); process.exitCode = 1; }