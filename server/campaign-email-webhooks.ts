import express, { type Express } from "express";
import type { CampaignEmailStore } from "./campaign-email-store";
import { parseMailEvents, verifyMailWebhook, type EmailProvider } from "./campaign-email-events";

export function registerCampaignEmailWebhooks(app: Express, store: Pick<CampaignEmailStore, "ingest">) {
  for (const provider of ["sendgrid", "resend"] as EmailProvider[]) {
    app.post(`/api/webhooks/${provider}`, express.raw({ type: "application/json", limit: "1mb" }), async (req, res) => {
      const key = provider === "sendgrid" ? process.env.SENDGRID_EVENT_PUBLIC_KEY : process.env.RESEND_WEBHOOK_SECRET;
      if (!key) return res.status(503).json({ error: "Webhook verification not configured" });
      if (!Buffer.isBuffer(req.body) || !verifyMailWebhook(provider, req.body, req.headers, key)) {
        return res.status(401).json({ error: "Invalid webhook signature" });
      }
      let events;
      try { events = parseMailEvents(provider, req.body, req.get("svix-id")); }
      catch { return res.status(400).json({ error: "Invalid event payload" }); }
      try {
        await store.ingest(events);
        return res.json({ ok: true });
      } catch {
        // Non-200 so the provider can retry; never log the body or SDK headers.
        console.error(`Campaign ${provider} webhook storage unavailable`);
        return res.status(503).json({ error: "Event storage unavailable" });
      }
    });
  }
}
