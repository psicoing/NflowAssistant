import type { Express, Request } from "express";
import { clerkClient, getAuth } from "@clerk/express";
import { randomUUID, timingSafeEqual } from "node:crypto";
import { pool } from "./db";
import { GoogleAccessError, GoogleAuthStore, type GoogleIdentity } from "./google-auth-store";
import { establishChatUserSession } from "./chat-history-security";
import { getClerkProxyHost } from "./middlewares/clerkProxyMiddleware";

declare module "express-session" {
  interface SessionData { googleCsrf?: string; googleLinkAttempts?: number }
}

/** Identity is obtained exclusively from Clerk's verified cookie and backend API. */
export async function verifiedGoogleIdentity(req: Request): Promise<GoogleIdentity> {
  const auth = getAuth(req);
  if (!auth.userId || !auth.sessionId || typeof auth.sessionClaims?.iss !== "string") {
    throw new GoogleAccessError("GOOGLE_REQUIRED", 401, "Identifícate con Google para continuar.");
  }
  const user = await clerkClient.users.getUser(auth.userId);
  const email = user.emailAddresses.find(item => item.id === user.primaryEmailAddressId);
  const google = user.externalAccounts.find(account =>
    account.provider === "oauth_google"
    && account.verification?.status === "verified"
    && account.emailAddress?.toLowerCase() === email?.emailAddress.toLowerCase());
  if (!email || email.verification?.status !== "verified" || !google) {
    throw new GoogleAccessError("GOOGLE_UNVERIFIED", 403, "Necesitas una cuenta de Google con correo verificado.");
  }
  return { key: `${auth.sessionClaims.iss}|${auth.userId}`, email: email.emailAddress.trim().toLowerCase() };
}

function sameOrigin(req: Request) {
  try {
    const origin = new URL(req.get("origin") || "");
    return origin.host === getClerkProxyHost(req)
      && (origin.protocol === "https:" || (process.env.NODE_ENV !== "production" && origin.protocol === "http:"));
  } catch { return false; }
}

export function registerGoogleAuthRoutes(app: Express, dependencies: {
  store?: GoogleAuthStore;
  identity?: typeof verifiedGoogleIdentity;
  configured?: () => boolean;
} = {}) {
  const store = dependencies.store ?? new GoogleAuthStore(pool);
  const resolveIdentity = dependencies.identity ?? verifiedGoogleIdentity;
  const configured = dependencies.configured ?? (() => !!(process.env.CLERK_SECRET_KEY && process.env.CLERK_PUBLISHABLE_KEY));
  const respondError = (res: import("express").Response, error: unknown) => {
    if (error instanceof GoogleAccessError) return res.status(error.status).json({ success: false, code: error.code, message: error.message });
    console.error("[google-auth] access_unavailable"); // Never log tokens, passwords or email addresses.
    return res.status(503).json({ success: false, code: "GOOGLE_UNAVAILABLE",
      message: "El acceso con Google todavía no está disponible. Puedes utilizar el acceso habitual de NUXA." });
  };
  app.get("/api/auth/google/config", async (_req, res) => {
    res.setHeader("Cache-Control", "no-store");
    try { res.json({ enabled: configured() && await store.available() }); }
    catch { res.json({ enabled: false }); }
  });
  app.get("/api/auth/google/status", async (req, res) => {
    res.setHeader("Cache-Control", "no-store");
    try {
      if (!configured() || !await store.available()) throw new Error("not_ready");
      const identity = await resolveIdentity(req);
      const linked = await store.linked(identity);
      req.session.googleCsrf ||= randomUUID();
      await new Promise<void>((resolve, reject) => req.session.save(error => error ? reject(error) : resolve()));
      res.json({ enabled: true, state: linked ? "linked" : "onboarding", email: identity.email, csrfToken: req.session.googleCsrf });
    } catch (error) { respondError(res, error); }
  });
  app.post("/api/auth/google/complete", async (req, res) => {
    res.setHeader("Cache-Control", "no-store");
    try {
      const token = req.get("X-NUXA-CSRF") || "";
      const expected = req.session.googleCsrf || "";
      if (!sameOrigin(req) || !expected || token.length !== expected.length
        || !timingSafeEqual(Buffer.from(token), Buffer.from(expected))) {
        throw new GoogleAccessError("INVALID_REQUEST", 403, "Vuelve a abrir el acceso con Google e inténtalo de nuevo.");
      }
      if (!configured() || !await store.available()) throw new Error("not_ready");
      // Bounds password guessing even for a user with a valid Google session.
      req.session.googleLinkAttempts = (req.session.googleLinkAttempts || 0) + 1;
      await new Promise<void>((resolve, reject) => req.session.save(error => error ? reject(error) : resolve()));
      if (req.session.googleLinkAttempts > 8) throw new GoogleAccessError("TOO_MANY_ATTEMPTS", 429, "Demasiados intentos. Utiliza el acceso habitual de NUXA.");
      const identity = await resolveIdentity(req);
      const user = await store.complete(identity, req.body || {}, req.session.userId);
      await establishChatUserSession(req, user.id);
      await new Promise<void>((resolve, reject) => req.session.save(error => error ? reject(error) : resolve()));
      res.json({ success: true, userId: user.id });
    } catch (error) { respondError(res, error); }
  });
}
