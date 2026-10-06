# Preparación para publicar NUXA

## Comprobado

- Autoscale, puerto externo 80 → interno 5000, servidor en `0.0.0.0`.
- Compilación: `npm run build`, incluida comprobación TypeScript.
- Arranque: `npm run start`; `PORT` se respeta.
- `/health`, `/healthz`, `/api/health` y `/` responden durante el arranque.
- Sesiones de producción en PostgreSQL con `SESSION_SECRET`, cookies Secure/HttpOnly y continuidad entre instancias.
- Prueba gratuita: correo y móvil verificados, cinco preguntas por móvil sin renovación mensual.
- Presupuestos independientes: OpenAI 25 USD, respaldo Replit 20 USD y SMS de verificación 5 USD mensuales. Controles internos, no límites de las facturas totales.
- SMS real entregado y confirmado por el destinatario.

## Antes de publicar

1. Mantener los secretos de producción existentes. No introducir claves en el código ni rotar las claves de identidad antifraude para una publicación.
2. Resolver la conexión pendiente del respaldo Replit y confirmar generación/facturación del chat antes de darlo por operativo. La presencia de `OPENAI_API_KEY` no prueba facturación activa.
3. Las tablas propias se crean de forma aditiva. No ejecutar un `db:push` amplio contra los datos existentes ni sustituir la base configurada.
4. Publicar desde la herramienta de publicación de Replit, conservando el destino actual.

Al pasar del antiguo almacenamiento de sesiones en memoria al nuevo, los usuarios deberán iniciar sesión de nuevo. No se borran cuentas, conversaciones ni el historial de prueba.

## Después de publicar

- Revisar `/health` y los logs de publicación.
- Comprobar un registro real en el dominio público: entrega del correo, códigos, móvil y acceso al chat. La entrega real del correo aún no ha sido comprobada.
- No borrar identidades antifraude de personas reales para repetir pruebas.

## Comprobaciones locales

```sh
npm run build
npx tsx scripts/test-trial-verification.ts
npx tsx scripts/test-production-startup.ts
```

Las pruebas automáticas usan identidades sintéticas y no generan SMS, correos, respuestas de IA ni pagos. La prueba de arranque usa y limpia exclusivamente su cuenta sintética en la base configurada de la app.
