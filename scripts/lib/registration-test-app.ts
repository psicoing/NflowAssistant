import express from "express";
import session from "express-session";
import type { IStorage } from "../../server/storage";
import { accountRegistrationHandler } from "../../server/account-registration";
import { establishChatUserSession } from "../../server/chat-history-security";
import { registerAdminUserMetricsRoute } from "../../server/admin-user-metrics";
import { createRegistrationAuditWriter, installRegistrationAudit } from "../../server/registration-audit";
import { registerTrialRoutes } from "../../server/trial/routes";
import { isolatedDevelopmentDatabase } from "./development-test-database";

export const auditTableFixtureSql = `CREATE TABLE nuxa_registration_events(
 id text PRIMARY KEY,occurred_at timestamptz NOT NULL DEFAULT now(),stage text NOT NULL,
 outcome text NOT NULL,http_status integer,code text,account_created boolean NOT NULL DEFAULT false,
 actor_role text)`;

export async function registrationTestApp() {
  const database = await isolatedDevelopmentDatabase("registration_metrics");
  const { pool } = database;
  await pool.query(`
    CREATE TABLE users(
      id serial PRIMARY KEY,username text NOT NULL UNIQUE,password text NOT NULL,email text,
      role text DEFAULT 'user',user_type text,birth_date text,
      subscription_status text DEFAULT 'inactive',subscription_plan text,subscription_expires_at timestamp,
      has_completed_payment boolean DEFAULT false,prepaid_questions int DEFAULT 0,
      monthly_question_limit int DEFAULT 10,questions_used_this_month int DEFAULT 0,
      last_question_reset_date timestamp DEFAULT now(),
      created_at timestamp DEFAULT(now() AT TIME ZONE 'UTC'),last_login_at timestamp,login_count int DEFAULT 0,
      accepted_nuxa_notice boolean DEFAULT false,notice_accepted_at timestamp,notice_version text,
      trial_email_verified_at timestamptz,trial_phone_verified_at timestamptz,trial_phone_hash text);
    CREATE TABLE conversations(id serial PRIMARY KEY,user_id integer,title text,created_at timestamp DEFAULT now());
    CREATE TABLE messages(id serial PRIMARY KEY,conversation_id integer,is_user boolean,timestamp timestamp DEFAULT now());
  `);
  const state = {
    emailFailure: false, smsFailure: false, databaseFailure: false, failSessionSave: false,
    emailCodes: new Map<string, string>(), smsCodes: new Map<string, string>(),
    emails: 0, sms: 0,
  };
  const app = express();
  app.use(express.json());
  const memory = new session.MemoryStore();
  const originalSet = memory.set.bind(memory);
  memory.set = (sid, data, callback) => {
    if (state.failSessionSave && data.userId) {
      state.failSessionSave = false;
      callback?.(new Error("Synthetic session-store failure"));
      return;
    }
    originalSet(sid, data, callback);
  };
  app.use(session({ secret: "synthetic-fixture-only-session-secret", resave: false, saveUninitialized: false, store: memory }));
  app.use((req, _res, next) => {
    // Only in the isolated harness: separate rate-limit keys per synthetic case.
    if (req.get("x-fixture-client")) Object.defineProperty(req, "ip", { value: req.get("x-fixture-client") });
    next();
  });
  const writer = createRegistrationAuditWriter(pool);
  const pending = new Set<Promise<void>>();
  installRegistrationAudit(app, event => {
    const task = writer(event);
    pending.add(task);
    void task.finally(() => pending.delete(task));
    return task;
  });
  const storage = {
    async getUserByUsername(username: string) { return (await pool.query("SELECT * FROM users WHERE username=$1", [username])).rows[0]; },
    async createUser(user: any) {
      if (state.databaseFailure) throw new Error("Synthetic private database error must not leak");
      return (await pool.query(`INSERT INTO users(username,password,email,birth_date,user_type,
        subscription_status,has_completed_payment,accepted_nuxa_notice,notice_accepted_at,notice_version)
        VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [user.username,user.password,user.email,user.birthDate,user.userType,user.subscriptionStatus,
        user.hasCompletedPayment,user.acceptedNuxaNotice,user.noticeAcceptedAt,user.noticeVersion])).rows[0];
    },
    async getPartner() { return undefined; },
    async createPartnerReferral() { throw new Error("No partners in fixture"); },
  } as unknown as IStorage;
  app.post("/api/auth/register", accountRegistrationHandler(storage, establishChatUserSession));
  await registerTrialRoutes(app, pool, {
    async email(email, code) {
      if (!email.endsWith("@example.invalid")) throw new Error("Fixture recipient refused");
      if (state.emailFailure) throw new Error("Synthetic email outage");
      state.emails++; state.emailCodes.set(email, code);
    },
    async quoteSms() { return 500_000; },
    async sms(phone, code) {
      if (state.smsFailure) throw new Error("Synthetic SMS outage");
      state.sms++; state.smsCodes.set(phone, code);
      return { id: `synthetic-sms-${state.sms}` };
    },
  });
  registerAdminUserMetricsRoute(app, pool);
  app.get("/api/auth/me", async (req, res) => {
    if (!req.session.userId) return res.status(401).json({ message: "No autenticado" });
    const row = (await pool.query("SELECT id,username,email,role,subscription_status FROM users WHERE id=$1", [req.session.userId])).rows[0];
    res.json({ ...row, subscriptionStatus: row.subscription_status, hasActiveSubscription: false, profileCompleted: true });
  });
  app.post("/__fixture/admin", async (req, res) => {
    const existing = (await pool.query("SELECT id FROM users WHERE role='admin' LIMIT 1")).rows[0];
    const id = existing?.id ?? (await pool.query("INSERT INTO users(username,password,role) VALUES('fixture-admin','not-a-login-password','admin') RETURNING id")).rows[0].id;
    await establishChatUserSession(req, id, true);
    req.session.save(error => error ? res.status(503).end() : res.json({ ok: true }));
  });
  app.get("/__fixture/codes", (_req, res) => res.json({
    email: Array.from(state.emailCodes.values()).at(-1),
    sms: Array.from(state.smsCodes.values()).at(-1),
  }));
  app.get("/api/public-stats", async (_req, res) => {
    const row = (await pool.query("SELECT count(*)::int AS n FROM users")).rows[0];
    res.json({ totalUsers: row.n, totalConversations: 0, activeSubscriptions: 0 });
  });
  app.post("/api/conversations", async (req, res) => {
    if (!req.session.userId) return res.status(401).end();
    const row = (await pool.query("INSERT INTO conversations(user_id,title) VALUES($1,'Synthetic') RETURNING id", [req.session.userId])).rows[0];
    res.json(row);
  });
  // No unknown API route can reach the real backend or an external provider.
  app.use("/api", (_req, res) => res.status(404).json({ message: "Fixture route unavailable" }));
  return {
    app, pool, state, database,
    async flush() { while (pending.size) await Promise.all([...pending]); },
    async close() {
      while (pending.size) await Promise.all([...pending]);
      await database.close();
    },
  };
}
