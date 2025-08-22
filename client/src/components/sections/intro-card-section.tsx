import { Button } from "@/components/ui/button";
import { CheckCircle, Brain, Clock, Users, Sparkles } from "lucide-react";

export default function IntroCardSection() {
  return (
    <section id="intro-card" className="py-8 px-4 bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-8 text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Brain className="w-8 h-8 text-white" />
              <Sparkles className="w-6 h-6 text-white animate-pulse" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              ¿Imaginas tener respuestas claras y apoyo emocional al instante?
            </h2>
            <div className="w-24 h-1 bg-white/30 mx-auto rounded-full"></div>
          </div>

          {/* Content */}
          <div className="p-8 md:p-12">
            <div className="text-center mb-8">
              <p className="text-xl text-gray-700 leading-relaxed mb-6">
                Con <strong className="text-orange-600">NFlow</strong>, accede a un asistente inteligente 
                entrenado en psicología y bienestar, diseñado para acompañarte cuando más lo necesitas.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100">
                <div className="flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Orientación Personalizada</h3>
                <p className="text-gray-600 text-sm">Adaptada a cada etapa de la vida</p>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                <div className="flex items-center justify-center mb-4">
                  <Brain className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Basado en Ciencia</h3>
                <p className="text-gray-600 text-sm">Lenguaje cercano y evidencia científica</p>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border border-orange-100">
                <div className="flex items-center justify-center mb-4">
                  <Clock className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Disponible 24/7</h3>
                <p className="text-gray-600 text-sm">Para ti o tu empresa</p>
              </div>
            </div>

            {/* Key Features List */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 mb-8">
              <div className="flex items-start space-x-3 mb-4">
                <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                <span className="text-gray-700 font-medium">Orientación adaptada a cada etapa de la vida</span>
              </div>
              <div className="flex items-start space-x-3 mb-4">
                <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                <span className="text-gray-700 font-medium">Lenguaje cercano y basado en evidencia científica</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                <span className="text-gray-700 font-medium">Disponible 24/7 para ti o tu empresa</span>
              </div>
            </div>

            {/* Professional Statement */}
            <div className="bg-gradient-to-r from-orange-50 to-orange-100/50 rounded-2xl p-6 mb-8 border-l-4 border-orange-500">
              <div className="flex items-start space-x-3">
                <Users className="w-6 h-6 text-orange-600 mt-1" />
                <div>
                  <p className="text-gray-800 font-medium leading-relaxed">
                    <strong>NFlow no es un chatbot cualquiera:</strong> está desarrollado por profesionales, 
                    con contenidos actualizados y rigurosos que te ayudan a mejorar tu bienestar y el de tu equipo.
                  </p>
                </div>
              </div>
            </div>

            {/* Info Badge */}
            <div className="text-center">
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-full border border-orange-200">
                <span className="text-orange-700 font-medium text-sm">
                  Tu apoyo emocional profesional disponible 24/7
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}