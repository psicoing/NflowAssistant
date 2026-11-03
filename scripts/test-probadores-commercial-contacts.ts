import assert from "node:assert/strict";
import express from "express";
import { Pool } from "@neondatabase/serverless";
import { pool as applicationPool } from "../server/db";
import { listProbadoresEmails, registerProbadoresCommercialContactRoutes } from "../server/probadores-commercial-contacts";
import { registerStripeCommercialContactRoutes } from "../server/stripe-commercial-contacts";
import { createStripeUnsubscribeToken, verifyStripeUnsubscribeToken } from "../server/stripe-commercial-letter";

assert(process.env.DATABASE_URL, "Development database required");
const development = new Pool({ connectionString: process.env.DATABASE_URL });
const schema = `test_probadores_${Date.now()}`;
let client: any;
let server: ReturnType<ReturnType<typeof express>["listen"]> | undefined;
try {
  const [dev, app] = await Promise.all([
    development.query("SELECT md5(current_database()) AS fingerprint"),
    applicationPool.query("SELECT md5(current_database()) AS fingerprint"),
  ]);
  assert.notEqual(dev.rows[0].fingerprint, app.rows[0].fingerprint, "Refuse application database writes");
  client = await development.connect();
  await client.query(`CREATE SCHEMA ${schema}`);
  await client.query(`SET search_path TO ${schema}, public`);
  for (const audience of ["stripe", "probadores"]) {
    await client.query(`
      CREATE TABLE ${audience}_commercial_contacts(id serial PRIMARY KEY,email text NOT NULL UNIQUE,imported_at timestamptz DEFAULT now(),last_seen_at timestamptz DEFAULT now());
      CREATE TABLE ${audience}_commercial_letter(id integer PRIMARY KEY,subject text NOT NULL,body text NOT NULL,updated_at timestamptz DEFAULT now());
      CREATE TABLE ${audience}_commercial_authorizations(id serial PRIMARY KEY,contact_id integer,email text,action text,source text,evidence text,obtained_at timestamptz,recorded_by integer,recorded_at timestamptz DEFAULT now());
      CREATE TABLE ${audience}_commercial_dispatches(id text PRIMARY KEY,language text,subject text,body text,status text DEFAULT 'prepared',created_by integer,created_at timestamptz DEFAULT now());
      CREATE TABLE ${audience}_commercial_recipients(id serial PRIMARY KEY,dispatch_id text,contact_id integer,email text,dedupe_key text UNIQUE,status text DEFAULT 'pending',reason text,message_id text,attempted_at timestamptz);
    `);
  }
  await client.query(`
    CREATE TABLE users(email text,role text DEFAULT 'user',has_completed_payment boolean DEFAULT false,subscription_status text DEFAULT 'inactive',prepaid_questions integer DEFAULT 0,created_by_partner_id integer,marketing_opted_out boolean DEFAULT false);
    CREATE TABLE email_leads(email text,consent_marketing boolean DEFAULT true,unsubscribed_at timestamptz);
    CREATE TABLE empresa_suppression_list(suppression_type text,normalized_value text,UNIQUE(suppression_type,normalized_value));
    CREATE TABLE empresa_contacts(email text,opted_out boolean,opted_out_at timestamptz);
    CREATE TABLE institution_contacts(email text,opted_out boolean,opted_out_at timestamptz);
    CREATE TABLE mutua_contacts(email text,opted_out boolean,opted_out_at timestamptz);
    CREATE TABLE campaign_email_events(contact_email text,kind text);
    INSERT INTO users(email) VALUES ('free@example.invalid'),(' DUP@example.invalid '),(null);
    INSERT INTO users(email,role) VALUES ('trial@example.invalid','trial'),('admin@example.invalid','admin'),('partner@example.invalid','partner');
    INSERT INTO users(email,has_completed_payment) VALUES ('paid@example.invalid',true);
    INSERT INTO users(email,subscription_status) VALUES ('active@example.invalid','active');
    INSERT INTO users(email,prepaid_questions) VALUES ('credits@example.invalid',5);
    INSERT INTO users(email,created_by_partner_id) VALUES ('business@example.invalid',1);
    INSERT INTO email_leads(email) VALUES ('dup@example.invalid'),('resource@example.invalid'),('paid@example.invalid'),('admin@example.invalid'),('invalid');
    INSERT INTO email_leads VALUES ('optout@example.invalid',false,now());
    INSERT INTO stripe_commercial_contacts(email) VALUES ('free@example.invalid');
    INSERT INTO stripe_commercial_letter VALUES (1,'Stripe only','Stripe independent letter',now());
    INSERT INTO stripe_commercial_authorizations(contact_id,email,action) VALUES (1,'free@example.invalid','grant');
  `);
  const database = {
    query: (...args: any[]) => client.query(...args),
    connect: async () => ({ query: (...args: any[]) => client.query(...args), release() {} }),
  };
  const candidates = await listProbadoresEmails(database as any);
  assert(candidates.some(c => c.email === "resource@example.invalid"));
  for (const excluded of ["paid", "active", "credits", "admin", "partner", "business"]) {
    assert(!candidates.some(c => c.email === `${excluded}@example.invalid`), `Exclude ${excluded}`);
  }
  const messages: any[] = [];
  const web = express();
  web.use(express.json());
  web.use((req: any, _res, next) => { req.session = { isAdmin: req.get("x-test-admin") === "yes" }; next(); });
  const deps = {
    database: database as any, signingSecret: () => "synthetic-probadores-secret",
    pace: async <T>(send: () => Promise<T>) => send(),
    delivery: async (message: any) => {
      assert(message.to.endsWith("@example.invalid"));
      messages.push(message); return { statusCode: 202, messageId: `fixture-${messages.length}` };
    },
  };
  registerProbadoresCommercialContactRoutes(web, deps);
  registerStripeCommercialContactRoutes(web, { ...deps, listCustomers: async () => [] });
  server = web.listen(0, "127.0.0.1");
  await new Promise<void>(resolve => server!.once("listening", resolve));
  const root = `http://127.0.0.1:${(server.address() as any).port}`;
  const headers = { "x-test-admin": "yes", "content-type": "application/json" };
  const request = (path: string, init: RequestInit = {}) => fetch(`${root}/api/admin/probadores-contacts${path}`, { ...init, headers: { ...headers, ...init.headers } });
  assert.equal((await fetch(`${root}/api/admin/probadores-contacts`)).status, 401);
  assert.equal((await request("/import", { method: "POST", headers: { origin: "https://attacker.invalid" } })).status, 403);
  const imported = await (await request("/import", { method: "POST" })).json();
  assert.equal(imported.inserted, 5);
  assert.equal(messages.length, 0);
  assert.equal((await (await request("/import", { method: "POST" })).json()).inserted, 0);
  let contacts = await (await request("")).json();
  assert.equal(contacts.summary.total, 5);
  assert.equal(contacts.summary.suppressed, 1);
  assert.equal(contacts.summary.sendable, 0, "Neither legacy consent flag nor Stripe permission grants Probadores permission");
  assert(contacts.contacts.every((c: any) => c.source === "probadores"));
  const free = contacts.contacts.find((c: any) => c.email === "free@example.invalid");
  for (const language of ["es", "en"]) {
    const letter = await (await request(`/letter?language=${language}`)).json();
    assert(letter.subject.includes(language === "es" ? "Continúa" : "Continue"));
    assert(letter.previewUnsubscribeUrl.includes("/probadores-commercial/"));
    assert.equal((await request("/letter", { method: "PUT", body: JSON.stringify({ language, subject: `Probadores ${language}`, body: `Independent letter ${language}` }) })).status, 200);
  }
  assert.equal((await client.query("SELECT subject FROM stripe_commercial_letter WHERE id=1")).rows[0].subject, "Stripe only");
  const prepare = () => request("/dispatches", { method: "POST", body: JSON.stringify({ language: "en", contactIds: [free.id] }) });
  assert.equal((await prepare()).status, 409);
  assert.equal((await request(`/authorizations/${free.id}`, {
    method: "POST", body: JSON.stringify({ action: "grant", source: "form", evidence: "Synthetic explicit permission fixture", obtainedAt: new Date().toISOString(), attested: true }),
  })).status, 200);
  const preparedResponse = await prepare();
  assert.equal(preparedResponse.status, 200);
  const prepared = await preparedResponse.json();
  assert.equal(messages.length, 0, "Preparing never sends");
  assert.equal((await fetch(`${root}/api/admin/stripe-contacts/dispatches/${prepared.id}`, { headers })).status, 404);
  assert.equal((await request(`/dispatches/${prepared.id}/send`, { method: "POST", body: "{}" })).status, 400);
  assert.equal((await request(`/dispatches/${prepared.id}/send`, { method: "POST", body: '{"confirmation":"ENVIAR"}' })).status, 200);
  assert.equal(messages.length, 1);
  assert(messages[0].text.includes("/probadores-commercial/unsubscribe?token="));
  assert(!messages[0].text.includes("/stripe-commercial/"));
  await request(`/dispatches/${prepared.id}/send`, { method: "POST", body: '{"confirmation":"ENVIAR"}' });
  assert.equal(messages.length, 1);
  assert.equal((await prepare()).status, 409, "No duplicate batch for same letter");
  const secret = deps.signingSecret();
  const token = createStripeUnsubscribeToken(free, secret, "probadores");
  assert(!verifyStripeUnsubscribeToken(token, free, secret, "stripe"));
  assert(!verifyStripeUnsubscribeToken(createStripeUnsubscribeToken(free, secret), free, secret, "probadores"));
  assert.equal((await fetch(`${root}/api/stripe-commercial/unsubscribe?token=${token}`)).status, 400);
  const confirmation = await (await fetch(`${root}/api/probadores-commercial/unsubscribe?token=${token}&language=en`)).text();
  assert(confirmation.includes('action="/api/probadores-commercial/unsubscribe"'));
  assert.equal((await (await request("")).json()).summary.sendable, 1, "GET unsubscribe never mutates");
  for (let i = 0; i < 2; i++) {
    assert.equal((await fetch(`${root}/api/probadores-commercial/unsubscribe`, {
      method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ token, language: "en" }),
    })).status, 200);
  }
  await request("/import", { method: "POST" });
  assert.equal((await (await request("")).json()).summary.sendable, 0);
  const stripeContacts = await (await fetch(`${root}/api/admin/stripe-contacts`, { headers })).json();
  assert.equal(stripeContacts.summary.sendable, 0, "A global opt-out also prevents another audience from sending");
  assert.equal((await client.query("SELECT count(*)::int AS n FROM users")).rows[0].n, 10, "No account creation");
  console.log("PASS Probadores: local free registrations/resource leads, exclusions, deduplication, no consent by import, admin/origin protection, independent ES/EN drafts, permissions and histories, manual send mocked, replay protection, audience-bound unsubscribe, global opt-out, no account creation. Synthetic development schema only.");
} finally {
  if (server) await new Promise<void>(resolve => server!.close(() => resolve()));
  if (client) { await client.query(`DROP SCHEMA IF EXISTS ${schema} CASCADE`); client.release(); }
  await development.end();
  await applicationPool.end();
}
