import { randomUUID } from "node:crypto";
import type { Pool, PoolClient } from "@neondatabase/serverless";
import { normalizeMailMessageId, type CampaignEmailEvent, type EmailProvider } from "./campaign-email-events";

type Queryable = Pick<PoolClient, "query">;
export class CampaignEmailStore {
  constructor(private pool: Pool) {}

  async ready() {
    // Deliberately no CREATE/ALTER in application startup or webhook handling.
    await this.pool.query("SELECT id FROM campaign_email_attempts LIMIT 0");
    await this.pool.query("SELECT event_id FROM campaign_email_events LIMIT 0");
  }

  async reserve(campaignId: number, email: string, variant: string) {
    const id = randomUUID();
    const r = await this.pool.query(
      `INSERT INTO campaign_email_attempts(id,campaign_id,contact_email,subject_variant)
       SELECT $1,$2,$3,$4 WHERE NOT EXISTS (
         SELECT 1 FROM empresa_email_tracking WHERE campaign_id=$2 AND lower(trim(contact_email))=$3
       ) ON CONFLICT(campaign_id,contact_email) DO NOTHING RETURNING id`,
      [id, campaignId, email.trim().toLowerCase(), variant],
    );
    return r.rows[0]?.id as string | undefined;
  }

  async finish(id: string, result: {
    ok: boolean; provider?: EmailProvider; messageId?: string; errorCode?: string; errorReason?: string;
  }) {
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(
        `UPDATE campaign_email_attempts SET provider=$2,provider_message_id=$3,status=$4,
           error_code=$5,error_reason=$6,accepted_at=CASE WHEN $7 THEN NOW() ELSE NULL END WHERE id=$1`,
        [id, result.provider || null,
          result.messageId && result.provider ? normalizeMailMessageId(result.provider, result.messageId) : null,
          result.ok ? "accepted" : "failed", result.errorCode || null, result.errorReason || null, result.ok],
      );
      await this.reconcile(client, [id]);
      await client.query("COMMIT");
    } catch (e) { await client.query("ROLLBACK"); throw e; }
    finally { client.release(); }
  }

  async ingest(events: CampaignEmailEvent[]) {
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      for (const e of events) {
        await client.query(
          `INSERT INTO campaign_email_events(provider,event_id,message_id,contact_email,kind,happened_at,reason)
           VALUES($1,$2,$3,$4,$5,$6,$7) ON CONFLICT(provider,event_id) DO NOTHING`,
          [e.provider, e.id, e.messageId, e.email, e.kind, e.at, e.reason],
        );
      }
      const ids = await client.query(`
        SELECT DISTINCT a.id FROM campaign_email_attempts a
        JOIN jsonb_to_recordset($1::jsonb) AS e(provider text,"messageId" text,email text)
        ON e.provider=a.provider AND e."messageId"=a.provider_message_id AND e.email=a.contact_email`,
        [JSON.stringify(events)],
      );
      await this.reconcile(client, ids.rows.map(row => row.id));
      // Preserve tracking for previously accepted Resend mail without trusting tags.
      // An unknown ID or owner-copy email cannot select a campaign.
      for (const prefix of ["empresa", "institution", "mutua"]) {
        await client.query(`
          UPDATE ${prefix}_email_tracking t SET opened_at=e.happened_at
          FROM campaign_email_events e, jsonb_to_recordset($1::jsonb) AS incoming(provider text,id text)
          WHERE e.provider='resend' AND incoming.provider=e.provider AND incoming.id=e.event_id
            AND e.kind='opened' AND e.message_id=t.resend_message_id
            AND e.contact_email=lower(trim(t.contact_email)) AND t.opened_at IS NULL`,
          [JSON.stringify(events)],
        );
        await client.query(`
          UPDATE ${prefix}_campaign_history h SET opens=(
            SELECT count(DISTINCT lower(trim(contact_email))) FROM ${prefix}_email_tracking t
            WHERE t.campaign_id=h.id AND t.opened_at IS NOT NULL)
          WHERE h.id IN (
            SELECT t.campaign_id FROM ${prefix}_email_tracking t
            JOIN campaign_email_events e ON e.message_id=t.resend_message_id AND e.contact_email=lower(trim(t.contact_email))
            JOIN jsonb_to_recordset($1::jsonb) AS incoming(provider text,id text)
              ON incoming.provider=e.provider AND incoming.id=e.event_id
            WHERE e.provider='resend' AND e.kind='opened')`,
          [JSON.stringify(events)],
        );
      }
      await client.query("COMMIT");
    } catch (e) { await client.query("ROLLBACK"); throw e; }
    finally { client.release(); }
  }

  private async reconcile(client: Queryable, ids: string[]) {
    if (!ids.length) return;
    // Match only authentic provider IDs AND exact recipient, never client tags.
    // Replay reconciles events that arrived before the mail/send response.
    await client.query(`
      WITH matching AS (
        SELECT a.id,
          min(e.happened_at) FILTER(WHERE e.kind='delivered') AS delivered,
          min(e.happened_at) FILTER(WHERE e.kind='opened') AS opened,
          min(e.happened_at) FILTER(WHERE e.kind='clicked') AS clicked,
          min(e.happened_at) FILTER(WHERE e.kind='bounced') AS bounced,
          min(e.happened_at) FILTER(WHERE e.kind='blocked') AS blocked,
          min(e.happened_at) FILTER(WHERE e.kind='dropped') AS dropped,
          min(e.happened_at) FILTER(WHERE e.kind='deferred') AS deferred
        FROM campaign_email_attempts a JOIN campaign_email_events e
          ON e.provider=a.provider AND e.message_id=a.provider_message_id AND e.contact_email=a.contact_email
        WHERE a.id=ANY($1::text[]) GROUP BY a.id
      )
      UPDATE campaign_email_attempts a SET
        delivered_at=m.delivered,opened_at=m.opened,clicked_at=m.clicked,
        bounced_at=m.bounced,blocked_at=m.blocked,dropped_at=m.dropped,deferred_at=m.deferred
      FROM matching m WHERE a.id=m.id`, [ids]);
    await client.query(`
      INSERT INTO empresa_suppression_list(suppression_type,normalized_value)
      SELECT DISTINCT 'email',a.contact_email FROM campaign_email_attempts a
      JOIN campaign_email_events e ON e.provider=a.provider AND e.message_id=a.provider_message_id AND e.contact_email=a.contact_email
      WHERE a.id=ANY($1::text[]) AND e.kind IN ('unsubscribed','complained')
      ON CONFLICT(suppression_type,normalized_value) DO NOTHING`, [ids]);
    await client.query(`
      UPDATE empresa_contacts ec SET opted_out=true,opted_out_at=COALESCE(opted_out_at,NOW())
      WHERE NOT ec.opted_out AND EXISTS (
        SELECT 1 FROM campaign_email_attempts a JOIN campaign_email_events e
          ON e.provider=a.provider AND e.message_id=a.provider_message_id AND e.contact_email=a.contact_email
        WHERE a.id=ANY($1::text[]) AND a.contact_email=lower(trim(ec.email)) AND e.kind IN ('unsubscribed','complained'))`, [ids]);
    await client.query(`
      UPDATE empresa_email_tracking t SET opened_at=a.opened_at
      FROM campaign_email_attempts a WHERE a.campaign_id=t.campaign_id
        AND a.contact_email=lower(trim(t.contact_email)) AND a.opened_at IS NOT NULL AND t.opened_at IS NULL
        AND a.id=ANY($1::text[])`, [ids]);
    await client.query(`
      UPDATE empresa_campaign_history h SET opens=(
        SELECT count(*) FROM (
          SELECT lower(trim(t.contact_email)) AS email FROM empresa_email_tracking t
          WHERE t.campaign_id=h.id AND t.opened_at IS NOT NULL
          UNION
          SELECT a.contact_email FROM campaign_email_attempts a
          WHERE a.campaign_id=h.id AND a.opened_at IS NOT NULL
        ) unique_recipients)
      WHERE h.id IN (SELECT campaign_id FROM campaign_email_attempts WHERE id=ANY($1::text[]))`, [ids]);
  }
}
