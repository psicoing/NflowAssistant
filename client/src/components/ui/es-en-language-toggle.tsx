import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";

export default function EsEnLanguageToggle() {
  const { currentLanguage, changeLanguage } = useLanguage();
  const [userCountry, setUserCountry] = useState<string | null>(null);
  const [autoDetected, setAutoDetected] = useState(false);

  // Detectar ubicación automáticamente al cargar
  useEffect(() => {
    const detectLocation = async () => {
      try {
        // Intentar usando la API de geolocalización IP (servicio gratuito)
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        setUserCountry(data.country_code?.toUpperCase());
        
        // Cambiar automáticamente el idioma según el país
        if (data.country_code) {
          const country = data.country_code.toUpperCase();
          
          // Países de habla inglesa
          const englishCountries = ['GB', 'US', 'CA', 'AU', 'NZ', 'IE', 'ZA'];
          
          if (englishCountries.includes(country) && currentLanguage === 'es') {
            changeLanguage('en');
            setAutoDetected(true);
            console.log(`Auto-detected location: ${country}, switching to English`);
          }
        }
      } catch (error) {
        console.log('Could not detect location:', error);
        // Fallback: detectar por timezone
        try {
          const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
          if (timezone.includes('London') || timezone.includes('Dublin') || timezone.includes('Edinburgh')) {
            if (currentLanguage === 'es') {
              changeLanguage('en');
              setAutoDetected(true);
              console.log('Auto-detected UK timezone, switching to English');
            }
          }
        } catch (tzError) {
          console.log('Timezone detection failed:', tzError);
        }
      }
    };

    // Solo detectar una vez al cargar la página
    if (!autoDetected) {
      detectLocation();
    }
  }, [changeLanguage, currentLanguage, autoDetected]);

  const toggleLanguage = () => {
    const newLang = currentLanguage === 'es' ? 'en' : 'es';
    changeLanguage(newLang);
    setAutoDetected(true); // Evitar auto-detección después del cambio manual
  };

  const isSpanish = currentLanguage === 'es';
  
  return (
    <div className="flex items-center">
      <Button
        onClick={toggleLanguage}
        variant="ghost"
        size="sm"
        className="h-10 px-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg hover:from-blue-600/30 hover:to-purple-600/30 transition-all duration-300"
        data-testid="language-toggle-button"
      >
        <div className="flex items-center space-x-2">
          {/* Bandera del idioma actual */}
          <div className="flex items-center space-x-1">
            <span className="text-lg" role="img" aria-label={isSpanish ? "España" : "Reino Unido"}>
              {isSpanish ? "🇪🇸" : "🇬🇧"}
            </span>
            <span className="text-sm font-medium text-white">
              {isSpanish ? "ES" : "EN"}
            </span>
          </div>
          
          {/* Separador visual */}
          <div className="w-px h-4 bg-blue-400/50"></div>
          
          {/* Bandera del idioma alternativo (más pequeña) */}
          <span 
            className="text-sm opacity-60 hover:opacity-100 transition-opacity" 
            role="img" 
            aria-label={isSpanish ? "Switch to English" : "Cambiar a Español"}
          >
            {isSpanish ? "🇬🇧" : "🇪🇸"}
          </span>
        </div>
      </Button>
      
      {/* Indicador de auto-detección (solo se muestra una vez) */}
      {autoDetected && userCountry && (
        <div className="ml-2 text-xs text-blue-300/80 animate-fade-in">
          {currentLanguage === 'en' ? 
            `🌍 Auto-detected: ${userCountry}` : 
            `🌍 Auto-detectado: ${userCountry}`
          }
        </div>
      )}
    </div>
  );
}