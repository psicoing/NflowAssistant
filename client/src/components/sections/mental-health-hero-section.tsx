import { Heart, Users, Shield, Clock, Brain, Zap, MessageSquare, Bot } from "lucide-react";
import { Link } from "wouter";

export default function MentalHealthHeroSection() {
  return (
    <section className="py-8 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 nflow-full-width-section">
      <div className="nflow-card-container mx-auto px-4">
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

          {/* Main Content - Centered */}
          <div className="w-full mx-auto">
            {/* Content Section - Centered */}
            <div className="space-y-8">
              {/* All Features Grid */}
              <div className="grid grid-cols-1 gap-4">


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
              <div className="pt-6">
                <Link href="/ejemplos-chat">
                  <div className="relative inline-block w-full max-w-xs">
                    {/* Decorative border */}
                    <div className="absolute inset-0 bg-gradient-to-r from-nflow-orange to-yellow-500 rounded-xl blur-sm opacity-50 animate-pulse"></div>
                    <div className="relative bg-white text-blue-600 px-10 py-5 rounded-xl font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-blue-500/30 hover:border-blue-500 cursor-pointer w-full text-center">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="flex items-center gap-3">
                          <MessageSquare className="w-6 h-6" />
                          <span className="text-lg">Ejemplos de NFlow</span>
                        </div>
                        {/* Robot icons */}
                        <div className="flex items-center gap-2 mt-2">
                          <Bot className="w-4 h-4 text-blue-500" />
                          <Bot className="w-4 h-4 text-blue-500" />
                          <Bot className="w-4 h-4 text-blue-500" />
                          <Bot className="w-4 h-4 text-blue-500" />
                          <Bot className="w-4 h-4 text-blue-500" />
                        </div>
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