import assert from "node:assert/strict";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import { StripeCheckoutStore, CheckoutError } from "../server/stripe-checkout-store";
import { CHECKOUT_PRODUCTS, StripeCheckoutService } from "../server/stripe-checkout-service";
import { paidQuestionBalance } from "../server/paid-question-balance";

// Never import server/db: that pool can point to the live application database.
neonConfig.webSocketConstructor = ws;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const schema = `test_checkout_${Date.now()}`;
let created = false;
const sessions = new Map<string, any>();
const subscriptions = new Map<string, any>();
const invoices = new Map<string, any>();
let providerCreates = 0, expires = 0, failProvider = false;
const fakeStripe: any = {
  checkout: { sessions: {
    create: async (params: any, options: any) => {
      providerCreates++;
      if (failProvider) throw new Error("Simulated provider outage");
      assert.match(options.idempotencyKey, /^nuxa-checkout:/);
      const session = {
        ...params, id: `cs_test_fixture_${providerCreates}`, url: "https://checkout.example.invalid",
        livemode: false, status: "open", payment_status: "unpaid", currency: "eur",
        amount_total: CHECKOUT_PRODUCTS[params.metadata.plan || params.metadata.packType]?.amount,
      };
      sessions.set(session.id, session);
      return session;
    },
    retrieve: async (id: string) => {
      if (!sessions.has(id)) throw new Error("Missing fixture session");
      return sessions.get(id);
    },
    expire: async () => { expires++; },
    list: async ({ payment_intent }: any) => ({ data: [...sessions.values()].filter(s => s.payment_intent === payment_intent) }),
  } },
  subscriptions: { retrieve: async (id: string) => subscriptions.get(id) },
  invoices: { retrieve: async (id: string) => invoices.get(id) },
};
const packParams = (key: string, metadata = {}) => ({
  mode: "payment" as const, metadata: { packType: key, ...metadata },
  success_url: "https://nuxa.life/stripe-return", cancel_url: "https://nuxa.life/registro",
});
const subParams = (key: string, metadata = {}) => ({
  mode: "subscription" as const, metadata: { plan: key, ...metadata },
  success_url: "https://nuxa.life/stripe-return", cancel_url: "https://nuxa.life/registro",
});
function paid(session: any) { session.status = "complete"; session.payment_status = "paid"; }
let cases = 0;
for (const subscriptionStatus of ["pending_payment", "inactive", "cancelled", "active"]) {
  const balance = paidQuestionBalance({ subscriptionStatus, subscriptionExpiresAt: new Date(0),
    monthlyQuestionLimit: 10, questionsUsedThisMonth: 0, prepaidQuestions: 10 });
  assert.equal(balance.totalRemaining, 10, "A pack must not unlock a free or expired monthly allowance");
  cases++;
}
async function rejects(operation: () => Promise<any>, code: string) {
  await assert.rejects(operation, (e: any) => e instanceof CheckoutError && e.code === code);
  cases++;
}
try {
  const fingerprint = (await pool.query("SELECT md5(current_database()) AS fingerprint")).rows[0].fingerprint;
  assert.notEqual(fingerprint, "1aad2780f5bf2f804f5c5f6de0e3969e", "Refusing to write to the known application production database");
  await pool.query(`CREATE SCHEMA "${schema}"`);
  created = true;
  await pool.query(`
    CREATE TABLE "${schema}".users (
      id SERIAL PRIMARY KEY,email TEXT,role TEXT DEFAULT 'user',
      prepaid_questions INT DEFAULT 0,has_completed_payment BOOLEAN DEFAULT false,
      subscription_status TEXT DEFAULT 'inactive',subscription_plan TEXT,subscription_id TEXT,
      subscription_expires_at TIMESTAMP,monthly_question_limit INT DEFAULT 10,
      questions_used_this_month INT DEFAULT 0,last_question_reset_date TIMESTAMP
    );
    CREATE TABLE "${schema}".stripe_transactions (
      id SERIAL PRIMARY KEY,user_id INT NOT NULL,stripe_session_id TEXT NOT NULL,
      subscription_plan TEXT NOT NULL,amount TEXT NOT NULL,currency TEXT NOT NULL,status TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),completed_at TIMESTAMP
    );
    CREATE TABLE "${schema}".partners (
      id INT PRIMARY KEY,status TEXT,total_referrals INT DEFAULT 0,total_earnings TEXT DEFAULT '0'
    );
    CREATE TABLE "${schema}".partner_referrals (
      id SERIAL PRIMARY KEY,partner_id INT NOT NULL,user_id INT NOT NULL,referral_code TEXT NOT NULL,
      subscription_plan TEXT NOT NULL,amount TEXT NOT NULL,commission TEXT NOT NULL,status TEXT NOT NULL,
      paid_at TIMESTAMP
    );
    INSERT INTO "${schema}".users (email) VALUES
      ('same@example.invalid'),('same@example.invalid'),('removed@example.invalid'),
      ('subscriber@example.invalid'),('retry@example.invalid');
    INSERT INTO "${schema}".partners (id,status) VALUES (7,'approved');
  `);
  const store = new StripeCheckoutStore(pool, schema);
  const service = new StripeCheckoutService(store, fakeStripe, false);
  const user = async (id: number) => (await pool.query(`SELECT * FROM "${schema}".users WHERE id=$1`, [id])).rows[0];
  const rows = async () => (await pool.query(`SELECT * FROM "${schema}".stripe_transactions ORDER BY id`)).rows;

  await rejects(() => service.create(99999, CHECKOUT_PRODUCTS.pack10, packParams("pack10")), "account_required");
  assert.equal(providerCreates, 0);
  assert.equal((await rows()).length, 0);

  const first: any = await service.create(1, CHECKOUT_PRODUCTS.pack10, {
    ...packParams("pack10", { userId: "2", transactionId: "999", questions: "999" }),
    customer_email: "attacker@example.invalid", client_reference_id: "2",
  });
  assert.equal(first.customer_email, "same@example.invalid");
  assert.equal(first.metadata.userId, "1");
  assert.equal(first.client_reference_id, "1");
  assert.equal((await rows())[0].status, "pending");
  cases++;
  await rejects(() => service.confirm(first.id, 1), "payment_not_paid");
  paid(first);
  await rejects(() => service.confirm(first.id, 2), "payment_not_owned");
  for (const [field, value, code] of [
    ["amount_total", 1, "payment_mismatch"], ["currency", "usd", "payment_mismatch"],
    ["livemode", true, "payment_mismatch"], ["mode", "subscription", "payment_mismatch"],
    ["client_reference_id", "2", "binding_mismatch"],
  ] as const) {
    const old = first[field]; first[field] = value;
    await rejects(() => service.confirm(first.id, 1), code);
    first[field] = old;
  }
  const meta = first.metadata;
  for (const patch of [{ userId: "2" }, { transactionId: "99999" }, { app: "another_app" }]) {
    first.metadata = { ...meta, ...patch };
    await rejects(() => service.confirm(first.id, 1), patch.app ? "unbound_payment" : "binding_mismatch");
  }
  first.metadata = meta;
  const applied = await Promise.all(Array.from({ length: 6 }, () => service.confirm(first.id, 1)));
  assert.equal(applied.filter(r => r.applied).length, 1);
  assert.equal((await user(1)).prepaid_questions, 10, "Ignore forged questions and credit only once");
  assert.equal((await user(2)).prepaid_questions, 0, "Identical email must never select the other account");
  cases++;
  first.payment_intent = "pi_fixture";
  await service.event({ type: "payment_intent.succeeded", livemode: false, data: { object: { id: "pi_fixture" } } } as any);
  await service.event({ type: "checkout.session.completed", livemode: false, data: { object: { id: first.id } } } as any);
  assert.equal((await user(1)).prepaid_questions, 10);
  cases++;
  await rejects(() => service.event({ livemode: true } as any), "wrong_mode");

  const second: any = await service.create(1, CHECKOUT_PRODUCTS.pack20, packParams("pack20"));
  paid(second);
  await Promise.all([service.confirm(first.id, 1), service.confirm(second.id, 1)]);
  assert.equal((await user(1)).prepaid_questions, 30);
  cases++;
  const missing: any = await service.create(3, CHECKOUT_PRODUCTS.pack10, packParams("pack10"));
  paid(missing);
  await pool.query(`DELETE FROM "${schema}".users WHERE id=3`);
  await rejects(() => service.confirm(missing.id), "account_missing");
  assert.equal((await user(2)).prepaid_questions, 0);

  failProvider = true;
  await assert.rejects(() => service.create(1, CHECKOUT_PRODUCTS.pack10, packParams("pack10")));
  failProvider = false;
  assert.equal((await rows()).at(-1).status, "creation_failed");
  cases++;
  const attach = store.attach.bind(store);
  store.attach = async () => { throw new Error("Simulated persistence failure"); };
  await assert.rejects(() => service.create(1, CHECKOUT_PRODUCTS.pack10, packParams("pack10")));
  store.attach = attach;
  assert.equal(expires, 1);
  assert.equal((await rows()).at(-1).status, "creation_failed");
  cases++;

  const subscription: any = await service.create(4, CHECKOUT_PRODUCTS.individual, subParams("individual", {
    partnerId: "7", referralCode: "fixture_7_code",
  }));
  paid(subscription);
  subscription.subscription = "sub_fixture";
  const periodEnd = Math.floor(Date.now() / 1000) + 30 * 86400;
  subscriptions.set("sub_fixture", { id: "sub_fixture", status: "active",
    metadata: subscription.subscription_data.metadata, items: { data: [{ current_period_end: periodEnd }] } });
  await service.confirm(subscription.id, 4);
  assert.equal((await user(4)).subscription_status, "active");
  assert.equal((await user(4)).monthly_question_limit, 20);
  assert.equal(new Date((await user(4)).subscription_expires_at).getTime(), periodEnd * 1000);
  await pool.query(`UPDATE "${schema}".users SET questions_used_this_month=3 WHERE id=4`);
  await service.confirm(subscription.id, 4);
  assert.equal((await user(4)).questions_used_this_month, 3);
  assert.equal((await pool.query(`SELECT total_referrals FROM "${schema}".partners WHERE id=7`)).rows[0].total_referrals, 1);
  cases++;

  const nextPeriod = periodEnd + 30 * 86400;
  subscriptions.get("sub_fixture").items.data[0].current_period_end = nextPeriod;
  invoices.set("in_fixture", { id: "in_fixture", status: "paid", amount_paid: 599, currency: "eur",
    billing_reason: "subscription_cycle", parent: { subscription_details: { subscription: "sub_fixture" } } });
  const event: any = { type: "invoice.payment_succeeded", livemode: false, data: { object: { id: "in_fixture" } } };
  const renewed = await Promise.all([service.event(event), service.event({ ...event, type: "invoice.paid" })]);
  assert.equal(renewed.filter((r: any) => r.applied).length, 1);
  assert.equal(new Date((await user(4)).subscription_expires_at).getTime(), nextPeriod * 1000);
  await pool.query(`UPDATE "${schema}".users SET questions_used_this_month=2 WHERE id=4`);
  await service.event(event);
  assert.equal((await user(4)).questions_used_this_month, 2);
  cases++;
  subscriptions.get("sub_fixture").status = "canceled";
  await rejects(() => service.confirm(subscription.id, 4), "subscription_not_active");

  const retry: any = await service.create(5, CHECKOUT_PRODUCTS.basic, subParams("basic"));
  paid(retry);
  retry.subscription = "sub_retry";
  subscriptions.set("sub_retry", { status: "active", metadata: retry.subscription_data.metadata,
    items: { data: [{ current_period_end: periodEnd }] } });
  await pool.query(`ALTER TABLE "${schema}".partner_referrals RENAME TO hidden_referrals`);
  await assert.rejects(() => service.confirm(retry.id, 5));
  assert.equal((await user(5)).subscription_status, "inactive");
  assert.equal((await rows()).find(r => r.stripe_session_id === retry.id).status, "pending");
  await pool.query(`ALTER TABLE "${schema}".hidden_referrals RENAME TO partner_referrals`);
  assert.equal((await service.confirm(retry.id, 5)).applied, true);
  cases++;

  sessions.set("cs_test_unbound_history", { ...first, id: "cs_test_unbound_history", metadata: { userId: "1" } });
  await rejects(() => service.confirm("cs_test_unbound_history", 1), "unbound_payment");
  await rejects(() => service.confirm("../../arbitrary", 1), "invalid_session");
  console.log(`PASS: ${cases} checkout binding, isolation, concurrency, renewal and rollback cases; no Stripe network calls.`);
} finally {
  if (created) await pool.query(`DROP SCHEMA "${schema}" CASCADE`);
  await pool.end();
}
