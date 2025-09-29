import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Maximize2, X, Brain, MessageCircle, Sparkles } from "lucide-react";
import videoDemoPath from "@assets/Grabación de pantalla 2025-09-27 173802_1759151810234.mp4";

export default function NeuropsiDemoSection() {
  const [isVideoExpanded, setIsVideoExpanded] = useState(false);
  const [canAutoplay, setCanAutoplay] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const expandedVideoRef = useRef<HTMLVideoElement>(null);

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
                <div className="relative bg-black rounded-2xl overflow-hidden shadow-xl group">
                  {/* Mini TV Effect */}
                  <div className="relative">
                    <video
                      ref={videoRef}
                      className="w-full h-64 object-cover rounded-2xl"
                      muted
                      loop
                      playsInline
                      onLoadedData={() => {
                        if (videoRef.current) {
                          videoRef.current.play().then(() => {
                            setCanAutoplay(true);
                          }).catch(() => {
                            setCanAutoplay(false);
                          });
                        }
                      }}
                    >
                      <source src={videoDemoPath} type="video/mp4" />
                      Tu navegador no soporta videos HTML5.
                    </video>
                    
                    {/* TV Border Effect */}
                    <div className="absolute inset-0 rounded-2xl border-4 border-gray-800 pointer-events-none"></div>
                    
                    {/* Play button overlay for when autoplay fails - Highest Priority */}
                    {!canAutoplay && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-2xl z-20">
                        <Button
                          onClick={() => {
                            if (videoRef.current) {
                              videoRef.current.play();
                              setCanAutoplay(true);
                            }
                          }}
                          className="bg-white/95 hover:bg-white text-black rounded-full w-16 h-16 p-0 shadow-lg"
                          data-testid="button-play-video"
                        >
                          <Play className="w-8 h-8" />
                        </Button>
                      </div>
                    )}
                    
                    {/* Expand Button Overlay - Only show when video can play */}
                    {canAutoplay && (
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-2xl z-10">
                        <Button
                          onClick={() => setIsVideoExpanded(true)}
                          className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/30 rounded-full px-6 py-3"
                          data-testid="button-expand-video"
                        >
                          <Maximize2 className="w-5 h-5 mr-2" />
                          Ver en Grande
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {/* Mini TV Stand */}
                  <div className="flex justify-center -mt-2">
                    <div className="w-16 h-6 bg-gray-300 rounded-b-lg relative">
                      <div className="absolute inset-x-2 bottom-1 h-1 bg-gray-400 rounded"></div>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <Button
                    onClick={() => setIsVideoExpanded(true)}
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50"
                    data-testid="button-watch-demo"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Ver Demo Completo
                  </Button>
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

        {/* Expanded Video Modal */}
        {isVideoExpanded && (
          <div 
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setIsVideoExpanded(false);
              }
            }}
          >
            <div className="relative w-full max-w-6xl">
              <Button
                onClick={() => setIsVideoExpanded(false)}
                className="absolute -top-12 right-0 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full w-10 h-10 p-0 z-10"
                data-testid="button-close-video"
              >
                <X className="w-5 h-5" />
              </Button>
              <video
                ref={expandedVideoRef}
                className="w-full h-auto max-h-[80vh] rounded-2xl"
                controls
                playsInline
                onLoadedData={() => {
                  if (expandedVideoRef.current) {
                    expandedVideoRef.current.play().catch(() => {
                      // Si falla el autoplay, el usuario puede usar los controles
                    });
                  }
                }}
              >
                <source src={videoDemoPath} type="video/mp4" />
                Tu navegador no soporta videos HTML5.
              </video>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}