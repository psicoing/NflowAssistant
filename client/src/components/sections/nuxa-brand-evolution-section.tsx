import { Users, Heart, Sparkles, Phone } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import nuxaLogo from "@assets/generated_images/NUXA_logo_with_circle_person_ba9dba6f.png";

export default function NuxaBrandEvolutionSection() {
  return (
    <section className="relative bg-white dark:bg-slate-900 py-12 md:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* NUXA Logo + Title */}
        <div className="flex flex-col items-center gap-4 mb-6">
          <img 
            src={nuxaLogo} 
            alt="NUXA" 
            className="w-20 h-20 md:w-24 md:h-24 rounded-2xl shadow-xl border-2 border-gray-200 dark:border-gray-700"
          />
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white text-center">
            🌿 <span className="text-orange-600 dark:text-orange-400">NUXA</span> — Tu espacio de bienestar
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-center max-w-xl">
            La evolución de NFlow: ciencia, emoción y conexión humana
          </p>
        </div>

        {/* Features Grid - Compacto */}
        <div className="grid grid-cols-3 gap-3 md:gap-4 max-w-2xl mx-auto">
          <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 dark:bg-slate-800 rounded-xl">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300 text-center font-medium">
              Familias y empresas
            </p>
          </div>

          <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 dark:bg-slate-800 rounded-xl">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300 text-center font-medium">
              Bienestar emocional
            </p>
          </div>

          <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 dark:bg-slate-800 rounded-xl">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300 text-center font-medium">
              Psicología + IA
            </p>
          </div>
        </div>

        {/* Emergency Helplines Button */}
        <div className="flex justify-center mt-8">
          <Link href="/recursos?helplines=true">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold px-8 py-6 text-base shadow-lg"
              data-testid="button-emergency-helplines"
            >
              <Phone className="w-5 h-5 mr-3" />
              <div className="flex flex-col items-start leading-tight">
                <span>TELÉFONOS DE URGENCIAS</span>
                <span className="text-xs font-normal opacity-90">Emergency Helplines</span>
              </div>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
