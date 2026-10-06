---
name: OpenAI authentication versus generation billing
description: A successful model metadata request does not establish that chat generation billing is active.
---

La consulta de metadatos de un modelo en OpenAI puede funcionar aunque las
completions devuelvan `429 billing_not_active`. Separar autenticación,
disponibilidad del modelo y permiso/facturación de generación.

**Why:** Se observó esta diferencia al comprobar la conexión real de NUXA;
una consulta de metadatos satisfactoria no confirmó acceso a respuestas.

**How to apply:** Ante este error, detener las pruebas de pago. No cambiar
modelo ni sustituir una clave que autentica solo para eludir el bloqueo.
Confirmar la cuenta/proyecto y la activación de facturación de la API antes
de repetir generación. No inferir el saldo real del usuario a partir del error.

Replit requiere el alias `gpt-5.5` para la petición comprobada, aunque devuelve `gpt-5.5-2026-04-23` como modelo de la respuesta. Puede rechazar ese identificador fechado como entrada. Su endpoint gestionado también puede rechazar la consulta estándar de listado de modelos.

**Why:** Una prueba gestionada devolvió `UNSUPPORTED_MODEL` para el identificador fechado de GPT-5.5; el alias sin fecha produjo una respuesta real con uso de tokens. La consulta de listado devolvió HTTP 405. Ninguno de los dos errores demuestra falta de saldo.

**How to apply:** Distinguir el alias publicado del identificador exacto configurado. No cambiar silenciosamente de modelo ni probar varios modelos de pago. Comprobar compatibilidad y presupuesto antes de otra generación; una reserva conservadora pendiente no equivale a un cargo confirmado.
