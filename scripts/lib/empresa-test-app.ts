import express from "express";
import session from "express-session";
import { isolatedDevelopmentDatabase } from "./development-test-database";
import { empresaSimpleImportHandler, empresaBulkImportHandler } from "../../server/empresa-imports";
import { empresaEmailEligibilitySql } from "../../server/empresa-email-eligibility";

export async function empresaTestApp() {
  const database = await isolatedDevelopmentDatabase("empresa_csv");
  const { pool } = database;
  await pool.query(`
    CREATE TABLE empresa_contacts(id serial PRIMARY KEY,email text UNIQUE,name text,company text,phone text,address text,
      postal_code text,municipio text,provincia text,employee_count integer,contact_area text,priority text,source text,
      company_size text DEFAULT 'unclassified',company_size_source text,opted_out boolean DEFAULT false,
      created_at timestamptz DEFAULT now());
    CREATE TABLE empresa_suppression_list(suppression_type text,normalized_value text);
    CREATE TABLE empresa_email_tracking(id serial PRIMARY KEY,contact_email text);
  `);
  const app = express();
  app.use(express.json());
  app.use(session({ secret: "empresa-synthetic-only", resave: false, saveUninitialized: false }));
  // Test-only authorization. No production identities, passwords or sessions.
  app.use((req, _res, next) => { req.session.isAdmin = req.get("x-fixture-auth") !== "denied"; next(); });
  const state = { sendAttempts: 0 };
  app.get("/api/admin/empresas", async (_req, res) => {
    const rows = await pool.query(`SELECT ec.*,${empresaEmailEligibilitySql} AS email_campaign_eligible,
      count(eet.id)::int AS campaigns_sent FROM empresa_contacts ec
      LEFT JOIN empresa_email_tracking eet ON eet.contact_email=ec.email GROUP BY ec.id ORDER BY ec.id`);
    res.json(rows.rows);
  });
  app.post("/api/admin/empresas/import-csv", empresaSimpleImportHandler(pool));
  app.post("/api/admin/empresas/import-bulk", empresaBulkImportHandler(pool));
  app.post("/api/admin/send-empresa-campaign", (_req, res) => {
    state.sendAttempts++;
    res.status(403).json({ message: "Sends disabled in isolated test fixture" });
  });
  app.get("/api/auth/me", (_req, res) => res.json({ id: 1, username: "synthetic-admin", role: "admin" }));
  app.get("/api/admin/stats", (_req, res) => res.json({
    metricsVersion: 2,generatedAt: new Date().toISOString(),totalUsers: 0,registeredUsers: 0,adminUsers: 0,otherAccounts: 0,
    trialUsers: 0,pendingPayments: 0,activeSubscriptions: 0,expiredActiveStatuses: 0,verifiedTrialUsers: 0,
    totalConversations: 0,totalRevenue: null,revenueStatus: "not_reconciled",periods: [],history: [],
    registrationAudit: { available: false,coverageStartedAt: null,periods: [] },
  }));
  app.get("/api/admin/empresa-brands", (_req, res) => res.json([
    { id: "nuxa",available: true,name: "NUXA fixture",from: "fixture@example.invalid" },
    { id: "jobda",available: false,name: "JOBDA fixture" },
    { id: "empordajobs",available: false,name: "EMPORDAJOBS fixture" },
  ]));
  app.get("/api/admin/empresa-templates", (_req, res) => res.json([]));
  app.get("/api/admin/empresa-campaign-history", (_req, res) => res.json([]));
  app.get("/__fixture/state", async (_req, res) => res.json({
    contacts: (await pool.query("SELECT count(*)::int AS n FROM empresa_contacts")).rows[0].n,
    sends: state.sendAttempts,
  }));
  app.use("/api", (_req, res) => res.status(404).json({ message: "Unknown fixture route; no real provider connected" }));
  return { app,pool,state,close: () => database.close() };
}
