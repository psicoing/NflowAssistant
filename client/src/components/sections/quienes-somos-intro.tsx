import { BookOpen, Brain, CheckCircle2, GraduationCap, ShieldCheck, UserRound } from "lucide-react";

const formation = [
  {
    institution: "Universitat Autònoma de Barcelona",
    title: "Licenciatura en Psicología, clínica y educativa",
    period: "1989–1993",
    status: "Título completado",
    completed: true,
  },
  {
    institution: "Universitat de Girona",
    title: "Postgrado en Psicología de la Salud y del Comportamiento",
    period: "1994–1995",
    status: "Postgrado completado",
    completed: true,
  },
  {
    institution: "Universitat Autònoma de Barcelona",
    title: "Formación en Psicofarmacología",
    period: "1988–1993",
    status: "Formación complementaria",
    completed: false,
  },
  {
    institution: "Universitat Oberta de Catalunya",
    title: "Estudios de Ingeniería de Telecomunicaciones",
    period: "Desde 2010",
    status: "Estudios en curso",
    completed: false,
  },
  {
    institution: "UOC – Universitat de Barcelona",
    title: "Estudios de máster en Bioinformática y Bioestadística",
    period: "2020–2021",
    status: "Estudios en curso",
    completed: false,
  },
];

export default function QuienesSomosIntro() {
  return (
    <section className="px-4 pb-14 pt-8 sm:px-6 md:pb-20 md:pt-12 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-[2rem] border border-[#54716d]/35 bg-gradient-to-br from-[#172c36] via-[#142831] to-[#203c3e] px-6 py-9 shadow-[0_24px_80px_rgba(5,17,24,0.24)] sm:px-10 sm:py-12">
          <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full border border-[#8de0c1]/10" />
          <div className="pointer-events-none absolute -right-6 -top-10 h-44 w-44 rounded-full border border-[#f5a385]/10" />

          <div className="relative">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#8de0c1]/20 bg-[#8de0c1]/[0.08] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#a9e4cf]">
              <Brain className="h-4 w-4" strokeWidth={1.8} />
              NUXA · Bienestar emocional
            </p>
            <h1 className="max-w-3xl text-4xl font-bold tracking-[-0.04em] text-[#f1f5ed] sm:text-5xl">
              Quiénes somos
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[#c3d3ce] sm:text-xl">
              NUXA es una inteligencia artificial especializada en bienestar emocional: un espacio digital de apoyo y orientación psicoeducativa.
            </p>

            <div className="mt-7 flex max-w-3xl items-start gap-3 rounded-2xl border border-[#f5a385]/20 bg-[#f5a385]/[0.08] p-4 sm:p-5">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#f5a385]" strokeWidth={1.8} />
              <p className="text-sm leading-relaxed text-[#e3d9cf] sm:text-[15px]">
                NUXA es una IA y no sustituye la atención de un profesional de la salud. No reemplaza el criterio ni la intervención de profesionales sanitarios.
              </p>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-[1.15fr_1fr]">
              <div className="rounded-2xl border border-white/[0.09] bg-white/[0.045] p-4 sm:p-5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.13em] text-[#9fc3b9]">
                  <UserRound className="h-4 w-4 text-[#f5a385]" />
                  Profesional responsable
                </div>
                <p className="mt-3 text-lg font-semibold text-[#f1f5ed]">Ramón Molons de San Román</p>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#b3c7c1]">
                  <span>COPC 7851</span>
                  <span>Autorización sanitaria E-17928705</span>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-white/[0.09] bg-white/[0.045] p-4 sm:p-5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#8de0c1]/[0.12] text-[#9ee4ca]">
                  <BookOpen className="h-5 w-5" strokeWidth={1.8} />
                </span>
                <p className="text-sm leading-relaxed text-[#c3d3ce]">
                  La experiencia profesional combina psicología, formación clínica y estudios complementarios.
                </p>
              </div>
            </div>
          </div>
        </div>

        <section aria-labelledby="formacion-heading" className="mt-12 md:mt-16">
          <div className="mb-6 max-w-2xl">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.17em] text-[#8ed9bf]">
              Trayectoria académica
            </p>
            <h2 id="formacion-heading" className="flex items-center gap-3 text-2xl font-bold tracking-[-0.025em] text-white sm:text-3xl">
              <GraduationCap className="h-7 w-7 text-[#f5a385]" strokeWidth={1.7} />
              Formación de Ramón Molons
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-300 sm:text-base">
              Formación en psicología y salud, junto con estudios complementarios en tecnología y bioinformática. Los estudios indicados como en curso no se presentan como titulaciones finalizadas.
            </p>
          </div>

          <ol className="grid gap-3">
            {formation.map((item) => (
              <li
                key={`${item.institution}-${item.title}`}
                className="grid gap-3 rounded-2xl border border-white/[0.09] bg-[#172a34]/80 p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-5"
              >
                <div className="flex gap-3">
                  <span className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl ${item.completed ? "bg-[#8de0c1]/[0.12] text-[#9ee4ca]" : "bg-[#f5a385]/[0.12] text-[#f5b29a]"}`}>
                    {item.completed ? (
                      <CheckCircle2 className="h-[18px] w-[18px]" strokeWidth={1.8} />
                    ) : (
                      <BookOpen className="h-[18px] w-[18px]" strokeWidth={1.8} />
                    )}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#9bb8b0]">{item.institution}</p>
                    <p className="mt-1 text-[15px] font-semibold leading-snug text-[#eef5f0]">{item.title}</p>
                    <p className="mt-1 text-sm text-[#a9bfba]">{item.period}</p>
                  </div>
                </div>
                <span className={`ml-12 w-fit rounded-full border px-3 py-1.5 text-xs font-semibold ${item.completed ? "border-[#8de0c1]/20 bg-[#8de0c1]/[0.07] text-[#a9e4cf]" : "border-[#f5a385]/20 bg-[#f5a385]/[0.07] text-[#f1b49c]"} sm:ml-0`}>
                  {item.status}
                </span>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </section>
  );
}
