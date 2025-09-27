import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Clock, Shield, Euro, Heart, Building2, UserCheck, ArrowRight } from "lucide-react";

export default function QueEsNflowSection() {
  return (
    <section id="que-es-nflow" className="py-20 px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="bg-green-500 text-white mb-4 text-sm px-4 py-2">
            Conoce NFLOW
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            ¿Qué es NFLOW?
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Un asistente digital de salud mental que ofrece apoyo psicológico adaptado a adolescentes, 
            familias y empresas.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <Clock className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Disponible 24/7</h3>
              <p className="text-gray-300">
                Apoyo emocional inmediato cuando más lo necesitas, sin horarios ni citas
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <Shield className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Seguro y accesible</h3>
              <p className="text-gray-300">
                Plataforma segura y confidencial, accesible desde cualquier dispositivo
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <Euro className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Coste mínimo</h3>
              <p className="text-gray-300">
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
            <Card className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-sm border-purple-400/40">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Heart className="w-8 h-8 text-pink-400 mr-3" />
                  <h4 className="text-2xl font-bold text-white">Para jóvenes y familias</h4>
                </div>
                <p className="text-gray-200 text-lg leading-relaxed font-medium">
                  Apoyo emocional inmediato, con control parental opcional. Un espacio seguro para 
                  expresarse y recibir orientación profesional.
                </p>
              </CardContent>
            </Card>

            {/* Para empresas */}
            <Card className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 backdrop-blur-sm border-blue-400/40">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Building2 className="w-8 h-8 text-cyan-400 mr-3" />
                  <h4 className="text-2xl font-bold text-white">Para empresas</h4>
                </div>
                <p className="text-gray-200 text-lg leading-relaxed font-medium">
                  Cumple con la <strong className="text-white">ISO 45003</strong> (bienestar laboral) de forma económica. 
                  Cuida a tus empleados con una inversión mínima.
                </p>
              </CardContent>
            </Card>

            {/* Para profesionales */}
            <Card className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 backdrop-blur-sm border-green-400/40">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <UserCheck className="w-8 h-8 text-emerald-400 mr-3" />
                  <h4 className="text-2xl font-bold text-white">Para profesionales</h4>
                </div>
                <p className="text-gray-200 text-lg leading-relaxed font-medium">
                  Complemento eficaz para prevención y orientación en salud y educación. 
                  Una herramienta de apoyo profesional.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Key Arguments */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 mb-16">
          <h3 className="text-3xl font-bold text-white text-center mb-8">Argumentos clave</h3>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <CheckCircle className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
              <p className="text-xl text-gray-200 leading-relaxed">
                <strong className="text-white">"NFLOW no sustituye al psicólogo, lo complementa"</strong>: 
                es una ayuda inmediata y continua.
              </p>
            </div>
            
            <div className="flex items-start space-x-4">
              <CheckCircle className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
              <p className="text-xl text-gray-200 leading-relaxed">
                <strong className="text-white">"Por menos de un café al mes"</strong>, 
                tienes un recurso de salud mental disponible las 24 horas.
              </p>
            </div>
            
            <div className="flex items-start space-x-4">
              <CheckCircle className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
              <p className="text-xl text-gray-200 leading-relaxed">
                <strong className="text-white">"Las empresas pueden cuidar a sus trabajadores"</strong> 
                con una inversión mínima.
              </p>
            </div>
            
            <div className="flex items-start space-x-4">
              <CheckCircle className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
              <p className="text-xl text-gray-200 leading-relaxed">
                <strong className="text-white">"NFLOW acerca la salud mental a todo el mundo"</strong>, 
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
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-12 py-6 text-xl font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
            onClick={() => {
              window.location.href = "/login";
            }}
          >
            Comienza tu bienestar hoy mismo
            <ArrowRight className="w-6 h-6 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}