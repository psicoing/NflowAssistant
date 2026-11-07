import express from "express";
import session from "express-session";
import bcrypt from "bcrypt";
import { isolatedDevelopmentDatabase } from "./development-test-database";
import { GoogleAccessError, GoogleAuthStore } from "../../server/google-auth-store";
import { registerGoogleAuthRoutes } from "../../server/google-auth";

/** Separate executable fixture, never mounted by the real application. */
export async function googleTestApp() {
  const database = await isolatedDevelopmentDatabase("google_auth");
  const { pool } = database;
  await pool.query(`
    CREATE TABLE users (
      id serial PRIMARY KEY, username text NOT NULL UNIQUE, password text NOT NULL, email text,
      birth_date text, role text DEFAULT 'user',user_type text DEFAULT 'individual',
      subscription_status text DEFAULT 'inactive',has_completed_payment boolean DEFAULT false,
      accepted_nuxa_notice boolean DEFAULT false,notice_accepted_at timestamptz,notice_version text,
      monthly_question_limit integer DEFAULT 10,questions_used_this_month integer DEFAULT 0,
      prepaid_questions integer DEFAULT 0,trial_phone_verified_at timestamptz,trial_email_verified_at timestamptz
    );
    CREATE TABLE nuxa_social_identities (
      identity_key text PRIMARY KEY,user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      provider text NOT NULL,created_at timestamptz NOT NULL DEFAULT now()
    );
  `);
  const password = "Only-Fixture-Password-482!";
  const hash = await bcrypt.hash(password, 10);
  await pool.query(
    `INSERT INTO users(username,password,email,subscription_status,has_completed_payment,
      monthly_question_limit,questions_used_this_month,prepaid_questions)
     VALUES ('fixture-paid',$1,'existing@example.invalid','active',true,999,37,7),
            ('fixture-admin',$1,'admin@example.invalid','active',true,999,0,0)`, [hash]);
  await pool.query("UPDATE users SET role='admin' WHERE username='fixture-admin'");
  const store = new GoogleAuthStore(pool);
  const state = { email: "new@example.invalid", subject: "new", verified: true, enabled: true };
  const app = express();
  app.use(express.json());
  app.use(session({ secret: "synthetic-google-isolated-fixture-only",resave: false,saveUninitialized: false,
    cookie: { httpOnly: true,sameSite: "lax" } }));
  registerGoogleAuthRoutes(app, {
    store, configured: () => state.enabled,
    identity: async () => {
      if (!state.verified) throw new GoogleAccessError("GOOGLE_UNVERIFIED", 403, "Identidad no verificada.");
      return { key: `https://fixture-issuer.invalid|${state.subject}`,email: state.email };
    },
  });
  app.get("/api/auth/me", async (req, res) => {
    if (!req.session.userId) return res.status(401).json({ message: "No local session" });
    const result = await pool.query("SELECT id,username,email,role,subscription_status,has_completed_payment FROM users WHERE id=$1", [req.session.userId]);
    res.json({ ...result.rows[0],subscriptionStatus: result.rows[0].subscription_status,
      hasActiveSubscription: result.rows[0].has_completed_payment });
  });
  app.post("/api/auth/logout", (req,res) => req.session.destroy(() => res.json({ success: true })));
  app.get("/api/prueba-gratis/estado", async (req,res) => {
    const user = req.session.userId
      ? (await pool.query("SELECT username,email FROM users WHERE id=$1",[req.session.userId])).rows[0]
      : undefined;
    res.json({cupoLleno:false,used:0,cap:100,verificationRequired:true,existingTrialUser:user});
  });
  app.get("/api/conversations", (_req,res) => res.json([]));
  app.get("/api/chat/service-status", (_req,res) => res.json({available:false,reason:"No AI providers in fixture"}));
  app.post("/__fixture/identity", (req,res) => {
    const mode = req.body.mode;
    if (!["new","existing","admin","unverified","disabled"].includes(mode)) return res.sendStatus(400);
    state.email = mode === "existing" ? "existing@example.invalid" : mode === "admin" ? "admin@example.invalid" : "new@example.invalid";
    state.subject = mode;
    state.verified = mode !== "unverified";
    state.enabled = mode !== "disabled";
    req.session.destroy(() => res.json({ success: true }));
  });
  app.get("/__fixture/state", async (_req,res) => res.json({
    schema: database.schema,
    users: (await pool.query("SELECT count(*)::int AS count FROM users")).rows[0].count,
    links: (await pool.query("SELECT count(*)::int AS count FROM nuxa_social_identities")).rows[0].count,
    providerCalls: 0,
  }));
  // No unknown API call can reach mail, payments, AI or actual users.
  app.use("/api", (_req,res) => res.status(404).json({ message: "No real providers in test fixture" }));
  return { app,pool,store,state,password,schema:database.schema,close: () => database.close() };
}
