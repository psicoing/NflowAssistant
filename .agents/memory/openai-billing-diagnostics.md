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
