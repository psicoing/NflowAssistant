import { STRIPE_LETTERS } from "./stripe-commercial-letter";

export type CommercialAudienceId = "stripe" | "probadores";

const PROBADORES_LETTERS = {
  es: {
    ...STRIPE_LETTERS.es,
    subject: "Continúa con NUXA: descubre nuestros planes",
    body: `Hola:

Gracias por acercarte a NUXA y a sus recursos gratuitos.

Si quieres conocer las opciones para seguir conversando con NUXA, te invitamos a descubrir nuestros planes y elegir el que mejor encaje contigo.

NUXA es un asistente de IA especializado en bienestar emocional, disponible para reflexionar y explorar herramientas prácticas a tu ritmo.

Consulta las condiciones, los límites y los precios en nuestra web antes de contratar. No es necesario responder con información personal o de salud.

NUXA no sustituye la atención de un profesional sanitario ni es un servicio de emergencias.

El equipo de NUXA`,
  },
  en: {
    ...STRIPE_LETTERS.en,
    subject: "Continue with NUXA: explore our plans",
    body: `Hello,

Thank you for exploring NUXA and its free resources.

If you would like to discover ways to continue talking with NUXA, we invite you to explore our plans and choose the option that suits you.

NUXA is an AI assistant specialising in emotional wellbeing, available to help you reflect and explore practical tools at your own pace.

Please review the terms, limits and prices on our website before subscribing. You do not need to reply with personal or health information.

NUXA does not replace care from a healthcare professional and is not an emergency service.

The NUXA team`,
  },
};

/** Fixed server-owned identifiers only: never accept a table or audience from a request. */
export function commercialAudience(id: CommercialAudienceId = "stripe") {
  if (id !== "stripe" && id !== "probadores") throw new Error("Unsupported commercial audience");
  const stripe = id === "stripe";
  return {
    id,
    label: stripe ? "Stripe" : "Probadores",
    base: `/api/admin/${id}-contacts`,
    publicPath: `/api/${id}-commercial/unsubscribe`,
    tables: {
      contacts: `${id}_commercial_contacts`,
      letter: `${id}_commercial_letter`,
      authorizations: `${id}_commercial_authorizations`,
      dispatches: `${id}_commercial_dispatches`,
      recipients: `${id}_commercial_recipients`,
    },
    letters: stripe ? STRIPE_LETTERS : PROBADORES_LETTERS,
  };
}
