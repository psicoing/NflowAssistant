import { chatAiReadiness } from "./chat-ai-client";
import { getChatBudgetLedger } from "./chat-budget";
import { quoteChatRequest } from "./chat-cost-policy";
import type { ChatServiceStatus } from "../shared/chat-service";
import { getChatCreditAlerts, safelyNotifyCreditAlert } from "./chat-credit-alerts";

interface Snapshot {
  blockedForAccountingReview: boolean;
  availableUsd: number;
  lastOutcome: string | null;
}
async function liveSnapshot(provider: "openai" | "replit"): Promise<Snapshot> {
  const ledger = await getChatBudgetLedger(provider);
  return { ...await ledger.status(), lastOutcome: await ledger.lastOutcome() };
}
/** Reads configuration and durable accounting only; never probes or bills AI. */
export async function getChatServiceStatus(
  env: NodeJS.ProcessEnv = process.env,
  snapshot: (provider: "openai" | "replit") => Promise<Snapshot> = liveSnapshot,
): Promise<ChatServiceStatus> {
  const readiness = chatAiReadiness(env);
  const selected = readiness.provider === "dual" ? ["openai", "replit"] as const
    : readiness.provider === "invalid" ? [] : [readiness.provider];
  if (!selected.length) return { state: "unavailable", connections: [] };
  try {
    quoteChatRequest(readiness.model, [{ role: "user", content: "status" }], 500);
    const records = await Promise.all(selected.map(async provider => ({ provider, data: await snapshot(provider) })));
    const accountingBlocked = records.some(record => record.data.blockedForAccountingReview);
    const connections: ChatServiceStatus["connections"] = records.map(({ provider, data }) => {
      if (accountingBlocked) return { provider, state: "unavailable", reason: "technical" };
      if (!readiness.providers[provider].configured) return { provider, state: "unavailable", reason: "configuration" };
      if (data.availableUsd <= 0) return { provider, state: "unavailable", reason: "usage_limit" };
      if (data.lastOutcome === "rejected_unbilled") return { provider, state: "unavailable", reason: "billing" };
      if (data.lastOutcome === "uncertain") return { provider, state: "unknown", reason: "technical" };
      return { provider, state: data.lastOutcome === "settled" ? "available" : "unknown", reason: null };
    });
    if (snapshot === liveSnapshot && env === process.env) {
      for (const connection of connections) {
        if (connection.reason === "billing" || connection.reason === "usage_limit") {
          await safelyNotifyCreditAlert(getChatCreditAlerts(), connection.provider,
            connection.reason === "billing" ? "billing" : "budget");
        }
      }
    }
    // Current dual routing requires the primary to be configured. A configured
    // alternative alone must not be advertised as working when it cannot run.
    const primaryMissing = readiness.provider === "dual" && !readiness.providers.openai.configured;
    const usable = connections.filter(connection => connection.state !== "unavailable");
    return {
      state: primaryMissing || !usable.length ? "unavailable"
        : connections.some(connection => connection.state === "unavailable") ? "limited"
        : usable.some(connection => connection.state === "available") ? "available" : "unknown",
      connections,
    };
  } catch {
    return { state: "unavailable", connections: selected.map(provider => ({ provider, state: "unavailable", reason: "technical" })) };
  }
}
