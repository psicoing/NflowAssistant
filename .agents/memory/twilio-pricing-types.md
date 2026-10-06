---
name: Tipos de Twilio y tarifas
description: Diferencia observada entre las declaraciones del SDK y el JSON real de tarifas de SMS.
---

No asumir que el SDK de Twilio convierte a camelCase todos los campos anidados. La respuesta real de tarifas de SMS conservó snake_case dentro de las listas de precios, aunque sus declaraciones TypeScript indicaban camelCase.

**Why:** La validación financiera rechazaba tarifas reales como desconocidas porque confiaba en la declaración del SDK; el rechazo era seguro, pero impedía los envíos.

**How to apply:** Al integrar nuevas respuestas anidadas de Twilio, comprobar su forma con una consulta de metadatos sin mensajes de pago. Probar ambas formas y bloquear el envío si la tarifa o la moneda siguen siendo desconocidas.

Comprobar con los metadatos de la cuenta que un remitente pertenece a ella y soporta SMS; la presencia de una variable de configuración no lo demuestra. No comprar otro número ni cambiar la línea de voz para resolver un envío de verificación sin autorización.

**Why:** El remitente configurado no coincidía con el número existente de la cuenta. Reutilizar el número disponible con SMS permitió entregar el código, y el usuario confirmó que lo recibió.

**How to apply:** Validar propiedad y capacidades antes de enviar; preferir el número existente y mantener separado el alcance de SMS y voz.
