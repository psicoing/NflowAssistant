# Reglas comunes de los tres modos de chat

Se mantienen los modos clásico, burbujas y breve, voz, opciones interactivas,
historial, límites y modelo configurado. El cambio unifica sus reglas:

- NUXA se identifica como asistente de bienestar emocional con IA.
- No diagnostica ni actúa como médico, psicólogo, abogado o servicio de urgencias.
- El perfil declarado y las preferencias recientes se incluyen en todos los
  modos. Se admite el campo de edad que envía el formulario existente.
- La orientación de seguridad prevalece sobre longitud, ejemplos y estructura.
- No se identifica país por idioma; los teléfonos se ofrecen condicionalmente.
- Los errores técnicos tienen mensajes localizados para los nueve idiomas
  soportados. Ante señales de riesgo, no se indica esperar a que vuelva la IA.
- La clasificación de posibles señales de autolesión precede al filtro
  temático y a etiquetas laborales. Es una heurística de precaución, NO una
  valoración clínica: la IA debe distinguir contexto educativo, duelo y riesgo.
- Se retiran ejemplos de atribución diagnóstica y personajes con promesas
  protectoras. Las etiquetas antiguas del chat pasan a NUXA.

Prueba reproducible:

```sh
npx tsx scripts/test-chat-policy.ts
npm run build
npm run check
```

La prueba sustituye solo el proveedor OpenAI por un doble local y comprueba el
handler real y las peticiones construidas, sin cuentas ni llamadas externas.
No evalúa respuestas reales del modelo ni constituye certificación clínica.
Antes de afirmar eficacia en crisis, hacen falta evaluación contextual con el
modelo publicado y revisión humana cualificada. Las conversaciones antiguas
se conservan tal como se guardaron: no se reescriben los historiales.
