import type { Guide } from "./shared";

const guide: Guide = {
  id: "work-stress",
  paths: { es: "/estres-laboral", "en-us": "/en-us/work-stress", "en-gb": "/en-gb/work-stress", fr: "/fr/stress-au-travail" },
  titles: {
    es: { title: "Estrés laboral: cómo reconocerlo y actuar | NUXA", description: "Reconoce el estrés laboral, identifica cambios posibles y conoce apoyos sanitarios y laborales.", h1: "Estrés laboral: cómo reconocerlo y actuar" },
    "en-us": { title: "Work stress: recognize it and take practical steps | NUXA", description: "Understand work-related stress, make a realistic plan, and find appropriate workplace or health support.", h1: "Work stress: recognize it and take practical steps" },
    "en-gb": { title: "Work-related stress: recognise it and take practical steps | NUXA", description: "Understand work-related stress, use HSE resources, and find appropriate workplace or health support.", h1: "Work-related stress: recognise it and take practical steps" },
    fr: { title: "Stress au travail : le reconnaître et agir | NUXA", description: "Repérer le stress lié au travail, préparer des changements réalistes et identifier les soutiens utiles.", h1: "Stress au travail : le reconnaître et agir" },
  },
  summaries: {
    es: "El estrés laboral puede aparecer cuando las exigencias y los recursos disponibles no encajan. Documenta qué pesa, acuerda prioridades o límites cuando sea seguro y pide ayuda sanitaria o laboral si afecta tu salud.",
    "en-us": "Work stress can grow when demands and available resources do not match. Document what is driving it, discuss priorities or boundaries where safe, and seek workplace or healthcare support if it affects your health.",
    "en-gb": "Work-related stress can arise when demands and available resources do not match. Use HSE's Management Standards as a framework for workplace discussion, and seek healthcare support if your health is affected.",
    fr: "Le stress professionnel peut augmenter lorsque les exigences dépassent les ressources disponibles. Repérez les facteurs, discutez des priorités ou des limites lorsque c'est possible et demandez un soutien professionnel si votre santé est touchée.",
  },
  sections: {
    es: [
      { heading: "El estrés señala un desajuste, no una incapacidad", paragraphs: ["Plazos constantes, falta de claridad, escaso control, inseguridad o conflictos pueden acumular tensión. El agotamiento no se determina con una lista de síntomas y conviene considerar también salud física, descanso y condiciones del puesto."] },
      { heading: "Convierte una sensación difusa en ejemplos", paragraphs: ["Durante una semana anota las tareas, interrupciones y momentos en que no alcanzan el tiempo o el apoyo. Separa lo urgente de lo importante y lleva dos ejemplos concretos a una conversación con tu responsable, representación sindical o prevención de riesgos."], bullets: ["Pregunta qué trabajo puede pausarse cuando surgen urgencias.", "Solicita por escrito prioridades y plazos realistas."] },
      { heading: "Prueba límites que puedas sostener", paragraphs: ["Acuerda una hora de cierre, pausas y canales para urgencias reales si tu puesto lo permite. Silenciar notificaciones puede ayudar, pero no resuelve una carga inviable ni debe ponerte en riesgo laboral; explora alternativas y apoyos disponibles."] },
      { heading: "Cuida la recuperación sin culparte", paragraphs: ["El movimiento, el descanso y el apoyo social pueden amortiguar el día, pero no reemplazan cambios organizativos cuando el problema está en la carga o el trato. No tienes que revelar información clínica al equipo para pedir una conversación sobre condiciones de trabajo."] },
      { heading: "Cuándo buscar apoyo", paragraphs: ["Consulta con atención primaria si aparecen insomnio persistente, ansiedad, ánimo bajo o síntomas físicos. NUXA puede ayudarte a ordenar preocupaciones y ensayar una conversación, no diagnostica burnout, ofrece asesoría laboral ni sustituye atención profesional."] },
      { heading: "Si hay riesgo inmediato", paragraphs: ["En España, llama al 112 ante una emergencia o peligro inmediato. Si el malestar incluye ideas suicidas, contacta con el 024; para un riesgo inminente, llama al 112."] },
    ],
    "en-us": [
      { heading: "Work stress is not proof that you are incapable", paragraphs: ["Persistent deadlines, unclear roles, little control, job insecurity, or conflict can build strain. Burnout cannot be confirmed with an online checklist; physical health, sleep, and working conditions may also need attention."] },
      { heading: "Turn a vague feeling into work examples", paragraphs: ["For a week, note tasks, interruptions, and times when capacity or support fell short. Separate urgent from important work, then bring two specific examples to a manager, HR, union representative, or an employee assistance program if available."], bullets: ["Ask what can be deprioritised when urgent work arrives.", "Request priorities and deadlines in writing."] },
      { heading: "Set boundaries that fit your role", paragraphs: ["Agree on a stopping time, breaks, and what counts as a genuine after-hours emergency when possible. Muting alerts may help, but it does not fix an unmanageable workload and may not be safe in every role; explore alternatives."] },
      { heading: "Recover without blaming yourself", paragraphs: ["Rest, movement, and social support can help you recover, but they cannot replace organizational changes when workload or treatment is the cause. You do not have to disclose private health details to start a conversation about work conditions."] },
      { heading: "When to seek support", paragraphs: ["Contact a healthcare professional if persistent sleep problems, anxiety, low mood, or physical symptoms develop. NUXA can help organize concerns and rehearse a conversation; it does not diagnose burnout or replace clinical or employment advice."] },
      { heading: "Immediate safety", paragraphs: ["Call 911 for immediate danger or a medical emergency in the US. If you are in emotional crisis or thinking about suicide, call or text 988; call 911 for imminent physical danger."] },
    ],
    "en-gb": [
      { heading: "Work-related stress is not proof that you are incapable", paragraphs: ["Persistent deadlines, unclear roles, little control, job insecurity, or conflict can build strain. HSE's Management Standards group workplace risk factors under demands, control, support, relationships, role, and change; they are a framework for discussion, not a personal diagnosis."] },
      { heading: "Turn a vague feeling into work examples", paragraphs: ["For a week, note tasks, interruptions, and times when capacity or support fell short. Take specific examples to your manager, HR, union representative, or safety representative. HSE guidance encourages employers to assess and manage work-related stress risks."], bullets: ["Ask which task can wait when urgent work arrives.", "Request clear priorities and realistic deadlines."] },
      { heading: "Set boundaries that fit your role", paragraphs: ["Agree on a stopping time, breaks, and what counts as a genuine after-hours emergency where possible. Muting alerts may help, but it does not fix an unmanageable workload; use workplace procedures if a boundary cannot be agreed safely."] },
      { heading: "Recover without blaming yourself", paragraphs: ["Rest, movement, and social support can aid recovery, but they cannot replace organisational changes when workload or treatment is the cause. You need not share private clinical details with colleagues to raise a work-risk concern."] },
      { heading: "When to seek support", paragraphs: ["Speak with your GP or an occupational health service if sleep problems, anxiety, low mood, or physical symptoms persist. NUXA can help organise concerns and rehearse a discussion; it does not diagnose burnout or replace clinical or employment advice."] },
      { heading: "Immediate safety", paragraphs: ["Call 999 or go to A&E for immediate danger or a life-threatening emergency. For urgent mental health support in England, contact NHS 111 and select the mental health option where available."] },
    ],
    fr: [
      { heading: "Le stress ne prouve pas une incapacité personnelle", paragraphs: ["Des délais continus, des rôles flous, peu d'autonomie, l'insécurité de l'emploi ou des conflits peuvent accumuler la tension. L'épuisement ne se confirme pas par un questionnaire en ligne ; la santé physique, le sommeil et les conditions de travail comptent aussi."] },
      { heading: "Transformer le ressenti en exemples concrets", paragraphs: ["Pendant une semaine, notez les tâches, interruptions et moments où le temps ou le soutien manquent. Apportez deux exemples précis à votre responsable, aux ressources humaines, au CSE ou au service de prévention si vous pouvez le faire sans risque."], bullets: ["Demandez quelle tâche peut être reportée en cas d'urgence.", "Faites préciser les priorités et échéances par écrit."] },
      { heading: "Poser des limites compatibles avec le poste", paragraphs: ["Convenez, si possible, d'une heure de fin, de pauses et de ce qui constitue une urgence hors horaires. Couper les notifications ne résout pas une charge excessive ; si une limite est impossible à tenir, explorez les procédures et soutiens disponibles."] },
      { heading: "Récupérer sans se rendre responsable", paragraphs: ["Le repos, le mouvement et le soutien des proches peuvent aider, mais ne remplacent pas une action sur l'organisation si la charge ou le traitement est en cause. Vous n'avez pas à dévoiler des informations médicales privées pour évoquer les conditions de travail."] },
      { heading: "Quand demander de l'aide", paragraphs: ["Parlez-en à votre médecin si l'insomnie, l'anxiété, la baisse de moral ou des symptômes physiques persistent. NUXA aide à organiser ses préoccupations et préparer un échange ; il ne diagnostique pas le burn-out et ne remplace ni les soins ni un conseil professionnel du travail."] },
      { heading: "Sécurité immédiate", paragraphs: ["En cas de danger immédiat ou d'urgence médicale en France, appelez le 112 ou le 15. En cas de pensées suicidaires, contactez le 3114 ; pour un danger imminent, appelez les urgences."] },
    ],
  },
  faqs: {
    es: [
      { question: "¿El estrés laboral significa que tengo burnout?", answer: "No. El estrés y el agotamiento necesitan valorarse en contexto; una lista en internet no puede diagnosticar y otras causas de salud también importan." },
      { question: "¿Qué puedo decir a mi responsable?", answer: "Describe tareas, impacto y una petición concreta, por ejemplo decidir qué prioridad se aplaza. Usa recursos de personal o representación laboral si hablar directamente no es seguro." },
      { question: "¿El autocuidado basta para resolverlo?", answer: "No siempre. Las prácticas individuales pueden apoyar la recuperación, pero problemas de carga, control o trato también requieren cambios en el trabajo." },
    ],
    "en-us": [
      { question: "Does work stress mean I have burnout?", answer: "No. Stress and burnout require context; an online checklist cannot diagnose either, and other health causes may need consideration." },
      { question: "What can I say to my manager?", answer: "Describe the work, its effect, and one concrete request, such as agreeing what to deprioritise. Use HR, a union, or another route if a direct conversation is unsafe." },
      { question: "Can self-care solve an unsafe workload?", answer: "Not by itself. Personal coping can support recovery, but workload, control, or workplace conduct may need organizational action." },
    ],
    "en-gb": [
      { question: "Does work-related stress mean I have burnout?", answer: "No. Stress and burnout require context; an online checklist cannot diagnose either, and other health causes may need consideration." },
      { question: "What can I say to my manager?", answer: "Describe the work, its effect, and one concrete request, such as agreeing what can wait. HSE's Management Standards can help structure a workplace discussion." },
      { question: "Can self-care solve an unsafe workload?", answer: "Not by itself. Personal coping can support recovery, but workload, control, or workplace conduct may need organisational action." },
    ],
    fr: [
      { question: "Le stress professionnel signifie-t-il un burn-out ?", answer: "Non. Le stress et l'épuisement s'évaluent dans leur contexte ; un questionnaire en ligne ne pose pas de diagnostic et d'autres causes de santé peuvent compter." },
      { question: "Que dire à mon responsable ?", answer: "Décrivez le travail, ses effets et une demande concrète, par exemple décider ensemble quelle tâche reporter. Utilisez les ressources RH ou les représentants du personnel si un échange direct n'est pas sûr." },
      { question: "Le développement personnel suffit-il ?", answer: "Pas toujours. Les stratégies individuelles peuvent aider, mais une charge, un manque d'autonomie ou un comportement problématique peut nécessiter une action de l'organisation." },
    ],
  },
  relatedIds: ["anxiety", "sleep-stress", "boundaries", "emotional-exhaustion", "wellbeing", "safety", "how-nuxa-works", "editorial-policy"],
  sourceKey: "work-stress",
};
export default guide;
