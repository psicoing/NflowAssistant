---
name: Base de datos de las pruebas
description: Evitar que las comprobaciones SQL de pruebas usen una fuente distinta de la aplicación.
---

Las herramientas SQL integradas no deben asumirse conectadas a la misma base que usa NUXA. Confirmar la fuente con un registro sintético visible desde la API real antes de preparar o modificar datos de pruebas.

**Why:** Una cuenta sintética creada con el cliente de datos de la app podía iniciar sesión y consultar su cuota real, pero la herramienta SQL no encontraba esa cuenta ni las nuevas tablas. No era un fallo de persistencia.

**How to apply:** Crear y limpiar fixtures mediante el cliente de datos configurado de la app, o verificar expresamente la conexión de la herramienta antes de usarla. No migrar ni sustituir la base para resolver esta discrepancia.

No diagnosticar un fallo de historial únicamente porque el tester vea una fila
SQL que la API no devuelve: comprobar primero una escritura y lectura con el
almacenamiento real de la app y la API autenticada, o crear el mensaje mediante
la propia API sin invocar IA.

**Why:** Una prueba visual volvió a informar de discrepancia de historial y de
una columna ausente que el arranque ya creaba. Una comprobación independiente
con el almacenamiento real y la API recuperó correctamente el mensaje y su
etiqueta, sin modificar el código de lectura.

**How to apply:** Si la comprobación independiente coincide, revisar la fuente
o preparación del fixture antes de cambiar consultas que funcionan.

Los contadores aproximados de filas en una réplica de producción pueden estar
a cero aunque existan registros. No interpretarlos como prueba de base vacía.

**Why:** Durante una auditoría de costes, las estadísticas de tablas de la
réplica mostraban ceros mientras las consultas agregadas confirmaban datos.

**How to apply:** Separar estimaciones de estadísticas, conteos SQL y métricas
de facturación; un snapshot SQL no permite reconstruir horas facturadas.
