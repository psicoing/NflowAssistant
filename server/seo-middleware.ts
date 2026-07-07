import fs from "fs";
import path from "path";
import type { Express } from "express";

const BOT_UA = /googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|sogou|exabot|facebot|facebookexternalhit|twitterbot|rogerbot|linkedinbot|embedly|quora|outbrain|pinterest|slack|whatsapp|telegram|discord|gptbot|claudebot|perplexitybot|anthropic|ccbot|cohere|meta-externalagent|ia_archiver|archive\.org/i;

interface PageMeta {
  title: string;
  description: string;
  keywords: string;
}

const PAGE_META: Record<string, PageMeta> = {
  "/": {
    title: "NUXA - Tu Psicólogo IA 24/7 | Salud Mental y Bienestar",
    description: "NUXA es tu asistente de inteligencia artificial para salud mental disponible 24/7. Apoyo emocional continuo para personas, familias y empresas. Prueba gratis sin tarjeta.",
    keywords: "salud mental, psicólogo IA, bienestar emocional, apoyo psicológico, inteligencia artificial, estrés, ansiedad",
  },
  "/prueba-gratis": {
    title: "Prueba NUXA Gratis | 2 Consultas Sin Tarjeta",
    description: "Habla con NUXA ahora mismo: 2 consultas de IA para salud mental completamente gratis, sin tarjeta de crédito ni registro previo.",
    keywords: "prueba gratis, psicólogo IA gratis, salud mental gratis, sin tarjeta",
  },
  "/precios": {
    title: "Precios NUXA | Planes para Particulares y Empresas",
    description: "Planes de NUXA desde 2,99€/mes para particulares. Soluciones corporativas para empresas y organizaciones públicas. Consulta nuestros precios y packs de créditos.",
    keywords: "precios, planes, suscripción, tarifa, salud mental empresas, créditos prepagados",
  },
  "/recursos": {
    title: "Recursos Gratuitos de Salud Mental | NUXA",
    description: "Herramientas gratuitas de bienestar emocional: ejercicios de respiración, diario de gratitud, técnicas de regulación emocional y más. Sin registro.",
    keywords: "recursos salud mental, ejercicios respiración, bienestar emocional, gratis",
  },
  "/recursos-gratuitos": {
    title: "Recursos Gratuitos de Salud Mental | NUXA",
    description: "Accede gratis a ejercicios de mindfulness, regulación emocional, respiración guiada y herramientas de bienestar psicológico.",
    keywords: "recursos gratuitos, mindfulness, regulación emocional, salud mental",
  },
  "/empresa-privada": {
    title: "NUXA para Empresas | Bienestar Laboral e ISO 45003",
    description: "Solución de bienestar mental para empresas. Cumple la norma ISO 45003, reduce el absentismo y mejora el clima laboral con IA. Planes corporativos.",
    keywords: "bienestar laboral, ISO 45003, salud mental empresas, riesgos psicosociales, absentismo",
  },
  "/sector-publico": {
    title: "NUXA para el Sector Público | Instituciones y Administraciones",
    description: "Apoyo psicológico digital para hospitales, escuelas, universidades y administraciones públicas. NUXA adapta su solución a las necesidades del sector público.",
    keywords: "sector público, hospitales, escuelas, universidades, salud mental instituciones",
  },
  "/blog": {
    title: "Blog de Salud Mental | Artículos y Consejos - NUXA",
    description: "Artículos, guías y consejos sobre salud mental, bienestar emocional, gestión del estrés y psicología positiva escritos por expertos.",
    keywords: "blog salud mental, artículos psicología, bienestar emocional, consejos",
  },
  "/nosotros": {
    title: "Quiénes Somos | NUXA",
    description: "Conoce al equipo detrás de NUXA: nuestra misión, valores y compromiso con la salud mental accesible para todos mediante inteligencia artificial.",
    keywords: "quiénes somos, equipo NUXA, misión, valores, salud mental IA",
  },
  "/quienes-somos": {
    title: "Quiénes Somos | NUXA",
    description: "Conoce al equipo detrás de NUXA: nuestra misión, valores y compromiso con la salud mental accesible para todos mediante inteligencia artificial.",
    keywords: "quiénes somos, equipo NUXA, misión, valores",
  },
  "/partners": {
    title: "Programa de Partners | NUXA",
    description: "Únete al programa de partners de NUXA y ofrece apoyo psicológico con IA a tus clientes o usuarios. Comisiones competitivas y soporte dedicado.",
    keywords: "partners, programa afiliados, colaboradores, distribuidores",
  },
  "/partners-comerciales": {
    title: "Partners Comerciales | NUXA",
    description: "Conviértete en partner comercial de NUXA y distribuye soluciones de bienestar mental con IA a empresas e instituciones.",
    keywords: "partners comerciales, distribuidores, ventas, bienestar mental",
  },
  "/app-movil": {
    title: "App Móvil NUXA | Psicólogo IA en tu Bolsillo",
    description: "Descarga la app de NUXA en iOS y Android. Lleva tu psicólogo de IA contigo en cualquier momento y lugar.",
    keywords: "app móvil, iOS, Android, psicólogo IA, salud mental app",
  },
  "/control-parental": {
    title: "Control Parental y Menores | NUXA",
    description: "Información para padres sobre el uso responsable de NUXA por menores de edad. Guías de control parental y bienestar digital familiar.",
    keywords: "control parental, menores, adolescentes, bienestar digital, familias",
  },
  "/ejemplos-chat": {
    title: "Ejemplos de Conversaciones con NUXA | IA para Salud Mental",
    description: "Descubre cómo NUXA ayuda en conversaciones reales sobre ansiedad, estrés laboral, relaciones y bienestar emocional.",
    keywords: "ejemplos chat, conversaciones IA, salud mental, ansiedad, estrés",
  },
  "/legal/terminos": {
    title: "Términos y Condiciones | NUXA",
    description: "Términos y condiciones de uso de la plataforma NUXA. Lee nuestras condiciones de servicio antes de usar la aplicación.",
    keywords: "términos, condiciones, uso, legal",
  },
  "/legal/privacidad": {
    title: "Política de Privacidad | NUXA",
    description: "Política de privacidad de NUXA. Cómo recogemos, usamos y protegemos tus datos personales conforme al RGPD.",
    keywords: "privacidad, datos personales, RGPD, protección de datos",
  },
  "/legal/cookies": {
    title: "Política de Cookies | NUXA",
    description: "Información sobre el uso de cookies en nuxa.life. Gestiona tus preferencias de cookies.",
    keywords: "cookies, política de cookies, preferencias",
  },
  "/legal/aviso-legal": {
    title: "Aviso Legal | NUXA",
    description: "Aviso legal de NUXA. Información sobre el titular del sitio web y condiciones legales aplicables.",
    keywords: "aviso legal, información legal, titular web",
  },
};

const DEFAULT_META: PageMeta = {
  title: "NUXA - Tu Psicólogo IA 24/7 | Salud Mental",
  description: "NUXA es tu asistente de inteligencia artificial para salud mental disponible 24/7. Apoyo emocional para personas, familias y empresas.",
  keywords: "salud mental, psicólogo IA, bienestar emocional, inteligencia artificial",
};

function buildMetaHtml(meta: PageMeta, urlPath: string): string {
  const canonical = `https://nuxa.life${urlPath}`;
  return `<title>${meta.title}</title>
    <meta name="description" content="${meta.description}">
    <meta name="keywords" content="${meta.keywords}">
    <meta property="og:title" content="${meta.title}">
    <meta property="og:description" content="${meta.description}">
    <meta property="og:url" content="${canonical}">
    <meta property="og:type" content="website">
    <meta property="og:image" content="https://nuxa.life/icon-512.png">
    <meta property="og:site_name" content="NUXA">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${meta.title}">
    <meta name="twitter:description" content="${meta.description}">
    <meta name="twitter:image" content="https://nuxa.life/icon-512.png">
    <link rel="canonical" href="${canonical}">`;
}

export function registerSeoMiddleware(app: Express) {
  app.use(async (req, res, next) => {
    const ua = req.headers["user-agent"] || "";
    if (!BOT_UA.test(ua)) return next();

    // Only handle public-facing HTML routes
    if (req.path.startsWith("/api") || req.path.startsWith("/admin") || req.path.startsWith("/partners/dashboard")) {
      return next();
    }

    const routePath = req.path === "/" ? "/" : req.path.replace(/\/$/, "");
    const meta = PAGE_META[routePath] || DEFAULT_META;
    const metaHtml = buildMetaHtml(meta, routePath);

    try {
      const isProd = process.env.NODE_ENV === "production";
      const htmlPath = isProd
        ? path.resolve(process.cwd(), "server", "public", "index.html")
        : path.resolve(process.cwd(), "client", "index.html");

      let html = await fs.promises.readFile(htmlPath, "utf-8");

      // Remove existing title and description so crawlers only see ours
      html = html.replace(/<title>[^<]*<\/title>/i, "");
      // Remove any meta description regardless of attribute order
      html = html.replace(/<meta[^>]*name=["']description["'][^>]*\/?>/gi, "");
      html = html.replace(/<meta[^>]*content=["'][^"']*["'][^>]*name=["']description["'][^>]*\/?>/gi, "");

      // Inject route-specific meta just before </head>
      html = html.replace("</head>", `  ${metaHtml}\n  </head>`);

      res.status(200).set("Content-Type", "text/html").end(html);
    } catch (err) {
      next();
    }
  });
}
