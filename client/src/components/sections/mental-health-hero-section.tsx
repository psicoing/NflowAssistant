import { ArrowUpRight, Brain, MessageCircle, Smartphone } from "lucide-react";
import { Link } from "wouter";

export default function MentalHealthHeroSection() {
  return (
    <section
      id="nuxa-escucha"
      className="px-4 py-10 sm:py-14"
      aria-labelledby="nuxa-hero-title"
    >
      <div className="nflow-responsive-container">
        <div className="relative isolate overflow-hidden rounded-[2rem] border border-[#d5e4df] bg-[#f3f7f4] shadow-[0_24px_70px_-42px_rgba(17,48,58,0.38)] dark:border-slate-700 dark:bg-slate-900">
          <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full border border-[#bdd9d0] dark:border-slate-700" />
          <div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-16 h-56 w-56 rounded-full border border-[#c9e0d8] dark:border-slate-700" />

          <div className="relative grid gap-9 px-6 py-9 sm:px-10 sm:py-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16 lg:px-16 lg:py-[4.5rem]">
            <div className="flex flex-col items-start">
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#c5ddd4] bg-[#e4f0eb] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#1f6459] dark:border-teal-900 dark:bg-teal-950/70 dark:text-teal-200">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#398c79]" />
                NUXA · bienestar emocional
              </p>
              <h2
                id="nuxa-hero-title"
                className="max-w-2xl text-[2.5rem] font-semibold leading-[1.08] tracking-[-0.045em] text-[#173640] dark:text-[#e8f1ed] sm:text-5xl lg:text-[3.65rem]"
              >
                Un lugar para poner en palabras lo que sientes.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-[#50666b] dark:text-slate-300 sm:text-lg sm:leading-8">
                Si hoy hay estrés, dudas o soledad, puedes hablar a tu ritmo. NUXA te escucha sin juicios y te ayuda a entender mejor lo que estás viviendo.
              </p>
              <Link
                href="/login"
                className="group mt-8 inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#174f50] px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_22px_-12px_rgba(23,79,80,0.8)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#103f42] hover:shadow-[0_12px_28px_-14px_rgba(23,79,80,0.85)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2b8275] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f3f7f4] motion-reduce:transform-none motion-reduce:transition-none dark:focus-visible:ring-offset-slate-900"
              >
                <span>Empieza cuando quieras</span>
                <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none" />
              </Link>
              <p className="mt-3 text-xs leading-5 text-[#667b7e] dark:text-slate-400">
                La atención profesional es un camino distinto y complementario.
              </p>
            </div>

            <div className="relative flex flex-col justify-center border-t border-[#d5e4df] pt-5 dark:border-slate-700 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#64807d] dark:text-teal-200">
                A tu manera
              </p>
              <ul className="divide-y divide-[#d5e4df] dark:divide-slate-700">
                <li className="flex items-start gap-4 py-4 first:pt-2">
                  <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e0eee8] text-[#27675d] dark:bg-teal-950 dark:text-teal-200">
                    <MessageCircle aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block font-semibold text-[#233f45] dark:text-slate-100">Habla sin juicios</span>
                    <span className="mt-1 block text-sm leading-6 text-[#617377] dark:text-slate-400">Comparte lo que te pasa, a tu propio ritmo.</span>
                  </span>
                </li>
                <li className="flex items-start gap-4 py-4">
                  <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e0eee8] text-[#27675d] dark:bg-teal-950 dark:text-teal-200">
                    <Smartphone aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block font-semibold text-[#233f45] dark:text-slate-100">Contigo en el móvil</span>
                    <span className="mt-1 block text-sm leading-6 text-[#617377] dark:text-slate-400">Accede estés donde estés.</span>
                  </span>
                </li>
                <li className="flex items-start gap-4 py-4 last:pb-2">
                  <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e0eee8] text-[#27675d] dark:bg-teal-950 dark:text-teal-200">
                    <Brain aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block font-semibold text-[#233f45] dark:text-slate-100">Entiende mejor lo que sientes</span>
                    <span className="mt-1 block text-sm leading-6 text-[#617377] dark:text-slate-400">Un espacio para ordenar pensamientos y emociones.</span>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}