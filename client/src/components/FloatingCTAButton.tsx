import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Sparkles, X } from "lucide-react";
import { useState, useEffect } from "react";

export default function FloatingCTAButton() {
  const [, setLocation] = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  // Auto-expand after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExpanded(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Auto-collapse after being expanded for 10 seconds
  useEffect(() => {
    if (isExpanded) {
      const timer = setTimeout(() => {
        setIsExpanded(false);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [isExpanded]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-end space-x-2">
      {/* Expanded message */}
      {isExpanded && (
        <div className="bg-white border-2 border-emerald-500 text-gray-900 p-4 rounded-2xl shadow-2xl max-w-xs">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-emerald-500" />
              <span className="font-bold text-sm text-emerald-600">Hola</span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm mb-2 text-gray-800 font-medium">
            ¿Qué motivo te trae hasta aquí?
          </p>
          <p className="text-xs text-gray-600 mb-3 leading-relaxed">
            Este es un espacio pensado para escucharte con calma y respeto. Puedes confiar en ello.
          </p>
        </div>
      )}

      {/* Main floating button - sereno y acogedor */}
      <Button
        onClick={() => setLocation("/login")}
        className={`bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-full shadow-xl transition-all duration-500 ${
          isExpanded ? 'px-6 py-5' : 'px-6 py-6'
        } border-2 border-white/50`}
        onMouseEnter={() => setIsExpanded(true)}
      >
        <Sparkles className={`${isExpanded ? 'w-5 h-5' : 'w-6 h-6'} ${isExpanded ? 'mr-2' : ''}`} />
        {isExpanded && <span className="text-base">Hablamos</span>}
      </Button>
    </div>
  );
}