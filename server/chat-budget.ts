import type OpenAI from "openai";
import { ChatBudgetLedger } from "./chat-budget-ledger";
import { assertPricedChatModel, quoteChatRequest, type CostedChatMessage, type ChatBillingProvider } from "./chat-cost-policy";
import { isConfirmedOpenAiBillingRejection } from "./chat-billing-errors";

const ledgers = new Map<ChatBillingProvider, Promise<ChatBudgetLedger>>();
export function getChatBudgetLedger(provider: ChatBillingProvider = "replit") {
  let ledger = ledgers.get(provider);
  if (!ledger) {
    ledger = import("./db").then(({ pool }) => new ChatBudgetLedger(pool, "public", undefined, provider))
      .catch(error => { ledgers.delete(provider); throw error; });
    ledgers.set(provider, ledger);
  }
  return ledger;
}

export type BudgetedRequest = OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming & {
  messages: CostedChatMessage[];
  max_completion_tokens: number;
};

export async function budgetedChatCompletion(request: BudgetedRequest, client: OpenAI, suppliedStore?: ChatBudgetLedger) {
  const quote = quoteChatRequest(request.model, request.messages, request.max_completion_tokens);
  const store = suppliedStore ?? await getChatBudgetLedger();
  const reservation = await store.reserve(quote);
  let completion: OpenAI.Chat.Completions.ChatCompletion | undefined;
  let billingRejection: unknown;
  let unverifiedModel = false;
  try {
    // One upstream attempt only. Priority/auto processing is not requested.
    completion = await client.chat.completions.create({ ...request, service_tier: "default" });
    try { assertPricedChatModel(completion.model); }
    catch (error) { unverifiedModel = true; throw error; }
    return completion;
  } catch (error) {
    if (store.provider === "openai" && isConfirmedOpenAiBillingRejection(error)) billingRejection = error;
    throw error;
  } finally {
    try {
      if (billingRejection) await store.rejectUnbilled(reservation, billingRejection);
      else await store.settle(reservation, unverifiedModel ? undefined : completion?.usage,
        completion?.service_tier ?? undefined, unverifiedModel);
    } catch {
      // Reserve succeeded before any billable call. Retaining that amount
      // protects the budget even if usage cannot be written after completion.
      console.error("[chat-budget] Settlement failed; full durable reservation retained. Accounting review required.");
    }
  }
}
