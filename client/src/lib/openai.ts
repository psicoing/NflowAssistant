// This file would be used on the frontend if we needed direct OpenAI integration
// For now, all OpenAI calls are handled by the backend API
export const OPENAI_CONFIG = {
  model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
  maxTokens: 500,
  temperature: 0.7,
};

export type SupportType = "general" | "anxiety" | "depression" | "stress" | "crisis";

export interface ChatResponse {
  response: string;
  supportType: SupportType;
}
