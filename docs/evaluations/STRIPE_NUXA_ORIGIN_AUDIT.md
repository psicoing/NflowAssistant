# Procedencia Stripe y cuentas de NUXA

Fecha: 2 de noviembre de 2026. Revisión de solo lectura sobre Stripe real y la
base de la aplicación, contrastada con la réplica de producción. No se han
importado contactos, creado usuarios, enviado mensajes ni modificado accesos,
cobros, suscripciones, esquemas o datos de producción.

## Resultado principal

Los 377 clientes Stripe no representan 377 registros de la app. Sin embargo,
sí existen operaciones del recorrido histórico NFLOW sin una cuenta actual
vinculable: no es correcto descartar toda la diferencia como irrelevante.

| Comprobación | Resultado |
| --- | ---: |
| Usuarios actuales | 75 |
| Clientes Stripe | 377 |
| Correos distintos de clientes Stripe | 333 |
| Registros adicionales con correo repetido | 44 |
| Clientes creados en 2026 | 310 |
| De esos 310, sin Checkout ni cargo asociados a su identificador en lo consultado | 310 |
| Sesiones Checkout visibles, todos los estados | 417 |
| Sesiones completas | 55 |
| Sesiones caducadas | 362 |

La ausencia de operaciones asociadas a un identificador de cliente no prueba
que la persona nunca visitara la web ni permite conocer cómo se creó ese
registro. Tampoco autoriza a crearle una cuenta o a enviarle publicidad.

## Origen de los recorridos de pago

Se revisaron URL de retorno/cancelación, metadatos, referencias de usuario,
referencias de transacción y candidatos por correo normalizado.

| Dominio de retorno | Sesiones |
| --- | ---: |
| stripe.com | 384 |
| nflow.style | 10 |
| www.empordajobs.es | 3 |
| empordajobs.tadabase.io | 20 |

No se encontraron sesiones con retorno a nuxa.life ni metadatos que nombren
expresamente NUXA/NEUROPSI. Eso no permite excluir el recorrido histórico NFLOW,
ni clasificar los retornos genéricos de Stripe como ajenos a NUXA: su origen
concreto sigue sin atribuir.

## Diez casos históricos de nflow.style

Entre septiembre y noviembre de 2025:

- Seis sesiones completas y pagadas, con seis direcciones distintas y seis
  clientes Stripe distintos: 2,99 EUR cada una, 17,94 EUR de importe bruto
  conjunto de Checkout. No se ha calculado aquí saldo pendiente ni importe
  neto tras comisiones o devoluciones.
- Las seis suscripciones asociadas están canceladas en la consulta actual.
  No acreditan un derecho de acceso vigente.
- Ninguna de las seis enlaza con una cuenta actual por los correos disponibles,
  identificador de usuario existente o referencia local de Checkout.
- Tres de esos pagos contienen identificadores numéricos de usuario que
  actualmente no existen. Los otros tres no tienen identificador utilizable.
- Otras cuatro sesiones caducaron sin pago. Una referencia a otro usuario
  numérico ausente; las restantes carecen de referencia utilizable.

Estos hallazgos demuestran una falta de vinculación histórica actual, no su
causa. Con los datos disponibles no se puede decidir si hubo borrado, cambio
de base, pruebas, migración incompleta o registro nunca finalizado. Tampoco
se puede afirmar que las personas no recibieran servicio en 2025.

Referencias seudónimas de los pagos para reproducir la investigación sin
guardar direcciones ni identificadores Stripe en el informe:

| Caso | Fecha | Referencia de usuario en el pago |
| --- | --- | --- |
| 3442a7e584e1 | 2025-10-04 | Numérica, hoy ausente |
| 820a8f4f648d | 2025-10-04 | Numérica, hoy ausente |
| 24c5c2da10fc | 2025-09-28 | Numérica, hoy ausente |
| 66b2a1dc542d | 2025-09-12 | No utilizable |
| a41c5dc31ee6 | 2025-09-11 | No utilizable |
| d88a3fddd65e | 2025-09-10 | No utilizable |

## Referencias de pago locales

La tabla local stripe_transactions contiene siete filas antiguas de mayo y
junio de 2025: tres con estado de completado y cuatro de creación. Ninguna
referencia a un usuario actual ni coincide con los Checkout listados. Sus
referencias no tienen formato cs_live_/cs_test_, ni los formatos PayPal
comprobados. No se deben interpretar como siete pagos Stripe perdidos ni
regularizar sin identificar primero qué proveedor y flujo las generaron.

## Riesgo del recorrido actual

La inspección del código confirma:

1. El registro ordinario crea el usuario antes de pagar.
2. La prueba gratuita crea/vincula el usuario al completar la verificación.
3. Hay rutas de creación de Checkout que no exigen un usuario autenticado y
   pueden guardar userId=unknown.
4. Retorno y webhook contienen caminos que buscan al usuario por coincidencia
   exacta de correo. Si no lo encuentran, no crean por ese camino una cuenta.
5. Los importadores de contactos comerciales son independientes de users;
   importar una dirección no corrige ni demuestra la existencia de una cuenta.

Que exista esa vía es un riesgo observable. No demuestra que todos los
clientes sin correspondencia la hayan recorrido.

## Recomendación

Separar dos trabajos antes de tocar cuentas o derechos:

- **Prevención:** vincular toda nueva salida a Stripe a un registro de NUXA,
  usuario autenticado e identificador estable generado por el servidor;
  verificar pertenencia y pago en la confirmación, con procesamiento idempotente
  y excepciones explícitas si se decide ofrecer un checkout como invitado.
  Conservar trazabilidad de intentos aunque no se complete el pago.
- **Conciliación histórica:** investigar los seis casos anteriores con el
  histórico o copias de la base de 2025 y las referencias originales del
  proveedor. No crear cuentas, activar planes ni contactar a personas
  automáticamente. Una suscripción cancelada no debe reactivarse por esta auditoría.

## Reproducibilidad y límites

scripts/audit-stripe-nuxa-origin.ts usa exclusivamente SELECT dentro de una
transacción de solo lectura y llamadas de lectura a Stripe. Verifica la huella
esperada de la base, modo real y paginación completa con tope de seguridad.
No registra correos, nombres ni credenciales. Se confirmó por separado el estado
actual de las seis suscripciones mediante lectura de Checkout con expansión
de subscription.

Solo se observa el histórico disponible en la cuenta/API consultada. Un correo
coincidente es candidato de vinculación, no identidad verificada. No se ha
demostrado pérdida generalizada de usuarios ni integridad completa de la
activación de pagos.
