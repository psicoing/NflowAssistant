import { User, Building2, MessageCircle } from "lucide-react";

export default function NuxaPurposeSection() {
  return (
    <section className="relative bg-white dark:bg-slate-900 py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
            ¿Para quién es <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">NUXA</span>?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg">
            Apoyo emocional profesional con IA para personas y organizaciones
          </p>
        </div>

        {/* Two Columns: Personas y Empresas */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Para Personas */}
          <div className="relative">
            <div className="flex flex-col items-center text-center space-y-6">
              {/* Circle Icon */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
                <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-2xl border-4 border-white dark:border-slate-900">
                  <User className="w-12 h-12 text-white" strokeWidth={2.5} />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                Para Personas
              </h3>
              
              {/* Description */}
              <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base max-w-sm">
                Adolescentes, jóvenes y adultos que buscan orientación emocional y bienestar mental
              </p>

              {/* Chat Bubble - User asking */}
              <div className="w-full max-w-md space-y-4">
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-slate-800 rounded-2xl rounded-tl-sm px-4 py-3 shadow-md max-w-[85%]">
                    <div className="flex items-start gap-2">
                      <MessageCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        "Me siento ansioso últimamente, no sé cómo manejar el estrés..."
                      </p>
                    </div>
                  </div>
                </div>

                {/* Chat Bubble - NUXA responding */}
                <div className="flex justify-end">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl rounded-tr-sm px-4 py-3 shadow-lg max-w-[85%]">
                    <p className="text-sm text-white">
                      "Entiendo cómo te sientes. Vamos a trabajar juntos en técnicas de respiración y mindfulness que te ayudarán..."
                    </p>
                  </div>
                </div>
              </div>

              {/* Features list */}
              <div className="text-left w-full max-w-md space-y-2 pt-2">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                  <span>Apoyo 24/7 en cualquier momento</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                  <span>Confidencial y personalizado</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                  <span>En español y +150 idiomas</span>
                </div>
              </div>
            </div>
          </div>

          {/* Para Empresas */}
          <div className="relative">
            <div className="flex flex-col items-center text-center space-y-6">
              {/* Circle Icon */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
                <div className="relative w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-2xl border-4 border-white dark:border-slate-900">
                  <Building2 className="w-12 h-12 text-white" strokeWidth={2.5} />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                Para Empresas
              </h3>
              
              {/* Description */}
              <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base max-w-sm">
                Organizaciones que cuidan la salud mental de sus empleados y cumplen ISO 45003
              </p>

              {/* Chat Bubble - Employee asking */}
              <div className="w-full max-w-md space-y-4">
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-slate-800 rounded-2xl rounded-tl-sm px-4 py-3 shadow-md max-w-[85%]">
                    <div className="flex items-start gap-2">
                      <MessageCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        "Tengo dificultades para equilibrar el trabajo y mi vida personal..."
                      </p>
                    </div>
                  </div>
                </div>

                {/* Chat Bubble - NUXA responding */}
                <div className="flex justify-end">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl rounded-tr-sm px-4 py-3 shadow-lg max-w-[85%]">
                    <p className="text-sm text-white">
                      "Tu empresa se preocupa por tu bienestar. Te ayudaré a establecer límites saludables y gestionar tu tiempo..."
                    </p>
                  </div>
                </div>
              </div>

              {/* Features list */}
              <div className="text-left w-full max-w-md space-y-2 pt-2">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span>Cumplimiento ISO 45003</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span>Bienestar de equipos completos</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span>Dashboard empresarial</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 font-medium">
            💡 <strong className="text-emerald-600 dark:text-emerald-400">NUXA</strong> es tu aliado en salud mental, estés donde estés
          </p>
        </div>

      </div>
    </section>
  );
}
