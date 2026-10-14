# NUXA / NEUROPSI-AI — Informe preliminar orientado por MI-CLAIM

**Fecha:** 14 de octubre de 2026.
**Carácter:** documento técnico interno; auditoría de implementación y evidencia disponible.
**Objeto:** asistente de bienestar emocional, no sistema diagnóstico ni tratamiento clínicamente validado.
**Estado:** primera fase, sin modificación del motor ni publicación.

## 1. Resumen ejecutivo

NEUROPSI está implementado principalmente como una composición de instrucciones, contexto conversacional acotado, recuperación documental local y revisión posterior por el mismo modelo. No se ha identificado entrenamiento propio, un modelo psicológico independiente ni un estado clínico estructurado que se actualice entre turnos.

Hay mecanismos efectivos para escuchar, aclarar, explicar o proponer una acción; distinguir propuesta, aceptación, intento y resultado; incorporar rectificaciones; y revisar afirmaciones personales frente a mensajes y documentos. Esos mecanismos llegan al flujo activo, pero su existencia no demuestra cumplimiento sistemático.

Las pruebas históricas ofrecen señales favorables en corrección de interpretaciones, prudencia diagnóstica y ayuda urgente. También documentan técnicas prematuras, atribuciones mejorables y orientación excesiva. La muestra es pequeña, sintética y evaluada cualitativamente por el agente; la revisión profesional independiente continúa pendiente.

La recuperación científica activa contiene 16 síntesis editoriales, fundamentalmente sobre ansiedad y estrés laboral. Reconocer conceptos de neuropsicología o desarrollo infantil no equivale a disponer de evidencia específica para ellos. La revisión por la misma IA tampoco constituye verificación independiente.

Los principales riesgos identificados son la autenticidad y pertenencia del historial utilizado como respaldo, la pérdida de trabajo previo por límites de contexto, el carácter correlacionado de generador y revisor, la limitada cobertura bibliográfica y el coste de generar un borrador que después puede no entregarse.

**No hay evidencia suficiente para afirmar validación clínica, beneficio terapéutico, calibración de certeza, ausencia de alucinaciones o superioridad sobre el mismo modelo base.**

## 2. Alcance, método y límites de esta auditoría

### Trabajo realizado

- Lectura del código activo desde la página de chat hasta las rutas, almacenamiento, manejador, recuperación, revisión y contabilidad.
- Consulta de la tabla original de MI-CLAIM y del repositorio de sus autores.
- Inspección de informes y metadatos de evaluaciones sintéticas ya existentes.
- Ejecución de cuatro suites locales con proveedores/router simulados, sin consultas de IA de pago.
- Elaboración de este informe y registro de la decisión metodológica, sin cambiar comportamiento.

### Trabajo no realizado

No se han consultado conversaciones de usuarios, datos de pacientes, secretos, saldos ni configuración privada del entorno. No se han ejecutado peticiones reales al modelo, alterado prompts, modelos, proveedores, seguridad, modos, interfaz, voz, pagos o producción. No se han publicado cambios ni creado tareas.

La auditoría describe el código del espacio de trabajo. **No certifica que ese mismo código o configuración estén desplegados en producción.** Los valores por defecto del código no prueban los valores efectivos del entorno.

### Tres niveles de evidencia

1. **Implementado:** comportamiento identificable en el flujo activo.
2. **Probado técnicamente:** aserciones locales o integración con respuestas simuladas; demuestran transporte, límites o validación, no calidad psicológica.
3. **Observado en respuestas reales:** muestras sintéticas históricas de IA, con reservas explícitas. No equivalen a evidencia clínica.

No se convierte una respuesta correctamente generada, una suite aprobada o una instrucción escrita en demostración científica de eficacia.

## 3. Sistema, modelo y arquitectura

### Modelo y selección de proveedor

`server/chat-ai-client.ts` admite selección `replit`, `openai` o `dual`; el valor por defecto en ausencia de configuración es `dual`. El modelo por defecto es `gpt-5.5-2026-04-23`; la política de precios admite ese identificador y `gpt-5.5`.

Las evaluaciones históricas examinadas registran **Replit y `gpt-5.5`**. No prueban que el identificador fechado por defecto haya sido evaluado ni que el proveedor efectivo actual o publicado sea exclusivamente Replit.

El router mantiene prompt y límites al cambiar de ruta. En modo dual solo permite el respaldo ante determinados rechazos confirmados de facturación o agotamiento presupuestario; no reintenta indiscriminadamente fallos que podrían haber sido cobrados. Generación y revisión pasan separadamente por el router: compartir identificador de modelo no garantiza compartir proveedor efectivo en ambos pases.

### Composición efectiva

```text
Página de chat
  → ruta autenticada y comprobación de acceso/cupo
  → persistencia del mensaje y lectura del historial
  → filtro temático y señales de seguridad
  → sufijo conversacional acotado
  → política común + perfil + preferencias
  → análisis conceptual + recuperación documental local
  → estrategia conversacional + presentación del modo
  → generación JSON mediante router y presupuesto
  → resolución de referencias por el servidor
  → si no es urgente: revisión de atribuciones con el mismo modelo
  → validación estructural y nueva resolución de referencias
  → respuesta final o aviso automático
  → liquidación del cupo y persistencia de la respuesta
```

No se observa un motor independiente que pruebe un razonamiento psicológico formal. Hay análisis heurístico previo y aplicación de instrucciones por el modelo general. No se expone ni se audita una cadena privada de pensamiento; se evalúan entradas, decisiones observables y salidas.

## 4. Recorrido real del mensaje y ramas

| Etapa | Comportamiento activo | Evidencia de código |
| --- | --- | --- |
| Entrada | La página envía contenido, perfil declarado, idioma y modo a `/api/conversations/:id/messages`, con sesión. | `client/src/pages/chat.tsx`, mutación de envío |
| Acceso | La ruta comprueba sesión, acceso y límite de preguntas; reserva cupo de prueba. | `server/routes.ts`, ruta de mensajes |
| Historial | Guarda primero el mensaje y recupera los mensajes ordenados por fecha de la conversación. | `server/storage.ts`, `createMessage` y `getMessages` |
| Filtro | La urgencia precede al filtro temático. Una consulta fuera de ámbito puede recibir respuesta automática sin llamar a IA ni consumir pregunta. | `processUserMessage` en `server/prompt-handler.ts` |
| Contexto | Elimina la duplicación del último mensaje actual y conserva hasta 32 turnos previos, con un máximo conjunto de 8.192 bytes. | `boundedChatHistory` en `server/chat-cost-policy.ts` |
| Seguridad | Examina el mensaje actual y hasta seis mensajes recientes del historial original, antes de reducirlo para generación. | `server/knowledge/scientific-query.ts` |
| Prompt | Combina política común, perfil de tres campos, preferencias, análisis conceptual/documental, estrategia, aviso de contexto incompleto y presentación compacta. | `buildChatPrompt` |
| Generación | Solicita JSON con texto y tipo de apoyo; usa un límite de 500 tokens en breve, 1.000 si hay señal urgente y 4.000 en los demás modos. | `generateChatResponse` |
| Citas | Recupera nuevamente las fuentes y convierte marcadores permitidos en enlaces; elimina marcadores no recuperados. | `server/chat-evidence.ts` |
| Urgencia | La señal urgente o `supportType=crisis` del borrador evita la segunda llamada para no retrasar orientación humana. | `generateChatResponse` |
| Revisión | En turnos ordinarios envía borrador, historial acotado, mensaje, perfil limitado y documentos al mismo modelo; acepta o corrige. | `server/chat-grounding.ts` |
| Validación | Comprueba JSON, categorías, IDs, citas literales, correspondencia con el texto final, tipos de autor y enlaces permitidos. No demuestra implicación semántica por sí sola. | `validateGroundingReview` |
| Entrega | Devuelve contenido, tipo de apoyo, clase de respuesta y etiquetas; solo una respuesta de IA entregada consume pregunta. | `processUserMessage`, `server/chat-question-quota.ts`, ruta de mensajes |
| Persistencia | Guarda texto y `responseKind`; el mapa interno de afirmaciones no se persiste con la conversación. | `server/routes.ts`, `shared/schema.ts` |

### Ramas y diferencias relevantes

- La ruta secundaria `/api/chat` llama al mismo manejador, pero no guarda aquí el mensaje/respuesta y no transmite un modo explícito: utiliza el modo clásico por defecto. No es la ruta de envío de la página examinada.
- Un fallo de revisión estructural devuelve un aviso automático, no el borrador, no consume pregunta y no se presenta como indisponibilidad de IA.
- Fallos de proveedor, límites de entrada o presupuesto tienen avisos diferenciados; ante señal urgente se conserva orientación humana estática.
- El `supportType` final se calcula también mediante reglas sobre el mensaje; no es necesariamente el mismo que produjo el modelo. La categoría de crisis del borrador se usa para omitir revisión, aunque el tipo devuelto pueda diferir.
- Las plantillas extensas, libros y ejemplos seleccionados siguen presentes y algunos se calculan, pero **no integran el prompt final retornado**. No deben contarse como intervención o bibliografía efectiva.

## 5. Comprensión compartida, continuidad y adaptación

| Capacidad | Implementación efectiva | Evidencia y límite |
| --- | --- | --- |
| Comprensión compartida | Instruye a reflejar dificultad/objetivo y comprobar interpretaciones solo cuando la incertidumbre cambia la orientación. | Una muestra histórica incorpora una corrección; no existe un estado formal de comprensión ni garantía por turno. |
| Continuidad | Distingue propuesta, aceptación, intento y resultado usando el historial disponible. | El selector de contexto se verifica localmente; una muestra real todavía añadió acciones con un intento pendiente. |
| Adaptación | Pide atender a beneficio, fracaso, empeoramiento y barreras, sin culpar ni insistir automáticamente. | Muestra favorable al dejar una intervención que empeoró; faltan repeticiones y evaluación independiente. |
| Prudencia | Prohíbe atribuir causas, trauma, intención o diagnóstico como hechos. | Casos de certeza y revisión ofrecen señales favorables; subsisten atribuciones y ampliaciones mejorables. |
| Escuchar/preguntar/intervenir | Escuchar, aclarar, actuar y explicar son enfoques combinables, no apartados obligatorios. | La decisión principal recae en el modelo, no en un planificador contrastado; el exceso de técnicas sigue abierto. |
| Rectificación | Las correcciones recientes deben prevalecer y las afirmaciones del asistente no acreditan hechos del usuario. | Solo funciona sobre contexto presente y auténtico; no hay almacenamiento estructurado de correcciones o su vigencia. |

Hay persistencia de mensajes de una conversación, pero no recuperación general entre conversaciones, resumen verificable de turnos omitidos ni memoria longitudinal estructurada de objetivos, intentos y resultados.

## 6. Hechos, hipótesis, incertidumbre y respaldo

El revisor distingue internamente:

- `reported`: relato explícito o perfil declarado; identifica una atribución, no verdad externamente comprobada.
- `hypothesis`: interpretación corregible, apoyada en datos individuales.
- `possibility`: posibilidad útil sin respaldo individual suficiente.
- `unknown`: reconocimiento de información insuficiente.
- `scientific`: afirmación general apoyada en un documento suministrado.
- `general`: psicoeducación orientativa no declarada como evidencia documental verificada.

Se separan mensajes del usuario, del asistente, perfil y documentos. Una hipótesis o relato requiere referencias a usuario/perfil; una afirmación científica exige documento. La comprobación literal verifica que las palabras existen, **no que su contenido apoye la conclusión**: esa decisión depende del revisor.

### Límites de certeza

- No se calculan probabilidades calibradas ni se ha medido sensibilidad/especificidad de estas categorías.
- El mapa abarca un máximo de ocho afirmaciones relevantes; no hay garantía de extracción exhaustiva.
- El revisor produce corrección y mapa en la misma petición; no hay tercer examen independiente de la corrección.
- Una afirmación puede clasificarse indebidamente como orientación general y el validador estructural no detectar su naturaleza personal.
- Un historial alterado puede contener citas literales válidas que no pertenezcan a un relato auténtico.
- Las respuestas automáticas persistidas entran en el historial porque el selector usa contenido e `isUser`, no filtra por `responseKind`; no son hechos personales, pero pueden ocupar contexto o afectar al diálogo.
- No se conserva el mapa por afirmación para reconstruir posteriormente cada decisión de una respuesta entregada.

## 7. Integración científica real

### Corpus activo

`pilot-sources.ts` contiene **16 fuentes**, adaptadas al índice local: OMS, NIMH, NHS, NICE, INSST, HSE y CCOHS. Son síntesis editoriales y orientación institucional; no una biblioteca completa de artículos ni un entrenamiento propio.

La recuperación utiliza conceptos y reglas léxicas, coincidencia principal/secundaria, características de la consulta, población, tipo de documento y fecha. Devuelve hasta tres fuentes. No hay embeddings ni búsqueda científica en directo.

La ausencia o parcialidad de cobertura se comunica al modelo. Las consultas de conversación sencilla y las urgentes no recuperan documentos. Las guías explícitamente adultas se excluyen para población infantil; las fuentes clasificadas como generales todavía necesitan juicio de aplicabilidad.

### Límites documentales

- Cobertura concentrada en ansiedad y estrés laboral, con aspectos relacionados de sueño, pánico, respiración y agotamiento.
- Reconocimiento de atención, memoria, autismo o TDAH no demuestra respaldo específico en el corpus.
- Las 17 revistas propuestas son un catálogo sin artículos indexados; PSICODOC y ProQuest tienen adaptadores no configurados.
- Autores, DOI, revista, muestra y calidad metodológica no evaluados se mantienen vacíos; no existe evaluación crítica independiente de cada síntesis en esta auditoría.
- `verifiedAt` es un metadato del corpus. Aquí no se han revalidado sus páginas, actualidad o concordancia de todos los resúmenes.
- Una fuente general nunca demuestra una causa, diagnóstico o intención de esta persona ni la eficacia de NUXA.

### Citas y observabilidad

El servidor restringe marcadores a las fuentes del turno y limita su conversión a tres citas. Con fuentes presentes, elimina URLs no permitidas; sin fuentes, esa limpieza no es equivalente y el control ordinario de enlaces queda también en manos del revisor. Las urgencias omiten ese revisor.

La recuperación se realiza al construir el prompt y de nuevo al resolver referencias. No añade llamadas externas, pero duplica selecciones y puede inflar contadores internos de uso; esos contadores no equivalen a consultas atendidas.

La caché de ranking tiene 256 entradas y cinco minutos de vigencia; no guarda el texto original del usuario. El índice incluye un `indexedAt` calculado al adaptarse, y su hash incluye los documentos completos: la revisión puede cambiar entre arranques sin variar el contenido científico. Para comparaciones reproducibles conviene distinguir revisión de contenido y momento de inicialización.

## 8. Evidencia disponible y verificación de esta fase

### Pruebas locales ejecutadas el 14 de octubre

| Suite | Resultado | Qué permite afirmar |
| --- | --- | --- |
| `scripts/test-chat-continuity.ts` | PASS | Sufijo contiguo, límites y deduplicación del mensaje actual. |
| `scripts/test-chat-grounding.ts` | PASS | Anclaje literal, autores, formato, enlaces, categorías, perfil y límites del revisor. |
| `scripts/test-chat-grounding-integration.ts` | PASS | Cableado generación/revisión, bloqueo de borrador inválido, cupo y rama urgente, con router simulado. |
| `scripts/test-scientific-engine.ts` | PASS | Conceptos, población, ranking, filtros, caché, catálogos y límite del proveedor simulado en tres modos. |

Los errores sintéticos impresos por pruebas negativas son esperados y no representan una llamada real fallida. Las suites no llaman a IA real ni a una base externa. No se ha ejecutado un benchmark nuevo ni una prueba clínica.

### Muestras reales históricas revisadas

| Grupo | Material existente | Observaciones y reservas |
| --- | --- | --- |
| Continuidad, 8 de octubre | Cuatro escenarios iniciales y dos reensayos del intento pendiente. | Corrección, escucha y retirada de intervención con señales favorables. Persiste exceso de técnicas ante un intento todavía pendiente. No son seis casos independientes. |
| Certeza, 8 de octubre | Seis escenarios, una ejecución cada uno, en ES/EN/FR y modos alternados. | No se observaron los saltos centrales a diagnóstico, intención demostrada, causa exclusiva o país inferido. Hay reservas de atribución, proporcionalidad y generalizaciones jurídicas. |
| Revisor, 8 de octubre | Dos borradores incorrectos, repetidos posteriormente, y un control positivo: cinco ejecuciones directas sobre tres escenarios distintos. | Corrigió trauma/pareja inventados y diagnóstico indebidamente apoyado en OMS. Conservó una definición general sin documentos. No mide exhaustividad ni tasa de falsos rechazos. |
| Flujo completo con revisor | Un caso de certeza, clásico/español. | Entrega de IA y revisión completadas; persistieron expresiones e interpretaciones mejorables. Latencia registrada: 26.184 ms. |
| Motor científico, 5 de octubre | Una ejecución de tres escenarios y otra de uno. | Los informes registran respectivamente tres y un fallos de proveedor. No son evidencia de calidad de respuestas de IA. |

Fuentes originales en `.local/evaluations/`:

- `conversation-baseline-2026-10-08T09-29-36-746Z.json`
- `conversation-targeted-after-2026-10-08T09-32-56-847Z.json`
- `conversation-targeted-final-2026-10-08T09-34-27-235Z.json`
- `conversation-certainty-baseline-2026-10-08T09-42-22-895Z.json`
- `conversation-certainty-remaining-2026-10-08T09-45-55-962Z.json`
- `conversation-certainty-grounding-after-2026-10-08T10-11-59-470Z.json`
- `grounding-2026-10-08T10-11-33-660Z.json`
- `grounding-2026-10-08T10-33-29-620Z.json`
- `grounding-2026-10-08T10-36-53-045Z.json`
- `scientific-engine-2026-10-05T16-42-18-860Z.json`
- `scientific-engine-2026-10-05T16-46-37-929Z.json`

Las lecturas cualitativas están en `docs/evaluations/`. Los informes de conversación mantienen `humanReview=pending`; los del revisor requieren inspección y no se presentan como evaluación clínica. Los escenarios reutilizados para ajustes no constituyen un conjunto reservado independiente. Tampoco todas las muestras corresponden a la versión actual.

## 9. Errores, riesgos y costes adicionales

| Prioridad | Hallazgo | Naturaleza de la evidencia y consecuencia |
| --- | --- | --- |
| Alta | Autenticidad y pertenencia del historial no garantizadas en las rutas examinadas. | `POST /api/messages` permite insertar datos validados por esquema sin un control de sesión/autor dentro del manejador; el esquema admite `isUser`. Las rutas de mensajes/chat comprueban sesión, pero no pertenencia de la conversación al usuario antes de obtener contexto. `getMessages` filtra solo por ID de conversación. Hallazgo estático: no se ha intentado explotar ni consultado datos ajenos. Puede falsear el respaldo y mezclar contexto de distintas personas. |
| Alta | Omisión de contexto decisivo. | El sufijo contiguo evita saltar una corrección para retener datos antiguos; a cambio, un turno grande puede dejar muy poco historial o ninguno. No hay resumen verificable. |
| Alta | Generador y revisor comparten modelo. | Pueden compartir errores; la validación literal no sustituye juicio semántico independiente. Hasta ocho afirmaciones y corrección sin tercer pase. |
| Media-alta | Exceso de intervención pese a instrucciones. | Fallo observado en el caso histórico de intento pendiente. No hay evidencia de que añadir prohibiciones adicionales lo resuelva. |
| Media-alta | Señales de seguridad heurísticas amplias. | Palabras negadas, educativas o antecedentes en los seis turnos recientes pueden activar rama urgente y omitir revisión. Las instrucciones piden contextualizar, pero falta medición de falsos positivos/negativos. La categoría de crisis del propio borrador también omite revisión. |
| Media | Preferencias inferidas con reglas amplias. | Términos como «emocional», opciones antiguas o intensidad declarada pueden introducir preferencias/urgencia que no son una petición actual. La estrategia posterior intenta subordinarlas a la petición actual; no garantiza neutralizar el sesgo. |
| Media | Cobertura documental y contadores sobreinterpretables. | Conceptos reconocidos no son evidencia disponible; doble recuperación y metadatos temporales afectan observabilidad/reproducibilidad. |
| Media | Rechazo de una respuesta válida o cambio introducido al corregir. | Un solo control positivo no calibra falsos rechazos. El revisor puede añadir contenido o clasificar mal afirmaciones. |
| Media | Registros técnicos con contenido conversacional. | Las rutas y el manejador registran entradas y respuestas, incluso respuesta completa ante JSON inválido. No se han leído registros personales. Debe considerarse en minimización y en futura captura de evaluaciones. |
| Media | Diferencias entre ruta principal y secundaria. | Persistencia, modo, idioma y clasificación final no son idénticos; una evaluación directa del manejador no prueba autorización/persistencia de extremo a extremo. |
| Baja | Cálculo de material heredado no enviado. | Ejemplos y plantillas extensas confunden una auditoría superficial; no aportan tokens de esas plantillas al prompt final. |

### Coste y latencia

Un turno ordinario añade una segunda petición: hasta **1.600 tokens de salida**, además de su entrada con borrador, contexto y documentos. Ese límite incluye la salida contabilizada por el proveedor; no garantiza 1.600 tokens visibles de informe.

El borrador revisable tiene un máximo de **12.000 bytes**. Si excede ese límite, no se entrega sin revisar; la generación inicial puede haberse cobrado. Lo mismo sucede si falla la revisión o falta presupuesto para el segundo pase: no consumir una pregunta del cliente no significa coste cero para NUXA.

La contabilidad reserva por petición, no de forma conjunta para toda la pareja generación/revisión. El código contiene límites independientes de **25 USD para OpenAI y 20 USD para Replit**, y 45 USD como suma de ambos. Son valores encontrados en el código, no saldos verificados ni una autorización nueva; no se han modificado. Los precios de tokens son constantes documentadas en el código y no se han revalidado externamente en esta fase.

Los informes históricos guardan máximos conservadores, no gastos reales por escenario. Los ensayos directos del revisor registran entre aproximadamente cinco y doce segundos; el único flujo completo examinado registra unos 26 segundos. No son percentiles de producción ni permiten atribuir causalmente toda la diferencia al revisor.

## 10. Relación con MI-CLAIM original

Referencia: Norgeot y colaboradores, *Nature Medicine*, 2020, DOI [10.1038/s41591-020-1041-y](https://doi.org/10.1038/s41591-020-1041-y).
Tabla consultada: [MI-CLAIM, tabla 1](https://www.nature.com/articles/s41591-020-1041-y/tables/1).
Repositorio de autores: [beaunorgeot/MI-CLAIM](https://github.com/beaunorgeot/MI-CLAIM).

Las seis partes originales son diseño del estudio; datos; optimización; rendimiento; examen del modelo; reproducibilidad. La matriz siguiente parafrasea sus criterios, no presenta los criterios conversacionales añadidos como requisitos originales.

**Estados:** cumplido = documentado para esta adaptación; parcial = evidencia limitada/incompleta; no cumplido = falta evidencia necesaria; no aplicable = criterio literal no corresponde al sistema/estudio actual, sin ocultar la limitación equivalente. Ningún estado certifica cumplimiento clínico de NUXA.

| Parte / criterio original | Estado preliminar | Evidencia, adaptación o limitación |
| --- | --- | --- |
| 1. Problema clínico y contexto de uso | Parcial | Bienestar emocional y límites descritos; no existe aquí protocolo de estudio clínico con población y uso sanitario delimitados. |
| 1. Pregunta de investigación explícita | Cumplido para la adaptación | ¿Mejora NEUROPSI prudencia, comprensión, continuidad y utilidad respecto al mismo modelo con salvaguardas comunes? Es una pregunta, no un resultado. |
| 1. Características de cohortes de entrenamiento/test | Parcial | Se identifican escenarios sintéticos e idiomas/modos; no cohortes clínicas ni acceso al entrenamiento del proveedor. |
| 1. Representatividad respecto al entorno clínico real | No cumplido | Casos pequeños, seleccionados y sintéticos; sin muestreo representativo ni pacientes. |
| 1. Baseline de referencia identificado y detallado | Parcial | Comparación propuesta con el mismo modelo; aún no existe condición control ejecutada y fijada. |
| 2–3. Origen y formato de datos | Parcial | Texto no estructurado, perfil limitado y síntesis documentales identificados; falta manifiesto completo y versionado de evaluación. Entrenamiento externo no accesible. |
| 2–3. Transformaciones previas | Cumplido para la adaptación | Sufijo acotado, deduplicación, normalización, análisis conceptual, adaptación de fuentes y validación descritos en este informe. |
| 2–3. Independencia entre entrenamiento y test | No cumplido en la evaluación adaptada | No puede probarse independencia respecto al entrenamiento del proveedor; se han reutilizado casos para ajustar instrucciones y no hay holdout protegido. |
| 2–3. Modelos evaluados y código de selección | Parcial | Modelo/proveedor registrados históricamente y scripts existentes; no estudio de selección de modelos ni comparación formal de variantes. |
| 2–3. Tipo de entrada estructurada/no estructurada | Cumplido | Diálogo y síntesis: no estructurados; perfil, modos, metadatos y mapas: estructurados. |
| 4. Métrica primaria algorítmica y justificación | Parcial | Hay criterios cualitativos, pero no puntuación primaria previamente fijada, umbrales ni acuerdo entre evaluadores. AUC no es apropiada para este objetivo abierto sin adaptación. |
| 4. Métrica primaria de utilidad clínica | No cumplido | No hay resultados clínicos, escala validada de beneficio ni estudio de efecto terapéutico. PPV/NNT no son directamente aplicables al chat actual. |
| 4. Comparación con baseline y significación estadística | No cumplido | No hay ensayo A/B pareado, intervalos de confianza ni potencia justificada. |
| 5. Primera técnica de examen | Parcial | Inspección de contexto y regresiones estructurales actuales; sin demostrar por ellas calidad semántica. |
| 5. Segunda técnica de examen | Parcial | Casos de contradicción y fuente real mal aplicada, con pocas muestras; falta ablation y revisión independiente. |
| 5. Relación entre examen y rendimiento | Parcial | Errores documentados; no rendimiento cuantificado que permita establecer la relación. |
| 5. Interpretabilidad por caso y sus límites | Parcial | Atribuciones internas y citas disponibles durante revisión; no trazabilidad persistente completa ni acceso al razonamiento privado. |
| 5. Robustez ante cambio de distribución | No cumplido | Cobertura multilingüe técnica limitada y muestras reales pequeñas; no estudio de variaciones poblacionales, idiomáticas o cambios del proveedor. |
| 6. Nivel de transparencia/reproducibilidad | Parcial | Código e informes internos disponibles al propietario. No evaluación por tercero autorizada ni decisión de publicación abierta. Actualmente se mantiene sin difusión externa, equivalente al nivel 4 de compartición externa de la tabla, no a una certificación. |
| Entrenamiento/optimización propios y pesos publicables | No aplicable al componente propio actual | NEUROPSI no entrena aquí pesos. Debe declararse la opacidad del modelo externo; no convertir ausencia de acceso en cumplimiento de transparencia del proveedor. |

Cumplir una guía de información no equivale a demostrar eficacia, seguridad clínica, aprobación regulatoria ni aval de sus autores.

## 11. Metodología futura de comparación — diseñada, no ejecutada

### Pregunta y condiciones

- **A:** mismo identificador de modelo, contexto de usuario equivalente y política mínima común de identidad, no diagnóstico, seguridad urgente, privacidad y no invención de referencias. Sin las mejoras específicas que se quieran medir.
- **B:** NEUROPSI completo, incluidos estrategia, análisis, recuperación y revisión.
- Ambas condiciones usarían casos sintéticos en un evaluador aislado, nunca usuarios reales ni cambios de configuración de producción.
- Mantener en ambas las salvaguardas esenciales y el mismo preprocesamiento seguro del historial. No degradar deliberadamente la seguridad del control para favorecer B.
- Fijar idioma, modo, contexto, límites de generación inicial y parámetros disponibles. Registrar diferencias arquitectónicas intencionadas, incluidas las llamadas adicionales de B.

### Banco de evaluación

Separar casos de desarrollo de un conjunto reservado, construido antes del ensayo y no usado para ajustar instrucciones. Estratificar ansiedad, duelo, sueño, familia, trabajo, infancia, neuropsicología, riesgo, cambios de objetivo y conversaciones prolongadas. Incluir controles positivos, negaciones, terceros, ambigüedad, falta de fuentes, resultados parciales y correcciones.

La procedencia/autenticidad del historial debe verificarse antes de comparar. Añadir después pruebas controladas de historial manipulado sin escribir en cuentas reales.

### Evaluación

1. Fijar previamente una rúbrica 0–2: 0 = fallo, 1 = parcial, 2 = adecuado, con ejemplos de cada criterio.
2. Métrica primaria propuesta: proporción de conversaciones sin atribuciones personales no respaldadas y sin pérdida de una corrección esencial. Publicar también cada componente por separado.
3. Seguridad como criterio independiente no compensable por empatía o utilidad: cualquier fallo urgente grave se analiza por separado y bloquea una conclusión favorable general.
4. Métricas secundarias: comprensión compartida, continuidad, adaptación, utilidad, oportunidad de intervención, proporcionalidad, apoyo documental y rectificación.
5. Medir falsas aceptaciones, falsos rechazos, omisiones de afirmaciones y atribuciones nuevas introducidas al corregir.
6. Dos revisores humanos competentes, al menos uno con experiencia clínica pertinente, sin conocer A/B; resolver desacuerdos y registrar concordancia. No sustituirlos únicamente por el mismo modelo.
7. Varias repeticiones por caso y orden aleatorizado; dimensionar la muestra con el piloto y precisión deseada, no con un número arbitrario de consultas.
8. Comparación pareada y análisis agrupado por escenario: no tratar cada turno/repetición como persona independiente. Informar tamaño del efecto, intervalos y resultados negativos; no solo significación.
9. Analizar por idioma, modo, edad/población objetivo y dominio, sin generalizar donde la muestra sea insuficiente.
10. Medir latencia mediana y percentiles con muestras suficientes, tokens reales de todas las llamadas, coste estimado y gasto contabilizado cuando pueda atribuirse con seguridad.

Tras una comparación integral, ablations controladas permitirían identificar qué aporta estrategia, recuperación y revisión por separado. Se harían fuera del producto y manteniendo protección esencial; no están autorizadas ni ejecutadas por este informe.

### Reproducibilidad y privacidad

Cada ejecución futura debería registrar identificador solicitado y devuelto del modelo, proveedor efectivo por llamada, fecha, versiones/hashes estables de código, instrucciones y corpus, configuración disponible, escenario, contexto enviado, cobertura, resultado esperado/obtenido, decisión del revisor, puntuaciones y motivos, incidencias, duración y uso real.

No registrar razonamientos privados, secretos ni datos personales reales. Mantener los prompts completos y trazas sensibles en almacenamiento interno de acceso restringido si se autoriza; usar identificadores/hashes para informes compartibles. La anonimización no se presume por quitar nombres: por defecto, usar datos sintéticos.

No prometer respuestas idénticas: cambios del proveedor y variabilidad de generación pueden impedirlo. Buscar procedimiento repetible y variabilidad cuantificada.

**Puerta de autorización:** ninguna consulta de pago se ejecutará por este diseño. Una evaluación real futura requiere autorización explícita de número de casos y gasto, y respeto al presupuesto vigente.

## 12. Cinco mejoras prioritarias recomendadas, no implementadas

1. **Garantizar autenticidad, autoría y pertenencia del historial antes de usarlo como respaldo.** Confirmar en pruebas aisladas las rutas identificadas y planificar corrección de controles de conversación/autor bajo autorización específica. Sin esta base, la trazabilidad literal puede ser engañosa.
2. **Establecer un banco reservado y una evaluación independiente del revisor.** Medir falsos rechazos, falsas aceptaciones y correcciones que añaden contenido; comparar después con el mismo modelo sin favorecer artificialmente a NEUROPSI.
3. **Conservar el trabajo compartido en contextos largos de manera verificable.** Diseñar un estado/resumen sustentado en mensajes que preserve correcciones y distinga objetivos, propuestas, intentos y resultados; medirlo antes de incorporar memoria nueva.
4. **Ampliar y evaluar críticamente la evidencia en los dominios realmente usados.** Priorizar infancia/neuropsicología y huecos detectados; documentar población, vigencia, límites y permisos, sin confundir catálogo con corpus.
5. **Ajustar oportunidad, proporcionalidad y coste sobre resultados medidos.** Resolver técnicas prematuras y preferencias inferidas que no encajan; estudiar fallos después de generar, latencia y consumo de ambos pases, sin eliminar salvaguardas por ahorrar.

Estas recomendaciones no son tareas creadas, cambios autorizados, compromisos de gasto ni una solicitud de publicación.

## 13. Identificación del material auditado

Base de código: `23c7cfef4dbd2350c2ff800609e6425608851225`, sin modificaciones de motor por esta auditoría.

SHA-256 de componentes decisivos al inspeccionarlos:

| Archivo | SHA-256 |
| --- | --- |
| `server/prompt-handler.ts` | `9ae1358b18f98adf9b7d50827df5f2a2c038562ba84c93e40fa54f4550f7af48` |
| `server/chat-conversation-strategy.ts` | `3a3c283a57e65e5fccde9e480085b941d7d4c875b52ff657233e0a2a9cc5635c` |
| `server/chat-grounding.ts` | `d2d949746029c5a69e8b124a3cd051da8bf387ee97832e608bc7c3535ff0ba37` |
| `server/chat-cost-policy.ts` | `93efe81468a0fa2a8dbc2be3856a6c9051321a359748b017537b7c485baace54` |
| `server/knowledge/pilot-sources.ts` | `6989c50b329813a1c85a226d18f547eb1a01e083f5d01d7d02d2d42b21bc81c6` |

Referencias complementarias: `docs/nuxa-motor-cientifico.md`, `docs/evaluations/conversation-quality-2026-10-08.md`, `docs/evaluations/certainty-review-2026-10-08.md` y `docs/evaluations/grounding-review-2026-10-08.md`.

Este informe no reproduce prompts confidenciales completos ni conversaciones personales. Su conclusión se limita al material inspeccionado y a las verificaciones técnicas indicadas.
