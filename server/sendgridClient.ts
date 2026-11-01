import sgMail from "@sendgrid/mail";
import type { MailDataRequired } from "@sendgrid/helpers/classes/mail";
import { NUXA_EMAIL_FROM, NUXA_EMAIL_REPLY_TO } from "./nuxa-email-identity";

async function getCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? `repl ${process.env.REPL_IDENTITY}`
    : process.env.WEB_REPL_RENEWAL
      ? `depl ${process.env.WEB_REPL_RENEWAL}`
      : null;

  if (!hostname || !xReplitToken) throw new Error("SendGrid connector environment is unavailable");

  const connectionSettings = await fetch(
    `https://${hostname}/api/v2/connection?include_secrets=true&connector_names=sendgrid`,
    {
      headers: {
        Accept: "application/json",
        X_REPLIT_TOKEN: xReplitToken,
      },
    },
  ).then(response => response.json()).then((data: any) => data.items?.[0]);

  if (!connectionSettings?.settings?.api_key || !connectionSettings?.settings?.from_email) {
    throw new Error("SendGrid not connected");
  }
  return {
    apiKey: connectionSettings.settings.api_key as string,
    email: connectionSettings.settings.from_email as string,
  };
}

export async function getConfiguredSendGridFromEmail(): Promise<string> {
  return (await getCredentials()).email;
}

export async function getUncachableSendGridClient() {
  const { apiKey, email } = await getCredentials();
  sgMail.setApiKey(apiKey);
  return { client: sgMail, fromEmail: email };
}

/** Keep connector credentials intact; override only NUXA's sending identity. */
export async function sendNuxaSendGridEmail(
  message: Omit<MailDataRequired, "from" | "replyTo"> & { text: string },
) {
  const { client } = await getUncachableSendGridClient();
  return client.send({
    ...message,
    from: NUXA_EMAIL_FROM,
    replyTo: NUXA_EMAIL_REPLY_TO,
  });
}

/** JOBDA uses the authenticated domain, never Gmail as its From address. */
export async function sendJobdaSendGridEmail(
  message: Omit<MailDataRequired, "from" | "replyTo"> & { text: string },
) {
  const { client } = await getUncachableSendGridClient();
  return client.send({
    ...message,
    from: { email: NUXA_EMAIL_FROM.email, name: "JOBDA" },
    replyTo: { email: NUXA_EMAIL_REPLY_TO.email, name: "JOBDA" },
  });
}