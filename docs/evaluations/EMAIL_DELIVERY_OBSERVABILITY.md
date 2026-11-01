# Campañas: corrección de observabilidad preparada en desarrollo

## Estado y límites

- No se ha publicado esta corrección ni activado/modificado el webhook de ningún proveedor.
- Tras la autorización posterior del administrador, se aplicaron únicamente las tablas nuevas de observabilidad a la base externa. Los conteos de usuarios, conversaciones, mensajes, contactos y campañas se conservaron. Recibo: `mail-schema-activation.json`.
- Se comprobó por huella de base y conteo que el servidor de desarrollo está usando la misma base externa que la réplica de producción. La base gestionada de desarrollo es distinta.
- Las pruebas de escritura se ejecutaron exclusivamente en un esquema temporal de esa base de desarrollo separada, eliminado al terminar.
- La prueba real autorizada fue un solo correo al administrador, nunca a empresas u otros contactos. El recibo se guarda en `mail-audit-owner-test.json`; impide repetir el envío automáticamente ante un resultado incierto.
- SendGrid tiene un webhook nuevo preparado y firmado, todavía **desactivado**, hacia `https://nuxa.life/api/webhooks/sendgrid`; la clave pública quedó configurada como `SENDGRID_EVENT_PUBLIC_KEY`. No se activará hasta publicar y comprobar la ruta nueva.
- La consulta de webhooks de Resend devolvió `restricted_api_key`: la clave existente solo permite enviar. No prueba que no existan webhooks ni que haya que pagar. El administrador guardó posteriormente `RESEND_WEBHOOK_SECRET` mediante el formulario seguro, sin sustituir la API key de envío.
- La clave de Resend tiene el formato esperado y pasó una comprobación local de firma sin mostrar su valor, enviar correos ni persistir eventos. La ruta de desarrollo devuelve JSON/401 ante una petición sin firma. Esto no prueba todavía que la clave corresponda al webhook remoto ni valida el circuito real.
- La ruta nueva en desarrollo rechaza una firma inválida con JSON/401. La publicación todavía devuelve HTML/200 para esa ruta: ese 200 **no** valida un webhook y no autoriza activarlo.
- No se han cambiado rutas de Twilio Email, avisos de IA, SMS, voz, pagos ni modelos.
- No se han migrado JOBDA/EMPORDAJOBS a otro proveedor.

## Correcciones

1. Registro por destinatario/campaña: reserva única antes del envío; proveedor, identificador, aceptación o rechazo, código y motivo seguro. Una aceptación incierta no se reintenta automáticamente.
2. Estados de proceso: en cola, procesando, procesada, parcial, fallida, bloqueada y error de registro. Procesada no equivale a entregada.
3. Verificación de webhooks con los bytes originales: ECDSA SHA-256 para SendGrid y HMAC/Svix para Resend. Falla de forma cerrada si falta la configuración. Firma inválida: 401; payload inválido: 400; fallo de persistencia: 503 para permitir reintentos.
4. Eventos persistentes y deduplicados por proveedor e identificador de evento. Se vinculan por proveedor, identificador de mensaje y destinatario, nunca por la etiqueta de campaña enviada en el payload.
5. Carreras: un evento que llega antes de la respuesta del envío se reconcilia cuando se registra la aceptación.
6. Aperturas únicas por destinatario, no suma de cada notificación. Se conservan eventos de entrega, apertura, clic, rebote, bloqueo, descarte, diferido, baja y queja.
7. Las bajas/quejas autenticadas de mensajes vinculados alimentan la baja y supresión por correo. No se suprime un dominio completo a partir de un rebote.
8. Los mensajes antiguos de Resend se vinculan por identificador ya almacenado y destinatario; no necesitan confiar en etiquetas. No se inventan entregas antiguas.
9. La copia al administrador no lleva la categoría de campaña y no contamina sus métricas.
10. Panel compartido NUXA/JOBDA/EMPORDAJOBS: aceptados, rechazos, entregas confirmadas, aperturas únicas, resultados adversos y motivos agrupados. Los históricos sin evidencia aparecen como no verificados.

## Verificación realizada

- `npm run check`
- `npx tsx scripts/test-campaign-email-events.ts`: firmas válidas e inválidas, modificación del cuerpo, caducidad, etiquetas falsas, claves ausentes, peticiones HTTP reales a ambas rutas y fallo de almacenamiento.
- `npx tsx scripts/test-campaign-email-store.ts`: PostgreSQL real en esquema aislado; migración repetible; reservas simultáneas; duplicados; resultados inciertos; destinatario incorrecto; eventos anteriores a la aceptación; bajas y supresión; errores; métricas; compatibilidad histórica y rollback atómico.
- `npx tsx scripts/test-nuxa-email-routing.ts`: identidad From/Reply-To, códigos de verificación, rutas de otras marcas sin migración y ausencia de reintento/fallback automático de NUXA.
- Prueba real única con la ruta SendGrid utilizada por NUXA, aperturas activadas solo en ese correo y categoría exclusiva de prueba. HTTP 202 confirma aceptación, no entrega, lectura ni actualización del panel.

## Activación pendiente: no publicar sin estos pasos

1. **Completado:** autorización expresa para modificar el esquema externo. Publish no se considera una migración de esta base ni se sustituye por la base gestionada.
2. **Completado:** destino contrastado y SQL aditivo aplicado en una transacción con límites de espera y comprobación de conteos. No hay migración automática al arrancar ni cambios en tablas existentes.
3. **Configuradas:** `SENDGRID_EVENT_PUBLIC_KEY` y `RESEND_WEBHOOK_SECRET`. La clave de Resend pasó las comprobaciones locales; falta confirmar la correspondencia mediante un evento auténtico después de publicar. Nunca usar la API key de envío como clave del webhook ni sustituirla innecesariamente.
4. Revisar publicación y configuración de los proveedores como un cambio coordinado autorizado: el endpoint antiguo de Resend dejará de aceptar eventos sin firma. Un envío comercial nuevo se rechaza antes de enviar si no está disponible el registro persistente.
5. En SendGrid, **después de publicar y verificar la ruta**, activar el webhook firmado ya preparado con entrega, apertura, clic, rebote, descarte, diferido, baja y queja. En Resend, revisar el webhook `/api/webhooks/resend`, su firma y eventos desde el panel; no crear duplicados a ciegas porque la API actual no permite consultar su configuración.
6. Hacer una nueva prueba autorizada solo al administrador para comprobar el circuito completo proveedor → webhook → base → panel, sin campañas comerciales.

Las URLs finales deben obtenerse de la publicación real al preparar la activación, no de un dominio de desarrollo.

## Pendientes fuera de esta primera corrección

- Establecer con el administrador una política de frecuencia y exclusión entre campañas diferentes: la reserva única evita duplicar un destinatario dentro de la misma campaña, no impide por sí sola todo solapamiento entre campañas.
- Revisar la base de legitimación de los contactos. Autorizar llamadas no equivale a consentir correos; no se ha inventado ni rellenado consentimiento.
- Migrar los enlaces de baja antiguos basados en identificadores a tokens firmados sin dejar sin baja a los destinatarios históricos.
- Recuperar los motivos de fallos anteriores solo donde el proveedor aún conserve evidencias. No es posible reconstruirlos a partir de un contador.
- Medir aperturas con cautela: bloqueo de imágenes y protecciones de privacidad impiden interpretarlas como lectura humana exacta.
