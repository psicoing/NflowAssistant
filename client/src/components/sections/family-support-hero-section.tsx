import { Users, Shield, Award, Clock, MessageCircle, PlayCircle, FileText, X, Brain, Heart, Menu, ShieldCheck, Compass, Bot, Sparkles, ArrowRight, AlertTriangle, BookOpen, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation, Link } from "wouter";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

export default function FamilySupportHeroSection() {
  const [, setLocation] = useLocation();
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [isLegalNoticeOpen, setIsLegalNoticeOpen] = useState(false);

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

                <div className="max-w-2xl mx-auto px-6 py-4 rounded-2xl font-medium text-[12px] text-white leading-relaxed animate-traffic-light shadow-lg text-center space-y-2">
                  <p className="font-bold">NUXA es un orientador en psicología.</p>
                  <p>No realiza tratamientos ni psicoterapia.</p>
                  <p>Su función es ayudarte a aclarar, ordenar y comprender lo que te ocurre, tanto a nivel personal como laboral.</p>
                  <p className="opacity-90 text-[11px]">Si necesitas atención clínica o psiquiátrica, es importante acudir a un profesional colegiado.</p>
                </div>
              </div>

              {/* Target Audience */}
              <div className="text-center pt-6">
                <p className="text-2xl md:text-3xl font-bold text-blue-900 dark:text-blue-300 tracking-wide" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  PERSONAS, FAMILIAS Y EMPRESAS
                </p>
                <p className="text-[10px] text-blue-800/70 dark:text-blue-400/70 mt-1">
                  (antes NUXA se llamaba NFLOW)
                </p>
              </div>
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
                onClick={() => window.dispatchEvent(new CustomEvent("openNuxaMenu"))}
                className="group relative bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:via-teal-600 hover:to-emerald-700 text-white px-12 py-8 text-xl font-bold rounded-2xl shadow-[0_10px_40px_rgba(16,185,129,0.4)] hover:shadow-[0_15px_50px_rgba(16,185,129,0.6)] transition-all duration-500 transform hover:scale-110 active:scale-95 border-2 border-white/20"
                style={{
                  animation: 'colorShift 3s ease-in-out infinite'
                }}
                data-testid="button-descubre-nuxa"
              >
                <span className="absolute inset-0 rounded-2xl bg-gradient-to-t from-white/0 to-white/20 pointer-events-none"></span>
                <span className="flex items-center gap-3">
                  <Menu className="w-7 h-7 group-hover:rotate-90 transition-transform duration-300" />
                  <span>Descubre NUXA</span>
                  <span className="text-2xl group-hover:translate-x-1 transition-transform duration-300">→</span>
                </span>
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
                <Link
                  href="/quienes-somos"
                  className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-700 hover:shadow-md transition-all duration-200"
                >
                  Saber más <ArrowRight className="w-3 h-3" />
                </Link>
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
                <button
                  onClick={() => setIsLegalNoticeOpen(true)}
                  className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 bg-cyan-50 dark:bg-cyan-900/30 px-3 py-1.5 rounded-full border border-cyan-200 dark:border-cyan-700 hover:shadow-md transition-all duration-200"
                >
                  Ver aviso legal <ArrowRight className="w-3 h-3" />
                </button>
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
                <Link
                  href="/ejemplos-chat"
                  className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 bg-teal-50 dark:bg-teal-900/30 px-3 py-1.5 rounded-full border border-teal-200 dark:border-teal-700 hover:shadow-md transition-all duration-200"
                >
                  Ver ejemplos <ArrowRight className="w-3 h-3" />
                </Link>
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
                <Link
                  href="/recursos"
                  className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-full border border-blue-200 dark:border-blue-700 hover:shadow-md transition-all duration-200"
                >
                  Probar gratis <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Botones de acceso rápido */}
            <div className="flex flex-wrap justify-center items-center gap-3 mt-6">
              <Link 
                href="/novedades"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-bold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Sparkles className="w-5 h-5" />
                <span>Novedades</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link 
                href="/recursos"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <BookOpen className="w-5 h-5" />
                <span>Recursos Gratuitos</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a 
                href="#testimonials"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <Star className="w-5 h-5" />
                <span>Opiniones</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              
              <button 
                onClick={() => setIsLegalNoticeOpen(true)}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <AlertTriangle className="w-5 h-5" />
                <span>Aviso Legal Usuarios</span>
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

      {/* Modal Aviso Legal Usuarios */}
      <Dialog open={isLegalNoticeOpen} onOpenChange={setIsLegalNoticeOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
          <DialogHeader className="pb-4 border-b border-gray-200 dark:border-gray-700">
            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <span>AVISO SOBRE NUXA</span>
                <span className="block text-xs font-normal text-gray-500 dark:text-gray-400">Actualización: enero 2026</span>
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-4 space-y-6 text-gray-700 dark:text-gray-300">
            <p className="leading-relaxed">
              <strong>NUXA</strong> es una plataforma de software de orientación y apoyo emocional, diseñada con fines preventivos e informativos.
            </p>
            
            <p className="leading-relaxed">
              NUXA <strong>no presta asistencia sanitaria</strong>, no constituye una consulta psicológica ni médica, y no sustituye en ningún caso la evaluación, el diagnóstico o el tratamiento por parte de profesionales cualificados.
            </p>
            
            <p className="leading-relaxed">
              La plataforma permite a los usuarios reflexionar, orientarse y acceder a recursos de apoyo emocional, así como interactuar con funcionalidades digitales (texto y voz, como medios de interacción digital) destinadas a mejorar la comprensión del propio estado emocional y facilitar la orientación temprana.
            </p>
            
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-4">
              <p className="text-amber-800 dark:text-amber-200 font-medium">
                El uso de NUXA tiene un carácter <strong>no asistencial, no clínico y no terapéutico</strong>.
              </p>
              <p className="text-amber-700 dark:text-amber-300 text-sm mt-2">
                En situaciones de malestar intenso, riesgo para la salud o emergencia, se recomienda acudir a los servicios sanitarios correspondientes o contactar con profesionales de referencia.
              </p>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="font-bold text-gray-900 dark:text-white mb-3">Uso por empresas, mutuas y entidades</h4>
              <p className="leading-relaxed mb-3">
                NUXA se ofrece a empresas, mutuas, aseguradoras y otras entidades en régimen de licencia o arrendamiento de software.
              </p>
              <p className="leading-relaxed mb-3">
                El licenciante pone a disposición del licenciatario una herramienta digital de orientación y apoyo psicoemocional de carácter preventivo e informativo. El uso de la plataforma no constituye acto sanitario, ni implica la prestación de servicios clínicos, médicos o psicológicos directos por parte del licenciante.
              </p>
              <p className="leading-relaxed">
                La integración de NUXA en programas de bienestar, prevención o apoyo psicosocial no sustituye los circuitos asistenciales propios de cada entidad, ni la intervención profesional cuando esta sea necesaria.
              </p>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <p className="leading-relaxed font-semibold text-gray-800 dark:text-gray-200 text-center italic">
                NUXA actúa exclusivamente como herramienta digital de orientación preventiva.
              </p>
            </div>
            
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center">
              <p className="font-medium text-gray-800 dark:text-gray-200">
                📋 <strong>Aceptación del aviso</strong>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                El uso de NUXA implica la aceptación expresa de este aviso y del carácter orientativo, preventivo y no asistencial de la plataforma.
              </p>
            </div>
            
            <div className="text-center pt-2 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Última actualización del aviso: enero 2026
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
