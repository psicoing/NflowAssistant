import { randomUUID } from "node:crypto";
import type { Pool } from "@neondatabase/serverless";
import { CHAT_PROVIDER_BUDGET_USD, ChatCostPolicyError, meteredChatCost, type ChatCostQuote, type ChatBillingProvider } from "./chat-cost-policy";
import { isConfirmedOpenAiBillingRejection } from "./chat-billing-errors";

export interface ChatBudgetReservation extends ChatCostQuote { id: string; month: string }

/** Aggregate money/token metadata only. Never conversations or patient IDs. */
export class ChatBudgetLedger {
  private readonly months: string;
  private readonly requests: string;
  private initialization?: Promise<void>;
  private readonly budgetNanoUsd: number;

  constructor(private readonly pool: Pool, schema = "public", private readonly testMonth?: () => string, readonly provider: ChatBillingProvider = "replit") {
    if (!/^[a-z_][a-z0-9_]{0,50}$/.test(schema)) throw new Error("Invalid budget schema");
    if (!(provider in CHAT_PROVIDER_BUDGET_USD)) throw new Error("Invalid budget provider");
    this.budgetNanoUsd = CHAT_PROVIDER_BUDGET_USD[provider] * 1e9;
    // Preserve the existing Replit ledger and all previously retained holds.
    const prefix = provider === "openai" ? "chat_ai_openai_budget" : "chat_ai_budget";
    this.months = `"${schema}"."${prefix}_months"`;
    this.requests = `"${schema}"."${prefix}_requests"`;
  }

  async ensureTables() {
    if (!this.initialization) {
      this.initialization = (async () => {
        await this.pool.query(`CREATE TABLE IF NOT EXISTS ${this.months} (
          month text PRIMARY KEY,
          budget_nano_usd bigint NOT NULL DEFAULT ${this.budgetNanoUsd},
          accounted_nano_usd bigint NOT NULL DEFAULT 0,
          reserved_nano_usd bigint NOT NULL DEFAULT 0,
          faulted boolean NOT NULL DEFAULT false,
          updated_at timestamp NOT NULL DEFAULT NOW()
        )`);
        await this.pool.query(`CREATE TABLE IF NOT EXISTS ${this.requests} (
          id text PRIMARY KEY,
          month text NOT NULL REFERENCES ${this.months}(month),
          model text NOT NULL,
          maximum_nano_usd bigint NOT NULL,
          input_token_bound integer NOT NULL,
          output_token_limit integer NOT NULL,
          accounted_nano_usd bigint,
          input_tokens integer,
          output_tokens integer,
          state text NOT NULL DEFAULT 'reserved',
          created_at timestamp NOT NULL DEFAULT NOW(),
          updated_at timestamp NOT NULL DEFAULT NOW()
        )`);
      })().catch(error => { this.initialization = undefined; throw error; });
    }
    await this.initialization;
  }

  private async currentMonth(client: { query: Pool["query"] }) {
    if (this.testMonth) {
      const month = this.testMonth();
      if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) throw new Error("Invalid test month");
      return month;
    }
    const { rows } = await client.query("SELECT to_char(CURRENT_TIMESTAMP AT TIME ZONE 'UTC', 'YYYY-MM') AS month");
    return rows[0].month as string;
  }

  async reserve(quote: ChatCostQuote): Promise<ChatBudgetReservation> {
    if (!Number.isSafeInteger(quote.maximumNanoUsd) || quote.maximumNanoUsd <= 0) throw new Error("Invalid reservation");
    await this.ensureTables();
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      const month = await this.currentMonth(client);
      await client.query(`INSERT INTO ${this.months} (month) VALUES ($1) ON CONFLICT DO NOTHING`, [month]);
      const { rows } = await client.query(`SELECT * FROM ${this.months} WHERE month=$1 FOR UPDATE`, [month]);
      const record = rows[0];
      const limit = Math.min(Number(record.budget_nano_usd), this.budgetNanoUsd);
      const faults = await client.query(`SELECT EXISTS(SELECT 1 FROM ${this.months} WHERE faulted=true) AS faulted`);
      if (record.faulted || faults.rows[0].faulted) throw new ChatCostPolicyError("NUXA_CHAT_ACCOUNTING_REVIEW_REQUIRED", "Accounting review required; generation blocked.");
      if (Number(record.accounted_nano_usd) + Number(record.reserved_nano_usd) + quote.maximumNanoUsd > limit) {
        throw new ChatCostPolicyError("NUXA_CHAT_MONTHLY_BUDGET_EXCEEDED", "Monthly written-chat budget cannot cover this request. No provider call was made.");
      }
      const id = randomUUID();
      await client.query(`UPDATE ${this.months} SET reserved_nano_usd=reserved_nano_usd+$2, updated_at=NOW() WHERE month=$1`, [month, quote.maximumNanoUsd]);
      await client.query(`INSERT INTO ${this.requests}
        (id, month, model, maximum_nano_usd, input_token_bound, output_token_limit)
        VALUES ($1,$2,$3,$4,$5,$6)`, [id, month, quote.model, quote.maximumNanoUsd, quote.inputTokenBound, quote.outputTokenLimit]);
      await client.query("COMMIT");
      return { ...quote, id, month };
    } catch (error) {
      await client.query("ROLLBACK").catch(() => {});
      throw error;
    } finally { client.release(); }
  }

  async rejectUnbilled(reservation: ChatBudgetReservation, error: unknown) {
    if (this.provider !== "openai" || !isConfirmedOpenAiBillingRejection(error)) {
      throw new Error("Only a confirmed direct OpenAI billing rejection may release this reservation");
    }
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      const { rows } = await client.query(`SELECT * FROM ${this.requests} WHERE id=$1 FOR UPDATE`, [reservation.id]);
      const record = rows[0];
      if (!record) throw new Error("Unknown budget reservation");
      if (record.state === "reserved") {
        await client.query(`UPDATE ${this.months} SET reserved_nano_usd=reserved_nano_usd-$2, updated_at=NOW() WHERE month=$1`,
          [record.month, Number(record.maximum_nano_usd)]);
        await client.query(`UPDATE ${this.requests} SET state='rejected_unbilled', accounted_nano_usd=0,
          input_tokens=0, output_tokens=0, updated_at=NOW() WHERE id=$1`, [reservation.id]);
      }
      await client.query("COMMIT");
    } catch (failure) {
      await client.query("ROLLBACK").catch(() => {});
      throw failure;
    } finally { client.release(); }
  }

  async settle(reservation: ChatBudgetReservation, usage: Parameters<typeof meteredChatCost>[0], serviceTier?: string, requireAccountingReview = false) {
    const cost = meteredChatCost(usage, serviceTier);
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      const { rows } = await client.query(`SELECT * FROM ${this.requests} WHERE id=$1 FOR UPDATE`, [reservation.id]);
      const record = rows[0];
      if (!record) throw new Error("Unknown budget reservation");
      if (record.state !== "reserved") { await client.query("COMMIT"); return; }
      if (!cost) {
        // Unknown usage or a failed/aborted request may still have been billed.
        // Keep its entire reservation, even after a restart; never release it
        // just because a timer elapsed or a provider response was lost.
        await client.query(`UPDATE ${this.requests} SET state='uncertain', updated_at=NOW() WHERE id=$1`, [reservation.id]);
        if (requireAccountingReview) {
          await client.query(`UPDATE ${this.months} SET faulted=true, updated_at=NOW() WHERE month=$1`, [record.month]);
        }
      } else {
        const breached = cost.inputTokens > Number(record.input_token_bound) ||
          cost.outputTokens > Number(record.output_token_limit) || cost.nanoUsd > Number(record.maximum_nano_usd);
        await client.query(`UPDATE ${this.months} SET
          accounted_nano_usd=accounted_nano_usd+$2,
          reserved_nano_usd=reserved_nano_usd-$3,
          faulted=faulted OR $4, updated_at=NOW() WHERE month=$1`,
        [record.month, cost.nanoUsd, Number(record.maximum_nano_usd), breached]);
        await client.query(`UPDATE ${this.requests} SET state='settled', accounted_nano_usd=$2,
          input_tokens=$3, output_tokens=$4, updated_at=NOW() WHERE id=$1`,
        [reservation.id, cost.nanoUsd, cost.inputTokens, cost.outputTokens]);
        if (breached) console.error("[chat-budget] Provider usage exceeded a reservation bound; subsequent generation is blocked.");
      }
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK").catch(() => {});
      throw error;
    } finally { client.release(); }
  }

  async lastOutcome(): Promise<string | null> {
    await this.ensureTables();
    const { rows } = await this.pool.query(`SELECT state FROM ${this.requests}
      WHERE state IN ('settled', 'rejected_unbilled', 'uncertain')
      ORDER BY created_at DESC, id DESC LIMIT 1`);
    return rows[0]?.state ?? null;
  }

  async status() {
    await this.ensureTables();
    const month = await this.currentMonth(this.pool);
    const { rows } = await this.pool.query(`SELECT * FROM ${this.months} WHERE month=$1`, [month]);
    const row = rows[0];
    const accounted = Number(row?.accounted_nano_usd ?? 0);
    const reserved = Number(row?.reserved_nano_usd ?? 0);
    const budget = Math.min(Number(row?.budget_nano_usd ?? this.budgetNanoUsd), this.budgetNanoUsd);
    const tokens = await this.pool.query(`SELECT COALESCE(SUM(input_tokens),0) AS input, COALESCE(SUM(output_tokens),0) AS output,
      COUNT(*) AS requests, COUNT(*) FILTER (WHERE state='uncertain') AS uncertain
      FROM ${this.requests} WHERE month=$1`, [month]);
    const faults = await this.pool.query(`SELECT EXISTS(SELECT 1 FROM ${this.months} WHERE faulted=true) AS faulted`);
    return {
      month, provider: this.provider, period: "calendar-month-UTC", currency: "USD", scope: "all-written-chat-users",
      monthlyLimitUsd: budget / 1e9, accountedUpperBoundUsd: accounted / 1e9,
      reservedUpperBoundUsd: reserved / 1e9, availableUsd: Math.max(0, budget - accounted - reserved) / 1e9,
      inputTokens: Number(tokens.rows[0].input), outputTokens: Number(tokens.rows[0].output),
      requests: Number(tokens.rows[0].requests), uncertainRequests: Number(tokens.rows[0].uncertain),
      blockedForAccountingReview: Boolean(faults.rows[0].faulted),
      invoiceVerified: false,
    };
  }
}
