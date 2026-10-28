# NEUROPSI: seguridad, continuidad y preparación de evaluación

## Resultado de esta entrega

Implementación y verificación en desarrollo, sin publicación ni consultas
de IA de pago. No se modificaron interfaz, modelos, proveedores, presupuestos,
pagos, voz, SEO, esquema de datos ni contenido del corpus científico.
No se añadió memoria persistente ni entre conversaciones.

## B — Procedencia del historial

Se volvió a ejecutar la suite HTTP existente con las rutas activas extraídas
literalmente y PostgreSQL temporal aislado. **77 peticiones: PASS**.
El doble de generación de esa suite usa ahora el mismo preparador de contexto
que el manejador real, sin introducir un camino de selección más permisivo.

Se mantienen controles de sesión, propietario, procedencia del servidor,
exclusión del historial antiguo no acreditado, referencias auténticas,
rechazo de campos manipulados y cuotas correctas ante fallos.
No se declara auditado el sistema completo ni comprobada la publicación.

## C — Primera mejora implementada

El manejador real utiliza un contexto extractivo de trabajo:

- En conversaciones cortas conserva exactamente la selección anterior.
- Si el contexto se agota, prueba reservar hasta 2.048 de los **8.192 bytes
  históricos existentes** para intervenciones anteriores completas del usuario.
- Conserva hasta 32 intervenciones anteriores del usuario y hasta 32 turnos
  del tramo reciente, siempre dentro del límite conjunto de bytes.
- No salta una intervención de usuario que no cabe para recuperar otra más
  antigua. No recorta frases ni genera resúmenes.
- Solo adopta la extracción si conserva más intervenciones del usuario
  que la selección anterior. En otro caso mantiene el contexto anterior.
- Explica al modelo y al revisor qué parte es extracción literal, que faltan
  respuestas intermedias del asistente y que no son hechos verificados.
- Ambos reciben los mismos mensajes y citas. No hay un almacén de recuerdos
  separado con referencias más permisivas.
- Mantiene la evaluación urgente sobre el historial autorizado original.
- No añade una tercera llamada de IA: el flujo normal conserva generación
  y revisión, y la vía urgente sigue sin esperar esa segunda llamada.

Esta mejora permite conservar más relato, correcciones y resultados explícitos
ante respuestas extensas del asistente. **No garantiza continuidad ilimitada**,
clasificación semántica correcta ni preservación de todo objetivo o corrección.
En los extractos antiguos pueden faltar los referentes de frases como
«lo intenté»; no se deben inventar. Las rectificaciones solo expresadas por el
asistente pueden quedar fuera del extracto. Son límites para evaluar, no
capacidades resueltas.

Tampoco se garantiza menor coste: el límite de texto histórico no aumenta,
pero puede haber más encuadres de mensajes e instrucciones. Todas las llamadas
siguen pasando por la política de costes y los presupuestos existentes.

## D — Preparación, no comparación ejecutada

Se han reservado ocho casos sintéticos ES/EN/FR con criterios de corrección,
resultados parciales, propuesta no intentada, cambio de objetivo, terceros,
incertidumbre, orientación general y urgencia. El manifiesto comprueba su
huella SHA-256 y cantidad.

El preparador offline registra huellas de código/corpus y crea una plantilla
A/B sin respuestas, puntuaciones ni asignación de brazos. No importa proveedores
ni base de datos y no acepta ejecución `--live`. No es todavía un ejecutor
de comparación: faltan autorización de gasto, protocolo operativo de ambos
brazos, versión efectiva del modelo, muestra suficiente, aleatorización
y revisores independientes.

Los casos reservados no se utilizaron para ajustar el selector ni para generar
respuestas. Sus escenarios y criterios son visibles en el repositorio:
no se declara independencia ciega ni independencia del entrenamiento del modelo.
El banco tampoco cubre por sí solo conversaciones largas; hace falta ampliar
esa evaluación con casos reservados por un revisor no implicado en los ajustes.

No se ha medido ventaja sobre el modelo base ni eficacia clínica.

## E — Criterio de trabajo preparado

El protocolo fija que las ampliaciones científicas respondan a errores
clasificados y medidos. No se han añadido documentos o instrucciones científicas
sin esa evaluación previa.

## Verificación

| Comprobación | Resultado |
|---|---|
| Seguridad HTTP y almacenamiento temporal: 77 peticiones | PASS |
| Contexto extractivo: casos de desarrollo y 120 escenarios deterministas | PASS |
| Continuidad previa y 12 escenarios sintéticos | PASS |
| Referencias, autores, fragmentos y validación del revisor | PASS |
| Integración real del manejador con proveedor simulado, incluida conversación larga | PASS |
| Política del chat: tres modos y nueve idiomas | PASS |
| Consistencia de los seis casos de certeza | PASS |
| Regresiones del motor científico | PASS |
| Preparador offline: manifiesto, ocho casos, cero llamadas | PASS |
| TypeScript y compilación de producción (`npm run build`) | PASS |
| Comprobación del diff | PASS |

La primera ejecución del test científico encontró una expectativa antigua:
suponía que un turno anterior a los últimos 32 nunca se transmitía. Con la
extracción eso ya no es cierto. La prueba se actualizó para comprobar omisión
real detrás de una corrección demasiado extensa, verificando además que el
turno antiguo no se envía. La regresión corregida pasó; no se modificó el motor.

Se reinició una vez el workflow de desarrollo y llegó a
`application ready on port 5000`. Persiste el aviso previo de clave duplicada
en la inicialización del administrador; no impide el arranque y no se modificó.
La captura de la página pública muestra que la aplicación renderiza.
El chat con sesión no se verificó visualmente: su integración se comprobó
mediante pruebas HTTP aisladas y el manejador con proveedor simulado.

Estas verificaciones comprueban comportamiento del código y transporte del
contexto, **no calidad semántica de respuestas nuevas de una IA real**.

## Comandos reproducibles, sin llamadas de pago

```sh
npx tsx scripts/test-chat-history-security.ts
npx tsx scripts/test-chat-working-context.ts
npx tsx scripts/test-chat-continuity.ts
npx tsx scripts/test-chat-grounding.ts
npx tsx scripts/test-chat-grounding-integration.ts
npx tsx scripts/test-chat-policy.ts
npx tsx scripts/test-chat-certainty-cases.ts
npx tsx scripts/test-scientific-engine.ts
npx tsx scripts/prepare-neuropsi-comparison.ts
npm run build
git diff --check
```

El protocolo de aceptación y comparación está en `NEUROPSI_BCDE_PROTOCOL.md`.
No publicar hasta revisar esta entrega y autorizar ese paso.
