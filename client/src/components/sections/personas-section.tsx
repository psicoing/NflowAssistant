import { User, Users, Briefcase, Building } from "lucide-react";

const personas = [
  {
    id: "individual",
    title: "Individual",
    description: "Para personas que buscan apoyo emocional personalizado",
    icon: User,
    bgColor: "bg-nflow-orange",
    appName: "NFLOW",
    subtitle: "Salud Mental"
  },
  {
    id: "family",
    title: "Familiar",
    description: "Herramientas para toda la familia y adolescentes",
    icon: Users,
    bgColor: "bg-nflow-orange",
    appName: "NFLOW",
    subtitle: "Salud Mental Familiar"
  },
  {
    id: "professional",
    title: "Profesional",
    description: "Para psicólogos y profesionales de la salud mental",
    icon: Briefcase,
    bgColor: "bg-yellow-500",
    appName: "JOBDA",
    subtitle: "SELECCIÓN DE PERSONAL",
    textColor: "text-black"
  },
  {
    id: "workplace",
    title: "Laboral",
    description: "Bienestar emocional en el entorno de trabajo",
    icon: Building,
    bgColor: "bg-nflow-orange",
    appName: "NFLOW",
    subtitle: "SALUD MENTAL LABORAL"
  }
];

export default function PersonasSection() {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-nflow-navy to-nflow-dark">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          NFLOW para diferentes públicos
        </h2>
        <div className="w-24 h-1 bg-nflow-orange mx-auto mb-12"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {personas.map((persona) => {
            const IconComponent = persona.icon;
            
            return (
              <div 
                key={persona.id}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-6 border border-gray-700 hover:border-nflow-orange transition-all duration-300 transform hover:scale-105"
              >
                <div className={`${persona.bgColor} rounded-2xl p-4 mb-6 mx-auto w-24 h-32 flex flex-col items-center justify-center`}>
                  <div className={`${persona.textColor || 'text-white'} font-bold text-lg mb-1`}>
                    {persona.appName}
                  </div>
                  <div className={`${persona.textColor ? 'text-black/70' : 'text-orange-100'} text-xs mb-2 text-center`}>
                    {persona.subtitle}
                  </div>
                  <div className={`w-12 h-12 ${persona.textColor ? 'bg-black/20' : 'bg-white/20'} rounded-xl flex items-center justify-center`}>
                    <IconComponent className={`w-6 h-6 ${persona.textColor || 'text-white'}`} />
                  </div>
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{persona.title}</h3>
                <p className="text-gray-400 text-sm">{persona.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
