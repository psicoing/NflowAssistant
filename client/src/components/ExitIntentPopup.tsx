import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const alreadyShown = sessionStorage.getItem("exitPopupShown");
    if (alreadyShown) {
      setHasShown(true);
      return;
    }

    let timeoutId: NodeJS.Timeout;
    
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShown) {
        setIsVisible(true);
        setHasShown(true);
        sessionStorage.setItem("exitPopupShown", "true");
      }
    };

    timeoutId = setTimeout(() => {
      document.addEventListener("mouseleave", handleMouseLeave);
    }, 5000);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [hasShown]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleCTA = () => {
    setIsVisible(false);
    setLocation("/precios");
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
            ¿Te vas sin hablar de lo que te preocupa?
          </h2>
          
          <p className="text-gray-300 text-base mb-6">
            NUXA te escucha 24/7, sin juicios, en tu idioma. 
            <span className="text-emerald-400 font-semibold"> La experiencia es tan real que pensarás que hablas con un psicólogo sabio.</span>
          </p>

          <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-4 mb-6">
            <p className="text-emerald-400 font-bold text-lg">
              Desde solo 2,99€/mes
            </p>
            <p className="text-gray-400 text-sm">
              Sin permanencia · Cancela cuando quieras
            </p>
          </div>

          <Button
            onClick={handleCTA}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-6 text-lg font-bold rounded-xl shadow-xl transition-all duration-300 transform hover:scale-105"
            data-testid="button-exit-popup-cta"
          >
            Quiero probar NUXA
          </Button>

          <button 
            onClick={handleClose}
            className="mt-4 text-gray-500 text-sm hover:text-gray-400 transition-colors"
            data-testid="button-exit-popup-dismiss"
          >
            No gracias, prefiero seguir solo/a
          </button>
        </div>
      </div>
    </div>
  );
}
