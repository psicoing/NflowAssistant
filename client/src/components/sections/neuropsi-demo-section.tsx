import { Brain, MessageCircle, Sparkles } from "lucide-react";
import videoDemoPath from "@assets/neuropsi-demo-video.mp4";

export default function NeuropsiDemoSection() {
  return (
    <section className="py-12 px-4 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="nflow-responsive-container">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-center text-white">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Brain className="w-8 h-8 text-white" />
              <MessageCircle className="w-8 h-8 text-white" />
              <Sparkles className="w-6 h-6 text-white animate-pulse" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              🤖 Así es NEUROPSI-AI por Dentro
            </h2>
            <div className="w-24 h-1 bg-white/30 mx-auto rounded-full"></div>
          </div>

          {/* Content Grid */}
          <div className="p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              
              {/* Video Side */}
              <div className="space-y-4">
                <div className="relative bg-black rounded-2xl overflow-hidden shadow-xl">
                  {/* TV Frame with Video */}
                  <div className="relative">
                    <video
                      className="w-full h-64 object-cover rounded-2xl pointer-events-none"
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="auto"
                      controls={false}
                      disablePictureInPicture
                      tabIndex={-1}
                      data-testid="video-neuropsi-demo"
                    >
                      <source src={videoDemoPath} type="video/mp4" />
                      Tu navegador no soporta videos HTML5.
                    </video>
                    
                    {/* TV Border Effect */}
                    <div className="absolute inset-0 rounded-2xl border-4 border-gray-800 pointer-events-none"></div>
                  </div>
                  
                  {/* Mini TV Stand */}
                  <div className="flex justify-center -mt-2">
                    <div className="w-16 h-6 bg-gray-300 rounded-b-lg relative">
                      <div className="absolute inset-x-2 bottom-1 h-1 bg-gray-400 rounded"></div>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600 italic">
                    ✨ Demostración en vivo de NEUROPSI-AI
                  </p>
                </div>
              </div>

              {/* Explanation Side */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                    🎯 Esto es lo que verán tus usuarios
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Cuando los usuarios se registren en NFLOW, tendrán acceso completo a 
                    <strong className="text-blue-600"> NEUROPSI-AI</strong>, nuestro avanzado robot de psicología digital.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Brain className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Psicología Profesional</h4>
                      <p className="text-sm text-gray-600">Respuestas basadas en técnicas terapéuticas reales</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-4 bg-purple-50 rounded-xl border border-purple-100">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <MessageCircle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Conversación Natural</h4>
                      <p className="text-sm text-gray-600">Interacción fluida y empática, como con un psicólogo real</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-xl border border-green-100">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Adaptación Inteligente</h4>
                      <p className="text-sm text-gray-600">Se adapta a cada situación y necesidad específica</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-2xl">
                  <div className="flex items-center space-x-2 mb-3">
                    <Brain className="w-6 h-6" />
                    <span className="font-bold text-lg">¡La Experiencia Completa!</span>
                  </div>
                  <p className="text-blue-100 text-sm">
                    Los usuarios registrados acceden al poder completo de NEUROPSI-AI para resolver sus 
                    desafíos emocionales con tecnología de vanguardia.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}