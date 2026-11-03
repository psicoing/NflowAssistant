import type { Express } from "express";
import type { Pool, PoolClient } from "@neondatabase/serverless";
import Stripe from "stripe";
import { z } from "zod";
import { pool } from "./db";
import { registerStripeLetterRoutes, isSameOriginJson } from "./stripe-commercial-letter";
import { registerStripeDispatchRoutes, type StripeDispatchDependencies } from "./stripe-commercial-dispatch";
import { stripeContactFailure, type StripeContactPhase } from "./stripe-contact-errors";
import { commercialAudience, type CommercialAudienceId } from "@shared/commercial-audience";
import { commercialEligibilitySelect } from "./stripe-commercial-eligibility";

const emailSchema = z.string().email().max(254);
type CustomerEmail = { email?: string | null };

/** Never use Stripe purchases, names or clinical information for this list. */
export function normalizeStripeContactEmails(customers: CustomerEmail[]) {
  const emails = new Set<string>();
  let validEmailRecords = 0;
  for (const customer of customers) {
    const value = typeof customer.email === "string" ? customer.email.trim().toLowerCase() : "";
    if (!emailSchema.safeParse(value).success) continue;
    validEmailRecords++;
    emails.add(value);
  }
  return {
    emails: Array.from(emails).sort(),
    sourceRecords: customers.length,
    validEmailRecords,
    uniqueEmails: emails.size,
    duplicateEmailRecords: validEmailRecords - emails.size,
    invalidEmailRecords: customers.length - validEmailRecords,
  };
}

export function stripeContactView(row: {
  id: number; email: string; imported_at: string | Date; last_seen_at: string | Date; suppressed: boolean; authorized?: boolean;
}, source: CommercialAudienceId = "stripe") {
  return {
    id: row.id, email: row.email, source,
    status: row.suppressed ? "suppressed" as const : row.authorized ? "authorized" as const : "pending_review" as const,
    importedAt: row.imported_at, lastSeenAt: row.last_seen_at,
    canSend: !row.suppressed && row.authorized === true,
  };
}

async function listCustomerEmails(): Promise<CustomerEmail[]> {
  if (!process.env.STRIPE_SECRET_KEY) throw Object.assign(new Error("Stripe unavailable"), { code: "stripe_unavailable" });
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-08-27.basil", timeout: 30_000, maxNetworkRetries: 1,
  });
  const customers: CustomerEmail[] = [];
  for await (const customer of stripe.customers.list({ limit: 100 })) {
    if (!customer.livemode) throw Object.assign(new Error("Expected live Stripe customers"), { code: "stripe_live_required" });
    // Keep only the email, never the payment/customer payload.
    customers.push({ email: customer.email });
    if (customers.length > 20_000) {
      throw Object.assign(new Error("Import exceeds safety limit"), { code: "stripe_import_limit" });
    }
  }
  return customers;
}

export function registerStripeCommercialContactRoutes(app: Express, dependencies?: {
  audienceId?: CommercialAudienceId;
  database?: Pick<Pool, "query" | "connect">;
  listCustomers?: () => Promise<CustomerEmail[]>;
  signingSecret?: () => string;
  delivery?: StripeDispatchDependencies["delivery"];
  pace?: StripeDispatchDependencies["pace"];
  reportFailure?: (diagnostic: ReturnType<typeof stripeContactFailure>["diagnostic"]) => void;
}) {
  const audience = commercialAudience(dependencies?.audienceId);
  const table = audience.tables.contacts;
  const eligibility = commercialEligibilitySelect(table as "stripe_commercial_contacts" | "probadores_commercial_contacts");
  const database = dependencies?.database || pool;
  if (audience.id !== "stripe" && !dependencies?.listCustomers) throw new Error("A local contact source is required");
  const listCustomers = dependencies?.listCustomers || listCustomerEmails;
  registerStripeLetterRoutes(app, { database, signingSecret: dependencies?.signingSecret, audienceId: audience.id });
  registerStripeDispatchRoutes(app, { database, signingSecret: dependencies?.signingSecret,
    delivery: dependencies?.delivery, pace: dependencies?.pace, audienceId: audience.id });
  const fail = (res: any, error: unknown, phase: StripeContactPhase) => {
    const { diagnostic, payload } = stripeContactFailure(error, phase);
    if (dependencies?.reportFailure) dependencies.reportFailure(diagnostic);
    else console.error("[stripe-contacts]", JSON.stringify(diagnostic));
    return res.status(503).json({
      ...payload, message: payload.message.replace("lista Stripe", `lista ${audience.label}`),
      reference: diagnostic.reference, phase: diagnostic.phase,
    });
  };

  app.get(audience.base, async (req, res) => {
    if (!req.session.isAdmin) return res.status(401).json({ message: "No autorizado" });
    res.setHeader("Cache-Control", "no-store");
    try {
      const result = await database.query(`SELECT c.id,c.email,c.imported_at,c.last_seen_at,
        e.suppressed,e.authorized FROM ${table} c JOIN (${eligibility}) e ON e.id=c.id ORDER BY c.email`);
      const contacts = result.rows.map(row => stripeContactView(row, audience.id));
      const suppressed = contacts.filter(c => c.status === "suppressed").length;
      const sendable = contacts.filter(c => c.canSend).length;
      res.json({ contacts, summary: {
        total: contacts.length, pendingReview: contacts.length - suppressed - sendable, suppressed, sendable,
      } });
    } catch (error) { fail(res, error, "read_contacts"); }
  });

  app.post(`${audience.base}/import`, async (req, res) => {
    if (!req.session.isAdmin) return res.status(401).json({ message: "No autorizado" });
    res.setHeader("Cache-Control", "no-store");
    // This browser-only mutation must be same-origin JSON, not a cross-site form.
    if (!isSameOriginJson(req)) {
      return res.status(403).json({ message: "Solicitud no permitida" });
    }
    let client: PoolClient | undefined;
    let phase: StripeContactPhase = "schema";
    try {
      // Fail before calling Stripe if Publish has not created the table yet.
      await database.query(`SELECT id FROM ${table} LIMIT 0`);
      phase = audience.id === "stripe" ? "stripe" : "storage";
      const { emails, ...counts } = normalizeStripeContactEmails(await listCustomers());
      phase = "storage";
      client = await database.connect();
      await client.query("BEGIN");
      await client.query("SET LOCAL lock_timeout = '5s'");
      await client.query("SET LOCAL statement_timeout = '30s'");
      await client.query("SELECT pg_advisory_xact_lock(hashtext($1))", [`${audience.id}-contact-import`]);
      const inserted = await client.query(`
        INSERT INTO ${table}(email)
        SELECT unnest($1::text[]) ON CONFLICT(email) DO NOTHING RETURNING id
      `, [emails]);
      await client.query(`
        UPDATE ${table} SET last_seen_at=NOW() WHERE email=ANY($1::text[])
      `, [emails]);
      const total = await client.query(`SELECT count(*)::int AS total FROM ${table}`);
      await client.query("COMMIT");
      res.json({
        ...counts, inserted: inserted.rowCount || 0,
        existing: emails.length - (inserted.rowCount || 0),
        total: total.rows[0].total, commercialSendingEnabled: false,
      });
    } catch (error) {
      if (client) await client.query("ROLLBACK").catch(() => {});
      fail(res, error, phase);
    } finally { client?.release(); }
  });
}
