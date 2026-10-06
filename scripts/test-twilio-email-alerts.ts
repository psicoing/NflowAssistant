import assert from "node:assert/strict";
import { sendTwilioEmail } from "../server/twilio-email";
import { sendCreditAlertEmail } from "../server/chat-credit-alerts";
import { pool } from "../server/db";

const env = { TWILIO_EMAIL_API_KEY: "synthetic-key", TWILIO_EMAIL_API_SECRET: "synthetic-secret" };
const email = { to: "owner@example.test", subject: "Synthetic alert", text: "Test <safe> & escaped\n\nNo real outage." };
let calls = 0;
let payload: any;
const fakeFetch = (async (url: string, options: RequestInit) => {
  calls++;
  assert.equal(url, "https://comms.twilio.com/v1/Emails");
  payload = JSON.parse(String(options.body));
  assert.equal((options.headers as Record<string, string>).Authorization,
    `Basic ${Buffer.from("synthetic-key:synthetic-secret").toString("base64")}`);
  return new Response(JSON.stringify({ operationId: "comms_operation_synthetic" }), { status: 202 });
}) as typeof fetch;
try {
  const result = await sendTwilioEmail(email, { env, fetch: fakeFetch });
  assert.equal(result.accepted, true);
  assert.equal(calls, 1);
  assert.equal(payload.from.address, "avisos@nuxa.life");
  assert.equal(payload.to[0].address, email.to);
  assert.equal(payload.content.text, email.text);
  assert(payload.content.html.includes("&lt;safe&gt; &amp;"));
  await assert.rejects(sendTwilioEmail(email, { env: {}, fetch: fakeFetch }),
    error => (error as { notAttempted?: boolean }).notAttempted === true);
  assert.equal(calls, 1, "Missing email credentials must not make a request");
  for (const status of [401, 403, 429, 500]) {
    let attempts = 0;
    await assert.rejects(sendTwilioEmail(email, { env, fetch: (async () => {
      attempts++;
      return new Response("Do not expose upstream response", { status });
    }) as typeof fetch }), error => (error as { code?: number }).code === status);
    assert.equal(attempts, 1, "No automatic resend");
  }
  await assert.rejects(sendTwilioEmail(email, { env, fetch: (async () =>
    new Response("{}", { status: 202 })) as typeof fetch }));
  const previousRecipient = process.env.NUXA_AI_ALERT_EMAIL;
  process.env.NUXA_AI_ALERT_EMAIL = email.to;
  try {
    for (const provider of ["openai", "replit"] as const) {
      for (const reason of ["billing", "budget"] as const) {
        await sendCreditAlertEmail({ provider, reason, detectedAt: "2098-01-01T00:00:00Z" }, false,
          async message => {
            assert.equal(message.to, email.to);
            assert(message.subject.includes(provider === "openai" ? "OpenAI directo" : "Replit AI Integrations"));
            assert(message.text.includes(reason === "budget" ? "presupuesto interno" : "rechazado una petición"));
            return { accepted: true, statusCode: 202, operationId: "comms_operation_synthetic" };
          });
      }
    }
  } finally {
    if (previousRecipient === undefined) delete process.env.NUXA_AI_ALERT_EMAIL;
    else process.env.NUXA_AI_ALERT_EMAIL = previousRecipient;
  }
  console.log("PASS: Twilio-only credit alerts, payload/HTML escaping, separate credentials, missing configuration, HTTP rejections, uncertain acceptance and one-attempt policy. No real emails or AI.");
} finally { await pool.end(); }
