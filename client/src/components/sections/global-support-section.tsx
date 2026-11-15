import { Globe, Heart, Users, Shield } from "lucide-react";

export default function GlobalSupportSection() {
  return (
    <section className="px-4 py-14 sm:py-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 grid gap-5 border-b border-[#cbded6] pb-8 sm:mb-14 sm:grid-cols-[1fr_0.8fr] sm:items-end">
          <h2 className="max-w-2xl text-3xl font-semibold leading-tight tracking-[-0.04em] text-[#173e3d] sm:text-5xl">
            La Salud Mental No Tiene Fronteras
          </h2>
          <p className="max-w-2xl text-base leading-7 text-[#526b68] sm:text-lg">
            NUXA es una aplicación para la salud mental de personas individuales, familias y trabajadores. 
            Funciona como un recurso digital de apoyo emocional continuo, donde estés, cuando lo necesites.
          </p>
        </div>

        {/* Main Content Cards */}
        <div className="mb-12 grid gap-5 md:grid-cols-2 sm:gap-7">
          {/* Primera Tarjeta - Apoyo Global */}
          <div className="rounded-[1.5rem] border border-[#d6e3dc] bg-[#f3f6ef] p-6 sm:p-8">
            <div className="flex items-center mb-6">
              <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#174f50] text-[#d6e69a]">
                <Globe className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#173e3d]">Apoyo Sin Límites</h3>
                <p className="text-sm leading-6 text-[#647b75]">Disponible en cualquier momento, en cualquier lugar</p>
              </div>
            </div>
            
            <div className="space-y-4">
                <div className="flex items-center space-x-3">
                <div className="h-1.5 w-1.5 rounded-full bg-[#77977e]"></div>
                <span className="text-[#49635e]">Completamente anónimo. Sin estigma. Sin límites.</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-1.5 w-1.5 rounded-full bg-[#77977e]"></div>
                <span className="text-[#49635e]">Soporte para todos, en cualquier momento.</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-1.5 w-1.5 rounded-full bg-[#77977e]"></div>
                <span className="text-[#49635e]">Accesible desde cualquier dispositivo, en cualquier zona horaria.</span>
              </div>
            </div>
          </div>

          {/* Segunda Tarjeta - Primera Línea */}
          <div className="rounded-[1.5rem] border border-[#d6e3dc] bg-[#eaf1eb] p-6 sm:p-8">
            <div className="flex items-center mb-6">
              <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#dce8dc] text-[#55776a]">
                <Heart className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#173e3d]">Primera Línea de Apoyo</h3>
                <p className="text-sm leading-6 text-[#647b75]">Un recurso digital complementario para el bienestar emocional</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="h-1.5 w-1.5 rounded-full bg-[#77977e]"></div>
                <span className="text-[#49635e]">Primera línea de apoyo emocional.</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-1.5 w-1.5 rounded-full bg-[#77977e]"></div>
                <span className="text-[#49635e]">Un espacio para explorar lo que estás viviendo.</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-1.5 w-1.5 rounded-full bg-[#77977e]"></div>
                <span className="text-[#49635e]">Respuestas contextuales adaptadas a cada cultura y situación.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <div className="rounded-2xl border border-[#d6e3dc] bg-[#f8f9f4] p-5 text-center">
            <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#e1ebe3] text-[#47736a]">
              <Globe className="h-5 w-5" />
            </div>
            <h4 className="mb-2 text-base font-semibold text-[#234844]">150+ Idiomas</h4>
            <p className="text-sm text-[#647b75]">Comunicación sin barreras lingüísticas</p>
          </div>
          
          <div className="rounded-2xl border border-[#d6e3dc] bg-[#f8f9f4] p-5 text-center">
            <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#e1ebe3] text-[#47736a]">
              <Shield className="h-5 w-5" />
            </div>
            <h4 className="mb-2 text-base font-semibold text-[#234844]">Anónimo</h4>
            <p className="text-sm text-[#647b75]">Privacidad y confidencialidad</p>
          </div>
          
          <div className="rounded-2xl border border-[#d6e3dc] bg-[#f8f9f4] p-5 text-center">
            <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#e1ebe3] text-[#47736a]">
              <Users className="h-5 w-5" />
            </div>
            <h4 className="mb-2 text-base font-semibold text-[#234844]">Inclusivo</h4>
            <p className="text-sm text-[#647b75]">Apoyo para todas las culturas y contextos</p>
          </div>
          
          <div className="rounded-2xl border border-[#d6e3dc] bg-[#f8f9f4] p-5 text-center">
            <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#e1ebe3] text-[#47736a]">
              <Heart className="h-5 w-5" />
            </div>
            <h4 className="mb-2 text-base font-semibold text-[#234844]">24/7 Disponible</h4>
            <p className="text-sm text-[#647b75]">Siempre ahí cuando lo necesites</p>
          </div>
        </div>

        {/* Bottom Quote */}
        <div className="mt-10 border-l-2 border-[#91aa72] pl-5 sm:pl-7">
          <div className="max-w-3xl">
            <blockquote className="mb-4 text-xl font-medium leading-relaxed text-[#234844] sm:text-2xl">
              "NUXA ofrece soluciones innovadoras alineadas con ISO 45003, centradas en el bienestar psicológico de individuos, familias y trabajadores."
            </blockquote>
            <p className="text-sm text-[#647b75]">Filosofía NUXA</p>
          </div>
        </div>
      </div>
    </section>
  );
}