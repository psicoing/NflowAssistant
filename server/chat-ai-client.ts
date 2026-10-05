import OpenAI from "openai";

export type ChatProvider = "replit" | "openai";
type ChatMode = ChatProvider | "dual" | "invalid";

function providerConfiguration(env: NodeJS.ProcessEnv, provider: ChatProvider) {
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
  return { configured: missing.length === 0, missing };
}

export function chatAiReadiness(env: NodeJS.ProcessEnv = process.env) {
  const selected = env.NUXA_CHAT_AI_PROVIDER?.trim() || "dual";
  const provider: ChatMode = ["dual", "openai", "replit"].includes(selected) ? selected as ChatMode : "invalid";
  const model = env.OPENAI_CHAT_MODEL?.trim() || "gpt-5.5-2026-04-23";
  const providers = { openai: providerConfiguration(env, "openai"), replit: providerConfiguration(env, "replit") };
  const configuration = provider === "invalid"
    ? { configured: false, missing: ["valid-NUXA_CHAT_AI_PROVIDER"] }
    : providers[provider === "dual" ? "openai" : provider];
  // Configuration readiness is NOT a successful request or confirmed billing.
  return { provider, model, ...configuration, providers, voiceChanged: false };
}

export class ChatAiConfigurationError extends Error {
  readonly code = "NUXA_CHAT_AI_NOT_CONFIGURED";
  constructor(provider: ChatMode, missing: string[]) {
    super(`Chat AI provider ${provider} is not configured. Missing: ${missing.join(", ")}. No alternative billing provider was used.`);
    this.name = "ChatAiConfigurationError";
  }
}

// Written chat only. Default dual mode starts with the explicitly approved
// direct OpenAI payer. Only the completion router decides whether to use backup.
// Construct a fresh client so a token is not retained across requests.
export function createChatAiClient(env: NodeJS.ProcessEnv = process.env, requestedProvider?: ChatProvider): OpenAI {
  const readiness = chatAiReadiness(env);
  if (readiness.provider === "invalid") throw new ChatAiConfigurationError(readiness.provider, readiness.missing);
  const provider = requestedProvider ?? (readiness.provider === "dual" ? "openai" : readiness.provider);
  const configuration = readiness.providers[provider];
  if (!configuration.configured) throw new ChatAiConfigurationError(provider, configuration.missing);
  return provider === "replit"
    ? new OpenAI({
      apiKey: env.AI_INTEGRATIONS_OPENAI_API_KEY!,
      baseURL: env.AI_INTEGRATIONS_OPENAI_BASE_URL!,
      maxRetries: 0,
      timeout: 60_000,
    })
    : new OpenAI({ apiKey: env.OPENAI_API_KEY!, baseURL: "https://api.openai.com/v1", maxRetries: 0, timeout: 60_000 });
}
