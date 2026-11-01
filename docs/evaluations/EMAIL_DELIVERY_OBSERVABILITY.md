# Campañas: observabilidad y activación coordinada

## Estado y límites

- La versión con receptores firmados ya está publicada: ambas rutas rechazan peticiones sin firma con JSON/401.
- **Bloqueo detectado tras publicar:** faltaban las dos tablas de observabilidad en producción. La preparación anterior las había añadido solamente en producción, no en el esquema de desarrollo utilizado por Publish. La prueba nueva se detuvo antes de crear una campaña, reservar un envío o enviar correo.
- Se corrigió la preparación incorporando ambas tablas a la base gestionada de desarrollo. También se alinearon únicamente las definiciones faltantes de funciones existentes (prueba gratuita, procedencia del historial, supresiones y CRM), sin copiar filas de producción ni modificar sus registros.
- La nueva comparación de publicación contiene solo la creación de las dos tablas de observabilidad, su clave foránea e índices; no contiene tablas/columnas a eliminar, truncamientos, advertencias ni cambios incompatibles.
- Se ha confirmado que Publish administra el esquema de esta producción, aunque la aplicación lo alcance a través de una variable de conexión con nombre de proveedor. No tratarla como una base externa ajena a la migración de Replit.
- El recibo `mail-schema-activation.json` documenta una actuación anterior, no la disponibilidad actual tras publicar. Se retiró el script de migración manual a producción para evitar repetir ese procedimiento incorrecto.
- El servidor de desarrollo sigue apuntando a producción; la base gestionada de desarrollo es distinta. No usar el servidor como entorno de fixtures con escrituras.
- Las pruebas de escritura se ejecutaron exclusivamente en un esquema temporal de esa base de desarrollo separada, eliminado al terminar.
- La prueba real anterior fue un solo correo al administrador, nunca a empresas u otros contactos. Su recibo se guarda en `mail-audit-owner-test.json`. La nueva prueba posterior a la publicación no ha enviado ningún correo porque falló la comprobación previa de las tablas.
- SendGrid tiene un webhook nuevo preparado y firmado hacia `https://nuxa.life/api/webhooks/sendgrid`; la clave pública está configurada como `SENDGRID_EVENT_PUBLIC_KEY`. Se activó brevemente al comprobar las rutas y se volvió a desactivar al detectar la ausencia de tablas. Sigue **desactivado** hasta verificar el almacenamiento después de la próxima publicación.
- La consulta de webhooks de Resend devolvió `restricted_api_key`: la clave existente solo permite enviar. No prueba que no existan webhooks ni que haya que pagar. El administrador guardó posteriormente `RESEND_WEBHOOK_SECRET` mediante el formulario seguro, sin sustituir la API key de envío.
- La clave de Resend tiene el formato esperado y pasó una comprobación local de firma sin mostrar su valor, enviar correos ni persistir eventos. La ruta de desarrollo devuelve JSON/401 ante una petición sin firma. Esto no prueba todavía que la clave corresponda al webhook remoto ni valida el circuito real.
- Las rutas nuevas en desarrollo y producción rechazan una firma inválida con JSON/401. Una versión anterior devolvía HTML/200: ese 200 no validaba un webhook.
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

## Activación pendiente

1. **Corregido:** esta producción participa en la sincronización de esquema de Replit. No volver a aplicar DDL manual a producción ni añadirlo al arranque/build.
2. **Preparado:** las tablas están ahora en desarrollo y la comparación es únicamente aditiva. Hace falta que el administrador vuelva a publicar para que Replit cree las dos tablas de seguimiento en producción.
3. **Configuradas:** `SENDGRID_EVENT_PUBLIC_KEY` y `RESEND_WEBHOOK_SECRET`. La clave de Resend pasó las comprobaciones locales; falta confirmar la correspondencia mediante un evento auténtico después de publicar. Nunca usar la API key de envío como clave del webhook ni sustituirla innecesariamente.
4. Después de publicar, comprobar **tanto las firmas como la existencia de las dos tablas en producción** antes de habilitar el proveedor. Un envío comercial nuevo se rechaza antes de enviar si no está disponible el registro persistente.
5. Solo entonces activar SendGrid. En Resend, revisar el webhook `/api/webhooks/resend`, su firma y eventos desde el panel; no crear duplicados a ciegas porque la API actual no permite consultar su configuración.
6. Ejecutar `scripts/test-published-owner-email.ts` con confirmación explícita de destinatario único y destino. Añadirá una campaña interna claramente etiquetada, únicamente para el administrador, sin invocar la selección masiva ni enviar copias. El recibo impide repetir automáticamente un resultado incierto.
7. Confirmar el circuito proveedor → webhook firmado → base → contador. No declarar validada una apertura hasta observar un evento auténtico; no generar aperturas ficticias.

Las URLs finales deben obtenerse de la publicación real al preparar la activación, no de un dominio de desarrollo.

## Pendientes fuera de esta primera corrección

- Establecer con el administrador una política de frecuencia y exclusión entre campañas diferentes: la reserva única evita duplicar un destinatario dentro de la misma campaña, no impide por sí sola todo solapamiento entre campañas.
- Revisar la base de legitimación de los contactos. Autorizar llamadas no equivale a consentir correos; no se ha inventado ni rellenado consentimiento.
- Migrar los enlaces de baja antiguos basados en identificadores a tokens firmados sin dejar sin baja a los destinatarios históricos.
- Recuperar los motivos de fallos anteriores solo donde el proveedor aún conserve evidencias. No es posible reconstruirlos a partir de un contador.
- Medir aperturas con cautela: bloqueo de imágenes y protecciones de privacidad impiden interpretarlas como lectura humana exacta.
