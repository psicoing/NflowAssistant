import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Award, Users, Building2 } from "lucide-react";
import founderImagePath from "@assets/image_1755861606102.png";

export default function FounderSection() {
  return (
    <section id="founder" className="py-20 px-4 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-white space-y-8">
            <div>
              <Badge className="bg-orange-500 text-white mb-4 text-sm px-3 py-1">
                Fundador y Director Ejecutivo
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                Liderando la Innovación en Salud Mental Digital
              </h2>
            </div>

            <div className="space-y-6 text-lg leading-relaxed text-blue-50">
              <p>
                Con <strong>NFLOW</strong>, mi objetivo es ofrecer soluciones innovadoras que integren 
                salud mental y desarrollo laboral, alineadas con los principios de la normativa ISO 45003, 
                centrada en el bienestar psicológico en el entorno de trabajo.
              </p>
              
              <p>
                <strong>NFLOW</strong> es una aplicación para la salud mental de personas individuales, 
                familias y trabajadores. Funciona como un recurso digital de apoyo emocional continuo, 
                generando entornos altamente digitalizados y adaptativos, capaces de responder a los 
                nuevos desafíos del bienestar psicológico en todos los ámbitos de la vida.
              </p>
            </div>

            {/* Credentials */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-2xl font-bold mb-4">Ramón Molons de San Román</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Award className="w-5 h-5 text-orange-400" />
                  <span className="text-blue-100">CEO y Fundador de JOBDA, filial de Empordajobs SL</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-orange-400" />
                  <span className="text-blue-100">Neuroingeniero en Telecomunicaciones</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Building2 className="w-5 h-5 text-orange-400" />
                  <span className="text-blue-100">Colegiado Colegio de Psicólogos de Barcelona</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-orange-400" />
                  <span className="text-blue-100">Psicólogo Clínico y Escolar</span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-6">
              <Button 
                size="lg" 
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                onClick={() => {
                  document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Conoce Más Sobre Nuestra Visión
              </Button>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              {/* CEO Badge */}
              <div className="absolute -top-4 -right-4 bg-orange-500 text-white rounded-full w-16 h-16 flex items-center justify-center font-bold text-lg shadow-xl z-10">
                CEO
              </div>
              
              {/* Profile Image */}
              <div className="w-full aspect-square rounded-2xl mb-6 overflow-hidden shadow-xl">
                <img 
                  src={founderImagePath} 
                  alt="Ramón Molons de San Román - CEO y Fundador de NFLOW"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              
              {/* Professional Info */}
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-bold text-white">Ramón Molons de San Román</h3>
                <div className="space-y-2">
                  <Badge className="bg-orange-500/20 text-orange-200 border border-orange-400/30">
                    Psicólogo Clínico
                  </Badge>
                  <Badge className="bg-orange-500/20 text-orange-200 border border-orange-400/30 ml-2">
                    Neuroingeniero
                  </Badge>
                </div>
                <p className="text-blue-100 text-sm">
                  Pionero en la integración de IA y salud mental para el bienestar corporativo
                </p>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-6 -left-6 w-12 h-12 bg-orange-400 rounded-full opacity-60 animate-pulse"></div>
            <div className="absolute -bottom-4 -right-8 w-8 h-8 bg-white/30 rounded-full opacity-80 animate-pulse delay-1000"></div>
          </div>
        </div>

        {/* Innovation Stats */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center text-white">
            <div className="text-4xl font-bold text-orange-400 mb-2">32</div>
            <div className="text-blue-100">Años de Experiencia</div>
          </div>
          <div className="text-center text-white">
            <div className="text-4xl font-bold text-orange-400 mb-2">ISO 45003</div>
            <div className="text-blue-100">Certificación Especializada</div>
          </div>
          <div className="text-center text-white">
            <div className="text-4xl font-bold text-orange-400 mb-2">788</div>
            <div className="text-blue-100">Usuarios Beneficiados</div>
          </div>
        </div>
      </div>
    </section>
  );
}