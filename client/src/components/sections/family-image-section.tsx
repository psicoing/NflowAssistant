import familyImage from "@assets/nuxa-familia-apoyo.webp";

export default function FamilyImageSection() {
  return (
    <section className="bg-[#f3f6ef] py-12 dark:bg-[#102f33] sm:py-16">
      <div className="w-full">
        {/* Content Above Image */}
        <div className="mx-auto mb-8 max-w-4xl px-4 text-center">
          <h2 className="mb-6 text-3xl font-semibold leading-tight tracking-[-0.04em] text-[#173e3d] dark:text-[#f2f4e8] sm:text-4xl">
            Apoyo emocional para toda la familia
          </h2>
          
          <p className="mb-6 text-base leading-7 text-[#526b68] dark:text-[#c3d8d1] sm:text-lg">
            Cada persona merece apoyo emocional profesional. NUXA conecta familias, 
            adolescentes, trabajadores y adultos con herramientas de bienestar mental 
            respaldadas por la ciencia y la experiencia clínica.
          </p>
        </div>
        
        {/* Full Width Image */}
        <div className="w-full">
          <img 
            src={familyImage} 
            alt="Familia usando NUXA para apoyo emocional" 
            className="h-auto w-full border-y border-[#d6e3dc] object-cover dark:border-[#315d5b]"
          />
        </div>
        
        {/* Features Below Image */}
        <div className="mx-auto mt-8 max-w-4xl px-4">
          <div className="grid gap-x-8 md:grid-cols-2">
            <div className="flex items-center space-x-3 border-b border-[#d6e3dc] py-4 dark:border-[#315d5b]">
              <div className="h-1.5 w-1.5 rounded-full bg-[#77977e]"></div>
              <span className="text-base font-medium text-[#34534f] dark:text-[#e2e9df] sm:text-lg">Para Toda la Familia</span>
            </div>
            <div className="flex items-center space-x-3 border-b border-[#d6e3dc] py-4 dark:border-[#315d5b]">
              <div className="h-1.5 w-1.5 rounded-full bg-[#77977e]"></div>
              <span className="text-base font-medium text-[#34534f] dark:text-[#e2e9df] sm:text-lg">Apoyo integral desde los 12 años</span>
            </div>
            <div className="flex items-center space-x-3 border-b border-[#d6e3dc] py-4 dark:border-[#315d5b]">
              <div className="h-1.5 w-1.5 rounded-full bg-[#77977e]"></div>
              <span className="text-base font-medium text-[#34534f] dark:text-[#e2e9df] sm:text-lg">100% Confidencial</span>
            </div>
            <div className="flex items-center space-x-3 border-b border-[#d6e3dc] py-4 dark:border-[#315d5b]">
              <div className="h-1.5 w-1.5 rounded-full bg-[#77977e]"></div>
              <span className="text-base font-medium text-[#34534f] dark:text-[#e2e9df] sm:text-lg">Privacidad y anonimato garantizados</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}