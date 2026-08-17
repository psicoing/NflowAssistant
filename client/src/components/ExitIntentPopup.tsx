import { useState, useEffect, useRef } from "react";
import { X, Sparkles, Building2, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import { useLanguage } from "@/hooks/useLanguage";

const popupContent = {
  es: {
    eyebrow: "Antes de irte…",
    title: "Tu bienestar no puede esperar",
    subtitle: "NUXA te acompaña cuando más lo necesitas. Sin juicios, sin esperas, en tu idioma.",
    optionA: {
      badge: "Para ti, ahora mismo",
      heading: "Empieza en 2 minutos",
      detail: "Desde 2,99 €/mes · Sin permanencia · Cancela cuando quieras",
      cta: "Crear mi cuenta →",
    },
    optionB: {
      badge: "Para tu empresa u organización",
      heading: "Actívalo para todo tu equipo",
      detail: "Gratis si tu organización lo ofrece · También via profesionales autorizados",
      cta: "Más info para organizaciones",
    },
    dismiss: "Ahora no, gracias",
  },
  en: {
    eyebrow: "Before you go…",
    title: "Your wellbeing can't wait",
    subtitle: "NUXA is with you when you need it most. No judgment, no waiting, in your language.",
    optionA: {
      badge: "Just for you, right now",
      heading: "Start in 2 minutes",
      detail: "From €2.99/month · No commitment · Cancel anytime",
      cta: "Create my account →",
    },
    optionB: {
      badge: "For your company or organisation",
      heading: "Activate it for your whole team",
      detail: "Free if your organisation offers it · Also via authorised professionals",
      cta: "More info for organisations",
    },
    dismiss: "Not now, thanks",
  },
  fr: {
    eyebrow: "Avant de partir…",
    title: "Votre bien-être ne peut pas attendre",
    subtitle: "NUXA vous accompagne quand vous en avez le plus besoin. Sans jugement, sans attente.",
    optionA: {
      badge: "Pour vous, dès maintenant",
      heading: "Commencez en 2 minutes",
      detail: "À partir de 2,99 €/mois · Sans engagement · Résiliez quand vous voulez",
      cta: "Créer mon compte →",
    },
    optionB: {
      badge: "Pour votre entreprise ou organisation",
      heading: "Activez-le pour toute votre équipe",
      detail: "Gratuit si votre organisation le propose · Aussi via des professionnels agréés",
      cta: "Plus d'infos pour les organisations",
    },
    dismiss: "Pas maintenant, merci",
  },
};

export default function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [, setLocation] = useLocation();
  const { currentLanguage } = useLanguage();
  const lastScrollY = useRef(0);

  const lang = currentLanguage === "en" ? "en" : currentLanguage === "fr" ? "fr" : "es";
  const content = popupContent[lang];

  const showPopup = () => {
    if (!hasShown && !sessionStorage.getItem("exitPopupShown")) {
      setIsVisible(true);
      setHasShown(true);
      sessionStorage.setItem("exitPopupShown", "true");
    }
  };

  useEffect(() => {
    const alreadyShown = sessionStorage.getItem("exitPopupShown");
    if (alreadyShown) { setHasShown(true); return; }

    let isActive = false;
    const timeoutId = setTimeout(() => { isActive = true; }, 8000);

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && isActive) showPopup();
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const velocity = lastScrollY.current - currentScrollY;
      if (velocity > 50 && currentScrollY < 100 && isActive) showPopup();
      lastScrollY.current = currentScrollY;
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && isActive) {
        sessionStorage.setItem("showPopupOnReturn", "true");
      } else if (document.visibilityState === "visible") {
        if (sessionStorage.getItem("showPopupOnReturn") && isActive) {
          sessionStorage.removeItem("showPopupOnReturn");
          showPopup();
        }
      }
    };

    setTimeout(() => {
      document.addEventListener("mouseleave", handleMouseLeave);
      window.addEventListener("scroll", handleScroll, { passive: true });
      document.addEventListener("visibilitychange", handleVisibilityChange);
    }, 8000);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [hasShown]);

  const handleClose = () => setIsVisible(false);

  const handleIndividual = () => {
    setIsVisible(false);
    setLocation("/registro");
  };

  const handleOrg = () => {
    setIsVisible(false);
    window.open("https://jobda.org/partners", "_blank");
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />

      <div
        className="relative bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 border border-white/10 rounded-3xl p-7 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
          data-testid="button-close-exit-popup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <p className="text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-2">
            {content.eyebrow}
          </p>
          <h2 className="text-2xl font-bold text-white leading-snug mb-2">
            {content.title}
          </h2>
          <p className="text-gray-400 text-sm">
            {content.subtitle}
          </p>
        </div>

        {/* Option A — Individual */}
        <button
          onClick={handleIndividual}
          data-testid="button-exit-popup-cta"
          className="w-full text-left bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 border border-emerald-500/40 rounded-2xl p-4 mb-3 group transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 text-[11px] font-semibold uppercase tracking-wide">
                  {content.optionA.badge}
                </span>
              </div>
              <p className="text-white font-bold text-base">{content.optionA.heading}</p>
              <p className="text-gray-400 text-xs mt-0.5">{content.optionA.detail}</p>
            </div>
            <ArrowRight className="w-5 h-5 text-emerald-400 group-hover:translate-x-1 transition-transform flex-shrink-0 ml-3" />
          </div>
        </button>

        {/* Option B — Organisation */}
        <button
          onClick={handleOrg}
          className="w-full text-left bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 mb-5 group transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Building2 className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-blue-400 text-[11px] font-semibold uppercase tracking-wide">
                  {content.optionB.badge}
                </span>
              </div>
              <p className="text-white font-bold text-base">{content.optionB.heading}</p>
              <p className="text-gray-400 text-xs mt-0.5">{content.optionB.detail}</p>
            </div>
            <ArrowRight className="w-5 h-5 text-blue-400 group-hover:translate-x-1 transition-transform flex-shrink-0 ml-3" />
          </div>
        </button>

        {/* Dismiss */}
        <div className="text-center">
          <button
            onClick={handleClose}
            className="text-gray-600 text-xs hover:text-gray-400 transition-colors"
            data-testid="button-exit-popup-dismiss"
          >
            {content.dismiss}
          </button>
        </div>
      </div>
    </div>
  );
}
