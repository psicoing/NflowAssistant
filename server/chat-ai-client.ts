import OpenAI from "openai";

type ChatProvider = "replit" | "openai" | "invalid";

export function chatAiReadiness(env: NodeJS.ProcessEnv = process.env) {
  const selected = env.NUXA_CHAT_AI_PROVIDER?.trim() || "replit";
  const provider: ChatProvider = selected === "replit" || selected === "openai" ? selected : "invalid";
  const model = env.OPENAI_CHAT_MODEL?.trim() || "gpt-5.5-2026-04-23";
  const missing: string[] = [];
  if (provider === "replit") {
    if (!env.AI_INTEGRATIONS_OPENAI_API_KEY?.trim()) missing.push("AI_INTEGRATIONS_OPENAI_API_KEY");
    if (!env.AI_INTEGRATIONS_OPENAI_BASE_URL?.trim()) missing.push("AI_INTEGRATIONS_OPENAI_BASE_URL");
    else {
      try {
        const url = new URL(env.AI_INTEGRATIONS_OPENAI_BASE_URL);
        if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) missing.push("valid-managed-endpoint");
      } catch {
        missing.push("valid-managed-endpoint");
      }
    }
  } else if (provider === "openai" && !env.OPENAI_API_KEY?.trim()) missing.push("OPENAI_API_KEY");
  if (provider === "invalid") missing.push("valid-NUXA_CHAT_AI_PROVIDER");
  // Configuration readiness is NOT a successful request or confirmed billing.
  return { provider, model, configured: missing.length === 0, missing, voiceChanged: false };
}

export class ChatAiConfigurationError extends Error {
  readonly code = "NUXA_CHAT_AI_NOT_CONFIGURED";
  constructor(provider: ChatProvider, missing: string[]) {
    super(`Chat AI provider ${provider} is not configured. Missing: ${missing.join(", ")}. No alternative billing provider was used.`);
    this.name = "ChatAiConfigurationError";
  }
}

// Written chat only. Never fall back from managed billing to the personal key.
// Construct a fresh client so a token is not retained across requests.
export function createChatAiClient(env: NodeJS.ProcessEnv = process.env): OpenAI {
  const readiness = chatAiReadiness(env);
  if (!readiness.configured) throw new ChatAiConfigurationError(readiness.provider, readiness.missing);
  return readiness.provider === "replit"
    ? new OpenAI({
      apiKey: env.AI_INTEGRATIONS_OPENAI_API_KEY!,
      baseURL: env.AI_INTEGRATIONS_OPENAI_BASE_URL!,
      maxRetries: 0,
      timeout: 60_000,
    })
    : new OpenAI({ apiKey: env.OPENAI_API_KEY!, baseURL: "https://api.openai.com/v1", maxRetries: 0, timeout: 60_000 });
}
