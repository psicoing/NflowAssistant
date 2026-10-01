import type { Guide } from "./shared";

const guide: Guide = {
  id: "sleep-stress",
  paths: { es: "/ansiedad-antes-de-dormir", "en-us": "/en-us/anxiety-before-sleep", "en-gb": "/en-gb/anxiety-before-sleep", fr: "/fr/anxiete-avant-de-dormir" },
  titles: {
    es: { title: "Ansiedad antes de dormir: cómo calmar la mente | NUXA", description: "Qué hacer cuando las preocupaciones dificultan dormir: pasos realistas y señales para consultar.", h1: "Ansiedad antes de dormir: cómo calmar la mente" },
    "en-us": { title: "Anxiety before sleep: how to quiet a busy mind | NUXA", description: "Practical steps for bedtime worry, sleep habits, and knowing when to discuss persistent insomnia with a clinician.", h1: "Anxiety before sleep: how to quiet a busy mind" },
    "en-gb": { title: "Anxiety before sleep: how to quiet a busy mind | NUXA", description: "Practical steps for bedtime worry, sleep habits, and knowing when to discuss persistent insomnia with a clinician.", h1: "Anxiety before sleep: how to quiet a busy mind" },
    fr: { title: "Anxiété avant de dormir : apaiser les pensées | NUXA", description: "Des pistes réalistes face aux inquiétudes du soir et les signes qui justifient un avis médical.", h1: "Anxiété avant de dormir : apaiser les pensées" },
  },
  summaries: {
    es: "La preocupación puede hacerse más presente al acostarte. Anotar pendientes antes de la noche, mantener una rutina tranquila y dejar de luchar contra el reloj puede ayudar; si las dificultades persisten, habla con un profesional.",
    "en-us": "Worry can feel louder at bedtime. A wind-down routine, an earlier worry list, and less clock-watching may help; persistent sleep problems deserve a conversation with a healthcare professional.",
    "en-gb": "Worry can feel louder at bedtime. A wind-down routine, an earlier worry list, and less clock-watching may help; persistent sleep problems deserve a conversation with a healthcare professional.",
    fr: "Les préoccupations peuvent prendre plus de place au coucher. Une routine apaisante, une liste faite plus tôt et moins de vérifications de l'heure peuvent aider ; si les difficultés durent, demandez un avis médical.",
  },
  sections: {
    es: [
      { heading: "Por qué la noche puede intensificar las preocupaciones", paragraphs: ["Al bajar las distracciones, la mente vuelve a tareas o conversaciones pendientes; anticipar otra mala noche añade presión. Una noche difícil no demuestra por sí sola que tengas insomnio crónico, y vigilar constantemente el reloj suele alimentar la alerta."] },
      { heading: "Lleva las preocupaciones a un momento anterior", paragraphs: ["Reserva diez minutos por la tarde para apuntar lo que te preocupa y distinguir entre una acción posible y algo que hoy no puedes resolver. Si surge una idea al acostarte, anótala para mañana en vez de iniciar una planificación interminable."], bullets: ["Deja preparada una primera tarea del día siguiente.", "Silencia avisos y baja la luz al acercarse la hora de dormir."] },
      { heading: "Haz una rutina sencilla, no perfecta", paragraphs: ["Mantener una hora de levantarte razonablemente estable y reducir cafeína por la tarde puede favorecer el descanso. Si una rutina rígida genera más ansiedad, simplifícala; las necesidades de sueño varían y ninguna técnica garantiza dormirse enseguida."] },
      { heading: "Qué hacer si sigues despierto", paragraphs: ["Si llevas un rato despierto y frustrado, sal de la cama si es seguro y haz algo tranquilo con poca luz; vuelve cuando notes sueño. Evita mirar la hora repetidamente. No conduzcas ni realices tareas de riesgo si la somnolencia compromete tu seguridad."] },
      { heading: "Cuándo consultar y qué revisar", paragraphs: ["Consulta con atención primaria si el problema se mantiene durante semanas, afecta tu funcionamiento o coincide con dolor, ronquidos intensos, cambios de ánimo o medicación nueva. NUXA puede ayudarte a planear hábitos, pero no diagnostica trastornos del sueño ni reemplaza una evaluación."] },
      { heading: "Ayuda urgente", paragraphs: ["En España, llama al 112 ante una urgencia médica o peligro inmediato. Si la falta de sueño se acompaña de pensamientos de hacerte daño, contacta con el 024 o, si el riesgo es inminente, con el 112."] },
    ],
    "en-us": [
      { heading: "Why worries can feel stronger at night", paragraphs: ["With fewer distractions, the mind may return to unfinished tasks or conversations; fear of another poor night adds pressure. One difficult night does not by itself establish chronic insomnia, and repeatedly checking the clock can keep attention on the problem."] },
      { heading: "Move problem-solving earlier in the day", paragraphs: ["Set aside ten minutes in the afternoon to write worries down and separate an action you can take from something you cannot resolve tonight. If a thought returns in bed, note it for tomorrow rather than starting an endless planning session."], bullets: ["Choose one first task for the morning.", "Mute alerts and dim lights as bedtime approaches."] },
      { heading: "Build a simple, flexible wind-down", paragraphs: ["A reasonably consistent wake time and less afternoon or evening caffeine may support sleep. If a strict routine increases pressure, simplify it; sleep needs vary and no technique can guarantee that you will fall asleep quickly."] },
      { heading: "What to do when you remain awake", paragraphs: ["If you are awake and frustrated for a while, get out of bed if safe and do something quiet in dim light; return when sleepy. Avoid repeated clock checks. Do not drive or do hazardous tasks when drowsiness makes them unsafe."] },
      { heading: "When to discuss sleep with a clinician", paragraphs: ["Talk with a healthcare professional if problems last for weeks, affect daytime functioning, or occur with pain, loud snoring, mood changes, or new medication. NUXA can help plan habits, but it does not diagnose sleep disorders or replace evaluation."] },
      { heading: "Urgent support", paragraphs: ["Call 911 for a medical emergency or immediate danger in the US. If sleeplessness comes with thoughts of self-harm, call or text 988; call 911 if the danger is immediate."] },
    ],
    "en-gb": [
      { heading: "Why worries can feel stronger at night", paragraphs: ["With fewer distractions, the mind may return to unfinished tasks or conversations; fear of another poor night adds pressure. One difficult night does not by itself establish chronic insomnia, and repeatedly checking the clock can keep attention on the problem."] },
      { heading: "Move problem-solving earlier in the day", paragraphs: ["Set aside ten minutes in the afternoon to write worries down and separate an action you can take from something you cannot resolve tonight. If a thought returns in bed, note it for tomorrow rather than starting an endless planning session."], bullets: ["Choose one first task for the morning.", "Mute alerts and dim lights as bedtime approaches."] },
      { heading: "Build a simple, flexible wind-down", paragraphs: ["A reasonably consistent wake time and less afternoon or evening caffeine may support sleep. If a strict routine increases pressure, simplify it; sleep needs vary and no technique can guarantee that you will fall asleep quickly."] },
      { heading: "What to do when you remain awake", paragraphs: ["If you are awake and frustrated for a while, get out of bed if safe and do something quiet in dim light; return when sleepy. Avoid repeated clock checks. Do not drive or do hazardous tasks when drowsiness makes them unsafe."] },
      { heading: "When to discuss sleep with a clinician", paragraphs: ["Speak with your GP if problems last for weeks, affect daytime functioning, or occur with pain, loud snoring, mood changes, or new medication. NUXA can help plan habits, but it does not diagnose sleep disorders or replace clinical assessment."] },
      { heading: "Urgent support", paragraphs: ["Call 999 or go to A&E for a life-threatening emergency in the UK. For urgent mental health help in England, contact NHS 111 and select the mental health option where available; call 999 if danger is immediate."] },
    ],
    fr: [
      { heading: "Pourquoi les pensées semblent plus fortes la nuit", paragraphs: ["Quand les distractions diminuent, l'esprit revient aux tâches ou conversations inachevées ; la peur d'une nouvelle mauvaise nuit ajoute de la pression. Une nuit difficile ne suffit pas à conclure à une insomnie chronique, et regarder sans cesse l'heure entretient la vigilance."] },
      { heading: "Prévoir un temps pour les soucis plus tôt", paragraphs: ["Consacrez dix minutes en fin de journée à noter vos préoccupations et à distinguer une action possible d'une question sans solution ce soir. Si une idée revient au lit, écrivez-la pour demain au lieu de relancer une longue planification."], bullets: ["Choisissez une première tâche pour le lendemain.", "Coupez les notifications et baissez la lumière le soir."] },
      { heading: "Créer un rituel simple et souple", paragraphs: ["Une heure de lever assez régulière et moins de caféine en fin de journée peuvent soutenir le sommeil. Si un rituel strict augmente la pression, simplifiez-le ; les besoins varient et aucune méthode ne garantit un endormissement immédiat."] },
      { heading: "Que faire si le sommeil ne vient pas", paragraphs: ["Si vous restez éveillé et vous énervez, levez-vous un moment si vous pouvez le faire sans risque et choisissez une activité calme, dans une lumière faible ; retournez au lit quand la somnolence vient. Évitez de vérifier l'heure à répétition."] },
      { heading: "Quand en parler à un professionnel", paragraphs: ["Consultez si les difficultés durent plusieurs semaines, gênent la journée ou s'accompagnent de douleurs, de ronflements importants, d'un changement d'humeur ou d'un nouveau traitement. NUXA aide à réfléchir aux habitudes, mais ne diagnostique pas les troubles du sommeil."] },
      { heading: "Aide urgente", paragraphs: ["En cas d'urgence médicale ou de danger immédiat en France, appelez le 112 ou le 15. Si l'insomnie s'accompagne d'idées suicidaires, appelez le 3114 ; en cas de danger imminent, contactez les urgences."] },
    ],
  },
  faqs: {
    es: [
      { question: "¿Debo quedarme en la cama hasta dormirme?", answer: "No hay una regla válida para todos. Si permanecer despierto te frustra, puede ayudar salir un rato y hacer algo tranquilo con poca luz, volviendo cuando tengas sueño." },
      { question: "¿Una mala noche significa que tengo insomnio?", answer: "No. Las dificultades ocasionales son distintas de un problema persistente; consulta si duran, afectan el día o te preocupan por otros síntomas." },
      { question: "¿La respiración siempre calma antes de dormir?", answer: "No siempre. Prueba una respiración suave solo si te resulta cómoda; si aumenta la inquietud, dirige la atención a sonidos u objetos neutrales." },
    ],
    "en-us": [
      { question: "Should I stay in bed until I fall asleep?", answer: "There is no rule that suits everyone. If being awake in bed is making you frustrated, a quiet activity in dim light may help; return when sleepy." },
      { question: "Does one bad night mean I have insomnia?", answer: "No. Occasional difficulty differs from a persistent problem; speak with a clinician if it lasts, affects your day, or comes with other symptoms." },
      { question: "Will breathing exercises always help?", answer: "No. Try gentle breathing only if comfortable; if it increases anxiety, focus on neutral sounds or objects instead." },
    ],
    "en-gb": [
      { question: "Should I stay in bed until I fall asleep?", answer: "There is no rule that suits everyone. If being awake in bed is making you frustrated, a quiet activity in dim light may help; return when sleepy." },
      { question: "Does one bad night mean I have insomnia?", answer: "No. Occasional difficulty differs from a persistent problem; speak with your GP if it lasts, affects your day, or comes with other symptoms." },
      { question: "Will breathing exercises always help?", answer: "No. Try gentle breathing only if comfortable; if it increases anxiety, focus on neutral sounds or objects instead." },
    ],
    fr: [
      { question: "Faut-il rester au lit jusqu'à s'endormir ?", answer: "Il n'existe pas de règle universelle. Si rester éveillé vous frustre, une activité calme dans une lumière faible peut aider ; retournez au lit quand la somnolence arrive." },
      { question: "Une mauvaise nuit signifie-t-elle que je suis insomniaque ?", answer: "Non. Une difficulté ponctuelle diffère d'un problème durable ; consultez si cela persiste, gêne vos journées ou s'accompagne d'autres symptômes." },
      { question: "Les exercices de respiration aident-ils toujours ?", answer: "Non. Essayez une respiration douce uniquement si elle vous convient ; si elle augmente l'anxiété, concentrez-vous plutôt sur des sons ou objets neutres." },
    ],
  },
  relatedIds: ["anxiety", "work-stress", "emotional-exhaustion", "wellbeing", "safety", "how-nuxa-works", "editorial-policy"],
  sourceKey: "sleep-stress",
};
export default guide;
