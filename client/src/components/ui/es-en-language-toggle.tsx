import { useLanguageContext } from "@/components/LanguageProvider";
import { Language } from "@/hooks/useLanguage";

export default function EsEnLanguageToggle() {
  const { currentLanguage, changeLanguage } = useLanguageContext();

  const langOptions: { code: Language; flag: string; label: string }[] = [
    { code: 'es', flag: '🇪🇸', label: 'ES' },
    { code: 'fr', flag: '🇫🇷', label: 'FR' },
    { code: 'en', flag: '🇬🇧', label: 'GB' },
  ];

  return (
    <div className="flex items-center h-10 px-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg">
      {langOptions.map((lang, index) => (
        <div key={lang.code} className="flex items-center">
          <button
            onClick={() => changeLanguage(lang.code)}
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
  );
}