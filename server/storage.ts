import { 
  users, conversations, messages, resources, stripeTransactions, shopifyTransactions, partners, partnerReferrals, books, sorteoEntries,
  type User, type InsertUser, 
  type Conversation, type InsertConversation,
  type Message, type InsertMessage,
  type Resource, type InsertResource,
  type StripeTransaction, type InsertStripeTransaction,
  type ShopifyTransaction, type InsertShopifyTransaction,
  type Partner, type InsertPartner,
  type PartnerReferral, type InsertPartnerReferral,
  type Book,
  type SorteoEntry, type InsertSorteoEntry
} from "@shared/schema";
import { db } from "./db";
import { eq, sql } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserLogin(userId: number): Promise<User>;
  updateUserSubscription(userId: number, subscriptionData: {
    status: string;
    plan: string;
    subscriptionId: string;
    expiresAt?: Date;
  }): Promise<User>;
  updateUserProfile(userId: number, profileData: {
    ageRange: string;
    gender: string;
  }): Promise<User>;
  updateUserPassword(userId: number, hashedPassword: string): Promise<User>;
  
  // Question limit management
  checkQuestionLimit(userId: number): Promise<{ canAsk: boolean; remaining: number; limit: number }>;
  incrementQuestionCount(userId: number): Promise<User>;
  resetMonthlyQuestions(userId: number): Promise<User>;
  addQuestionsToUser(userId: number, additionalQuestions: number): Promise<User>;
  addPrepaidQuestions(userId: number, quantity: number): Promise<User>;
  
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  getConversations(userId?: number): Promise<Conversation[]>;
  getConversation(id: number): Promise<Conversation | undefined>;
  
  createMessage(message: InsertMessage): Promise<Message>;
  getMessages(conversationId: number): Promise<Message[]>;
  
  getResources(): Promise<Resource[]>;
  getResourcesByCategory(category: string): Promise<Resource[]>;
  createResource(resource: InsertResource): Promise<Resource>;
  
  createStripeTransaction(transaction: InsertStripeTransaction): Promise<StripeTransaction>;
  updateStripeTransaction(stripeSessionId: string, status: string): Promise<StripeTransaction>;
  getStripeTransactionsByUser(userId: number): Promise<StripeTransaction[]>;
  getAllUsers(): Promise<User[]>;
  getAllStripeTransactions(): Promise<StripeTransaction[]>;
  
  // Shopify transactions
  createShopifyTransaction(transaction: InsertShopifyTransaction): Promise<ShopifyTransaction>;
  getShopifyTransactionByOrderId(orderId: string): Promise<ShopifyTransaction | undefined>;
  getShopifyTransactionsByUser(userId: number): Promise<ShopifyTransaction[]>;
  getAllShopifyTransactions(): Promise<ShopifyTransaction[]>;
  
  // Partner operations
  getPartner(id: number): Promise<Partner | undefined>;
  getPartnerByEmail(email: string): Promise<Partner | undefined>;
  createPartner(partner: InsertPartner): Promise<Partner>;
  updatePartnerLogin(partnerId: number): Promise<Partner>;
  updatePartnerStatus(partnerId: number, status: string): Promise<Partner>;
  getAllPartners(): Promise<Partner[]>;
  getPartnersByStatus(status: string): Promise<Partner[]>;
  updatePartnerLicense(partnerId: number, licenseData: {
    activeUsersLimit?: number;
    monthlyCost?: string;
    licenseRenewalDate?: Date | null;
    licenseStatus?: string;
    commissionRate?: string;
  }): Promise<Partner>;
  
  // Partner referrals
  createPartnerReferral(referral: InsertPartnerReferral): Promise<PartnerReferral>;
  getPartnerReferrals(partnerId: number): Promise<PartnerReferral[]>;
  updatePartnerStats(partnerId: number, referrals: number, earnings: string): Promise<Partner>;
  
  // Public statistics
  getPublicStats(): Promise<{
    totalUsers: number;
    totalConversations: number;
    activeSubscriptions: number;
    averageSatisfaction: number;
  }>;
  
  // Books
  getAllBooks(): Promise<Book[]>;
  getBooksByCategory(category: string): Promise<Book[]>;
  
  // Magic Link
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByMagicToken(token: string): Promise<User | undefined>;
  setMagicLink(userId: number, token: string, expiry: Date): Promise<User>;
  clearMagicLink(userId: number): Promise<User>;

  // Sorteo
  createSorteoEntry(entry: InsertSorteoEntry): Promise<SorteoEntry>;
  getSorteoEntryByEmail(email: string): Promise<SorteoEntry | undefined>;
  incrementSorteoEntryCount(email: string): Promise<SorteoEntry | undefined>;
  getAllSorteoEntries(): Promise<SorteoEntry[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const [conversation] = await db
      .insert(conversations)
      .values(insertConversation)
      .returning();
    return conversation;
  }

  async getConversations(userId?: number): Promise<Conversation[]> {
    if (userId) {
      return await db.select().from(conversations).where(eq(conversations.userId, userId));
    }
    return await db.select().from(conversations);
  }

  async getConversation(id: number): Promise<Conversation | undefined> {
    const [conversation] = await db.select().from(conversations).where(eq(conversations.id, id));
    return conversation || undefined;
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db
      .insert(messages)
      .values(insertMessage)
      .returning();
    return message;
  }

  async getMessages(conversationId: number): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(messages.timestamp);
  }

  async getResources(): Promise<Resource[]> {
    return await db.select().from(resources);
  }

  async getResourcesByCategory(category: string): Promise<Resource[]> {
    return await db.select().from(resources).where(eq(resources.category, category));
  }

  async createResource(insertResource: InsertResource): Promise<Resource> {
    const [resource] = await db
      .insert(resources)
      .values(insertResource)
      .returning();
    return resource;
  }

  async updateUserLogin(userId: number): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        lastLoginAt: new Date(),
        loginCount: sql`${users.loginCount} + 1`,
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // Helper function to determine monthly question limit based on plan
  private getQuestionLimitByPlan(plan: string): number {
    const planLimits: Record<string, number> = {
      'basic': 10,
      'individual': 20,
      'pro': 20,
      'premium': 30,
      'annual': 30,
      'partner': 100,
    };
    return planLimits[plan] ?? 10;
  }

  async updateUserSubscription(userId: number, subscriptionData: {
    status: string;
    plan: string;
    subscriptionId: string;
    expiresAt?: Date;
  }): Promise<User> {
    const questionLimit = this.getQuestionLimitByPlan(subscriptionData.plan);
    
    const [user] = await db
      .update(users)
      .set({
        subscriptionStatus: subscriptionData.status,
        subscriptionPlan: subscriptionData.plan,
        subscriptionId: subscriptionData.subscriptionId,
        subscriptionExpiresAt: subscriptionData.expiresAt,
        hasCompletedPayment: subscriptionData.status === 'active',
        monthlyQuestionLimit: questionLimit,
        // Reset question counter when activating new plan
        questionsUsedThisMonth: 0,
        lastQuestionResetDate: new Date()
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async updateUserProfile(userId: number, profileData: {
    ageRange: string;
    gender: string;
  }): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        ageRange: profileData.ageRange,
        gender: profileData.gender,
        profileCompleted: true,
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async updateUserPassword(userId: number, hashedPassword: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        password: hashedPassword,
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async createStripeTransaction(transaction: InsertStripeTransaction): Promise<StripeTransaction> {
    const [stripeTransaction] = await db
      .insert(stripeTransactions)
      .values(transaction)
      .returning();
    return stripeTransaction;
  }

  async updateStripeTransaction(stripeSessionId: string, status: string): Promise<StripeTransaction> {
    const [transaction] = await db
      .update(stripeTransactions)
      .set({
        status: status,
        completedAt: status === 'completed' ? new Date() : null,
      })
      .where(eq(stripeTransactions.stripeSessionId, stripeSessionId))
      .returning();
    return transaction;
  }

  async getStripeTransactionsByUser(userId: number): Promise<StripeTransaction[]> {
    return await db
      .select()
      .from(stripeTransactions)
      .where(eq(stripeTransactions.userId, userId))
      .orderBy(stripeTransactions.createdAt);
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async getAllStripeTransactions(): Promise<StripeTransaction[]> {
    return await db.select().from(stripeTransactions);
  }

  // Shopify transactions
  async createShopifyTransaction(transaction: InsertShopifyTransaction): Promise<ShopifyTransaction> {
    const [shopifyTransaction] = await db
      .insert(shopifyTransactions)
      .values(transaction)
      .returning();
    return shopifyTransaction;
  }

  async getShopifyTransactionByOrderId(orderId: string): Promise<ShopifyTransaction | undefined> {
    const [transaction] = await db
      .select()
      .from(shopifyTransactions)
      .where(eq(shopifyTransactions.shopifyOrderId, orderId));
    return transaction || undefined;
  }

  async getShopifyTransactionsByUser(userId: number): Promise<ShopifyTransaction[]> {
    return await db
      .select()
      .from(shopifyTransactions)
      .where(eq(shopifyTransactions.userId, userId))
      .orderBy(shopifyTransactions.createdAt);
  }

  async getAllShopifyTransactions(): Promise<ShopifyTransaction[]> {
    return await db.select().from(shopifyTransactions);
  }

  // Partner operations
  async getPartner(id: number): Promise<Partner | undefined> {
    const [partner] = await db.select().from(partners).where(eq(partners.id, id));
    return partner || undefined;
  }

  async getPartnerByEmail(email: string): Promise<Partner | undefined> {
    const [partner] = await db.select().from(partners).where(eq(partners.email, email));
    return partner || undefined;
  }

  async createPartner(insertPartner: InsertPartner): Promise<Partner> {
    const [partner] = await db
      .insert(partners)
      .values(insertPartner)
      .returning();
    return partner;
  }

  async updatePartnerLogin(partnerId: number): Promise<Partner> {
    const [partner] = await db
      .update(partners)
      .set({
        lastLoginAt: new Date(),
      })
      .where(eq(partners.id, partnerId))
      .returning();
    return partner;
  }

  async updatePartnerStatus(partnerId: number, status: string): Promise<Partner> {
    const [partner] = await db
      .update(partners)
      .set({
        status: status,
        approvedAt: status === 'approved' ? new Date() : null,
      })
      .where(eq(partners.id, partnerId))
      .returning();
    return partner;
  }

  async getAllPartners(): Promise<Partner[]> {
    return await db.select().from(partners);
  }

  async getPartnersByStatus(status: string): Promise<Partner[]> {
    return await db.select().from(partners).where(eq(partners.status, status));
  }

  async updatePartnerLicense(partnerId: number, licenseData: {
    activeUsersLimit?: number;
    monthlyCost?: string;
    licenseRenewalDate?: Date | null;
    licenseStatus?: string;
    commissionRate?: string;
  }): Promise<Partner> {
    const [partner] = await db
      .update(partners)
      .set(licenseData)
      .where(eq(partners.id, partnerId))
      .returning();
    return partner;
  }

  // Partner referrals
  async createPartnerReferral(insertReferral: InsertPartnerReferral): Promise<PartnerReferral> {
    const [referral] = await db
      .insert(partnerReferrals)
      .values(insertReferral)
      .returning();
    return referral;
  }

  async getPartnerReferrals(partnerId: number): Promise<PartnerReferral[]> {
    return await db
      .select()
      .from(partnerReferrals)
      .where(eq(partnerReferrals.partnerId, partnerId))
      .orderBy(partnerReferrals.createdAt);
  }

  async updatePartnerStats(partnerId: number, referrals: number, earnings: string): Promise<Partner> {
    const [partner] = await db
      .update(partners)
      .set({
        totalReferrals: referrals,
        totalEarnings: earnings,
      })
      .where(eq(partners.id, partnerId))
      .returning();
    return partner;
  }

  // Question limit management
  async checkQuestionLimit(userId: number): Promise<{ canAsk: boolean; remaining: number; limit: number }> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    // Check if we need to reset monthly counter
    const now = new Date();
    const lastReset = user.lastQuestionResetDate ? new Date(user.lastQuestionResetDate) : new Date();
    const isNewMonth = now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear();

    if (isNewMonth) {
      await this.resetMonthlyQuestions(userId);
      return { 
        canAsk: true, 
        remaining: (user.monthlyQuestionLimit || 10) - 1, 
        limit: user.monthlyQuestionLimit || 10 
      };
    }

    const used = user.questionsUsedThisMonth || 0;
    const limit = user.monthlyQuestionLimit || 10;
    const prepaid = user.prepaidQuestions || 0;
    const subscriptionRemaining = Math.max(0, limit - used);
    const totalRemaining = prepaid + subscriptionRemaining;

    return {
      canAsk: totalRemaining > 0,
      remaining: totalRemaining - 1, // After this question
      limit
    };
  }

  async incrementQuestionCount(userId: number): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    // Primero consumir créditos prepagados, luego cuota de suscripción
    const prepaid = user.prepaidQuestions || 0;
    
    let updatedUser;
    if (prepaid > 0) {
      // Consumir crédito prepagado
      [updatedUser] = await db
        .update(users)
        .set({
          prepaidQuestions: prepaid - 1,
        })
        .where(eq(users.id, userId))
        .returning();
    } else {
      // Consumir cuota de suscripción
      [updatedUser] = await db
        .update(users)
        .set({
          questionsUsedThisMonth: (user.questionsUsedThisMonth || 0) + 1,
        })
        .where(eq(users.id, userId))
        .returning();
    }
    
    return updatedUser;
  }

  async resetMonthlyQuestions(userId: number): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({
        questionsUsedThisMonth: 0,
        lastQuestionResetDate: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return updatedUser;
  }

  async addQuestionsToUser(userId: number, additionalQuestions: number): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    const newLimit = (user.monthlyQuestionLimit || 10) + additionalQuestions;
    
    const [updatedUser] = await db
      .update(users)
      .set({
        monthlyQuestionLimit: newLimit,
      })
      .where(eq(users.id, userId))
      .returning();
    return updatedUser;
  }

  async addPrepaidQuestions(userId: number, quantity: number): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    const currentPrepaid = user.prepaidQuestions || 0;
    
    const [updatedUser] = await db
      .update(users)
      .set({
        prepaidQuestions: currentPrepaid + quantity,
      })
      .where(eq(users.id, userId))
      .returning();
    return updatedUser;
  }

  async getPublicStats(): Promise<{
    totalUsers: number;
    totalConversations: number;
    activeSubscriptions: number;
    averageSatisfaction: number;
  }> {
    try {
      // Count total users
      const totalUsersResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(users);
      const totalUsers = totalUsersResult[0]?.count || 0;

      // Count total conversations
      const totalConversationsResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(conversations);
      const totalConversations = totalConversationsResult[0]?.count || 0;

      // Count active subscriptions
      const activeSubscriptionsResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(users)
        .where(eq(users.subscriptionStatus, 'active'));
      const activeSubscriptions = activeSubscriptionsResult[0]?.count || 0;

      // Calculate average satisfaction (fixed at 4.9 for now)
      const averageSatisfaction = 4.9;

      return {
        totalUsers,
        totalConversations,
        activeSubscriptions,
        averageSatisfaction,
      };
    } catch (error) {
      console.error("Error getting public stats:", error);
      return {
        totalUsers: 0,
        totalConversations: 0,
        activeSubscriptions: 0,
        averageSatisfaction: 4.9,
      };
    }
  }

  async getAllBooks(): Promise<Book[]> {
    return await db.select().from(books);
  }

  async getBooksByCategory(category: string): Promise<Book[]> {
    return await db.select().from(books).where(eq(books.category, category));
  }

  // Magic Link functions
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getUserByMagicToken(token: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.magicLinkToken, token));
    return user || undefined;
  }

  async setMagicLink(userId: number, token: string, expiry: Date): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({
        magicLinkToken: token,
        magicLinkExpiry: expiry,
      })
      .where(eq(users.id, userId))
      .returning();
    return updatedUser;
  }

  async clearMagicLink(userId: number): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({
        magicLinkToken: null,
        magicLinkExpiry: null,
      })
      .where(eq(users.id, userId))
      .returning();
    return updatedUser;
  }

  async createSorteoEntry(entry: InsertSorteoEntry): Promise<SorteoEntry> {
    const [sorteoEntry] = await db.insert(sorteoEntries).values(entry).returning();
    return sorteoEntry;
  }

  async getSorteoEntryByEmail(email: string): Promise<SorteoEntry | undefined> {
    const [entry] = await db.select().from(sorteoEntries).where(eq(sorteoEntries.email, email));
    return entry || undefined;
  }

  async incrementSorteoEntryCount(email: string): Promise<SorteoEntry | undefined> {
    const [updated] = await db.update(sorteoEntries)
      .set({ 
        entryCount: sql`${sorteoEntries.entryCount} + 1`,
        lastEntryAt: new Date()
      })
      .where(eq(sorteoEntries.email, email))
      .returning();
    return updated || undefined;
  }

  async getAllSorteoEntries(): Promise<SorteoEntry[]> {
    return await db.select().from(sorteoEntries);
  }
}

export const storage = new DatabaseStorage();
