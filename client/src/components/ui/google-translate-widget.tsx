import { useEffect, useRef, useState } from 'react';
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
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Clear any existing content first
    if (googleTranslateRef.current) {
      googleTranslateRef.current.innerHTML = '';
    }
    
    // Function to initialize Google Translate
    window.googleTranslateElementInit = () => {
      if (googleTranslateRef.current && window.google?.translate && !isLoaded) {
        try {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: 'es',
              includedLanguages: 'en,fr,de,it,pt,ca,eu,gl,zh,ar,ja,ko,ru,hi',
              autoDisplay: false,
              layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
            },
            googleTranslateRef.current
          );
          setIsLoaded(true);
        } catch (error) {
          console.error('Google Translate initialization error:', error);
        }
      }
    };

    // Check if script is already loaded
    const existingScript = document.getElementById('google-translate-script');
    
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.type = 'text/javascript';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.head.appendChild(script);
    } else if (window.google?.translate && !isLoaded) {
      window.googleTranslateElementInit();
    }

    return () => {
      // Clean up but don't remove the script
      if (googleTranslateRef.current) {
        googleTranslateRef.current.innerHTML = '';
      }
      setIsLoaded(false);
    };
  }, [isLoaded]);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Globe className="h-4 w-4 text-gray-400" />
      <div 
        ref={googleTranslateRef}
        className="google-translate-widget"
        id="google_translate_element"
      />
    </div>
  );
}