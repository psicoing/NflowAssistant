import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Brain, ArrowRight, Eye, Users, Sparkles } from "lucide-react";
import { Link } from "wouter";

export default function ChatExamplesSection() {
  return (
    <section className="py-16 px-4 bg-gradient-to-b from-nflow-dark to-nflow-navy">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          {/* Multilingual Welcome */}
          <div className="mb-6">
            <p className="text-lg text-blue-300 font-medium mb-2">
              Speaking 150+ languages • 支持150多种语言
            </p>
            <div className="w-20 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto"></div>
          </div>

          <div className="flex justify-center mb-6">
            <div className="p-3 bg-gradient-to-br from-nflow-orange to-orange-600 rounded-2xl shadow-lg">
              <Eye className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Conoce tu Asistente Psicológico
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Descubre ejemplos reales de conversaciones con nuestro asistente de IA especializado en salud mental. Respuestas profesionales adaptadas a cada situación específica.
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
                  Respuestas Multiidioma
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  El asistente adapta automáticamente sus respuestas al idioma detectado en tu consulta, proporcionando apoyo psicológico natural y culturalmente apropiado.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-2">
                  Para Todas las Edades
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Desde adolescentes hasta adultos mayores, el asistente ajusta su enfoque terapéutico según la etapa vital y las necesidades específicas de cada usuario.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-2">
                  Enfoque Profesional
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Basado en técnicas de psicología clínica y terapia cognitivo-conductual, proporcionando orientación profesional con fundamento científico.
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
                      Ejemplos de Conversaciones
                    </h3>
                    <p className="text-gray-300 leading-relaxed mb-6">
                      Descubre cómo NEUROPSI-AI puede ayudarte con situaciones reales. Cada respuesta está diseñada para ofrecer apoyo psicológico profesional.
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