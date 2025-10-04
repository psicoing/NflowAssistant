import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  birthDate: text("birth_date"), // YYYY-MM-DD format
  role: text("role").default("user"), // user, admin, partner
  userType: text("user_type").default("individual"), // individual, business
  subscriptionStatus: text("subscription_status").default("inactive"), // active, inactive, cancelled
  subscriptionPlan: text("subscription_plan"), // basic, group, individual
  subscriptionId: text("subscription_id"),
  subscriptionExpiresAt: timestamp("subscription_expires_at"),
  // Campos de perfil de usuario
  ageRange: text("age_range"), // 13-17, 18-25, 26-35, 36-45, 46-55, 56+
  gender: text("gender"), // hombre, mujer, prefiero-no-contestar
  profileCompleted: boolean("profile_completed").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastLoginAt: timestamp("last_login_at"),
  loginCount: integer("login_count").default(0),
  hasCompletedPayment: boolean("has_completed_payment").default(false),
  // Límites de uso mensual
  monthlyQuestionLimit: integer("monthly_question_limit").default(10),
  questionsUsedThisMonth: integer("questions_used_this_month").default(0),
  lastQuestionResetDate: timestamp("last_question_reset_date").defaultNow(),
});

export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull(),
  content: text("content").notNull(),
  isUser: boolean("is_user").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  type: text("type").notNull(), // article, guide, exercise
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const stripeTransactions = pgTable("stripe_transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  stripeSessionId: text("stripe_session_id").notNull(),
  subscriptionPlan: text("subscription_plan").notNull(),
  amount: text("amount").notNull(),
  currency: text("currency").notNull(),
  status: text("status").notNull(), // pending, completed, failed, cancelled
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

// Tabla separada para partners
export const partners = pgTable("partners", {
  id: serial("id").primaryKey(),
  companyName: text("company_name").notNull(),
  contactName: text("contact_name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  phone: text("phone"),
  website: text("website"),
  partnerType: text("partner_type").notNull(), // healthcare, education, corporate, clinic
  status: text("status").default("pending"), // pending, approved, rejected, active, suspended
  licenseNumber: text("license_number"), // Para clínicas/profesionales de salud
  documentsVerified: boolean("documents_verified").default(false),
  commissionRate: text("commission_rate").default("10"), // Porcentaje de comisión
  referralCode: text("referral_code").unique(), // Código de referencia permanente
  totalReferrals: integer("total_referrals").default(0),
  totalEarnings: text("total_earnings").default("0"),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  approvedAt: timestamp("approved_at"),
  approvedBy: integer("approved_by"), // ID del admin que aprobó
});

// Tabla para referencias de partners
export const partnerReferrals = pgTable("partner_referrals", {
  id: serial("id").primaryKey(),
  partnerId: integer("partner_id").notNull(),
  userId: integer("user_id").notNull(), // Usuario referido
  referralCode: text("referral_code").notNull(),
  subscriptionPlan: text("subscription_plan").notNull(),
  amount: text("amount").notNull(),
  commission: text("commission").notNull(),
  status: text("status").notNull(), // pending, paid, cancelled
  createdAt: timestamp("created_at").defaultNow().notNull(),
  paidAt: timestamp("paid_at"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  birthDate: true,
  userType: true,
  subscriptionStatus: true,
  hasCompletedPayment: true,
});

export const insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  createdAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  timestamp: true,
});

export const insertResourceSchema = createInsertSchema(resources).omit({
  id: true,
  createdAt: true,
});

export const insertStripeTransactionSchema = createInsertSchema(stripeTransactions).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export const insertPartnerSchema = createInsertSchema(partners).omit({
  id: true,
  createdAt: true,
  approvedAt: true,
  approvedBy: true,
  lastLoginAt: true,
  totalReferrals: true,
  totalEarnings: true,
  documentsVerified: true,
});

export const insertPartnerReferralSchema = createInsertSchema(partnerReferrals).omit({
  id: true,
  createdAt: true,
  paidAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Conversation = typeof conversations.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertResource = z.infer<typeof insertResourceSchema>;
export type Resource = typeof resources.$inferSelect;
export type InsertStripeTransaction = z.infer<typeof insertStripeTransactionSchema>;
export type StripeTransaction = typeof stripeTransactions.$inferSelect;
export type InsertPartner = z.infer<typeof insertPartnerSchema>;
export type Partner = typeof partners.$inferSelect;
export type InsertPartnerReferral = z.infer<typeof insertPartnerReferralSchema>;
export type PartnerReferral = typeof partnerReferrals.$inferSelect;
