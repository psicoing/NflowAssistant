import { useLocation } from "wouter";
import {
  ArrowRight,
  Sparkles,
  BookOpen,
  LogIn,
  BrainCircuit,
  ShieldCheck,
  Clock3,
} from "lucide-react";
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
    href: "/recursos-gratuitos",
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

  const openComparison = () => {
    setLocation("/");
    let attempts = 0;
    const scrollToComparison = () => {
      const element = document.getElementById("comparativa");
      if (element) {
        const y = element.getBoundingClientRect().top + window.scrollY - 24;
        window.scrollTo({ top: y, behavior: "smooth" });
      } else if (attempts < 20) {
        attempts += 1;
        window.setTimeout(scrollToComparison, 100);
      }
    };
    window.setTimeout(scrollToComparison, 120);
  };

  return (
    <>
      <SEOHead
        title="Bienvenida a NUXA | Welcome to NUXA | Bienvenue sur NUXA"
        description="Elige cómo quieres empezar con NUXA · Choose how to start · Choisissez comment commencer"
        canonicalUrl="https://nuxa.life/bienvenida"
      />

      <div className="relative isolate min-h-screen overflow-hidden bg-slate-950 text-white">
        {/* Ambient light keeps the page warm and dimensional without adding assets. */}
        <div className="pointer-events-none absolute -left-40 top-24 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-40 top-72 h-[28rem] w-[28rem] rounded-full bg-violet-500/15 blur-3xl" />
        <div className="pointer-events-none absolute left-1/2 top-[38rem] h-80 w-80 -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 sm:px-6">
          {/* Top bar */}
          <header className="flex items-center justify-between py-5 sm:py-7">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <img src="/favicon.png" alt="NUXA chica" className="h-10 w-10 rounded-2xl shadow-lg shadow-indigo-500/20 ring-2 ring-slate-950" />
                <img src="/icon-boy.png" alt="NUXA chico" className="h-10 w-10 rounded-2xl shadow-lg shadow-indigo-500/20 ring-2 ring-slate-950" />
              </div>
              <div>
                <span className="block text-base font-black tracking-[0.2em] text-white">NUXA</span>
                <span className="hidden text-[10px] uppercase tracking-[0.18em] text-slate-500 sm:block">Emotional wellbeing</span>
              </div>
            </div>
            <button
              onClick={() => setLocation("/")}
              className="rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-medium text-slate-400 transition-colors hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
            >
              nuxa.life <span className="ml-1 text-indigo-300">↗</span>
            </button>
          </header>

          {/* Differentiation banner: first meaningful message on mobile */}
          <button
            onClick={openComparison}
            className="group w-full rounded-2xl border border-indigo-300/20 bg-gradient-to-r from-indigo-500/[0.14] via-white/[0.06] to-violet-500/[0.12] p-px text-left shadow-2xl shadow-indigo-950/30 transition-all duration-300 hover:border-indigo-300/40 hover:shadow-indigo-500/10"
            aria-label="Descubre por qué NUXA no es ChatGPT"
          >
            <div className="flex items-center gap-3 rounded-[15px] px-4 py-3.5 sm:gap-4 sm:px-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 shadow-lg shadow-indigo-500/25">
                <BrainCircuit className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs font-bold text-white sm:text-sm">
                  <span>Por qué NUXA no es ChatGPT</span>
                  <span className="text-indigo-300/70">·</span>
                  <span className="font-medium text-indigo-100/80">Why NUXA is not ChatGPT</span>
                  <span className="text-indigo-300/70">·</span>
                  <span className="font-medium text-violet-100/75">Pourquoi NUXA n’est pas ChatGPT</span>
                </div>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-400 sm:text-xs">
                  Descubre qué hace diferente a NUXA · Discover what makes NUXA different · Découvrez ce qui rend NUXA différente
                </p>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-indigo-300 transition-transform group-hover:translate-x-1" />
            </div>
          </button>

          {/* Hero identity */}
          <section className="px-2 pb-8 pt-10 text-center sm:pb-10 sm:pt-14">
            <div className="mx-auto mb-5 flex w-fit items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-400/[0.07] px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-200/80">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.9)]" />
              <span>Tu espacio de bienestar · Your wellbeing space · Votre espace de bien-être</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white sm:text-4xl">
              Tu bienestar empieza aquí
            </h1>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-indigo-200 sm:text-4xl">
              Your wellbeing starts here
            </p>
            <p className="mt-1 text-2xl text-violet-200/80 sm:text-4xl">
              Votre bien-être commence ici
            </p>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
              Apoyo emocional inteligente, privado y disponible cuando lo necesitas
              <span className="mx-1.5 text-slate-600">·</span>
              Intelligent, private support whenever you need it
              <span className="mx-1.5 text-slate-600">·</span>
              Un soutien intelligent et privé, quand vous en avez besoin
            </p>
          </section>

          {/* Paths */}
          <section className="pb-8" aria-label="Elige cómo empezar">
            <div className="mb-4 flex items-end justify-between px-1">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Elige tu camino</p>
                <p className="mt-1 text-xs text-slate-500">Choose your path · Choisissez votre chemin</p>
              </div>
              <div className="hidden items-center gap-1.5 text-[10px] text-slate-500 sm:flex">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" />
                <span>Privado · Private · Privé</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {PATHS.map((path, idx) => {
                const Icon = path.icon;
                const featured = idx === 0;
                return (
                  <button
                    key={path.href}
                    onClick={() => setLocation(path.href)}
                    className={`group relative flex flex-col gap-4 overflow-hidden rounded-3xl border p-5 text-left shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl sm:p-6 ${
                      featured
                        ? "border-emerald-300/40 bg-gradient-to-br from-emerald-500/[0.18] via-white/[0.06] to-teal-500/[0.08] shadow-emerald-950/40 hover:border-emerald-200/70 hover:shadow-emerald-500/15 md:col-span-2"
                        : `bg-white/[0.045] ${path.border} ${path.glow} backdrop-blur-xl`
                    }`}
                  >
                    {featured && (
                      <div className="mx-auto max-w-full rounded-full border border-emerald-200/20 bg-emerald-300/10 px-2.5 py-1 text-center text-[9px] font-bold uppercase leading-tight tracking-[0.12em] text-emerald-200">
                        Recomendado · Recommended · Recommandé
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${path.color} shadow-lg`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div className={`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br ${path.color} shadow-lg transition-transform group-hover:scale-110`}>
                        <ArrowRight className="h-4 w-4 text-white" />
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3 sm:gap-5">
                      {[
                        { code: "ES", content: path.es, tone: "text-white", badge: "text-indigo-300 bg-indigo-500/10 border-indigo-400/20" },
                        { code: "EN", content: path.en, tone: "text-slate-200", badge: "text-blue-300 bg-blue-500/10 border-blue-400/20" },
                        { code: "FR", content: path.fr, tone: "text-slate-300", badge: "text-violet-300 bg-violet-500/10 border-violet-400/20" },
                      ].map(({ code, content, tone, badge }) => (
                        <div key={code}>
                          <span className={`mb-1.5 inline-block rounded-full border px-2 py-0.5 text-[9px] font-bold tracking-widest ${badge}`}>{code}</span>
                          <p className={`${tone} text-sm font-bold leading-snug`}>{content.label}</p>
                          <p className="mt-1 text-xs leading-relaxed text-slate-400">{content.sub}</p>
                        </div>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Trust line */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t border-white/[0.07] py-5 text-[10px] text-slate-500 sm:text-xs">
            <span className="inline-flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5 text-indigo-300" /> 24/7 · Siempre disponible · Always available · Toujours disponible</span>
            <span className="hidden text-slate-700 sm:inline">•</span>
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-emerald-300" /> Privado · Private · Privé</span>
          </div>
        </div>
      </div>
    </>
  );
}
