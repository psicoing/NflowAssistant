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
