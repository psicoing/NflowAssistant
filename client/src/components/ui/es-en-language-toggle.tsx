import { useState, useEffect } from "react";
import { useLanguageContext } from "@/components/LanguageProvider";
import { Language } from "@/hooks/useLanguage";

export default function EsEnLanguageToggle() {
  const { currentLanguage, changeLanguage } = useLanguageContext();
  const [userCountry, setUserCountry] = useState<string | null>(null);
  const [showAutoDetect, setShowAutoDetect] = useState(false);

  useEffect(() => {
    // Only detect once per session — skip if already detected or failed
    if ((window as any).__nuxaLocationDetected) return;
    (window as any).__nuxaLocationDetected = true;

    const detectLocation = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        if (data.country_code) {
          const country = data.country_code.toUpperCase();
          setUserCountry(country);
          setShowAutoDetect(true);
          setTimeout(() => setShowAutoDetect(false), 8000);
        }
      } catch {}
    };

    detectLocation();
  }, []);

  const langOptions: { code: Language; flag: string; label: string }[] = [
    { code: 'es', flag: '🇪🇸', label: 'ES' },
    { code: 'fr', flag: '🇫🇷', label: 'FR' },
    { code: 'en', flag: '🇺🇸', label: 'US' },
  ];

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center h-10 px-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg">
        {langOptions.map((lang, index) => (
          <div key={lang.code} className="flex items-center">
            <button
              onClick={() => {
                changeLanguage(lang.code);
                setShowAutoDetect(false);
              }}
              className={`flex items-center gap-1 px-2 py-1 rounded transition-all duration-200 ${
                currentLanguage === lang.code 
                  ? 'bg-blue-500/30 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-blue-500/10'
              }`}
              data-testid={`language-toggle-${lang.code}`}
            >
              <span className="text-base">{lang.flag}</span>
              <span className="text-xs font-medium">{lang.label}</span>
            </button>
            {index < langOptions.length - 1 && (
              <div className="w-px h-4 bg-blue-400/30 mx-0.5"></div>
            )}
          </div>
        ))}
      </div>
      
      {showAutoDetect && userCountry && (
        <div className="text-xs text-blue-300/80 animate-pulse">
          🌍 {userCountry}
        </div>
      )}
    </div>
  );
}