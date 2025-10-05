import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, Languages, MessageSquare, Sparkles } from "lucide-react";

export default function MultilanguageCardSection() {
  const [isTranslateActive, setIsTranslateActive] = useState(false);

  const initializeGoogleTranslate = () => {
    try {
      if (window.google?.translate?.TranslateElement) {
        const existingElements = document.querySelectorAll('[id*="google_translate"], .goog-te-gadget, .goog-te-banner-frame');
        existingElements.forEach(el => el.remove());

        const overlay = document.createElement('div');
        overlay.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.6);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(4px);
        `;

        const modal = document.createElement('div');
        modal.style.cssText = `
          background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #1d4ed8 100%);
          padding: 32px;
          border-radius: 16px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(59, 130, 246, 0.3);
          max-width: 400px;
          width: 90%;
          position: relative;
          color: white;
        `;

        const title = document.createElement('h3');
        title.innerHTML = '🌍 Seleccionar Idioma';
        title.style.cssText = `
          margin: 0 0 20px 0;
          fontSize: 24px;
          font-weight: 700;
          text-align: center;
          color: white;
        `;

        const subtitle = document.createElement('p');
        subtitle.innerHTML = 'Traduce NFLOW a cualquier idioma instantáneamente';
        subtitle.style.cssText = `
          margin: 0 0 24px 0;
          fontSize: 16px;
          text-align: center;
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.5;
        `;

        const closeButton = document.createElement('button');
        closeButton.innerHTML = '×';
        closeButton.style.cssText = `
          position: absolute;
          top: 12px;
          right: 16px;
          border: none;
          background: transparent;
          font-size: 28px;
          cursor: pointer;
          color: rgba(255, 255, 255, 0.7);
          transition: color 0.2s;
        `;

        const translateContainer = document.createElement('div');
        translateContainer.id = 'google_translate_element';
        translateContainer.style.cssText = `
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 16px;
          backdrop-filter: blur(8px);
        `;

        modal.appendChild(title);
        modal.appendChild(subtitle);
        modal.appendChild(closeButton);
        modal.appendChild(translateContainer);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'es',
            includedLanguages: 'en,fr,de,it,pt,ca,eu,gl,zh,ar,ja,ko,ru,hi',
            autoDisplay: false,
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
          },
          'google_translate_element'
        );

        const closeModal = () => {
          overlay.remove();
          setIsTranslateActive(false);
        };

        closeButton.onclick = closeModal;
        overlay.onclick = (e) => {
          if (e.target === overlay) closeModal();
        };

        const handleEsc = (e: KeyboardEvent) => {
          if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', handleEsc);
          }
        };
        document.addEventListener('keydown', handleEsc);

        setIsTranslateActive(true);

        setTimeout(() => {
          const style = document.createElement('style');
          style.innerHTML = `
            #google_translate_element * {
              color: white !important;
              font-family: inherit !important;
            }
            #google_translate_element .goog-te-gadget-simple {
              background: transparent !important;
              border: 1px solid rgba(255, 255, 255, 0.3) !important;
              border-radius: 8px !important;
              padding: 12px !important;
              font-size: 14px !important;
            }
            #google_translate_element .goog-te-menu-value {
              color: white !important;
            }
            #google_translate_element .goog-te-combo {
              background: rgba(255, 255, 255, 0.1) !important;
              border: 1px solid rgba(255, 255, 255, 0.3) !important;
              border-radius: 6px !important;
              color: white !important;
              padding: 8px 12px !important;
              width: 100% !important;
            }
            .goog-te-banner-frame {
              display: none !important;
            }
          `;
          document.head.appendChild(style);
        }, 100);
      }
    } catch (error) {
      console.error('Error initializing Google Translate:', error);
      setIsTranslateActive(false);
    }
  };

  useEffect(() => {
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      
      window.googleTranslateElementInit = () => {
        // Script loaded, ready to use
      };
      
      document.head.appendChild(script);
    }
  }, []);

  const handleTranslateClick = () => {
    if (!isTranslateActive) {
      initializeGoogleTranslate();
    }
  };

  return (
    <section className="py-8 px-4 bg-gradient-to-br from-nflow-dark via-blue-950/30 to-nflow-dark">
      <div className="max-w-5xl mx-auto">
        <Card className="bg-gradient-to-br from-blue-900/40 via-blue-800/30 to-blue-900/40 border-blue-600/30 backdrop-blur-sm overflow-hidden">
          <div className="relative">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-nflow-blue/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-nflow-orange/10 rounded-full blur-3xl"></div>
            
            <div className="relative p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Icon Section */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="absolute inset-0 bg-nflow-blue/20 rounded-full blur-xl animate-pulse"></div>
                    <div className="relative w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-nflow-blue to-blue-600 rounded-full flex items-center justify-center shadow-xl">
                      <Globe className="w-10 h-10 md:w-12 md:h-12 text-white" />
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-nflow-orange" />
                    <h3 className="text-2xl md:text-3xl font-bold text-white">
                      Soporte Multiidioma
                    </h3>
                  </div>
                  <p className="text-blue-100 text-base md:text-lg mb-4 max-w-2xl">
                    Nuestro chatbot terapéutico habla <span className="font-bold text-white">más de 150 idiomas</span>. 
                    Recibe apoyo emocional en tu idioma nativo, sin barreras de comunicación.
                  </p>
                  
                  {/* Language badge and stats */}
                  <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 mb-6">
                    <div className="flex items-center gap-2 bg-blue-800/40 px-4 py-2 rounded-full border border-blue-600/30">
                      <Languages className="w-5 h-5 text-blue-300" />
                      <span className="text-sm font-medium text-blue-100">150+ idiomas disponibles</span>
                    </div>
                    <div className="flex items-center gap-2 bg-blue-800/40 px-4 py-2 rounded-full border border-blue-600/30">
                      <MessageSquare className="w-5 h-5 text-blue-300" />
                      <span className="text-sm font-medium text-blue-100">Chat en tiempo real</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Button
                    onClick={handleTranslateClick}
                    className={`
                      bg-gradient-to-r from-nflow-orange to-orange-600 hover:from-orange-600 hover:to-red-500 
                      text-white font-semibold px-6 py-6 rounded-xl shadow-lg
                      transition-all duration-300 hover:scale-105 hover:shadow-xl
                      ${isTranslateActive ? 'opacity-75' : ''}
                    `}
                    data-testid="button-language-selector"
                  >
                    <Globe className="w-5 h-5 mr-2" />
                    Speaking 150+ languages • 支持150多种语言
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
