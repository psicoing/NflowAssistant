import type { InternationalPage, Market, PageSection } from "../types";
import { marketSources, topicSources } from "../topics/sources";

export type DiscoveryId = "free-resources" | "talk-online" | "anytime-support" | "stress-tools";
export type DiscoveryDraft = Pick<InternationalPage, "id" | "title" | "description" | "h1" | "summary" | "sections" | "faqs"> & { id: DiscoveryId };
export const discoverySlugs: Record<Market, Record<DiscoveryId, string>> = {
  es: { "free-resources": "recursos-gratuitos-bienestar", "talk-online": "orientacion-emocional-online", "anytime-support": "recursos-bienestar-24-horas", "stress-tools": "herramientas-gestionar-estres" },
  "en-us": { "free-resources": "free-emotional-wellbeing-resources", "talk-online": "someone-to-talk-to-online", "anytime-support": "emotional-support-anytime", "stress-tools": "tools-to-manage-stress" },
  "en-gb": { "free-resources": "free-wellbeing-resources", "talk-online": "talk-about-worries-online", "anytime-support": "wellbeing-resources-out-of-hours", "stress-tools": "practical-tools-for-stress" },
  fr: { "free-resources": "ressources-gratuites-bien-etre", "talk-online": "parler-de-ses-preoccupations-en-ligne", "anytime-support": "ressources-bien-etre-a-toute-heure", "stress-tools": "outils-pour-gerer-le-stress" },
};
const common: Record<Market, PageSection[]> = {
  es: [
    { heading: "Cómo escoger un recurso con criterio", paragraphs: ["Comprueba quién publica la información, qué fuentes utiliza y si hay una fecha de revisión. Distingue una guía general, una conversación automatizada y la atención de una persona profesional: no cumplen la misma función. Una afirmación de eficacia, anonimato o confidencialidad necesita respaldo, no solo publicidad."], bullets: ["Comprueba costes, duración del acceso e idioma antes de registrarte.", "Lee privacidad y condiciones antes de compartir datos sensibles.", "No uses un chatbot para tomar decisiones médicas o valorar una crisis."] },
    { heading: "Cuándo acudir a un profesional o pedir ayuda urgente", paragraphs: ["Si el malestar persiste, empeora o dificulta dormir, trabajar, estudiar o relacionarte, consulta con un profesional sanitario. Tu centro de salud puede orientarte sobre recursos públicos; las condiciones y tiempos de acceso varían. Ante peligro inmediato llama al 112. Para pensamientos suicidas está la Línea 024, que no sustituye al 112 en una emergencia."] },
  ],
  "en-us": [
    { heading: "Check the resource before you use it", paragraphs: ["Look for the publisher, sources, review date, and a clear explanation of what the tool does. Self-help information, an AI conversation, a peer group, and licensed care are different kinds of support. Claims about effectiveness, anonymity, or confidentiality need evidence, not just advertising."], bullets: ["Check fees, trial limits, language, and eligibility.", "Read the privacy policy before sharing sensitive information.", "Do not use a chatbot to make medical decisions or assess a crisis."] },
    { heading: "When to get professional or urgent help", paragraphs: ["If distress continues, worsens, or interferes with sleep, school, work, or relationships, talk with a healthcare professional. A primary care provider or community health service can help you explore local options; access and cost vary. In a mental health or suicide crisis, call or text 988. For immediate danger or a medical emergency, call 911."] },
  ],
  "en-gb": [
    { heading: "Choose support with clear information", paragraphs: ["Check who publishes the resource, its sources and review date, and whether it offers information, peer support, an automated conversation or professional care. These are not interchangeable. Claims about effectiveness, anonymity or confidentiality need evidence rather than a marketing label."], bullets: ["Check costs, trial limits, language and who can use the service.", "Read privacy terms before sharing sensitive details.", "Do not use a chatbot to make medical decisions or judge a crisis."] },
    { heading: "When to seek professional or urgent help", paragraphs: ["Speak to a GP or another appropriate professional if distress persists, gets worse or affects sleep, work, study or relationships. NHS services and access arrangements differ across the UK; check your local NHS information rather than assuming a single pathway. Samaritans can be reached on 116 123 for listening support. In immediate danger or a medical emergency, call 999 or 112."] },
  ],
  fr: [
    { heading: "Choisir une ressource en connaissance de cause", paragraphs: ["Vérifiez l'organisme qui publie, les sources, la date de révision et la nature du service. Une fiche d'information, un échange avec une IA, un groupe d'entraide et une consultation professionnelle ne sont pas équivalents. Les promesses d'efficacité, d'anonymat ou de confidentialité doivent être étayées."], bullets: ["Vérifiez le coût, les limites de l'essai, la langue et les conditions d'accès.", "Lisez la politique de confidentialité avant de partager des informations sensibles.", "Ne confiez pas une décision médicale ou l'évaluation d'une crise à un chatbot."] },
    { heading: "Quand consulter ou demander une aide urgente", paragraphs: ["Si la souffrance persiste, s'aggrave ou perturbe le sommeil, les études, le travail ou les relations, contactez un professionnel de santé. Votre médecin traitant peut vous orienter vers les ressources locales ; l'accès et les délais varient. Le 3114 est le numéro national de prévention du suicide. En cas de danger immédiat ou d'urgence médicale, appelez le 112 ou le 15."] },
  ],
};
export function buildDiscoveryPages(market: Market, drafts: DiscoveryDraft[]): InternationalPage[] {
  return drafts.map(draft => ({
    ...draft, market, path: `/${market}/${discoverySlugs[market][draft.id]}`,
    sections: [...draft.sections, ...common[market]],
    relatedIds: ["wellbeing", "anxiety", "work-stress", "loneliness", ...Object.keys(discoverySlugs[market]).filter(id => id !== draft.id), "how-nuxa-works", "safety", "privacy", "editorial-policy"],
    sources: [topicSources.wellbeing[market], ...marketSources[market]],
    kind: "Article", publishedAt: "2026-10-05", updatedAt: "2026-10-05",
  }));
}
