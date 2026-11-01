/**
 * One-off, explicitly authorized additive migration for the existing external DB.
 * Never invoked by build, startup, Publish, or post-merge.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { pool } from "../server/db";
import { campaignEmailSchema } from "../server/campaign-email-schema";

async function main() {
  const expected = process.argv[3];
  if (process.argv[2] !== "--apply-additive" || !/^[a-f0-9]{32}$/.test(expected || "")) {
    throw Error("Explicit authorization and expected database fingerprint required");
  }
  const client = await pool.connect();
  try {
    await client.query("BEGIN ISOLATION LEVEL REPEATABLE READ");
    await client.query("SET LOCAL search_path TO public");
    await client.query("SET LOCAL lock_timeout TO '3s'");
    await client.query("SET LOCAL statement_timeout TO '30s'");
    const identity = await client.query("SELECT md5(current_database()) AS fingerprint");
    if (identity.rows[0].fingerprint !== expected) throw Error("Database identity mismatch; migration aborted");
    const countsSql = `SELECT
      (SELECT count(*) FROM empresa_campaign_history)::int AS campaigns,
      (SELECT count(*) FROM empresa_contacts)::int AS contacts,
      (SELECT count(*) FROM users)::int AS users,
      (SELECT count(*) FROM conversations)::int AS conversations,
      (SELECT count(*) FROM messages)::int AS messages`;
    const before = (await client.query(countsSql)).rows[0];
    await client.query(campaignEmailSchema);
    const after = (await client.query(countsSql)).rows[0];
    if (JSON.stringify(before) !== JSON.stringify(after)) throw Error("Existing-row counts changed inside migration");
    await client.query("SELECT id,provider_message_id,accepted_at,opened_at FROM campaign_email_attempts LIMIT 0");
    await client.query("SELECT provider,event_id,message_id,contact_email,kind FROM campaign_email_events LIMIT 0");
    await client.query("COMMIT");
    const receipt = {
      appliedAt: new Date().toISOString(),
      authorized: true,
      operation: "additive_campaign_observability_tables",
      schemaSha256: createHash("sha256").update(campaignEmailSchema).digest("hex"),
      existingRowCountsBefore: before, existingRowCountsAfter: after,
      existingDataUpdatedOrDeleted: false, sendingPerformed: false,
      autoStartupMigrationAdded: false,
    };
    console.log(JSON.stringify(receipt));
    await mkdir("docs/evaluations", { recursive: true });
    await writeFile("docs/evaluations/mail-schema-activation.json", JSON.stringify(receipt, null, 2));
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    throw error;
  } finally { client.release(); }
}
main().catch(error => {
  // No connection strings, SQL parameters, SDK request headers, or credentials.
  console.error({ activationFailed: true, code: error?.code || error?.name || "unknown" });
  process.exitCode = 1;
}).finally(() => pool.end());
