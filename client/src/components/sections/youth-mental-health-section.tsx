import { Brain, Heart, Users, TrendingUp } from "lucide-react";
import youthImage from "@assets/ChatGPT Image 17 jul 2025, 18_00_01_1752768099056.png";

export default function YouthMentalHealthSection() {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image first on left */}
          <div className="relative order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src={youthImage} 
                alt="Jóvenes usando NFLOW para apoyo en salud mental"
                className="w-full h-auto object-cover"
              />
              {/* Overlay with subtle gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
              
              {/* Floating badge - positioned on teens */}
              <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">NFLOW Adolescentes</p>
                    <p className="text-xs text-gray-600">Control Parental</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-emerald-400/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-teal-400/20 rounded-full blur-xl"></div>
          </div>

          {/* Content on right */}
          <div className="space-y-8 order-1 lg:order-2">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent leading-tight">
                Juventud y Salud Mental:<br />
                <span className="text-emerald-700">El Momento Decisivo</span>
              </h2>
              
              <div className="space-y-6 text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                <p>
                  La juventud no es simplemente una etapa más, es el <strong>verdadero cimiento</strong> sobre 
                  el que se construye el resto de la vida. Es ahora, en estos años de formación y descubrimiento, 
                  cuando se forjan los hábitos, las convicciones y la manera de enfrentarse a los retos del mundo.
                </p>
                
                <p>
                  Cuidar la salud mental durante la adolescencia y la juventud es fundamental. 
                  <strong>No es un lujo, es una necesidad.</strong> Las experiencias, los apoyos y las herramientas 
                  que se adquieren en esta época marcan para siempre la capacidad de adaptarse, crecer y superar 
                  adversidades en la vida adulta.
                </p>
                
                <p className="text-emerald-700 dark:text-emerald-400 font-semibold">
                  Invertir en salud mental joven es invertir en el futuro de la sociedad. No hay atajo ni sustituto: 
                  una base sólida en estos años puede prevenir sufrimientos innecesarios y allanar el camino hacia 
                  una vida plena y equilibrada.
                </p>
              </div>
            </div>

            {/* Key Points Grid */}
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Brain className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">Cimiento Vital</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Base sólida para toda la vida</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Heart className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">Prevención</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Evita sufrimientos futuros</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">Apoyo Especializado</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Adaptado para jóvenes</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">Futuro Pleno</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Vida equilibrada y exitosa</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-6">
              <button 
                onClick={() => window.location.href = '/ejemplos-chat'}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 hover:from-emerald-700 hover:to-teal-700"
              >
                Apoyo para Jóvenes
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}