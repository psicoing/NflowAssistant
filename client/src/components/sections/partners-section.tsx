import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Users, Star, TrendingUp, Award, Handshake, ArrowRight, Building, Heart, Globe } from "lucide-react";

const partnerBenefits = [
  {
    icon: TrendingUp,
    title: "Ingresos Recurrentes",
    description: "Gana hasta 40% de comisión por cada usuario referido que se suscriba"
  },
  {
    icon: Award,
    title: "Certificación Oficial",
    description: "Acceso a formación especializada y certificación como Partner NFLOW"
  },
  {
    icon: Heart,
    title: "Impacto Social",
    description: "Contribuye al bienestar mental de miles de personas en todo el mundo"
  },
  {
    icon: Globe,
    title: "Alcance Global",
    description: "Plataforma disponible en múltiples idiomas y países"
  }
];

const partnerTypes = [
  {
    type: "Profesional Individual",
    icon: Users,
    color: "bg-blue-500",
    description: "Psicólogos, terapeutas y profesionales de la salud mental",
    commission: "30%"
  },
  {
    type: "Instituciones",
    icon: Building,
    color: "bg-green-500", 
    description: "Clínicas, hospitales y centros de salud mental",
    commission: "35%"
  },
  {
    type: "Partners Premium",
    icon: Star,
    color: "bg-purple-500",
    description: "Organizaciones con alto volumen de referidos",
    commission: "40%"
  }
];

export default function PartnersSection() {
  const [, setLocation] = useLocation();

  return (
    <section id="partners" className="py-20 px-4 bg-gradient-to-br from-nflow-dark to-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Handshake className="w-12 h-12 text-nflow-orange" />
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Programa de Partners
            </h2>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Únete a nuestra red global de profesionales de la salud mental y 
            genera ingresos mientras ayudas a mejorar el bienestar de las personas.
          </p>
        </div>

        {/* Partner Types */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {partnerTypes.map((partner, index) => {
            const IconComponent = partner.icon;
            return (
              <div key={index} className="bg-white rounded-2xl p-8 text-center transform hover:scale-105 transition-all duration-300 shadow-xl">
                <div className={`${partner.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{partner.type}</h3>
                <p className="text-gray-600 mb-4">{partner.description}</p>
                <div className="bg-nflow-orange/10 rounded-lg p-3 mb-4">
                  <span className="text-2xl font-bold text-nflow-orange">{partner.commission}</span>
                  <span className="text-sm text-gray-600 ml-1">comisión</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Benefits */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 mb-12">
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            Beneficios de ser Partner
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {partnerBenefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div key={index} className="text-center">
                  <IconComponent className="w-12 h-12 text-nflow-orange mx-auto mb-4" />
                  <h4 className="text-lg font-bold text-white mb-2">{benefit.title}</h4>
                  <p className="text-gray-300 text-sm">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-nflow-orange/20 to-orange-600/20 rounded-2xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              ¿Listo para comenzar?
            </h3>
            <p className="text-gray-300 mb-6">
              Completa el proceso de aplicación y comienza a generar ingresos en menos de 48 horas
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => setLocation("/partners/register")}
                className="bg-gradient-to-r from-nflow-orange to-orange-600 hover:from-orange-600 hover:to-red-500 text-white px-8 py-4 rounded-2xl font-bold text-lg"
              >
                Aplicar Ahora
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                onClick={() => setLocation("/partners")}
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-2xl font-bold text-lg"
              >
                Más Información
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}