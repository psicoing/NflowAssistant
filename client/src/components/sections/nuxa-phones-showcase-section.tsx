import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, MessageCircle, Heart, Users, Brain, Moon, Sparkles } from "lucide-react";
import nuxaLogo from "@assets/generated_images/NUXA_logo_with_circle_person_ba9dba6f.png";
import anxietyPhone from "@assets/generated_images/NUXA_anxiety_chat_phone_7a0de59f.png";
import stressPhone from "@assets/generated_images/NUXA_stress_work_chat_985efac9.png";
import familyPhone from "@assets/generated_images/NUXA_family_chat_phone_ff3139ae.png";
import confidencePhone from "@assets/generated_images/NUXA_confidence_chat_phone_ae3ef83e.png";
import depressionPhone from "@assets/generated_images/NUXA_depression_chat_phone_58c21ab7.png";
import sleepPhone from "@assets/generated_images/NUXA_sleep_chat_phone_3b95b397.png";

const phones = [
  {
    image: anxietyPhone,
    title: "Ansiedad",
    description: "Apoyo inmediato para momentos de ansiedad",
    icon: MessageCircle,
    color: "from-emerald-500 to-teal-500"
  },
  {
    image: stressPhone,
    title: "Estrés Laboral",
    description: "Gestión del estrés en el trabajo",
    icon: Brain,
    color: "from-cyan-500 to-blue-500"
  },
  {
    image: familyPhone,
    title: "Relaciones Familiares",
    description: "Orientación para mejorar vínculos familiares",
    icon: Users,
    color: "from-teal-500 to-emerald-500"
  },
  {
    image: confidencePhone,
    title: "Autoestima",
    description: "Fortalece tu confianza y autoestima",
    icon: Sparkles,
    color: "from-purple-500 to-teal-500"
  },
  {
    image: depressionPhone,
    title: "Bienestar Emocional",
    description: "Apoyo compasivo en momentos difíciles",
    icon: Heart,
    color: "from-emerald-500 to-cyan-500"
  },
  {
    image: sleepPhone,
    title: "Sueño y Relajación",
    description: "Técnicas para dormir mejor",
    icon: Moon,
    color: "from-blue-500 to-teal-500"
  }
];

export default function NuxaPhonesShowcaseSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % phones.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setActiveIndex((current) => (current - 1 + phones.length) % phones.length);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setActiveIndex((current) => (current + 1) % phones.length);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setActiveIndex(index);
  };

  const activePhone = phones[activeIndex];
  const IconComponent = activePhone.icon;

  return (
    <section className="relative bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/20 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-20 md:py-28 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Floating NUXA Logo */}
      <div className="absolute top-10 right-10 opacity-10 dark:opacity-5">
        <img src={nuxaLogo} alt="NUXA" className="w-32 h-32 animate-pulse" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-full border-2 border-emerald-200 dark:border-emerald-800 mb-6">
            <MessageCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-bold text-emerald-800 dark:text-emerald-300">NUXA en Acción</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-6">
            Conversaciones que ayudan
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto font-medium">
            Descubre cómo NUXA ofrece apoyo personalizado en diferentes situaciones de salud mental
          </p>
        </div>

        {/* Main Carousel */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Phone Display */}
          <div className="relative flex justify-center">
            {/* Glow Effect */}
            <div className={`absolute inset-0 bg-gradient-to-r ${activePhone.color} rounded-full blur-3xl opacity-20 animate-pulse`}></div>
            
            {/* Phone Image */}
            <div className="relative transform transition-all duration-500 hover:scale-105">
              <img 
                src={activePhone.image} 
                alt={`NUXA - ${activePhone.title}`}
                className="w-full max-w-[300px] md:max-w-[350px] h-auto object-contain drop-shadow-2xl"
              />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className={`inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r ${activePhone.color} rounded-full`}>
                <IconComponent className="w-5 h-5 text-white" />
                <span className="text-white font-bold">{activePhone.title}</span>
              </div>
              
              <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
                {activePhone.description}
              </h3>
              
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                NUXA te acompaña con respuestas empáticas y profesionales, adaptadas a tu situación única. 
                Disponible 24/7 en más de 150 idiomas.
              </p>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center gap-4">
              <button
                onClick={goToPrevious}
                className="p-3 bg-white dark:bg-slate-800 rounded-full border-2 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors shadow-lg"
                aria-label="Anterior"
              >
                <ChevronLeft className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </button>

              {/* Dots */}
              <div className="flex gap-2 flex-1 justify-center">
                {phones.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`transition-all duration-300 rounded-full ${
                      index === activeIndex 
                        ? 'w-12 h-3 bg-gradient-to-r ' + activePhone.color
                        : 'w-3 h-3 bg-gray-300 dark:bg-gray-600 hover:bg-emerald-400 dark:hover:bg-emerald-600'
                    }`}
                    aria-label={`Ir a ${phones[index].title}`}
                  />
                ))}
              </div>

              <button
                onClick={goToNext}
                className="p-3 bg-white dark:bg-slate-800 rounded-full border-2 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors shadow-lg"
                aria-label="Siguiente"
              >
                <ChevronRight className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </button>
            </div>

            {/* All Topics Grid */}
            <div className="grid grid-cols-3 gap-3 mt-8">
              {phones.map((phone, index) => {
                const PhoneIcon = phone.icon;
                return (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                      index === activeIndex
                        ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 shadow-lg scale-105'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700'
                    }`}
                  >
                    <PhoneIcon className={`w-6 h-6 mx-auto ${
                      index === activeIndex 
                        ? 'text-emerald-600 dark:text-emerald-400' 
                        : 'text-gray-400 dark:text-gray-500'
                    }`} />
                    <p className={`text-xs mt-2 font-semibold ${
                      index === activeIndex
                        ? 'text-emerald-700 dark:text-emerald-300'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {phone.title}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-2xl text-white font-bold text-lg shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
            <MessageCircle className="w-5 h-5" />
            <span>Comienza tu conversación ahora</span>
          </div>
        </div>
      </div>
    </section>
  );
}
