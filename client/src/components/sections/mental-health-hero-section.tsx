import { Heart, Users, Shield, Clock } from "lucide-react";
import mentalHealthImage from "@assets/ChatGPT Image 17 jul 2025, 17_53_59_1752767672221.png";

export default function MentalHealthHeroSection() {
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-nflow-dark to-nflow-navy bg-clip-text text-transparent">
                Para Todos,<br />
                <span className="text-nflow-orange">Una Robot Muy Lista!</span>
              </h2>
              <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                Cada persona merece apoyo emocional profesional. NFLOW conecta familias, 
                adolescentes, trabajadores y adultos con herramientas de bienestar mental 
                respaldadas por la ciencia y la experiencia clínica.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-nflow-orange/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-nflow-orange" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Para Toda la Familia</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Apoyo integral desde los 12 años</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-nflow-orange/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-nflow-orange" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">100% Confidencial</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Privacidad y anonimato garantizados</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-nflow-orange/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Heart className="w-5 h-5 text-nflow-orange" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Profesional</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Basado en 30+ años de experiencia</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-nflow-orange/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-nflow-orange" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Disponible 24/7</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Apoyo cuando lo necesites</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-4">
              <button 
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-gradient-to-r from-nflow-orange to-yellow-500 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                Comenzar Ahora
              </button>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={mentalHealthImage} 
                alt="Familia usando NFLOW para apoyo en salud mental"
                className="w-full h-auto object-cover"
              />
              {/* Overlay with subtle gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
              
              {/* Floating badge */}
              <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Apoyo Activo</p>
                    <p className="text-xs text-gray-600">Miles de conversaciones diarias</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-nflow-orange/10 rounded-full blur-xl"></div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-nflow-navy/10 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}