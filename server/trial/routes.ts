import type { Express, Request, Response } from "express";
import type { Pool } from "@neondatabase/serverless";
import { TrialError, TrialStore, ensureTrialTables } from "./store";
import { TrialVerification, type TrialCaller } from "./verification";
import { productionTrialProviders, type TrialProviders } from "./providers";

export function respondTrialError(res: Response, error: unknown): boolean {
  if (!(error instanceof TrialError)) return false;
  res.status(error.status).json({
    message: error.message, code: error.code,
    requiresVerification: error.code === "TRIAL_VERIFICATION_REQUIRED",
    verificationUrl: error.code === "TRIAL_VERIFICATION_REQUIRED" ? "/prueba-gratis" : undefined,
    remaining: error.code === "TRIAL_EXHAUSTED" ? 0 : undefined,
    isTrial: true,
  });
  return true;
}

export async function registerTrialRoutes(app: Express, pool: Pool, providers: TrialProviders = productionTrialProviders) {
  await ensureTrialTables(pool);
  const store = new TrialStore(pool);
  const service = new TrialVerification(store, providers);
  const cleanup = setInterval(() => {
    store.cleanExpired().catch(() => console.error("[trial-verification] cleanup unavailable"));
  }, 60_000);
  cleanup.unref();
  const caller = (req: Request): TrialCaller => ({
    sessionId: req.sessionID, ip: req.ip || req.socket.remoteAddress || "unknown",
    userId: req.session.userId,
  });
  const handler = (fn: (req: Request, res: Response) => Promise<unknown>) =>
    async (req: Request, res: Response) => {
      res.set("Cache-Control", "no-store");
      req.session.cookie.httpOnly = true;
      req.session.cookie.secure = req.secure;
      req.session.cookie.sameSite = "lax";
      try {
        const origin = req.get("origin");
        if (origin && new URL(origin).host !== req.get("host")) {
          throw new TrialError(403, "ORIGIN_DENIED", "Solicitud no permitida.");
        }
        await fn(req, res);
      } catch (error) {
        if (!respondTrialError(res, error)) {
          console.error("[trial-verification] request failed");
          res.status(503).json({ message: "La verificación no está disponible. Inténtalo más tarde.", code: "VERIFICATION_UNAVAILABLE" });
        }
      }
    };
  app.get("/api/prueba-gratis/estado", handler(async (req, res) => {
    const count = await pool.query(`SELECT COUNT(*)::integer AS total FROM users
      WHERE subscription_status='trial' AND created_at>=date_trunc('month',NOW())`);
    const user = req.session.userId
      ? (await pool.query("SELECT username,email,subscription_status FROM users WHERE id=$1", [req.session.userId])).rows[0]
      : undefined;
    const existingTrialUser = user?.subscription_status === "trial" ? { username: user.username, email: user.email } : undefined;
    let verificationRequired = Boolean(existingTrialUser);
    if (existingTrialUser) {
      try { verificationRequired = !(await store.state(req.session.userId!)); }
      catch (error) { if (!(error instanceof TrialError)) throw error; }
    }
    res.json({ cupoLleno: !existingTrialUser && count.rows[0].total >= 250,
      used: count.rows[0].total, cap: 250, existingTrialUser, verificationRequired });
  }));
  app.post("/api/prueba-gratis/iniciar", handler(async (req, res) => {
    res.json(await service.start(req.body, caller(req)));
  }));
  app.post("/api/prueba-gratis/enviar-codigo", handler(async (req, res) => {
    if (req.body?.channel !== "email" && req.body?.channel !== "sms") {
      throw new TrialError(400, "INVALID_CHANNEL", "Selecciona correo o SMS.");
    }
    res.json(await service.send(req.body.flowId, req.body.channel, caller(req)));
  }));
  app.post("/api/prueba-gratis/verificar-correo", handler(async (req, res) => {
    res.json(await service.check(req.body?.flowId, "email", req.body?.code, caller(req)));
  }));
  app.post("/api/prueba-gratis/verificar-movil", handler(async (req, res) => {
    const result = await service.check(req.body?.flowId, "sms", req.body?.code, caller(req)) as {
      success: boolean; userId: number; remaining: number;
    };
    // Rotate the authenticated session; a retried completion can resume via userId.
    if (req.session.userId !== result.userId) {
      await new Promise<void>((resolve, reject) => req.session.regenerate(err => err ? reject(err) : resolve()));
    }
    // regenerate() restores the app defaults: reapply the verification policy.
    req.session.cookie.httpOnly = true;
    req.session.cookie.secure = req.secure;
    req.session.cookie.sameSite = "lax";
    req.session.userId = result.userId;
    await new Promise<void>((resolve, reject) => req.session.save(err => err ? reject(err) : resolve()));
    res.json(result);
  }));
  // The old one-step registration route must never grant an unverified trial.
  app.post("/api/prueba-gratis", handler(async (_req, _res) => {
    throw new TrialError(403, "VERIFICATION_REQUIRED", "Verifica el correo y el móvil en «Prueba NUXA gratis».");
  }));
  return store;
}
