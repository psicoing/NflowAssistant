import { useEffect, useRef } from 'react';
import { Globe } from 'lucide-react';

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

interface GoogleTranslateWidgetProps {
  className?: string;
}

export function GoogleTranslateWidget({ className = "" }: GoogleTranslateWidgetProps) {
  const googleTranslateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Function to initialize Google Translate
    window.googleTranslateElementInit = () => {
      if (googleTranslateRef.current && window.google?.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'es',
            includedLanguages: 'en,fr,de,it,pt,ca,eu,gl,zh,ar,ja,ko,ru,hi',
            autoDisplay: false,
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
          },
          googleTranslateRef.current
        );
      }
    };

    // Check if script is already loaded
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.type = 'text/javascript';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.head.appendChild(script);
    } else if (window.google?.translate) {
      // If script is already loaded, initialize directly
      window.googleTranslateElementInit();
    }

    return () => {
      // Cleanup function
      const script = document.getElementById('google-translate-script');
      if (script) {
        script.remove();
      }
      delete window.googleTranslateElementInit;
    };
  }, []);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Globe className="h-4 w-4 text-gray-400" />
      <div 
        ref={googleTranslateRef}
        className="google-translate-widget"
      />
    </div>
  );
}