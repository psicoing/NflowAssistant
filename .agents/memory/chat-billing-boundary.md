---
name: Dual written-chat billing preference
description: The user proposes OpenAI API credit first and Replit as a token-budgeted backup; voice and the approved spending ceiling remain separate.
---

El usuario ahora plantea un sistema dual para el chat escrito: OpenAI primero
si hay saldo utilizable de API, y Replit como respaldo si no hay saldo, siempre
dentro de un consumo de tokens controlado. La voz queda fuera del cambio.

**Why:** El usuario quiere aprovechar el saldo de OpenAI y reservar Replit para
cuando no haya saldo. Esta propuesta sustituye su preferencia anterior por
Replit como único pagador. No autoriza cambiar el modelo ni la voz.

**How to apply:** Distinguir saldo de la API de suscripción a ChatGPT, cuya
facturación es independiente. Confirmar el reparto del presupuesto antes de
ampliar gasto. El respaldo no debe activarse por cualquier HTTP 429, timeout
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

**Why:** El usuario eligió explícitamente «OpenAI aparte; Replit hasta 20 USD
adicionales» y aclaró que los 20 euros eran una referencia de tokens.

**How to apply:** Obtener un máximo explícito para OpenAI antes de activar su
uso como proveedor principal; no convertir «aparte» en gasto ilimitado.
Separar la contabilidad de cada proveedor. Aplicar reserva duradera antes de las peticiones; un fallo de
red no prueba ausencia de cargo. No liberar reservas inciertas por caducidad
o reinicio. Distinguir contabilidad conservadora local de factura real y del
presupuesto global de la cuenta Replit. Las respuestas estáticas por bloqueo
no deben consumir preguntas pagadas del cliente.
