/**
 * Development schema, never run by server startup or against managed production.
 * Apply to verified development; Replit Publish carries the additive schema diff.
 * Historical successes are not backfilled as delivered.
 */
export const campaignEmailSchema = `
CREATE TABLE IF NOT EXISTS campaign_email_attempts (
  id TEXT PRIMARY KEY,
  campaign_id INTEGER NOT NULL REFERENCES empresa_campaign_history(id),
  contact_email TEXT NOT NULL,
  subject_variant TEXT NOT NULL DEFAULT 'a',
  provider TEXT,
  provider_message_id TEXT,
  status TEXT NOT NULL DEFAULT 'sending',
  error_code TEXT,
  error_reason TEXT,
  accepted_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  bounced_at TIMESTAMPTZ,
  blocked_at TIMESTAMPTZ,
  dropped_at TIMESTAMPTZ,
  deferred_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (campaign_id, contact_email)
);
CREATE INDEX IF NOT EXISTS campaign_email_attempts_message
  ON campaign_email_attempts(provider, provider_message_id, contact_email);
CREATE TABLE IF NOT EXISTS campaign_email_events (
  provider TEXT NOT NULL,
  event_id TEXT NOT NULL,
  message_id TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  kind TEXT NOT NULL,
  happened_at TIMESTAMPTZ NOT NULL,
  reason TEXT,
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (provider, event_id)
);
CREATE INDEX IF NOT EXISTS campaign_email_events_message
  ON campaign_email_events(provider, message_id, contact_email);
`;
