import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, TrendingUp, Heart, Star, ArrowLeft, Sparkles } from "lucide-react";
import { Link } from "wouter";

export default function PartnersComerciales() {
  const partners = [
    {
      name: "Ramón Molons San Román",
      dni: "40436705Z", 
      role: "Socio Fundador & Director Técnico",
      description: "Especialista en ISO 45003 y fundador de NFLOW, Ramón combina su experiencia técnica con una visión comercial estratégica. Su dedicación y compromiso con la excelencia han sido fundamentales para posicionar NFLOW como referente en salud mental digital.",
      specialties: ["ISO 45003", "Dirección Técnica", "Innovación Digital", "Estrategia Empresarial"], 
      icon: Star,
      gradient: "from-purple-500 to-indigo-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header with Back Button */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" data-testid="link-back-home">
            <Button variant="ghost" className="mb-0" data-testid="button-back-home">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Inicio
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-blue-600 mr-3" />
            <Badge variant="outline" className="text-sm font-medium px-4 py-2">
              Equipo Comercial
            </Badge>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Nuestros Partners Comerciales
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Conoce al equipo de profesionales que impulsa el crecimiento de NFLOW, 
            comprometidos con llevar la innovación en salud mental a cada rincón del mundo.
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {partners.map((partner, index) => {
            const IconComponent = partner.icon;
            return (
              <Card 
                key={index} 
                className="group hover:shadow-2xl transition-all duration-300 border-0 overflow-hidden"
                data-testid={`card-partner-${index}`}
              >
                <CardContent className="p-0">
                  {/* Header with gradient */}
                  <div className={`bg-gradient-to-r ${partner.gradient} p-8 text-white relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                      <IconComponent className="w-full h-full" />
                    </div>
                    <div className="relative z-10">
                      <IconComponent className="w-12 h-12 mb-4 opacity-90" />
                      <h2 className="text-2xl font-bold mb-2" data-testid={`text-partner-name-${index}`}>
                        {partner.name}
                      </h2>
                      <p className="text-sm opacity-75 mb-1">DNI: {partner.dni}</p>
                      <p className="text-lg opacity-90">{partner.role}</p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                      {partner.description}
                    </p>

                    {/* Specialties */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Especialidades
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {partner.specialties.map((specialty, idx) => (
                          <Badge 
                            key={idx} 
                            variant="secondary" 
                            className="bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300"
                          >
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* CTA Card - Become a Partner */}
          <Card 
            className="group hover:shadow-2xl transition-all duration-300 border-2 border-dashed border-gray-300 dark:border-gray-600 overflow-hidden hover:border-emerald-400 dark:hover:border-emerald-500"
            data-testid="card-become-partner"
          >
            <CardContent className="p-0 h-full">
              {/* Header with gradient */}
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                  <Sparkles className="w-full h-full" />
                </div>
                <div className="relative z-10">
                  <Sparkles className="w-12 h-12 mb-4 opacity-90" />
                  <h2 className="text-2xl font-bold mb-2">
                    ¡Tú Podrías Estar Aquí!
                  </h2>
                  <p className="text-lg opacity-90">Próximo Partner Comercial</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 flex flex-col justify-between flex-1">
                <div>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    Únete a nuestro equipo de partners comerciales y forma parte de la revolución en salud mental digital. 
                    Buscamos profesionales apasionados por el bienestar emocional y con visión para expandir NUXA globalmente.
                  </p>

                  {/* Benefits */}
                  <div className="space-y-3 mb-6">
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      ¿Qué Ofrecemos?
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge 
                        variant="secondary" 
                        className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300"
                      >
                        Comisiones Atractivas
                      </Badge>
                      <Badge 
                        variant="secondary" 
                        className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300"
                      >
                        Crecimiento Profesional
                      </Badge>
                      <Badge 
                        variant="secondary" 
                        className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300"
                      >
                        Impacto Social
                      </Badge>
                      <Badge 
                        variant="secondary" 
                        className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300"
                      >
                        Flexibilidad
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <Link href="/partners" data-testid="link-apply-partner">
                  <Button 
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-6 text-lg"
                    data-testid="button-apply-partner"
                  >
                    Aplicar Ahora
                    <Sparkles className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border">
            <Heart className="w-6 h-6 text-red-500 mr-3" />
            <p className="text-gray-700 dark:text-gray-300 font-medium">
              Trabajando juntos para transformar la salud mental digital
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
