import { 
  users, conversations, messages, resources,
  type User, type InsertUser, 
  type Conversation, type InsertConversation,
  type Message, type InsertMessage,
  type Resource, type InsertResource
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  getConversations(userId?: number): Promise<Conversation[]>;
  getConversation(id: number): Promise<Conversation | undefined>;
  
  createMessage(message: InsertMessage): Promise<Message>;
  getMessages(conversationId: number): Promise<Message[]>;
  
  getResources(): Promise<Resource[]>;
  getResourcesByCategory(category: string): Promise<Resource[]>;
  createResource(resource: InsertResource): Promise<Resource>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private conversations: Map<number, Conversation>;
  private messages: Map<number, Message>;
  private resources: Map<number, Resource>;
  private currentUserId: number;
  private currentConversationId: number;
  private currentMessageId: number;
  private currentResourceId: number;

  constructor() {
    this.users = new Map();
    this.conversations = new Map();
    this.messages = new Map();
    this.resources = new Map();
    this.currentUserId = 1;
    this.currentConversationId = 1;
    this.currentMessageId = 1;
    this.currentResourceId = 1;
    
    // Initialize with sample resources
    this.initializeResources();
  }

  private initializeResources() {
    const sampleResources: InsertResource[] = [
      {
        title: "Manejo del Estrés y la Ansiedad",
        content: "Técnicas de respiración profunda y mindfulness para reducir los niveles de estrés y ansiedad en situaciones cotidianas.",
        category: "ansiedad",
        type: "article"
      },
      {
        title: "Comunicación Efectiva en la Familia",
        content: "Estrategias para mejorar la comunicación familiar y fortalecer los vínculos emocionales entre padres e hijos.",
        category: "familia",
        type: "guide"
      },
      {
        title: "Ejercicios de Relajación Muscular",
        content: "Rutina de ejercicios de relajación progresiva para liberar tensiones físicas y mentales.",
        category: "bienestar",
        type: "exercise"
      },
      {
        title: "Gestión Emocional en el Trabajo",
        content: "Herramientas para manejar el estrés laboral y mantener un equilibrio emocional en el entorno profesional.",
        category: "laboral",
        type: "article"
      },
      {
        title: "Autoestima y Confianza Personal",
        content: "Estrategias para desarrollar una autoestima saludable y fortalecer la confianza en uno mismo.",
        category: "autoestima",
        type: "guide"
      }
    ];

    sampleResources.forEach(resource => {
      this.createResource(resource);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const id = this.currentConversationId++;
    const conversation: Conversation = { 
      id,
      title: insertConversation.title,
      userId: insertConversation.userId || null,
      createdAt: new Date() 
    };
    this.conversations.set(id, conversation);
    return conversation;
  }

  async getConversations(userId?: number): Promise<Conversation[]> {
    const allConversations = Array.from(this.conversations.values());
    if (userId) {
      return allConversations.filter(conv => conv.userId === userId);
    }
    return allConversations;
  }

  async getConversation(id: number): Promise<Conversation | undefined> {
    return this.conversations.get(id);
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.currentMessageId++;
    const message: Message = { 
      ...insertMessage, 
      id, 
      timestamp: new Date() 
    };
    this.messages.set(id, message);
    return message;
  }

  async getMessages(conversationId: number): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(message => message.conversationId === conversationId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  async getResources(): Promise<Resource[]> {
    return Array.from(this.resources.values());
  }

  async getResourcesByCategory(category: string): Promise<Resource[]> {
    return Array.from(this.resources.values())
      .filter(resource => resource.category === category);
  }

  async createResource(insertResource: InsertResource): Promise<Resource> {
    const id = this.currentResourceId++;
    const resource: Resource = { 
      ...insertResource, 
      id, 
      createdAt: new Date() 
    };
    this.resources.set(id, resource);
    return resource;
  }
}

export const storage = new MemStorage();
