import { randomBytes, randomUUID } from "node:crypto";
import bcrypt from "bcrypt";
import type { Pool } from "@neondatabase/serverless";

export type GoogleIdentity = { key: string; email: string };
export class GoogleAccessError extends Error {
  constructor(public code: string, public status: number, message: string) { super(message); }
}
const normalizeEmail = (email: string) => email.trim().toLowerCase();
const denied = () => new GoogleAccessError("INVALID_LINK", 401,
  "No se pudo vincular la cuenta. Comprueba tu usuario, contraseña y correo de Google.");

export function validateGoogleRegistration(body: Record<string, unknown>, now = new Date()) {
  const date = typeof body.birthDate === "string" ? body.birthDate : "";
  const birth = new Date(`${date}T00:00:00Z`);
  const age = now.getUTCFullYear() - birth.getUTCFullYear()
    - (now.toISOString().slice(5, 10) < date.slice(5, 10) ? 1 : 0);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(birth.getTime())
      || birth.toISOString().slice(0, 10) !== date || age < 18 || age > 95) {
    throw new GoogleAccessError("INVALID_AGE", 400, "Indica una fecha de nacimiento válida. NUXA está dirigida a personas de 18 a 95 años.");
  }
  if (body.acceptedNuxaNotice !== true) {
    throw new GoogleAccessError("NOTICE_REQUIRED", 400, "Debes aceptar las condiciones y el aviso de NUXA.");
  }
  return date;
}

/** No DDL, provider calls, quota updates, subscription updates or email sends. */
export class GoogleAuthStore {
  constructor(private pool: Pool) {}
  async available() {
    const result = await this.pool.query("SELECT to_regclass('nuxa_social_identities') IS NOT NULL AS ready");
    return result.rows[0].ready === true;
  }
  async linked(identity: GoogleIdentity) {
    const result = await this.pool.query(
      `SELECT u.id, u.role FROM nuxa_social_identities s JOIN users u ON u.id=s.user_id
       WHERE s.identity_key=$1 AND s.provider='google'`, [identity.key]);
    return result.rows[0] as { id: number; role: string } | undefined;
  }
  async complete(identity: GoogleIdentity, body: Record<string, unknown>, currentUserId?: number) {
    const action = body.action;
    if (!["login", "link", "register"].includes(String(action))) {
      throw new GoogleAccessError("INVALID_ACTION", 400, "Acción no válida.");
    }
    // Compute expensive hashes before opening the transaction.
    const birthDate = action === "register" ? validateGoogleRegistration(body) : undefined;
    const passwordHash = action === "register" ? await bcrypt.hash(randomBytes(48).toString("hex"), 10) : undefined;
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      // Serialize repeated OAuth callbacks and concurrent attempts with the same email.
      await client.query("SELECT pg_advisory_xact_lock(hashtextextended($1,0))", [`nuxa-google:${identity.email}`]);
      const linked = await client.query(
        `SELECT u.id,u.role FROM nuxa_social_identities s JOIN users u ON u.id=s.user_id
         WHERE s.identity_key=$1 AND s.provider='google' FOR UPDATE OF s`, [identity.key]);
      let user = linked.rows[0] as { id: number; role: string } | undefined;
      if (!user && action === "login") throw new GoogleAccessError("LINK_REQUIRED", 409, "Completa o vincula tu cuenta de NUXA.");
      if (!user && action === "link") {
        if (typeof body.username !== "string" || typeof body.password !== "string"
          || body.username.length > 200 || body.password.length > 1024) throw denied();
        const result = await client.query(
          "SELECT id,role,email,password FROM users WHERE username=$1 FOR UPDATE", [body.username]);
        const existing = result.rows[0];
        // Deliberately do not enable social admin access.
        if (!existing || existing.role !== "user" || !existing.email
          || normalizeEmail(existing.email) !== normalizeEmail(identity.email)
          || !await bcrypt.compare(body.password, existing.password)) throw denied();
        user = { id: existing.id, role: existing.role };
      }
      if (!user && action === "register") {
        const matches = await client.query("SELECT id FROM users WHERE lower(trim(email))=$1 LIMIT 1", [normalizeEmail(identity.email)]);
        if (matches.rowCount) throw new GoogleAccessError("ACCOUNT_EXISTS", 409,
          "Este correo ya tiene una cuenta en NUXA. Vincúlala con tu usuario y contraseña actuales.");
        if (currentUserId) throw new GoogleAccessError("SESSION_CONFLICT", 409, "Cierra la sesión de NUXA antes de crear otra cuenta.");
        const result = await client.query(
          `INSERT INTO users (username,password,email,birth_date,role,user_type,subscription_status,
            has_completed_payment,accepted_nuxa_notice,notice_accepted_at,notice_version)
           VALUES ($1,$2,$3,$4,'user','individual','pending_payment',false,true,now(),'google-onboarding-v1')
           RETURNING id,role`,
          [`google_${randomUUID().replaceAll("-", "")}`, passwordHash, normalizeEmail(identity.email), birthDate]);
        user = result.rows[0];
      }
      if (!user || user.role !== "user") throw denied();
      if (currentUserId && currentUserId !== user.id) {
        throw new GoogleAccessError("SESSION_CONFLICT", 409, "Ya tienes abierta otra cuenta de NUXA. Cierra esa sesión antes de continuar.");
      }
      await client.query(
        `INSERT INTO nuxa_social_identities(identity_key,user_id,provider) VALUES ($1,$2,'google')
         ON CONFLICT (identity_key) DO NOTHING`, [identity.key, user.id]);
      const confirmed = await client.query("SELECT user_id FROM nuxa_social_identities WHERE identity_key=$1", [identity.key]);
      if (confirmed.rows[0]?.user_id !== user.id) throw denied();
      await client.query("COMMIT");
      return user;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally { client.release(); }
  }
}
