import { Users, Shield, Award, Clock, MessageCircle, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import nuxaVerticalPhone from "@assets/generated_images/Vertical_NUXA_phone_mockup_ee80d374.png";

export default function FamilySupportHeroSection() {
  const [, setLocation] = useLocation();

  return (
    <section className="relative bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-nflow-dark py-12 md:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Content Side */}
          <div className="space-y-6 md:space-y-8 order-2 lg:order-1">
            <div>
              <div className="text-center mb-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-blue-900 md:text-gray-900 dark:text-white">
                  NUXA
                </h1>
                <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-2 italic">
                  (nflow powered system)
                </p>
              </div>
              <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                NUXA, para personas y empresas.<br />
                Apoyo emocional y salud mental con IA en español y más de 150 idiomas.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => setLocation("/login")}
                className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                data-testid="button-comenzar-chat"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Comenzar Ahora
              </Button>
              
              <Button
                onClick={() => {
                  const element = document.getElementById('tour-nflow');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                variant="outline"
                className="border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white px-8 py-6 text-lg font-semibold rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
                data-testid="button-ver-como-funciona"
              >
                <PlayCircle className="w-5 h-5 mr-2" />
                Ver Cómo Funciona
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-6 pt-2">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 border-2 border-white dark:border-slate-900"></div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 border-2 border-white dark:border-slate-900"></div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 border-2 border-white dark:border-slate-900"></div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-bold text-gray-900 dark:text-white">+140,000</span> fuentes de psicología
                </p>
              </div>
              <div className="flex items-center gap-1" aria-label="Calificación de 4.8 de 5 estrellas">
                <span className="text-yellow-500" aria-hidden="true">⭐⭐⭐⭐⭐</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white ml-1">4.8/5</span>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Para Toda la Familia */}
              <div className="flex items-start gap-3 bg-white dark:bg-slate-800/50 p-4 rounded-xl border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
                <div className="flex-shrink-0 w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Para Toda la Familia</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Apoyo integral desde los 12 años</p>
                </div>
              </div>

              {/* 100% Confidencial */}
              <div className="flex items-start gap-3 bg-white dark:bg-slate-800/50 p-4 rounded-xl border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
                <div className="flex-shrink-0 w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-cyan-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">100% Confidencial</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Privacidad y anonimato garantizados</p>
                </div>
              </div>

              {/* Profesional */}
              <div className="flex items-start gap-3 bg-white dark:bg-slate-800/50 p-4 rounded-xl border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
                <div className="flex-shrink-0 w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Profesional</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Basado en 30+ años de experiencia</p>
                </div>
              </div>

              {/* Con nuxa, equilibrio presente */}
              <div className="flex items-start gap-3 bg-white dark:bg-slate-800/50 p-4 rounded-xl border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
                <div className="flex-shrink-0 w-10 h-10 bg-teal-500/10 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-teal-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Con nuxa, equilibrio presente</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Apoyo cuando lo necesites</p>
                </div>
              </div>
            </div>
          </div>

          {/* Image Side */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative max-w-[400px]">
              <img 
                src={nuxaVerticalPhone} 
                alt="NUXA - Tu Psicólogo IA siempre contigo"
                className="w-full h-auto object-contain drop-shadow-2xl"
                data-testid="img-nuxa-phone-hero"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
