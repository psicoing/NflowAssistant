// Process-local placeholders used ONLY with the esbuild mock of the OpenAI SDK.
// Does not read, save or overwrite real workspace credentials.
import type { Plugin } from "esbuild";

// Existing policy/evidence suites simulate only the provider boundary.
// Real accounting and PostgreSQL concurrency are tested separately.
export const offlineChatBudgetPlugin: Plugin = {
  name: "offline-chat-budget",
  setup(builder) {
    builder.onResolve({ filter: /(^|\/)chat-budget$/ }, () => ({ path: "budget", namespace: "offline-budget" }));
    builder.onLoad({ filter: /.*/, namespace: "offline-budget" }, () => ({
      contents: `export async function budgetedChatCompletion(request, client) {
        if (globalThis.__nuxaOfflineMonthlyBudgetExceeded) {
          const error = new Error("Offline budget exhausted");
          error.code = "NUXA_CHAT_MONTHLY_BUDGET_EXCEEDED";
          throw error;
        }
        return client.chat.completions.create(request);
      }`,
      loader: "js",
    }));
  },
};

export function installOfflineManagedChatConfiguration() {
  process.env.NUXA_CHAT_AI_PROVIDER = "replit";
  process.env.AI_INTEGRATIONS_OPENAI_BASE_URL = "https://offline-test.invalid/v1";
  process.env.AI_INTEGRATIONS_OPENAI_API_KEY = "offline-fixture-not-a-real-credential";
}
