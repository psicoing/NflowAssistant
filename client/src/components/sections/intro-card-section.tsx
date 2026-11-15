import { ArrowUpRight, BookOpen, Brain, Check, MessageCircle, ScanSearch } from "lucide-react";
import { Link } from "wouter";

export default function IntroCardSection() {
  return (
    <section
      id="intro-card"
      className="px-4 py-10 sm:py-14"
      aria-labelledby="intro-card-title"
    >
      <div className="nflow-responsive-container">
        <div className="relative isolate overflow-hidden rounded-[2rem] border border-[#c9dfd8] bg-[#e8f2ed] shadow-[0_24px_70px_-42px_rgba(17,48,58,0.42)] dark:border-slate-700 dark:bg-[#152d30]">
          <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full border border-[#b6d4c9] dark:border-teal-900" />
          <div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-16 h-56 w-56 rounded-full border border-[#c1dcd2] dark:border-teal-900" />
          <div className="relative grid gap-10 px-6 py-9 sm:px-10 sm:py-12 lg:grid-cols-[1fr_0.92fr] lg:gap-14 lg:px-16 lg:py-16">
            <div className="flex flex-col items-start">
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#b9d8cd] bg-[#d8ebe2] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#1f6459] dark:border-teal-800 dark:bg-teal-950/70 dark:text-teal-200">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#398c79]" />
                Una conversación con contexto
              </p>
              <h2 id="intro-card-title" className="max-w-2xl text-[2.35rem] font-semibold leading-[1.08] tracking-[-0.045em] text-[#173640] dark:text-[#e8f1ed] sm:text-5xl lg:text-[3.45rem]">
                Tecnología que deja espacio para lo humano.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-[#50666b] dark:text-slate-300 sm:text-lg sm:leading-8">
                NUXA combina modelos de lenguaje con la estrategia conversacional de NEUROPSI para acompañarte a poner en palabras lo que estás viviendo, a tu propio ritmo.
              </p>
              <Link
                href="/login"
                className="group mt-8 inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#174f50] px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_22px_-12px_rgba(23,79,80,0.8)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#103f42] hover:shadow-[0_12px_28px_-14px_rgba(23,79,80,0.85)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2b8275] focus-visible:ring-offset-2 focus-visible:ring-offset-[#e8f2ed] motion-reduce:transform-none motion-reduce:transition-none dark:focus-visible:ring-offset-[#152d30]"
              >
                <span>Empieza cuando quieras</span>
                <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none" />
              </Link>
              <p className="mt-3 max-w-md text-xs leading-5 text-[#667b7e] dark:text-slate-400">
                Un espacio de apoyo y reflexión; no sustituye la atención de profesionales de salud mental.
              </p>
            </div>

            <div className="relative flex flex-col justify-center border-t border-[#c9dfd8] pt-7 dark:border-slate-700 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#d5e9df] text-[#27675d] dark:bg-teal-950 dark:text-teal-200">
                  <Brain aria-hidden="true" className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#64807d] dark:text-teal-200">Cómo se construye la respuesta</p>
                  <p className="mt-1 text-sm text-[#50666b] dark:text-slate-300">Una guía clara, sin promesas mágicas.</p>
                </div>
              </div>
              <ol className="space-y-0">
                <li className="flex gap-4 border-t border-[#c9dfd8] py-4 dark:border-slate-700">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#d5e9df] text-[#27675d] dark:bg-teal-950 dark:text-teal-200">
                    <MessageCircle aria-hidden="true" className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block font-semibold text-[#233f45] dark:text-slate-100">Escucha el momento</span>
                    <span className="mt-1 block text-sm leading-6 text-[#617377] dark:text-slate-400">Toma en cuenta lo que compartes en la conversación disponible.</span>
                  </span>
                </li>
                <li className="flex gap-4 border-t border-[#c9dfd8] py-4 dark:border-slate-700">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#d5e9df] text-[#27675d] dark:bg-teal-950 dark:text-teal-200">
                    <BookOpen aria-hidden="true" className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block font-semibold text-[#233f45] dark:text-slate-100">Consulta fuentes relevantes</span>
                    <span className="mt-1 block text-sm leading-6 text-[#617377] dark:text-slate-400">Selecciona evidencia de su catálogo; no equivale a una consulta exhaustiva en tiempo real.</span>
                  </span>
                </li>
                <li className="flex gap-4 border-y border-[#c9dfd8] py-4 dark:border-slate-700">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#d5e9df] text-[#27675d] dark:bg-teal-950 dark:text-teal-200">
                    <ScanSearch aria-hidden="true" className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block font-semibold text-[#233f45] dark:text-slate-100">Revisa el fundamento</span>
                    <span className="mt-1 block text-sm leading-6 text-[#617377] dark:text-slate-400">La estrategia busca mantener las respuestas conectadas con ese contexto y sus fuentes.</span>
                  </span>
                </li>
              </ol>
              <div className="mt-5 flex items-start gap-3 rounded-2xl border border-[#c9dfd8] bg-[#f3f7f4]/80 p-4 dark:border-slate-700 dark:bg-slate-900/40">
                <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[#398c79]" />
                <p className="text-xs leading-5 text-[#617377] dark:text-slate-400">
                  El contexto se limita a la conversación disponible; NUXA no tiene memoria ilimitada. Puede equivocarse y no realiza diagnósticos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}