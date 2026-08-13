import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import fs from "fs";
import path from "path";
import { storage } from "./storage";
import { buildSkrillLink, sendSkrillRegistrationEmail, sendOwnerNotification, sendOwnerSMS, sendLeadWelcomeEmail, generateUnsubscribeToken, sendTrialExhaustedEmail, sendReactivationEmail, sendInstitutionEmail, sendMutuaEmail, sendEmpresaEmail } from "./emailService";
import { insertConversationSchema, insertMessageSchema, insertUserSchema, insertPartnerSchema, partnerReferrals, partners, users, partnerAdmins, partnerActivityLog, conversations, messages } from "@shared/schema";
import { emailLeads } from "@shared/schema";
import { processUserMessage } from "./prompt-handler";
import { authenticatePartner, registerPartner, generateReferralCode } from "./partner-auth";
import bcrypt from "bcrypt";
import fetch from "node-fetch";
import { db, pool } from "./db";
import { eq, and, desc, gte, count } from "drizzle-orm";
import "./types"; // Import session types
import multer from "multer";
import * as XLSX from "xlsx";

// Helper function to check if user has active subscription
async function checkSubscription(userId: number): Promise<boolean> {
  try {
    const user = await storage.getUser(userId);
    if (!user) return false;
    
    // Trial users always get access (question limit enforced separately)
    if (user.subscriptionStatus === 'trial') {
      return true;
    }

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

      // If the user has admin role, also set admin session
      if (user.role === "admin") {
        req.session.isAdmin = true;
      }

      // Update last login
      await storage.updateUserLogin(user.id);

      // Check subscription status
      const hasActiveSubscription = await checkSubscription(user.id);

      res.json({
        success: true,
        userId: user.id,
        role: user.role || "user",
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
        role: user.role || "user",
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
          message: "NUXA es aplicación de pago - Suscripción requerida",
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
          message: "NUXA es aplicación de pago - Suscripción requerida",
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
          message: "NUXA es aplicación de pago - Suscripción requerida",
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
          message: "NUXA es aplicación de pago - Suscripción requerida",
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

      // Fire-and-forget: email when trial user uses their last free question
      if (limitCheck.remaining === 0) {
        const trialUser = await storage.getUser(userId);
        if (trialUser?.email && trialUser.subscriptionStatus === "trial") {
          sendTrialExhaustedEmail({ email: trialUser.email, username: trialUser.username }).catch(() => {});
        }
      }

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

  // Sorteo - participate in monthly raffle
  // ---------------------------------------------------------------------------
  // Email Leads — captura de email en páginas públicas
  // ---------------------------------------------------------------------------
  app.post("/api/leads", async (req, res) => {
    try {
      const { email, source, consent } = req.body;
      if (!email || typeof email !== "string" || !email.includes("@")) {
        return res.status(400).json({ message: "Email válido requerido" });
      }
      if (!consent) {
        return res.status(400).json({ message: "Se requiere consentimiento" });
      }

      const normalizedEmail = email.toLowerCase().trim();

      // Si ya existe, respondemos OK sin duplicar
      const existing = await storage.getEmailLeadByEmail(normalizedEmail);
      if (existing) {
        return res.json({ message: "Ya estabas suscrito. ¡Gracias!", alreadyExists: true });
      }

      const unsubscribeToken = generateUnsubscribeToken();
      const lead = await storage.createEmailLead({
        email: normalizedEmail,
        source: source || "recursos-gratuitos",
        consentMarketing: true,
        unsubscribeToken,
      });

      // Enviar email de bienvenida en segundo plano (no bloquear la respuesta)
      sendLeadWelcomeEmail({ email: normalizedEmail, unsubscribeToken }).catch(console.error);

      res.json({ message: "¡Suscripción confirmada! Revisa tu email.", lead });
    } catch (error) {
      console.error("Error creating email lead:", error);
      res.status(500).json({ message: "Error al registrar la suscripción" });
    }
  });

  // Baja de suscripción — enlace en cada email
  app.get("/api/leads/unsubscribe", async (req, res) => {
    const { token } = req.query;
    if (!token || typeof token !== "string") {
      return res.status(400).send("Token inválido");
    }

    try {
      const lead = await storage.unsubscribeEmailLead(token);
      if (!lead) {
        return res.status(404).send(`<!DOCTYPE html>
<html lang="es"><head><meta charset="utf-8"><title>Baja - NUXA</title></head>
<body style="font-family:sans-serif;text-align:center;padding:60px 20px;background:#0f172a;color:#e2e8f0;">
  <p style="font-size:48px">🔍</p>
  <h1 style="color:#fff">Enlace no encontrado</h1>
  <p style="color:#94a3b8">Este enlace de baja no es válido o ya fue procesado.</p>
  <a href="https://nuxa.life" style="color:#10b981">Volver a NUXA</a>
</body></html>`);
      }

      res.send(`<!DOCTYPE html>
<html lang="es"><head><meta charset="utf-8"><title>Baja confirmada - NUXA</title></head>
<body style="font-family:sans-serif;text-align:center;padding:60px 20px;background:#0f172a;color:#e2e8f0;">
  <p style="font-size:48px">✅</p>
  <h1 style="color:#fff">Baja confirmada</h1>
  <p style="color:#94a3b8;max-width:400px;margin:0 auto 24px;">
    Has sido dado de baja correctamente. No recibirás más comunicaciones de NUXA en <strong style="color:#e2e8f0">${lead.email}</strong>.
  </p>
  <p style="color:#64748b;font-size:13px">Si cambias de opinión, puedes volver a suscribirte en nuestra web.</p>
  <a href="https://nuxa.life" style="display:inline-block;margin-top:24px;color:#10b981;text-decoration:none;border:1px solid #10b981;padding:10px 24px;border-radius:8px;">
    Volver a nuxa.life
  </a>
</body></html>`);
    } catch (error) {
      console.error("Error unsubscribing lead:", error);
      res.status(500).send("Error al procesar la baja");
    }
  });

  app.post("/api/sorteo", async (req, res) => {
    try {
      const { email, source } = req.body;
      if (!email || typeof email !== "string" || !email.includes("@")) {
        return res.status(400).json({ message: "Email válido requerido" });
      }

      const normalizedEmail = email.toLowerCase().trim();
      const existing = await storage.getSorteoEntryByEmail(normalizedEmail);
      
      if (existing) {
        const updated = await storage.incrementSorteoEntryCount(normalizedEmail);
        return res.json({ 
          message: `¡Participación registrada! Llevas ${updated?.entryCount || existing.entryCount + 1} visitas.`, 
          alreadyRegistered: true,
          entryCount: updated?.entryCount || existing.entryCount + 1
        });
      }

      const entry = await storage.createSorteoEntry({
        email: normalizedEmail,
        source: source || "recursos_gratuitos",
        status: "participando",
      });

      res.json({ message: "¡Te has inscrito en el sorteo!", entry, entryCount: 1 });
    } catch (error) {
      console.error("Error creating sorteo entry:", error);
      res.status(500).json({ message: "Error al registrar participación" });
    }
  });

  // Free trial registration – 2 questions, no payment required
  const TRIAL_MONTHLY_CAP = 250;

  async function countTrialUsersThisMonth(): Promise<number> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const [result] = await db
      .select({ total: count() })
      .from(users)
      .where(and(eq(users.subscriptionStatus, "trial"), gte(users.createdAt, startOfMonth)));
    return result?.total ?? 0;
  }

  // Public endpoint: check if monthly trial cap is reached
  app.get("/api/prueba-gratis/estado", async (_req, res) => {
    try {
      const used = await countTrialUsersThisMonth();
      const cap = TRIAL_MONTHLY_CAP;
      res.json({ cupoLleno: used >= cap, used, cap });
    } catch (error) {
      console.error("Error checking trial status:", error);
      res.json({ cupoLleno: false, used: 0, cap: TRIAL_MONTHLY_CAP });
    }
  });

  app.post("/api/prueba-gratis", async (req, res) => {
    try {
      const { username, email, password } = req.body;
      if (!username || !email || !password) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
      }
      if (password.length < 6) {
        return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres" });
      }
      if (!email.includes("@")) {
        return res.status(400).json({ message: "Email no válido" });
      }

      // Check monthly cap
      const trialCount = await countTrialUsersThisMonth();
      if (trialCount >= TRIAL_MONTHLY_CAP) {
        return res.status(429).json({ message: "Cupo mensual completo", cupoLleno: true });
      }

      const existing = await storage.getUserByUsername(username);
      if (existing) {
        return res.status(409).json({ message: "El nombre de usuario ya está en uso" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await storage.createUser({
        username,
        password: hashedPassword,
        email,
        subscriptionPlan: "trial",
        subscriptionStatus: "trial",
        monthlyQuestionLimit: 5,
        hasCompletedPayment: false,
      });
      req.session.userId = newUser.id;
      req.session.save((err) => {
        if (err) {
          console.error("Session save error in prueba-gratis:", err);
          return res.status(500).json({ message: "Error al guardar sesión" });
        }
        return res.json({ success: true, userId: newUser.id });
      });
    } catch (error) {
      console.error("Error in prueba-gratis:", error);
      res.status(500).json({ message: "Error al procesar la solicitud" });
    }
  });

  // Individual plan pre-registration with Skrill payment link (saved to DB, no email)
  app.post("/api/registro-individual", async (req, res) => {
    try {
      const { nombre, apellidos, email, plan } = req.body;
      if (!nombre || !apellidos || !email || !plan) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
      }
      if (!email.includes("@")) {
        return res.status(400).json({ message: "Email no válido" });
      }
      const validPlans = ["basico", "pro", "anual"];
      if (!validPlans.includes(plan)) {
        return res.status(400).json({ message: "Plan no válido" });
      }

      const skrillLink = buildSkrillLink({ nombre, apellidos, email, plan });

      await storage.createIndividualRegistration({ nombre, apellidos, email, plan, skrillLink, status: "pendiente" });

      sendOwnerNotification({ tipo: "individual", nombre, apellidos, email, plan }).catch(() => {});
      sendOwnerSMS({ tipo: "individual", nombre, apellidos, email, plan }).catch(() => {});

      return res.json({ success: true, skrillLink });
    } catch (error) {
      console.error("Error in registro-individual:", error);
      res.status(500).json({ message: "Error al procesar la solicitud" });
    }
  });

  // Mediana empresa plan registration with Skrill link
  app.post("/api/registro-empresa-media", async (req, res) => {
    try {
      const { empresa, nombre, apellidos, email, plan } = req.body;
      if (!empresa || !nombre || !apellidos || !email || !plan) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
      }
      if (!email.includes("@")) {
        return res.status(400).json({ message: "Email no válido" });
      }
      const validPlans = ["empresa_100", "empresa_200", "empresa_300"];
      if (!validPlans.includes(plan)) {
        return res.status(400).json({ message: "Plan no válido" });
      }
      const skrillLink = buildSkrillLink({ nombre, apellidos, email, plan });
      await storage.createEmpresaRegistration({ empresa, nombre, apellidos, email, plan, skrillLink, status: "pendiente" });
      sendOwnerNotification({ tipo: "empresa_media", empresa, nombre, apellidos, email, plan }).catch(() => {});
      sendOwnerSMS({ tipo: "empresa_media", empresa, nombre, apellidos, email, plan }).catch(() => {});
      return res.json({ success: true, skrillLink });
    } catch (error) {
      console.error("Error in registro-empresa-media:", error);
      res.status(500).json({ message: "Error al procesar la solicitud" });
    }
  });

  // Empresa licitacion registration (saved to DB)
  app.post("/api/registro-empresa", async (req, res) => {
    try {
      const { empresa, nombre, apellidos, email } = req.body;
      if (!empresa || !nombre || !apellidos || !email) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
      }
      if (!email.includes("@")) {
        return res.status(400).json({ message: "Email no válido" });
      }

      const licitacionUrl = "https://jobda.org/nuxa-licencias";
      await storage.createEmpresaRegistration({ empresa, nombre, apellidos, email, plan: "licitacion", skrillLink: licitacionUrl, status: "pendiente" });

      sendOwnerNotification({ tipo: "licitacion", empresa, nombre, apellidos, email, plan: "licitacion" }).catch(() => {});
      sendOwnerSMS({ tipo: "licitacion", empresa, nombre, apellidos, email, plan: "licitacion" }).catch(() => {});

      return res.json({ success: true });
    } catch (error) {
      console.error("Error in registro-empresa:", error);
      res.status(500).json({ message: "Error al procesar la solicitud" });
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

  // Admin login (both endpoints for compatibility)
  const adminLoginHandler = async (req: any, res: any) => {
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
  };
  
  app.post("/api/admin/login", adminLoginHandler);
  app.post("/api/admin/auth", adminLoginHandler);

  // Admin stats
  // Check admin session status (public, returns boolean)
  app.get("/api/admin/check", (req, res) => {
    res.json({ isAdmin: !!req.session.isAdmin });
  });

  // ===== EMAIL DOMAIN STATUS =====
  app.get("/api/admin/resend-domain-status", async (req, res) => {
    if (!req.session.isAdmin) return res.status(401).json({ message: "No autorizado" });
    try {
      const apiKey = process.env.RESEND_API_KEY;
      if (!apiKey) return res.json({ verified: false, status: "no_key" });
      const r = await fetch("https://api.resend.com/domains", {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      const data = await r.json() as any;
      // API key is restricted to sending only — can't list domains
      if (data?.statusCode === 401 || data?.name === "restricted_api_key") {
        return res.json({ verified: true, status: "assumed_verified" });
      }
      const domains: any[] = data?.data ?? [];
      const nuxa = domains.find((d: any) =>
        d.name === "nuxa.life" || d.name?.endsWith(".nuxa.life")
      );
      if (!nuxa) return res.json({ verified: false, status: "not_added" });
      res.json({ verified: nuxa.status === "verified", status: nuxa.status, name: nuxa.name });
    } catch (e) {
      res.json({ verified: false, status: "error" });
    }
  });

  // ===== INSTITUCIONES =====

  // List all institutions
  app.get("/api/admin/institutions", async (req, res) => {
    if (!req.session.isAdmin) return res.status(401).json({ message: "No autorizado" });
    try {
      const r = await pool.query(`
        SELECT ic.*, COUNT(iet.id)::int AS campaigns_sent
        FROM institution_contacts ic
        LEFT JOIN institution_email_tracking iet ON iet.contact_email = ic.email
        GROUP BY ic.id
        ORDER BY ic.region, ic.email
      `);
      res.json(r.rows);
    } catch (e: any) { console.error("institutions endpoint error:", e?.message); res.status(500).json({ message: "Error" }); }
  });

  // Add institution
  app.post("/api/admin/institutions", async (req, res) => {
    if (!req.session.isAdmin) return res.status(401).json({ message: "No autorizado" });
    const { email, region, name } = req.body;
    if (!email || !email.includes("@")) return res.status(400).json({ message: "Email inválido" });
    try {
      const r = await pool.query(
        "INSERT INTO institution_contacts (email, region, name) VALUES ($1, $2, $3) ON CONFLICT (email) DO NOTHING RETURNING *",
        [email.toLowerCase().trim(), region || null, name || null]
      );
      if (r.rows.length === 0) return res.status(409).json({ message: "Email ya existe" });
      res.json(r.rows[0]);
    } catch (e) { res.status(500).json({ message: "Error" }); }
  });

  // Delete institution
  app.delete("/api/admin/institutions/:id", async (req, res) => {
    if (!req.session.isAdmin) return res.status(401).json({ message: "No autorizado" });
    try {
      await pool.query("DELETE FROM institution_contacts WHERE id = $1", [parseInt(req.params.id)]);
      res.json({ ok: true });
    } catch (e) { res.status(500).json({ message: "Error" }); }
  });

  // ---- Internal helper: execute a campaign send ----
  async function executeCampaignSend(campaignId: number, subject: string, body: string, contacts: any[], subjectB?: string) {
    let sent = 0, failed = 0;
    const half = subjectB ? Math.ceil(contacts.length / 2) : contacts.length;
    for (let i = 0; i < contacts.length; i++) {
      const contact = contacts[i];
      const variant = (subjectB && i >= half) ? "b" : "a";
      const usedSubject = variant === "b" && subjectB ? subjectB : subject;
      const result = await sendInstitutionEmail({ email: contact.email, subject: usedSubject, body, institutionId: contact.id, campaignId });
      if (result.ok) {
        sent++;
        await pool.query(
          "INSERT INTO institution_email_tracking (campaign_id, contact_email, resend_message_id, subject_variant) VALUES ($1,$2,$3,$4)",
          [campaignId, contact.email, result.messageId || null, variant]
        ).catch(() => {});
      } else {
        failed++;
      }
      await new Promise(resolve => setTimeout(resolve, 150));
    }
    // Owner copy
    await sendInstitutionEmail({ email: "rmportbou@gmail.com", subject: `[COPIA] ${subject}`, body, institutionId: 0, campaignId }).catch(() => {});
    await pool.query(
      "UPDATE institution_campaign_history SET sent_count=$1, failed_count=$2, status='sent', sent_at=NOW() WHERE id=$3",
      [sent, failed, campaignId]
    );
    console.log(`Campaign #${campaignId}: sent=${sent} failed=${failed}`);
  }

  // Send institution campaign
  app.post("/api/admin/send-institution-campaign", async (req, res) => {
    if (!req.session.isAdmin) return res.status(401).json({ message: "No autorizado" });
    const { subject, body, regions, scheduledAt, subjectB } = req.body;
    if (!subject || !body) return res.status(400).json({ message: "Subject y body requeridos" });
    try {
      let query = "SELECT * FROM institution_contacts WHERE opted_out = false";
      const params: any[] = [];
      if (Array.isArray(regions) && regions.length > 0) {
        query += ` AND region = ANY($1)`;
        params.push(regions);
      }
      query += " ORDER BY id";
      const r = await pool.query(query, params);
      const contacts = r.rows;

      const regionsStr = (Array.isArray(regions) && regions.length > 0) ? regions.join(", ") : null;
      const scheduledDate = scheduledAt ? new Date(scheduledAt) : null;
      const isScheduled = scheduledDate && scheduledDate > new Date();

      const campaignRow = await pool.query(
        `INSERT INTO institution_campaign_history
         (subject, subject_b, body, sent_count, failed_count, regions_filter, scheduled_at, status)
         VALUES ($1,$2,$3,0,0,$4,$5,$6) RETURNING id`,
        [subject, subjectB || null, body, regionsStr, scheduledDate, isScheduled ? "scheduled" : "sent"]
      );
      const campaignId: number = campaignRow.rows[0].id;

      if (isScheduled) {
        const delay = scheduledDate!.getTime() - Date.now();
        setTimeout(() => executeCampaignSend(campaignId, subject, body, contacts, subjectB || undefined), delay);
        res.json({ scheduled: true, campaignId, scheduledAt: scheduledDate, recipients: contacts.length });
      } else {
        res.json({ sending: true, campaignId, recipients: contacts.length });
        // Send async after responding
        setImmediate(() => executeCampaignSend(campaignId, subject, body, contacts, subjectB || undefined));
      }
    } catch (e) {
      console.error("send-institution-campaign error:", e);
      res.status(500).json({ message: "Error" });
    }
  });

  // Update institution contact (type, region, name)
  app.patch("/api/admin/institutions/:id", async (req, res) => {
    if (!req.session.isAdmin) return res.status(401).json({ message: "No autorizado" });
    const { contact_type, region, name } = req.body;
    try {
      const r = await pool.query(
        "UPDATE institution_contacts SET contact_type=COALESCE($1,contact_type), region=COALESCE($2,region), name=COALESCE($3,name) WHERE id=$4 RETURNING *",
        [contact_type ?? null, region ?? null, name ?? null, parseInt(req.params.id)]
      );
      res.json(r.rows[0]);
    } catch (e) { res.status(500).json({ message: "Error" }); }
  });

  // Contact send history
  app.get("/api/admin/institutions/:id/history", async (req, res) => {
    if (!req.session.isAdmin) return res.status(401).json({ message: "No autorizado" });
    try {
      const contact = await pool.query("SELECT email FROM institution_contacts WHERE id=$1", [parseInt(req.params.id)]);
      if (contact.rows.length === 0) return res.status(404).json({ message: "No encontrado" });
      const email = contact.rows[0].email;
      const r = await pool.query(`
        SELECT iet.subject_variant, iet.opened_at, iet.resend_message_id,
               ich.subject, ich.sent_at, ich.id AS campaign_id
        FROM institution_email_tracking iet
        JOIN institution_campaign_history ich ON iet.campaign_id = ich.id
        WHERE iet.contact_email = $1
        ORDER BY ich.sent_at DESC
      `, [email]);
      res.json(r.rows);
    } catch (e) { res.status(500).json({ message: "Error" }); }
  });

  // Export institutions CSV
  app.get("/api/admin/institutions/export-csv", async (req, res) => {
    if (!req.session.isAdmin) return res.status(401).json({ message: "No autorizado" });
    try {
      const r = await pool.query("SELECT email, name, region, contact_type, opted_out, created_at FROM institution_contacts ORDER BY region, email");
      const lines = ["email,nombre,región,tipo,estado,alta"];
      for (const row of r.rows) {
        lines.push([
          row.email, row.name || "", row.region || "", row.contact_type || "",
          row.opted_out ? "baja" : "activo",
          row.created_at ? new Date(row.created_at).toISOString().split("T")[0] : ""
        ].map(v => `"${v}"`).join(","));
      }
      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader("Content-Disposition", `attachment; filename="instituciones-nuxa-${new Date().toISOString().split("T")[0]}.csv"`);
      res.send("\uFEFF" + lines.join("\n")); // BOM for Excel
    } catch (e) { res.status(500).json({ message: "Error" }); }
  });

  // Templates CRUD
  app.get("/api/admin/institution-templates", async (req, res) => {
    if (!req.session.isAdmin) return res.status(401).json({ message: "No autorizado" });
    try {
      const r = await pool.query("SELECT * FROM institution_email_templates ORDER BY created_at DESC");
      res.json(r.rows);
    } catch (e) { res.status(500).json({ message: "Error" }); }
  });

  app.post("/api/admin/institution-templates", async (req, res) => {
    if (!req.session.isAdmin) return res.status(401).json({ message: "No autorizado" });
    const { name, subject, body } = req.body;
    if (!name || !subject || !body) return res.status(400).json({ message: "Faltan campos" });
    try {
      const r = await pool.query(
        "INSERT INTO institution_email_templates (name, subject, body) VALUES ($1,$2,$3) RETURNING *",
        [name, subject, body]
      );
      res.json(r.rows[0]);
    } catch (e) { res.status(500).json({ message: "Error" }); }
  });

  app.delete("/api/admin/institution-templates/:id", async (req, res) => {
    if (!req.session.isAdmin) return res.status(401).json({ message: "No autorizado" });
    try {
      await pool.query("DELETE FROM institution_email_templates WHERE id=$1", [parseInt(req.params.id)]);
      res.json({ ok: true });
    } catch (e) { res.status(500).json({ message: "Error" }); }
  });

  // Campaign history
  app.get("/api/admin/institution-campaign-history", async (req, res) => {
    if (!req.session.isAdmin) return res.status(401).json({ message: "No autorizado" });
    try {
      const r = await pool.query(
        "SELECT * FROM institution_campaign_history ORDER BY sent_at DESC LIMIT 20"
      );
      res.json(r.rows);
    } catch (e) { res.status(500).json({ message: "Error" }); }
  });

  // Import institutions from CSV
  app.post("/api/admin/institutions/import-csv", async (req, res) => {
    if (!req.session.isAdmin) return res.status(401).json({ message: "No autorizado" });
    const { rows } = req.body as { rows: { email: string; name?: string; region?: string }[] };
    if (!Array.isArray(rows) || rows.length === 0) return res.status(400).json({ message: "Sin filas" });
    let imported = 0, skipped = 0;
    for (const row of rows) {
      if (!row.email || !row.email.includes("@")) { skipped++; continue; }
      try {
        const r = await pool.query(
          "INSERT INTO institution_contacts (email, name, region) VALUES ($1, $2, $3) ON CONFLICT (email) DO NOTHING RETURNING id",
          [row.email.toLowerCase().trim(), row.name || null, row.region || null]
        );
        if (r.rows.length > 0) imported++; else skipped++;
      } catch { skipped++; }
    }
    res.json({ imported, skipped });
  });

  // Resend webhook — open/click tracking (public, no admin check)
  app.post("/api/webhooks/resend", async (req, res) => {
    try {
      const event = req.body;
      if (event?.type === "email.opened" && event?.data?.tags) {
        const campaignTag = event.data.tags.find((t: any) => t.name === "campaign_id");
        if (campaignTag?.value) {
          const raw: string = campaignTag.value;
          const email = event.data?.to?.[0] || null;
          let historyTable: string;
          let trackingTable: string;
          let numericId: number;
          if (raw.startsWith("m")) {
            historyTable = "mutua_campaign_history";
            trackingTable = "mutua_email_tracking";
            numericId = parseInt(raw.slice(1), 10);
          } else if (raw.startsWith("e")) {
            historyTable = "empresa_campaign_history";
            trackingTable = "empresa_email_tracking";
            numericId = parseInt(raw.slice(1), 10);
          } else {
            historyTable = "institution_campaign_history";
            trackingTable = "institution_email_tracking";
            numericId = parseInt(raw, 10);
          }
          if (!isNaN(numericId)) {
            await pool.query(
              `UPDATE ${historyTable} SET opens = opens + 1 WHERE id = $1`,
              [numericId]
            );
            if (email) {
              await pool.query(
                `UPDATE ${trackingTable} SET opened_at = NOW() WHERE campaign_id = $1 AND contact_email = $2 AND opened_at IS NULL`,
                [numericId, email]
              ).catch(() => {});
            }
          }
        }
      }
      res.json({ ok: true });
    } catch (e) {
      res.json({ ok: true }); // Always return 200 to Resend
    }
  });

  // Unsubscribe institution (one-click)
  app.get("/api/unsubscribe-institution", async (req, res) => {
    try {
      const uid = req.query.uid as string;
      if (!uid) return res.status(400).send("Token inválido");
      const id = parseInt(Buffer.from(uid, "base64url").toString(), 10);
      if (isNaN(id)) return res.status(400).send("Token inválido");
      await pool.query("UPDATE institution_contacts SET opted_out = true, opted_out_at = NOW() WHERE id = $1", [id]);
      res.send(`<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Baja confirmada – NUXA</title>
<style>body{margin:0;font-family:'Segoe UI',sans-serif;background:#eff6ff;display:flex;align-items:center;justify-content:center;min-height:100vh;}
.box{background:#fff;border-radius:20px;padding:48px 40px;max-width:400px;text-align:center;box-shadow:0 4px 24px rgba(0,0,0,.08);}
h1{color:#1d4ed8;font-size:22px;margin:0 0 12px;}p{color:#4b5563;font-size:15px;line-height:1.6;}a{color:#3b82f6;}</style></head>
<body><div class="box"><p style="font-size:36px;margin:0 0 16px">✅</p>
<h1>Baja registrada</h1><p>Su organización no volverá a recibir comunicaciones de NUXA.<br>Si en el futuro desea conocer nuestros servicios, puede contactarnos en <a href="https://nuxa.life">nuxa.life</a>.</p></div></body></html>`);
    } catch (e) { res.status(500).send("Error"); }
  });

  // ===== MUTUAS =====

  app.get("/api/admin/mutuas", async (req, res) => {
    if (!req.session.isAdmin) return res.status(401).json({ message: "No autorizado" });
    try {
      const r = await pool.query(`
        SELECT mc.*, COUNT(met.id)::int AS campaigns_sent
        FROM mutua_contacts mc
        LEFT JOIN mutua_email_tracking met ON met.contact_email = mc.email
        GROUP BY mc.id ORDER BY mc.region, mc.email
      `);
      res.json(r.rows);
    } catch (e: any) { res.status(500).json({ message: "Error" }); }
  });

  app.post("/api/admin/mutuas", async (req, res) => {
    if (!req.session.isAdmin) return res.status(401).json({ message: "No autorizado" });
    const { email, region, name } = req.body;
    if (!email || !email.includes("@")) return res.status(400).json({ message: "Email inválido" });
    try {
      const r = await pool.query(
        "INSERT INTO mutua_contacts (email, region, name) VALUES ($1, $2, $3) ON CONFLICT (email) DO NOTHING RETURNING *",
        [email.toLowerCase().trim(), region || null, name || null]
      );
      if (r.rows.length === 0) return res.status(409).json({ message: "Email ya existe" });
      res.json(r.rows[0]);
    } catch (e) { res.status(500).json({ message: "Error" }); }
  });

  app.delete("/api/admin/mutuas/:id", async (req, res) => {
    if (!req.session.isAdmin) return res.status(401).json({ message: "No autorizado" });
    try {
      await pool.query("DELETE FROM mutua_contacts WHERE id = $1", [parseInt(req.params.id)]);
      res.json({ ok: true });
    } catch (e) { res.status(500).json({ message: "Error" }); }
  });

  app.patch("/api/admin/mutuas/:id", async (req, res) => {
    if (!req.session.isAdmin) return res.status(401).json({ message: "No autorizado" });
    const { contact_type, region, name } = req.body;
    try {
      const r = await pool.query(
        "UPDATE mutua_contacts SET contact_type=COALESCE($1,contact_type), region=COALESCE($2,region), name=COALESCE($3,name) WHERE id=$4 RETURNING *",
        [contact_type ?? null, region ?? null, name ?? null, parseInt(req.params.id)]
      );
      res.json(r.rows[0]);
    } catch (e) { res.status(500).json({ message: "Error" }); }
  });

  app.get("/api/admin/mutuas/:id/history", async (req, res) => {
    if (!req.session.isAdmin) return res.status(401).json({ message: "No autorizado" });
    try {
      const contact = await pool.query("SELECT email FROM mutua_contacts WHERE id=$1", [parseInt(req.params.id)]);
      if (contact.rows.length === 0) return res.status(404).json({ message: "No encontrado" });
      const email = contact.rows[0].email;
      const r = await pool.query(`
        SELECT met.subject_variant, met.opened_at, met.resend_message_id,
               mch.subject, mch.sent_at, mch.id AS campaign_id
        FROM mutua_email_tracking met
        JOIN mutua_campaign_history mch ON met.campaign_id = mch.id
        WHERE met.contact_email = $1 ORDER BY mch.sent_at DESC
      `, [email]);
      res.json(r.rows);
    } catch (e) { res.status(500).json({ message: "Error" }); }
  });

  app.get("/api/admin/mutuas/export-csv", async (req, res) => {
    if (!req.session.isAdmin) return res.status(401).json({ message: "No autorizado" });
    try {
      const r = await pool.query("SELECT email, name, region, contact_type, opted_out, created_at FROM mutua_contacts ORDER BY region, email");
      const lines = ["email,nombre,mutua,tipo,estado,alta"];
      for (const row of r.rows) {
        lines.push([row.email, row.name || "", row.region || "", row.contact_type || "",
          row.opted_out ? "baja" : "activo",
          row.created_at ? new Date(row.created_at).toISOString().split("T")[0] : ""
        ].map(v => `"${v}"`).join(","));
      }
      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader("Content-Disposition", `attachment; filename="mutuas-nuxa-${new Date().toISOString().split("T")[0]}.csv"`);
      res.send("\uFEFF" + lines.join("\n"));
    } catch (e) { res.status(500).json({ message: "Error" }); }
  });

  async function executeMutuaCampaignSend(campaignId: number, subject: string, body: string, contacts: any[], subjectB?: string) {
    let sent = 0, failed = 0;
    const half = subjectB ? Math.ceil(contacts.length / 2) : contacts.length;
    for (let i = 0; i < contacts.length; i++) {
      const contact = contacts[i];
      const variant = (subjectB && i >= half) ? "b" : "a";
      const usedSubject = variant === "b" && subjectB ? subjectB : subject;
      const result = await sendMutuaEmail({ email: contact.email, subject: usedSubject, body, mutuaId: contact.id, campaignId });
      if (result.ok) {
        sent++;
        await pool.query(
          "INSERT INTO mutua_email_tracking (campaign_id, contact_email, resend_message_id, subject_variant) VALUES ($1,$2,$3,$4)",
          [campaignId, contact.email, result.messageId || null, variant]
        ).catch(() => {});
      } else { failed++; }
      await new Promise(resolve => setTimeout(resolve, 150));
    }
    await sendMutuaEmail({ email: "rmportbou@gmail.com", subject: `[COPIA] ${subject}`, body, mutuaId: 0, campaignId }).catch(() => {});
    await pool.query(
      "UPDATE mutua_campaign_history SET sent_count=$1, failed_count=$2, status='sent', sent_at=NOW() WHERE id=$3",
      [sent, failed, campaignId]
    );
    console.log(`Mutua campaign #${campaignId}: sent=${sent} failed=${failed}`);
  }

  app.post("/api/admin/send-mutua-campaign", async (req, res) => {
    if (!req.session.isAdmin) return res.status(401).json({ message: "No autorizado" });
    const { subject, body, regions, scheduledAt, subjectB } = req.body;
    if (!subject || !body) return res.status(400).json({ message: "Subject y body requeridos" });
    try {
      let query = "SELECT * FROM mutua_contacts WHERE opted_out = false";
      const params: any[] = [];
      if (Array.isArray(regions) && regions.length > 0) { query += ` AND region = ANY($1)`; params.push(regions); }
      query += " ORDER BY id";
      const r = await pool.query(query, params);
      const contacts = r.rows;
      const regionsStr = (Array.isArray(regions) && regions.length > 0) ? regions.join(", ") : null;
      const scheduledDate = scheduledAt ? new Date(scheduledAt) : null;
      const isScheduled = scheduledDate && scheduledDate > new Date();
      const campaignRow = await pool.query(
        `INSERT INTO mutua_campaign_history (subject, subject_b, body, sent_count, failed_count, regions_filter, scheduled_at, status)
         VALUES ($1,$2,$3,0,0,$4,$5,$6) RETURNING id`,
        [subject, subjectB || null, body, regionsStr, scheduledDate, isScheduled ? "scheduled" : "sent"]
      );
      const campaignId: number = campaignRow.rows[0].id;
      if (isScheduled) {
        const delay = scheduledDate!.getTime() - Date.now();
        setTimeout(() => executeMutuaCampaignSend(campaignId, subject, body, contacts, subjectB || undefined), delay);
        res.json({ scheduled: true, campaignId, scheduledAt: scheduledDate, recipients: contacts.length });
      } else {
        res.json({ sending: true, campaignId, recipients: contacts.length });
        setImmediate(() => executeMutuaCampaignSend(campaignId, subject, body, contacts, subjectB || undefined));
      }
    } catch (e) { console.error("send-mutua-campaign error:", e); res.status(500).json({ message: "Error" }); }
  });

  app.post("/api/admin/mutuas/import-csv", async (req, res) => {
    if (!req.session.isAdmin) return res.status(401).json({ message: "No autorizado" });
    const { rows } = req.body as { rows: { email: string; name?: string; region?: string }[] };
    if (!Array.isArray(rows) || rows.length === 0) return res.status(400).json({ message: "Sin filas" });
    let imported = 0, skipped = 0;
    for (const row of rows) {
      if (!row.email || !row.email.includes("@")) { skipped++; continue; }
      try {
        const r = await pool.query(
          "INSERT INTO mutua_contacts (email, name, region) VALUES ($1, $2, $3) ON CONFLICT (email) DO NOTHING RETURNING id",
          [row.email.toLowerCase().trim(), row.name || null, row.region || null]
        );
        if (r.rows.length > 0) imported++; else skipped++;
      } catch { skipped++; }
    }
    res.json({ imported, skipped });
  });

  app.get("/api/admin/mutua-templates", async (req, res) => {
    if (!req.session.isAdmin) return res.status(401).json({ message: "No autorizado" });
    try { const r = await pool.query("SELECT * FROM mutua_email_templates ORDER BY created_at DESC"); res.json(r.rows); }
    catch (e) { res.status(500).json({ message: "Error" }); }
  });

  app.post("/api/admin/mutua-templates", async (req, res) => {
    if (!req.session.isAdmin) return res.status(401).json({ message: "No autorizado" });
    const { name, subject, body } = req.body;
    if (!name || !subject || !body) return res.status(400).json({ message: "Faltan campos" });
    try {
      const r = await pool.query("INSERT INTO mutua_email_templates (name, subject, body) VALUES ($1,$2,$3) RETURNING *", [name, subject, body]);
      res.json(r.rows[0]);
    } catch (e) { res.status(500).json({ message: "Error" }); }
  });

  app.delete("/api/admin/mutua-templates/:id", async (req, res) => {
    if (!req.session.isAdmin) return res.status(401).json({ message: "No autorizado" });
    try { await pool.query("DELETE FROM mutua_email_templates WHERE id=$1", [parseInt(req.params.id)]); res.json({ ok: true }); }
    catch (e) { res.status(500).json({ message: "Error" }); }
  });

  app.get("/api/admin/mutua-campaign-history", async (req, res) => {
    if (!req.session.isAdmin) return res.status(401).json({ message: "No autorizado" });
    try {
      const r = await pool.query("SELECT * FROM mutua_campaign_history ORDER BY sent_at DESC LIMIT 20");
      res.json(r.rows);
    } catch (e) { res.status(500).json({ message: "Error" }); }
  });

  app.get("/api/unsubscribe-mutua", async (req, res) => {
    try {
      const uid = req.query.uid as string;
      if (!uid) return res.status(400).send("Token inválido");
      const id = parseInt(Buffer.from(uid, "base64url").toString(), 10);
      if (isNaN(id)) return res.status(400).send("Token inválido");
      await pool.query("UPDATE mutua_contacts SET opted_out = true, opted_out_at = NOW() WHERE id = $1", [id]);
      res.send(`<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Baja confirmada – NUXA</title>
<style>body{margin:0;font-family:'Segoe UI',sans-serif;background:#eff6ff;display:flex;align-items:center;justify-content:center;min-height:100vh;}
.box{background:#fff;border-radius:20px;padding:48px 40px;max-width:400px;text-align:center;box-shadow:0 4px 24px rgba(0,0,0,.08);}
h1{color:#1d4ed8;font-size:22px;margin:0 0 12px;}p{color:#4b5563;font-size:15px;line-height:1.6;}a{color:#3b82f6;}</style></head>
<body><div class="box"><p style="font-size:36px;margin:0 0 16px">✅</p>
<h1>Baja registrada</h1><p>Su mutua no volverá a recibir comunicaciones de NUXA.<br>Si en el futuro desea conocer nuestros servicios, puede contactarnos en <a href="https://nuxa.life">nuxa.life</a>.</p></div></body></html>`);
    } catch (e) { res.status(500).send("Error"); }
  });

  // ===== TEST BIENESTAR & CALCULADORA BURNOUT =====

  app.post("/api/test-bienestar/submit", async (req, res) => {
    const { email, phq9Score, gad7Score } = req.body;
    try {
      await pool.query(
        "INSERT INTO wellness_test_leads (email, phq9_score, gad7_score) VALUES ($1, $2, $3)",
        [email || null, phq9Score ?? null, gad7Score ?? null]
      );
    } catch {}
    res.json({ ok: true });
  });

  app.post("/api/calculadora-burnout/lead", async (req, res) => {
    const { email, empleados, salario, sector, totalCoste } = req.body;
    if (!email || !email.includes("@")) return res.status(400).json({ message: "Email inválido" });
    try {
      await pool.query(
        "INSERT INTO burnout_calculator_leads (email, empleados, salario, sector, total_coste) VALUES ($1,$2,$3,$4,$5)",
        [email, empleados || null, salario || null, sector || null, totalCoste || null]
      );
    } catch {}
    res.json({ ok: true });
  });

  // ===== GRANDES EMPRESAS =====

  app.get("/api/admin/empresas", async (req, res) => {
    if (!req.session.isAdmin) return res.status(401).json({ message: "No autorizado" });
    try {
      const r = await pool.query(`
        SELECT ec.*, COUNT(eet.id)::int AS campaigns_sent
        FROM empresa_contacts ec
        LEFT JOIN empresa_email_tracking eet ON eet.contact_email = ec.email
        GROUP BY ec.id ORDER BY ec.company, ec.email
      `);
      res.json(r.rows);
    } catch { res.status(500).json({ message: "Error" }); }
  });

  app.post("/api/admin/empresas", async (req, res) => {
    if (!req.session.isAdmin) return res.status(401).json({ message: "No autorizado" });
    const { email, company, name } = req.body;
    if (!email || !email.includes("@")) return res.status(400).json({ message: "Email inválido" });
    try {
      const r = await pool.query(
        "INSERT INTO empresa_contacts (email, company, name) VALUES ($1, $2, $3) ON CONFLICT (email) DO NOTHING RETURNING *",
        [email.toLowerCase().trim(), company || null, name || null]
      );
      if (r.rows.length === 0) return res.status(409).json({ message: "Email ya existe" });
      res.json(r.rows[0]);
    } catch { res.status(500).json({ message: "Error" }); }
  });

  app.delete("/api/admin/empresas/:id", async (req, res) => {
    if (!req.session.isAdmin) return res.status(401).json({ message: "No autorizado" });
    try {
      await pool.query("DELETE FROM empresa_contacts WHERE id = $1", [parseInt(req.params.id)]);
      res.json({ ok: true });
    } catch { res.status(500).json({ message: "Error" }); }
  });

  app.get("/api/admin/empresas/:id/history", async (req, res) => {
    if (!req.session.isAdmin) return res.status(401).json({ message: "No autorizado" });
    try {
      const contact = await pool.query("SELECT email FROM empresa_contacts WHERE id=$1", [parseInt(req.params.id)]);
      if (contact.rows.length === 0) return res.status(404).json({ message: "No encontrado" });
      const r = await pool.query(`
        SELECT eet.subject_variant, eet.opened_at, eet.resend_message_id,
               ech.subject, ech.sent_at, ech.id AS campaign_id
        FROM empresa_email_tracking eet
        JOIN empresa_campaign_history ech ON eet.campaign_id = ech.id
        WHERE eet.contact_email = $1 ORDER BY ech.sent_at DESC
      `, [contact.rows[0].email]);
      res.json(r.rows);
    } catch { res.status(500).json({ message: "Error" }); }
  });

  app.get("/api/admin/empresas/export-csv", async (req, res) => {
    if (!req.session.isAdmin) return res.status(401).json({ message: "No autorizado" });
    try {
      const r = await pool.query("SELECT email, name, company, opted_out, created_at FROM empresa_contacts ORDER BY company, email");
      const lines = ["email,nombre,empresa,estado,alta"];
      for (const row of r.rows) {
        lines.push([row.email, row.name || "", row.company || "",
          row.opted_out ? "baja" : "activo",
          row.created_at ? new Date(row.created_at).toISOString().split("T")[0] : ""
        ].map(v => `"${v}"`).join(","));
      }
      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader("Content-Disposition", `attachment; filename="empresas-nuxa-${new Date().toISOString().split("T")[0]}.csv"`);
      res.send("\uFEFF" + lines.join("\n"));
    } catch { res.status(500).json({ message: "Error" }); }
  });

  async function executeEmpresaCampaignSend(campaignId: number, subject: string, body: string, contacts: any[], subjectB?: string) {
    let sent = 0, failed = 0;
    const half = subjectB ? Math.ceil(contacts.length / 2) : contacts.length;
    for (let i = 0; i < contacts.length; i++) {
      const contact = contacts[i];
      const variant = (subjectB && i >= half) ? "b" : "a";
      const usedSubject = variant === "b" && subjectB ? subjectB : subject;
      const result = await sendEmpresaEmail({ email: contact.email, subject: usedSubject, body, empresaId: contact.id, campaignId });
      if (result.ok) {
        sent++;
        await pool.query(
          "INSERT INTO empresa_email_tracking (campaign_id, contact_email, resend_message_id, subject_variant) VALUES ($1,$2,$3,$4)",
          [campaignId, contact.email, result.messageId || null, variant]
        ).catch(() => {});
      } else { failed++; }
      await new Promise(resolve => setTimeout(resolve, 150));
    }
    await sendEmpresaEmail({ email: "rmportbou@gmail.com", subject: `[COPIA] ${subject}`, body, empresaId: 0, campaignId }).catch(() => {});
    await pool.query(
      "UPDATE empresa_campaign_history SET sent_count=$1, failed_count=$2, status='sent', sent_at=NOW() WHERE id=$3",
      [sent, failed, campaignId]
    );
    console.log(`Empresa campaign #${campaignId}: sent=${sent} failed=${failed}`);
  }

  app.post("/api/admin/send-empresa-campaign", async (req, res) => {
    if (!req.session.isAdmin) return res.status(401).json({ message: "No autorizado" });
    const { subject, body, companies, scheduledAt, subjectB } = req.body;
    if (!subject || !body) return res.status(400).json({ message: "Subject y body requeridos" });
    try {
      let query = "SELECT * FROM empresa_contacts WHERE opted_out = false";
      const params: any[] = [];
      if (Array.isArray(companies) && companies.length > 0) { query += ` AND company = ANY($1)`; params.push(companies); }
      query += " ORDER BY id";
      const r = await pool.query(query, params);
      const contacts = r.rows;
      const companiesStr = (Array.isArray(companies) && companies.length > 0) ? companies.join(", ") : null;
      const scheduledDate = scheduledAt ? new Date(scheduledAt) : null;
      const isScheduled = scheduledDate && scheduledDate > new Date();
      const campaignRow = await pool.query(
        `INSERT INTO empresa_campaign_history (subject, subject_b, body, sent_count, failed_count, companies_filter, scheduled_at, status)
         VALUES ($1,$2,$3,0,0,$4,$5,$6) RETURNING id`,
        [subject, subjectB || null, body, companiesStr, scheduledDate, isScheduled ? "scheduled" : "sent"]
      );
      const campaignId: number = campaignRow.rows[0].id;
      if (isScheduled) {
        const delay = scheduledDate!.getTime() - Date.now();
        setTimeout(() => executeEmpresaCampaignSend(campaignId, subject, body, contacts, subjectB || undefined), delay);
        res.json({ scheduled: true, campaignId, scheduledAt: scheduledDate, recipients: contacts.length });
      } else {
        res.json({ sending: true, campaignId, recipients: contacts.length });
        setImmediate(() => executeEmpresaCampaignSend(campaignId, subject, body, contacts, subjectB || undefined));
      }
    } catch (e) { console.error("send-empresa-campaign error:", e); res.status(500).json({ message: "Error" }); }
  });

  app.post("/api/admin/empresas/import-csv", async (req, res) => {
    if (!req.session.isAdmin) return res.status(401).json({ message: "No autorizado" });
    const { rows } = req.body as { rows: { email: string; name?: string; company?: string }[] };
    if (!Array.isArray(rows) || rows.length === 0) return res.status(400).json({ message: "Sin filas" });
    let imported = 0, skipped = 0;
    for (const row of rows) {
      if (!row.email || !row.email.includes("@")) { skipped++; continue; }
      try {
        const r = await pool.query(
          "INSERT INTO empresa_contacts (email, name, company) VALUES ($1, $2, $3) ON CONFLICT (email) DO NOTHING RETURNING id",
          [row.email.toLowerCase().trim(), row.name || null, row.company || null]
        );
        if (r.rows.length > 0) imported++; else skipped++;
      } catch { skipped++; }
    }
    res.json({ imported, skipped });
  });

  app.get("/api/admin/empresa-templates", async (req, res) => {
    if (!req.session.isAdmin) return res.status(401).json({ message: "No autorizado" });
    try { const r = await pool.query("SELECT * FROM empresa_email_templates ORDER BY created_at DESC"); res.json(r.rows); }
    catch { res.status(500).json({ message: "Error" }); }
  });

  app.post("/api/admin/empresa-templates", async (req, res) => {
    if (!req.session.isAdmin) return res.status(401).json({ message: "No autorizado" });
    const { name, subject, body } = req.body;
    if (!name || !subject || !body) return res.status(400).json({ message: "Faltan campos" });
    try {
      const r = await pool.query("INSERT INTO empresa_email_templates (name, subject, body) VALUES ($1,$2,$3) RETURNING *", [name, subject, body]);
      res.json(r.rows[0]);
    } catch { res.status(500).json({ message: "Error" }); }
  });

  app.delete("/api/admin/empresa-templates/:id", async (req, res) => {
    if (!req.session.isAdmin) return res.status(401).json({ message: "No autorizado" });
    try { await pool.query("DELETE FROM empresa_email_templates WHERE id=$1", [parseInt(req.params.id)]); res.json({ ok: true }); }
    catch { res.status(500).json({ message: "Error" }); }
  });

  app.get("/api/admin/empresa-campaign-history", async (req, res) => {
    if (!req.session.isAdmin) return res.status(401).json({ message: "No autorizado" });
    try {
      const r = await pool.query("SELECT * FROM empresa_campaign_history ORDER BY sent_at DESC LIMIT 20");
      res.json(r.rows);
    } catch { res.status(500).json({ message: "Error" }); }
  });

  app.get("/api/unsubscribe-empresa", async (req, res) => {
    try {
      const uid = req.query.uid as string;
      if (!uid) return res.status(400).send("Token inválido");
      const id = parseInt(Buffer.from(uid, "base64url").toString(), 10);
      if (isNaN(id)) return res.status(400).send("Token inválido");
      await pool.query("UPDATE empresa_contacts SET opted_out = true, opted_out_at = NOW() WHERE id = $1", [id]);
      res.send(`<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Baja confirmada – NUXA</title>
<style>body{margin:0;font-family:'Segoe UI',sans-serif;background:#eff6ff;display:flex;align-items:center;justify-content:center;min-height:100vh;}
.box{background:#fff;border-radius:20px;padding:48px 40px;max-width:400px;text-align:center;box-shadow:0 4px 24px rgba(0,0,0,.08);}
h1{color:#1d4ed8;font-size:22px;margin:0 0 12px;}p{color:#4b5563;font-size:15px;line-height:1.6;}a{color:#3b82f6;}</style></head>
<body><div class="box"><p style="font-size:36px;margin:0 0 16px">✅</p>
<h1>Baja registrada</h1><p>Su empresa no volverá a recibir comunicaciones de NUXA.<br>Si en el futuro desea conocer nuestros servicios, puede contactarnos en <a href="https://nuxa.life">nuxa.life</a>.</p></div></body></html>`);
    } catch { res.status(500).send("Error"); }
  });

  // ===== CAMPAÑA DE REACTIVACIÓN =====

  // Preview: count eligible trial users
  app.get("/api/admin/reactivation-preview", async (req, res) => {
    if (!req.session.isAdmin) return res.status(401).json({ message: "No autorizado" });
    try {
      const users = await storage.getAllUsers();
      const eligible = users.filter(u =>
        u.subscriptionStatus === "trial" &&
        u.email &&
        !u.email.includes("test") &&
        !u.email.includes("example") &&
        !(u as any).marketingOptedOut
      );
      res.json({ count: eligible.length });
    } catch (e) {
      res.status(500).json({ message: "Error" });
    }
  });

  // Send reactivation emails to all eligible trial users
  app.post("/api/admin/send-reactivation", async (req, res) => {
    if (!req.session.isAdmin) return res.status(401).json({ message: "No autorizado" });
    try {
      const users = await storage.getAllUsers();
      const eligible = users.filter(u =>
        u.subscriptionStatus === "trial" &&
        u.email &&
        !u.email.includes("test") &&
        !u.email.includes("example") &&
        !(u as any).marketingOptedOut
      );

      let sent = 0, failed = 0, skipped = 0;
      for (const user of eligible) {
        if (!user.email) { skipped++; continue; }
        const ok = await sendReactivationEmail({
          email: user.email,
          username: user.username || user.email.split("@")[0],
          userId: user.id,
        });
        if (ok) sent++; else failed++;
        // Small delay to avoid rate limits
        await new Promise(r => setTimeout(r, 120));
      }

      console.log(`Reactivation campaign: sent=${sent} failed=${failed} skipped=${skipped}`);
      res.json({ sent, failed, skipped });
    } catch (e) {
      console.error("send-reactivation error:", e);
      res.status(500).json({ message: "Error sending campaign" });
    }
  });

  // Unsubscribe from reactivation emails (one-click)
  app.get("/api/unsubscribe-reactivation", async (req, res) => {
    try {
      const uid = req.query.uid as string;
      if (!uid) return res.status(400).send("Token inválido");
      const userId = parseInt(Buffer.from(uid, "base64url").toString(), 10);
      if (isNaN(userId)) return res.status(400).send("Token inválido");
      await pool.query("UPDATE users SET marketing_opted_out = true WHERE id = $1", [userId]);
      res.send(`<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Baja confirmada – NUXA</title>
<style>body{margin:0;font-family:'Segoe UI',sans-serif;background:#f0fdf4;display:flex;align-items:center;justify-content:center;min-height:100vh;}
.box{background:#fff;border-radius:20px;padding:48px 40px;max-width:400px;text-align:center;box-shadow:0 4px 24px rgba(0,0,0,.08);}
h1{color:#15803d;font-size:22px;margin:0 0 12px;}p{color:#4b5563;font-size:15px;line-height:1.6;}a{color:#10b981;}</style></head>
<body><div class="box"><p style="font-size:36px;margin:0 0 16px">✅</p>
<h1>Baja confirmada</h1><p>No volverás a recibir comunicaciones de NUXA.<br>Si algún día quieres volver, siempre puedes visitarnos en <a href="https://nuxa.life">nuxa.life</a>.</p></div></body></html>`);
    } catch (e) {
      res.status(500).send("Error al procesar la baja");
    }
  });

  // Skrill registrations (individual + empresa)
  app.get("/api/admin/skrill-registrations", async (req, res) => {
    if (!req.session.isAdmin) return res.status(401).json({ message: "No autorizado" });
    try {
      const individual = await storage.getAllIndividualRegistrations();
      const empresa = await storage.getAllEmpresaRegistrations();
      res.json({
        individual: individual.map(r => ({ ...r, tipo: "individual" })),
        empresa: empresa.map(r => ({ ...r, tipo: "empresa" })),
      });
    } catch (e) {
      res.status(500).json({ message: "Error" });
    }
  });


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

  // ===== ADMIN USER MANAGEMENT =====

  // Get all users for admin
  app.get("/api/admin/users", async (req, res) => {
    if (!req.session.isAdmin) {
      return res.status(401).json({ message: "No autorizado" });
    }
    try {
      const allUsers = await storage.getAllUsers();
      const safeUsers = allUsers.map(u => ({
        id: u.id,
        username: u.username,
        email: u.email,
        role: u.role,
        subscriptionStatus: u.subscriptionStatus,
        subscriptionPlan: u.subscriptionPlan,
        monthlyQuestionLimit: u.monthlyQuestionLimit,
        questionsUsedThisMonth: u.questionsUsedThisMonth,
        prepaidQuestions: u.prepaidQuestions,
        createdAt: u.createdAt,
        lastLoginAt: u.lastLoginAt,
        loginCount: u.loginCount,
        createdByPartnerId: u.createdByPartnerId,
        acceptedNuxaNotice: u.acceptedNuxaNotice
      }));
      res.json(safeUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Error fetching users" });
    }
  });

  // Update user subscription/plan
  app.patch("/api/admin/users/:userId", async (req, res) => {
    if (!req.session.isAdmin) {
      return res.status(401).json({ message: "No autorizado" });
    }
    try {
      const userId = parseInt(req.params.userId);
      const { subscriptionStatus, subscriptionPlan, monthlyQuestionLimit, role, newPassword } = req.body;
      const updateData: any = {};
      if (subscriptionStatus !== undefined) updateData.subscriptionStatus = subscriptionStatus;
      if (subscriptionPlan !== undefined) updateData.subscriptionPlan = subscriptionPlan;
      if (monthlyQuestionLimit !== undefined) updateData.monthlyQuestionLimit = parseInt(monthlyQuestionLimit);
      if (role !== undefined) updateData.role = role;
      if (newPassword !== undefined) updateData.password = await bcrypt.hash(newPassword, 10);

      const [updated] = await db.update(users).set(updateData).where(eq(users.id, userId)).returning();
      if (!updated) return res.status(404).json({ message: "Usuario no encontrado" });
      res.json({ success: true, user: { id: updated.id, username: updated.username, subscriptionStatus: updated.subscriptionStatus, subscriptionPlan: updated.subscriptionPlan, monthlyQuestionLimit: updated.monthlyQuestionLimit, role: updated.role } });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Error updating user" });
    }
  });

  // Delete user
  app.delete("/api/admin/users/:userId", async (req, res) => {
    if (!req.session.isAdmin) {
      return res.status(401).json({ message: "No autorizado" });
    }
    try {
      const userId = parseInt(req.params.userId);
      const userConversations = await db.select({ id: conversations.id }).from(conversations).where(eq(conversations.userId, userId));
      for (const conv of userConversations) {
        await db.delete(messages).where(eq(messages.conversationId, conv.id));
      }
      await db.delete(conversations).where(eq(conversations.userId, userId));
      await db.delete(users).where(eq(users.id, userId));
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Error deleting user" });
    }
  });

  // ===== ADMIN PARTNER MANAGEMENT =====
  
  // Get all partners for admin
  app.get("/api/admin/partners", async (req, res) => {
    try {
      const allPartners = await storage.getAllPartners();
      res.json(allPartners);
    } catch (error) {
      console.error("Error fetching partners:", error);
      res.status(500).json({ message: "Error fetching partners" });
    }
  });

  // Approve partner
  app.post("/api/admin/partners/:partnerId/approve", async (req, res) => {
    try {
      const partnerId = parseInt(req.params.partnerId);
      const { activeUsersLimit, monthlyCost, licenseRenewalDate, commissionRate } = req.body;
      
      // Update status to approved/active
      await storage.updatePartnerStatus(partnerId, 'active');
      
      // Update license settings if provided
      const licenseData: any = { licenseStatus: 'active' };
      if (activeUsersLimit) licenseData.activeUsersLimit = parseInt(activeUsersLimit);
      if (monthlyCost) licenseData.monthlyCost = monthlyCost;
      if (licenseRenewalDate) licenseData.licenseRenewalDate = new Date(licenseRenewalDate);
      if (commissionRate) licenseData.commissionRate = commissionRate;
      
      const partner = await storage.updatePartnerLicense(partnerId, licenseData);
      
      // Generate referral code if doesn't exist
      if (!partner.referralCode) {
        const referralCode = generateReferralCode(partner.companyName, partner.id);
        await db.update(partners).set({ referralCode }).where(eq(partners.id, partnerId));
      }
      
      res.json({ success: true, partner });
    } catch (error) {
      console.error("Error approving partner:", error);
      res.status(500).json({ message: "Error approving partner" });
    }
  });

  // Reject partner
  app.post("/api/admin/partners/:partnerId/reject", async (req, res) => {
    try {
      const partnerId = parseInt(req.params.partnerId);
      const partner = await storage.updatePartnerStatus(partnerId, 'rejected');
      res.json({ success: true, partner });
    } catch (error) {
      console.error("Error rejecting partner:", error);
      res.status(500).json({ message: "Error rejecting partner" });
    }
  });

  // Suspend partner
  app.post("/api/admin/partners/:partnerId/suspend", async (req, res) => {
    try {
      const partnerId = parseInt(req.params.partnerId);
      await storage.updatePartnerStatus(partnerId, 'suspended');
      const partner = await storage.updatePartnerLicense(partnerId, { licenseStatus: 'suspended' });
      res.json({ success: true, partner });
    } catch (error) {
      console.error("Error suspending partner:", error);
      res.status(500).json({ message: "Error suspending partner" });
    }
  });

  // Reactivate partner
  app.post("/api/admin/partners/:partnerId/activate", async (req, res) => {
    try {
      const partnerId = parseInt(req.params.partnerId);
      await storage.updatePartnerStatus(partnerId, 'active');
      const partner = await storage.updatePartnerLicense(partnerId, { licenseStatus: 'active' });
      res.json({ success: true, partner });
    } catch (error) {
      console.error("Error activating partner:", error);
      res.status(500).json({ message: "Error activating partner" });
    }
  });

  // Update partner license settings
  app.patch("/api/admin/partners/:partnerId/license", async (req, res) => {
    try {
      const partnerId = parseInt(req.params.partnerId);
      const { activeUsersLimit, monthlyCost, licenseRenewalDate, licenseStatus, commissionRate } = req.body;
      
      const licenseData: any = {};
      if (activeUsersLimit !== undefined) licenseData.activeUsersLimit = parseInt(activeUsersLimit);
      if (monthlyCost !== undefined) licenseData.monthlyCost = monthlyCost;
      if (licenseRenewalDate !== undefined) licenseData.licenseRenewalDate = licenseRenewalDate ? new Date(licenseRenewalDate) : null;
      if (licenseStatus !== undefined) licenseData.licenseStatus = licenseStatus;
      if (commissionRate !== undefined) licenseData.commissionRate = commissionRate;
      
      const partner = await storage.updatePartnerLicense(partnerId, licenseData);
      res.json({ success: true, partner });
    } catch (error) {
      console.error("Error updating partner license:", error);
      res.status(500).json({ message: "Error updating partner license" });
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
            monthlyQuestionLimit: 10, // Partner users get 10 questions per month
            createdByPartnerId: partnerId, // Track which partner created this user
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

      // Get users created by this specific partner
      const partnerUsers = await db.select()
        .from(users)
        .where(eq(users.createdByPartnerId, partnerId));

      res.json(partnerUsers.map(u => ({
        id: u.id,
        username: u.username,
        email: u.email,
        createdAt: u.createdAt,
        lastLoginAt: u.lastLoginAt,
        loginCount: u.loginCount,
        questionsUsedThisMonth: u.questionsUsedThisMonth,
        monthlyQuestionLimit: u.monthlyQuestionLimit,
        subscriptionStatus: u.subscriptionStatus
      })));

    } catch (error: any) {
      console.error("Error fetching partner users:", error);
      res.status(500).json({ message: "Error obteniendo usuarios" });
    }
  });

  // Update partner user status (activate/block)
  app.patch("/api/partners/users/:userId/status", async (req, res) => {
    try {
      const partnerId = req.session.partnerId;
      const userId = parseInt(req.params.userId);
      const { status } = req.body; // 'active' or 'inactive'
      
      if (!partnerId) {
        return res.status(401).json({ message: "No autenticado como partner" });
      }

      if (!['active', 'inactive'].includes(status)) {
        return res.status(400).json({ message: "Estado inválido. Usa 'active' o 'inactive'" });
      }

      // Verify user belongs to this partner
      const [user] = await db.select().from(users).where(eq(users.id, userId));
      if (!user || user.createdByPartnerId !== partnerId) {
        return res.status(404).json({ message: "Usuario no encontrado o no pertenece a tu organización" });
      }

      // Update user status
      await db.update(users)
        .set({ subscriptionStatus: status })
        .where(eq(users.id, userId));

      res.json({ message: `Usuario ${status === 'active' ? 'activado' : 'bloqueado'} correctamente` });

    } catch (error: any) {
      console.error("Error updating user status:", error);
      res.status(500).json({ message: "Error actualizando estado del usuario" });
    }
  });

  // Delete partner user
  app.delete("/api/partners/users/:userId", async (req, res) => {
    try {
      const partnerId = req.session.partnerId;
      const userId = parseInt(req.params.userId);
      
      if (!partnerId) {
        return res.status(401).json({ message: "No autenticado como partner" });
      }

      // Verify user belongs to this partner
      const [user] = await db.select().from(users).where(eq(users.id, userId));
      if (!user || user.createdByPartnerId !== partnerId) {
        return res.status(404).json({ message: "Usuario no encontrado o no pertenece a tu organización" });
      }

      // Delete user
      await db.delete(users).where(eq(users.id, userId));

      // Update partner active users count
      const partner = await storage.getPartner(partnerId);
      if (partner && (partner.activeUsersCount ?? 0) > 0) {
        await db.update(partners)
          .set({ activeUsersCount: (partner.activeUsersCount ?? 1) - 1 })
          .where(eq(partners.id, partnerId));
      }

      res.json({ message: "Usuario eliminado correctamente" });

      // Log activity
      await db.insert(partnerActivityLog).values({
        partnerId,
        adminEmail: partner?.email || 'unknown',
        action: 'delete_user',
        targetUserId: userId,
        targetUserEmail: user.email,
        details: JSON.stringify({ username: user.username }),
      });

    } catch (error: any) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Error eliminando usuario" });
    }
  });

  // ============ Partner Admins Management ============

  // Get all admins for a partner
  app.get("/api/partners/admins", async (req, res) => {
    try {
      const partnerId = req.session.partnerId;
      if (!partnerId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const admins = await db.select().from(partnerAdmins).where(eq(partnerAdmins.partnerId, partnerId));
      res.json(admins);
    } catch (error: any) {
      console.error("Error fetching admins:", error);
      res.status(500).json({ message: "Error fetching admins" });
    }
  });

  // Create a new admin
  app.post("/api/partners/admins", async (req, res) => {
    try {
      const partnerId = req.session.partnerId;
      if (!partnerId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const { name, email, password, role = 'admin' } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ message: "Nombre, email y contraseña son requeridos" });
      }

      // Check if email already exists
      const existingAdmin = await db.select().from(partnerAdmins).where(eq(partnerAdmins.email, email));
      if (existingAdmin.length > 0) {
        return res.status(400).json({ message: "Ya existe un administrador con este email" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const [newAdmin] = await db.insert(partnerAdmins).values({
        partnerId,
        name,
        email,
        password: hashedPassword,
        role,
        createdBy: partnerId,
      }).returning();

      // Log activity
      const partner = await storage.getPartner(partnerId);
      await db.insert(partnerActivityLog).values({
        partnerId,
        adminEmail: partner?.email || 'unknown',
        action: 'create_admin',
        details: JSON.stringify({ adminName: name, adminEmail: email }),
      });

      res.json({ success: true, admin: { id: newAdmin.id, name: newAdmin.name, email: newAdmin.email, role: newAdmin.role } });
    } catch (error: any) {
      console.error("Error creating admin:", error);
      res.status(500).json({ message: "Error creating admin" });
    }
  });

  // Delete an admin
  app.delete("/api/partners/admins/:adminId", async (req, res) => {
    try {
      const partnerId = req.session.partnerId;
      const adminId = parseInt(req.params.adminId);

      if (!partnerId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      // Verify admin belongs to this partner
      const [admin] = await db.select().from(partnerAdmins).where(
        and(eq(partnerAdmins.id, adminId), eq(partnerAdmins.partnerId, partnerId))
      );

      if (!admin) {
        return res.status(404).json({ message: "Administrador no encontrado" });
      }

      await db.delete(partnerAdmins).where(eq(partnerAdmins.id, adminId));

      // Log activity
      const partner = await storage.getPartner(partnerId);
      await db.insert(partnerActivityLog).values({
        partnerId,
        adminEmail: partner?.email || 'unknown',
        action: 'delete_admin',
        details: JSON.stringify({ adminName: admin.name, adminEmail: admin.email }),
      });

      res.json({ message: "Administrador eliminado correctamente" });
    } catch (error: any) {
      console.error("Error deleting admin:", error);
      res.status(500).json({ message: "Error deleting admin" });
    }
  });

  // ============ Activity Log ============

  // Get activity log for a partner
  app.get("/api/partners/activity-log", async (req, res) => {
    try {
      const partnerId = req.session.partnerId;
      if (!partnerId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const limit = parseInt(req.query.limit as string) || 50;
      const logs = await db.select()
        .from(partnerActivityLog)
        .where(eq(partnerActivityLog.partnerId, partnerId))
        .orderBy(desc(partnerActivityLog.createdAt))
        .limit(limit);

      res.json(logs);
    } catch (error: any) {
      console.error("Error fetching activity log:", error);
      res.status(500).json({ message: "Error fetching activity log" });
    }
  });

  // Partner logo upload - SVG excluded for XSS security
  const logoUpload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max
    fileFilter: (req, file, cb) => {
      const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (allowed.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Formato de imagen no válido. Use JPG, PNG, GIF o WebP.'));
      }
    }
  });

  app.post("/api/partners/logo", logoUpload.single('logo'), async (req, res) => {
    try {
      const partnerId = req.session.partnerId;
      if (!partnerId) {
        return res.status(401).json({ message: "No autenticado" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No se recibió ningún archivo" });
      }

      // Convert to base64 data URL
      const base64 = req.file.buffer.toString('base64');
      const dataUrl = `data:${req.file.mimetype};base64,${base64}`;

      // Update partner with logo
      await db.update(partners)
        .set({ companyLogo: dataUrl })
        .where(eq(partners.id, partnerId));

      res.json({ message: "Logo actualizado correctamente", logoUrl: dataUrl });
    } catch (error: any) {
      console.error("Error uploading logo:", error);
      res.status(500).json({ message: error.message || "Error al subir el logo" });
    }
  });

  app.delete("/api/partners/logo", async (req, res) => {
    try {
      const partnerId = req.session.partnerId;
      if (!partnerId) {
        return res.status(401).json({ message: "No autenticado" });
      }

      await db.update(partners)
        .set({ companyLogo: null })
        .where(eq(partners.id, partnerId));

      res.json({ message: "Logo eliminado correctamente" });
    } catch (error: any) {
      console.error("Error deleting logo:", error);
      res.status(500).json({ message: "Error al eliminar el logo" });
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
          name: 'NUXA Plan Básico',
          interval: 'month'
        },
        individual: {
          amount: 599, // €5.99 in cents
          name: 'NUXA Plan Individual',
          interval: 'month'
        },
        premium: {
          amount: 3200, // €32 in cents
          name: 'NUXA Plan Premium',
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
        success_url: "https://nuxa.life/stripe-return?session_id={CHECKOUT_SESSION_ID}",
        cancel_url: "https://nuxa.life/cancel",
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

  // Endpoint para compra de packs de preguntas (pago único)
  app.post("/api/stripe/create-pack-session", async (req, res) => {
    try {
      const { packType, email } = req.body;
      
      const packConfig: Record<string, { amount: number; questions: number; name: string }> = {
        'pack10':  { amount: 299,  questions: 10,  name: 'NUXA Pack 10 Preguntas'  },
        'pack20':  { amount: 599,  questions: 20,  name: 'NUXA Pack 20 Preguntas'  },
        'pack100': { amount: 3200, questions: 100, name: 'NUXA Pack 100 Preguntas' },
      };
      
      const pack = packConfig[packType];
      if (!pack) {
        return res.status(400).json({ error: 'Pack type not valid' });
      }
      
      const Stripe = (await import('stripe')).default;
      const stripeKey = process.env.STRIPE_SECRET_KEY || process.env.TESTING_STRIPE_SECRET_KEY || '';
      if (!stripeKey) {
        return res.status(500).json({ error: 'Stripe configuration missing' });
      }
      
      const stripe = new Stripe(stripeKey, { apiVersion: '2025-08-27.basil' });
      
      const userId = req.session.userId?.toString() || 'unknown';
      
      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        customer_email: email || undefined,
        line_items: [{
          price_data: {
            currency: 'eur',
            unit_amount: pack.amount,
            product_data: { name: pack.name },
          },
          quantity: 1,
        }],
        success_url: 'https://nuxa.life/stripe-return?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: 'https://nuxa.life/registro',
        metadata: {
          type: 'prepaid_credits',
          packType,
          questions: pack.questions.toString(),
          userId,
        },
      });
      
      res.json({ url: session.url });
    } catch (error: any) {
      console.error('Stripe pack session error:', error);
      res.status(500).json({ error: 'Error creating checkout session' });
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
                  'pack10': 299,   // €2.99 en centavos
                  'pack20': 599,   // €5.99 en centavos
                  'pack100': 3200, // €32 en centavos
                  'pack15': 500,   // legacy
                  'pack35': 1000   // legacy
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
                  'pack10': 10,
                  'pack20': 20,
                  'pack100': 100,
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
      const isTrial = user.subscriptionStatus === 'trial';
      const subscriptionRemaining = Math.max(0, limit - used);
      const totalRemaining = prepaid + subscriptionRemaining;
      
      res.json({
        limit,
        remaining: subscriptionRemaining,
        used,
        prepaidQuestions: prepaid,
        totalRemaining,
        canAsk: totalRemaining > 0,
        isTrial,
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
        success_url: "https://nuxa.life/chat?credits_purchased=true",
        cancel_url: "https://nuxa.life/chat",
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