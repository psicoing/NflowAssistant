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
        <div className="bg-gray-900 border-2 border-nflow-orange text-white p-4 rounded-2xl shadow-2xl max-w-xs transform animate-bounce">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-nflow-orange" />
              <span className="font-bold text-sm text-white">¡OFERTA ESPECIAL!</span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-white/70 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm mb-3 text-gray-100">
            Únete a miles de usuarios que ya mejoraron su bienestar mental con NFLOW
          </p>
          <div className="text-xs bg-nflow-orange/20 border border-nflow-orange/30 rounded-lg p-2 mb-3 text-white">
            ✨ Primer mes por solo €2.99<br/>
            ✨ Cancela cuando quieras<br/>
            ✨ Soporte 24/7
          </div>
        </div>
      )}

      {/* Main floating button */}
      <Button
        onClick={() => setLocation("/registro")}
        className={`bg-gradient-to-r from-nflow-orange to-orange-600 hover:from-orange-600 hover:to-red-500 text-white font-bold rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 ${
          isExpanded ? 'px-6 py-6' : 'px-8 py-8'
        } animate-pulse hover:animate-none`}
        onMouseEnter={() => setIsExpanded(true)}
      >
        <Sparkles className={`${isExpanded ? 'w-6 h-6' : 'w-8 h-8'} ${isExpanded ? 'mr-2' : ''}`} />
        {isExpanded && <span className="text-lg">¡Comenzar!</span>}
      </Button>
    </div>
  );
}