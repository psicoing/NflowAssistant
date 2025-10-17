import { useState, useEffect } from "react";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface CookiePreferences {
  necessary: boolean;
  preferences: boolean;
  analytics: boolean;
  marketing: boolean;
}

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    preferences: false,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setIsVisible(true);
    } else {
      // Load saved preferences
      try {
        const saved = JSON.parse(consent);
        setPreferences({
          necessary: true, // Always true
          preferences: saved.preferences || false,
          analytics: saved.analytics || false,
          marketing: saved.marketing || false,
        });
      } catch (e) {
        console.error("Error loading cookie preferences:", e);
      }
    }

    const handleOpenPreferences = () => {
      // Reload preferences when opening
      const currentConsent = localStorage.getItem("cookie-consent");
      if (currentConsent) {
        try {
          const saved = JSON.parse(currentConsent);
          setPreferences({
            necessary: true,
            preferences: saved.preferences || false,
            analytics: saved.analytics || false,
            marketing: saved.marketing || false,
          });
        } catch (e) {
          console.error("Error loading cookie preferences:", e);
        }
      }
      setIsVisible(true);
      setShowPreferences(true);
    };

    window.addEventListener("openCookiePreferences", handleOpenPreferences);
    return () => window.removeEventListener("openCookiePreferences", handleOpenPreferences);
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      preferences: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("cookie-consent", JSON.stringify(allAccepted));
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      preferences: false,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("cookie-consent", JSON.stringify(onlyNecessary));
    setPreferences(onlyNecessary);
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    const saved = {
      ...preferences,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("cookie-consent", JSON.stringify(saved));
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Su privacidad es importante
          </h2>
          <button
            onClick={handleRejectAll}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            data-testid="button-close-cookie-consent"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Este sitio web utiliza cookies para garantizar que obtenga la mejor experiencia en nuestro sitio. 
            Al hacer clic en "Aceptar todo", consiente el uso de cookies para análisis, contenido personalizado y publicidad.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Puede cambiar sus preferencias en cualquier momento visitando nuestra{" "}
            <a 
              href="https://jobda.org/privacy" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Política de Privacidad
            </a>.
          </p>

          {/* Preferences Toggle */}
          <button
            onClick={() => setShowPreferences(!showPreferences)}
            className="flex items-center justify-between w-full mb-4 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            data-testid="button-toggle-preferences"
          >
            <span className="font-semibold">
              {showPreferences ? "Ocultar" : "Mostrar"} preferencias
            </span>
            {showPreferences ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>

          {/* Cookie Categories */}
          {showPreferences && (
            <div className="space-y-4 mb-6">
              {/* Necessary Cookies */}
              <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Cookies necesarias
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Estas cookies son esenciales para que el sitio web funcione correctamente y no pueden ser desactivadas.
                    </p>
                  </div>
                  <div className="ml-4">
                    <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded">
                      Requerido
                    </span>
                  </div>
                </div>
              </div>

              {/* Preference Cookies */}
              <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Cookies de preferencias
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Estas cookies permiten que el sitio web recuerde sus elecciones para ofrecerle características mejoradas y personalizadas.
                    </p>
                  </div>
                  <div className="ml-4">
                    <Switch
                      checked={preferences.preferences}
                      onCheckedChange={(checked) => 
                        setPreferences({ ...preferences, preferences: checked })
                      }
                      data-testid="switch-preferences-cookies"
                    />
                  </div>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Cookies analíticas
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Estas cookies nos ayudan a entender cómo los visitantes interactúan con el sitio web, recopilando información anónima.
                    </p>
                  </div>
                  <div className="ml-4">
                    <Switch
                      checked={preferences.analytics}
                      onCheckedChange={(checked) => 
                        setPreferences({ ...preferences, analytics: checked })
                      }
                      data-testid="switch-analytics-cookies"
                    />
                  </div>
                </div>
              </div>

              {/* Marketing Cookies */}
              <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Cookies de marketing
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Estas cookies se utilizan para seguir a los visitantes en los sitios web y mostrar anuncios relevantes.
                    </p>
                  </div>
                  <div className="ml-4">
                    <Switch
                      checked={preferences.marketing}
                      onCheckedChange={(checked) => 
                        setPreferences({ ...preferences, marketing: checked })
                      }
                      data-testid="switch-marketing-cookies"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button
              onClick={handleRejectAll}
              variant="outline"
              className="flex-1"
              data-testid="button-reject-all"
            >
              Rechazar todo
            </Button>
            {showPreferences && (
              <Button
                onClick={handleSavePreferences}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                data-testid="button-save-preferences"
              >
                Guardar preferencias
              </Button>
            )}
            <Button
              onClick={handleAcceptAll}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              data-testid="button-accept-all"
            >
              Aceptar todo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
