import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import { campaignEmailSchema } from "../server/campaign-email-schema";
import { CampaignEmailStore } from "../server/campaign-email-store";
import { addCampaignDeliverySummaries } from "../server/campaign-email-summary";
import type { CampaignEmailEvent } from "../server/campaign-email-events";

neonConfig.webSocketConstructor = ws;
async function main() {
  if (!process.env.DATABASE_URL || !process.env.NEON_DATABASE_URL) throw Error("Both targets are needed to enforce isolation");
  const dev = new Pool({ connectionString: process.env.DATABASE_URL });
  const app = new Pool({ connectionString: process.env.NEON_DATABASE_URL });
  const schema = `mail_audit_test_${randomUUID().replaceAll("-", "")}`;
  let client: Awaited<ReturnType<typeof dev.connect>> | undefined;
  let created = false;
  try {
    const [d, p] = await Promise.all([
      dev.query("SELECT md5(current_database()) AS fingerprint"),
      app.query("SELECT md5(current_database()) AS fingerprint"),
    ]);
    assert.notEqual(d.rows[0].fingerprint, p.rows[0].fingerprint, "Refusing to write to the app/production database");
    client = await dev.connect();
    await client.query(`CREATE SCHEMA ${schema}`);
    created = true;
    await client.query(`SET search_path TO ${schema}`);
    await client.query(`
      CREATE TABLE empresa_campaign_history(id INT PRIMARY KEY,opens INT DEFAULT 0);
      INSERT INTO empresa_campaign_history(id) VALUES(1),(2),(3);
      CREATE TABLE empresa_contacts(id INT PRIMARY KEY,email TEXT,opted_out BOOLEAN DEFAULT FALSE,opted_out_at TIMESTAMPTZ);
      INSERT INTO empresa_contacts(id,email) VALUES(1,'owner@example.invalid'),(2,'other@example.invalid');
      CREATE TABLE empresa_suppression_list(suppression_type TEXT,normalized_value TEXT,UNIQUE(suppression_type,normalized_value));
      CREATE TABLE empresa_email_tracking(campaign_id INT,contact_email TEXT,resend_message_id TEXT,opened_at TIMESTAMPTZ);
      CREATE TABLE institution_email_tracking(LIKE empresa_email_tracking);
      CREATE TABLE mutua_email_tracking(LIKE empresa_email_tracking);
      CREATE TABLE institution_campaign_history(LIKE empresa_campaign_history);
      CREATE TABLE mutua_campaign_history(LIKE empresa_campaign_history);
      ${campaignEmailSchema}
    `);
    await client.query(campaignEmailSchema); // Migration is repeatable.
    // One dedicated connection in an isolated temporary schema; store transactions remain real PostgreSQL.
    const dedicated = client;
    const facade = {
      query: dedicated.query.bind(dedicated),
      connect: async () => ({ query: dedicated.query.bind(dedicated), release() {} }),
    } as unknown as Pool;
    const store = new CampaignEmailStore(facade);
    await store.ready();
    const id = await store.reserve(1, " Owner@EXAMPLE.invalid ", "a");
    assert(id);
    assert.equal(await store.reserve(1, "owner@example.invalid", "b"), undefined);
    const concurrent = await Promise.all(Array.from({ length: 12 }, () => store.reserve(1, "concurrent@example.invalid", "a")));
    assert.equal(concurrent.filter(Boolean).length, 1);
    const event = (overrides: Partial<CampaignEmailEvent> = {}): CampaignEmailEvent => ({
      provider: "sendgrid", id: randomUUID(), messageId: "accepted-1", email: "owner@example.invalid",
      kind: "opened", at: new Date().toISOString(), reason: null, ...overrides,
    });
    const early = event();
    await store.ingest([early]); // Provider event races ahead of SDK response.
    await store.finish(id, { ok: true, provider: "sendgrid", messageId: "accepted-1.trace" });
    await store.ingest([early, early]);
    await store.ingest([event({ kind: "delivered" }), event({ kind: "opened" })]);
    assert.equal((await client.query("SELECT count(*) FROM campaign_email_attempts WHERE opened_at IS NOT NULL")).rows[0].count, "1");
    assert.equal((await client.query("SELECT count(*) FROM campaign_email_events WHERE event_id=$1", [early.id])).rows[0].count, "1");
    const other = await store.reserve(2, "other@example.invalid", "a");
    assert(other);
    await store.finish(other, { ok: true, provider: "sendgrid", messageId: "accepted-2" });
    await store.ingest([event({ email: "other@example.invalid", kind: "opened" })]);
    assert.equal((await client.query("SELECT opened_at FROM campaign_email_attempts WHERE id=$1", [other])).rows[0].opened_at, null);
    await store.ingest([event({ kind: "complained" })]);
    assert.equal((await client.query("SELECT opted_out FROM empresa_contacts WHERE id=1")).rows[0].opted_out, true);
    assert.equal((await client.query("SELECT count(*) FROM empresa_suppression_list")).rows[0].count, "1");
    const rejected = await store.reserve(1, "reject@example.invalid", "b");
    assert(rejected);
    await store.finish(rejected, { ok: false, provider: "sendgrid", errorCode: "403", errorReason: "Sender not authenticated" });
    const summary = await addCampaignDeliverySummaries(facade, [{ id: 1 }]);
    assert.equal(summary[0].delivery.accepted, 1);
    assert.equal(summary[0].delivery.rejected, 1);
    assert.equal(summary[0].delivery.delivered, 1);
    assert.equal(summary[0].delivery.unique_opens, 1);
    assert.equal(summary[0].delivery.uncertain, 1);
    assert.equal(summary[0].delivery_errors[0].error_code, "403");
    await client.query("INSERT INTO empresa_email_tracking VALUES(3,'owner@example.invalid','legacy-resend',NULL)");
    assert.equal(await store.reserve(3, "owner@example.invalid", "a"), undefined, "Historical acceptance must not be resent");
    const legacy = event({ provider: "resend", messageId: "legacy-resend", kind: "opened" });
    await store.ingest([legacy, legacy]);
    await store.ingest([legacy]);
    assert.equal((await client.query("SELECT opens FROM empresa_campaign_history WHERE id=3")).rows[0].opens, 1);
    assert.equal((await client.query("SELECT count(*) FROM campaign_email_attempts WHERE campaign_id=3")).rows[0].count, "0");
    // A failed batch is atomic; the next retry can persist it.
    await assert.rejects(store.ingest([event(), event({ at: "invalid timestamp" })]));
    await store.ingest([event({ kind: "bounced", messageId: "accepted-2", email: "other@example.invalid" })]);
    assert.equal((await addCampaignDeliverySummaries(facade, [{ id: 2 }]))[0].delivery.bounced, 1);
    console.log("PASS: isolated PostgreSQL migration, per-campaign dedupe, legacy dedupe, event replay/race, exact ID+recipient matching, unique opens, opt-out/suppression, error detail, delivery summary and transactional rollback. Production read only.");
  } finally {
    if (client) {
      await client.query("ROLLBACK");
      await client.query("SET search_path TO public");
      if (created) await client.query(`DROP SCHEMA ${schema} CASCADE`);
      client.release();
    }
    await Promise.all([dev.end(), app.end()]);
  }
}
main().catch(e => { console.error("FAIL: isolated mail store test", e?.message); process.exitCode = 1; });
