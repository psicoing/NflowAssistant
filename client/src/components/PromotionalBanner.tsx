import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Sparkles, X, Clock } from "lucide-react";

interface PromotionalBannerProps {
  onClose?: () => void;
}

export default function PromotionalBanner({ onClose }: PromotionalBannerProps) {
  const [, setLocation] = useLocation();

  return (
    <div className="fixed top-0 w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white py-3 px-4 relative overflow-hidden z-[60]">
      <div className="max-w-7xl mx-auto flex items-center justify-between relative z-10">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5" />
            <span className="font-bold text-lg">NUXA</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-2">
            <span className="text-sm">
              Tu espacio de bienestar emocional • Disponible 24/7
            </span>
          </div>
          
          <div className="md:hidden text-sm">
            Tu espacio de bienestar
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            onClick={() => setLocation("/register")}
            className="bg-white text-emerald-700 hover:bg-gray-100 font-semibold px-6 py-2 rounded-full transition-all duration-500 shadow-md"
          >
            Iniciar conversación
          </Button>
          
          <button
            onClick={onClose}
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