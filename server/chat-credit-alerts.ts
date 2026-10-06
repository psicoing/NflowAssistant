import { randomUUID } from "node:crypto";
import type { Pool } from "@neondatabase/serverless";
import type { ChatProvider } from "./chat-ai-client";
import { pool } from "./db";
import { getUncachableSendGridClient } from "./sendgridClient";
import { isConfirmedOpenAiBillingRejection } from "./chat-billing-errors";

export type CreditAlertReason = "billing" | "budget";
export interface CreditAlertEvent {
  provider: ChatProvider;
  reason: CreditAlertReason;
  detectedAt: string;
}
export interface CreditAlertSink {
  notify(provider: ChatProvider, reason: CreditAlertReason): Promise<unknown>;
  recovered(provider: ChatProvider): Promise<unknown>;
}
export function creditAlertReason(error: unknown, provider: ChatProvider): CreditAlertReason | null {
  const failure = error as { status?: number; code?: string } | undefined;
  if (failure?.code === "NUXA_CHAT_MONTHLY_BUDGET_EXCEEDED") return "budget";
  if (isConfirmedOpenAiBillingRejection(error) || (provider === "replit" && failure?.status === 402)) return "billing";
  return null; // A generic 429, timeout, configuration or pricing error is not proof of depleted credit.
}

export async function sendCreditAlertEmail(event: CreditAlertEvent, test = false) {
  const to = process.env.NUXA_AI_ALERT_EMAIL?.trim();
  if (!to || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) throw Object.assign(Error("AI alert recipient is not configured"), { notAttempted: true });
  const { client, fromEmail } = await getUncachableSendGridClient().catch(() => {
    throw Object.assign(Error("AI alert email connection is unavailable"), { notAttempted: true });
  });
  const provider = event.provider === "openai" ? "OpenAI directo" : "Replit AI Integrations";
  const explanation = event.reason === "budget"
    ? "El presupuesto interno mensual no puede cubrir una petición de IA. Esto no demuestra que la cuenta del proveedor tenga saldo cero."
    : "El proveedor ha rechazado una petición por saldo o facturación no disponible. No podemos consultar su saldo exacto.";
  const [response] = await client.send({
    to, from: { email: fromEmail, name: "NUXA — avisos del servicio" },
    subject: test ? "Prueba de avisos de IA de NUXA" : `NUXA: aviso de saldo o presupuesto de IA (${provider})`,
    text: [
      test ? "Este correo prueba el envío de avisos. No representa una nueva incidencia ni se ha hecho una llamada de IA." : "NUXA ha detectado una incidencia de disponibilidad de crédito para el chat.",
      `Conexión: ${provider}`, `Fecha de detección (UTC): ${event.detectedAt}`,
      explanation,
      "Revisa el saldo y la facturación del proveedor, o el presupuesto interno según corresponda. Este aviso no aumenta ningún límite de gasto.",
      "Si otra conexión está operativa, NUXA puede seguir respondiendo por esa vía. Cuando no haya ninguna disponible, el chat muestra un aviso automático que no consume preguntas.",
      "No se incluyen conversaciones, datos de clientes ni claves en este correo. La voz y los SMS son independientes.",
    ].join("\n\n"),
  });
  if (response.statusCode < 200 || response.statusCode >= 300) throw Error("Email provider did not accept alert");
  return { accepted: true, statusCode: response.statusCode };
}

/** Durable per-provider incidents: shared across restarts and Autoscale instances. */
export class ChatCreditAlerts implements CreditAlertSink {
  private initialization?: Promise<void>;
  private readonly table: string;
  constructor(
    private readonly database: Pool,
    private readonly deliver: (event: CreditAlertEvent) => Promise<unknown>,
    schema = "public",
  ) {
    if (!/^[a-z_][a-z0-9_]{0,50}$/.test(schema)) throw Error("Invalid alert schema");
    this.table = `"${schema}"."nuxa_chat_credit_alerts"`;
  }
  async ensureTable() {
    if (!this.initialization) this.initialization = this.database.query(`CREATE TABLE IF NOT EXISTS ${this.table} (
      provider text PRIMARY KEY, active boolean NOT NULL DEFAULT false,
      incident_id text, reason text, state text NOT NULL DEFAULT 'idle',
      detected_at timestamptz, sent_at timestamptz, retry_after timestamptz
    )`).then(() => {}).catch(error => { this.initialization = undefined; throw error; });
    await this.initialization;
  }
  async notify(provider: ChatProvider, reason: CreditAlertReason) {
    await this.ensureTable();
    const client = await this.database.connect();
    let event: CreditAlertEvent | undefined;
    let incidentId: string | undefined;
    try {
      await client.query("BEGIN");
      await client.query(`INSERT INTO ${this.table}(provider) VALUES($1) ON CONFLICT DO NOTHING`, [provider]);
      const row = (await client.query(`SELECT *, retry_after <= NOW() AS retry_ready FROM ${this.table} WHERE provider=$1 FOR UPDATE`, [provider])).rows[0];
      if (row.active && (row.state !== "failed" || !row.retry_ready)) {
        await client.query("COMMIT");
        return "deduplicated";
      }
      incidentId = row.active ? row.incident_id : randomUUID();
      const updated = (await client.query(`UPDATE ${this.table} SET active=true, incident_id=$2, reason=$3,
        state='sending', detected_at=CASE WHEN active THEN detected_at ELSE NOW() END, retry_after=NULL
        WHERE provider=$1 RETURNING detected_at`, [provider, incidentId, reason])).rows[0];
      event = { provider, reason, detectedAt: new Date(updated.detected_at).toISOString() };
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK").catch(() => {});
      throw error;
    } finally { client.release(); }
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      await Promise.race([
        this.deliver(event!),
        new Promise((_, reject) => { timer = setTimeout(() => reject(Error("Alert delivery uncertain")), 15000); }),
      ]);
      await this.database.query(`UPDATE ${this.table} SET state='sent', sent_at=NOW() WHERE provider=$1 AND incident_id=$2`, [provider, incidentId]);
      return "accepted";
    } catch (error) {
      const status = (error as { code?: number; response?: { statusCode?: number } })?.response?.statusCode
        ?? (error as { code?: number })?.code;
      // Only a definite HTTP rejection is safe to retry. Lost responses/process
      // death remain uncertain/sending and must not generate duplicate emails.
      const rejected = (error as { notAttempted?: boolean })?.notAttempted === true
        || (typeof status === "number" && status >= 400 && status < 500);
      await this.database.query(`UPDATE ${this.table} SET state=$3,
        retry_after=CASE WHEN $3='failed' THEN NOW()+INTERVAL '30 minutes' ELSE NULL END
        WHERE provider=$1 AND incident_id=$2`, [provider, incidentId, rejected ? "failed" : "uncertain"]);
      console.error(`[ai-credit-alert] ${rejected ? "rejected" : "uncertain"} delivery; provider=${provider}`);
      return rejected ? "failed" : "uncertain";
    } finally { if (timer) clearTimeout(timer); }
  }
  async recovered(provider: ChatProvider) {
    await this.ensureTable();
    await this.database.query(`UPDATE ${this.table} SET active=false WHERE provider=$1 AND active=true`, [provider]);
  }
}

let alerts: ChatCreditAlerts | undefined;
export function getChatCreditAlerts() {
  return alerts ??= new ChatCreditAlerts(pool, event => sendCreditAlertEmail(event));
}
export async function safelyNotifyCreditAlert(sink: CreditAlertSink, provider: ChatProvider, reason: CreditAlertReason) {
  try { await sink.notify(provider, reason); }
  catch { console.error(`[ai-credit-alert] Could not persist/send alert; provider=${provider}`); }
}
