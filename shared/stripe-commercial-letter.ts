export const STRIPE_LETTER_DEFAULT = {
  subject: "Descubre NUXA: un espacio para tu bienestar emocional",
  body: `Hola:

A veces necesitamos parar, poner en palabras lo que nos preocupa y encontrar una forma de seguir adelante.

Con NUXA puedes conversar con una inteligencia artificial especializada en bienestar emocional, explorar lo que te ocurre y conocer recursos prácticos, a tu ritmo.

Si buscas un espacio de reflexión disponible cuando lo necesites, te invitamos a conocer NUXA y elegir el plan que mejor encaje contigo. Puedes consultar las condiciones y contratar desde nuestra web, con pago mediante Stripe.

NUXA es una herramienta de IA: no sustituye la atención de un profesional de la salud ni es un servicio de emergencias.

Gracias por tu tiempo.

El equipo de NUXA`,
};

export const STRIPE_LETTER_CTA = {
  label: "Conocer los planes de NUXA",
  url: "https://nuxa.life/precios",
};

export const STRIPE_LETTER_FOOTER =
  "Si no deseas recibir más comunicaciones comerciales, puedes darte de baja mediante el enlace inferior. Esta baja no elimina tu cuenta de NUXA ni cancela suscripciones o pagos.";

export type StripeLetterLanguage = "es" | "en";
export const STRIPE_LETTERS = {
  es: {
    ...STRIPE_LETTER_DEFAULT, ctaLabel: STRIPE_LETTER_CTA.label,
    footer: STRIPE_LETTER_FOOTER, unsubscribeLabel: "Darse de baja de comunicaciones comerciales",
  },
  en: {
    subject: "Discover NUXA: a space for your emotional wellbeing",
    body: `Hello,

Sometimes we need to pause, put our concerns into words and find a way forward.

With NUXA, you can talk to an AI assistant specialising in emotional wellbeing, explore what you are experiencing and discover practical resources at your own pace.

If you are looking for a space for reflection, available when you need it, we invite you to discover NUXA and choose the plan that suits you. You can review the terms and subscribe on our website, with payment through Stripe.

NUXA is an AI tool: it does not replace care from a healthcare professional and is not an emergency service.

Thank you for your time.

The NUXA team`,
    ctaLabel: "Explore NUXA plans",
    footer: "If you no longer wish to receive marketing emails, you can unsubscribe using the link below. Unsubscribing does not delete your NUXA account or cancel subscriptions or payments.",
    unsubscribeLabel: "Unsubscribe from marketing emails",
  },
} as const;
