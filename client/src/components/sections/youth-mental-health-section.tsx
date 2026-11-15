import { Brain, Heart, Users, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import youthImage from "@assets/ChatGPT Image 17 jul 2025, 18_00_01_1752768099056.png";

export default function YouthMentalHealthSection() {
  return (
    <section className="px-4 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image first on left */}
          <div className="relative order-2 lg:order-1">
            <div className="relative overflow-hidden rounded-[1.75rem] border border-[#d6e3dc] shadow-[0_24px_60px_-38px_rgba(19,61,59,0.38)]">
              <img 
                src={youthImage} 
                alt="Jóvenes usando NUXA para apoyo en salud mental"
                className="w-full h-auto object-cover"
              />
              {/* Overlay with subtle gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#123f43]/35 via-transparent to-transparent"></div>
              
              {/* Floating badge - positioned on teens */}
              <div className="absolute right-4 top-4 rounded-xl border border-white/70 bg-[#f3f6ef]/95 px-4 py-3 shadow-md sm:right-6 sm:top-6">
                <div className="flex items-center space-x-3">
                   <div className="h-2 w-2 rounded-full bg-[#658a70]"></div>
                  <div>
                    <p className="text-sm font-semibold text-[#173e3d]">NUXA Adolescentes</p>
                    <p className="text-xs text-[#647b75]">Control Parental</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
          </div>

          {/* Content on right */}
          <div className="order-1 space-y-7 lg:order-2">
            <div>
              <h2 className="mb-5 text-3xl font-semibold leading-tight tracking-[-0.035em] text-[#173e3d] sm:text-4xl">
                Juventud y Salud Mental:<br />
                <span className="text-[#557d65]">Un momento para escuchar</span>
              </h2>
              
              <div className="space-y-5 text-base leading-7 text-[#526b68] sm:text-lg sm:leading-8">
                <p>
                  La juventud es una etapa de formación y descubrimiento. En estos años, muchas personas exploran sus emociones, sus vínculos y la manera de afrontar nuevos retos.
                </p>
                
                <p>
                  El acompañamiento puede ayudar a poner en palabras lo que se vive. NUXA ofrece un espacio de conversación y orientación; no sustituye la atención de profesionales.
                </p>
                

              </div>
            </div>

            {/* Key Points Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-start space-x-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#e1ebe3] text-[#47736a]">
                  <Brain className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#234844]">Escucha</h3>
                  <p className="text-sm text-[#647b75]">Un lugar para expresarse</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#e1ebe3] text-[#47736a]">
                  <Heart className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#234844]">A tu ritmo</h3>
                  <p className="text-sm text-[#647b75]">Tú decides cuándo conversar</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#e1ebe3] text-[#47736a]">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#234844]">Acompañamiento</h3>
                  <p className="text-sm text-[#647b75]">Un recurso complementario</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#e1ebe3] text-[#47736a]">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#234844]">Orientación</h3>
                  <p className="text-sm text-[#647b75]">Ideas para reflexionar</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-2">
              <Link href="/control-parental" className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#174f50] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#103f42] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4e8176] focus-visible:ring-offset-2 motion-reduce:transition-none">
                Explicación del control parental
                <span className="sr-only"> (abre información)</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}