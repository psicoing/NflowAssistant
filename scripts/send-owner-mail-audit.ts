import { mkdir, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { sendNuxaSendGridEmail } from "../server/sendgridClient";
import { NUXA_EMAIL_REPLY_TO } from "../server/nuxa-email-identity";
import { safeMailError } from "../server/campaign-email-events";

async function main() {
  if (process.argv[2] !== "--send-single-to-owner") throw Error("Explicit single-send confirmation required");
  const receipt = "docs/evaluations/mail-audit-owner-test.json";
  const auditId = randomUUID();
  await mkdir("docs/evaluations", { recursive: true });
  // Write before sending. An uncertain result must never trigger an automatic retry.
  await writeFile(receipt, JSON.stringify({ auditId, startedAt: new Date().toISOString(), state: "started_do_not_retry" }, null, 2), { flag: "wx" });
  try {
    const [response] = await sendNuxaSendGridEmail({
      to: NUXA_EMAIL_REPLY_TO.email,
      subject: "NUXA — prueba única de entrega y seguimiento",
      text: "Este es un único correo de prueba solicitado por ti para revisar la entrega y el seguimiento de NUXA.\n\nNo es una campaña comercial ni una alerta real. No se ha enviado a empresas ni a otros contactos.\n\nPuedes abrirlo con las imágenes habilitadas y responder: la respuesta irá a tu Gmail. Una apertura registrada no demuestra por sí sola una lectura humana.\n\nEl webhook de producción no se ha activado ni modificado; esta prueba no verifica todavía el circuito completo del panel.",
      html: "<p>Este es un <strong>único correo de prueba solicitado por ti</strong> para revisar la entrega y el seguimiento de NUXA.</p><p>No es una campaña comercial ni una alerta real. No se ha enviado a empresas ni a otros contactos.</p><p>Puedes abrirlo con las imágenes habilitadas y responder: la respuesta irá a tu Gmail. Una apertura registrada no demuestra por sí sola una lectura humana.</p><p>El webhook de producción no se ha activado ni modificado; esta prueba no verifica todavía el circuito completo del panel.</p>",
      trackingSettings: { openTracking: { enable: true }, clickTracking: { enable: false, enableText: false } },
      categories: ["nuxa-owner-audit-test"],
      customArgs: { nuxa_audit_id: auditId },
    });
    const result = { auditId, at: new Date().toISOString(), state: response.statusCode === 202 ? "accepted_not_delivery_confirmed" : "unexpected_response",
      httpStatus: response.statusCode, messageId: response.headers?.["x-message-id"], productionWebhookChanged: false };
    await writeFile(receipt, JSON.stringify(result, null, 2));
    console.log(JSON.stringify(result));
  } catch (error) {
    const detail = safeMailError(error);
    await writeFile(receipt, JSON.stringify({ auditId, state: "failed_or_uncertain_do_not_retry", ...detail }, null, 2));
    console.error(JSON.stringify(detail));
    process.exitCode = 1;
  }
}
main().catch(e => { console.error(safeMailError(e)); process.exitCode = 1; });
