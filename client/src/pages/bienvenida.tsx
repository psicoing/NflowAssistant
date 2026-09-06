import { useLocation } from "wouter";
import { useEffect, useState } from "react";
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
import heroSpanish from "@assets/image_1788617410204.png";
import heroEnglish from "@assets/nuxa-map-en.png";
import heroFrench from "@assets/nuxa-map-fr.png";

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

const HERO_LANGUAGES = [
  {
    code: "ES",
    image: heroSpanish,
    alt: "Presentación comercial de NUXA en español",
  },
  {
    code: "EN",
    image: heroEnglish,
    alt: "NUXA commercial presentation in English",
  },
  {
    code: "FR",
    image: heroFrench,
    alt: "Présentation commerciale de NUXA en français",
  },
];


export default function Bienvenida() {
  const [, setLocation] = useLocation();
  const [heroLanguageIndex, setHeroLanguageIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setHeroLanguageIndex((current) => (current + 1) % HERO_LANGUAGES.length);
    }, 2000);

    return () => window.clearInterval(interval);
  }, []);

  const openComparison = () => {
    setLocation("/");
    let attempts = 0;
    const scrollToComparison = () => {
      const element = document.getElementById("comparativa");
      if (element) {
        const y = element.getBoundingClientRect().top + window.scrollY - 24;
        window.scrollTo({ top: y, behavior: "smooth" });
      } else if (attempts < 80) {
        attempts += 1;
        window.setTimeout(scrollToComparison, 100);
      }
    };
    window.setTimeout(scrollToComparison, 180);
  };

  return (
    <>
      <SEOHead
        title="Bienvenida a NUXA | Welcome to NUXA | Bienvenue sur NUXA"
        description="Elige cómo quieres empezar con NUXA · Choose how to start · Choisissez comment commencer"
        canonicalUrl="https://nuxa.life/bienvenida"
      />

      <div className="relative isolate min-h-screen overflow-x-hidden bg-slate-950 text-white lg:h-screen lg:overflow-hidden">
        {/* Ambient light keeps the page warm and dimensional without adding assets. */}
        <div className="pointer-events-none absolute -left-40 top-24 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-40 top-72 h-[28rem] w-[28rem] rounded-full bg-violet-500/15 blur-3xl" />
        <div className="pointer-events-none absolute left-1/2 top-[38rem] h-80 w-80 -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 sm:px-6 lg:h-screen">
          {/* Top bar */}
          <header className="flex items-center justify-between py-4 sm:py-5">
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
            className="nuxa-difference-pulse group w-full rounded-xl border border-orange-300/40 bg-gradient-to-r from-orange-500/[0.18] via-amber-300/[0.08] to-orange-500/[0.18] p-px text-left transition-all duration-300 hover:border-orange-200/80"
            aria-label="NUXA listens to you; ChatGPT only responds and not always well"
          >
            <div className="relative rounded-[11px] bg-slate-950/55 px-12 py-2 text-center sm:px-14 sm:py-2.5">
              <div className="absolute left-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg bg-gradient-to-br from-orange-400 to-amber-500 shadow-lg shadow-orange-500/30 sm:left-4">
                <BrainCircuit className="h-4 w-4 text-white" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-0.5 text-[11px] font-bold leading-tight text-white sm:text-sm">
                  <span className="text-orange-200">NUXA listens to you</span>
                  <span className="text-orange-300/70">·</span>
                  <span>ChatGPT only responds and not always well</span>
                  <span className="text-orange-300/70">·</span>
                  <span className="text-orange-100">Your health is at stake</span>
                </div>
                <p className="mt-0.5 text-[9px] leading-relaxed text-orange-100/65 sm:text-[10px]">
                  Escucha emocional, no solo respuestas · Emotional support, not just answers · Écoute émotionnelle, pas seulement des réponses
                </p>
              </div>
              <span className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-orange-200/45 bg-orange-300/15 text-orange-100 transition-all duration-300 group-hover:rotate-12 group-hover:bg-orange-300/25 sm:right-4">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
            </div>
          </button>

          {/* Three localized panels rotate positions every two seconds.
              On desktop these are deliberately square: the artwork stays legible
              and the strip feels like a small gallery rather than a stretched banner. */}
          <section
            className="mx-auto grid w-full grid-cols-3 gap-2 sm:gap-3 lg:h-[clamp(232px,31vh,300px)] lg:w-max lg:max-w-none lg:grid-cols-[repeat(3,clamp(232px,31vh,300px))] lg:gap-4"
            aria-label="Presentación comercial de NUXA en tres idiomas"
          >
            {HERO_LANGUAGES.map((_, panelIndex) => {
              const language = HERO_LANGUAGES[(heroLanguageIndex + panelIndex) % HERO_LANGUAGES.length];
              return (
                <div
                  key={`${panelIndex}-${language.code}`}
                  className="group/panel relative isolate flex min-w-0 aspect-square items-center justify-center overflow-hidden rounded-2xl border border-white/[0.14] bg-[#111d39] shadow-[0_18px_42px_-22px_rgba(7,15,40,0.95)] transition-all duration-500 hover:-translate-y-1 hover:border-orange-200/45 hover:shadow-[0_24px_48px_-20px_rgba(241,143,71,0.22)] lg:h-full lg:aspect-square"
                >
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(244,171,105,0.2),transparent_38%),linear-gradient(145deg,rgba(255,255,255,0.08),transparent_48%,rgba(14,28,62,0.42))]" />
                  <img
                    src={language.image}
                    alt={language.alt}
                    className="relative z-[1] h-full w-full object-contain p-1.5 transition-transform duration-700 ease-out group-hover/panel:scale-[1.025] sm:p-2 lg:p-2.5"
                  />
                  <div className="absolute inset-x-2 bottom-2 z-[2] flex items-center justify-between sm:inset-x-3 sm:bottom-3">
                    <span className="rounded-full border border-white/20 bg-[#0c1630]/80 px-2 py-1 text-[8px] font-black tracking-[0.16em] text-white/90 shadow-lg backdrop-blur-md sm:px-2.5 sm:text-[10px]">
                      {language.code}
                    </span>
                    <span className="hidden rounded-full border border-orange-200/25 bg-orange-200/10 px-2 py-1 text-[8px] font-semibold tracking-[0.12em] text-orange-100/85 backdrop-blur-md transition-opacity duration-300 group-hover/panel:opacity-100 sm:block sm:opacity-0">
                      NUXA / {String(panelIndex + 1).padStart(2, "0")}
                    </span>
                  </div>
                </div>
              );
            })}
          </section>

          {/* Paths */}
          <section className="flex min-h-0 flex-col pb-3 lg:pb-2" aria-label="Elige cómo empezar">
            <div className="mb-2 flex items-end justify-between px-1 pt-1">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Elige tu camino</p>
                <p className="mt-1 text-xs text-slate-500">Choose your path · Choisissez votre chemin</p>
              </div>
              <div className="hidden items-center gap-1.5 text-[10px] text-slate-500 sm:flex">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" />
                <span>Privado · Private · Privé</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3 lg:h-[205px] lg:min-h-0">
              {PATHS.map((path, idx) => {
                const Icon = path.icon;
                const featured = idx === 0;
                return (
                  <button
                    key={path.href}
                    onClick={() => setLocation(path.href)}
                    className={`group relative flex min-h-[210px] flex-col gap-2 overflow-hidden rounded-2xl border p-4 text-left shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl lg:h-[205px] lg:min-h-0 lg:p-3.5 ${
                      featured
                        ? "border-emerald-300/40 bg-gradient-to-br from-emerald-500/[0.18] via-white/[0.06] to-teal-500/[0.08] shadow-emerald-950/40 hover:border-emerald-200/70 hover:shadow-emerald-500/15"
                        : `bg-white/[0.045] ${path.border} ${path.glow} backdrop-blur-xl`
                    }`}
                  >
                    {featured && (
                      <div className="mx-auto max-w-full rounded-full border border-emerald-200/20 bg-emerald-300/10 px-2 py-0.5 text-center text-[7px] font-bold uppercase leading-tight tracking-[0.08em] text-emerald-200">
                        Recomendado · Recommended · Recommandé
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${path.color} shadow-lg`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${path.color} shadow-lg transition-transform group-hover:scale-110`}>
                        <ArrowRight className="h-3.5 w-3.5 text-white" />
                      </div>
                    </div>

                    <div className="grid flex-1 content-center gap-1.5">
                      {[
                        { code: "ES", content: path.es, tone: "text-white", badge: "text-indigo-300 bg-indigo-500/10 border-indigo-400/20" },
                        { code: "EN", content: path.en, tone: "text-slate-200", badge: "text-blue-300 bg-blue-500/10 border-blue-400/20" },
                        { code: "FR", content: path.fr, tone: "text-slate-300", badge: "text-violet-300 bg-violet-500/10 border-violet-400/20" },
                      ].map(({ code, content, tone, badge }) => (
                        <div key={code}>
                           <span className={`mr-2 inline-block rounded-full border px-2 py-0.5 text-[8px] font-bold tracking-widest ${badge}`}>{code}</span>
                            <span className={`${tone} text-[12px] font-bold leading-snug`}>{content.label}</span>
                            <p className="mt-0.5 pl-0 text-[9px] leading-snug text-slate-400">{content.sub}</p>
                        </div>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Trust line */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 border-t border-white/[0.07] py-2 text-[10px] text-slate-500">
            <span className="inline-flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5 text-indigo-300" /> 24/7 · Siempre disponible · Always available · Toujours disponible</span>
            <span className="hidden text-slate-700 sm:inline">•</span>
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-emerald-300" /> Privado · Private · Privé</span>
          </div>
        </div>
      </div>
    </>
  );
}
