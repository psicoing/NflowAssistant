import { AlertTriangle, CreditCard } from "lucide-react";

export default function PaidAppNotice() {
  return (
    <section className="py-8 bg-gradient-to-r from-red-900/20 via-orange-900/20 to-red-900/20 border-y border-red-800/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-red-900/30 border border-red-700/50 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <AlertTriangle className="w-8 h-8 text-yellow-400" />
            <h2 className="text-2xl font-bold text-white text-center">
              NUXA es una Aplicación de Pago
            </h2>
            <CreditCard className="w-8 h-8 text-yellow-400" />
          </div>
          
          <div className="text-center space-y-3">
            <p className="text-lg text-gray-200 font-medium">
              <strong>No hay chat gratuito.</strong> Para acceder al asistente de IA necesitas comprar una suscripción.
            </p>
            
            <p className="text-gray-300">
              Los recursos informativos están disponibles gratuitamente en la barra de navegación. 
              <br />
              <strong>El chat con IA requiere suscripción activa - sin excepciones.</strong>
            </p>
            
            <div className="flex justify-center pt-4">
              <a 
                href="#precios" 
                className="inline-flex items-center px-6 py-3 bg-nflow-orange hover:bg-orange-600 text-white font-bold rounded-lg transition-colors"
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Ver Planes de Pago
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}