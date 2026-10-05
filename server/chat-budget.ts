import type OpenAI from "openai";
import { ChatBudgetLedger } from "./chat-budget-ledger";
import { quoteChatRequest, type CostedChatMessage } from "./chat-cost-policy";

let ledger: Promise<ChatBudgetLedger> | undefined;
export function getChatBudgetLedger() {
  if (!ledger) {
    ledger = import("./db").then(({ pool }) => new ChatBudgetLedger(pool)).catch(error => { ledger = undefined; throw error; });
  }
  return ledger;
}

type BudgetedRequest = OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming & {
  messages: CostedChatMessage[];
  max_completion_tokens: number;
};

export async function budgetedChatCompletion(request: BudgetedRequest, client: OpenAI, suppliedStore?: ChatBudgetLedger) {
  const quote = quoteChatRequest(request.model, request.messages, request.max_completion_tokens);
  const store = suppliedStore ?? await getChatBudgetLedger();
  const reservation = await store.reserve(quote);
  let completion: OpenAI.Chat.Completions.ChatCompletion | undefined;
  try {
    // One upstream attempt only. Priority/auto processing is not requested.
    completion = await client.chat.completions.create({ ...request, service_tier: "default" });
    return completion;
  } finally {
    try {
      await store.settle(reservation, completion?.usage, completion?.service_tier ?? undefined);
    } catch {
      // Reserve succeeded before any billable call. Retaining that amount
      // protects the budget even if usage cannot be written after completion.
      console.error("[chat-budget] Settlement failed; full durable reservation retained. Accounting review required.");
    }
  }
}
