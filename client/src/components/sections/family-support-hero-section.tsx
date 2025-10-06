import { Users, Shield, Award, Clock } from "lucide-react";
import familyImage from "@assets/image_1759748297357.png";

export default function FamilySupportHeroSection() {
  return (
    <section className="relative bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-nflow-dark py-12 md:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Content Side */}
          <div className="space-y-6 md:space-y-8 order-2 lg:order-1">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
                Apoyo emocional para las personas
              </h1>
              <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                Cada persona merece apoyo emocional profesional. NFLOW conecta familias, adolescentes, trabajadores y adultos con herramientas de bienestar mental respaldadas por la ciencia y la experiencia clínica.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Para Toda la Familia */}
              <div className="flex items-start gap-3 bg-white dark:bg-slate-800/50 p-4 rounded-xl border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
                <div className="flex-shrink-0 w-10 h-10 bg-nflow-orange/10 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-nflow-orange" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Para Toda la Familia</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Apoyo integral desde los 12 años</p>
                </div>
              </div>

              {/* 100% Confidencial */}
              <div className="flex items-start gap-3 bg-white dark:bg-slate-800/50 p-4 rounded-xl border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
                <div className="flex-shrink-0 w-10 h-10 bg-nflow-orange/10 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-nflow-orange" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">100% Confidencial</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Privacidad y anonimato garantizados</p>
                </div>
              </div>

              {/* Profesional */}
              <div className="flex items-start gap-3 bg-white dark:bg-slate-800/50 p-4 rounded-xl border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
                <div className="flex-shrink-0 w-10 h-10 bg-nflow-orange/10 rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-nflow-orange" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Profesional</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Basado en 30+ años de experiencia</p>
                </div>
              </div>

              {/* Disponible 24/7 */}
              <div className="flex items-start gap-3 bg-white dark:bg-slate-800/50 p-4 rounded-xl border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
                <div className="flex-shrink-0 w-10 h-10 bg-nflow-orange/10 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-nflow-orange" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Disponible 24/7</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Apoyo cuando lo necesites</p>
                </div>
              </div>
            </div>
          </div>

          {/* Image Side */}
          <div className="order-1 lg:order-2">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={familyImage} 
                alt="Familia usando NFLOW - Apoyo emocional profesional"
                className="w-full h-auto object-cover"
                data-testid="img-family-hero"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
