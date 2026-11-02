import type { StripeLetterLanguage } from "./stripe-commercial-letter";

export type StripeContact = {
  id: number; email: string; source: "stripe";
  status: "pending_review" | "suppressed" | "authorized";
  importedAt: string; lastSeenAt: string; canSend: boolean;
};
export type StripeLetterData = {
  language: StripeLetterLanguage; subject: string; body: string; updatedAt: string | null;
  ctaLabel: string; ctaUrl: string; footer: string; previewUnsubscribeUrl: string;
  commercialSendingEnabled: boolean;
};
export type StripeDispatch = {
  id: string; language: StripeLetterLanguage; subject: string; body: string;
  status: "prepared" | "running" | "completed" | "stopped";
  createdAt: string;
  recipients: {
    contactId: number; email: string;
    status: "pending" | "attempting" | "accepted" | "rejected" | "skipped" | "uncertain";
    reason: string | null; messageId: string | null;
  }[];
};
