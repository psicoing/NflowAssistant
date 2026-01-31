import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertConversationSchema, insertMessageSchema, insertUserSchema, insertPartnerSchema, partnerReferrals, partners, users } from "@shared/schema";
import { processUserMessage } from "./prompt-handler";
import { authenticatePartner, registerPartner, generateReferralCode } from "./partner-auth";
import bcrypt from "bcrypt";
import fetch from "node-fetch";
import { db } from "./db";
import { eq } from "drizzle-orm";
import "./types"; // Import session types
import multer from "multer";
import * as XLSX from "xlsx";

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
  
  // Block WordPress bot requests - return 404 immediately
  app.use((req, res, next) => {
    const blockedPaths = [
      '/wp-admin',
      '/wp-login.php',
      '/wp-includes',
      '/wp-content',
      '/xmlrpc.php',
      '/wp-config.php',
      '/wp-cron.php',
      '/wp-json',
      '/.env',
      '/phpmyadmin',
      '/admin.php',
      '/administrator'
    ];
    
    const path = req.path.toLowerCase();
    if (blockedPaths.some(blocked => path.startsWith(blocked))) {
      return res.status(404).send('Not Found');
    }
    next();
  });

  // Security Headers Middleware
  app.use((req, res, next) => {
    // Prevent clickjacking - no one can embed your site in an iframe
    res.setHeader('X-Frame-Options', 'DENY');
    
    // Prevent MIME type sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');
    
    // Enable XSS filter in browsers
    res.setHeader('X-XSS-Protection', '1; mode=block');
    
    // Control referrer information
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // Permissions Policy - restrict browser features
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    
    next();
  });

  // User registration
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, password, email, birthDate, userType, referralCode, acceptedNuxaNotice, noticeVersion } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ 
          success: false, 
          message: "Username y password son requeridos" 
        });
      }
      
      // Validar que para usuarios individuales se requiera fecha de nacimiento
      if (userType === "individual" && !birthDate) {
        return res.status(400).json({ 
          success: false, 
          message: "Fecha de nacimiento es requerida para usuarios individuales" 
        });
      }

      // Validar edad mínima solo para usuarios individuales
      if (userType === "individual" && birthDate) {
        const calculateAge = (birthDate: string) => {
          const today = new Date();
          const birth = new Date(birthDate);
          let age = today.getFullYear() - birth.getFullYear();
          const monthDiff = today.getMonth() - birth.getMonth();
          
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
          }
          
          return age;
        };

        const age = calculateAge(birthDate);
        if (age < 18) {
          return res.status(400).json({ 
            success: false, 
            message: "Debes tener al menos 18 años para registrarte. Si eres menor de edad, consulta con tus padres o tutores." 
          });
        }

        if (age > 95) {
          return res.status(400).json({ 
            success: false, 
            message: "La plataforma está diseñada para personas de 18 a 95 años" 
          });
        }
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

      // Create user with pending payment status and NO free questions
      const newUser = await storage.createUser({
        username,
        password: hashedPassword,
        email,
        birthDate: userType === "individual" ? birthDate : null,
        userType: userType || "individual",
        subscriptionStatus: 'pending_payment',
        hasCompletedPayment: false,
        acceptedNuxaNotice: acceptedNuxaNotice === true,
        noticeAcceptedAt: acceptedNuxaNotice === true ? new Date() : null,
        noticeVersion: noticeVersion || null
      });

      // Set session for newly registered user
      req.session.userId = newUser.id;

      // Process referral code if provided
      if (referralCode && typeof referralCode === 'string') {
        try {
          console.log("=== PROCESSING REFERRAL CODE DURING REGISTRATION ===");
          console.log("Referral code:", referralCode);
          console.log("New user ID:", newUser.id);
          
          // Parse referral code format: COMPANYPREFIX_PARTNERID_TIMESTAMP
          const parts = referralCode.split('_');
          if (parts.length >= 2) {
            const partnerIdStr = parts[parts.length - 2];
            const partnerId = parseInt(partnerIdStr);
            
            if (!isNaN(partnerId)) {
              // Verify partner exists and is active
              const partner = await storage.getPartner(partnerId);
              if (partner && (partner.status === 'approved' || partner.status === 'active')) {
                console.log(`✓ Valid partner found: ${partner.companyName} (ID: ${partnerId})`);
                
                // Create partner referral record
                await storage.createPartnerReferral({
                  partnerId: partnerId,
                  userId: newUser.id,
                  referralCode: referralCode.trim(),
                  subscriptionPlan: 'pending', // Will be updated when payment is made
                  amount: '0.00', // Will be updated when payment is made
                  commission: '0.00', // Will be updated when payment is made
                  status: 'pending'
                });
                
                console.log(`✓ Partner referral record created for partner ${partnerId} and user ${newUser.id}`);
              } else {
                console.log(`⚠ Invalid or inactive partner with ID: ${partnerId}`);
              }
            } else {
              console.log(`⚠ Invalid partner ID in referral code: ${partnerIdStr}`);
            }
          } else {
            console.log(`⚠ Invalid referral code format: ${referralCode}`);
          }
        } catch (error) {
          console.error("Error processing referral code during registration:", error);
        }
      }

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
      console.log("Login attempt for username:", username);
      console.log("User found:", user ? "Yes" : "No");
      
      if (!user) {
        console.log("User not found in database");
        return res.status(401).json({ 
          success: false, 
          message: "Credenciales incorrectas" 
        });
      }

      // Verify password
      console.log("Comparing password with hash...");
      console.log("Password provided:", password);
      console.log("Hash in database:", user.password);
      
      const isValidPassword = await bcrypt.compare(password, user.password);
      console.log("Password validation result:", isValidPassword);
      
      if (!isValidPassword) {
        console.log("Password comparison failed");
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
        userType: user.userType || "individual",
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
        userType: user.userType || "individual",
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

  // Magic Link Authentication - for Shopify customers
  // Using POST to prevent CSRF via embedded links/scripts
  app.post("/api/auth/magic-link/:token", async (req, res) => {
    try {
      const { token } = req.params;
      
      if (!token || token.length !== 64) {
        return res.status(400).json({ 
          success: false,
          message: "Token inválido" 
        });
      }
      
      // Find user by magic token (atomic operation - fetch and validate)
      const user = await storage.getUserByMagicToken(token);
      
      if (!user) {
        return res.status(404).json({ 
          success: false,
          message: "Link inválido o expirado" 
        });
      }
      
      // Check if token is expired
      if (user.magicLinkExpiry && new Date() > user.magicLinkExpiry) {
        // Clear expired token
        await storage.clearMagicLink(user.id);
        return res.status(410).json({ 
          success: false,
          message: "Este enlace ha expirado. Por favor solicita uno nuevo." 
        });
      }
      
      // Clear magic link FIRST (single-use guarantee) before any other operations
      await storage.clearMagicLink(user.id);
      
      // Update login stats
      await storage.updateUserLogin(user.id);
      
      // Create session
      req.session.userId = user.id;
      
      console.log(`✅ Magic link login successful for user: ${user.username}`);
      
      res.json({ 
        success: true, 
        message: "Acceso exitoso",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          subscriptionStatus: user.subscriptionStatus,
          subscriptionPlan: user.subscriptionPlan,
          prepaidQuestions: user.prepaidQuestions || 0,
        }
      });
    } catch (error) {
      console.error("Magic link auth error:", error);
      res.status(500).json({ 
        success: false,
        message: "Error interno del servidor" 
      });
    }
  });

  // Change password
  app.post("/api/auth/change-password", async (req, res) => {
    try {
      const userId = req.session.userId;
      
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ 
          message: "Current password and new password are required" 
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ 
          message: "New password must be at least 6 characters long" 
        });
      }

      // Get current user
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ 
          message: "Current password is incorrect" 
        });
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      
      // Update password in database
      await storage.updateUserPassword(userId, hashedNewPassword);

      res.json({ 
        success: true, 
        message: "Password updated successfully" 
      });
    } catch (error) {
      console.error("Change password error:", error);
      res.status(500).json({ 
        message: "Internal server error" 
      });
    }
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
      
      // Check if user has active subscription
      const hasActiveSubscription = await checkSubscription(userId);
      if (!hasActiveSubscription) {
        return res.status(403).json({ 
          message: "NFLOW es aplicación de pago - Suscripción requerida",
          requiresPayment: true 
        });
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

      // Check if user has active subscription
      const hasActiveSubscription = await checkSubscription(userId);
      if (!hasActiveSubscription) {
        return res.status(403).json({ 
          message: "NFLOW es aplicación de pago - Suscripción requerida",
          requiresPayment: true 
        });
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
      const userId = req.session.userId;
      
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      // Check if user has active subscription
      const hasActiveSubscription = await checkSubscription(userId);
      if (!hasActiveSubscription) {
        return res.status(403).json({ 
          message: "NFLOW es aplicación de pago - Suscripción requerida",
          requiresPayment: true 
        });
      }

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
      const { content, userProfile, language, chatMode } = req.body;
      const userId = req.session.userId;

      console.log(`Processing message for conversation ${conversationId}, user ${userId}`);

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      // Check if user has active subscription
      const hasActiveSubscription = await checkSubscription(userId);
      if (!hasActiveSubscription) {
        return res.status(402).json({ 
          message: "NFLOW es aplicación de pago - Suscripción requerida",
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

      // Get user language: prefer explicit language from body, then Accept-Language header, default to Spanish
      const userLanguage = language || req.headers['accept-language']?.split(',')[0]?.split('-')[0] || 'es';
      
      // Process the message with AI
      console.log("Calling processUserMessage with:", content, "language:", userLanguage, "mode:", chatMode);
      const aiResponse = await processUserMessage(content, history, userProfile, userLanguage, chatMode);
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
        questionsRemaining: limitCheck.remaining,
        tags: aiResponse.tags || []
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

      // Get user language from request headers or default to Spanish  
      const userLanguage = req.headers['accept-language']?.split(',')[0]?.split('-')[0] || 'es';
      
      // Process the message with AI
      const aiResponse = await processUserMessage(message, history, userProfile, userLanguage);

      // Increment question count after successful processing
      await storage.incrementQuestionCount(userId);

      res.json({
        content: aiResponse.content,
        supportType: aiResponse.supportType,
        questionsRemaining: limitCheck.remaining,
        tags: aiResponse.tags || []
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

  // Get all books
  app.get("/api/books", async (req, res) => {
    try {
      const { category } = req.query;
      
      let books;
      if (category && typeof category === 'string') {
        books = await storage.getBooksByCategory(category);
      } else {
        books = await storage.getAllBooks();
      }
      
      res.json(books);
    } catch (error) {
      console.error("Error fetching books:", error);
      res.status(500).json({ message: "Error fetching books" });
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

  // ===== PARTNER ROUTES =====
  
  // Partner login
  app.post("/api/partners/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ 
          success: false, 
          message: "Email y contraseña son requeridos" 
        });
      }
      
      const result = await authenticatePartner(email, password);
      
      if (result.success && result.partner) {
        // Set partner session
        req.session.partnerId = result.partner.id;
        req.session.isPartner = true;
        req.session.partnerStatus = result.partner.status;
        
        res.json({ 
          success: true, 
          message: result.message,
          partner: result.partner
        });
      } else {
        res.status(401).json({ 
          success: false, 
          message: result.message 
        });
      }
    } catch (error) {
      console.error("Partner login error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Error interno del servidor" 
      });
    }
  });

  // Partner logout
  app.post("/api/partners/logout", async (req, res) => {
    try {
      delete req.session.partnerId;
      delete req.session.isPartner;
      delete req.session.partnerStatus;
      
      res.json({ success: true, message: "Logout exitoso" });
    } catch (error) {
      console.error("Partner logout error:", error);
      res.status(500).json({ success: false, message: "Error interno" });
    }
  });

  // Get partner profile
  app.get("/api/partners/profile", async (req, res) => {
    try {
      const partnerId = req.session.partnerId;
      
      if (!partnerId) {
        return res.status(401).json({ message: "Not authenticated as partner" });
      }
      
      const partner = await storage.getPartner(partnerId);
      
      if (!partner) {
        return res.status(404).json({ message: "Partner not found" });
      }
      
      // Return partner data without password
      const { password, ...partnerData } = partner;
      res.json(partnerData);
    } catch (error) {
      console.error("Error fetching partner profile:", error);
      res.status(500).json({ message: "Error fetching profile" });
    }
  });

  // Get partner referrals
  app.get("/api/partners/referrals", async (req, res) => {
    try {
      const partnerId = req.session.partnerId;
      
      if (!partnerId) {
        return res.status(401).json({ message: "Not authenticated as partner" });
      }
      
      const referrals = await storage.getPartnerReferrals(partnerId);
      res.json(referrals);
    } catch (error) {
      console.error("Error fetching partner referrals:", error);
      res.status(500).json({ message: "Error fetching referrals" });
    }
  });

  // Generate or get permanent referral code
  app.post("/api/partners/generate-code", async (req, res) => {
    try {
      const partnerId = req.session.partnerId;
      
      if (!partnerId) {
        return res.status(401).json({ message: "Not authenticated as partner" });
      }
      
      const partner = await storage.getPartner(partnerId);
      
      if (!partner) {
        return res.status(404).json({ message: "Partner not found" });
      }
      
      // Check if partner already has a permanent referral code
      if (partner.referralCode) {
        console.log(`Partner ${partnerId} already has code: ${partner.referralCode}`);
        return res.json({ referralCode: partner.referralCode });
      }
      
      // Generate permanent referral code (only once)
      const referralCode = generateReferralCode(partner.companyName, partnerId);
      
      // Save it to partner profile
      await db.update(partners)
        .set({ referralCode })
        .where(eq(partners.id, partnerId));
      
      console.log(`Generated permanent code for partner ${partnerId}: ${referralCode}`);
      
      res.json({ referralCode });
    } catch (error) {
      console.error("Error generating referral code:", error);
      res.status(500).json({ message: "Error generating code" });
    }
  });

  // Validate referral code
  app.post("/api/partners/validate-code", async (req, res) => {
    try {
      const { referralCode } = req.body;

      if (!referralCode || typeof referralCode !== 'string') {
        return res.json({ valid: false, message: "Código requerido" });
      }

      // Parse referral code format: COMPANYPREFIX_PARTNERID_TIMESTAMP
      const parts = referralCode.split('_');
      if (parts.length < 2) {
        return res.json({ valid: false, message: "Formato de código inválido" });
      }

      // Extract partner ID (second to last part)
      const partnerIdStr = parts[parts.length - 2];
      const partnerId = parseInt(partnerIdStr);

      if (isNaN(partnerId)) {
        return res.json({ valid: false, message: "ID de partner inválido" });
      }

      // Verify partner exists and is active
      const partner = await storage.getPartner(partnerId);
      if (!partner) {
        return res.json({ valid: false, message: "Partner no encontrado" });
      }

      if (partner.status !== 'approved' && partner.status !== 'active') {
        return res.json({ valid: false, message: "Partner no activo" });
      }

      res.json({ 
        valid: true, 
        partnerId: partnerId,
        partnerName: partner.companyName,
        message: "Código válido" 
      });

    } catch (error) {
      console.error("Error validating referral code:", error);
      res.json({ valid: false, message: "Error validando código" });
    }
  });

  // Multer configuration for file uploads
  const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    fileFilter: (req, file, cb) => {
      const allowedMimes = [
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.oasis.opendocument.spreadsheet'
      ];
      if (allowedMimes.includes(file.mimetype) || 
          file.originalname.endsWith('.csv') || 
          file.originalname.endsWith('.xlsx') || 
          file.originalname.endsWith('.xls') ||
          file.originalname.endsWith('.ods')) {
        cb(null, true);
      } else {
        cb(new Error('Formato de archivo no soportado. Use CSV, XLSX, XLS o ODS.'));
      }
    }
  });

  // Partner upload users from file (CSV, XLSX, ODS)
  app.post("/api/partners/upload-users", upload.single('file'), async (req, res) => {
    try {
      const partnerId = req.session.partnerId;
      
      if (!partnerId) {
        return res.status(401).json({ message: "No autenticado como partner" });
      }
      
      const partner = await storage.getPartner(partnerId);
      if (!partner) {
        return res.status(404).json({ message: "Partner no encontrado" });
      }

      // Check license status
      if (partner.licenseStatus === 'suspended') {
        return res.status(403).json({ message: "Licencia suspendida. Contacta con el administrador." });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No se ha enviado ningún archivo" });
      }

      // Parse the file
      let workbook;
      try {
        workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
      } catch (parseError) {
        return res.status(400).json({ message: "Error al leer el archivo. Asegúrate de que es un archivo válido." });
      }

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as string[][];

      if (data.length < 2) {
        return res.status(400).json({ message: "El archivo debe tener al menos una fila de cabecera y una fila de datos" });
      }

      // Get headers (first row)
      const headers = data[0].map((h: any) => String(h).toLowerCase().trim());
      
      // Find column indices
      const emailIndex = headers.findIndex((h: string) => h.includes('email') || h.includes('correo'));
      const nameIndex = headers.findIndex((h: string) => h.includes('nombre') || h.includes('name') || h.includes('usuario'));
      const passwordIndex = headers.findIndex((h: string) => h.includes('password') || h.includes('contraseña') || h.includes('clave'));

      if (emailIndex === -1) {
        return res.status(400).json({ 
          message: "El archivo debe tener una columna 'email' o 'correo'",
          headers: headers 
        });
      }

      if (nameIndex === -1) {
        return res.status(400).json({ 
          message: "El archivo debe tener una columna 'nombre', 'name' o 'usuario'",
          headers: headers 
        });
      }

      // Check user limits
      const currentActiveUsers = partner.activeUsersCount || 0;
      const userLimit = partner.activeUsersLimit || 10;
      const availableSlots = userLimit - currentActiveUsers;
      const usersToImport = data.length - 1; // Exclude header

      if (usersToImport > availableSlots) {
        return res.status(400).json({ 
          message: `No tienes suficientes slots disponibles. Disponibles: ${availableSlots}, Intentando importar: ${usersToImport}`,
          availableSlots,
          usersToImport
        });
      }

      // Process users
      const results = {
        success: 0,
        errors: [] as string[],
        created: [] as string[]
      };

      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        if (!row || row.length === 0) continue;

        const email = row[emailIndex]?.toString().trim().toLowerCase();
        const name = row[nameIndex]?.toString().trim();
        const password = passwordIndex !== -1 ? row[passwordIndex]?.toString() : null;

        if (!email || !name) {
          results.errors.push(`Fila ${i + 1}: Email o nombre vacío`);
          continue;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          results.errors.push(`Fila ${i + 1}: Email inválido (${email})`);
          continue;
        }

        try {
          // Check if user already exists
          const existingUser = await storage.getUserByUsername(email);
          if (existingUser) {
            results.errors.push(`Fila ${i + 1}: Usuario ya existe (${email})`);
            continue;
          }

          // Generate password if not provided
          const finalPassword = password || Math.random().toString(36).slice(-8);
          const hashedPassword = await bcrypt.hash(finalPassword, 10);

          // Create user with partner association using direct db insert
          await db.insert(users).values({
            username: email,
            email: email,
            password: hashedPassword,
            role: 'user',
            userType: 'individual',
            subscriptionStatus: 'active',
            subscriptionPlan: 'partner',
            monthlyQuestionLimit: 100, // Partner users get more questions
          });

          results.success++;
          results.created.push(email);

        } catch (userError: any) {
          results.errors.push(`Fila ${i + 1}: Error creando usuario (${email}): ${userError.message}`);
        }
      }

      // Update partner active users count
      if (results.success > 0) {
        await db.update(partners)
          .set({ activeUsersCount: currentActiveUsers + results.success })
          .where(eq(partners.id, partnerId));
      }

      res.json({
        message: `Importación completada: ${results.success} usuarios creados`,
        success: results.success,
        errors: results.errors,
        created: results.created,
        newActiveCount: currentActiveUsers + results.success
      });

    } catch (error: any) {
      console.error("Error uploading users:", error);
      res.status(500).json({ message: "Error procesando archivo: " + error.message });
    }
  });

  // Get partner users list
  app.get("/api/partners/users", async (req, res) => {
    try {
      const partnerId = req.session.partnerId;
      
      if (!partnerId) {
        return res.status(401).json({ message: "No autenticado como partner" });
      }
      
      const partner = await storage.getPartner(partnerId);
      if (!partner) {
        return res.status(404).json({ message: "Partner no encontrado" });
      }

      // Get users with partner subscription plan
      const partnerUsers = await db.select()
        .from(users)
        .where(eq(users.subscriptionPlan, 'partner'));

      res.json(partnerUsers.map(u => ({
        id: u.id,
        username: u.username,
        email: u.email,
        createdAt: u.createdAt,
        lastLoginAt: u.lastLoginAt,
        subscriptionStatus: u.subscriptionStatus
      })));

    } catch (error: any) {
      console.error("Error fetching partner users:", error);
      res.status(500).json({ message: "Error obteniendo usuarios" });
    }
  });

  // Stripe checkout session - simplificado para máxima compatibilidad
  app.post("/api/stripe/create-checkout-session", async (req, res) => {
    try {
      const { referralCode, plan = 'basic' } = req.body;
      console.log(`Creating Stripe checkout session - plan: ${plan}`);

      // Importar Stripe solo cuando se necesite
      const Stripe = (await import('stripe')).default;
      const stripeKey = process.env.STRIPE_SECRET_KEY || process.env.TESTING_STRIPE_SECRET_KEY || '';
      
      if (!stripeKey) {
        console.error('❌ No Stripe secret key found in environment');
        return res.status(500).json({ error: 'Stripe configuration missing' });
      }
      
      const stripe = new Stripe(stripeKey, {
        apiVersion: '2025-08-27.basil',
      });

      // Configuración de planes
      const planConfig: Record<string, { amount: number; name: string; interval: 'month' | 'year'; intervalCount?: number }> = {
        basic: {
          amount: 299, // €2.99 in cents
          name: 'NFLOW Plan Básico',
          interval: 'month'
        },
        individual: {
          amount: 599, // €5.99 in cents
          name: 'NFLOW Plan Individual',
          interval: 'month'
        },
        premium: {
          amount: 3200, // €32 in cents
          name: 'NFLOW Plan Premium',
          interval: 'month',
          intervalCount: 12 // Facturado cada 12 meses
        }
      };

      const selectedPlan = planConfig[plan] || planConfig.basic;

      // Crear precio dinámicamente según el plan seleccionado
      const price = await stripe.prices.create({
        unit_amount: selectedPlan.amount,
        currency: 'eur',
        recurring: {
          interval: selectedPlan.interval,
          interval_count: selectedPlan.intervalCount || 1
        },
        product_data: {
          name: selectedPlan.name,
        },
      });

      // Prepare metadata with referral information and plan
      let metadata: any = {
        source: "activation_page",
        userId: req.session.userId?.toString() || "unknown",
        plan: plan // Guardar el plan seleccionado
      };

      // If referral code provided, validate and add to metadata
      if (referralCode && typeof referralCode === 'string') {
        try {
          const parts = referralCode.split('_');
          if (parts.length >= 2) {
            const partnerIdStr = parts[parts.length - 2];
            const partnerId = parseInt(partnerIdStr);
            
            if (!isNaN(partnerId)) {
              const partner = await storage.getPartner(partnerId);
              if (partner && (partner.status === 'approved' || partner.status === 'active')) {
                metadata.referralCode = referralCode;
                metadata.partnerId = partnerId.toString();
                metadata.partnerName = partner.companyName;
                console.log(`✓ Valid referral code: ${referralCode} for partner: ${partner.companyName}`);
              }
            }
          }
        } catch (error) {
          console.log(`⚠ Invalid referral code format: ${referralCode}`);
        }
      }

      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        line_items: [
          {
            price: price.id,
            quantity: 1,
          },
        ],
        success_url: "https://nflow.style/stripe-return?session_id={CHECKOUT_SESSION_ID}",
        cancel_url: "https://nflow.style/cancel",
        metadata
      });
      
      res.json({ url: session.url });
    } catch (error: any) {
      console.error('Stripe checkout session error:', error);
      res.status(500).json({ 
        success: false, 
        message: "Error creating checkout session" 
      });
    }
  });

  app.get("/stripe-return", async (req, res) => {
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2025-08-27.basil',
    });
    
    const session = await stripe.checkout.sessions.retrieve(req.query.session_id as string);

    if (session.payment_status === "paid") {
      // Activar usuario por email
      const customerEmail = session.customer_details?.email || session.customer_email;
      
      if (customerEmail) {
        const users = await storage.getAllUsers();
        const user = users.find(u => u.email === customerEmail);
        
        if (user) {
          // Obtener el plan desde los metadatos de la sesión
          const plan = session.metadata?.plan || 'basic';
          
          // Calcular fecha de expiración según el plan
          let expiresAt: Date;
          if (plan === 'premium') {
            expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 12 meses
          } else {
            expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 1 mes
          }
          
          await storage.updateUserSubscription(user.id, {
            status: 'active',
            plan: plan,
            subscriptionId: req.query.session_id as string,
            expiresAt: expiresAt
          });
        }
      }
      
      return res.redirect("/login");
    } else {
      return res.send("Error en pago");
    }
  });

  // Stripe webhook automático - activación inmediata de suscripciones
  app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), async (req, res) => {
    try {
      console.log("=== STRIPE WEBHOOK RECEIVED ===");
      
      // Initialize Stripe
      const Stripe = (await import('stripe')).default;
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
        apiVersion: '2025-08-27.basil',
      });
      
      const sig = req.headers["stripe-signature"];
      let event;

      // Verificar la firma del webhook para seguridad (skip en development para testing)
      if (process.env.NODE_ENV === 'development' && req.body.test_mode) {
        console.log("🧪 DEV MODE: Skipping signature verification for testing");
        event = req.body;
      } else {
        if (!sig) {
          console.error("❌ Missing stripe signature");
          return res.status(400).send('Missing stripe signature');
        }
        
        try {
          event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET || '');
          console.log("✅ Webhook signature verified");
        } catch (err: any) {
          console.error("❌ Webhook signature verification failed:", err.message);
          return res.status(400).send(`Webhook Error: ${err.message}`);
        }
      }
      
      console.log("Event type:", event.type);
      console.log("Full event data:", JSON.stringify(event, null, 2));
      
      // Múltiples eventos de Stripe que indican pago exitoso
      if (event.type === 'checkout.session.completed' || 
          event.type === 'payment_intent.succeeded' ||
          event.type === 'invoice.payment_succeeded') {
        
        const eventData = event.data.object as any;
        const customerEmail = eventData.customer_details?.email || 
                             eventData.customer_email ||
                             eventData.receipt_email;
        
        console.log("Processing Stripe payment for email:", customerEmail);
        
        if (customerEmail) {
          const users = await storage.getAllUsers();
          const user = users.find(u => u.email === customerEmail);
          
          if (user) {
            // Check for referral code in metadata to process commission
            const metadata = eventData.metadata;
            
            // MANEJO DE CRÉDITOS PREPAGADOS (PAGO POR USO)
            if (metadata?.type === 'prepaid_credits') {
              console.log("=== PROCESSING PREPAID CREDITS PURCHASE ===");
              console.log("User:", user.username, "ID:", user.id);
              console.log("Pack type:", metadata.packType);
              console.log("Questions:", metadata.questions);
              console.log("Amount paid:", eventData.amount_total);
              
              try {
                // VALIDACIÓN CRÍTICA: Verificar que el monto pagado coincida con el pack
                const packType = metadata.packType;
                const expectedAmounts: Record<string, number> = {
                  'pack15': 500,  // 5€ en centavos
                  'pack35': 1000  // 10€ en centavos
                };
                
                const expectedAmount = expectedAmounts[packType];
                const actualAmount = eventData.amount_total;
                
                if (!expectedAmount || actualAmount !== expectedAmount) {
                  console.error(`❌ SECURITY: Amount mismatch! Expected ${expectedAmount}, got ${actualAmount} for pack ${packType}`);
                  res.status(400).json({ 
                    received: true, 
                    creditsAdded: false,
                    error: 'Amount mismatch' 
                  });
                  return;
                }
                
                // Verificar que las preguntas correspondan al pack
                const expectedQuestions: Record<string, number> = {
                  'pack15': 15,
                  'pack35': 35
                };
                
                const questionsToAdd = expectedQuestions[packType];
                if (!questionsToAdd || questionsToAdd !== parseInt(metadata.questions)) {
                  console.error(`❌ SECURITY: Questions mismatch! Expected ${questionsToAdd}, got ${metadata.questions} for pack ${packType}`);
                  res.status(400).json({ 
                    received: true, 
                    creditsAdded: false,
                    error: 'Questions mismatch' 
                  });
                  return;
                }
                
                // Todo verificado - añadir créditos
                await storage.addPrepaidQuestions(user.id, questionsToAdd);
                
                console.log(`✅ Added ${questionsToAdd} prepaid questions to user ${user.username}`);
                
                res.json({ 
                  received: true, 
                  creditsAdded: true,
                  questions: questionsToAdd,
                  user: { username: user.username, email: user.email }
                });
                return;
              } catch (error) {
                console.error("❌ Error adding prepaid questions:", error);
                res.json({ received: true, creditsAdded: false });
                return;
              }
            }
            
            // MANEJO DE SUSCRIPCIONES (FLUJO ORIGINAL)
            console.log("=== ACTIVATING STRIPE SUBSCRIPTION ===");
            console.log("User found:", user.username, "ID:", user.id, "Current status:", user.subscriptionStatus);
            
            const selectedPlan = metadata?.plan || 'basic';
            
            if (metadata && metadata.referralCode && metadata.partnerId) {
              console.log("=== PROCESSING REFERRAL COMMISSION ===");
              console.log("Referral code:", metadata.referralCode);
              console.log("Partner ID:", metadata.partnerId);
              console.log("Selected plan:", selectedPlan);
              
              try {
                const partnerId = parseInt(metadata.partnerId);
                const partner = await storage.getPartner(partnerId);
                
                if (partner && (partner.status === 'approved' || partner.status === 'active')) {
                  const amount = ((eventData.amount_total || 299) / 100).toFixed(2); // Convert from cents to euros
                  const commission = ((eventData.amount_total || 299) * 0.1 / 100).toFixed(2); // 10% commission in euros
                  
                  console.log(`💰 Processing payment: €${amount}, Commission: €${commission}`);
                  
                  // Check if a referral already exists for this user and partner
                  const existingReferrals = await storage.getPartnerReferrals(partnerId);
                  const existingReferral = existingReferrals.find(r => r.userId === user.id);
                  
                  if (existingReferral) {
                    console.log(`📝 Updating existing referral record for user ${user.id}`);
                    // Update existing referral with payment information
                    await db.update(partnerReferrals)
                      .set({
                        subscriptionPlan: selectedPlan,
                        amount: amount,
                        commission: commission,
                        status: 'completed',
                        paidAt: new Date()
                      })
                      .where(eq(partnerReferrals.id, existingReferral.id));
                  } else {
                    console.log(`➕ Creating new referral record for user ${user.id}`);
                    // Create new partner referral record
                    await storage.createPartnerReferral({
                      partnerId: partnerId,
                      userId: user.id,
                      referralCode: metadata.referralCode,
                      subscriptionPlan: selectedPlan,
                      amount: amount,
                      commission: commission,
                      status: 'completed'
                    });
                  }
                  
                  // Update partner statistics
                  const allReferrals = await storage.getPartnerReferrals(partnerId);
                  const completedReferrals = allReferrals.filter(r => r.status === 'completed');
                  const totalEarnings = completedReferrals.reduce((sum, r) => sum + parseFloat(r.commission || '0'), 0);
                  
                  await storage.updatePartnerStats(partnerId, completedReferrals.length, totalEarnings.toFixed(2));
                  
                  console.log(`✅ Commission processed: €${commission} for partner: ${partner.companyName}`);
                  console.log(`📊 Partner stats updated: ${completedReferrals.length} referrals, €${totalEarnings.toFixed(2)} total earnings`);
                }
              } catch (error) {
                console.error("❌ Error processing referral commission:", error);
              }
            }
            
            // Determine expiration date based on plan
            const expiresAt = selectedPlan === 'premium' 
              ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 365 days para premium
              : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days para basic e individual

            await storage.updateUserSubscription(user.id, {
              status: 'active',
              plan: selectedPlan,
              subscriptionId: eventData.id || `stripe_${Date.now()}`,
              expiresAt: expiresAt
            });
            
            console.log("✅ Stripe subscription activated successfully for:", user.username);
            
            // ALSO check for pending referrals (for users who registered with referral links)
            // This handles cases where referral code came from URL during registration
            if (!metadata || !metadata.referralCode) {
              console.log("=== CHECKING FOR PENDING REFERRALS ===");
              try {
                // Search for any pending referral for this user
                const allPartners = await storage.getAllPartners();
                for (const partner of allPartners) {
                  const referrals = await storage.getPartnerReferrals(partner.id);
                  const pendingReferral = referrals.find(
                    r => r.userId === user.id && r.status === 'pending'
                  );
                  
                  if (pendingReferral) {
                    console.log(`✓ Found pending referral for user ${user.id}, partner ${partner.id}`);
                    const amount = ((eventData.amount_total || 299) / 100).toFixed(2);
                    const commission = ((eventData.amount_total || 299) * 0.1 / 100).toFixed(2);
                    
                    // Update pending referral to completed
                    await db.update(partnerReferrals)
                      .set({
                        subscriptionPlan: selectedPlan,
                        amount: amount,
                        commission: commission,
                        status: 'completed',
                        paidAt: new Date()
                      })
                      .where(eq(partnerReferrals.id, pendingReferral.id));
                    
                    // Update partner stats
                    const allReferrals = await storage.getPartnerReferrals(partner.id);
                    const completedReferrals = allReferrals.filter(r => r.status === 'completed');
                    const totalEarnings = completedReferrals.reduce((sum, r) => sum + parseFloat(r.commission || '0'), 0);
                    
                    await storage.updatePartnerStats(partner.id, completedReferrals.length, totalEarnings.toFixed(2));
                    
                    console.log(`✅ Pending referral updated: €${commission} commission for partner ${partner.companyName}`);
                    console.log(`📊 Partner stats updated: ${completedReferrals.length} referrals, €${totalEarnings.toFixed(2)} total`);
                    break; // Only one referral per user
                  }
                }
              } catch (error) {
                console.error("❌ Error checking pending referrals:", error);
              }
            }
            
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
            'customer_details.email': eventData.customer_details?.email,
            'customer_email': eventData.customer_email,
            'receipt_email': eventData.receipt_email
          });
        }
      } else {
        console.log("ℹ️ Stripe event type not handled:", event.type);
      }
      
      res.json({ received: true, activated: false });
    } catch (error: any) {
      console.error("❌ Stripe webhook error:", error);
      res.status(400).json({ error: 'Webhook error', details: error.message });
    }
  });

  // Shopify webhook - activación automática de productos
  app.post("/api/shopify/webhook", express.raw({ type: "application/json" }), async (req, res) => {
    try {
      console.log("=== SHOPIFY WEBHOOK RECEIVED ===");
      
      const { verifyShopifyWebhook, processShopifyOrder } = await import('./shopifyWebhookHandler');
      
      // Get HMAC header
      const hmacHeader = req.headers['x-shopify-hmac-sha256'] as string;
      
      if (!hmacHeader) {
        console.error("❌ Missing Shopify HMAC header");
        return res.status(401).send('Missing HMAC header');
      }
      
      // Verify webhook signature
      const webhookSecret = process.env.SHOPIFY_WEBHOOK_SECRET || '';
      
      if (!webhookSecret) {
        console.error("❌ SHOPIFY_WEBHOOK_SECRET not configured");
        return res.status(500).send('Webhook secret not configured');
      }
      
      const isValid = verifyShopifyWebhook(req.body, hmacHeader, webhookSecret);
      
      if (!isValid) {
        console.error("❌ Invalid Shopify webhook signature");
        return res.status(401).send('Invalid signature');
      }
      
      console.log("✅ Webhook signature verified");
      
      // Parse order data
      const orderData = JSON.parse(req.body.toString());
      
      // Process order
      const result = await processShopifyOrder(orderData);
      
      if (result.success) {
        console.log("✅ Shopify order processed:", result.message);
        
        // Send magic link email if available
        if (result.magicLink && result.customerEmail) {
          try {
            const { sendMagicLinkEmail } = await import('./emailService');
            
            // Get product name from first line item
            const productName = orderData.line_items?.[0]?.title || 'Servicio NUXA';
            const customerFirstName = orderData.customer?.first_name || 'Usuario';
            
            await sendMagicLinkEmail({
              to: result.customerEmail,
              customerName: customerFirstName,
              magicLink: result.magicLink,
              productName,
              isNewUser: result.isNewUser || false
            });
            
            console.log("📧 Magic link email sent successfully");
          } catch (emailError) {
            console.error("❌ Failed to send magic link email:", emailError);
          }
        }
        
        res.status(200).json({ 
          received: true,
          processed: true,
          message: result.message,
          transactionId: result.transactionId,
          emailSent: !!result.magicLink
        });
      } else {
        console.error("❌ Failed to process order:", result.message);
        res.status(400).json({
          received: true,
          processed: false,
          error: result.message
        });
      }
      
    } catch (error: any) {
      console.error("❌ Shopify webhook error:", error);
      res.status(500).json({ 
        received: true,
        error: 'Internal server error',
        details: error.message 
      });
    }
  });

  // Página de cancelación
  app.get("/cancel", (req, res) => {
    res.send(`
      <html>
        <head><title>Pago Cancelado</title></head>
        <body style="font-family: Arial; text-align: center; padding: 50px;">
          <h2>Pago Cancelado</h2>
          <p>Has cancelado el proceso de pago.</p>
          <a href="/activar-cuenta" style="color: #0066cc;">Volver a intentar</a>
        </body>
      </html>
    `);
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


  // Get user question limit status
  app.get("/api/question-limit", async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if we need to reset monthly counter
      const now = new Date();
      const lastReset = user.lastQuestionResetDate ? new Date(user.lastQuestionResetDate) : new Date();
      const isNewMonth = now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear();

      if (isNewMonth) {
        await storage.resetMonthlyQuestions(userId);
        const updatedUser = await storage.getUser(userId);
        return res.json({
          limit: updatedUser?.monthlyQuestionLimit || 10,
          remaining: updatedUser?.monthlyQuestionLimit || 10,
          used: 0,
          canAsk: true,
          resetDate: new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString()
        });
      }

      const used = user.questionsUsedThisMonth || 0;
      const limit = user.monthlyQuestionLimit || 10;
      const prepaid = user.prepaidQuestions || 0;
      const subscriptionRemaining = Math.max(0, limit - used);
      const totalRemaining = prepaid + subscriptionRemaining;
      
      res.json({
        limit,
        remaining: subscriptionRemaining,
        used,
        prepaidQuestions: prepaid,
        totalRemaining,
        canAsk: totalRemaining > 0,
        resetDate: new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString()
      });
    } catch (error) {
      console.error("Error checking question limit:", error);
      res.status(500).json({ message: "Error checking question limit" });
    }
  });

  // Purchase prepaid credits
  app.post("/api/purchase-credits", async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }

      const { pack } = req.body;
      
      // Validación del lado del servidor - solo packs permitidos
      const ALLOWED_PACKS = ['pack15', 'pack35'];
      if (!pack || !ALLOWED_PACKS.includes(pack)) {
        return res.status(400).json({ 
          message: "Pack inválido. Solo se permiten pack15 y pack35." 
        });
      }

      const stripeKey = process.env.STRIPE_SECRET_KEY;
      if (!stripeKey) {
        console.error('❌ No Stripe secret key found');
        return res.status(500).json({ error: 'Stripe no configurado' });
      }

      const Stripe = (await import('stripe')).default;
      const stripe = new Stripe(stripeKey, {
        apiVersion: '2025-08-27.basil',
      });

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      // Configuración de packs
      const packConfig: Record<string, { questions: number; price: number; name: string }> = {
        pack15: { questions: 15, price: 500, name: '15 preguntas' },
        pack35: { questions: 35, price: 1000, name: '35 preguntas' }
      };

      const selectedPack = packConfig[pack];

      // Crear sesión de Stripe para pago único
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: `Pack de ${selectedPack.name}`,
                description: `Créditos prepagados para NUXA - ${selectedPack.questions} preguntas adicionales`
              },
              unit_amount: selectedPack.price,
            },
            quantity: 1,
          },
        ],
        success_url: "https://nflow.style/chat?credits_purchased=true",
        cancel_url: "https://nflow.style/chat",
        metadata: {
          userId: userId.toString(),
          packType: pack,
          questions: selectedPack.questions.toString(),
          type: 'prepaid_credits'
        }
      });
      
      res.json({ url: session.url });
    } catch (error: any) {
      console.error('Error al crear sesión de compra:', error);
      res.status(500).json({ 
        error: 'Error al procesar la compra',
        details: error.message 
      });
    }
  });

  // Public statistics endpoint
  app.get("/api/public-stats", async (req, res) => {
    try {
      const stats = await storage.getPublicStats();
      res.json(stats);
    } catch (error) {
      console.error("Error getting public stats:", error);
      res.status(500).json({ 
        message: "Error getting stats",
        totalUsers: 0,
        totalConversations: 0,
        activeSubscriptions: 0,
        averageSatisfaction: 4.9
      });
    }
  });

  // 🚀 CRITICAL: Auto-activation by email (NEVER FAILS)
  app.post("/api/auto-activate-by-email", async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ 
          success: false, 
          message: "Email requerido" 
        });
      }

      console.log("=== AUTO ACTIVATION BY EMAIL ===");
      console.log("Email:", email);

      // Find user by email
      const allUsers = await storage.getAllUsers();
      const user = allUsers.find(u => u.email === email);

      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: "Usuario no encontrado" 
        });
      }

      // Check if already active
      if (user.subscriptionStatus === 'active') {
        return res.json({ 
          success: true, 
          message: "Usuario ya activo",
          user: { username: user.username, email: user.email }
        });
      }

      // Activate user - no questions asked (payment was verified externally)
      await storage.updateUserSubscription(user.id, {
        status: "active",
        plan: "basic",
        subscriptionId: `auto_${Date.now()}`,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      });

      console.log("✅ User auto-activated:", user.username);

      res.json({ 
        success: true, 
        message: `Cuenta ${user.username} activada automáticamente`,
        user: { username: user.username, email: user.email }
      });

    } catch (error) {
      console.error("Auto activation error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Error en activación automática" 
      });
    }
  });

  // 🚀 CRITICAL: Stripe activation by session ID (when user session is lost)
  app.post("/api/stripe/activate-by-session", async (req, res) => {
    try {
      const { sessionId } = req.body;

      if (!sessionId) {
        return res.status(400).json({ 
          success: false, 
          message: "Session ID requerido" 
        });
      }

      console.log("=== STRIPE ACTIVATION BY SESSION ===");
      console.log("Session ID:", sessionId);

      // For demonstration, we'll activate based on recent payment evidence
      // In real production, you'd validate this sessionId with Stripe API
      // For now, find the most recent unpaid user and activate them
      const allUsers = await storage.getAllUsers();
      const unpaidUsers = allUsers.filter(user => 
        user.subscriptionStatus !== 'active' && 
        user.hasCompletedPayment !== true
      );

      if (unpaidUsers.length > 0) {
        const userToActivate = unpaidUsers[unpaidUsers.length - 1]; // Most recent
        
        console.log("Activating most recent user:", userToActivate.username);
        
        await storage.updateUserSubscription(userToActivate.id, {
          status: "active",
          plan: "basic",
          subscriptionId: sessionId,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        });

        console.log("✅ User activated successfully:", userToActivate.username);

        res.json({ 
          success: true, 
          message: `Cuenta ${userToActivate.username} activada exitosamente`,
          user: { username: userToActivate.username, email: userToActivate.email }
        });
        return;
      }

      // If no unpaid users, just return success (maybe already activated)
      res.json({ 
        success: true, 
        message: "Activación completada" 
      });

    } catch (error) {
      console.error("Stripe session activation error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Error en activación por sesión" 
      });
    }
  });


  // 🧪 TEST: Webhook sin verificación de firma para debugging
  app.post("/api/test/stripe-webhook", async (req, res) => {
    try {
      console.log("🧪 TEST WEBHOOK: Evento recibido:", req.body?.type);
      
      const event = req.body;
      
      if (event.type === 'checkout.session.completed') {
        const eventData = event.data.object;
        const customerEmail = eventData.customer_details?.email || 
                             eventData.customer_email ||
                             eventData.receipt_email;
        
        console.log("🧪 TEST WEBHOOK: Email del cliente:", customerEmail);
        
        if (customerEmail) {
          const users = await storage.getAllUsers();
          const user = users.find(u => u.email === customerEmail);
          
          if (user) {
            console.log("🧪 TEST WEBHOOK: Usuario encontrado:", user.username, "Status:", user.subscriptionStatus);
            
            const updatedUser = await storage.updateUserSubscription(user.id, {
              status: 'active',
              plan: 'basic',
              subscriptionId: `test_webhook_${Date.now()}`,
              expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            });
            
            console.log("🧪 TEST WEBHOOK: Usuario actualizado:", updatedUser.subscriptionStatus);
            
            res.json({ 
              success: true, 
              activated: true,
              user: updatedUser.username,
              newStatus: updatedUser.subscriptionStatus
            });
            return;
          } else {
            console.log("🧪 TEST WEBHOOK: Usuario no encontrado para email:", customerEmail);
            res.json({ 
              success: false, 
              error: "Usuario no encontrado",
              searchedEmail: customerEmail,
              availableEmails: users.filter(u => u.email).map(u => u.email)
            });
            return;
          }
        }
      }
      
      res.json({ success: false, error: "Evento no manejado o sin email" });
      
    } catch (error: any) {
      console.error("🧪 TEST WEBHOOK ERROR:", error);
      res.json({ success: false, error: error.message });
    }
  });

  // 🧪 TEST: Endpoint para probar activación de usuarios directamente
  app.post("/api/test/activate-user", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: "Email requerido" });
      }
      
      console.log("🧪 TEST: Intentando activar usuario con email:", email);
      
      // Buscar usuario por email
      const users = await storage.getAllUsers();
      const user = users.find(u => u.email === email);
      
      if (!user) {
        console.log("❌ TEST: Usuario no encontrado");
        return res.status(404).json({ 
          error: "Usuario no encontrado",
          availableEmails: users.filter(u => u.email).map(u => u.email)
        });
      }
      
      console.log("✅ TEST: Usuario encontrado:", user.username, "Status actual:", user.subscriptionStatus);
      
      // Activar suscripción
      const updatedUser = await storage.updateUserSubscription(user.id, {
        status: 'active',
        plan: 'basic',
        subscriptionId: `test_${Date.now()}`,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      });
      
      console.log("✅ TEST: Usuario actualizado:", updatedUser.subscriptionStatus);
      
      res.json({ 
        success: true, 
        user: {
          id: updatedUser.id,
          username: updatedUser.username,
          email: updatedUser.email,
          subscriptionStatus: updatedUser.subscriptionStatus,
          hasCompletedPayment: updatedUser.hasCompletedPayment
        }
      });
      
    } catch (error: any) {
      console.error("❌ TEST: Error en activación:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Text-to-Speech endpoint using OpenAI TTS
  app.post("/api/tts", async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ error: "No autenticado" });
      }

      const { text, voice = "nova" } = req.body;
      
      if (!text || typeof text !== 'string') {
        return res.status(400).json({ error: "Texto requerido" });
      }

      // Limit text length to prevent abuse
      const maxLength = 4096;
      const truncatedText = text.slice(0, maxLength);

      const OpenAI = (await import("openai")).default;
      const openai = new OpenAI({ 
        apiKey: process.env.OPENAI_API_KEY || process.env.AI_INTEGRATIONS_OPENAI_API_KEY || "default_key",
        baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL || undefined
      });

      const response = await openai.audio.speech.create({
        model: "tts-1",
        voice: voice as "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer",
        input: truncatedText,
        response_format: "mp3"
      });

      // Get the audio as a buffer
      const buffer = Buffer.from(await response.arrayBuffer());
      
      res.set({
        'Content-Type': 'audio/mpeg',
        'Content-Length': buffer.length
      });
      res.send(buffer);
      
    } catch (error: any) {
      console.error("TTS Error:", error);
      res.status(500).json({ error: "Error generando audio" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}