import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  Zap, 
  MessageCircle, 
  Brain, 
  Sparkles, 
  ArrowRight, 
  Volume2, 
  Clock,
  Check,
  Star,
  Rocket,
  Gift
} from "lucide-react";

export default function Novedades() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <Header />
      
      <main className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4">
          
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-400/30 px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-300 text-sm font-medium">Actualización disponible</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              NUXA <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">2026.01.17</span>
            </h1>
            
            <p className="text-xl text-white max-w-2xl mx-auto">
              Descubre todas las novedades que hemos preparado para ti
            </p>
          </div>

          <div className="space-y-8">
            
            <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/30 rounded-2xl overflow-hidden">
              <div className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <span className="bg-blue-500/30 text-blue-300 text-xs font-bold px-2 py-1 rounded-full">NUEVO</span>
                      <h2 className="text-2xl font-bold text-white mt-1">Modo Q&A Breve</h2>
                    </div>
                  </div>
                  
                  <p className="text-white text-lg leading-relaxed mb-6">
                    Ahora puedes elegir entre <strong className="text-white">tres modos de conversación</strong>: 
                    Clásico para respuestas completas, Burbujas estilo WhatsApp, o el nuevo <strong className="text-blue-400">Q&A Breve</strong> para 
                    respuestas rápidas y directas de 2-4 oraciones.
                  </p>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-orange-500/10 border border-orange-400/30 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="w-5 h-5 text-orange-400" />
                        <span className="text-orange-300 font-semibold">Clásico</span>
                      </div>
                      <p className="text-gray-200 text-sm">Respuestas detalladas con técnicas y recursos</p>
                    </div>
                    
                    <div className="bg-emerald-500/10 border border-emerald-400/30 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageCircle className="w-5 h-5 text-emerald-400" />
                        <span className="text-emerald-300 font-semibold">Burbujas</span>
                      </div>
                      <p className="text-gray-200 text-sm">Estilo mensajería con revelación progresiva</p>
                    </div>
                    
                    <div className="bg-blue-500/10 border border-blue-400/30 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-5 h-5 text-blue-400" />
                        <span className="text-blue-300 font-semibold">Q&A Breve</span>
                      </div>
                      <p className="text-gray-200 text-sm">Respuestas cortas y directas al punto</p>
                    </div>
                  </div>
                </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-600/20 to-emerald-800/20 border border-emerald-500/30 rounded-2xl overflow-hidden">
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="bg-emerald-500/30 text-emerald-300 text-xs font-bold px-2 py-1 rounded-full">MEJORADO</span>
                    <h2 className="text-2xl font-bold text-white mt-1">Indicadores visuales de modo</h2>
                  </div>
                </div>
                
                <p className="text-white text-lg leading-relaxed mb-6">
                  Ahora puedes ver claramente en qué modo estás gracias a los nuevos indicadores con 
                  <strong className="text-emerald-400"> iconos distintivos</strong>, colores únicos y descripciones 
                  claras en los estados vacíos del chat.
                </p>
                
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-white">
                    <Check className="w-5 h-5 text-emerald-400" />
                    <span>Icono de cerebro naranja para modo Clásico</span>
                  </li>
                  <li className="flex items-center gap-3 text-white">
                    <Check className="w-5 h-5 text-emerald-400" />
                    <span>Icono de mensaje verde para modo Burbujas</span>
                  </li>
                  <li className="flex items-center gap-3 text-white">
                    <Check className="w-5 h-5 text-emerald-400" />
                    <span>Icono de rayo azul para modo Q&A</span>
                  </li>
                  <li className="flex items-center gap-3 text-white">
                    <Check className="w-5 h-5 text-emerald-400" />
                    <span>Punto pulsante con color del modo activo en móvil</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border border-purple-500/30 rounded-2xl overflow-hidden">
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="bg-purple-500/30 text-purple-300 text-xs font-bold px-2 py-1 rounded-full">MEJORADO</span>
                    <h2 className="text-2xl font-bold text-white mt-1">Experiencia móvil mejorada</h2>
                  </div>
                </div>
                
                <p className="text-white text-lg leading-relaxed mb-6">
                  Navegación optimizada con <strong className="text-purple-400">barra fija</strong> que permanece 
                  visible mientras navegas y mejor acceso al selector de modos con indicador visual animado.
                </p>
                
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-white">
                    <Check className="w-5 h-5 text-purple-400" />
                    <span>Barra de navegación sticky con efecto blur</span>
                  </li>
                  <li className="flex items-center gap-3 text-white">
                    <Check className="w-5 h-5 text-purple-400" />
                    <span>Botón de modo con punto pulsante de color</span>
                  </li>
                  <li className="flex items-center gap-3 text-white">
                    <Check className="w-5 h-5 text-purple-400" />
                    <span>Mejor organización del contenido en /ejemplos-chat</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-br from-pink-600/20 to-rose-800/20 border border-pink-500/30 rounded-2xl overflow-hidden relative">
              <div className="absolute top-4 right-4 bg-pink-500/30 text-pink-300 text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                ¡NUEVO!
              </div>
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg">
                    <Volume2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="bg-pink-500/30 text-pink-300 text-xs font-bold px-2 py-1 rounded-full">DISPONIBLE</span>
                    <h2 className="text-2xl font-bold text-white mt-1">La voz de NUXA</h2>
                  </div>
                </div>
                
                <p className="text-white text-lg leading-relaxed mb-6">
                  Ahora puedes <strong className="text-pink-400">escuchar a NUXA</strong> con su propia voz. 
                  Una experiencia más cercana y humana que te acompaña en tus momentos de reflexión.
                </p>
                
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-3 text-white">
                    <Check className="w-5 h-5 text-pink-400" />
                    <span>Activa la voz con el botón 🔊 en el chat</span>
                  </li>
                  <li className="flex items-center gap-3 text-white">
                    <Check className="w-5 h-5 text-pink-400" />
                    <span>Voz natural y cálida con tecnología OpenAI</span>
                  </li>
                  <li className="flex items-center gap-3 text-white">
                    <Check className="w-5 h-5 text-pink-400" />
                    <span>Tu preferencia se guarda automáticamente</span>
                  </li>
                </ul>
                
                <div className="flex items-center gap-4 p-4 bg-pink-500/10 rounded-xl border border-pink-400/20">
                  <div className="flex-shrink-0">
                    <Sparkles className="w-8 h-8 text-pink-400" />
                  </div>
                  <div>
                    <p className="text-pink-300 font-semibold">¡Ya disponible!</p>
                    <p className="text-gray-200 text-sm">Actívalo desde la barra de navegación del chat</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center pt-8">
              <div className="bg-gradient-to-r from-emerald-600/30 to-blue-600/30 border border-emerald-400/30 rounded-2xl inline-block">
                <div className="p-8">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <Gift className="w-8 h-8 text-emerald-400" />
                    <h3 className="text-2xl font-bold text-white">¿Listo para probar?</h3>
                  </div>
                  <p className="text-white mb-6 max-w-md">
                    Todas estas mejoras están disponibles ahora mismo. Inicia sesión y experimenta la nueva NUXA.
                  </p>
                  <Link href="/login">
                    <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-bold px-8 py-6 text-lg">
                      Probar ahora
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
