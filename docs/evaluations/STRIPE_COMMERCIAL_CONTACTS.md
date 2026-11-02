# Lista Stripe para revisión comercial

## Alcance

Sección administrativa «Stripe» junto a «Empresas». Importa únicamente correos
del listado completo de clientes Stripe de la conexión existente, en modo real.
No importa nombres, productos, importes, datos de salud ni conversaciones.
No modifica clientes ni pagos en Stripe.

La lista es independiente de los destinatarios de empresas. Importar deja
los contactos pendientes de revisión y no genera autorización. El propietario
puede registrar evidencia de un permiso explícito para email comercial de NUXA,
o revocarlo, individualmente. Una baja o supresión siempre prevalece.
No se envían peticiones de consentimiento a direcciones sin permiso.

## Importación

- Solo administradores autenticados; POST JSON del mismo origen.
- Normaliza espacios y mayúsculas, valida correos y deduplica por dirección.
- Reimportar no duplica ni elimina registros y conserva la primera fecha.
- Transacción y bloqueo entre instancias para importaciones concurrentes.
- Comprueba la tabla antes de consultar Stripe. Ante un error no importa
  parcialmente el listado.
- Búsqueda local, contadores y resultado de importación en el panel.
- Bajas/supresiones se consultan al mostrar la lista: usuarios, empresas,
  instituciones, mutuas, leads, lista de supresión y eventos adversos relevantes.
- Los contactos no se copian a `empresa_contacts` ni se usan por campañas.
- Respuestas sin caché; no se registran sus cuerpos en los logs HTTP.

## Carta de invitación a NUXA

Editor de asunto y texto con guardado persistente y vista previa segura,
en español e inglés de forma independiente. Se conserva la carta española
existente (id=1); la inglesa usa id=2. No se adivina el idioma a partir del email.
Invita a contratar NUXA, no a abrir una cuenta Stripe. El botón lleva a los
planes de NUXA y el pie de baja es fijo, no eliminable mediante la edición.
El remitente y la dirección de respuesta existentes no cambian.

GET/PUT administrativos de carta: `/api/admin/stripe-contacts/letter`,
con `language=es|en` en GET y campo `language` en PUT.
Guardar el borrador no envía nada ni otorga autorización comercial.
El texto predeterminado se muestra desde el código si la tabla no tiene fila;
el primer guardado lo persiste. Una tabla ausente exige republicación, no
se intenta crear en producción.

La vista previa enlaza a una demostración de baja sin destinatario y sin
efectos. El generador para futuros envíos exige una URL personal, firmada con
HMAC y vinculada al identificador y dirección del destinatario, sin incluir
el correo en el token. Este generador no habilita ni realiza envíos por sí mismo.

La ruta pública `/api/stripe-commercial/unsubscribe` valida el enlace y
solicita confirmación; GET nunca cambia el estado. POST válido registra la
supresión y las bajas de correo equivalentes en usuarios, leads y contactos
comerciales. La operación es idempotente y no toca datos de pago ni cancela
suscripciones. La firma usa en ejecución el secreto de sesión existente:
su cambio invalida los enlaces anteriores. No se ha accedido a su valor
durante el desarrollo.

## Envío manual por el propietario

- Registrar un permiso individual exige fuente, referencia de evidencia, fecha
  no futura y declaración expresa de verificación. La compra en Stripe no sirve
  como prueba. Guardar referencias, no datos de salud ni textos clínicos.
- `/api/admin/stripe-contacts/authorizations/:id` conserva historial append-only;
  la última acción para ese contacto/email determina la vigencia, subordinada
  siempre a supresiones por email/dominio y bajas en otras fuentes comerciales.
- Seleccionar entre 1 y 10 contactos habilitados, elegir ES o EN y guardar la
  carta de ese idioma. POST `/api/admin/stripe-contacts/dispatches` solo prepara
  un lote con copia inmutable de asunto, texto, destinatarios e idioma.
- Tras revisar contenido y direcciones, escribir `ENVIAR` y confirmar. Solo
  POST `/dispatches/:id/send` con esa confirmación puede llamar a SendGrid.
  No hay cron, cola automática ni envíos al montar o recargar el panel.
- El remitente es NUXA del dominio autenticado y Reply-To el Gmail del dueño.
  Cada correo lleva pie localizado y baja personal firmada; la confirmación de
  baja también está en inglés cuando corresponde.
- Ritmo compartido con los demás envíos comerciales. Autorización y supresiones
  se comprueban de nuevo después de la espera, justo antes de cada intento.
- Se reserva durablemente cada intento antes de llamar al proveedor. Confirmar
  dos veces, incluso concurrentemente, no reenvía. El mismo contenido para
  ese contacto no puede reservarse en otro lote si ya se intentó.
- Ante cuota, credenciales, límites o resultado incierto se detienen los
  pendientes. Sin proveedor alternativo, copias, reintentos automáticos ni
  reanudación de intentos ambiguos. `attempting` tras un corte debe revisarse,
  no repetirse. GET del lote solo recupera el estado.
- Cancelar detiene lo pendiente, no retira correos ya aceptados. Las reservas
  nunca intentadas se liberan para permitir preparar otro lote legítimo.
- El historial distingue pendientes, intentando, aceptados, rechazados,
  omitidos e inciertos. Aceptado NO equivale a entregado ni leído.

## Estado de publicación

El listado y el editor iniciales ya se comprobaron publicados. Para el envío
manual se han añadido únicamente en desarrollo las tablas de autorizaciones,
lotes y destinatarios, declaradas también en Drizzle. La comparación de Publish
muestra solo tres tablas nuevas y sus claves, sin borrados ni cambios
estructurales destructivos.

El servidor del workspace usa la base de la app, no esa base de desarrollo.
Por ello, las funciones que requieren las nuevas tablas muestran que hay que
republicar hasta que el propietario lo haga. No se ha realizado una importación
real, registrado permisos reales ni enviado mensajes a producción en este trabajo.

Después de publicar: administración → Stripe → importar → registrar permisos
verificados → guardar cartas ES/EN → seleccionar destinatarios autorizados →
preparar y revisar → confirmación manual de envío. La importación no envía correos.

## Verificación

`npx tsx scripts/test-stripe-commercial-contacts.ts`:
autenticación, origen, tabla ausente, normalización, deduplicación,
reimportación, supresiones, baja posterior a la importación, error seguro del
proveedor, guardado de carta, validación de campos, pie obligatorio,
escape HTML, firma vinculada al destinatario, rechazo de tokens alterados,
GET/demostración sin efectos, POST de baja y repetición idempotente.
También cubre cartas ES/EN independientes, prueba de autorización obligatoria,
revocación y baja posteriores a la preparación, supresión por dominio,
snapshot inmutable, confirmación expresa, lotes máximos de diez, concurrencia,
duplicados entre lotes, corte por 429, resultado incierto sin reintento y
cancelación antes y durante un envío simulado.
Stripe y SendGrid simulados; esquema sintético exclusivo en
desarrollo, verificado distinto de la base de la aplicación y eliminado al
terminar. Sin envíos ni escrituras de negocio en producción.

TypeScript y comprobación de diff correctos. El panel administrativo no se
ha verificado visualmente con una sesión autenticada; la captura sin sesión
solo alcanza la pantalla pública.
