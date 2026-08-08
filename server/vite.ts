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
// Ensures Google / LLM crawlers see accurate <title>, description, OG,
// canonical, JSON-LD, and body content in the initial HTML before React
// hydrates.
// ---------------------------------------------------------------------------
interface RouteMeta {
  title: string;
  description: string;
  canonical: string;
  ogType?: string;
  ogImage?: string;
  /** JSON-LD structured data — one object or an array of objects */
  jsonLd?: object | object[];
  /** Static body HTML injected into <div id="root"> for bot crawlability.
   *  React replaces it on hydration; non-JS crawlers index it directly. */
  bodyHtml?: string;
}

const OG_IMAGE_DEFAULT = "https://nuxa.life/icon-512.png";
const SITE_NAME = "NUXA";
const SITE_URL = "https://nuxa.life";

// Shared schema fragments
const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/icon-512.png`,
  description:
    "NUXA es la plataforma de psicología IA disponible 24/7. Apoyo emocional continuo y confidencial para personas, familias y empresas.",
  foundingDate: "2024",
  areaServed: "ES",
  knowsLanguage: ["es", "en", "ca", "eu", "gl", "fr", "de", "it", "pt"],
};

const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/blog?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

function blogPostingSchema(opts: {
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  image?: string;
  author?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: opts.headline,
    description: opts.description,
    url: opts.url,
    datePublished: opts.datePublished,
    dateModified: opts.datePublished,
    image: opts.image ?? OG_IMAGE_DEFAULT,
    author: opts.author
      ? { "@type": "Person", name: opts.author }
      : { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/icon-512.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": opts.url },
  };
}

const routeMetadata: Record<string, RouteMeta> = {
  "/": {
    title: "NUXA - Tu Psicólogo IA 24/7 | Apoyo Emocional Digital",
    description:
      "NUXA es tu psicólogo disponible 24/7. Asistente de IA para salud mental de personas, familias y trabajadores. Apoyo emocional continuo y confidencial.",
    canonical: `${SITE_URL}`,
    jsonLd: [orgSchema, webSiteSchema],
    bodyHtml: `
      <main>
        <h1>NUXA — Tu Psicólogo IA 24/7</h1>
        <p>NUXA es tu psicólogo disponible 24 horas, 7 días a la semana. Apoyo emocional continuo, confidencial y accesible para personas, familias y trabajadores.</p>
        <h2>¿Por qué NUXA?</h2>
        <ul>
          <li>Disponible 24/7, sin listas de espera</li>
          <li>Totalmente confidencial y seguro</li>
          <li>Para individuos, familias y empresas</li>
          <li>Tecnología de IA avanzada con enfoque empático</li>
          <li>Planes desde €2.99/mes · 3 consultas gratuitas sin registro</li>
        </ul>
        <p><a href="/prueba-gratis">Prueba NUXA gratis</a> · <a href="/precios">Ver planes y precios</a> · <a href="/ejemplos-chat">Ver ejemplos de conversación</a></p>
      </main>`,
  },
  "/precios": {
    title: "Plan y Suscripción - NUXA | Planes desde €2.99/mes + Pago Por Uso",
    description:
      "NUXA: Suscripciones desde €2.99/mes o packs de créditos prepagados. Sin permanencia. Cancela cuando quieras.",
    canonical: `${SITE_URL}/precios`,
    jsonLd: orgSchema,
    bodyHtml: `
      <main>
        <h1>Planes y Precios de NUXA</h1>
        <p>Elige el plan de salud mental IA que mejor se adapta a ti. Sin permanencia, cancela cuando quieras.</p>
        <h2>Opciones de acceso</h2>
        <ul>
          <li><strong>Plan Básico:</strong> €2.99/mes — Apoyo emocional esencial</li>
          <li><strong>Plan Avanzado:</strong> Mayor número de consultas mensuales</li>
          <li><strong>Pago por uso:</strong> Packs de créditos prepagados sin suscripción</li>
          <li><strong>Licencias corporativas:</strong> Para empresas, instituciones y ONG</li>
        </ul>
        <p><a href="/registro/planes">Comenzar ahora</a> · <a href="/prueba-gratis">Probar gratis</a></p>
      </main>`,
  },
  "/blog": {
    title: "Blog NUXA | Artículos sobre IA y Salud Mental",
    description:
      "Artículos especializados sobre inteligencia artificial y salud mental, bienestar emocional, innovación terapéutica y las últimas tendencias en psicología digital.",
    canonical: `${SITE_URL}/blog`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Blog NUXA",
      description:
        "Artículos sobre inteligencia artificial y salud mental, bienestar emocional e innovación terapéutica.",
      url: `${SITE_URL}/blog`,
      publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    },
    bodyHtml: `
      <main>
        <h1>Blog NUXA — IA y Salud Mental</h1>
        <p>Artículos especializados sobre inteligencia artificial aplicada a la salud mental, bienestar emocional e innovación terapéutica.</p>
        <nav aria-label="Artículos destacados">
          <ul>
            <li><a href="/blog/1">Cómo la IA puede ayudar a la salud mental de los adolescentes</a></li>
            <li><a href="/blog/2">5 beneficios de usar chatbots para la salud emocional en empresas</a></li>
            <li><a href="/blog/3">El futuro de la terapia: IA como complemento del psicólogo</a></li>
          </ul>
        </nav>
      </main>`,
  },
  "/blog/1": {
    title: "Cómo la IA puede ayudar a la salud mental de los adolescentes | Blog NUXA",
    description:
      "Descubre cómo la inteligencia artificial está revolucionando el apoyo psicológico para jóvenes, con herramientas accesibles, anónimas y disponibles 24/7.",
    canonical: `${SITE_URL}/blog/1`,
    ogType: "article",
    ogImage:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    jsonLd: blogPostingSchema({
      headline: "Cómo la IA puede ayudar a la salud mental de los adolescentes",
      description:
        "Descubre cómo la inteligencia artificial está revolucionando el apoyo psicológico para jóvenes, con herramientas accesibles, anónimas y disponibles 24/7.",
      url: `${SITE_URL}/blog/1`,
      datePublished: "2025-08-23",
      author: "Dr. Ana Martínez",
      image:
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    }),
    bodyHtml: `
      <article>
        <h1>Cómo la IA puede ayudar a la salud mental de los adolescentes</h1>
        <p>Descubre cómo la inteligencia artificial está revolucionando el apoyo psicológico para jóvenes, con herramientas accesibles, anónimas y disponibles 24/7.</p>
        <p>La salud mental adolescente es uno de los retos más urgentes de nuestra sociedad. La IA ofrece un canal confidencial y sin estigma para que los jóvenes pidan ayuda cuando la necesitan.</p>
        <p><a href="/blog">Volver al blog</a> · <a href="/prueba-gratis">Probar NUXA gratis</a></p>
      </article>`,
  },
  "/blog/2": {
    title: "5 beneficios de usar chatbots para la salud emocional en empresas | Blog NUXA",
    description:
      "Las organizaciones líderes implementan chatbots especializados en salud mental para mejorar el bienestar de sus empleados y reducir el absentismo.",
    canonical: `${SITE_URL}/blog/2`,
    ogType: "article",
    ogImage: "https://nuxa.life/icon-512.png",
    jsonLd: blogPostingSchema({
      headline:
        "5 beneficios de usar chatbots para la salud emocional en empresas",
      description:
        "Las organizaciones líderes implementan chatbots especializados en salud mental para mejorar el bienestar de sus empleados y reducir el absentismo.",
      url: `${SITE_URL}/blog/2`,
      datePublished: "2025-08-22",
      author: "Lic. Roberto Silva",
    }),
    bodyHtml: `
      <article>
        <h1>5 beneficios de usar chatbots para la salud emocional en empresas</h1>
        <p>Las organizaciones líderes implementan chatbots especializados en salud mental para mejorar el bienestar de sus empleados y reducir el absentismo.</p>
        <ol>
          <li>Disponibilidad 24/7 sin coste por sesión adicional</li>
          <li>Confidencialidad total que elimina el miedo al estigma</li>
          <li>Reducción del absentismo y bajas laborales</li>
          <li>Datos anonimizados sobre bienestar organizacional</li>
          <li>Complemento a los programas de EAP existentes</li>
        </ol>
        <p><a href="/empresa-privada">NUXA para empresas</a> · <a href="/blog">Volver al blog</a></p>
      </article>`,
  },
  "/blog/3": {
    title: "El futuro de la terapia: IA como complemento del psicólogo | Blog NUXA",
    description:
      "La IA no reemplaza a los terapeutas humanos, sino que los potencia. Descubre cómo esta sinergia crea nuevos paradigmas en salud mental.",
    canonical: `${SITE_URL}/blog/3`,
    ogType: "article",
    ogImage:
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    jsonLd: blogPostingSchema({
      headline: "El futuro de la terapia: IA como complemento del psicólogo",
      description:
        "La IA no reemplaza a los terapeutas humanos, sino que los potencia. Descubre cómo esta sinergia crea nuevos paradigmas en salud mental.",
      url: `${SITE_URL}/blog/3`,
      datePublished: "2025-08-21",
      author: "Dr. Miguel Herrera",
      image:
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    }),
    bodyHtml: `
      <article>
        <h1>El futuro de la terapia: IA como complemento del psicólogo</h1>
        <p>La IA no reemplaza a los terapeutas humanos, sino que los potencia. Descubre cómo esta sinergia crea nuevos paradigmas en salud mental.</p>
        <p>NUXA actúa como puente entre el apoyo cotidiano automatizado y la intervención profesional cuando se necesita, democratizando el acceso a la salud mental.</p>
        <p><a href="/blog">Volver al blog</a> · <a href="/prueba-gratis">Probar NUXA gratis</a></p>
      </article>`,
  },
  "/empresa-privada": {
    title: "NUXA para Empresas | Bienestar Mental Corporativo con IA",
    description:
      "Solución de bienestar emocional para empresas. Reduce el absentismo, mejora la productividad y cuida la salud mental de tu equipo con NUXA.",
    canonical: `${SITE_URL}/empresa-privada`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "NUXA para Empresas",
      description:
        "Solución de bienestar emocional para empresas. Reduce el absentismo, mejora la productividad y cuida la salud mental de tu equipo.",
      provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
      areaServed: "ES",
      serviceType: "Bienestar Mental Corporativo",
    },
    bodyHtml: `
      <main>
        <h1>NUXA para Empresas — Bienestar Mental Corporativo</h1>
        <p>Solución de bienestar emocional para empresas. Reduce el absentismo, mejora la productividad y cuida la salud mental de tu equipo con IA.</p>
        <h2>Beneficios para tu organización</h2>
        <ul>
          <li>Reducción del absentismo laboral por causas psicológicas</li>
          <li>Mejora de la productividad y el clima laboral</li>
          <li>Cumplimiento de la normativa de prevención de riesgos psicosociales (ISO 45003)</li>
          <li>Informes anonimizados de bienestar organizacional</li>
          <li>Licencias corporativas con soporte dedicado</li>
        </ul>
        <p><a href="/registro/planes">Solicitar licencia corporativa</a> · <a href="/precios">Ver precios</a></p>
      </main>`,
  },
  "/sector-publico": {
    title: "NUXA para Sector Público | Salud Mental Institucional con IA",
    description:
      "Solución de apoyo psicológico para administraciones, universidades y organismos públicos. Bienestar mental accesible para empleados y ciudadanos.",
    canonical: `${SITE_URL}/sector-publico`,
    jsonLd: orgSchema,
    bodyHtml: `
      <main>
        <h1>NUXA para Sector Público — Salud Mental Institucional</h1>
        <p>Solución de apoyo psicológico para administraciones públicas, universidades y organismos oficiales. Bienestar mental accesible para empleados y ciudadanos.</p>
        <h2>¿Por qué NUXA para el sector público?</h2>
        <ul>
          <li>Cumplimiento normativo y protección de datos (RGPD, LOPD)</li>
          <li>Escalable para grandes organizaciones y administraciones</li>
          <li>Accesible para empleados públicos y ciudadanos</li>
          <li>Informes de impacto y seguimiento del bienestar institucional</li>
        </ul>
        <p><a href="/registro/planes">Solicitar licencia institucional</a></p>
      </main>`,
  },
  "/prueba-gratis": {
    title: "Prueba NUXA Gratis | 3 Consultas Sin Registro",
    description:
      "Prueba NUXA gratis sin registro. Habla con nuestro psicólogo IA ahora mismo. 3 consultas gratuitas para descubrir el poder del apoyo emocional digital.",
    canonical: `${SITE_URL}/prueba-gratis`,
    jsonLd: orgSchema,
    bodyHtml: `
      <main>
        <h1>Prueba NUXA Gratis — 3 Consultas Sin Registro</h1>
        <p>Accede al psicólogo IA de NUXA sin necesidad de crear una cuenta. Tienes 3 consultas gratuitas para descubrir cómo la IA puede apoyar tu bienestar emocional.</p>
        <ul>
          <li>Sin tarjeta de crédito</li>
          <li>Sin registro obligatorio</li>
          <li>100% confidencial</li>
        </ul>
      </main>`,
  },
  "/recursos": {
    title: "Recursos de Salud Mental | Guías y Herramientas NUXA",
    description:
      "Accede a recursos gratuitos de salud mental: guías, test de bienestar, técnicas de relajación y herramientas de apoyo emocional de NUXA.",
    canonical: `${SITE_URL}/recursos`,
    jsonLd: orgSchema,
    bodyHtml: `
      <main>
        <h1>Recursos de Salud Mental — NUXA</h1>
        <p>Accede a recursos gratuitos de salud mental: guías prácticas, test de bienestar, técnicas de relajación y herramientas de apoyo emocional.</p>
        <p><a href="/recursos-gratuitos">Ver todos los recursos gratuitos</a></p>
      </main>`,
  },
  "/recursos-gratuitos": {
    title: "Recursos Gratuitos de Bienestar | NUXA",
    description:
      "Descarga recursos gratuitos de salud mental y bienestar emocional. Guías, ejercicios y herramientas para mejorar tu salud mental sin coste.",
    canonical: `${SITE_URL}/recursos-gratuitos`,
    jsonLd: orgSchema,
    bodyHtml: `
      <main>
        <h1>Recursos Gratuitos de Bienestar — NUXA</h1>
        <p>Descarga recursos gratuitos de salud mental y bienestar emocional. Guías, ejercicios y herramientas para mejorar tu salud mental sin coste.</p>
        <ul>
          <li>Guías de manejo de la ansiedad</li>
          <li>Técnicas de mindfulness y relajación</li>
          <li>Tests de bienestar emocional</li>
          <li>Ejercicios de respiración y meditación</li>
        </ul>
      </main>`,
  },
  "/ejemplos-chat": {
    title: "Ejemplos de Conversación con NUXA | Psicólogo IA",
    description:
      "Descubre cómo NUXA responde en situaciones reales. Ejemplos de conversaciones sobre ansiedad, estrés laboral, relaciones personales y más.",
    canonical: `${SITE_URL}/ejemplos-chat`,
    jsonLd: orgSchema,
    bodyHtml: `
      <main>
        <h1>Ejemplos de Conversación con NUXA</h1>
        <p>Descubre cómo responde NUXA en situaciones reales. Ejemplos de conversaciones sobre ansiedad, estrés laboral, relaciones personales y bienestar emocional.</p>
        <h2>Temas de ejemplo</h2>
        <ul>
          <li>Gestión de la ansiedad y el estrés</li>
          <li>Problemas de relación y comunicación</li>
          <li>Burnout y estrés laboral</li>
          <li>Autoestima y desarrollo personal</li>
          <li>Duelo y pérdida</li>
        </ul>
        <p><a href="/prueba-gratis">Probar NUXA gratis</a></p>
      </main>`,
  },
  "/nosotros": {
    title: "Sobre NUXA | Quiénes Somos y Nuestra Misión",
    description:
      "Conoce el equipo y la misión de NUXA: democratizar el acceso a la salud mental con inteligencia artificial empática y responsable.",
    canonical: `${SITE_URL}/nosotros`,
    jsonLd: orgSchema,
    bodyHtml: `
      <main>
        <h1>Quiénes Somos — NUXA</h1>
        <p>NUXA nació con una misión clara: democratizar el acceso a la salud mental mediante inteligencia artificial empática y responsable.</p>
        <p>Somos un equipo de profesionales de salud mental, ingenieros y especialistas en IA comprometidos con hacer el apoyo psicológico accesible para todos, sin listas de espera y sin estigma.</p>
        <p><a href="/partners-comerciales">Conoce nuestros partners</a></p>
      </main>`,
  },
  "/quienes-somos": {
    title: "Quiénes Somos | NUXA - Psicólogo IA 24/7",
    description:
      "El equipo detrás de NUXA. Profesionales de salud mental e IA trabajando para hacer el apoyo psicológico accesible para todos.",
    canonical: `${SITE_URL}/quienes-somos`,
    jsonLd: orgSchema,
    bodyHtml: `
      <main>
        <h1>Quiénes Somos — NUXA</h1>
        <p>El equipo detrás de NUXA. Profesionales de salud mental e inteligencia artificial trabajando para hacer el apoyo psicológico accesible para todos.</p>
      </main>`,
  },
  "/app-movil": {
    title: "App Móvil NUXA | Psicólogo IA en tu Bolsillo",
    description:
      "Descarga la app de NUXA para iOS y Android. Tu psicólogo IA siempre contigo, disponible 24/7 desde cualquier lugar.",
    canonical: `${SITE_URL}/app-movil`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "MobileApplication",
      name: "NUXA — Psicólogo IA",
      description:
        "Tu psicólogo IA siempre contigo. Disponible 24/7 desde cualquier lugar.",
      operatingSystem: "iOS, Android",
      applicationCategory: "HealthApplication",
      offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
      url: `${SITE_URL}/app-movil`,
    },
    bodyHtml: `
      <main>
        <h1>App Móvil NUXA — Psicólogo IA en tu Bolsillo</h1>
        <p>Descarga la aplicación de NUXA para iOS y Android. Tu psicólogo IA siempre contigo, disponible 24 horas, 7 días a la semana desde cualquier lugar.</p>
        <ul>
          <li>Compatible con iPhone y dispositivos Android</li>
          <li>Notificaciones de bienestar personalizadas</li>
          <li>Sesiones de texto y voz</li>
          <li>Historial de conversaciones seguro y cifrado</li>
        </ul>
      </main>`,
  },
  "/control-parental": {
    title: "Control Parental NUXA | Supervisión Profesional para Jóvenes",
    description:
      "NUXA ofrece controles parentales y supervisión profesional para el uso seguro de la IA en salud mental juvenil. Protege a tus hijos.",
    canonical: `${SITE_URL}/control-parental`,
    jsonLd: orgSchema,
    bodyHtml: `
      <main>
        <h1>Control Parental NUXA — Uso Seguro para Jóvenes</h1>
        <p>NUXA ofrece controles parentales y supervisión profesional para garantizar el uso seguro de la inteligencia artificial en salud mental juvenil.</p>
        <ul>
          <li>Supervisión parental de las sesiones</li>
          <li>Filtros de contenido apropiados para menores</li>
          <li>Alertas automáticas ante contenido sensible</li>
          <li>Opción de supervisión por profesional de salud mental</li>
        </ul>
        <p><a href="/registro/planes">Activar control parental</a></p>
      </main>`,
  },
  "/novedades": {
    title: "Novedades NUXA | Últimas Actualizaciones y Noticias",
    description:
      "Descubre las últimas novedades, actualizaciones y noticias de NUXA. Mantente al día con las mejoras y nuevas funcionalidades.",
    canonical: `${SITE_URL}/novedades`,
    jsonLd: orgSchema,
    bodyHtml: `
      <main>
        <h1>Novedades NUXA — Últimas Actualizaciones</h1>
        <p>Descubre las últimas novedades, actualizaciones y mejoras de la plataforma NUXA. Mantente al día con las nuevas funcionalidades y mejoras.</p>
      </main>`,
  },
  "/recompensas": {
    title: "Recompensas NUXA | Programa de Puntos y Beneficios",
    description:
      "Acumula puntos con NUXA, desbloquea beneficios exclusivos y sube de nivel. Programa de fidelización para usuarios comprometidos con su bienestar mental.",
    canonical: `${SITE_URL}/recompensas`,
    jsonLd: orgSchema,
    bodyHtml: `
      <main>
        <h1>Recompensas NUXA — Programa de Puntos</h1>
        <p>Acumula puntos por tu compromiso con el bienestar mental, desbloquea beneficios exclusivos y sube de nivel en el programa de recompensas de NUXA.</p>
        <ul>
          <li>Nivel Bronce, Plata, Oro y Diamante</li>
          <li>Descuentos en suscripciones</li>
          <li>Acceso prioritario a nuevas funcionalidades</li>
          <li>Contenido exclusivo de bienestar</li>
        </ul>
      </main>`,
  },
  "/partners": {
    title: "Partners NUXA | Programa de Licencias y Distribución",
    description:
      "Únete al programa de partners de NUXA. Distribuidores, empresas y profesionales de la salud: ofrece NUXA a tus clientes.",
    canonical: `${SITE_URL}/partners`,
    jsonLd: orgSchema,
    bodyHtml: `
      <main>
        <h1>Partners NUXA — Licencias y Distribución</h1>
        <p>Únete al programa de partners de NUXA. Distribuidores, empresas y profesionales de la salud: ofrece la solución líder de psicología IA a tus clientes.</p>
        <p><a href="/programa-partners">Conocer el programa de partners</a></p>
      </main>`,
  },
  "/partners-comerciales": {
    title: "Partners Comerciales NUXA | Equipo de Socios Fundadores",
    description:
      "Conoce al equipo de partners comerciales de NUXA, especialistas en salud mental digital, ISO 45003 y bienestar laboral. Líderes en psicología IA en España.",
    canonical: `${SITE_URL}/partners-comerciales`,
    jsonLd: orgSchema,
    bodyHtml: `
      <main>
        <h1>Partners Comerciales NUXA</h1>
        <p>Conoce al equipo de socios fundadores y partners comerciales de NUXA: especialistas en salud mental digital, ISO 45003 y bienestar laboral.</p>
      </main>`,
  },
  "/programa-partners": {
    title: "Programa de Partners NUXA | Ingresos Recurrentes con IA",
    description:
      "Conviértete en partner de NUXA. Genera ingresos recurrentes distribuyendo la solución líder de psicología IA para empresas e instituciones.",
    canonical: `${SITE_URL}/programa-partners`,
    jsonLd: orgSchema,
    bodyHtml: `
      <main>
        <h1>Programa de Partners NUXA — Ingresos Recurrentes</h1>
        <p>Conviértete en partner de NUXA y genera ingresos recurrentes distribuyendo la solución líder de psicología IA para empresas e instituciones.</p>
        <h2>Ventajas del programa</h2>
        <ul>
          <li>Comisiones recurrentes por cada licencia vendida</li>
          <li>Material de ventas y formación incluidos</li>
          <li>Soporte técnico y comercial dedicado</li>
          <li>Acceso al panel de gestión de clientes</li>
        </ul>
        <p><a href="/registro/planes">Solicitar información</a></p>
      </main>`,
  },
  "/registro": {
    title: "Registro NUXA | Crea tu Cuenta Gratis",
    description:
      "Regístrate en NUXA y comienza tu viaje hacia el bienestar emocional. Planes individuales, sorteo gratuito y licencias corporativas disponibles.",
    canonical: `${SITE_URL}/registro`,
    // Transactional UI — no JSON-LD or body prerender; metadata tags sufficient
  },
  "/registro/planes": {
    title: "Acceso a NUXA | Planes Individuales, Sorteo Gratuito y Licencias",
    description:
      "Accede a NUXA con planes individuales desde €2.99/mes, participa en el sorteo mensual gratuito o solicita una licencia corporativa.",
    canonical: `${SITE_URL}/registro/planes`,
    // Transactional UI — no JSON-LD or body prerender; metadata tags sufficient
  },
  "/login": {
    title: "Iniciar Sesión | NUXA - Tu Psicólogo IA",
    description:
      "Accede a tu cuenta NUXA. Continúa tu sesión de apoyo emocional con tu psicólogo IA personal.",
    canonical: `${SITE_URL}/login`,
    // Transactional UI — no JSON-LD or body prerender; metadata tags sufficient
  },
  "/competencia-nuxa": {
    title: "NUXA vs Competencia | Comparativa de Psicología IA",
    description:
      "Compara NUXA con otras soluciones de apoyo emocional IA: Wysa, Woebot, Replika y más. Descubre por qué NUXA es la mejor opción para el mercado hispano.",
    canonical: `${SITE_URL}/competencia-nuxa`,
    jsonLd: orgSchema,
    bodyHtml: `
      <main>
        <h1>NUXA vs Competencia — Comparativa de Psicología IA</h1>
        <p>Compara NUXA con otras soluciones de apoyo emocional con inteligencia artificial y descubre por qué NUXA es la opción líder para el mercado hispanohablante.</p>
        <h2>¿Por qué NUXA frente a otras soluciones?</h2>
        <ul>
          <li>Diseñado específicamente para el contexto cultural y lingüístico hispano</li>
          <li>Cumplimiento riguroso del RGPD y la normativa española de privacidad</li>
          <li>Especialización en ISO 45003 y bienestar laboral</li>
          <li>Multilingüe: español, catalán, euskera, gallego y más</li>
          <li>Precios accesibles desde €2.99/mes sin permanencia</li>
        </ul>
        <p><a href="/prueba-gratis">Probar NUXA gratis</a> · <a href="/precios">Ver precios</a></p>
      </main>`,
  },
  "/sorteo-recursos": {
    title: "Sorteo Mensual de Recursos NUXA | Participa Gratis",
    description:
      "Participa en el sorteo mensual gratuito de NUXA y consigue acceso premium a recursos de salud mental. Sin pago, solo tu email.",
    canonical: `${SITE_URL}/sorteo-recursos`,
    jsonLd: orgSchema,
    bodyHtml: `
      <main>
        <h1>Sorteo Mensual de Recursos NUXA</h1>
        <p>Participa en el sorteo mensual gratuito de NUXA y consigue acceso premium a recursos exclusivos de salud mental y bienestar emocional.</p>
        <ul>
          <li>Acceso gratuito — solo necesitas tu email</li>
          <li>Recursos premium de bienestar incluidos</li>
          <li>Un ganador cada mes</li>
        </ul>
        <p><a href="/recursos-gratuitos">Ver recursos gratuitos</a> · <a href="/prueba-gratis">Probar NUXA gratis</a></p>
      </main>`,
  },
  "/legal/terminos": {
    title: "Términos y Condiciones de Uso | NUXA",
    description:
      "Términos y condiciones de uso de NUXA, plataforma de psicología IA. Conoce tus derechos, obligaciones y las condiciones que rigen el uso del servicio.",
    canonical: `${SITE_URL}/legal/terminos`,
    bodyHtml: `
      <main>
        <h1>Términos y Condiciones de Uso — NUXA</h1>
        <p>Los presentes términos y condiciones regulan el uso de la plataforma NUXA, gestionada por Empordajobs SL (B02701100).</p>
        <p>Al utilizar el servicio, el usuario acepta las presentes condiciones. NUXA es una herramienta de apoyo emocional digital y no sustituye a un profesional de salud mental.</p>
        <p><a href="/legal/privacidad">Política de privacidad</a> · <a href="/legal/cookies">Política de cookies</a> · <a href="/legal/aviso-legal">Aviso legal</a></p>
      </main>`,
  },
  "/legal/privacidad": {
    title: "Política de Privacidad | NUXA",
    description:
      "Política de privacidad de NUXA. Cómo recogemos, usamos y protegemos tus datos personales conforme al RGPD y la LOPD española.",
    canonical: `${SITE_URL}/legal/privacidad`,
    bodyHtml: `
      <main>
        <h1>Política de Privacidad — NUXA</h1>
        <p>En NUXA (Empordajobs SL, B02701100) tratamos tus datos personales con la máxima confidencialidad y de acuerdo con el Reglamento General de Protección de Datos (RGPD) y la Ley Orgánica de Protección de Datos (LOPD).</p>
        <p>Tus conversaciones son privadas y no se comparten con terceros sin tu consentimiento explícito.</p>
        <p><a href="/legal/terminos">Términos de uso</a> · <a href="/legal/cookies">Política de cookies</a></p>
      </main>`,
  },
  "/legal/cookies": {
    title: "Política de Cookies | NUXA",
    description:
      "Información sobre el uso de cookies en NUXA: tipos, finalidad y cómo gestionar tus preferencias de privacidad según la normativa europea.",
    canonical: `${SITE_URL}/legal/cookies`,
    bodyHtml: `
      <main>
        <h1>Política de Cookies — NUXA</h1>
        <p>NUXA utiliza cookies propias y de terceros para mejorar la experiencia de usuario, analizar el tráfico y personalizar el contenido, de acuerdo con la normativa europea de privacidad.</p>
        <p>Puedes gestionar tus preferencias de cookies en cualquier momento desde la configuración de tu navegador.</p>
        <p><a href="/legal/privacidad">Política de privacidad</a> · <a href="/legal/terminos">Términos de uso</a></p>
      </main>`,
  },
  "/legal/aviso-legal": {
    title: "Aviso Legal | NUXA",
    description:
      "Aviso legal de NUXA (Empordajobs SL, B02701100). Información sobre el responsable del sitio web, condiciones de uso y normativa aplicable en España.",
    canonical: `${SITE_URL}/legal/aviso-legal`,
    bodyHtml: `
      <main>
        <h1>Aviso Legal — NUXA</h1>
        <p>Titular: Empordajobs SL · CIF: B02701100 · Domicilio social en España.</p>
        <p>La plataforma NUXA (nuxa.life) es un servicio de apoyo emocional digital basado en inteligencia artificial. No constituye atención sanitaria ni sustituye a un profesional de salud mental.</p>
        <p><a href="/legal/terminos">Términos de uso</a> · <a href="/legal/privacidad">Política de privacidad</a></p>
      </main>`,
  },
};

function escAttr(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function injectRouteMetadata(html: string, url: string): string {
  const routePath = url.split("?")[0].split("#")[0];
  const meta = routeMetadata[routePath];
  if (!meta) return html;

  const ogType = meta.ogType ?? "website";
  const ogImage = meta.ogImage ?? OG_IMAGE_DEFAULT;
  const title = escAttr(meta.title);
  const desc = escAttr(meta.description);

  // Build head tags
  const headTags = `
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

  // Build JSON-LD tags
  let ldTags = "";
  if (meta.jsonLd) {
    const schemas = Array.isArray(meta.jsonLd) ? meta.jsonLd : [meta.jsonLd];
    ldTags = schemas
      .map(
        (s) =>
          `<script type="application/ld+json">${JSON.stringify(s)}</script>`,
      )
      .join("\n    ");
    ldTags = `\n    ${ldTags}`;
  }

  // Strip generic default title/description, inject route-specific head tags
  let result = html
    .replace(/<title>[^<]*<\/title>/g, "")
    .replace(/<meta\s+name="description"[^>]*>/gi, "")
    .replace("</head>", `${headTags}${ldTags}\n  </head>`);

  // Inject static body content for bot crawlability.
  //
  // Strategy: insert a <div id="nuxa-seo-content"> immediately after <body>,
  // followed by an inline <script> that removes that div synchronously.
  // - Non-JS crawlers (social bots, AI crawlers) fetch the raw HTML and see
  //   the content directly.
  // - Browsers parse and immediately execute the removal script, so the div
  //   is gone before React's module bundle loads. createRoot renders into
  //   <div id="root"> with no conflict and no duplicate content.
  if (meta.bodyHtml) {
    const seoBlock = [
      `<div id="nuxa-seo-content" aria-hidden="true">${meta.bodyHtml}`,
      `</div>`,
      `<script>var _s=document.getElementById('nuxa-seo-content');_s&&_s.parentNode.removeChild(_s);</script>`,
    ].join("\n  ");
    // Use a regex to match only the real HTML <body> tag (which appears on its
    // own line with optional whitespace). This avoids matching '<body>' that
    // appears inside JavaScript string literals in Vite/Replit injected scripts.
    result = result.replace(/\n(\s*<body>)/, `\n$1\n  ${seoBlock}`);
  }

  return result;
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as true,
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
