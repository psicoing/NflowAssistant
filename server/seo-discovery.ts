import fs from "node:fs";
import path from "node:path";
import type { Express } from "express";
import {
  getAlternates, getInternationalPage, internationalPages, isInternationalNamespace,
  normalizeSeoPath, seoAliases, SEO_SITE_URL,
} from "../shared/seo";
import { isNonIndexablePath } from "../shared/seo/policy";
import { INDEXNOW_KEY } from "../shared/seo/indexnow";
import { updatedLegacySeoPages } from "../shared/seo/published-updates";

function escapeXml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
}
export function readPublicAsset(name: string): string {
  const base = process.env.NODE_ENV === "production" ? "dist/public" : "client/public";
  return fs.readFileSync(path.resolve(process.cwd(), base, name), "utf8");
}
/** Keep existing Spanish URLs, excluding functional/private routes, then add
 * actual published catalogue entries. No inferred/wildcard URLs are generated. */
export function buildSitemap(existingXml = readPublicAsset("sitemap.xml")): string {
  const entries = new Map<string, string>();
  const updatedLegacy = new Map(updatedLegacySeoPages.map(page => [page.path, page.updatedAt]));
  for (const match of Array.from(existingXml.matchAll(/<url>[\s\S]*?<\/url>/g))) {
    const loc = match[0].match(/<loc>([^<]+)<\/loc>/)?.[1];
    if (!loc) continue;
    const url = new URL(loc);
    if (url.origin !== SEO_SITE_URL || isNonIndexablePath(url.pathname)) continue;
    if (getInternationalPage(url.pathname)) continue;
    const lastmod = updatedLegacy.get(url.pathname);
    const entry = lastmod
      ? (/<lastmod>/.test(match[0])
        ? match[0].replace(/<lastmod>[^<]*<\/lastmod>/, `<lastmod>${lastmod}</lastmod>`)
        : match[0].replace("</loc>", `</loc><lastmod>${lastmod}</lastmod>`))
      : match[0];
    entries.set(normalizeSeoPath(url.pathname), entry);
  }
  for (const page of internationalPages) {
    const alternateTags = getAlternates(page).map(alternate =>
      `<xhtml:link rel="alternate" hreflang="${alternate.hreflang}" href="${escapeXml(alternate.href)}"/>`,
    ).join("\n    ");
    entries.set(normalizeSeoPath(page.path), `<url>
    <loc>${SEO_SITE_URL}${page.path}</loc>
    <lastmod>${page.updatedAt}</lastmod>
    ${alternateTags}
  </url>`);
  }
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  ${Array.from(entries.values()).join("\n  ")}
</urlset>`;
}

export function registerSeoDiscovery(app: Express) {
  app.use((req, res, next) => {
    if (isNonIndexablePath(req.path)) res.setHeader("X-Robots-Tag", "noindex, nofollow");
    next();
  });
  app.get("/sitemap.xml", (_req, res) => {
    res.set("Cache-Control", "public, max-age=300").type("application/xml").send(buildSitemap());
  });
  app.get(`/${INDEXNOW_KEY}.txt`, (_req, res) => {
    res.type("text/plain").send(INDEXNOW_KEY);
  });
  app.use((req, res, next) => {
    if (!["GET", "HEAD"].includes(req.method)) return next();
    const clean = normalizeSeoPath(req.path);
    const target = seoAliases[clean];
    if (target) return res.redirect(301, target);
    const page = getInternationalPage(req.path);
    if (page && req.path !== page.path) return res.redirect(301, page.path);
    if (!page && isInternationalNamespace(req.path)) {
      return res.status(404).set("X-Robots-Tag", "noindex").type("html").send(
        '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>Page not found | NUXA</title></head><body><main><h1>Page not found</h1><p>This public page does not exist.</p><a href="/es/">España</a> · <a href="/en-us/">United States</a> · <a href="/en-gb/">United Kingdom</a> · <a href="/fr/">France</a></main></body></html>',
      );
    }
    next();
  });
}