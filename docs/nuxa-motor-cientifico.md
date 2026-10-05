# Motor científico interno de NUXA

## Alcance elegido

El usuario eligió probar primero el motor interno del documento
«Scientific & Clinical Knowledge Engine Upgrade». Se complementa el piloto,
no se reemplazan bibliografía, modelo, voz, historial, pagos o registro.
No se incorpora todavía un gestor administrativo ni una nueva sección de UI.
El asistente sigue siendo NUXA, no un profesional clínico o diagnóstico.

## Flujo efectivo

1. Clasificación heurística de la consulta y extracción de conceptos ES/EN/FR/CA.
2. Seguridad del turno y contexto reciente antes de cualquier recuperación.
3. Determinación de población objetivo: edad mencionada de un hijo, por ejemplo,
   no se sustituye por la edad del titular de la cuenta.
4. Recuperación léxica y ranking de síntesis editoriales documentadas.
5. Máximo tres fuentes con metadatos, límites y explicación de cobertura.
6. Contexto conceptual no diagnóstico y documental enviado al modelo existente.
7. Resolución de citas por el servidor y reglas comunes en los tres modos.

No hay embeddings, entrenamiento propio, búsqueda web en cada turno ni
un verificador médico de las respuestas. Identificar «atención» o «TDAH»
significa reconocer términos, no atribuir un trastorno. Las alternativas
contextuales son posibilidades para orientar preguntas, no un diferencial clínico.

## Conocimiento disponible y catálogo

Se conservan las 16 fuentes leídas del piloto. El esquema tiene 15 dominios
y reconoce conceptos de atención, memoria, funciones ejecutivas, sueño,
rumiación, regulación emocional y otros temas.

**Reconocer un concepto no implica tener documentos que lo respalden.**
Se informa cobertura nula o parcial cuando falta documentación específica.
Neuropsicología, autismo o TDAH no pasan a tener evidencia indexada solo por
estar reconocidos o figurar en el catálogo.

Las 17 revistas propuestas están en `scientific-catalogue.ts`, con estado
`catalogue-only`, sin URLs inventadas ni artículos indexados. PSICODOC y
ProQuest One Psychology tienen un contrato de conector y adaptadores explícitos
`not-configured`: no han sido consultados. No hay scraping, bypass o descarga.
Una futura conexión exige acceso autorizado y comprobación de derechos.

## Jerarquía y trazabilidad

El ranking combina coincidencia conceptual principal/secundaria, tipo de
evidencia, finalidad de la pregunta, población y fecha conocida. Relevancia
y adecuación de población preceden a la preferencia por una guía.
El esquema admite calidad metodológica revisada, muestra, replicación y
consistencia; solo contribuyen cuando constan, no se inventan.

Las fuentes actuales tienen calidad metodológica y tamaño de muestra
**desconocidos/no evaluados**. Una web institucional no equivale a un ensayo.
Autores, DOI, revista o año desconocidos permanecen vacíos. La lengua original
de una fuente se separa de la lengua de su síntesis.

Documentos deshabilitados, obsoletos, restringidos, de permisos desconocidos
o de solo metadatos no aportan texto al contexto. Las guías para adultos se
excluyen cuando la consulta trata sobre menores. El índice se mantiene inmutable.

## Caché y privacidad

Caché local de ranking, máximo 256 entradas y TTL de cinco minutos. Su clave
incluye revisión del corpus, conceptos, finalidad, población y características
de la pregunta. No guarda texto original, respuestas, cuentas ni historiales.
No se comparten respuestas entre usuarios. La revisión cambia si cambia el
corpus; una nueva instancia o reinicio crea su propia caché.

Las estadísticas son contadores internos de selección y uso de caché, no
analítica de pacientes ni número de respuestas. Construir el prompt y resolver
citas pueden producir dos selecciones para el mismo turno.

## Pruebas

```sh
npx tsx scripts/test-scientific-engine.ts
npx tsx scripts/test-chat-evidence.ts
npx tsx scripts/test-chat-policy.ts
npx tsx scripts/inspect-scientific-query.ts
npx tsx scripts/inspect-scientific-query.ts "No puc deixar de pensar a la nit i tinc ansietat"
npm run build
npm run check
```

Prueba real pequeña, explícitamente de pago y sin cuentas de pacientes:

```sh
npx tsx scripts/evaluate-chat-evidence.ts --live --scientific --limit=1
# Tras una conexión satisfactoria, cinco casos ES/EN/FR/CA y atención infantil:
npx tsx scripts/evaluate-chat-evidence.ts --live --scientific
```

La prueba pequeña se detiene ante el primer fallo del proveedor. La evaluación
amplia anterior conserva su límite de tres fallos. Los informes se guardan en
`.local/evaluations/`, con cobertura documental, conceptos, citas y tiempos.
El intento real del 5 de octubre de 2026 volvió a recibir tres errores
`429 billing_not_active`, sin respuestas del modelo. La consulta de metadatos
del modelo sí funcionó: autenticación y disponibilidad no prueban que la
facturación de generación esté activa. No se sustituyeron clave ni modelo.

Se comprueban conceptos en los cuatro idiomas, población, contexto alternativo,
ranking, permisos, corpus inmutable, caché y límites, seguridad contextual incluso
durante fallo del proveedor, y el límite real del handler/proveedor en tres modos.
Las pruebas usan respuestas simuladas y no acreditan calidad clínica o mejoras
empíricas del modelo. La evaluación real sigue pendiente del bloqueo
`billing_not_active` observado en el piloto anterior; no se hacen nuevos intentos
de pago ni se cambia el proveedor como parte de esta fase.

## Antes de ampliar

Leer y comprobar documentos concretos, no solo añadir nombres de revistas.
Registrar autoría, fecha, población, tipo de estudio, derechos y limitaciones.
Revisar correspondencia entre afirmaciones y fuentes con respuestas reales.
Un enlace válido, una puntuación de ranking o «cobertura completa» son datos de
recuperación, no confianza clínica ni certificación de exactitud.
