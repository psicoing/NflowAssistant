export type ChatServiceReason = "configuration" | "billing" | "usage_limit" | "technical" | null;
export interface ChatServiceStatus {
  state: "available" | "limited" | "unavailable" | "unknown";
  connections: { provider: "openai" | "replit"; state: "available" | "unavailable" | "unknown"; reason: ChatServiceReason }[];
}
export function chatUnavailableNotice(language: string): string {
  const lang = language.toLowerCase().split(/[-_]/)[0];
  const notices: Record<string, string> = {
    es: "La IA de NUXA no está disponible en este momento. Puedes consultar tus conversaciones y recursos y volver a intentarlo más tarde. Este es un aviso automático, no una respuesta personalizada de IA, y no consume tus preguntas.",
    en: "NUXA's AI is currently unavailable. You can access your conversations and resources and try again later. This is an automatic notice, not a personalised AI response, and does not use your question allowance.",
    fr: "L’IA de NUXA n’est pas disponible pour le moment. Vous pouvez consulter vos conversations et ressources et réessayer plus tard. Ceci est un avis automatique, pas une réponse personnalisée par IA, et il ne consomme pas vos questions.",
    de: "Die KI von NUXA ist derzeit nicht verfügbar. Gespräche und Ressourcen bleiben zugänglich; versuche es später erneut. Dies ist ein automatischer Hinweis, keine personalisierte KI-Antwort, und verbraucht keine Fragen.",
    it: "L’IA di NUXA non è disponibile al momento. Puoi consultare conversazioni e risorse e riprovare più tardi. Questo è un avviso automatico, non una risposta personalizzata dell’IA, e non consuma le tue domande.",
    pt: "A IA da NUXA não está disponível neste momento. Podes consultar as conversas e os recursos e tentar novamente mais tarde. Este é um aviso automático, não uma resposta personalizada de IA, e não consome as tuas perguntas.",
    ca: "La IA de NUXA no està disponible en aquest moment. Pots consultar les converses i els recursos i tornar-ho a intentar més tard. És un avís automàtic, no una resposta personalitzada d’IA, i no consumeix preguntes.",
    eu: "NUXAren AA ez dago erabilgarri une honetan. Elkarrizketak eta baliabideak kontsulta ditzakezu eta geroago berriro saiatu. Hau ohar automatikoa da, ez AAren erantzun pertsonalizatua, eta ez du galderarik kontsumitzen.",
    gl: "A IA de NUXA non está dispoñible neste momento. Podes consultar as conversas e os recursos e volver intentalo máis tarde. Este é un aviso automático, non unha resposta personalizada de IA, e non consume as túas preguntas.",
  };
  return notices[lang] || notices.es;
}
