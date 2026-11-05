import type { Express } from "express";
import type { Pool } from "@neondatabase/serverless";
import type { AdminUserMetrics } from "@shared/admin-user-metrics";

const customer = "COALESCE(u.role,'user') IN ('user','trial')";

/** One read-only snapshot. Never loads credentials or clinical message content. */
export async function getAdminUserMetrics(pool: Pool, at = new Date()): Promise<AdminUserMetrics> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY");
    const totals = (await client.query(`
      SELECT count(*)::int AS "totalUsers",
        count(*) FILTER(WHERE ${customer})::int AS "registeredUsers",
        count(*) FILTER(WHERE u.role='admin')::int AS "adminUsers",
        count(*) FILTER(WHERE NOT (${customer}) AND COALESCE(u.role,'')<>'admin')::int AS "otherAccounts",
        count(*) FILTER(WHERE ${customer} AND u.subscription_status='trial')::int AS "trialUsers",
        count(*) FILTER(WHERE ${customer} AND u.subscription_status='pending_payment')::int AS "pendingPayments",
        count(*) FILTER(WHERE ${customer} AND u.subscription_status='active'
          AND (u.subscription_expires_at IS NULL OR u.subscription_expires_at>$1))::int AS "activeSubscriptions",
        count(*) FILTER(WHERE ${customer} AND u.subscription_status='active'
          AND u.subscription_expires_at<=$1)::int AS "expiredActiveStatuses",
        count(*) FILTER(WHERE ${customer} AND u.trial_email_verified_at IS NOT NULL
          AND u.trial_phone_verified_at IS NOT NULL)::int AS "verifiedTrialUsers",
        (SELECT count(*)::int FROM conversations c JOIN users cu ON cu.id=c.user_id
          WHERE COALESCE(cu.role,'user') IN ('user','trial')) AS "totalConversations"
      FROM users u`, [at])).rows[0];
    const periods = (await client.query(`
      SELECT p.days,
        count(*) FILTER(WHERE ${customer} AND u.created_at>=($1::timestamptz AT TIME ZONE 'UTC')-make_interval(days=>p.days))::int AS "newUsers",
        count(*) FILTER(WHERE ${customer} AND u.last_login_at>=($1::timestamptz AT TIME ZONE 'UTC')-make_interval(days=>p.days))::int AS "customerLogins",
        count(*) FILTER(WHERE u.role='admin' AND u.last_login_at>=($1::timestamptz AT TIME ZONE 'UTC')-make_interval(days=>p.days))::int AS "adminLogins",
        (SELECT count(DISTINCT c.user_id)::int FROM conversations c
          JOIN users cu ON cu.id=c.user_id JOIN messages m ON m.conversation_id=c.id
          WHERE COALESCE(cu.role,'user') IN ('user','trial') AND m.is_user=true
            AND m.timestamp>=($1::timestamptz AT TIME ZONE 'UTC')-make_interval(days=>p.days)) AS "chatActiveUsers",
        (SELECT count(*)::int FROM conversations c
          JOIN users cu ON cu.id=c.user_id JOIN messages m ON m.conversation_id=c.id
          WHERE COALESCE(cu.role,'user') IN ('user','trial') AND m.is_user=true
            AND m.timestamp>=($1::timestamptz AT TIME ZONE 'UTC')-make_interval(days=>p.days)) AS "chatUserMessages"
      FROM (VALUES(7),(15),(30)) p(days) LEFT JOIN users u ON true
      GROUP BY p.days ORDER BY p.days`, [at])).rows;
    // Count real rows on the LEFT JOIN so an empty database has zero new accounts.
    if (totals.totalUsers === 0) periods.forEach(row => {
      row.newUsers = 0; row.customerLogins = 0; row.adminLogins = 0;
    });
    const history = (await client.query(`
      SELECT to_char(u.created_at,'YYYY-MM') AS month,
        count(*)::int AS "newUsers",
        (sum(count(*)) OVER(ORDER BY to_char(u.created_at,'YYYY-MM')))::int AS "cumulativeUsers"
      FROM users u WHERE ${customer} AND u.created_at IS NOT NULL
      GROUP BY 1 ORDER BY 1 LIMIT 240`)).rows;
    const exists = (await client.query("SELECT to_regclass('nuxa_registration_events') IS NOT NULL AS present")).rows[0].present;
    let registrationAudit: AdminUserMetrics["registrationAudit"] = {
      available: false, coverageStartedAt: null, periods: [],
    };
    if (exists) {
      const first = (await client.query("SELECT min(occurred_at) AS first FROM nuxa_registration_events")).rows[0].first;
      const auditPeriods = (await client.query(`
        SELECT p.days,count(e.id)::int AS operations,
          count(e.id) FILTER(WHERE e.outcome='success')::int AS "successfulOperations",
          count(e.id) FILTER(WHERE e.outcome='rejected')::int AS "rejectedOperations",
          count(e.id) FILTER(WHERE e.outcome='failed')::int AS "failedOperations",
          count(e.id) FILTER(WHERE e.outcome='interrupted')::int AS "interruptedOperations",
          count(e.id) FILTER(WHERE e.account_created=true)::int AS "accountsCreated",
          count(e.id) FILTER(WHERE e.code='ACCOUNT_CREATED_SESSION_FAILED')::int AS "sessionFailures"
        FROM (VALUES(7),(15),(30)) p(days)
        LEFT JOIN nuxa_registration_events e
          ON e.occurred_at>=$1::timestamptz-make_interval(days=>p.days)
            AND e.stage<>'password_login'
        GROUP BY p.days ORDER BY p.days`, [at])).rows;
      registrationAudit = {
        available: true, coverageStartedAt: first ? new Date(first).toISOString() : null,
        periods: auditPeriods,
      };
    }
    await client.query("COMMIT");
    return {
      metricsVersion: 2, generatedAt: at.toISOString(), ...totals, periods, history,
      totalRevenue: null, revenueStatus: "not_reconciled", registrationAudit,
    };
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    throw error;
  } finally { client.release(); }
}

export function registerAdminUserMetricsRoute(app: Express, pool: Pool) {
  app.get("/api/admin/stats", async (req, res) => {
    res.set("Cache-Control", "no-store");
    if (!req.session.isAdmin) return res.status(401).json({ message: "No autorizado" });
    try { res.json(await getAdminUserMetrics(pool)); }
    catch {
      console.error("[admin-metrics] Read-only statistics unavailable");
      res.status(503).json({ message: "No se han podido consultar las estadísticas. No se mostrarán ceros como si fueran datos reales." });
    }
  });
}
