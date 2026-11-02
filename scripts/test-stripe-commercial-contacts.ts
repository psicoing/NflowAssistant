import assert from "node:assert/strict";
import express from "express";
import { Pool } from "@neondatabase/serverless";
import { pool as applicationPool } from "../server/db";
import { normalizeStripeContactEmails, registerStripeCommercialContactRoutes } from "../server/stripe-commercial-contacts";

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
    CREATE TABLE empresa_suppression_list (suppression_type text,normalized_value text);
    CREATE TABLE users (email text,marketing_opted_out boolean);
    CREATE TABLE empresa_contacts (email text,opted_out boolean);
    CREATE TABLE institution_contacts (email text,opted_out boolean);
    CREATE TABLE mutua_contacts (email text,opted_out boolean);
    CREATE TABLE campaign_email_events (contact_email text,kind text);
    INSERT INTO empresa_suppression_list VALUES ('email','blocked@example.invalid');
    INSERT INTO users VALUES ('user@example.invalid',true);
    INSERT INTO empresa_contacts VALUES ('company@example.invalid',true);
    INSERT INTO institution_contacts VALUES ('institution@example.invalid',true);
    INSERT INTO mutua_contacts VALUES ('mutua@example.invalid',true);
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
  assert.equal((await request("")).status, 401);
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
  await client.query("INSERT INTO users VALUES ('normal@example.invalid',true)");
  const changed = await (await request("", { headers })).json();
  assert.equal(changed.summary.suppressed, 7, "Opt-outs effective after import without reimport");
  providerFailure = true;
  const failure = await request("/import", { method: "POST", headers });
  assert.equal(failure.status, 503);
  assert(!(await failure.text()).includes("Mock provider"));
  assert.equal((await client.query("SELECT count(*)::int AS n FROM stripe_commercial_contacts")).rows[0].n, 7);
  console.log("PASS: admin auth, same-origin checks, schema guard, normalized deduplication, repeat import, all six suppression sources, post-import opt-out, no consent granted, provider failure safe. Synthetic development schema only; zero real Stripe requests, emails or production writes.");
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
