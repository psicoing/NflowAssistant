import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Heart, Briefcase, Building2, ArrowRight, Sparkles, Gift, User, UserCheck, Monitor, Headphones } from "lucide-react";
import { useLocation } from "wouter";

export default function PackagesSection() {
  const [, setLocation] = useLocation();
  const packageCategories = [];

  return (
    <section className="py-32 bg-gradient-to-b from-gray-900 via-nflow-dark to-gray-800 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-gradient-to-r from-nflow-orange/5 to-nflow-blue/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-gradient-to-l from-green-500/5 to-yellow-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-24">
          <Badge variant="outline" className="mb-6 border-nflow-orange/30 text-nflow-orange bg-nflow-orange/5 px-4 py-2">
            <Gift className="w-4 h-4 mr-2" />
            Soluciones Especializadas
          </Badge>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">
            NUXA,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-nflow-orange via-nflow-orange-light to-nflow-blue">
              un psicólogo en tu bolsillo
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Nuestras soluciones están diseñadas para atender las necesidades específicas de diferentes 
            grupos, ofreciendo herramientas y recursos adaptados a cada situación.
          </p>
        </div>

        {/* Coming Soon Message */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-nflow-orange/20 to-orange-600/20 rounded-full border border-nflow-orange/30">
            <Sparkles className="w-5 h-5 text-nflow-orange mr-2" />
            <span className="text-gray-300 font-medium">Próximamente disponibles</span>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="bg-gradient-to-br from-gray-800/60 via-gray-800/40 to-gray-900/60 border border-gray-700/30 backdrop-blur-xl overflow-hidden max-w-4xl mx-auto">
            <CardContent className="p-12">
              <Badge variant="outline" className="mb-6 border-nflow-orange/30 text-nflow-orange bg-nflow-orange/5 px-4 py-2">
                <Sparkles className="w-4 h-4 mr-2" />
                Disponible Ahora
              </Badge>
              
              <h3 className="text-4xl font-bold text-white mb-6">
                Encuentra la solución perfecta para ti
              </h3>
              
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Cada paquete NUXA está diseñado con herramientas específicas y recursos 
                adaptados para diferentes grupos de edad y necesidades particulares.
              </p>
              
              <Button 
                size="lg" 
                onClick={() => setLocation("/login")}
                className="bg-gradient-to-r from-nflow-orange to-nflow-orange-light hover:from-nflow-orange-light hover:to-nflow-orange text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                Comenzar ahora
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}