import { useEffect, useRef, useState } from "react";
import PsychologySeal from "@/components/ui/psychology-seal";

const SLIDES = [
  {
    lang: "ES",
    title: "NUXA",
    subtitle: "Tu app de salud mental y riesgos laborales",
    cta: "Pruébala gratis y sin tarjeta",
  },
  {
    lang: "EN",
    title: "NUXA",
    subtitle: "Your mental health & workplace wellbeing app",
    cta: "Try it free, no card required",
  },
  {
    lang: "FR",
    title: "NUXA",
    subtitle: "Votre application de santé mentale et de risques psychosociaux",
    cta: "Essayez-la gratuitement, sans carte",
  },
];

const TOTAL_DURATION_MS = 8000;
const SLIDE_DURATION_MS = TOTAL_DURATION_MS / SLIDES.length;
const STORAGE_KEY = "nuxa-splash-v2";

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [fadingOut, setFadingOut] = useState(false);
  const onFinishRef = useRef(onFinish);
  useEffect(() => { onFinishRef.current = onFinish; });

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setActiveSlide((prev) => Math.min(prev + 1, SLIDES.length - 1));
    }, SLIDE_DURATION_MS);

    const fadeTimeout = setTimeout(() => {
      setFadingOut(true);
    }, TOTAL_DURATION_MS - 400);

    const finishTimeout = setTimeout(() => {
      // dev: no guardamos para poder ver el splash en cada recarga
      onFinishRef.current();
    }, TOTAL_DURATION_MS);

    return () => {
      clearInterval(slideInterval);
      clearTimeout(fadeTimeout);
      clearTimeout(finishTimeout);
    };
  }, []); // empty deps — timers start once and are never reset

  const slide = SLIDES[activeSlide];

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 transition-opacity duration-400 ${
        fadingOut ? "opacity-0" : "opacity-100"
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-2.5 mb-6">
        {[
          { code: "eu", label: "Unión Europea" },
          { code: "gb", label: "Reino Unido" },
          { code: "us", label: "Estados Unidos" },
          { code: "ca", label: "Canadá" },
        ].map((flag) => (
          <img
            key={flag.code}
            src={`https://flagcdn.com/w40/${flag.code}.png`}
            srcSet={`https://flagcdn.com/w80/${flag.code}.png 2x`}
            alt={flag.label}
            title={flag.label}
            className="w-8 h-6 object-cover rounded-sm shadow-md ring-1 ring-white/20"
          />
        ))}
      </div>

      <div className="flex items-center gap-6 mb-8">
        <div className="flex items-center gap-3">
          <img src="/favicon.png" alt="NUXA" className="w-14 h-14 rounded-2xl shadow-lg shadow-indigo-500/30" />
          <img src="/icon-boy.png" alt="NUXA" className="w-14 h-14 rounded-2xl shadow-lg shadow-indigo-500/30" />
        </div>
        {/* Official credential seal */}
        <div translate="no" lang="en" className="opacity-90">
          <PsychologySeal size={90} />
        </div>
      </div>

      <div key={activeSlide} className="text-center px-6 max-w-md animate-in fade-in duration-500">
        <span className="inline-block text-[11px] font-semibold tracking-widest text-indigo-300 bg-indigo-500/10 border border-indigo-400/20 rounded-full px-3 py-1 mb-4">
          {slide.lang}
        </span>
        <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">{slide.title}</h1>
        <p className="text-slate-300 text-lg leading-relaxed mb-5">{slide.subtitle}</p>
        <p className="text-white font-semibold text-base bg-gradient-to-r from-indigo-500 to-violet-500 inline-block px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-500/25">
          {slide.cta}
        </p>
      </div>

      <div className="absolute bottom-10 flex gap-2">
        {SLIDES.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === activeSlide ? "w-8 bg-indigo-400" : "w-1.5 bg-white/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function isInPreviewWebview() {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

export function hasSplashBeenShown() {
  return false; // dev: siempre mostrar el splash
}
