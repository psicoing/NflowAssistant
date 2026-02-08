import { Button } from "@/components/ui/button";
import { CheckCircle, Smartphone, Info, Smile, Heart, MessageCircle } from "lucide-react";
import { useLocation } from "wouter";
import { useLanguageContext } from "@/components/LanguageProvider";

export default function ServicesSection() {
  const [, setLocation] = useLocation();
  const { t } = useLanguageContext();

  const handleTryApp = () => {
    setLocation("/chat");
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="servicios" className="py-20 px-4 bg-gradient-to-br from-nflow-dark to-nflow-navy">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white">{t('services.modern.title1')}</span><br />
              <span className="text-nflow-orange">{t('services.modern.title2')}</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              {t('services.modern.description')}
            </p>

            {/* Features List */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-nflow-orange flex-shrink-0" />
                <span className="text-gray-200">{t('services.modern.feature1')}</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-nflow-orange flex-shrink-0" />
                <span className="text-gray-200">{t('services.modern.feature2')}</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-nflow-orange flex-shrink-0" />
                <span className="text-gray-200">{t('services.modern.feature3')}</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-nflow-orange flex-shrink-0" />
                <span className="text-gray-200">{t('services.modern.feature4')}</span>
              </div>
            </div>


          </div>

          {/* App Mockups */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-6">
              {/* Chat App Mockup */}
              <div className="relative transform rotate-2 hover:rotate-0 transition-all duration-500 hover:scale-105">
                <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-3 rounded-[2.5rem] shadow-2xl border border-gray-600">
                  {/* Phone frame */}
                  <div className="bg-black rounded-[2rem] p-1">
                    <div className="bg-gradient-to-br from-nflow-orange to-yellow-500 rounded-[1.8rem] overflow-hidden">
                      {/* Status bar */}
                      <div className="flex justify-between items-center px-4 py-2 text-black text-xs font-medium">
                        <span>9:41</span>
                        <div className="flex space-x-1">
                          <div className="w-4 h-2 bg-black/20 rounded-sm"></div>
                          <div className="w-4 h-2 bg-black/20 rounded-sm"></div>
                          <div className="w-4 h-2 bg-black/30 rounded-sm"></div>
                        </div>
                      </div>
                      
                      {/* App header */}
                      <div className="bg-black/10 px-4 py-3 text-center">
                        <div className="w-10 h-10 bg-black/20 rounded-full mx-auto mb-2 flex items-center justify-center">
                          <MessageCircle className="w-5 h-5 text-black" />
                        </div>
                        <h3 className="text-black font-bold text-sm">NUXA Chat</h3>
                        <p className="text-black/70 text-xs">Tu psicólogo digital</p>
                      </div>
                      
                      {/* Chat messages */}
                      <div className="bg-gray-50 p-3 space-y-2 min-h-[120px]">
                        <div className="flex justify-start">
                          <div className="bg-white p-2 rounded-lg shadow-sm max-w-[80%]">
                            <p className="text-xs text-gray-800">¿Cómo puedo ayudarte hoy?</p>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <div className="bg-nflow-blue text-white p-2 rounded-lg max-w-[80%]">
                            <p className="text-xs">Me siento abrumado...</p>
                          </div>
                        </div>
                        <div className="flex justify-start">
                          <div className="bg-white p-2 rounded-lg shadow-sm max-w-[80%]">
                            <p className="text-xs text-gray-800">Entiendo. Vamos a trabajar juntos en esto.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mood Tracker Mockup */}
              <div className="relative transform -rotate-2 hover:rotate-0 transition-all duration-500 hover:scale-105">
                <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-3 rounded-[2.5rem] shadow-2xl border border-gray-600">
                  {/* Phone frame */}
                  <div className="bg-black rounded-[2rem] p-1">
                    <div className="bg-gradient-to-br from-nflow-blue to-blue-600 rounded-[1.8rem] overflow-hidden">
                      {/* Status bar */}
                      <div className="flex justify-between items-center px-4 py-2 text-white text-xs font-medium">
                        <span>9:41</span>
                        <div className="flex space-x-1">
                          <div className="w-4 h-2 bg-white/20 rounded-sm"></div>
                          <div className="w-4 h-2 bg-white/20 rounded-sm"></div>
                          <div className="w-4 h-2 bg-white/30 rounded-sm"></div>
                        </div>
                      </div>
                      
                      {/* App header */}
                      <div className="bg-black/10 px-4 py-3 text-center">
                        <div className="w-10 h-10 bg-white/20 rounded-full mx-auto mb-2 flex items-center justify-center">
                          <Heart className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-white font-bold text-sm">NUXA Mood</h3>
                        <p className="text-white/70 text-xs">Seguimiento emocional</p>
                      </div>
                      
                      {/* Mood content */}
                      <div className="bg-white/10 backdrop-blur-sm p-4 space-y-3 min-h-[120px]">
                        <div className="text-center">
                          <p className="text-white/90 text-xs mb-2">Estado actual</p>
                          <div className="text-white font-bold text-lg">Ansiedad</div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs text-white/80">
                            <span>Progreso</span>
                            <span>75%</span>
                          </div>
                          <div className="w-full bg-white/20 rounded-full h-3">
                            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 h-3 rounded-full w-3/4 shadow-sm"></div>
                          </div>
                          <p className="text-white/70 text-xs text-center">Estás mejorando</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Call to Action Button */}
        <div className="text-center mt-16">
          <Button 
            onClick={() => setLocation("/registro")}
            className="bg-gradient-to-r from-nflow-orange to-orange-600 hover:from-orange-600 hover:to-red-500 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            ¡Comenzar Ahora!
          </Button>
        </div>
      </div>
    </section>
  );
}
