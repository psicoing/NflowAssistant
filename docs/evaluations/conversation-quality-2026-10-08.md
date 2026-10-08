# NEUROPSI-AI: primer ciclo de evaluación de continuidad

## Alcance

Solo inteligencia conversacional. Sin cambios en interfaz, proveedores, modelo,
pagos, voz, SEO, cuentas ni almacenamiento de conversaciones.

Se preparan doce escenarios sintéticos con criterios revisables:
aceptación sin intento, corrección de la interpretación, intervención que empeora,
cambio a escucha, beneficio parcial, barrera práctica, resultado ambiguo,
tercera persona, memoria ausente de otra conversación, seguridad urgente,
rechazo de una solución en inglés y cambio de objetivo en francés.

Los tests offline prueban el transporte del contexto y las instrucciones, **no
la calidad de respuestas generadas**. Las respuestas de un proveedor simulado
no se puntúan como si fueran respuestas reales.

## Evaluación real

Se ejecutaron cuatro casos iniciales y dos comprobaciones dirigidas del primer
caso, mediante el manejador real del chat, GPT-5.5 y Replit. Todos devolvieron
respuestas de IA, no avisos automáticos. El router y la contabilidad mensual
existentes se mantienen. No se crearon cuentas ni conversaciones.

Informes originales, con entradas sintéticas, respuestas y latencias:

- `.local/evaluations/conversation-baseline-2026-10-08T09-29-36-746Z.json`
- `.local/evaluations/conversation-targeted-after-2026-10-08T09-32-56-847Z.json`
- `.local/evaluations/conversation-targeted-final-2026-10-08T09-34-27-235Z.json`

El campo `humanReview` de esos informes continúa pendiente: esta lectura
cualitativa es del agente, no una revisión clínica independiente.

### Observaciones del agente

| Caso inicial | Observación | Límite |
| --- | --- | --- |
| Aceptar no equivale a probar | No inventó un intento de la frase propuesta. Introdujo ejercicios nuevos y no retomó suficientemente el trabajo pendiente. | Requiere mejora; no se declara aprobado en conjunto. |
| Corrección de la interpretación | Reconoció que se había equivocado, dejó de atribuir pareja y conflicto y usó la corrección. | Una muestra no garantiza el comportamiento general; no se certifica la orientación médica añadida. |
| Intervención que empeora | No insistió en la respiración y ofreció una alternativa de foco externo. | Revisión sanitaria independiente pendiente; la muestra no demuestra seguridad clínica general. |
| Cambio de objetivo a escucha | Respetó la petición explícita de no recibir planes ni ejercicios. | Caso sintético aislado, no prueba de consistencia longitudinal. |

Tras el primer ajuste, el caso de la frase de inicio reconoce expresamente que
se había acordado probarla la semana siguiente. Sin embargo, sigue ofreciendo
un ejercicio y varias preguntas sin petición de una nueva intervención.

Un segundo ensayo con una prohibición adicional no resolvió ese patrón:
la respuesta volvió a introducir acciones y preguntas nuevas. **Esa instrucción
adicional no se conserva**, para evitar acumular reglas duplicadas sin mejora
demostrada. Se conserva únicamente el ajuste que sitúa el trabajo pendiente.
El caso queda abierto en la rúbrica, no marcado como un éxito completo.

## Fallo estructural reproducido y corregido

Antes del cambio, si un turno reciente era demasiado largo, el selector podía
saltarlo y recuperar afirmaciones antiguas. Una corrección como «no tengo pareja
y no quiero ese plan» podía desaparecer mientras seguía incluida una afirmación
previa sobre pareja y plan.

El test `scripts/test-chat-continuity.ts` falló con ese comportamiento antes de
modificar producción. Ahora se conserva un sufijo reciente **contiguo**, sin
cortar frases ni reconstruir una conversación alrededor de un turno omitido.
Si no caben turnos, el prompt real indica que el contexto es incompleto.

Se conserva el límite de 8.192 bytes y 32 turnos; no aumenta el presupuesto.
El historial persistido no se borra ni cambia. La evaluación de seguridad sigue
considerando el historial original, aunque el contexto de generación sea parcial.

**Tradeoff:** se puede conservar menos historial que antes. Se prefiere reconocer
que falta contexto a retener objetivos antiguos que podrían haber sido corregidos.
Todavía no hay un resumen verificable del trabajo omitido ni memoria entre chats.

## Verificaciones

- Regresión de continuidad: sufijo coherente y deduplicación del turno actual.
- Doce casos por tres modos, con SDK simulado: prompt y mensajes reales enviados
  al límite del proveedor, límites de salida y señal de contexto incompleto.
- Suite existente de política: tres modos y nueve idiomas, seguridad,
  indisponibilidad, bloqueo presupuestario y conservación de preguntas.
- TypeScript y comprobación de espacios del diff.
- Cuatro respuestas reales iniciales y dos ensayos dirigidos; no hay evaluación
  real completa de los doce casos en todos los modos o idiomas.

## Uso del banco

```sh
# Inventario y estimación conservadora; cero peticiones de IA:
npx tsx scripts/evaluate-chat-conversation.ts

# Tests offline:
npx tsx scripts/test-chat-continuity.ts
npx tsx scripts/test-chat-conversation-wiring.ts

# Opt-in explícito para una muestra de pago:
npx tsx scripts/evaluate-chat-conversation.ts --live --limit=4 --label=baseline
```

El evaluador detiene la muestra ante una respuesta automática y rechaza
una ejecución cuya estimación conservadora supere 3 USD. Ese techo es por
ejecución, no un nuevo presupuesto mensual ni el coste real facturado.
Las seis consultas realizadas tuvieron una suma conservadora de máximos de
aproximadamente 3,01 USD; no se afirma que esa sea la cantidad cobrada.

## Siguientes decisiones

1. Resolver el exceso de técnicas ante un intento todavía pendiente mediante
   una estrategia contrastada con respuestas reales, no acumulando prohibiciones.
2. Diseñar continuidad para historiales extensos con objetivos, intentos y
   resultados sustentados en mensajes originales, conservando correcciones y
   sin inventar memoria entre conversaciones.

No hay demostración de superioridad frente al mismo modelo sin NUXA,
validación clínica, ni medición de beneficios terapéuticos.
