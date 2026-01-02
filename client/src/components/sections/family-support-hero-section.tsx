import { Users, Shield, Award, Clock, MessageCircle, PlayCircle, FileText, X, Brain, Heart } from "lucide-react";
import nuxaRobotConnecting from "@assets/generated_images/nuxa_robot_connecting_people_unity.png";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

export default function FamilySupportHeroSection() {
  const [, setLocation] = useLocation();
  const [isPdfOpen, setIsPdfOpen] = useState(false);

  return (
    <section className="relative bg-white dark:bg-slate-900 py-16 md:py-24 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          
          {/* Content */}
          <div className="space-y-6 md:space-y-8">
            {/* Main Hero Card */}
            <div className="bg-gradient-to-br from-white to-emerald-50/30 dark:from-slate-800 dark:to-slate-800 rounded-3xl border-2 border-emerald-200 dark:border-slate-700 shadow-xl p-8 md:p-12">
              <div className="mb-8">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-gray-900 dark:text-white mb-6" style={{ WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale' }}>
                  NUXA
                </h1>
                <p className="text-2xl md:text-3xl text-emerald-600 dark:text-emerald-400 font-bold mb-4">
                  Hola, ¿me cuentas qué te preocupa?
                </p>
                
                {/* Handwritten keywords */}
                <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mb-6 max-w-2xl mx-auto">
                  {[
                    "estrés emocional", "ansiedad diaria", "ansiedad laboral", 
                    "estrés en el trabajo", "pensamientos repetitivos", "bloqueo emocional",
                    "problemas familiares", "sentirse desbordado", "cansancio mental",
                    "dificultad para dormir", "preocupación constante", "soledad emocional"
                  ].map((keyword, index) => (
                    <span 
                      key={index}
                      className="text-gray-500 dark:text-gray-400 text-base md:text-base italic"
                      style={{ 
                        fontFamily: "'Segoe Script', 'Bradley Hand', 'Comic Sans MS', cursive",
                        transform: `rotate(${(index % 3 - 1) * 1}deg)`
                      }}
                    >
                      {keyword}{index < 11 ? " ·" : ""}
                    </span>
                  ))}
                </div>

                <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-relaxed max-w-xl mx-auto">
                  NUXA es un orientador en psicología que no hace tratamientos ni psicoterapia, ayuda a las personas y empresas a mejorar la salud mental. Habla 150 idiomas.
                </p>
              </div>

              {/* Target Audience */}
              <div className="text-center pt-6">
                <p className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-200 tracking-wide">
                  PERSONAS, FAMILIAS Y EMPRESAS
                </p>
              </div>

              {/* Social Proof */}
              <div className="flex justify-center items-center pt-4">
                <div className="flex items-center gap-3 bg-white dark:bg-slate-700 px-6 py-3 rounded-full border-2 border-emerald-300 dark:border-emerald-600 shadow-lg">
                  <div className="flex -space-x-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 border-2 border-white dark:border-slate-900"></div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 border-2 border-white dark:border-slate-900"></div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 border-2 border-white dark:border-slate-900"></div>
                  </div>
                  <p className="text-base text-gray-900 dark:text-gray-100 font-semibold">
                    <span className="font-extrabold text-emerald-700 dark:text-emerald-400">+140,000</span> fuentes de psicología
                  </p>
                </div>
              </div>
            </div>

            {/* Robot Image Separator */}
            <div className="w-full py-6 overflow-hidden" style={{ marginLeft: 'calc(-50vw + 50%)', width: '100vw' }}>
              <img 
                src={nuxaRobotConnecting} 
                alt="Robot NUXA conectando personas" 
                className="w-full h-auto max-h-[250px] md:max-h-[300px] object-cover"
                data-testid="img-nuxa-robot-features"
              />
            </div>

            {/* Value proposition */}
            <div className="text-center mb-8 space-y-2 max-w-2xl mx-auto">
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 font-medium">
                Aquí puedes recibir una respuesta única y personalizada antes de decidir continuar.
              </p>
              <p className="text-xs md:text-sm text-emerald-600 dark:text-emerald-400 italic">
                NUXA responde en tu idioma, con empatía y foco en tu experiencia.
              </p>
            </div>

            {/* CTA Button */}
            <div className="flex justify-center mb-10">
              <Button
                onClick={() => setLocation("/ejemplos-chat")}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-10 py-7 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
                data-testid="button-prueba-gratis"
              >
                <PlayCircle className="w-6 h-6 mr-3" />
                Prueba Gratis / Free Trial
              </Button>
            </div>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {/* Para Toda la Familia */}
              <div className="flex flex-col items-center text-center gap-3 bg-white dark:bg-slate-800 p-6 rounded-2xl border-2 border-emerald-200 dark:border-slate-700 hover:shadow-xl hover:border-emerald-400 dark:hover:border-emerald-600 transition-all duration-300 transform hover:scale-105">
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-gray-900 dark:text-white mb-2 text-lg">Para Toda la Familia</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">Apoyo integral desde los 12 años</p>
                </div>
              </div>

              {/* 100% Confidencial */}
              <div className="flex flex-col items-center text-center gap-3 bg-white dark:bg-slate-800 p-6 rounded-2xl border-2 border-cyan-200 dark:border-slate-700 hover:shadow-xl hover:border-cyan-400 dark:hover:border-cyan-600 transition-all duration-300 transform hover:scale-105">
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-gray-900 dark:text-white mb-2 text-lg">100% Confidencial</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">Privacidad y anonimato garantizados</p>
                </div>
              </div>

              {/* Profesional */}
              <div className="flex flex-col items-center text-center gap-3 bg-white dark:bg-slate-800 p-6 rounded-2xl border-2 border-teal-200 dark:border-slate-700 hover:shadow-xl hover:border-teal-400 dark:hover:border-teal-600 transition-all duration-300 transform hover:scale-105">
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Award className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-gray-900 dark:text-white mb-2 text-lg">Profesional</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">Basado en 30+ años de experiencia</p>
                </div>
              </div>

              {/* Con nuxa, equilibrio presente */}
              <div className="flex flex-col items-center text-center gap-3 bg-white dark:bg-slate-800 p-6 rounded-2xl border-2 border-blue-200 dark:border-slate-700 hover:shadow-xl hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-300 transform hover:scale-105">
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Clock className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-gray-900 dark:text-white mb-2 text-lg">Con nuxa, equilibrio presente</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">Apoyo cuando lo necesites</p>
                </div>
              </div>
            </div>

            {/* Decorative Separator */}
            <div className="flex items-center justify-center gap-4 my-10">
              <div className="flex-1 h-1 bg-gradient-to-r from-transparent via-emerald-300 to-emerald-400 rounded-full"></div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                <div className="w-4 h-4 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full"></div>
                <div className="w-3 h-3 bg-teal-400 rounded-full"></div>
              </div>
              <div className="flex-1 h-1 bg-gradient-to-l from-transparent via-teal-300 to-teal-400 rounded-full"></div>
            </div>

            {/* Banner Departamento de Salud */}
            <div className="max-w-3xl mx-auto">
              <button
                onClick={() => setIsPdfOpen(true)}
                className="w-full bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-2 border-emerald-400 dark:border-emerald-600 rounded-2xl p-6 hover:shadow-xl hover:border-emerald-500 dark:hover:border-emerald-500 transition-all duration-300 transform hover:scale-105 group"
                data-testid="button-departamento-salud"
              >
                <div className="flex items-center justify-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left flex-1">
                    <h4 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                      Recomendado por Departamento de Salud
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Haz clic para ver la nota informativa oficial
                    </p>
                  </div>
                  {/* Iconos decorativos de salud mental */}
                  <div className="hidden md:flex items-center gap-2 flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-400/20 to-emerald-400/20 rounded-lg flex items-center justify-center border border-emerald-300/30">
                      <Brain className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-lg flex items-center justify-center border border-emerald-300/30">
                      <Heart className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Modal para Nota Informativa */}
      <Dialog open={isPdfOpen} onOpenChange={setIsPdfOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                Nota Informativa - Departament de Salut
              </DialogTitle>
            </div>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[calc(90vh-100px)] bg-white dark:bg-gray-900">
            <div className="relative">
              {/* Recuadro informativo */}
              <div className="sticky top-0 z-10 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-4 shadow-lg">
                <div className="flex items-center justify-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">NFlow.Style</span>
                    <span className="text-xl">→</span>
                    <span className="font-bold text-lg">NUXA.life</span>
                  </div>
                </div>
                <p className="text-center text-sm mt-1 opacity-90">
                  NFlow.Style is now NUXA.life
                </p>
              </div>
              
              <img
                src="/nota-departamento-salud.png"
                alt="Nota Informativa del Departament de Salut sobre NUXA.life"
                className="w-full h-auto"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
