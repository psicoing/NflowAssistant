import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Brain, ArrowRight, Eye, Users, Sparkles } from "lucide-react";
import { Link } from "wouter";

export default function ChatExamplesSection() {
  return (
    <section className="py-16 px-4 bg-gradient-to-b from-nflow-dark to-nflow-navy">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-gradient-to-br from-nflow-orange to-orange-600 rounded-2xl shadow-lg">
              <Eye className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ¿Cómo responde nuestro asistente?
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Descubre ejemplos reales de cómo NEUROPSI-AI adapta sus respuestas según tu edad, 
            desde adolescentes hasta adultos mayores.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left side - Features */}
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Brain className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-2">
                  Lenguaje Adaptado por Edad
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Desde un lenguaje cercano y comprensible para adolescentes hasta análisis 
                  psicológicos profundos para adultos.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-2">
                  16 Franjas de Edad Diferentes
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Ejemplos específicos para cada etapa vital, desde 12 hasta 80 años, 
                  con situaciones y desafíos reales de cada edad.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-2">
                  Respuestas Profesionales
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Consejos estructurados, técnicas específicas y bibliografía 
                  especializada para cada situación.
                </p>
              </div>
            </div>
          </div>

          {/* Right side - CTA Card */}
          <div>
            <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-gray-700/50 overflow-hidden">
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-nflow-orange to-orange-600 rounded-2xl mx-auto flex items-center justify-center">
                    <MessageCircle className="w-8 h-8 text-white" />
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-3">
                      Ver Ejemplos Reales
                    </h3>
                    <p className="text-gray-300 leading-relaxed mb-6">
                      Explora cómo nuestro asistente de psicología responde a diferentes 
                      consultas según tu edad y situación personal.
                    </p>
                  </div>

                  <div className="bg-gray-700/30 rounded-lg p-4 text-left">
                    <div className="text-sm text-gray-400 mb-2">Ejemplos incluyen:</div>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Ansiedad en adolescentes</li>
                      <li>• Crisis profesional en adultos</li>
                      <li>• Duelo en la tercera edad</li>
                      <li>• Problemas familiares</li>
                    </ul>
                  </div>

                  <Link href="/ejemplos-chat">
                    <Button 
                      className="w-full bg-nflow-orange hover:bg-nflow-orange-light text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 group"
                    >
                      Ver ejemplos del chat
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>

                  <p className="text-xs text-gray-500">
                    Gratis • Sin necesidad de registro
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}