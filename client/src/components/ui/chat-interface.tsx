import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Loader2 } from "lucide-react";
import type { Message } from "@shared/schema";

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  isLoadingMessages: boolean;
}

export default function ChatInterface({ 
  messages, 
  onSendMessage, 
  isLoading, 
  isLoadingMessages 
}: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim());
      setInputValue("");
    }
  };

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isLoadingMessages) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-nflow-orange mx-auto mb-4" />
          <p className="text-gray-400">Cargando conversación...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Chat Header */}
      <div className="p-6 border-b border-gray-700/50 bg-gradient-to-r from-gray-800 to-gray-700 backdrop-blur-sm">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-nflow-orange to-nflow-orange-light rounded-xl flex items-center justify-center shadow-lg">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800"></div>
          </div>
          <div>
            <h3 className="font-bold text-xl text-white">NFLOW Assistant</h3>
            <p className="text-sm text-gray-300 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              Conectado · Tu psicólogo digital
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-nflow-orange to-nflow-orange-light rounded-2xl mx-auto flex items-center justify-center shadow-xl">
                  <Bot className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -inset-4 bg-gradient-to-r from-nflow-orange/20 to-nflow-blue/20 rounded-3xl blur-xl"></div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                ¡Hola! Soy tu psicólogo NFLOW
              </h3>
              <p className="text-gray-300 mb-8 max-w-md mx-auto leading-relaxed">
                Estoy aquí para brindarte apoyo emocional profesional y confidencial. 
                Comparte conmigo lo que te preocupa.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-2xl mx-auto">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onSendMessage("Me siento ansioso")}
                  className="border-nflow-orange/30 bg-nflow-orange/10 text-white hover:bg-nflow-orange/20 hover:border-nflow-orange/50 transition-all duration-300"
                >
                  😟 Me siento ansioso
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onSendMessage("Necesito consejos para dormir mejor")}
                  className="border-nflow-blue/30 bg-nflow-blue/10 text-white hover:bg-nflow-blue/20 hover:border-nflow-blue/50 transition-all duration-300"
                >
                  😴 Problemas para dormir
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onSendMessage("¿Cómo puedo manejar el estrés?")}
                  className="border-purple-500/30 bg-purple-500/10 text-white hover:bg-purple-500/20 hover:border-purple-500/50 transition-all duration-300"
                >
                  🧘 Manejo del estrés
                </Button>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-4 ${
                  message.isUser ? "justify-end" : "justify-start"
                } animate-in slide-in-from-bottom-2 duration-300`}
              >
                {!message.isUser && (
                  <div className="w-10 h-10 bg-gradient-to-br from-nflow-orange to-nflow-orange-light rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}
                
                <div
                  className={`max-w-xs lg:max-w-2xl xl:max-w-3xl p-4 rounded-2xl shadow-lg ${
                    message.isUser
                      ? "bg-gradient-to-br from-nflow-blue to-blue-600 text-white rounded-tr-md"
                      : "bg-gradient-to-br from-gray-800 to-gray-700 text-gray-100 rounded-tl-md border border-gray-600/30"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                  <p className={`text-xs mt-3 ${message.isUser ? 'text-blue-100' : 'text-gray-400'}`}>
                    {new Date(message.timestamp).toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                {message.isUser && (
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
            ))
          )}
          
          {isLoading && (
            <div className="flex items-start space-x-4 animate-in slide-in-from-bottom-2 duration-300">
              <div className="w-10 h-10 bg-gradient-to-br from-nflow-orange to-nflow-orange-light rounded-xl flex items-center justify-center shadow-lg">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-gradient-to-br from-gray-800 to-gray-700 text-gray-100 p-4 rounded-2xl rounded-tl-md border border-gray-600/30 shadow-lg">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-nflow-orange rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-nflow-orange rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-nflow-orange rounded-full animate-bounce delay-150"></div>
                  </div>
                  <span className="text-sm text-gray-300">NFLOW está escribiendo...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-6 border-t border-gray-700/50 bg-gradient-to-r from-gray-800 to-gray-700 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="flex space-x-3">
          <div className="flex-1 relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Comparte lo que te preocupa..."
              disabled={isLoading}
              className="w-full bg-gray-900/50 border-gray-600/50 text-white placeholder:text-gray-400 focus:border-nflow-orange focus:ring-2 focus:ring-nflow-orange/20 rounded-xl py-3 px-4 pr-12 transition-all duration-300"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          <Button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="bg-gradient-to-r from-nflow-orange to-nflow-orange-light hover:from-nflow-orange-light hover:to-nflow-orange text-white px-6 py-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:scale-100"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </form>
        <div className="flex items-center justify-center mt-4">
          <div className="flex items-center space-x-2 text-xs text-gray-400">
            <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
            <span>Conversación confidencial y segura</span>
            <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
            <span>NFLOW puede cometer errores ocasionales</span>
            <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
