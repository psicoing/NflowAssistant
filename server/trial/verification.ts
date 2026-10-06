import { randomInt, randomUUID, timingSafeEqual } from "node:crypto";
import bcrypt from "bcrypt";
import { z } from "zod";
import type { TrialProviders } from "./providers";
import { normalizeTrialPhone } from "./providers";
import { TrialStore, TrialError, unavailableTrial } from "./store";

export interface TrialCaller { sessionId: string; ip: string; userId?: number }
const startSchema = z.object({
  username: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(254),
  password: z.string().max(72).optional(),
  phone: z.string().max(40),
  privacyAccepted: z.literal(true),
});
const otpSchema = z.string().regex(/^\d{6}$/);
const newCode = () => String(randomInt(0, 1_000_000)).padStart(6, "0");
const equalHash = (a: string, b: string) => a.length === b.length &&
  timingSafeEqual(Buffer.from(a), Buffer.from(b));

export class TrialVerification {
  constructor(public store: TrialStore, private providers: TrialProviders) {}

  async flow(id: string, caller: TrialCaller) {
    if (typeof id !== "string" || !/^[a-f0-9-]{36}$/.test(id)) {
      throw new TrialError(400, "INVALID_FLOW", "Empieza de nuevo la verificación.");
    }
    const hash = await this.store.hash("session", caller.sessionId);
    const result = await this.store.pool.query(`SELECT * FROM nuxa_trial_flows
      WHERE id=$1 AND expires_at>NOW()
        AND (session_hash=$2 OR (completed_user_id IS NOT NULL AND completed_user_id=$3))`,
    [id, hash, caller.userId ?? null]);
    if (!result.rowCount) throw new TrialError(410, "FLOW_EXPIRED",
      "La verificación ha caducado. Empieza de nuevo.");
    return result.rows[0];
  }
  async start(input: unknown, caller: TrialCaller) {
    const parsed = startSchema.safeParse(input);
    if (!parsed.success) throw new TrialError(400, "INVALID_DETAILS",
      "Revisa los datos y acepta el uso del móvil para verificar la prueba.");
    await this.store.rate("start-ip-hour", caller.ip, 5, 3600);
    await this.store.rate("start-ip-day", caller.ip, 20, 86400);
    await this.store.cleanExpired();
    const data = parsed.data;
    const email = data.email.toLowerCase();
    const phone = normalizeTrialPhone(data.phone);
    const existing = caller.userId
      ? (await this.store.pool.query("SELECT * FROM users WHERE id=$1", [caller.userId])).rows[0]
      : null;
    if (existing && existing.subscription_status !== "trial") {
      throw new TrialError(409, "ACCOUNT_NOT_TRIAL", "Ya tienes cuenta. Accede con tu plan actual.");
    }
    if (existing && (existing.username !== data.username || existing.email?.trim().toLowerCase() !== email)) {
      throw new TrialError(400, "EXISTING_ACCOUNT", "Verifica el correo asociado a tu cuenta actual.");
    }
    if (!existing && (data.username.length < 3 || data.username.length > 60)) {
      throw new TrialError(400, "INVALID_USERNAME", "El nombre de usuario debe tener entre 3 y 60 caracteres.");
    }
    if (existing?.trial_phone_verified_at) {
      throw new TrialError(409, "ALREADY_VERIFIED", "Tu cuenta ya está verificada. Continúa al chat.");
    }
    if (!existing && (!data.password || data.password.length < 8 || Buffer.byteLength(data.password) > 72)) {
      throw new TrialError(400, "INVALID_PASSWORD", "La contraseña debe tener entre 8 y 72 bytes.");
    }
    const phoneHash = await this.store.hash("phone", phone);
    const emailHash = await this.store.hash("email", email);
    // No clinical data or explicit account-existence information in rejection.
    const conflict = await this.store.pool.query(`SELECT 1 FROM nuxa_trial_identities
      WHERE phone_hash=$1 OR email_hash=$2 OR user_id=$3`,
    [phoneHash, emailHash, existing?.id ?? null]);
    if (conflict.rowCount) throw unavailableTrial();
    if (!existing) {
      const accounts = await this.store.pool.query(`SELECT 1 FROM users
        WHERE username=$1 OR LOWER(TRIM(email))=$2 LIMIT 1`, [data.username, email]);
      if (accounts.rowCount) throw unavailableTrial();
      const capacity = await this.store.pool.query(`SELECT COUNT(*)::integer AS total FROM users
        WHERE subscription_status='trial' AND created_at>=date_trunc('month',NOW())`);
      if (capacity.rows[0].total >= 250) throw new TrialError(429, "TRIAL_CAPACITY", "El cupo de pruebas de este mes está completo.");
    }
    await this.store.rate("email-start-day", emailHash, 5, 86400);
    const id = randomUUID();
    const expiresAt = new Date(Date.now() + 30 * 60_000);
    // One active onboarding flow per session. Starting over invalidates old codes.
    const sessionHash = await this.store.hash("session", caller.sessionId);
    await this.store.pool.query("DELETE FROM nuxa_trial_flows WHERE session_hash=$1 AND completed_user_id IS NULL", [sessionHash]);
    await this.store.pool.query(`INSERT INTO nuxa_trial_flows
      (id,session_hash,username,email,password_hash,phone,phone_hash,email_hash,existing_user_id,expires_at)
      VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
    [id, sessionHash, data.username, email, existing ? null : await bcrypt.hash(data.password!, 10),
      phone, phoneHash, emailHash, existing?.id ?? null, expiresAt]);
    try { await this.send(id, "email", caller); }
    catch (error) { await this.store.pool.query("DELETE FROM nuxa_trial_flows WHERE id=$1", [id]); throw error; }
    return { flowId: id, step: "email", expiresAt: expiresAt.toISOString(), resendAfterSeconds: 60 };
  }
  async send(id: string, channel: "email" | "sms", caller: TrialCaller) {
    const flow = await this.flow(id, caller);
    if (flow.completed_user_id) throw new TrialError(409, "ALREADY_VERIFIED", "La verificación ya está completada.");
    if (channel === "sms" && !flow.email_verified_at) {
      throw new TrialError(403, "EMAIL_REQUIRED", "Verifica primero tu correo.");
    }
    if (channel === "email" && flow.email_verified_at) {
      throw new TrialError(409, "EMAIL_ALREADY_VERIFIED", "El correo ya está verificado; continúa con el móvil.");
    }
    const field = channel === "email" ? "email" : "sms"; // Closed enum, never user SQL.
    await this.store.rate(`send-${field}-ip`, caller.ip, 10, 3600);
    await this.store.rate(`send-${field}-identity-day`, field === "email" ? flow.email_hash : flow.phone_hash, 3, 86400);
    const code = newCode();
    const hash = await this.store.hash(`otp:${id}:${field}`, code);
    const expiry = new Date(Date.now() + 10 * 60_000);
    const claimed = await this.store.pool.query(`UPDATE nuxa_trial_flows SET
      ${field}_code_hash=$2,${field}_code_expires_at=$3,${field}_sent_at=NOW(),
      ${field}_attempts=0,${field}_sends=${field}_sends+1
      WHERE id=$1 AND completed_user_id IS NULL AND ${field}_sends<3
        AND (${field}_sent_at IS NULL OR ${field}_sent_at<NOW()-INTERVAL '60 seconds')
      RETURNING id`, [id, hash, expiry]);
    if (!claimed.rowCount) throw new TrialError(429, "RESEND_LIMIT",
      "Espera 60 segundos para reenviar el código. Hay un máximo de 3 envíos.");
    let smsReservation: string | undefined;
    try {
      if (channel === "email") await this.providers.email(flow.email, code);
      else {
        const maximum = await this.providers.quoteSms(flow.phone);
        smsReservation = await this.store.bookSms(maximum);
        const sent = await this.providers.sms(flow.phone, code);
        await this.store.pool.query(`UPDATE nuxa_trial_sms_sends
          SET provider_id=$2,state='sent' WHERE id=$1`, [smsReservation, sent.id]);
        if (sent.priceMicroUsd !== undefined && sent.priceMicroUsd > maximum) {
          await this.store.pool.query(`UPDATE nuxa_trial_sms_months SET faulted=TRUE
            WHERE month=(SELECT month FROM nuxa_trial_sms_sends WHERE id=$1)`, [smsReservation]);
        }
      }
    } catch (error) {
      // A timeout may be charged. Never free a financial reservation blindly.
      if (smsReservation) await this.store.pool.query(
        "UPDATE nuxa_trial_sms_sends SET state='uncertain' WHERE id=$1", [smsReservation]);
      await this.store.pool.query(`UPDATE nuxa_trial_flows SET ${field}_code_hash=NULL WHERE id=$1 AND ${field}_code_hash=$2`, [id, hash]);
      if (error instanceof TrialError) throw error;
      // Provider errors can contain email, phone or credentials: do not log them.
      console.error(`[trial-verification] ${field} provider failed`);
      throw new TrialError(503, "DELIVERY_UNAVAILABLE",
        "No hemos podido enviar el código. Espera un minuto e inténtalo de nuevo.");
    }
    return { step: channel, expiresAt: expiry.toISOString(), resendAfterSeconds: 60 };
  }
  async check(id: string, channel: "email" | "sms", code: unknown, caller: TrialCaller) {
    if (!otpSchema.safeParse(code).success) throw new TrialError(400, "INVALID_CODE", "Introduce los 6 dígitos del código.");
    await this.store.rate("check-ip-hour", caller.ip, 40, 3600);
    await this.flow(id, caller);
    const field = channel === "email" ? "email" : "sms";
    const hash = await this.store.hash(`otp:${id}:${field}`, code as string);
    const client = await this.store.pool.connect();
    let failure: TrialError | undefined;
    try {
      await client.query("BEGIN");
      const r = await client.query("SELECT * FROM nuxa_trial_flows WHERE id=$1 FOR UPDATE", [id]);
      const row = r.rows[0];
      if (!row || new Date(row.expires_at).getTime() <= Date.now()) {
        failure = new TrialError(410, "FLOW_EXPIRED", "La verificación ha caducado. Empieza de nuevo.");
      } else if (row[`${field}_verified_at`] || (field === "sms" && row.phone_verified_at)) {
        // Only the session-bound flow may repeat a successful check.
      } else if (!row[`${field}_code_hash`] || new Date(row[`${field}_code_expires_at`]).getTime() <= Date.now()) {
        failure = new TrialError(410, "CODE_EXPIRED", "El código ha caducado. Solicita otro.");
      } else if (row[`${field}_attempts`] >= 5) {
        failure = new TrialError(429, "CODE_ATTEMPTS", "Demasiados códigos incorrectos. Solicita otro código.");
      } else {
        await client.query(`UPDATE nuxa_trial_flows SET ${field}_attempts=${field}_attempts+1 WHERE id=$1`, [id]);
        if (!equalHash(hash, row[`${field}_code_hash`])) {
          failure = new TrialError(400, "WRONG_CODE", "El código no es correcto.");
        } else {
          await client.query(`UPDATE nuxa_trial_flows SET
            ${field === "sms" ? "phone" : "email"}_verified_at=NOW(),${field}_code_hash=NULL WHERE id=$1`, [id]);
        }
      }
      await client.query("COMMIT"); // Failed guesses must persist, not roll back.
    } catch (error) { await client.query("ROLLBACK"); throw error; }
    finally { client.release(); }
    if (failure) throw failure;
    if (channel === "email") return { step: "sms", resendAfterSeconds: 0 };
    return this.complete(id, caller);
  }
  private async complete(id: string, caller: TrialCaller) {
    await this.flow(id, caller);
    const client = await this.store.pool.connect();
    try {
      await client.query("BEGIN");
      // All completed trial activations serialize the monthly capacity check.
      await client.query("SELECT pg_advisory_xact_lock(731842190)");
      const result = await client.query("SELECT * FROM nuxa_trial_flows WHERE id=$1 FOR UPDATE", [id]);
      const row = result.rows[0];
      if (row?.completed_user_id) {
        const state = await client.query("SELECT used,reserved FROM nuxa_trial_identities WHERE user_id=$1", [row.completed_user_id]);
        await client.query("COMMIT");
        return { success: true, userId: row.completed_user_id, remaining: Math.max(0, 5 - state.rows[0].used - state.rows[0].reserved) };
      }
      if (!row?.email_verified_at || !row.phone_verified_at || new Date(row.expires_at).getTime() <= Date.now()) {
        throw new TrialError(403, "VERIFICATION_REQUIRED", "Verifica el correo y el móvil antes de continuar.");
      }
      let userId = row.existing_user_id as number | null;
      let used = 0;
      if (userId) {
        const old = await client.query("SELECT * FROM users WHERE id=$1 FOR UPDATE", [userId]);
        if (old.rows[0]?.subscription_status !== "trial" || old.rows[0]?.trial_phone_verified_at) throw unavailableTrial();
        used = Math.min(5, Math.max(0, old.rows[0].questions_used_this_month || 0));
      } else {
        const count = await client.query(`SELECT COUNT(*)::integer AS total FROM users
          WHERE subscription_status='trial' AND created_at>=date_trunc('month',NOW())`);
        if (count.rows[0].total >= 250) throw new TrialError(429, "TRIAL_CAPACITY", "El cupo mensual está completo.");
        const existing = await client.query("SELECT 1 FROM users WHERE username=$1 OR LOWER(TRIM(email))=$2 LIMIT 1", [row.username, row.email]);
        if (existing.rowCount) throw unavailableTrial();
        const user = await client.query(`INSERT INTO users
          (username,email,password,subscription_plan,subscription_status,monthly_question_limit,has_completed_payment)
          VALUES($1,$2,$3,'trial','trial',5,FALSE) RETURNING id`, [row.username, row.email, row.password_hash]);
        userId = user.rows[0].id;
      }
      const identity = await client.query(`INSERT INTO nuxa_trial_identities(phone_hash,email_hash,user_id,used)
        VALUES($1,$2,$3,$4) ON CONFLICT DO NOTHING RETURNING user_id`, [row.phone_hash, row.email_hash, userId, used]);
      if (!identity.rowCount) throw unavailableTrial();
      await client.query(`UPDATE users SET trial_email_verified_at=NOW(),trial_phone_verified_at=NOW(),
        trial_phone_hash=$2,monthly_question_limit=5 WHERE id=$1`, [userId, row.phone_hash]);
      await client.query(`UPDATE nuxa_trial_flows SET completed_user_id=$2,
        phone='',email='',username='',password_hash=NULL,email_code_hash=NULL,sms_code_hash=NULL WHERE id=$1`, [id, userId]);
      await client.query("COMMIT");
      return { success: true, userId: userId!, remaining: 5 - used };
    } catch (error) {
      await client.query("ROLLBACK");
      if ((error as { code?: string }).code === "23505") throw unavailableTrial();
      throw error;
    } finally { client.release(); }
  }
}
