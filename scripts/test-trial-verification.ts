import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import { pool as mainPool } from "../server/db";
import { TrialStore, TrialError, ensureTrialTables } from "../server/trial/store";
import { TrialVerification } from "../server/trial/verification";
import type { TrialProviders } from "../server/trial/providers";
import { quoteTrialSmsPrice } from "../server/trial/providers";
import express from "express";
import session from "express-session";
import { registerTrialRoutes } from "../server/trial/routes";

neonConfig.webSocketConstructor = ws;
const namespace = `trial_test_${randomUUID().replaceAll("-", "")}`;
const isolated = new Pool({
  connectionString: process.env.NEON_DATABASE_URL || process.env.DATABASE_URL,
  options: `-c search_path=${namespace}`,
});
let created = false;
const emailCodes = new Map<string, string>();
const smsCodes = new Map<string, string>();
let smsCalls = 0;
const providers: TrialProviders = {
  async email(to, code) { emailCodes.set(to, code); },
  async quoteSms() { return 500_000; },
  async sms(to, code) { smsCalls++; smsCodes.set(to, code); return { id: `offline-${smsCalls}` }; },
};
const caller = (name: string, userId?: number) => ({ sessionId: `session-${name}`, ip: `offline-${name}`, userId });
const details = (name: string, phone = "+34600000001") => ({
  username: `offline-${name}`, email: `${name}@example.invalid`, password: "OfflineOnly123!",
  phone, privacyAccepted: true,
});
async function rejectsCode(action: Promise<unknown>, code: string) {
  await assert.rejects(action, (error: unknown) => error instanceof TrialError && error.code === code);
}

try {
  assert.equal(quoteTrialSmsPrice("USD", [{ prices: [{ current_price: "0.10" }] }]), 550_000);
  assert.equal(quoteTrialSmsPrice("usd", [{ prices: [{ currentPrice: "0.10" }] }]), 550_000);
  assert.throws(() => quoteTrialSmsPrice("EUR", [{ prices: [{ current_price: "0.10" }] }]), TrialError);
  assert.throws(() => quoteTrialSmsPrice("USD", [{ prices: [{ current_price: null }] }]), TrialError);
  await mainPool.query(`CREATE SCHEMA "${namespace}"`);
  created = true;
  assert.equal((await isolated.query("SELECT current_schema() AS schema")).rows[0].schema, namespace,
    "Never run fixtures against the application schema");
  await isolated.query(`CREATE TABLE users(
    id SERIAL PRIMARY KEY, username TEXT NOT NULL UNIQUE, email TEXT, password TEXT NOT NULL,
    subscription_status TEXT DEFAULT 'inactive',subscription_plan TEXT,
    monthly_question_limit INTEGER DEFAULT 10,questions_used_this_month INTEGER DEFAULT 0,
    prepaid_questions INTEGER DEFAULT 0,has_completed_payment BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),last_question_reset_date TIMESTAMPTZ DEFAULT NOW()
  )`);
  await ensureTrialTables(isolated);
  const store = new TrialStore(isolated);
  const service = new TrialVerification(store, providers);

  const a = caller("first");
  await rejectsCode(service.start({ ...details("bad"), privacyAccepted: false }, a), "INVALID_DETAILS");
  const flow = await service.start(details("first"), a);
  assert(!JSON.stringify(flow).includes(emailCodes.get(details("first").email)!));
  assert.equal((await isolated.query("SELECT COUNT(*)::int AS n FROM users")).rows[0].n, 0);
  await rejectsCode(service.send(flow.flowId, "sms", a), "EMAIL_REQUIRED");
  await rejectsCode(service.check(flow.flowId, "email", "123456", caller("other-session")), "FLOW_EXPIRED");
  const actualEmailCode = emailCodes.get(details("first").email)!;
  const wrongCode = actualEmailCode === "000000" ? "999999" : "000000";
  await rejectsCode(service.check(flow.flowId, "email", wrongCode, a), "WRONG_CODE");
  assert.equal((await isolated.query("SELECT email_attempts FROM nuxa_trial_flows WHERE id=$1", [flow.flowId])).rows[0].email_attempts, 1);
  await service.check(flow.flowId, "email", actualEmailCode, a);
  assert.equal(smsCalls, 0, "Email verification never silently sends a paid SMS");
  await service.send(flow.flowId, "sms", a);
  await rejectsCode(service.send(flow.flowId, "sms", a), "RESEND_LIMIT");
  const phoneCode = smsCodes.get(details("first").phone)!;
  const activated = await service.check(flow.flowId, "sms", phoneCode, a) as any;
  assert.equal(activated.remaining, 5);
  assert.equal((await isolated.query("SELECT COUNT(*)::int AS n FROM users")).rows[0].n, 1);
  const again = await service.check(flow.flowId, "sms", phoneCode, a) as any;
  assert.equal(again.userId, activated.userId, "Completion is idempotent");
  const flowRow = (await isolated.query("SELECT * FROM nuxa_trial_flows WHERE id=$1", [flow.flowId])).rows[0];
  assert.equal(flowRow.phone, "");
  assert.equal(flowRow.email, "");
  assert.equal(flowRow.password_hash, null);
  assert.equal(flowRow.sms_code_hash, null);
  await rejectsCode(service.start(details("second"), caller("second")), "TRIAL_UNAVAILABLE");
  const noPrivacy = await isolated.query("SELECT phone_hash,email_hash FROM nuxa_trial_identities");
  assert(!JSON.stringify(noPrivacy.rows).includes(details("first").phone));
  assert(!JSON.stringify(noPrivacy.rows).includes(details("first").email));

  // Concurrent paid-generation bookings cannot pass the lifetime free quota.
  const bookings = await Promise.allSettled(Array.from({ length: 14 }, () => store.reserveQuestion(activated.userId)));
  const accepted = bookings.filter(r => r.status === "fulfilled").map(r => (r as PromiseFulfilledResult<string>).value);
  assert.equal(accepted.length, 5);
  assert(bookings.filter(r => r.status === "rejected").every(r => (r as PromiseRejectedResult).reason.code === "TRIAL_EXHAUSTED"));
  await store.settleQuestion(accepted[0], false);
  await store.settleQuestion(accepted[0], false);
  const replacement = (await store.reserveQuestion(activated.userId))!;
  await Promise.all(accepted.slice(1).map(id => store.settleQuestion(id, true)));
  await store.settleQuestion(replacement, true);
  await store.settleQuestion(replacement, true);
  assert.equal((await store.state(activated.userId))!.used, 5);
  await isolated.query("UPDATE users SET last_question_reset_date='2020-01-01',questions_used_this_month=0 WHERE id=$1", [activated.userId]);
  const restartedStore = new TrialStore(isolated);
  assert.equal((await restartedStore.state(activated.userId))!.remaining, 0, "User-month counter cannot reset a phone's lifetime quota");
  await rejectsCode(restartedStore.reserveQuestion(activated.userId), "TRIAL_EXHAUSTED");
  await isolated.query("DELETE FROM users WHERE id=$1", [activated.userId]);
  await rejectsCode(service.start(details("after-delete"), caller("after-delete")), "TRIAL_UNAVAILABLE");

  // Unverified legacy accounts cannot generate free answers.
  const legacy = (await isolated.query(`INSERT INTO users(username,email,password,subscription_status,questions_used_this_month)
    VALUES('x','legacy@example.invalid','hash','trial',3) RETURNING id`)).rows[0].id;
  await rejectsCode(store.reserveQuestion(legacy), "TRIAL_VERIFICATION_REQUIRED");
  const legacyCaller = caller("legacy", legacy);
  const oldFlow = await service.start({ ...details("legacy", "+33612345678"), username: "x", password: undefined }, legacyCaller);
  await service.check(oldFlow.flowId, "email", emailCodes.get("legacy@example.invalid"), legacyCaller);
  await service.send(oldFlow.flowId, "sms", legacyCaller);
  const oldResult = await service.check(oldFlow.flowId, "sms", smsCodes.get("+33612345678"), legacyCaller) as any;
  assert.equal(oldResult.userId, legacy);
  assert.equal(oldResult.remaining, 2, "Legacy trials retain used questions");
  await isolated.query("UPDATE users SET prepaid_questions=10 WHERE id=$1", [legacy]);
  assert.equal(await store.reserveQuestion(legacy), null, "Purchased credits retain the paid path");
  const paid = (await isolated.query(`INSERT INTO users(username,email,password,subscription_status)
    VALUES('offline-paid','paid@example.invalid','hash','active') RETURNING id`)).rows[0].id;
  assert.equal(await store.reserveQuestion(paid), null);

  // Expiry, guess limits, resend rotation, and no secret-code API response.
  const expiryCaller = caller("expiry");
  const exp = await service.start(details("expiry", "+34600000003"), expiryCaller);
  const first = emailCodes.get(details("expiry").email)!;
  const wrong = first === "000000" ? "999999" : "000000";
  for (let i = 0; i < 5; i++) await rejectsCode(service.check(exp.flowId, "email", wrong, expiryCaller), "WRONG_CODE");
  await rejectsCode(service.check(exp.flowId, "email", first, expiryCaller), "CODE_ATTEMPTS");
  await isolated.query("UPDATE nuxa_trial_flows SET email_sent_at=NOW()-INTERVAL '61 seconds' WHERE id=$1", [exp.flowId]);
  const resend = await service.send(exp.flowId, "email", expiryCaller);
  assert.equal(resend.resendAfterSeconds, 60);
  const second = emailCodes.get(details("expiry").email)!;
  if (second !== first) await rejectsCode(service.check(exp.flowId, "email", first, expiryCaller), "WRONG_CODE");
  await isolated.query("UPDATE nuxa_trial_flows SET email_code_expires_at=NOW()-INTERVAL '1 second' WHERE id=$1", [exp.flowId]);
  await rejectsCode(service.check(exp.flowId, "email", second, expiryCaller), "CODE_EXPIRED");
  await isolated.query("UPDATE nuxa_trial_flows SET expires_at=NOW()-INTERVAL '1 second' WHERE id=$1", [exp.flowId]);
  await store.cleanExpired();
  await rejectsCode(service.check(exp.flowId, "email", second, expiryCaller), "FLOW_EXPIRED");

  // Both $5 budget and rate limits survive another store instance.
  const balances = await Promise.allSettled(Array.from({ length: 20 }, () => store.bookSms(500_000)));
  const acceptedSms = balances.filter(r => r.status === "fulfilled");
  // Two earlier simulated SMS bookings each conservatively retained $0.50.
  assert.equal(acceptedSms.length, 8);
  assert.equal(Number((await isolated.query("SELECT booked_micro_usd FROM nuxa_trial_sms_months")).rows[0].booked_micro_usd), 5_000_000);
  await rejectsCode(restartedStore.bookSms(500_000), "SMS_BUDGET_EXHAUSTED");
  await store.rate("fixture", "opaque", 1, 3600);
  await rejectsCode(restartedStore.rate("fixture", "opaque", 1, 3600), "RATE_LIMIT");

  // Provider ambiguity retains the financial reservation. No actual message sent.
  await isolated.query("UPDATE nuxa_trial_sms_months SET booked_micro_usd=0");
  const ambiguousService = new TrialVerification(store, { ...providers, async sms() { throw new Error("offline timeout"); } });
  const uncertainCaller = caller("uncertain");
  const uncertain = await ambiguousService.start(details("uncertain", "+34600000002"), uncertainCaller);
  await ambiguousService.check(uncertain.flowId, "email", emailCodes.get(details("uncertain").email), uncertainCaller);
  await rejectsCode(ambiguousService.send(uncertain.flowId, "sms", uncertainCaller), "DELIVERY_UNAVAILABLE");
  assert.equal(Number((await isolated.query("SELECT booked_micro_usd FROM nuxa_trial_sms_months")).rows[0].booked_micro_usd), 500_000);
  assert.equal((await isolated.query("SELECT COUNT(*)::int AS n FROM nuxa_trial_sms_sends WHERE state='uncertain'")).rows[0].n, 1);
  // Exercise the real HTTP handlers, session binding, old-route closure, and
  // authenticated status after completion; only transports are injected.
  await isolated.query("UPDATE nuxa_trial_sms_months SET booked_micro_usd=0");
  const app = express();
  app.set("trust proxy", 1);
  app.use(express.json());
  app.use(session({ secret: randomUUID(), resave: false, saveUninitialized: true,
    cookie: { httpOnly: false, secure: false } }));
  await registerTrialRoutes(app, isolated, providers);
  const server = app.listen(0, "127.0.0.1");
  try {
    await new Promise<void>(resolve => server.on("listening", resolve));
    const base = `http://127.0.0.1:${(server.address() as { port: number }).port}`;
    let cookie = "";
    const post = async (path: string, body: unknown) => {
      const response = await fetch(`${base}${path}`, { method: "POST",
        headers: { "Content-Type": "application/json", Cookie: cookie, "X-Forwarded-Proto": "https" }, body: JSON.stringify(body) });
      const setCookie = response.headers.get("set-cookie");
      if (setCookie) cookie = setCookie.split(";")[0];
      return { status: response.status, body: await response.json(), setCookie };
    };
    assert.equal((await post("/api/prueba-gratis", details("http"))).status, 403);
    const denied = await fetch(`${base}/api/prueba-gratis/iniciar`, { method: "POST",
      headers: { "Content-Type": "application/json", Origin: "https://untrusted.invalid" },
      body: JSON.stringify(details("http")) });
    assert.equal(denied.status, 403);
    const contact = details("http", "+34600000004");
    const started = await post("/api/prueba-gratis/iniciar", contact);
    assert.equal(started.status, 200);
    const { flowId } = started.body;
    assert.equal((await post("/api/prueba-gratis/verificar-correo", { flowId, code: emailCodes.get(contact.email) })).status, 200);
    assert.equal((await post("/api/prueba-gratis/enviar-codigo", { flowId, channel: "sms" })).status, 200);
    const result = await post("/api/prueba-gratis/verificar-movil", { flowId, code: smsCodes.get(contact.phone) });
    assert.equal(result.status, 200);
    assert.equal(result.body.remaining, 5);
    assert.match(result.setCookie || "", /HttpOnly/);
    assert.match(result.setCookie || "", /Secure/);
    assert.match(result.setCookie || "", /SameSite=Lax/);
    const status = await fetch(`${base}/api/prueba-gratis/estado`, { headers: { Cookie: cookie, "X-Forwarded-Proto": "https" } }).then(r => r.json());
    assert.equal(status.existingTrialUser.username, contact.username);
    assert.equal(status.verificationRequired, false);
    assert.equal((await post("/api/prueba-gratis/verificar-movil", { flowId, code: smsCodes.get(contact.phone) })).body.userId, result.body.userId);
  } finally { await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve())); }
  console.log("PASS: email/mobile verification, idempotency, expiry, durable anti-abuse, 14 concurrent free-question attempts, independent $5 SMS cap, paid paths, uncertain delivery. No real email, SMS or AI generation.");
} finally {
  await isolated.end();
  if (created) await mainPool.query(`DROP SCHEMA "${namespace}" CASCADE`);
  await mainPool.end();
}
