// This file would be used on the frontend if we needed direct OpenAI integration
// For now, all OpenAI calls are handled by the backend API
export const OPENAI_CONFIG = {
  model: "gpt-5.5-2026-04-23",
  maxTokens: 500,
};

export type SupportType = "general" | "anxiety" | "depression" | "stress" | "crisis";

export interface ChatResponse {
  response: string;
  supportType: SupportType;
}
