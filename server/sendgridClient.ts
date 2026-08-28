import sgMail from "@sendgrid/mail";

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