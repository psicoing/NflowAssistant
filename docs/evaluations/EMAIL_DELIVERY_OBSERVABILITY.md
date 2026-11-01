# Campañas: observabilidad y activación coordinada

## Resultado tras republicar — 2026-11-01

- Ambas tablas existen en producción; no se aplicó DDL manual a producción en esta comprobación.
- Ambas rutas publicadas rechazan peticiones sin firma con JSON/401.
- Se activó SendGrid después de comprobar receptor y almacenamiento.
- Se envió **un único correo al administrador**, con identidad NUXA y Reply-To a su Gmail. Ningún envío a empresas u otros destinatarios.
- SendGrid aceptó el envío a las 17:43:57 UTC. El evento auténtico de entrega llegó al receptor firmado a las 17:44:06 UTC y quedó almacenado y vinculado a la campaña interna 37.
- Se ejecutó en modo de solo lectura la misma función de resumen utilizada por el panel: inicialmente 1 aceptado, 1 entregado, 0 rechazados, 0 pendientes y 0 aperturas únicas. Después llegó un evento auténtico de apertura a las 17:46:18 UTC (apertura informada a las 17:46:09 UTC), quedó persistido y el contador de la campaña pasó a 1. El administrador confirmó además recepción en Recibidos. No se inventaron aperturas.
- Recibo verificable: `mail-published-owner-test.json`. No repetir el envío; el script conserva el bloqueo de repetición.
- El circuito de entrega y apertura **SendGrid → webhook firmado publicado → base → contador del panel** está confirmado para esta prueba nueva. La prueba equivalente de Resend sigue pendiente. Esto no reconstruye aperturas históricas ni convierte el seguimiento por imágenes en una medida exacta de lectura humana.
- No se cambió código de aplicación ni se requiere otra publicación por esta comprobación.

## Antecedentes y límites

- La versión con receptores firmados ya está publicada: ambas rutas rechazan peticiones sin firma con JSON/401.
- **Bloqueo anterior, ya resuelto:** faltaban las dos tablas de observabilidad en producción. La preparación anterior las había añadido solamente en producción, no en el esquema de desarrollo utilizado por Publish. En ese intento la prueba se detuvo antes de crear una campaña, reservar un envío o enviar correo.
- Se corrigió la preparación incorporando ambas tablas a la base gestionada de desarrollo. También se alinearon únicamente las definiciones faltantes de funciones existentes (prueba gratuita, procedencia del historial, supresiones y CRM), sin copiar filas de producción ni modificar sus registros.
- La comparación previa a esta última publicación contenía solo la creación de las dos tablas de observabilidad, su clave foránea e índices; no contenía tablas/columnas a eliminar, truncamientos, advertencias ni cambios incompatibles.
- Se ha confirmado que Publish administra el esquema de esta producción, aunque la aplicación lo alcance a través de una variable de conexión con nombre de proveedor. No tratarla como una base externa ajena a la migración de Replit.
- El recibo `mail-schema-activation.json` documenta una actuación anterior, no la disponibilidad actual tras publicar. Se retiró el script de migración manual a producción para evitar repetir ese procedimiento incorrecto.
- El servidor de desarrollo sigue apuntando a producción; la base gestionada de desarrollo es distinta. No usar el servidor como entorno de fixtures con escrituras.
- Las pruebas de escritura se ejecutaron exclusivamente en un esquema temporal de esa base de desarrollo separada, eliminado al terminar.
- La prueba real anterior fue un solo correo al administrador, nunca a empresas u otros contactos. Su recibo se guarda en `mail-audit-owner-test.json`; no comprobó entonces la recepción del webhook. La prueba nueva y su resultado se documentan arriba.
- SendGrid tiene un webhook firmado hacia `https://nuxa.life/api/webhooks/sendgrid`; la clave pública está configurada como `SENDGRID_EVENT_PUBLIC_KEY`. Se pausó durante el bloqueo anterior y ahora está **activado**, con una entrega auténtica ya persistida.
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

## Activación y pendientes

1. **Corregido:** esta producción participa en la sincronización de esquema de Replit. No volver a aplicar DDL manual a producción ni añadirlo al arranque/build.
2. **Completado:** el administrador volvió a publicar; se verificó que ambas tablas existen ahora en producción.
3. **Configuradas:** `SENDGRID_EVENT_PUBLIC_KEY` y `RESEND_WEBHOOK_SECRET`. La clave de Resend pasó las comprobaciones locales; falta confirmar la correspondencia mediante un evento auténtico después de publicar. Nunca usar la API key de envío como clave del webhook ni sustituirla innecesariamente.
4. **Completado:** comprobados firmas y almacenamiento antes de activar. Un envío comercial nuevo se rechaza antes de enviar si no está disponible el registro persistente.
5. **Completado en SendGrid.** En Resend queda revisar su configuración y confirmar un evento auténtico; no crear duplicados a ciegas porque la API actual no permite consultar sus webhooks.
6. **Ejecutado una sola vez:** `scripts/test-published-owner-email.ts`, con confirmación explícita de destinatario único y destino. Se creó una campaña interna claramente etiquetada, únicamente para el administrador, sin invocar la selección masiva ni enviar copias. No volver a enviarla.
7. **Entrega y apertura confirmadas de extremo a extremo**, con eventos auténticos persistidos y contador actualizado. No se generaron aperturas ficticias.

Las URLs finales deben obtenerse de la publicación real al preparar la activación, no de un dominio de desarrollo.

## Pendientes fuera de esta primera corrección

- Establecer con el administrador una política de frecuencia y exclusión entre campañas diferentes: la reserva única evita duplicar un destinatario dentro de la misma campaña, no impide por sí sola todo solapamiento entre campañas.
- Revisar la base de legitimación de los contactos. Autorizar llamadas no equivale a consentir correos; no se ha inventado ni rellenado consentimiento.
- Migrar los enlaces de baja antiguos basados en identificadores a tokens firmados sin dejar sin baja a los destinatarios históricos.
- Recuperar los motivos de fallos anteriores solo donde el proveedor aún conserve evidencias. No es posible reconstruirlos a partir de un contador.
- Medir aperturas con cautela: bloqueo de imágenes y protecciones de privacidad impiden interpretarlas como lectura humana exacta.
