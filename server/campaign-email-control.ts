import type { Pool } from "@neondatabase/serverless";

export interface CampaignSendResult {
  ok: boolean;
  errorCode?: string;
  errorReason?: string;
}

/** Account-wide failures must stop a batch, not mark every contact as bad. */
export function mustStopCampaign(result: CampaignSendResult): boolean {
  if (result.ok) return false;
  const code = String(result.errorCode || "").toLowerCase();
  const numeric = Number(code);
  return [401, 402, 403, 429].includes(numeric) || numeric >= 500
    || /quota|rate.?limit|too_many_requests|insufficient.?credit|send_uncertain|send_failed/.test(code)
    || /daily.*quota|sending quota|too many requests|insufficient.*(credit|balance)/i.test(result.errorReason || "");
}

/** No retries, provider fallback, or owner copies here. Null means skipped. */
export async function runCampaignBatch<T>(
  contacts: T[],
  attempt: (contact: T, index: number) => Promise<CampaignSendResult | null>,
) {
  let sent = 0;
  let failed = 0;
  for (let index = 0; index < contacts.length; index++) {
    const result = await attempt(contacts[index], index);
    if (!result) continue;
    if (result.ok) sent++;
    else failed++;
    if (mustStopCampaign(result)) return { sent, failed, blocked: true };
  }
  return { sent, failed, blocked: false };
}

/**
 * Serialize commercial requests across processes/Autoscale instances sharing
 * the database. Wait 600ms before each provider call (~1.6 requests/sec maximum).
 * Transaction-scoped advisory lock releases on rollback/disconnect. No DDL or
 * business-row writes; never retry an ambiguous provider response.
 */
export async function paceCommercialEmail<T>(
  pool: Pick<Pool, "connect">,
  send: () => Promise<T>,
): Promise<T> {
  const client = await pool.connect();
  let destroy = false;
  try {
    await client.query("BEGIN");
    await client.query("SET LOCAL lock_timeout = '10s'");
    await client.query("SET LOCAL statement_timeout = '15s'");
    await client.query("SELECT pg_advisory_xact_lock(hashtext('nuxa-commercial-email-pacing'))");
    await client.query("SELECT pg_sleep(0.6)");
    return await send();
  } finally {
    try { await client.query("ROLLBACK"); }
    catch { destroy = true; }
    client.release(destroy);
  }
}
