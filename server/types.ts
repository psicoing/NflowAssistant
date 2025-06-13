import "express-session";

declare module "express-session" {
  interface SessionData {
    isAdmin?: boolean;
    userId?: number;
    // Partner session data
    isPartner?: boolean;
    partnerId?: number;
    partnerStatus?: string;
  }
}