import { Heart, Users, Shield, Clock, Brain, Zap, MessageSquare, Bot } from "lucide-react";
import { Link } from "wouter";

export default function MentalHealthHeroSection() {
  return (
    <section className="py-8 px-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="nflow-responsive-container">
        <div className="space-y-12">
          {/* Titles Section - Centered */}
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

          {/* Content Section with Image and Features */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Left Side - Image */}
            <div className="flex justify-center lg:justify-start">
              <div className="relative w-full max-w-sm">
                {/* Placeholder for generated image */}
                <div className="aspect-[4/3] bg-gradient-to-br from-orange-50 via-white to-amber-50 rounded-2xl flex items-center justify-center shadow-xl border-2 border-orange-200/40">
                  <div className="text-center p-6">
                    <div className="w-16 h-16 bg-nflow-orange/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Bot className="w-8 h-8 text-nflow-orange" />
                    </div>
                    <p className="text-gray-700 font-medium text-sm">Apoyo psicológico digital</p>
                    <p className="text-xs text-gray-500 mt-1">IA amigable 24/7</p>
                  </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-3 -right-3 w-6 h-6 bg-nflow-orange rounded-full opacity-60 animate-pulse"></div>
                <div className="absolute -bottom-3 -left-3 w-4 h-4 bg-amber-400 rounded-full opacity-50 animate-pulse delay-1000"></div>
              </div>
            </div>

            {/* Right Side - Features */}
            <div className="space-y-6">
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
            </div>
          </div>

          {/* CTA - Centered */}
          <div className="text-center pt-6">
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
    </section>
  );
}