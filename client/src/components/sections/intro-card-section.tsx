import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { CheckCircle, Brain, Clock, Users, Sparkles, Shield, Heart, Target, Star, Code, Zap, MessageSquare } from "lucide-react";
import techDevicesImage from "@assets/generated_images/Modern_tech_devices_mental_health_acb51148.png";
import robotHumanImage from "@assets/generated_images/Human_and_AI_robot_collaboration_1312c395.png";

export default function IntroCardSection() {
  return (
    <section id="intro-card" className="py-8 px-4 bg-gradient-to-br from-emerald-50 via-white to-cyan-50">
      <div className="nflow-responsive-container">
        <div className="overflow-hidden w-full">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-8 text-center">
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
                Con <strong className="text-teal-600">NUXA</strong>, accede a un asistente inteligente 
                entrenado en psicología y bienestar, diseñado para acompañarte cuando más lo necesitas.
              </p>
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

              <div className="text-center p-6 bg-gradient-to-br from-cyan-50 to-sky-50 rounded-2xl border border-cyan-100">
                <div className="flex items-center justify-center mb-4">
                  <Brain className="w-8 h-8 text-cyan-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Basado en Ciencia</h3>
                <p className="text-gray-600 text-sm">Lenguaje cercano y evidencia científica</p>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl border border-teal-100">
                <div className="flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-teal-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Con nuxa, tu equilibrio siempre presente</h3>
                <p className="text-gray-600 text-sm">Elegancia en cada conversación</p>
              </div>
            </div>

            {/* Advanced Technology Feature */}
            <div className="mb-10">
              <div className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 rounded-3xl p-8 text-white overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-center mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                        <Code className="w-8 h-8 text-white" />
                      </div>
                      <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                        <Brain className="w-8 h-8 text-white" />
                      </div>
                      <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                        <Zap className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-2xl md:text-3xl font-bold mb-4">
                      🚀 Tecnología LLM Avanzada
                    </h3>
                    <p className="text-lg md:text-xl text-purple-100 mb-6 max-w-3xl mx-auto leading-relaxed">
                      <strong>NUXA no es un chatbot con respuestas prefabricadas.</strong> Es un modelo de lenguaje LLM avanzado programado con Python e integrado con la tecnología más moderna de ChatGPT, diseñado específicamente para ofrecer una experiencia real y conversacional única.
                    </p>
                    
                    <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <MessageSquare className="w-6 h-6 text-purple-200 mx-auto mb-2" />
                        <div className="text-sm font-semibold text-purple-100">Conversación Natural</div>
                        <div className="text-xs text-purple-200 mt-1">Interacción fluida y humana</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <Brain className="w-6 h-6 text-purple-200 mx-auto mb-2" />
                        <div className="text-sm font-semibold text-purple-100">IA Contextual</div>
                        <div className="text-xs text-purple-200 mt-1">Comprende y adapta respuestas</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <Code className="w-6 h-6 text-purple-200 mx-auto mb-2" />
                        <div className="text-sm font-semibold text-purple-100">Programación Avanzada</div>
                        <div className="text-xs text-purple-200 mt-1">Python + GPT integrados</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Gallery Section */}
            <div className="grid md:grid-cols-2 gap-6 lg:gap-10 xl:gap-12 mb-10">
              <div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <img 
                  src={techDevicesImage}
                  alt="Acceso multiplataforma - NUXA en móvil, tablet y ordenador"
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
                  alt="Colaboración humano-IA en NUXA"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h4 className="font-bold text-lg mb-1">IA + Humanidad</h4>
                  <p className="text-sm opacity-90">Tecnología empática al servicio del bienestar</p>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="grid md:grid-cols-3 gap-4 lg:gap-6 xl:gap-8 mb-8">
              <div className="text-center p-4">
                <div className="text-2xl font-bold text-teal-600 mb-1">+50</div>
                <div className="text-sm text-gray-600">Especialidades</div>
              </div>
              <div className="text-center p-4">
                <div className="text-2xl font-bold text-emerald-600 mb-1">100%</div>
                <div className="text-sm text-gray-600">Confidencial</div>
              </div>
              <div className="text-center p-4">
                <div className="text-2xl font-bold text-cyan-600 mb-1">+150</div>
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
              <Link href="/login">
                <Button
                  className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white font-semibold px-12 py-4 rounded-full text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Empezar Ahora
                </Button>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}