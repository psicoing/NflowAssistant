import { getChatBudgetLedger } from "../server/chat-budget";
import { chatAiReadiness } from "../server/chat-ai-client";
import { pool } from "../server/db";
import { CHAT_COMBINED_BUDGET_USD } from "../server/chat-cost-policy";

try {
  const budgets = await Promise.all(["openai", "replit"].map(async provider =>
    (await getChatBudgetLedger(provider as "openai" | "replit")).status()));
  console.log(JSON.stringify({ connection: chatAiReadiness(), combinedMonthlyLimitUsd: CHAT_COMBINED_BUDGET_USD, budgets }, null, 2));
} finally { await pool.end(); }
