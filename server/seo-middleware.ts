import fs from "fs";
import path from "path";
import type { Express } from "express";
import { injectRouteMetadata, isPrerenderablePublicPath } from "./vite";

// Recognise search engines, social crawlers, and AI crawlers that need
// pre-rendered HTML because they do not (fully) execute JavaScript.
const BOT_UA =
  /googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|sogou|exabot|facebot|facebookexternalhit|twitterbot|rogerbot|linkedinbot|embedly|quora|outbrain|pinterest|slack|whatsapp|telegram|discord|gptbot|claudebot|perplexitybot|anthropic|ccbot|cohere|meta-externalagent|ia_archiver|archive\.org/i;

export function registerSeoMiddleware(app: Express, isProd: boolean) {
  app.use(async (req, res, next) => {
    const ua = req.headers["user-agent"] || "";
    if (!BOT_UA.test(ua)) return next();

    // Only answer known public document routes. This leaves robots.txt,
    // sitemaps, llms.txt, APIs and static assets to their normal handlers.
    if (
      !["GET", "HEAD"].includes(req.method) ||
      path.extname(req.path) ||
      !isPrerenderablePublicPath(req.path)
    ) {
      return next();
    }

    try {
      const htmlPath = isProd
        ? path.resolve(process.cwd(), "dist", "public", "index.html")
        : path.resolve(process.cwd(), "client", "index.html");

      const html = await fs.promises.readFile(htmlPath, "utf-8");

      // Delegate all metadata + JSON-LD + body injection to the shared
      // injectRouteMetadata function so bots and regular users receive
      // identical enriched HTML.
      const injected = injectRouteMetadata(html, req.originalUrl);

      res.status(200).set("Content-Type", "text/html").end(
        req.method === "HEAD" ? undefined : injected,
      );
    } catch {
      next();
    }
  });
}
