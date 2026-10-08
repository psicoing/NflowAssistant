// Owner-approved independent budgets, global across written-chat users.
export type ChatBillingProvider = "openai" | "replit";
export const CHAT_PROVIDER_BUDGET_USD = { openai: 25, replit: 20 } as const;
export const CHAT_COMBINED_BUDGET_USD = 45;
// Compatibility alias for the original Replit ledger, not a shared ceiling.
export const CHAT_MONTHLY_BUDGET_USD = 20;
export const CHAT_MONTHLY_BUDGET_NANO_USD = CHAT_MONTHLY_BUDGET_USD * 1_000_000_000;
export const CHAT_MAX_INPUT_TOKEN_BOUND = 64_000;
export const CHAT_MAX_USER_MESSAGE_BYTES = 16_384;
export const CHAT_HISTORY_BYTES = 8_192;

// Verified against https://developers.openai.com/api/docs/models/gpt-5.5
// on 2026-10-05: $5/M input, $30/M output; priority 2.5x; regional +10%.
// Cached-input discounts are deliberately NOT assumed when enforcing a cap.
const INPUT_NANO_USD = 5_000;
const OUTPUT_NANO_USD = 30_000;
const WORST_MULTIPLIER = 2.5 * 1.1;

export class ChatCostPolicyError extends Error {
  constructor(public readonly code: string, message: string) {
    super(message);
    this.name = "ChatCostPolicyError";
  }
}

export interface CostedChatMessage { role: "system" | "user" | "assistant"; content: string }
export interface ChatCostQuote {
  model: string;
  inputTokenBound: number;
  outputTokenLimit: number;
  maximumNanoUsd: number;
}

export function assertPricedChatModel(model: string) {
  if (!["gpt-5.5", "gpt-5.5-2026-04-23"].includes(model)) {
    throw new ChatCostPolicyError("NUXA_CHAT_PRICING_UNVERIFIED", "No verified token price for the configured chat model; generation blocked without changing model.");
  }
}

export function boundedChatHistory(history: { content: string; isUser: boolean }[], currentMessage?: string): CostedChatMessage[] {
  const result: CostedChatMessage[] = [];
  let remaining = CHAT_HISTORY_BYTES;
  // The conversation route saves the current user turn before reading history.
  // Send that turn only once, as the final request message.
  const previous = currentMessage !== undefined && history.at(-1)?.isUser && history.at(-1)?.content === currentMessage
    ? history.slice(0, -1) : history;
  // More short turns preserve corrections and intervention outcomes. The byte
  // budget stays unchanged; this is not unlimited or cross-session memory.
  for (const message of previous.slice(-32).reverse()) {
    const bytes = Buffer.byteLength(message.content, "utf8");
    // Keep a contiguous recent suffix: skipping a correction and then retaining
    // older claims would splice the conversation into a different meaning.
    // Do not cut complete turns or increase the existing byte/token budgets.
    if (bytes > remaining) break;
    remaining -= bytes;
    result.unshift({ role: message.isUser ? "user" : "assistant", content: message.content });
  }
  return result;
}

export function quoteChatRequest(model: string, messages: CostedChatMessage[], outputTokenLimit: number): ChatCostQuote {
  assertPricedChatModel(model);
  if (!Number.isInteger(outputTokenLimit) || outputTokenLimit < 1 || outputTokenLimit > 4000) {
    throw new ChatCostPolicyError("NUXA_CHAT_OUTPUT_LIMIT_INVALID", "Invalid generation limit; request blocked.");
  }
  const user = messages.at(-1);
  if (user && Buffer.byteLength(user.content, "utf8") > CHAT_MAX_USER_MESSAGE_BYTES) {
    throw new ChatCostPolicyError("NUXA_CHAT_INPUT_TOO_LARGE", "Current message exceeds the input limit; no text was silently truncated.");
  }
  // Conservative BPE upper bound, NOT a measured token count: one token per
  // UTF-8 byte, plus generous framing/JSON overhead. Actual usage comes from API.
  const inputTokenBound = messages.reduce((sum, message) => sum + Buffer.byteLength(message.content, "utf8") + 128, 4096);
  if (inputTokenBound > CHAT_MAX_INPUT_TOKEN_BOUND) {
    throw new ChatCostPolicyError("NUXA_CHAT_INPUT_TOO_LARGE", "Request exceeds the conservative input bound; generation blocked.");
  }
  // <64K keeps GPT-5.5 below its >272K higher-price context tier.
  const maximumNanoUsd = Math.ceil((inputTokenBound * INPUT_NANO_USD + outputTokenLimit * OUTPUT_NANO_USD) * WORST_MULTIPLIER);
  return { model, inputTokenBound, outputTokenLimit, maximumNanoUsd };
}

export function meteredChatCost(usage: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number } | undefined, serviceTier?: string) {
  if (!usage || !Number.isSafeInteger(usage.prompt_tokens) || !Number.isSafeInteger(usage.completion_tokens) ||
    usage.prompt_tokens! < 0 || usage.completion_tokens! < 0 ||
    usage.prompt_tokens! + usage.completion_tokens! <= 0 ||
    (usage.total_tokens !== undefined && usage.total_tokens !== usage.prompt_tokens! + usage.completion_tokens!)) return null;
  // Output already includes reasoning tokens: never add reasoning a second time.
  const multiplier = serviceTier === "default" || serviceTier === "flex" ? 1.1 : WORST_MULTIPLIER;
  return {
    inputTokens: usage.prompt_tokens!,
    outputTokens: usage.completion_tokens!,
    nanoUsd: Math.ceil((usage.prompt_tokens! * INPUT_NANO_USD + usage.completion_tokens! * OUTPUT_NANO_USD) * multiplier),
  };
}
