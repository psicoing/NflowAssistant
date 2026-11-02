# Lista Stripe para revisión comercial

## Alcance

Sección administrativa «Stripe» junto a «Empresas». Importa únicamente correos
del listado completo de clientes Stripe de la conexión existente, en modo real.
No importa nombres, productos, importes, datos de salud ni conversaciones.
No modifica clientes ni pagos en Stripe.

La lista es independiente de los destinatarios de empresas y no tiene una
ruta de envío ni de autorización comercial. Todos los registros devuelven
`canSend: false`: sin supresión conocida figuran pendientes de revisión, nunca
consentidos. No se envía ni siquiera una petición de consentimiento por correo.

## Importación

- Solo administradores autenticados; POST JSON del mismo origen.
- Normaliza espacios y mayúsculas, valida correos y deduplica por dirección.
- Reimportar no duplica ni elimina registros y conserva la primera fecha.
- Transacción y bloqueo entre instancias para importaciones concurrentes.
- Comprueba la tabla antes de consultar Stripe. Ante un error no importa
  parcialmente el listado.
- Búsqueda local, contadores y resultado de importación en el panel.
- Bajas/supresiones se consultan al mostrar la lista: usuarios, empresas,
  instituciones, mutuas, lista de supresión y eventos adversos relevantes.
- Los contactos no se copian a `empresa_contacts` ni se usan por campañas.
- Respuestas sin caché; no se registran sus cuerpos en los logs HTTP.

## Estado de publicación

Tabla definida en el esquema y creada únicamente en la base gestionada
de desarrollo. La comparación de Publish muestra solo CREATE TABLE,
sin borrados ni cambios estructurales destructivos.

El servidor del workspace usa la base de la app, no esa base de desarrollo.
Por ello, antes de publicar, el panel muestra que hay que republicar;
no se ha realizado una importación real en producción.

Después de publicar: abrir administración → Stripe → Importar desde Stripe.
La importación no envía correos. El total se obtiene de Stripe en ese momento,
no de un contador fijado a 333.

## Verificación

`npx tsx scripts/test-stripe-commercial-contacts.ts`:
autenticación, origen, tabla ausente, normalización, deduplicación,
reimportación, seis fuentes de supresión, baja posterior a la importación y
error seguro del proveedor. Stripe simulado; esquema sintético exclusivo en
desarrollo, verificado distinto de la base de la aplicación y eliminado al
terminar. Sin envíos ni escrituras de negocio en producción.

TypeScript y comprobación de diff correctos. El panel administrativo no se
ha verificado visualmente con una sesión autenticada; la captura sin sesión
solo alcanza la pantalla pública.
