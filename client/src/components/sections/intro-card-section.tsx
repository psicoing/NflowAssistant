import { ArrowUpRight, BookOpen, Brain, MessageCircle, ScanSearch } from "lucide-react";
import { Link } from "wouter";

export default function IntroCardSection() {
  return (
    <section
      id="intro-card"
      className="px-4 py-12 sm:py-16"
      aria-labelledby="intro-card-title"
    >
      <div className="nflow-responsive-container">
        <div className="relative isolate overflow-hidden rounded-[2rem] bg-[#123f43] text-[#f2f4e8] shadow-[0_28px_80px_-46px_rgba(13,57,58,0.72)] dark:bg-[#102f33]">
          <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-28 h-[30rem] w-[30rem] rounded-full border border-[#6d9d8c]/25" />
          <div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-12 h-[22rem] w-[22rem] rounded-full border border-[#6d9d8c]/20" />
          <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 h-1.5 w-full bg-[#c9dd83]" />

          <div className="relative px-6 py-9 sm:px-10 sm:py-12 lg:px-16 lg:py-16">
            <header className="mx-auto max-w-4xl text-center">
              <p className="mb-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.19em] text-[#b7d7c4]">
                <Brain aria-hidden="true" className="h-4 w-4" />
                NUXA · estrategia conversacional
              </p>
              <h2 id="intro-card-title" className="text-4xl font-semibold leading-[1.02] tracking-[-0.05em] text-[#f2f4e8] sm:text-6xl lg:text-7xl">
                La tecnología detrás de una conversación más humana.
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[#c3d8d1] sm:text-lg sm:leading-8">
                NUXA combina modelos de lenguaje con NEUROPSI: una estrategia que orienta la conversación para ayudarte a explorar lo que sientes, sin apresurarte.
              </p>
            </header>

            <div className="mx-auto mt-12 max-w-5xl border-y border-[#6d9d8c]/40">
              <div className="grid gap-7 py-7 sm:grid-cols-[minmax(8rem,0.34fr)_1fr] sm:gap-10 sm:py-9">
                <div className="flex items-center gap-3 sm:block">
                  <span className="font-mono text-sm tracking-[0.16em] text-[#c9dd83]">01</span>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#b7d7c4] sm:mt-3">Comprender</p>
                </div>
                <div className="flex gap-4">
                  <MessageCircle aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-[#c9dd83]" />
                  <p className="max-w-2xl text-lg leading-7 text-[#f2f4e8] sm:text-xl sm:leading-8">
                    La respuesta parte de lo que compartes y del contexto que está disponible en esa conversación.
                  </p>
                </div>
              </div>
              <div className="grid gap-7 border-t border-[#6d9d8c]/40 py-7 sm:grid-cols-[minmax(8rem,0.34fr)_1fr] sm:gap-10 sm:py-9">
                <div className="flex items-center gap-3 sm:block">
                  <span className="font-mono text-sm tracking-[0.16em] text-[#c9dd83]">02</span>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#b7d7c4] sm:mt-3">Orientar</p>
                </div>
                <div className="flex gap-4">
                  <BookOpen aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-[#c9dd83]" />
                  <p className="max-w-2xl text-lg leading-7 text-[#f2f4e8] sm:text-xl sm:leading-8">
                    NEUROPSI guía el intercambio y selecciona evidencia pertinente del catálogo de fuentes de NUXA; no es una consulta exhaustiva en tiempo real.
                  </p>
                </div>
              </div>
              <div className="grid gap-7 border-t border-[#6d9d8c]/40 py-7 sm:grid-cols-[minmax(8rem,0.34fr)_1fr] sm:gap-10 sm:py-9">
                <div className="flex items-center gap-3 sm:block">
                  <span className="font-mono text-sm tracking-[0.16em] text-[#c9dd83]">03</span>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#b7d7c4] sm:mt-3">Fundamentar</p>
                </div>
                <div className="flex gap-4">
                  <ScanSearch aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-[#c9dd83]" />
                  <p className="max-w-2xl text-lg leading-7 text-[#f2f4e8] sm:text-xl sm:leading-8">
                    La estrategia revisa que la respuesta se mantenga conectada con el contexto y las fuentes seleccionadas.
                  </p>
                </div>
              </div>
            </div>

            <footer className="mx-auto mt-8 flex max-w-5xl flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-xl border-l-2 border-[#c9dd83] pl-4">
                <p className="text-sm leading-6 text-[#c3d8d1]">
                  El contexto se limita a la conversación disponible: no hay memoria ilimitada. NUXA puede equivocarse, no realiza diagnósticos y no sustituye la atención profesional.
                </p>
              </div>
              <Link
                href="/login"
                className="group inline-flex min-h-12 shrink-0 items-center justify-center gap-3 self-start rounded-full bg-[#d6e69a] px-6 py-3 text-sm font-semibold text-[#173e3d] transition duration-200 hover:-translate-y-0.5 hover:bg-[#e3edb8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#eff5c7] focus-visible:ring-offset-2 focus-visible:ring-offset-[#123f43] motion-reduce:transform-none motion-reduce:transition-none sm:self-auto"
              >
                <span>Empieza a tu ritmo</span>
                <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none" />
              </Link>
            </footer>
          </div>
        </div>
      </div>
    </section>
  );
}