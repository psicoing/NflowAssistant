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
    <div className="flex-1 flex flex-col bg-gray-900">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-700 bg-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-nflow-orange rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">NFLOW Assistant</h3>
            <p className="text-sm text-gray-400">Tu asistente de salud mental</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <Bot className="w-12 h-12 mx-auto mb-4 text-nflow-orange" />
              <h3 className="text-lg font-semibold text-white mb-2">
                ¡Hola! Soy tu asistente de NFLOW
              </h3>
              <p className="text-gray-400 mb-4">
                Estoy aquí para brindarte apoyo emocional. ¿Cómo te sientes hoy?
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onSendMessage("Me siento ansioso")}
                  className="border-gray-600 text-gray-300 hover:text-white hover:border-gray-400"
                >
                  Me siento ansioso
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onSendMessage("Necesito consejos para dormir mejor")}
                  className="border-gray-600 text-gray-300 hover:text-white hover:border-gray-400"
                >
                  Necesito consejos para dormir
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onSendMessage("¿Cómo puedo manejar el estrés?")}
                  className="border-gray-600 text-gray-300 hover:text-white hover:border-gray-400"
                >
                  ¿Cómo manejar el estrés?
                </Button>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 ${
                  message.isUser ? "justify-end" : "justify-start"
                }`}
              >
                {!message.isUser && (
                  <div className="w-8 h-8 bg-nflow-orange rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                
                <div
                  className={`max-w-xs lg:max-w-md xl:max-w-lg p-3 rounded-2xl ${
                    message.isUser
                      ? "bg-nflow-blue text-white rounded-tr-none"
                      : "bg-gray-800 text-gray-100 rounded-tl-none"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                  <p className="text-xs opacity-60 mt-2">
                    {new Date(message.timestamp).toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                {message.isUser && (
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))
          )}
          
          {isLoading && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-nflow-orange rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-800 text-gray-100 p-3 rounded-2xl rounded-tl-none">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-700 bg-gray-800">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Escribe tu mensaje..."
            disabled={isLoading}
            className="flex-1 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-nflow-orange"
          />
          <Button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="bg-nflow-orange hover:bg-nflow-orange-light text-white px-4"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>
        <p className="text-xs text-gray-500 mt-2 text-center">
          NFLOW puede cometer errores. Considera verificar información importante.
        </p>
      </div>
    </div>
  );
}
