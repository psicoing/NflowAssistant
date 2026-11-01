import assert from "node:assert/strict";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import { pool as applicationPool } from "../server/db";
import { mustStopCampaign, paceCommercialEmail, runCampaignBatch } from "../server/campaign-email-control";

// Provider callbacks below are local functions, not SDKs: zero real sends.
for (const code of ["429", "402", "401", "403", "503", "rate_limit_exceeded", "send_uncertain", "send_failed"]) {
  assert(mustStopCampaign({ ok: false, errorCode: code }), code);
}
assert(mustStopCampaign({ ok: false, errorReason: "You have reached your daily email sending quota." }));
assert(!mustStopCampaign({ ok: true, errorCode: "429" }));
assert(!mustStopCampaign({ ok: false, errorCode: "400", errorReason: "Invalid recipient" }));
let calls = 0;
const quota = await runCampaignBatch([1, 2, 3, 4], async () => {
  calls++;
  return calls === 1 ? { ok: true } : { ok: false, errorCode: "429" };
});
assert.deepEqual(quota, { sent: 1, failed: 1, blocked: true });
assert.equal(calls, 2, "No remaining contacts or automatic retry after quota/rate limit");
const ordinary = await runCampaignBatch([0, 1, 2, 3], async n =>
  n === 0 ? null : n === 2 ? { ok: false, errorCode: "400" } : { ok: true });
assert.deepEqual(ordinary, { sent: 2, failed: 1, blocked: false });
let attempted = 0;
await assert.rejects(runCampaignBatch([1, 2, 3], async () => {
  attempted++;
  throw Error("Uncertain persistence");
}));
assert.equal(attempted, 1, "Storage failures do not continue or retry");

neonConfig.webSocketConstructor = ws;
const development = new Pool({ connectionString: process.env.DATABASE_URL });
try {
  const [dev, app] = await Promise.all([
    development.query("SELECT md5(current_database()) AS fingerprint"),
    applicationPool.query("SELECT md5(current_database()) AS fingerprint"),
  ]);
  assert.notEqual(dev.rows[0].fingerprint, app.rows[0].fingerprint,
    "Refuse pacing tests against the application/production database");
  const starts: number[] = [];
  const results = await Promise.allSettled([0, 1, 2].map(n =>
    paceCommercialEmail(development, async () => {
      starts.push(Date.now());
      if (n === 1) throw Error("Offline provider rejection");
      return "offline-success";
    })));
  assert.equal(results.filter(r => r.status === "fulfilled").length, 2);
  assert.equal(results.filter(r => r.status === "rejected").length, 1);
  assert.equal(starts.length, 3);
  for (let i = 1; i < starts.length; i++) {
    assert(starts[i] - starts[i - 1] >= 550,
      "Separate database connections must share a single pacing lock");
  }
  // A subsequent operation still runs after the throwing callback.
  assert.equal(await paceCommercialEmail(development, async () => "released"), "released");
  let networkCalls = 0;
  const unavailable = { connect: async () => { throw Error("offline database"); } };
  await assert.rejects(paceCommercialEmail(unavailable as any, async () => networkCalls++));
  assert.equal(networkCalls, 0, "No provider request when pacing cannot be acquired");
  console.log("PASS: quota/auth/rate/service cutoff, no retries, unattempted contacts excluded, recipient failures continue; shared PostgreSQL pacing and lock cleanup across connections. Zero real emails or business-row writes; production identity read-only.");
} finally {
  await development.end();
  await applicationPool.end();
}
