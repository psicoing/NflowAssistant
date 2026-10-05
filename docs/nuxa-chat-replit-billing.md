# Chat escrito: OpenAI principal y Replit de respaldo

## Decisión y estado

### Decisión vigente: sistema dual

El usuario plantea OpenAI como principal cuando tenga saldo de API, con Replit
como respaldo cuando no tenga saldo, siempre con control de tokens.
El usuario aclaró que los «20 euros» eran una referencia al volumen de tokens,
no una afirmación de saldo o presupuesto de OpenAI. Eligió **OpenAI aparte y
Replit hasta 20 USD adicionales al mes**: el límite es exclusivo del respaldo,
no compartido. Después autorizó **25 USD mensuales para OpenAI**. El máximo
local conjunto es **45 USD al mes para todo el chat**, no por usuario,
excluyendo voz y otras funciones.

La facturación de la API y ChatGPT es independiente:
https://help.openai.com/en/articles/9039756-billing-settings-in-chatgpt-vs-platform

El código usa OpenAI primero y Replit únicamente si se agota la asignación
autorizada de OpenAI o su API rechaza inequívocamente la facturación.
No llama a ambos simultáneamente ni usa respaldo por cualquier HTTP 429,
timeout, 401 o 500. Rechazos directos reconocidos: HTTP 402/429 con
`insufficient_quota`, `billing_not_active` o `billing_hard_limit_reached`.
No inferir el saldo real del usuario a partir de esos errores.

### Estado de activación

La voz y las demás llamadas directas a OpenAI quedan fuera de este cambio.
OpenAI utiliza la clave API existente exclusivamente en el servidor; no se
modifica ni se muestra. Tener una clave configurada no acredita saldo ni
facturación de generación activa.

El modo por defecto es `dual`, con OpenAI como principal.
**La activación del servicio todavía está pendiente:** en esta sesión no existen
las credenciales gestionadas ni se ofrece una conexión OpenAI en el inventario
de integraciones accesible al agente. Preparar código no activa facturación.

No se declara que el chat esté operativo o que se haya comprobado el cobro.
No se elimina, muestra o reemplaza la clave personal que otras funciones usan.

## Conexión esperada

Replit debe proporcionar oficialmente:

- `AI_INTEGRATIONS_OPENAI_BASE_URL`
- `AI_INTEGRATIONS_OPENAI_API_KEY`

No inventar el endpoint, copiar una clave personal en la variable gestionada
ni crear esas credenciales a mano para aparentar facturación de Replit.
La documentación oficial describe aprobación de AI Integrations en el editor:
https://docs.replit.com/features/integrations/replit-ai-integrations

Sin ambas variables, el respaldo falla de forma controlada. No vuelve a
OpenAI ni genera un bucle de intentos. El cliente se construye por petición,
no durante el arranque. La página y la orientación urgente estática siguen
disponibles cuando ambos proveedores están bloqueados.

`NUXA_CHAT_AI_PROVIDER=dual` selecciona el orden aprobado. Los modos explícitos
`openai` y `replit` seleccionan solo ese pagador, sin respaldo automático.
En todos los modos siguen aplicándose los topes independientes de 25/20 USD.
No se solicitan reintentos automáticos del SDK.

## Modelo y funciones conservadas

Se conserva `OPENAI_CHAT_MODEL` y el mismo valor por defecto anterior.
No se sustituye el modelo automáticamente si el gateway no lo admite.
Su compatibilidad debe comprobarse después de activar la conexión.

Se mantienen motor científico, formatos, perfil, citas, historial, seguridad
y los límites de tokens. No se modifica registro, pagos, voz o Twilio.

## Verificación

### Presupuestos independientes implementados

La decisión vigente es **25 USD mensuales de OpenAI y hasta 20 USD adicionales
para el respaldo Replit**, globales para todos los usuarios del chat.
No incluye Agent, alojamiento, suscripción o voz.

Dos registros duraderos e independientes por mes natural UTC. Las tablas
anteriores se conservan íntegramente como registro de Replit, incluidos saldos
reservados e incertidumbre. Las nuevas tablas `chat_ai_openai_budget_months`
y `chat_ai_openai_budget_requests` registran OpenAI sin reiniciar Replit.
Todos los registros están también declarados en el esquema Drizzle.
No se traslada saldo sobrante entre proveedores ni entre meses.

La aplicación aplica el control antes de cualquier petición del chat:

- Reserva duradera y transaccional en la misma base de datos existente.
- Cuenta entrada y generación, incluidos tokens de razonamiento en salida.
- Resuelve peticiones simultáneas con bloqueo de fila; no reinicia gasto al
  reiniciar el servidor o publicar otra instancia contra la misma base.
- Usa el máximo de generación y una cota conservadora de entrada, no una
  falsa estimación exacta por caracteres. No permite más de 64K en esa cota.
- Solicita procesamiento estándar y desactiva reintentos automáticos del SDK.
- Bloquea si el saldo disponible no cubre el peor coste reservado, aunque
  todavía exista un pequeño saldo. Mensajes demasiado grandes se rechazan,
  no se recortan silenciosamente.
- Conserva toda la reserva si faltan datos de uso o falla la petición: un
  timeout puede haber sido cobrado. El registro no contiene conversaciones
  ni identificadores de pacientes.
- Solo libera una reserva de OpenAI si hubo un rechazo inequívoco de
  facturación antes de generación, con actualización idempotente y atómica.
  No libera una reserva por timeout, error genérico, caducidad o reinicio.
- Verifica el modelo devuelto antes de calcular su coste. Un modelo sin tarifa
  verificada o una discrepancia de contabilidad detienen ambos proveedores
  para revisión, sin cambiar el modelo ni continuar por el respaldo.
  El cambio de mes no resuelve automáticamente un fallo de contabilidad.
- Conserva ayuda urgente estática y mensajes ES/EN/FR/DE/IT/PT/CA/EU/GL.
- No descuenta preguntas de suscripción o créditos prepagados cuando devuelve
  un aviso estático por bloqueo, fallo del proveedor o contexto excesivo.

Tarifas GPT-5.5 verificadas el 2026-10-05 en
https://developers.openai.com/api/docs/models/gpt-5.5 :
5 USD/millón de entrada y 30 USD/millón de salida. La reserva cubre también
la tarifa Priority de 2,5x y el suplemento regional del 10%. El cálculo
contable conserva un margen regional y no presupone descuento de caché;
por eso puede bloquear antes del gasto real de 25/20 USD. Una tarifa/modelo no
verificado no permite llamadas ni cambia el modelo automáticamente.
Revisar tarifas oficiales al activar la conexión y cuando cambien las tarifas.

**No se ha configurado un límite financiero nativo de la cuenta Replit ni
verificado una factura real.** El control es local al chat, calculado de forma
conservadora con tarifas públicas. Activación del gateway y comprobación real
de consumo siguen pendientes; no presentar el límite local como una garantía
de que las facturas totales de OpenAI y Replit sean de 25 y 20 USD.

El contexto normal de la misma consulta sintética sin historial pasó de
27.604 a 9.663 caracteres, aproximadamente un 65% menos. No es una medida
exacta de tokens ni un ahorro real facturado. Las reglas comunes, perfil,
análisis científico y fuentes seleccionadas permanecen. Los ejemplos y
plantillas originales no se borran, pero ya no se reenvía toda su estructura
repetida en cada llamada. El historial se conserva en la base de datos; solo
se acota la parte enviada al modelo.

### Condición de coste antes de activar el servicio

El usuario exige controlar tokens para evitar un gasto excesivo. Acordar un
presupuesto explícito para el chat y verificar límites y contabilización antes
de activar generación real a través de Replit.

No basta limitar mensajes o salida: la entrada incluye instrucciones, historial
y evidencia. El límite de caracteres del clasificador no recorta necesariamente
el mensaje enviado al modelo. Se necesita medir los tokens de la petición real
y contabilizar el uso devuelto por el proveedor, no equiparar caracteres a tokens.
La caché de recuperación ahorra trabajo local, pero no garantiza que el modelo
deje de procesar o cobrar ese contexto.

Los límites de salida por sí solos no constituyen un tope mensual de gasto.
No declarar ahorros facturados hasta medirlos con el proveedor.
No recortar reglas de seguridad para ahorrar tokens ni retirar
la bibliografía pertinente sin evaluar su utilidad.

```sh
# Solo configuración; no envía peticiones ni muestra claves:
npx tsx scripts/check-chat-ai.ts
# Pruebas con SDK simulado y credenciales ficticias locales al proceso:
npx tsx scripts/test-chat-ai-provider.ts
npx tsx scripts/test-chat-budget.ts
npx tsx scripts/test-chat-dual.ts
npx tsx scripts/check-chat-budget.ts
npx tsx scripts/test-chat-policy.ts
npx tsx scripts/test-chat-evidence.ts
npx tsx scripts/test-scientific-engine.ts
npm run build
npm run check
```

Un estado `configured: true` no prueba facturación ni disponibilidad del modelo.
Tras aprovisionar la integración, reiniciar el servidor y realizar una sola
prueba de generación autorizada antes de ampliar a cinco casos.
Comprobar el consumo en Replit: no es uso ilimitado por tener suscripción.
Verificar también la disponibilidad del servicio en publicación antes de
publicar este cambio. No publicar un chat pendiente de conexión.
