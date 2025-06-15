import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertConversationSchema, insertMessageSchema, insertUserSchema, insertPartnerSchema } from "@shared/schema";
import { processUserMessage } from "./prompt-handler";
import { paypalService } from "./paypal";
import { authenticatePartner, registerPartner, generateReferralCode } from "./partner-auth";
import bcrypt from "bcrypt";
import "./types"; // Import session types

export async function registerRoutes(app: Express): Promise<Server> {
  
  // User authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(validatedData.username);
      
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const user = await storage.createUser(validatedData);
      res.json({ 
        success: true, 
        userId: user.id,
        message: "User registered successfully" 
      });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(400).json({ message: "Error creating user account" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Register login in database
      await storage.updateUserLogin(user.id);
      
      res.json({ 
        success: true,
        userId: user.id,
        message: "Login successful",
        hasCompletedPayment: user.hasCompletedPayment,
        subscriptionStatus: user.subscriptionStatus
      });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Error processing login" });
    }
  });

  // PayPal transaction tracking routes
  app.post("/api/paypal/create-order", async (req, res) => {
    try {
      const { userId, amount, currency, subscriptionPlan } = req.body;
      
      if (!userId || !amount || !currency || !subscriptionPlan) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Create a simple order ID for testing (in production this would be PayPal's real order ID)
      const orderId = `ORDER_${Date.now()}_${userId}`;
      
      const orderData = {
        id: orderId,
        status: 'CREATED',
        amount: amount,
        currency: currency
      };
      
      // Record transaction in database
      await storage.createPaypalTransaction({
        userId: parseInt(userId),
        paypalOrderId: orderData.id,
        subscriptionPlan,
        amount,
        currency,
        status: 'CREATED'
      });
      
      res.json(orderData);
    } catch (error) {
      console.error("Error creating PayPal order:", error);
      res.status(500).json({ message: "Error creating payment order" });
    }
  });

  app.post("/api/paypal/capture-order/:orderId", async (req, res) => {
    try {
      const { orderId } = req.params;
      const { userId } = req.body;
      
      if (!orderId || orderId === 'undefined') {
        return res.status(400).json({ message: "Invalid order ID" });
      }
      
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      
      // Simulate successful capture for testing (in production this would call PayPal API)
      const captureData = {
        id: orderId,
        status: 'COMPLETED',
        payer: {
          email_address: 'test@example.com'
        },
        purchase_units: [{
          amount: {
            value: '5.99',
            currency_code: 'EUR'
          }
        }]
      };
      
      if (captureData.status === 'COMPLETED') {
        // Update transaction status
        await storage.updatePaypalTransaction(orderId, 'COMPLETED');
        
        // Get transaction details to update user subscription
        const transactions = await storage.getPaypalTransactionsByUser(parseInt(userId));
        const transaction = transactions.find(t => t.paypalOrderId === orderId);
        
        if (transaction) {
          // Calculate expiration date
          const expiresAt = new Date();
          expiresAt.setMonth(expiresAt.getMonth() + 1);
          
          // Update user subscription
          await storage.updateUserSubscription(parseInt(userId), {
            status: 'active',
            plan: transaction.subscriptionPlan,
            subscriptionId: orderId,
            expiresAt
          });
        }
      }
      
      res.json(captureData);
    } catch (error) {
      console.error("Error capturing PayPal order:", error);
      res.status(500).json({ message: "Error processing payment" });
    }
  });

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

  // API endpoint to check subscription status
  app.get("/api/subscription-status", async (req, res) => {
    try {
      const userId = req.query.userId || req.headers['x-user-id'];
      
      if (!userId) {
        return res.status(400).json({ message: "User ID required" });
      }
      
      const user = await storage.getUser(parseInt(userId as string));
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const hasActiveSubscription = await checkSubscription(parseInt(userId as string));
      
      res.json({
        hasActiveSubscription,
        subscriptionStatus: user.subscriptionStatus,
        subscriptionPlan: user.subscriptionPlan,
        expiresAt: user.subscriptionExpiresAt,
        hasCompletedPayment: user.hasCompletedPayment
      });
    } catch (error) {
      console.error("Error checking subscription status:", error);
      res.status(500).json({ message: "Error checking subscription status" });
    }
  });

  // Send message and get AI response (requires active subscription)
  app.post("/api/conversations/:id/messages", async (req, res) => {
    try {
      const conversationId = parseInt(req.params.id);
      const { content, userId = 1, userProfile } = req.body; // Default userId for demo

      if (!content) {
        return res.status(400).json({ message: "Message content is required" });
      }

      // Allow free access to chat - no subscription required

      // Save user message
      const userMessage = await storage.createMessage({
        conversationId,
        content,
        isUser: true
      });

      // Get conversation history for context
      const messageHistory = await storage.getMessages(conversationId);
      
      // Generate AI response using the advanced prompt system with user profile
      const aiResponse = await processUserMessage(content, messageHistory, userProfile);

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

  // User statistics and tracking routes
  app.get("/api/admin/user-stats/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const transactions = await storage.getPaypalTransactionsByUser(userId);
      
      res.json({
        user: {
          id: user.id,
          username: user.username,
          createdAt: user.createdAt,
          lastLoginAt: user.lastLoginAt,
          loginCount: user.loginCount,
          hasCompletedPayment: user.hasCompletedPayment,
          subscriptionStatus: user.subscriptionStatus,
          subscriptionPlan: user.subscriptionPlan,
          subscriptionExpiresAt: user.subscriptionExpiresAt
        },
        transactions: transactions
      });
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ message: "Error fetching user statistics" });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", service: "NFLOW Psychology Bot" });
  });

  // Admin routes (completely isolated)
  app.post("/api/admin/auth", async (req, res) => {
    const { username, password } = req.body;
    
    // Fixed admin credentials for security
    const ADMIN_USER = "admin";
    const ADMIN_PASS = "nflow2025";
    
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      req.session.isAdmin = true;
      res.json({ success: true });
    } else {
      res.status(401).json({ success: false, message: "Credenciales incorrectas" });
    }
  });

  app.post("/api/admin/logout", (req, res) => {
    req.session.isAdmin = false;
    res.json({ success: true });
  });

  app.get("/api/admin/stats", async (req, res) => {
    if (!req.session.isAdmin) {
      return res.status(401).json({ message: "No autorizado" });
    }

    try {
      // Get total users
      const users = await storage.getAllUsers();
      const totalUsers = users.length;

      // Get active subscriptions
      const activeSubscriptions = users.filter(u => u.subscriptionStatus === "active").length;

      // Get total revenue from PayPal transactions
      const transactions = await storage.getAllPaypalTransactions();
      const completedTransactions = transactions.filter(t => t.status === "COMPLETED");
      const totalRevenue = completedTransactions.reduce((sum, t) => {
        // Convert amount to number and handle different currencies
        const amount = parseFloat(t.amount);
        return sum + amount;
      }, 0).toFixed(2);

      // Get total conversations
      const conversations = await storage.getConversations();
      const totalConversations = conversations.length;

      // Get today's registrations
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayRegistrations = users.filter(u => {
        const userDate = new Date(u.createdAt);
        userDate.setHours(0, 0, 0, 0);
        return userDate.getTime() === today.getTime();
      }).length;

      // Get today's payments
      const todayPayments = transactions.filter(t => {
        if (!t.completedAt) return false;
        const paymentDate = new Date(t.completedAt);
        paymentDate.setHours(0, 0, 0, 0);
        return paymentDate.getTime() === today.getTime() && t.status === "COMPLETED";
      }).length;

      res.json({
        totalUsers,
        activeSubscriptions,
        totalRevenue,
        totalConversations,
        todayRegistrations,
        todayPayments
      });
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  // ======== PARTNER ROUTES (COMPLETELY SEPARATED) ========
  
  // Partner registration
  app.post("/api/partners/register", async (req, res) => {
    try {
      const partnerData = insertPartnerSchema.parse(req.body);
      const result = await registerPartner(partnerData);
      
      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error("Error in partner registration:", error);
      res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
  });

  // Partner login
  app.post("/api/partners/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email y contraseña son requeridos" });
      }

      const result = await authenticatePartner(email, password);
      
      if (result.success) {
        req.session.partnerId = result.partner!.id;
        req.session.isPartner = true;
        req.session.partnerStatus = result.partner!.status;
        res.json(result);
      } else {
        res.status(401).json(result);
      }
    } catch (error) {
      console.error("Error in partner login:", error);
      res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
  });

  // Partner logout
  app.post("/api/partners/logout", (req, res) => {
    req.session.partnerId = undefined;
    req.session.isPartner = false;
    req.session.partnerStatus = undefined;
    res.json({ success: true, message: "Logout exitoso" });
  });

  // Get partner profile
  app.get("/api/partners/profile", async (req, res) => {
    if (!req.session.isPartner || !req.session.partnerId) {
      return res.status(401).json({ message: "No autorizado" });
    }

    try {
      const partner = await storage.getPartner(req.session.partnerId);
      if (!partner) {
        return res.status(404).json({ message: "Partner no encontrado" });
      }

      // Return partner data without password
      const { password, ...partnerData } = partner;
      res.json(partnerData);
    } catch (error) {
      console.error("Error fetching partner profile:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  // Get partner referrals
  app.get("/api/partners/referrals", async (req, res) => {
    if (!req.session.isPartner || !req.session.partnerId) {
      return res.status(401).json({ message: "No autorizado" });
    }

    try {
      const referrals = await storage.getPartnerReferrals(req.session.partnerId);
      res.json(referrals);
    } catch (error) {
      console.error("Error fetching partner referrals:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  // Generate referral code
  app.post("/api/partners/generate-code", async (req, res) => {
    if (!req.session.isPartner || !req.session.partnerId) {
      return res.status(401).json({ message: "No autorizado" });
    }

    try {
      const partner = await storage.getPartner(req.session.partnerId);
      if (!partner) {
        return res.status(404).json({ message: "Partner no encontrado" });
      }

      const referralCode = generateReferralCode(partner.companyName, partner.id);
      res.json({ referralCode });
    } catch (error) {
      console.error("Error generating referral code:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  // Admin: Get all partners
  app.get("/api/admin/partners", async (req, res) => {
    if (!req.session.isAdmin) {
      return res.status(401).json({ message: "No autorizado" });
    }

    try {
      const partners = await storage.getAllPartners();
      // Remove passwords from response
      const partnersData = partners.map(({ password, ...partner }) => partner);
      res.json(partnersData);
    } catch (error) {
      console.error("Error fetching partners:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  // Admin: Approve/reject partner
  app.patch("/api/admin/partners/:id/status", async (req, res) => {
    if (!req.session.isAdmin) {
      return res.status(401).json({ message: "No autorizado" });
    }

    try {
      const partnerId = parseInt(req.params.id);
      const { status } = req.body;

      if (!['approved', 'rejected', 'suspended'].includes(status)) {
        return res.status(400).json({ message: "Estado inválido" });
      }

      const partner = await storage.updatePartnerStatus(partnerId, status);
      const { password, ...partnerData } = partner;
      res.json(partnerData);
    } catch (error) {
      console.error("Error updating partner status:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  // ======== ADMIN PARTNER MANAGEMENT ROUTES ========
  
  // Get all partners for admin
  app.get("/api/admin/partners", async (req, res) => {
    if (!req.session.isAdmin) {
      return res.status(401).json({ message: "No autorizado" });
    }

    try {
      const partners = await storage.getAllPartners();
      res.json(partners);
    } catch (error) {
      console.error("Error fetching partners:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  // Approve partner
  app.post("/api/admin/partners/:id/approve", async (req, res) => {
    if (!req.session.isAdmin) {
      return res.status(401).json({ message: "No autorizado" });
    }

    try {
      const partnerId = parseInt(req.params.id);
      await storage.updatePartnerStatus(partnerId, 'approved');
      res.json({ success: true, message: "Partner aprobado exitosamente" });
    } catch (error) {
      console.error("Error approving partner:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  // Reject partner
  app.post("/api/admin/partners/:id/reject", async (req, res) => {
    if (!req.session.isAdmin) {
      return res.status(401).json({ message: "No autorizado" });
    }

    try {
      const partnerId = parseInt(req.params.id);
      await storage.updatePartnerStatus(partnerId, 'rejected');
      res.json({ success: true, message: "Partner rechazado" });
    } catch (error) {
      console.error("Error rejecting partner:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
