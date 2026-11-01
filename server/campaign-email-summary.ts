import type { Pool } from "@neondatabase/serverless";

export async function addCampaignDeliverySummaries(pool: Pool, campaigns: any[]) {
  if (!campaigns.length) return campaigns;
  try {
    const summary = await pool.query(`
      SELECT campaign_id,count(*)::int AS attempts,
        count(*) FILTER(WHERE accepted_at IS NOT NULL)::int AS accepted,
        count(*) FILTER(WHERE status='failed')::int AS rejected,
        count(*) FILTER(WHERE status='sending')::int AS uncertain,
        count(*) FILTER(WHERE delivered_at IS NOT NULL)::int AS delivered,
        count(*) FILTER(WHERE opened_at IS NOT NULL)::int AS unique_opens,
        count(*) FILTER(WHERE bounced_at IS NOT NULL)::int AS bounced,
        count(*) FILTER(WHERE blocked_at IS NOT NULL)::int AS blocked,
        count(*) FILTER(WHERE dropped_at IS NOT NULL)::int AS dropped,
        count(*) FILTER(WHERE deferred_at IS NOT NULL AND delivered_at IS NULL
          AND bounced_at IS NULL AND blocked_at IS NULL AND dropped_at IS NULL)::int AS deferred,
        count(*) FILTER(WHERE accepted_at IS NOT NULL AND delivered_at IS NULL
          AND bounced_at IS NULL AND blocked_at IS NULL AND dropped_at IS NULL)::int AS awaiting_delivery
      FROM campaign_email_attempts WHERE campaign_id=ANY($1::int[]) GROUP BY campaign_id`,
      [campaigns.map(c => c.id)],
    );
    const errors = await pool.query(`
      SELECT campaign_id,error_code,error_reason,count(*)::int AS count
      FROM campaign_email_attempts WHERE campaign_id=ANY($1::int[]) AND status='failed'
      GROUP BY campaign_id,error_code,error_reason ORDER BY count(*) DESC LIMIT 100`,
      [campaigns.map(c => c.id)],
    );
    const outcomes = await pool.query(`
      SELECT a.campaign_id,e.kind,e.reason,count(DISTINCT a.id)::int AS count
      FROM campaign_email_attempts a JOIN campaign_email_events e
        ON e.provider=a.provider AND e.message_id=a.provider_message_id AND e.contact_email=a.contact_email
      WHERE a.campaign_id=ANY($1::int[]) AND e.kind IN ('bounced','blocked','dropped','deferred','complained','unsubscribed')
      GROUP BY a.campaign_id,e.kind,e.reason ORDER BY count(DISTINCT a.id) DESC LIMIT 100`,
      [campaigns.map(c => c.id)],
    );
    return campaigns.map(c => ({
      ...c,
      delivery: summary.rows.find(s => s.campaign_id === c.id) || null,
      delivery_errors: errors.rows.filter(e => e.campaign_id === c.id),
      delivery_outcomes: outcomes.rows.filter(e => e.campaign_id === c.id),
      delivery_instrumentation_ready: true,
    }));
  } catch (error) {
    if ((error as { code?: string }).code !== "42P01") throw error;
    return campaigns.map(c => ({ ...c, delivery: null, delivery_errors: [], delivery_outcomes: [], delivery_instrumentation_ready: false }));
  }
}
