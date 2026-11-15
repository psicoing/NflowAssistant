import { Smartphone, Heart, Brain, Shield, Clock } from "lucide-react";
import { Link } from "wouter";
import nflowImage from "@assets/generated_images/NFLOW_mental_health_app_05faf5ea.png";

export default function NFlowShowcaseSection() {
  return (
    <section id="app-movil" className="px-4 py-14 sm:py-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid items-center gap-10 rounded-[1.75rem] border border-[#cbded6] bg-[#eaf1eb] p-6 sm:p-10 lg:grid-cols-2 lg:gap-14 lg:p-14">
          
          {/* Content */}
          <div className="space-y-7">
            <div className="space-y-4">
              <h2 className="text-4xl font-semibold leading-tight tracking-[-0.045em] text-[#173e3d] sm:text-5xl">
                Descubre <span className="text-[#557d65]">NUXA</span>
              </h2>
              <h3 className="text-xl font-medium text-[#42695f] sm:text-2xl">
                Tu asistente de salud mental inteligente
              </h3>
              <p className="text-base leading-7 text-[#526b68] sm:text-lg">
                Una experiencia revolucionaria que combina tecnología avanzada 
                con el cuidado profesional que mereces.
              </p>
            </div>

            {/* Features */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#174f50] text-[#d6e69a]">
                  <Brain className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#234844]">IA Profesional</h4>
                  <p className="text-sm text-[#647b75]">Entrenada por expertos</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#dce8dc] text-[#47736a]">
                  <Heart className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#234844]">Apoyo Emocional</h4>
                  <p className="text-sm text-[#647b75]">Cuando lo necesites</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#dce8dc] text-[#47736a]">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#234844]">Privado</h4>
                  <p className="text-sm text-[#647b75]">Confidencial y seguro</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#dce8dc] text-[#47736a]">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#234844]">Disponible 24/7</h4>
                  <p className="text-sm text-[#647b75]">Siempre a tu lado</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/login" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#174f50] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#103f42] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4e8176] focus-visible:ring-offset-2 motion-reduce:transition-none">
                  <Smartphone className="h-5 w-5" />
                  Comenzar Ahora
              </Link>
              <button
                type="button"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#9cb8aa] px-6 py-3 text-sm font-semibold text-[#315e57] transition-colors hover:bg-[#dce8dc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4e8176] focus-visible:ring-offset-2 motion-reduce:transition-none"
              >
                Ver Demo
              </button>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative z-10 rounded-[1.5rem] border border-[#cbded6] bg-[#f8f9f4] p-3">
              <img 
                src={nflowImage} 
                alt="NUXA - Asistente de salud mental inteligente" 
                className="w-full h-auto rounded-2xl"
              />
            </div>
            
            {/* Decorative Elements */}
          </div>
        </div>
      </div>
    </section>
  );
}