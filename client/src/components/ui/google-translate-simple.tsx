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
    // Initialize Google Translate only once
    if (!window.googleTranslateElementInit) {
      window.googleTranslateElementInit = () => {
        if (window.google?.translate) {
          const element = document.getElementById('google_translate_simple');
          if (element && !element.hasChildNodes()) {
            new window.google.translate.TranslateElement(
              {
                pageLanguage: 'es',
                includedLanguages: 'en,fr,de,it,pt,ca,eu,gl,zh,ar,ja,ko,ru,hi',
                autoDisplay: false,
                layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
              },
              'google_translate_simple'
            );
          }
        }
      };

      // Load script only if not present
      if (!document.getElementById('google-translate-script')) {
        const script = document.createElement('script');
        script.id = 'google-translate-script';
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        document.head.appendChild(script);
      }
    }
  }, []);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Globe className="h-4 w-4 text-gray-400" />
      <div id="google_translate_simple" />
    </div>
  );
}