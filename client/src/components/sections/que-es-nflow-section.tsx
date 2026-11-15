import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Clock, Shield, Euro, Heart, Building2, UserCheck, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function QueEsNflowSection() {
  return (
    <section id="que-es-nflow" className="bg-[#123f43] px-4 py-14 text-[#f2f4e8] sm:py-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 border border-[#6d9d8c]/40 bg-white/[0.07] px-4 py-2 text-sm text-[#d6e69a]">
            Conoce NUXA
          </Badge>
          <h2 className="mb-6 text-4xl font-semibold leading-tight tracking-[-0.045em] text-[#f2f4e8] sm:text-5xl">
            ¿Qué es NUXA?
          </h2>
          <p className="mb-4 text-sm italic text-[#b7d7c4]">
            Anteriormente conocido como NFLOW, ahora somos NUXA
          </p>
          <p className="mx-auto max-w-4xl text-base leading-7 text-[#c3d8d1] sm:text-lg">
            Un asistente digital de salud mental que ofrece apoyo psicológico adaptado a adolescentes, 
            familias y empresas.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="border-[#6d9d8c]/35 bg-white/[0.06] text-[#f2f4e8] transition-colors hover:bg-white/[0.09]">
            <CardContent className="p-6 text-center">
              <Clock className="mx-auto mb-4 h-9 w-9 text-[#c9dd83]" />
              <h3 className="mb-3 text-lg font-semibold text-[#f2f4e8]">Disponible 24/7</h3>
              <p className="text-sm leading-6 text-[#c3d8d1]">
                Apoyo emocional inmediato cuando más lo necesitas, sin horarios ni citas
              </p>
            </CardContent>
          </Card>

          <Card className="border-[#6d9d8c]/35 bg-white/[0.06] text-[#f2f4e8] transition-colors hover:bg-white/[0.09]">
            <CardContent className="p-6 text-center">
              <Shield className="mx-auto mb-4 h-9 w-9 text-[#b7d7c4]" />
              <h3 className="mb-3 text-lg font-semibold text-[#f2f4e8]">Seguro y accesible</h3>
              <p className="text-sm leading-6 text-[#c3d8d1]">
                Plataforma segura y confidencial, accesible desde cualquier dispositivo
              </p>
            </CardContent>
          </Card>

          <Card className="border-[#6d9d8c]/35 bg-white/[0.06] text-[#f2f4e8] transition-colors hover:bg-white/[0.09]">
            <CardContent className="p-6 text-center">
              <Euro className="mx-auto mb-4 h-9 w-9 text-[#c9dd83]" />
              <h3 className="mb-3 text-lg font-semibold text-[#f2f4e8]">Coste mínimo</h3>
              <p className="text-sm leading-6 text-[#c3d8d1]">
                Solo <strong className="text-yellow-300">2,99 €/mes</strong> por usuario - menos que un café
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Benefits Section */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-white text-center mb-12">Beneficios principales</h3>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Para jóvenes y familias */}
            <Card className="border-[#6d9d8c]/35 bg-[#20494a] text-[#f2f4e8]">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Heart className="mr-3 h-7 w-7 text-[#c9dd83]" />
                  <h4 className="text-2xl font-bold text-white">Para jóvenes y familias</h4>
                </div>
                <p className="text-base font-medium leading-7 text-[#c3d8d1]">
                  Apoyo emocional inmediato, con control parental opcional. Un espacio seguro para 
                  expresarse y recibir orientación profesional.
                </p>
              </CardContent>
            </Card>

            {/* Para empresas */}
            <Card className="border-[#6d9d8c]/35 bg-[#20494a] text-[#f2f4e8]">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Building2 className="mr-3 h-7 w-7 text-[#b7d7c4]" />
                  <h4 className="text-2xl font-bold text-white">Para empresas</h4>
                </div>
                <p className="text-base font-medium leading-7 text-[#c3d8d1]">
                  Considera la <strong className="text-[#f2f4e8]">ISO 45003</strong> (bienestar laboral) de forma económica.
                  Cuida a tus empleados con una inversión mínima.
                </p>
              </CardContent>
            </Card>

            {/* Para profesionales */}
            <Card className="border-[#6d9d8c]/35 bg-[#20494a] text-[#f2f4e8]">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <UserCheck className="mr-3 h-7 w-7 text-[#b7d7c4]" />
                  <h4 className="text-2xl font-bold text-white">Para profesionales</h4>
                </div>
                <p className="text-base font-medium leading-7 text-[#c3d8d1]">
                  Complemento eficaz para prevención y orientación en salud y educación. 
                  Una herramienta de apoyo profesional.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Key Arguments */}
        <div className="mb-16 rounded-[1.5rem] border border-[#6d9d8c]/35 bg-white/[0.06] p-6 sm:p-8">
          <h3 className="mb-8 text-center text-2xl font-semibold text-[#f2f4e8] sm:text-3xl">Argumentos clave</h3>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-[#c9dd83]" />
              <p className="text-base leading-7 text-[#c3d8d1] sm:text-lg">
                <strong className="text-[#f2f4e8]">"NUXA no sustituye al psicólogo, lo complementa"</strong>:
                es una ayuda inmediata y continua.
              </p>
            </div>
            
            <div className="flex items-start space-x-4">
              <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-[#c9dd83]" />
              <p className="text-base leading-7 text-[#c3d8d1] sm:text-lg">
                <strong className="text-[#f2f4e8]">"Por menos de un café al mes"</strong>,
                tienes un recurso de salud mental disponible las 24 horas.
              </p>
            </div>
            
            <div className="flex items-start space-x-4">
              <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-[#c9dd83]" />
              <p className="text-base leading-7 text-[#c3d8d1] sm:text-lg">
                <strong className="text-[#f2f4e8]">"Las empresas pueden cuidar a sus trabajadores"</strong>
                con una inversión mínima.
              </p>
            </div>
            
            <div className="flex items-start space-x-4">
              <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-[#c9dd83]" />
              <p className="text-base leading-7 text-[#c3d8d1] sm:text-lg">
                <strong className="text-[#f2f4e8]">"NUXA acerca la salud mental a todo el mundo"</strong>,
                sin listas de espera ni burocracia.
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Model */}
        <div className="text-center">
          <h3 className="text-3xl font-bold text-white mb-8">Modelo de precios</h3>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
            <Card className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-sm border-orange-300/30">
              <CardContent className="p-8 text-center">
                <h4 className="text-2xl font-bold text-white mb-4">Usuario individual</h4>
                <div className="text-5xl font-bold text-orange-400 mb-2">2,99 €</div>
                <div className="text-lg text-orange-200">por mes</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm border-blue-300/30">
              <CardContent className="p-8 text-center">
                <h4 className="text-2xl font-bold text-white mb-4">Empresa</h4>
                <div className="text-3xl font-bold text-blue-400 mb-2">Tarifa flexible</div>
                <div className="text-lg text-blue-200">con todos los empleados incluidos</div>
              </CardContent>
            </Card>
          </div>

          {/* CTA */}
          <Link
              href="/login"
              className="inline-flex min-h-12 w-full max-w-md items-center justify-center rounded-full bg-[#d6e69a] px-6 py-3 text-base font-semibold text-[#173e3d] transition-colors hover:bg-[#e3edb8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#eff5c7] focus-visible:ring-offset-2 focus-visible:ring-offset-[#123f43] motion-reduce:transition-none sm:px-10 sm:py-4 sm:text-lg"
              data-testid="button-bienestar-cta"
            >
              Comienza tu bienestar hoy mismo
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}