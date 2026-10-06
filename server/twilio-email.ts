export interface TransactionalEmail {
  to: string;
  subject: string;
  text: string;
}

/** Separate restricted Email key; never use or replace voice/SMS credentials. */
export async function sendTwilioEmail(
  email: TransactionalEmail,
  dependencies: { env?: NodeJS.ProcessEnv; fetch?: typeof fetch } = {},
) {
  const env = dependencies.env ?? process.env;
  const key = env.TWILIO_EMAIL_API_KEY?.trim();
  const secret = env.TWILIO_EMAIL_API_SECRET?.trim();
  const from = env.NUXA_AI_ALERT_FROM_EMAIL?.trim() || "avisos@nuxa.life";
  if (!key || !secret || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(from) ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.to)) {
    throw Object.assign(Error("Twilio Email configuration is unavailable"), { notAttempted: true });
  }
  const html = email.text.replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").split("\n\n").map(text => `<p>${text.replace(/\n/g, "<br>")}</p>`).join("");
  // Exactly one attempt. A lost response is not proof that no email was sent.
  const response = await (dependencies.fetch ?? fetch)("https://comms.twilio.com/v1/Emails", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${key}:${secret}`).toString("base64")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: { address: from, name: "NUXA — avisos del servicio" },
      to: [{ address: email.to }],
      content: { subject: email.subject, text: email.text, html },
    }),
    signal: AbortSignal.timeout(10_000),
  });
  if (response.status !== 202) {
    // Keep response bodies, credentials and recipient details out of errors/logs.
    throw Object.assign(Error("Twilio Email did not accept alert"), { code: response.status });
  }
  const data = await response.json() as { operationId?: string };
  if (!/^comms_operation_[a-z0-9]+$/.test(data.operationId ?? "")) {
    throw Error("Twilio Email acceptance could not be confirmed");
  }
  return { accepted: true, statusCode: response.status, operationId: data.operationId };
}
