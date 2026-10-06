import twilio from "twilio";
import { parsePhoneNumberFromString } from "libphonenumber-js/max";
import { getUncachableSendGridClient } from "../sendgridClient";
import { TrialError } from "./store";

export interface TrialProviders {
  email(to: string, code: string): Promise<void>;
  quoteSms(phone: string): Promise<number>;
  sms(to: string, code: string): Promise<{ id: string; priceMicroUsd?: number }>;
}

function getTwilio() {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    throw new TrialError(503, "SMS_UNAVAILABLE", "El envío de SMS no está disponible. Inténtalo más tarde.");
  }
  return twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN,
    { autoRetry: false, timeout: 15_000 });
}

export function quoteTrialSmsPrice(priceUnit: unknown, carriers: unknown): number {
  const prices = Array.isArray(carriers)
    ? carriers.flatMap(carrier => Array.isArray(carrier?.prices) ? carrier.prices : [])
    : [];
  // The current Twilio SDK leaves nested JSON in snake_case despite its
  // camelCase TypeScript declarations. Support both shapes explicitly.
  const rates = prices.map(price => Number(price.currentPrice ?? price.current_price));
  if (typeof priceUnit !== "string" || priceUnit.toUpperCase() !== "USD" || !rates.length ||
      rates.some(rate => !Number.isFinite(rate) || rate <= 0)) {
    throw new TrialError(503, "SMS_UNPRICED", "No podemos confirmar el coste del SMS para este país.");
  }
  return Math.ceil(Math.max(0.50, Math.max(...rates) * 3 + 0.25) * 1_000_000);
}

let senderCache: { number: string; expires: number } | undefined;
async function getSmsSender() {
  if (senderCache && senderCache.expires > Date.now()) return senderCache.number;
  const owned = await getTwilio().incomingPhoneNumbers.list({ limit: 100 });
  const sms = owned.filter(number => number.capabilities.sms);
  const configured = sms.find(number => number.phoneNumber === process.env.TWILIO_FROM_NUMBER);
  const sender = configured || (sms.length === 1 ? sms[0] : undefined);
  if (!sender) throw new TrialError(503, "SMS_UNAVAILABLE",
    "No hay un remitente SMS disponible. Inténtalo más tarde.");
  senderCache = { number: sender.phoneNumber, expires: Date.now() + 60_000 };
  return sender.phoneNumber;
}

export function normalizeTrialPhone(input: string) {
  if (typeof input !== "string" || input.length > 40 || !input.trim().startsWith("+")) {
    throw new TrialError(400, "INVALID_PHONE", "Introduce un móvil con prefijo internacional, por ejemplo +34.");
  }
  const phone = parsePhoneNumberFromString(input.trim());
  if (!phone?.isValid() || !phone.country || phone.ext) {
    throw new TrialError(400, "INVALID_PHONE", "El número de móvil no es válido.");
  }
  const type = phone.getType();
  if (type !== "MOBILE" && type !== "FIXED_LINE_OR_MOBILE") {
    throw new TrialError(400, "INVALID_PHONE", "Necesitamos un número de móvil que pueda recibir SMS.");
  }
  return phone.number as string;
}

export const productionTrialProviders: TrialProviders = {
  async email(to, code) {
    const { client, fromEmail } = await getUncachableSendGridClient();
    await client.send({
      to, from: fromEmail, subject: "Tu código de verificación de NUXA",
      text: `Tu código de verificación de NUXA es ${code}. Caduca en 10 minutos. No lo compartas. Si no has solicitado la prueba, ignora este mensaje.`,
      // No user-controlled HTML, links or tracking in security codes.
      trackingSettings: { clickTracking: { enable: false }, openTracking: { enable: false } },
    });
  },
  async quoteSms(phone) {
    const country = parsePhoneNumberFromString(phone)?.country;
    if (!country) throw new TrialError(400, "INVALID_PHONE", "El móvil no es válido.");
    const prices = await getTwilio().pricing.v1.messaging.countries(country).fetch();
    // Fail closed for missing prices/currencies. Reserve a deliberately generous
    // envelope for one ASCII segment, carrier fees and price variation.
    await getSmsSender();
    return quoteTrialSmsPrice(prices.priceUnit, prices.outboundSmsPrices);
  },
  async sms(to, code) {
    // ASCII and <160 GSM characters: one segment, even on Spanish mobiles.
    const body = `NUXA: Tu codigo es ${code}. Caduca en 10 minutos. No lo compartas.`;
    const message = await getTwilio().messages.create({
      to, from: await getSmsSender(), body,
    });
    const price = message.price == null ? undefined : Math.abs(Number(message.price));
    const priceMicroUsd = price !== undefined && Number.isFinite(price) &&
      message.priceUnit?.toUpperCase() === "USD" ? Math.ceil(price * 1_000_000) : undefined;
    return { id: message.sid, priceMicroUsd };
  },
};
