import type { Express, Request } from "express";
import type { Pool, PoolClient } from "@neondatabase/serverless";
import { createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import {
  STRIPE_LETTER_CTA, STRIPE_LETTERS, type StripeLetterLanguage,
} from "@shared/stripe-commercial-letter";

const draftSchema = z.object({
  subject: z.string().trim().min(1).max(180).refine(s => !/[\r\n]/.test(s)),
  body: z.string().trim().min(1).max(10_000),
}).strict();
const tokenPattern = /^v1\.([1-9]\d{0,9})\.([A-Za-z0-9_-]{43})$/;
const escapeHtml = (s: string) => s.replace(/[&<>"']/g, c => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
}[c]!));

/** Purpose-separated, email-bound and unguessable; token contains no address. */
export function createStripeUnsubscribeToken(contact: { id: number; email: string }, secret: string) {
  if (!secret) throw new Error("Unsubscribe signing unavailable");
  const signature = createHmac("sha256", secret)
    .update(`stripe-commercial-unsubscribe:v1:${contact.id}:${contact.email.trim().toLowerCase()}`)
    .digest("base64url");
  return `v1.${contact.id}.${signature}`;
}

export function verifyStripeUnsubscribeToken(token: string, contact: { id: number; email: string }, secret: string) {
  if (!secret || !tokenPattern.test(token)) return false;
  const expected = createStripeUnsubscribeToken(contact, secret);
  const a = Buffer.from(token), b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Future sends must call this with the actual, authorized recipient's URL.
 * This module deliberately has no sender and does not grant authorization.
 */
export function renderStripeCommercialLetter(
  draft: { subject: string; body: string }, unsubscribeUrl: string, language: StripeLetterLanguage = "es",
) {
  if (!unsubscribeUrl.startsWith("https://nuxa.life/api/stripe-commercial/unsubscribe?token=")) {
    throw new Error("Expected a recipient-specific unsubscribe URL");
  }
  const token = new URL(unsubscribeUrl).searchParams.get("token") || "";
  if (!tokenPattern.test(token)) throw new Error("Invalid unsubscribe token");
  const valid = draftSchema.parse(draft);
  const copy = STRIPE_LETTERS[language];
  return {
    subject: valid.subject,
    text: `${valid.body}\n\n${copy.ctaLabel}: ${STRIPE_LETTER_CTA.url}\n\n${copy.footer}\n${copy.unsubscribeLabel}: ${unsubscribeUrl}`,
    html: `<div lang="${language}" style="font-family:Arial,sans-serif;max-width:600px;margin:auto;line-height:1.7;color:#172033">
<h2>NUXA</h2><div style="white-space:pre-wrap">${escapeHtml(valid.body)}</div>
 <p><a href="${STRIPE_LETTER_CTA.url}" style="display:inline-block;background:#f97316;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none">${copy.ctaLabel}</a></p>
 <hr><p style="font-size:12px">${copy.footer}</p>
 <a href="${escapeHtml(unsubscribeUrl)}">${copy.unsubscribeLabel}</a></div>`,
  };
}

const publicEnglish: Record<string, string> = {
  "Vista previa de la baja": "Unsubscribe preview",
  "Este enlace es una demostración de la carta. No se ha dado de baja a ningún contacto. En un envío autorizado, el enlace sería personal.": "This is a preview link. No contact has been unsubscribed. An authorised email includes a personal link.",
  "Enlace no válido": "Invalid link",
  "No se ha realizado ningún cambio.": "No changes have been made.",
  "Servicio no disponible": "Service unavailable",
  "Vuelve a intentarlo más tarde.": "Please try again later.",
  "No se ha realizado ningún cambio. Vuelve a intentarlo más tarde.": "No changes have been made. Please try again later.",
  "Baja de comunicaciones comerciales": "Unsubscribe from marketing emails",
  "Confirma si no deseas recibir más comunicaciones comerciales.": "Confirm if you no longer wish to receive marketing emails.",
  "Baja registrada": "You have been unsubscribed",
  "Tu dirección ha quedado excluida de las comunicaciones comerciales del sistema.": "Your address has been excluded from the system's marketing emails.",
  "No se ha podido registrar la baja": "Unable to unsubscribe",
};
function page(title: string, message: string, token?: string, language: StripeLetterLanguage = "es") {
  if (language === "en") { title = publicEnglish[title] || title; message = publicEnglish[message] || message; }
  return `<!doctype html><html lang="${language}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${title} · NUXA</title></head>
<body style="font-family:Arial,sans-serif;background:#f1f5f9;padding:32px;color:#172033"><main style="max-width:520px;margin:40px auto;background:white;padding:28px;border-radius:16px"><h1>${title}</h1><p>${message}</p>
 ${token ? `<form method="post" action="/api/stripe-commercial/unsubscribe"><input type="hidden" name="token" value="${escapeHtml(token)}"><input type="hidden" name="language" value="${language}"><button style="padding:12px 18px;background:#172033;color:white;border:0;border-radius:8px" type="submit">${language === "en" ? "Confirm unsubscribe" : "Confirmar baja comercial"}</button></form>` : ""}
 <p>${language === "en" ? "Unsubscribing does not delete your NUXA account or cancel subscriptions or payments." : "Esta baja no elimina cuentas de NUXA ni cancela suscripciones o pagos."}</p></main></body></html>`;
}

export function isSameOriginJson(req: Request) {
  if (!req.is("application/json") || req.get("sec-fetch-site") === "cross-site") return false;
  const origin = req.get("origin");
  try { return !origin || new URL(origin).host === req.get("host"); } catch { return false; }
}

export function registerStripeLetterRoutes(app: Express, dependencies: {
  database: Pick<Pool, "query" | "connect">;
  signingSecret?: () => string;
}) {
  const { database } = dependencies;
  const signingSecret = dependencies.signingSecret || (() => process.env.SESSION_SECRET || "");
  const view = (language: StripeLetterLanguage, row?: { subject: string; body: string; updated_at: string }) => ({
    language,
    subject: row?.subject || STRIPE_LETTERS[language].subject,
    body: row?.body || STRIPE_LETTERS[language].body,
    updatedAt: row?.updated_at || null,
    ctaLabel: STRIPE_LETTERS[language].ctaLabel, ctaUrl: STRIPE_LETTER_CTA.url,
    footer: STRIPE_LETTERS[language].footer,
    previewUnsubscribeUrl: `/api/stripe-commercial/unsubscribe?preview=1&language=${language}`,
    commercialSendingEnabled: true,
  });
  const draftError = (res: any, error: any) => res.status(503).json({
    code: error?.code === "42P01" ? "stripe_contacts_schema_pending" : "stripe_letter_unavailable",
    message: error?.code === "42P01"
      ? "Republica la aplicación para activar el guardado de la carta."
      : "No se ha podido guardar o cargar la carta. No se ha enviado ningún correo.",
  });
  app.get("/api/admin/stripe-contacts/letter", async (req, res) => {
    if (!req.session.isAdmin) return res.status(401).json({ message: "No autorizado" });
    res.setHeader("Cache-Control", "no-store");
    const language = req.query.language === undefined ? "es" : req.query.language;
    if (language !== "es" && language !== "en") return res.status(400).json({ message: "Idioma no válido." });
    try {
      const result = await database.query("SELECT subject,body,updated_at FROM stripe_commercial_letter WHERE id=$1", [language === "es" ? 1 : 2]);
      res.json(view(language, result.rows[0]));
    } catch (error) { draftError(res, error); }
  });
  app.put("/api/admin/stripe-contacts/letter", async (req, res) => {
    if (!req.session.isAdmin) return res.status(401).json({ message: "No autorizado" });
    if (!isSameOriginJson(req)) return res.status(403).json({ message: "Solicitud no permitida" });
    res.setHeader("Cache-Control", "no-store");
    const parsed = draftSchema.extend({ language: z.enum(["es", "en"]).default("es") }).safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Introduce un asunto de hasta 180 caracteres y un texto de hasta 10.000 caracteres." });
    try {
      const result = await database.query(`
        INSERT INTO stripe_commercial_letter(id,subject,body) VALUES($1,$2,$3)
        ON CONFLICT(id) DO UPDATE SET subject=EXCLUDED.subject,body=EXCLUDED.body,updated_at=NOW()
        RETURNING subject,body,updated_at
      `, [parsed.data.language === "es" ? 1 : 2, parsed.data.subject, parsed.data.body]);
      res.json(view(parsed.data.language, result.rows[0]));
    } catch (error) { draftError(res, error); }
  });

  // GET confirms intent only. Mail scanners cannot unsubscribe recipients.
  app.get("/api/stripe-commercial/unsubscribe", async (req, res) => {
    const language = req.query.language === "en" ? "en" : "es";
    const localizedPage = (title: string, message: string, token?: string) => page(title, message, token, language);
    res.set({ "Cache-Control": "no-store", "Referrer-Policy": "no-referrer",
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'" });
    if (req.query.preview === "1") {
      return res.type("html").send(localizedPage("Vista previa de la baja", "Este enlace es una demostración de la carta. No se ha dado de baja a ningún contacto. En un envío autorizado, el enlace sería personal."));
    }
    const token = typeof req.query.token === "string" ? req.query.token : "";
    const match = token.match(tokenPattern);
    if (!match) return res.status(400).type("html").send(localizedPage("Enlace no válido", "No se ha realizado ningún cambio."));
    try {
      const secret = signingSecret();
      if (!secret) return res.status(503).type("html").send(localizedPage("Servicio no disponible", "Vuelve a intentarlo más tarde."));
      const result = await database.query("SELECT id,email FROM stripe_commercial_contacts WHERE id=$1", [Number(match[1])]);
      if (!result.rows[0] || !verifyStripeUnsubscribeToken(token, result.rows[0], secret)) {
        return res.status(400).type("html").send(localizedPage("Enlace no válido", "No se ha realizado ningún cambio."));
      }
      res.type("html").send(localizedPage("Baja de comunicaciones comerciales", "Confirma si no deseas recibir más comunicaciones comerciales.", token));
    } catch {
      res.status(503).type("html").send(localizedPage("Servicio no disponible", "No se ha realizado ningún cambio. Vuelve a intentarlo más tarde."));
    }
  });
  // URL-encoded parser is route-local, never changes the signed webhook parsers.
  app.post("/api/stripe-commercial/unsubscribe", async (req, res, next) => {
    if (req.is("application/x-www-form-urlencoded")) {
      const { default: express } = await import("express");
      return express.urlencoded({ extended: false, limit: "2kb" })(req, res, next);
    }
    next();
  }, async (req, res) => {
    const language = req.body?.language === "en" ? "en" : "es";
    const localizedPage = (title: string, message: string) => page(title, message, undefined, language);
    res.set({ "Cache-Control": "no-store", "Referrer-Policy": "no-referrer" });
    const token = typeof req.body?.token === "string" ? req.body.token : "";
    const match = token.match(tokenPattern);
    if (!match) return res.status(400).type("html").send(localizedPage("Enlace no válido", "No se ha realizado ningún cambio."));
    const secret = signingSecret();
    if (!secret) return res.status(503).type("html").send(localizedPage("Servicio no disponible", "Vuelve a intentarlo más tarde."));
    let client: PoolClient | undefined;
    try {
      client = await database.connect();
      await client.query("BEGIN");
      const result = await client.query("SELECT id,email FROM stripe_commercial_contacts WHERE id=$1 FOR UPDATE", [Number(match[1])]);
      const contact = result.rows[0];
      if (!contact || !verifyStripeUnsubscribeToken(token, contact, secret)) {
        await client.query("ROLLBACK");
        return res.status(400).type("html").send(localizedPage("Enlace no válido", "No se ha realizado ningún cambio."));
      }
      await client.query(`
        INSERT INTO empresa_suppression_list(suppression_type,normalized_value)
        VALUES('email',$1) ON CONFLICT(suppression_type,normalized_value) DO NOTHING
      `, [contact.email]);
      await client.query("UPDATE users SET marketing_opted_out=true WHERE lower(trim(email))=$1", [contact.email]);
      await client.query("UPDATE email_leads SET consent_marketing=false,unsubscribed_at=COALESCE(unsubscribed_at,NOW()) WHERE lower(trim(email))=$1", [contact.email]);
      for (const table of ["empresa_contacts", "institution_contacts", "mutua_contacts"]) {
        await client.query(`UPDATE ${table} SET opted_out=true,opted_out_at=COALESCE(opted_out_at,NOW()) WHERE lower(trim(email))=$1`, [contact.email]);
      }
      await client.query("COMMIT");
      res.type("html").send(localizedPage("Baja registrada", "Tu dirección ha quedado excluida de las comunicaciones comerciales del sistema."));
    } catch {
      if (client) await client.query("ROLLBACK").catch(() => {});
      res.status(503).type("html").send(localizedPage("No se ha podido registrar la baja", "Vuelve a intentarlo más tarde."));
    } finally { client?.release(); }
  });
}
