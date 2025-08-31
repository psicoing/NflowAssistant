import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Loader2, Copy, RotateCcw, Zap, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Message } from "@shared/schema";

// Función para convertir Markdown a HTML formateado
function formatMarkdownToHtml(content: string): string {
  return content
    // Encabezados
    .replace(/^# (.+)$/gm, '<h1 class="text-lg font-bold text-white mt-4 mb-2 first:mt-0">$1</h1>')
    .replace(/^## (.+)$/gm, '<h2 class="text-base font-semibold text-white mt-3 mb-2">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="text-sm font-medium text-white mt-2 mb-1">$1</h3>')
    // Texto en negrita
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
    // Texto en cursiva
    .replace(/\*(.+?)\*/g, '<em class="italic text-gray-200">$1</em>')
    // Citas (blockquotes)
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-nflow-orange pl-4 text-gray-200 italic my-2">$1</blockquote>')
    // Listas con viñetas
    .replace(/^- (.+)$/gm, '<li class="text-gray-100 ml-4">• $1</li>')
    // Listas numeradas
    .replace(/^(\d+)\. (.+)$/gm, '<li class="text-gray-100 ml-4">$1. $2</li>')
    // Párrafos (líneas que no son encabezados ni listas)
    .replace(/^(?!<[h|l|b])(.+)$/gm, '<p class="text-gray-100 mb-2">$1</p>')
    // Saltos de línea dobles se convierten en espacios entre párrafos
    .replace(/\n\s*\n/g, '\n')
    // Saltos de línea simples se convierten en <br>
    .replace(/\n/g, '<br/>');
}

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  isLoadingMessages: boolean;
  onRegenerateResponse?: (messageId: number) => void;
  isQuestionLimitReached?: boolean;
}

export default function ChatInterface({ 
  messages, 
  onSendMessage, 
  isLoading, 
  isLoadingMessages,
  onRegenerateResponse,
  isQuestionLimitReached = false
}: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [characterCount, setCharacterCount] = useState(0);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading && !isQuestionLimitReached) {
      const startTime = Date.now();
      setIsTyping(true);
      onSendMessage(inputValue.trim());
      setInputValue("");
      setCharacterCount(0);
      
      // Simulate response time tracking
      setTimeout(() => {
        setIsTyping(false);
        setResponseTime(Date.now() - startTime);
      }, 2000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit(e);
    }
    if (e.key === 'Escape') {
      setInputValue("");
      setCharacterCount(0);
    }
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Mensaje copiado",
      description: "El contenido se ha copiado al portapapeles",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setCharacterCount(value.length);
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
      {/* Chat Header - Mobile Optimized */}
      <div className="hidden md:block p-6 border-b border-gray-700/50 bg-gradient-to-r from-gray-800 to-gray-700 backdrop-blur-sm">
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

      {/* Mobile Header - Compact */}
      <div className="md:hidden p-3 border-b border-gray-700/50 bg-gradient-to-r from-gray-800 to-gray-700 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-nflow-orange to-nflow-orange-light rounded-lg flex items-center justify-center shadow-lg">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">NFLOW Assistant</h3>
            <p className="text-xs text-gray-300 flex items-center">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
              Tu psicólogo digital
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        className="flex-1 overflow-y-auto p-3 md:p-4 scrollbar-thin" 
        ref={scrollAreaRef}
        style={{ 
          scrollBehavior: 'smooth',
          maxHeight: 'calc(100vh - 200px)'
        }}
      >
        <div className="space-y-3 md:space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8 md:py-12">
              <div className="relative mb-6 md:mb-8">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-nflow-orange to-nflow-orange-light rounded-2xl mx-auto flex items-center justify-center shadow-xl">
                  <Bot className="w-8 h-8 md:w-10 md:h-10 text-white" />
                </div>
                <div className="absolute -inset-4 bg-gradient-to-r from-nflow-orange/20 to-nflow-blue/20 rounded-3xl blur-xl"></div>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
                ¡Hola! Soy tu psicólogo NFLOW
              </h3>
              <p className="text-gray-300 mb-6 md:mb-8 max-w-sm md:max-w-md mx-auto leading-relaxed text-sm md:text-base px-4">
                Estoy aquí para brindarte apoyo emocional profesional y confidencial. 
                Comparte conmigo lo que te preocupa.
              </p>
              
              {/* Arrow pointing to prompt area */}
              <div className="flex flex-col items-center mt-8 mb-4 px-4">
                <div className="flex items-center space-x-3 bg-gradient-to-r from-nflow-orange/20 to-nflow-blue/20 border border-nflow-orange/30 rounded-xl px-4 py-3 mb-3">
                  <div className="w-2 h-2 bg-nflow-orange rounded-full animate-pulse"></div>
                  <p className="text-sm md:text-base text-white font-medium">
                    👇 Escribe tu mensaje en el campo de abajo
                  </p>
                  <div className="w-2 h-2 bg-nflow-orange rounded-full animate-pulse"></div>
                </div>
                <div className="text-nflow-orange text-2xl animate-bounce">
                  ↓
                </div>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-2 md:space-x-4 ${
                  message.isUser ? "justify-end" : "justify-start"
                } animate-in slide-in-from-bottom-2 duration-300`}
              >
                {!message.isUser && (
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-nflow-orange to-nflow-orange-light rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Bot className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </div>
                )}
                
                <div
                  className={`group relative max-w-[280px] md:max-w-xs lg:max-w-2xl xl:max-w-3xl p-3 md:p-4 rounded-2xl shadow-lg transition-all duration-200 hover:shadow-xl ${
                    message.isUser
                      ? "bg-gradient-to-br from-nflow-blue to-blue-600 text-white rounded-tr-md"
                      : "bg-gradient-to-br from-gray-800 to-gray-700 text-gray-100 rounded-tl-md border border-gray-600/30"
                  }`}
                  onDoubleClick={() => copyMessage(message.content)}
                >
                  <div className="max-h-96 overflow-y-auto scrollbar-thin">
                    {message.isUser ? (
                      <p className="text-sm md:text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                    ) : (
                      <div 
                        className="text-sm md:text-sm leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: formatMarkdownToHtml(message.content)
                        }}
                      />
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center mt-2 md:mt-3">
                    <p className={`text-xs ${message.isUser ? 'text-blue-100' : 'text-gray-400'}`}>
                      {new Date(message.timestamp).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                      {responseTime && !message.isUser && (
                        <span className="ml-2 opacity-70">
                          <Clock className="inline w-3 h-3 mr-1" />
                          {(responseTime / 1000).toFixed(1)}s
                        </span>
                      )}
                    </p>
                    
                    {/* Action Buttons */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 hover:bg-white/10"
                        onClick={() => copyMessage(message.content)}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      
                      {!message.isUser && onRegenerateResponse && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 hover:bg-white/10"
                          onClick={() => onRegenerateResponse(message.id)}
                        >
                          <RotateCcw className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {message.isUser && (
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-gray-600 to-gray-500 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <User className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </div>
                )}
              </div>
            ))
          )}
          
          {(isLoading || isTyping) && (
            <div className="flex items-start space-x-4 animate-in slide-in-from-bottom-2 duration-300">
              <div className="w-10 h-10 bg-gradient-to-br from-nflow-orange to-nflow-orange-light rounded-xl flex items-center justify-center shadow-lg">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-gradient-to-br from-gray-800 to-gray-700 text-gray-100 p-4 rounded-2xl rounded-tl-md border border-gray-600/30 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-nflow-orange rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-nflow-orange rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-nflow-orange rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-nflow-orange" />
                    <span className="text-sm font-medium">NEUROPSI-AI está analizando...</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Procesando tu consulta con inteligencia emocional
                </p>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area - Enhanced */}
      <div className="p-3 md:p-6 border-t border-gray-700/50 bg-gradient-to-r from-gray-800 to-gray-700 backdrop-blur-sm">
        {/* Status Bar */}
        <div className="flex justify-between items-center mb-3 text-xs text-gray-400">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Conectado</span>
            </div>
            {responseTime && (
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>Última respuesta: {(responseTime / 1000).toFixed(1)}s</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <span className={`${characterCount > 500 ? 'text-orange-400' : characterCount > 400 ? 'text-yellow-400' : 'text-gray-400'}`}>
              {characterCount}/500
            </span>
            <span className="hidden md:inline text-gray-500">Ctrl+Enter para enviar</span>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="flex space-x-2 md:space-x-3">
          <div className="flex-1 relative">
            <Input
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Comparte lo que te preocupa... (máx. 500 caracteres)"
              disabled={isLoading}
              maxLength={500}
              className="w-full bg-gray-900/50 border-gray-600/50 text-white placeholder:text-gray-400 focus:border-nflow-orange focus:ring-2 focus:ring-nflow-orange/20 rounded-xl py-2.5 md:py-3 px-3 md:px-4 pr-10 md:pr-12 transition-all duration-300 text-sm md:text-base"
            />
            <div className="absolute right-2 md:right-3 top-1/2 transform -translate-y-1/2">
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          <Button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="bg-gradient-to-r from-nflow-orange to-nflow-orange-light hover:from-nflow-orange-light hover:to-nflow-orange text-white px-4 md:px-6 py-2.5 md:py-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:scale-100"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
            ) : (
              <Send className="w-4 h-4 md:w-5 md:h-5" />
            )}
          </Button>
        </form>
        
        {/* Footer Text - Hidden on mobile to save space */}
        <div className="hidden md:flex items-center justify-center mt-4">
          <div className="flex items-center space-x-2 text-xs text-gray-400">
            <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
            <span>Conversación confidencial y segura</span>
            <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
            <span>NFLOW puede cometer errores ocasionales</span>
            <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
          </div>
        </div>
        
        {/* Mobile Footer - More compact */}
        <div className="md:hidden flex justify-center mt-2">
          <div className="text-xs text-gray-500">
            Conversación confidencial
          </div>
        </div>
      </div>
    </div>
  );
}
