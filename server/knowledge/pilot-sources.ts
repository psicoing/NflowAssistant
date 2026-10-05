export type EvidenceTopic = "anxiety" | "work-stress";

export interface EvidenceSource {
  id: string;
  title: string;
  publisher: string;
  url: string;
  kind: "clinical-guideline" | "institutional-information" | "self-help-guide" | "occupational-guidance"
    | "systematic-review" | "research-article" | "academic-reference" | "professional-consensus" | "theoretical-literature";
  publicationDate: string | null;
  verifiedAt: string;
  topics: EvidenceTopic[];
  tags: string[];
  summary: string;
  limits: string;
}

// Original editorial summaries of public pages read on this date, NOT full books,
// downloaded clinical records, a model training corpus or live web search results.
// null means the publication date was not established, not that the page is current.
export const pilotSources: readonly EvidenceSource[] = [
  {
    id: "E01", title: "Anxiety disorders", publisher: "OMS",
    url: "https://www.who.int/news-room/fact-sheets/detail/anxiety-disorders",
    kind: "institutional-information", publicationDate: "2026-09-15", verifiedAt: "2026-10-05",
    topics: ["anxiety"], tags: ["overview", "worry", "help"],
    summary: "Sentir ansiedad ocasional no equivale a un trastorno. El miedo o preocupación intensos y persistentes pueden afectar la vida familiar, social, escolar o laboral. Existen intervenciones psicológicas y otras opciones de atención; la elección requiere valoración profesional.",
    limits: "Información general; no permite diagnosticar por chat ni prometer resultados individuales. La evidencia de una intervención no demuestra eficacia específica de NUXA.",
  },
  {
    id: "E02", title: "Generalized Anxiety Disorder: What You Need to Know", publisher: "NIMH",
    url: "https://www.nimh.nih.gov/health/publications/generalized-anxiety-disorder-gad",
    kind: "institutional-information", publicationDate: null, verifiedAt: "2026-10-05",
    topics: ["anxiety"], tags: ["worry", "help", "children"],
    summary: "La preocupación ocasional difiere de la preocupación persistente que dificulta la vida cotidiana. Pueden aparecer tensión, dificultades de concentración o sueño. En menores las preocupaciones pueden relacionarse con estudios, amistades y miedo a equivocarse. La evaluación considera contexto e impacto.",
    limits: "Los síntomas descritos son inespecíficos. No usar criterios o duración como diagnóstico automático ni afirmar que una persona tiene ansiedad generalizada.",
  },
  {
    id: "E03", title: "Panic Disorder: What You Need to Know", publisher: "NIMH",
    url: "https://www.nimh.nih.gov/health/publications/panic-disorder-when-fear-overwhelms",
    kind: "institutional-information", publicationDate: null, verifiedAt: "2026-10-05",
    topics: ["anxiety"], tags: ["panic", "help"],
    summary: "Un ataque de pánico puede implicar una oleada súbita de miedo y síntomas físicos. Un ataque aislado no significa un trastorno de pánico. El miedo a nuevos ataques y la evitación pueden limitar actividades. La valoración profesional ayuda a distinguir causas y opciones de atención.",
    limits: "No atribuir dolor torácico, falta de aire u otros síntomas nuevos a pánico sin evaluación médica; no ofrecer garantías de que los síntomas físicos son inofensivos.",
  },
  {
    id: "E04", title: "Anxiety, fear and panic", publisher: "NHS",
    url: "https://www.nhs.uk/mental-health/feelings-symptoms-behaviours/feelings-and-symptoms/anxiety-fear-panic/",
    kind: "institutional-information", publicationDate: null, verifiedAt: "2026-10-05",
    topics: ["anxiety"], tags: ["overview", "panic", "help"],
    summary: "La ansiedad puede afectar sensaciones físicas, pensamientos y conducta. Hablar con alguien, pequeños objetivos y actividades de autocuidado pueden ayudar. Si cuesta afrontarla o afecta la vida, conviene pedir apoyo profesional. No autodiagnosticarse: algunas manifestaciones tienen otras causas.",
    limits: "Los canales asistenciales británicos de la página no se trasladan a otros países. Autocuidado no sustituye atención sanitaria ni ayuda urgente.",
  },
  {
    id: "E05", title: "Breathing exercises for stress", publisher: "NHS",
    url: "https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/breathing-exercises-for-stress/",
    kind: "self-help-guide", publicationDate: null, verifiedAt: "2026-10-05",
    topics: ["anxiety", "work-stress"], tags: ["breathing", "practical"],
    summary: "En una postura cómoda, dejar que la respiración fluya suavemente sin forzar. La guía propone inspirar por la nariz y espirar por la boca; contar despacio puede servir si resulta cómodo. Practicar regularmente puede ayudar a manejar estrés. No exige retener el aire ni alcanzar una cuenta determinada.",
    limits: "Ejercicio opcional, no una cura ni tratamiento de una emergencia. No imponer apnea ni respiraciones intensas; si aumenta el malestar, parar y buscar otra forma de apoyo.",
  },
  {
    id: "E06", title: "Insomnia", publisher: "NHS",
    url: "https://www.nhs.uk/conditions/insomnia/",
    kind: "institutional-information", publicationDate: null, verifiedAt: "2026-10-05",
    topics: ["anxiety", "work-stress"], tags: ["sleep", "shifts", "practical", "help"],
    summary: "El estrés, ansiedad, cafeína, alcohol, entorno y turnos pueden contribuir a problemas de sueño. Mantener horarios regulares y una rutina de descanso son medidas generales. Si cambiar hábitos no ayuda o dormir mal afecta la vida diaria, pedir valoración profesional.",
    limits: "No asegurar que todos los problemas de sueño son ansiedad. No recomendar dosis, somníferos ni cambios de medicación; adaptar hábitos a posibilidades reales como trabajo por turnos.",
  },
  {
    id: "E07", title: "Stress", publisher: "NHS",
    url: "https://www.nhs.uk/mental-health/feelings-symptoms-behaviours/feelings-and-symptoms/stress/",
    kind: "institutional-information", publicationDate: null, verifiedAt: "2026-10-05",
    topics: ["anxiety", "work-stress"], tags: ["overview", "practical", "help"],
    summary: "El estrés puede afectar concentración, decisiones, sueño y conducta. Identificar lo que lo provoca, dividir tareas y hablar con alguien son medidas generales de apoyo. Si resulta difícil afrontarlo o interfiere con la vida diaria, buscar ayuda profesional.",
    limits: "No presentar una lista de autocuidado como solución suficiente para sobrecarga organizativa, violencia, problemas médicos o una crisis.",
  },
  {
    id: "E08", title: "Generalised anxiety disorder and panic disorder in adults: management (CG113)", publisher: "NICE",
    url: "https://www.nice.org.uk/guidance/cg113/chapter/Recommendations",
    kind: "clinical-guideline", publicationDate: "2011-01-26 (actualización 2020-06-15)", verifiedAt: "2026-10-05",
    topics: ["anxiety"], tags: ["help", "evidence", "treatment"],
    summary: "La guía para adultos organiza la atención por pasos según necesidades, impacto funcional y respuesta previa. Incluye educación y seguimiento, autoayuda estructurada y atención psicológica o farmacológica profesional. Las preferencias de la persona y la valoración clínica importan.",
    limits: "Guía británica para adultos; no extrapolar a menores ni convertir pasos de atención en prescripción individual. NUXA no equivale a terapia guiada o atención clínica.",
  },
  {
    id: "E09", title: "Doing What Matters in Times of Stress: An Illustrated Guide", publisher: "OMS",
    url: "https://www.who.int/publications/i/item/9789240003927",
    kind: "self-help-guide", publicationDate: "2020", verifiedAt: "2026-10-05",
    topics: ["anxiety", "work-stress"], tags: ["practical", "evidence"],
    summary: "La OMS presenta una guía de habilidades prácticas para afrontar adversidad y estrés, informada por evidencia y pruebas de campo. Puede practicarse unos minutos al día, con el material escrito o ejercicios de audio. Es un recurso de autoayuda general.",
    limits: "La página de presentación no demuestra que un ejercicio inventado o NUXA estén validados por la OMS. No afirmar porcentajes de eficacia ni sustituir atención necesaria.",
  },
  {
    id: "E10", title: "Mental health at work", publisher: "OMS",
    url: "https://www.who.int/news-room/fact-sheets/detail/mental-health-at-work",
    kind: "institutional-information", publicationDate: "2026-09-15", verifiedAt: "2026-10-05",
    topics: ["work-stress"], tags: ["overview", "workload", "prevention", "return", "bullying"],
    summary: "Sobrecarga, poco control, horarios inflexibles, inseguridad, discriminación y acoso son riesgos para la salud mental laboral. La prevención incluye cambios organizativos y participación de trabajadores, formación y apoyo. La reincorporación puede requerir ajustes y coordinación con atención profesional.",
    limits: "No responsabilizar únicamente al trabajador ni reducir riesgos organizativos a respiración o actitud. No prometer ajustes, bajas, derechos o resultados legales sin jurisdicción y asesoramiento.",
  },
  {
    id: "E11", title: "Burn-out an occupational phenomenon", publisher: "OMS",
    url: "https://www.who.int/standards/classifications/frequently-asked-questions/burn-out-an-occupational-phenomenon",
    kind: "institutional-information", publicationDate: null, verifiedAt: "2026-10-05",
    topics: ["work-stress"], tags: ["burnout", "evidence"],
    summary: "En CIE-11, burnout se describe como un fenómeno ocupacional asociado al estrés laboral crónico no gestionado, no como una enfermedad médica. Se caracteriza por agotamiento, distancia mental o cinismo respecto al trabajo y menor eficacia profesional. El término se refiere al contexto laboral.",
    limits: "Esta definición no permite atribuir burnout por chat ni descartar depresión u otras causas de cansancio. No aplicar la etiqueta automáticamente a dificultades fuera del trabajo.",
  },
  {
    id: "E12", title: "Estrés laboral", publisher: "INSST",
    url: "https://www.insst.es/materias/riesgos/riesgos-psicosociales/estres-laboral",
    kind: "occupational-guidance", publicationDate: null, verifiedAt: "2026-10-05",
    topics: ["work-stress"], tags: ["workload", "control", "prevention", "overview"],
    summary: "El estrés laboral se relaciona con exposición a condiciones psicosociales desfavorables y desequilibrio entre exigencias y recursos percibidos. Sobrecarga, plazos ajustados y falta de control son factores importantes. La evaluación analiza condiciones de trabajo y la prevención actúa sobre ellas.",
    limits: "No concluir que el problema es debilidad individual. No convertir una conversación o cuestionario informal en evaluación oficial de riesgos psicosociales.",
  },
  {
    id: "E13", title: "Work-related stress: causes of stress at work", publisher: "HSE",
    url: "https://www.hse.gov.uk/stress/causes.htm",
    kind: "occupational-guidance", publicationDate: null, verifiedAt: "2026-10-05",
    topics: ["work-stress"], tags: ["workload", "control", "support", "prevention"],
    summary: "El marco británico identifica seis áreas del diseño del trabajo: demandas, control, apoyo, relaciones, rol y cambio. Por ejemplo, exigencias excesivas, poca autonomía, falta de información o apoyo y responsabilidades poco claras pueden contribuir al estrés.",
    limits: "Marco organizativo, no prueba diagnóstica. Usarlo como orientación general; no presentar obligaciones legales británicas como aplicables en otro país.",
  },
  {
    id: "E14", title: "Work-related stress: stress risk assessment", publisher: "HSE",
    url: "https://www.hse.gov.uk/stress/risk-assessment.htm",
    kind: "occupational-guidance", publicationDate: null, verifiedAt: "2026-10-05",
    topics: ["work-stress"], tags: ["prevention", "manager", "bullying"],
    summary: "La prevención organiza identificación de riesgos, evaluación y acciones para proteger a trabajadores. Propone revisar políticas frente al acoso y discriminación y utilizar el marco de seis áreas de trabajo. La evaluación debe conducir a medidas, no quedarse en recopilar respuestas.",
    limits: "La obligación legal descrita pertenece al Reino Unido. Para procedimientos o derechos concretos, preguntar país y remitir a prevención o asesoramiento local.",
  },
  {
    id: "E15", title: "Mental Health: Psychosocial Risk Factors in the Workplace", publisher: "CCOHS",
    url: "https://www.ccohs.ca/oshanswers/psychosocial/mh/mentalhealth_risk.html",
    kind: "occupational-guidance", publicationDate: null, verifiedAt: "2026-10-05",
    topics: ["work-stress"], tags: ["support", "workload", "control", "prevention", "manager"],
    summary: "El recurso canadiense describe factores como apoyo psicológico y social, respeto, claridad de expectativas, reconocimiento, participación, gestión de cargas y equilibrio trabajo-vida. Las condiciones organizativas pueden favorecer o perjudicar el bienestar.",
    limits: "El marco y su contexto normativo son canadienses. No diagnosticar ni trasladar leyes a otros países; elegir factores pertinentes en lugar de imponer una lista completa.",
  },
  {
    id: "E16", title: "Bullying in the Workplace", publisher: "CCOHS",
    url: "https://www.ccohs.ca/oshanswers/psychosocial/bullying.html",
    kind: "occupational-guidance", publicationDate: null, verifiedAt: "2026-10-05",
    topics: ["work-stress"], tags: ["bullying", "support"],
    summary: "El acoso laboral puede incluir conductas reiteradas que intimidan, humillan o aíslan, a veces sutiles. El recurso aconseja registrar hechos, conservar comunicaciones y utilizar canales de apoyo y procedimientos organizativos. Los ejemplos no constituyen una lista diagnóstica exhaustiva.",
    limits: "No calificar jurídicamente una situación ni recomendar confrontar a quien amenaza si eso aumenta el riesgo. Procedimientos y protecciones dependen del país y del contexto.",
  },
];
