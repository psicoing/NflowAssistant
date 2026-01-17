import { Sparkles, MessageCircle, BookOpen, Zap, Check, FileText, Compass, Bot, ShieldCheck, User } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect, useRef } from "react";

const qaConversation = [
  { role: 'user', text: 'Me gustaría estar delgada!' },
  { role: 'assistant', text: 'Es natural querer sentirse bien con uno mismo. Si buscas cambios saludables, considera consultar con un nutricionista para guiarte de manera segura.' },
  { role: 'user', text: 'Puede que sea anorexia?' },
  { role: 'assistant', text: 'Si tienes preocupaciones sobre tu relación con la comida o tu imagen corporal, es importante hablar con un profesional de salud mental. Ellos pueden ofrecerte una evaluación adecuada.' },
  { role: 'user', text: 'No me gusta mi cuerpo!' },
  { role: 'assistant', text: 'Es común sentirse insatisfecho con el propio cuerpo en ocasiones. Intenta enfocarte en lo que tu cuerpo puede hacer y busca apoyo si estos sentimientos persisten.' },
  { role: 'user', text: 'Me veo gorda!' },
  { role: 'assistant', text: 'Es natural tener preocupaciones sobre la imagen corporal, pero es importante recordar que todos los cuerpos son únicos. Hablar con un profesional puede ayudarte.' },
];

function QADemoAnimation() {
  const [messages, setMessages] = useState<Array<{role: string; text: string}>>([]);
  const [isTyping, setIsTyping] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    const showNextMessage = () => {
      if (indexRef.current >= qaConversation.length) {
        timeoutRef.current = setTimeout(() => {
          setMessages([]);
          setIsTyping(false);
          indexRef.current = 0;
          timeoutRef.current = setTimeout(showNextMessage, 1500);
        }, 3000);
        return;
      }
      
      const currentMessage = qaConversation[indexRef.current];
      
      if (currentMessage.role === 'assistant') {
        setIsTyping(true);
        timeoutRef.current = setTimeout(() => {
          setIsTyping(false);
          setMessages(prev => [...prev, currentMessage]);
          indexRef.current++;
          timeoutRef.current = setTimeout(showNextMessage, 2000);
        }, 1200);
      } else {
        setMessages(prev => [...prev, currentMessage]);
        indexRef.current++;
        timeoutRef.current = setTimeout(showNextMessage, 800);
      }
    };
    
    timeoutRef.current = setTimeout(showNextMessage, 1000);
    
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);
  
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);
  
  return (
    <div className="bg-slate-900 rounded-2xl p-4 max-w-sm mx-auto shadow-2xl border border-slate-700/50 overflow-hidden">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-700/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-white text-sm font-semibold">Modo Q&A Breve</span>
            <span className="text-blue-400 text-xs block">Respuestas rápidas</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-green-400 text-xs">En vivo</span>
        </div>
      </div>
      
      <div 
        ref={containerRef}
        className="space-y-3 h-[280px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent pr-1"
      >
        {messages.map((msg, idx) => (
          <div 
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}
          >
            {msg.role === 'assistant' && (
              <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                <Bot className="w-3.5 h-3.5 text-blue-400" />
              </div>
            )}
            <div 
              className={`max-w-[85%] px-3 py-2.5 rounded-xl text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-br-sm' 
                  : 'bg-slate-800 text-gray-100 border border-slate-600/50 rounded-bl-sm'
              }`}
            >
              {msg.text}
            </div>
            {msg.role === 'user' && (
              <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center ml-2 flex-shrink-0 mt-1">
                <User className="w-3.5 h-3.5 text-orange-400" />
              </div>
            )}
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start animate-in slide-in-from-bottom-2 duration-200">
            <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center mr-2 flex-shrink-0">
              <Bot className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="bg-slate-800 border border-slate-600/50 px-4 py-3 rounded-xl rounded-bl-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-3 pt-2 border-t border-slate-700/50">
        <div className="flex items-center gap-2 bg-slate-800/50 rounded-full px-4 py-2 border border-slate-600/30">
          <span className="text-gray-500 text-sm flex-1">Escribe tu pregunta...</span>
          <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NflowToNuxaTransitionSection() {
  const [isPdfOpen, setIsPdfOpen] = useState(false);

  return (
    <section className="relative bg-white dark:bg-slate-900 py-12 md:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* NUXA vs ChatGPT Badge */}
        <div className="flex justify-center items-center mb-6">
          <div className="flex items-center gap-4 bg-gradient-to-r from-emerald-100 via-emerald-50 to-emerald-100 dark:from-emerald-900/50 dark:via-emerald-800/30 dark:to-emerald-900/50 px-6 py-4 rounded-full border-2 border-emerald-300 dark:border-emerald-600 shadow-lg">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 p-2 shadow-lg ring-2 ring-amber-200">
              <Compass className="w-full h-full text-amber-900" />
            </div>
            <div className="text-center">
              <p className="text-base font-bold text-emerald-700 dark:text-emerald-300">NUXA entiende contextos.</p>
              <p className="text-base font-bold text-emerald-600 dark:text-emerald-400">ChatGPT responde.</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-300 via-emerald-400 to-emerald-600 p-2 shadow-lg ring-2 ring-emerald-200">
              <Bot className="w-full h-full text-emerald-900" />
            </div>
          </div>
        </div>
        
        {/* Privacy Notice */}
        <div className="mb-6 max-w-lg mx-auto p-3 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700/50 rounded-lg">
          <div className="flex items-start gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-700 dark:text-emerald-300/90 text-left leading-relaxed">
              <span className="font-semibold text-emerald-800 dark:text-emerald-400">100% Confidencial.</span> Email solo para pago. Sin confirmaciones ni recuperaciones.
              Excepción: usuarios Shopify reciben email de acceso (seguridad extra). <span className="font-semibold">Confidencial total, todo entre tú y NUXA.</span>
            </div>
          </div>
        </div>

        {/* Banner Departamento de Salud */}
        <div className="mb-8 max-w-3xl mx-auto">
          <button
            onClick={() => setIsPdfOpen(true)}
            className="w-full bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-2 border-emerald-400 dark:border-emerald-600 rounded-2xl p-4 hover:shadow-xl hover:border-emerald-500 dark:hover:border-emerald-500 transition-all duration-300 transform hover:scale-[1.02] group"
            data-testid="button-departamento-salud"
          >
            <div className="flex items-center justify-center gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div className="text-left flex-1">
                <p className="text-sm font-bold text-gray-900 dark:text-white mb-0.5 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                  Esta app recibió del Departamento de Salud de Catalunya - España una nota informativa de calidad
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                  This app received a quality informative note from the Health Department of Catalonia - Spain
                </p>
              </div>
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>
        </div>

        <div className="relative bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-slate-800 dark:via-slate-800 dark:to-slate-700 rounded-3xl p-8 md:p-12 border-2 border-emerald-200 dark:border-emerald-700 shadow-2xl overflow-hidden">
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-teal-400/20 to-emerald-400/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 space-y-8">
            {/* Badge */}
            <div className="flex justify-center">
              <span className="inline-flex items-center gap-2 bg-emerald-500 text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg">
                <Sparkles className="w-4 h-4" />
                Conoce NUXA
              </span>
            </div>

            {/* Title */}
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight mb-4">
                ¿Qué es NUXA?
              </h2>
              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
                NUXA no es una simple pestaña ni un chat más. Es un <span className="font-bold text-emerald-600 dark:text-emerald-400">entorno completo de apoyo psicológico y recursos profesionales</span>, diseñado para que tú elijas cómo y cuándo usarlo.
              </p>
            </div>

            {/* Option 1: Chat with NEURO */}
            <div className="bg-white/70 dark:bg-slate-700/50 rounded-2xl p-6 border border-emerald-200 dark:border-emerald-600/30 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-emerald-500/20 rounded-xl">
                  <MessageCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">1. Chat con NEURO-PSI</h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Puedes chatear con <span className="font-semibold text-emerald-600 dark:text-emerald-400">NEURO-PSI</span>, el asistente de NUXA. La experiencia es la de hablar con un psicólogo: escucha, responde con criterio y te acompaña en el proceso. <span className="font-medium">No simula, razona.</span>
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 italic">
                La diferencia no se nota… y eso es precisamente lo importante.
              </p>
            </div>

            {/* Q&A Demo Animation - Between Chat and Resources */}
            <div className="my-8">
              <div className="text-center mb-4">
                <span className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-400/30 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full text-sm font-medium">
                  <Zap className="w-4 h-4" />
                  Modo Q&A en acción
                </span>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                  Conversación real en modo pregunta-respuesta breve
                </p>
              </div>
              <QADemoAnimation />
            </div>

            {/* Option 2: Access Resources */}
            <div className="bg-white/70 dark:bg-slate-700/50 rounded-2xl p-6 border border-cyan-200 dark:border-cyan-600/30 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-cyan-500/20 rounded-xl">
                  <BookOpen className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">2. Acceso a recursos</h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Si no te apetece chatear, <span className="font-medium">no pasa nada</span>. NUXA te permite acceder directamente a recursos profesionales: materiales estructurados, guías y herramientas que no se encuentran al azar en internet.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 italic">
                Recursos basados en protocolos clínicos reales.
              </p>
            </div>

            {/* The Real Value */}
            <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 dark:from-emerald-600/20 dark:to-cyan-600/20 rounded-2xl p-6 md:p-8 border border-emerald-300/50 dark:border-emerald-500/30">
              <div className="flex items-center gap-3 mb-4 justify-center">
                <Zap className="w-6 h-6 text-amber-500" />
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">El verdadero valor de NUXA</h3>
              </div>
              <p className="text-center text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                NUXA combina ambas cosas en un solo entorno:
              </p>
              <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
                <div className="flex items-center gap-2 bg-white/60 dark:bg-slate-700/60 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                  <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Puedes solo chatear</span>
                </div>
                <div className="flex items-center gap-2 bg-white/60 dark:bg-slate-700/60 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                  <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Puedes solo consultar recursos</span>
                </div>
                <div className="flex items-center gap-2 bg-white/60 dark:bg-slate-700/60 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                  <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">O usar recursos en el chat</span>
                </div>
              </div>
              <p className="text-center text-gray-600 dark:text-gray-400 mt-6 text-sm max-w-xl mx-auto">
                Hoy puedes no querer hablar y solo leer. Mañana puedes querer orientación directa. Y pasado mañana, trabajar un recurso profesional acompañado por NEURO-PSI.
              </p>
            </div>

            {/* Bottom Accent - 2x1 Value */}
            <div className="text-center pt-4">
              <div className="inline-flex flex-col items-center gap-3 bg-white dark:bg-slate-800 px-8 py-5 rounded-2xl border-2 border-emerald-300 dark:border-emerald-600 shadow-xl">
                <span className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
                  Un combo real de <span className="text-emerald-600 dark:text-emerald-400">dos por uno</span>
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Conversación inteligente + recursos de alta calidad, en el mismo espacio
                </span>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    Sin obligación. Sin rigidez. Tú eliges cómo usarlo.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para Nota Informativa */}
      <Dialog open={isPdfOpen} onOpenChange={setIsPdfOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              Nota Informativa - Departament de Salut
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[calc(90vh-100px)] bg-white dark:bg-gray-900">
            <div className="relative">
              <div className="sticky top-0 z-10 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-4 shadow-lg">
                <div className="flex items-center justify-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">NFlow.Style</span>
                    <span className="text-xl">→</span>
                    <span className="font-bold text-lg">NUXA.life</span>
                  </div>
                </div>
                <p className="text-center text-sm mt-1 opacity-90">
                  NFlow.Style is now NUXA.life
                </p>
              </div>
              
              <img
                src="/nota-departamento-salud.png"
                alt="Nota Informativa del Departament de Salut sobre NUXA.life"
                className="w-full h-auto"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
