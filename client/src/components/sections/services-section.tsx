import { Button } from "@/components/ui/button";
import { CheckCircle, Smartphone, Info, Smile, Heart } from "lucide-react";
import { useLocation } from "wouter";

export default function ServicesSection() {
  const [, setLocation] = useLocation();

  const handleTryApp = () => {
    setLocation("/chat");
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="servicios" className="py-20 px-4 bg-gradient-to-br from-nflow-dark to-nflow-navy">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="text-white">Acompañamiento emocional</span><br />
              <span className="text-nflow-orange">moderno</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              NFLOW te ofrece herramientas psicológicas basadas en evidencia científica 
              y adaptadas a tu estilo de vida digital.
            </p>

            {/* Features List */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-nflow-orange flex-shrink-0" />
                <span className="text-gray-200">Chat de apoyo psicológico 24/7</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-nflow-orange flex-shrink-0" />
                <span className="text-gray-200">Seguimiento de tu bienestar emocional</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-nflow-orange flex-shrink-0" />
                <span className="text-gray-200">Recursos para adolescentes, padres y profesionales</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={handleTryApp}
                className="bg-nflow-blue hover:bg-nflow-blue-dark text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
              >
                <Smartphone className="w-5 h-5 mr-2" />
                Probar la aplicación
              </Button>
              <Button 
                variant="outline"
                onClick={() => scrollToSection("recursos")}
                className="border border-gray-600 text-gray-300 hover:text-white hover:border-gray-400 px-6 py-3 rounded-xl font-semibold transition-all duration-300"
              >
                <Info className="w-5 h-5 mr-2" />
                Más información
              </Button>
            </div>
          </div>

          {/* App Mockups */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              {/* Chat App Mockup */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-3xl border border-gray-700 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="bg-yellow-500 rounded-2xl p-3 text-center mb-3">
                  <div className="w-8 h-8 bg-black/20 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <Smile className="w-5 h-5 text-yellow-200" />
                  </div>
                  <div className="text-black font-bold text-sm">NFLOW Chat</div>
                </div>
                <div className="space-y-2">
                  <div className="bg-blue-600 text-white p-2 rounded-lg text-xs">
                    ¿Cómo puedo ayudarte hoy?
                  </div>
                  <div className="bg-gray-700 text-gray-200 p-2 rounded-lg text-xs text-right">
                    Me siento abrumado...
                  </div>
                </div>
              </div>

              {/* Mood Tracker Mockup */}
              <div className="bg-gradient-to-br from-blue-900 to-blue-800 p-4 rounded-3xl border border-blue-700 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="text-center mb-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-white font-bold text-sm">NFLOW Mood</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-300 text-xs mb-2">Ansiedad</div>
                  <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                    <div className="bg-yellow-400 h-2 rounded-full w-3/4"></div>
                  </div>
                  <div className="text-gray-400 text-xs">Estás mejorando</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
