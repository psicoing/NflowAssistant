import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Globe } from "lucide-react";

declare global {
  interface Window {
    google?: any;
    googleTranslateElementInit?: () => void;
  }
}

export default function LanguageBannerSection() {
  const [isTranslateActive, setIsTranslateActive] = useState(false);

  const initializeGoogleTranslate = () => {
    try {
      if (window.google?.translate?.TranslateElement) {
        // Hide any existing Google Translate elements
        const existingElements = document.querySelectorAll('[id*="google_translate"], .goog-te-gadget, .goog-te-banner-frame');
        existingElements.forEach(el => el.remove());

        // Create modal container
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

        // Title
        const title = document.createElement('h3');
        title.innerHTML = '🌍 Seleccionar Idioma';
        title.style.cssText = `
          margin: 0 0 20px 0;
          fontSize: 24px;
          font-weight: 700;
          text-align: center;
          color: white;
        `;

        // Subtitle
        const subtitle = document.createElement('p');
        subtitle.innerHTML = 'Traduce NFLOW a cualquier idioma instantáneamente';
        subtitle.style.cssText = `
          margin: 0 0 24px 0;
          fontSize: 16px;
          text-align: center;
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.5;
        `;

        // Close button
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
          hover: rgba(255, 255, 255, 1);
          transition: color 0.2s;
        `;

        // Translate element container
        const translateContainer = document.createElement('div');
        translateContainer.id = 'google_translate_element';
        translateContainer.style.cssText = `
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 16px;
          backdrop-filter: blur(8px);
        `;

        // Assemble modal
        modal.appendChild(title);
        modal.appendChild(subtitle);
        modal.appendChild(closeButton);
        modal.appendChild(translateContainer);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Initialize Google Translate
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'es',
            includedLanguages: 'en,fr,de,it,pt,ca,eu,gl,zh,ar,ja,ko,ru,hi',
            autoDisplay: false,
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
          },
          'google_translate_element'
        );

        // Event handlers
        const closeModal = () => {
          overlay.remove();
          setIsTranslateActive(false);
        };

        closeButton.onclick = closeModal;
        overlay.onclick = (e) => {
          if (e.target === overlay) closeModal();
        };

        // ESC key handler
        const handleEsc = (e) => {
          if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', handleEsc);
          }
        };
        document.addEventListener('keydown', handleEsc);

        setIsTranslateActive(true);

        // Style the Google Translate element
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
    // Load Google Translate script if not already loaded
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
    <section className="pt-6 pb-2 bg-gradient-to-r from-blue-900/30 via-blue-800/20 to-blue-900/30 border-b border-blue-700/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          <Badge 
            variant="secondary" 
            onClick={handleTranslateClick}
            className={`
              bg-blue-900/50 hover:bg-blue-800/60 text-blue-100 border border-blue-600/30 
              px-4 py-2 text-sm font-medium backdrop-blur-sm transition-all duration-300
              cursor-pointer hover:scale-105 hover:shadow-lg
              ${isTranslateActive ? 'opacity-75' : ''}
            `}
            style={{
              userSelect: 'none'
            }}
          >
            <Globe className="h-4 w-4 mr-2" />
            Speaking 150+ languages • 支持150多种语言
          </Badge>
        </div>
      </div>
    </section>
  );
}