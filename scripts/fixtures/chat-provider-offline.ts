// Process-local placeholders used ONLY with the esbuild mock of the OpenAI SDK.
// Does not read, save or overwrite real workspace credentials.
export function installOfflineManagedChatConfiguration() {
  process.env.NUXA_CHAT_AI_PROVIDER = "replit";
  process.env.AI_INTEGRATIONS_OPENAI_BASE_URL = "https://offline-test.invalid/v1";
  process.env.AI_INTEGRATIONS_OPENAI_API_KEY = "offline-fixture-not-a-real-credential";
}
