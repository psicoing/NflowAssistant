import type { Pool } from "@neondatabase/serverless";

export class CheckoutError extends Error {
  constructor(public status: number, public code: string, message: string) { super(message); }
}
export type CheckoutProduct = {
  key: string; amount: number; questions?: number; months?: number; limit?: number;
};
export type CheckoutBinding = {
  id: number; user_id: number; stripe_session_id: string; subscription_plan: string;
  amount: string; currency: string; status: string;
};

/** Existing ledger only: no startup DDL, migration, email or customer import. */
export class StripeCheckoutStore {
  private tables: { users: string; ledger: string };
  constructor(private pool: Pool, schema = "public") {
    if (!/^[a-z_][a-z0-9_]*$/.test(schema)) throw new Error("Invalid schema");
    this.tables = { users: `"${schema}".users`, ledger: `"${schema}".stripe_transactions` };
  }
  async user(id: number) {
    return (await this.pool.query(`SELECT id,email,role FROM ${this.tables.users} WHERE id=$1`, [id])).rows[0];
  }
  async attempt(userId: number, product: CheckoutProduct, reference: string): Promise<CheckoutBinding> {
    const row = (await this.pool.query(
      `INSERT INTO ${this.tables.ledger}
       (user_id,stripe_session_id,subscription_plan,amount,currency,status)
       SELECT id,$2,$3,$4,'eur','creating' FROM ${this.tables.users} WHERE id=$1
       RETURNING *`, [userId, reference, product.key, (product.amount / 100).toFixed(2)],
    )).rows[0];
    if (!row) throw new CheckoutError(401, "account_required", "Inicia sesión en una cuenta de NUXA.");
    return row;
  }
  async attach(id: number, sessionId: string) {
    const result = await this.pool.query(
      `UPDATE ${this.tables.ledger} SET stripe_session_id=$2,status='pending'
       WHERE id=$1 AND status='creating' RETURNING id`, [id, sessionId],
    );
    if (result.rows.length !== 1) throw new Error("Checkout ledger attachment failed");
  }
  async failed(id: number) {
    await this.pool.query(`UPDATE ${this.tables.ledger} SET status='creation_failed' WHERE id=$1 AND status='creating'`, [id]);
  }
  async binding(id: number): Promise<CheckoutBinding | undefined> {
    return (await this.pool.query(`SELECT * FROM ${this.tables.ledger} WHERE id=$1`, [id])).rows[0];
  }

  async complete(
    binding: CheckoutBinding, product: CheckoutProduct, expiresAt: Date | undefined,
    subscriptionId: string | undefined, metadata: Record<string, string>,
    renewal?: { invoiceId: string; amount: number },
  ) {
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      // All returns, webhooks and invoices share this lock, including concurrent requests.
      await client.query("SELECT pg_advisory_xact_lock(hashtextextended($1,0))", [binding.stripe_session_id]);
      const current = (await client.query(`SELECT * FROM ${this.tables.ledger} WHERE id=$1 FOR UPDATE`, [binding.id])).rows[0];
      if (!current || current.user_id !== binding.user_id || current.stripe_session_id !== binding.stripe_session_id) {
        throw new CheckoutError(409, "binding_changed", "La vinculación del pago requiere revisión.");
      }
      const user = (await client.query(`SELECT id FROM ${this.tables.users} WHERE id=$1 FOR UPDATE`, [binding.user_id])).rows[0];
      if (!user) throw new CheckoutError(409, "account_missing", "La cuenta del pago requiere revisión.");
      let ledgerId = current.id;
      if (renewal) {
        const prior = (await client.query(`SELECT id,status FROM ${this.tables.ledger} WHERE stripe_session_id=$1`, [renewal.invoiceId])).rows;
        if (prior.length) {
          if (prior.length !== 1 || prior[0].status !== "completed") throw new Error("Ambiguous renewal ledger");
          await client.query("COMMIT");
          return false;
        }
        ledgerId = (await client.query(`INSERT INTO ${this.tables.ledger}
          (user_id,stripe_session_id,subscription_plan,amount,currency,status)
          VALUES ($1,$2,$3,$4,'eur','pending') RETURNING id`,
        [binding.user_id, renewal.invoiceId, product.key, (renewal.amount / 100).toFixed(2)])).rows[0].id;
      } else if (current.status === "completed") {
        await client.query("COMMIT");
        return false;
      } else if (current.status !== "pending") {
        throw new CheckoutError(409, "payment_not_pending", "El pago requiere revisión.");
      }
      if (product.questions) {
        await client.query(`UPDATE ${this.tables.users}
          SET prepaid_questions=COALESCE(prepaid_questions,0)+$2,has_completed_payment=true WHERE id=$1`,
        [binding.user_id, product.questions]);
      } else {
        await client.query(`UPDATE ${this.tables.users} SET subscription_status='active',
          subscription_plan=$2,subscription_id=$3,subscription_expires_at=$4,
          has_completed_payment=true,monthly_question_limit=$5,
          questions_used_this_month=0,last_question_reset_date=NOW()
          WHERE id=$1 AND (subscription_status IS DISTINCT FROM 'active'
            OR subscription_expires_at IS NULL OR subscription_expires_at < $4)`,
        [binding.user_id, product.key, subscriptionId, expiresAt, product.limit]);
      }
      await client.query(`UPDATE ${this.tables.ledger} SET status='completed',completed_at=NOW() WHERE id=$1`, [ledgerId]);
      // Preserve referral accounting on initial subscription payment, in the same transaction.
      if (!product.questions && !renewal) await this.referral(client, binding, product, metadata);
      await client.query("COMMIT");
      return true;
    } catch (error) { await client.query("ROLLBACK"); throw error; }
    finally { client.release(); }
  }
  private async referral(client: any, binding: CheckoutBinding, product: CheckoutProduct, metadata: Record<string, string>) {
    const schema = this.tables.users.slice(0, -6);
    let referral: any;
    if (/^[1-9]\d*$/.test(metadata.partnerId || "")) {
      const partner = (await client.query(`SELECT id FROM ${schema}.partners WHERE id=$1 AND status IN ('approved','active')`,
        [Number(metadata.partnerId)])).rows[0];
      if (partner) {
        referral = (await client.query(`SELECT id,partner_id FROM ${schema}.partner_referrals WHERE user_id=$1 AND partner_id=$2 LIMIT 1 FOR UPDATE`,
          [binding.user_id, partner.id])).rows[0];
        if (!referral) {
          referral = (await client.query(`INSERT INTO ${schema}.partner_referrals
            (partner_id,user_id,referral_code,status,subscription_plan,amount,commission)
            VALUES ($1,$2,$3,'pending',$4,$5,$6) RETURNING id,partner_id`,
          [partner.id, binding.user_id, metadata.referralCode || "", product.key,
            (product.amount / 100).toFixed(2), (product.amount / 1000).toFixed(2)])).rows[0];
        }
      }
    } else {
      referral = (await client.query(`SELECT id,partner_id FROM ${schema}.partner_referrals
        WHERE user_id=$1 AND status='pending' ORDER BY id LIMIT 1 FOR UPDATE`, [binding.user_id])).rows[0];
    }
    if (referral) {
      await client.query(`UPDATE ${schema}.partner_referrals SET subscription_plan=$2,amount=$3,
        commission=$4,status='completed',paid_at=NOW() WHERE id=$1`,
      [referral.id, product.key, (product.amount / 100).toFixed(2), (product.amount / 1000).toFixed(2)]);
      // Same lock order for partner aggregates across different buyers.
      await client.query(`SELECT id FROM ${schema}.partners WHERE id=$1 FOR UPDATE`, [referral.partner_id]);
      await client.query(`UPDATE ${schema}.partners SET total_referrals=(
        SELECT COUNT(*) FROM ${schema}.partner_referrals WHERE partner_id=$1 AND status='completed'),
        total_earnings=(SELECT COALESCE(SUM(commission::numeric),0)::text FROM ${schema}.partner_referrals
        WHERE partner_id=$1 AND status='completed') WHERE id=$1`, [referral.partner_id]);
    }
  }
}
