import { Sparkles, Leaf, Heart, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import nuxaLogo from "@assets/generated_images/NUXA_logo_with_circle_person_ba9dba6f.png";

export default function NuxaBrandEvolutionSection() {
  return (
    <section className="relative bg-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-16 md:py-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }}></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-full border border-emerald-200 dark:border-emerald-800">
            <Leaf className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">Evolución Natural</span>
          </div>
        </div>

        {/* NUXA Logo - App Icon Preview */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-3xl blur-2xl opacity-30 animate-pulse"></div>
            <img 
              src={nuxaLogo} 
              alt="NUXA App Icon" 
              className="relative w-28 h-28 md:w-32 md:h-32 rounded-3xl shadow-2xl border-4 border-white/20 dark:border-white/10"
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="text-center space-y-6">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
            🌿 Presentamos <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">NUXA</span>
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 font-medium max-w-3xl mx-auto">
            La evolución natural de NFlow
          </p>

          <div className="max-w-3xl mx-auto space-y-4 text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            <p>
              Después de meses de trabajo e investigación, hoy nace <strong className="text-emerald-600 dark:text-emerald-400">NUXA</strong>, una versión más cercana, emocional y universal de nuestro proyecto de salud mental digital.
            </p>
            
            <p>
              <strong className="text-gray-900 dark:text-white">NUXA no es solo un nombre nuevo</strong>: es una manera de entender la vida. Suena a luz, a núcleo, a naturaleza. Representa el equilibrio entre ciencia, emoción y conexión humana.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mt-10 max-w-4xl mx-auto">
            <div className="flex flex-col items-center gap-3 p-6 bg-white/60 dark:bg-slate-800/60 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 backdrop-blur-sm">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 text-center">
                Adolescentes, familias y empresas
              </p>
            </div>

            <div className="flex flex-col items-center gap-3 p-6 bg-white/60 dark:bg-slate-800/60 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 backdrop-blur-sm">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 text-center">
                Bienestar psicológico y emocional
              </p>
            </div>

            <div className="flex flex-col items-center gap-3 p-6 bg-white/60 dark:bg-slate-800/60 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 backdrop-blur-sm">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 text-center">
                Psicología + Neurociencia + IA
              </p>
            </div>
          </div>

          {/* Mission Statement */}
          <div className="mt-10 p-8 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20 rounded-3xl border border-emerald-200 dark:border-emerald-800">
            <p className="text-lg md:text-xl text-gray-800 dark:text-gray-200 mb-4">
              Con NUXA queremos dar un paso más: <strong>construir una comunidad donde hablar de salud mental sea tan natural como hablar de salud física.</strong>
            </p>
            <p className="text-base text-gray-600 dark:text-gray-400">
              Un espacio digital que une psicología, neurociencia y tecnología, con un lenguaje claro, empático y accesible para todos.
            </p>
          </div>

          {/* Brand Tagline */}
          <div className="mt-8">
            <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              💫 NUXA LIFE — donde empieza tu equilibrio
            </p>
            <a 
              href="https://nuxa.life" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block mt-4 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-semibold transition-colors"
            >
              nuxa.life →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
