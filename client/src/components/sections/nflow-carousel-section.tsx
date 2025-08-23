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
    description: "Conecta con una comunidad diversa que encuentra bienestar a través de NFLOW"
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
    <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Descubre <span className="text-orange-600">NFLOW</span> en Acción
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explora cómo NFLOW transforma vidas en diferentes contextos: 
            tecnología, comunidad, trabajo y familia
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {carouselData.map((item) => (
                <div key={item.id} className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] px-4">
                  <div className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
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
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white shadow-lg rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 z-10"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          
          <button 
            onClick={scrollNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white shadow-lg rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 z-10"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-8 space-x-2">
          {carouselData.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi && emblaApi.scrollTo(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === selectedIndex 
                  ? 'bg-orange-500 scale-125' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}