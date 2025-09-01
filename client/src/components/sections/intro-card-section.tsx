import { Button } from "@/components/ui/button";
import { CheckCircle, Brain, Clock, Users, Sparkles, Shield, Heart, Target, Star } from "lucide-react";
import techDevicesImage from "@assets/generated_images/Modern_tech_devices_mental_health_acb51148.png";
import robotHumanImage from "@assets/generated_images/Human_and_AI_robot_collaboration_1312c395.png";
import DomainInfoBanner from "@/components/ui/domain-info-banner";

export default function IntroCardSection() {
  return (
    <section id="intro-card" className="py-8 px-4 bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <div className="nflow-responsive-container">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden w-full">
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

            {/* Domain Info Banner */}
            <div className="mb-8">
              <DomainInfoBanner />
            </div>

            {/* Main Features Grid */}
            <div className="grid md:grid-cols-3 nflow-wide-grid mb-10">
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

            {/* Visual Gallery Section */}
            <div className="grid md:grid-cols-2 gap-6 lg:gap-10 xl:gap-12 mb-8">
              <div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <img 
                  src={techDevicesImage}
                  alt="Dispositivos tecnológicos para salud mental - NFLOW"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h4 className="font-bold text-lg mb-1">Acceso Multiplataforma</h4>
                  <p className="text-sm opacity-90">Disponible en móvil, tablet y ordenador</p>
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <img 
                  src={robotHumanImage}
                  alt="Colaboración humano-IA en NFLOW"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h4 className="font-bold text-lg mb-1">NFLOW</h4>
                  <p className="text-sm opacity-90">Tu asistente inteligente empático</p>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="grid md:grid-cols-4 gap-4 lg:gap-6 xl:gap-8 mb-8">
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
                Empezar Ahora
              </Button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}