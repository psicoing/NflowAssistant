import { Heart, Users, Shield, Clock, Brain, Zap, MessageSquare, Bot } from "lucide-react";
import { Link } from "wouter";

export default function MentalHealthHeroSection() {
  return (
    <section className="py-12 px-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="nflow-responsive-container">
        {/* Modern Card Layout */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Header with gradient background */}
          <div className="bg-gradient-to-r from-nflow-orange via-orange-500 to-amber-500 px-8 py-12 text-center relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="absolute top-4 left-4 w-20 h-20 bg-white/20 rounded-full blur-xl"></div>
            <div className="absolute bottom-4 right-4 w-16 h-16 bg-white/20 rounded-full blur-xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-4">
                <Brain className="w-16 h-16 text-white drop-shadow-lg" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-md">
                Ayuda psicológica en tu bolsillo!
              </h1>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Zap className="w-8 h-8 text-white" />
                <h2 className="text-2xl md:text-3xl font-semibold text-white">
                  una robot muy lista!
                </h2>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Features Column */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl border border-orange-100 dark:border-gray-600">
                    <div className="w-12 h-12 bg-nflow-orange/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Shield className="w-6 h-6 text-nflow-orange" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg">100% Confidencial</h3>
                      <p className="text-gray-600 dark:text-gray-400">Privacidad y anonimato garantizados</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl border border-red-100 dark:border-gray-600">
                    <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Heart className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg">Profesional</h3>
                      <p className="text-gray-600 dark:text-gray-400">Basado en 30+ años de experiencia</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl border border-blue-100 dark:border-gray-600">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg">Disponible 24/7</h3>
                      <p className="text-gray-600 dark:text-gray-400">Apoyo cuando lo necesites</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Column */}
              <div className="flex items-center justify-center">
                <Link href="/ejemplos-chat">
                  <div className="relative group">
                    {/* Glow effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-nflow-orange via-yellow-500 to-orange-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
                    
                    <div className="relative bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 px-8 py-8 rounded-2xl font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-blue-500/30 hover:border-blue-500 cursor-pointer text-center">
                      <div className="flex flex-col items-center justify-center gap-4">
                        <div className="flex items-center gap-3">
                          <MessageSquare className="w-8 h-8 text-blue-500" />
                          <span className="text-xl font-bold">Ejemplos de NFlow</span>
                        </div>
                        
                        {/* Robot icons with better spacing */}
                        <div className="flex items-center gap-3 mt-3">
                          <Bot className="w-5 h-5 text-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                          <Bot className="w-5 h-5 text-blue-500 animate-bounce" style={{ animationDelay: '200ms' }} />
                          <Bot className="w-5 h-5 text-blue-500 animate-bounce" style={{ animationDelay: '400ms' }} />
                          <Bot className="w-5 h-5 text-blue-500 animate-bounce" style={{ animationDelay: '600ms' }} />
                          <Bot className="w-5 h-5 text-blue-500 animate-bounce" style={{ animationDelay: '800ms' }} />
                        </div>
                        
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                          Ver cómo funciona →
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