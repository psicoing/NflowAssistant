import { Link } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { SEOHead } from "@/components/SEOHead";
import { StructuredData } from "@/components/StructuredData";
import { ArrowRight, CheckCircle2, HeartHandshake, ShieldAlert } from "lucide-react";

export type TopicPage = {
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

export const topicPages: TopicPage[] = [
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
    related: ["ansiedad", "soledad", "autoestima", "ansiedad-adolescentes"],
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
    related: ["ansiedad-antes-de-dormir", "estres-laboral", "soledad", "bienestar-emocional"],
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
    related: ["ansiedad", "ansiedad-antes-de-dormir", "limites-sin-culpa", "bienestar-emocional"],
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
    related: ["soledad", "bienestar-emocional", "autoestima"],
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
    related: ["limites-sin-culpa", "soledad", "ruptura-de-pareja", "bienestar-emocional"],
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
    related: ["duelo", "autoestima", "limites-sin-culpa", "soledad"],
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
    related: ["autoestima", "estres-laboral", "ruptura-de-pareja", "bienestar-emocional"],
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
    related: ["ansiedad", "autoestima", "soledad", "bienestar-emocional"],
  },
];

const pageMap = new Map(topicPages.map((page) => [page.slug, page]));

function Breadcrumbs({ page }: { page: TopicPage }) {
  return (
    <nav aria-label="Migas de pan" className="mb-8 text-sm text-slate-400">
      <Link href="/" className="hover:text-white">Inicio</Link>
      <span className="mx-2">/</span>
      <Link href="/bienestar-emocional" className="hover:text-white">Bienestar emocional</Link>
      {page.slug !== "bienestar-emocional" && <><span className="mx-2">/</span><span className="text-slate-300">{page.h1.split(":")[0]}</span></>}
    </nav>
  );
}

export default function BienestarTematico({ slug = "bienestar-emocional" }: { slug?: string }) {
  const page = pageMap.get(slug) ?? topicPages[0];
  const url = `https://nuxa.life/${page.slug}`;
  const relatedPages = page.related.map((relatedSlug) => pageMap.get(relatedSlug)).filter(Boolean) as TopicPage[];
  const articleSchema = {
    headline: page.h1,
    description: page.description,
    url,
    inLanguage: "es",
    isPartOf: { "@type": "WebSite", name: "NUXA", url: "https://nuxa.life" },
    publisher: { "@type": "Organization", name: "NUXA", url: "https://nuxa.life" },
  };
  const breadcrumbSchema = {
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: "https://nuxa.life/" },
      { "@type": "ListItem", position: 2, name: "Bienestar emocional", item: "https://nuxa.life/bienestar-emocional" },
      ...(page.slug === "bienestar-emocional" ? [] : [{ "@type": "ListItem", position: 3, name: page.h1.split(":")[0], item: url }]),
    ],
  };

  return (
    <div className="min-h-screen bg-nflow-dark text-white">
      <Header />
      <SEOHead title={page.title} description={page.description} canonicalUrl={`/${page.slug}`} ogTitle={page.title} ogDescription={page.description} ogUrl={url} ogType="article" />
      <StructuredData type="Article" data={articleSchema} />
      <StructuredData type="BreadcrumbList" data={breadcrumbSchema} />
      <main className="pt-28">
        <div className="max-w-5xl mx-auto px-4 pb-16">
          <Breadcrumbs page={page} />
          <article className="max-w-3xl">
            <p className="text-sm uppercase tracking-widest text-teal-400 mb-4">Guía de bienestar emocional</p>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">{page.h1}</h1>
            <p className="text-xl text-slate-300 leading-relaxed mb-10">{page.intro}</p>
            {page.slug === "bienestar-emocional" && (
              <section className="mb-12" aria-labelledby="temas-bienestar">
                <h2 id="temas-bienestar" className="text-2xl font-semibold mb-4">¿Qué te preocupa hoy?</h2>
                <p className="text-slate-300 leading-relaxed mb-5">
                  Explora orientaciones prácticas según la situación que estés viviendo.
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {topicPages.filter((topic) => topic.slug !== page.slug).map((topic) => (
                    <Link
                      key={topic.slug}
                      href={`/${topic.slug}`}
                      className="rounded-xl border border-slate-700 bg-slate-900/50 p-4 text-slate-200 hover:border-teal-400 hover:text-white"
                    >
                      {topic.h1} <span className="text-teal-400">→</span>
                    </Link>
                  ))}
                </div>
              </section>
            )}
            <section className="space-y-4 mb-10">
              <h2 className="text-2xl font-semibold">¿Qué puedes estar experimentando?</h2>
              <p className="text-slate-300 leading-relaxed">{page.experience}</p>
            </section>
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">Situaciones habituales</h2>
              <ul className="space-y-3 text-slate-300">
                {page.situations.map((item) => <li key={item} className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />{item}</li>)}
              </ul>
            </section>
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-3">Qué puede influir</h2>
              <p className="text-slate-300 leading-relaxed">{page.factors}</p>
            </section>
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">Estrategias que pueden ayudar</h2>
              <div className="grid gap-3">
                {page.strategies.map((item, index) => <div key={item} className="rounded-xl border border-slate-700 bg-slate-900/50 p-4 text-slate-300"><span className="text-teal-400 font-semibold mr-2">{index + 1}.</span>{item}</div>)}
              </div>
            </section>
            <section className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 mb-10">
              <h2 className="text-2xl font-semibold mb-3">Cuándo consultar con un profesional</h2>
              <p className="text-slate-300 leading-relaxed">{page.professional}</p>
            </section>
            <section className="rounded-2xl border border-teal-500/30 bg-teal-500/5 p-6 mb-10">
              <div className="flex gap-3">
                <HeartHandshake className="w-6 h-6 text-teal-400 shrink-0" />
                <div><h2 className="text-2xl font-semibold mb-3">Cómo puede orientarte NUXA</h2><p className="text-slate-300 leading-relaxed">{page.nuxa}</p></div>
              </div>
            </section>
            <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-5 mb-10 flex gap-3">
              <ShieldAlert className="w-5 h-5 text-red-300 shrink-0 mt-0.5" />
              <p className="text-sm text-slate-300">Si existe peligro inmediato, ideas de hacerte daño o una urgencia médica, llama al 112 (España) o al número de emergencias de tu país. NUXA no es un servicio de emergencias.</p>
            </div>
            <div className="flex flex-wrap gap-4 mb-12">
              <Link href="/prueba-gratis" className="inline-flex items-center gap-2 rounded-xl bg-teal-500 px-5 py-3 font-semibold text-slate-950 hover:bg-teal-400">Probar NUXA gratis <ArrowRight className="w-4 h-4" /></Link>
              <Link href="/recursos-gratuitos" className="inline-flex items-center rounded-xl border border-slate-600 px-5 py-3 text-slate-200 hover:border-teal-400">Ver recursos gratuitos</Link>
            </div>
            <section>
              <h2 className="text-2xl font-semibold mb-4">También puede interesarte</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {relatedPages.map((related) => <Link key={related.slug} href={`/${related.slug}`} className="rounded-xl border border-slate-700 p-4 text-slate-300 hover:border-teal-400 hover:text-white">{related.h1} <span className="text-teal-400">→</span></Link>)}
              </div>
            </section>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}