import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type HomepageProfessionalDialogProps = {
  currentLanguage: string;
};

const translations = {
  es: {
    trigger: "Licencia Profesional",
    label: "NUXA · Bienestar emocional",
    title: "Un psicólogo en tu bolsillo",
    description: "NUXA es una IA especializada en bienestar emocional.",
    disclaimer: "NUXA es una IA y no sustituye la atención de un profesional de la salud.",
    professionalLabel: "Profesional responsable",
    professional: "Ramón Molons de San Román",
    registration: "COPC 7851",
    authorization: "Autorización sanitaria E-17928705",
    close: "Cerrar",
  },
  en: {
    trigger: "Professional Licence",
    label: "NUXA · Emotional wellbeing",
    title: "A psychologist in your pocket",
    description: "NUXA is an AI specialized in emotional wellbeing.",
    disclaimer: "NUXA is an AI and does not replace care from a health professional.",
    professionalLabel: "Responsible professional",
    professional: "Ramón Molons de San Román",
    registration: "COPC 7851",
    authorization: "Health authorization E-17928705",
    close: "Close",
  },
  fr: {
    trigger: "Licence professionnelle",
    label: "NUXA · Bien-être émotionnel",
    title: "Un psychologue dans votre poche",
    description: "NUXA est une IA spécialisée dans le bien-être émotionnel.",
    disclaimer: "NUXA est une IA et ne remplace pas la prise en charge par un professionnel de santé.",
    professionalLabel: "Professionnel responsable",
    professional: "Ramón Molons de San Román",
    registration: "COPC 7851",
    authorization: "Autorisation sanitaire E-17928705",
    close: "Fermer",
  },
} as const;

export default function HomepageProfessionalDialog({
  currentLanguage,
}: HomepageProfessionalDialogProps) {
  const content =
    translations[currentLanguage as keyof typeof translations] || translations.es;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="ml-2 inline-flex min-h-10 items-center rounded-lg border border-orange-200/35 bg-orange-200/10 px-3 py-1.5 align-middle text-left text-sm font-semibold text-orange-100 transition-colors hover:border-orange-100/60 hover:bg-orange-200/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#17233d]"
        >
          {content.trigger}
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-[1.75rem] border border-[#e6d7bd] bg-[#fbf4e8] p-6 text-[#283044] shadow-2xl shadow-slate-950/30 sm:p-9">
        <DialogHeader className="space-y-3 pr-7 text-left">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9c684a]">
            {content.label}
          </p>
          <DialogTitle className="font-serif text-3xl font-semibold leading-tight tracking-[-0.03em] text-[#24304a] sm:text-4xl">
            {content.title}
          </DialogTitle>
          <DialogDescription className="text-base leading-relaxed text-[#51596a]">
            {content.description}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-1 rounded-2xl border border-[#e9d9bd] bg-[#f4ead8] p-4 sm:p-5">
          <p className="text-sm leading-relaxed text-[#5e564d]">
            {content.disclaimer}
          </p>
        </div>

        <section
          aria-label={content.professionalLabel}
          className="mt-1 border-t border-[#e4d7c4] pt-5"
        >
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#9c684a]">
            {content.professionalLabel}
          </p>
          <p className="mt-2 text-lg font-semibold text-[#24304a]">
            {content.professional}
          </p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#626575]">
            <span>{content.registration}</span>
            <span>{content.authorization}</span>
          </div>
        </section>

        <div className="mt-2 flex justify-end">
          <DialogClose asChild>
            <button
              type="button"
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#263450] px-5 py-2.5 text-sm font-bold text-[#fff8ec] transition-colors hover:bg-[#364865] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9c684a] focus-visible:ring-offset-2"
            >
              {content.close}
            </button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
