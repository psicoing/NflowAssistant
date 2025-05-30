import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertConversationSchema, insertMessageSchema } from "@shared/schema";
import { processUserMessage } from "./prompt-handler";
import { paypalService } from "./paypal";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get all conversations
  app.get("/api/conversations", async (req, res) => {
    try {
      const conversations = await storage.getConversations();
      res.json(conversations);
    } catch (error) {
      res.status(500).json({ message: "Error fetching conversations" });
    }
  });

  // Create new conversation
  app.post("/api/conversations", async (req, res) => {
    try {
      const validatedData = insertConversationSchema.parse(req.body);
      const conversation = await storage.createConversation(validatedData);
      res.json(conversation);
    } catch (error) {
      res.status(400).json({ message: "Invalid conversation data" });
    }
  });

  // Get messages for a conversation
  app.get("/api/conversations/:id/messages", async (req, res) => {
    try {
      const conversationId = parseInt(req.params.id);
      const messages = await storage.getMessages(conversationId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Error fetching messages" });
    }
  });

  // Check subscription status
  const checkSubscription = async (userId: number) => {
    const user = await storage.getUser(userId);
    if (!user) return false;
    
    if (user.subscriptionStatus === 'active' && user.subscriptionExpiresAt) {
      return new Date() < user.subscriptionExpiresAt;
    }
    
    return user.subscriptionStatus === 'active';
  };

  // Send message and get AI response (requires active subscription)
  app.post("/api/conversations/:id/messages", async (req, res) => {
    try {
      const conversationId = parseInt(req.params.id);
      const { content, userId = 1 } = req.body; // Default userId for demo

      if (!content) {
        return res.status(400).json({ message: "Message content is required" });
      }

      // Check if user has active subscription
      const hasActiveSubscription = await checkSubscription(userId);
      if (!hasActiveSubscription) {
        return res.status(403).json({ 
          message: "Active subscription required to use chat",
          requiresSubscription: true 
        });
      }

      // Save user message
      const userMessage = await storage.createMessage({
        conversationId,
        content,
        isUser: true
      });

      // Get conversation history for context
      const messageHistory = await storage.getMessages(conversationId);
      
      // Generate AI response using the advanced prompt system
      const aiResponse = await processUserMessage(content, messageHistory);

      // Save AI message
      const aiMessage = await storage.createMessage({
        conversationId,
        content: aiResponse.content,
        isUser: false
      });

      res.json({
        userMessage,
        aiMessage,
        supportType: aiResponse.supportType
      });

    } catch (error) {
      console.error("Error in chat:", error);
      res.status(500).json({ message: "Error processing message" });
    }
  });

  // Get all resources
  app.get("/api/resources", async (req, res) => {
    try {
      const { category } = req.query;
      
      if (category && typeof category === 'string') {
        const resources = await storage.getResourcesByCategory(category);
        res.json(resources);
      } else {
        const resources = await storage.getResources();
        res.json(resources);
      }
    } catch (error) {
      res.status(500).json({ message: "Error fetching resources" });
    }
  });

  // PayPal subscription routes
  app.post("/api/subscribe", async (req, res) => {
    try {
      const { subscriptionId, userId = 1 } = req.body;
      
      if (!subscriptionId) {
        return res.status(400).json({ message: "Subscription ID is required" });
      }

      // Verify subscription with PayPal
      const subscription = await paypalService.verifySubscription(subscriptionId);
      
      if (subscription.status === 'ACTIVE') {
        // Update user subscription in database
        const expiresAt = new Date();
        expiresAt.setMonth(expiresAt.getMonth() + 1); // 1 month subscription
        
        await storage.updateUserSubscription(userId, {
          status: 'active',
          plan: subscription.plan_id,
          subscriptionId: subscription.id,
          expiresAt
        });

        res.json({ 
          success: true, 
          message: "Subscription activated successfully",
          subscription: {
            status: 'active',
            plan: subscription.plan_id,
            expiresAt
          }
        });
      } else {
        res.status(400).json({ message: "Subscription is not active" });
      }
    } catch (error) {
      console.error("Error activating subscription:", error);
      res.status(500).json({ message: "Error processing subscription" });
    }
  });

  app.get("/api/subscription-status/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isActive = await checkSubscription(userId);
      
      res.json({
        hasActiveSubscription: isActive,
        subscriptionStatus: user.subscriptionStatus,
        subscriptionPlan: user.subscriptionPlan,
        expiresAt: user.subscriptionExpiresAt
      });
    } catch (error) {
      console.error("Error checking subscription:", error);
      res.status(500).json({ message: "Error checking subscription" });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", service: "NFLOW Psychology Bot" });
  });

  const httpServer = createServer(app);
  return httpServer;
}
