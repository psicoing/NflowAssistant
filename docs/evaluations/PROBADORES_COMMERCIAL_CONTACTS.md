# Probadores: audiencia comercial de registros y recursos gratuitos

## Alcance

Nueva pestaña «Probadores», junto a Stripe en el dashboard. Reutiliza el panel,
editor bilingüe y motor de autorización, bajas y envíos manuales existentes.
Stripe conserva su comportamiento predeterminado y sus enlaces antiguos.

La carga manual reúne:

- Correos dejados en recursos públicos (`email_leads`).
- Correos de cuentas gratuitas registradas en NUXA.
- Normalización, validación y deduplicación por correo.

No se consultan conversaciones ni se infiere que alguien haya utilizado el
chat. Se excluyen correos asociados a cuentas administrativas, partners, cuentas
de empresa creadas por partners o cuentas con pago completado, suscripción
activa o créditos prepagados positivos, según el estado al cargar.

## Reutilización y separación

- Un único motor compartido, parametrizado por identificadores fijos del servidor.
- Listas, borradores ES/EN, pruebas de permiso e historiales independientes.
- La carta invita a conocer los planes de NUXA; no afirma resultados clínicos
  ni revela información personal o de salud.
- La importación no crea usuarios, no concede acceso y no autoriza publicidad.
  Tampoco se interpreta el indicador histórico de consentimiento de un lead
  como prueba verificable suficiente para activar el envío.
- Los permisos de Stripe no autorizan automáticamente la audiencia Probadores.
- Las bajas de ambas audiencias son personales, firmadas y separadas por
  propósito; un token de Stripe no se acepta en Probadores ni al revés.
- Una baja comercial mantiene la supresión global, también tras reimportar y
  frente a otras audiencias. Abrir o previsualizar la baja no modifica datos.
- Se conservan la revisión previa, idioma, confirmación «ENVIAR», máximo de
  diez destinatarios, control de duplicados, límites y detención ante fallos.
- No se modifica la configuración ni las credenciales de correo o de Stripe.

## Base de datos y publicación

Las cinco tablas de la audiencia están declaradas en el esquema fuente y se
han creado únicamente en la base gestionada de desarrollo, tras comprobar que
no coincide con la base de la aplicación.

No se ha ejecutado DDL sobre producción ni se ha añadido DDL al arranque o a
la compilación. Publicar debe aplicar la ampliación aditiva de esquema mediante
el flujo gestionado de Replit. No elegir sobrescribir los datos de producción.

La vista previa de este proyecto usa una conexión de aplicación que apunta a
su base publicada; por ello puede mostrar «Esquema pendiente» hasta publicar.
No se cambia esa conexión para simular que la función ya está publicada.

## Comprobaciones

- Compilación de tipos y formato de cambios correctos.
- Pruebas de Probadores en esquema temporal aislado: fuentes locales,
  exclusiones, deduplicación, autenticación y origen; borradores independientes
  ES/EN; permisos independientes; preparación y envío exclusivamente simulado;
  repetición sin reenvío; baja firmada y separación de audiencias; supresión
  global; reimportación sin reactivación; ausencia de creación de cuentas.
- Regresión de la audiencia Stripe y sus envíos manuales: correcta, incluidos
  control de cuotas, concurrencia, cancelación, estados inciertos y bajas.
- No se han hecho envíos reales, importaciones reales ni consultas a Stripe
  durante estas pruebas. Los destinatarios de prueba terminan en `.invalid`.
- Una consulta adicional de solo lectura a las fuentes actuales detectó 63
  correos válidos distintos: 69 registros de origen, 3 inválidos y 3 duplicados.
  No se copiaron a la audiencia comercial ni se les concedieron permisos.
- Verificación del panel en navegador con todas las peticiones API interceptadas:
  carga de Probadores, consulta del permiso, edición/guardado en inglés,
  preparación y cierre sin envío, y cambio a Stripe con datos independientes.
  No se remitió ninguna petición real de importación, permiso o envío.
- Modal legible en escritorio y a 390 px; sin desbordamiento horizontal de la
  página. La tabla conserva desplazamiento horizontal para consultar todas sus
  columnas en móvil, igual que la franja de pestañas.

## Límites actuales

Los correos se cargan al pulsar el botón, no mediante una sincronización
automática. Una dirección importada puede adquirir un plan posteriormente;
revalidar esa condición al enviar es una mejora independiente del control
actual de permisos y supresiones. La protección contra cartas repetidas es por
audiencia: no sustituye una política comercial global de frecuencia entre listas.
