import ChatUserMenu from "./chat-user-menu-fixed";
import ChatLanguageSelector from "./chat-language-selector";
import { MessageCircle, Brain } from "lucide-react";

export default function ChatHeader() {
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700/50">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo y título del chat */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-nflow-orange to-nflow-orange-light rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-lg">NFLOW</span>
          </div>
          <div className="hidden md:flex items-center space-x-2 text-gray-400">
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm">Chat de Apoyo</span>
          </div>
        </div>

        {/* Selector de idioma prominente y menú del usuario */}
        <div className="flex items-center space-x-4">
          <ChatLanguageSelector />
          <ChatUserMenu />
        </div>
      </div>
    </header>
  );
}