import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import MemoryStore from "memorystore";
import bcrypt from "bcrypt";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { registerSeoMiddleware } from "./seo-middleware";
import { pool } from "./db";

async function ensureAdminUser() {
  try {
    const hash = await bcrypt.hash("mln328RMR+", 10);
    await pool.query(`
      INSERT INTO users (username, email, password, role, subscription_status, profile_completed)
      VALUES ('rmolons', 'rmportbou@gmail.com', $1, 'admin', 'active', true)
      ON CONFLICT (email) DO UPDATE
        SET username = 'rmolons',
            password  = $1,
            role      = 'admin',
            subscription_status = 'active',
            profile_completed   = true
    `, [hash]);
    log("Admin user rmolons ensured");
  } catch (err: any) {
    console.error("ensureAdminUser error:", err.message);
  }
}

// Prevent transient DB/network errors from crashing the process
process.on("uncaughtException", (err: Error) => {
  console.error("[process] Uncaught exception (kept alive):", err.message);
});
process.on("unhandledRejection", (reason: unknown) => {
  console.error("[process] Unhandled rejection (kept alive):", reason);
});

const app = express();

// Apply express.json() conditionally - exclude Stripe webhook route
app.use((req, res, next) => {
  if (req.path === "/api/stripe/webhook") {
    // Skip JSON parsing for Stripe webhook - it needs raw body
    return next();
  }
  express.json()(req, res, next);
});

app.use(express.urlencoded({ extended: false }));

// Create memory store for sessions
const memoryStore = MemoryStore(session);

// Session configuration for user authentication
app.use(session({
  secret: "nflow-admin-secret-2025",
  store: new memoryStore({
    checkPeriod: 86400000 // prune expired entries every 24h
  }),
  resave: true,
  saveUninitialized: true,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    httpOnly: false, // Allow frontend access
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax' // Allow same-site requests
  }
}));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  await ensureAdminUser();
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  const isProd = app.get("env") !== "development";

  // SEO middleware: inject route-specific meta for bots/crawlers
  // Must run BEFORE Vite/static middleware to intercept crawler requests
  registerSeoMiddleware(app, isProd);

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (!isProd) {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
