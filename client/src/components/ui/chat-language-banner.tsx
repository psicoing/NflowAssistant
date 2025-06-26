import { Globe, Sparkles } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import ChatLanguageSelector from "./chat-language-selector";

export default function ChatLanguageBanner() {
  const { t } = useLanguage();

  return (
    <div className="bg-gradient-to-r from-indigo-600/30 via-purple-600/30 to-blue-600/30 border border-blue-500/20 rounded-lg p-4 mb-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-3 md:space-y-0">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-white font-semibold text-sm">{t('chat.language.banner.title')}</h3>
              <Sparkles className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-blue-200 text-xs leading-relaxed">
              {t('chat.language.banner.description')}
            </p>
          </div>
        </div>
        
        <div className="flex-shrink-0">
          <ChatLanguageSelector />
        </div>
      </div>
    </div>
  );
}