import { Button } from "@/components/ui/button";
import { MessageCircle, Brain, User, Heart } from "lucide-react";
import { useLocation } from "wouter";
import { useLanguageContext } from "@/components/LanguageProvider";
import nuxaPackageImage from "@assets/nuxa-individual.webp";
import nuxaFamilyImage from "@assets/nuxa-familiar.webp";

export default function HeroSection() {
  const [, setLocation] = useLocation();
  const { t } = useLanguageContext();

  const handleStartRegistration = () => {
    setLocation("/prueba-gratis");
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="inicio" className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-[#123f43] px-4 pt-16 text-[#f2f4e8]">
      <div aria-hidden="true" className="pointer-events-none absolute -right-20 top-10 h-80 w-80 rounded-full border border-[#6d9d8c]/25" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-3 top-28 h-52 w-52 rounded-full border border-[#6d9d8c]/20" />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        {/* Multilingual Badge */}
        <div className="mb-6">
          <div className="inline-block rounded-full border border-[#6d9d8c]/50 bg-white/[0.06] px-5 py-2">
            <p className="text-sm font-medium tracking-wide text-[#c3d8d1] md:text-base">
              Speaking 150+ languages • 支持150多种语言
            </p>
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="mb-6 text-3xl font-semibold leading-tight tracking-[-0.04em] text-[#f2f4e8] sm:text-4xl">
          <span>
            {t('hero.pocket.title')}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mb-8 max-w-3xl text-base leading-7 text-[#c3d8d1] sm:text-xl sm:leading-relaxed">
          {t('hero.pocket.subtitle')}
        </p>

        {/* CTA Button */}
        <div className="flex justify-center items-center mb-12">
          <Button 
            onClick={handleStartRegistration}
            className="rounded-full border border-[#d6e69a] bg-[#d6e69a] px-7 py-4 text-base font-semibold text-[#173e3d] transition-colors hover:bg-[#e3edb8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#eff5c7] focus-visible:ring-offset-2 focus-visible:ring-offset-[#123f43] motion-reduce:transition-none sm:px-9 sm:py-4 sm:text-lg"
          >
            <MessageCircle className="w-6 h-6 mr-3" />
            {t('hero.cta.try')}
          </Button>
        </div>

        {/* NFLOW Package Images */}
        <div className="relative max-w-2xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Individual Package */}
            <div className="relative group">
              <div className="transition-transform duration-300 motion-reduce:transition-none nflow-package-card">
                <img
                  alt="NUXA Salud Mental Individual"
                  src={nuxaPackageImage}
                  className="mx-auto h-auto w-4/5 select-none rounded-[1.5rem] border border-white/15 shadow-[0_24px_60px_-38px_rgba(0,0,0,0.55)]"
                />
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -right-2 -top-2 rounded-full border border-[#6d9d8c]/40 bg-[#20494a] p-2 text-[#d6e69a]">
                <User className="h-5 w-5" />
              </div>
              
            </div>

            {/* Family Package */}
            <div className="relative group">
              <div className="transition-transform duration-300 motion-reduce:transition-none nflow-package-card">
                <img
                  alt="NUXA Salud Mental Familiar"
                  src={nuxaFamilyImage}
                  className="mx-auto h-auto w-4/5 select-none rounded-[1.5rem] border border-white/15 shadow-[0_24px_60px_-38px_rgba(0,0,0,0.55)]"
                />
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -right-2 -top-2 rounded-full border border-[#6d9d8c]/40 bg-[#20494a] p-2 text-[#d6e69a]">
                <Heart className="h-5 w-5" />
              </div>
              
            </div>
          </div>
          
          {/* Central Brain Icon */}
          <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#6d9d8c]/40 bg-[#174f50] p-3 text-[#d6e69a] md:block">
            <Brain className="h-7 w-7" />
          </div>
        </div>
      </div>
    </section>
  );
}
