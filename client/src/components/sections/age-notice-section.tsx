import { Brain, AlertCircle, Users, Shield, Sparkles, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function AgeNoticeSection() {
  return (
    <section className="py-20 px-4 bg-gray-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-nflow-orange rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="max-w-2xl mx-auto relative z-10">
        <Card className="bg-gray-800/95 border-2 border-nflow-orange/50 shadow-2xl backdrop-blur-sm overflow-hidden">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-nflow-orange/10 to-blue-500/10"></div>
          
          <CardContent className="p-10 relative z-10">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-nflow-orange/30 rounded-full blur-lg animate-pulse"></div>
                  <div className="relative p-4 bg-gradient-to-br from-nflow-orange to-orange-600 rounded-full shadow-lg">
                    <Brain className="w-10 h-10 text-white" />
                  </div>
                  <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-yellow-400 animate-bounce" />
                </div>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-nflow-orange via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                🧠 Importante: Chat disponible a partir de los 12 años
              </h2>
            </div>

            <div className="space-y-8">
              {/* Main Age Range Display */}
              <div className="text-center bg-gray-700/80 border-2 border-nflow-orange/60 rounded-2xl p-8">
                <div className="inline-flex items-center justify-center mb-4">
                  <div className="text-6xl font-bold text-nflow-orange">
                    12 a 95
                  </div>
                </div>
                <div className="text-lg font-medium text-white mb-2">años</div>
                <p className="text-gray-200 max-w-2xl mx-auto leading-relaxed">
                  A partir de los 12 años, consideramos que ya se puede leer, escribir y reflexionar de manera suficiente como para interactuar con un chatbot psicológico.
                </p>
              </div>

              {/* Feature Cards */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="group hover:scale-105 transition-all duration-300">
                  <div className="p-6 bg-gray-700/60 border-2 border-green-500/60 rounded-2xl relative overflow-hidden">
                    <div className="relative z-10">
                      <div className="flex items-center mb-4">
                        <div className="p-3 bg-green-500 rounded-full mr-4">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-green-400">👉 Adaptación Automática</h3>
                      </div>
                      <p className="text-gray-200 leading-relaxed">
                        El contenido y el lenguaje del chat se adaptan automáticamente según la edad del usuario, garantizando una experiencia ajustada, respetuosa y adecuada para cada etapa de la vida.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="group hover:scale-105 transition-all duration-300">
                  <div className="p-6 bg-gray-700/60 border-2 border-red-500/60 rounded-2xl relative overflow-hidden">
                    <div className="relative z-10">
                      <div className="flex items-center mb-4">
                        <div className="p-3 bg-red-500 rounded-full mr-4">
                          <Lock className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-red-400">Restricción de Edad</h3>
                      </div>
                      <p className="text-gray-200 leading-relaxed">
                        Si tienes menos de 12 años, este chat no está habilitado para ti. Recomendamos buscar apoyo presencial con un adulto de confianza.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Notice */}
              <div className="text-center p-6 bg-gray-700/60 border-2 border-blue-500/60 rounded-2xl">
                <div className="flex justify-center items-center mb-3">
                  <Shield className="w-6 h-6 text-blue-400 mr-3" />
                  <span className="text-xl font-bold text-blue-400">
                    Uso Responsable y Seguro
                  </span>
                </div>
                <p className="text-gray-200 max-w-3xl mx-auto leading-relaxed">
                  Nuestro compromiso es proporcionar apoyo psicológico adecuado y seguro para cada usuario, respetando las necesidades específicas de cada grupo de edad.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}