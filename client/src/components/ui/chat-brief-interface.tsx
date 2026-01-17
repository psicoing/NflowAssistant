import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User, Loader2 } from "lucide-react";
import type { Message } from "@shared/schema";

interface ChatBriefInterfaceProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  isLoadingMessages?: boolean;
  voiceEnabled?: boolean;
}

export default function ChatBriefInterface({
  messages,
  onSendMessage,
  isLoading,
  isLoadingMessages = false,
  voiceEnabled = false,
}: ChatBriefInterfaceProps) {
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Auto-play TTS for new AI messages when voice is enabled
  useEffect(() => {
    if (!voiceEnabled || messages.length === 0 || isLoading) return;
    
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage.isUser && lastMessage.content) {
      const timer = setTimeout(async () => {
        try {
          setIsPlayingAudio(true);
          const cleanText = lastMessage.content
            .replace(/\*\*([^*]+)\*\*/g, '$1')
            .replace(/\*([^*]+)\*/g, '$1')
            .replace(/#{1,3}\s*/g, '')
            .slice(0, 4000);

          const response = await fetch('/api/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ text: cleanText, voice: 'nova' })
          });

          if (!response.ok) throw new Error('TTS failed');

          const audioBlob = await response.blob();
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          audioRef.current = audio;
          
          audio.onended = () => {
            setIsPlayingAudio(false);
            URL.revokeObjectURL(audioUrl);
          };
          audio.onerror = () => {
            setIsPlayingAudio(false);
            URL.revokeObjectURL(audioUrl);
          };
          
          await audio.play();
        } catch (error) {
          console.error('TTS error:', error);
          setIsPlayingAudio(false);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [messages.length, voiceEnabled, isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim());
      setInputValue("");
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-900 to-gray-950">
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-3 bg-gray-800/50 border-b border-gray-700/50">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-gray-300">Modo Q&A Breve</span>
          <span className="text-xs text-gray-500 ml-2">Respuestas directas y concisas</span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {isLoadingMessages ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-2" />
              <p className="text-gray-400 text-sm">Cargando mensajes...</p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-sm">
              <Bot className="w-12 h-12 text-blue-400 mx-auto mb-3 opacity-50" />
              <h3 className="text-lg font-medium text-white mb-2">Modo Q&A Breve</h3>
              <p className="text-gray-400 text-sm">
                Haz una pregunta y recibirás una respuesta directa y concisa. 
                Ideal para consultas rápidas.
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.isUser ? "justify-end" : "justify-start"}`}
            >
              {!message.isUser && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-blue-400" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.isUser
                    ? "bg-gradient-to-r from-nflow-orange to-orange-500 text-white"
                    : "bg-gray-800/80 text-gray-100 border border-gray-700/50"
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
              </div>
              {message.isUser && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-nflow-orange/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-nflow-orange" />
                </div>
              )}
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center">
              <Bot className="w-4 h-4 text-blue-400" />
            </div>
            <div className="bg-gray-800/80 rounded-2xl px-4 py-3 border border-gray-700/50">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                <span className="text-gray-400 text-sm">Escribiendo...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="flex-shrink-0 p-4 bg-gray-800/30 border-t border-gray-700/50">
        <div className="flex gap-3 items-center max-w-3xl mx-auto">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Escribe tu pregunta..."
            disabled={isLoading}
            className="flex-1 bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 rounded-full px-5 py-3"
          />
          <Button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="bg-blue-600 hover:bg-blue-500 text-white rounded-full w-12 h-12 p-0 flex items-center justify-center transition-all duration-200 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
