import { Sparkles, ArrowRight } from "lucide-react";

export default function NflowToNuxaTransitionSection() {
  return (
    <section className="relative bg-white dark:bg-slate-900 py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-slate-800 dark:via-slate-800 dark:to-slate-700 rounded-3xl p-8 md:p-12 border-2 border-emerald-200 dark:border-emerald-700 shadow-2xl overflow-hidden">
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-teal-400/20 to-emerald-400/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 text-center space-y-6">
            {/* Badge */}
            <div className="flex justify-center">
              <span className="inline-flex items-center gap-2 bg-emerald-500 text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg">
                <Sparkles className="w-4 h-4" />
                Conoce NUXA
              </span>
            </div>

            {/* Title */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
              ¿Qué es NUXA?
            </h2>

            {/* Transition Text */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4 text-lg md:text-xl font-semibold">
              <span className="text-emerald-600 dark:text-emerald-400">
                Anteriormente conocido como NFLOW
              </span>
              <ArrowRight className="w-6 h-6 text-gray-600 dark:text-gray-400 rotate-90 md:rotate-0" />
              <span className="text-cyan-600 dark:text-cyan-400">
                ahora somos NUXA
              </span>
            </div>

            {/* Explanation */}
            <div className="max-w-2xl mx-auto space-y-4 pt-4">
              <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                <span className="font-bold text-emerald-700 dark:text-emerald-400">NFLOW</span> y <span className="font-bold text-cyan-700 dark:text-cyan-400">NUXA</span> son el mismo sistema de inteligencia artificial.
              </p>
              <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                El nuevo nombre <span className="font-bold text-cyan-700 dark:text-cyan-400">NUXA</span> tiene un significado más cercano y directo a la <span className="font-semibold">salud mental</span>, reflejando mejor nuestro compromiso con tu bienestar emocional.
              </p>
            </div>

            {/* Bottom Accent */}
            <div className="pt-6">
              <div className="inline-flex items-center gap-2 bg-white dark:bg-slate-800 px-6 py-3 rounded-full border-2 border-emerald-300 dark:border-emerald-600 shadow-md">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  Misma tecnología, nueva identidad
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
