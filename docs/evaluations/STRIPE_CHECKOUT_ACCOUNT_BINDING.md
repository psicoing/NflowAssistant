# Vinculación de compras Stripe a cuentas NUXA

## Alcance

Corrección preparada en el entorno de trabajo el 2 de noviembre de 2026.
Sin publicación, cobros, sesiones de pago reales, correos ni SMS de prueba.
Los seis casos históricos del informe de procedencia siguen pendientes de
conciliación: no se han recreado cuentas ni activado suscripciones.

## Comportamiento

- Las tres rutas de creación de Checkout requieren una sesión de usuario y una
  cuenta existente. No admiten compras como invitado ni userId=unknown.
- Antes de crear Checkout se guarda un intento en la tabla de transacciones ya
  existente. El precio y las preguntas se determinan en el servidor.
- El servidor fija correo de la cuenta, client_reference_id y metadatos de
  pertenencia. Un correo o identificador enviado por el navegador no selecciona
  al beneficiario del pago.
- Solo se devuelve una URL después de guardar la referencia de Checkout.
  Si esa vinculación falla, se intenta caducar Checkout y no se facilita la URL.
- El retorno, la confirmación autenticada y el webhook usan el mismo servicio.
  Se contrastan registro local, propietario, referencia de cuenta, producto,
  importe, moneda, modo y estado del pago recuperado de Stripe.
- Las suscripciones usan el periodo activo indicado por Stripe; volver a abrir
  un pago antiguo no concede otros 30 o 365 días.
- Webhooks y retornos repetidos o simultáneos no suman créditos ni reinician
  contadores otra vez. La actualización de saldo y su marca de procesamiento
  comparten transacción y bloqueo.
- Las renovaciones con factura pagada se registran por factura y actualizan
  una sola vez el periodo verificado. Se conserva la contabilidad de referencias
  comerciales iniciales dentro de la transacción.
- Los pagos históricos sin vinculación verificable no se asignan por correo
  ni al último usuario pendiente. No se crean cuentas automáticamente.
- Se exige firma del webhook también en desarrollo. Las dos rutas públicas
  de activación de pruebas están retiradas. La activación manual exige un
  administrador autenticado; no se elimina esa excepción administrativa.

## Recorrido del usuario

Una compra sin sesión lleva al acceso de NUXA, conservando el pack elegido.
Desde allí puede usar el registro verificado existente. Tras iniciar sesión o
completar el registro vuelve a la elección, **sin lanzar un pago automáticamente**.
La elección guardada solo permite destinos internos de contratación, sin
direcciones de correo, tokens de pago ni URL externas.

La compra de créditos permite acceder usando el saldo aunque la cuenta no
tenga suscripción mensual activa. Eso no concede gratuitamente la cuota de
un plan pendiente o caducado. Se conservan precios, cantidades y límites
de los planes existentes.

## Verificación del servidor

`scripts/test-stripe-checkout-binding.ts`: 29 casos superados usando un esquema
temporal en la base de desarrollo, separado de la base conocida de producción.
Se elimina únicamente ese esquema de pruebas al terminar. Stripe se sustituye
por un proveedor simulado: cero llamadas a su API.

Casos incluidos:

- Cuenta inexistente, sin crear Checkout ni intento de otro usuario.
- Sustitución del correo, usuario, referencia de cliente y referencia local.
- Dos cuentas con el mismo correo: solo recibe saldo el propietario vinculado.
- Pago pendiente, importe, moneda, modo y producto incorrectos.
- Cantidad de preguntas manipulada en metadatos.
- Confirmaciones concurrentes y duplicadas por diferentes tipos de evento.
- Compras distintas sobre la misma cuenta sin perder incrementos.
- Cuenta eliminada después de iniciar el pago.
- Fallo del proveedor y fallo al guardar la vinculación.
- Periodo real de suscripción, repetición sin reiniciar uso y comisiones.
- Renovaciones duplicadas y suscripción cancelada.
- Reversión completa ante fallo de contabilidad y posterior reintento.
- Rechazo de histórico no vinculado.
- Packs sin cuota mensual gratuita adicional.

Comprobaciones HTTP sobre el servidor reiniciado:

- Creación de suscripción, creación de pack, compra de créditos, confirmación,
  activación por sesión, activación manual y activación por correo sin sesión:
  HTTP 401.
- Dos rutas antiguas de activación de pruebas: HTTP 410.
- Webhook sin firma: HTTP 400.

`npm run check` y `git diff --check` superados. No se requieren tablas nuevas,
migraciones ni cambios de configuración de proveedores para esta corrección.

## Comprobación en navegador

Completada con autenticación y destino de pago simulados, sin credenciales
reales ni operaciones de registro o pago:

- Un visitante selecciona el pack de 20 preguntas, recibe HTTP 401 del servidor
  y llega a login con la selección conservada.
- La indicación de crear cuenta lleva al formulario verificado existente sin
  perder la selección. No se enviaron códigos ni se completó ese registro.
- Un login simulado devuelve al pack de 20 preguntas, sin iniciar otro
  Checkout automáticamente.
- La compra posterior envía solo packType=pack20, sin correo ni userId. Se
  comprobó la navegación al destino simulado, sin acceder a Stripe.
- El modal de créditos antiguo envía pack15/pack35 correctamente.
- No se detectó desbordamiento horizontal en precios a anchura móvil.

La pantalla de entrada propia de la vista previa interfirió inicialmente con
los enlaces directos. El contenido de la URL de destino simulada quedó tapado
por esa pantalla tras la navegación completa; se verificó la URL y el envío,
no un Checkout bancario. No se verificó /activar-cuenta en navegador.

## Límites

Las pruebas no certifican un cobro bancario real ni la recepción de un webhook
desde Stripe después de publicar. Los casos históricos y la política de
devoluciones/cancelaciones son trabajos separados. No se ha alterado el motor
de IA, los prompts, la voz ni los envíos comerciales.
