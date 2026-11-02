import { randomUUID } from "node:crypto";
import type Stripe from "stripe";
import { CheckoutError, StripeCheckoutStore, type CheckoutProduct } from "./stripe-checkout-store";

export const CHECKOUT_PRODUCTS: Record<string, CheckoutProduct> = {
  basic: { key: "basic", amount: 299, months: 1, limit: 10 },
  individual: { key: "individual", amount: 599, months: 1, limit: 20 },
  premium: { key: "premium", amount: 3200, months: 12, limit: 30 },
  pack10: { key: "pack10", amount: 299, questions: 10 },
  pack20: { key: "pack20", amount: 599, questions: 20 },
  pack100: { key: "pack100", amount: 3200, questions: 100 },
  pack15: { key: "pack15", amount: 500, questions: 15 },
  pack35: { key: "pack35", amount: 1000, questions: 35 },
};
const positiveId = (value: unknown) => typeof value === "string" && /^[1-9]\d*$/.test(value) && Number.isSafeInteger(Number(value)) ? Number(value) : undefined;
const idOf = (value: any) => typeof value === "string" ? value : value?.id;

export class StripeCheckoutService {
  constructor(private store: StripeCheckoutStore, private stripe: Stripe, private liveMode: boolean) {}

  async create(userId: number, product: CheckoutProduct, params: Stripe.Checkout.SessionCreateParams) {
    const user = await this.store.user(userId);
    if (!user || !user.email?.trim()) throw new CheckoutError(401, "account_required", "Inicia sesión o regístrate en NUXA antes de pagar.");
    const nonce = randomUUID();
    const attempt = await this.store.attempt(userId, product, `attempt:${nonce}`);
    const metadata = {
      ...params.metadata, app: "nuxa", bindingVersion: "1",
      userId: String(userId), transactionId: String(attempt.id),
    };
    let session: Stripe.Checkout.Session | undefined;
    try {
      session = await this.stripe.checkout.sessions.create({
        ...params, metadata, client_reference_id: String(userId), customer_email: user.email.trim(),
        ...(params.mode === "subscription" ? { subscription_data: { ...params.subscription_data, metadata } } : {}),
      }, { idempotencyKey: `nuxa-checkout:${nonce}` });
      if (!session.url || session.livemode !== this.liveMode) throw new Error("Unexpected Checkout response");
      await this.store.attach(attempt.id, session.id);
      return session;
    } catch (error) {
      // Never hand out a URL without a durable local binding.
      if (session) {
        try { await this.stripe.checkout.sessions.expire(session.id); }
        catch { console.error("[stripe-checkout] Could not expire an unattached Checkout"); }
      }
      await this.store.failed(attempt.id);
      throw error;
    }
  }

  async confirm(sessionId: unknown, expectedUserId?: number, renewal?: { invoiceId: string; amount: number }) {
    if (typeof sessionId !== "string" || !/^cs_[A-Za-z0-9_]{5,255}$/.test(sessionId)) {
      throw new CheckoutError(400, "invalid_session", "Referencia de pago inválida.");
    }
    const session = await this.stripe.checkout.sessions.retrieve(sessionId);
    const metadata = session.metadata || {};
    const transactionId = positiveId(metadata.transactionId);
    if (metadata.app !== "nuxa" || metadata.bindingVersion !== "1" || !transactionId) {
      throw new CheckoutError(409, "unbound_payment", "Este pago no tiene una vinculación verificable con NUXA. Contacta con soporte.");
    }
    const binding = await this.store.binding(transactionId);
    if (!binding || binding.stripe_session_id !== session.id ||
      metadata.userId !== String(binding.user_id) || session.client_reference_id !== String(binding.user_id)) {
      throw new CheckoutError(409, "binding_mismatch", "La vinculación del pago requiere revisión.");
    }
    if (expectedUserId !== undefined && binding.user_id !== expectedUserId) {
      throw new CheckoutError(403, "payment_not_owned", "Este pago no pertenece a tu cuenta.");
    }
    const product = CHECKOUT_PRODUCTS[binding.subscription_plan];
    if (!product || Number(binding.amount) * 100 !== product.amount || binding.currency !== "eur" ||
      session.amount_total !== product.amount || session.currency !== "eur" ||
      session.mode !== (product.questions ? "payment" : "subscription") || session.livemode !== this.liveMode) {
      throw new CheckoutError(409, "payment_mismatch", "Los datos del pago requieren revisión.");
    }
    if (session.status !== "complete" || session.payment_status !== "paid") {
      throw new CheckoutError(402, "payment_not_paid", "Stripe todavía no ha confirmado el pago.");
    }
    let expiresAt: Date | undefined;
    const subscriptionId = idOf(session.subscription);
    if (!product.questions) {
      if (!subscriptionId) throw new CheckoutError(409, "subscription_missing", "No se ha podido verificar la suscripción.");
      const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);
      const ends = subscription.items.data.map(item => item.current_period_end).filter(Number.isFinite);
      const periodEnd = ends.length ? Math.min(...ends) : 0;
      if (subscription.status !== "active" || periodEnd * 1000 <= Date.now() ||
        subscription.metadata.transactionId !== String(binding.id) ||
        subscription.metadata.userId !== String(binding.user_id) || subscription.metadata.app !== "nuxa") {
        throw new CheckoutError(402, "subscription_not_active", "No consta un periodo de suscripción activo para este pago.");
      }
      expiresAt = new Date(periodEnd * 1000);
    } else if (renewal) {
      throw new CheckoutError(409, "invalid_renewal", "Un pack no admite renovaciones.");
    }
    const applied = await this.store.complete(binding, product, expiresAt, subscriptionId, metadata, renewal);
    return { success: true, applied, userId: binding.user_id, plan: product.key, questions: product.questions || 0 };
  }

  async event(event: Stripe.Event) {
    if (event.livemode !== this.liveMode) throw new CheckoutError(400, "wrong_mode", "Modo de pago incorrecto.");
    const data = event.data.object as any;
    if (["checkout.session.completed", "checkout.session.async_payment_succeeded"].includes(event.type)) {
      return this.confirm(data.id);
    }
    if (event.type === "payment_intent.succeeded") {
      const sessions = await this.stripe.checkout.sessions.list({ payment_intent: data.id, limit: 2 });
      if (sessions.data.length !== 1) return { ignored: true };
      return this.confirm(sessions.data[0].id);
    }
    if (["invoice.payment_succeeded", "invoice.paid"].includes(event.type)) {
      const invoice = await this.stripe.invoices.retrieve(data.id);
      const subscriptionId = idOf(invoice.parent?.subscription_details?.subscription);
      if (invoice.status !== "paid" || !invoice.id || !subscriptionId) return { ignored: true };
      const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);
      const transactionId = positiveId(subscription.metadata.transactionId);
      if (subscription.metadata.app !== "nuxa" || !transactionId) return { ignored: true };
      const binding = await this.store.binding(transactionId);
      if (!binding) throw new CheckoutError(409, "binding_missing", "El pago requiere revisión.");
      if (invoice.currency !== binding.currency || invoice.amount_paid !== CHECKOUT_PRODUCTS[binding.subscription_plan]?.amount) {
        throw new CheckoutError(409, "invoice_mismatch", "La factura requiere revisión.");
      }
      if (!["subscription_create", "subscription_cycle"].includes(invoice.billing_reason || "")) return { ignored: true };
      return this.confirm(binding.stripe_session_id, undefined,
        invoice.billing_reason === "subscription_cycle" ? { invoiceId: invoice.id, amount: invoice.amount_paid } : undefined);
    }
    return { ignored: true };
  }
}
