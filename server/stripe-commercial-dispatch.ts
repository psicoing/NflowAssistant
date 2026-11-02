import type { Express, Response } from "express";
import type { Pool } from "@neondatabase/serverless";
import { createHash, randomUUID } from "node:crypto";
import { z } from "zod";
import type { StripeDispatch } from "@shared/stripe-commercial-api";
import { createStripeUnsubscribeToken, isSameOriginJson, renderStripeCommercialLetter } from "./stripe-commercial-letter";
import { stripeEligibilitySelect } from "./stripe-commercial-eligibility";
import { mustStopCampaign, paceCommercialEmail } from "./campaign-email-control";
import { normalizeMailMessageId, safeMailError } from "./campaign-email-events";
import { registerStripeAuthorizationRoutes } from "./stripe-commercial-permission";

type DeliveryMessage = { to: string; subject: string; text: string; html: string };
export type StripeDispatchDependencies = {
  database: Pick<Pool, "query" | "connect">;
  signingSecret?: () => string;
  delivery?: (message: DeliveryMessage) => Promise<{ statusCode: number; messageId?: string }>;
  pace?: <T>(send: () => Promise<T>) => Promise<T>;
};
const prepareSchema = z.object({
  language: z.enum(["es", "en"]),
  contactIds: z.array(z.number().int().positive()).min(1).max(10)
    .refine(ids => new Set(ids).size === ids.length),
}).strict();
const validId = (id: string) => z.string().uuid().safeParse(id).success;

export function stripeCommercialError(res: Response, error: any) {
  return res.status(503).json({
    code: ["42P01", "42703"].includes(error?.code) ? "stripe_contacts_schema_pending" : "stripe_commercial_unavailable",
    message: ["42P01", "42703"].includes(error?.code)
      ? "Republica para activar el esquema de envíos manuales."
      : "No se ha podido completar la operación. Consulta el estado del lote antes de intentar otra acción.",
  });
}

async function sendViaSendGrid(message: DeliveryMessage) {
  const { sendNuxaSendGridEmail } = await import("./sendgridClient");
  const [response] = await sendNuxaSendGridEmail({
    ...message, trackingSettings: { openTracking: { enable: true }, clickTracking: { enable: false } },
  });
  const raw = response.headers["x-message-id"];
  return { statusCode: response.statusCode, messageId: Array.isArray(raw) ? raw[0] : raw };
}

export function registerStripeDispatchRoutes(app: Express, deps: StripeDispatchDependencies) {
  const db = deps.database;
  const secret = deps.signingSecret || (() => process.env.SESSION_SECRET || "");
  const delivery = deps.delivery || sendViaSendGrid;
  const pace = deps.pace || (<T>(send: () => Promise<T>) => paceCommercialEmail(db, send));
  const base = "/api/admin/stripe-contacts/dispatches";
  registerStripeAuthorizationRoutes(app, db);

  // Only this route subtree: do not affect other admin routes or webhook parsers.
  app.use(base, (req, res, next) => {
    res.set("Cache-Control", "no-store");
    if (!req.session.isAdmin) return res.status(401).json({ message: "No autorizado" });
    if (req.method !== "GET" && !isSameOriginJson(req)) return res.status(403).json({ message: "Solicitud no permitida" });
    next();
  });
  const readDispatch = async (id: string): Promise<StripeDispatch | undefined> => {
    const result = await db.query(`SELECT id,language,subject,body,status,created_at AS "createdAt"
      FROM stripe_commercial_dispatches WHERE id=$1`, [id]);
    if (!result.rows[0]) return;
    const recipients = await db.query(`SELECT contact_id AS "contactId",email,status,reason,message_id AS "messageId"
      FROM stripe_commercial_recipients WHERE dispatch_id=$1 ORDER BY id`, [id]);
    return { ...result.rows[0], recipients: recipients.rows };
  };
  const stopPending = async (id: string, reason: string) => {
    await db.query(`UPDATE stripe_commercial_recipients SET status='skipped',reason=$2,
      dedupe_key='not-attempted:'||id::text
      WHERE dispatch_id=$1 AND status='pending'`, [id, reason]);
  };

  app.get(base, async (_req, res) => {
    try {
      const ids = await db.query("SELECT id FROM stripe_commercial_dispatches ORDER BY created_at DESC LIMIT 20");
      const dispatches = [];
      for (const row of ids.rows) dispatches.push(await readDispatch(row.id));
      res.json({ dispatches });
    } catch (error) { stripeCommercialError(res, error); }
  });
  app.get(`${base}/:id`, async (req, res) => {
    if (!validId(req.params.id)) return res.status(400).json({ message: "Lote no válido." });
    try {
      const dispatch = await readDispatch(req.params.id);
      if (!dispatch) return res.status(404).json({ message: "Lote no encontrado." });
      res.json(dispatch);
    } catch (error) { stripeCommercialError(res, error); }
  });
  app.post(base, async (req, res) => {
    const parsed = prepareSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Selecciona el idioma y entre 1 y 10 contactos distintos." });
    const { language, contactIds } = parsed.data;
    let client;
    try {
      if (!secret()) return res.status(503).json({ message: "La firma de bajas no está disponible. No se puede preparar el envío." });
      client = await db.connect();
      await client.query("BEGIN");
      // Serialize preparation to avoid competing reservations of the same content.
      await client.query("SELECT pg_advisory_xact_lock(hashtext('stripe-commercial-prepare'))");
      const eligible = await client.query(`${stripeEligibilitySelect} WHERE c.id=ANY($1::int[])`, [contactIds]);
      if (eligible.rows.length !== contactIds.length || eligible.rows.some(c => c.suppressed || !c.authorized)) {
        await client.query("ROLLBACK");
        return res.status(409).json({ message: "Algún contacto no tiene autorización registrada o está suprimido. Actualiza la lista." });
      }
      const letter = await client.query("SELECT subject,body FROM stripe_commercial_letter WHERE id=$1", [language === "es" ? 1 : 2]);
      if (!letter.rows[0]) {
        await client.query("ROLLBACK");
        return res.status(409).json({ message: "Guarda primero la carta en el idioma elegido." });
      }
      const { subject, body } = letter.rows[0];
      const id = randomUUID();
      await client.query(`INSERT INTO stripe_commercial_dispatches(id,language,subject,body,created_by)
        VALUES($1,$2,$3,$4,$5)`, [id, language, subject, body, req.session.userId || null]);
      for (const contact of eligible.rows) {
        // Identical content cannot be sent twice, including across new batches.
        const key = createHash("sha256").update(JSON.stringify([contact.id, contact.email, language, subject, body])).digest("hex");
        const inserted = await client.query(`INSERT INTO stripe_commercial_recipients(dispatch_id,contact_id,email,dedupe_key)
          VALUES($1,$2,$3,$4) ON CONFLICT(dedupe_key) DO NOTHING RETURNING id`, [id, contact.id, contact.email, key]);
        if (!inserted.rows.length) {
          await client.query("ROLLBACK");
          return res.status(409).json({ message: "Esta misma carta ya está reservada o se ha intentado enviar a alguno de estos contactos. Revisa el historial; no se duplicará." });
        }
      }
      await client.query("COMMIT");
      res.json(await readDispatch(id));
    } catch (error) {
      if (client) await client.query("ROLLBACK").catch(() => {});
      stripeCommercialError(res, error);
    } finally { client?.release(); }
  });

  app.post(`${base}/:id/cancel`, async (req, res) => {
    if (!validId(req.params.id)) return res.status(400).json({ message: "Lote no válido." });
    try {
      await db.query(`UPDATE stripe_commercial_dispatches SET status='stopped'
        WHERE id=$1 AND status IN ('prepared','running')`, [req.params.id]);
      await stopPending(req.params.id, "Detenido por el administrador; no enviado.");
      const dispatch = await readDispatch(req.params.id);
      if (!dispatch) return res.status(404).json({ message: "Lote no encontrado." });
      res.json(dispatch);
    } catch (error) { stripeCommercialError(res, error); }
  });

  app.post(`${base}/:id/send`, async (req, res) => {
    const id = req.params.id;
    if (!validId(id) || !z.object({ confirmation: z.literal("ENVIAR") }).strict().safeParse(req.body).success) {
      return res.status(400).json({ message: "Confirma expresamente el envío del lote revisado." });
    }
    try {
      const signingKey = secret();
      if (!signingKey) return res.status(503).json({ message: "La firma de bajas no está disponible. No se ha iniciado el envío." });
      // Only one request may take ownership. Never resume running/ambiguous work.
      const claimed = await db.query(`UPDATE stripe_commercial_dispatches SET status='running'
        WHERE id=$1 AND status='prepared' RETURNING id`, [id]);
      const dispatch = await readDispatch(id);
      if (!dispatch) return res.status(404).json({ message: "Lote no encontrado." });
      if (!claimed.rows.length) return res.json(dispatch);
      for (const recipient of dispatch.recipients) {
        const result = await pace(async () => {
          const state = await db.query("SELECT status FROM stripe_commercial_dispatches WHERE id=$1", [id]);
          if (state.rows[0]?.status !== "running") return null;
          // Recheck after pacing, immediately before committing the attempt.
          const allowed = await db.query(`${stripeEligibilitySelect} WHERE c.id=$1`, [recipient.contactId]);
          const contact = allowed.rows[0];
          if (!contact || contact.email !== recipient.email || contact.suppressed || !contact.authorized) {
            await db.query(`UPDATE stripe_commercial_recipients SET status='skipped',reason=$3,
              dedupe_key='not-attempted:'||id::text
              WHERE dispatch_id=$1 AND contact_id=$2 AND status='pending'`,
            [id, recipient.contactId, "Sin autorización vigente o suprimido antes del envío."]);
            return null;
          }
          const token = createStripeUnsubscribeToken(contact, signingKey);
          const url = `https://nuxa.life/api/stripe-commercial/unsubscribe?token=${encodeURIComponent(token)}&language=${dispatch.language}`;
          const mail = renderStripeCommercialLetter({ subject: dispatch.subject, body: dispatch.body }, url, dispatch.language);
          const reserved = await db.query(`UPDATE stripe_commercial_recipients SET status='attempting',attempted_at=NOW()
            WHERE dispatch_id=$1 AND contact_id=$2 AND status='pending'
              AND EXISTS(SELECT 1 FROM stripe_commercial_dispatches WHERE id=$1 AND status='running')
            RETURNING id`, [id, recipient.contactId]);
          if (!reserved.rows.length) return null;
          let outcome: { ok: boolean; status: string; reason: string | null; messageId: string | null; errorCode?: string };
          try {
            const response = await delivery({ to: contact.email, ...mail });
            const accepted = response.statusCode === 202;
            outcome = {
              ok: accepted, status: accepted ? "accepted" : "uncertain",
              reason: accepted ? null : `Respuesta inesperada del proveedor (${response.statusCode}); no reintentar.`,
              messageId: response.messageId ? normalizeMailMessageId("sendgrid", response.messageId) : null,
              errorCode: accepted ? undefined : "send_uncertain",
            };
          } catch (error) {
            const detail = safeMailError(error);
            const numeric = Number(detail.code);
            const rejected = numeric >= 400 && numeric < 500 && numeric !== 408;
            outcome = {
              ok: false, status: rejected ? "rejected" : "uncertain",
              reason: `${detail.code}: ${detail.reason}`, messageId: null,
              errorCode: rejected ? detail.code : "send_uncertain",
            };
          }
          // If this persistence fails, the durable 'attempting' state blocks retry.
          await db.query(`UPDATE stripe_commercial_recipients SET status=$3,reason=$4,message_id=$5
            WHERE dispatch_id=$1 AND contact_id=$2 AND status='attempting'`,
          [id, recipient.contactId, outcome.status, outcome.reason, outcome.messageId]);
          return outcome;
        });
        if (result && mustStopCampaign(result)) {
          await db.query("UPDATE stripe_commercial_dispatches SET status='stopped' WHERE id=$1", [id]);
          await stopPending(id, "Lote detenido por un error del proveedor; no enviado.");
          break;
        }
      }
      await db.query("UPDATE stripe_commercial_dispatches SET status='completed' WHERE id=$1 AND status='running'", [id]);
      res.json(await readDispatch(id));
    } catch (error) {
      await db.query("UPDATE stripe_commercial_dispatches SET status='stopped' WHERE id=$1 AND status='running'", [id]).catch(() => {});
      await stopPending(id, "Operación interrumpida; no enviado.").catch(() => {});
      stripeCommercialError(res, error);
    }
  });
}
