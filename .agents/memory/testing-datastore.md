---
name: Base de datos de las pruebas
description: Evitar que las comprobaciones SQL de pruebas usen una fuente distinta de la aplicación.
---

Las herramientas SQL integradas no deben asumirse conectadas a la misma base que usa NUXA. Confirmar la fuente con un registro sintético visible desde la API real antes de preparar o modificar datos de pruebas.

**Why:** Una cuenta sintética creada con el cliente de datos de la app podía iniciar sesión y consultar su cuota real, pero la herramienta SQL no encontraba esa cuenta ni las nuevas tablas. No era un fallo de persistencia.

**How to apply:** Crear y limpiar fixtures mediante el cliente de datos configurado de la app, o verificar expresamente la conexión de la herramienta antes de usarla. No migrar ni sustituir la base para resolver esta discrepancia.
