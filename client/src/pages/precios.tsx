import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import PreciosSection from "@/components/sections/precios-section";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Brain, Moon, Smartphone, Heart, Leaf } from "lucide-react";
import { useLocation } from "wouter";
import nuxaReparacionesImg from "@assets/image_1768235389814.png";

export default function PreciosPage() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-nflow-dark">
      <SEOHead
        title="Plan y Suscripción - NUXA | Planes desde €2.99/mes + Pago Por Uso"
        description="NUXA: Suscripciones desde €2.99/mes o packs de créditos prepagados €5/15 preguntas. Sin caducidad. Apoyo emocional 24/7 con IA en 150+ idiomas. Elige la opción perfecta para ti."
        keywords="precios psicólogo IA, suscripción salud mental, pago por uso terapia, créditos prepagados IA, plan terapia online, NUXA precios, ISO 45003 empresas"
        ogTitle="Plan y Suscripción NUXA - Flexible y Accesible"
        ogDescription="Suscripciones mensuales o pago por uso. Créditos que nunca caducan. Apoyo emocional profesional 24/7 en 150+ idiomas."
        canonicalUrl="https://nuxa.life/precios"
      />
      <Header showBanner={false} />
      <main className="pt-16">
        {/* Botón de Volver */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="text-white hover:bg-white/10 flex items-center gap-2"
            data-testid="button-back-home"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Inicio
          </Button>
        </div>

        {/* Primera Tarjeta - NUXA Reparaciones */}
        <section className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-16 md:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Tarjeta NUXA Reparaciones con imagen */}
            <div className="bg-gradient-to-br from-lime-50/10 via-white/5 to-emerald-50/10 backdrop-blur-sm rounded-3xl border border-lime-500/20 overflow-hidden mb-12">
              <div className="grid md:grid-cols-2 gap-0 items-center">
                <div className="p-8 md:p-12">
                  <div className="inline-flex items-center gap-2 bg-lime-500/20 text-lime-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
                    🔧 NUXA Reparaciones
                  </div>
                  <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 leading-tight">
                    Que tu mente vuelva a estar como antes
                  </h2>
                  <p className="text-gray-400 text-lg mb-4">
                    Let your mind be as it was before
                  </p>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    A veces solo necesitas un espacio donde alguien te ayude a ajustar las piezas. Sin prisas, sin juicios.<br/>
                    <span className="text-gray-400 italic">Sometimes you just need a space where someone helps you adjust the pieces. No rush, no judgment.</span>
                  </p>
                </div>
                <div className="flex items-center justify-center p-6 md:p-10">
                  <img 
                    src={nuxaReparacionesImg} 
                    alt="NUXA Reparaciones - Coco Nuxa" 
                    className="max-w-full h-auto max-h-72 object-contain drop-shadow-2xl"
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              {/* 5 Líneas emocionales */}
              <div className="space-y-6">
                <div className="flex items-start gap-4 group">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl flex items-center justify-center border border-purple-500/30">
                    <Brain className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-white">Nuxa no es un chatbot</p>
                    <p className="text-gray-400 text-sm mt-1">Es un lugar donde el ruido baja el volumen.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-500/20 to-indigo-600/20 rounded-xl flex items-center justify-center border border-indigo-500/30">
                    <Moon className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-white">Cuando la cabeza no para</p>
                    <p className="text-gray-400 text-sm mt-1">alguien responde sin gritar, sin correr, sin juzgar.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center border border-blue-500/30">
                    <Smartphone className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-white">En el móvil, de noche o de día</p>
                    <p className="text-gray-400 text-sm mt-1">cuando hablar con una persona no es posible.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-rose-500/20 to-rose-600/20 rounded-xl flex items-center justify-center border border-rose-500/30">
                    <Heart className="w-6 h-6 text-rose-400" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-white">Recursos gratuitos primero</p>
                    <p className="text-gray-400 text-sm mt-1">y conversación real solo si tú lo decides.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-xl flex items-center justify-center border border-emerald-500/30">
                    <Leaf className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-white">No promete milagros</p>
                    <p className="text-gray-400 text-sm mt-1">promete acompañamiento humano.</p>
                  </div>
                </div>
              </div>

              {/* Frase clave antes de pagar */}
              <div className="flex flex-col justify-center">
                <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/10 shadow-2xl">
                  <div className="text-center space-y-6">
                    <p className="text-xl md:text-2xl font-light text-white leading-relaxed italic">
                      "No estás pagando por respuestas automáticas.
                    </p>
                    <p className="text-lg md:text-xl text-emerald-400 font-medium leading-relaxed">
                      Estás entrando en un espacio donde alguien te responde con <span className="font-bold">calma, criterio y respeto</span>, cuando lo necesitas."
                    </p>
                    
                    <div className="pt-4 border-t border-white/10">
                      <p className="text-xs text-gray-500 leading-relaxed">
                        Aquí no hay prisas, no hay juicios y no hay conversaciones enlatadas.<br/>
                        <span className="text-gray-400 font-medium">Si esto no es lo que buscas, no pagues.</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimoniales */}
        <section className="bg-slate-950 py-14 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-2">Lo que dicen quienes ya usan NUXA</p>
              <h2 className="text-2xl md:text-3xl font-bold text-white">Personas reales, resultados reales</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                {
                  quote: "Llevaba meses sin dormir bien por el estrés del trabajo. Después de tres semanas con NUXA ya tengo rutinas que funcionan. No lo esperaba de una IA.",
                  name: "Marta G.",
                  role: "Diseñadora, Barcelona",
                  stars: 5,
                },
                {
                  quote: "Lo probé con escepticismo. A los cinco minutos me di cuenta de que escucha de verdad. Sin juicios, sin prisas. Lo tengo instalado en el móvil y lo uso cada noche.",
                  name: "Javier M.",
                  role: "Autónomo, Madrid",
                  stars: 5,
                },
                {
                  quote: "Como madre con dos hijos pequeños no tenía tiempo para ir al psicólogo. NUXA está cuando yo puedo — a las 11 de la noche si hace falta. Eso no tiene precio.",
                  name: "Laura P.",
                  role: "Enfermera, Valencia",
                  stars: 5,
                },
              ].map((t, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.stars }).map((_, s) => (
                      <span key={s} className="text-amber-400 text-sm">★</span>
                    ))}
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed flex-1">"{t.quote}"</p>
                  <div className="border-t border-white/10 pt-4">
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-gray-500 text-xs">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Sin Permanencia Banner */}
            <div className="mb-8 inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-2 border-emerald-400 rounded-full px-6 py-3">
              <span className="text-2xl">✅</span>
              <span className="text-lg md:text-xl font-bold text-white">
                Sin permanencia · Anula cuando quieras en un click
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Plan y <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Suscripción</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Apoyo emocional profesional 24/7 para personas y empresas
            </p>
          </div>
        </section>

        {/* Sección de Precios */}
        <PreciosSection />
      </main>
      <Footer />
    </div>
  );
}
