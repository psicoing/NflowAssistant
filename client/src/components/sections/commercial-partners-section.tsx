import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function CommercialPartnersSection() {
  return (
    <section id="partners-comerciales" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-blue-600 mr-3" />
            <Badge variant="outline" className="text-sm font-medium px-4 py-2">
              Equipo Comercial
            </Badge>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Nuestros Partners Comerciales
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Conoce al equipo de profesionales que impulsa el crecimiento de NUXA, 
            comprometidos con llevar la innovación en salud mental a cada rincón del mundo.
          </p>
        </div>

        {/* CTA Card */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-12 text-center transform hover:scale-105 transition-all duration-300">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-10 h-10 text-white" />
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Descubre Nuestro Equipo de Partners
            </h3>
            
            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-xl mx-auto">
              Profesionales experimentados en marketing, desarrollo comercial y estrategia empresarial, 
              dedicados a expandir NUXA globalmente.
            </p>
            
            <Link href="/partners-comerciales" data-testid="link-partners-comerciales">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-6 text-lg"
                data-testid="button-view-partners"
              >
                Ver Nuestros Partners
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
