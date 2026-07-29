import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

// ---------------------------------------------------------------------------
// Route metadata for server-side meta injection (SSR-like prerendering)
// Ensures Google / LLM crawlers see accurate <title>, description, OG and
// canonical tags in the initial HTML, before React hydrates.
// ---------------------------------------------------------------------------
interface RouteMeta {
  title: string;
  description: string;
  canonical: string;
  ogType?: string;
  ogImage?: string;
}

const OG_IMAGE_DEFAULT = "https://nuxa.life/icon-512.png";

const routeMetadata: Record<string, RouteMeta> = {
  "/": {
    title: "NUXA - Tu Psicólogo IA 24/7 | Apoyo Emocional Digital",
    description:
      "NUXA es tu psicólogo disponible 24/7. Asistente de IA para salud mental de personas, familias y trabajadores. Apoyo emocional continuo y confidencial.",
    canonical: "https://nuxa.life",
  },
  "/precios": {
    title: "Plan y Suscripción - NUXA | Planes desde €2.99/mes + Pago Por Uso",
    description:
      "NUXA: Suscripciones desde €2.99/mes o packs de créditos prepagados. Sin permanencia. Cancela cuando quieras.",
    canonical: "https://nuxa.life/precios",
  },
  "/blog": {
    title: "Blog NUXA | Artículos sobre IA y Salud Mental",
    description:
      "Artículos especializados sobre inteligencia artificial y salud mental, bienestar emocional, innovación terapéutica y las últimas tendencias en psicología digital.",
    canonical: "https://nuxa.life/blog",
  },
  "/blog/1": {
    title: "Cómo la IA puede ayudar a la salud mental de los adolescentes | Blog NUXA",
    description:
      "Descubre cómo la inteligencia artificial está revolucionando el apoyo psicológico para jóvenes, con herramientas accesibles, anónimas y disponibles 24/7.",
    canonical: "https://nuxa.life/blog/1",
    ogType: "article",
    ogImage:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  },
  "/blog/2": {
    title: "5 beneficios de usar chatbots para la salud emocional en empresas | Blog NUXA",
    description:
      "Las organizaciones líderes implementan chatbots especializados en salud mental para mejorar el bienestar de sus empleados y reducir el absentismo.",
    canonical: "https://nuxa.life/blog/2",
    ogType: "article",
  },
  "/blog/3": {
    title: "El futuro de la terapia: IA como complemento del psicólogo | Blog NUXA",
    description:
      "La IA no reemplaza a los terapeutas humanos, sino que los potencia. Descubre cómo esta sinergia crea nuevos paradigmas en salud mental.",
    canonical: "https://nuxa.life/blog/3",
    ogType: "article",
    ogImage:
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  },
  "/empresa-privada": {
    title: "NUXA para Empresas | Bienestar Mental Corporativo con IA",
    description:
      "Solución de bienestar emocional para empresas. Reduce el absentismo, mejora la productividad y cuida la salud mental de tu equipo con NUXA.",
    canonical: "https://nuxa.life/empresa-privada",
  },
  "/sector-publico": {
    title: "NUXA para Sector Público | Salud Mental Institucional con IA",
    description:
      "Solución de apoyo psicológico para administraciones, universidades y organismos públicos. Bienestar mental accesible para empleados y ciudadanos.",
    canonical: "https://nuxa.life/sector-publico",
  },
  "/prueba-gratis": {
    title: "Prueba NUXA Gratis | 3 Consultas Sin Registro",
    description:
      "Prueba NUXA gratis sin registro. Habla con nuestro psicólogo IA ahora mismo. 3 consultas gratuitas para descubrir el poder del apoyo emocional digital.",
    canonical: "https://nuxa.life/prueba-gratis",
  },
  "/recursos": {
    title: "Recursos de Salud Mental | Guías y Herramientas NUXA",
    description:
      "Accede a recursos gratuitos de salud mental: guías, test de bienestar, técnicas de relajación y herramientas de apoyo emocional de NUXA.",
    canonical: "https://nuxa.life/recursos",
  },
  "/recursos-gratuitos": {
    title: "Recursos Gratuitos de Bienestar | NUXA",
    description:
      "Descarga recursos gratuitos de salud mental y bienestar emocional. Guías, ejercicios y herramientas para mejorar tu salud mental sin coste.",
    canonical: "https://nuxa.life/recursos-gratuitos",
  },
  "/ejemplos-chat": {
    title: "Ejemplos de Conversación con NUXA | Psicólogo IA",
    description:
      "Descubre cómo NUXA responde en situaciones reales. Ejemplos de conversaciones sobre ansiedad, estrés laboral, relaciones personales y más.",
    canonical: "https://nuxa.life/ejemplos-chat",
  },
  "/nosotros": {
    title: "Sobre NUXA | Quiénes Somos y Nuestra Misión",
    description:
      "Conoce el equipo y la misión de NUXA: democratizar el acceso a la salud mental con inteligencia artificial empática y responsable.",
    canonical: "https://nuxa.life/nosotros",
  },
  "/quienes-somos": {
    title: "Quiénes Somos | NUXA - Psicólogo IA 24/7",
    description:
      "El equipo detrás de NUXA. Profesionales de salud mental e IA trabajando para hacer el apoyo psicológico accesible para todos.",
    canonical: "https://nuxa.life/quienes-somos",
  },
  "/app-movil": {
    title: "App Móvil NUXA | Psicólogo IA en tu Bolsillo",
    description:
      "Descarga la app de NUXA para iOS y Android. Tu psicólogo IA siempre contigo, disponible 24/7 desde cualquier lugar.",
    canonical: "https://nuxa.life/app-movil",
  },
  "/control-parental": {
    title: "Control Parental NUXA | Supervisión Profesional para Jóvenes",
    description:
      "NUXA ofrece controles parentales y supervisión profesional para el uso seguro de la IA en salud mental juvenil. Protege a tus hijos.",
    canonical: "https://nuxa.life/control-parental",
  },
  "/novedades": {
    title: "Novedades NUXA | Últimas Actualizaciones y Noticias",
    description:
      "Descubre las últimas novedades, actualizaciones y noticias de NUXA. Mantente al día con las mejoras y nuevas funcionalidades.",
    canonical: "https://nuxa.life/novedades",
  },
  "/partners": {
    title: "Partners NUXA | Programa de Licencias y Distribución",
    description:
      "Únete al programa de partners de NUXA. Distribuidores, empresas y profesionales de la salud: ofrece NUXA a tus clientes.",
    canonical: "https://nuxa.life/partners",
  },
  "/partners-comerciales": {
    title: "Partners Comerciales NUXA | Distribución y Licencias",
    description:
      "Programa de partners comerciales NUXA. Distribuye la solución líder de psicología IA y genera ingresos recurrentes.",
    canonical: "https://nuxa.life/partners-comerciales",
  },
  "/programa-partners": {
    title: "Programa de Partners NUXA | Ingresos Recurrentes con IA",
    description:
      "Conviértete en partner de NUXA. Genera ingresos recurrentes distribuyendo la solución líder de psicología IA para empresas e instituciones.",
    canonical: "https://nuxa.life/programa-partners",
  },
  "/registro": {
    title: "Registro NUXA | Crea tu Cuenta Gratis",
    description:
      "Regístrate en NUXA y comienza tu viaje hacia el bienestar emocional. Planes individuales, sorteo gratuito y licencias corporativas disponibles.",
    canonical: "https://nuxa.life/registro",
  },
  "/registro/planes": {
    title: "Acceso a NUXA | Planes Individuales, Sorteo Gratuito y Licencias",
    description:
      "Accede a NUXA con planes individuales desde €2.99/mes, participa en el sorteo mensual gratuito o solicita una licencia corporativa.",
    canonical: "https://nuxa.life/registro/planes",
  },
  "/login": {
    title: "Iniciar Sesión | NUXA - Tu Psicólogo IA",
    description:
      "Accede a tu cuenta NUXA. Continúa tu sesión de apoyo emocional con tu psicólogo IA personal.",
    canonical: "https://nuxa.life/login",
  },
  "/legal/terminos": {
    title: "Términos de Uso | NUXA",
    description: "Términos y condiciones de uso del servicio NUXA. Lee nuestras condiciones antes de utilizar la plataforma.",
    canonical: "https://nuxa.life/legal/terminos",
  },
  "/legal/privacidad": {
    title: "Política de Privacidad | NUXA",
    description: "Política de privacidad y tratamiento de datos de NUXA. Tu privacidad es nuestra prioridad.",
    canonical: "https://nuxa.life/legal/privacidad",
  },
  "/legal/cookies": {
    title: "Política de Cookies | NUXA",
    description: "Información sobre el uso de cookies en NUXA. Gestiona tus preferencias de cookies.",
    canonical: "https://nuxa.life/legal/cookies",
  },
  "/legal/aviso-legal": {
    title: "Aviso Legal | NUXA",
    description: "Aviso legal y condiciones de la plataforma NUXA. Información sobre el titular y condiciones de uso.",
    canonical: "https://nuxa.life/legal/aviso-legal",
  },
};

function escAttr(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function injectRouteMetadata(html: string, url: string): string {
  const routePath = url.split("?")[0].split("#")[0];
  const meta = routeMetadata[routePath];
  if (!meta) return html;

  const ogType = meta.ogType ?? "website";
  const ogImage = meta.ogImage ?? OG_IMAGE_DEFAULT;
  const title = escAttr(meta.title);
  const desc = escAttr(meta.description);

  const tags = `
    <!-- Route-specific metadata injected server-side -->
    <title>${meta.title}</title>
    <meta name="description" content="${desc}">
    <link rel="canonical" href="${meta.canonical}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${desc}">
    <meta property="og:url" content="${meta.canonical}">
    <meta property="og:type" content="${ogType}">
    <meta property="og:image" content="${ogImage}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${desc}">
    <meta name="twitter:image" content="${ogImage}">`;

  // Strip the generic default title and description from index.html, then
  // inject route-specific ones right before </head>.
  return html
    .replace(/<title>[^<]*<\/title>/g, "")
    .replace(/<meta\s+name="description"[^>]*>/gi, "")
    .replace("</head>", `${tags}\n  </head>`);
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      const injected = injectRouteMetadata(page, url);
      res.status(200).set({ "Content-Type": "text/html" }).end(injected);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(import.meta.dirname, "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html — inject route-specific metadata before sending
  app.use("*", (req, res) => {
    const indexPath = path.resolve(distPath, "index.html");
    fs.readFile(indexPath, "utf-8", (err, html) => {
      if (err) {
        res.status(500).send("Server error");
        return;
      }
      const injected = injectRouteMetadata(html, req.originalUrl);
      res.set("Content-Type", "text/html").send(injected);
    });
  });
}
