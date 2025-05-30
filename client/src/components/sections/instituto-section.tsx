import { Shield, Lightbulb, GraduationCap } from "lucide-react";

const instituteValues = [
  {
    id: "commitment",
    title: "Compromiso",
    description: "Dedicados a proporcionar herramientas efectivas para el bienestar emocional",
    icon: Shield
  },
  {
    id: "innovation",
    title: "Innovación",
    description: "Combinamos psicología clínica con tecnología avanzada de inteligencia artificial",
    icon: Lightbulb
  },
  {
    id: "experience",
    title: "Experiencia",
    description: "Más de 30 años de experiencia en psicología clínica y educativa",
    icon: GraduationCap
  }
];

export default function InstitutoSection() {
  return (
    <section id="instituto" className="py-20 px-4 bg-gradient-to-br from-nflow-dark to-nflow-navy">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Instituto NeuronMeg</h2>
        <p className="text-xl text-gray-300 mb-12 max-w-4xl mx-auto">
          Un equipo de profesionales dedicados a mejorar el bienestar emocional 
          a través de soluciones digitales innovadoras
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {instituteValues.map((value) => {
            const IconComponent = value.icon;
            
            return (
              <div 
                key={value.id}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 border border-gray-700 hover:border-nflow-blue transition-all duration-300 transform hover:scale-105"
              >
                <div className="w-16 h-16 bg-nflow-blue rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{value.title}</h3>
                <p className="text-gray-400 leading-relaxed">{value.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
