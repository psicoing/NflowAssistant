import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Star } from "lucide-react";
import adolescentesImage from "@assets/nuxa-personas-adolescentes.webp";
import padresImage from "@assets/nuxa-personas-padres.webp";
import empresasImage from "@assets/nuxa-personas-empresas.webp";
import laboralImage from "@assets/nuxa-personas-laboral.webp";

const personas = [
  {
    id: "adolescentes",
    title: "Adolescentes", 
    description: "Apoyo para gestionar emociones, estrés escolar y relaciones sociales",
    bgColor: "bg-gradient-to-br from-orange-500 to-orange-600",
    appName: "NUXA",
    subtitle: "Salud Mental",
    image: adolescentesImage
  },
  {
    id: "padres",
    title: "Padres y Madres",
    description: "Orientación para comprender y apoyar el desarrollo emocional de tus hijos",
    bgColor: "bg-gradient-to-br from-orange-500 to-orange-600", 
    appName: "NUXA",
    subtitle: "Salud Mental Familiar",
    image: padresImage
  },
  {
    id: "empresas",
    title: "Empresas",
    description: "Servicio de desarrollo personalizado de apps con IA para la transformación digital de tu empresa",
    bgColor: "bg-gradient-to-br from-yellow-500 to-yellow-600",
    appName: "JOBDA",
    subtitle: "SELECCIÓN DE PERSONAL",
    image: empresasImage
  },
  {
    id: "laboral",
    title: "Salud Laboral", 
    description: "Soporte para el manejo del estrés, ansiedad y desafíos en el entorno profesional",
    bgColor: "bg-gradient-to-br from-orange-500 to-orange-600",
    appName: "NUXA", 
    subtitle: "SALUD MENTAL LABORAL",
    image: laboralImage
  }
];

export default function PersonasSection() {
  const [, setLocation] = useLocation();
  
  return (
    <section className="bg-[#123f43] px-4 py-14 text-[#f2f4e8] sm:py-20">
      <div className="mx-auto max-w-7xl text-center">
        <h2 className="mb-4 text-3xl font-semibold leading-tight tracking-[-0.04em] text-[#f2f4e8] sm:text-5xl">
          NUXA, tu asistente de bienestar emocional
        </h2>
        <div className="mx-auto mb-6 h-px w-20 bg-[#6d9d8c]"></div>
        <p className="mx-auto mb-12 max-w-4xl text-base leading-7 text-[#c3d8d1] sm:mb-14 sm:text-lg">
          Nuestras soluciones están diseñadas para atender las necesidades específicas de diferentes 
          grupos, ofreciendo herramientas y recursos adaptados a cada situación.
        </p>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {personas.map((persona) => {
            return (
              <div 
                key={persona.id}
                className="group cursor-pointer"
              >
                {/* Illustrated NUXA package */}
                <div className="relative mb-5 overflow-hidden rounded-[1.25rem] border border-[#6d9d8c]/35 bg-[#20494a]">
                  <img
                    src={persona.image}
                    alt={`NUXA: ${persona.title}. ${persona.subtitle}`}
                    className="h-auto w-full transition-transform duration-300 group-hover:scale-[1.015] motion-reduce:transform-none motion-reduce:transition-none"
                    loading="lazy"
                  />
                </div>

                {/* Description */}
                <div className="text-left">
                  <h3 className="mb-2 text-lg font-semibold text-[#f2f4e8] sm:text-xl">{persona.title}</h3>
                  <p className="text-sm leading-6 text-[#b7d7c4]">{persona.description}</p>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Call to Action Button */}
        <div className="mt-12 text-center sm:mt-16">
          <Button 
            onClick={() => setLocation("/login")}
            className="rounded-full border border-[#d6e69a] bg-[#d6e69a] px-7 py-4 text-base font-semibold text-[#173e3d] transition-colors hover:bg-[#e3edb8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#eff5c7] focus-visible:ring-offset-2 focus-visible:ring-offset-[#123f43] motion-reduce:transition-none sm:px-9 sm:text-lg"
          >
            <Star className="mr-2 h-5 w-5" />
            ¡Comenzar Ahora!
          </Button>
        </div>
      </div>
    </section>
  );
}
