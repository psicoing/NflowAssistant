import { Globe2, MessageCircle } from "lucide-react";

export default function BorderlessSupportSection() {
  return (
    <section className="px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[1.75rem] border border-[#cbded6] bg-[#eaf1eb] text-[#173e3d]">
        <div className="grid gap-8 px-6 py-8 sm:px-10 sm:py-10 lg:grid-cols-[1fr_auto] lg:items-center lg:px-14">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.17em] text-[#47736a]">
              <Globe2 aria-hidden="true" className="h-4 w-4" />
              Bienestar emocional, sin fronteras
            </p>
            <h2 className="max-w-3xl text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-4xl">
              La Salud Mental no tiene fronteras.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#526d68] sm:text-lg">
              Tu asistente de bienestar emocional, donde estés y cuando quieras conversar. Sin horarios: tú marcas el ritmo.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 border-l-2 border-[#91aa72] pl-3 text-sm font-medium text-[#365e56]">
              <MessageCircle aria-hidden="true" className="h-4 w-4" />
              Con NUXA, un espacio para ordenar lo que sientes.
            </div>
          </div>
          <div aria-hidden="true" className="hidden h-36 w-36 items-center justify-center rounded-full border border-[#a9c1b4] text-[#47736a] lg:flex">
            <div className="flex h-24 w-24 items-center justify-center rounded-full border border-[#a9c1b4]">
              <MessageCircle className="h-9 w-9" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}