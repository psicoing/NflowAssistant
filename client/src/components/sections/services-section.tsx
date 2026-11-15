import { Button } from "@/components/ui/button";
import { CheckCircle, Heart, MessageCircle } from "lucide-react";
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
    <section id="servicios" className="px-4 py-14 sm:py-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
            <div>
            <h2 className="mb-6 text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
              <span className="text-[#173e3d]">{t('services.modern.title1')}</span><br />
              <span className="text-[#557d65]">{t('services.modern.title2')}</span>
            </h2>
            <p className="mb-8 text-base leading-7 text-[#526b68] sm:text-lg">
              {t('services.modern.description')}
            </p>

            {/* Features List */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 flex-shrink-0 text-[#638b72]" />
                <span className="text-[#526b68]">{t('services.modern.feature1')}</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 flex-shrink-0 text-[#638b72]" />
                <span className="text-[#526b68]">{t('services.modern.feature2')}</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 flex-shrink-0 text-[#638b72]" />
                <span className="text-[#526b68]">{t('services.modern.feature3')}</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 flex-shrink-0 text-[#638b72]" />
                <span className="text-[#526b68]">{t('services.modern.feature4')}</span>
              </div>
            </div>


          </div>

          {/* App Mockups */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-6">
              {/* Chat App Mockup */}
              <div className="relative">
                <div className="rounded-[2.5rem] border border-[#55776a] bg-[#173e3d] p-3 shadow-[0_25px_55px_-32px_rgba(17,62,61,0.55)]">
                  {/* Phone frame */}
                  <div className="bg-black rounded-[2rem] p-1">
                    <div className="overflow-hidden rounded-[1.8rem] bg-[#174f50]">
                      {/* Status bar */}
                      <div className="flex items-center justify-between px-4 py-2 text-xs font-medium text-[#d7e3d8]">
                        <span>9:41</span>
                        <div className="flex space-x-1">
                          <div className="h-2 w-4 rounded-sm bg-white/15"></div>
                          <div className="h-2 w-4 rounded-sm bg-white/15"></div>
                          <div className="h-2 w-4 rounded-sm bg-white/25"></div>
                        </div>
                      </div>
                      
                      {/* App header */}
                      <div className="border-b border-white/10 bg-white/[0.03] px-4 py-3 text-center">
                        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#d6e69a] text-[#173e3d]">
                          <MessageCircle className="h-5 w-5" />
                        </div>
                        <h3 className="text-black font-bold text-sm">NUXA Chat</h3>
                        <p className="text-xs text-[#c3d8d1]">Tu asistente de bienestar emocional</p>
                      </div>
                      
                      {/* Chat messages */}
                      <div className="min-h-[120px] space-y-2 bg-[#f3f6ef] p-3">
                        <div className="flex justify-start">
                          <div className="max-w-[80%] rounded-lg border border-[#dce7df] bg-white p-2">
                            <p className="text-xs text-[#34534f]">¿Cómo puedo ayudarte hoy?</p>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <div className="max-w-[80%] rounded-lg bg-[#174f50] p-2 text-white">
                            <p className="text-xs">Me siento abrumado...</p>
                          </div>
                        </div>
                        <div className="flex justify-start">
                          <div className="max-w-[80%] rounded-lg border border-[#dce7df] bg-white p-2">
                            <p className="text-xs text-[#34534f]">Entiendo. Vamos a trabajar juntos en esto.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mood Tracker Mockup */}
              <div className="relative mt-8 sm:mt-14">
                <div className="rounded-[2.5rem] border border-[#55776a] bg-[#173e3d] p-3 shadow-[0_25px_55px_-32px_rgba(17,62,61,0.55)]">
                  {/* Phone frame */}
                  <div className="bg-black rounded-[2rem] p-1">
                    <div className="overflow-hidden rounded-[1.8rem] bg-[#47736a]">
                      {/* Status bar */}
                      <div className="flex justify-between items-center px-4 py-2 text-white text-xs font-medium">
                        <span>9:41</span>
                        <div className="flex space-x-1">
                        <div className="h-2 w-4 rounded-sm bg-white/15"></div>
                        <div className="h-2 w-4 rounded-sm bg-white/15"></div>
                        <div className="h-2 w-4 rounded-sm bg-white/25"></div>
                        </div>
                      </div>
                      
                      {/* App header */}
                      <div className="bg-black/10 px-4 py-3 text-center">
                        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
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
                        
                        <p className="text-center text-xs text-white/75">Registro personal</p>
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
            className="rounded-full bg-[#174f50] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#103f42] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4e8176] focus-visible:ring-offset-2 motion-reduce:transition-none"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            ¡Comenzar Ahora!
          </Button>
        </div>
      </div>
    </section>
  );
}
