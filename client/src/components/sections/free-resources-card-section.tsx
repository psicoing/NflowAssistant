import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gift, Heart, Brain, Sparkles, TrendingUp, ChevronRight } from "lucide-react";

export default function FreeResourcesCardSection() {
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto">
        <Card className="overflow-hidden border-none shadow-2xl bg-gradient-to-br from-white to-blue-50/50">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Left Side - Content */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-2 rounded-full mb-6 self-start">
                <Gift className="w-5 h-5" />
                <span className="font-semibold">100% Gratuito</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Recursos de Salud Mental
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Sin Registro
                </span>
              </h2>
              
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Accede ahora a ejercicios, evaluaciones profesionales y contenido de bienestar. Todo funciona directamente en tu navegador, sin necesidad de crear una cuenta.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Heart className="w-5 h-5 text-orange-600" />
                  </div>
                  <span className="text-gray-700 font-medium">Registro emocional diario</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Brain className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="text-gray-700 font-medium">Evaluaciones profesionales</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-pink-600" />
                  </div>
                  <span className="text-gray-700 font-medium">Afirmaciones positivas</span>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-amber-600" />
                  </div>
                  <span className="text-gray-700 font-medium">Sistema de racha diaria</span>
                </div>
              </div>

              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-lg px-8 self-start group"
                onClick={() => window.location.href = "/recursos"}
                data-testid="button-go-to-free-resources"
              >
                Explorar Recursos Gratis
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Right Side - Visual */}
            <div className="relative bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 p-8 md:p-12 flex items-center justify-center">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
              
              <div className="relative space-y-4 w-full max-w-sm">
                {/* Decorative cards showing resources */}
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 transform rotate-2 hover:rotate-0 transition-transform">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 bg-white/30 rounded-xl flex items-center justify-center">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold">Registro Diario</h4>
                      <p className="text-blue-100 text-sm">Monitorea tus emociones</p>
                    </div>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white/60 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>

                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 transform -rotate-2 hover:rotate-0 transition-transform">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 bg-white/30 rounded-xl flex items-center justify-center">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold">Evaluaciones</h4>
                      <p className="text-blue-100 text-sm">Resultados al instante</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Badge className="bg-white/30 text-white border-white/40">Ansiedad</Badge>
                    <Badge className="bg-white/30 text-white border-white/40">Depresión</Badge>
                  </div>
                </div>

                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 transform rotate-1 hover:rotate-0 transition-transform">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/30 rounded-xl flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold">Afirmaciones</h4>
                      <p className="text-blue-100 text-sm">Mensajes positivos diarios</p>
                    </div>
                  </div>
                </div>

                {/* Streak indicator */}
                <div className="flex items-center justify-center space-x-3 bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                  <span className="text-4xl">🔥</span>
                  <div>
                    <p className="text-white font-bold text-2xl">Racha Diaria</p>
                    <p className="text-blue-100 text-sm">Mantén tu compromiso</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
