import { getChatBudgetLedger } from "../server/chat-budget";
import { chatAiReadiness } from "../server/chat-ai-client";
import { pool } from "../server/db";

try {
  const store = await getChatBudgetLedger();
  console.log(JSON.stringify({ connection: chatAiReadiness(), budget: await store.status() }, null, 2));
} finally { await pool.end(); }
