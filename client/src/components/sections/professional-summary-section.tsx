import { CheckCircle, Users } from "lucide-react";

export default function ProfessionalSummarySection() {
  return (
    <section className="px-4 py-12 sm:py-16">
      <div className="max-w-4xl mx-auto">
        <div className="overflow-hidden rounded-[1.75rem] border border-[#cadbd4] bg-[#f3f6ef] shadow-[0_22px_60px_-42px_rgba(19,61,59,0.42)]">
          
          {/* Header */}
          <div className="border-b border-[#d3e1d9] bg-[#e7eee7] p-7 text-center sm:p-9">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.17em] text-[#55776a]">Para profesionales</p>
            <h2 className="mx-auto max-w-3xl text-3xl font-semibold leading-tight tracking-[-0.035em] text-[#173e3d] sm:text-4xl">
              Apoyo Profesional Respaldado por la Ciencia
            </h2>
          </div>

          {/* Content */}
          <div className="p-8 md:p-12">
            
            {/* Key Features List */}
            <div className="mb-8 divide-y divide-[#dce7df] rounded-2xl border border-[#dce7df] bg-[#f8f9f4] px-5 sm:px-7">
              <div className="flex items-start space-x-3 mb-4">
                <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-[#638b72]" />
                <span className="font-medium text-[#34534f]">Orientación adaptada a cada etapa de la vida</span>
              </div>
              <div className="flex items-start space-x-3 mb-4">
                <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-[#638b72]" />
                <span className="font-medium text-[#34534f]">Lenguaje cercano y basado en evidencia científica</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-[#638b72]" />
                <span className="font-medium text-[#34534f]">Disponible 24/7 para ti o tu empresa</span>
              </div>
            </div>

            {/* Professional Statement */}
            <div className="mb-8 rounded-2xl border-l-2 border-[#91aa72] bg-[#e9efe8] p-6">
              <div className="flex items-start space-x-3">
                <Users className="mt-1 h-6 w-6 text-[#4e7568]" />
                <div>
                  <p className="font-medium leading-relaxed text-[#34534f]">
                    <strong>NUXA no es un chatbot cualquiera:</strong>{" "}
                    está desarrollado por profesionales, con contenidos actualizados y rigurosos que te ayudan a mejorar tu bienestar y el de tu equipo.
                  </p>
                </div>
              </div>
            </div>

            {/* Info Badge */}
            <div className="text-center">
              <div className="inline-flex items-center rounded-full border border-[#cbded6] bg-[#f3f6ef] px-6 py-3">
                <span className="text-sm font-medium text-[#42695f]">
                  Tu apoyo emocional profesional disponible 24/7
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}