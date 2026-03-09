// SendGrid Email Service - Integration with Replit Connectors
import sgMail from '@sendgrid/mail';

let connectionSettings: any;

async function getCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=sendgrid',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  if (!connectionSettings || (!connectionSettings.settings.api_key || !connectionSettings.settings.from_email)) {
    throw new Error('SendGrid not connected');
  }
  return {apiKey: connectionSettings.settings.api_key, email: connectionSettings.settings.from_email};
}

async function getUncachableSendGridClient() {
  const {apiKey, email} = await getCredentials();
  sgMail.setApiKey(apiKey);
  return {
    client: sgMail,
    fromEmail: email
  };
}

// -------------------------------------------------------
// Skrill payment link email for individual plan registration
// -------------------------------------------------------

const SKRILL_MERCHANT_EMAIL = "rmportbou@gmail.com";

const PLAN_DETAILS: Record<string, { label: string; amount: string; description: string }> = {
  basico:       { label: "NUXA – 10 preguntas",        amount: "2.99",    description: "Pago por uso – 10 preguntas" },
  pro:          { label: "NUXA – 20 preguntas",       amount: "5.99",    description: "Pago por uso – 20 preguntas" },
  anual:        { label: "NUXA – 100 preguntas",      amount: "32.00",   description: "Pago por uso – 100 preguntas" },
  empresa_100:  { label: "NUXA Empresa 100 usuarios", amount: "5000.00", description: "Licencia anual – 100 trabajadores" },
  empresa_200:  { label: "NUXA Empresa 200 usuarios", amount: "10000.00",description: "Licencia anual – 200 trabajadores" },
  empresa_300:  { label: "NUXA Empresa 300 usuarios", amount: "15000.00",description: "Licencia anual – 300 trabajadores" },
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
    const { client, fromEmail } = await getUncachableSendGridClient();

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
    const tipo = tipoLabel[params.tipo] ?? params.tipo;
    const plan = planLabel[params.plan] ?? params.plan;
    const empresaFila = params.empresa ? `<tr><td style="padding:6px 0;color:#6b7280;font-size:14px;">Empresa</td><td style="padding:6px 0;font-weight:600;font-size:14px;">${params.empresa}</td></tr>` : "";

    const html = `
<!DOCTYPE html>
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

    await client.send({
      to: OWNER_EMAIL,
      from: fromEmail,
      subject: `[NUXA] Nueva solicitud – ${params.nombre} ${params.apellidos} (${plan})`,
      html,
      text: `Nueva solicitud NUXA\nTipo: ${tipo}\nNombre: ${params.nombre} ${params.apellidos}\nEmail: ${params.email}\nPlan: ${plan}\nFecha: ${fecha}`,
    });

    return true;
  } catch (err) {
    console.error("sendOwnerNotification error:", err);
    return false;
  }
}

interface SkrillRegistrationEmailParams {
  to: string;
  nombre: string;
  apellidos: string;
  plan: string;
  skrillLink: string;
}

export async function sendSkrillRegistrationEmail(params: SkrillRegistrationEmailParams): Promise<boolean> {
  try {
    const { client, fromEmail } = await getUncachableSendGridClient();
    const planInfo = PLAN_DETAILS[params.plan] ?? PLAN_DETAILS["basico"];

    const htmlContent = `
<!DOCTYPE html>
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
                Has solicitado el <strong>${planInfo.label}</strong>. Para activar tu acceso, realiza el pago mensual a través del siguiente enlace seguro de Skrill:
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

    const msg = {
      to: params.to,
      from: { email: fromEmail, name: "NUXA" },
      subject: `Tu enlace de pago para ${planInfo.label}`,
      text: `Hola ${params.nombre},\n\nPara activar tu ${planInfo.label} (€${planInfo.amount}), usa este enlace de Skrill:\n${params.skrillLink}\n\nNUXA by Empordajobs SL`,
      html: htmlContent,
    };

    await client.send(msg);
    console.log(`✅ Skrill registration email sent to: ${params.to}`);
    return true;
  } catch (error) {
    console.error("❌ Error sending Skrill registration email:", error);
    return false;
  }
}

interface MagicLinkEmailParams {
  to: string;
  customerName: string;
  magicLink: string;
  productName: string;
  isNewUser: boolean;
}

export async function sendMagicLinkEmail(params: MagicLinkEmailParams): Promise<boolean> {
  try {
    const { client, fromEmail } = await getUncachableSendGridClient();
    
    const subject = params.isNewUser 
      ? '¡Bienvenido a NUXA! Tu acceso está listo'
      : '¡Gracias por tu compra! Accede a NUXA';

    const htmlContent = `
<!DOCTYPE html>
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
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 40px 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 32px; font-weight: bold;">NUXA</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Tu bienestar emocional, siempre contigo</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: white; margin: 0 0 20px 0; font-size: 24px;">
                ${params.isNewUser ? '¡Bienvenido a NUXA!' : '¡Gracias por tu compra!'}
              </h2>
              
              <p style="color: #a0aec0; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Hola ${params.customerName},
              </p>
              
              <p style="color: #a0aec0; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                ${params.isNewUser 
                  ? 'Tu cuenta NUXA ha sido creada automáticamente y tu compra ha sido activada. Hemos preparado todo para que puedas empezar a cuidar tu bienestar emocional.'
                  : 'Tu compra ha sido procesada exitosamente. Tu servicio ya está activo y listo para usar.'
                }
              </p>
              
              <div style="background-color: #1e3a5f; border-radius: 12px; padding: 20px; margin: 25px 0;">
                <p style="color: #a0aec0; font-size: 14px; margin: 0 0 5px 0;">Producto:</p>
                <p style="color: white; font-size: 18px; font-weight: bold; margin: 0;">${params.productName}</p>
              </div>
              
              <!-- CTA Button -->
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
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #0f172a; padding: 25px 30px; text-align: center;">
              <p style="color: #64748b; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} NUXA by Empordajobs SL. Todos los derechos reservados.
              </p>
              <p style="color: #475569; font-size: 11px; margin: 10px 0 0 0;">
                Sin permanencia. Cancela cuando quieras.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

    const textContent = `
¡${params.isNewUser ? 'Bienvenido' : 'Gracias por tu compra'}, ${params.customerName}!

${params.isNewUser 
  ? 'Tu cuenta NUXA ha sido creada automáticamente y tu compra ha sido activada.'
  : 'Tu compra ha sido procesada exitosamente.'
}

Producto: ${params.productName}

Accede a NUXA con este enlace:
${params.magicLink}

Este enlace es válido por 7 días y solo puede usarse una vez.

---
NUXA by Empordajobs SL
Sin permanencia. Cancela cuando quieras.
`;

    const msg = {
      to: params.to,
      from: {
        email: fromEmail,
        name: 'NUXA'
      },
      subject,
      text: textContent,
      html: htmlContent,
    };

    await client.send(msg);
    console.log(`✅ Magic link email sent to: ${params.to}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending magic link email:', error);
    return false;
  }
}
