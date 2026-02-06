import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Heart, Users, Award, Globe, Target, Lightbulb, Shield, Phone } from "lucide-react";

const teamValues = [
  {
    icon: Heart,
    title: "Empatía y Comprensión",
    description: "Cada interacción está diseñada con profunda comprensión de las necesidades emocionales humanas"
  },
  {
    icon: Shield,
    title: "Privacidad y Seguridad",
    description: "Protegemos tu información personal con los más altos estándares de seguridad y confidencialidad"
  },
  {
    icon: Lightbulb,
    title: "Innovación Constante",
    description: "Incorporamos continuamente los últimos avances en IA y psicología para mejorar nuestro servicio"
  },
  {
    icon: Globe,
    title: "Accesibilidad Global",
    description: "Trabajamos para hacer el apoyo psicológico accesible a personas de todo el mundo"
  }
];


export default function NosotrosSection() {
  const [, setLocation] = useLocation();

  return (
    <section id="nosotros" className="py-20 px-4 bg-gradient-to-br from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Sobre NUXA
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Somos pioneros en el desarrollo de asistentes de inteligencia artificial especializados 
            en salud mental, combinando la expertise psicológica con la tecnología más avanzada 
            para ofrecer apoyo emocional accesible y profesional las 24 horas del día.
          </p>
        </div>

        {/* Mission */}
        <div className="bg-gradient-to-r from-nflow-orange to-orange-600 rounded-3xl p-12 mb-16 text-center">
          <h3 className="text-3xl font-bold text-white mb-6">Nuestra Misión</h3>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Democratizar el acceso a la salud mental mediante tecnología de IA empática y personalizada, 
            proporcionando apoyo profesional inmediato a cualquier persona, en cualquier momento y lugar.
          </p>
        </div>


        {/* Values */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Nuestros Valores
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            {teamValues.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div key={index} className="flex items-start space-x-6 p-6 bg-white rounded-2xl shadow-lg">
                  <div className="bg-nflow-orange/10 rounded-xl p-4 flex-shrink-0">
                    <IconComponent className="w-8 h-8 text-nflow-orange" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h4>
                    <p className="text-gray-600">{value.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Professional Credentials */}
        <div className="bg-gray-900 rounded-3xl p-12 mb-16">
          <h3 className="text-3xl font-bold text-white text-center mb-8">
            Respaldo Profesional
          </h3>
          <div className="text-center max-w-4xl mx-auto">
            <div className="bg-nflow-orange rounded-2xl p-6 mb-8 inline-block">
              <Award className="w-16 h-16 text-white mx-auto mb-4" />
              <h4 className="text-2xl font-bold text-white mb-2">
                Llic. Ramón Molons de San Román
              </h4>
              <div className="text-white/90 text-lg space-y-1">
                <p>Colegiado Colegio de Psicólogos de Barcelona #7851</p>
                <p>Licencia Sanitaria Estatal E-17928702</p>
              </div>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed">
              Nuestro equipo está dirigido por psicólogos colegiados con años de experiencia 
              en salud mental y tecnología. Cada respuesta de nuestro asistente IA está fundamentada 
              en evidencia científica y supervisada por profesionales cualificados.
            </p>
          </div>
        </div>

        {/* Company Info */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Información Corporativa</h3>
            <div className="space-y-4 text-gray-600">
              <p><strong>Desarrollador de Software:</strong> Ramón Molons de San Román</p>
              <p><strong>DNI:</strong> 40436705Z</p>
              <p><strong>Domicilio:</strong> Portbou, Girona, España</p>
              <p><strong>Email:</strong> empordajobs@gmail.com</p>
              <p><strong>Teléfono:</strong> +34 660 45 21 36</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Tecnología y Seguridad</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-green-500" />
                <span className="text-gray-600">Cifrado end-to-end</span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-green-500" />
                <span className="text-gray-600">Cumplimiento RGPD</span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-green-500" />
                <span className="text-gray-600">Servidores seguros en UE</span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-green-500" />
                <span className="text-gray-600">Auditorías de seguridad regulares</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-6">
            ¿Tienes preguntas sobre NFLOW?
          </h3>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Estamos aquí para ayudarte. Contacta con nuestro equipo o prueba 
            nuestro asistente de IA ahora mismo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => setLocation("/login")}
              className="bg-gradient-to-r from-nflow-orange to-orange-600 hover:from-orange-600 hover:to-red-500 text-white px-8 py-4 rounded-2xl font-bold text-lg"
            >
              Comenzar Ahora
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}