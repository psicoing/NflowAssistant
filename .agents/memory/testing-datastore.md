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

En esta instalación, el servidor de desarrollo se ha encontrado conectado a
la base de producción mientras la base gestionada de desarrollo era distinta.
No asumir que ejecutar un script desde el workspace lo aísla, ni que una
variable de conexión con nombre de proveedor identifica una base ajena a Replit.

**Why:** La comprobación de identidad y conteos coincidió con la réplica de
producción, no con desarrollo. Además, Publish administra su esquema: las tablas
añadidas solo en producción desaparecieron al republicar porque faltaban en
desarrollo. También se detectaron eliminaciones pendientes de otras estructuras
creadas en el arranque.

**How to apply:** Antes de fixtures, migraciones o pruebas con escrituras,
contrastar ambos destinos sin revelar credenciales. Usar una base de desarrollo
verificada y un esquema temporal exclusivo. Para el esquema gestionado, aplicar
las definiciones a desarrollo y revisar la comparación antes de Publish; debe
ser aditiva y no eliminar estructuras de otras funciones. No usar scripts,
arranque ni hooks para migrar producción manualmente.

No confiar en el cierre de un proceso de pruebas como prueba de eliminación
de sus fixtures.

**Why:** Al detener servidores temporales, el proceso terminó antes de
completar la limpieza asíncrona, tanto con un lanzador como con Node directo.

**How to apply:** Comprobar después los esquemas temporales en desarrollo.
Eliminar solo el esquema exacto creado por la prueba correspondiente, nunca
una base completa ni esquemas ajenos; confirmar que no queden fixtures.

Los reinicios de vista previa deben cargar el código actualizado sin ejecutar
siembras, restablecer administradores ni modificar esquemas automáticamente.
Esto no convierte la vista previa en un entorno de datos aislado.

**Why:** La interfaz se actualizó en caliente mientras el servidor conservaba
un contrato antiguo, dejando sin empresas ni recuento el preparador de campañas.
Reiniciar sin precauciones habría ejecutado automatismos sobre los datos reales.

**How to apply:** Ante una discrepancia entre interfaz y API, comprobar la
versión del servidor y el código público publicado antes de tocar filtros o
contadores. Revisar los efectos de arranque antes de reiniciar y no sustituir
una política de elegibilidad desconocida por permisos inventados en el cliente.
