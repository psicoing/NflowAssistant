import { Card, CardContent } from "@/components/ui/card";
import { Users, Gift, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function ReferralInfoSection() {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              ¿Te recomendó alguien NFLOW?
            </h2>
            <p className="text-xl text-blue-200 max-w-2xl mx-auto">
              Si un asesor, comercial o conocido te habló de NFLOW, pueden haberte dado un código especial
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Tarjeta Principal */}
            <Card className="bg-white/10 backdrop-blur border-white/20 hover:bg-white/15 transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="bg-green-500 p-3 rounded-full">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Código de tu Asesor/Comercial
                    </h3>
                    <p className="text-blue-200">
                      Tu representante puede haberte proporcionado un código especial para bonificaciones
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3 text-sm text-blue-200">
                  <div className="flex items-center space-x-2">
                    <Gift className="h-4 w-4 text-green-400" />
                    <span>Apoyas a quien te recomendó NFLOW</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Gift className="h-4 w-4 text-green-400" />
                    <span>Proceso 100% opcional y transparente</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Gift className="h-4 w-4 text-green-400" />
                    <span>Misma experiencia con o sin código</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tarjeta de Acción */}
            <Card className="bg-gradient-to-br from-purple-600 to-blue-600 border-purple-400">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="bg-white/20 p-4 rounded-full inline-block mb-4">
                    <ArrowRight className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    ¿Tienes un código?
                  </h3>
                  <p className="text-blue-100 mb-6">
                    Úsalo al activar tu cuenta. Si no tienes, puedes registrarte igual.
                  </p>
                  <Link href="/activar-cuenta">
                    <Button 
                      className="bg-white text-purple-600 hover:bg-blue-50 font-semibold px-6 py-3"
                      data-testid="button-usar-codigo"
                    >
                      Usar mi Código
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Texto Explicativo */}
          <div className="mt-8 text-center">
            <p className="text-sm text-blue-300 max-w-3xl mx-auto">
              💡 <strong>¿No tienes código?</strong> No te preocupes. Puedes registrarte normalmente. 
              Los códigos son solo para agradecer a quienes promocionan NFLOW, pero no son obligatorios.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}