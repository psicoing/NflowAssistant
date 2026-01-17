import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Loader2, Copy, RotateCcw, Zap, Clock, Brain, Heart, Pause, Flower2, Sparkles, ArrowRight, Lightbulb, Users, Target } from "lucide-react";
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

// Función para convertir Markdown a HTML formateado con destacados visuales
function formatMarkdownToHtml(content: string, onOptionClick?: (option: string) => void, onBookmark?: (content: string) => void): string {
  // Detectar contenido marcable automáticamente
  const bookmarkableItems = detectBookmarkableContent(content);
  
  let html = content
    // Encabezados con separadores elegantes
    .replace(/^# (.+)$/gm, '<div class="flex items-center my-4"><div class="flex-1 h-px bg-gradient-to-r from-transparent via-nflow-orange to-transparent"></div><h1 class="text-lg font-bold text-white mx-4 px-3 py-1 bg-gradient-to-r from-nflow-orange/20 to-orange-600/20 rounded-lg border border-nflow-orange/30">$1</h1><div class="flex-1 h-px bg-gradient-to-r from-nflow-orange to-transparent"></div></div>')
    .replace(/^## (.+)$/gm, '<h2 class="text-base font-semibold text-white mt-4 mb-2 pb-1 border-b border-gray-600/30">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="text-sm font-medium text-nflow-orange mt-3 mb-1">$1</h3>')
    // Técnicas destacadas con botón de bookmark automático
    .replace(/\*\*Técnica[^:]*: ([^*]+)\*\*/gi, '<div class="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-lg p-4 my-3 relative"><div class="flex items-center justify-between mb-2"><div class="flex items-center space-x-2"><span class="text-green-300 font-semibold">🧠</span><strong class="font-semibold text-white">Técnica: $1</strong></div><button class="bookmark-btn text-xs bg-green-500/20 hover:bg-green-500/40 text-green-300 px-2 py-1 rounded border border-green-400/30 transition-all duration-200" data-bookmark="Técnica: $1">💾 Guardar</button></div><div class="text-sm text-gray-300">Técnica profesional recomendada por NEUROPSI-AI</div></div>')
    // Ejercicios destacados con bookmark
    .replace(/\*\*Ejercicio[^:]*: ([^*]+)\*\*/gi, '<div class="bg-gradient-to-r from-purple-500/20 to-violet-500/20 border border-purple-400/30 rounded-lg p-4 my-3 relative"><div class="flex items-center justify-between mb-2"><div class="flex items-center space-x-2"><span class="text-purple-300 font-semibold">🏃</span><strong class="font-semibold text-white">Ejercicio: $1</strong></div><button class="bookmark-btn text-xs bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 px-2 py-1 rounded border border-purple-400/30 transition-all duration-200" data-bookmark="Ejercicio: $1">💾 Guardar</button></div><div class="text-sm text-gray-300">Ejercicio personalizado para tu situación</div></div>')
    // Recursos destacados con bookmark
    .replace(/\*\*Recurso[^:]*: ([^*]+)\*\*/gi, '<div class="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/30 rounded-lg p-4 my-3 relative"><div class="flex items-center justify-between mb-2"><div class="flex items-center space-x-2"><span class="text-blue-300 font-semibold">📚</span><strong class="font-semibold text-white">Recurso: $1</strong></div><button class="bookmark-btn text-xs bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 px-2 py-1 rounded border border-blue-400/30 transition-all duration-200" data-bookmark="Recurso: $1">💾 Guardar</button></div><div class="text-sm text-gray-300">Recurso recomendado para tu desarrollo</div></div>')
    // Texto en negrita con destacado
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-white bg-nflow-orange/20 px-1 py-0.5 rounded">$1</strong>')
    // Preguntas con escalas 0-10 destacadas e interactivas
    .replace(/\*\*¿Qué tanto te afecta en tu día a día\?\*\* \(0 = nada – 10 = muchísimo\)/g, '<div class="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-lg p-4 my-4"><div class="flex items-center space-x-2 mb-3"><span class="text-blue-300 font-semibold">📊</span><strong class="font-semibold text-white">¿Qué tanto te afecta en tu día a día?</strong></div><div class="grid grid-cols-11 gap-1 mb-2">' + Array.from({length: 11}, (_, i) => `<button class="interactive-scale-btn w-6 h-6 text-xs font-bold rounded border border-gray-500 hover:bg-nflow-orange hover:text-white transition-all duration-200" data-value="${i}">${i}</button>`).join('') + '</div><div class="text-xs text-gray-400 flex justify-between"><span class="text-green-400">0 = Nada</span><span class="text-red-400">10 = Muchísimo</span></div></div>')
    // Escalas numericas genericas
    .replace(/\*\*Valora tu (.+?) del 0 al 10\*\* \(([^)]+)\)/g, '<div class="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-lg p-4 my-4"><div class="flex items-center space-x-2 mb-3"><span class="text-blue-300 font-semibold">📊</span><strong class="font-semibold text-white">Valora tu $1 del 0 al 10</strong></div><div class="grid grid-cols-11 gap-1 mb-2">' + Array.from({length: 11}, (_, i) => `<button class="interactive-scale-btn w-6 h-6 text-xs font-bold rounded border border-gray-500 hover:bg-nflow-orange hover:text-white transition-all duration-200" data-value="${i}" data-scale-type="$1">${i}</button>`).join('') + '</div><div class="text-xs text-gray-400 flex justify-between"><span>$2</span></div></div>')
    // Checkboxes interactivos ☐ con botón de envío
    .replace(/((?:☐ .+?(?:\n|$))+)/g, (match) => {
      const checkboxes = match.split('\n').filter(line => line.trim().startsWith('☐')).map(line => {
        const text = line.replace('☐ ', '').trim();
        return `<div class="flex items-center space-x-3 my-2 p-2 hover:bg-gray-800/30 rounded cursor-pointer transition-all duration-200 checkbox-item" data-checkbox-text="${text}"><input type="checkbox" class="interactive-checkbox w-4 h-4 text-nflow-orange bg-gray-800 border-gray-600 rounded focus:ring-nflow-orange focus:ring-2" data-symptom="${text}"><span class="text-gray-200 select-none">${text}</span></div>`;
      }).join('');
      return `<div class="checkbox-group bg-gray-800/50 border border-gray-700 rounded-xl p-4 my-3">${checkboxes}<button class="submit-checkboxes-btn w-full mt-4 bg-gradient-to-r from-nflow-orange to-orange-500 hover:from-nflow-orange/90 hover:to-orange-400 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"><span>✓</span><span>Enviar selección</span></button></div>`;
    })
    // Botones [Botón/Boton/Button X: ...] interactivos - regex robusto para acentos y multi-idioma
    .replace(/\[(Bot[óo]n|Button) ([A-Z]): ([^\]]+)\]/gi, '<button class="interactive-choice-btn bg-gradient-to-r from-nflow-orange/20 to-orange-600/20 border border-nflow-orange/40 rounded-lg px-4 py-2 my-1 mx-1 cursor-pointer hover:bg-nflow-orange/30 hover:border-nflow-orange/60 transition-all duration-200 text-left inline-block" data-choice="$2" data-choice-text="$3"><div class="flex items-center space-x-2"><span class="bg-nflow-orange text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">$2</span><span class="font-semibold text-white text-sm">$3</span></div></button>')
    // Preguntas Sí/No interactivas
    .replace(/\*\*¿([^*?]+\?)\*\*/g, '<div class="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-400/30 rounded-lg p-4 my-4"><div class="flex items-center space-x-2 mb-3"><span class="text-indigo-300 font-semibold">❓</span><strong class="font-semibold text-white">¿$1</strong></div><div class="flex space-x-3"><button class="interactive-yesno-btn bg-green-500/20 hover:bg-green-500/40 border border-green-400/30 text-green-300 px-4 py-2 rounded transition-all duration-200" data-answer="sí" data-question="¿$1">✅ Sí</button><button class="interactive-yesno-btn bg-red-500/20 hover:bg-red-500/40 border border-red-400/30 text-red-300 px-4 py-2 rounded transition-all duration-200" data-answer="no" data-question="¿$1">❌ No</button></div></div>')
    // Opciones clickeables interactivas
    .replace(/\*\*Opción (\d+): (.+?)\*\*/g, '<button class="interactive-option-btn w-full bg-gradient-to-r from-nflow-orange/10 to-orange-600/10 border border-nflow-orange/30 rounded-lg p-3 my-2 cursor-pointer hover:bg-nflow-orange/20 hover:border-nflow-orange/50 transition-all duration-200 text-left" data-option="Opción $1: $2"><div class="flex items-center space-x-2"><span class="bg-nflow-orange text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">$1</span><strong class="font-semibold text-white">$2</strong></div><div class="text-xs text-gray-400 mt-1">Haz clic para explorar esta opción</div></button>')
    // Texto en cursiva
    .replace(/\*(.+?)\*/g, '<em class="italic text-gray-200">$1</em>')
    // Citas profesionales destacadas con iconos
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-nflow-orange bg-nflow-orange/10 pl-4 pr-4 py-3 text-gray-200 italic my-3 rounded-r-lg shadow-sm"><span class="text-nflow-orange mr-2">⚠️</span>$1</blockquote>')
    // Listas con viñetas mejoradas
    .replace(/^- (.+)$/gm, '<li class="text-gray-100 ml-4 mb-1 flex items-start"><span class="text-nflow-orange mr-2 mt-1 font-bold">•</span><span>$1</span></li>')
    // Listas numeradas mejoradas
    .replace(/^(\d+)\. (.+)$/gm, '<li class="text-gray-100 ml-4 mb-1 flex items-start"><span class="text-nflow-orange mr-2 font-semibold bg-nflow-orange/20 px-1 rounded">$1.</span><span>$2</span></li>')
    // Párrafos normales
    .replace(/^(?!<[h|l|b|d])(.+)$/gm, '<p class="text-gray-100 mb-2 leading-relaxed">$1</p>')
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

// Función para detectar el tono emocional y ajustar colores
function detectEmotionalTone(content: string): 'supportive' | 'urgent' | 'celebratory' | 'analytical' {
  const lowerContent = content.toLowerCase();
  
  // Palabras de urgencia/crisis
  if (lowerContent.includes('crisis') || lowerContent.includes('urgente') || lowerContent.includes('inmediatamente') || lowerContent.includes('emergencia')) {
    return 'urgent';
  }
  
  // Palabras de celebración/progreso
  if (lowerContent.includes('progreso') || lowerContent.includes('felicidades') || lowerContent.includes('excelente') || lowerContent.includes('logro')) {
    return 'celebratory';
  }
  
  // Contenido analítico/técnico
  if (lowerContent.includes('técnica') || lowerContent.includes('ejercicio') || lowerContent.includes('estrategia') || lowerContent.includes('análisis')) {
    return 'analytical';
  }
  
  // Por defecto: tono de apoyo
  return 'supportive';
}

// Componente para espacios emocionales durante las respuestas
function EmotionalSpace({ section, isLastSection, delay }: { 
  section: string; 
  isLastSection: boolean; 
  delay: number;
}) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  // Detectar contenido emocional intenso para mostrar pausas apropiadas
  const hasEmotionalContent = /\b(dolor|tristeza|ansiedad|preocupación|miedo|trauma|pérdida|depresión|estrés|difícil|llorar|sufrir)\b/i.test(section);
  const hasPositiveContent = /\b(esperanza|crecimiento|fortaleza|valentía|progreso|éxito|alegría|felicidad|logro|superación)\b/i.test(section);
  
  if (!isVisible) return null;

  if (hasEmotionalContent) {
    return (
      <div className="my-8 flex items-center justify-center animate-in fade-in-0 duration-1000">
        <div className="flex flex-col items-center space-y-3 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-400/20 rounded-xl p-4 max-w-xs emotional-breath">
          <div className="flex items-center space-x-2">
            <Pause className="w-4 h-4 text-purple-400 gentle-float" />
            <span className="text-purple-300 text-sm italic">pausa para procesar</span>
            <Pause className="w-4 h-4 text-purple-400 gentle-float" />
          </div>
          <div className="flex space-x-1">
            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
          </div>
          <p className="text-xs text-purple-200 text-center leading-relaxed">
            💜 Tómate el tiempo que necesites para reflexionar
          </p>
        </div>
      </div>
    );
  }

  if (hasPositiveContent) {
    return (
      <div className="my-6 flex items-center justify-center animate-in fade-in-0 duration-1000">
        <div className="flex items-center space-x-3 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-400/20 rounded-xl px-4 py-2 emotional-breath">
          <Flower2 className="w-4 h-4 text-green-400 gentle-float" />
          <span className="text-green-300 text-xs italic">✨ momento de celebración</span>
          <Sparkles className="w-4 h-4 text-green-400 gentle-float" />
        </div>
      </div>
    );
  }

  // Espacio emocional neutro para todas las otras secciones
  return (
    <div className="my-6 flex items-center justify-center animate-in fade-in-0 duration-1000">
      <div className="flex items-center space-x-2 text-gray-500 text-xs gentle-float">
        <div className="w-1 h-1 bg-gray-500 rounded-full opacity-50 emotional-breath"></div>
        <span className="italic">💫 respira hondo</span>
        <div className="w-1 h-1 bg-gray-500 rounded-full opacity-50 emotional-breath"></div>
      </div>
    </div>
  );
}

// Componente para revelación progresiva de respuestas con interactividad
function ProgressiveResponse({ content, messageId, isLatest, onSendMessage }: { 
  content: string, 
  messageId: number, 
  isLatest: boolean,
  onSendMessage?: (content: string) => void 
}) {
  const [visibleSections, setVisibleSections] = useState<number>(0);
  const [isRevealing, setIsRevealing] = useState(false);
  const responseRef = useRef<HTMLDivElement>(null);
  
  // Detectar tono emocional para adaptar la experiencia visual
  const emotionalTone = detectEmotionalTone(content);
  
  // Dividir contenido por secciones (por encabezados #)
  const sections = content.split(/(?=^# )/m).filter(section => section.trim());
  
  useEffect(() => {
    if (isLatest && !isRevealing && visibleSections === 0) {
      setIsRevealing(true);
      // Revelar secciones progresivamente
      sections.forEach((_, index) => {
        setTimeout(() => {
          setVisibleSections(index + 1);
          if (index === sections.length - 1) {
            setIsRevealing(false);
          }
        }, (index + 1) * 800); // 800ms entre secciones
      });
    } else if (!isLatest) {
      // Para mensajes anteriores, mostrar todo inmediatamente
      setVisibleSections(sections.length);
    }
  }, [isLatest, sections.length, isRevealing, visibleSections]);

  // Manejar clics en opciones, escalas y bookmarks
  useEffect(() => {
    if (!responseRef.current) return;

    const handleInteractionClick = (event: Event) => {
      const target = event.target as HTMLElement;
      
      if (target.classList.contains('interactive-option-btn')) {
        const optionText = target.getAttribute('data-option');
        if (optionText && onSendMessage) {
          onSendMessage(optionText);
        }
      } else if (target.classList.contains('interactive-scale-btn')) {
        const scaleValue = target.getAttribute('data-value');
        const scaleType = target.getAttribute('data-scale-type');
        if (scaleValue && onSendMessage) {
          const message = scaleType 
            ? `Mi nivel de ${scaleType} es ${scaleValue}/10`
            : `Mi nivel de afectación es ${scaleValue}/10`;
          onSendMessage(message);
        }
      } else if (target.classList.contains('interactive-choice-btn')) {
        const choice = target.getAttribute('data-choice');
        const choiceText = target.getAttribute('data-choice-text');
        if (choice && choiceText && onSendMessage) {
          onSendMessage(`Elijo la opción ${choice}: ${choiceText}`);
        }
      } else if (target.classList.contains('interactive-yesno-btn')) {
        const answer = target.getAttribute('data-answer');
        const question = target.getAttribute('data-question');
        if (answer && question && onSendMessage) {
          onSendMessage(`Respuesta a "${question}": ${answer}`);
        }
      } else if (target.classList.contains('submit-checkboxes-btn') || target.closest('.submit-checkboxes-btn')) {
        const button = target.classList.contains('submit-checkboxes-btn') ? target : target.closest('.submit-checkboxes-btn') as HTMLElement;
        const checkboxGroup = button?.closest('.checkbox-group');
        if (checkboxGroup) {
          const checkedBoxes = checkboxGroup.querySelectorAll('.interactive-checkbox:checked') as NodeListOf<HTMLInputElement>;
          const selectedOptions = Array.from(checkedBoxes).map(cb => cb.getAttribute('data-symptom')).filter(Boolean);
          
          if (selectedOptions.length > 0 && onSendMessage) {
            const message = `He marcado: ${selectedOptions.join(', ')}`;
            onSendMessage(message);
            checkedBoxes.forEach(cb => cb.checked = false);
          }
        }
      } else if (target.classList.contains('bookmark-btn')) {
        const bookmarkContent = target.getAttribute('data-bookmark');
        if (bookmarkContent) {
          // Guardar en localStorage para persistencia
          const existingBookmarks = JSON.parse(localStorage.getItem('nflow-bookmarks') || '[]');
          const newBookmark = {
            id: Date.now(),
            content: bookmarkContent,
            timestamp: new Date().toISOString(),
            messageId: messageId
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
          }
        }
      }
    };

    // Manejar clics en checkbox items (tanto en el div como en el checkbox)
    const handleCheckboxClick = (event: Event) => {
      const target = event.target as HTMLElement;
      
      if (target.classList.contains('checkbox-item')) {
        const checkbox = target.querySelector('.interactive-checkbox') as HTMLInputElement;
        if (checkbox) {
          checkbox.checked = !checkbox.checked;
        }
      }
    };

    responseRef.current.addEventListener('click', handleInteractionClick);
    responseRef.current.addEventListener('click', handleCheckboxClick);
    return () => {
      responseRef.current?.removeEventListener('click', handleInteractionClick);
      responseRef.current?.removeEventListener('click', handleCheckboxClick);
    };
  }, [onSendMessage, messageId, visibleSections]);

  // Estilos adaptativos según el tono emocional
  const getEmotionalStyling = (tone: typeof emotionalTone) => {
    switch (tone) {
      case 'urgent':
        return {
          containerClass: 'bg-red-500/5 border-red-400/20',
          accentColor: 'text-red-400',
          bgGradient: 'from-red-500/10 to-orange-500/10'
        };
      case 'celebratory':
        return {
          containerClass: 'bg-green-500/5 border-green-400/20',
          accentColor: 'text-green-400',
          bgGradient: 'from-green-500/10 to-emerald-500/10'
        };
      case 'analytical':
        return {
          containerClass: 'bg-blue-500/5 border-blue-400/20',
          accentColor: 'text-blue-400',
          bgGradient: 'from-blue-500/10 to-purple-500/10'
        };
      default: // supportive
        return {
          containerClass: 'bg-nflow-orange/5 border-nflow-orange/20',
          accentColor: 'text-nflow-orange',
          bgGradient: 'from-nflow-orange/10 to-orange-600/10'
        };
    }
  };

  const styling = getEmotionalStyling(emotionalTone);

  return (
    <div ref={responseRef} className={`text-sm md:text-sm leading-relaxed p-2 rounded-lg ${styling.containerClass} transition-all duration-500`}>
      {sections.slice(0, visibleSections).map((section, index) => (
        <div 
          key={index} 
          className="animate-in slide-in-from-bottom-2 duration-500"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div dangerouslySetInnerHTML={{
            __html: formatMarkdownToHtml(section)
          }} />
          
          {/* Espacios emocionales entre secciones importantes */}
          {index < sections.length - 1 && (
            <EmotionalSpace 
              section={section} 
              isLastSection={index === sections.length - 1}
              delay={index * 500}
            />
          )}
        </div>
      ))}
      
      {/* Indicador de más contenido por venir con micro-animaciones empáticas */}
      {isRevealing && visibleSections < sections.length && (
        <div className={`flex items-center space-x-2 text-gray-400 text-xs mt-4 animate-pulse bg-gradient-to-r ${styling.bgGradient} p-3 rounded-lg border ${styling.containerClass.split(' ')[1]}`}>
          <Brain className={`w-3 h-3 ${styling.accentColor} empathy-pulse`} />
          <span>Continuando análisis con cuidado...</span>
          <div className="flex space-x-1">
            <div className={`w-1 h-1 bg-current rounded-full animate-bounce ${styling.accentColor}`}></div>
            <div className={`w-1 h-1 bg-current rounded-full animate-bounce ${styling.accentColor}`} style={{ animationDelay: '0.1s' }}></div>
            <div className={`w-1 h-1 bg-current rounded-full animate-bounce ${styling.accentColor}`} style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      )}

      {/* Resumen personalizado al final de respuestas completas */}
      {!isRevealing && visibleSections === sections.length && sections.length > 1 && (
        <PersonalizedSummary content={content} />
      )}
    </div>
  );
}

// Componente de resumen personalizado al final de las respuestas
function PersonalizedSummary({ content }: { content: string }) {
  const [isVisible, setIsVisible] = useState(false);
  
  // Extraer puntos clave del contenido
  const extractKeyPoints = (text: string): string[] => {
    const points: string[] = [];
    
    // Técnicas mencionadas
    const techniques = text.match(/\*\*Técnica[^:]*: ([^*]+)\*\*/gi);
    if (techniques) {
      techniques.forEach(tech => {
        const clean = tech.replace(/\*\*/g, '').replace('Técnica:', '').trim();
        points.push(`🧠 ${clean}`);
      });
    }
    
    // Ejercicios recomendados
    const exercises = text.match(/\*\*Ejercicio[^:]*: ([^*]+)\*\*/gi);
    if (exercises) {
      exercises.forEach(ex => {
        const clean = ex.replace(/\*\*/g, '').replace('Ejercicio:', '').trim();
        points.push(`🏃 ${clean}`);
      });
    }
    
    // Recomendaciones importantes
    const recommendations = text.match(/Te recomiendo[^.]+\./gi);
    if (recommendations && recommendations.length > 0) {
      points.push(`💡 ${recommendations[0].replace('Te recomiendo', 'Recomendación principal:')}`);
    }
    
    // Si no hay puntos específicos, extraer los primeros pasos mencionados
    if (points.length === 0) {
      const steps = text.match(/^\d+\. [^.]+\./gm);
      if (steps && steps.length > 0) {
        points.push(`🎯 ${steps[0].replace(/^\d+\. /, 'Paso clave: ')}`);
      }
    }
    
    return points.slice(0, 3); // Máximo 3 puntos clave
  };
  
  const keyPoints = extractKeyPoints(content);
  
  useEffect(() => {
    // Aparecer con delay después de que termine la revelación
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (keyPoints.length === 0) return null;
  
  return (
    <div className={`mt-6 p-4 bg-gradient-to-br from-nflow-orange/10 via-orange-600/10 to-yellow-500/10 border border-nflow-orange/30 rounded-xl shadow-lg transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="flex items-center space-x-2 mb-3">
        <Heart className="w-4 h-4 text-nflow-orange empathy-pulse" />
        <h4 className="font-semibold text-white text-sm">💫 Lo más importante para ti</h4>
      </div>
      
      <div className="space-y-2">
        {keyPoints.map((point, index) => (
          <div 
            key={index}
            className="flex items-start space-x-2 text-xs text-gray-200 animate-in slide-in-from-left-2 duration-300"
            style={{ animationDelay: `${index * 200}ms` }}
          >
            <span className="mt-0.5">•</span>
            <span className="leading-relaxed">{point}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-600/30">
        <p className="text-xs text-gray-400 italic">
          Resumen generado automáticamente por NEUROPSI-AI para tu seguimiento personal
        </p>
      </div>
    </div>
  );
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
  const [progressPercent, setProgressPercent] = useState(0);
  const [currentAnalysisStep, setCurrentAnalysisStep] = useState("");
  const [visibleSections, setVisibleSections] = useState<string[]>([]);
  const [showWelcomeBack, setShowWelcomeBack] = useState(false);
  const [isReturningUser, setIsReturningUser] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Detectar usuario recurrente y mostrar sistema de reconocimiento
  useEffect(() => {
    const lastVisit = localStorage.getItem('nflow-last-visit');
    const conversationCount = localStorage.getItem('nflow-conversation-count') || '0';
    const bookmarkCount = JSON.parse(localStorage.getItem('nflow-bookmarks') || '[]').length;
    
    if (lastVisit && parseInt(conversationCount) > 0) {
      setIsReturningUser(true);
      
      // Mostrar mensaje de bienvenida para usuarios recurrentes
      if (messages.length === 0) {
        setShowWelcomeBack(true);
        setTimeout(() => setShowWelcomeBack(false), 8000); // 8 segundos
      }
    }
    
    // Actualizar conteo de visitas
    const currentCount = parseInt(conversationCount) + 1;
    localStorage.setItem('nflow-conversation-count', currentCount.toString());
    localStorage.setItem('nflow-last-visit', new Date().toISOString());
  }, [messages.length]);

  // Estados para análisis progresivo
  const analysisSteps = [
    "Analizando contexto emocional...",
    "Evaluando factores psicológicos...", 
    "Consultando base de conocimiento clínico...",
    "Adaptando respuesta a tu perfil...",
    "Seleccionando técnicas apropiadas...",
    "Generando recomendaciones personalizadas...",
    "Finalizando respuesta profesional..."
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading && !isQuestionLimitReached) {
      const startTime = Date.now();
      setIsTyping(true);
      setProgressPercent(0);
      setCurrentAnalysisStep(analysisSteps[0]);
      setVisibleSections([]);
      
      // Simular progreso de análisis
      startProgressSimulation();
      
      onSendMessage(inputValue.trim());
      setInputValue("");
      setCharacterCount(0);
      
      // Track response time
      const checkResponse = () => {
        if (!isLoading) {
          setResponseTime(Date.now() - startTime);
          setIsTyping(false);
          setProgressPercent(100);
          setCurrentAnalysisStep("Respuesta completa");
        } else {
          setTimeout(checkResponse, 100);
        }
      };
      setTimeout(checkResponse, 100);
    }
  };

  // Simulación inteligente del progreso de análisis
  const startProgressSimulation = () => {
    const totalSteps = analysisSteps.length;
    const stepDuration = 14000 / totalSteps; // 14 segundos total
    
    analysisSteps.forEach((step, index) => {
      setTimeout(() => {
        setCurrentAnalysisStep(step);
        setProgressPercent(((index + 1) / totalSteps) * 90); // Máximo 90% hasta que llegue la respuesta real
      }, stepDuration * index);
    });
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
            <h3 className="font-semibold text-white text-sm">NUXA Assistant</h3>
            <p className="text-xs text-gray-300 flex items-center">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
              Tu psicólogo digital
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area - Different layouts for mobile vs desktop */}
      {/* Mobile: Full screen scroll without fixed height */}
      {/* Desktop: Fixed height container with internal scroll */}
      <div 
        className="flex-1 overflow-y-auto p-3 md:p-4 scrollbar-thin md:max-h-[calc(100vh-200px)]"
        ref={scrollAreaRef}
        style={{ 
          scrollBehavior: 'smooth'
        }}
      >
        <div className="space-y-3 md:space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8 md:py-12">
              {/* Mode Indicator */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-2 h-2 bg-nflow-orange rounded-full animate-pulse" />
                <span className="text-sm font-medium text-nflow-orange">Modo Clásico</span>
                <span className="text-xs text-gray-500">Respuestas completas y estructuradas</span>
              </div>
              
              <div className="relative mb-6 md:mb-8">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-nflow-orange to-nflow-orange-light rounded-2xl mx-auto flex items-center justify-center shadow-xl">
                  <Brain className="w-8 h-8 md:w-10 md:h-10 text-white" />
                </div>
                <div className="absolute -inset-4 bg-gradient-to-r from-nflow-orange/20 to-nflow-blue/20 rounded-3xl blur-xl"></div>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
                Modo Clásico
              </h3>
              <p className="text-gray-300 mb-4 max-w-sm md:max-w-md mx-auto leading-relaxed text-sm md:text-base px-4">
                Recibirás respuestas <strong className="text-nflow-orange">completas y detalladas</strong> con estructura profesional: 
                técnicas paso a paso, ejercicios prácticos, recursos y libros recomendados.
              </p>
              <p className="text-gray-400 text-xs mb-6 max-w-xs mx-auto">
                Ideal para explorar temas en profundidad y recibir orientación completa.
              </p>
              
              {/* Arrow pointing to prompt area */}
              <div className="flex flex-col items-center mt-6 mb-4 px-4">
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
            <>
              {/* Mensaje de bienvenida para usuarios recurrentes */}
              {showWelcomeBack && isReturningUser && (
                <div className="flex justify-center animate-in fade-in-0 duration-1000 mb-6">
                  <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-xl p-4 max-w-md text-center shadow-lg">
                    <div className="flex items-center justify-center space-x-2 mb-3">
                      <Heart className="w-5 h-5 text-green-400 empathy-heartbeat" />
                      <span className="text-xl">🌟</span>
                      <Heart className="w-5 h-5 text-green-400 empathy-heartbeat" />
                    </div>
                    <h3 className="text-white font-semibold mb-2">¡Me alegra verte de nuevo!</h3>
                    <p className="text-green-200 text-sm leading-relaxed mb-3">
                      Reconozco tu valentía al regresar y continuar tu proceso de crecimiento personal. 
                      Cada conversación es un paso importante hacia tu bienestar.
                    </p>
                    <div className="flex items-center justify-center space-x-4 text-xs text-green-300">
                      <span>✨ {JSON.parse(localStorage.getItem('nflow-bookmarks') || '[]').length} recursos guardados</span>
                      <span>💬 {localStorage.getItem('nflow-conversation-count') || '1'} sesiones</span>
                    </div>
                  </div>
                </div>
              )}

              {messages.map((message) => (
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
                      <ProgressiveResponse 
                        content={message.content}
                        messageId={message.id}
                        isLatest={message.id === messages[messages.length - 1]?.id}
                        onSendMessage={onSendMessage}
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
              ))}
            </>
          )}
          
          {(isLoading || isTyping) && (
            <div className="flex items-start space-x-4 animate-in slide-in-from-bottom-2 duration-300">
              <div className="w-10 h-10 bg-gradient-to-br from-nflow-orange to-nflow-orange-light rounded-xl flex items-center justify-center shadow-lg">
                <Bot className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div className="bg-gradient-to-br from-gray-800 to-gray-700 text-gray-100 p-5 rounded-2xl rounded-tl-md border border-gray-600/30 shadow-lg min-w-[320px] max-w-lg">
                {/* Header con AI pensando */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-nflow-orange rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-nflow-orange rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-nflow-orange rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Brain className="w-4 h-4 text-nflow-orange animate-pulse" />
                    <span className="text-sm font-medium">NEUROPSI-AI</span>
                  </div>
                </div>

                {/* Paso actual de análisis */}
                <div className="mb-3">
                  <p className="text-sm font-medium text-white mb-1">{currentAnalysisStep}</p>
                  <p className="text-xs text-gray-400">Análisis psicológico profesional en curso</p>
                </div>

                {/* Barra de progreso avanzada */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Progreso</span>
                    <span>{Math.round(progressPercent)}%</span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-nflow-orange to-nflow-orange-light rounded-full transition-all duration-500 ease-out relative"
                      style={{ width: `${progressPercent}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full"></div>
                    </div>
                  </div>
                </div>

                {/* Indicadores de calidad */}
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-gray-700/50 rounded-lg p-2 text-center">
                    <Heart className="w-3 h-3 text-red-400 mx-auto mb-1" />
                    <span className="text-gray-300">Empatía</span>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-2 text-center">
                    <Brain className="w-3 h-3 text-blue-400 mx-auto mb-1" />
                    <span className="text-gray-300">Análisis</span>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-2 text-center">
                    <Zap className="w-3 h-3 text-yellow-400 mx-auto mb-1" />
                    <span className="text-gray-300">Técnicas</span>
                  </div>
                </div>
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
            <span>NUXA puede cometer errores ocasionales</span>
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
