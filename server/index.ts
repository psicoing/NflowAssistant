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
    const existing = await pool.query(
      `SELECT id FROM users WHERE username = 'rmolons'
       UNION
       SELECT id FROM users WHERE email = 'rmportbou@gmail.com' AND username != 'rmolons'
       LIMIT 1`
    );
    if (existing.rows.length > 0) {
      await pool.query(
        `UPDATE users SET username = 'rmolons', email = 'rmportbou@gmail.com', password = $1,
         role = 'admin', subscription_status = 'active', profile_completed = true
         WHERE id = $2`,
        [hash, existing.rows[0].id]
      );
      log("Admin user rmolons updated");
    } else {
      await pool.query(
        `INSERT INTO users (username, email, password, role, subscription_status, profile_completed)
         VALUES ('rmolons', 'rmportbou@gmail.com', $1, 'admin', 'active', true)`,
        [hash]
      );
      log("Admin user rmolons created");
    }
  } catch (err: any) {
    console.error("ensureAdminUser error:", err.message);
  }
}

async function ensureInstitutionTables() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS institution_campaign_history (
        id SERIAL PRIMARY KEY,
        sent_at TIMESTAMPTZ DEFAULT NOW(),
        subject TEXT NOT NULL,
        sent_count INT DEFAULT 0,
        failed_count INT DEFAULT 0,
        opens INT DEFAULT 0
      );
      CREATE TABLE IF NOT EXISTS institution_email_tracking (
        id SERIAL PRIMARY KEY,
        campaign_id INT REFERENCES institution_campaign_history(id) ON DELETE CASCADE,
        contact_email TEXT NOT NULL,
        resend_message_id TEXT,
        opened_at TIMESTAMPTZ
      );
    `);
    // Seed retroactive campaign entry if history is empty
    await pool.query(`
      INSERT INTO institution_campaign_history (sent_at, subject, sent_count, failed_count, opens)
      SELECT '2026-08-12 13:34:00+00', 'NUXA — Apoyo emocional profesional para sus equipos de salud', 55, 0, 0
      WHERE NOT EXISTS (SELECT 1 FROM institution_campaign_history)
    `);
    log("Institution tables ensured");
  } catch (err: any) {
    console.error("ensureInstitutionTables error:", err.message);
  }
}

async function ensureInstitutionContacts() {
  try {
    await pool.query(`
      INSERT INTO institution_contacts (email, region) VALUES
      ('alertas.productossanitarios@larioja.org','La Rioja'),
      ('asistencia.transfronteriza@sespa.princast.es','Asturias'),
      ('asistenciatransfronteriza@listas.carm.es','Murcia'),
      ('astransfronteriza@salud-juntaex.es','Extremadura'),
      ('atencioalciutada@catsalut.cat','Cataluña'),
      ('atencionusuario@cantabria.es','Cantabria'),
      ('atencionusuarios@sescam.jccm.es','Castilla-La Mancha'),
      ('atenciousuari@ibsalut.es','Baleares'),
      ('ayudadigital.sspa@juntadeandalucia.es','Andalucía'),
      ('buzgen.dg@scsalud.es','Cantabria'),
      ('buzgen.dt.ceuta@ingesa.sanidad.gob.es','Ceuta'),
      ('cluster@innovacionsanitaria.com','Nacional'),
      ('consejosalud@navarra.es','Navarra'),
      ('deteprec@navarra.es','Navarra'),
      ('dgerencia@salud.aragon.es','Aragón'),
      ('direcciongeneralsalud@navarra.es','Navarra'),
      ('direcciongerencia.ses@salud-juntaex.es','Extremadura'),
      ('dpd.cpidssa@juntadeandalucia.es','Andalucía'),
      ('dpd@ibsalut.es','Baleares'),
      ('dpd@ticsalutsocial.cat','Cataluña'),
      ('fomento.innovacion@navarra.es','Navarra'),
      ('gabinete.salud@navarra.es','Navarra'),
      ('gerensns@navarra.es','Navarra'),
      ('iau@riojasalud.es','La Rioja'),
      ('info@clustersaude.com','Galicia'),
      ('informacion.sector2@salud.aragon.es','Aragón'),
      ('innovacion.acis@sergas.es','Galicia'),
      ('innovacion.chuac@sergas.es','Galicia'),
      ('innovacion.iacs@aragon.es','Aragón'),
      ('investigacion.salud@navarra.es','Navarra'),
      ('investinnova.sanidad@jcyl.es','Castilla y León'),
      ('isp.promocion@navarra.es','Navarra'),
      ('ispdirec@navarra.es','Navarra'),
      ('ispepidem@navarra.es','Navarra'),
      ('ispwebge@navarra.es','Navarra'),
      ('ocatt@catsalut.cat','Cataluña'),
      ('oddus.cs@gobiernodecanarias.org','Canarias'),
      ('otri.iacs@aragon.es','Aragón'),
      ('plan.docente.salud@navarra.es','Navarra'),
      ('prestaciones.dt.melilla@ingesa.sanidad.gob.es','Melilla'),
      ('programa.ulceras.fora@sergas.es','Galicia'),
      ('protecciondatos.iacs@aragon.es','Aragón'),
      ('sacylinnova@jcyl.es','Castilla y León'),
      ('salud.responde@navarra.es','Navarra'),
      ('saludresponde@juntadeandalucia.es','Andalucía'),
      ('sanidadinforma@salud.madrid.org','Madrid'),
      ('sanidadtransfronterizacv@gva.es','Comunidad Valenciana'),
      ('sapu.emergentziak@osakidetza.eus','País Vasco'),
      ('sau.tic@gencat.cat','Cataluña'),
      ('secretaria.consejero.salud@navarra.es','Navarra'),
      ('sg.scs@gobiernodecanarias.org','Canarias'),
      ('soportec@navarra.es','Navarra'),
      ('sugerencias.emergentziak@osakidetza.eus','País Vasco'),
      ('sxs.planificacion.sanitaria@sergas.es','Galicia'),
      ('usuariosaragonsalud@aragon.es','Aragón')
      ON CONFLICT (email) DO NOTHING
    `);
    log("Institution contacts seeded");
  } catch (err: any) {
    console.error("ensureInstitutionContacts error:", err.message);
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
  await ensureInstitutionTables();
  await ensureInstitutionContacts();
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
