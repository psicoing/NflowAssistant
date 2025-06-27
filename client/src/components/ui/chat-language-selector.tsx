import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Languages, Globe } from "lucide-react";
import { useLanguageContext } from "@/components/LanguageProvider";

export default function ChatLanguageSelector() {
  const { currentLanguage, changeLanguage } = useLanguageContext();

  const languageOptions = [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'ca', name: 'Català', flag: '🏴‍☠️' },
    { code: 'eu', name: 'Euskera', flag: '🏴‍☠️' },
    { code: 'gl', name: 'Galego', flag: '🏴‍☠️' }
  ];

  const currentLangData = languageOptions.find(lang => lang.code === currentLanguage);

  return (
    <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-blue-500/30 rounded-lg px-3 py-2">
      <div className="flex items-center space-x-2">
        <Globe className="w-4 h-4 text-blue-400" />
        <span className="text-sm font-medium text-blue-300">Idioma:</span>
      </div>
      
      <Select value={currentLanguage} onValueChange={(value) => changeLanguage(value as any)}>
        <SelectTrigger className="w-[140px] h-8 bg-white/10 border-blue-400/30 text-white hover:bg-white/20 transition-colors">
          <SelectValue>
            <div className="flex items-center space-x-2">
              <span className="text-sm">{currentLangData?.flag}</span>
              <span className="text-sm font-medium">{currentLangData?.name}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-nflow-dark border-blue-500/30">
          {languageOptions.map((lang) => (
            <SelectItem 
              key={lang.code} 
              value={lang.code}
              className="text-white hover:bg-blue-600/20 focus:bg-blue-600/20"
            >
              <div className="flex items-center space-x-2">
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}