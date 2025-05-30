import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertConversationSchema, insertMessageSchema } from "@shared/schema";
import OpenAI from "openai";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY || "default_key"
});

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

  // Send message and get AI response
  app.post("/api/conversations/:id/messages", async (req, res) => {
    try {
      const conversationId = parseInt(req.params.id);
      const { content } = req.body;

      if (!content) {
        return res.status(400).json({ message: "Message content is required" });
      }

      // Save user message
      const userMessage = await storage.createMessage({
        conversationId,
        content,
        isUser: true
      });

      // Generate AI response using OpenAI
      const systemPrompt = `Eres un asistente de salud mental empático y profesional para NFLOW. 
      Proporciona apoyo psicológico basado en evidencia científica. 
      Mantén un tono cálido, comprensivo y profesional.
      Si detectas signos de crisis severa, recomienda buscar ayuda profesional inmediata.
      Responde en español y mantén las respuestas concisas pero útiles.
      Responde en formato JSON con la estructura: { "response": "tu respuesta aquí", "supportType": "general|anxiety|depression|stress|crisis" }`;

      const aiResponse = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content }
        ],
        response_format: { type: "json_object" },
        max_tokens: 500
      });

      const aiContent = JSON.parse(aiResponse.choices[0].message.content || '{"response": "Lo siento, no puedo procesar tu mensaje en este momento. ¿Podrías intentarlo de nuevo?", "supportType": "general"}');

      // Save AI message
      const aiMessage = await storage.createMessage({
        conversationId,
        content: aiContent.response,
        isUser: false
      });

      res.json({
        userMessage,
        aiMessage,
        supportType: aiContent.supportType
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

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", service: "NFLOW Psychology Bot" });
  });

  const httpServer = createServer(app);
  return httpServer;
}
