---
name: Dual written-chat billing preference
description: The user proposes OpenAI API credit first and Replit as a token-budgeted backup; voice and the approved spending ceiling remain separate.
---

El chat escrito se ha dejado temporalmente en Replit únicamente mientras está
pendiente activar la facturación de OpenAI directo.

**Why:** Una petición real en la web publicada recibió un 429 de OpenAI directo
que no activó el respaldo; Replit no había recibido ninguna petición. Una única
generación real usando Replit directamente sí produjo una respuesta.

**How to apply:** Mantener el modelo y los 20 USD mensuales globales de Replit.
No ampliar el respaldo a cualquier 429 ni borrar reservas inciertas. Comprobar
la facturación y el comportamiento de la ruta nativa antes de reactivar el
sistema dual. Los cambios de configuración requieren republicar para llegar
al servicio publicado.

La preferencia anterior del usuario era un sistema dual: OpenAI primero
si hay saldo utilizable de API, y Replit como respaldo si no hay saldo, siempre
dentro de un consumo de tokens controlado. La voz queda fuera del cambio.

**Why:** El usuario quiere aprovechar el saldo de OpenAI y reservar Replit para
cuando no haya saldo. Esta propuesta sustituye su preferencia anterior por
Replit como único pagador. No autoriza cambiar el modelo ni la voz.

**How to apply:** Distinguir saldo de la API de suscripción a ChatGPT, cuya
facturación es independiente. El respaldo no debe activarse por cualquier HTTP 429, timeout
o fallo de red: podrían ser límites de velocidad o solicitudes ya cobradas.
No llamar a ambos proveedores en paralelo. Comprobar una generación real y
el pagador antes de declarar el sistema operativo.

Controlar el coste de NUXA por tokens de entrada y salida, no solo por mensajes
o por el pagador. Centralizar el cobro en Replit no autoriza consumo ilimitado.

**Why:** El usuario insiste en tener en cuenta los tokens porque, sin ese
control, el gasto podría ser «ruinoso».

**How to apply:** Antes de poner en servicio la nueva conexión, acordar un
presupuesto y comprobar límites de contexto, salida y consumo. Contabilizar
prompt, historial y evidencia en la entrada; no confundir caché documental con
ahorro garantizado de tokens del modelo. Preservar seguridad y bibliografía
pertinente al reducir contexto.

El usuario confirmó **OpenAI aparte y Replit hasta 20 USD mensuales adicionales**
como respaldo del chat escrito. El límite de 20 USD es exclusivo de Replit,
global para todos los clientes; no compartido entre ambos ni por cliente.
Excluye suscripción a Replit y voz. No aumentarlo sin nueva autorización.
Los 20 euros que mencionó eran una referencia al volumen de tokens, no una
afirmación de saldo ni un presupuesto autorizado para OpenAI.

El usuario autorizó **25 USD mensuales para la API de OpenAI**, independientes
de los **20 USD mensuales del respaldo Replit**. El máximo conjunto del chat
es 45 USD, no 45 por proveedor o por cliente. No incluye voz ni otras funciones.

**Why:** El usuario eligió explícitamente «OpenAI aparte; Replit hasta 20 USD
adicionales», aclaró que los 20 euros eran una referencia de tokens, y autorizó
25 USD cuando se le preguntó por el máximo independiente de OpenAI.

**How to apply:** Separar la contabilidad de cada proveedor. Permitir respaldo
cuando OpenAI rechaza inequívocamente la facturación o no puede cubrir la
petición dentro de sus 25 USD autorizados. Un fallo de contabilidad/pricing no
es agotamiento normal: detener ambos para revisión, incluso tras cambio de mes.
El nuevo mes no corrige una discrepancia de precio o proveedor.
Aplicar reserva duradera
antes de las peticiones; un fallo de
red no prueba ausencia de cargo. No liberar reservas inciertas por caducidad
o reinicio. Distinguir contabilidad conservadora local de factura real y del
presupuesto global de la cuenta Replit. Las respuestas estáticas por bloqueo
no deben consumir preguntas pagadas del cliente.

Replit AI Integrations y el catálogo de conectores OAuth no son la misma
superficie. Que OpenAI no aparezca en la búsqueda de conectores no demuestra
que la facturación gestionada por Replit no exista.

**Why:** La documentación oficial confirma credenciales gestionadas y cargos
a créditos Replit, pero el catálogo normal no ofrecía su activación en esta
sesión.

**How to apply:** Utilizar el flujo de autorización de AI Integrations cuando
esté disponible; no inventar identificadores de conectores ni pedir al usuario
una clave gestionada por Replit. No afirmar que está activa hasta verificar
la configuración y una respuesta real.
