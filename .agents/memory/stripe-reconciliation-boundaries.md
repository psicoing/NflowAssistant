---
name: Alcance del histórico de Stripe
description: Evitar equiparar la cuenta Stripe renombrada NUXA con los usuarios o ingresos actuales de la app.
---

El nombre actual NUXA de la cuenta Stripe no delimita el histórico de la app:
se observaron productos de otras líneas y operaciones anteriores a las cuentas
actuales. No importar clientes ni asignar permisos a partir del contador o de
una coincidencia de correo.

**Why:** La conciliación solicitada por el propietario encontró un catálogo
histórico compartido y correos que coinciden con más de una cuenta actual.
La ausencia de coincidencia tampoco excluye otros proveedores o activaciones
autorizadas.

**How to apply:** Distinguir cliente, intento, cobro, producto y derecho vigente.
Verificar referencias del pago y titularidad antes de atribuir ingresos o
corregir accesos. Conservar las excepciones de administración y pruebas.

Las nuevas compras de NUXA deben partir de una cuenta registrada; no ofrecer
checkout como invitado ni convertir la lista de clientes Stripe en usuarios.

**Why:** El propietario autorizó cerrar la vía de pago sin cuenta para evitar
nuevas compras que no puedan vincularse al registro de NUXA.

**How to apply:** Mantener esa condición en futuros botones y recorridos de
contratación. Los casos históricos requieren conciliación aparte, no una
creación o activación masiva de cuentas.

La atribución tampoco debe exigir que todos los pagos digan NUXA o vuelvan a
nuxa.life: los recorridos históricos de NFLOW pueden corresponder al antecedente
de esta app y deben investigarse, no descartarse como otra línea por el nombre.

**Why:** La revisión por procedencia encontró Checkout del recorrido anterior
con referencias de usuario que ya no enlazan con la base actual; filtrar solo
por la marca o el dominio nuevos habría ocultado esos casos.

**How to apply:** Contrastar dominios históricos, metadatos y referencias de
cuenta. Un retorno genérico de Stripe tampoco demuestra una procedencia ajena.

Los contactos extraídos de Stripe deben mantenerse separados de las empresas
y bloqueados para publicidad hasta comprobar autorización; respetar bajas y
supresiones, sin incorporar información de compras de salud ni clínica.

**Why:** El propietario aceptó expresamente preparar la lista para revisión,
sin considerar que un pago autoriza publicidad ni enviar una campaña.

**How to apply:** Una importación o reimportación nunca concede consentimiento.
No conectar esta audiencia a envíos ni usarla para solicitar permiso por correo
sin resolver primero la autorización aplicable.

La carta para estos contactos debe promover contratar NUXA, no registrarse
en Stripe. La baja es de comunicaciones comerciales, no de cuentas ni pagos.

**Why:** El usuario aclaró expresamente el objetivo de la carta; después pidió
dejar preparados los envíos para ejecutarlos él mismo y que la carta esté
en inglés y español.

**How to apply:** Mantener el destino de contratación y el pie obligatorio
separados del texto editable; una vista previa no debe dar de baja a nadie.

Los envíos a contactos Stripe deben ser manuales, iniciados y confirmados por el
propietario desde el panel, con cartas en español e inglés. La petición de
preparar el servicio no autoriza al agente a enviar pruebas o campañas reales.

**Why:** El usuario dijo «el que hace los envíos soy [yo]» y «la carta debe estar
en inglés y español».

**How to apply:** Mantener la revisión de destinatarios e idioma antes de
confirmar, sin activar envíos automáticos ni interpretar importación o pago
como autorización comercial de los contactos.

Una lectura correcta de Stripe desde el entorno de trabajo no certifica que
la conexión del servidor publicado funcione. No dar por resuelta una importación
de producción basándose solo en esa prueba.

**Why:** Se observaron fallos de importación publicados a pesar de que la
consulta desde el workspace y las pruebas aisladas funcionaban; los mensajes
genéricos no permitían atribuir la causa a Stripe o al almacenamiento.

**How to apply:** Confirmar el resultado del endpoint publicado y su diagnóstico
seguro antes de atribuir la causa, cambiar credenciales o declarar éxito.

El propietario quiere una audiencia separada llamada «Probadores» para quienes
dejaron su email en recursos gratuitos y para usuarios registrados en prueba,
reutilizando las funciones comerciales de Stripe.

**Why:** El usuario pidió «copia todo lo que has hecho para stripe» con una
pestaña «probadores» que recoja los registros.

**How to apply:** Mantener ese objetivo separado de la lista Stripe. El origen
gratuito no prueba uso del chat ni autoriza publicidad; conservar el control
manual de campañas y las cartas en español e inglés.
