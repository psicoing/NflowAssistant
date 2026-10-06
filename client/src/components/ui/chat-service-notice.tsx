import { AlertCircle, Info } from "lucide-react";
import { chatUnavailableNotice, type ChatServiceStatus } from "@shared/chat-service";

const copy: Record<string, { confirmed: string; unconfirmed: string; automatic: string }> = {
  es: { confirmed: "La IA sigue disponible a través de la conexión activa.", unconfirmed: "La disponibilidad de la IA no está confirmada.", automatic: "Respuesta automática · no personalizada" },
  en: { confirmed: "AI is still available through the active connection.", unconfirmed: "AI availability is not confirmed.", automatic: "Automatic reply · not personalised" },
  fr: { confirmed: "L’IA reste disponible via la connexion active.", unconfirmed: "La disponibilité de l’IA n’est pas confirmée.", automatic: "Réponse automatique · non personnalisée" },
  de: { confirmed: "Die KI ist über die aktive Verbindung weiterhin verfügbar.", unconfirmed: "Die Verfügbarkeit der KI ist nicht bestätigt.", automatic: "Automatische Antwort · nicht personalisiert" },
  it: { confirmed: "L’IA è ancora disponibile tramite la connessione attiva.", unconfirmed: "La disponibilità dell’IA non è confermata.", automatic: "Risposta automatica · non personalizzata" },
  pt: { confirmed: "A IA continua disponível através da ligação ativa.", unconfirmed: "A disponibilidade da IA não está confirmada.", automatic: "Resposta automática · não personalizada" },
  ca: { confirmed: "La IA continua disponible a través de la connexió activa.", unconfirmed: "La disponibilitat de la IA no està confirmada.", automatic: "Resposta automàtica · no personalitzada" },
  eu: { confirmed: "AA erabilgarri dago oraindik konexio aktiboaren bidez.", unconfirmed: "AAren erabilgarritasuna ez dago baieztatuta.", automatic: "Erantzun automatikoa · ez pertsonalizatua" },
  gl: { confirmed: "A IA segue dispoñible a través da conexión activa.", unconfirmed: "A dispoñibilidade da IA non está confirmada.", automatic: "Resposta automática · non personalizada" },
};

function languageCopy(language: string) {
  const code = language.toLowerCase().split(/[-_]/)[0];
  return copy[code] || copy.es;
}

interface ChatServiceNoticeProps {
  status?: ChatServiceStatus;
  language: string;
  forceUnavailable?: boolean;
}

export function ChatServiceNotice({ status, language, forceUnavailable = false }: ChatServiceNoticeProps) {
  const state = forceUnavailable ? "unavailable" : status?.state;
  if (!state || state === "available") return null;

  const text = state === "unavailable"
    ? chatUnavailableNotice(language)
    : state === "limited" && status?.connections.some((connection) => connection.state === "unavailable")
      ? status.connections.some((connection) => connection.state === "available")
        ? languageCopy(language).confirmed
        : languageCopy(language).unconfirmed
      : languageCopy(language).unconfirmed;

  return (
    <div
      role={state === "unavailable" ? "alert" : "status"}
      aria-live={state === "unavailable" ? "assertive" : "polite"}
      className={`mx-auto w-full max-w-4xl rounded-lg border px-4 py-3 text-sm leading-relaxed ${
        state === "unavailable"
          ? "border-amber-400/40 bg-amber-950/40 text-amber-100"
          : "border-sky-400/30 bg-sky-950/30 text-sky-100"
      }`}
    >
      <div className="flex items-start gap-2.5">
        {state === "unavailable"
          ? <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
          : <Info aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />}
        <p>{text}</p>
      </div>
    </div>
  );
}

export function AutomaticReplyLabel({ language }: { language: string }) {
  return (
    <span className="mb-2 inline-flex rounded-md border border-amber-400/30 bg-amber-500/10 px-2 py-1 text-xs font-medium text-amber-200">
      {languageCopy(language).automatic}
    </span>
  );
}
