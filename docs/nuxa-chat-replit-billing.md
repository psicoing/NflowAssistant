# Cobro del chat escrito mediante Replit

## Decisión y estado

El usuario eligió usar créditos de Replit para el chat escrito de NUXA.
La voz y las demás llamadas directas a OpenAI quedan fuera de esta migración.

El código del chat ahora selecciona la conexión gestionada de Replit por defecto.
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

Sin ambas variables, el chat falla de forma controlada y **no** pasa a la cuenta
personal de OpenAI. El constructor se ejecuta por petición, no durante el arranque.
La página y la orientación urgente estática siguen disponibles.

`NUXA_CHAT_AI_PROVIDER=openai` habilitaría explícitamente el proveedor directo.
No hacerlo como recuperación automática ni sin nueva autorización del usuario.
El valor por defecto es `replit`.

## Modelo y funciones conservadas

Se conserva `OPENAI_CHAT_MODEL` y el mismo valor por defecto anterior.
No se sustituye el modelo automáticamente si el gateway no lo admite.
Su compatibilidad debe comprobarse después de activar la conexión.

Se mantienen motor científico, formatos, perfil, citas, historial, seguridad
y los límites de tokens. No se modifica registro, pagos, voz o Twilio.

## Verificación

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

Los límites de salida actuales no constituyen un tope mensual de gasto. No
declarar presupuestos aplicados ni ahorros obtenidos hasta que estén implementados
y comprobados. No recortar reglas de seguridad para ahorrar tokens ni retirar
la bibliografía pertinente sin evaluar su utilidad.

```sh
# Solo configuración; no envía peticiones ni muestra claves:
npx tsx scripts/check-chat-ai.ts
# Pruebas con SDK simulado y credenciales ficticias locales al proceso:
npx tsx scripts/test-chat-ai-provider.ts
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
