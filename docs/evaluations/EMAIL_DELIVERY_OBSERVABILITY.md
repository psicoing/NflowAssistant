# Campañas: corrección de observabilidad preparada en desarrollo

## Estado y límites

- No se ha publicado esta corrección ni activado/modificado el webhook de ningún proveedor.
- No se han aplicado tablas nuevas a la base externa de la aplicación.
- Se comprobó por huella de base y conteo que el servidor de desarrollo está usando la misma base externa que la réplica de producción. La base gestionada de desarrollo es distinta.
- Las pruebas de escritura se ejecutaron exclusivamente en un esquema temporal de esa base de desarrollo separada, eliminado al terminar.
- La prueba real autorizada fue un solo correo al administrador, nunca a empresas u otros contactos. El recibo se guarda en `mail-audit-owner-test.json`; impide repetir el envío automáticamente ante un resultado incierto.
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

1. Obtener autorización expresa para modificar el esquema externo de producción. No asumir que Publish modifica esta base ni usar la base gestionada como sustituto.
2. Verificar nuevamente el destino y aplicar el SQL exportado por `server/campaign-email-schema.ts` mediante el procedimiento autorizado para esa base. No hay migración automática al arrancar. Hacer copia de seguridad según la política del operador.
3. Configurar `SENDGRID_EVENT_PUBLIC_KEY` con la clave pública del webhook firmado correcto, y `RESEND_WEBHOOK_SECRET` por Secrets para la conexión Resend correcta. Nunca usar la API key de envío como clave del webhook.
4. Revisar publicación y configuración de los proveedores como un cambio coordinado autorizado: el endpoint antiguo de Resend dejará de aceptar eventos sin firma. Un envío comercial nuevo se rechaza antes de enviar si no está disponible el registro persistente.
5. En SendGrid, activar el webhook firmado hacia `/api/webhooks/sendgrid`, con entrega, apertura, clic, rebote, bloqueo/descarte, diferido, baja y queja. En Resend, configurar `/api/webhooks/resend` y su firma/eventos. No se ha realizado ninguno de estos cambios externos.
6. Hacer una nueva prueba autorizada solo al administrador para comprobar el circuito completo proveedor → webhook → base → panel, sin campañas comerciales.

Las URLs finales deben obtenerse de la publicación real al preparar la activación, no de un dominio de desarrollo.

## Pendientes fuera de esta primera corrección

- Establecer con el administrador una política de frecuencia y exclusión entre campañas diferentes: la reserva única evita duplicar un destinatario dentro de la misma campaña, no impide por sí sola todo solapamiento entre campañas.
- Revisar la base de legitimación de los contactos. Autorizar llamadas no equivale a consentir correos; no se ha inventado ni rellenado consentimiento.
- Migrar los enlaces de baja antiguos basados en identificadores a tokens firmados sin dejar sin baja a los destinatarios históricos.
- Recuperar los motivos de fallos anteriores solo donde el proveedor aún conserve evidencias. No es posible reconstruirlos a partir de un contador.
- Medir aperturas con cautela: bloqueo de imágenes y protecciones de privacidad impiden interpretarlas como lectura humana exacta.
