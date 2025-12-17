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
        <div className="bg-white border-2 border-orange-500 text-gray-900 p-4 rounded-2xl shadow-2xl max-w-xs transform animate-bounce">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-orange-500" />
              <span className="font-bold text-sm text-orange-600">¡OFERTA ESPECIAL!</span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm mb-3 text-gray-700">
            Únete a miles de usuarios que ya mejoraron su bienestar mental con <span className="font-bold">NUXA</span>
          </p>
          <div className="text-xs bg-orange-50 border border-orange-200 rounded-lg p-2 mb-3 text-orange-700">
            ✨ Sin permanencia<br/>
            ✨ Cancela cuando quieras<br/>
            ✨ Soporte 24/7
          </div>
        </div>
      )}

      {/* Main floating button */}
      <Button
        onClick={() => setLocation("/login")}
        className={`bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 ${
          isExpanded ? 'px-6 py-6' : 'px-8 py-8'
        } animate-pulse hover:animate-none border-2 border-white`}
        onMouseEnter={() => setIsExpanded(true)}
      >
        <Sparkles className={`${isExpanded ? 'w-6 h-6' : 'w-8 h-8'} ${isExpanded ? 'mr-2' : ''}`} />
        {isExpanded && <span className="text-lg">¡Comenzar!</span>}
      </Button>
    </div>
  );
}