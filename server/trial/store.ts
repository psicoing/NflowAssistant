import { createHmac, randomBytes, randomUUID } from "node:crypto";
import type { Pool } from "@neondatabase/serverless";

export const TRIAL_LIMIT = 2;
export const SMS_MONTHLY_MICRO_USD = 5_000_000;
export class TrialError extends Error {
  constructor(public status: number, public code: string, message: string) { super(message); }
}
export const unavailableTrial = () => new TrialError(409, "TRIAL_UNAVAILABLE",
  "No podemos activar otra prueba con estos datos. Si ya tienes cuenta, inicia sesión o elige un plan de pago.");

export async function ensureTrialTables(pool: Pool) {
  // Keep the legacy <=5 storage constraint so historical consumption remains intact.
  // The current access limit is enforced atomically by reserveQuestion, not by resetting rows.
  await pool.query(`
    ALTER TABLE users ADD COLUMN IF NOT EXISTS trial_email_verified_at TIMESTAMPTZ;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS trial_phone_verified_at TIMESTAMPTZ;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS trial_phone_hash TEXT;
    CREATE TABLE IF NOT EXISTS nuxa_trial_security (
      id INTEGER PRIMARY KEY CHECK(id=1), hmac_key TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS nuxa_trial_flows (
      id TEXT PRIMARY KEY, session_hash TEXT NOT NULL, username TEXT NOT NULL,
      email TEXT NOT NULL, password_hash TEXT, phone TEXT NOT NULL,
      phone_hash TEXT NOT NULL, email_hash TEXT NOT NULL, existing_user_id INTEGER,
      email_code_hash TEXT, sms_code_hash TEXT,
      email_code_expires_at TIMESTAMPTZ, sms_code_expires_at TIMESTAMPTZ,
      email_sent_at TIMESTAMPTZ, sms_sent_at TIMESTAMPTZ,
      email_verified_at TIMESTAMPTZ, phone_verified_at TIMESTAMPTZ,
      email_attempts INTEGER NOT NULL DEFAULT 0, sms_attempts INTEGER NOT NULL DEFAULT 0,
      email_sends INTEGER NOT NULL DEFAULT 0, sms_sends INTEGER NOT NULL DEFAULT 0,
      expires_at TIMESTAMPTZ NOT NULL, completed_user_id INTEGER,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS nuxa_trial_identities (
      phone_hash TEXT PRIMARY KEY, email_hash TEXT NOT NULL UNIQUE,
      user_id INTEGER NOT NULL UNIQUE, used INTEGER NOT NULL DEFAULT 0,
      reserved INTEGER NOT NULL DEFAULT 0, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      CHECK(used>=0 AND reserved>=0 AND used+reserved<=5)
    );
    CREATE TABLE IF NOT EXISTS nuxa_trial_questions (
      id TEXT PRIMARY KEY, phone_hash TEXT NOT NULL REFERENCES nuxa_trial_identities(phone_hash),
      state TEXT NOT NULL DEFAULT 'reserved', created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS nuxa_trial_rate_limits (
      key TEXT PRIMARY KEY, used INTEGER NOT NULL DEFAULT 1, expires_at TIMESTAMPTZ NOT NULL
    );
    CREATE TABLE IF NOT EXISTS nuxa_trial_sms_months (
      month TEXT PRIMARY KEY, maximum_micro_usd BIGINT NOT NULL DEFAULT 5000000,
      booked_micro_usd BIGINT NOT NULL DEFAULT 0, faulted BOOLEAN NOT NULL DEFAULT FALSE
    );
    CREATE TABLE IF NOT EXISTS nuxa_trial_sms_sends (
      id TEXT PRIMARY KEY, month TEXT NOT NULL REFERENCES nuxa_trial_sms_months(month),
      maximum_micro_usd BIGINT NOT NULL, provider_id TEXT, state TEXT NOT NULL DEFAULT 'reserved',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
  await pool.query("INSERT INTO nuxa_trial_security(id,hmac_key) VALUES(1,$1) ON CONFLICT DO NOTHING",
    [randomBytes(32).toString("hex")]);
}

export class TrialStore {
  private key?: string;
  constructor(public pool: Pool) {}
  async hash(scope: string, value: string) {
    if (!this.key) this.key = (await this.pool.query("SELECT hmac_key FROM nuxa_trial_security WHERE id=1")).rows[0]?.hmac_key;
    if (!this.key) throw new Error("Trial security unavailable");
    return createHmac("sha256", this.key).update(`${scope}:${value}`).digest("hex");
  }
  async rate(scope: string, value: string, maximum: number, seconds: number) {
    const window = Math.floor(Date.now() / (seconds * 1000));
    const key = await this.hash(`rate:${scope}:${window}`, value);
    const result = await this.pool.query(`
      INSERT INTO nuxa_trial_rate_limits(key,used,expires_at) VALUES($1,1,$2)
      ON CONFLICT(key) DO UPDATE SET used=nuxa_trial_rate_limits.used+1
      WHERE nuxa_trial_rate_limits.used<$3 RETURNING key`,
    [key, new Date((window + 1) * seconds * 1000), maximum]);
    if (!result.rowCount) throw new TrialError(429, "RATE_LIMIT",
      "Demasiados intentos. Espera antes de volver a intentarlo.");
  }
  async cleanExpired() {
    // Contact details and password hashes only live for the onboarding window.
    await this.pool.query("DELETE FROM nuxa_trial_flows WHERE expires_at<NOW()");
    await this.pool.query("DELETE FROM nuxa_trial_rate_limits WHERE expires_at<NOW()");
  }
  async state(userId: number) {
    const r = await this.pool.query(`
      SELECT u.subscription_status,u.trial_email_verified_at,u.trial_phone_verified_at,
             i.used,i.reserved
      FROM users u LEFT JOIN nuxa_trial_identities i
        ON i.user_id=u.id AND i.phone_hash=u.trial_phone_hash WHERE u.id=$1`, [userId]);
    const user = r.rows[0];
    if (!user || user.subscription_status !== "trial") return null;
    if (!user.trial_email_verified_at || !user.trial_phone_verified_at || user.used == null) {
      throw new TrialError(403, "TRIAL_VERIFICATION_REQUIRED",
        "Verifica tu correo y tu móvil en «Prueba NUXA gratis» antes de usar las preguntas gratuitas.");
    }
    const remaining = Math.max(0, TRIAL_LIMIT - user.used - user.reserved);
    return { used: Number(user.used), remaining, limit: TRIAL_LIMIT, canAsk: remaining > 0 };
  }
  async reserveQuestion(userId: number): Promise<string | null> {
    const credits = await this.pool.query("SELECT prepaid_questions FROM users WHERE id=$1", [userId]);
    if ((credits.rows[0]?.prepaid_questions || 0) > 0) return null;
    if (!(await this.state(userId))) return null; // Paid plans keep their own accounting.
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      const r = await client.query(`UPDATE nuxa_trial_identities SET reserved=reserved+1
        WHERE user_id=$1 AND used+reserved<$2 RETURNING phone_hash`, [userId, TRIAL_LIMIT]);
      if (!r.rowCount) throw new TrialError(429, "TRIAL_EXHAUSTED",
        "Has agotado las 2 preguntas gratuitas. A partir de la tercera necesitas contratar acceso de pago. La prueba no se renueva cada mes.");
      const id = randomUUID();
      await client.query("INSERT INTO nuxa_trial_questions(id,phone_hash) VALUES($1,$2)",
        [id, r.rows[0].phone_hash]);
      await client.query("COMMIT");
      return id;
    } catch (error) { await client.query("ROLLBACK"); throw error; }
    finally { client.release(); }
  }
  async settleQuestion(id: string, delivered: boolean) {
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      const r = await client.query(`UPDATE nuxa_trial_questions SET state=$2
        WHERE id=$1 AND state='reserved' RETURNING phone_hash`,
      [id, delivered ? "delivered" : "released"]);
      if (r.rowCount) {
        const identity = await client.query(`UPDATE nuxa_trial_identities
          SET reserved=reserved-1,used=used+$2 WHERE phone_hash=$1 RETURNING user_id,used`,
        [r.rows[0].phone_hash, delivered ? 1 : 0]);
        await client.query(`UPDATE users SET questions_used_this_month=$2
          WHERE id=$1 AND subscription_status='trial'`,
        [identity.rows[0].user_id, identity.rows[0].used]);
      }
      await client.query("COMMIT");
    } catch (error) { await client.query("ROLLBACK"); throw error; }
    finally { client.release(); }
  }
  async bookSms(maximumMicroUsd: number) {
    if (!Number.isSafeInteger(maximumMicroUsd) || maximumMicroUsd <= 0) throw new Error("Unpriced SMS");
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      const month = new Date().toISOString().slice(0, 7);
      await client.query(`INSERT INTO nuxa_trial_sms_months(month,maximum_micro_usd)
        VALUES($1,$2) ON CONFLICT DO NOTHING`, [month, SMS_MONTHLY_MICRO_USD]);
      const budget = await client.query(`UPDATE nuxa_trial_sms_months
        SET booked_micro_usd=booked_micro_usd+$2
        WHERE month=$1 AND booked_micro_usd+$2<=LEAST(maximum_micro_usd,$3)
          AND NOT faulted AND NOT EXISTS(SELECT 1 FROM nuxa_trial_sms_months WHERE faulted)
        RETURNING month`, [month, maximumMicroUsd, SMS_MONTHLY_MICRO_USD]);
      if (!budget.rowCount) throw new TrialError(429, "SMS_BUDGET_EXHAUSTED",
        "Los SMS de verificación no están disponibles por ahora. Inténtalo el próximo mes.");
      const id = randomUUID();
      await client.query("INSERT INTO nuxa_trial_sms_sends(id,month,maximum_micro_usd) VALUES($1,$2,$3)",
        [id, month, maximumMicroUsd]);
      await client.query("COMMIT");
      return id;
    } catch (error) { await client.query("ROLLBACK"); throw error; }
    finally { client.release(); }
  }
}
