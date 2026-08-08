import { Users, Heart, Sparkles, Phone, ArrowRight, MessageCircle, CheckCircle } from "lucide-react";
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
          
          {/* NFLOW to NUXA Evolution Badge */}
          <div className="flex items-center gap-3 bg-gradient-to-r from-gray-100 via-emerald-50 to-gray-100 dark:from-slate-800 dark:via-emerald-900/30 dark:to-slate-800 px-5 py-3 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm">
            <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 line-through decoration-2">NFLOW</span>
            <ArrowRight className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">NUXA</span>
          </div>
          
          <p className="text-gray-600 dark:text-gray-400 text-center max-w-xl text-sm">
            Hemos evolucionado de NFLOW a NUXA: más ciencia, más emoción, más conexión humana
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

        {/* Free trial banner */}
        <div className="mt-6 max-w-3xl mx-auto">
          <Link href="/registro/planes">
            <div className="group relative overflow-hidden rounded-2xl border-2 border-emerald-300 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 hover:from-emerald-100 hover:to-teal-100 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 pointer-events-none" />
              <div className="relative px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg font-bold text-emerald-800">¿No estás seguro? Pruébalo gratis</span>
                    <span className="inline-flex items-center bg-emerald-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                      GRATIS
                    </span>
                  </div>
                  <p className="text-emerald-700 text-sm leading-relaxed mb-2">
                    Accede ahora con 5 consultas sin coste ni tarjeta de crédito. Habla con NUXA y decide después si quieres continuar con un plan.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {["5 preguntas gratis", "Sin tarjeta de crédito", "Acceso inmediato"].map((item) => (
                      <span key={item} className="inline-flex items-center gap-1 text-xs text-emerald-700 font-medium">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex-shrink-0 flex items-center gap-2 text-emerald-700 font-semibold text-sm group-hover:gap-3 transition-all">
                  <MessageCircle className="w-5 h-5" />
                  <span>Empezar ahora</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
