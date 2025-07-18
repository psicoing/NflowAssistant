import { useEffect } from 'react';
import { Globe } from 'lucide-react';

interface GoogleTranslateSimpleProps {
  className?: string;
}

declare global {
  interface Window {
    google?: any;
    googleTranslateElementInit?: () => void;
  }
}

export function GoogleTranslateSimple({ className = "" }: GoogleTranslateSimpleProps) {
  useEffect(() => {
    // Function to initialize Google Translate
    const initializeTranslate = () => {
      if (window.google?.translate) {
        const element = document.getElementById('google_translate_simple');
        if (element && !element.hasChildNodes()) {
          try {
            new window.google.translate.TranslateElement(
              {
                pageLanguage: 'es',
                includedLanguages: 'en,fr,de,it,pt,ca,eu,gl,zh,ar,ja,ko,ru,hi',
                autoDisplay: false,
                layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
              },
              'google_translate_simple'
            );
          } catch (error) {
            // Silent error handling for production
          }
        }
      }
    };

    // Set global callback
    window.googleTranslateElementInit = initializeTranslate;

    // Check if script is already loaded
    const existingScript = document.getElementById('google-translate-script');
    
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.head.appendChild(script);
    } else {
      // Try to initialize directly if script already exists
      setTimeout(() => {
        initializeTranslate();
      }, 100);
    }
  }, []);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Globe className="h-4 w-4 text-gray-400" />
      <div 
        id="google_translate_simple" 
        className="min-w-[140px] h-8 flex items-center"
        style={{ color: 'white !important' }}
      />
      <style dangerouslySetInnerHTML={{
        __html: `
          #google_translate_simple {
            width: 140px !important;
            height: 32px !important;
            display: flex !important;
            align-items: center !important;
            overflow: visible !important;
          }
          #google_translate_simple * {
            color: white !important;
            font-family: inherit !important;
          }
          #google_translate_simple .goog-te-gadget {
            width: 100% !important;
            height: 100% !important;
            display: flex !important;
            align-items: center !important;
          }
          #google_translate_simple .goog-te-gadget-simple {
            color: white !important;
            width: 100% !important;
            height: 100% !important;
            display: flex !important;
            align-items: center !important;
            background: transparent !important;
            border: none !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          #google_translate_simple .goog-te-menu-value {
            color: white !important;
            width: 100% !important;
            white-space: nowrap !important;
            overflow: visible !important;
            display: flex !important;
            align-items: center !important;
            font-size: 12px !important;
          }
          #google_translate_simple .goog-te-menu-value span {
            color: white !important;
          }
          #google_translate_simple .goog-te-combo {
            background: transparent !important;
            border: 1px solid rgba(255, 255, 255, 0.2) !important;
            border-radius: 6px !important;
            color: white !important;
            font-size: 12px !important;
            padding: 4px 8px !important;
            width: 140px !important;
            height: 32px !important;
          }
        `
      }} />
    </div>
  );
}