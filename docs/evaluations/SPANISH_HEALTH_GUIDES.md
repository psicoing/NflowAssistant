# Guías españolas incorporadas a NEUROPSI

## Alcance y procedencia

Incorporación inicial comprobada el **13 de noviembre de 2026**, solo en
desarrollo, sin publicación, cambios de datos, cuentas, modelos o interfaz.
No se han enviado conversaciones reales a buscadores ni realizado llamadas
de IA de pago. La consulta web fue exclusivamente bibliográfica.

El índice pasa de 16 a **20 fichas editoriales recuperables**: cuatro fichas
nuevas, pertenecientes a **dos familias de guías**, no cuatro estudios
independientes. El límite sigue siendo tres fichas seleccionadas por turno,
y puede no recuperarse ninguna. No se han indexado libros ni PDF completos.

## Material comprobado

| Ficha | Apartado efectivamente sintetizado | Población y fecha |
|---|---|---|
| E17 | [GPC de TAG, atención inicial](https://portal.guiasalud.es/guia-en-capas/gpc_641_trastorno_ansiedad_generalizada_ap/#question-1) | Adultos con TAG; recomendaciones fechadas el 27/11/2024 |
| E18 | [TAG, autocuidado para pacientes](https://portal.guiasalud.es/egpc/pacientes_641_tag_autocuidado/) | Adultos; material de la guía de 2024, HTML publicado en 2025 |
| E19 | [Depresión adulta, evaluación y manejo general](https://portal.guiasalud.es/egpc/depresion-adulto-recomendaciones/) | Adultos; revisión de la guía en mayo de 2023 según ficha oficial; edición inicial no establecida en esta incorporación |
| E20 | [Depresión adulta, actividades y adaptación](https://portal.guiasalud.es/egpc/pacientes-depresion-adulto-recomendaciones/) | Adultos; fecha de edición de este apartado no establecida |

Comprobaciones de contexto y vigencia declarada:

- [Ficha de TAG](https://portal.guiasalud.es/gpc/tratamiento-trastorno-ansiedad-generalizada-atencion-primaria):
  actualización parcial de la guía de 2008; no cubre todos los trastornos de
  ansiedad ni infancia/adolescencia. Elaboración SESCS; promoción y financiación
  del Ministerio de Sanidad.
- [Introducción para pacientes con TAG](https://portal.guiasalud.es/egpc/pacientes_641_tag_introduccion/):
  identifica el documento de 2024 y su procedencia.
- [Ficha de depresión adulta](https://portal.guiasalud.es/gpc/depresion-adulto):
  revisión de mayo de 2023 que mantiene recomendaciones de primera línea;
  adenda de tablas enlazada de 2024. **No equivale a una revisión hasta 2026.**
- [Información para pacientes sobre depresión](https://portal.guiasalud.es/egpc/pacientes-depresion-adulto-que-es/):
  diferencia tristeza ocasional del trastorno y no lo atribuye a debilidad.

La certeza declarada para la atención inicial del TAG es muy baja y de buena
práctica/consenso. No se ha puntuado la calidad metodológica global de estas
guías: sigue explícitamente desconocida. Una institución oficial no convierte
todo su contenido en evidencia de certeza alta.

## Integración y límites

- Se conservan las 16 fichas originales y el catálogo separado de revistas.
- Las cuatro fichas entran en el índice real, no solo en un catálogo.
- Metadatos de idioma español, población adulta, resumen original, fecha de
  comprobación y limitaciones viajan con los fragmentos al generador.
- Las familias compartidas quedan identificadas; el número de fichas no debe
  interpretarse como número de evidencias independientes.
- No se extrapolan documentos adultos a consultas identificadas sobre menores.
- No se convierte tristeza, estrés o duelo en diagnóstico de depresión.
  Los conceptos de búsqueda no son diagnósticos.
- No se han incorporado pautas de medicación, algoritmos diagnósticos, escalas
  para autodiagnóstico ni técnicas clínicas para aplicación autónoma por el bot.
- Las urgencias siguen evitando la recuperación documental y no esperan al
  revisor.
- El revisor solo puede citar documentos recuperados para ese turno; el
  servidor comprueba referencias y fragmentos literales.
- No hay búsquedas externas nuevas por conversación ni aumento del máximo de
  fuentes. La longitud de las nuevas fichas puede cambiar el número de tokens;
  se mantienen las políticas y límites presupuestarios existentes, no se
  promete coste idéntico.
- Las síntesis son originales y limitadas; no reproducen guías completas,
  imágenes ni tablas. No se afirma licencia para redistribuir los originales
  ni aval del Ministerio a NUXA.

## Verificación

Pruebas offline, sin proveedor real ni base de datos:

- `npx tsx scripts/test-spanish-health-sources.ts`: 20 fichas, dos familias,
  pertinencia ES/EN/FR, menores, urgencias, fechas desconocidas, revisiones,
  límites en el contexto, citas recuperadas y rechazo de citas inventadas.
- `npx tsx scripts/test-scientific-engine.ts`: regresiones del motor y llegada
  del material de depresión al generador real con proveedor simulado en ES/EN/FR.
- `npx tsx scripts/test-chat-evidence.ts`: casos previos en tres modos.
- `npx tsx scripts/test-chat-grounding.ts` y
  `npx tsx scripts/test-chat-grounding-integration.ts`: revisión y fallo seguro.
- `npm run build`: tipos y compilación.

Estas pruebas comprueban la integración y las restricciones, **no la calidad
semántica de respuestas nuevas con IA real ni la eficacia clínica**. No se
declara incorporado todo el catálogo de Sanidad o GuíaSalud. Quedan para otra
ampliación las guías de menores, conducta suicida, adicciones y otros problemas,
con revisión de vigencia y alcance antes de activarlas.
