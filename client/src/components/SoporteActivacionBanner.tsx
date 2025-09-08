import { AlertCircle, Phone, Mail, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function SoporteActivacionBanner() {
  return (
    <div className="mb-6">
      <Alert className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/50 backdrop-blur-sm">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <AlertDescription className="text-blue-100">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xs bg-purple-600/30 text-purple-200 px-2 py-1 rounded-full">
                    NFLOW Beta 4.0.0
                  </span>
                  <span className="text-blue-200 text-sm font-medium">
                    Estamos mejorando las formas de pago
                  </span>
                </div>
                
                <div className="text-sm text-gray-300">
                  <span className="font-medium text-blue-200">¿Problemas con la activación?</span> 
                  <span className="ml-1">Te atendemos personalmente para activar tu perfil:</span>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0 text-sm">
                  <a 
                    href="tel:+34660452136"
                    className="flex items-center space-x-2 text-green-300 hover:text-green-200 transition-colors group"
                  >
                    <Phone className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">+34 660 45 21 36</span>
                  </a>
                  
                  <a 
                    href="mailto:jobda@jobda.es?subject=Activación NFLOW - Ayuda"
                    className="flex items-center space-x-2 text-orange-300 hover:text-orange-200 transition-colors group"
                  >
                    <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">jobda@jobda.es</span>
                  </a>
                </div>
                
                <div className="text-xs text-gray-400 mt-2">
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