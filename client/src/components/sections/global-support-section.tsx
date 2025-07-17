import { Globe, Heart, Users, Shield } from "lucide-react";

export default function GlobalSupportSection() {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-nflow-navy via-nflow-blue-dark to-nflow-navy">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            La Salud Mental No Tiene Fronteras
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Con NFLOW, el apoyo emocional trasciende límites geográficos, culturales y temporales. 
            Donde estés, cuando lo necesites, como lo necesites.
          </p>
        </div>

        {/* Main Content Cards */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Primera Tarjeta - Apoyo Global */}
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-3xl p-8 border border-gray-700/50 backdrop-blur-sm">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center mr-4">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Apoyo Sin Límites</h3>
                <p className="text-gray-400">Disponible en cualquier momento, en cualquier lugar</p>
              </div>
            </div>
            
            <div className="mb-6">
              <img 
                src="/assets/global-support.png" 
                alt="Apoyo global sin fronteras" 
                className="w-full rounded-2xl shadow-lg"
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                <span className="text-gray-200">Completamente anónimo. Sin estigma. Sin límites.</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                <span className="text-gray-200">Soporte para todos, en cualquier momento.</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                <span className="text-gray-200">Accesible desde cualquier dispositivo, en cualquier zona horaria.</span>
              </div>
            </div>
          </div>

          {/* Segunda Tarjeta - Primera Línea */}
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-3xl p-8 border border-gray-700/50 backdrop-blur-sm">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mr-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Primera Línea de Apoyo</h3>
                <p className="text-gray-400">La confianza de millones en todo el mundo</p>
              </div>
            </div>
            
            <div className="mb-6">
              <img 
                src="/assets/emotional-support.png" 
                alt="Primera línea de apoyo emocional" 
                className="w-full rounded-2xl shadow-lg"
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-gray-200">Primera línea de apoyo emocional.</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-gray-200">La confianza de millones en todo el mundo.</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-gray-200">Respuestas contextuales adaptadas a cada cultura y situación.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center p-6 bg-gray-800/50 rounded-2xl border border-gray-700/30">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">150+ Idiomas</h4>
            <p className="text-gray-400 text-sm">Comunicación sin barreras lingüísticas</p>
          </div>
          
          <div className="text-center p-6 bg-gray-800/50 rounded-2xl border border-gray-700/30">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">100% Anónimo</h4>
            <p className="text-gray-400 text-sm">Privacidad total y confidencialidad</p>
          </div>
          
          <div className="text-center p-6 bg-gray-800/50 rounded-2xl border border-gray-700/30">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">Inclusivo</h4>
            <p className="text-gray-400 text-sm">Apoyo para todas las culturas y contextos</p>
          </div>
          
          <div className="text-center p-6 bg-gray-800/50 rounded-2xl border border-gray-700/30">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">24/7 Disponible</h4>
            <p className="text-gray-400 text-sm">Siempre ahí cuando lo necesites</p>
          </div>
        </div>

        {/* Bottom Quote */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-gradient-to-r from-teal-500/10 to-cyan-500/10 rounded-2xl p-8 border border-teal-500/20">
            <blockquote className="text-2xl font-medium text-white mb-4">
              "La salud mental es un derecho humano universal. Con NFLOW, eliminamos todas las barreras que te separan del bienestar emocional."
            </blockquote>
            <p className="text-gray-400 italic">- Filosofía NFLOW</p>
          </div>
        </div>
      </div>
    </section>
  );
}