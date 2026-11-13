import { ArrowDown, BookOpenCheck, Braces, MessagesSquare, ScanSearch, ShieldCheck, Workflow } from "lucide-react";
import { useLanguageContext } from "@/components/LanguageProvider";

const copy = {
  es: {
    eyebrow: "Bajo el capó",
    title: "Una conversación bien pensada,",
    titleAccent: "no una respuesta enlatada.",
    intro: "NUXA combina contexto, revisión y criterio conversacional. Cada parte tiene un papel concreto — y límites que conviene conocer.",
    steps: [
      { label: "Contexto de trabajo", title: "Recuerda lo relevante de esta conversación", body: "Usa fragmentos literales de la conversación actual dentro de un límite. Las correcciones posteriores prevalecen; lo que queda fuera no se inventa ni se recuerda para siempre.", tag: "Acotado · extractivo" },
      { label: "Revisión de afirmaciones", title: "Separa lo que cuentas de lo que se interpreta", body: "Distingue hechos relatados, hipótesis, posibilidades y datos desconocidos. Comprueba que las referencias respalden la afirmación concreta, sin convertir una cita en certeza.", tag: "Atribución · referencias" },
      { label: "Consulta de evidencia", title: "Busca apoyo documental cuando está disponible", body: "Puede recuperar fragmentos de una base científica de alcance limitado. Si no encuentra algo pertinente, puede seguir acompañando sin fingir que consultó una fuente.", tag: "Cobertura limitada" },
      { label: "Estrategia conversacional", title: "Escucha, aclara o propone un paso", body: "La conversación puede pedir escucha, una pregunta útil o una opción práctica. No fuerza una técnica o una fórmula fija en cada respuesta.", tag: "Adaptable · sin guion fijo" },
      { label: "Modos de presentación", title: "Distintas formas, la misma orientación", body: "Los formatos de conversación cambian cómo se presenta la respuesta, no la identidad de NUXA ni sus pautas de seguridad.", tag: "Formato ≠ criterio" },
    ],
    noteTitle: "Lo que esto no significa",
    note: "El contexto puede estar incompleto y la base documental no cubre todos los temas. La revisión ayuda a cuidar las respuestas, pero no garantiza que sean perfectas ni que toda respuesta esté validada científicamente. NUXA ofrece bienestar emocional; no diagnostica, trata ni cura.",
    flow: "Cómo se construye una respuesta",
  },
  en: {
    eyebrow: "Under the hood",
    title: "A conversation designed with care,",
    titleAccent: "not a canned reply.",
    intro: "NUXA brings together context, review and conversational judgement. Each part has a specific role — and limits worth knowing.",
    steps: [
      { label: "Working context", title: "Keeps relevant details from this conversation", body: "It uses literal excerpts from the current conversation within a limit. Later corrections take precedence; what falls outside that boundary is not invented or remembered forever.", tag: "Bounded · extractive" },
      { label: "Claim review", title: "Separates what you share from interpretation", body: "It distinguishes reported facts, hypotheses, possibilities and unknowns. References are checked against the specific claim, rather than treated as certainty.", tag: "Attribution · references" },
      { label: "Evidence retrieval", title: "Looks for documentary support when available", body: "It can retrieve excerpts from a scientific collection with limited coverage. If nothing relevant is found, it can still offer support without pretending a source was consulted.", tag: "Limited coverage" },
      { label: "Conversation strategy", title: "Listens, clarifies or offers a next step", body: "A conversation may call for listening, a useful question or a practical option. It does not force the same technique or formula into every reply.", tag: "Adaptive · no fixed script" },
      { label: "Presentation modes", title: "Different formats, the same orientation", body: "Conversation formats change how a reply is presented, not NUXA’s identity or safety guidance.", tag: "Format ≠ judgement" },
    ],
    noteTitle: "What this does not mean",
    note: "Context may be incomplete, and the evidence collection does not cover every topic. Review helps guide responses, but cannot guarantee perfection or that every reply is scientifically validated. NUXA supports emotional wellbeing; it does not diagnose, treat or cure.",
    flow: "How a response takes shape",
  },
  fr: {
    eyebrow: "Dans les coulisses",
    title: "Une conversation pensée avec soin,",
    titleAccent: "pas une réponse toute faite.",
    intro: "NUXA associe contexte, révision et discernement conversationnel. Chaque élément a un rôle précis — et des limites qu’il vaut mieux connaître.",
    steps: [
      { label: "Contexte de travail", title: "Garde les éléments utiles de cet échange", body: "Le système utilise des extraits littéraux de la conversation en cours, dans une limite définie. Les corrections ultérieures priment ; ce qui sort de ce cadre n’est ni inventé ni mémorisé indéfiniment.", tag: "Limité · extractif" },
      { label: "Révision des affirmations", title: "Distingue votre récit de son interprétation", body: "Il différencie les faits rapportés, les hypothèses, les possibilités et les inconnues. Les références sont confrontées à l’affirmation précise, sans être prises pour une certitude.", tag: "Attribution · références" },
      { label: "Recherche documentaire", title: "Cherche des sources lorsqu’elles sont disponibles", body: "Il peut retrouver des extraits dans une base scientifique à la couverture limitée. S’il ne trouve rien de pertinent, il peut continuer à accompagner sans prétendre avoir consulté une source.", tag: "Couverture limitée" },
      { label: "Stratégie conversationnelle", title: "Écoute, clarifie ou propose une étape", body: "Un échange peut appeler une écoute attentive, une question utile ou une piste concrète. Aucune technique ni formule unique n’est imposée à chaque réponse.", tag: "Adaptable · sans script fixe" },
      { label: "Modes de présentation", title: "Des formats différents, la même ligne", body: "Les formats changent la présentation de la réponse, pas l’identité de NUXA ni ses repères de sécurité.", tag: "Format ≠ discernement" },
    ],
    noteTitle: "Ce que cela ne signifie pas",
    note: "Le contexte peut être incomplet et la base documentaire ne couvre pas tous les sujets. La révision aide à encadrer les réponses, sans garantir leur perfection ni une validation scientifique de chacune. NUXA accompagne le bien-être émotionnel ; elle ne diagnostique, ne traite et ne guérit pas.",
    flow: "Comment une réponse se construit",
  },
} as const;

const icons = [MessagesSquare, ScanSearch, BookOpenCheck, Workflow, Braces];

export default function TechnicalStrengthsSection() {
  const { currentLanguage } = useLanguageContext();
  const language = currentLanguage === "en" || currentLanguage === "fr" ? currentLanguage : "es";
  const content = copy[language];

  return (
    <section id="technical-strengths" aria-labelledby="technical-strengths-title" className="relative overflow-hidden bg-[#eff5f1] px-5 pt-8 pb-20 text-[#183238] sm:px-8 sm:pt-10 sm:pb-24 lg:pt-12 lg:pb-28">
      <span id="testimonials" aria-hidden="true" className="pointer-events-none absolute top-0" />
      <div className="pointer-events-none absolute -right-28 top-20 h-80 w-80 rounded-full border border-[#c6d8d0]/70" />
      <div className="pointer-events-none absolute -right-12 top-36 h-48 w-48 rounded-full border border-[#c6d8d0]/70" />
      <div className="relative mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#b9cec5] bg-[#e2eee8] px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#315d54]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d9794c]" />
            {content.eyebrow}
          </p>
          <h2 id="technical-strengths-title" className="max-w-xl text-4xl font-semibold leading-[1.08] tracking-[-0.045em] sm:text-5xl lg:text-[3.55rem]">
            {content.title} <span className="text-[#bd6240]">{content.titleAccent}</span>
          </h2>
          <p className="mt-6 max-w-lg text-base leading-7 text-[#496166] sm:text-lg sm:leading-8">{content.intro}</p>

          <div className="mt-9 hidden items-center gap-4 border-t border-[#cad9d2] pt-5 text-sm font-medium text-[#45615e] lg:flex">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#183238] text-[#edf5f0]">
              <ArrowDown className="h-4 w-4" aria-hidden="true" />
            </span>
            <span>{content.flow}</span>
          </div>
          <div className="mt-9 flex items-center gap-4 border-t border-[#cad9d2] pt-5 text-sm font-medium text-[#45615e] lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#183238] text-[#edf5f0]">
              <ArrowDown className="h-4 w-4" aria-hidden="true" />
            </span>
            <span>{content.flow}</span>
          </div>
        </div>

        <div className="relative">
          <div className="absolute bottom-12 left-[1.15rem] top-12 w-px bg-[#bfd1c8] sm:left-[1.4rem]" aria-hidden="true" />
          <ol className="space-y-3">
            {content.steps.map((step, index) => {
              const Icon = icons[index] ?? MessagesSquare;
              return (
                <li key={step.label} className="group relative grid grid-cols-[2.4rem_1fr] gap-3 sm:grid-cols-[3rem_1fr] sm:gap-5">
                  <div className="relative z-10 mt-5 flex h-9 w-9 items-center justify-center rounded-xl border border-[#c3d5cc] bg-[#eff5f1] text-[#315d54] transition-colors duration-200 group-hover:border-[#bd6240] group-hover:bg-[#183238] group-hover:text-[#f4f5ec] motion-reduce:transition-none sm:mt-6 sm:h-11 sm:w-11">
                    <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} aria-hidden="true" />
                  </div>
                  <article className="rounded-2xl border border-[#d3e0d9] bg-[#f8faf6] px-5 py-5 transition-colors duration-200 group-hover:border-[#a9c3b7] group-hover:bg-white sm:px-7 sm:py-6 motion-reduce:transition-none">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                      <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#bd6240]">{step.label}</p>
                      <span className="rounded-full bg-[#e7eee9] px-2.5 py-1 font-mono text-[10px] font-semibold tracking-wide text-[#56716a]">{step.tag}</span>
                    </div>
                    <h3 className="text-lg font-semibold leading-snug tracking-[-0.02em] text-[#183238] sm:text-xl">{step.title}</h3>
                    <p className="mt-2.5 max-w-2xl text-sm leading-6 text-[#52686b] sm:text-[15px] sm:leading-7">{step.body}</p>
                  </article>
                </li>
              );
            })}
          </ol>

          <aside className="mt-7 rounded-2xl border border-[#d6b59f] bg-[#f4e8de] p-5 sm:ml-16 sm:p-6">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#a65135]" strokeWidth={1.8} aria-hidden="true" />
              <div>
                <h3 className="text-sm font-bold text-[#743e2e]">{content.noteTitle}</h3>
                <p className="mt-2 text-sm leading-6 text-[#664f45]">{content.note}</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
