import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertConversationSchema, insertMessageSchema, insertUserSchema, insertPartnerSchema } from "@shared/schema";
import { processUserMessage } from "./prompt-handler";
import { authenticatePartner, registerPartner, generateReferralCode } from "./partner-auth";
import bcrypt from "bcrypt";
import fetch from "node-fetch";
import "./types"; // Import session types

// Helper function to check if user has active subscription
async function checkSubscription(userId: number): Promise<boolean> {
  try {
    const user = await storage.getUser(userId);
    if (!user) return false;
    
    // Check if subscription is active and not expired
    if (user.subscriptionStatus === 'active') {
      if (user.subscriptionExpiresAt) {
        const now = new Date();
        const expiresAt = new Date(user.subscriptionExpiresAt);
        return now < expiresAt;
      }
      // If no expiration date, consider it active
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error checking subscription:", error);
    return false;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // User registration
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, password, email } = req.body;
      
      if (!username || !password || !email) {
        return res.status(400).json({ 
          success: false, 
          message: "Username, password y email son requeridos" 
        });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(409).json({ 
          success: false, 
          message: "El usuario ya existe" 
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user with pending payment status
      const newUser = await storage.createUser({
        username,
        password: hashedPassword,
        email,
        subscriptionStatus: 'pending_payment',
        hasCompletedPayment: false
      });

      // Set session for newly registered user
      req.session.userId = newUser.id;

      res.json({
        success: true,
        message: "Cuenta creada exitosamente",
        userId: newUser.id,
        requiresActivation: true
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Error interno del servidor" 
      });
    }
  });

  // User login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ 
          success: false, 
          message: "Username y password son requeridos" 
        });
      }

      // Find user
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: "Credenciales incorrectas" 
        });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ 
          success: false, 
          message: "Credenciales incorrectas" 
        });
      }

      // Set session for authenticated user
      req.session.userId = user.id;

      // Update last login
      await storage.updateUserLogin(user.id);

      // Check subscription status
      const hasActiveSubscription = await checkSubscription(user.id);

      res.json({
        success: true,
        userId: user.id,
        hasCompletedPayment: user.hasCompletedPayment,
        subscriptionStatus: user.subscriptionStatus,
        hasActiveSubscription,
        profileCompleted: user.profileCompleted || false,
        ageRange: user.ageRange,
        gender: user.gender,
        message: "Login exitoso"
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Error interno del servidor" 
      });
    }
  });

  // Get current authenticated user
  app.get("/api/auth/me", async (req, res) => {
    try {
      console.log("Session check - ID:", req.sessionID, "UserId:", req.session.userId);
      const userId = req.session.userId;
      
      if (!userId) {
        console.log("No userId in session, not authenticated");
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const hasActiveSubscription = await checkSubscription(userId);
      
      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        subscriptionStatus: user.subscriptionStatus,
        subscriptionPlan: user.subscriptionPlan,
        hasCompletedPayment: user.hasCompletedPayment,
        hasActiveSubscription,
        profileCompleted: user.profileCompleted || false,
        ageRange: user.ageRange,
        gender: user.gender,
        createdAt: user.createdAt
      });
    } catch (error) {
      console.error("Error getting current user:", error);
      res.status(500).json({ message: "Error getting user info" });
    }
  });

  // Update user profile endpoint
  app.post("/api/auth/update-profile", async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const { ageRange, gender } = req.body;
      
      if (!ageRange || !gender) {
        return res.status(400).json({ message: "Age range and gender are required" });
      }

      const user = await storage.updateUserProfile(userId, {
        ageRange,
        gender
      });

      res.json({
        success: true,
        profileCompleted: true,
        ageRange: user.ageRange,
        gender: user.gender
      });
    } catch (error) {
      console.error("Profile update error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Logout
  app.post("/api/auth/logout", (req, res) => {
    req.session.userId = undefined;
    res.json({ success: true, message: "Logout exitoso" });
  });

  // Get conversations for logged-in user
  app.get("/api/conversations", async (req, res) => {
    try {
      const userId = req.session.userId;
      console.log("Session check - Conversations endpoint - Session ID:", req.sessionID, "UserId:", userId);
      
      if (!userId) {
        console.log("No userId in session for conversations endpoint");
        return res.status(401).json({ message: "User not authenticated" });
      }
      
      const conversations = await storage.getConversations(userId);
      console.log(`Fetched ${conversations.length} conversations for user ${userId}`);
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ message: "Error fetching conversations" });
    }
  });

  // Create new conversation
  app.post("/api/conversations", async (req, res) => {
    try {
      const userId = req.session.userId;
      
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const { title } = req.body;
      const conversationData = {
        title: title || `Conversación ${new Date().toLocaleDateString("es-ES")}`,
        userId: userId
      };

      const validatedData = insertConversationSchema.parse(conversationData);
      const conversation = await storage.createConversation(validatedData);
      console.log(`Created conversation ${conversation.id} for user ${userId}`);
      res.json(conversation);
    } catch (error) {
      console.error("Error creating conversation:", error);
      res.status(400).json({ message: "Invalid conversation data" });
    }
  });

  // Get conversation by ID
  app.get("/api/conversations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const conversation = await storage.getConversation(id);
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }
      res.json(conversation);
    } catch (error) {
      res.status(500).json({ message: "Error fetching conversation" });
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

  // Send message to conversation with AI processing
  app.post("/api/conversations/:id/messages", async (req, res) => {
    try {
      const conversationId = parseInt(req.params.id);
      const { content, userProfile } = req.body;
      const userId = req.session.userId;

      console.log(`Processing message for conversation ${conversationId}, user ${userId}`);

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      // Check if user has active subscription
      const hasActiveSubscription = await checkSubscription(userId);
      if (!hasActiveSubscription) {
        return res.status(402).json({ 
          message: "Subscription required",
          needsPayment: true 
        });
      }

      // Check question limit
      const limitCheck = await storage.checkQuestionLimit(userId);
      if (!limitCheck.canAsk) {
        return res.status(429).json({ 
          message: "Límite de preguntas mensuales alcanzado",
          limit: limitCheck.limit,
          remaining: 0,
          resetDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString()
        });
      }

      // Save user message
      const userMessage = await storage.createMessage({
        conversationId,
        content,
        isUser: true
      });

      // Get conversation history for AI context
      const history = await storage.getMessages(conversationId);

      // Process the message with AI
      console.log("Calling processUserMessage with:", content);
      const aiResponse = await processUserMessage(content, history, userProfile);
      console.log("AI Response received:", aiResponse);

      // Increment question count after successful message processing
      await storage.incrementQuestionCount(userId);

      // Save AI response
      const aiMessage = await storage.createMessage({
        conversationId,
        content: aiResponse.content,
        isUser: false
      });

      res.json({
        userMessage,
        aiMessage,
        supportType: aiResponse.supportType,
        questionsRemaining: limitCheck.remaining
      });
    } catch (error) {
      console.error("Error processing conversation message:", error);
      res.status(500).json({ message: "Error processing message" });
    }
  });

  // Create new message
  app.post("/api/messages", async (req, res) => {
    try {
      const validatedData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(validatedData);
      res.json(message);
    } catch (error) {
      res.status(400).json({ message: "Invalid message data" });
    }
  });

  // Process chat message
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, conversationId, userProfile } = req.body;
      const userId = req.session.userId;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      // Check if user has active subscription
      const hasActiveSubscription = await checkSubscription(userId);
      if (!hasActiveSubscription) {
        return res.status(402).json({ 
          message: "Subscription required",
          needsPayment: true 
        });
      }

      // Check question limit
      const limitCheck = await storage.checkQuestionLimit(userId);
      if (!limitCheck.canAsk) {
        return res.status(429).json({ 
          message: "Límite de preguntas mensuales alcanzado",
          limit: limitCheck.limit,
          remaining: 0,
          resetDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString()
        });
      }

      // Get conversation history
      const history = await storage.getMessages(conversationId);

      // Process the message with AI
      const aiResponse = await processUserMessage(message, history, userProfile);

      // Increment question count after successful processing
      await storage.incrementQuestionCount(userId);

      res.json({
        content: aiResponse.content,
        supportType: aiResponse.supportType,
        questionsRemaining: limitCheck.remaining
      });
    } catch (error) {
      console.error("Error processing chat message:", error);
      res.status(500).json({ message: "Error processing message" });
    }
  });

  // Check subscription status
  app.get("/api/subscription-status", async (req, res) => {
    try {
      const userId = req.session.userId;
      
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      
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

  // Get all resources
  app.get("/api/resources", async (req, res) => {
    try {
      const { category } = req.query;
      
      let resources;
      if (category && typeof category === 'string') {
        resources = await storage.getResourcesByCategory(category);
      } else {
        resources = await storage.getResources();
      }
      
      res.json(resources);
    } catch (error) {
      console.error("Error fetching resources:", error);
      res.status(500).json({ message: "Error fetching resources" });
    }
  });

  // Admin login
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // Simple admin credentials check
      if (username === "admin" && password === "admin2025") {
        req.session.isAdmin = true;
        res.json({ success: true, message: "Admin login successful" });
      } else {
        res.status(401).json({ success: false, message: "Invalid admin credentials" });
      }
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  });

  // Admin stats
  app.get("/api/admin/stats", async (req, res) => {
    if (!req.session.isAdmin) {
      return res.status(401).json({ message: "No autorizado" });
    }

    try {
      const users = await storage.getAllUsers();
      const totalUsers = users.length;
      const activeSubscriptions = users.filter(u => u.subscriptionStatus === "active").length;
      const totalRevenue = activeSubscriptions * 2.99; // €2.99 per subscription

      res.json({
        totalUsers,
        activeSubscriptions,
        totalRevenue: totalRevenue.toFixed(2),
        pendingPayments: users.filter(u => u.subscriptionStatus === "pending_payment").length
      });
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Error fetching stats" });
    }
  });



  // Stripe webhook automático - activación inmediata de suscripciones
  app.post("/api/stripe/webhook", async (req, res) => {
    try {
      console.log("=== STRIPE WEBHOOK RECEIVED ===");
      console.log("Event type:", req.body.type);
      console.log("Full event data:", JSON.stringify(req.body, null, 2));
      
      const event = req.body;
      
      // Múltiples eventos de Stripe que indican pago exitoso
      if (event.type === 'checkout.session.completed' || 
          event.type === 'payment_intent.succeeded' ||
          event.type === 'invoice.payment_succeeded') {
        
        const customerEmail = event.data.object.customer_details?.email || 
                             event.data.object.customer_email ||
                             event.data.object.receipt_email ||
                             event.email; // Para pruebas manuales
        
        console.log("Processing Stripe payment for email:", customerEmail);
        
        if (customerEmail) {
          const users = await storage.getAllUsers();
          const user = users.find(u => u.email === customerEmail);
          
          if (user) {
            console.log("=== ACTIVATING STRIPE SUBSCRIPTION ===");
            console.log("User found:", user.username, "ID:", user.id, "Current status:", user.subscriptionStatus);
            
            await storage.updateUserSubscription(user.id, {
              status: 'active',
              plan: 'basic',
              subscriptionId: event.data.object.id || `stripe_${Date.now()}`,
              expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            });
            
            console.log("✅ Stripe subscription activated successfully for:", user.username);
            
            // Return success with user info
            res.json({ 
              received: true, 
              activated: true,
              user: { username: user.username, email: user.email }
            });
            return;
          } else {
            console.log("❌ User not found for email:", customerEmail);
            
            // Log available users for debugging
            console.log("Available users with emails:", users.filter(u => u.email).map(u => ({ 
              id: u.id, 
              username: u.username, 
              email: u.email 
            })));
          }
        } else {
          console.log("❌ No customer email found in Stripe event");
          console.log("Available email fields:", {
            'customer_details.email': event.data.object.customer_details?.email,
            'customer_email': event.data.object.customer_email,
            'receipt_email': event.data.object.receipt_email
          });
        }
      } else {
        console.log("ℹ️ Stripe event type not handled:", event.type);
      }
      
      res.json({ received: true, activated: false });
    } catch (error) {
      console.error("❌ Stripe webhook error:", error);
      res.status(400).json({ error: 'Webhook error', details: error.message });
    }
  });

  // PayPal endpoints
  app.get("/api/paypal/config", async (req, res) => {
    try {
      res.json({ 
        clientId: process.env.PAYPAL_CLIENT_ID,
        success: true
      });
    } catch (error) {
      console.error("PayPal config error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Error getting PayPal config" 
      });
    }
  });

  app.get("/api/paypal/create-subscription-button", async (req, res) => {
    try {
      res.json({ 
        success: true, 
        subscriptionId: "temp",
        message: "PayPal button ready" 
      });
    } catch (error) {
      console.error("PayPal button error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Error loading PayPal" 
      });
    }
  });

  app.post("/api/paypal/capture-subscription", async (req, res) => {
    try {
      const { subscriptionId } = req.body;
      const userId = req.session.userId;

      if (!userId) {
        return res.status(401).json({ 
          success: false, 
          message: "Usuario no autenticado" 
        });
      }

      // Update user subscription status
      await storage.updateUserSubscription(userId, {
        status: "active",
        plan: "basic",
        subscriptionId: subscriptionId,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      });

      res.json({ 
        success: true, 
        message: "Suscripción activada" 
      });
    } catch (error) {
      console.error("PayPal capture error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Error procesando pago" 
      });
    }
  });

  // Stripe subscription capture (for return page)
  app.post("/api/stripe/capture-subscription", async (req, res) => {
    try {
      const { sessionId } = req.body;
      const userId = req.session.userId;

      if (!userId) {
        return res.status(401).json({ 
          success: false, 
          message: "Usuario no autenticado" 
        });
      }

      // Update user subscription status
      await storage.updateUserSubscription(userId, {
        status: "active",
        plan: "basic",
        subscriptionId: sessionId || ("stripe_" + Date.now()),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      });

      res.json({ 
        success: true, 
        message: "Suscripción activada exitosamente" 
      });
    } catch (error) {
      console.error("Stripe capture error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Error procesando pago" 
      });
    }
  });

  // Stripe auto-activation (for users with successful payments)
  app.post("/api/stripe/auto-activate", async (req, res) => {
    try {
      const userId = req.session.userId;

      if (!userId) {
        return res.status(401).json({ 
          success: false, 
          message: "Usuario no autenticado" 
        });
      }

      // Check if user already has active subscription
      const user = await storage.getUser(userId);
      if (user?.subscriptionStatus === 'active') {
        return res.json({ 
          success: true, 
          message: "Suscripción ya activa" 
        });
      }

      // Auto-activate subscription
      await storage.updateUserSubscription(userId, {
        status: "active",
        plan: "basic",
        subscriptionId: "stripe_auto_" + Date.now(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      });

      res.json({ 
        success: true, 
        message: "Suscripción activada automáticamente" 
      });
    } catch (error) {
      console.error("Stripe auto-activation error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Error en activación automática" 
      });
    }
  });

  // Manual Stripe activation by username (for support/admin use)
  app.post("/api/stripe/manual-activate", async (req, res) => {
    try {
      const { username } = req.body;

      if (!username) {
        return res.status(400).json({ 
          success: false, 
          message: "Username requerido" 
        });
      }

      // Find user by username
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: "Usuario no encontrado" 
        });
      }

      // Check if user already has active subscription
      if (user.subscriptionStatus === 'active') {
        return res.json({ 
          success: true, 
          message: "Usuario ya tiene suscripción activa" 
        });
      }

      // Activate subscription
      await storage.updateUserSubscription(user.id, {
        status: "active",
        plan: "basic",
        subscriptionId: "stripe_manual_" + Date.now(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      });

      res.json({ 
        success: true, 
        message: `Usuario ${username} activado exitosamente` 
      });
    } catch (error) {
      console.error("Manual activation error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Error en activación manual" 
      });
    }
  });

  // Manual PayPal activation by username (for support/admin use)
  app.post("/api/paypal/manual-activate", async (req, res) => {
    try {
      const { username } = req.body;

      if (!username) {
        return res.status(400).json({ 
          success: false, 
          message: "Username requerido" 
        });
      }

      // Find user by username
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: "Usuario no encontrado" 
        });
      }

      // Check if user already has active subscription
      if (user.subscriptionStatus === 'active') {
        return res.json({ 
          success: true, 
          message: "Usuario ya tiene suscripción activa" 
        });
      }

      // Activate subscription
      await storage.updateUserSubscription(user.id, {
        status: "active",
        plan: "basic",
        subscriptionId: "paypal_manual_" + Date.now(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      });

      res.json({ 
        success: true, 
        message: `Usuario ${username} activado exitosamente con PayPal` 
      });
    } catch (error) {
      console.error("PayPal manual activation error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Error en activación manual PayPal" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}