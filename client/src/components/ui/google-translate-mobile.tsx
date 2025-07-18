import { useEffect } from 'react';
import { Globe } from 'lucide-react';

interface GoogleTranslateMobileProps {
  className?: string;
}

declare global {
  interface Window {
    google?: any;
    googleTranslateElementInitMobile?: () => void;
  }
}

export function GoogleTranslateMobile({ className = "" }: GoogleTranslateMobileProps) {
  useEffect(() => {
    let initialized = false;
    
    // Function to initialize Google Translate for mobile
    const initializeTranslateMobile = () => {
      if (initialized) return;
      
      console.log('Mobile GT: Attempting initialization...');
      if (window.google?.translate) {
        const element = document.getElementById('google_translate_mobile');
        console.log('Mobile GT: Element found:', !!element);
        if (element && !element.hasChildNodes()) {
          try {
            console.log('Mobile GT: Creating TranslateElement...');
            new window.google.translate.TranslateElement(
              {
                pageLanguage: 'es',
                includedLanguages: 'en,fr,de,it,pt,ca,eu,gl,zh,ar,ja,ko,ru,hi',
                autoDisplay: false,
                layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
              },
              'google_translate_mobile'
            );
            initialized = true;
            console.log('Mobile GT: TranslateElement created successfully!');
          } catch (error) {
            console.error('Google Translate Mobile initialization error:', error);
          }
        } else if (element?.hasChildNodes()) {
          console.log('Mobile GT: Element already has children, marking as initialized');
          initialized = true;
        }
      } else {
        console.log('Mobile GT: Google Translate API not available yet');
      }
    };

    // Set up global callback
    const originalCallback = window.googleTranslateElementInit;
    window.googleTranslateElementInit = () => {
      if (originalCallback) originalCallback();
      setTimeout(initializeTranslateMobile, 200);
    };

    // Check if script is already loaded
    const existingScript = document.getElementById('google-translate-script');
    console.log('Mobile GT: Existing script found:', !!existingScript);
    
    if (!existingScript) {
      console.log('Mobile GT: Loading script...');
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      script.onload = () => console.log('Mobile GT: Script loaded');
      script.onerror = () => console.error('Mobile GT: Script failed to load');
      document.head.appendChild(script);
    } else {
      console.log('Mobile GT: Script already exists, trying direct initialization...');
      // Try multiple initialization attempts
      const tryInit = () => {
        initializeTranslateMobile();
        if (!initialized) {
          setTimeout(tryInit, 500);
        }
      };
      setTimeout(tryInit, 100);
    }
  }, []);

  return (
    <div className={`flex items-center ${className}`}>
      <div 
        id="google_translate_mobile" 
        className="w-full min-w-[160px] h-8 flex items-center"
        style={{ color: 'white !important' }}
      />
      <style dangerouslySetInnerHTML={{
        __html: `
          #google_translate_mobile {
            width: 140px !important;
            height: 32px !important;
            display: flex !important;
            align-items: center !important;
            overflow: visible !important;
          }
          #google_translate_mobile * {
            color: white !important;
            font-family: inherit !important;
          }
          #google_translate_mobile .goog-te-gadget {
            width: 100% !important;
            height: 100% !important;
            display: flex !important;
            align-items: center !important;
          }
          #google_translate_mobile .goog-te-gadget-simple {
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
          #google_translate_mobile .goog-te-menu-value {
            color: white !important;
            width: 100% !important;
            white-space: nowrap !important;
            overflow: visible !important;
            display: flex !important;
            align-items: center !important;
            font-size: 12px !important;
          }
          #google_translate_mobile .goog-te-menu-value span {
            color: white !important;
          }
          #google_translate_mobile .goog-te-combo {
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