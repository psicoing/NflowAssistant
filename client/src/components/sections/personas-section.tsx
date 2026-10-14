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
    <section className="py-20 px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          NUXA, tu asistente de bienestar emocional
        </h2>
        <div className="w-24 h-1 bg-nflow-blue mx-auto mb-6"></div>
        <p className="text-xl text-gray-300 mb-16 max-w-4xl mx-auto">
          Nuestras soluciones están diseñadas para atender las necesidades específicas de diferentes 
          grupos, ofreciendo herramientas y recursos adaptados a cada situación.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {personas.map((persona) => {
            return (
              <div 
                key={persona.id}
                className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
              >
                {/* Illustrated NUXA package */}
                <div className="relative mb-6">
                  <img
                    src={persona.image}
                    alt={`NUXA: ${persona.title}. ${persona.subtitle}`}
                    className="w-full h-auto rounded-xl shadow-2xl"
                    loading="lazy"
                  />
                </div>

                {/* Description */}
                <div className="text-center">
                  <h3 className="text-white font-bold text-xl mb-3">{persona.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{persona.description}</p>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Call to Action Button */}
        <div className="text-center mt-16">
          <Button 
            onClick={() => setLocation("/login")}
            className="bg-gradient-to-r from-nflow-orange to-orange-600 hover:from-orange-600 hover:to-red-500 text-white px-10 py-5 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-110 shadow-2xl animate-pulse hover:animate-none"
          >
            <Star className="w-6 h-6 mr-3" />
            ¡Comenzar Ahora!
          </Button>
        </div>
      </div>
    </section>
  );
}
