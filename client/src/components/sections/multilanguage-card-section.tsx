import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Globe, Languages, MessageSquare } from "lucide-react";

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
    <section className="py-6 px-4 bg-nflow-dark overflow-x-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-950/90 via-blue-900/80 to-blue-950/90 border border-blue-800/40 shadow-2xl backdrop-blur-sm">
          {/* Decorative gradient orbs */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-nflow-orange/10 rounded-full blur-3xl"></div>
          
          <div className="relative px-4 py-8 md:px-12 md:py-10">
            <div className="grid md:grid-cols-[auto_1fr] gap-6 md:gap-8 items-center">
              {/* Icon */}
              <div className="flex justify-center md:justify-start">
                <div className="relative group">
                  <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-xl group-hover:bg-blue-400/40 transition-all duration-300"></div>
                  <div className="relative w-24 h-24 md:w-28 md:h-28 bg-gradient-to-br from-blue-600 via-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                    <Globe className="w-12 h-12 md:w-14 md:h-14 text-white" strokeWidth={1.5} />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="text-center md:text-left space-y-4">
                <div>
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 flex items-center justify-center md:justify-start gap-2 flex-wrap">
                    <span className="text-nflow-orange">✨</span>
                    <span>Soporte Multiidioma</span>
                  </h3>
                  <p className="text-blue-200/90 text-base md:text-lg leading-relaxed max-w-3xl">
                    Nuestro chatbot terapéutico habla <span className="font-bold text-white">más de 150 idiomas</span>. 
                    Recibe apoyo emocional en tu idioma nativo, sin barreras de comunicación.
                  </p>
                </div>
                
                {/* Badges */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-3">
                  <div className="flex items-center gap-2 bg-blue-800/40 backdrop-blur-sm px-3 py-2 md:px-4 rounded-full border border-blue-600/40 shadow-md">
                    <Languages className="w-4 h-4 text-blue-300 flex-shrink-0" />
                    <span className="text-xs md:text-sm font-medium text-blue-100 whitespace-nowrap">150+ idiomas</span>
                  </div>
                  <div className="flex items-center gap-2 bg-blue-800/40 backdrop-blur-sm px-3 py-2 md:px-4 rounded-full border border-blue-600/40 shadow-md">
                    <MessageSquare className="w-4 h-4 text-blue-300 flex-shrink-0" />
                    <span className="text-xs md:text-sm font-medium text-blue-100 whitespace-nowrap">Chat en vivo</span>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="pt-2 w-full">
                  <Button
                    onClick={handleTranslateClick}
                    size="lg"
                    className={`
                      bg-gradient-to-r from-nflow-orange via-orange-500 to-orange-600 
                      hover:from-orange-600 hover:via-orange-500 hover:to-red-500 
                      text-white font-semibold px-4 py-4 md:px-6 md:py-6 rounded-xl shadow-xl
                      transition-all duration-300 hover:scale-105 hover:shadow-2xl
                      border border-orange-400/30 w-full md:w-auto
                      ${isTranslateActive ? 'opacity-75' : ''}
                    `}
                    data-testid="button-language-selector"
                  >
                    <Globe className="w-5 h-5 mr-2 flex-shrink-0" />
                    <span className="text-sm md:text-base lg:text-lg leading-tight">Speaking 150+ languages • 支持150多种语言</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
