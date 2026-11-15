import { useState, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Import all NFLOW images
import nflowApp from "@assets/generated_images/NFLOW_mental_health_app_05faf5ea.png";
import nflowCommunity from "@assets/generated_images/NFLOW_community_connection_illustration_b01e7ec4.png";
import nflowWorkplace from "@assets/generated_images/NFLOW_workplace_wellness_illustration_09ae4d69.png";
import nflowFamily from "@assets/generated_images/NFLOW_family_support_illustration_961f474d.png";
import nflowNighttime from "@assets/generated_images/NFLOW_24/7_nighttime_support_f61f9e54.png";
import nflowPrivacy from "@assets/generated_images/NFLOW_privacy_and_security_c17cc747.png";
import nflowYouth from "@assets/generated_images/NFLOW_youth_and_teens_c6069c47.png";
import nflowMindfulness from "@assets/generated_images/NFLOW_mindfulness_and_meditation_cb6b64a5.png";

const carouselData = [
  {
    id: 1,
    image: nflowApp,
    title: "Tecnología Inteligente",
    description: "Asistente de IA entrenado por profesionales para brindarte el mejor apoyo emocional"
  },
  {
    id: 2,
    image: nflowCommunity,
    title: "Comunidad de Apoyo",
    description: "Conecta con una comunidad diversa que encuentra bienestar a través de NUXA"
  },
  {
    id: 3,
    image: nflowWorkplace,
    title: "Bienestar Laboral",
    description: "Herramientas profesionales para el manejo del estrés y la productividad en el trabajo"
  },
  {
    id: 4,
    image: nflowFamily,
    title: "Apoyo Familiar",
    description: "Fortalece los vínculos familiares con apoyo especializado para adolescentes y padres"
  },
  {
    id: 5,
    image: nflowNighttime,
    title: "Disponible 24/7",
    description: "Apoyo emocional siempre disponible, incluso en las noches más difíciles"
  },
  {
    id: 6,
    image: nflowPrivacy,
    title: "Privacidad Total",
    description: "Conversaciones completamente privadas y seguras con la máxima confidencialidad"
  },
  {
    id: 7,
    image: nflowYouth,
    title: "Enfoque Juvenil",
    description: "Especializado en adolescentes y jóvenes adultos con contenido adaptado a su edad"
  },
  {
    id: 8,
    image: nflowMindfulness,
    title: "Mindfulness y Meditación",
    description: "Técnicas de relajación, mindfulness y meditación guiada para tu bienestar"
  }
];

export default function NFlowCarouselSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: 'center',
    loop: true,
    skipSnaps: false,
    inViewThreshold: 0.7
  });
  
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on('select', onSelect);
    onSelect();

    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  return (
    <section className="bg-[#f3f6ef] px-4 py-14 dark:bg-[#102f33] sm:py-16">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-semibold leading-tight tracking-[-0.04em] text-[#173e3d] dark:text-[#f2f4e8] sm:text-4xl">
            Descubre <span className="text-[#557d65] dark:text-[#c9dd83]">NUXA</span> en Acción
          </h2>
          <p className="mx-auto max-w-3xl text-base leading-7 text-[#526b68] dark:text-[#c3d8d1] sm:text-lg">
            Explora cómo NUXA transforma vidas en diferentes contextos: 
            tecnología, comunidad, trabajo y familia
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {carouselData.map((item) => (
                <div key={item.id} className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] px-4">
                  <div className="h-full overflow-hidden rounded-[1.5rem] border border-[#d6e3dc] bg-[#f8f9f4] shadow-[0_20px_50px_-42px_rgba(19,61,59,0.55)] transition-colors hover:bg-white dark:border-[#315d5b] dark:bg-[#173e3d] dark:hover:bg-[#20494a]">
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-5 sm:p-6">
                      <h3 className="mb-3 text-lg font-semibold text-[#234844] dark:text-[#f2f4e8] sm:text-xl">
                        {item.title}
                      </h3>
                      <p className="text-sm leading-6 text-[#647b75] dark:text-[#c3d8d1] sm:text-base">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button 
            onClick={scrollPrev}
            className="absolute left-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#cbded6] bg-[#f3f6ef]/95 text-[#42695f] shadow-sm transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#557d65] dark:border-[#456c68] dark:bg-[#173e3d]/95 dark:text-[#d6e69a] dark:hover:bg-[#20494a] motion-reduce:transition-none"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <button 
            onClick={scrollNext}
            className="absolute right-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#cbded6] bg-[#f3f6ef]/95 text-[#42695f] shadow-sm transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#557d65] dark:border-[#456c68] dark:bg-[#173e3d]/95 dark:text-[#d6e69a] dark:hover:bg-[#20494a] motion-reduce:transition-none"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="mt-8 flex justify-center space-x-2">
          {carouselData.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi && emblaApi.scrollTo(index)}
              className={`h-2.5 rounded-full transition-[width,background-color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#557d65] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#102f33] motion-reduce:transition-none ${
                index === selectedIndex 
                  ? 'w-7 bg-[#557d65] dark:bg-[#c9dd83]'
                  : 'w-2.5 bg-[#cbded6] hover:bg-[#9db5a8] dark:bg-[#456c68] dark:hover:bg-[#6d9d8c]'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}