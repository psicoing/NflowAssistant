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

function legalPageSchema(opts: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: opts.name,
    description: opts.description,
    url: opts.url,
    inLanguage: "es",
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  };
}

type TopicSeoContent = {
  slug: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  experience: string;
  situations: string[];
  factors: string;
  strategies: string[];
  professional: string;
  nuxa: string;
  related: string[];
};

const topicSeoContent: TopicSeoContent[] = [
  {
    slug: "bienestar-emocional",
    title: "Bienestar emocional: cómo cuidar lo que sientes | NUXA",
    description: "Guía práctica para entender y cuidar tu bienestar emocional con estrategias sencillas, apoyo psicoeducativo y orientación responsable.",
    h1: "Bienestar emocional: cómo cuidar lo que sientes",
    intro: "El bienestar emocional no significa sentirse bien todo el tiempo. Consiste en reconocer lo que ocurre, disponer de recursos para afrontarlo y pedir apoyo cuando lo necesitas.",
    experience: "Puedes notar cambios en el ánimo, irritabilidad, cansancio, dificultad para concentrarte o la sensación de estar funcionando en automático. Estas señales merecen atención, sin convertirlas por sí solas en un diagnóstico.",
    situations: ["Cambios importantes, incertidumbre o exceso de responsabilidades.", "Dificultades para descansar, relacionarte o disfrutar de actividades.", "Necesidad de ordenar pensamientos y tomar decisiones con más calma."],
    factors: "El sueño, la salud física, la red de apoyo, el trabajo, las relaciones y las circunstancias económicas pueden influir. También importa la historia personal y el tiempo disponible para recuperarse.",
    strategies: ["Pon nombre a la emoción y anota qué la precedió.", "Protege rutinas básicas: descanso, alimentación, movimiento y contacto social.", "Divide los problemas grandes en un paso pequeño y revisa tus expectativas.", "Reserva momentos sin pantallas para respirar, escribir o hablar con alguien de confianza."],
    professional: "Consulta con un profesional sanitario si el malestar persiste, empeora o interfiere con tu vida diaria. Si existe riesgo inmediato, llama a emergencias (112 en España) o acude a urgencias.",
    nuxa: "NUXA puede ayudarte a explorar emociones, organizar ideas y practicar estrategias psicoeducativas. No realiza diagnósticos, no sustituye a profesionales y no es un servicio de emergencias.",
    related: ["ansiedad", "soledad", "autoestima"],
  },
  {
    slug: "ansiedad",
    title: "Ansiedad: qué puedes hacer cuando te sientes desbordado | NUXA",
    description: "Entiende qué puede haber detrás de la ansiedad y descubre estrategias psicoeducativas para recuperar calma y pedir apoyo a tiempo.",
    h1: "Ansiedad: qué puedes hacer cuando te sientes desbordado",
    intro: "La ansiedad es una respuesta de alerta ante una amenaza real o imaginada. Puede ser útil durante un momento puntual, pero resulta agotadora cuando aparece con frecuencia o parece difícil de controlar.",
    experience: "Puede manifestarse como preocupación constante, tensión, inquietud, palpitaciones, respiración rápida, molestias digestivas o evitación. La intensidad cambia de una persona a otra y no permite concluir por sí sola qué está ocurriendo.",
    situations: ["Preocupaciones sobre salud, familia, dinero, trabajo o estudios.", "Anticipar conversaciones, decisiones o situaciones sociales.", "Sensación de perder el control o dificultad para desconectar al final del día."],
    factors: "El estrés acumulado, la falta de sueño, el consumo de estimulantes, experiencias previas y la incertidumbre pueden aumentar la alerta. Evitar todo lo que preocupa puede aliviar a corto plazo y mantener el miedo a largo plazo.",
    strategies: ["Respira lentamente, alargando suavemente la exhalación, sin forzarte.", "Escribe la preocupación y separa lo que puedes controlar de lo que no.", "Reduce cafeína y procura horarios de sueño regulares.", "Acércate gradualmente a una situación segura en lugar de evitarla siempre."],
    professional: "Busca atención sanitaria si la ansiedad es intensa, recurrente, afecta al sueño o limita tus actividades. Ante dolor torácico intenso, desmayo, riesgo para ti o una urgencia, llama al 112.",
    nuxa: "NUXA ofrece conversación guiada y orientación psicoeducativa para identificar preocupaciones y practicar recursos. No diagnostica trastornos de ansiedad ni reemplaza tratamiento profesional.",
    related: ["ansiedad-antes-de-dormir", "estres-laboral", "soledad"],
  },
  {
    slug: "ansiedad-antes-de-dormir",
    title: "Ansiedad antes de dormir: cómo calmar la mente por la noche | NUXA",
    description: "Qué hacer si no puedes dormir por estrés o preocupación: hábitos nocturnos, regulación emocional y señales para consultar.",
    h1: "Ansiedad antes de dormir: cómo calmar la mente por la noche",
    intro: "Cuando llega la noche y disminuyen las distracciones, las preocupaciones pueden hacerse más visibles. Una mala noche no significa que exista un problema permanente, pero el círculo de alerta y cansancio merece cuidado.",
    experience: "Es habitual dar vueltas a conversaciones, revisar mentalmente tareas, anticipar el día siguiente o notar tensión corporal al acostarte. Mirar el reloj y exigirte dormir puede aumentar todavía más la activación.",
    situations: ["Dificultad para conciliar el sueño o volver a dormir tras despertarte.", "Preocupación por el trabajo, la salud, relaciones o decisiones pendientes.", "Cansancio diurno, irritabilidad y miedo a que vuelva a ocurrir."],
    factors: "Horarios irregulares, pantallas, cafeína, siestas largas, dolor, cambios vitales y estrés laboral pueden influir. También conviene considerar medicamentos o condiciones de salud con un profesional.",
    strategies: ["Crea una rutina tranquila y repetible durante la última hora.", "Anota antes de acostarte las tareas de mañana y las preocupaciones pendientes.", "Si no concilias el sueño, levántate un rato y haz algo calmado con poca luz.", "Mantén una hora de levantarte estable y evita compensar con exceso de siestas."],
    professional: "Consulta si el insomnio dura varias semanas, afecta al funcionamiento o se acompaña de cambios importantes de ánimo. Pide ayuda urgente si hay riesgo para tu seguridad.",
    nuxa: "NUXA puede guiar una reflexión nocturna y ayudarte a crear un plan de hábitos, sin prometer resultados ni sustituir una evaluación médica o psicológica.",
    related: ["ansiedad", "estres-laboral", "bienestar-emocional"],
  },
  {
    slug: "estres-laboral",
    title: "Estrés laboral: cómo reconocerlo y gestionarlo | NUXA",
    description: "Aprende a reconocer el estrés laboral y el agotamiento, proteger tus límites y saber cuándo conviene consultar con un profesional.",
    h1: "Estoy agotado por el trabajo: cómo reconocer y gestionar el estrés laboral",
    intro: "El estrés laboral aparece cuando las demandas percibidas superan los recursos disponibles durante un tiempo. No es una falta de capacidad: a menudo señala que hay que revisar cargas, límites y apoyos.",
    experience: "Puedes sentir tensión antes de empezar, dificultad para desconectar, errores, irritabilidad, cansancio o pérdida de motivación. El agotamiento laboral no se confirma con una lista online y puede coexistir con problemas físicos o emocionales.",
    situations: ["Plazos constantes, falta de control, cambios organizativos o conflicto con el equipo.", "Responder mensajes fuera de horario y no recuperar energía.", "Sensación de que el trabajo ocupa todo el espacio personal."],
    factors: "Influyen la carga y autonomía, la claridad de funciones, el reconocimiento, la conciliación y la seguridad laboral. La falta de descanso y apoyo puede amplificar el impacto.",
    strategies: ["Haz visible tu carga y prioriza con tu responsable cuando sea posible.", "Define un cierre de jornada y silencia notificaciones fuera de horario.", "Alterna tareas exigentes con pausas breves y movimiento.", "Busca apoyo en personas de confianza, representación laboral o prevención de riesgos."],
    professional: "Consulta si el cansancio, la ansiedad, el bajo ánimo o los síntomas físicos persisten. Si tu seguridad está en riesgo o aparecen ideas de hacerte daño, contacta con emergencias o una línea de crisis de tu país.",
    nuxa: "NUXA ayuda a ordenar factores de estrés y preparar conversaciones sobre límites mediante orientación psicoeducativa. No diagnostica burnout ni sustituye servicios sanitarios o laborales.",
    related: ["ansiedad", "limites-sin-culpa", "ansiedad-antes-de-dormir"],
  },
  {
    slug: "duelo",
    title: "Cómo afrontar un duelo y la pérdida de un ser querido | NUXA",
    description: "Orientación psicoeducativa para afrontar un duelo: emociones, rutinas de cuidado, apoyo social y cuándo consultar.",
    h1: "Cómo afrontar la pérdida de un ser querido",
    intro: "El duelo es una respuesta humana a una pérdida. No tiene un calendario único: pueden alternarse tristeza, enfado, culpa, alivio, confusión y momentos de calma.",
    experience: "Puede costar aceptar lo ocurrido, concentrarse, dormir o mantener rutinas. Las fechas señaladas y los recordatorios pueden reactivar el dolor; esto no significa que estés retrocediendo.",
    situations: ["Cambios en la vida cotidiana y responsabilidades tras la pérdida.", "Necesidad de hablar de la persona o, al contrario, de tener espacios de silencio.", "Dificultades para explicar a niños y adolescentes lo que sucede."],
    factors: "La relación, las circunstancias de la muerte, pérdidas anteriores, apoyo disponible y situación económica pueden influir. Cada proceso combina factores personales y culturales.",
    strategies: ["Permítete emociones cambiantes sin compararte con otros duelos.", "Mantén necesidades básicas y acepta ayuda concreta de personas cercanas.", "Crea rituales o formas de recordar que tengan sentido para ti.", "Busca momentos de descanso y reduce decisiones no urgentes al principio."],
    professional: "Consulta si el sufrimiento no disminuye, impide funcionar o se acompaña de aislamiento extremo, consumo problemático o desesperanza. Ante peligro inmediato, llama al 112.",
    nuxa: "NUXA puede ofrecer un espacio de escucha y recursos para nombrar el duelo, siempre como apoyo psicoeducativo. No sustituye terapia, atención médica ni grupos especializados.",
    related: ["soledad", "autoestima", "bienestar-emocional"],
  },
  {
    slug: "soledad",
    title: "Me siento solo: qué puedo hacer para buscar apoyo | NUXA",
    description: "Si te sientes solo, descubre pasos realistas para conectar, cuidar tu estado emocional y reconocer cuándo pedir ayuda profesional.",
    h1: "Me siento solo: ¿qué puedo hacer?",
    intro: "La soledad no depende únicamente de estar físicamente sin compañía: también puede aparecer cuando no te sientes comprendido o conectado. Reconocerla es un primer paso, no una etiqueta sobre quién eres.",
    experience: "Puede haber tristeza, vacío, vergüenza, apatía o la impresión de que nadie se interesaría. A veces la soledad lleva a aislarse, y el aislamiento hace más difícil iniciar contacto.",
    situations: ["Mudanzas, cambios de etapa, teletrabajo o pérdida de una relación.", "Estar acompañado y seguir sintiendo distancia emocional.", "Querer contactar con alguien pero temer molestar o ser rechazado."],
    factors: "Influyen la red social, la autoestima, experiencias de rechazo, salud física, horarios y oportunidades de encuentro. Las redes digitales pueden ayudar, pero no siempre sustituyen el vínculo cercano.",
    strategies: ["Empieza por un contacto breve y concreto con alguien seguro.", "Únete a una actividad repetida relacionada con tus intereses.", "Practica expresar una necesidad sin esperar que la otra persona la adivine.", "Trata la autocrítica con la misma amabilidad que ofrecerías a un amigo."],
    professional: "Busca apoyo profesional si la soledad se acompaña de depresión, ansiedad, consumo problemático o desesperanza. Si piensas en hacerte daño, llama al 112 o acude a urgencias.",
    nuxa: "NUXA puede ayudarte a preparar conversaciones, explorar necesidades y planificar pequeños pasos de conexión. Es orientación emocional, no un sustituto de relaciones, terapia o emergencias.",
    related: ["autoestima", "duelo", "bienestar-emocional"],
  },
  {
    slug: "autoestima",
    title: "Cómo recuperar la autoestima con pasos realistas | NUXA",
    description: "Comprende la autoestima y practica formas realistas de reducir la autocrítica, reconocer fortalezas y pedir apoyo.",
    h1: "Cómo recuperar la autoestima sin exigirte perfección",
    intro: "La autoestima es la relación que mantienes contigo, no una puntuación fija. Puede cambiar según experiencias, críticas, comparaciones y etapas de vida.",
    experience: "Tal vez te cueste reconocer logros, temas equivocarte, necesites aprobación constante o interpretes un fallo como una prueba de que no vales. Estos pensamientos pueden aprenderse y también revisarse.",
    situations: ["Compararte con otras personas o con una versión ideal de ti.", "Dificultad para aceptar elogios, descansar o defender tus necesidades.", "Evitar oportunidades por miedo a no estar a la altura."],
    factors: "La historia familiar, el acoso, relaciones críticas, discriminación, cambios corporales y el estrés influyen. La autoestima baja también puede acompañar ansiedad o depresión.",
    strategies: ["Describe el hecho y separa la interpretación global sobre tu valor.", "Registra esfuerzos y avances pequeños, no solo resultados.", "Habla contigo con precisión y compasión, sin negar lo que quieres mejorar.", "Practica una conducta alineada con tus valores aunque aparezca inseguridad."],
    professional: "Consulta si la autocrítica, la tristeza o la ansiedad interfieren con tus relaciones y actividades. Pide ayuda urgente ante autolesiones o ideas de suicidio.",
    nuxa: "NUXA puede ayudarte a detectar pensamientos automáticos y diseñar ejercicios de reflexión. No diagnostica ni reemplaza un proceso terapéutico con un profesional.",
    related: ["limites-sin-culpa", "soledad", "ruptura-de-pareja"],
  },
  {
    slug: "ruptura-de-pareja",
    title: "Cómo superar una ruptura de pareja y cuidar de ti | NUXA",
    description: "Cómo afrontar una ruptura de pareja: duelo, límites de contacto, apoyo y estrategias para recuperar estabilidad.",
    h1: "Cómo superar una ruptura de pareja paso a paso",
    intro: "Una ruptura puede sentirse como una pérdida de planes, hábitos y seguridad, incluso cuando fue una decisión necesaria. Recuperarse no exige dejar de sentir de un día para otro.",
    experience: "Pueden aparecer tristeza, enfado, alivio, nostalgia, culpa o necesidad de revisar mensajes. Las emociones suelen fluctuar y no siguen un orden universal.",
    situations: ["Compartir vivienda, amistades, hijos o responsabilidades con la expareja.", "Dudar de la decisión y buscar respuestas repetidamente.", "Sentir miedo a la soledad o dificultad para imaginar una nueva etapa."],
    factors: "La duración y dinámica de la relación, el motivo de la ruptura, el apoyo disponible y la seguridad actual influyen. En relaciones con violencia, la prioridad es un plan seguro y apoyo especializado.",
    strategies: ["Establece límites de contacto que protejan tu recuperación y tus responsabilidades.", "Retoma rutinas básicas y actividades que no dependan de la pareja.", "Escribe qué aprendiste sin convertir la ruptura en un juicio sobre tu valor.", "Habla con alguien de confianza antes de tomar decisiones impulsivas."],
    professional: "Consulta si no puedes funcionar, hay violencia, acoso, consumo para afrontar el dolor o desesperanza persistente. Ante peligro, aléjate si puedes y llama al 112.",
    nuxa: "NUXA ofrece orientación para ordenar emociones y preparar límites o conversaciones difíciles. No realiza terapia de pareja ni sustituye ayuda legal, sanitaria o de emergencia.",
    related: ["duelo", "autoestima", "limites-sin-culpa"],
  },
  {
    slug: "limites-sin-culpa",
    title: "Cómo poner límites sin sentirme culpable | NUXA",
    description: "Aprende a poner límites con respeto, comunicar necesidades y manejar la culpa sin descuidar tus relaciones ni tu bienestar.",
    h1: "Cómo poner límites sin sentirme culpable",
    intro: "Un límite expresa lo que puedes hacer, aceptar o sostener. No controla a la otra persona: define tu participación y protege necesidades legítimas.",
    experience: "Puedes decir que sí por miedo al rechazo, resentirte después o sentir culpa al pedir espacio. La incomodidad inicial no demuestra que el límite sea egoísta.",
    situations: ["Peticiones de tiempo, dinero, cuidados o disponibilidad constante.", "Mensajes laborales fuera de horario o conversaciones que se vuelven agresivas.", "Familia o pareja que interpreta tus necesidades como falta de cariño."],
    factors: "La educación recibida, el miedo al conflicto, la dependencia económica, la cultura y experiencias de castigo influyen. La seguridad debe guiar la forma de poner límites.",
    strategies: ["Aclara qué necesitas, qué puedes ofrecer y qué harás si no se respeta.", "Usa frases breves en primera persona y evita justificarte sin fin.", "Practica con situaciones pequeñas y tolera la incomodidad posterior.", "Si hay amenazas o violencia, prioriza apoyo especializado y un plan de seguridad."],
    professional: "Consulta si la culpa, el miedo o el conflicto afectan mucho a tu vida. En situaciones de violencia, contacta con servicios especializados; ante riesgo inmediato, llama al 112.",
    nuxa: "NUXA puede ayudarte a ensayar mensajes y distinguir responsabilidad de culpa, con orientación psicoeducativa. No sustituye terapia, mediación segura ni recursos de violencia.",
    related: ["autoestima", "estres-laboral", "ruptura-de-pareja"],
  },
  {
    slug: "ansiedad-adolescentes",
    title: "Mi hijo adolescente tiene ansiedad: cómo ayudarle | NUXA",
    description: "Señales de ansiedad en adolescentes, formas de acompañar sin juzgar y cuándo buscar evaluación de un profesional sanitario.",
    h1: "Mi hijo adolescente tiene ansiedad: cómo puedo ayudarle",
    intro: "La adolescencia incluye cambios y retos, pero una ansiedad intensa o persistente puede necesitar apoyo. Acompañar empieza por escuchar sin convertir cada conversación en un interrogatorio.",
    experience: "Puede haber irritabilidad, problemas de sueño, dolores, evitación escolar o social, perfeccionismo, cambios en notas o búsqueda constante de seguridad. Los adolescentes no siempre describen la ansiedad con esa palabra.",
    situations: ["Presión académica, conflictos entre iguales, redes sociales o cambios familiares.", "Miedo a separarse, hablar en público, acudir a clase o cometer errores.", "Dificultad para diferenciar una preocupación puntual de una interferencia sostenida."],
    factors: "Temperamento, sueño, salud física, experiencias de acoso, dinámica familiar y exigencias del entorno pueden influir. No conviene atribuirlo todo a una etapa sin observar su impacto.",
    strategies: ["Valida la emoción sin confirmar que el peligro es inevitable.", "Pregunta qué necesita y acuerda un paso pequeño, manteniendo rutinas y descanso.", "Coordina, con su conocimiento y según su edad, familia, centro educativo y profesionales.", "Evita castigos por síntomas y reconoce el esfuerzo de afrontar situaciones."],
    professional: "Consulta con pediatría, medicina de familia o psicología infantil si hay interferencia, absentismo, autolesiones, cambios bruscos o consumo. Ante riesgo inmediato, llama al 112 y no dejes al adolescente solo.",
    nuxa: "NUXA puede ofrecer recursos generales para familias y ayudar a preparar conversaciones, pero no evalúa ni trata a menores sin el marco profesional y familiar adecuado.",
    related: ["ansiedad", "autoestima", "bienestar-emocional"],
  },
];

function topicSchemas(page: TopicSeoContent) {
  const url = `${SITE_URL}/${page.slug}`;
  return [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: page.h1,
      description: page.description,
      url,
      inLanguage: "es",
      isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
      publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Bienestar emocional", item: `${SITE_URL}/bienestar-emocional` },
        ...(page.slug === "bienestar-emocional" ? [] : [{ "@type": "ListItem", position: 3, name: page.h1.split(":")[0], item: url }]),
      ],
    },
  ];
}

function topicBodyHtml(page: TopicSeoContent) {
  const links = page.related.map((slug) => `<a href="/${slug}">${slug.replaceAll("-", " ")}</a>`).join(" · ");
  const hubLinks = page.slug === "bienestar-emocional"
    ? `<section><h2>¿Qué te preocupa hoy?</h2><ul>${topicSeoContent
        .filter((topic) => topic.slug !== page.slug)
        .map((topic) => `<li><a href="/${topic.slug}">${topic.h1}</a></li>`)
        .join("")}</ul></section>`
    : "";
  return `<article><nav aria-label="Migas de pan"><a href="/">Inicio</a> / <a href="/bienestar-emocional">Bienestar emocional</a></nav><h1>${page.h1}</h1><p>${page.intro}</p>${hubLinks}<h2>¿Qué puedes estar experimentando?</h2><p>${page.experience}</p><h2>Situaciones habituales</h2><ul>${page.situations.map((item) => `<li>${item}</li>`).join("")}</ul><h2>Qué puede influir</h2><p>${page.factors}</p><h2>Estrategias que pueden ayudar</h2><ul>${page.strategies.map((item) => `<li>${item}</li>`).join("")}</ul><h2>Cuándo consultar con un profesional</h2><p>${page.professional}</p><h2>Cómo puede orientarte NUXA</h2><p>${page.nuxa}</p><p><strong>En una emergencia, llama al 112 (España) o al número de emergencias de tu país.</strong> NUXA no es un servicio de emergencias.</p><p><a href="/prueba-gratis">Probar NUXA gratis</a> · Contenidos relacionados: ${links}</p></article>`;
}

const topicRouteMetadata: Record<string, RouteMeta> = Object.fromEntries(
  topicSeoContent.map((page) => [
    `/${page.slug}`,
    { title: page.title, description: page.description, canonical: `${SITE_URL}/${page.slug}`, ogType: "article", jsonLd: topicSchemas(page), bodyHtml: topicBodyHtml(page) },
  ]),
);

const routeMetadata: Record<string, RouteMeta> = {
  ...topicRouteMetadata,
  "/": {
    title: "NUXA - Tu asistente de bienestar emocional, disponible 24/7",
    description:
      "NUXA es tu asistente de bienestar emocional, disponible 24/7. Acompañamiento continuo y confidencial para personas, familias y trabajadores.",
    canonical: `${SITE_URL}`,
    jsonLd: [orgSchema, webSiteSchema],
    bodyHtml: `
      <main>
        <h1>NUXA — Tu asistente de bienestar emocional, disponible 24/7</h1>
        <p>NUXA ofrece acompañamiento emocional continuo, confidencial y accesible para personas, familias y trabajadores.</p>
        <h2>¿Por qué NUXA?</h2>
        <ul>
          <li>Disponible 24/7, sin listas de espera</li>
          <li>Totalmente confidencial y seguro</li>
          <li>Para individuos, familias y empresas</li>
          <li>Tecnología de IA avanzada con enfoque empático</li>
          <li>Planes desde €2.99/mes · 5 consultas gratuitas sin registro</li>
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
    title: "Prueba NUXA Gratis | 5 Consultas Sin Registro",
    description:
      "Prueba NUXA gratis sin registro. Habla con nuestro asistente de bienestar emocional ahora mismo. 5 consultas gratuitas para descubrir el apoyo emocional digital.",
    canonical: `${SITE_URL}/prueba-gratis`,
    jsonLd: orgSchema,
    bodyHtml: `
      <main>
        <h1>Prueba NUXA Gratis — 5 Consultas Sin Registro</h1>
        <p>Accede al asistente de bienestar emocional de NUXA sin necesidad de crear una cuenta. Tienes 5 consultas gratuitas para descubrir cómo la IA puede apoyar tu bienestar emocional.</p>
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
    title: "Ejemplos de Conversación | Asistente NUXA",
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
    title: "Quiénes Somos | NUXA - Bienestar emocional 24/7",
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
    title: "App Móvil NUXA | Bienestar emocional en tu bolsillo",
    description:
      "Instala NUXA desde tu navegador en iOS y Android. Tu asistente de bienestar emocional, disponible 24/7 desde cualquier lugar.",
    canonical: `${SITE_URL}/app-movil`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "MobileApplication",
      name: "NUXA — Asistente de bienestar emocional",
      description:
        "Tu asistente de bienestar emocional siempre contigo. Disponible 24/7 desde cualquier lugar.",
      operatingSystem: "iOS, Android",
      applicationCategory: "HealthApplication",
      offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
      url: `${SITE_URL}/app-movil`,
    },
    bodyHtml: `
      <main>
        <h1>App Móvil NUXA — Bienestar emocional en tu bolsillo</h1>
        <p>Instala NUXA desde tu navegador en iOS y Android. Tu asistente de bienestar emocional, disponible 24 horas, 7 días a la semana desde cualquier lugar.</p>
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
  "/control-shell": {
    title: "NUXA Control Shell | Bienestar Digital Seguro para Empresas",
    description:
      "Conoce NUXA Control Shell, una solución de bienestar digital y supervisión segura para organizaciones que quieren proteger a sus equipos.",
    canonical: `${SITE_URL}/control-shell`,
    jsonLd: orgSchema,
    bodyHtml: `
      <main>
        <h1>NUXA Control Shell — Bienestar Digital Seguro</h1>
        <p>Una solución de bienestar digital y supervisión segura para organizaciones que quieren proteger a sus equipos y gestionar el uso responsable de la tecnología.</p>
        <h2>Protección y control para organizaciones</h2>
        <ul>
          <li>Supervisión y políticas de uso configurables</li>
          <li>Protección de datos y privacidad</li>
          <li>Herramientas de bienestar para equipos</li>
        </ul>
        <p><a href="/empresa-privada">Soluciones para empresas</a> · <a href="/precios">Ver precios</a></p>
      </main>`,
  },
  "/test-bienestar": {
    title: "Test de Bienestar Emocional | NUXA",
    description:
      "Evalúa tu bienestar emocional con el test gratuito de NUXA y descubre recursos personalizados para cuidar tu salud mental.",
    canonical: `${SITE_URL}/test-bienestar`,
    jsonLd: orgSchema,
    bodyHtml: `
      <main>
        <h1>Test de Bienestar Emocional — NUXA</h1>
        <p>Evalúa de forma sencilla cómo te encuentras y descubre recursos prácticos para cuidar tu salud mental y tu bienestar emocional.</p>
        <ul>
          <li>Test gratuito y confidencial</li>
          <li>Resultado orientativo en pocos minutos</li>
          <li>Recursos de apoyo adaptados a tus necesidades</li>
        </ul>
        <p><a href="/recursos-gratuitos">Ver recursos gratuitos</a> · <a href="/prueba-gratis">Probar NUXA gratis</a></p>
      </main>`,
  },
  "/calculadora-burnout": {
    title: "Calculadora de Burnout Laboral | NUXA",
    description:
      "Calcula tu nivel orientativo de riesgo de burnout y descubre cómo NUXA puede ayudar a cuidar el bienestar emocional en el trabajo.",
    canonical: `${SITE_URL}/calculadora-burnout`,
    jsonLd: orgSchema,
    bodyHtml: `
      <main>
        <h1>Calculadora de Burnout Laboral — NUXA</h1>
        <p>Obtén una estimación orientativa de tu nivel de riesgo de agotamiento laboral y conoce estrategias para proteger tu bienestar emocional.</p>
        <ul>
          <li>Evaluación rápida y confidencial</li>
          <li>Orientación sobre estrés y agotamiento</li>
          <li>Recursos para personas y organizaciones</li>
        </ul>
        <p><a href="/empresa-privada">Bienestar mental para empresas</a> · <a href="/recursos-gratuitos">Más recursos</a></p>
      </main>`,
  },
  "/download-csv": {
    title: "Descargar Recursos de Bienestar | NUXA",
    description:
      "Descarga recursos y datos de bienestar emocional de NUXA para continuar trabajando en tu salud mental.",
    canonical: `${SITE_URL}/download-csv`,
    jsonLd: orgSchema,
    bodyHtml: `
      <main>
        <h1>Descargar Recursos de Bienestar — NUXA</h1>
        <p>Accede a materiales y recursos descargables para apoyar el bienestar emocional de personas, familias y equipos.</p>
        <p><a href="/recursos-gratuitos">Explorar recursos gratuitos</a> · <a href="/test-bienestar">Hacer el test de bienestar</a></p>
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
    title: "Iniciar Sesión | NUXA - Bienestar emocional",
    description:
      "Accede a tu cuenta NUXA. Continúa tu sesión con tu asistente de bienestar emocional.",
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
    jsonLd: legalPageSchema({
      name: "Términos y Condiciones de Uso | NUXA",
      description:
        "Términos y condiciones de uso de NUXA, plataforma de psicología IA.",
      url: `${SITE_URL}/legal/terminos`,
    }),
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
    jsonLd: legalPageSchema({
      name: "Política de Privacidad | NUXA",
      description:
        "Cómo NUXA recoge, usa y protege los datos personales conforme al RGPD y la LOPD española.",
      url: `${SITE_URL}/legal/privacidad`,
    }),
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
    jsonLd: legalPageSchema({
      name: "Política de Cookies | NUXA",
      description:
        "Información sobre el uso de cookies y la gestión de preferencias de privacidad en NUXA.",
      url: `${SITE_URL}/legal/cookies`,
    }),
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
    jsonLd: legalPageSchema({
      name: "Aviso Legal | NUXA",
      description:
        "Información legal sobre el responsable, condiciones de uso y normativa aplicable a NUXA.",
      url: `${SITE_URL}/legal/aviso-legal`,
    }),
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

function routePathFromUrl(url: string): string {
  return url.split("?")[0].split("#")[0];
}

export function isPrerenderablePublicPath(url: string): boolean {
  return Boolean(routeMetadata[routePathFromUrl(url)]);
}

function responseStatusForRoute(url: string): number {
  const routePath = routePathFromUrl(url);
  // Blog posts are a fixed published set. Returning a real 404 for unknown
  // slugs prevents search engines from indexing phantom article URLs.
  return /^\/blog\/[^/]+$/.test(routePath) && !routeMetadata[routePath]
    ? 404
    : 200;
}

export function injectRouteMetadata(html: string, url: string): string {
  const routePath = routePathFromUrl(url);
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
      res
        .status(responseStatusForRoute(url))
        .set({ "Content-Type": "text/html" })
        .end(injected);
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

  // Do not let express.static serve the directory index for `/` directly.
  // The catch-all below must enrich index.html with route-specific SEO data
  // before it is returned for the homepage or any SPA public route.
  app.use(express.static(distPath, { index: false }));

  // fall through to index.html — inject route-specific metadata before sending
  app.use("*", (req, res) => {
    const indexPath = path.resolve(distPath, "index.html");
    fs.readFile(indexPath, "utf-8", (err, html) => {
      if (err) {
        res.status(500).send("Server error");
        return;
      }
      const injected = injectRouteMetadata(html, req.originalUrl);
       res.status(responseStatusForRoute(req.originalUrl)).set("Content-Type", "text/html").send(injected);
    });
  });
}
