/** Read-only audit. Outputs aggregates and internal user IDs, never emails or credentials. */
import Stripe from "stripe";
import { pool } from "../server/db";

async function main() {
  const identity = (await pool.query("SELECT md5(current_database()) AS fingerprint")).rows[0];
  if (identity.fingerprint !== process.argv[2]) throw new Error("Database identity mismatch");
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("Stripe key unavailable");
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2025-08-27.basil" });
  const norm = (value: unknown) => String(value || "").trim().toLowerCase();
  const id = (value: any): string => typeof value === "string" ? value : value?.id || "";
  const [customers, charges, sessions, subscriptions, products, userResult, transactionResult] = await Promise.all([
    stripe.customers.list({ limit: 100 }).autoPagingToArray({ limit: 10000 }),
    stripe.charges.list({ limit: 100 }).autoPagingToArray({ limit: 10000 }),
    stripe.checkout.sessions.list({ limit: 100, status: "complete" }).autoPagingToArray({ limit: 10000 }),
    stripe.subscriptions.list({ limit: 100, status: "all" }).autoPagingToArray({ limit: 10000 }),
    stripe.products.list({ limit: 100 }).autoPagingToArray({ limit: 10000 }),
    pool.query(`SELECT id,email,subscription_status,subscription_plan,subscription_id,
      subscription_expires_at,has_completed_payment,prepaid_questions,role,created_at FROM users`),
    pool.query("SELECT user_id,stripe_session_id,status FROM stripe_transactions"),
  ]);
  if ([customers, charges, sessions, subscriptions, products].some(rows => rows.length >= 10000)) {
    throw new Error("Audit pagination cap reached; results withheld");
  }
  const users = userResult.rows;
  const customerMap = new Map(customers.map(c => [c.id, c]));
  const sessionForIntent = new Map(sessions.filter(s => s.payment_intent).map(s => [id(s.payment_intent), s]));
  const paid = charges.filter(c => c.paid && c.status === "succeeded");
  const currencies: Record<string, { gross: number; refunds: number; charges: number }> = {};
  const years: Record<string, { charges: number; gross: number }> = {};
  const linkedUsers = new Set<number>();
  const unmatchedCustomers = new Set<string>();
  const matchedCases: unknown[] = [];
  let linkedCharges = 0;
  let conflictingMatches = 0;
  let paidSessions = 0;
  let paidSessionsNoUser = 0;
  let paidSessionsExplicitNuxa = 0;
  for (const session of sessions) {
    if (session.payment_status !== "paid") continue;
    paidSessions++;
    const email = norm(session.customer_details?.email || session.customer_email || customerMap.get(id(session.customer))?.email);
    const matches = users.filter(u => norm(u.email) === email && email);
    if (!matches.length) paidSessionsNoUser++;
    if (Object.values(session.metadata || {}).some(v => /nuxa|neuropsi/i.test(v))) paidSessionsExplicitNuxa++;
  }
  for (const charge of paid) {
    const customer = customerMap.get(id(charge.customer));
    const session = sessionForIntent.get(id(charge.payment_intent));
    const emails = new Set([charge.billing_details?.email, charge.receipt_email, customer?.email,
      session?.customer_details?.email, session?.customer_email].map(norm).filter(Boolean));
    const matches = users.filter(u => emails.has(norm(u.email)));
    const totals = currencies[charge.currency] ||= { gross: 0, refunds: 0, charges: 0 };
    totals.gross += charge.amount; totals.refunds += charge.amount_refunded; totals.charges++;
    const year = `${new Date(charge.created * 1000).getUTCFullYear()}_${charge.currency}`;
    const annual = years[year] ||= { charges: 0, gross: 0 };
    annual.charges++; annual.gross += charge.amount;
    if (matches.length > 1) conflictingMatches++;
    if (matches.length) linkedCharges++;
    else unmatchedCustomers.add(id(charge.customer) || "no_customer");
    for (const user of matches) {
      linkedUsers.add(user.id);
      matchedCases.push({
        userId: user.id, paidAt: new Date(charge.created * 1000).toISOString().slice(0, 10),
        amountMinor: charge.amount, currency: charge.currency, refundedMinor: charge.amount_refunded,
        disputed: charge.disputed, status: user.subscription_status, plan: user.subscription_plan,
        markedPaid: user.has_completed_payment, expiresAt: user.subscription_expires_at,
        prepaidRemaining: user.prepaid_questions, userCreatedAt: user.created_at,
        checkoutFound: !!session,
      });
    }
  }
  const paidUserCases = users.filter(u => u.has_completed_payment || u.subscription_status === "active").map(u => ({
    userId: u.id, status: u.subscription_status, plan: u.subscription_plan, role: u.role,
    markedPaid: u.has_completed_payment, matchedSuccessfulChargeByEmail: linkedUsers.has(u.id),
    expiresAt: u.subscription_expires_at, prepaidRemaining: u.prepaid_questions,
    localTransactionStatuses: transactionResult.rows.filter(t => t.user_id === u.id).map(t => t.status),
  }));
  console.log(JSON.stringify({
    liveMode: customers.every(c => c.livemode), customers: customers.length,
    customerCreationYears: customers.reduce<Record<string, number>>((a, c) => {
      const y = String(new Date(c.created * 1000).getUTCFullYear()); a[y] = (a[y] || 0) + 1; return a;
    }, {}),
    charges: charges.length, successfulCharges: paid.length, currencies, years,
    linkedCharges, linkedUsers: linkedUsers.size, unmatchedPayingCustomerRecords: unmatchedCustomers.size,
    conflictingMatches, completeCheckoutSessions: sessions.length, paidSessions, paidSessionsNoUser,
    paidSessionsExplicitNuxa, subscriptionStatuses: subscriptions.reduce<Record<string, number>>((a,s) => {
      a[s.status] = (a[s.status] || 0) + 1; return a;
    }, {}),
    productNames: [...new Set(products.map(p => p.name))],
    matchedCases, paidUserCases,
  }, null, 2));
}

main().catch((error: any) => {
  console.error(JSON.stringify({ errorType: error.type || error.name, status: error.statusCode || null }));
  process.exitCode = 1;
}).finally(() => pool.end());
