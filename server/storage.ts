import { 
  users, conversations, messages, resources, stripeTransactions, partners, partnerReferrals, books,
  type User, type InsertUser, 
  type Conversation, type InsertConversation,
  type Message, type InsertMessage,
  type Resource, type InsertResource,
  type StripeTransaction, type InsertStripeTransaction,
  type Partner, type InsertPartner,
  type PartnerReferral, type InsertPartnerReferral,
  type Book
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
  
  // Partner operations
  getPartner(id: number): Promise<Partner | undefined>;
  getPartnerByEmail(email: string): Promise<Partner | undefined>;
  createPartner(partner: InsertPartner): Promise<Partner>;
  updatePartnerLogin(partnerId: number): Promise<Partner>;
  updatePartnerStatus(partnerId: number, status: string): Promise<Partner>;
  getAllPartners(): Promise<Partner[]>;
  getPartnersByStatus(status: string): Promise<Partner[]>;
  
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
    const planLimits = {
      'basic': 10,
      'pro': 20, 
      'premium': 30,
      'annual': 40
    };
    return planLimits[plan as keyof typeof planLimits] || 10;
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
}

export const storage = new DatabaseStorage();
