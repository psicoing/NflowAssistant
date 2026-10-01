import type { Guide } from "./shared";

const guide: Guide = {
  id: "emotional-exhaustion",
  paths: { es: "/es/agotamiento-emocional", "en-us": "/en-us/emotional-exhaustion", "en-gb": "/en-gb/emotional-exhaustion", fr: "/fr/epuisement-emotionnel" },
  titles: {
    es: { title: "Agotamiento emocional: señales, límites y apoyo | NUXA", description: "Comprende el agotamiento emocional, revisa qué está consumiendo tus recursos y decide cuándo pedir ayuda.", h1: "Agotamiento emocional: señales, límites y apoyo" },
    "en-us": { title: "Emotional exhaustion: signs, boundaries, and support | NUXA", description: "Understand emotional exhaustion, identify what is draining your capacity, and decide when to seek support.", h1: "Emotional exhaustion: signs, boundaries, and support" },
    "en-gb": { title: "Emotional exhaustion: signs, boundaries, and support | NUXA", description: "Understand emotional exhaustion, identify what is draining your capacity, and decide when to seek support.", h1: "Emotional exhaustion: signs, boundaries, and support" },
    fr: { title: "Épuisement émotionnel : repères et soutien | NUXA", description: "Comprendre l'épuisement émotionnel, repérer ce qui mobilise vos ressources et savoir quand demander de l'aide.", h1: "Épuisement émotionnel : repères et soutien" },
  },
  summaries: {
    es: "El agotamiento emocional puede sentirse como falta de energía para afrontar demandas y recuperarse. Reduce lo no esencial, identifica qué consume recursos y revisa salud y condiciones externas; el término por sí solo no es un diagnóstico.",
    "en-us": "Emotional exhaustion can feel like having little capacity left to meet demands or recover. Reduce non-essential load, identify what is draining you, and consider health and external pressures; the phrase alone is not a diagnosis.",
    "en-gb": "Emotional exhaustion can feel like having little capacity left to meet demands or recover. Reduce non-essential load, identify what is draining you, and consider health and external pressures; the phrase alone is not a diagnosis.",
    fr: "L'épuisement émotionnel peut donner l'impression de manquer de ressources pour répondre aux demandes et récupérer. Réduisez le non-essentiel, repérez ce qui vous épuise et tenez compte de la santé et du contexte ; ce terme n'est pas un diagnostic.",
  },
  sections: {
    es: [
      { heading: "Qué puede significar sentirse agotado", paragraphs: ["Puedes notar cansancio, irritabilidad, distancia emocional o dificultad para concentrarte. Estas señales tienen muchas causas y no confirman por sí mismas un trastorno ni un burnout. Si el cansancio es nuevo o intenso, considera también causas físicas y consulta."] },
      { heading: "Busca qué demanda supera tus recursos", paragraphs: ["Haz un mapa sencillo de obligaciones, apoyos y momentos de recuperación. Distingue lo que puedes pausar, compartir o renegociar de lo que depende de otras personas o instituciones; no todo se resuelve con más disciplina individual."], bullets: ["Elige una tarea no urgente que puedas aplazar esta semana.", "Pide una ayuda delimitada en lugar de aceptar otra responsabilidad."] },
      { heading: "Protege recuperación sin exigir resultados", paragraphs: ["Planifica descanso y contacto con alguien seguro, incluso si al principio no sientes alivio. Mantener una rutina básica puede dar estructura, pero no necesitas convertir el descanso en otra tarea que debas hacer perfectamente."] },
      { heading: "Si el agotamiento está ligado al trabajo o a cuidados", paragraphs: ["Habla de carga, horarios, autonomía y recursos con quien pueda intervenir, si hacerlo es seguro. Cuidar a otra persona puede dejar poco tiempo propio: pide relevo o apoyo social concreto cuando esté disponible, sin asumir que la familia siempre puede proporcionarlo."] },
      { heading: "Cuándo consultar", paragraphs: ["Busca atención si el cansancio persiste, afecta el funcionamiento o coincide con bajo ánimo, ansiedad, dolor o cambios de sueño. La OMS clasifica el burnout como fenómeno ocupacional ligado al estrés crónico laboral, no como diagnóstico general de todo agotamiento. NUXA no diagnostica ni trata."] },
      { heading: "Apoyo urgente", paragraphs: ["En España, llama al 112 ante una urgencia o peligro inmediato. Para pensamientos suicidas puedes contactar con el 024; si el peligro es inminente, llama al 112 y busca apoyo cercano."] },
    ],
    "en-us": [
      { heading: "What feeling emotionally exhausted may mean", paragraphs: ["You might notice fatigue, irritability, emotional distance, or trouble concentrating. These signs have many possible causes and do not by themselves confirm a disorder or burnout. New or severe fatigue may also need medical assessment."] },
      { heading: "Find the demands exceeding your resources", paragraphs: ["Make a simple map of obligations, support, and chances to recover. Separate what you can pause, share, or renegotiate from what depends on other people or institutions; not every problem can be solved through individual effort."], bullets: ["Choose one non-urgent task to defer this week.", "Ask for bounded help instead of accepting another responsibility."] },
      { heading: "Protect recovery without making it another test", paragraphs: ["Schedule rest and contact with someone safe, even if relief is not immediate. A basic routine can offer structure, but rest does not need to become another task you must perform perfectly."] },
      { heading: "When exhaustion is tied to work or caregiving", paragraphs: ["Discuss workload, schedules, control, and resources with someone able to act, if it is safe. Caring for another person can leave little time for yourself; seek respite or community support where available instead of assuming family can always provide it."] },
      { heading: "When to get assessed", paragraphs: ["Seek care if exhaustion persists, affects functioning, or occurs with low mood, anxiety, pain, or sleep changes. WHO describes burnout as an occupational phenomenon related to chronic workplace stress, not a general diagnosis for every kind of exhaustion. NUXA does not diagnose or treat."] },
      { heading: "Urgent support", paragraphs: ["Call 911 for immediate danger or a medical emergency. If exhaustion comes with suicidal thoughts, call or text 988; call 911 for imminent danger."] },
    ],
    "en-gb": [
      { heading: "What feeling emotionally exhausted may mean", paragraphs: ["You might notice fatigue, irritability, emotional distance, or trouble concentrating. These signs have many possible causes and do not by themselves confirm a disorder or burnout. New or severe fatigue may also need medical assessment."] },
      { heading: "Find the demands exceeding your resources", paragraphs: ["Make a simple map of obligations, support, and chances to recover. Separate what you can pause, share, or renegotiate from what depends on other people or institutions; not every problem can be solved through individual effort."], bullets: ["Choose one non-urgent task to defer this week.", "Ask for bounded help instead of accepting another responsibility."] },
      { heading: "Protect recovery without making it another test", paragraphs: ["Schedule rest and contact with someone safe, even if relief is not immediate. A basic routine can offer structure, but rest does not need to become another task you must perform perfectly."] },
      { heading: "When exhaustion is tied to work or caring", paragraphs: ["Discuss workload, schedules, control, and resources with someone able to act, if safe. Caring for another person can leave little time for yourself; ask about respite or local support rather than assuming relatives can always provide it."] },
      { heading: "When to get assessed", paragraphs: ["Speak to your GP if exhaustion persists, affects functioning, or occurs with low mood, anxiety, pain, or sleep changes. WHO describes burnout as an occupational phenomenon related to chronic workplace stress, not a general diagnosis for every kind of exhaustion. NUXA does not diagnose or treat."] },
      { heading: "Urgent support", paragraphs: ["Call 999 or go to A&E for immediate danger or a life-threatening emergency. For urgent mental health help in England, contact NHS 111 and select the mental health option where available."] },
    ],
    fr: [
      { heading: "Ce que peut signifier l'épuisement émotionnel", paragraphs: ["Vous pouvez ressentir fatigue, irritabilité, distance émotionnelle ou difficultés de concentration. Ces signes ont plusieurs causes et ne confirment à eux seuls ni trouble ni burn-out. Une fatigue nouvelle ou intense peut aussi nécessiter un avis médical."] },
      { heading: "Repérer les demandes qui dépassent vos ressources", paragraphs: ["Faites une liste simple des obligations, soutiens et possibilités de récupération. Distinguez ce que vous pouvez reporter, partager ou renégocier de ce qui dépend d'autrui ou d'institutions ; tout ne se règle pas par un effort individuel accru."], bullets: ["Reportez une tâche non urgente cette semaine.", "Demandez une aide précise plutôt qu'une responsabilité supplémentaire."] },
      { heading: "Préserver la récupération sans en faire une épreuve", paragraphs: ["Prévoyez du repos et un contact avec une personne sûre, même si le soulagement n'est pas immédiat. Une routine de base peut aider, mais le repos n'a pas à devenir une tâche à accomplir parfaitement."] },
      { heading: "Quand l'épuisement est lié au travail ou à l'aide d'un proche", paragraphs: ["Discutez de la charge, des horaires, de l'autonomie et des ressources avec une personne pouvant agir, si cela est sûr. L'aide à un proche peut laisser peu de temps personnel ; renseignez-vous sur un relais ou un soutien local."] },
      { heading: "Quand consulter", paragraphs: ["Consultez si l'épuisement persiste, gêne le quotidien ou accompagne baisse de moral, anxiété, douleurs ou troubles du sommeil. L'OMS décrit le burn-out comme un phénomène professionnel lié au stress chronique au travail, pas comme un diagnostic général de toute fatigue. NUXA ne diagnostique ni ne traite."] },
      { heading: "Soutien urgent", paragraphs: ["En France, appelez le 112 ou le 15 en cas de danger immédiat ou d'urgence médicale. En cas d'idées suicidaires, contactez le 3114 ; pour un risque imminent, appelez les urgences."] },
    ],
  },
  faqs: {
    es: [
      { question: "¿Agotamiento emocional y burnout son lo mismo?", answer: "No necesariamente. El burnout se refiere al contexto laboral; el agotamiento puede tener otras causas y debe valorarse en contexto." },
      { question: "¿Basta con descansar un fin de semana?", answer: "Puede aliviar el cansancio, pero no siempre resuelve demandas persistentes o problemas de salud. Busca ayuda si no recuperas o tu funcionamiento empeora." },
      { question: "¿Cómo sé si necesito atención médica?", answer: "Consulta si el agotamiento dura, afecta tu vida o aparece con otros síntomas. Un profesional puede valorar causas físicas y emocionales." },
    ],
    "en-us": [
      { question: "Are emotional exhaustion and burnout the same?", answer: "Not necessarily. Burnout refers to the work context; exhaustion may have other causes and needs to be considered in context." },
      { question: "Will a weekend off be enough?", answer: "It may ease tiredness, but may not address ongoing demands or health concerns. Seek help if you do not recover or functioning worsens." },
      { question: "When should I speak with a clinician?", answer: "Seek care if exhaustion persists, affects daily life, or comes with other symptoms. A professional can consider physical and emotional causes." },
    ],
    "en-gb": [
      { question: "Are emotional exhaustion and burnout the same?", answer: "Not necessarily. Burnout refers to the work context; exhaustion may have other causes and needs to be considered in context." },
      { question: "Will a weekend off be enough?", answer: "It may ease tiredness, but may not address ongoing demands or health concerns. Seek help if you do not recover or functioning worsens." },
      { question: "When should I speak with a clinician?", answer: "Speak to your GP if exhaustion persists, affects daily life, or comes with other symptoms. A clinician can consider physical and emotional causes." },
    ],
    fr: [
      { question: "L'épuisement émotionnel et le burn-out sont-ils identiques ?", answer: "Pas forcément. Le burn-out concerne le contexte professionnel ; l'épuisement peut avoir d'autres causes et s'évalue selon la situation." },
      { question: "Un week-end de repos suffit-il ?", answer: "Il peut soulager la fatigue, sans résoudre des exigences persistantes ou un problème de santé. Consultez si vous ne récupérez pas ou si votre fonctionnement se dégrade." },
      { question: "Quand parler à un professionnel de santé ?", answer: "Consultez si l'épuisement persiste, gêne votre quotidien ou s'accompagne d'autres symptômes. Un professionnel peut examiner les causes physiques et émotionnelles." },
    ],
  },
  relatedIds: ["work-stress", "sleep-stress", "anxiety", "wellbeing", "boundaries", "safety", "how-nuxa-works", "editorial-policy"],
  sourceKey: "emotional-exhaustion",
};
export default guide;
