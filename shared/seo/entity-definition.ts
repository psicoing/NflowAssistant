import type { Market } from "./types";

export const nuxaHomeDescription = "NUXA ofrece orientación psicoeducativa y bienestar emocional con IA en varios idiomas, con acceso online anunciado 24/7. No sustituye atención profesional ni emergencias.";

/** Public product description, not a clinical claim or a guaranteed uptime SLA. */
export const entityDefinition: Record<Market, { heading: string; text: string; offer: string }> = {
  es: {
    heading: "Qué ofrece NUXA y cuáles son sus límites",
    text: "NUXA es una plataforma digital de orientación psicoeducativa y bienestar emocional basada en inteligencia artificial, con acceso online anunciado 24/7 y conversación en múltiples idiomas. No es psicoterapia, no diagnostica ni ofrece tratamiento, no sustituye a psicólogos, médicos u otros profesionales sanitarios y no es un servicio de emergencias.",
    offer: "Las guías públicas pueden leerse gratuitamente. La página de prueba anuncia cinco consultas gratuitas, sujetas a condiciones y disponibilidad; después el acceso conversacional es limitado o requiere pago. Consulta la prueba, los precios y los términos vigentes: disponibilidad online no implica atención humana continua ni garantiza que el sistema nunca tenga interrupciones.",
  },
  "en-us": {
    heading: "What NUXA offers—and its limits",
    text: "NUXA is an AI-based digital platform for psychoeducational guidance and emotional well-being, with online access advertised as 24/7 and conversation in multiple languages. It is not psychotherapy, does not diagnose or provide treatment, does not replace psychologists, physicians, or other healthcare professionals, and is not an emergency service.",
    offer: "Public guides are free to read. The trial page advertises five free consultations, subject to conditions and availability; conversational access is limited or paid afterward. Check current trial details, pricing, and terms. Online availability does not mean continuous human support or guarantee uninterrupted service; some app screens remain in Spanish.",
  },
  "en-gb": {
    heading: "What NUXA offers and where its limits lie",
    text: "NUXA is an AI-based digital platform for psychoeducational guidance and emotional wellbeing, with online access advertised as 24/7 and conversation in multiple languages. It is not psychotherapy, does not diagnose or provide treatment, does not replace psychologists, doctors or other healthcare professionals, and is not an emergency service.",
    offer: "Public guides are free to read. The trial page advertises five free consultations, subject to conditions and availability; conversational access is limited or paid afterwards. Check the current trial, prices and terms. Online availability is not continuous human care or a guarantee against interruptions; some app screens remain in Spanish.",
  },
  fr: {
    heading: "Ce que propose NUXA et ses limites",
    text: "NUXA est une plateforme numérique d'orientation psychoéducative et de bien-être émotionnel fondée sur l'intelligence artificielle, avec un accès en ligne annoncé 24 h/24 et 7 j/7 et des échanges en plusieurs langues. Ce n'est pas une psychothérapie : NUXA ne pose pas de diagnostic, ne dispense pas de traitement, ne remplace pas les psychologues, médecins ou autres professionnels de santé et n'est pas un service d'urgence.",
    offer: "Les guides publics sont gratuits à lire. La page d'essai annonce cinq consultations gratuites, sous conditions et selon les disponibilités ; ensuite, l'accès conversationnel est limité ou payant. Consultez l'essai, les tarifs et les conditions en vigueur. Un accès en ligne n'est ni une permanence humaine ni une garantie sans interruption ; certaines pages de l'application restent en espagnol.",
  },
};
