import { Button } from "@/components/ui/button";
import { Sparkles, MessageCircle } from "lucide-react";
import { Link } from "wouter";
import nuxaRobotForest from "@assets/generated_images/nuxa_robot_in_forest_setting.png";

export default function NuxaRobotHeroSection() {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative w-full h-[500px] md:h-[600px]">
        <img 
          src={nuxaRobotForest} 
          alt="Robot NUXA conversando en un bosque tranquilo" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-16 w-full">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-emerald-400" />
                <span className="text-emerald-400 font-semibold text-lg">Tu Psicólogo IA 24/7</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                Encuentra tu paz interior con NUXA
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed">
                Apoyo emocional personalizado cuando lo necesites. 
                Tu bienestar mental es nuestra prioridad.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/chat" data-testid="link-hero-chat">
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-8 py-6 text-lg w-full sm:w-auto"
                    data-testid="button-hero-chat"
                  >
                    <MessageCircle className="mr-2 w-5 h-5" />
                    Comenzar a Hablar
                  </Button>
                </Link>
                <Link href="/precios" data-testid="link-hero-precios">
                  <Button 
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white/20 px-8 py-6 text-lg w-full sm:w-auto"
                    data-testid="button-hero-precios"
                  >
                    Ver Planes
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
