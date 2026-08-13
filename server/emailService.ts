import { Resend } from 'resend';
import sgMail from '@sendgrid/mail';
import twilio from 'twilio';
import crypto from 'crypto';

// -------------------------------------------------------
// Resend client (owner notifications)
// -------------------------------------------------------

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('RESEND_API_KEY not set');
  return new Resend(apiKey);
}

// -------------------------------------------------------
// SendGrid client (legacy – magic links, Skrill emails)
// -------------------------------------------------------

let connectionSettings: any;

async function getCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? 'repl ' + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
    ? 'depl ' + process.env.WEB_REPL_RENEWAL
    : null;

  if (!xReplitToken) throw new Error('X_REPLIT_TOKEN not found for repl/depl');

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=sendgrid',
    {
      headers: {
        Accept: 'application/json',
        X_REPLIT_TOKEN: xReplitToken,
      },
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  if (!connectionSettings || !connectionSettings.settings.api_key || !connectionSettings.settings.from_email) {
    throw new Error('SendGrid not connected');
  }
  return { apiKey: connectionSettings.settings.api_key, email: connectionSettings.settings.from_email };
}

async function getUncachableSendGridClient() {
  const { apiKey, email } = await getCredentials();
  sgMail.setApiKey(apiKey);
  return { client: sgMail, fromEmail: email };
}

// -------------------------------------------------------
// Skrill helpers
// -------------------------------------------------------

const SKRILL_MERCHANT_EMAIL = "rmportbou@gmail.com";

const PLAN_DETAILS: Record<string, { label: string; amount: string; description: string }> = {
  basico:       { label: "NUXA – 10 preguntas",        amount: "2.99",     description: "Pago por uso – 10 preguntas" },
  pro:          { label: "NUXA – 20 preguntas",        amount: "5.99",     description: "Pago por uso – 20 preguntas" },
  anual:        { label: "NUXA – 100 preguntas",       amount: "32.00",    description: "Pago por uso – 100 preguntas" },
  empresa_100:  { label: "NUXA Empresa 100 usuarios",  amount: "5000.00",  description: "Licencia anual – 100 trabajadores" },
  empresa_200:  { label: "NUXA Empresa 200 usuarios",  amount: "10000.00", description: "Licencia anual – 200 trabajadores" },
  empresa_300:  { label: "NUXA Empresa 300 usuarios",  amount: "15000.00", description: "Licencia anual – 300 trabajadores" },
};

export function buildSkrillLink(params: { nombre: string; apellidos: string; email: string; plan: string }): string {
  const plan = PLAN_DETAILS[params.plan] ?? PLAN_DETAILS["basico"];
  const base = "https://www.skrill.com/app/";
  const qs = new URLSearchParams({
    pay_to_email: SKRILL_MERCHANT_EMAIL,
    currency: "EUR",
    amount: plan.amount,
    language: "ES",
    detail1_description: plan.label,
    detail1_text: plan.description,
    firstname: params.nombre,
    lastname: params.apellidos,
    pay_from_email: params.email,
  });
  return `${base}?${qs.toString()}`;
}

// -------------------------------------------------------
// Owner notification via Resend
// -------------------------------------------------------

const OWNER_EMAIL = "rmportbou@gmail.com";

export async function sendOwnerNotification(params: {
  tipo: "individual" | "empresa_media" | "licitacion";
  empresa?: string;
  nombre: string;
  apellidos: string;
  email: string;
  plan: string;
}): Promise<boolean> {
  try {
    const resend = getResendClient();

    const tipoLabel: Record<string, string> = {
      individual:    "👤 Plan Individual",
      empresa_media: "🏢 Empresa mediana",
      licitacion:    "📋 Licitación grandes organizaciones",
    };

    const planLabel: Record<string, string> = {
      basico:       "10 preguntas – €2.99",
      pro:          "20 preguntas – €5.99",
      anual:        "100 preguntas – €32",
      empresa_100:  "100 trabajadores – €5.000/año",
      empresa_200:  "200 trabajadores – €10.000/año",
      empresa_300:  "300 trabajadores – €15.000/año",
      licitacion:   "Licitación a partir de 40.000 trabajadores",
    };

    const fecha = new Date().toLocaleString("es-ES", { timeZone: "Europe/Madrid" });
    const tipo  = tipoLabel[params.tipo] ?? params.tipo;
    const plan  = planLabel[params.plan] ?? params.plan;
    const empresaFila = params.empresa
      ? `<tr><td style="padding:6px 0;color:#6b7280;font-size:14px;">Empresa</td><td style="padding:6px 0;font-weight:600;font-size:14px;">${params.empresa}</td></tr>`
      : "";

    const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;background:#f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
        <tr><td style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:28px 32px;">
          <p style="margin:0;font-size:22px;font-weight:700;color:#fff;">🔔 Nueva solicitud en NUXA</p>
          <p style="margin:4px 0 0;color:#c7d2fe;font-size:14px;">${tipo}</p>
        </td></tr>
        <tr><td style="padding:28px 32px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            ${empresaFila}
            <tr><td style="padding:6px 0;color:#6b7280;font-size:14px;">Nombre</td><td style="padding:6px 0;font-weight:600;font-size:14px;">${params.nombre} ${params.apellidos}</td></tr>
            <tr><td style="padding:6px 0;color:#6b7280;font-size:14px;">Email</td><td style="padding:6px 0;font-weight:600;font-size:14px;color:#6366f1;">${params.email}</td></tr>
            <tr><td style="padding:6px 0;color:#6b7280;font-size:14px;">Plan</td><td style="padding:6px 0;font-weight:600;font-size:14px;">${plan}</td></tr>
            <tr><td style="padding:6px 0;color:#6b7280;font-size:14px;">Fecha</td><td style="padding:6px 0;font-size:13px;color:#9ca3af;">${fecha}</td></tr>
          </table>
          <div style="margin-top:20px;padding:14px 16px;background:#fef3c7;border-radius:10px;border-left:4px solid #f59e0b;">
            <p style="margin:0;font-size:13px;color:#92400e;font-weight:600;">⏱ Acción requerida</p>
            <p style="margin:4px 0 0;font-size:12px;color:#b45309;">Envía el enlace de pago Skrill a <strong>${params.email}</strong> en las próximas 24h.</p>
          </div>
        </td></tr>
        <tr><td style="padding:16px 32px;background:#f9fafb;border-top:1px solid #e5e7eb;">
          <p style="margin:0;font-size:11px;color:#9ca3af;text-align:center;">NUXA · Sistema de notificaciones automático</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    const { error } = await resend.emails.send({
      from: 'NUXA <hola@nuxa.life>',
      to: OWNER_EMAIL,
      subject: `[NUXA] Nueva solicitud – ${params.nombre} ${params.apellidos} (${plan})`,
      html,
    });

    if (error) {
      console.error("sendOwnerNotification Resend error:", error);
      return false;
    }

    console.log(`✅ Owner notification sent to ${OWNER_EMAIL}`);
    return true;
  } catch (err) {
    console.error("sendOwnerNotification error:", err);
    return false;
  }
}

// -------------------------------------------------------
// Skrill registration email (SendGrid)
// -------------------------------------------------------

interface SkrillRegistrationEmailParams {
  to: string;
  nombre: string;
  apellidos: string;
  plan: string;
  skrillLink: string;
}

export async function sendSkrillRegistrationEmail(params: SkrillRegistrationEmailParams): Promise<boolean> {
  try {
    const resend = getResendClient();
    const planInfo = PLAN_DETAILS[params.plan] ?? PLAN_DETAILS["basico"];

    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Activa tu plan NUXA</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f0f4ff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0f4ff; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
          <tr>
            <td style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 40px 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 32px; font-weight: bold;">NUXA</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Tu asistente de salud mental con IA</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: #1a202c; margin: 0 0 16px 0; font-size: 22px;">¡Hola, ${params.nombre}!</h2>
              <p style="color: #4a5568; font-size: 16px; line-height: 1.7; margin: 0 0 20px 0;">
                Has solicitado el <strong>${planInfo.label}</strong>. Para activar tu acceso, realiza el pago a través del siguiente enlace seguro de Skrill:
              </p>
              <div style="background: #f7f8ff; border: 1px solid #e0e7ff; border-radius: 12px; padding: 20px; margin: 24px 0; text-align: center;">
                <p style="color: #6366f1; font-size: 14px; font-weight: 600; margin: 0 0 4px 0;">Importe a pagar</p>
                <p style="color: #1a202c; font-size: 28px; font-weight: bold; margin: 0;">€${planInfo.amount}${params.plan === "anual" ? "/año" : "/mes"}</p>
              </div>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 28px 0;">
                <tr>
                  <td align="center">
                    <a href="${params.skrillLink}" style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; text-decoration: none; padding: 16px 44px; border-radius: 12px; font-size: 18px; font-weight: bold; box-shadow: 0 4px 15px rgba(99,102,241,0.35);">
                      Pagar con Skrill →
                    </a>
                  </td>
                </tr>
              </table>
              <p style="color: #718096; font-size: 13px; line-height: 1.6; margin: 20px 0 0 0; text-align: center;">
                Si el botón no funciona, copia este enlace en tu navegador:<br>
                <span style="color: #6366f1; word-break: break-all;">${params.skrillLink}</span>
              </p>
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
              <p style="color: #a0aec0; font-size: 13px; line-height: 1.6; text-align: center; margin: 0;">
                Una vez realizado el pago, recibirás un correo de confirmación con tus datos de acceso a NUXA.<br>
                ¿Tienes dudas? Escríbenos a <a href="mailto:empordajobs@gmail.com" style="color: #6366f1;">empordajobs@gmail.com</a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f7f8ff; padding: 20px 30px; text-align: center;">
              <p style="color: #a0aec0; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} NUXA by Empordajobs SL. Sin permanencia. Cancela cuando quieras.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const { error } = await resend.emails.send({
      from: "NUXA <hola@nuxa.life>",
      to: params.to,
      subject: `Tu enlace de pago para ${planInfo.label}`,
      text: `Hola ${params.nombre},\n\nPara activar tu ${planInfo.label} (€${planInfo.amount}), usa este enlace de Skrill:\n${params.skrillLink}\n\nNUXA by Empordajobs SL`,
      html: htmlContent,
    });
    if (error) { console.error("❌ sendSkrillRegistrationEmail Resend error:", error); return false; }
    console.log(`✅ Skrill registration email sent to: ${params.to}`);
    return true;
  } catch (error) {
    console.error("❌ Error sending Skrill registration email:", error);
    return false;
  }
}

// -------------------------------------------------------
// Magic link email (SendGrid)
// -------------------------------------------------------

interface MagicLinkEmailParams {
  to: string;
  customerName: string;
  magicLink: string;
  productName: string;
  isNewUser: boolean;
}

export async function sendMagicLinkEmail(params: MagicLinkEmailParams): Promise<boolean> {
  try {
    const resend = getResendClient();

    const subject = params.isNewUser
      ? '¡Bienvenido a NUXA! Tu acceso está listo'
      : '¡Gracias por tu compra! Accede a NUXA';

    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Acceso a NUXA</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #1a1a2e;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #1a1a2e; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #16213e; border-radius: 16px; overflow: hidden;">
          <tr>
            <td style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 40px 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 32px; font-weight: bold;">NUXA</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Tu bienestar emocional, siempre contigo</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: white; margin: 0 0 20px 0; font-size: 24px;">
                ${params.isNewUser ? '¡Bienvenido a NUXA!' : '¡Gracias por tu compra!'}
              </h2>
              <p style="color: #a0aec0; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">Hola ${params.customerName},</p>
              <p style="color: #a0aec0; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                ${params.isNewUser
                  ? 'Tu cuenta NUXA ha sido creada automáticamente y tu compra ha sido activada.'
                  : 'Tu compra ha sido procesada exitosamente. Tu servicio ya está activo y listo para usar.'}
              </p>
              <div style="background-color: #1e3a5f; border-radius: 12px; padding: 20px; margin: 25px 0;">
                <p style="color: #a0aec0; font-size: 14px; margin: 0 0 5px 0;">Producto:</p>
                <p style="color: white; font-size: 18px; font-weight: bold; margin: 0;">${params.productName}</p>
              </div>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="${params.magicLink}" style="display: inline-block; background: linear-gradient(135deg, #10b981, #059669); color: white; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-size: 18px; font-weight: bold; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);">
                      Acceder a NUXA →
                    </a>
                  </td>
                </tr>
              </table>
              <p style="color: #718096; font-size: 14px; line-height: 1.6; margin: 25px 0 0 0; text-align: center;">
                Este enlace es válido por 7 días y solo puede usarse una vez.
              </p>
              <p style="color: #4a5568; font-size: 12px; line-height: 1.6; margin: 15px 0 0 0; text-align: center; word-break: break-all;">
                Si el botón no funciona, copia este enlace: ${params.magicLink}
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #0f172a; padding: 25px 30px; text-align: center;">
              <p style="color: #64748b; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} NUXA by Empordajobs SL. Todos los derechos reservados.</p>
              <p style="color: #475569; font-size: 11px; margin: 10px 0 0 0;">Sin permanencia. Cancela cuando quieras.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const { error } = await resend.emails.send({
      from: "NUXA <hola@nuxa.life>",
      to: params.to,
      subject,
      text: `¡${params.isNewUser ? 'Bienvenido' : 'Gracias por tu compra'}, ${params.customerName}!\n\nProducto: ${params.productName}\n\nAccede a NUXA:\n${params.magicLink}\n\nEste enlace es válido por 7 días.\n\nNUXA by Empordajobs SL`,
      html: htmlContent,
    });
    if (error) { console.error('❌ sendMagicLinkEmail Resend error:', error); return false; }
    console.log(`✅ Magic link email sent to: ${params.to}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending magic link email:', error);
    return false;
  }
}

// -------------------------------------------------------
// Owner SMS notification via Twilio
// -------------------------------------------------------

export async function sendOwnerSMS(params: {
  tipo: "individual" | "empresa_media" | "licitacion";
  empresa?: string;
  nombre: string;
  apellidos: string;
  email: string;
  plan: string;
}): Promise<boolean> {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken  = process.env.TWILIO_AUTH_TOKEN;
    const from       = process.env.TWILIO_FROM_NUMBER;
    const to         = process.env.OWNER_PHONE_NUMBER;

    if (!accountSid || !authToken || !from || !to) {
      console.warn("Twilio credentials not fully configured, skipping SMS");
      return false;
    }

    const tipoLabel: Record<string, string> = {
      individual:    "Plan individual",
      empresa_media: "Empresa mediana",
      licitacion:    "Licitación grande",
    };

    const planLabel: Record<string, string> = {
      basico:       "10q €2.99",
      pro:          "20q €5.99",
      anual:        "100q €32",
      empresa_100:  "100 trabajadores €5k",
      empresa_200:  "200 trabajadores €10k",
      empresa_300:  "300 trabajadores €15k",
      licitacion:   "+40.000 trabajadores",
    };

    const tipo  = tipoLabel[params.tipo] ?? params.tipo;
    const plan  = planLabel[params.plan] ?? params.plan;
    const empresa = params.empresa ? ` | ${params.empresa}` : "";

    const body = `🔔 NUXA – Nueva solicitud\n${tipo}${empresa}\n👤 ${params.nombre} ${params.apellidos}\n📧 ${params.email}\n📦 ${plan}`;

    const client = twilio(accountSid, authToken);
    await client.messages.create({ body, from, to });

    console.log(`✅ Owner SMS sent to ${to}`);
    return true;
  } catch (err) {
    console.error("sendOwnerSMS error:", err);
    return false;
  }
}

// ---------------------------------------------------------------------------
// Trial exhausted email — sent when a trial user uses their last free question
// ---------------------------------------------------------------------------
export async function sendTrialExhaustedEmail(params: {
  email: string;
  username: string;
}): Promise<boolean> {
  try {
    const resend = getResendClient();

    const html = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;background:#f0f4ff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <tr><td style="background:linear-gradient(135deg,#f97316,#ef4444);padding:32px;text-align:center;">
          <p style="margin:0 0 8px;font-size:36px;">🧠</p>
          <p style="margin:0;font-size:24px;font-weight:700;color:#fff;">Has completado tu prueba gratuita</p>
          <p style="margin:8px 0 0;color:#fde68a;font-size:15px;">Tu experiencia con NUXA no tiene por qué terminar aquí</p>
        </td></tr>
        <tr><td style="padding:32px;">
          <p style="margin:0 0 20px;color:#374151;font-size:15px;line-height:1.7;">
            Hola <strong>${params.username}</strong>,<br><br>
            Has utilizado tus 5 consultas gratuitas con NUXA. Esperamos que hayas podido sentir el apoyo que ofrece.
          </p>
          <div style="background:#fff7ed;border-left:4px solid #f97316;border-radius:8px;padding:16px 20px;margin-bottom:24px;">
            <p style="margin:0;color:#92400e;font-size:14px;line-height:1.7;">
              Con un plan de pago, tienes <strong>acceso ilimitado</strong> a NUXA — sin esperas, sin interrupciones, disponible 24/7.
            </p>
          </div>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
            <tr><td style="padding:10px 0;border-bottom:1px solid #e5e7eb;">
              <p style="margin:0;color:#1f2937;font-size:14px;">💬 <strong>Plan desde €2.99/mes</strong> — sin permanencia, cancela cuando quieras</p>
            </td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #e5e7eb;">
              <p style="margin:0;color:#1f2937;font-size:14px;">🔒 <strong>Totalmente confidencial</strong> — tus conversaciones solo son tuyas</p>
            </td></tr>
            <tr><td style="padding:10px 0;">
              <p style="margin:0;color:#1f2937;font-size:14px;">🕐 <strong>Disponible 24/7</strong> — cuando más lo necesites</p>
            </td></tr>
          </table>
          <div style="text-align:center;margin-bottom:24px;">
            <a href="https://nuxa.life/registro/planes"
               style="display:inline-block;background:linear-gradient(135deg,#f97316,#ef4444);color:#fff;text-decoration:none;padding:14px 32px;border-radius:12px;font-weight:700;font-size:15px;">
              Continuar con NUXA &rarr;
            </a>
          </div>
          <p style="margin:0;color:#6b7280;font-size:13px;line-height:1.6;text-align:center;">
            También puedes explorar nuestros <a href="https://nuxa.life/recursos-gratuitos" style="color:#f97316;text-decoration:none;">recursos gratuitos</a> sin límite.
          </p>
        </td></tr>
        <tr><td style="padding:20px 32px;background:#f9fafb;border-top:1px solid #e5e7eb;text-align:center;">
          <p style="margin:0;font-size:11px;color:#9ca3af;">
            NUXA &middot; Empordajobs SL &middot; B02701100<br>
            Este email se envía una sola vez al finalizar tu prueba gratuita.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    const { error: trialErr } = await resend.emails.send({
      from: "NUXA <hola@nuxa.life>",
      to: params.email,
      subject: "Tu prueba gratuita ha terminado — continúa con NUXA desde €2.99/mes",
      text: `Hola ${params.username},\n\nHas utilizado tus 5 consultas gratuitas con NUXA.\n\nContinúa con un plan desde €2.99/mes, sin permanencia: https://nuxa.life/registro/planes\n\nO explora recursos gratuitos: https://nuxa.life/recursos-gratuitos`,
      html,
    });
    if (trialErr) { console.error("sendTrialExhaustedEmail Resend error:", trialErr); return false; }
    return true;
  } catch (err) {
    console.error("sendTrialExhaustedEmail exception:", err);
    return false;
  }
}

// Lead welcome email — sent to new email subscribers from public pages
// ---------------------------------------------------------------------------
export async function sendLeadWelcomeEmail(params: {
  email: string;
  unsubscribeToken: string;
}): Promise<boolean> {
  try {
    const resend = getResendClient();
    const unsubscribeUrl = `https://nuxa.life/api/leads/unsubscribe?token=${params.unsubscribeToken}`;

    const html = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;background:#f0f4ff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <tr><td style="background:linear-gradient(135deg,#10b981,#0d9488);padding:32px;text-align:center;">
          <p style="margin:0 0 8px;font-size:36px;">🧠</p>
          <p style="margin:0;font-size:24px;font-weight:700;color:#fff;">¡Bienvenido/a a NUXA!</p>
          <p style="margin:8px 0 0;color:#a7f3d0;font-size:15px;">Tu psicólogo IA está aquí para ti</p>
        </td></tr>
        <tr><td style="padding:32px;">
          <p style="margin:0 0 20px;color:#374151;font-size:15px;line-height:1.7;">
            Gracias por suscribirte. A partir de ahora recibirás de NUXA:
          </p>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
            <tr><td style="padding:10px 0;border-bottom:1px solid #e5e7eb;">
              <p style="margin:0;color:#1f2937;font-size:14px;">🔔 <strong>Recordatorios mensuales</strong> de bienestar emocional</p>
            </td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #e5e7eb;">
              <p style="margin:0;color:#1f2937;font-size:14px;">🎁 <strong>Recursos nuevos</strong> antes que nadie</p>
            </td></tr>
            <tr><td style="padding:10px 0;">
              <p style="margin:0;color:#1f2937;font-size:14px;">💬 <strong>Novedades</strong> de la plataforma NUXA</p>
            </td></tr>
          </table>
          <div style="text-align:center;margin-bottom:24px;">
            <a href="https://nuxa.life/prueba-gratis"
               style="display:inline-block;background:linear-gradient(135deg,#10b981,#0d9488);color:#fff;text-decoration:none;padding:14px 32px;border-radius:12px;font-weight:700;font-size:15px;">
              Explorar NUXA gratis &rarr;
            </a>
          </div>
          <p style="margin:0;color:#6b7280;font-size:13px;line-height:1.6;">
            Recuerda que NUXA es tu espacio de apoyo emocional 24/7. Estamos aqui siempre que lo necesites.
          </p>
        </td></tr>
        <tr><td style="padding:20px 32px;background:#f9fafb;border-top:1px solid #e5e7eb;text-align:center;">
          <p style="margin:0;font-size:11px;color:#9ca3af;">
            NUXA &middot; Empordajobs SL &middot; B02701100<br>
            <a href="${unsubscribeUrl}" style="color:#9ca3af;text-decoration:underline;">
              Darme de baja de las comunicaciones
            </a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    const { error: leadErr } = await resend.emails.send({
      from: "NUXA <hola@nuxa.life>",
      to: params.email,
      subject: "Bienvenido/a a NUXA - Tu psicólogo IA te espera",
      text: `Gracias por suscribirte a NUXA.\n\nA partir de ahora recibirás recordatorios mensuales de bienestar, recursos nuevos y novedades de la plataforma.\n\nExplora NUXA gratis: https://nuxa.life/prueba-gratis\n\n---\nPara darte de baja: ${unsubscribeUrl}`,
      html,
    });
    if (leadErr) { console.error("sendLeadWelcomeEmail Resend error:", leadErr); return false; }
    console.log(`✅ Lead welcome email sent to ${params.email}`);
    return true;
  } catch (err) {
    console.error("sendLeadWelcomeEmail exception:", err);
    return false;
  }
}

// Generate a secure random unsubscribe token
export function generateUnsubscribeToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

// ---------------------------------------------------------------------------
// Institution campaign email — sent manually from admin dashboard to public bodies
// ---------------------------------------------------------------------------
export async function sendInstitutionEmail(params: {
  email: string;
  subject: string;
  body: string;
  institutionId: number;
  campaignId?: number;
}): Promise<{ ok: boolean; messageId?: string }> {
  try {
    const resend = getResendClient();
    const uid = Buffer.from(params.institutionId.toString()).toString("base64url");
    const unsubscribeUrl = `https://nuxa.life/api/unsubscribe-institution?uid=${uid}`;

    // Convert plain text body to HTML paragraphs
    const bodyHtml = params.body
      .split("\n")
      .filter(l => l.trim())
      .map(l => `<p style="margin:0 0 14px;color:#374151;font-size:15px;line-height:1.7;">${l}</p>`)
      .join("");

    const html = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;background:#f0f4ff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <tr><td style="background:linear-gradient(135deg,#1e40af,#3b82f6);padding:32px;text-align:center;">
          <p style="margin:0 0 6px;font-size:28px;">🧠</p>
          <p style="margin:0;font-size:22px;font-weight:700;color:#fff;">NUXA</p>
          <p style="margin:6px 0 0;color:#bfdbfe;font-size:14px;">Apoyo emocional profesional · ISO 45003</p>
        </td></tr>
        <tr><td style="padding:32px;">
          ${bodyHtml}
        </td></tr>
        <tr><td style="padding:20px 32px;background:#f9fafb;border-top:1px solid #e5e7eb;text-align:center;">
          <p style="margin:0;font-size:11px;color:#9ca3af;">
            NUXA &middot; Empordajobs SL &middot; B02701100 &middot; nuxa.life<br>
            <a href="${unsubscribeUrl}" style="color:#9ca3af;text-decoration:underline;">
              No deseo recibir más comunicaciones de NUXA
            </a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    const tags = params.campaignId
      ? [{ name: "campaign_id", value: String(params.campaignId) }]
      : undefined;

    const { data, error } = await resend.emails.send({
      from: "NUXA <hola@nuxa.life>",
      to: params.email,
      subject: params.subject,
      text: `${params.body}\n\n---\nPara no recibir más comunicaciones: ${unsubscribeUrl}`,
      html,
      ...(tags ? { tags } : {}),
    });

    if (error) {
      console.error("sendInstitutionEmail Resend error:", error);
      return { ok: false };
    }
    return { ok: true, messageId: data?.id };
  } catch (err) {
    console.error("sendInstitutionEmail error:", err);
    return { ok: false };
  }
}

// ---------------------------------------------------------------------------
// Mutua campaign email — sent manually from admin dashboard to mutuas
// ---------------------------------------------------------------------------
export async function sendMutuaEmail(params: {
  email: string;
  subject: string;
  body: string;
  mutuaId: number;
  campaignId?: number;
}): Promise<{ ok: boolean; messageId?: string }> {
  try {
    const resend = getResendClient();
    const uid = Buffer.from(params.mutuaId.toString()).toString("base64url");
    const unsubscribeUrl = `https://nuxa.life/api/unsubscribe-mutua?uid=${uid}`;

    const bodyHtml = params.body
      .split("\n")
      .filter(l => l.trim())
      .map(l => `<p style="margin:0 0 14px;color:#374151;font-size:15px;line-height:1.7;">${l}</p>`)
      .join("");

    const html = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;background:#f0f4ff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <tr><td style="background:linear-gradient(135deg,#1e40af,#3b82f6);padding:32px;text-align:center;">
          <p style="margin:0 0 6px;font-size:28px;">🧠</p>
          <p style="margin:0;font-size:22px;font-weight:700;color:#fff;">NUXA</p>
          <p style="margin:6px 0 0;color:#bfdbfe;font-size:14px;">Apoyo emocional profesional · ISO 45003</p>
        </td></tr>
        <tr><td style="padding:32px;">
          ${bodyHtml}
        </td></tr>
        <tr><td style="padding:20px 32px;background:#f9fafb;border-top:1px solid #e5e7eb;text-align:center;">
          <p style="margin:0;font-size:11px;color:#9ca3af;">
            NUXA &middot; Empordajobs SL &middot; B02701100 &middot; nuxa.life<br>
            <a href="${unsubscribeUrl}" style="color:#9ca3af;text-decoration:underline;">
              No deseo recibir más comunicaciones de NUXA
            </a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    const tags = params.campaignId
      ? [{ name: "campaign_id", value: `m${params.campaignId}` }]
      : undefined;

    const { data, error } = await resend.emails.send({
      from: "NUXA <hola@nuxa.life>",
      to: params.email,
      subject: params.subject,
      text: `${params.body}\n\n---\nPara no recibir más comunicaciones: ${unsubscribeUrl}`,
      html,
      ...(tags ? { tags } : {}),
    });

    if (error) {
      console.error("sendMutuaEmail Resend error:", error);
      return { ok: false };
    }
    return { ok: true, messageId: data?.id };
  } catch (err) {
    console.error("sendMutuaEmail error:", err);
    return { ok: false };
  }
}

// ---------------------------------------------------------------------------
// Reactivation email — sent manually from admin dashboard to trial users
// ---------------------------------------------------------------------------
export async function sendReactivationEmail(params: {
  email: string;
  username: string;
  userId: number;
}): Promise<boolean> {
  try {
    const resend = getResendClient();
    const uid = Buffer.from(params.userId.toString()).toString("base64url");
    const unsubscribeUrl = `https://nuxa.life/api/unsubscribe-reactivation?uid=${uid}`;

    const html = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;background:#f0f4ff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <tr><td style="background:linear-gradient(135deg,#10b981,#0d9488);padding:32px;text-align:center;">
          <p style="margin:0 0 8px;font-size:36px;">🧠</p>
          <p style="margin:0;font-size:24px;font-weight:700;color:#fff;">¿Cómo estás?</p>
          <p style="margin:8px 0 0;color:#a7f3d0;font-size:15px;">Tu espacio en NUXA te espera</p>
        </td></tr>
        <tr><td style="padding:32px;">
          <p style="margin:0 0 16px;color:#374151;font-size:15px;line-height:1.7;">
            Hola <strong>${params.username}</strong>,
          </p>
          <p style="margin:0 0 20px;color:#374151;font-size:15px;line-height:1.7;">
            Hace un tiempo probaste NUXA y nos gustaría saber cómo estás.
          </p>
          <p style="margin:0 0 20px;color:#374151;font-size:15px;line-height:1.7;">
            Si entonces no fue el momento, no pasa nada — pero si alguna vez necesitas un espacio donde hablar <strong>sin juicios y sin prisas</strong>, aquí seguimos.
          </p>
          <div style="background:#ecfdf5;border-left:4px solid #10b981;border-radius:8px;padding:16px 20px;margin-bottom:24px;">
            <p style="margin:0;color:#065f46;font-size:14px;line-height:1.7;">
              Además, ahora tienes <strong>5 consultas gratuitas</strong> esperándote.
            </p>
          </div>
          <div style="text-align:center;margin-bottom:24px;">
            <a href="https://nuxa.life/prueba-gratis"
               style="display:inline-block;background:linear-gradient(135deg,#10b981,#0d9488);color:#fff;text-decoration:none;padding:14px 32px;border-radius:12px;font-weight:700;font-size:15px;">
              Volver a NUXA &rarr;
            </a>
          </div>
          <p style="margin:0;color:#6b7280;font-size:13px;line-height:1.6;text-align:center;">
            Sin compromisos. Sin tarjeta de crédito. Solo cuando lo necesites.
          </p>
        </td></tr>
        <tr><td style="padding:20px 32px;background:#f9fafb;border-top:1px solid #e5e7eb;text-align:center;">
          <p style="margin:0;font-size:11px;color:#9ca3af;">
            NUXA &middot; Empordajobs SL &middot; B02701100<br>
            Este mensaje se envía una sola vez. &nbsp;
            <a href="${unsubscribeUrl}" style="color:#9ca3af;text-decoration:underline;">
              No quiero recibir más mensajes de NUXA
            </a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    const { error: reactErr } = await resend.emails.send({
      from: "NUXA <hola@nuxa.life>",
      to: params.email,
      subject: "¿Cómo estás? Tu espacio en NUXA te espera 🧠",
      text: `Hola ${params.username},\n\nHace un tiempo probaste NUXA. Si alguna vez necesitas un espacio donde hablar sin juicios, aquí seguimos.\n\nAhora tienes 5 consultas gratuitas esperándote:\nhttps://nuxa.life/prueba-gratis\n\n---\nPara no recibir más mensajes: ${unsubscribeUrl}`,
      html,
    });
    if (reactErr) { console.error("sendReactivationEmail Resend error:", reactErr); return false; }
    return true;
  } catch (err) {
    console.error("sendReactivationEmail error:", err);
    return false;
  }
}
