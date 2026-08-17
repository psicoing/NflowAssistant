import { useLocation } from "wouter";
import { ArrowRight, Sparkles, BookOpen, LogIn } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";

const PATHS = [
  {
    icon: Sparkles,
    color: "from-emerald-500 to-teal-500",
    border: "border-emerald-500/30 hover:border-emerald-400/60",
    glow: "hover:shadow-emerald-500/20",
    href: "/prueba-gratis",
    es: {
      label: "Prueba NUXA gratis",
      sub: "Sin tarjeta · Sin registro · En 2 minutos",
    },
    en: {
      label: "Try NUXA for free",
      sub: "No card · No signup · Ready in 2 minutes",
    },
    fr: {
      label: "Essayez NUXA gratuitement",
      sub: "Sans carte · Sans inscription · En 2 minutes",
    },
  },
  {
    icon: BookOpen,
    color: "from-blue-500 to-indigo-500",
    border: "border-blue-500/30 hover:border-blue-400/60",
    glow: "hover:shadow-blue-500/20",
    href: "/recursos",
    es: {
      label: "Recursos gratis",
      sub: "Guías, técnicas y protocolos clínicos reales",
    },
    en: {
      label: "Free resources",
      sub: "Guides, techniques & real clinical protocols",
    },
    fr: {
      label: "Ressources gratuites",
      sub: "Guides, techniques et protocoles cliniques réels",
    },
  },
  {
    icon: LogIn,
    color: "from-violet-500 to-purple-600",
    border: "border-violet-500/30 hover:border-violet-400/60",
    glow: "hover:shadow-violet-500/20",
    href: "/login",
    es: {
      label: "Entrar a la app",
      sub: "Ya tengo mi cuenta · Acceso directo",
    },
    en: {
      label: "Enter the app",
      sub: "I already have an account · Direct access",
    },
    fr: {
      label: "Accéder à l'application",
      sub: "J'ai déjà un compte · Accès direct",
    },
  },
];

const WHY_NOT = [
  {
    icon: "🗂️",
    es: { t: "Más organizado", s: "Bloques temáticos estructurados" },
    en: { t: "More organised", s: "Structured thematic blocks" },
    fr: { t: "Plus organisé", s: "Blocs thématiques structurés" },
  },
  {
    icon: "📋",
    es: { t: "Seguridad clínica", s: "Cita DSM-5-TR y CIE-11" },
    en: { t: "Clinical safety", s: "References DSM-5-TR & ICD-11" },
    fr: { t: "Sécurité clinique", s: "Réf. DSM-5-TR et CIM-11" },
  },
  {
    icon: "🚨",
    es: { t: "Protocolos de crisis", s: "Teléfonos reales (024, 112…)" },
    en: { t: "Crisis protocols", s: "Real emergency numbers (112…)" },
    fr: { t: "Protocoles de crise", s: "Numéros réels (15, 112…)" },
  },
  {
    icon: "📚",
    es: { t: "Psicoeducación real", s: "Mitos, verdades y diagnóstico" },
    en: { t: "Real psychoeducation", s: "Myths, facts & diagnosis" },
    fr: { t: "Psychoéducation réelle", s: "Mythes, faits et diagnostic" },
  },
  {
    icon: "📍",
    es: { t: "Recursos locales", s: "Adaptados a tu ciudad" },
    en: { t: "Local resources", s: "Tailored to your city" },
    fr: { t: "Ressources locales", s: "Adaptées à votre ville" },
  },
  {
    icon: "🛡️",
    es: { t: "Derivación responsable", s: "Siempre visible y clara" },
    en: { t: "Responsible referral", s: "Always visible and clear" },
    fr: { t: "Orientation responsable", s: "Toujours visible et claire" },
  },
];

export default function Bienvenida() {
  const [, setLocation] = useLocation();

  return (
    <>
      <SEOHead
        title="Bienvenida a NUXA | Welcome to NUXA | Bienvenue sur NUXA"
        description="Elige cómo quieres empezar con NUXA · Choose how to start · Choisissez comment commencer"
        canonicalUrl="https://nuxa.life/bienvenida"
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex flex-col">

        {/* Top bar */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <div className="flex items-center gap-3">
            <img src="/favicon.png" alt="NUXA" className="w-9 h-9 rounded-xl shadow-lg" />
            <span className="text-white font-bold text-xl tracking-tight">NUXA</span>
          </div>
          <button
            onClick={() => setLocation("/")}
            className="text-slate-400 hover:text-white text-sm transition-colors"
          >
            nuxa.life ↗
          </button>
        </div>

        {/* Hero */}
        <div className="text-center px-4 pt-10 pb-8">
          <p className="text-indigo-300 text-xs font-semibold uppercase tracking-widest mb-3">
            ES · EN · FR
          </p>
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-3">
            ¿Por dónde quieres empezar?
          </h1>
          <p className="text-slate-400 text-base md:text-lg max-w-xl mx-auto">
            <span className="text-slate-300">Where would you like to begin?</span>
            {" · "}
            <span className="text-slate-500">Par où souhaitez-vous commencer ?</span>
          </p>
        </div>

        {/* Three paths */}
        <div className="max-w-5xl mx-auto w-full px-4 pb-12 grid grid-cols-1 md:grid-cols-3 gap-5">
          {PATHS.map((path) => {
            const Icon = path.icon;
            return (
              <button
                key={path.href}
                onClick={() => setLocation(path.href)}
                className={`group text-left bg-white/5 backdrop-blur-sm border ${path.border} rounded-3xl p-7 shadow-xl ${path.glow} hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col gap-5`}
              >
                {/* Icon */}
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${path.color} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>

                {/* Trilingüe content */}
                <div className="flex-1 space-y-4">
                  {/* ES */}
                  <div>
                    <span className="inline-block text-[10px] font-bold tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-400/20 rounded-full px-2 py-0.5 mb-1.5">ES</span>
                    <p className="text-white font-bold text-lg leading-snug">{path.es.label}</p>
                    <p className="text-slate-400 text-sm">{path.es.sub}</p>
                  </div>
                  {/* EN */}
                  <div>
                    <span className="inline-block text-[10px] font-bold tracking-widest text-blue-400 bg-blue-500/10 border border-blue-400/20 rounded-full px-2 py-0.5 mb-1.5">EN</span>
                    <p className="text-slate-200 font-semibold text-base leading-snug">{path.en.label}</p>
                    <p className="text-slate-500 text-sm">{path.en.sub}</p>
                  </div>
                  {/* FR */}
                  <div>
                    <span className="inline-block text-[10px] font-bold tracking-widest text-violet-400 bg-violet-500/10 border border-violet-400/20 rounded-full px-2 py-0.5 mb-1.5">FR</span>
                    <p className="text-slate-300 font-semibold text-base leading-snug">{path.fr.label}</p>
                    <p className="text-slate-500 text-sm">{path.fr.sub}</p>
                  </div>
                </div>

                {/* Arrow */}
                <div className={`self-end w-9 h-9 rounded-full bg-gradient-to-br ${path.color} flex items-center justify-center shadow group-hover:scale-110 transition-transform`}>
                  <ArrowRight className="w-4 h-4 text-white" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div className="max-w-5xl mx-auto w-full px-4 mb-8">
          <div className="border-t border-white/10 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-950 px-4">
              <p className="text-slate-500 text-xs text-center">
                Por qué no somos ChatGPT · Why we're not ChatGPT · Pourquoi nous ne sommes pas ChatGPT
              </p>
            </div>
          </div>
        </div>

        {/* Why not ChatGPT — 6 blocks */}
        <div className="max-w-5xl mx-auto w-full px-4 pb-16 grid grid-cols-2 md:grid-cols-3 gap-4">
          {WHY_NOT.map((item, i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-2"
            >
              <span className="text-2xl">{item.icon}</span>
              <div className="space-y-1">
                <p className="text-white font-bold text-sm">{item.es.t}</p>
                <p className="text-slate-400 text-xs leading-tight">{item.es.s}</p>
              </div>
              <div className="border-t border-white/10 pt-2 space-y-1">
                <p className="text-slate-300 font-semibold text-xs">{item.en.t} <span className="text-slate-600">·</span> <span className="text-slate-400 font-normal">{item.fr.t}</span></p>
                <p className="text-slate-600 text-[11px] leading-tight">{item.en.s}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="text-center pb-8 px-4">
          <p className="text-slate-600 text-xs">
            NUXA · Salud mental profesional · Professional mental health · Santé mentale professionnelle
          </p>
        </div>

      </div>
    </>
  );
}
