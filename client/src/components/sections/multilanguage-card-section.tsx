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
        subtitle.innerHTML = 'Traduce NUXA a cualquier idioma instantáneamente';
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
    <section
      id="nuxa-accesible-en-tu-idioma"
      className="px-4 py-8 sm:py-12"
      aria-labelledby="language-section-title"
    >
      <div className="nflow-responsive-container">
        <div className="relative isolate overflow-hidden rounded-[2rem] border border-[#d5e4df] bg-[#f3f7f4] shadow-[0_24px_70px_-42px_rgba(17,48,58,0.38)] dark:border-slate-700 dark:bg-slate-900">
          <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-16 h-64 w-64 rounded-full border border-[#c5ddd4] dark:border-slate-700" />
          <div aria-hidden="true" className="pointer-events-none absolute -right-1 -top-8 h-40 w-40 rounded-full border border-[#d5e4df] dark:border-slate-700" />

          <div className="relative grid gap-8 px-6 py-8 sm:px-10 sm:py-11 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14 lg:px-16 lg:py-14">
            <div className="flex flex-col items-start">
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#c5ddd4] bg-[#e4f0eb] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#1f6459] dark:border-teal-900 dark:bg-teal-950/70 dark:text-teal-200">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#398c79]" />
                NUXA · a tu manera
              </p>
              <h2
                id="language-section-title"
                className="max-w-xl text-[2.35rem] font-semibold leading-[1.08] tracking-[-0.045em] text-[#173640] dark:text-[#e8f1ed] sm:text-5xl"
              >
                Entender también es sentirse cerca.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-[#50666b] dark:text-slate-300 sm:text-lg sm:leading-8">
                Explora la información de NUXA en el idioma que te resulte más cómodo. Un pequeño cambio puede hacer más sencillo encontrar tu propio ritmo.
              </p>
              <Button
                onClick={handleTranslateClick}
                size="lg"
                className={`group mt-8 inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full border-0 bg-[#174f50] px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_22px_-12px_rgba(23,79,80,0.8)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#103f42] hover:shadow-[0_12px_28px_-14px_rgba(23,79,80,0.85)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2b8275] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f3f7f4] motion-reduce:transform-none motion-reduce:transition-none sm:w-auto dark:focus-visible:ring-offset-slate-900 ${isTranslateActive ? "opacity-75" : ""}`}
                data-testid="button-language-selector"
              >
                <Globe aria-hidden="true" className="h-4 w-4" />
                <span>Explorar idiomas</span>
                <span aria-hidden="true" className="text-base leading-none">→</span>
              </Button>
            </div>

            <div className="relative flex flex-col justify-center border-t border-[#d5e4df] pt-6 dark:border-slate-700 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#e0eee8] text-[#27675d] dark:bg-teal-950 dark:text-teal-200">
                  <Languages aria-hidden="true" className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#64807d] dark:text-teal-200">Accesibilidad</p>
                  <p className="mt-1 font-semibold text-[#233f45] dark:text-slate-100">La web, en otro idioma</p>
                </div>
              </div>
              <p className="max-w-md text-sm leading-6 text-[#617377] dark:text-slate-400">
                El selector te permite traducir el contenido del sitio. Puedes elegir una opción y seguir explorando a tu ritmo.
              </p>
              <div className="mt-6 flex items-center gap-3 border-t border-[#d5e4df] pt-5 dark:border-slate-700">
                <MessageSquare aria-hidden="true" className="h-4 w-4 shrink-0 text-[#398c79]" />
                <span className="text-sm font-medium text-[#456168] dark:text-slate-300">Una experiencia más fácil de recorrer</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
