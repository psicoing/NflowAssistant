import type { Guide } from "./shared";

const guide: Guide = {
  id: "wellbeing",
  paths: { es: "/bienestar-emocional", "en-us": "/en-us/emotional-wellbeing", "en-gb": "/en-gb/emotional-wellbeing", fr: "/fr/bien-etre-emotionnel" },
  titles: {
    es: { title: "Bienestar emocional: cómo cuidar lo que sientes | NUXA", description: "Una guía práctica para comprender tus emociones, cuidar tu bienestar y reconocer cuándo buscar apoyo.", h1: "Bienestar emocional: cómo cuidar lo que sientes" },
    "en-us": { title: "Emotional well-being: practical ways to care for yourself | NUXA", description: "Understand emotional well-being, try grounded self-care practices, and know when to seek support.", h1: "Emotional well-being: practical ways to care for yourself" },
    "en-gb": { title: "Emotional wellbeing: practical ways to look after yourself | NUXA", description: "Understand emotional wellbeing, try realistic self-care practices, and know when to seek support.", h1: "Emotional wellbeing: practical ways to look after yourself" },
    fr: { title: "Bien-être émotionnel : prendre soin de soi au quotidien | NUXA", description: "Comprendre son bien-être émotionnel, essayer des gestes concrets et savoir quand demander de l'aide.", h1: "Bien-être émotionnel : prendre soin de soi au quotidien" },
  },
  summaries: {
    es: "El bienestar emocional no consiste en estar bien todo el tiempo: significa poder reconocer lo que sientes, atender tus necesidades y buscar apoyo cuando el malestar persiste o limita tu vida.",
    "en-us": "Emotional well-being does not mean feeling happy all the time. It means noticing what you feel, responding to your needs, and seeking support when distress persists or interferes with daily life.",
    "en-gb": "Emotional wellbeing does not mean feeling cheerful all the time. It means noticing what you feel, responding to your needs, and seeking support when distress persists or affects daily life.",
    fr: "Le bien-être émotionnel ne signifie pas se sentir bien en permanence. Il s'agit de reconnaître ses émotions, de répondre à ses besoins et de demander de l'aide si la souffrance persiste ou gêne le quotidien.",
  },
  sections: {
    es: [
      { heading: "¿Qué significa cuidar el bienestar emocional?", paragraphs: ["Incluye identificar las emociones, comprender qué las activa y disponer de formas flexibles de afrontarlas. No es una medida de éxito personal ni exige eliminar la tristeza, el enfado o la preocupación."] },
      { heading: "Empieza por observar, no por juzgar", paragraphs: ["Durante unos días, apunta qué ocurrió, qué notaste en el cuerpo, qué pensaste y qué hiciste después. Busca patrones con curiosidad; un registro breve puede orientar, pero no diagnostica ni explica por sí solo un problema de salud."] },
      { heading: "Apoya las necesidades básicas con pasos posibles", paragraphs: ["Las rutinas de descanso, alimentación, movimiento y contacto significativo pueden dar estructura, aunque no sustituyen atención sanitaria. Elige una acción pequeña y realista para esta semana en vez de intentar cambiar todos tus hábitos a la vez."], bullets: ["Pon una pausa breve entre una tarea y la siguiente.", "Pide a alguien de confianza una ayuda concreta, no solo que esté pendiente."] },
      { heading: "Ajusta el plan a tu vida y tus circunstancias", paragraphs: ["El trabajo, los cuidados, la salud física, el dinero, la discriminación y los cambios vitales influyen en cómo nos sentimos. Si una estrategia no es viable, no es un fallo de voluntad: busca una alternativa compatible con tus recursos y entorno."] },
      { heading: "Cuándo conviene hablar con un profesional", paragraphs: ["Consulta con atención primaria o un profesional de salud mental si el malestar dura, empeora o afecta al sueño, las relaciones o las actividades habituales. NUXA ofrece orientación psicoeducativa para ordenar ideas, no diagnóstico, psicoterapia ni atención de urgencia."] },
      { heading: "Si necesitas ayuda inmediata", paragraphs: ["Ante peligro inmediato o una urgencia médica en España, llama al 112. Si tienes pensamientos suicidas, puedes llamar al 024; no sustituye a emergencias cuando el riesgo es inminente."] },
    ],
    "en-us": [
      { heading: "What does emotional well-being involve?", paragraphs: ["It includes recognizing emotions, noticing what may trigger them, and having flexible ways to cope. It is not a personal score, and it does not require getting rid of sadness, anger, or worry."] },
      { heading: "Notice patterns before judging yourself", paragraphs: ["For a few days, note what happened, what you felt in your body, what you thought, and what you did next. Look for patterns with curiosity. A brief journal can guide reflection, but it cannot diagnose or explain a health condition on its own."] },
      { heading: "Support basic needs with realistic steps", paragraphs: ["Sleep, regular meals, movement, and meaningful connection can provide structure, but they do not replace healthcare. Choose one small action that fits your week rather than expecting yourself to overhaul every routine at once."], bullets: ["Add a short pause between demanding tasks.", "Ask a trusted person for one specific kind of help."] },
      { heading: "Make room for your real circumstances", paragraphs: ["Work, caregiving, physical health, finances, discrimination, and life changes all shape well-being. If a suggested habit is not feasible, that is not a lack of willpower; adapt it to your resources and environment."] },
      { heading: "When professional support may help", paragraphs: ["Contact a healthcare professional if distress lasts, worsens, or affects sleep, relationships, or everyday activities. NUXA provides psychoeducational guidance to help organize thoughts; it does not diagnose, provide psychotherapy, or offer emergency care."] },
      { heading: "Getting urgent help in the US", paragraphs: ["For immediate danger or a medical emergency, call 911. If you are in emotional crisis or thinking about suicide, call or text 988 for the Suicide & Crisis Lifeline; use 911 for immediate physical danger."] },
    ],
    "en-gb": [
      { heading: "What does emotional wellbeing involve?", paragraphs: ["It includes recognising emotions, noticing what may trigger them, and having flexible ways to cope. It is not a personal score, and it does not require getting rid of sadness, anger, or worry."] },
      { heading: "Notice patterns before judging yourself", paragraphs: ["For a few days, note what happened, what you felt in your body, what you thought, and what you did next. Look for patterns with curiosity. A short journal may guide reflection, but it cannot diagnose or explain a health condition on its own."] },
      { heading: "Support basic needs with realistic steps", paragraphs: ["Sleep, regular meals, movement, and meaningful connection can provide structure, but they do not replace healthcare. Choose one small action that fits your week rather than expecting yourself to change every routine at once."], bullets: ["Build a short pause between demanding tasks.", "Ask someone you trust for one specific kind of help."] },
      { heading: "Make room for your real circumstances", paragraphs: ["Work, caring responsibilities, physical health, finances, discrimination, and life changes all shape wellbeing. If a suggested habit is not feasible, that is not a lack of willpower; adapt it to your resources and surroundings."] },
      { heading: "When professional support may help", paragraphs: ["Contact your GP or a mental health professional if distress lasts, worsens, or affects sleep, relationships, or daily activities. NUXA provides psychoeducational guidance to help organise thoughts; it does not diagnose, provide psychotherapy, or offer emergency care."] },
      { heading: "Getting urgent help in the UK", paragraphs: ["Call 999 or go to A&E for immediate danger or a life-threatening emergency. For urgent mental health help in England, contact NHS 111 and select the mental health option where available; Samaritans can be reached on 116 123 for someone to listen."] },
    ],
    fr: [
      { heading: "Que recouvre le bien-être émotionnel ?", paragraphs: ["Il consiste notamment à reconnaître ses émotions, à repérer ce qui les déclenche et à disposer de plusieurs façons d'y faire face. Ce n'est ni une note personnelle ni l'obligation de supprimer la tristesse, la colère ou l'inquiétude."] },
      { heading: "Observer avant de se juger", paragraphs: ["Pendant quelques jours, notez la situation, les sensations corporelles, les pensées et votre réaction. Cherchez des régularités avec curiosité. Un carnet peut aider à réfléchir, mais ne permet pas à lui seul de poser un diagnostic ni d'expliquer un trouble de santé."] },
      { heading: "Soutenir ses besoins avec des gestes réalistes", paragraphs: ["Le sommeil, des repas réguliers, le mouvement et des liens importants peuvent donner un cadre, sans remplacer les soins. Choisissez un geste modeste et réalisable cette semaine plutôt que de vouloir transformer toutes vos habitudes d'un coup."], bullets: ["Prévoyez une courte pause entre deux tâches exigeantes.", "Demandez à une personne de confiance une aide précise."] },
      { heading: "Tenir compte de sa situation réelle", paragraphs: ["Le travail, les responsabilités familiales, la santé physique, les finances, les discriminations et les changements de vie influencent le bien-être. Si une habitude proposée n'est pas possible, adaptez-la à vos moyens et à votre environnement : ce n'est pas un manque de volonté."] },
      { heading: "Quand demander un avis professionnel ?", paragraphs: ["Parlez-en à votre médecin ou à un professionnel de santé mentale si la souffrance dure, s'aggrave ou perturbe le sommeil, les relations ou les activités quotidiennes. NUXA propose un accompagnement psychoéducatif pour clarifier ses idées, pas un diagnostic, une psychothérapie ou une prise en charge d'urgence."] },
      { heading: "En cas d'urgence en France", paragraphs: ["En cas de danger immédiat ou d'urgence médicale, appelez le 112 ou le 15. Si vous pensez au suicide, le 3114 est le numéro national de prévention du suicide, gratuit et accessible 24 h/24 et 7 j/7."] },
    ],
  },
  faqs: {
    es: [
      { question: "¿Tengo que sentirme bien para tener bienestar emocional?", answer: "No. El bienestar incluye atravesar emociones difíciles y pedir apoyo; no exige estar de buen ánimo ni mantener una actitud positiva constante." },
      { question: "¿Qué hago si no puedo mantener una rutina?", answer: "Reduce el objetivo a una acción posible y revisa qué barreras existen. Si el malestar interfiere de forma persistente, consulta con un profesional sanitario." },
      { question: "¿NUXA puede diagnosticar lo que me pasa?", answer: "No. NUXA ofrece orientación psicoeducativa y no sustituye una evaluación, tratamiento profesional ni servicios de emergencia." },
    ],
    "en-us": [
      { question: "Do I need to feel happy to have emotional well-being?", answer: "No. Well-being can include difficult emotions and asking for help; it does not require constant positivity or a cheerful mood." },
      { question: "What if I cannot stick to a routine?", answer: "Make the goal smaller and identify what is getting in the way. If distress persistently interferes with life, speak with a healthcare professional." },
      { question: "Can NUXA tell me what condition I have?", answer: "No. NUXA offers psychoeducational guidance, not diagnosis, professional treatment, or emergency services." },
    ],
    "en-gb": [
      { question: "Do I need to feel happy to have emotional wellbeing?", answer: "No. Wellbeing can include difficult emotions and asking for help; it does not require constant positivity or a cheerful mood." },
      { question: "What if I cannot keep up a routine?", answer: "Make the goal smaller and identify what is getting in the way. If distress persistently affects daily life, speak with a healthcare professional." },
      { question: "Can NUXA diagnose a mental health condition?", answer: "No. NUXA offers psychoeducational guidance, not diagnosis, professional treatment, or emergency services." },
    ],
    fr: [
      { question: "Faut-il être heureux pour avoir un bon bien-être émotionnel ?", answer: "Non. Le bien-être peut inclure des émotions difficiles et le fait de demander de l'aide ; il n'exige ni optimisme permanent ni bonne humeur constante." },
      { question: "Et si je n'arrive pas à garder une routine ?", answer: "Réduisez l'objectif à un geste possible et repérez les obstacles. Si la souffrance gêne durablement votre vie, parlez-en à un professionnel de santé." },
      { question: "NUXA peut-il diagnostiquer mon problème ?", answer: "Non. NUXA propose un accompagnement psychoéducatif, pas un diagnostic, un traitement professionnel ou un service d'urgence." },
    ],
  },
  relatedIds: ["anxiety", "sleep-stress", "self-esteem", "loneliness", "teen-anxiety", "safety", "how-nuxa-works", "editorial-policy"],
  sourceKey: "wellbeing",
};
export default guide;
