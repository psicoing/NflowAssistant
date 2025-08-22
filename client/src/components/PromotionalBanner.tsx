import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Sparkles, X, Clock } from "lucide-react";
import { useState } from "react";

export default function PromotionalBanner() {
  const [, setLocation] = useLocation();
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-nflow-orange via-orange-500 to-red-500 text-white py-3 px-4 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
      
      <div className="max-w-7xl mx-auto flex items-center justify-between relative z-10">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 animate-bounce" />
            <span className="font-bold text-lg">¡OFERTA LIMITADA!</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span className="text-sm">
              Primer mes por solo €2.99 • Soporte profesional 24/7 • Sin compromiso
            </span>
          </div>
          
          <div className="md:hidden text-sm">
            Primer mes €2.99 • Sin compromiso
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            onClick={() => setLocation("/registro")}
            className="bg-white text-nflow-orange hover:bg-gray-100 font-bold px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            ¡Comenzar Ahora!
          </Button>
          
          <button
            onClick={() => setIsVisible(false)}
            className="text-white/70 hover:text-white p-1"
            aria-label="Cerrar banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}