import { Button } from "@/components/ui/button";
import { Smartphone, Heart, Brain, Shield, Clock } from "lucide-react";
import nflowImage from "@assets/generated_images/NFLOW_mental_health_app_05faf5ea.png";

export default function NFlowShowcaseSection() {
  return (
    <section id="app-movil" className="py-16 px-4 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Content */}
          <div className="text-white space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                Descubre <span className="text-orange-400">NUXA</span>
              </h2>
              <h3 className="text-2xl md:text-3xl font-light text-blue-200">
                Tu asistente de salud mental inteligente
              </h3>
              <p className="text-xl text-blue-100 leading-relaxed">
                Una experiencia revolucionaria que combina tecnología avanzada 
                con el cuidado profesional que mereces.
              </p>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">IA Profesional</h4>
                  <p className="text-blue-200 text-sm">Entrenada por expertos</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Apoyo Emocional</h4>
                  <p className="text-blue-200 text-sm">Cuando lo necesites</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">100% Privado</h4>
                  <p className="text-blue-200 text-sm">Confidencial y seguro</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Disponible 24/7</h4>
                  <p className="text-blue-200 text-sm">Siempre a tu lado</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => window.location.href = '/login'}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-8 py-4 rounded-full text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <Smartphone className="w-5 h-5 mr-2" />
                Comenzar Ahora
              </Button>
              <Button 
                variant="outline"
                className="border-2 border-blue-300 text-white hover:bg-blue-300 hover:text-blue-900 font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300"
              >
                Ver Demo
              </Button>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative z-10">
              <img 
                src={nflowImage} 
                alt="NUXA - Asistente de salud mental inteligente" 
                className="w-full h-auto rounded-3xl shadow-2xl"
              />
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-orange-400 opacity-20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-blue-400 opacity-20 rounded-full blur-xl"></div>
            <div className="absolute top-1/2 -right-12 w-24 h-24 bg-purple-400 opacity-15 rounded-full blur-lg"></div>
          </div>
        </div>
      </div>
    </section>
  );
}