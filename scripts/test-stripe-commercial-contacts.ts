import assert from "node:assert/strict";
import express from "express";
import { Pool } from "@neondatabase/serverless";
import { pool as applicationPool } from "../server/db";
import { normalizeStripeContactEmails, registerStripeCommercialContactRoutes } from "../server/stripe-commercial-contacts";
import { createStripeUnsubscribeToken, verifyStripeUnsubscribeToken, renderStripeCommercialLetter } from "../server/stripe-commercial-letter";

const normalized = normalizeStripeContactEmails([
  { email: " Example@Example.invalid " }, { email: "example@example.invalid" },
  { email: null }, { email: "invalid" }, { email: "<script>@invalid" },
]);
assert.equal(normalized.uniqueEmails, 1);
assert.equal(normalized.duplicateEmailRecords, 1);
assert.equal(normalized.invalidEmailRecords, 3);

const development = new Pool({ connectionString: process.env.DATABASE_URL });
const schema = `test_stripe_contacts_${Date.now()}`;
let client: any;
let server: ReturnType<ReturnType<typeof express>["listen"]> | undefined;
try {
  const [dev, app] = await Promise.all([
    development.query("SELECT md5(current_database()) AS fingerprint"),
    applicationPool.query("SELECT md5(current_database()) AS fingerprint"),
  ]);
  assert.notEqual(dev.rows[0].fingerprint, app.rows[0].fingerprint,
    "Refuse writes if test database matches application database");
  client = await development.connect();
  await client.query(`CREATE SCHEMA ${schema}`);
  await client.query(`SET search_path TO ${schema}, public`);
  await client.query(`
    CREATE TABLE stripe_commercial_contacts (
      id serial PRIMARY KEY,email text NOT NULL UNIQUE,
      imported_at timestamptz NOT NULL DEFAULT now(),last_seen_at timestamptz NOT NULL DEFAULT now());
    CREATE TABLE stripe_commercial_letter (id integer PRIMARY KEY,subject text NOT NULL,body text NOT NULL,updated_at timestamptz NOT NULL DEFAULT now());
    CREATE TABLE empresa_suppression_list (suppression_type text,normalized_value text,UNIQUE(suppression_type,normalized_value));
    CREATE TABLE users (email text,marketing_opted_out boolean);
    CREATE TABLE email_leads (email text,consent_marketing boolean,unsubscribed_at timestamptz);
    CREATE TABLE empresa_contacts (email text,opted_out boolean,opted_out_at timestamptz);
    CREATE TABLE institution_contacts (email text,opted_out boolean,opted_out_at timestamptz);
    CREATE TABLE mutua_contacts (email text,opted_out boolean,opted_out_at timestamptz);
    CREATE TABLE campaign_email_events (contact_email text,kind text);
    INSERT INTO empresa_suppression_list VALUES ('email','blocked@example.invalid');
    INSERT INTO users VALUES ('user@example.invalid',true);
    INSERT INTO empresa_contacts(email,opted_out) VALUES ('company@example.invalid',true);
    INSERT INTO institution_contacts(email,opted_out) VALUES ('institution@example.invalid',true);
    INSERT INTO mutua_contacts(email,opted_out) VALUES ('mutua@example.invalid',true);
    INSERT INTO campaign_email_events VALUES ('bounced@example.invalid','bounced');
  `);
  let providerCalls = 0;
  let providerFailure = false;
  let databaseMissing = false;
  const database = {
    query: (...args: any[]) => {
      if (databaseMissing) throw Object.assign(new Error("Missing"), { code: "42P01" });
      return client.query(...args);
    },
    connect: async () => ({ query: (...args: any[]) => client.query(...args), release() {} }),
  };
  const web = express();
  web.use(express.json());
  web.use((req: any, _res, next) => { req.session = { isAdmin: req.get("x-test-admin") === "yes" }; next(); });
  registerStripeCommercialContactRoutes(web, {
    database: database as any,
    signingSecret: () => "offline-fixture-secret",
    listCustomers: async () => {
      providerCalls++;
      if (providerFailure) throw new Error("Mock provider failed; must not leak");
      return ["normal", "blocked", "user", "company", "institution", "mutua", "bounced"]
        .map(name => ({ email: `${name}@example.invalid` }))
        .concat([{ email: " NORMAL@example.invalid " }, { email: "invalid" }]);
    },
  });
  server = web.listen(0, "127.0.0.1");
  await new Promise<void>(resolve => server!.once("listening", resolve));
  const port = (server.address() as any).port;
  const request = (path: string, options: RequestInit = {}) =>
    fetch(`http://127.0.0.1:${port}/api/admin/stripe-contacts${path}`, options);
  const headers = { "x-test-admin": "yes", "content-type": "application/json" };
  const publicRequest = (path: string, options: RequestInit = {}) =>
    fetch(`http://127.0.0.1:${port}/api/stripe-commercial/unsubscribe${path}`, options);
  assert.equal((await request("")).status, 401);
  assert.equal((await request("/letter")).status, 401);
  assert.equal((await request("/letter", { method: "PUT", headers: { "content-type": "application/json" }, body: "{}" })).status, 401);
  assert.equal((await request("/import", { method: "POST", headers: { "content-type": "application/json" } })).status, 401);
  assert.equal(providerCalls, 0);
  assert.equal((await request("/import", { method: "POST", headers: { ...headers, origin: "https://attacker.invalid" } })).status, 403);
  assert.equal(providerCalls, 0);
  databaseMissing = true;
  const missing = await request("/import", { method: "POST", headers });
  assert.equal(missing.status, 503);
  assert.equal((await missing.json()).code, "stripe_contacts_schema_pending");
  assert.equal(providerCalls, 0, "Missing schema must not call Stripe");
  databaseMissing = false;
  const first = await request("/import", { method: "POST", headers });
  assert.equal(first.status, 200);
  assert.deepEqual(await first.json(), {
    sourceRecords: 9, validEmailRecords: 8, uniqueEmails: 7,
    duplicateEmailRecords: 1, invalidEmailRecords: 1, inserted: 7, existing: 0,
    total: 7, commercialSendingEnabled: false,
  });
  const repeat = await (await request("/import", { method: "POST", headers })).json();
  assert.equal(repeat.inserted, 0);
  assert.equal(repeat.existing, 7);
  const list = await request("", { headers });
  assert.equal(list.headers.get("cache-control"), "no-store");
  const result = await list.json();
  assert.deepEqual(result.summary, { total: 7, pendingReview: 1, suppressed: 6, sendable: 0 });
  assert(result.contacts.every((c: any) => c.canSend === false && c.source === "stripe"));
  assert(result.contacts.every((c: any) => !("name" in c) && !("customer_id" in c)));
  const initialLetter = await (await request("/letter", { headers })).json();
  assert(initialLetter.body.includes("contratar"));
  assert.equal(initialLetter.updatedAt, null);
  assert.equal(initialLetter.commercialSendingEnabled, false);
  assert.equal((await request("/letter", { method: "PUT", headers: { ...headers, origin: "https://attacker.invalid" }, body: JSON.stringify({ subject: "Test", body: "Test" }) })).status, 403);
  assert.equal((await request("/letter", { method: "PUT", headers, body: JSON.stringify({ subject: "Bad\r\nBcc: x", body: "Test" }) })).status, 400);
  assert.equal((await request("/letter", { method: "PUT", headers, body: JSON.stringify({ subject: "Test", body: "Test", footer: "" }) })).status, 400);
  const draft = { subject: "Invitación NUXA", body: "Texto editable\n<script>alert(1)</script>" };
  const saved = await request("/letter", { method: "PUT", headers, body: JSON.stringify(draft) });
  assert.equal(saved.status, 200);
  const savedLetter = await saved.json();
  assert(savedLetter.updatedAt);
  assert.equal(savedLetter.footer, initialLetter.footer, "Required footer cannot be removed");
  assert.equal((await (await request("/letter", { headers })).json()).body, draft.body);
  const contact = (await client.query("SELECT id,email FROM stripe_commercial_contacts WHERE email='normal@example.invalid'")).rows[0];
  const token = createStripeUnsubscribeToken(contact, "offline-fixture-secret");
  assert(!token.includes("normal"), "Address not present in token");
  assert(verifyStripeUnsubscribeToken(token, contact, "offline-fixture-secret"));
  assert(!verifyStripeUnsubscribeToken(token, { ...contact, id: contact.id + 1 }, "offline-fixture-secret"));
  assert(!verifyStripeUnsubscribeToken(token, { ...contact, email: "different@example.invalid" }, "offline-fixture-secret"));
  assert(!verifyStripeUnsubscribeToken(token, contact, "wrong-fixture-secret"));
  const rendered = renderStripeCommercialLetter(draft, `https://nuxa.life/api/stripe-commercial/unsubscribe?token=${token}`);
  assert(!rendered.html.includes("<script>"));
  assert(rendered.html.includes("&lt;script&gt;"));
  assert(rendered.text.includes(initialLetter.ctaUrl));
  assert(rendered.text.includes(token));
  assert(rendered.text.includes(initialLetter.footer));
  assert.throws(() => renderStripeCommercialLetter(draft, "https://attacker.invalid/"));
  const beforePreview = (await client.query("SELECT count(*)::int AS n FROM empresa_suppression_list")).rows[0].n;
  assert.equal((await publicRequest("?preview=1")).status, 200);
  const confirm = await publicRequest(`?token=${token}`);
  assert.equal(confirm.status, 200);
  assert((await confirm.text()).includes("Confirmar baja"));
  assert.equal((await client.query("SELECT count(*)::int AS n FROM empresa_suppression_list")).rows[0].n, beforePreview, "GET/demo never mutates");
  const tampered = `${token.slice(0,-1)}${token.endsWith("A") ? "B" : "A"}`;
  assert.equal((await publicRequest(`?token=${tampered}`)).status, 400);
  assert.equal((await publicRequest("", { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ token: tampered }) })).status, 400);
  await client.query("INSERT INTO email_leads VALUES ('normal@example.invalid',true,null)");
  for (const table of ["empresa_contacts", "institution_contacts", "mutua_contacts"]) {
    await client.query(`INSERT INTO ${table}(email,opted_out) VALUES('normal@example.invalid',false)`);
  }
  await client.query("INSERT INTO users VALUES ('normal@example.invalid',false)");
  const beforeUnsubscribeCalls = providerCalls;
  for (let i=0; i<2; i++) {
    const optedOut = await publicRequest("", { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ token }) });
    assert.equal(optedOut.status, 200);
  }
  assert.equal(providerCalls, beforeUnsubscribeCalls, "Unsubscribe never calls Stripe");
  assert.equal((await client.query("SELECT count(*)::int AS n FROM empresa_suppression_list WHERE normalized_value=$1", [contact.email])).rows[0].n, 1);
  assert.equal((await client.query("SELECT consent_marketing FROM email_leads WHERE email=$1", [contact.email])).rows[0].consent_marketing, false);
  assert.equal((await (await request("", { headers })).json()).summary.suppressed, 7);
  const reimported = await (await request("/import", { method: "POST", headers })).json();
  assert.equal(reimported.inserted, 0);
  assert.equal((await (await request("", { headers })).json()).summary.suppressed, 7);
  await client.query("INSERT INTO users VALUES ('normal@example.invalid',true)");
  const changed = await (await request("", { headers })).json();
  assert.equal(changed.summary.suppressed, 7, "Opt-outs effective after import without reimport");
  providerFailure = true;
  const failure = await request("/import", { method: "POST", headers });
  assert.equal(failure.status, 503);
  assert(!(await failure.text()).includes("Mock provider"));
  assert.equal((await client.query("SELECT count(*)::int AS n FROM stripe_commercial_contacts")).rows[0].n, 7);
  console.log("PASS: admin auth, same-origin checks, draft persistence/validation, mandatory footer, escaped preview, signed email-bound unsubscribe, GET/demo non-mutating, forged tokens rejected, idempotent POST, opt-out across commercial sources, deduplicated reimport keeps suppression, no consent granted, provider failure safe. Synthetic development schema only; zero real Stripe requests, emails or production writes.");
} finally {
  if (server) await new Promise<void>(resolve => server!.close(() => resolve()));
  if (client) {
    await client.query("ROLLBACK").catch(() => {});
    await client.query("SET search_path TO public");
    await client.query(`DROP SCHEMA IF EXISTS ${schema} CASCADE`);
    client.release();
  }
  await development.end();
  await applicationPool.end();
}
