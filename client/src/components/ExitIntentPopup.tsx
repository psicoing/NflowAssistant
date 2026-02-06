import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useLanguage } from "@/hooks/useLanguage";

const popupContent = {
  es: {
    title: "¿Te vas sin hablar de lo que te preocupa?",
    description: "NUXA te escucha 24/7, sin juicios, en tu idioma.",
    highlight: "La experiencia es tan real que pensarás que hablas con un psicólogo sabio.",
    price: "Pide a tu empresa o administración que active NUXA para ti",
    noCommitment: "Sin coste para el usuario · Disponible para empresas y sector público",
    cta: "Más información para organizaciones",
    dismiss: "No gracias, prefiero seguir solo/a"
  },
  en: {
    title: "Leaving without talking about what worries you?",
    description: "NUXA listens 24/7, without judgment, in your language.",
    highlight: "The experience is so real you'll think you're talking to a wise psychologist.",
    price: "Ask your company or administration to activate NUXA for you",
    noCommitment: "Free for users · Available for businesses and public sector",
    cta: "More info for organizations",
    dismiss: "No thanks, I prefer to go it alone"
  }
};

export default function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [, setLocation] = useLocation();
  const { currentLanguage } = useLanguage();
  const lastScrollY = useRef(0);
  const scrollVelocity = useRef(0);
  
  const content = currentLanguage === 'en' ? popupContent.en : popupContent.es;

  const showPopup = () => {
    if (!hasShown && !sessionStorage.getItem("exitPopupShown")) {
      setIsVisible(true);
      setHasShown(true);
      sessionStorage.setItem("exitPopupShown", "true");
    }
  };

  useEffect(() => {
    const alreadyShown = sessionStorage.getItem("exitPopupShown");
    if (alreadyShown) {
      setHasShown(true);
      return;
    }

    let timeoutId: NodeJS.Timeout;
    let isActive = false;
    
    // Desktop: Mouse leave detection
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        showPopup();
      }
    };

    // Mobile: Fast scroll up detection
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const velocity = lastScrollY.current - currentScrollY;
      
      // Detect fast scroll up (velocity > 50px) near top of page
      if (velocity > 50 && currentScrollY < 100 && isActive) {
        showPopup();
      }
      
      lastScrollY.current = currentScrollY;
      scrollVelocity.current = velocity;
    };

    // Mobile: Tab/app switch detection
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && isActive) {
        // Store that we should show popup when they return
        sessionStorage.setItem("showPopupOnReturn", "true");
      } else if (document.visibilityState === "visible") {
        const shouldShow = sessionStorage.getItem("showPopupOnReturn");
        if (shouldShow && isActive) {
          sessionStorage.removeItem("showPopupOnReturn");
          showPopup();
        }
      }
    };

    // Activate after delay
    timeoutId = setTimeout(() => {
      isActive = true;
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

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleCTA = () => {
    setIsVisible(false);
    window.open("https://jobda.org/partners", "_blank");
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      
      <div 
        className="relative bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-emerald-500/50 rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          data-testid="button-close-exit-popup"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center">
          <div className="text-5xl mb-4">💚</div>
          
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            {content.title}
          </h2>
          
          <p className="text-gray-300 text-base mb-6">
            {content.description}
            <span className="text-emerald-400 font-semibold"> {content.highlight}</span>
          </p>

          <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-4 mb-6">
            <p className="text-emerald-400 font-bold text-lg">
              {content.price}
            </p>
            <p className="text-gray-400 text-sm">
              {content.noCommitment}
            </p>
          </div>

          <Button
            onClick={handleCTA}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-6 text-lg font-bold rounded-xl shadow-xl transition-all duration-300 transform hover:scale-105"
            data-testid="button-exit-popup-cta"
          >
            {content.cta}
          </Button>

          <button 
            onClick={handleClose}
            className="mt-4 text-gray-500 text-sm hover:text-gray-400 transition-colors"
            data-testid="button-exit-popup-dismiss"
          >
            {content.dismiss}
          </button>
        </div>
      </div>
    </div>
  );
}
