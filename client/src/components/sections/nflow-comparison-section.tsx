import { Check } from 'lucide-react';

export default function NFlowComparisonSection() {
  const comparisons = [
    {
      dimension: "Estructura clara",
      nflow: "Bloques temáticos organizados (empática, refuerzo, síntomas, técnicas, recursos).",
      gpt5: "El formato puede variar según la solicitud.",
      benefit: "Estructura temática"
    },
    {
      dimension: "Referencia a manuales diagnósticos",
      nflow: "Puede incluir referencias a DSM-5-TR y CIE-11.",
      gpt5: "Las referencias dependen de la respuesta.",
      benefit: "Referencias visibles"
    },
    {
      dimension: "Algoritmo de urgencia",
      nflow: "Incluye señales de alarma y teléfonos (024, 112, Telèfon de l'Esperança).",
      gpt5: "Los recursos varían según la respuesta.",
      benefit: "Recursos de orientación"
    },
    {
      dimension: "Psicoeducación",
      nflow: "Incluye sección de \"Mitos y Verdades\" y explicación diagnóstica completa.",
      gpt5: "La extensión depende de la respuesta.",
      benefit: "Contenido organizado"
    },
    {
      dimension: "Recursos adicionales",
      nflow: "Ofrece libros y recursos locales específicos.",
      gpt5: "Las sugerencias dependen del contexto.",
      benefit: "Recursos locales"
    },
    {
      dimension: "Advertencia profesional",
      nflow: "Advertencia clara, en bloque visible.",
      gpt5: "Los avisos dependen de la respuesta.",
      benefit: "Límites explícitos"
    }
  ];

  return (
    <section className="px-4 py-14 sm:py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 max-w-4xl border-b border-[#cbded6] pb-8">
          <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#e1ebe3] text-[#47736a]">
            <Check className="h-5 w-5" />
          </div>
          <h2 className="mb-4 text-3xl font-semibold leading-tight tracking-[-0.04em] text-[#173e3d] sm:text-4xl">
            Cómo se organiza el apoyo de NUXA
          </h2>
          <p className="max-w-3xl text-base leading-7 text-[#526b68] sm:text-lg">
            NUXA reúne una estructura conversacional, recursos y avisos de límites. Las respuestas pueden variar y no sustituyen la atención profesional.
          </p>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block max-w-6xl mx-auto">
          <div className="overflow-hidden rounded-[1.5rem] border border-[#cbded6] bg-[#f8f9f4]">
            {/* Header */}
            <div className="border-b border-[#cbded6] bg-[#eaf1eb] p-6">
              <div className="grid grid-cols-4 gap-4 font-semibold text-[#234844]">
                <div className="col-span-1"><h3 className="text-lg">Dimensión</h3></div>
                <div className="col-span-1 text-center"><h3 className="text-lg">NUXA</h3></div>
                <div className="col-span-1 text-center"><h3 className="text-lg">ChatGPT</h3></div>
                <div className="col-span-1 text-center"><h3 className="text-lg">Resultado</h3></div>
              </div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-[#dce7df]">
              {comparisons.map((item, index) => (
                <div key={index} className="grid grid-cols-4 gap-4 p-6 transition-colors hover:bg-[#f3f6ef]">
                  <div className="col-span-1">
                    <div className="text-sm font-semibold text-[#234844] md:text-base">
                      {item.dimension}
                    </div>
                  </div>
                  <div className="col-span-1">
                    <div className="rounded-lg border-l-2 border-[#638b72] bg-[#eaf1eb] p-3 text-sm text-[#42695f] md:text-base">
                      {item.nflow}
                    </div>
                  </div>
                  <div className="col-span-1">
                    <div className="rounded-lg border-l-2 border-[#b9a99e] bg-[#f3efeb] p-3 text-sm text-[#665b55] md:text-base">
                      {item.gpt5}
                    </div>
                  </div>
                  <div className="col-span-1 flex items-center justify-center">
                    <div className="inline-flex items-center justify-center rounded-full border border-[#cbded6] bg-[#f3f6ef] px-3 py-2 text-sm font-semibold text-[#42695f]">
                      <Check className="w-4 h-4 mr-1 flex-shrink-0" />
                      {item.benefit}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Footer */}
            <div className="border-t border-[#cbded6] bg-[#e7eee7] p-6 text-center">
              <h3 className="mb-2 text-xl font-semibold text-[#234844] sm:text-2xl">
                Pruébalo ahora — 2,99 €/mes
              </h3>
              <p className="mb-4 text-sm text-[#526b68] sm:text-base">
                Sin permanencia · Cancela cuando quieras
              </p>
              <a
                href="/registro"
                className="inline-flex min-h-11 items-center rounded-full bg-[#174f50] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#103f42] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4e8176] focus-visible:ring-offset-2 motion-reduce:transition-none"
              >
                Comenzar ahora
              </a>
            </div>
          </div>
        </div>

        {/* Mobile version */}
        <div className="md:hidden max-w-4xl mx-auto mt-4">
          <div className="space-y-5">
            {comparisons.map((item, index) => (
              <div key={index} className="rounded-xl border border-[#cbded6] bg-[#f8f9f4] p-5">
                <h3 className="mb-3 border-b border-[#dce7df] pb-2 text-base font-semibold text-[#234844]">
                  {item.dimension}
                </h3>
                <div className="space-y-3">
                  <div className="rounded-lg border-l-2 border-[#638b72] bg-[#eaf1eb] p-3">
                    <div className="mb-1 text-xs font-semibold text-[#42695f]">NUXA</div>
                    <p className="text-sm text-[#526b68]">{item.nflow}</p>
                  </div>
                  <div className="rounded-lg border-l-2 border-[#b9a99e] bg-[#f3efeb] p-3">
                    <div className="mb-1 text-xs font-semibold text-[#665b55]">ChatGPT</div>
                    <p className="text-sm text-[#665b55]">{item.gpt5}</p>
                  </div>
                  <div className="text-center">
                    <div className="inline-flex items-center rounded-full border border-[#cbded6] bg-[#f3f6ef] px-3 py-1.5 text-sm font-semibold text-[#42695f]">
                      <Check className="w-4 h-4 mr-1" />
                      {item.benefit}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-[#cbded6] bg-[#e7eee7] p-5 text-center">
            <p className="mb-1 text-lg font-semibold text-[#234844]">Pruébalo — 2,99 €/mes</p>
            <p className="mb-3 text-sm text-[#526b68]">Sin permanencia · Lo que ChatGPT no te da</p>
            <a href="/registro" className="inline-flex min-h-10 items-center rounded-full bg-[#174f50] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#103f42] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4e8176] focus-visible:ring-offset-2">
              Comenzar ahora
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
