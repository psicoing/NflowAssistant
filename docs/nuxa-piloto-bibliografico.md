# Piloto interno: ansiedad y estrés laboral

## Qué utiliza realmente el chat

Se conserva la biblioteca y el trabajo de ejemplos anterior. Se incorpora una
base de 16 páginas públicas institucionales o guías: OMS, NIMH, NHS, NICE,
INSST, HSE y CCOHS. Sus páginas se leyeron el 5 de octubre de 2026.

Cada ficha contiene URL exacta, organismo, tipo de documento, fecha de publicación
cuando se pudo establecer, fecha de comprobación, síntesis editorial y límites.
Una fecha de comprobación NO significa que la fuente se publicara ese día.
Las síntesis son redacción original, no copias de libros ni documentos completos.
La ficha pública de una guía tampoco equivale a haber leído su texto completo.

El servidor selecciona hasta tres fichas pertinentes usando términos y temas
ES/EN/FR, con contexto reciente solo para seguimientos breves. Recuperación
léxica determinista: no es búsqueda semántica con embeddings ni navegación web.
Los fragmentos llegan a la petición real de OpenAI en clásico, burbujas y breve.
No se añaden consultas a terceros, instalaciones o cambios de base de datos.
El corpus se empaqueta con el servidor, también en la compilación de producción.

## Referencias y precisión

El modelo puede usar `[E01]`, etc., junto a una afirmación sustentada por el
fragmento. El servidor resuelve solo identificadores recuperados en ese turno.
En el piloto descarta enlaces de referencia que no coinciden con una URL
recuperada. Los tres formatos muestran enlaces HTTPS clicables, con apertura
separada y `noopener noreferrer`. Un enlace válido NO garantiza que el contenido
de la respuesta esté realmente respaldado: se necesita revisión de concordancia.

No se obliga a citar en una conversación emocional. Para turnos documentados,
las cuotas antiguas de diez secciones o tres libros no prevalecen sobre relevancia.
Fuera del piloto se conserva el formato habitual. Sin documentos, NUXA puede
seguir conversando, pero no debe fingir una consulta bibliográfica.
La evidencia sobre una técnica no demuestra eficacia, aval o validación de NUXA.

## Límites de seguridad

Las reglas comunes no cambian: no diagnóstico, prescripción, promesas de cura
ni aplicación automática de normativa extranjera. NICE CG113 es para adultos.
No se trasladan sus recomendaciones clínicas a menores.

Las señales precautorias de autolesión y síntomas como dolor torácico o
imposibilidad de respirar omiten la recuperación. La ayuda humana tiene prioridad,
también durante fallos del proveedor. Estas detecciones son heurísticas
conservadoras, NO triaje médico; pueden sobreactuar ante contextos educativos.

## Evaluación reproducible

```sh
npx tsx scripts/test-chat-evidence.ts
npx tsx scripts/test-chat-policy.ts
npm run build
npm run check
```

La evaluación offline cubre 30 preguntas sintéticas en los tres modos, temas
mixtos, menores, ES/EN/FR, seguimientos, falsas fuentes, crisis, síntomas físicos,
preguntas fuera del piloto, enlaces visibles y el límite real handler/proveedor.
No contiene cuentas ni conversaciones de pacientes. El proveedor se simula.

Para respuestas reales (30 peticiones como máximo, API de pago, modelo existente):

```sh
npx tsx scripts/evaluate-chat-evidence.ts --live
```

El intento del 5 de octubre de 2026 se detuvo tras tres respuestas de error
`billing_not_active` de OpenAI. **No se obtuvieron respuestas del modelo.**
No se cambió la clave, el modelo ni la cuenta. Los resultados de los intentos
están en `.local/evaluations/`; no equivalen a una evaluación de calidad superada.
El script detiene la evaluación ante tres fallos para no repetir peticiones inútiles.

Tras resolver el bloqueo del proveedor, revisar las 30 respuestas por utilidad,
idioma, límites no clínicos y correspondencia de cada cita con su fuente.
Los indicadores automáticos son solo estructurales. No hay comparación A/B
con el modelo anterior, revisión humana cualificada ni certificación clínica.
Nunca presentar este piloto como demostración de superioridad o eficacia clínica.

## Mantenimiento

Para ampliar el corpus, leer primero el documento original y registrar cambios
de contenido, fecha, alcance y límites. No añadir una URL solo por pertenecer a
un dominio institucional. Fechas desconocidas permanecen explícitamente vacías.
Revisar contenido y enlaces antes de ampliar/publicar y periódicamente después;
una respuesta HTTP correcta no valida la evidencia ni renueva su vigencia.
