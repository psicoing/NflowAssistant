import { Button } from "@/components/ui/button";
import { CheckCircle, Brain, Clock, Users, Sparkles, Shield, Heart, Target, Star } from "lucide-react";

export default function IntroCardSection() {
  return (
    <section id="intro-card" className="py-8 px-4 bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto">
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
              <div className="flex justify-center">
                <Button 
                  onClick={() => window.location.href = '/login'}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-8 py-3 rounded-full text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Comenzar Ahora
                </Button>
              </div>
            </div>

            {/* Main Features Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-10">
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

            {/* NEUROPSI-AI Highlight Section */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 mb-8 border border-indigo-100">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Brain className="w-10 h-10 text-indigo-600" />
                  <span className="text-2xl font-bold text-indigo-900">NEUROPSI-AI</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Tu Asistente Inteligente de Salud Mental
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Un sistema conversacional avanzado entrenado específicamente en psicología clínica, 
                  familiar y de la salud. Diseñado para brindar apoyo emocional profesional con la 
                  calidez humana que necesitas.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <Shield className="w-6 h-6 text-indigo-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Privacidad Total</h4>
                    <p className="text-gray-600 text-sm">Conversaciones confidenciales y seguras</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Heart className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Apoyo Empático</h4>
                    <p className="text-gray-600 text-sm">Respuestas cálidas y comprensivas</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Target className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Evaluaciones Precisas</h4>
                    <p className="text-gray-600 text-sm">Análisis basado en DSM-5-TR y CIE-11</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Users className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Para Todas las Edades</h4>
                    <p className="text-gray-600 text-sm">Desde adolescentes hasta adultos mayores</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <div className="text-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="text-2xl font-bold text-orange-600 mb-1">24/7</div>
                <div className="text-sm text-gray-600">Disponibilidad</div>
              </div>
              <div className="text-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="text-2xl font-bold text-blue-600 mb-1">+50</div>
                <div className="text-sm text-gray-600">Especialidades</div>
              </div>
              <div className="text-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="text-2xl font-bold text-green-600 mb-1">100%</div>
                <div className="text-sm text-gray-600">Confidencial</div>
              </div>
              <div className="text-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="text-2xl font-bold text-purple-600 mb-1">+10</div>
                <div className="text-sm text-gray-600">Idiomas</div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Únete a miles de personas que ya han encontrado apoyo y claridad
              </p>
              <div className="flex items-center justify-center space-x-1 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
                <span className="ml-2 text-gray-600 text-sm">(+1,000 usuarios satisfechos)</span>
              </div>
              <Button 
                onClick={() => window.location.href = '/login'}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-12 py-4 rounded-full text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Iniciar Mi Primera Consulta Gratis
              </Button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}