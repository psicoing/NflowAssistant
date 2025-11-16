import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User, Loader2, Copy, RotateCcw, Clock, Brain, Heart, MessageCircle, CheckCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Message } from "@shared/schema";
import DOMPurify from 'dompurify';

// Nota: Este componente utiliza ProgressiveResponse desde chat-interface.tsx
// Para renderizar el contenido con markdown y elementos interactivos

interface ChatBubbleInterfaceProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  isLoadingMessages: boolean;
  onRegenerateResponse?: (messageId: number) => void;
  isQuestionLimitReached?: boolean;
}

export default function ChatBubbleInterface({
  messages,
  onSendMessage,
  isLoading,
  isLoadingMessages,
  onRegenerateResponse,
  isQuestionLimitReached = false
}: ChatBubbleInterfaceProps) {
  const [inputValue, setInputValue] = useState("");
  const [characterCount, setCharacterCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading && !isQuestionLimitReached) {
      onSendMessage(inputValue.trim());
      setInputValue("");
      setCharacterCount(0);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setCharacterCount(value.length);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit(e);
    }
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Mensaje copiado",
      description: "El contenido se ha copiado al portapapeles",
    });
  };

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isLoadingMessages) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-nflow-orange mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Cargando conversación...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-gradient-to-b from-gray-100 to-white dark:from-gray-900 dark:to-gray-800">
      {/* WhatsApp-style Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-700 dark:to-teal-700 p-4 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white/30">
              <Bot className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-emerald-600 dark:border-emerald-700"></div>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-white text-base">NUXA Assistant</h3>
            <p className="text-xs text-emerald-100 dark:text-emerald-200 flex items-center">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5 animate-pulse"></span>
              En línea • Tu psicólogo IA
            </p>
          </div>
          <MessageCircle className="w-5 h-5 text-white opacity-80" />
        </div>
      </div>

      {/* Messages Area - WhatsApp style */}
      <div 
        className="flex-1 overflow-y-auto px-2 py-4 space-y-2"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          backgroundColor: '#efeae2'
        }}
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-12 px-4">
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-2xl ring-4 ring-emerald-500/20">
                <Bot className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white dark:border-gray-800 flex items-center justify-center">
                <Heart className="w-3 h-3 text-white" />
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 max-w-sm text-center border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                ¡Hola! Soy NUXA 👋
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
                Tu psicólogo IA disponible 24/7. Estoy aquí para brindarte apoyo emocional profesional y confidencial.
              </p>
              <div className="flex items-center justify-center space-x-2 text-xs text-emerald-600 dark:text-emerald-400">
                <CheckCheck className="w-4 h-4" />
                <span className="font-medium">Conversación encriptada</span>
              </div>
            </div>
            
            <div className="mt-6 flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 animate-bounce">
              <span>👇</span>
              <span>Escribe tu mensaje abajo</span>
              <span>👇</span>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message, index) => {
              const isConsecutive = index > 0 && messages[index - 1].isUser === message.isUser;
              
              return (
                <div
                  key={message.id}
                  className={`flex items-end space-x-2 ${
                    message.isUser ? "justify-end" : "justify-start"
                  } animate-in slide-in-from-bottom-2 duration-300`}
                  style={{ marginTop: isConsecutive ? '2px' : '8px' }}
                >
                  {/* Bot avatar - solo si no es consecutivo */}
                  {!message.isUser && !isConsecutive && (
                    <div className="w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0 shadow-md ring-2 ring-gray-200 dark:ring-gray-700 mb-1">
                      <Bot className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                  )}
                  
                  {/* Spacer cuando es mensaje consecutivo */}
                  {!message.isUser && isConsecutive && (
                    <div className="w-8 flex-shrink-0"></div>
                  )}
                  
                  {/* Message Bubble */}
                  <div
                    className={`group relative max-w-[85%] sm:max-w-[75%] md:max-w-[65%] ${
                      message.isUser
                        ? "bg-gradient-to-br from-emerald-500 to-teal-500 dark:from-emerald-600 dark:to-teal-600 text-white rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl"
                        : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-tr-2xl rounded-tl-2xl rounded-br-2xl shadow-md border border-gray-200 dark:border-gray-700"
                    } px-3 py-2 transition-all duration-200 hover:shadow-lg`}
                  >
                    {/* Triangle/tail for WhatsApp bubble effect */}
                    <div
                      className={`absolute bottom-0 ${
                        message.isUser
                          ? "right-0 transform translate-x-1 border-l-8 border-t-8 border-l-transparent border-t-teal-500 dark:border-t-teal-600"
                          : "left-0 transform -translate-x-1 border-r-8 border-t-8 border-r-transparent border-t-white dark:border-t-gray-800"
                      }`}
                      style={{ width: 0, height: 0 }}
                    ></div>
                    
                    {/* Message Content */}
                    <div className="relative z-10">
                      <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                        {message.content}
                      </div>
                      
                      {/* Timestamp and status */}
                      <div className={`flex items-center justify-end space-x-1 mt-1 ${
                        message.isUser ? 'text-emerald-100 dark:text-emerald-200' : 'text-gray-500 dark:text-gray-500'
                      }`}>
                        <span className="text-xs opacity-80">
                          {new Date(message.timestamp).toLocaleTimeString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        {message.isUser && (
                          <CheckCheck className="w-3 h-3 text-emerald-200 dark:text-emerald-300" />
                        )}
                      </div>
                    </div>
                    
                    {/* Hover Actions */}
                    <div className="absolute -top-8 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1 bg-gray-800 dark:bg-gray-700 rounded-lg shadow-lg p-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 hover:bg-white/10 text-white"
                        onClick={() => copyMessage(message.content)}
                        title="Copiar mensaje"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      
                      {!message.isUser && onRegenerateResponse && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 hover:bg-white/10 text-white"
                          onClick={() => onRegenerateResponse(message.id)}
                          title="Regenerar respuesta"
                        >
                          <RotateCcw className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {/* User avatar - solo si no es consecutivo */}
                  {message.isUser && !isConsecutive && (
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 dark:from-gray-500 dark:to-gray-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md ring-2 ring-gray-300 dark:ring-gray-600 mb-1">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                  
                  {/* Spacer cuando es mensaje consecutivo */}
                  {message.isUser && isConsecutive && (
                    <div className="w-8 flex-shrink-0"></div>
                  )}
                </div>
              );
            })}
            
            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex items-end space-x-2 animate-in slide-in-from-bottom-2 duration-300">
                <div className="w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0 shadow-md ring-2 ring-gray-200 dark:ring-gray-700">
                  <Bot className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-tr-2xl rounded-tl-2xl rounded-br-2xl shadow-md border border-gray-200 dark:border-gray-700 px-4 py-3 max-w-xs">
                  <div className="flex items-center space-x-2">
                    <Brain className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">NUXA está escribiendo</span>
                  </div>
                  <div className="flex space-x-1 mt-2">
                    <div className="w-2 h-2 bg-emerald-500 dark:bg-emerald-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-emerald-500 dark:bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-emerald-500 dark:bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* WhatsApp-style Input Area */}
      <div className="bg-gray-100 dark:bg-gray-800 px-3 py-2 border-t border-gray-300 dark:border-gray-700">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <Input
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Escribe un mensaje..."
              disabled={isLoading}
              maxLength={500}
              className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-full py-2.5 px-4 pr-16 text-sm"
              data-testid="input-chat-message"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400 dark:text-gray-500">
              {characterCount}/500
            </div>
          </div>
          
          <Button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="bg-gradient-to-br from-emerald-600 to-teal-600 dark:from-emerald-500 dark:to-teal-500 hover:from-emerald-700 hover:to-teal-700 text-white w-10 h-10 rounded-full shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:scale-100 p-0 flex items-center justify-center"
            data-testid="button-send-message"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </form>
        
        <div className="flex justify-center mt-1">
          <span className="text-xs text-gray-500 dark:text-gray-500">
            🔒 Conversación confidencial y segura
          </span>
        </div>
      </div>
    </div>
  );
}
