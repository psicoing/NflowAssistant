import { Heart, Shield, Users, MessageCircle } from "lucide-react";
import { useLocation } from "wouter";
import lgbtiImagePath from "@assets/ChatGPT Image 18 jul 2025, 09_00_02_1752822021391.png";

export default function LGBTISupportSection() {
  const [, setLocation] = useLocation();
  
  return (
    <section className="px-4 py-14 sm:py-20">
      <div className="mx-auto max-w-6xl">
        {/* Header con badge */}
        <div className="mb-12 max-w-4xl">
          <div className="mb-5 inline-flex items-center gap-2 border-b border-[#cbded6] pb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#55776a]">
            <Heart className="h-4 w-4" />
            <span>NUXA LGBTI+ · Apoyo y respeto</span>
          </div>
          
          <h2 className="mb-5 text-3xl font-semibold leading-tight tracking-[-0.04em] text-[#173e3d] sm:text-5xl">
            <span>
              Apoyo y Dignidad
            </span>
            <span className="block text-[#557d65]">con respeto a tu identidad</span>
          </h2>
          
          <p className="max-w-3xl text-base leading-7 text-[#526b68] sm:text-lg sm:leading-8">
            Las experiencias de discriminación o rechazo pueden afectar el bienestar. En NUXA, ofrecemos un espacio de conversación sin juicios y con atención a las realidades LGBTI+.
          </p>
        </div>

        <div className="grid items-center gap-8 lg:grid-cols-[1fr_0.9fr] lg:gap-12">
          {/* Imagen de la comunidad LGBTI+ */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-[1.75rem] border border-[#cbded6] shadow-[0_24px_60px_-38px_rgba(19,61,59,0.38)]">
              <img 
                src={lgbtiImagePath}
                alt="Comunidad LGBTI+ unida con bandera del orgullo"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#123f43]/25 to-transparent"></div>
            </div>
            
            {/* Badge flotante */}
            <div className="absolute -right-2 -top-3 rounded-full border border-[#cbded6] bg-[#f3f6ef] px-4 py-2 shadow-md sm:right-4 sm:top-4">
              <div className="flex items-center gap-2 text-[#42695f]">
                <Shield className="h-4 w-4" />
                <span className="text-sm font-semibold">Un espacio de respeto</span>
              </div>
            </div>
          </div>

          {/* Contenido */}
          <div className="space-y-5">
            {/* Estadística importante */}
            <div className="rounded-2xl border-l-2 border-[#91aa72] bg-[#eaf1eb] p-5 sm:p-6">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#dce8dc] text-[#55776a]">
                  <MessageCircle className="h-4 w-4" />
                </div>
                <h3 className="text-lg font-semibold text-[#234844]">Un espacio para hablar</h3>
              </div>
              <p className="text-sm leading-6 text-[#526b68]">
                Si estás atravesando una situación difícil, puedes compartirla a tu ritmo. NUXA es un recurso de apoyo emocional y no sustituye la atención profesional.
              </p>
            </div>

            {/* Grid de características de apoyo */}
            <div className="grid gap-4">
              <div className="flex items-center gap-4 rounded-xl border border-[#d6e3dc] bg-[#f8f9f4] p-4">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#e1ebe3] text-[#47736a]">
                  <Shield className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#234844]">Confidencialidad</h4>
                  <p className="text-sm text-[#647b75]">Sin juicios ni etiquetas</p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-xl border border-[#d6e3dc] bg-[#f8f9f4] p-4">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#e1ebe3] text-[#47736a]">
                  <Heart className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#234844]">Lenguaje inclusivo</h4>
                  <p className="text-sm text-[#647b75]">Respeto por tu identidad y orientación</p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-xl border border-[#d6e3dc] bg-[#f8f9f4] p-4">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#e1ebe3] text-[#47736a]">
                  <Users className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#234844]">Apoyo especializado</h4>
                  <p className="text-sm text-[#647b75]">Comprensión de las realidades LGBTI+</p>
                </div>
              </div>
            </div>

            {/* Mensaje de compromiso */}
            <div className="rounded-2xl border border-[#d6e3dc] bg-[#eaf1eb] p-5 sm:p-6">
              <h3 className="mb-3 text-lg font-semibold text-[#234844]">Nuestro compromiso</h3>
              <p className="mb-4 text-sm leading-relaxed text-[#526b68]">
                Queremos aportar nuestro granito de arena creando un espacio donde puedas ser tú mismo/a sin miedo, 
                donde tus emociones sean validadas y donde encuentres el apoyo que mereces.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Heart className="h-4 w-4 text-[#55776a]" />
                <span className="font-medium text-[#42695f]">Con respeto, equipo NUXA</span>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <button
                onClick={() => setLocation("/registro")}
                className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#174f50] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#103f42] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4e8176] focus-visible:ring-offset-2 motion-reduce:transition-none"
                data-testid="button-lgbti-apoyo"
              >
                <Heart className="w-5 h-5" />
                Encuentra tu Apoyo Aquí
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}