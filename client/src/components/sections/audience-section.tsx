import { Link } from "wouter";
import { ArrowRight, ArrowUpRight, BookOpenText, Building2, HeartHandshake, Landmark, ShieldCheck } from "lucide-react";
import { useLanguageContext } from "@/components/LanguageProvider";

const audienceCopy = {
  es: {
    eyebrow: "NUXA · bienestar emocional",
    titleLead: "Para cualquier",
    titleAccent: "persona, empresa u organización",
    intro: "Una forma cercana y responsable de abrir conversaciones sobre bienestar emocional, a la medida de cada realidad.",
    trust: "Acompañamiento pensado para personas y equipos, con la tecnología al servicio de una conversación más humana.",
    audiences: [
      { title: "Particulares", body: "Un espacio privado para poner en palabras lo que sientes y encontrar una perspectiva nueva.", action: "Conoce la experiencia" },
      { title: "Empresas", body: "Apoyo emocional accesible para acompañar el bienestar cotidiano de las personas de tu equipo.", action: "Descubre NUXA para empresas" },
      { title: "Organizaciones públicas", body: "Acerca recursos de bienestar emocional a las comunidades y personas a las que sirves.", action: "Explora el sector público" },
    ],
    resources: "Explorar recursos gratuitos",
    resourcesNote: "Guías y herramientas para empezar",
  },
  en: {
    eyebrow: "NUXA · emotional wellbeing",
    titleLead: "For every",
    titleAccent: "person, company and organisation",
    intro: "A thoughtful way to open conversations about emotional wellbeing, shaped around the people and communities you support.",
    trust: "Support for individuals and teams, with technology in service of more human conversations.",
    audiences: [
      { title: "Individuals", body: "A private space to put feelings into words and find a fresh perspective.", action: "Explore the experience" },
      { title: "Companies", body: "Accessible emotional support to nurture the everyday wellbeing of your team.", action: "Discover NUXA for business" },
      { title: "Public organisations", body: "Bring emotional wellbeing resources closer to the communities and people you serve.", action: "Explore the public sector" },
    ],
    resources: "Browse free resources",
    resourcesNote: "Guides and tools to get started",
  },
  fr: {
    eyebrow: "NUXA · bien-être émotionnel",
    titleLead: "Pour chaque",
    titleAccent: "personne, entreprise ou organisation",
    intro: "Une manière attentive d’ouvrir le dialogue autour du bien-être émotionnel, adaptée aux personnes et aux communautés que vous accompagnez.",
    trust: "Un soutien pour les personnes et les équipes, avec une technologie au service de conversations plus humaines.",
    audiences: [
      { title: "Particuliers", body: "Un espace privé pour mettre des mots sur vos ressentis et trouver un nouveau point de vue.", action: "Découvrir l’expérience" },
      { title: "Entreprises", body: "Un soutien émotionnel accessible pour prendre soin du bien-être quotidien de vos équipes.", action: "Découvrir NUXA pour les entreprises" },
      { title: "Organisations publiques", body: "Rapprochez les ressources de bien-être émotionnel des communautés que vous accompagnez.", action: "Explorer le secteur public" },
    ],
    resources: "Voir les ressources gratuites",
    resourcesNote: "Des guides et des outils pour commencer",
  },
} as const;

const audienceIcons = [HeartHandshake, Building2, Landmark];
const audienceRoutes = ["/prueba-gratis", "/empresa-privada", "/sector-publico"];

export default function AudienceSection() {
  const { currentLanguage, t } = useLanguageContext();
  const language = currentLanguage === "en" || currentLanguage === "fr" ? currentLanguage : "es";
  const content = audienceCopy[language];

  return (
    <section
      aria-labelledby="audience-section-title"
      className="relative overflow-hidden bg-[#eaf2ee] px-4 py-14 text-[#193442] sm:px-7 sm:py-20 lg:px-10 lg:py-24"
    >
      <div aria-hidden="true" className="pointer-events-none absolute -right-36 top-12 h-[28rem] w-[28rem] rounded-full border border-[#b8d1c8]/55" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-20 top-28 h-[20rem] w-[20rem] rounded-full border border-[#b8d1c8]/45" />
      <div className="relative mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:gap-12">
        <div className="relative flex min-h-[32rem] flex-col overflow-hidden rounded-[1.75rem] bg-[#183342] p-7 text-[#f5f3e9] shadow-[0_24px_70px_-38px_rgba(22,49,63,0.6)] sm:p-10 lg:p-11">
          <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-16 h-72 w-72 rounded-full border border-[#79bcb0]/20" />
          <div aria-hidden="true" className="pointer-events-none absolute -right-5 -top-2 h-44 w-44 rounded-full border border-[#79bcb0]/15" />
          <div className="relative inline-flex w-fit items-center gap-2.5 rounded-full border border-[#a6d1c5]/25 bg-[#a6d1c5]/10 px-3.5 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#b9ddd2]">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#e5a15f]" />
            {content.eyebrow}
          </div>
          <h2 id="audience-section-title" className="relative mt-8 max-w-xl text-[clamp(2.25rem,5vw,3.8rem)] font-semibold leading-[1.04] tracking-[-0.045em]">
            {content.titleLead}{" "}
            <span className="text-[#a8d6ca]">{content.titleAccent}</span>
          </h2>
          <p className="relative mt-5 max-w-md text-base leading-7 text-[#d0dfdc] sm:text-[1.05rem]">
            {content.intro}
          </p>
          <div className="relative mt-8 flex items-start gap-3 border-t border-white/15 pt-5 text-sm leading-6 text-[#b6cbc9]">
            <ShieldCheck aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#e5a15f]" />
            <p>{content.trust}</p>
          </div>

          <div className="relative mt-auto pt-9">
            <Link
              href="/prueba-gratis"
              className="group inline-flex min-h-14 w-full items-center justify-between gap-4 rounded-xl bg-[#e59a57] px-5 py-4 text-sm font-bold text-[#193442] shadow-[0_12px_28px_-16px_rgba(229,154,87,0.8)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#f0aa68] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5f3e9] focus-visible:ring-offset-2 focus-visible:ring-offset-[#183342] motion-reduce:transition-none sm:px-6"
            >
              <span>{t("home.cta.button")}</span>
              <ArrowRight aria-hidden="true" className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none" />
            </Link>
            <p className="mt-3 text-center text-xs leading-5 text-[#c4d2cf]">{t("home.cta.subtitle")}</p>
          </div>
        </div>

        <div className="flex flex-col justify-center px-1 sm:px-3 lg:py-4">
          <div className="mb-4 flex items-center justify-between gap-4 border-b border-[#c6d9d1] pb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.17em] text-[#56736f]">
              {language === "es" ? "Encuentra tu punto de partida" : language === "fr" ? "Trouvez votre point de départ" : "Find your starting point"}
            </p>
            <span aria-hidden="true" className="hidden h-px w-12 bg-[#e59a57] sm:block" />
          </div>

          <div className="divide-y divide-[#c6d9d1]">
            {content.audiences.map((audience, index) => {
              const Icon = audienceIcons[index];
              return (
                <Link
                  key={audience.title}
                  href={audienceRoutes[index]}
                  className="group -mx-3 grid grid-cols-[2.5rem_2.75rem_minmax(0,1fr)_1.5rem] items-center gap-3 rounded-xl px-3 py-6 transition-colors duration-200 hover:bg-[#dcebe5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#237a72] sm:-mx-4 sm:grid-cols-[2.75rem_3.25rem_minmax(0,1fr)_1.5rem] sm:gap-4 sm:px-4 sm:py-7 motion-reduce:transition-none"
                >
                  <span className="font-mono text-xs tracking-wider text-[#75918b]">0{index + 1}</span>
                  <span className="grid h-11 w-11 place-items-center rounded-full border border-[#bad5cc] bg-[#f3f6ef] text-[#26796f] transition-colors duration-200 group-hover:border-[#26796f] group-hover:bg-[#26796f] group-hover:text-[#f5f3e9] sm:h-12 sm:w-12 motion-reduce:transition-none">
                    <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.7} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-lg font-semibold tracking-[-0.025em] text-[#193442] sm:text-xl">{audience.title}</span>
                    <span className="mt-1 block max-w-xl text-sm leading-6 text-[#526b6a]">{audience.body}</span>
                    <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[#26796f]">
                      {audience.action}
                      <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none" />
                    </span>
                  </span>
                  <ArrowRight aria-hidden="true" className="h-5 w-5 text-[#78938c] transition-transform duration-200 group-hover:translate-x-1 group-hover:text-[#26796f] motion-reduce:transition-none" />
                </Link>
              );
            })}
          </div>

          <Link
            href="/recursos-gratuitos"
            className="group mt-6 flex items-center justify-between gap-4 rounded-xl border border-[#b8d1c8] bg-[#f3f6ef]/75 px-5 py-4 transition-colors duration-200 hover:border-[#26796f] hover:bg-[#f7f8f1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#237a72] sm:mt-8 sm:px-6 motion-reduce:transition-none"
          >
            <span className="flex min-w-0 items-center gap-3.5">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#dcebe5] text-[#26796f]">
                <BookOpenText aria-hidden="true" className="h-5 w-5" strokeWidth={1.7} />
              </span>
              <span>
                <span className="block text-sm font-semibold text-[#193442]">{content.resources}</span>
                <span className="mt-0.5 block text-xs text-[#627975]">{content.resourcesNote}</span>
              </span>
            </span>
            <ArrowUpRight aria-hidden="true" className="h-5 w-5 shrink-0 text-[#26796f] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none" />
          </Link>
        </div>
      </div>
    </section>
  );
}
