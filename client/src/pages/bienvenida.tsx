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


export default function Bienvenida() {
  const [, setLocation] = useLocation();
  const destinations = ["/prueba-gratis", "/recursos", "/"];

  return (
    <>
      <SEOHead
        title="Bienvenida a NUXA | Welcome to NUXA | Bienvenue sur NUXA"
        description="Elige cómo quieres empezar con NUXA · Choose how to start · Choisissez comment commencer"
        canonicalUrl="https://nuxa.life/bienvenida"
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex flex-col overflow-x-hidden">

        {/* Top bar */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              <img src="/favicon.png" alt="NUXA chica" className="w-9 h-9 rounded-xl shadow-lg ring-2 ring-slate-950" />
              <img src="/icon-boy.png" alt="NUXA chico" className="w-9 h-9 rounded-xl shadow-lg ring-2 ring-slate-950" />
            </div>
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
          {/* NUXA brand title */}
          <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight mb-2">
            NUXA
          </h1>
          <p className="text-sm md:text-base text-indigo-300 tracking-widest uppercase mb-4">
            <span className="text-indigo-200 font-medium">bienestar emocional</span>
            <span className="mx-2 text-indigo-600">·</span>
            <span>emotional wellbeing</span>
            <span className="mx-2 text-indigo-600">·</span>
            <span className="text-indigo-400">bien-être émotionnel</span>
          </p>


          <p className="text-slate-500 text-sm">
            <span className="text-slate-400">Where would you like to begin?</span>
            {" · "}
            <span className="text-slate-600">Par où souhaitez-vous commencer ?</span>
          </p>
        </div>

        {/* Three paths */}
        <div className="max-w-5xl mx-auto w-full px-4 pb-12 grid grid-cols-1 md:grid-cols-3 gap-5">
          {PATHS.map((path, idx) => {
            const Icon = path.icon;
            return (
              <button
                key={path.href}
                onClick={() => setLocation(destinations[idx])}
                className={`group text-left bg-white/5 backdrop-blur-sm border ${path.border} rounded-2xl p-4 shadow-xl ${path.glow} hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col gap-3`}
              >
                {/* Icon + arrow row */}
                <div className="flex items-center justify-between">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${path.color} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${path.color} flex items-center justify-center shadow group-hover:scale-110 transition-transform`}>
                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>

                {/* Trilingüe content */}
                <div className="flex-1 space-y-2">
                  {/* ES */}
                  <div>
                    <span className="inline-block text-[9px] font-bold tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-400/20 rounded-full px-1.5 py-px mb-1">ES</span>
                    <p className="text-white font-bold text-sm leading-snug">{path.es.label}</p>
                    <p className="text-slate-400 text-xs leading-snug">{path.es.sub}</p>
                  </div>
                  {/* EN */}
                  <div>
                    <span className="inline-block text-[9px] font-bold tracking-widest text-blue-400 bg-blue-500/10 border border-blue-400/20 rounded-full px-1.5 py-px mb-1">EN</span>
                    <p className="text-slate-200 font-semibold text-sm leading-snug">{path.en.label}</p>
                    <p className="text-slate-500 text-xs leading-snug">{path.en.sub}</p>
                  </div>
                  {/* FR */}
                  <div>
                    <span className="inline-block text-[9px] font-bold tracking-widest text-violet-400 bg-violet-500/10 border border-violet-400/20 rounded-full px-1.5 py-px mb-1">FR</span>
                    <p className="text-slate-300 font-semibold text-sm leading-snug">{path.fr.label}</p>
                    <p className="text-slate-500 text-xs leading-snug">{path.fr.sub}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Mini banner — Por qué no somos ChatGPT */}
        <div className="max-w-5xl mx-auto w-full px-4 pb-10">
          <button
            onClick={() => {
              setLocation("/");
              setTimeout(() => {
                document.getElementById("comparativa")?.scrollIntoView({ behavior: "smooth" });
              }, 150);
            }}
            className="w-full group flex items-center justify-center gap-3 border border-white/10 bg-white/5 hover:bg-white/10 rounded-2xl px-6 py-3 transition-all duration-200"
          >
            <span className="text-slate-400 text-xs tracking-wide">
              <span className="text-slate-200 font-medium">Por qué no somos ChatGPT</span>
              <span className="mx-2 text-slate-600">·</span>
              <span>Why we're not ChatGPT</span>
              <span className="mx-2 text-slate-600">·</span>
              <span className="text-slate-500">Pourquoi nous ne sommes pas ChatGPT</span>
            </span>
            <span className="text-slate-500 group-hover:text-slate-300 transition-colors text-xs">→</span>
          </button>
        </div>

      </div>
    </>
  );
}
