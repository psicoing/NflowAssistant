# Ajuste localizado de exploración y seguridad

## Alcance

Conservar el tono breve, cálido, prudente y no diagnóstico aprobado por el
usuario. No reestructurar NEUROPSI ni añadir un cuestionario obligatorio.
No se modifica interfaz, proveedores, modelos, datos ni selección científica.
No se publica este cambio.

## Cambio

En la estrategia común se precisa cómo elegir el dato que falta antes de
otra recomendación: duración, repercusión o barrera, sin volver a preguntar
lo ya respondido y sin imponer más de una o dos preguntas pertinentes.

En la política común de los tres modos:

- Una combinación preocupante de tristeza persistente, pérdida de disfrute
  y retraimiento/dificultad importante para funcionar invita a aclarar
  directamente la seguridad personal cuando no se ha aclarado.
- La advertencia condicional no sustituye esa pregunta.
- No se afirma un diagnóstico ni una emergencia por esa combinación.
- Una tristeza aislada, un ejemplo educativo o lo dicho por el asistente no
  acredita riesgo personal del usuario.
- No se repiten preguntas ni avisos genéricos tras una aclaración actual sin
  datos nuevos. Una negación no garantiza seguridad futura.
- Si aparece peligro nuevo, ambiguo o creciente, se reevalúa; peligro
  inmediato conserva prioridad sobre conversación, estilo y no repetición.

Son instrucciones al modelo, no un diagnóstico por palabras clave, ni un
clasificador calibrado, ni una garantía de conducta.

## Evaluación

Ocho casos **sintéticos de desarrollo**, separados de casos reservados A/B,
en ES/EN/FR: combinación preocupante; barrera tras seguridad aclarada;
peligro nuevo; tristeza puntual; cambio de tratamiento; caso en inglés;
continuidad en francés; consulta educativa.

No se copia el archivo de conversación aportado a memoria, fixtures ni
informes. Cada caso incluye criterios cualitativos para revisión de salidas.

Comprobación offline del límite real con proveedor simulado:

```sh
npx tsx scripts/test-chat-conversation-wiring.ts
```

Inventario y estimación conservadora sin generar respuestas:

```sh
npx tsx scripts/evaluate-chat-conversation.ts --mood --limit=8
```

Las llamadas reales siguen requiriendo autorización específica después de
presentar coste; `--live` está desactivado por defecto. Una ejecución real
debe revisar los ocho contrastes en los tres modos, respetando techo por
ejecución y presupuesto existente, no declarar aprobado por palabras clave.
La rúbrica prioriza seguridad, continuidad, ausencia de diagnósticos,
proporcionalidad y no repetición, por encima de una coincidencia literal.

Las pruebas offline acreditan transporte de reglas y contexto, no que el
modelo haya mejorado sus respuestas ni eficacia clínica. No se retiran
salvaguardas para mejorar brevedad.
