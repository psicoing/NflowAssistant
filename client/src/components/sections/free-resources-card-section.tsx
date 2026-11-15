import { Badge } from "@/components/ui/badge";
import { BookOpen, Heart, Brain, Sparkles, TrendingUp, ChevronRight, Flame } from "lucide-react";
import { Link } from "wouter";

export default function FreeResourcesCardSection() {
  return (
    <section className="px-4 py-14 sm:py-16">
      <div className="max-w-6xl mx-auto">
        <div className="overflow-hidden rounded-[1.75rem] border border-[#d6e3dc] bg-[#f3f6ef] shadow-[0_24px_70px_-48px_rgba(19,61,59,0.45)]">
          <div className="grid md:grid-cols-[1fr_0.82fr]">
            {/* Left Side - Content */}
            <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
              <div className="mb-6 inline-flex items-center gap-2 self-start border-b border-[#a8bd9e] pb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#4e7568]">
                <BookOpen aria-hidden="true" className="h-4 w-4" />
                Recursos para consultar a tu ritmo
              </div>
              
              <h2 className="mb-4 text-3xl font-semibold leading-tight tracking-[-0.04em] text-[#173e3d] sm:text-4xl">
                Recursos de Salud Mental
                <span className="block text-[#557d65]">
                  Sin Registro
                </span>
              </h2>
              
              <p className="mb-7 max-w-xl text-base leading-7 text-[#526b68]">
                Accede ahora a ejercicios, evaluaciones profesionales y contenido de bienestar. Todo funciona directamente en tu navegador, sin necesidad de crear una cuenta.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e0eae0] text-[#3d6b5e]">
                    <Heart aria-hidden="true" className="h-4 w-4" />
                  </div>
                  <span className="font-medium text-[#34534f]">Registro emocional diario</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e0eae0] text-[#3d6b5e]">
                    <Brain aria-hidden="true" className="h-4 w-4" />
                  </div>
                  <span className="font-medium text-[#34534f]">Evaluaciones profesionales</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e0eae0] text-[#3d6b5e]">
                    <Sparkles aria-hidden="true" className="h-4 w-4" />
                  </div>
                  <span className="font-medium text-[#34534f]">Afirmaciones positivas</span>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e0eae0] text-[#3d6b5e]">
                    <TrendingUp aria-hidden="true" className="h-4 w-4" />
                  </div>
                  <span className="font-medium text-[#34534f]">Sistema de racha diaria</span>
                </div>
              </div>

              <Link href="/recursos-gratuitos">
                <span
                  className="group inline-flex min-h-12 items-center justify-center self-start rounded-full bg-[#174f50] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#103f42] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4e8176] focus-visible:ring-offset-2"
                  data-testid="button-go-to-free-resources"
                >
                  Explorar Recursos Gratis
                  <ChevronRight aria-hidden="true" className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none" />
                </span>
              </Link>
            </div>

            {/* Right Side - Visual */}
            <div className="relative flex items-center justify-center overflow-hidden bg-[#123f43] p-7 sm:p-10 lg:p-12">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
              
              <div aria-hidden="true" className="pointer-events-none absolute -right-14 -top-14 h-72 w-72 rounded-full border border-[#6d9d8c]/30" />
              <div className="relative w-full max-w-sm space-y-3">
                {/* Decorative cards showing resources */}
                <div className="rounded-2xl border border-white/15 bg-white/[0.08] p-5">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#c9dd83] text-[#173e3d]">
                      <Heart aria-hidden="true" className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold">Registro Diario</h4>
                      <p className="text-[#c3d8d1] text-sm">Monitorea tus emociones</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/15 bg-white/[0.08] p-5">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#c9dd83] text-[#173e3d]">
                      <Brain aria-hidden="true" className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold">Evaluaciones</h4>
                      <p className="text-[#c3d8d1] text-sm">Resultados al instante</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Badge className="border-white/20 bg-white/10 text-[#e7eee7]">Ansiedad</Badge>
                    <Badge className="border-white/20 bg-white/10 text-[#e7eee7]">Depresión</Badge>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/15 bg-white/[0.08] p-5">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#c9dd83] text-[#173e3d]">
                      <Sparkles aria-hidden="true" className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold">Afirmaciones</h4>
                      <p className="text-[#c3d8d1] text-sm">Mensajes positivos diarios</p>
                    </div>
                  </div>
                </div>

                {/* Streak indicator */}
                <div className="flex items-center justify-center gap-3 border-t border-[#6d9d8c]/40 px-2 pt-4">
                  <Flame aria-hidden="true" className="h-7 w-7 text-[#c9dd83]" />
                  <div>
                    <p className="text-white font-semibold">Racha Diaria</p>
                    <p className="text-[#c3d8d1] text-sm">Mantén tu compromiso</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
