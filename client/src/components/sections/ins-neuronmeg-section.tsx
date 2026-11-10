import { useEffect } from "react";
import { Link } from "wouter";
import { useLanguageContext } from "@/components/LanguageProvider";
import { ArrowUpRight, ChevronDown, HeartHandshake, MapPin, ShieldCheck, Video } from "lucide-react";
import instituteCredentials from "../../../../attached_assets/ins1_1794331289227.png";
import onlineConsultation from "../../../../attached_assets/ins2_1794331289228.png";
import childSupport from "../../../../attached_assets/ins3_1794331289229.png";
import translationNotice from "../../../../attached_assets/ins4_1794331289229.png";
import instituteSummary from "../../../../attached_assets/ins5_1794331289230.png";
import schoolSupportComing from "../../../../attached_assets/ins6_1794331289231.png";
import neurofeedbackComing from "../../../../attached_assets/ins7_1794331289232.png";

const INSTITUTE_URL = "https://insneuronmeg.xyz/";

const content = {
  es: {
    overline: "Otra forma de acompañamiento",
    title: "Cuando necesitas hablar con una persona.",
    intro: "NUXA puede acompañarte en tu día a día. Si buscas atención psicológica humana, puedes conocer por separado el trabajo de INS NEURONMEG.",
    nuxaLabel: "NUXA · Asistente con IA",
    nuxaText: "Un espacio de bienestar cotidiano para ordenar ideas y emociones.",
    nuxaCta: "Conocer NUXA",
    human: "Atención profesional independiente",
    nuxa: "NUXA y el instituto son servicios separados. La atención del instituto no forma parte de una suscripción NUXA y no se comparten automáticamente conversaciones ni datos.",
    button: "Conocer INS NEURONMEG",
    actionLabel: "Se abrirá el sitio de INS NEURONMEG en una pestaña nueva",
    status: "El sitio público del instituto indica que permanece temporalmente cerrado. Consulta allí la información actualizada; no se realizan reservas desde NUXA.",
    online: "Atención online en español e inglés, con cita previa acordada.",
    inPerson: "Atención a domicilio únicamente en Portbou.",
    childTitle: "Atención infantil",
    childText: "El instituto también presenta atención psicológica infantil. Consulta directamente con el equipo para conocer el servicio y sus condiciones.",
    imageCaption: "Imágenes ilustrativas generadas; no representan a pacientes reales.",
    disclosure: "Más información del instituto",
    disclosureHint: "Identidad profesional, comunicación y servicios anunciados",
    detailsTitle: "Un servicio independiente, con sus propios canales.",
    credentials: "Identidad y credenciales profesionales",
    summary: "Información del instituto",
    translationTitle: "Apoyo técnico de traducción",
    translationText: "La traducción automática puede contener errores y no se garantiza que sea adecuada para una consulta clínica. Confirma con el profesional la idoneidad y privacidad del dispositivo antes de utilizarlo. El medio de comunicación se acuerda antes de la visita.",
    coming: "Próximamente",
    schoolTitle: "Evaluaciones psicopedagógicas y apoyo escolar",
    neuroTitle: "Neurofeedback y tDCS",
    comingNote: "Información de servicios futuros mostrada únicamente como próximamente; consulta al instituto para novedades.",
    materialNote: "Material gráfico proporcionado por el instituto; algunos textos pueden estar desactualizados. Las imágenes son ilustrativas y no representan a pacientes reales. NUXA no gestiona reservas: consulta siempre el sitio actual del instituto.",
    disclaimer: "El apoyo de NUXA es de bienestar y no sustituye la atención clínica. INS NEURONMEG es una vía profesional independiente; cada servicio tiene su propio alcance y condiciones.",
    location: "Portbou, Girona",
  },
  en: {
    overline: "A different kind of support",
    title: "When you need to speak with a person.",
    intro: "NUXA can be part of everyday wellbeing. If you are looking for human psychological care, you can explore the separate practice of INS NEURONMEG.",
    nuxaLabel: "NUXA · AI assistant",
    nuxaText: "Everyday wellbeing support to help you make sense of thoughts and feelings.",
    nuxaCta: "Explore NUXA",
    human: "Independent professional care",
    nuxa: "NUXA and the institute are separate services. Institute care is not part of a NUXA subscription, and conversations or personal data are not automatically shared.",
    button: "Learn about INS NEURONMEG",
    actionLabel: "INS NEURONMEG's website will open in a new tab",
    status: "The institute's public website indicates that it is temporarily closed. Check there for current information; bookings are not made through NUXA.",
    online: "Online appointments in Spanish and English, by prior arrangement.",
    inPerson: "Home visits in Portbou only.",
    childTitle: "Care for children",
    childText: "The institute also presents psychological care for children. Contact the team directly to ask about the service and its terms.",
    imageCaption: "Illustrative, AI-generated imagery; no real patients are shown.",
    disclosure: "More about the institute",
    disclosureHint: "Professional identity, communication and announced services",
    detailsTitle: "An independent service, with its own channels.",
    credentials: "Professional identity and credentials",
    summary: "Institute information",
    translationTitle: "Translation as technical assistance",
    translationText: "Automatic translation may contain errors and is not guaranteed to be appropriate for a clinical consultation. Check suitability and privacy with the professional before using a device. The communication method is agreed before the visit.",
    coming: "Coming soon",
    schoolTitle: "Psychopedagogical assessments and school support",
    neuroTitle: "Neurofeedback and tDCS",
    comingNote: "Future services are shown as coming soon only; contact the institute for updates.",
    materialNote: "Artwork supplied by the institute; some embedded text may be outdated. Images are illustrative and do not depict real patients. NUXA does not take bookings: always check the institute’s current website.",
    disclaimer: "NUXA offers wellbeing support, not clinical care. INS NEURONMEG is an independent professional option; each service has its own scope and terms.",
    location: "Portbou, Girona",
  },
  fr: {
    overline: "Une autre forme d’accompagnement",
    title: "Quand vous avez besoin de parler à une personne.",
    intro: "NUXA peut vous accompagner au quotidien. Si vous recherchez un suivi psychologique humain, découvrez séparément l’activité d’INS NEURONMEG.",
    nuxaLabel: "NUXA · Assistant IA",
    nuxaText: "Un accompagnement de bien-être au quotidien pour mettre de l’ordre dans ses idées et ses émotions.",
    nuxaCta: "Découvrir NUXA",
    human: "Accompagnement professionnel indépendant",
    nuxa: "NUXA et l’institut sont des services distincts. Le suivi de l’institut ne fait pas partie d’un abonnement NUXA ; les conversations et données personnelles ne sont pas automatiquement partagées.",
    button: "Découvrir INS NEURONMEG",
    actionLabel: "Le site d’INS NEURONMEG s’ouvrira dans un nouvel onglet",
    status: "Le site public de l’institut indique une fermeture temporaire. Consultez-le pour les informations à jour ; aucune réservation n’est effectuée via NUXA.",
    online: "Consultations en ligne en espagnol et en anglais, sur rendez-vous convenu à l’avance.",
    inPerson: "Visites à domicile à Portbou uniquement.",
    childTitle: "Accompagnement des enfants",
    childText: "L’institut présente également un accompagnement psychologique pour les enfants. Contactez directement l’équipe pour en connaître les modalités.",
    imageCaption: "Images illustratives générées par IA ; elles ne représentent pas de vrais patients.",
    disclosure: "En savoir plus sur l’institut",
    disclosureHint: "Identité professionnelle, communication et services annoncés",
    detailsTitle: "Un service indépendant, avec ses propres canaux.",
    credentials: "Identité et qualifications professionnelles",
    summary: "Informations sur l’institut",
    translationTitle: "La traduction comme aide technique",
    translationText: "La traduction automatique peut comporter des erreurs et son adéquation à une consultation clinique n’est pas garantie. Vérifiez avec le professionnel la pertinence et la confidentialité de l’appareil avant de l’utiliser. Le mode de communication est convenu avant la visite.",
    coming: "Prochainement",
    schoolTitle: "Bilans psychopédagogiques et soutien scolaire",
    neuroTitle: "Neurofeedback et tDCS",
    comingNote: "Ces services futurs sont uniquement indiqués comme à venir ; contactez l’institut pour toute actualité.",
    materialNote: "Visuels fournis par l’institut ; certains textes intégrés peuvent être obsolètes. Images illustratives, sans vrais patients. NUXA ne prend pas de rendez-vous : consultez toujours le site actuel de l’institut.",
    disclaimer: "NUXA propose un accompagnement de bien-être, pas des soins cliniques. INS NEURONMEG est une option professionnelle indépendante, avec son propre cadre et ses conditions.",
    location: "Portbou, Gérone",
  },
} as const;

export default function InsNeuronmegSection() {
  const { currentLanguage } = useLanguageContext();
  const copy = content[currentLanguage as keyof typeof content] || content.es;

  useEffect(() => {
    if (window.location.hash !== "#atencion-profesional") return;
    const scrollToSection = () => {
      const section = document.getElementById("atencion-profesional");
      if (!section) return false;
      section.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "start",
      });
      return true;
    };
    let secondFrame = 0;
    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        if (!scrollToSection()) window.setTimeout(scrollToSection, 120);
      });
    });
    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
    };
  }, []);

  return (
    <section
      id="atencion-profesional"
      aria-labelledby="ins-neuronmeg-title"
      className="relative isolate scroll-mt-24 overflow-hidden bg-[#f3f0e8] py-16 text-[#172b40] sm:py-24"
    >
      <div className="pointer-events-none absolute -right-24 top-12 h-80 w-80 rounded-full bg-[#a9d9ce]/25 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-[#f3b48f]/20 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-[.88fr_1.12fr] lg:gap-16">
          <div className="pt-1">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#497f79]/20 bg-[#dcece5] px-3.5 py-2 text-xs font-bold uppercase tracking-[.14em] text-[#285c59]">
              <HeartHandshake className="h-4 w-4" aria-hidden="true" />
              {copy.overline}
            </div>
            <h2 id="ins-neuronmeg-title" className="max-w-xl font-serif text-[2.65rem] leading-[1.04] tracking-[-.04em] text-[#172b40] sm:text-5xl lg:text-[3.2rem]">
              {copy.title}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#4d5d67] sm:text-lg">
              {copy.intro}
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <div className="flex flex-col items-start rounded-[1.35rem] bg-[#1c3149] p-5 text-[#f7f3e9] shadow-[0_14px_34px_rgba(28,52,62,.11)]">
                <span className="text-[11px] font-bold uppercase tracking-[.12em] text-[#f2b18e]">{copy.nuxaLabel}</span>
                <p className="mt-2 flex-1 text-sm leading-6 text-[#e0e7e7]">{copy.nuxaText}</p>
                <Link
                  href="/prueba-gratis"
                  className="group mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/20 px-3.5 text-xs font-bold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2b18e] motion-reduce:transition-none"
                >
                  {copy.nuxaCta}
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden="true" />
                </Link>
              </div>
              <div className="flex flex-col justify-center rounded-[1.35rem] border border-[#d9d7ce] bg-[#e7eee7] p-5">
                <span className="text-[11px] font-bold uppercase tracking-[.12em] text-[#39786b]">INS NEURONMEG · {copy.human}</span>
                <p className="mt-2 text-sm leading-6 text-[#435560]">{copy.online}</p>
              </div>
            </div>
          </div>

            <div className="overflow-hidden rounded-[1.65rem] border border-[#d9d7ce] bg-[#fffdf7] shadow-[0_22px_60px_rgba(28,52,62,.08)] lg:order-3 lg:col-span-2">
              <div className="flex items-center justify-between gap-4 border-b border-[#e7e4db] px-5 py-4 sm:px-6">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[.15em] text-[#4a8177]">{copy.human}</p>
                  <p className="mt-1 text-sm font-semibold text-[#223849]">INS NEURONMEG</p>
                </div>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#e5f0e9] text-[#347166]">
                  <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                </span>
              </div>
              <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[1.5fr_1fr] lg:items-center">
                <div className="grid gap-4 sm:grid-cols-[1.1fr_.9fr]">
                  <div className="space-y-3">
                    <p className="flex items-start gap-2.5 text-sm leading-6 text-[#435560]">
                      <Video className="mt-1 h-4 w-4 shrink-0 text-[#4a8177]" aria-hidden="true" />
                      <span>{copy.online}</span>
                    </p>
                    <p className="flex items-start gap-2.5 text-sm leading-6 text-[#435560]">
                      <MapPin className="mt-1 h-4 w-4 shrink-0 text-[#d28461]" aria-hidden="true" />
                      <span>{copy.inPerson}</span>
                    </p>
                  </div>
                  <div className="rounded-2xl bg-[#f4eee5] px-4 py-3">
                    <h3 className="text-sm font-bold text-[#263d4c]">{copy.childTitle}</h3>
                    <p className="mt-1.5 text-xs leading-5 text-[#586770]">{copy.childText}</p>
                  </div>
                </div>
                <div>
                <a
                  href={INSTITUTE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={copy.actionLabel}
                  className="group mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#e99a74] px-5 py-3 text-sm font-bold text-[#243847] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#f2aa84] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315f59] focus-visible:ring-offset-2 motion-reduce:transform-none motion-reduce:transition-none sm:w-auto"
                >
                  {copy.button}
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden="true" />
                </a>
                <p className="mt-3 text-xs leading-5 text-[#69767c]">{copy.status}</p>
                </div>
              </div>
            </div>
            <p className="text-xs leading-5 text-[#68767c] lg:order-4 lg:col-span-2">{copy.nuxa} {copy.disclaimer}</p>

          <div className="grid content-start gap-4 sm:grid-cols-2 lg:order-2">
            <figure className="overflow-hidden rounded-[1.5rem] bg-[#d9e1de] shadow-[0_18px_46px_rgba(27,50,57,.13)]">
              <img
                src={onlineConsultation}
                width={766}
                height={415}
                alt=""
                className="block h-auto w-full"
                loading="lazy"
              />
              <figcaption className="px-4 py-3 text-xs font-semibold leading-5 text-[#3c535d]">
                {copy.online}
              </figcaption>
            </figure>
            <figure className="overflow-hidden rounded-[1.5rem] bg-[#d8e0df] shadow-[0_18px_46px_rgba(27,50,57,.1)]">
              <img
                src={childSupport}
                width={770}
                height={428}
                alt=""
                className="block h-auto w-full"
                loading="lazy"
              />
              <figcaption className="px-4 py-3 text-xs font-semibold leading-5 text-[#3c535d]">
                {copy.childTitle}
              </figcaption>
            </figure>
            <div className="flex min-h-[130px] flex-col justify-between rounded-[1.5rem] border border-[#d8d8cf] bg-[#e8eee8] p-4 sm:col-span-2 sm:flex-row sm:items-center sm:gap-5 sm:px-5">
              <p className="text-xs leading-5 text-[#4c6268]">{copy.imageCaption}</p>
              <p className="mt-3 flex shrink-0 items-center gap-2 text-xs font-semibold uppercase tracking-[.12em] text-[#52776d] sm:mt-0">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                {copy.location}
              </p>
            </div>
          </div>
        </div>

        <details className="group mt-10 overflow-hidden rounded-[1.5rem] border border-[#d7d7ce] bg-[#fffdf7]/85">
          <summary className="flex min-h-[76px] cursor-pointer list-none items-center justify-between gap-5 px-5 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#4a8177] sm:px-7 [&::-webkit-details-marker]:hidden">
            <span>
              <span className="block text-sm font-bold text-[#253b49] sm:text-base">{copy.disclosure}</span>
              <span className="mt-1 block text-xs leading-5 text-[#69777a]">{copy.disclosureHint}</span>
            </span>
            <ChevronDown className="h-5 w-5 shrink-0 text-[#4c8075] transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none" aria-hidden="true" />
          </summary>
          <div className="border-t border-[#e7e4db] px-5 py-6 sm:px-7">
            <h3 className="mb-5 font-serif text-2xl tracking-[-.02em] text-[#1d3546]">{copy.detailsTitle}</h3>
            <p className="mb-5 max-w-4xl text-xs leading-5 text-[#68767c]">{copy.materialNote}</p>
            <div className="grid gap-4 md:grid-cols-2">
              <figure className="overflow-hidden rounded-2xl border border-[#e0ded5] bg-[#f8f6ef]">
                <img src={instituteCredentials} width={841} height={464} alt="" loading="lazy" className="block h-auto w-full" />
                <figcaption className="px-4 py-3 text-xs font-semibold text-[#4b5f65]">{copy.credentials}</figcaption>
              </figure>
              <figure className="overflow-hidden rounded-2xl border border-[#e0ded5] bg-[#f8f6ef]">
                <img src={instituteSummary} width={845} height={427} alt="" loading="lazy" className="block h-auto w-full" />
                <figcaption className="px-4 py-3 text-xs font-semibold text-[#4b5f65]">{copy.summary}</figcaption>
              </figure>
              <figure className="overflow-hidden rounded-2xl border border-[#e0ded5] bg-[#fbf4f8] md:col-span-2">
                <img src={translationNotice} width={725} height={445} alt="" loading="lazy" className="block h-auto w-full" />
                <figcaption className="p-5 sm:p-6">
                  <h4 className="font-semibold text-[#51396e]">{copy.translationTitle}</h4>
                  <p className="mt-2 text-sm leading-6 text-[#514e57]">{copy.translationText}</p>
                </figcaption>
              </figure>
              <figure className="overflow-hidden rounded-2xl border border-[#e0ded5] bg-[#f8f6ef]">
                <img src={schoolSupportComing} width={759} height={416} alt="" loading="lazy" className="block h-auto w-full" />
                <figcaption className="p-4 text-sm font-semibold leading-5 text-[#263d4c]">
                  <span className="mb-1.5 inline-flex rounded-full bg-[#d6ede4] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#245c52]">{copy.coming}</span>
                  <span className="block">{copy.schoolTitle}</span>
                </figcaption>
              </figure>
              <figure className="overflow-hidden rounded-2xl border border-[#e0ded5] bg-[#f8f6ef]">
                <img src={neurofeedbackComing} width={763} height={416} alt="" loading="lazy" className="block h-auto w-full" />
                <figcaption className="p-4 text-sm font-semibold leading-5 text-[#263d4c]">
                  <span className="mb-1.5 inline-flex rounded-full bg-[#d6ede4] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#245c52]">{copy.coming}</span>
                  <span className="block">{copy.neuroTitle}</span>
                </figcaption>
              </figure>
            </div>
            <p className="mt-4 text-xs leading-5 text-[#68767c]">{copy.comingNote}</p>
          </div>
        </details>
      </div>
    </section>
  );
}
