import { Heart, Users, Shield, Clock, Brain, Zap, MessageSquare } from "lucide-react";
import { Link } from "wouter";
import mentalHealthImage from "@assets/ChatGPT Image 17 jul 2025, 17_53_59_1752767672221.png";

export default function MentalHealthHeroSection() {
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-12">
          {/* Titles Section */}
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-3">
              <Brain className="w-12 h-12 text-nflow-orange" />
              Ayuda psicológica en tu bolsillo!
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-nflow-orange flex items-center justify-center gap-3">
              <Zap className="w-8 h-8" />
              una robot muy lista!
            </h2>
          </div>

          {/* Image Section */}
          <div className="flex justify-center">
            <div className="relative max-w-2xl w-full">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={mentalHealthImage} 
                  alt="Familia usando NFLOW para apoyo en salud mental"
                  className="w-full h-auto object-cover"
                />
                {/* Overlay with subtle gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                
                {/* Floating badge - smaller and positioned at top right */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <div>
                      <p className="text-xs font-semibold text-gray-900">Apoyo Activo</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-nflow-orange/10 rounded-full blur-xl"></div>
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-nflow-navy/10 rounded-full blur-xl"></div>
            </div>
          </div>

          {/* Content Grid - below image */}
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-8">
              <div>
                <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                  Cada persona merece apoyo emocional profesional. NFLOW conecta familias, 
                  adolescentes, trabajadores y adultos con herramientas de bienestar mental 
                  respaldadas por la ciencia y la experiencia clínica.
                </p>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 gap-4">
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
              </div>
            </div>

            <div className="space-y-8">
              {/* Features Grid */}
              <div className="grid grid-cols-1 gap-4">
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
              <div className="pt-6">
                <Link href="/ejemplos-chat">
                  <div className="relative inline-block w-full max-w-xs">
                    {/* Decorative border */}
                    <div className="absolute inset-0 bg-gradient-to-r from-nflow-orange to-yellow-500 rounded-xl blur-sm opacity-50 animate-pulse"></div>
                    <div className="relative bg-gradient-to-r from-nflow-orange to-yellow-500 text-white px-10 py-5 rounded-xl font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-white/20 hover:border-white/40 cursor-pointer w-full text-center">
                      <div className="flex items-center justify-center gap-3">
                        <MessageSquare className="w-6 h-6" />
                        <span className="text-lg">Ejemplos de NFlow</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}