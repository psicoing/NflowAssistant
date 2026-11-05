import assert from "node:assert/strict";
import bcrypt from "bcrypt";
import { getAdminUserMetrics } from "../server/admin-user-metrics";
import { registrationTestApp, auditTableFixtureSql } from "./lib/registration-test-app";

const fixture = await registrationTestApp();
const { pool, state } = fixture;
const server = fixture.app.listen(0, "127.0.0.1");
await new Promise<void>(resolve => server.once("listening", resolve));
const port = (server.address() as { port: number }).port;
const base = `http://127.0.0.1:${port}`;
const jar = new Map<string, string>();
async function request(path: string, body?: unknown, client = "default") {
  const response = await fetch(base + path, {
    method: body === undefined ? "GET" : "POST",
    headers: {
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
      "x-fixture-client": client, ...(jar.has(client) ? { Cookie: jar.get(client)! } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const cookie = response.headers.get("set-cookie");
  if (cookie) jar.set(client, cookie.split(";")[0]);
  const data = await response.json();
  await fixture.flush();
  return { status: response.status, data, reference: response.headers.get("x-registration-reference") };
}
async function countUsers() { return (await pool.query("SELECT count(*)::int AS n FROM users")).rows[0].n; }
const account = (name: string) => ({
  username: name, password: "SyntheticOnlyPassword123!", email: `${name}@example.invalid`,
  userType: "individual", birthDate: "1990-01-01", acceptedNuxaNotice: true, noticeVersion: "fixture",
});
const trial = (name: string, number: number) => ({
  ...account(name), phone: `+34600000${number.toString().padStart(3, "0")}`, privacyAccepted: true,
});

try {
  const empty = await getAdminUserMetrics(pool);
  assert.equal(empty.registeredUsers, 0);
  assert.equal(empty.registrationAudit.available, false);
  assert(empty.periods.every(p => p.newUsers === 0));
  assert.equal((await request("/api/admin/stats")).status, 401);
  await pool.query(auditTableFixtureSql);
  await pool.query(`
    INSERT INTO users(username,password,role,subscription_status,created_at,last_login_at,subscription_expires_at) VALUES
      ('admin','synthetic','admin','active',now()-interval '1 day',now(),NULL),
      ('new-trial','synthetic','user','trial',now()-interval '1 day',now(),NULL),
      ('expired','synthetic','user','active',now()-interval '10 days',now()-interval '20 days',now()-interval '1 day'),
      ('paid','synthetic','user','active',now()-interval '20 days',NULL,now()+interval '5 days'),
      ('partner','synthetic','partner','active',now(),now(),NULL);
    INSERT INTO conversations(user_id,title) SELECT id,'Synthetic' FROM users WHERE username IN ('admin','new-trial');
    INSERT INTO messages(conversation_id,is_user,timestamp)
      SELECT id,true,now() FROM conversations;
    INSERT INTO messages(conversation_id,is_user,timestamp)
      SELECT id,true,now() FROM conversations WHERE user_id=(SELECT id FROM users WHERE username='new-trial');
    INSERT INTO messages(conversation_id,is_user,timestamp)
      SELECT id,false,now() FROM conversations;
  `);
  const before = await getAdminUserMetrics(pool);
  assert.equal(before.totalUsers, 5);
  assert.equal(before.registeredUsers, 3);
  assert.equal(before.adminUsers, 1);
  assert.equal(before.otherAccounts, 1);
  assert.equal(before.activeSubscriptions, 1);
  assert.equal(before.expiredActiveStatuses, 1);
  assert.equal(before.totalRevenue, null);
  assert.equal(before.totalConversations, 1);
  assert.equal(before.registrationAudit.coverageStartedAt, null);
  assert.deepEqual(before.periods.map(p => p.newUsers), [1,2,3]);
  assert.deepEqual(before.periods.map(p => p.customerLogins), [1,1,2]);
  assert(before.periods.every(p => p.adminLogins === 1 && p.chatActiveUsers === 1 && p.chatUserMessages === 2));
  assert.equal(before.history.at(-1)!.cumulativeUsers, 3);

  const normal = await request("/api/auth/register", account("normal"));
  assert.equal(normal.status, 200);
  assert(normal.reference && /^[a-f0-9-]{36}$/.test(normal.reference));
  assert.equal((await request("/api/auth/me")).status, 200);
  const saved = (await pool.query("SELECT password,subscription_status,has_completed_payment FROM users WHERE username='normal'")).rows[0];
  assert.notEqual(saved.password, account("normal").password);
  assert(await bcrypt.compare(account("normal").password, saved.password));
  assert.equal(saved.subscription_status, "pending_payment");
  assert.equal(saved.has_completed_payment, false);
  assert.equal((await getAdminUserMetrics(pool)).registeredUsers, 4);
  assert.equal((await request("/api/auth/register", account("normal"), "duplicate")).status, 409);
  assert.equal((await request("/api/auth/register", { ...account("invalid"), birthDate: "not-a-date" }, "invalid")).status, 400);

  state.databaseFailure = true;
  const storageFailure = await request("/api/auth/register", account("storage-failed"), "storage-failed");
  assert.equal(storageFailure.status, 503);
  assert.equal(storageFailure.data.code, "REGISTRATION_UNAVAILABLE");
  assert(!JSON.stringify(storageFailure.data).includes("private"));
  state.databaseFailure = false;
  state.failSessionSave = true;
  const sessionFailure = await request("/api/auth/register", account("session-failed"), "session-failed");
  assert.equal(sessionFailure.status, 503);
  assert.equal(sessionFailure.data.code, "ACCOUNT_CREATED_SESSION_FAILED");
  assert.equal(sessionFailure.data.accountCreated, true);
  assert.equal((await request("/api/auth/me", undefined, "session-failed")).status, 401);
  assert.equal((await request("/api/auth/register", account("session-failed"), "session-failed")).status, 409);
  const baseline = await countUsers();
  assert.equal(baseline, 7);

  const detail = trial("verified", 101);
  const start = await request("/api/prueba-gratis/iniciar", detail, "verified");
  assert.equal(start.status, 200);
  assert.equal(await countUsers(), baseline, "Starting verification is not account creation");
  const flowId = start.data.flowId;
  assert.equal((await request("/api/prueba-gratis/enviar-codigo", { flowId, channel: "sms" }, "verified")).status, 403);
  const emailCode = state.emailCodes.get(detail.email)!;
  const wrong = emailCode === "000000" ? "111111" : "000000";
  assert.equal((await request("/api/prueba-gratis/verificar-correo", { flowId, code: wrong }, "verified")).status, 400);
  assert.equal((await request("/api/prueba-gratis/verificar-correo", { flowId, code: emailCode }, "verified")).status, 200);
  assert.equal(state.sms, 0, "No hidden SMS sent after email verification");
  assert.equal((await request("/api/prueba-gratis/enviar-codigo", { flowId, channel: "sms" }, "verified")).status, 200);
  const code = state.smsCodes.get(detail.phone)!;
  const completed = await request("/api/prueba-gratis/verificar-movil", { flowId, code }, "verified");
  assert.equal(completed.status, 200);
  assert.equal(completed.data.accountCreated, true);
  assert.equal(completed.data.remaining, 2);
  assert.equal((await request("/api/auth/me", undefined, "verified")).status, 200);
  assert.equal(await countUsers(), baseline + 1);
  const replay = await request("/api/prueba-gratis/verificar-movil", { flowId, code }, "verified");
  assert.equal(replay.status, 200);
  assert.equal(replay.data.accountCreated, false);
  assert.equal(replay.data.remaining, 2);
  assert.equal(await countUsers(), baseline + 1);

  await request("/api/prueba-gratis/iniciar", trial("abandoned", 102), "abandoned");
  const expiring = await request("/api/prueba-gratis/iniciar", trial("expired-flow", 103), "expired-flow");
  await pool.query("UPDATE nuxa_trial_flows SET expires_at=now()-interval '1 second' WHERE id=$1", [expiring.data.flowId]);
  assert.equal((await request("/api/prueba-gratis/verificar-correo",
    { flowId: expiring.data.flowId, code: state.emailCodes.get("expired-flow@example.invalid") }, "expired-flow")).status, 410);
  state.emailFailure = true;
  assert.equal((await request("/api/prueba-gratis/iniciar", trial("email-outage", 104), "email-outage")).status, 503);
  state.emailFailure = false;
  const smsDetails = trial("sms-outage", 105);
  const smsStart = await request("/api/prueba-gratis/iniciar", smsDetails, "sms-outage");
  assert.equal(smsStart.status, 200);
  await request("/api/prueba-gratis/verificar-correo",
    { flowId: smsStart.data.flowId, code: state.emailCodes.get(smsDetails.email) }, "sms-outage");
  state.smsFailure = true;
  assert.equal((await request("/api/prueba-gratis/enviar-codigo",
    { flowId: smsStart.data.flowId, channel: "sms" }, "sms-outage")).status, 503);
  state.smsFailure = false;
  assert.equal(await countUsers(), baseline + 1, "Abandoned, expired and provider-failed flows create no account");

  const final = await getAdminUserMetrics(pool);
  assert.equal(final.verifiedTrialUsers, 1);
  assert.equal(final.registeredUsers, 6);
  const op = final.registrationAudit.periods[0];
  assert.equal(op.accountsCreated, 3, "Normal, persisted-with-session-failure and newly verified accounts counted once");
  assert.equal(op.sessionFailures, 1);
  assert(op.failedOperations >= 4 && op.rejectedOperations >= 4);
  assert(final.registrationAudit.coverageStartedAt);
  const audit = JSON.stringify((await pool.query("SELECT * FROM nuxa_registration_events")).rows);
  for (const forbidden of ["@example.invalid", "SyntheticOnlyPassword", detail.phone, emailCode, "private database"]) {
    assert(!audit.includes(forbidden), `Audit must not contain ${forbidden}`);
  }
  assert.equal((await pool.query("SELECT count(*)::int AS n FROM nuxa_registration_events WHERE stage='phone_verify' AND account_created=true")).rows[0].n, 1);
  // Cleanup of expired onboarding must not erase sanitized failed-operation history.
  await pool.query("DELETE FROM nuxa_trial_flows");
  assert.equal((await getAdminUserMetrics(pool)).registrationAudit.periods[0].failedOperations, op.failedOperations);
  console.log("PASS: isolated development only; real account/trial handlers, persistence, sessions, duplicate/invalid input, DB/session failures, email/SMS mocks, expiry/abandonment, idempotent two-question trial, scoped customer/admin metrics, sanitized durable audit and missing-history coverage. No production writes or real messages.");
} finally {
  await new Promise<void>(resolve => server.close(() => resolve()));
  await fixture.close();
}
