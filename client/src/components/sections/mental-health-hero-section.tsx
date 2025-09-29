import { Heart, Users, Shield, Clock, Brain, Zap, MessageSquare, Bot, Sparkles, Star } from "lucide-react";
import { Link } from "wouter";

export default function MentalHealthHeroSection() {
  return (
    <section className="py-12 px-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="nflow-responsive-container">
        {/* Modern Card Layout */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Header with emotional gradient background */}
          <div className="bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 px-8 py-16 text-center relative overflow-hidden">
            {/* Enhanced decorative elements */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="absolute top-6 left-6 w-24 h-24 bg-white/20 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-6 right-6 w-20 h-20 bg-white/20 rounded-full blur-xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
            
            {/* Floating hearts and stars */}
            <div className="absolute top-8 right-1/4 animate-bounce delay-500">
              <Heart className="w-6 h-6 text-white/60" />
            </div>
            <div className="absolute bottom-12 left-1/4 animate-bounce delay-1000">
              <Sparkles className="w-5 h-5 text-white/60" />
            </div>
            <div className="absolute top-16 left-1/3 animate-bounce delay-1500">
              <Star className="w-4 h-4 text-white/60" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <Heart className="w-20 h-20 text-white drop-shadow-lg animate-pulse" />
                  <div className="absolute -top-2 -right-2">
                    <Sparkles className="w-8 h-8 text-yellow-300 animate-spin" />
                  </div>
                </div>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 drop-shadow-md leading-tight">
                👉 NFLOW está aquí para escucharte y acompañarte.
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-4xl mx-auto font-medium leading-relaxed">
                💡 Cuando sientes estrés, dudas o soledad, NFLOW te da apoyo inmediato, confidencial y accesible desde tu móvil, siempre que lo necesites.
              </p>
            </div>
          </div>

          {/* Content Grid */}
          <div className="p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Emotional Features Column */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-5 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl border border-green-200 dark:border-gray-600 hover:shadow-lg transition-shadow">
                    <div className="w-14 h-14 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Shield className="w-7 h-7 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg">✅ Habla sin juicios</h3>
                      <p className="text-gray-600 dark:text-gray-400">En un espacio seguro</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-5 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl border border-blue-200 dark:border-gray-600 hover:shadow-lg transition-shadow">
                    <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Clock className="w-7 h-7 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg">✅ Apoyo disponible 24/7</h3>
                      <p className="text-gray-600 dark:text-gray-400">Estés donde estés</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-5 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl border border-purple-200 dark:border-gray-600 hover:shadow-lg transition-shadow">
                    <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Heart className="w-7 h-7 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg">✅ Una ayuda real</h3>
                      <p className="text-gray-600 dark:text-gray-400">Para entenderte mejor y sentirte acompañado</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Emotional CTA Column */}
              <div className="flex items-center justify-center">
                <Link href="/login">
                  <div className="relative group">
                    {/* Enhanced glow effect with emotional colors */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 rounded-3xl blur opacity-40 group-hover:opacity-60 transition duration-500"></div>
                    
                    <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-10 rounded-3xl font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer text-center">
                      <div className="flex flex-col items-center justify-center gap-5">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="relative">
                            <Heart className="w-10 h-10 text-white animate-pulse" />
                            <div className="absolute -top-1 -right-1">
                              <Sparkles className="w-5 h-5 text-yellow-300 animate-spin" />
                            </div>
                          </div>
                        </div>
                        
                        <span className="text-xl md:text-2xl font-bold leading-tight">
                          🔵 Empieza hoy tu camino hacia el bienestar
                        </span>
                        
                        {/* Floating elements */}
                        <div className="flex items-center gap-4 mt-3">
                          <Star className="w-6 h-6 text-yellow-300 animate-bounce" style={{ animationDelay: '0ms' }} />
                          <Heart className="w-6 h-6 text-pink-300 animate-bounce" style={{ animationDelay: '300ms' }} />
                          <Sparkles className="w-6 h-6 text-blue-300 animate-bounce" style={{ animationDelay: '600ms' }} />
                        </div>
                        
                        <div className="text-sm text-white/80 mt-2 font-medium">
                          Tu bienestar está a un click de distancia ✨
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