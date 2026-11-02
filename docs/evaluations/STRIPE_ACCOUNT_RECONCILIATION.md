# Conciliación de Stripe y cuentas actuales de NUXA

Auditoría de solo lectura solicitada por el propietario. No se han creado
clientes, cobros, devoluciones, suscripciones ni permisos. No se ha publicado.
Resultados correspondientes al momento de la consulta; no son saldos en tiempo real.

## Alcance

- Cuenta Stripe en modo real identificada como NUXA.
- Base utilizada por la aplicación contrastada con la réplica de producción
  mediante huella del nombre de base y conteo de 75 usuarios.
- Listados paginados de clientes, cargos, sesiones Checkout completadas,
  suscripciones y catálogo. Límite de seguridad no alcanzado.
- Cruce por correo normalizado de cliente, facturación, recibo y Checkout.
  Es un candidato de vinculación, no prueba de identidad ni de derecho vigente.
- Solo agregados y referencias internas en la salida de la herramienta;
  sin exportar correos, nombres personales ni credenciales.

## Resultados

| Medida | Resultado |
|---|---:|
| Usuarios en producción | 75 |
| Correos distintos en NUXA | 70 |
| Usuarios marcados como pago completado | 7 |
| Usuarios con estado local activo | 9 |
| Clientes Stripe | 377 |
| Correos distintos en Stripe | 333 |
| Registros adicionales con correo repetido en Stripe | 44 |
| Clientes Stripe creados en 2026 | 310 |
| Intentos de cargo en Stripe | 256 |
| Cargos satisfactorios | 121 |
| Intentos fallidos | 135 |
| Importe bruto satisfactorio histórico | 3.016,32 EUR |
| Reembolsado | 75,00 EUR |
| Diferencia antes de comisiones | 2.941,32 EUR |
| Suscripciones activas o en prueba en Stripe | 0 |
| Suscripciones canceladas | 21 |
| Suscripciones caducadas sin completar | 7 |
| Sesiones Checkout completadas y pagadas | 55 |
| Sesiones pagadas sin coincidencia actual por correo | 51 |

El histórico de cargos abarca desde agosto de 2021 hasta marzo de 2026;
los cargos satisfactorios observados son de 2021 a 2025. La diferencia
entre fecha del último intento y del último cobro es importante.

La cuenta contiene productos históricos de NFLOW, EJOBS, EMPORDAJOBS,
FullSheet, PLUSALUD e Instituto NeuronMeg, entre otros. El nombre actual
NUXA de la cuenta no convierte todo el histórico en ingresos de la app actual.
No se ha atribuido cada cargo a una línea de producto: el catálogo compartido
es evidencia de alcance histórico, no atribución individual del pago.

## Cruce con usuarios actuales

- 10 cargos satisfactorios tienen coincidencias por correo con 5 cuentas actuales.
- 6 cargos producen más de una coincidencia de cuenta: no es un enlace unívoco.
- Hay 56 registros de cliente con cobros satisfactorios sin coincidencia por
  correo con usuarios actuales. No equivale a 56 personas con acceso pendiente.
- Las coincidencias observadas son pagos anteriores a la creación de las
  cuentas actuales; no acreditan una suscripción actual.
- 3 cuentas de prueba coinciden con cobros antiguos; las otras coincidencias
  corresponden a cuentas administradoras. No activar automáticamente.
- 6 de los 7 usuarios marcados localmente como pago completado no se enlazan
  por correo a un cargo satisfactorio de esta cuenta Stripe.
  Puede haber pruebas, activaciones manuales, otro proveedor o correo distinto.
  No retirar acceso por esta ausencia de coincidencia.

## Límites y riesgos observados en el código

El webhook intenta encontrar al usuario con un correo presente directamente
en el objeto del evento y comparación exacta. No todos los objetos de Stripe
aportan esos campos. Una coincidencia de correo tampoco resuelve cuentas
duplicadas. Es una fragilidad del enlace, no prueba de un webhook perdido.

El campo local `active` no basta para demostrar vigencia: existen fechas
vencidas y cuentas sin vencimiento, incluidas administradoras.

## Conclusión

No hay fundamento para importar los 377 clientes ni declarar perdidas
302 cuentas. Los dos contadores representan entidades y periodos distintos.
Tampoco se ha demostrado que todos los pagos estén correctamente vinculados.
Antes de corregir permisos, identificar las operaciones concretas de la app
actual y contrastar sus referencias Stripe, titularidad, producto, periodo,
reembolsos y posibles pagos por otros proveedores.

El script `scripts/audit-stripe-reconciliation.ts` permite repetir el análisis
con una huella esperada de base. No debe ejecutarse automáticamente en el
arranque ni como parte de una publicación.
