import { AlertCircle, Phone, Mail, Clock } from "lucide-react";

export default function SoporteActivacionBanner() {
  return (
    <div className="bg-gradient-to-r from-slate-800/90 to-blue-900/80 border border-blue-500/30 rounded-xl mb-6 backdrop-blur-sm shadow-lg">
      <div className="p-4">
        {/* Header compacto */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
            <AlertCircle className="w-4 h-4 text-white" />
          </div>
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            🚀 NFLOW Beta 4.0.0
          </div>
          <span className="text-blue-200 text-sm">Mejorando métodos de pago</span>
        </div>
        
        {/* Información de soporte compacta */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="text-center mb-3">
            <h4 className="text-lg font-bold text-white mb-1">💬 Soporte Personal: Ramón Molons</h4>
            
            {/* Credenciales profesionales */}
            <div className="bg-blue-900/30 border border-blue-400/50 rounded-lg p-3 my-3">
              <h5 className="text-sm font-bold text-white mb-1">
                RAMÓN MOLONS DE SAN ROMÁN
              </h5>
              <p className="text-blue-200 text-xs font-medium mb-1">
                PSICÓLOGO CLÍNICO Y ESCOLAR Y NEUROINGENIERO EN TELECOMUNICACIONES
              </p>
              <p className="text-blue-300 text-xs font-bold">
                LICENCIA ESTATAL DEL MINISTERIO DE SALUD E-17928705
              </p>
            </div>
            
            <p className="text-blue-200 text-sm">Te ayudo personalmente con la activación</p>
          </div>
          
          {/* Contacto en línea */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-3">
            <a 
              href="tel:+34660452136"
              className="flex items-center gap-2 bg-green-500/20 text-green-300 px-3 py-2 rounded-lg border border-green-500/30 hover:bg-green-500/30 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="font-bold">+34 660 45 21 36</span>
            </a>
            
            <a 
              href="mailto:jobda@jobda.es?subject=Activación NFLOW - Ayuda"
              className="flex items-center gap-2 bg-orange-500/20 text-orange-300 px-3 py-2 rounded-lg border border-orange-500/30 hover:bg-orange-500/30 transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span className="font-bold">jobda@jobda.es</span>
            </a>
          </div>
          
          {/* Footer info */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-slate-300 text-xs">
              <Clock className="w-3 h-3 text-blue-400" />
              <span>Lunes a Viernes, 9:00-18:00 CET</span>
              <span className="text-green-400">• Respuesta en 24h</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}