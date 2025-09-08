import { AlertCircle, Phone, Mail, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function SoporteActivacionBanner() {
  return (
    <div className="mb-6">
      <Alert className="bg-gradient-to-r from-gray-800/95 to-gray-900/95 border-orange-500/80 backdrop-blur-sm shadow-xl">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <AlertDescription className="text-white">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xs bg-orange-600 text-white px-3 py-1 rounded-full font-semibold">
                    NFLOW Beta 4.0.0
                  </span>
                  <span className="text-orange-200 text-sm font-medium">
                    Estamos mejorando las formas de pago
                  </span>
                </div>
                
                <div className="text-sm text-gray-100">
                  <span className="font-bold text-white">¿Problemas con la activación?</span> 
                  <span className="ml-1">Ramón Molons te atiende personalmente para activar tu perfil:</span>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0 text-sm">
                  <a 
                    href="tel:+34660452136"
                    className="flex items-center space-x-2 text-green-400 hover:text-green-300 transition-colors group bg-green-900/30 px-3 py-2 rounded-lg"
                  >
                    <Phone className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="font-bold">+34 660 45 21 36</span>
                  </a>
                  
                  <a 
                    href="mailto:jobda@jobda.es?subject=Activación NFLOW - Ayuda"
                    className="flex items-center space-x-2 text-orange-300 hover:text-orange-200 transition-colors group bg-orange-900/30 px-3 py-2 rounded-lg"
                  >
                    <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="font-bold">jobda@jobda.es</span>
                  </a>
                </div>
                
                <div className="text-xs text-gray-300 mt-2 bg-gray-700/50 px-2 py-1 rounded">
                  <AlertCircle className="w-3 h-3 inline mr-1" />
                  Horario de atención: Lunes a Viernes, 9:00 - 18:00 CET
                </div>
              </div>
            </AlertDescription>
          </div>
        </div>
      </Alert>
    </div>
  );
}