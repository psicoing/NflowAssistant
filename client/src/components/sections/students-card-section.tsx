import { ArrowUpRight, GraduationCap, BookOpen, Brain, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import studentsImage from "@assets/image_1768716364098.png";

export default function StudentsCardSection() {
  const [, setLocation] = useLocation();

  return (
    <section
      id="nuxa-para-estudiantes"
      className="px-4 py-8 sm:py-12"
      aria-labelledby="students-section-title"
    >
      <div className="nflow-responsive-container">
        <div className="relative isolate overflow-hidden rounded-[2rem] border border-[#d5e4df] bg-[#f3f7f4] shadow-[0_24px_70px_-42px_rgba(17,48,58,0.38)] dark:border-slate-700 dark:bg-slate-900">
          <div aria-hidden="true" className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full border border-[#c5ddd4] dark:border-slate-700" />
          <div aria-hidden="true" className="pointer-events-none absolute -left-2 -top-2 h-40 w-40 rounded-full border border-[#d5e4df] dark:border-slate-700" />

          <div className="relative grid gap-8 px-6 py-8 sm:px-10 sm:py-11 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16 lg:px-16 lg:py-14">
            <div className="relative order-2 lg:order-1">
              <div className="relative overflow-hidden rounded-[1.5rem] border border-[#d5e4df] bg-[#e4f0eb] shadow-[0_22px_50px_-32px_rgba(17,48,58,0.42)] dark:border-slate-700 dark:bg-slate-800">
                <img
                  src={studentsImage}
                  alt="Espacio de aprendizaje para estudiantes de medicina y psicología"
                  className="aspect-[4/3] w-full object-cover"
                />
                <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#173640]/30 to-transparent" />
                <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full border border-white/70 bg-[#f3f7f4]/95 px-3.5 py-2 text-xs font-semibold tracking-wide text-[#24554f] shadow-sm dark:border-slate-600 dark:bg-slate-900/95 dark:text-teal-200">
                  <BookOpen aria-hidden="true" className="h-4 w-4" />
                  Aprendizaje y reflexión
                </div>
              </div>
            </div>

            <div className="order-1 flex flex-col items-start lg:order-2">
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#c5ddd4] bg-[#e4f0eb] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#1f6459] dark:border-teal-900 dark:bg-teal-950/70 dark:text-teal-200">
                <GraduationCap aria-hidden="true" className="h-4 w-4" />
                NUXA · espacio formativo
              </p>
              <h2
                id="students-section-title"
                className="max-w-2xl text-[2.35rem] font-semibold leading-[1.08] tracking-[-0.045em] text-[#173640] dark:text-[#e8f1ed] sm:text-5xl"
              >
                Aprender a escuchar empieza por practicar.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-[#50666b] dark:text-slate-300 sm:text-lg sm:leading-8">
                Un espacio para que estudiantes de medicina y psicología exploren conversaciones y reflexionen sobre la comunicación en contextos de cuidado.
              </p>

              <div className="mt-7 grid w-full gap-0 border-y border-[#d5e4df] dark:border-slate-700 sm:grid-cols-2 sm:divide-x sm:divide-[#d5e4df] dark:sm:divide-slate-700">
                <div className="flex items-center gap-3 py-4 sm:pr-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e0eee8] text-[#27675d] dark:bg-teal-950 dark:text-teal-200">
                    <Stethoscope aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <span className="font-semibold text-[#233f45] dark:text-slate-100">Medicina</span>
                </div>
                <div className="flex items-center gap-3 border-t border-[#d5e4df] py-4 dark:border-slate-700 sm:border-t-0 sm:pl-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e0eee8] text-[#27675d] dark:bg-teal-950 dark:text-teal-200">
                    <Brain aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <span className="font-semibold text-[#233f45] dark:text-slate-100">Psicología</span>
                </div>
              </div>

              <Button
                onClick={() => setLocation("/login")}
                size="lg"
                className="group mt-8 inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full border-0 bg-[#174f50] px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_22px_-12px_rgba(23,79,80,0.8)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#103f42] hover:shadow-[0_12px_28px_-14px_rgba(23,79,80,0.85)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2b8275] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f3f7f4] motion-reduce:transform-none motion-reduce:transition-none sm:w-auto dark:focus-visible:ring-offset-slate-900"
              >
                <span>Empezar a aprender</span>
                <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none" />
              </Button>
              <p className="mt-3 max-w-lg text-xs leading-5 text-[#667b7e] dark:text-slate-400">
                Un recurso educativo para acompañar el aprendizaje; no sustituye la formación supervisada ni la atención profesional.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
