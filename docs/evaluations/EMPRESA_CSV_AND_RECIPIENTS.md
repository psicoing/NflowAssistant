# Empresas: revisión de CSV y destinatarios

## Alcance autorizado

Corrección y pruebas solo en desarrollo. No se cambian contactos publicados,
proveedores, credenciales ni campañas existentes. No se envían correos.
No se reinicia el servidor principal porque utiliza la base publicada y su
arranque ejecuta otras escrituras. No hay cambios de esquema de aplicación.

## Cambios

- La selección de un CSV sencillo muestra una revisión local antes de guardar.
  Importar y cancelar son acciones distintas. Se muestran filas con email
  válido, sin email y rechazadas, con avisos por línea.
- El formato simple admite tres o cuatro columnas; la cabecera permite
  reconocer su orden. Un archivo de 10/11 columnas no se importa por accidente
  como un archivo sencillo descartando el resto de los datos.
- El formato de lote conserva sus 10/11 campos fijos y permite contactos
  de empresa sin email. La revisión advierte expresamente que no serán
  destinatarios de correo. No se inventan emails ni datos ausentes.
- Un analizador compartido entre revisión y servidor respeta BOM, CRLF,
  comas o punto y coma según formato, delimitadores entre comillas, comillas
  escapadas y celdas multilínea. Los registros mal formados se rechazan sin
  desplazar columnas.
- Las importaciones del servidor mantienen la autorización administrativa,
  normalización del email, deduplicación y combinación de solo campos vacíos
  en el lote. Los errores ya no exponen mensajes internos de la base.
- Listado, selección de campaña y comprobación inmediatamente anterior al
  envío utilizan una misma condición de elegibilidad: email con formato
  válido, ausencia de baja y ausencia de supresión por email, dominio o empresa.
- El contador y la confirmación usan los indicadores calculados por el
  servidor y aplican los mismos filtros de empresa y tamaño. Una cuenta
  importada o activa no equivale a un destinatario elegible.
- Si el servidor anterior no proporciona la elegibilidad, la preparación
  se bloquea con aviso en lugar de adivinar el número de destinatarios.
- Antes de enviar, la interfaz vuelve a leer los contactos; si la lista
  cambió desde la revisión, exige volver a prepararla. Esto no sustituye
  la comprobación de bajas inmediatamente antes de cada intento.
- La aceptación de la preparación no se presenta como entrega confirmada.

Un email con formato válido no acredita que exista el buzón, que se entregue
el mensaje ni que haya permiso comercial. Se mantienen las bajas y las
supresiones existentes.

## Verificación

`npm run check` y `git diff --check`: correctos.

`node --import tsx scripts/test-empresa-csv.ts`: correcto. Cubre analizador,
cabeceras y orden, formatos incorrectos, ausencia e invalidez de email,
manejadores HTTP reales de importación, autorización, persistencia,
deduplicación, combinación no destructiva, contactos sin correo, igualdad de
conteos y selección SQL, filtros y bajas revocadas antes del envío.

La prueba comprueba que la base de desarrollo es distinta de la aplicación
antes de crear un esquema temporal. Todas las tablas de prueba están en ese
esquema; no se escriben filas de producción ni se llama a proveedores.

La comprobación visual usa `scripts/empresa-browser-fixture.ts` en el puerto
5012, el frontend real y los manejadores revisados sobre datos sintéticos.
No arranca `server/index.ts`. Las API desconocidas se rechazan y los envíos
están bloqueados incluso en el fixture.

Resultado de la pasada de navegador: correcto. Elegir y cancelar un archivo
con tres filas no produjo escrituras. La confirmación explícita importó solo
la fila válida; los contactos sintéticos pasaron de cinco a seis y los
destinatarios elegibles de uno a dos, tanto al preparar como al confirmar.
La revisión del lote sin email mostró la advertencia y no envió una
importación al cancelar. Se comprobó la vista móvil de 390 px sin
desbordamiento horizontal. El contador de intentos de envío terminó en cero.

## Límites

La corrección no recupera los emails que ya faltan en contactos publicados.
Para completarlos hace falta el archivo original o una fuente verificada,
una revisión de coincidencias y autorización para modificar producción.

No se corrige aquí el rechazo de SendGrid por límites de envío. Ninguna
campaña bloqueada se reintenta automáticamente.

No se ha publicado. La aplicación principal conectada a producción no se
ha reiniciado para cargar estos cambios.
