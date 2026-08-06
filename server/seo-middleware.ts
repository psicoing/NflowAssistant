import fs from "fs";
import path from "path";
import type { Express } from "express";
import { injectRouteMetadata } from "./vite";

// Recognise search engines, social crawlers, and AI crawlers that need
// pre-rendered HTML because they do not (fully) execute JavaScript.
const BOT_UA =
  /googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|sogou|exabot|facebot|facebookexternalhit|twitterbot|rogerbot|linkedinbot|embedly|quora|outbrain|pinterest|slack|whatsapp|telegram|discord|gptbot|claudebot|perplexitybot|anthropic|ccbot|cohere|meta-externalagent|ia_archiver|archive\.org/i;

export function registerSeoMiddleware(app: Express, isProd: boolean) {
  app.use(async (req, res, next) => {
    const ua = req.headers["user-agent"] || "";
    if (!BOT_UA.test(ua)) return next();

    // Only handle public-facing HTML routes — skip API, admin, and partner dashboard
    if (
      req.path.startsWith("/api") ||
      req.path.startsWith("/admin") ||
      req.path.startsWith("/partners/dashboard")
    ) {
      return next();
    }

    try {
      const htmlPath = isProd
        ? path.resolve(process.cwd(), "server", "public", "index.html")
        : path.resolve(process.cwd(), "client", "index.html");

      const html = await fs.promises.readFile(htmlPath, "utf-8");

      // Delegate all metadata + JSON-LD + body injection to the shared
      // injectRouteMetadata function so bots and regular users receive
      // identical enriched HTML.
      const injected = injectRouteMetadata(html, req.path);

      res.status(200).set("Content-Type", "text/html").end(injected);
    } catch {
      next();
    }
  });
}
