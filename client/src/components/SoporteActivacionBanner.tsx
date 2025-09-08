import { AlertCircle, Phone, Mail, Clock } from "lucide-react";

export default function SoporteActivacionBanner() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-800/90 via-blue-900/80 to-purple-900/70 border border-blue-500/30 rounded-2xl mb-8 backdrop-blur-lg shadow-2xl">
      {/* Efectos de fondo */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-orange-600/10" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-orange-500/20 to-transparent rounded-full blur-2xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-500/20 to-transparent rounded-full blur-xl" />
      
      <div className="relative p-8">
        {/* Header con versión */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                🚀 NFLOW Beta 4.0.0
              </div>
              <p className="text-blue-200 text-sm mt-1 font-medium">
                Estamos mejorando las formas de pago
              </p>
            </div>
          </div>
        </div>
        
        {/* Sección principal de soporte */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10 backdrop-blur-sm">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-white mb-2">
              💬 Soporte Personal Directo
            </h3>
            <p className="text-blue-200 text-lg">
              <strong>Ramón Molons</strong> te atiende personalmente para activar tu perfil
            </p>
          </div>
          
          {/* Información de contacto mejorada */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Teléfono */}
            <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl p-4 border border-green-500/30">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-green-300 text-sm font-medium">Llámame directamente</p>
                  <a 
                    href="tel:+34660452136"
                    className="text-white text-xl font-bold hover:text-green-200 transition-colors"
                  >
                    +34 660 45 21 36
                  </a>
                </div>
              </div>
            </div>
            
            {/* Email */}
            <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-xl p-4 border border-orange-500/30">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-orange-300 text-sm font-medium">Escríbeme por email</p>
                  <a 
                    href="mailto:jobda@jobda.es?subject=Activación NFLOW - Ayuda"
                    className="text-white text-lg font-bold hover:text-orange-200 transition-colors"
                  >
                    jobda@jobda.es
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Horario de atención */}
          <div className="mt-6 bg-slate-700/50 rounded-lg p-4 border border-slate-600/50">
            <div className="flex items-center justify-center gap-2 text-slate-300">
              <Clock className="w-5 h-5 text-blue-400" />
              <span className="font-medium">
                📅 Horario de atención: <strong className="text-white">Lunes a Viernes, 9:00 - 18:00 CET</strong>
              </span>
            </div>
          </div>
          
          {/* Garantía de respuesta */}
          <div className="mt-4 text-center">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full border border-blue-500/30">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">⚡ Respuesta garantizada en 24 horas</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}