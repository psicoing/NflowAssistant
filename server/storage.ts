import { 
  users, conversations, messages, resources, paypalTransactions,
  type User, type InsertUser, 
  type Conversation, type InsertConversation,
  type Message, type InsertMessage,
  type Resource, type InsertResource,
  type PaypalTransaction, type InsertPaypalTransaction
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
  
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  getConversations(userId?: number): Promise<Conversation[]>;
  getConversation(id: number): Promise<Conversation | undefined>;
  
  createMessage(message: InsertMessage): Promise<Message>;
  getMessages(conversationId: number): Promise<Message[]>;
  
  getResources(): Promise<Resource[]>;
  getResourcesByCategory(category: string): Promise<Resource[]>;
  createResource(resource: InsertResource): Promise<Resource>;
  
  createPaypalTransaction(transaction: InsertPaypalTransaction): Promise<PaypalTransaction>;
  updatePaypalTransaction(paypalOrderId: string, status: string): Promise<PaypalTransaction>;
  getPaypalTransactionsByUser(userId: number): Promise<PaypalTransaction[]>;
  getAllUsers(): Promise<User[]>;
  getAllPaypalTransactions(): Promise<PaypalTransaction[]>;
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

  async updateUserSubscription(userId: number, subscriptionData: {
    status: string;
    plan: string;
    subscriptionId: string;
    expiresAt?: Date;
  }): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        subscriptionStatus: subscriptionData.status,
        subscriptionPlan: subscriptionData.plan,
        subscriptionId: subscriptionData.subscriptionId,
        subscriptionExpiresAt: subscriptionData.expiresAt,
        hasCompletedPayment: subscriptionData.status === 'active',
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async createPaypalTransaction(transaction: InsertPaypalTransaction): Promise<PaypalTransaction> {
    const [paypalTransaction] = await db
      .insert(paypalTransactions)
      .values(transaction)
      .returning();
    return paypalTransaction;
  }

  async updatePaypalTransaction(paypalOrderId: string, status: string): Promise<PaypalTransaction> {
    const [transaction] = await db
      .update(paypalTransactions)
      .set({
        status: status,
        completedAt: status === 'COMPLETED' ? new Date() : null,
      })
      .where(eq(paypalTransactions.paypalOrderId, paypalOrderId))
      .returning();
    return transaction;
  }

  async getPaypalTransactionsByUser(userId: number): Promise<PaypalTransaction[]> {
    return await db
      .select()
      .from(paypalTransactions)
      .where(eq(paypalTransactions.userId, userId))
      .orderBy(paypalTransactions.createdAt);
  }
}

export const storage = new DatabaseStorage();
