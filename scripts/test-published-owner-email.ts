/**
 * One authorized real mail, only to the configured owner.
 * Adds one clearly labelled internal test campaign to verify the production
 * webhook and panel. Does not run the bulk campaign route or send owner copies.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { pool } from "../server/db";
import { CampaignEmailStore } from "../server/campaign-email-store";
import { sendNuxaSendGridEmail } from "../server/sendgridClient";
import { NUXA_EMAIL_REPLY_TO } from "../server/nuxa-email-identity";
import { safeMailError } from "../server/campaign-email-events";

async function main() {
  if (process.argv[2] !== "--one-owner-only" || !/^[a-f0-9]{32}$/.test(process.argv[3] || "")) {
    throw Error("Explicit one-owner authorization and database fingerprint required");
  }
  const target = await pool.query("SELECT md5(current_database()) AS fingerprint");
  if (target.rows[0].fingerprint !== process.argv[3]) throw Error("Wrong database; no send");
  const store = new CampaignEmailStore(pool);
  await store.ready();
  const receiptPath = "docs/evaluations/mail-published-owner-test.json";
  const auditId = randomUUID();
  const subject = "NUXA — prueba interna del seguimiento publicado";
  const text = "Este es el único correo de prueba de la activación del seguimiento de NUXA, enviado exclusivamente a tu dirección por tu autorización.\n\nNo es una campaña a empresas ni una alerta real. No se han enviado llamadas, SMS ni consultas de IA.\n\nPuedes abrirlo con las imágenes habilitadas. Si Resend o SendGrid bloquean las imágenes, no siempre se puede medir una apertura. Una apertura registrada tampoco garantiza una lectura humana.\n\nEl objetivo es comprobar entrega, recepción del webhook firmado, almacenamiento y contador del panel. Puedes responder: la respuesta irá a tu Gmail.";
  await mkdir("docs/evaluations", { recursive: true });
  // Claim the one-send receipt before any side effect. Do not retry ambiguity.
  await writeFile(receiptPath, JSON.stringify({
    auditId, state: "started_do_not_retry", startedAt: new Date().toISOString(),
  }, null, 2), { flag: "wx" });
  let campaignId: number | undefined;
  let attemptId: string | undefined;
  try {
    const campaign = await pool.query(
      `INSERT INTO empresa_campaign_history
       (subject,body,brand,sent_count,failed_count,opens,companies_filter,status)
       VALUES($1,$2,'nuxa',0,0,0,'PRUEBA INTERNA: solo administrador','processing') RETURNING id`,
      [subject, text],
    );
    campaignId = campaign.rows[0].id;
    attemptId = await store.reserve(campaignId!, NUXA_EMAIL_REPLY_TO.email, "a");
    if (!attemptId) throw Error("One-send reservation refused");
    await writeFile(receiptPath, JSON.stringify({
      auditId, campaignId, attemptId, state: "reserved_do_not_retry",
    }, null, 2));
    const [response] = await sendNuxaSendGridEmail({
      to: NUXA_EMAIL_REPLY_TO.email, subject, text,
      html: text.split("\n\n").map(p => `<p>${p}</p>`).join(""),
      trackingSettings: { openTracking: { enable: true }, clickTracking: { enable: false, enableText: false } },
      categories: [`empresa-${campaignId}`, "nuxa-owner-published-audit"],
      customArgs: { nuxa_audit_id: auditId },
    });
    const header = response.headers?.["x-message-id"];
    const messageId = Array.isArray(header) ? header[0] : header;
    const ok = response.statusCode === 202;
    await store.finish(attemptId, {
      ok, provider: "sendgrid", messageId,
      errorCode: ok ? undefined : String(response.statusCode),
      errorReason: ok ? undefined : "Unexpected provider response",
    });
    if (ok) {
      await pool.query(
        `INSERT INTO empresa_email_tracking(campaign_id,contact_email,resend_message_id,subject_variant)
         VALUES($1,$2,$3,'a')`,
        [campaignId, NUXA_EMAIL_REPLY_TO.email, messageId || null],
      );
    }
    await pool.query(
      "UPDATE empresa_campaign_history SET sent_count=$2,failed_count=$3,status=$4 WHERE id=$1",
      [campaignId, ok ? 1 : 0, ok ? 0 : 1, ok ? "completed" : "failed"],
    );
    const receipt = {
      auditId, campaignId, attemptId, messageId, httpStatus: response.statusCode,
      state: ok ? "accepted_waiting_for_authentic_webhook" : "not_accepted",
      sentAt: new Date().toISOString(), otherRecipients: 0, automaticRetry: false,
    };
    await writeFile(receiptPath, JSON.stringify(receipt, null, 2));
    console.log(JSON.stringify(receipt));
    if (!ok) process.exitCode = 1;
  } catch (error) {
    if (campaignId) {
      await pool.query("UPDATE empresa_campaign_history SET status='tracking_error' WHERE id=$1", [campaignId]).catch(() => {});
    }
    const detail = safeMailError(error);
    await writeFile(receiptPath, JSON.stringify({
      auditId, campaignId, attemptId, state: "failed_or_uncertain_do_not_retry", ...detail,
    }, null, 2));
    console.error(JSON.stringify(detail));
    process.exitCode = 1;
  }
}
main().catch(error => {
  console.error(safeMailError(error));
  process.exitCode = 1;
}).finally(() => pool.end());
