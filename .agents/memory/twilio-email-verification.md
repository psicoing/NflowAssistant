---
name: Twilio Email verification
description: Managed-domain email testing, restricted API permissions, and delivery confirmation.
---

Twilio Email is distinct from the existing SendGrid connection. Test it with its own restricted API key, without replacing voice/SMS credentials or silently switching application email providers.

**Why:** The existing SendGrid connection rejected authentication, while a separate Twilio Email test successfully delivered a transactional email.

**How to apply:** The console exposes the necessary permissions under Comms: `emails` Create and `emails.operations` Read. These were sufficient for a real send and operation-status lookup. Authenticate the sending domain first. Keep the credentials in secrets and never include them in logs or screenshots.

The user approved replacing SendGrid with Twilio Email only for AI credit/budget alerts. Other application emails remain outside that approval.

**Why:** The user agreed to the explicitly scoped offer after personally confirming receipt of the test email.

**How to apply:** Preserve incident deduplication and the configured owner recipient. Do not migrate verification, campaign or other transactional emails without a new request.

El usuario eligió «Conservar Twilio Email y añadir SendGrid» al preparar el plan de pago de SendGrid.

**Why:** Quiere incorporar SendGrid sin sustituir el servicio actual de Twilio Email.

**How to apply:** Conservar las credenciales y autenticación de Twilio Email. Para autenticar el mismo dominio en la nueva cuenta, generar selectores DKIM diferentes en SendGrid; no sobrescribir los selectores existentes ni duplicar DMARC.

Para NUXA, el usuario aprobó enviar desde su dominio autenticado y recibir las respuestas en su Gmail mediante Reply-To; no usar Gmail como identidad From de SendGrid.

**Why:** Aceptó esta separación después de aclarar que autenticar un dominio para envío no crea un buzón de entrada y que enviar como Gmail desde SendGrid puede fallar DMARC.

**How to apply:** Aplicar la identidad de NUXA a sus envíos por SendGrid, incluidos códigos y mensajes comerciales de NUXA. Conservar los otros flujos de Resend, Twilio Email y otras marcas; no confundir Reply-To con un buzón o reenvío para mensajes nuevos dirigidos al dominio.

Sending is asynchronous: HTTP 202 confirms acceptance, not delivery. The operation may initially report PROCESSING with zero totals, then show delivered emails while its status still says PROCESSING.

**Why:** This behavior occurred during the successful real test; relying on status alone would have missed delivery confirmation.

**How to apply:** Consult the operation statistics, distinguish delivered from inbox placement/read confirmation, and never resend automatically merely because processing or delivery is uncertain.

Preparar los webhooks nuevos desactivados y activarlos solo después de publicar
y comprobar el receptor firmado con su clave correcta.

**Why:** La versión publicada podía devolver HTTP 200 con una página HTML para
la ruta todavía inexistente. Un proveedor puede interpretar ese 200 como
recepción correcta y dejar de reintentar, aunque no se almacene ningún evento.

**How to apply:** No aceptar un simple 200 como prueba del circuito. Comprobar
el tipo y contenido de la respuesta, el rechazo JSON de firmas inválidas y la
existencia de las tablas en la producción recién publicada antes de activar el
proveedor; después confirmar un evento auténtico persistido. Coordinar claves,
esquema y publicación sin habilitar un receptor o almacenamiento no preparado.
