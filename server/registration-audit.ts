import { randomUUID } from "node:crypto";
import type { Express } from "express";
import type { Pool } from "@neondatabase/serverless";

const paths: Record<string, string> = {
  "/api/auth/register": "account_create",
  "/api/auth/login": "password_login",
  "/api/prueba-gratis/iniciar": "trial_start",
  "/api/prueba-gratis/enviar-codigo": "code_send",
  "/api/prueba-gratis/verificar-correo": "email_verify",
  "/api/prueba-gratis/verificar-movil": "phone_verify",
  "/api/registro-individual": "commercial_request",
  "/api/registro-empresa": "commercial_request",
  "/api/registro-empresa-media": "commercial_request",
};
const safeCodes = new Set([
  "ACCOUNT_EXISTS", "INVALID_DETAILS", "INVALID_PASSWORD", "INVALID_USERNAME",
  "ACCOUNT_CREATED_SESSION_FAILED", "REGISTRATION_UNAVAILABLE",
  "FLOW_EXPIRED", "CODE_EXPIRED", "CODE_ATTEMPTS", "WRONG_CODE", "RATE_LIMIT",
  "TRIAL_UNAVAILABLE", "TRIAL_CAPACITY", "TRIAL_VERIFICATION_REQUIRED",
  "EMAIL_REQUIRED", "EMAIL_ALREADY_VERIFIED", "ALREADY_VERIFIED", "RESEND_LIMIT",
  "DELIVERY_UNAVAILABLE", "SMS_UNAVAILABLE", "SMS_UNPRICED", "INVALID_PHONE",
  "SMS_BUDGET_EXHAUSTED", "VERIFICATION_REQUIRED", "VERIFICATION_UNAVAILABLE",
  "INVALID_CHANNEL", "ORIGIN_DENIED", "ACCOUNT_NOT_TRIAL", "EXISTING_ACCOUNT",
]);

/** No request body, URL, identity, IP, credential, session ID or message content. */
export interface RegistrationEvent {
  id: string;
  occurredAt: Date;
  stage: string;
  outcome: "success" | "rejected" | "failed" | "interrupted";
  httpStatus: number | null;
  code: string | null;
  accountCreated: boolean;
  actorRole: "admin" | "user" | "other" | null;
}

export function createRegistrationAuditWriter(pool: Pick<Pool, "query">) {
  let nextPrune = 0;
  return async (event: RegistrationEvent) => {
    try {
      await pool.query(`INSERT INTO nuxa_registration_events
        (id,occurred_at,stage,outcome,http_status,code,account_created,actor_role)
        VALUES($1,$2,$3,$4,$5,$6,$7,$8)`,
      [event.id, event.occurredAt, event.stage, event.outcome, event.httpStatus,
        event.code, event.accountCreated, event.actorRole]);
    } catch {
      // The sanitized fallback survives a missing table/DB outage without
      // making account registration depend on observational storage.
      console.warn("[registration-audit] storage_unavailable", JSON.stringify(event));
      return;
    }
    if (event.occurredAt.getTime() >= nextPrune) {
      nextPrune = event.occurredAt.getTime() + 86_400_000;
      try {
        await pool.query("DELETE FROM nuxa_registration_events WHERE occurred_at<$1",
          [new Date(event.occurredAt.getTime() - 30 * 86_400_000)]);
      } catch { console.warn("[registration-audit] retention_unavailable"); }
    }
  };
}

export function installRegistrationAudit(
  app: Express,
  record: (event: RegistrationEvent) => Promise<void>,
) {
  app.use((req, res, next) => {
    const stage = req.method === "POST" ? paths[req.path] : undefined;
    if (!stage) return next();
    const id = randomUUID();
    res.set("X-Registration-Reference", id);
    let code: string | null = null;
    let role: RegistrationEvent["actorRole"] = null;
    const originalJson = res.json;
    res.json = function(body: any) {
      if (body && typeof body === "object") {
        code = safeCodes.has(body.code) ? body.code : null;
        if (stage === "password_login" && body.success === true) {
          role = body.role === "admin" ? "admin" : body.role === "user" ? "user" : "other";
        }
      }
      return originalJson.call(this, body);
    };
    let recorded = false;
    const finish = (interrupted: boolean) => {
      if (recorded) return;
      recorded = true;
      const status = interrupted ? null : res.statusCode;
      void record({
        id, occurredAt: new Date(), stage,
        outcome: interrupted ? "interrupted" : status! >= 500 ? "failed"
          : status! >= 400 ? "rejected" : "success",
        httpStatus: status, code, actorRole: role,
        accountCreated: res.locals.registrationAccountCreated === true,
      }).catch(() => console.warn("[registration-audit] recording_unavailable"));
    };
    res.once("finish", () => finish(false));
    res.once("close", () => finish(!res.writableFinished));
    next();
  });
}
