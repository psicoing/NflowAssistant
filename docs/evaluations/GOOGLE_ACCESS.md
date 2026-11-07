# Acceso adicional con Google

## Alcance

Google identifica al usuario mediante Clerk gestionado por Replit. La sesión
local de NUXA y el identificador local siguen siendo la autoridad para historial,
perfil, suscripción, créditos y prueba gratuita. No se migra el acceso anterior.
La identidad de desarrollo y la de producción de Clerk son independientes.

## Vinculación

- La clave persistida combina el emisor verificado y el identificador de Clerk.
- El servidor comprueba la sesión firmada, el correo principal verificado y su
  correspondencia con una cuenta externa Google verificada.
- Un correo coincidente **no** basta para acceder a una cuenta antigua.
- La primera vinculación exige usuario y contraseña NUXA, correo coincidente y
  rol `user`. Administradores conservan su acceso habitual.
- Vincular no modifica ninguna columna del usuario existente.
- La creación nueva exige fecha válida, edad de 18 a 95 años y aceptación
  explícita del aviso. No acredita pagos, permisos comerciales, verificación
  de teléfono ni activación de la prueba gratuita.
- Credenciales, usuario, correo, rol y cuotas enviados por el navegador nunca
  determinan la identidad Google ni conceden privilegios.
- Las transacciones serializan callbacks repetidos/concurrentes. Una sesión
  local de otra persona no se sustituye silenciosamente.
- POST requiere origen correcto y nonce CSRF en la sesión. La sesión se
  regenera al iniciar acceso local. Los fallos se cierran sin conceder acceso.
- Cerrar la sesión de usuario solicita el cierre de ambas sesiones.

## Esquema y publicación

`nuxa_social_identities` es una tabla aditiva en `shared/schema.ts`, vinculada
por clave foránea a `users`. Solo se aplicó al desarrollo gestionado, después
de comprobar que es distinto de la base utilizada por la vista previa.
No hay DDL de producción, arranque, `db:push` general ni hooks de migración.

La vista previa usa datos reales y por eso no se activa allí el botón hasta
que exista la tabla en su destino. La ausencia de tabla no afecta al acceso
habitual. No utilizar el servidor real para crear fixtures.

Antes de Publish, revisar la comparación completa de esquemas: esta función
solo requiere añadir la tabla y su índice; no autorizar eliminaciones de
estructuras ajenas ni sobrescribir datos. Las diferencias preexistentes
entre desarrollo y producción deben revisarse por separado.

Google está visible en el formulario de desarrollo de Clerk. La configuración
de proveedores/credenciales de producción se comprueba en el panel Auth de
Replit; la creación del tenant no prueba un OAuth real en producción.

## Verificación

`npx tsx scripts/test-google-auth.ts` ejecuta el almacén y las rutas reales
con PostgreSQL en un esquema temporal exclusivo de desarrollo y una identidad
inyectada solo por el ejecutable de pruebas. Comprueba:

- CSRF y origen manipulados.
- Identidad no verificada.
- Edad y aviso obligatorios.
- Correo, rol, pago y cuota falsificados en el payload.
- Vinculación sin contraseña, contraseña incorrecta y cuenta administrativa.
- Preservación exacta de todos los campos de una cuenta de pago.
- Emisores diferentes, conflicto de sesión local, callbacks simultáneos.
- Creación única, acceso repetido, cierre local e indisponibilidad del servicio.

La fixture de navegador es un ejecutable separado que nunca se monta en la
aplicación. No contiene conexiones a correo, IA ni pagos. El test visual
comprueba la interfaz y la transición a la sesión local con identidad sintética;
**no sustituye** una prueba real de OAuth con Google.

Resultados comprobados en desarrollo: compilación de producción y pruebas de
API correctas; en navegador se rechazaron edad insuficiente y aviso sin aceptar.
La primera comprobación detectó un retorno incorrecto y la reaparición del splash;
corregidos ambos, la comprobación focalizada confirmó `/prueba-gratis` para una
cuenta nueva y `/chat` para una cuenta de pago, con la misma sesión local.
Se eliminaron todos los esquemas temporales propios y se restauró la aplicación.

La comparación de nombres y tipos de columnas entre desarrollo gestionado y
producción solo mostró las cuatro columnas de la nueva tabla como adición:
ninguna columna de producción faltaba en desarrollo. Esto no sustituye la
comparación completa de índices, restricciones y demás objetos de Publish.

## Pendiente de comprobar tras la publicación autorizada

Inicio y retorno Google en dominio publicado, cookies/proxy de producción,
configuración Google de producción, reapertura de la misma cuenta, cierre de
ambas sesiones y preservación del identificador de una cuenta real vinculada.
No declarar estas comprobaciones realizadas mediante una fixture sintética.
