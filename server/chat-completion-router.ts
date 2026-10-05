import type OpenAI from "openai";
import { chatAiReadiness, createChatAiClient, ChatAiConfigurationError, type ChatProvider } from "./chat-ai-client";
import { budgetedChatCompletion, getChatBudgetLedger, type BudgetedRequest } from "./chat-budget";
import { ChatCostPolicyError, quoteChatRequest } from "./chat-cost-policy";
import { isConfirmedOpenAiBillingRejection } from "./chat-billing-errors";
import type { ChatBudgetLedger } from "./chat-budget-ledger";

interface ChatRoutingDependencies {
  env?: NodeJS.ProcessEnv;
  clientForProvider?: (provider: ChatProvider) => OpenAI;
  ledgerForProvider?: (provider: ChatProvider) => Promise<ChatBudgetLedger>;
}

/** Sequential approved payers; never retry a potentially charged failure. */
export async function routedChatCompletion(request: BudgetedRequest, dependencies: ChatRoutingDependencies = {}) {
  const env = dependencies.env ?? process.env;
  const readiness = chatAiReadiness(env);
  if (readiness.provider === "invalid") throw new ChatAiConfigurationError("invalid", readiness.missing);
  quoteChatRequest(request.model, request.messages, request.max_completion_tokens);
  const ledgerFor = dependencies.ledgerForProvider ?? getChatBudgetLedger;
  const clientFor = dependencies.clientForProvider ?? (provider => createChatAiClient(env, provider));
  const primary = readiness.provider === "dual" ? "openai" : readiness.provider;

  // A pricing/accounting breach is not ordinary budget exhaustion. Stop both
  // routes for review rather than spending through another payer.
  const providers: ChatProvider[] = readiness.provider === "dual" ? ["openai", "replit"] : [primary];
  const stores = new Map<ChatProvider, ChatBudgetLedger>();
  for (const provider of providers) {
    const store = await ledgerFor(provider);
    stores.set(provider, store);
    if ((await store.status()).blockedForAccountingReview) {
      throw new ChatCostPolicyError("NUXA_CHAT_ACCOUNTING_REVIEW_REQUIRED", "Accounting review required; no provider called.");
    }
  }
  const run = (provider: ChatProvider) => budgetedChatCompletion(request, clientFor(provider), stores.get(provider)!);
  try {
    return await run(primary);
  } catch (error) {
    const exhausted = error instanceof ChatCostPolicyError && error.code === "NUXA_CHAT_MONTHLY_BUDGET_EXCEEDED";
    if (readiness.provider !== "dual" || !(exhausted || isConfirmedOpenAiBillingRejection(error))) throw error;
    // Same model/prompt/output cap. Backup configuration and its separate
    // durable $20 reservation must succeed before the second provider call.
    console.info("[chat-router] OpenAI unavailable within approved billing; using budgeted Replit backup.");
    return run("replit");
  }
}
