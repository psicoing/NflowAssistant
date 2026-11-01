import { createHash, createHmac, createPublicKey, timingSafeEqual, verify } from "node:crypto";

export type EmailProvider = "sendgrid" | "resend";
export type EmailEventKind = "delivered" | "opened" | "clicked" | "bounced" | "blocked" | "dropped" | "deferred" | "unsubscribed" | "complained";
export interface CampaignEmailEvent {
  provider: EmailProvider;
  id: string;
  messageId: string;
  email: string;
  kind: EmailEventKind;
  at: string;
  reason: string | null;
}

export function safeMailError(error: unknown): { code: string; reason: string } {
  const e = error as any;
  const code = String(e?.code || e?.statusCode || e?.status || e?.name || "send_failed").slice(0, 80);
  const raw = e?.response?.body?.errors?.map((item: any) => item?.message).filter(Boolean).join("; ")
    || e?.message || "El proveedor no aceptó el envío";
  // Never persist SDK requests, headers, credentials, or whole error objects.
  const reason = String(raw)
    .replace(/Bearer\s+\S+/gi, "[credencial omitida]")
    .replace(/SG\.[A-Za-z0-9_.-]+/g, "[credencial omitida]")
    .replace(/\b(re_[A-Za-z0-9_]+)\b/g, "[credencial omitida]")
    .slice(0, 800);
  return { code, reason };
}

export function normalizeMailMessageId(provider: EmailProvider, id: string): string {
  return provider === "sendgrid" ? id.split(".")[0] : id;
}

export function verifyMailWebhook(
  provider: EmailProvider,
  raw: Buffer,
  headers: Record<string, string | string[] | undefined>,
  key: string,
  now = Date.now(),
): boolean {
  try {
    const header = (name: string) => typeof headers[name] === "string" ? headers[name] as string : "";
    const timestamp = header(provider === "sendgrid" ? "x-twilio-email-event-webhook-timestamp" : "svix-timestamp");
    if (!/^\d+$/.test(timestamp) || Math.abs(now / 1000 - Number(timestamp)) > 300 || !key) return false;
    if (provider === "sendgrid") {
      const signature = header("x-twilio-email-event-webhook-signature");
      const publicKey = key.includes("BEGIN PUBLIC KEY") ? createPublicKey(key)
        : createPublicKey({ key: Buffer.from(key, "base64"), format: "der", type: "spki" });
      return !!signature && verify("sha256", Buffer.concat([Buffer.from(timestamp), raw]), publicKey, Buffer.from(signature, "base64"));
    }
    const id = header("svix-id");
    if (!id) return false;
    const secret = Buffer.from(key.replace(/^whsec_/, ""), "base64");
    const expected = createHmac("sha256", secret).update(`${id}.${timestamp}.`).update(raw).digest();
    return header("svix-signature").split(" ").some(part => {
      const [version, encoded] = part.split(",");
      if (version !== "v1" || !encoded) return false;
      const supplied = Buffer.from(encoded, "base64");
      return supplied.length === expected.length && timingSafeEqual(supplied, expected);
    });
  } catch { return false; }
}

export function parseMailEvents(provider: EmailProvider, raw: Buffer, webhookId?: string): CampaignEmailEvent[] {
  const payload = JSON.parse(raw.toString("utf8"));
  const items = provider === "sendgrid" ? payload : [payload];
  if (!Array.isArray(items) || items.length > 1000) throw new Error("Invalid event batch");
  const mapping: Record<string, EmailEventKind> = {
    delivered: "delivered", open: "opened", click: "clicked", bounce: "bounced",
    blocked: "blocked", dropped: "dropped", deferred: "deferred",
    unsubscribe: "unsubscribed", group_unsubscribe: "unsubscribed", spamreport: "complained",
    "email.delivered": "delivered", "email.opened": "opened", "email.clicked": "clicked",
    "email.bounced": "bounced", "email.failed": "dropped", "email.complained": "complained",
    "email.delivery_delayed": "deferred", "email.suppressed": "dropped",
  };
  return items.flatMap((item: any) => {
    let kind = mapping[provider === "sendgrid" ? item.event : item.type];
    if (provider === "sendgrid" && item.event === "bounce" && item.type === "blocked") kind = "blocked";
    if (!kind) return [];
    const data = provider === "sendgrid" ? item : item.data;
    const id = provider === "sendgrid" ? item.sg_event_id : webhookId;
    const messageId = provider === "sendgrid" ? item.sg_message_id : data?.email_id;
    const emails = provider === "sendgrid" ? [item.email] : data?.to;
    const at = provider === "sendgrid" ? new Date(Number(item.timestamp) * 1000) : new Date(item.created_at);
    if (typeof id !== "string" || typeof messageId !== "string" || !Array.isArray(emails) || !Number.isFinite(at.getTime())) {
      throw new Error("Missing event provenance");
    }
    return emails.map((email: unknown) => {
      if (typeof email !== "string" || !email.includes("@") || email.length > 320 || id.length > 512 || messageId.length > 512) {
        throw new Error("Invalid event recipient");
      }
      return {
        provider, id: provider === "sendgrid" ? id : createHash("sha256").update(`${id}:${email.toLowerCase()}`).digest("hex"),
        messageId: normalizeMailMessageId(provider, messageId),
        email: email.toLowerCase().trim(), kind, at: at.toISOString(),
        reason: safeMailError({ message: data?.reason || data?.response || data?.bounce?.message || "Evento del proveedor" }).reason,
      };
    });
  });
}
