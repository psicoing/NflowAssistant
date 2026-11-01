import assert from "node:assert/strict";
import { createHmac, generateKeyPairSync, sign } from "node:crypto";
import express from "express";
import { parseMailEvents, safeMailError, verifyMailWebhook } from "../server/campaign-email-events";
import { registerCampaignEmailWebhooks } from "../server/campaign-email-webhooks";

async function main() {
  const { publicKey, privateKey } = generateKeyPairSync("ec", { namedCurve: "prime256v1" });
  const key = publicKey.export({ type: "spki", format: "der" }).toString("base64");
  const timestamp = String(Math.floor(Date.now() / 1000));
  const raw = Buffer.from(JSON.stringify([{
    event: "open", sg_event_id: "event-1", sg_message_id: "message-1.filter.trace",
    email: "owner@example.invalid", timestamp: Number(timestamp), campaign_id: "e999999",
  }]));
  const signature = sign("sha256", Buffer.concat([Buffer.from(timestamp), raw]), privateKey).toString("base64");
  const headers = {
    "x-twilio-email-event-webhook-timestamp": timestamp,
    "x-twilio-email-event-webhook-signature": signature,
  };
  assert(verifyMailWebhook("sendgrid", raw, headers, key));
  assert(!verifyMailWebhook("sendgrid", Buffer.from("[]"), headers, key));
  assert(!verifyMailWebhook("sendgrid", raw, headers, "", Date.now()));
  assert(!verifyMailWebhook("sendgrid", raw, headers, key, Date.now() + 3600000));
  const parsed = parseMailEvents("sendgrid", raw);
  assert.equal(parsed[0].messageId, "message-1");
  assert.equal(parsed[0].kind, "opened");
  assert(!("campaignId" in parsed[0]), "Client campaign tags must never select the history row");
  assert.throws(() => parseMailEvents("sendgrid", Buffer.from('{"event":"open"}')));

  const secret = Buffer.from("offline-resend-test-key").toString("base64");
  const resendRaw = Buffer.from(JSON.stringify({
    type: "email.opened", created_at: new Date().toISOString(),
    data: { email_id: "resend-message", to: ["owner@example.invalid"], tags: [{ name: "campaign_id", value: "e999999" }] },
  }));
  const resendSignature = createHmac("sha256", Buffer.from(secret, "base64"))
    .update(`svix-event.${timestamp}.`).update(resendRaw).digest("base64");
  const resendHeaders = { "svix-id": "svix-event", "svix-timestamp": timestamp, "svix-signature": `v1,${resendSignature}` };
  assert(verifyMailWebhook("resend", resendRaw, resendHeaders, `whsec_${secret}`));
  assert(!verifyMailWebhook("resend", raw, resendHeaders, `whsec_${secret}`));
  assert.equal(parseMailEvents("resend", resendRaw, "svix-event")[0].messageId, "resend-message");
  assert(!safeMailError({ response: { body: { errors: [{ message: "Bad Bearer test-secret SG.secret.key" }] } } }).reason.includes("test-secret"));

  const original = { sg: process.env.SENDGRID_EVENT_PUBLIC_KEY, resend: process.env.RESEND_WEBHOOK_SECRET };
  let calls = 0;
  let failStorage = false;
  let expectedMessageId = "message-1";
  const app = express();
  // Same parser bypass as server/index.ts: raw signature bytes cannot be reconstructed.
  app.use((req, res, next) => req.path.startsWith("/api/webhooks/") ? next() : express.json()(req, res, next));
  registerCampaignEmailWebhooks(app, { async ingest(events) {
    calls++;
    assert.equal(events[0].messageId, expectedMessageId);
    if (failStorage) throw Error("simulated storage outage");
  } });
  const server = app.listen(0, "127.0.0.1");
  await new Promise<void>(resolve => server.once("listening", resolve));
  const address = server.address() as { port: number };
  const url = `http://127.0.0.1:${address.port}/api/webhooks/sendgrid`;
  const post = (body: Buffer, extra = headers) => fetch(url, { method: "POST", headers: { "content-type": "application/json", ...extra }, body });
  try {
    delete process.env.SENDGRID_EVENT_PUBLIC_KEY;
    assert.equal((await post(raw)).status, 503);
    process.env.SENDGRID_EVENT_PUBLIC_KEY = key;
    assert.equal((await post(Buffer.from("[]"))).status, 401);
    assert.equal(calls, 0);
    assert.equal((await post(raw)).status, 200);
    assert.equal(calls, 1);
    failStorage = true;
    assert.equal((await post(raw)).status, 503, "Provider must retry storage failures");
    failStorage = false;
    process.env.RESEND_WEBHOOK_SECRET = `whsec_${secret}`;
    expectedMessageId = "resend-message";
    assert.equal((await fetch(url.replace("/sendgrid", "/resend"), {
      method: "POST", headers: { "content-type": "application/json", ...resendHeaders }, body: resendRaw,
    })).status, 200);
    assert.equal((await fetch(url.replace("/sendgrid", "/resend"), {
      method: "POST", headers: { "content-type": "application/json", ...resendHeaders }, body: raw,
    })).status, 401);
    console.log("PASS: ECDSA/HMAC signatures, tampering, expiry, forged tags, raw HTTP body, missing keys and retry semantics.");
  } finally {
    await new Promise<void>((resolve, reject) => server.close(e => e ? reject(e) : resolve()));
    if (original.sg === undefined) delete process.env.SENDGRID_EVENT_PUBLIC_KEY;
    else process.env.SENDGRID_EVENT_PUBLIC_KEY = original.sg;
    if (original.resend === undefined) delete process.env.RESEND_WEBHOOK_SECRET;
    else process.env.RESEND_WEBHOOK_SECRET = original.resend;
  }
}
main().catch(() => { console.error("FAIL: campaign webhook test"); process.exitCode = 1; });
