import type { Express } from "express";
import type { Pool } from "@neondatabase/serverless";
import { pool } from "./db";
import { registerStripeCommercialContactRoutes } from "./stripe-commercial-contacts";

/** Operational registration/lead data only. Never inspect conversations or health data. */
export async function listProbadoresEmails(database: Pick<Pool, "query">) {
  const result = await database.query(`
    WITH candidates AS (
      SELECT email FROM email_leads
      UNION ALL
      SELECT email FROM users
        WHERE COALESCE(role,'user') IN ('user','trial') AND created_by_partner_id IS NULL
    )
    SELECT c.email FROM candidates c
    WHERE NOT EXISTS (
      SELECT 1 FROM users u WHERE lower(trim(u.email))=lower(trim(c.email))
        AND (u.has_completed_payment IS TRUE OR u.subscription_status='active'
          OR COALESCE(u.prepaid_questions,0)>0 OR u.role IN ('admin','partner')
          OR u.created_by_partner_id IS NOT NULL)
    )
    LIMIT 20001`);
  if (result.rows.length > 20_000) {
    throw Object.assign(new Error("Import exceeds safety limit"), { code: "stripe_import_limit" });
  }
  return result.rows.map(row => ({ email: row.email as string | null }));
}

export function registerProbadoresCommercialContactRoutes(app: Express, dependencies?: Parameters<typeof registerStripeCommercialContactRoutes>[1]) {
  const database = dependencies?.database || pool;
  registerStripeCommercialContactRoutes(app, {
    ...dependencies, audienceId: "probadores", database,
    listCustomers: dependencies?.listCustomers || (() => listProbadoresEmails(database)),
  });
}
