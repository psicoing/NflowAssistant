import type { Express } from "express";
import type { Pool } from "@neondatabase/serverless";
import { z } from "zod";
import { isSameOriginJson } from "./stripe-commercial-letter";
import { commercialEligibilitySelect } from "./stripe-commercial-eligibility";
import { commercialAudience, type CommercialAudienceId } from "@shared/commercial-audience";

const grantSchema = z.object({
  action: z.literal("grant"),
  source: z.enum(["form", "documented_email", "signed_document"]),
  evidence: z.string().trim().min(20).max(1000),
  obtainedAt: z.string().datetime({ offset: true }).refine(v => {
    const time = new Date(v).getTime();
    return time <= Date.now() && time >= Date.UTC(2000, 0, 1);
  }),
  attested: z.literal(true),
}).strict();
const actionSchema = z.union([grantSchema, z.object({ action: z.literal("revoke") }).strict()]);
export function registerStripeAuthorizationRoutes(app: Express, database: Pick<Pool, "query" | "connect">, audienceId: CommercialAudienceId = "stripe") {
  const audience = commercialAudience(audienceId);
  const tables = audience.tables;
  const eligibility = commercialEligibilitySelect(tables.contacts as "stripe_commercial_contacts" | "probadores_commercial_contacts");
  const base = `${audience.base}/authorizations/:id`;
  app.use(`${audience.base}/authorizations`, (req, res, next) => {
    res.set("Cache-Control", "no-store");
    if (!req.session.isAdmin) return res.status(401).json({ message: "No autorizado" });
    if (req.method !== "GET" && !isSameOriginJson(req)) return res.status(403).json({ message: "Solicitud no permitida" });
    next();
  });
  const fail = (res: any, error: any) => res.status(503).json({
    code: error?.code === "42P01" ? "stripe_contacts_schema_pending" : "stripe_permission_unavailable",
    message: "No se ha podido consultar o registrar la autorización. Si falta el esquema, republica la aplicación.",
  });
  app.get(base, async (req, res) => {
    if (!/^[1-9]\d{0,9}$/.test(req.params.id)) return res.status(400).json({ message: "Contacto no válido." });
    try {
      const contact = await database.query(`${eligibility} WHERE c.id=$1`, [Number(req.params.id)]);
      if (!contact.rows[0]) return res.status(404).json({ message: "Contacto no encontrado." });
      const records = await database.query(`SELECT id,action,source,evidence,obtained_at AS "obtainedAt",
        recorded_at AS "recordedAt" FROM ${tables.authorizations} WHERE contact_id=$1 ORDER BY id DESC LIMIT 50`, [Number(req.params.id)]);
      res.json({ records: records.rows, suppressed: contact.rows[0].suppressed });
    } catch (error) { fail(res, error); }
  });
  app.post(base, async (req, res) => {
    const parsed = actionSchema.safeParse(req.body);
    if (!parsed.success || !/^[1-9]\d{0,9}$/.test(req.params.id)) {
      return res.status(400).json({ message: "Registra la procedencia, referencia de prueba y fecha de un permiso explícito para emails comerciales de NUXA, y confirma que lo has verificado." });
    }
    let client;
    try {
      client = await database.connect();
      await client.query("BEGIN");
      await client.query(`SELECT id FROM ${tables.contacts} WHERE id=$1 FOR UPDATE`, [Number(req.params.id)]);
      const result = await client.query(`${eligibility} WHERE c.id=$1`, [Number(req.params.id)]);
      if (!result.rows[0]) {
        await client.query("ROLLBACK");
        return res.status(404).json({ message: "Contacto no encontrado." });
      }
      if (parsed.data.action === "grant" && result.rows[0].suppressed) {
        await client.query("ROLLBACK");
        return res.status(409).json({ message: "El contacto está suprimido. Registrar un permiso no puede anular una baja o supresión." });
      }
      const grant = parsed.data.action === "grant" ? parsed.data : null;
      await client.query(`INSERT INTO ${tables.authorizations}(contact_id,email,action,source,evidence,obtained_at,recorded_by)
        VALUES($1,$2,$3,$4,$5,$6,$7)`, [Number(req.params.id), result.rows[0].email, parsed.data.action,
        grant?.source || null, grant?.evidence || null, grant?.obtainedAt || null, req.session.userId || null]);
      await client.query("COMMIT");
      res.json({ ok: true });
    } catch (error) {
      if (client) await client.query("ROLLBACK").catch(() => {});
      fail(res, error);
    } finally { client?.release(); }
  });
}
