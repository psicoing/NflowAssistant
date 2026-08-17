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
          {/* NUXA brand title */}
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-2">
            NUXA
          </h1>
          <p className="text-sm md:text-base text-indigo-300 tracking-widest uppercase mb-4">
            <span className="text-indigo-200 font-medium">bienestar emocional</span>
            <span className="mx-2 text-indigo-600">·</span>
            <span>emotional wellbeing</span>
            <span className="mx-2 text-indigo-600">·</span>
            <span className="text-indigo-400">bien-être émotionnel</span>
          </p>

          {/* Emotion tags — trilingüe */}
          <div className="flex flex-wrap justify-center gap-1.5 max-w-5xl mx-auto mb-8">
            {[
              { es: "estrés emocional",   en: "emotional stress",   fr: "stress émotionnel" },
              { es: "ansiedad diaria",      en: "daily anxiety",      fr: "anxiété quotidienne" },
              { es: "bloqueo emocional",    en: "emotional block",    fr: "blocage émotionnel" },
              { es: "cansancio mental",     en: "mental fatigue",     fr: "fatigue mentale" },
            ].map((tag) => (
              <span
                key={tag.es}
                className="text-[11px] text-indigo-300 border border-indigo-500/30 bg-indigo-500/10 rounded-full px-2.5 py-1 leading-tight whitespace-nowrap"
              >
                <span className="text-indigo-200 font-medium">{tag.es}</span>
                <span className="text-indigo-600 mx-1">·</span>
                <span className="text-indigo-400">{tag.en}</span>
                <span className="text-indigo-700 mx-1">·</span>
                <span className="text-indigo-500">{tag.fr}</span>
              </span>
            ))}
          </div>

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

        {/* Mini banner — Por qué no somos ChatGPT */}
        <div className="max-w-5xl mx-auto w-full px-4 pb-10">
          <button
            onClick={() => setLocation("/#comparativa")}
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
