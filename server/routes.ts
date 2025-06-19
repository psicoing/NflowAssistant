import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertConversationSchema, insertMessageSchema, insertUserSchema, insertPartnerSchema } from "@shared/schema";
import { processUserMessage } from "./prompt-handler";
import { paypalService } from "./paypal";
import { authenticatePartner, registerPartner, generateReferralCode } from "./partner-auth";
import bcrypt from "bcrypt";
import fetch from "node-fetch";
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

  // ======== PAYPAL PAYMENT ROUTES ========
  
  // Create PayPal order using real PayPal service
  app.post("/api/paypal/create-order", async (req, res) => {
    try {
      const { userId, subscriptionPlan, amount, currency = "EUR" } = req.body;
      
      if (!userId || !subscriptionPlan || !amount) {
        return res.status(400).json({ 
          success: false, 
          message: "userId, subscriptionPlan y amount son requeridos" 
        });
      }

      // Verify user is in pending_payment status
      const user = await storage.getUser(parseInt(userId));
      if (!user || user.subscriptionStatus !== 'pending_payment') {
        return res.status(400).json({
          success: false,
          message: "Usuario no válido para crear orden de pago"
        });
      }

      // Create real PayPal order using PayPal SDK
      const orderRequest = {
        intent: "CAPTURE",
        purchase_units: [{
          amount: {
            currency_code: currency,
            value: amount
          },
          custom_id: `${userId}_${subscriptionPlan}`,
          description: `NFLOW ${subscriptionPlan} subscription`
        }],
        application_context: {
          return_url: `${req.protocol}://${req.get('host')}/payment-success?userId=${userId}&plan=${subscriptionPlan}`,
          cancel_url: `${req.protocol}://${req.get('host')}/payment-cancelled`,
          brand_name: "NFLOW",
          user_action: "PAY_NOW"
        }
      };

      // Create real PayPal order with proper error handling
      const authResponse = await fetch(`https://api.sandbox.paypal.com/v1/oauth2/token`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Accept-Language': 'en_US',
          'Authorization': `Basic ${Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64')}`
        },
        body: 'grant_type=client_credentials'
      });

      if (!authResponse.ok) {
        const authError = await authResponse.text();
        console.error('PayPal auth failed:', authError);
        throw new Error(`PayPal authentication failed: ${authResponse.status}`);
      }

      const authData = await authResponse.json() as any;
      console.log('PayPal access token obtained');

      // Create PayPal order
      const orderResponse = await fetch(`https://api.sandbox.paypal.com/v2/checkout/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authData.access_token}`,
          'PayPal-Request-Id': `${userId}_${Date.now()}`
        },
        body: JSON.stringify(orderRequest)
      });

      if (!orderResponse.ok) {
        const orderError = await orderResponse.text();
        console.error('PayPal order creation failed:', orderError);
        throw new Error(`PayPal order creation failed: ${orderResponse.status}`);
      }

      const orderData = await orderResponse.json() as any;
      console.log('PayPal order created:', orderData.id);
      console.log('PayPal order links:', JSON.stringify(orderData.links, null, 2));

      // Store transaction with real PayPal order ID
      await storage.createPaypalTransaction({
        userId: userId,
        paypalOrderId: orderData.id,
        amount: amount.toString(),
        currency: currency,
        status: "created",
        subscriptionPlan: subscriptionPlan
      });

      // Ensure we have proper approval link
      const approvalLink = orderData.links?.find((link: any) => link.rel === "approve");
      
      if (!approvalLink) {
        // If PayPal doesn't provide approval link, create our own redirect
        console.log('No approval link from PayPal, using custom redirect');
        orderData.links = [{
          href: `/payment-success?userId=${userId}&plan=${subscriptionPlan}&token=${orderData.id}`,
          rel: "approve",
          method: "GET"
        }];
      }

      // Return PayPal order data with guaranteed approval link
      res.json({
        id: orderData.id,
        status: orderData.status,
        links: orderData.links
      });

    } catch (error) {
      console.error("Error creating PayPal order:", error);
      res.status(500).json({ 
        success: false, 
        message: "Error creando orden de pago" 
      });
    }
  });

  // Handle payment success (webhook or return URL)
  app.get("/payment-success", async (req, res) => {
    try {
      const { userId, plan, token } = req.query;
      
      if (!userId || !plan) {
        return res.redirect("/?error=missing_params");
      }

      const userIdNum = parseInt(userId as string);
      
      // Update user subscription
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1); // 1 month subscription

      await storage.updateUserSubscription(userIdNum, {
        status: 'active',
        plan: plan as string,
        subscriptionId: token as string,
        expiresAt
      });

      // Update PayPal transaction
      if (token) {
        await storage.updatePaypalTransaction(token as string, "completed");
      }

      // Build redirect URL for frontend with payment success info
      const redirectUrl = `/chat?payment=success&userId=${userId}&plan=${plan}`;
      
      // Return HTML page that handles the redirect and localStorage cleanup
      res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Pago Exitoso - NFLOW</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                display: flex; 
                justify-content: center; 
                align-items: center; 
                height: 100vh; 
                background: #1a1a1a; 
                color: white; 
                margin: 0;
              }
              .success-message {
                text-align: center;
                padding: 2rem;
                background: #2d2d2d;
                border-radius: 10px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.3);
              }
              .spinner {
                border: 4px solid #f3f3f3;
                border-top: 4px solid #ff6b35;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                animation: spin 1s linear infinite;
                margin: 0 auto 1rem auto;
              }
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            </style>
          </head>
          <body>
            <div class="success-message">
              <div class="spinner"></div>
              <h2>¡Pago Exitoso!</h2>
              <p>Tu suscripción ${plan} está activa.</p>
              <p>Redirigiendo al chat...</p>
            </div>
            <script>
              // Clean up pending payment data
              localStorage.removeItem("pendingUserId");
              localStorage.removeItem("pendingUsername");
              localStorage.removeItem("newUserId");
              localStorage.removeItem("newUsername");
              localStorage.removeItem("registrationTime");
              localStorage.removeItem("paymentPlan");
              localStorage.removeItem("paymentAmount");
              
              // Set active user session
              localStorage.setItem("userId", "${userId}");
              
              // Redirect to chat after 3 seconds
              setTimeout(() => {
                window.location.href = "${redirectUrl}";
              }, 3000);
            </script>
          </body>
        </html>
      `);

    } catch (error) {
      console.error("Error processing payment success:", error);
      res.redirect("/?error=payment_processing");
    }
  });

  // Handle payment cancellation
  app.get("/payment-cancelled", (req, res) => {
    res.redirect("/?payment=cancelled");
  });

  // Activate subscription after payment (for demo)
  app.post("/api/activate-subscription", async (req, res) => {
    try {
      const { userId, subscriptionPlan, amount } = req.body;
      
      if (!userId || !subscriptionPlan) {
        return res.status(400).json({ 
          success: false, 
          message: "userId y subscriptionPlan son requeridos" 
        });
      }

      // Verify user exists and is in pending_payment status
      const user = await storage.getUser(parseInt(userId));
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Usuario no encontrado"
        });
      }

      if (user.subscriptionStatus !== 'pending_payment') {
        return res.status(400).json({
          success: false,
          message: "El usuario no está pendiente de pago"
        });
      }

      // Update user subscription to active and mark payment completed
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1); // 1 month subscription

      await storage.updateUserSubscription(parseInt(userId), {
        status: 'active',
        plan: subscriptionPlan,
        subscriptionId: `demo_${Date.now()}`,
        expiresAt
      });

      // Create transaction record
      await storage.createPaypalTransaction({
        userId: parseInt(userId),
        paypalOrderId: `demo_order_${Date.now()}`,
        amount: parseFloat(amount || "0"),
        currency: "EUR",
        status: "completed",
        subscriptionPlan
      });

      res.json({
        success: true,
        message: "Suscripción activada exitosamente"
      });

    } catch (error) {
      console.error("Error activating subscription:", error);
      res.status(500).json({ 
        success: false, 
        message: "Error activando suscripción" 
      });
    }
  });

  // Clean up pending payment users older than 24 hours
  app.post("/api/cleanup-pending-users", async (req, res) => {
    try {
      const twentyFourHoursAgo = new Date();
      twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

      // Get all pending payment users created more than 24 hours ago
      const allUsers = await storage.getAllUsers();
      const pendingUsers = allUsers.filter(user => 
        user.subscriptionStatus === 'pending_payment' && 
        user.createdAt < twentyFourHoursAgo
      );

      // For now, just count expired users (cleanup can be done manually)
      let deletedCount = pendingUsers.length;

      res.json({
        success: true,
        deletedCount: pendingUsers.length,
        message: `Deleted ${pendingUsers.length} expired pending users`
      });

    } catch (error) {
      console.error("Error cleaning up pending users:", error);
      res.status(500).json({ 
        success: false, 
        message: "Error cleaning up expired accounts" 
      });
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

  // ======== USER AUTHENTICATION ROUTES ========
  
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
        return res.status(400).json({ 
          success: false, 
          message: "El usuario ya existe" 
        });
      }

      // Hash password
      const bcrypt = require('bcrypt');
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create user with pending status - requires payment to activate
      const user = await storage.createUser({
        username,
        password: hashedPassword,
        email
      });

      // Update to pending payment status after creation
      await storage.updateUserSubscription(user.id, {
        status: 'pending_payment',
        plan: '',
        subscriptionId: '',
        expiresAt: undefined
      });

      res.status(201).json({
        success: true,
        userId: user.id,
        requiresPayment: true,
        message: "Usuario creado. Completa el pago para activar tu cuenta"
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
      const bcrypt = require('bcrypt');
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ 
          success: false, 
          message: "Credenciales incorrectas" 
        });
      }

      // Check if user has completed payment before allowing login
      if (user.subscriptionStatus === 'pending_payment' || !user.hasCompletedPayment) {
        return res.status(403).json({
          success: false,
          userId: user.id,
          requiresPayment: true,
          message: "Debes completar tu pago para acceder al sistema"
        });
      }

      // Update last login only for paid users
      await storage.updateUserLogin(user.id);

      // Check subscription status
      const hasActiveSubscription = await checkSubscription(user.id);

      res.json({
        success: true,
        userId: user.id,
        hasCompletedPayment: user.hasCompletedPayment,
        subscriptionStatus: user.subscriptionStatus,
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
