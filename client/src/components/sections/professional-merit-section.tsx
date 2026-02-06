import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Shield, Star, CheckCircle, MapPin, Home, Video, Calendar, ExternalLink } from "lucide-react";
import certificadoCOPCPath from "../../assets/certificado-copc.png";

export default function ProfessionalMeritSection() {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-nflow-dark via-gray-900 to-nflow-dark">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Badge className="bg-nflow-orange/20 text-nflow-orange border-nflow-orange/30 mb-4 text-sm px-4 py-2">
            Acreditación Profesional Oficial
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Respaldo Profesional y Credibilidad
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            NUXA está desarrollado por profesionales oficialmente colegiados y acreditados en psicología clínica
          </p>
        </div>

        {/* Main Certificate Card */}
        <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 shadow-2xl">
          <CardContent className="p-8">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Certificate Image */}
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-nflow-orange/20 to-orange-600/20 rounded-2xl blur-lg"></div>
                <div className="relative bg-white rounded-xl p-4 shadow-xl">
                  <div className="rounded-lg h-64 w-full flex justify-center items-center">
                    <img 
                      src={certificadoCOPCPath}
                      alt="Certificado Colegio Oficial de Psicología de Cataluña - Ramón Molons de San Román"
                      className="max-h-56 max-w-full object-contain transform -rotate-90"
                    />
                  </div>
                  {/* Verification Badge */}
                  <div className="absolute -top-3 -right-3 bg-green-500 text-white rounded-full p-2 shadow-lg">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-6 text-white">
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <Shield className="w-8 h-8 text-nflow-orange" />
                    <h3 className="text-2xl font-bold">Acreditación Oficial</h3>
                  </div>
                  <h4 className="text-xl font-semibold text-nflow-orange mb-2">
                    Colegio Oficial de Psicología de Cataluña
                  </h4>
                  <p className="text-gray-300 leading-relaxed">
                    Certificación oficial que respalda la competencia profesional y ética 
                    en el ejercicio de la psicología clínica y sanitaria.
                  </p>
                </div>

                {/* Key Points */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Award className="w-5 h-5 text-nflow-orange mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Colegiado Oficial #7851</p>
                      <p className="text-sm text-gray-400">Registro verificado y actualizado</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Star className="w-5 h-5 text-nflow-orange mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Licencia Sanitaria Estatal</p>
                      <p className="text-sm text-gray-400">E-17928702 - Habilitación para ejercicio clínico</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-nflow-orange mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Especialización ISO 45003</p>
                      <p className="text-sm text-gray-400">Bienestar psicológico en el entorno laboral</p>
                    </div>
                  </div>
                </div>

                {/* Trust Indicators */}
                <div className="bg-nflow-orange/10 rounded-xl p-4 border border-nflow-orange/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className="w-5 h-5 text-nflow-orange" />
                    <span className="font-semibold text-nflow-orange">Garantía de Calidad</span>
                  </div>
                  <p className="text-sm text-gray-300">
                    Esta acreditación garantiza que NUXA cumple con los más altos estándares 
                    éticos y profesionales en salud mental digital.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>


        {/* Additional Trust Elements */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="text-center p-6 bg-white/5 rounded-xl border border-white/10">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <h4 className="font-semibold text-white mb-2">Verificación Oficial</h4>
            <p className="text-sm text-gray-400">
              Credenciales verificadas por el organismo profesional competente
            </p>
          </div>
          
          <div className="text-center p-6 bg-white/5 rounded-xl border border-white/10">
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-blue-400" />
            </div>
            <h4 className="font-semibold text-white mb-2">Código Ético</h4>
            <p className="text-sm text-gray-400">
              Compromiso con los principios éticos de la psicología profesional
            </p>
          </div>
          
          <div className="text-center p-6 bg-white/5 rounded-xl border border-white/10">
            <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-6 h-6 text-orange-400" />
            </div>
            <h4 className="font-semibold text-white mb-2">Formación Continua</h4>
            <p className="text-sm text-gray-400">
              Actualización constante en las mejores prácticas clínicas
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}