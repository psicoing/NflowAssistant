import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User, Loader2, Copy, RotateCcw, Clock, Brain, Heart, MessageCircle, CheckCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Message } from "@shared/schema";
import DOMPurify from 'dompurify';

// Función para detectar y convertir técnicas/recursos en bookmarks automáticos
function detectBookmarkableContent(content: string): string[] {
  const bookmarks: string[] = [];
  const techniques = content.match(/\*\*Técnica[^:]*: ([^*]+)\*\*/gi);
  const exercises = content.match(/\*\*Ejercicio[^:]*: ([^*]+)\*\*/gi);
  const resources = content.match(/\*\*Recurso[^:]*: ([^*]+)\*\*/gi);
  
  [techniques, exercises, resources].forEach(matches => {
    if (matches) {
      matches.forEach(match => {
        const cleanText = match.replace(/\*\*/g, '').trim();
        bookmarks.push(cleanText);
      });
    }
  });
  
  return bookmarks;
}

// Función para dividir contenido en segmentos lógicos (burbujas separadas)
function splitContentIntoSegments(content: string): string[] {
  const segments: string[] = [];
  
  // Dividir por líneas para procesar
  const lines = content.split('\n');
  let currentSegment = '';
  let inList = false;
  let inTechnique = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const nextLine = i < lines.length - 1 ? lines[i + 1].trim() : '';
    
    // Detectar títulos principales # - nueva burbuja
    if (line.startsWith('# ')) {
      if (currentSegment.trim()) {
        segments.push(currentSegment.trim());
        currentSegment = '';
      }
      inTechnique = false; // Reset state
      segments.push(line);
      continue;
    }
    
    // Detectar subtítulos ## - nueva burbuja
    if (line.startsWith('## ')) {
      if (currentSegment.trim()) {
        segments.push(currentSegment.trim());
        currentSegment = '';
      }
      inTechnique = false; // Reset state
      segments.push(line);
      continue;
    }
    
    // Detectar preguntas con escalas 0-10 - nueva burbuja (ANTES de inTechnique)
    if (line.match(/\*\*¿.+?\?\*\* \(0 = .+ – 10 = .+\)/)) {
      if (currentSegment.trim()) {
        segments.push(currentSegment.trim());
        currentSegment = '';
      }
      inTechnique = false; // Reset state
      segments.push(line);
      continue;
    }
    
    // Detectar otras escalas - nueva burbuja (ANTES de inTechnique)
    if (line.match(/\*\*Valora tu .+ del 0 al 10\*\*/)) {
      if (currentSegment.trim()) {
        segments.push(currentSegment.trim());
        currentSegment = '';
      }
      inTechnique = false; // Reset state
      segments.push(line);
      continue;
    }
    
    // Detectar preguntas Sí/No - nueva burbuja (ANTES de inTechnique)
    if (line.match(/\*\*¿[^?]+\?\*\*$/) && !line.match(/0 = |10 =/)) {
      if (currentSegment.trim()) {
        segments.push(currentSegment.trim());
        currentSegment = '';
      }
      inTechnique = false; // Reset state
      segments.push(line);
      continue;
    }
    
    // Detectar Técnicas/Ejercicios/Recursos - nueva burbuja
    if (line.match(/\*\*(Técnica|Ejercicio|Recurso)[^:]*:/i)) {
      if (currentSegment.trim()) {
        segments.push(currentSegment.trim());
        currentSegment = '';
      }
      inTechnique = true;
      currentSegment = line + '\n';
      continue;
    }
    
    // Si estamos en una técnica/ejercicio, continuar hasta línea vacía
    if (inTechnique) {
      if (line === '' && nextLine !== '') {
        segments.push(currentSegment.trim());
        currentSegment = '';
        inTechnique = false;
        continue;
      } else {
        currentSegment += line + '\n';
        continue;
      }
    }
    
    // Detectar inicio de lista
    if (line.match(/^(\d+\.|-) /)) {
      if (!inList && currentSegment.trim() && !currentSegment.match(/^(\d+\.|-) /)) {
        segments.push(currentSegment.trim());
        currentSegment = '';
      }
      inList = true;
      currentSegment += line + '\n';
      continue;
    }
    
    // Si salimos de una lista
    if (inList && !line.match(/^(\d+\.|-) /) && line !== '') {
      if (currentSegment.trim()) {
        segments.push(currentSegment.trim());
        currentSegment = '';
      }
      inList = false;
      currentSegment = line + '\n';
      continue;
    }
    
    // Párrafos normales - acumular hasta doble salto de línea
    if (line === '') {
      if (currentSegment.trim() && !inList && !inTechnique) {
        segments.push(currentSegment.trim());
        currentSegment = '';
      } else if (inList || inTechnique) {
        currentSegment += '\n';
      }
      continue;
    }
    
    currentSegment += line + '\n';
  }
  
  // Añadir segmento final si existe
  if (currentSegment.trim()) {
    segments.push(currentSegment.trim());
  }
  
  // No filtrar segmentos cortos - mantener todos los mensajes legítimos (incluso "Ok.", emojis, etc.)
  return segments.filter(s => s.trim().length > 0);
}

// Función para convertir Markdown a HTML formateado con destacados visuales
function formatMarkdownToHtml(content: string, onOptionClick?: (option: string) => void, onBookmark?: (content: string) => void): string {
  // Detectar contenido marcable automáticamente
  const bookmarkableItems = detectBookmarkableContent(content);
  
  let html = content
    // Encabezados con separadores elegantes
    .replace(/^# (.+)$/gm, '<div class="flex items-center my-4"><div class="flex-1 h-px bg-gradient-to-r from-transparent via-emerald-600 to-transparent"></div><h1 class="text-lg font-bold text-gray-900 dark:text-white mx-4 px-3 py-1 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-lg border border-emerald-500/30">$1</h1><div class="flex-1 h-px bg-gradient-to-r from-emerald-600 to-transparent"></div></div>')
    .replace(/^## (.+)$/gm, '<h2 class="text-base font-semibold text-gray-900 dark:text-white mt-4 mb-2 pb-1 border-b border-gray-300 dark:border-gray-600/30">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="text-sm font-medium text-emerald-600 dark:text-emerald-400 mt-3 mb-1">$1</h3>')
    // Técnicas destacadas con botón de bookmark automático
    .replace(/\*\*Técnica[^:]*: ([^*]+)\*\*/gi, '<div class="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-lg p-4 my-3 relative"><div class="flex items-center justify-between mb-2"><div class="flex items-center space-x-2"><span class="text-green-600 dark:text-green-400 font-semibold">🧠</span><strong class="font-semibold text-gray-900 dark:text-white">Técnica: $1</strong></div><button class="bookmark-btn text-xs bg-green-500/20 hover:bg-green-500/40 text-green-700 dark:text-green-300 px-2 py-1 rounded border border-green-400/30 transition-all duration-200" data-bookmark="Técnica: $1">💾 Guardar</button></div><div class="text-sm text-gray-700 dark:text-gray-300">Técnica profesional recomendada por NEUROPSI-AI</div></div>')
    // Ejercicios destacados con bookmark
    .replace(/\*\*Ejercicio[^:]*: ([^*]+)\*\*/gi, '<div class="bg-gradient-to-r from-purple-500/20 to-violet-500/20 border border-purple-400/30 rounded-lg p-4 my-3 relative"><div class="flex items-center justify-between mb-2"><div class="flex items-center space-x-2"><span class="text-purple-600 dark:text-purple-300 font-semibold">🏃</span><strong class="font-semibold text-gray-900 dark:text-white">Ejercicio: $1</strong></div><button class="bookmark-btn text-xs bg-purple-500/20 hover:bg-purple-500/40 text-purple-700 dark:text-purple-300 px-2 py-1 rounded border border-purple-400/30 transition-all duration-200" data-bookmark="Ejercicio: $1">💾 Guardar</button></div><div class="text-sm text-gray-700 dark:text-gray-300">Ejercicio personalizado para tu situación</div></div>')
    // Recursos destacados con bookmark
    .replace(/\*\*Recurso[^:]*: ([^*]+)\*\*/gi, '<div class="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/30 rounded-lg p-4 my-3 relative"><div class="flex items-center justify-between mb-2"><div class="flex items-center space-x-2"><span class="text-blue-600 dark:text-blue-300 font-semibold">📚</span><strong class="font-semibold text-gray-900 dark:text-white">Recurso: $1</strong></div><button class="bookmark-btn text-xs bg-blue-500/20 hover:bg-blue-500/40 text-blue-700 dark:text-blue-300 px-2 py-1 rounded border border-blue-400/30 transition-all duration-200" data-bookmark="Recurso: $1">💾 Guardar</button></div><div class="text-sm text-gray-700 dark:text-gray-300">Recurso recomendado para tu desarrollo</div></div>')
    // Texto en negrita con destacado
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900 dark:text-white bg-emerald-500/10 px-1 py-0.5 rounded">$1</strong>')
    // Preguntas con escalas 0-10 destacadas e interactivas
    .replace(/\*\*¿Qué tanto te afecta en tu día a día\?\*\* \(0 = nada – 10 = muchísimo\)/g, '<div class="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-lg p-4 my-4"><div class="flex items-center space-x-2 mb-3"><span class="text-blue-600 dark:text-blue-300 font-semibold">📊</span><strong class="font-semibold text-gray-900 dark:text-white">¿Qué tanto te afecta en tu día a día?</strong></div><div class="grid grid-cols-11 gap-1 mb-2">' + Array.from({length: 11}, (_, i) => `<button class="interactive-scale-btn w-6 h-6 text-xs font-bold rounded border border-gray-400 dark:border-gray-500 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-500 transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" data-value="${i}">${i}</button>`).join('') + '</div><div class="text-xs text-gray-600 dark:text-gray-400 flex justify-between"><span class="text-green-600 dark:text-green-400">0 = Nada</span><span class="text-red-600 dark:text-red-400">10 = Muchísimo</span></div></div>')
    // Escalas numericas genericas
    .replace(/\*\*Valora tu (.+?) del 0 al 10\*\* \(([^)]+)\)/g, '<div class="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-lg p-4 my-4"><div class="flex items-center space-x-2 mb-3"><span class="text-blue-600 dark:text-blue-300 font-semibold">📊</span><strong class="font-semibold text-gray-900 dark:text-white">Valora tu $1 del 0 al 10</strong></div><div class="grid grid-cols-11 gap-1 mb-2">' + Array.from({length: 11}, (_, i) => `<button class="interactive-scale-btn w-6 h-6 text-xs font-bold rounded border border-gray-400 dark:border-gray-500 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-500 transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" data-value="${i}" data-scale-type="$1">${i}</button>`).join('') + '</div><div class="text-xs text-gray-600 dark:text-gray-400 flex justify-between"><span>$2</span></div></div>')
    // Checkboxes interactivos ☐
    .replace(/☐ (.+?)(?=\n|$)/g, '<div class="flex items-center space-x-3 my-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700/30 rounded cursor-pointer transition-all duration-200 checkbox-item" data-checkbox-text="$1"><input type="checkbox" class="interactive-checkbox w-4 h-4 text-emerald-600 bg-white dark:bg-gray-700 border-gray-400 dark:border-gray-600 rounded focus:ring-emerald-600 focus:ring-2" data-symptom="$1"><span class="text-gray-800 dark:text-gray-200 select-none">$1</span></div>')
    // Botones [Botón/Boton/Button X: ...] interactivos - regex robusto para acentos y multi-idioma
    .replace(/\[(Bot[óo]n|Button) ([A-Z]): ([^\]]+)\]/gi, '<button class="interactive-choice-btn bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 rounded-lg px-4 py-2 my-1 mx-1 cursor-pointer hover:bg-emerald-500/30 hover:border-emerald-500/60 transition-all duration-200 text-left inline-block" data-choice="$2" data-choice-text="$3"><div class="flex items-center space-x-2"><span class="bg-emerald-600 dark:bg-emerald-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">$2</span><span class="font-semibold text-gray-900 dark:text-white text-sm">$3</span></div></button>')
    // Preguntas Sí/No interactivas
    .replace(/\*\*¿([^*?]+\?)\*\*/g, '<div class="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-400/30 rounded-lg p-4 my-4"><div class="flex items-center space-x-2 mb-3"><span class="text-indigo-600 dark:text-indigo-300 font-semibold">❓</span><strong class="font-semibold text-gray-900 dark:text-white">¿$1</strong></div><div class="flex space-x-3"><button class="interactive-yesno-btn bg-green-500/20 hover:bg-green-500/40 border border-green-400/30 text-green-700 dark:text-green-300 px-4 py-2 rounded transition-all duration-200" data-answer="sí" data-question="¿$1">✅ Sí</button><button class="interactive-yesno-btn bg-red-500/20 hover:bg-red-500/40 border border-red-400/30 text-red-700 dark:text-red-300 px-4 py-2 rounded transition-all duration-200" data-answer="no" data-question="¿$1">❌ No</button></div></div>')
    // Opciones clickeables interactivas
    .replace(/\*\*Opción (\d+): (.+?)\*\*/g, '<button class="interactive-option-btn w-full bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-lg p-3 my-2 cursor-pointer hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-all duration-200 text-left" data-option="Opción $1: $2"><div class="flex items-center space-x-2"><span class="bg-emerald-600 dark:bg-emerald-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">$1</span><strong class="font-semibold text-gray-900 dark:text-white">$2</strong></div><div class="text-xs text-gray-600 dark:text-gray-400 mt-1">Haz clic para explorar esta opción</div></button>')
    // Texto en cursiva
    .replace(/\*(.+?)\*/g, '<em class="italic text-gray-800 dark:text-gray-200">$1</em>')
    // Citas profesionales destacadas con iconos
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-emerald-600 dark:border-emerald-500 bg-emerald-500/10 pl-4 pr-4 py-3 text-gray-800 dark:text-gray-200 italic my-3 rounded-r-lg shadow-sm"><span class="text-emerald-600 dark:text-emerald-400 mr-2">⚠️</span>$1</blockquote>')
    // Listas con viñetas mejoradas
    .replace(/^- (.+)$/gm, '<li class="text-gray-800 dark:text-gray-100 ml-4 mb-1 flex items-start"><span class="text-emerald-600 dark:text-emerald-400 mr-2 mt-1 font-bold">•</span><span>$1</span></li>')
    // Listas numeradas mejoradas
    .replace(/^(\d+)\. (.+)$/gm, '<li class="text-gray-800 dark:text-gray-100 ml-4 mb-1 flex items-start"><span class="text-emerald-600 dark:text-emerald-400 mr-2 font-semibold bg-emerald-500/20 px-1 rounded">$1.</span><span>$2</span></li>')
    // Párrafos normales
    .replace(/^(?!<[h|l|b|d])(.+)$/gm, '<p class="text-gray-800 dark:text-gray-100 mb-2 leading-relaxed">$1</p>')
    // Saltos de línea dobles se convierten en espacios entre párrafos
    .replace(/\n\s*\n/g, '\n')
    // Saltos de línea simples se convierten en <br>
    .replace(/\n/g, '<br/>');
    
  // Sanitizar el HTML con DOMPurify permitiendo elementos interactivos necesarios
  const sanitizedHtml = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'div', 'span', 'button', 'input', 'h1', 'h2', 'h3', 'p', 'br', 'strong', 
      'em', 'li', 'blockquote', 'ul', 'ol'
    ],
    ALLOWED_ATTR: [
      'class', 'data-choice', 'data-choice-text', 'data-value', 'data-scale-type',
      'data-symptom', 'data-checkbox-text', 'data-option', 'data-answer', 
      'data-question', 'data-bookmark', 'type', 'style'
    ],
    KEEP_CONTENT: true
  });
  
  return sanitizedHtml;
}

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
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Estado para controlar cuántas burbujas mostrar de cada mensaje
  const [visibleBubbles, setVisibleBubbles] = useState<Record<number, number>>({});
  const [showTypingFor, setShowTypingFor] = useState<number | null>(null);
  const [pausedMessages, setPausedMessages] = useState<Record<number, boolean>>({});
  
  // Ref para trackear qué mensajes ya fueron vistos (para distinguir históricos de nuevos)
  const seenMessageIds = useRef<Set<number>>(new Set());
  const hasHydratedHistory = useRef(false);

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

  // Inicializar burbujas visibles para mensajes de usuario (mostrar inmediatamente)
  // y para mensajes de IA (solo progresivo para mensajes NUEVOS)
  useEffect(() => {
    // En la primera carga de mensajes (cuando llega el historial de la BD),
    // marcar todos como "vistos" para que se muestren completos
    if (!hasHydratedHistory.current && messages.length > 0) {
      messages.forEach(message => {
        seenMessageIds.current.add(message.id);
      });
      hasHydratedHistory.current = true;
    }
    
    // Identificar mensajes nuevos comparando con el Set actual
    const newMessageIds = new Set<number>();
    
    messages.forEach(message => {
      if (!seenMessageIds.current.has(message.id)) {
        newMessageIds.add(message.id);
      }
    });
    
    // Aplicar lógica de visibilidad
    messages.forEach((message) => {
      const isNewMessage = newMessageIds.has(message.id);
      
      if (message.isUser) {
        // Mensajes de usuario se muestran inmediatamente
        if (!visibleBubbles[message.id]) {
          setVisibleBubbles(prev => ({ ...prev, [message.id]: 999 }));
        }
        seenMessageIds.current.add(message.id);
      } else {
        if (visibleBubbles[message.id] === undefined) {
          const segments = splitContentIntoSegments(message.content);
          
          if (isNewMessage) {
            // Mensaje nuevo de IA: empezar progresivo desde 0
            setVisibleBubbles(prev => ({ ...prev, [message.id]: 0 }));
            // Marcar como visto después de inicializar para que no se vuelva a inicializar
            seenMessageIds.current.add(message.id);
          } else {
            // Mensaje histórico: mostrar todo inmediatamente
            setVisibleBubbles(prev => ({ ...prev, [message.id]: segments.length }));
          }
        }
      }
    });
  }, [messages]);

  // Efecto para mostrar burbujas progresivamente con delays
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    
    messages.forEach(message => {
      if (message.isUser) return; // Skip user messages
      
      const segments = splitContentIntoSegments(message.content);
      const currentVisible = visibleBubbles[message.id] || 0;
      const isPaused = pausedMessages[message.id];
      
      // Si ya se mostraron todas las burbujas, no hacer nada
      if (currentVisible >= segments.length) return;
      
      // Para respuestas largas (>6 burbujas), pausar a la mitad
      const pausePoint = Math.floor(segments.length / 2);
      const shouldPause = segments.length > 6 && currentVisible === pausePoint && isPaused === undefined;
      
      if (shouldPause) {
        setPausedMessages(prev => ({ ...prev, [message.id]: true }));
        return;
      }
      
      // Si está pausado, no continuar mostrando burbujas
      if (isPaused === true) return;
      
      // Mostrar indicador de "escribiendo..."
      const typingTimer = setTimeout(() => {
        setShowTypingFor(message.id);
      }, 300);
      timers.push(typingTimer);
      
      // Mostrar siguiente burbuja
      const bubbleTimer = setTimeout(() => {
        setShowTypingFor(null);
        setVisibleBubbles(prev => ({
          ...prev,
          [message.id]: currentVisible + 1
        }));
      }, 800); // 800ms = 300ms typing indicator + 500ms delay
      timers.push(bubbleTimer);
    });
    
    return () => timers.forEach(timer => clearTimeout(timer));
  }, [messages, visibleBubbles, pausedMessages]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, visibleBubbles]);

  // Handle interactive elements clicks (bookmarks, scales, checkboxes, buttons, etc.)
  useEffect(() => {
    if (!messagesContainerRef.current) return;

    const handleInteractionClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Handle interactive choice buttons
      if (target.classList.contains('interactive-choice-btn') || target.closest('.interactive-choice-btn')) {
        const button = target.classList.contains('interactive-choice-btn') ? target : target.closest('.interactive-choice-btn') as HTMLElement;
        const choiceText = button?.getAttribute('data-choice-text');
        if (choiceText && onSendMessage) {
          onSendMessage(choiceText);
          toast({
            title: "Opción seleccionada",
            description: `Has elegido: ${choiceText}`,
          });
        }
      }
      
      // Handle interactive option buttons
      else if (target.classList.contains('interactive-option-btn') || target.closest('.interactive-option-btn')) {
        const button = target.classList.contains('interactive-option-btn') ? target : target.closest('.interactive-option-btn') as HTMLElement;
        const option = button?.getAttribute('data-option');
        if (option && onSendMessage) {
          onSendMessage(`He elegido: ${option}`);
          toast({
            title: "Opción seleccionada",
            description: option,
          });
        }
      }
      
      // Handle interactive scale buttons
      else if (target.classList.contains('interactive-scale-btn')) {
        const value = target.getAttribute('data-value');
        const scaleType = target.getAttribute('data-scale-type');
        if (value && onSendMessage) {
          const message = scaleType 
            ? `Mi ${scaleType} es: ${value}/10`
            : `${value}/10`;
          onSendMessage(message);
          
          // Visual feedback
          target.style.background = 'rgb(5, 150, 105)';
          target.style.color = 'white';
          toast({
            title: "Valoración registrada",
            description: `Has seleccionado: ${value}/10`,
          });
        }
      }
      
      // Handle yes/no buttons
      else if (target.classList.contains('interactive-yesno-btn') || target.closest('.interactive-yesno-btn')) {
        const button = target.classList.contains('interactive-yesno-btn') ? target : target.closest('.interactive-yesno-btn') as HTMLElement;
        const answer = button?.getAttribute('data-answer');
        const question = button?.getAttribute('data-question');
        if (answer && onSendMessage) {
          onSendMessage(`${question}: ${answer}`);
          toast({
            title: "Respuesta enviada",
            description: `Has respondido: ${answer}`,
          });
        }
      }
      
      // Handle bookmark buttons
      else if (target.classList.contains('bookmark-btn')) {
        const bookmarkContent = target.getAttribute('data-bookmark');
        if (bookmarkContent) {
          // Guardar en localStorage para persistencia
          const existingBookmarks = JSON.parse(localStorage.getItem('nflow-bookmarks') || '[]');
          const newBookmark = {
            id: Date.now(),
            content: bookmarkContent,
            timestamp: new Date().toISOString(),
          };
          
          if (!existingBookmarks.find((b: any) => b.content === bookmarkContent)) {
            existingBookmarks.push(newBookmark);
            localStorage.setItem('nflow-bookmarks', JSON.stringify(existingBookmarks));
            
            // Feedback visual
            target.innerHTML = '✅ Guardado';
            target.style.background = 'rgba(34, 197, 94, 0.3)';
            setTimeout(() => {
              target.innerHTML = '💾 Guardar';
              target.style.background = '';
            }, 2000);
            
            toast({
              title: "✅ Recurso guardado",
              description: "Guardado en tu lista de recursos personales",
            });
          } else {
            toast({
              title: "Ya guardado",
              description: "Este recurso ya está en tu lista",
              variant: "default",
            });
          }
        }
      }
    };

    // Handle checkbox clicks
    const handleCheckboxClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('checkbox-item')) {
        const checkbox = target.querySelector('.interactive-checkbox') as HTMLInputElement;
        if (checkbox) {
          checkbox.checked = !checkbox.checked;
          checkbox.dispatchEvent(new Event('click'));
        }
      }
    };

    messagesContainerRef.current.addEventListener('click', handleInteractionClick);
    messagesContainerRef.current.addEventListener('click', handleCheckboxClick);
    
    return () => {
      messagesContainerRef.current?.removeEventListener('click', handleInteractionClick);
      messagesContainerRef.current?.removeEventListener('click', handleCheckboxClick);
    };
  }, [onSendMessage, toast]);

  if (isLoadingMessages) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600 dark:text-emerald-400 mx-auto mb-4" />
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
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-2 py-4 space-y-2"
        style={{
          backgroundColor: '#0a1929'
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
              
              // Dividir mensajes de la IA en segmentos, usuarios quedan sin dividir
              const segments = !message.isUser ? splitContentIntoSegments(message.content) : [message.content];
              const numVisibleBubbles = visibleBubbles[message.id] || 0;
              const visibleSegments = segments.slice(0, numVisibleBubbles);
              const isPaused = pausedMessages[message.id];
              
              return (
                <div key={message.id}>
                  {visibleSegments.map((segment, segmentIndex) => {
                    const formattedContent = !message.isUser ? formatMarkdownToHtml(segment) : segment;
                    const isFirstSegment = segmentIndex === 0;
                    const isLastSegment = segmentIndex === segments.length - 1;
                    
                    return (
                      <div
                        key={`${message.id}-segment-${segmentIndex}`}
                        className={`flex items-end space-x-2 ${
                          message.isUser ? "justify-end" : "justify-start"
                        } animate-in slide-in-from-bottom-2 duration-300 mb-2`}
                        style={{ 
                          marginTop: isFirstSegment && !isConsecutive ? '8px' : '4px',
                          animationDelay: `${segmentIndex * 150}ms`
                        }}
                      >
                        {/* Bot avatar - solo en el primer segmento y si no es consecutivo */}
                        {!message.isUser && isFirstSegment && !isConsecutive && (
                          <div className="w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0 shadow-md ring-2 ring-gray-200 dark:ring-gray-700 mb-1">
                            <Bot className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          </div>
                        )}
                        
                        {/* Spacer cuando no es el primer segmento o es consecutivo */}
                        {!message.isUser && (!isFirstSegment || isConsecutive) && (
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
                          {/* Triangle/tail for WhatsApp bubble effect - solo en el primer segmento */}
                          {isFirstSegment && (
                            <div
                              className={`absolute bottom-0 ${
                                message.isUser
                                  ? "right-0 transform translate-x-1 border-l-8 border-t-8 border-l-transparent border-t-teal-500 dark:border-t-teal-600"
                                  : "left-0 transform -translate-x-1 border-r-8 border-t-8 border-r-transparent border-t-white dark:border-t-gray-800"
                              }`}
                              style={{ width: 0, height: 0 }}
                            ></div>
                          )}
                          
                          {/* Message Content */}
                          <div className="relative z-10">
                            {message.isUser ? (
                              <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                                {segment}
                              </div>
                            ) : (
                              <div 
                                className="text-sm leading-relaxed message-content"
                                dangerouslySetInnerHTML={{ __html: formattedContent }}
                              />
                            )}
                            
                            {/* Timestamp and status - solo en el último segmento */}
                            {isLastSegment && (
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
                            )}
                          </div>
                          
                          {/* Hover Actions - solo en el último segmento */}
                          {isLastSegment && (
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
                          )}
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
                  
                  {/* Indicador de "escribiendo..." entre burbujas */}
                  {!message.isUser && showTypingFor === message.id && (
                    <div className="flex items-end space-x-2 mb-2 animate-in slide-in-from-bottom-2 duration-200">
                      <div className="w-8 flex-shrink-0"></div>
                      <div className="bg-white dark:bg-gray-800 rounded-tr-2xl rounded-tl-2xl rounded-br-2xl shadow-md border border-gray-200 dark:border-gray-700 px-4 py-2 max-w-xs">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-emerald-500 dark:bg-emerald-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-emerald-500 dark:bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-emerald-500 dark:bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Botón "Continuar leyendo" para respuestas largas */}
                  {!message.isUser && isPaused && numVisibleBubbles < segments.length && (
                    <div className="flex items-center justify-center my-3">
                      <Button
                        onClick={() => {
                          console.log(`Continuar leyendo clicked for message ${message.id}`);
                          console.log(`Current pausedMessages state:`, pausedMessages);
                          setPausedMessages(prev => {
                            const newState = { ...prev, [message.id]: false };
                            console.log(`New pausedMessages state:`, newState);
                            return newState;
                          });
                        }}
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-full px-6 py-2 text-sm font-medium"
                        data-testid="button-continue-reading"
                      >
                        <span className="mr-2">Continuar leyendo</span>
                        <svg className="w-4 h-4 inline animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </Button>
                    </div>
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
