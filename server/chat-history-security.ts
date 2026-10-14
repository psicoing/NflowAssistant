import type { Express, Request, RequestHandler } from "express";
import { z } from "zod";
import type { Conversation, User } from "@shared/schema";

export class ChatHistoryAccessError extends Error {
  constructor() {
    super("Conversation not found");
  }
}

export async function establishChatUserSession(req: Request, userId: number, isAdmin = false) {
  await new Promise<void>((resolve, reject) => {
    req.session.regenerate(error => error ? reject(error) : resolve());
  });
  req.session.userId = userId;
  if (isAdmin) req.session.isAdmin = true;
}

const id = z.number().int().positive().max(Number.MAX_SAFE_INTEGER);
export function conversationId(value: unknown): number {
  if (typeof value === "string" && /^[1-9]\d*$/.test(value)) value = Number(value);
  return id.parse(value);
}

const text = z.string().min(1).refine(value => !!value.trim());
const preferences = {
  // Kept for the existing client contract, but never trusted or forwarded.
  userProfile: z.unknown().optional(),
  language: z.string().min(2).max(16).optional(),
  chatMode: z.enum(["classic", "brief", "bubbles"]).optional(),
};
const createBody = z.object({ title: z.string().min(1).max(300).refine(value => !!value.trim()).optional() }).strict();
const sendBody = z.object({ content: text, ...preferences }).strict();
const chatBody = z.object({
  message: text, conversationId: id, ...preferences,
}).strict();

export interface ChatHistorySecurityStore {
  getUser(userId: number): Promise<User | undefined>;
  getOwnedConversation(conversationId: number, userId: number): Promise<Conversation | undefined>;
}

export function storedChatProfile(user: User) {
  const profile: Record<string, string> = {};
  if (user.ageRange) profile.ageRange = user.ageRange;
  if (user.gender) profile.gender = user.gender;
  return Object.keys(profile).length ? profile : undefined;
}

/** Runs before the actual handlers, so rejected requests have no chat effects. */
export function installChatHistoryGuards(app: Express, store: ChatHistorySecurityStore) {
  const guard: RequestHandler = async (req, res, next) => {
    // Express routes are case-insensitive by default; the guard must be too.
    const match = /^\/api\/conversations\/([^/]+)(\/messages)?\/?$/i.exec(req.path);
    const collection = /^\/api\/conversations\/?$/i.test(req.path);
    const generic = /^\/api\/messages\/?$/i.test(req.path);
    const chat = /^\/api\/chat\/?$/i.test(req.path);
    if (!match && !collection && !generic && !chat) return next();

    try {
      const userId = req.session?.userId;
      if (!Number.isSafeInteger(userId) || !userId || userId <= 0) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      const user = await store.getUser(userId);
      if (!user) return res.status(401).json({ message: "User not authenticated" });
      res.setHeader("Cache-Control", "no-store");
      if (generic) {
        return res.status(410).json({ message: "Direct message insertion is disabled" });
      }

      // A browser on another site cannot use an existing session to write chat.
      if (req.method === "POST" && req.headers["sec-fetch-site"] === "cross-site") {
        return res.status(403).json({ message: "Cross-site chat requests are not allowed" });
      }
      if (req.method === "POST") {
        if (!req.is("application/json")) {
          return res.status(415).json({ message: "JSON request required" });
        }
        if (collection) req.body = createBody.parse(req.body);
        else if (chat) req.body = chatBody.parse(req.body);
        else if (match?.[2]) req.body = sendBody.parse(req.body);
      }
      if (match || chat) {
        const requestedId = conversationId(match ? match[1] : req.body?.conversationId);
        const owned = await store.getOwnedConversation(requestedId, userId);
        if (!owned) return res.status(404).json({ message: "Conversation not found" });
      }
      if (req.method === "POST" && (chat || match?.[2])) {
        req.body.userProfile = storedChatProfile(user);
      }
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid chat request" });
      }
      // No unscoped fallback on datastore failure.
      res.status(500).json({ message: "Unable to authorize chat request" });
    }
  };
  app.use(guard);
}

/** Legacy rows remain readable; only server-attributed rows may feed the AI. */
export const CHAT_HISTORY_PROVENANCE_VERSION = 1;
