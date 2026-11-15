import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Brain, ArrowRight, Eye, Users, Sparkles } from "lucide-react";
import { Link } from "wouter";

export default function ChatExamplesSection() {
  return (
    <section className="px-4 py-14 sm:py-16">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 text-center">
          {/* Multilingual Welcome */}
          <div className="mb-8">
            <div className="mb-4 inline-block rounded-full border border-[#cbded6] bg-[#eaf1eb] px-5 py-2.5">
              <p className="text-base font-semibold tracking-wide text-[#42695f] sm:text-lg">
                Speaking 150+ languages • 支持150多种语言
              </p>
            </div>
            <div className="mx-auto h-px w-20 bg-[#a9c1b4]"></div>
          </div>

          <div className="flex justify-center mb-6">
            <div className="rounded-xl bg-[#174f50] p-2.5 text-[#d6e69a]">
              <Eye className="h-6 w-6" />
            </div>
          </div>
          
          <h2 className="mb-4 text-3xl font-semibold leading-tight tracking-[-0.04em] text-[#173e3d] sm:text-4xl">
            Conoce tu Asistente Psicológico
          </h2>
          
          <p className="mx-auto max-w-3xl text-base leading-7 text-[#526b68] sm:text-lg">
            Descubre ejemplos reales de conversaciones con nuestro asistente de IA especializado en salud mental. Respuestas profesionales adaptadas a cada situación específica.
          </p>
        </div>

        <div className="grid items-center gap-8 md:grid-cols-2">
          {/* Left side - Features */}
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#e1ebe3] text-[#47736a]">
                <Brain className="h-5 w-5" />
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-[#234844]">
                  Respuestas Multiidioma
                </h3>
                <p className="text-sm leading-6 text-[#647b75]">
                  El asistente adapta automáticamente sus respuestas al idioma detectado en tu consulta, proporcionando apoyo psicológico natural y culturalmente apropiado.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#e1ebe3] text-[#47736a]">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-[#234844]">
                  Para Todas las Edades
                </h3>
                <p className="text-sm leading-6 text-[#647b75]">
                  Desde adolescentes hasta adultos mayores, el asistente ajusta su enfoque terapéutico según la etapa vital y las necesidades específicas de cada usuario.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#e1ebe3] text-[#47736a]">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-[#234844]">
                  Enfoque Profesional
                </h3>
                <p className="text-sm leading-6 text-[#647b75]">
                  Basado en técnicas de psicología clínica y terapia cognitivo-conductual, proporcionando orientación profesional con fundamento científico.
                </p>
              </div>
            </div>
          </div>

          {/* Right side - CTA Card */}
          <div>
            <Card className="overflow-hidden rounded-[1.5rem] border-[#315d5b] bg-[#123f43] text-[#f2f4e8]">
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#d6e69a] text-[#173e3d]">
                    <MessageCircle className="h-6 w-6" />
                  </div>
                  
                  <div>
                    <h3 className="mb-3 text-xl font-semibold text-[#f2f4e8] sm:text-2xl">
                      Ejemplos de Conversaciones
                    </h3>
                    <p className="mb-6 text-sm leading-6 text-[#c3d8d1] sm:text-base">
                      Descubre cómo NEUROPSI-AI puede ayudarte con situaciones reales. Cada respuesta está diseñada para ofrecer apoyo psicológico profesional.
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/[0.06] p-4 text-left">
                    <div className="mb-2 text-sm text-[#b7d7c4]">Ejemplos incluyen:</div>
                    <ul className="space-y-1 text-sm text-[#e2e9df]">
                      <li>• Ansiedad en adolescentes</li>
                      <li>• Crisis profesional en adultos</li>
                      <li>• Duelo en la tercera edad</li>
                      <li>• Problemas familiares</li>
                    </ul>
                  </div>

                  <Link href="/ejemplos-chat" className="group inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#d6e69a] px-6 py-3 text-sm font-semibold text-[#173e3d] transition-colors hover:bg-[#e3edb8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#eff5c7] focus-visible:ring-offset-2 focus-visible:ring-offset-[#123f43] motion-reduce:transition-none">
                      Ver ejemplos del chat
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none" />
                  </Link>

                  <p className="text-xs text-[#b7d7c4]">
                    Gratis • Sin necesidad de registro
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}