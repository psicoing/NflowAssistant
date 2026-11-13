import type { EvidenceSource } from "./pilot-sources";

/**
 * Original, limited summaries of the specified HTML sections, checked on
 * 2026-11-13. No full-text copying, live patient searches or government endorsement.
 * Clinical/patient versions belong to TWO guideline families, not four
 * independent clinical studies. Publication dates are not verification dates.
 */
export const spanishHealthSources: readonly EvidenceSource[] = [
  {
    id: "E17",
    title: "Guía de Práctica Clínica para el Tratamiento del Trastorno de Ansiedad Generalizada en Atención Primaria — atención inicial",
    publisher: "Ministerio de Sanidad · SESCS · GuíaSalud / SNS",
    url: "https://portal.guiasalud.es/guia-en-capas/gpc_641_trastorno_ansiedad_generalizada_ap/#question-1",
    kind: "clinical-guideline",
    publicationDate: "2024-11-27",
    verifiedAt: "2026-11-13",
    topics: ["anxiety"],
    tags: ["treatment", "help", "support", "evidence"],
    summary: "Para adultos con TAG valorado por un profesional, la guía propone atención escalonada, información comprensible y decisiones compartidas. El profesional considera duración e impacto de los síntomas, contexto social, preferencias y respuesta a tratamientos previos. La psicoeducación y el autocuidado pueden formar parte del abordaje, junto con seguimiento profesional. Las recomendaciones de atención inicial son de buena práctica y consenso; la guía declara certeza muy baja para ese apartado.",
    limits: "Solo adultos con TAG: no extrapolar a menores, pánico u otros trastornos ni usar para diagnosticar desde el chat. Esta síntesis cubre únicamente atención inicial, no algoritmos, dosis ni pautas farmacológicas. No presentar consenso como ensayo ni a NUXA como tratamiento, profesional sanitario o herramienta avalada por el Ministerio. El acompañamiento no sustituye valoración ni seguimiento; las urgencias no esperan la consulta documental.",
  },
  {
    id: "E18",
    title: "Trastorno de Ansiedad Generalizada — información para pacientes adultos: estilo de vida y autocuidado",
    publisher: "SESCS · Ministerio de Sanidad · GuíaSalud / SNS",
    url: "https://portal.guiasalud.es/egpc/pacientes_641_tag_autocuidado/",
    kind: "self-help-guide",
    publicationDate: "2024",
    verifiedAt: "2026-11-13",
    topics: ["anxiety"],
    tags: ["practical", "support"],
    summary: "El material para adultos con TAG aconseja actividad física regular, alimentación equilibrada, descanso suficiente y apoyo de personas de confianza. Señala evitar estimulantes y otras sustancias no saludables y pedir ayuda sanitaria si se desea dejar de fumar. Presenta estos cuidados como apoyo al bienestar y al tratamiento, no como sustitutos del mismo.",
    limits: "Material de la misma guía de TAG de 2024, no evidencia independiente de E17; versión HTML publicada en 2025. No extrapolar a menores ni imponer hábitos como cura, obligación o explicación del malestar. No indicar retirada brusca de sustancias o medicamentos ni convertir autocuidado en tratamiento de urgencia. Solo se ha sintetizado este apartado, no el documento íntegro.",
  },
  {
    id: "E19",
    title: "Guía de Práctica Clínica sobre el Manejo de la Depresión en el Adulto — evaluación y recomendaciones generales",
    publisher: "Avalia-t / ACIS · Ministerio de Sanidad · GuíaSalud / SNS",
    url: "https://portal.guiasalud.es/egpc/depresion-adulto-recomendaciones/",
    kind: "clinical-guideline",
    publicationDate: null,
    verifiedAt: "2026-11-13",
    topics: ["depression"],
    tags: ["treatment", "help", "support", "evidence"],
    summary: "La guía considera esencial la entrevista clínica para diagnosticar depresión: las escalas no la sustituyen. Recomienda que el profesional valore duración e impacto, apoyo social, respuesta previa y seguridad; favorece comunicación empática y participación de la persona en las decisiones. Propone atención escalonada y coordinada entre atención primaria y salud mental, adaptada al estado y evolución. La ficha oficial informa que la revisión de mayo de 2023 mantuvo las recomendaciones de primera línea.",
    limits: "Guía para adultos, no para diagnosticar, graduar gravedad ni tratar a una persona por chat. Síntesis restringida a evaluación y manejo general; no se incorporan dosis, retirada de medicación, neuromodulación ni recomendaciones farmacológicas. No afirmar revisión de toda la literatura hasta 2026: la ficha cita revisión en 2023 y adenda de tablas en 2024. Las recomendaciones tienen grados distintos, no certeza uniforme; NUXA no sustituye atención sanitaria.",
  },
  {
    id: "E20",
    title: "La depresión — información para pacientes adultos: qué te puede ir bien",
    publisher: "Avalia-t / ACIS · GuíaSalud / SNS",
    url: "https://portal.guiasalud.es/egpc/pacientes-depresion-adulto-recomendaciones/",
    kind: "self-help-guide",
    publicationDate: null,
    verifiedAt: "2026-11-13",
    topics: ["depression"],
    tags: ["practical", "support"],
    summary: "El material propone actividades pequeñas y gratificantes sin exigirse demasiado, abordar problemas de uno en uno y aumentar la actividad física gradualmente según las posibilidades. Si algo no sale, se puede continuar con otra actividad sin castigarse. Aconseja observar qué resulta útil y compartirlo; reconoce que las recomendaciones no funcionan igual para todas las personas. Para dudas sobre ejercicio o consumo de sustancias remite a apoyo sanitario.",
    limits: "Material para adultos asociado a la guía de depresión, no estudio independiente de E19. La fecha de edición de este apartado no se ha establecido; su presencia en el portal no demuestra una revisión reciente de todo su contenido. No diagnosticar depresión por tristeza, prometer eficacia, culpabilizar ni sustituir tratamiento por ejercicio o rutinas. Solo se sintetizan actividades y adaptación; no se incorporan todas las recomendaciones de sueño ni pautas clínicas de la página.",
  },
];

export const spanishSourceMetadata = {
  E17: { family: "sns-tag-641", primary: ["anxiety", "worry"], secondary: ["rumination"], guideline: true },
  E18: { family: "sns-tag-641", primary: ["anxiety"], secondary: [], guideline: false },
  E19: { family: "sns-depression-534", primary: ["depression"], secondary: [], guideline: true },
  E20: { family: "sns-depression-534", primary: ["depression"], secondary: [], guideline: false },
} as const;
