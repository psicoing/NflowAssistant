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
    <div className="mx-auto max-w-sm overflow-hidden rounded-2xl border border-[#456c68] bg-[#123f43] p-4 shadow-[0_20px_45px_-25px_rgba(18,63,67,0.55)]">
      <div className="mb-3 flex items-center justify-between border-b border-[#6d9d8c]/35 pb-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#d6e69a] text-[#173e3d]">
            <Zap className="h-4 w-4" />
          </div>
          <div>
            <span className="text-sm font-semibold text-[#f2f4e8]">Modo Q&A Breve</span>
            <span className="block text-xs text-[#b7d7c4]">Respuestas rápidas</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-[#c9dd83]"></div>
          <span className="text-xs text-[#c9dd83]">En vivo</span>
        </div>
      </div>
      
      <div 
        ref={containerRef}
        className="h-[280px] space-y-3 overflow-y-auto scrollbar-thin scrollbar-thumb-[#6d9d8c] scrollbar-track-transparent pr-1"
      >
        {messages.map((msg, idx) => (
          <div 
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} motion-safe:animate-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300 motion-reduce:animate-none`}
          >
            {msg.role === 'assistant' && (
              <div className="mr-2 mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white/10">
                <Bot className="h-3.5 w-3.5 text-[#c9dd83]" />
              </div>
            )}
            <div 
              className={`max-w-[85%] px-3 py-2.5 rounded-xl text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-[#d6e69a] text-[#173e3d] rounded-br-sm'
                  : 'bg-white/10 text-[#f2f4e8] border border-white/10 rounded-bl-sm'
              }`}
            >
              {msg.text}
            </div>
            {msg.role === 'user' && (
              <div className="ml-2 mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#d6e69a]/15">
                <User className="h-3.5 w-3.5 text-[#d6e69a]" />
              </div>
            )}
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start motion-safe:animate-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-200 motion-reduce:animate-none">
            <div className="mr-2 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white/10">
              <Bot className="h-3.5 w-3.5 text-[#c9dd83]" />
            </div>
            <div className="rounded-xl rounded-bl-sm border border-white/10 bg-white/10 px-4 py-3">
              <div className="flex gap-1">
                <div className="h-1.5 w-1.5 rounded-full bg-[#c9dd83] motion-safe:animate-pulse motion-reduce:animate-none"></div>
                <div className="h-1.5 w-1.5 rounded-full bg-[#c9dd83] motion-safe:animate-pulse motion-reduce:animate-none" style={{ animationDelay: '150ms' }}></div>
                <div className="h-1.5 w-1.5 rounded-full bg-[#c9dd83] motion-safe:animate-pulse motion-reduce:animate-none" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-3 border-t border-[#6d9d8c]/35 pt-2">
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2">
          <span className="flex-1 text-sm text-[#b7d7c4]">Escribe tu pregunta...</span>
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#d6e69a]">
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
    <section className="py-12 md:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* NUXA vs ChatGPT Badge */}
        <div className="flex justify-center items-center mb-6">
          <div className="flex max-w-full items-center gap-3 rounded-2xl border border-[#cbded6] bg-[#eaf1eb] px-4 py-3 sm:gap-4 sm:px-6 sm:py-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#174f50] text-[#d6e69a] sm:h-12 sm:w-12">
              <Compass className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-[#234844] sm:text-base">NUXA entiende contextos.</p>
              <p className="text-sm font-semibold text-[#55776a] sm:text-base">ChatGPT responde.</p>
            </div>
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#dce8dc] text-[#47736a] sm:h-12 sm:w-12">
              <Bot className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
          </div>
        </div>
        
        {/* Privacy Notice */}
        <div className="mx-auto mb-6 max-w-lg rounded-xl border border-[#cbded6] bg-[#f3f6ef] p-3">
          <div className="flex items-start gap-2">
            <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#55776a]" />
            <div className="text-left text-xs leading-relaxed text-[#526b68]">
              <span className="font-semibold text-[#234844]">100% Confidencial.</span> Email solo para pago. Sin confirmaciones ni recuperaciones.
              Excepción: usuarios Shopify reciben email de acceso (seguridad extra). <span className="font-semibold">Confidencial total, todo entre tú y NUXA.</span>
            </div>
          </div>
        </div>

        {/* Banner Departamento de Salud */}
        <div className="mb-8 max-w-3xl mx-auto">
          <button
            onClick={() => setIsPdfOpen(true)}
            className="group w-full rounded-2xl border border-[#cbded6] bg-[#eaf1eb] p-4 transition-colors hover:bg-[#e1ebe3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#557d65] motion-reduce:transition-none"
            data-testid="button-departamento-salud"
          >
            <div className="flex items-center justify-center gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#174f50] text-[#d6e69a]">
                <FileText className="h-5 w-5" />
              </div>
              <div className="text-left flex-1">
                <p className="mb-0.5 text-sm font-semibold text-[#234844]">
                  Esta app recibió del Departamento de Salud de Catalunya - España una nota informativa de calidad
                </p>
                <p className="text-xs italic text-[#647b75]">
                  This app received a quality informative note from the Health Department of Catalonia - Spain
                </p>
              </div>
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-[#55776a] transition-transform group-hover:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>
        </div>

        <div className="relative overflow-hidden rounded-[1.75rem] border border-[#cbded6] bg-[#f3f6ef] p-6 sm:p-8 md:p-12">
          
          {/* Decorative Elements */}
          <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full border border-[#cbded6]"></div>
          
          <div className="relative z-10 space-y-8">
            {/* Badge */}
            <div className="flex justify-center">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#174f50] px-5 py-2.5 text-sm font-semibold text-white">
                <Sparkles className="w-4 h-4" />
                Conoce NUXA
              </span>
            </div>

            {/* Title */}
            <div className="text-center">
              <h2 className="mb-4 text-3xl font-semibold leading-tight tracking-[-0.04em] text-[#173e3d] sm:text-4xl lg:text-5xl">
                ¿Qué es NUXA?
              </h2>
              <p className="mx-auto max-w-3xl text-base leading-7 text-[#526b68] sm:text-lg">
                NUXA combina conversación y recursos para que elijas cómo y cuándo usarlos.
              </p>
            </div>

            {/* Option 1: Chat with NEURO */}
            <div className="rounded-2xl border border-[#cbded6] bg-[#eaf1eb] p-5 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-xl bg-[#dce8dc] p-3 text-[#47736a]">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-[#234844] sm:text-xl">1. Chat con NEURO-PSI</h3>
              </div>
              <p className="leading-relaxed text-[#526b68]">
                Puedes chatear con <span className="font-semibold text-[#42695f]">NEURO-PSI</span>, el asistente conversacional de NUXA. Puede ayudarte a explorar lo que estás viviendo y a encontrar recursos. No realiza diagnósticos ni sustituye la atención profesional.
              </p>
              <p className="mt-3 text-sm italic text-[#647b75]">
                La diferencia no se nota… y eso es precisamente lo importante.
              </p>
            </div>

            {/* Q&A Demo Animation - Between Chat and Resources */}
            <div className="my-8">
              <div className="text-center mb-4">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#cbded6] bg-[#eaf1eb] px-4 py-2 text-sm font-medium text-[#42695f]">
                  <Zap className="w-4 h-4" />
                  Modo Q&A en acción
                </span>
                <p className="mt-2 text-sm text-[#647b75]">
                  Conversación real en modo pregunta-respuesta breve
                </p>
              </div>
              <QADemoAnimation />
            </div>

            {/* Option 2: Access Resources */}
            <div className="rounded-2xl border border-[#cbded6] bg-[#f3f6ef] p-5 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-xl bg-[#e1ebe3] p-3 text-[#47736a]">
                  <BookOpen className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-[#234844] sm:text-xl">2. Acceso a recursos</h3>
              </div>
              <p className="leading-relaxed text-[#526b68]">
                Si no te apetece chatear, <span className="font-medium">no pasa nada</span>. NUXA te permite acceder directamente a recursos profesionales: materiales estructurados, guías y herramientas que no se encuentran al azar en internet.
              </p>
              <p className="mt-3 text-sm italic text-[#647b75]">
                Recursos basados en protocolos clínicos reales.
              </p>
            </div>

            {/* The Real Value */}
            <div className="rounded-2xl border border-[#cbded6] bg-[#eaf1eb] p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4 justify-center">
                <Zap className="h-5 w-5 text-[#55776a]" />
                <h3 className="text-lg font-semibold text-[#234844] sm:text-2xl">El valor de NUXA</h3>
              </div>
              <p className="mx-auto mb-6 max-w-2xl text-center text-[#526b68]">
                NUXA combina ambas cosas en un solo entorno:
              </p>
              <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
                <div className="flex items-center gap-2 rounded-xl border border-[#d6e3dc] bg-[#f8f9f4] p-4">
                  <Check className="h-5 w-5 flex-shrink-0 text-[#638b72]" />
                  <span className="text-sm font-medium text-[#34534f]">Puedes solo chatear</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-[#d6e3dc] bg-[#f8f9f4] p-4">
                  <Check className="h-5 w-5 flex-shrink-0 text-[#638b72]" />
                  <span className="text-sm font-medium text-[#34534f]">Puedes solo consultar recursos</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-[#d6e3dc] bg-[#f8f9f4] p-4">
                  <Check className="h-5 w-5 flex-shrink-0 text-[#638b72]" />
                  <span className="text-sm font-medium text-[#34534f]">O usar recursos en el chat</span>
                </div>
              </div>
              <p className="mx-auto mt-6 max-w-xl text-center text-sm text-[#647b75]">
                Hoy puedes no querer hablar y solo leer. Mañana puedes querer orientación directa. Y pasado mañana, trabajar un recurso profesional acompañado por NEURO-PSI.
              </p>
            </div>

            {/* Bottom Accent - 2x1 Value */}
            <div className="text-center pt-4">
              <div className="inline-flex max-w-full flex-col items-center gap-3 rounded-2xl border border-[#cbded6] bg-[#f3f6ef] px-6 py-5 sm:px-8">
                <span className="text-lg font-semibold text-[#234844] sm:text-xl">
                  Dos recursos en <span className="text-[#557d65]">un mismo espacio</span>
                </span>
                <span className="text-sm text-[#647b75]">
                  Conversación inteligente + recursos de alta calidad, en el mismo espacio
                </span>
                <div className="flex items-center gap-2 mt-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#77977e]"></div>
                  <span className="text-sm font-semibold text-[#42695f]">
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
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#174f50] text-[#d6e69a]">
                <FileText className="h-5 w-5" />
              </div>
              Nota Informativa - Departament de Salut
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[calc(90vh-100px)] bg-white dark:bg-gray-900">
            <div className="relative">
              <div className="sticky top-0 z-10 border-b border-[#6d9d8c]/40 bg-[#123f43] px-6 py-4 text-[#f2f4e8]">
                <div className="flex items-center justify-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">NFlow.Style</span>
                    <span aria-hidden="true" className="text-[#c9dd83]">→</span>
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
