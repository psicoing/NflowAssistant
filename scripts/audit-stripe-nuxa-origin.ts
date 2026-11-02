/**
 * Read-only origin/linkage audit. No writes, customer creation, mail or activation.
 * Logs aggregates and pseudonymous cases only, never addresses or credentials.
 */
import Stripe from "stripe";
import { createHash } from "node:crypto";
import { pool } from "../server/db";

const norm = (v: unknown) => typeof v === "string" ? v.trim().toLowerCase() : "";
const objectId = (v: any): string => typeof v === "string" ? v : v?.id || "";
const day = (seconds: number) => new Date(seconds * 1000).toISOString().slice(0, 10);
const caseId = (v: string) => createHash("sha256").update(`nuxa-origin-audit:${v}`).digest("hex").slice(0, 12);
const countBy = <T>(rows: T[], key: (v: T) => string) => rows.reduce<Record<string, number>>((out, v) => {
  const k = key(v); out[k] = (out[k] || 0) + 1; return out;
}, {});
const urlHost = (url: string | null | undefined) => {
  if (!url) return "";
  try { return new URL(url).hostname.toLowerCase(); } catch { return ""; }
};
const hostClass = (host: string) => host === "nuxa.life" || host === "www.nuxa.life" ? "nuxa.life"
  : /(^|\.)nflow\.(one|style)$/.test(host) ? "legacy_nflow"
  : host ? "other_domain" : "not_recorded";
const maximum = 10_000;

async function main() {
  const client = await pool.connect();
  let users: any[], transactions: any[];
  try {
    await client.query("BEGIN READ ONLY");
    const identity = (await client.query("SELECT md5(current_database()) AS fingerprint")).rows[0];
    if (identity.fingerprint !== process.argv[2]) throw new Error("Database identity mismatch");
    users = (await client.query(`SELECT id,email,created_at,subscription_status,has_completed_payment,
      subscription_id FROM users`)).rows;
    transactions = (await client.query(`SELECT user_id,stripe_session_id,status,created_at FROM stripe_transactions`)).rows;
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK"); throw error;
  } finally { client.release(); }
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("Stripe configuration unavailable");
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-08-27.basil", timeout: 30_000, maxNetworkRetries: 1,
  });
  const [customers, sessions, charges] = await Promise.all([
    stripe.customers.list({ limit: 100 }).autoPagingToArray({ limit: maximum }),
    stripe.checkout.sessions.list({ limit: 100 }).autoPagingToArray({ limit: maximum }),
    stripe.charges.list({ limit: 100 }).autoPagingToArray({ limit: maximum }),
  ]);
  if ([customers, sessions, charges].some(rows => rows.length >= maximum)) throw new Error("Pagination cap reached");
  if (customers.some(c => !c.livemode) || sessions.some(s => !s.livemode) || charges.some(c => !c.livemode)) {
    throw new Error("Expected live Stripe data only");
  }
  const customerById = new Map(customers.map(c => [c.id, c]));
  const userById = new Map(users.map(u => [String(u.id), u]));
  const emailMatches = (emails: unknown[]) => {
    const set = new Set(emails.map(norm).filter(Boolean));
    return users.filter(u => set.has(norm(u.email)));
  };
  const sessionOrigin = (s: Stripe.Checkout.Session) => {
    const hosts = [urlHost(s.success_url), urlHost(s.cancel_url)];
    if (hosts.some(h => hostClass(h) === "nuxa.life")) return "nuxa_domain";
    if (Object.values(s.metadata || {}).some(v => /\bnuxa\b|neuropsi/i.test(v))) return "nuxa_metadata";
    if (s.metadata?.source === "activation_page") return "activation_metadata_only";
    if (hosts.some(h => hostClass(h) === "legacy_nflow")) return "legacy_nflow";
    return hosts.some(Boolean) ? "other_domain" : "unknown";
  };
  const currentSource = (s: Stripe.Checkout.Session) => ["nuxa_domain", "nuxa_metadata"].includes(sessionOrigin(s));
  const sessionsDetail = sessions.map(s => {
    const customer = customerById.get(objectId(s.customer));
    const candidates = emailMatches([s.customer_details?.email, s.customer_email, customer?.email]);
    const metaId = s.metadata?.userId || "";
    const metaUser = userById.get(metaId);
    const tx = transactions.filter(t => t.stripe_session_id === s.id);
    return {
      source: sessionOrigin(s), date: day(s.created), state: s.status, payment: s.payment_status,
      guest: !metaId || metaId === "unknown",
      metaUserPresent: !!metaUser, metaUserMissing: /^\d+$/.test(metaId) && !metaUser,
      candidates, tx,
      safeCase: {
        case: caseId(s.id), date: day(s.created), source: sessionOrigin(s), status: s.status,
        payment: s.payment_status, amountMinor: s.amount_total, currency: s.currency,
        metadataUserId: /^\d+$/.test(metaId) ? Number(metaId) : metaId === "unknown" ? "unknown" : null,
        metadataUserExists: !!metaUser, emailCandidateUserIds: candidates.map(u => u.id),
        localTransactionUserIds: tx.map(t => t.user_id),
      },
    };
  });
  const relevant = sessionsDetail.filter(s => ["nuxa_domain", "nuxa_metadata"].includes(s.source));
  const historicalApp = sessionsDetail.filter(s => ["activation_metadata_only", "legacy_nflow"].includes(s.source));
  const originDates: Record<string, { first: string; last: string }> = {};
  for (const s of sessionsDetail) {
    const dates = originDates[s.source] ||= { first: s.date, last: s.date };
    if (s.date < dates.first) dates.first = s.date;
    if (s.date > dates.last) dates.last = s.date;
  }
  const customerCases = customers.map(c => {
    const ownSessions = sessions.filter(s => objectId(s.customer) === c.id);
    const ownCharges = charges.filter(ch => objectId(ch.customer) === c.id);
    const candidates = emailMatches([c.email]);
    return {
      case: caseId(c.id), date: day(c.created), candidates,
      checkoutCount: ownSessions.length,
      nuxaCheckoutCount: ownSessions.filter(currentSource).length,
      successfulCharges: ownCharges.filter(ch => ch.paid && ch.status === "succeeded").length,
      chargeCount: ownCharges.length,
      hasAnyMetadata: Object.keys(c.metadata || {}).length > 0,
    };
  });
  const paidNuxa = relevant.filter(s => s.payment === "paid");
  const openNuxa = relevant.filter(s => s.state === "open" || s.state === "expired");
  const sessionIds = new Set(sessions.map(s => s.id));
  const allEmails = customers.map(c => norm(c.email)).filter(Boolean);
  const successfulCharges = charges.filter(c => c.paid && c.status === "succeeded");
  // A Checkout created with no customer may still contain a customer email.
  // Do not infer that an unmatched customer row originated in NUXA.
  console.log(JSON.stringify({
    auditAt: new Date().toISOString(), liveMode: true, allPaginationCompleted: true,
    users: users.length, distinctUserEmails: new Set(users.map(u => norm(u.email)).filter(Boolean)).size,
    stripeCustomers: customers.length, distinctCustomerEmails: new Set(allEmails).size,
    duplicateCustomerEmailRecords: allEmails.length - new Set(allEmails).size,
    customersByYear: countBy(customers, c => day(c.created).slice(0, 4)),
    busiestCustomerCreationDays: Object.entries(countBy(customers, c => day(c.created)))
      .sort((a, b) => b[1] - a[1]).slice(0, 8).map(([date, count]) => ({ date, count })),
    customerEmailLinkage: {
      noCandidate: customerCases.filter(c => !c.candidates.length).length,
      uniqueCandidate: customerCases.filter(c => c.candidates.length === 1).length,
      ambiguousCandidates: customerCases.filter(c => c.candidates.length > 1).length,
      noCheckoutOrChargeVisible: customerCases.filter(c => !c.checkoutCount && !c.chargeCount).length,
      created2026WithoutCheckoutOrChargeVisible: customerCases.filter(c => c.date.startsWith("2026") && !c.checkoutCount && !c.chargeCount).length,
      withMetadata: customerCases.filter(c => c.hasAnyMetadata).length,
    },
    checkoutSessions: sessions.length,
    checkoutStates: countBy(sessions, s => s.status || "unknown"),
    checkoutOrigins: countBy(sessionsDetail, s => s.source), checkoutOriginDates: originDates,
    checkoutReturnHostClasses: countBy(sessions, s => hostClass(urlHost(s.success_url))),
    checkoutReturnHosts: countBy(sessions, s => urlHost(s.success_url) || "not_recorded"),
    checkoutByYear: countBy(sessions, s => day(s.created).slice(0, 4)),
    nuxaCheckout: {
      total: relevant.length, paymentStatuses: countBy(relevant, s => s.payment),
      noExistingUserReferenceOrEmailCandidate: relevant.filter(s => !s.metaUserPresent && !s.candidates.length && !s.tx.length).length,
      withoutUserMetadata: relevant.filter(s => s.guest).length,
      metadataReferencesMissingUser: relevant.filter(s => s.metaUserMissing).length,
      paid: paidNuxa.length,
      paidNoExistingUserReferenceOrEmailCandidate: paidNuxa.filter(s => !s.metaUserPresent && !s.candidates.length && !s.tx.length).length,
      abandonedOrOpen: openNuxa.length,
      cases: relevant.map(s => s.safeCase),
    },
    historicalAppCheckout: {
      total: historicalApp.length, paymentStatuses: countBy(historicalApp, s => s.payment),
      withoutUserMetadata: historicalApp.filter(s => s.guest).length,
      metadataReferencesMissingUser: historicalApp.filter(s => s.metaUserMissing).length,
      noExistingUserReferenceOrEmailCandidate: historicalApp.filter(s => !s.metaUserPresent && !s.candidates.length && !s.tx.length).length,
      cases: historicalApp.map(s => s.safeCase),
    },
    completePaidWithoutEmailCandidateAllSources: sessionsDetail.filter(s => s.payment === "paid" && !s.candidates.length).length,
    charges: charges.length, successfulCharges: successfulCharges.length,
    successfulChargesByYear: countBy(successfulCharges, c => day(c.created).slice(0, 4)),
    localStripeTransactions: transactions.length,
    localTransactionStatuses: countBy(transactions, t => t.status),
    localTransactionsWithExistingUser: transactions.filter(t => userById.has(String(t.user_id))).length,
    localTransactionsNotFoundInCheckoutListing: transactions.filter(t => !sessionIds.has(t.stripe_session_id)).length,
    localTransactionReferenceKinds: countBy(transactions, t =>
      /^cs_live_/.test(t.stripe_session_id) ? "stripe_live_checkout"
      : /^cs_test_/.test(t.stripe_session_id) ? "stripe_test_checkout"
      : /^sub_/.test(t.stripe_session_id) ? "stripe_subscription"
      : "other_reference"),
    localTransactionDates: transactions.map(t => ({
      date: new Date(t.created_at).toISOString().slice(0, 10), status: t.status,
      userExists: userById.has(String(t.user_id)),
    })),
    limitations: [
      "Customer count is not a count of website registrations or current subscribers.",
      "Email is a candidate, not verified identity or proof of current entitlement.",
      "No visible Checkout/charge does not prove a customer never visited NUXA.",
      "Historical operations are limited to what the current Stripe API exposes.",
      "A nuxa.life return URL identifies the checkout route, not the human or current entitlement.",
    ],
  }, null, 2));
}
main().catch((error: any) => {
  console.error(JSON.stringify({ auditFailed: true, type: error.type || error.name, status: error.statusCode || null }));
  process.exitCode = 1;
}).finally(() => pool.end());
