import { Globe } from "lucide-react";
import { GoogleTranslateDialog } from "@/components/ui/google-translate-dialog";

export default function ChatLanguageSelector() {
  return (
    <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-blue-500/30 rounded-lg px-3 py-2">
      <div className="flex items-center space-x-2">
        <Globe className="w-4 h-4 text-blue-400" />
        <span className="text-sm font-medium text-blue-300">Idioma:</span>
      </div>
      
      <GoogleTranslateDialog 
        trigger={
          <button className="flex items-center space-x-2 px-3 py-1 bg-white/10 border border-blue-400/30 text-white hover:bg-white/20 transition-colors rounded text-sm font-medium">
            <span>🌐</span>
            <span>Traducir</span>
          </button>
        }
      />
    </div>
  );
}