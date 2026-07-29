import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { SEOHead } from "@/components/SEOHead";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect } from "react";
import { 
  Shield, 
  Users, 
  Clock, 
  Eye, 
  Heart, 
  CheckCircle,
  ArrowLeft,
  Brain,
  Lock,
  UserCheck,
  Settings,
  AlertTriangle,
  Star,
  Smartphone
} from "lucide-react";
import youthControlImage from "@assets/image_1756563884379.png";

export default function ControlParentalPage() {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <SEOHead
        title="Control Parental NUXA | Supervisión Profesional para Jóvenes"
        description="NUXA ofrece controles parentales y supervisión profesional para el uso seguro de la IA en salud mental juvenil. Protege a tus hijos con apoyo emocional responsable."
        canonicalUrl="https://nuxa.life/control-parental"
        ogUrl="https://nuxa.life/control-parental"
      />
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:to-blue-900">
      {/* Header Navigation */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/">
              <Button variant="ghost" className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                <ArrowLeft className="h-4 w-4" />
                Volver al Inicio
              </Button>
            </Link>
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
              NUXA
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <div className="space-y-8">
              <div>
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 mb-4 text-sm px-3 py-1">
                  <Shield className="h-3 w-3 mr-1" />
                  Protección Digital Familiar
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                    Control Parental
                  </span>
                  <br />
                  <span className="text-gray-800 dark:text-white">
                    Responsable
                  </span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                  Para padres y tutores legales que quieren proteger y guiar a sus hijos en el uso 
                  responsable de herramientas de salud mental digital.
                </p>
              </div>

              {/* Key Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 bg-white/80 dark:bg-gray-800/80 rounded-xl p-4 shadow-sm">
                  <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Protección Total</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Supervisión completa</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 bg-white/80 dark:bg-gray-800/80 rounded-xl p-4 shadow-sm">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <Eye className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Transparencia</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Control total de sesiones</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 bg-white/80 dark:bg-gray-800/80 rounded-xl p-4 shadow-sm">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Horarios</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Uso responsable</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 bg-white/80 dark:bg-gray-800/80 rounded-xl p-4 shadow-sm">
                  <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                    <Heart className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Bienestar</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Salud mental supervisada</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src={youthControlImage} 
                  alt="Jóvenes usando NUXA con supervisión parental responsable"
                  className="w-full h-auto object-cover"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                
                {/* Floating stats */}
                <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Supervisión Activa</p>
                      <p className="text-xs text-gray-600">Control Parental NUXA</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-8 -left-8 w-32 h-32 bg-emerald-400/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-400/20 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Parental Control Section */}
      <section className="py-20 px-4 bg-white dark:bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
              ¿Por Qué es Fundamental el <span className="text-emerald-600">Control Parental</span>?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
              La supervisión responsable en herramientas de salud mental digital no es sobreprotección, 
              es responsabilidad parental consciente en la era digital.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 border-emerald-100 hover:border-emerald-200 transition-colors">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Brain className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Desarrollo Saludable
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  La adolescencia es la etapa más crítica para la formación de la personalidad. 
                  Acompañar este proceso con herramientas supervisadas garantiza un desarrollo 
                  emocional equilibrado.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-100 hover:border-blue-200 transition-colors">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Protección Digital
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Internet puede ser un espacio vulnerable para menores. El control parental 
                  asegura que accedan solo a contenido apropiado y profesionalmente supervisado 
                  en salud mental.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-100 hover:border-purple-200 transition-colors">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Acompañamiento Familiar
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Los problemas de salud mental en menores requieren un abordaje familiar. 
                  El control parental permite que toda la familia participe en el proceso 
                  de bienestar.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Parental Control Features */}
      <section className="py-20 px-4 bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
              Funciones de <span className="text-emerald-600">Control Parental</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
              Herramientas diseñadas para que padres y tutores puedan supervisar y acompañar 
              el proceso de bienestar mental de sus hijos de manera responsable.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Features List */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Eye className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">Supervisión de Conversaciones</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Los padres pueden revisar todas las conversaciones que sus hijos mantienen 
                    con NEUROPSI-AI para asegurar contenido apropiado y detectar posibles 
                    señales de alerta temprana.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">Control de Horarios</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Establece horarios específicos para el uso de la aplicación, promoviendo 
                    un equilibrio saludable entre el apoyo digital y las actividades cotidianas.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center flex-shrink-0">
                  <UserCheck className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">Autorización de Uso</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Los menores necesitan autorización expresa de padres o tutores para acceder 
                    a NUXA, cumpliendo con las normativas de protección de menores.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-xl flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">Alertas Inmediatas</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Notificaciones automáticas a los padres cuando se detectan conversaciones 
                    que indican riesgo o necesidad de intervención profesional inmediata.
                  </p>
                </div>
              </div>
            </div>

            {/* Right side - Professional Image */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src={youthControlImage} 
                  alt="Jóvenes usando NUXA con supervisión parental responsable"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                
                {/* Floating Professional Badge */}
                <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Supervisión Profesional</p>
                      <p className="text-xs text-gray-600">Psicólogos Colegiados</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Legal Framework */}
      <section className="py-20 px-4 bg-white dark:bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
              Marco <span className="text-blue-600">Legal y Ético</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
              Cumplimiento estricto de la normativa española e internacional sobre protección 
              de menores en entornos digitales.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">Ley de Protección de Datos (LOPD)</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Cumplimiento total con la normativa española de protección de datos para menores 
                      de edad, requiriendo consentimiento parental explícito.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Shield className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">GDPR - Menores</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Adherencia completa al Reglamento General de Protección de Datos europeo, 
                      especialmente en lo referente a tratamiento de datos de menores de 16 años.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Heart className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">Código Deontológico</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Cumplimiento del Código Deontológico del Colegio de Psicólogos en el 
                      tratamiento de menores, garantizando la máxima protección ética.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 rounded-2xl p-6 border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-emerald-800 dark:text-emerald-200 mb-2">
                      Supervisión Profesional Colegiada
                    </h3>
                    <p className="text-emerald-700 dark:text-emerald-300">
                      Todas las interacciones con menores están supervisadas por psicólogos 
                      colegiados del Colegio de Psicólogos de Barcelona, garantizando la 
                      máxima calidad y seguridad profesional.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Credentials */}
            <div className="bg-gradient-to-br from-blue-600 to-emerald-600 rounded-3xl p-8 text-white">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserCheck className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Supervisión Profesional</h3>
                <p className="text-blue-100">Por psicólogos colegiados especializados en menores</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 bg-white/10 rounded-xl p-3">
                  <CheckCircle className="w-5 h-5 text-emerald-300" />
                  <span className="text-blue-100">Psicólogo Clínico y Escolar</span>
                </div>
                <div className="flex items-center space-x-3 bg-white/10 rounded-xl p-3">
                  <CheckCircle className="w-5 h-5 text-emerald-300" />
                  <span className="text-blue-100">Colegiado #7851 Barcelona</span>
                </div>
                <div className="flex items-center space-x-3 bg-white/10 rounded-xl p-3">
                  <CheckCircle className="w-5 h-5 text-emerald-300" />
                  <span className="text-blue-100">Licencia Sanitaria E-17928702</span>
                </div>
                <div className="flex items-center space-x-3 bg-white/10 rounded-xl p-3">
                  <CheckCircle className="w-5 h-5 text-emerald-300" />
                  <span className="text-blue-100">32 años experiencia en menores</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
              ¿Cómo Funciona el <span className="text-blue-600">Control Parental</span>?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
              Un proceso sencillo y transparente que garantiza la seguridad de tus hijos 
              mientras acceden a apoyo profesional en salud mental.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <Card className="border-2 border-blue-100 hover:border-blue-200 transition-colors relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-emerald-500"></div>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-2xl">
                  1
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Registro Parental
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Los padres o tutores legales crean una cuenta principal y registran 
                  a sus hijos menores de edad bajo supervisión parental.
                </p>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="border-2 border-emerald-100 hover:border-emerald-200 transition-colors relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-2xl">
                  2
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Configuración de Permisos
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Personaliza los permisos de acceso: horarios permitidos, tipo de contenido, 
                  nivel de supervisión y alertas automáticas.
                </p>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="border-2 border-purple-100 hover:border-purple-200 transition-colors relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-pink-500"></div>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-2xl">
                  3
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Supervisión Activa
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Monitoreo continuo de las sesiones, con reportes automáticos y 
                  posibilidad de intervención inmediata cuando sea necesario.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 to-emerald-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20">
            <Smartphone className="w-16 h-16 mx-auto mb-6 text-emerald-300" />
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Protege a Tus Hijos con Responsabilidad
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              El bienestar mental de tus hijos es invaluable. Con NUXA Control Parental, 
              puedes brindarles el apoyo que necesitan mientras mantienes la supervisión 
              responsable que merecen.
            </p>
            
            <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
              <Link href="/registro">
                <Button 
                  size="lg" 
                  className="bg-orange-500 text-white hover:bg-orange-600 px-8 py-4 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 w-full sm:w-auto border-2 border-white"
                >
                  Empezar Ahora - Control Parental
                </Button>
              </Link>
              <Link href="/registro/planes">
                <Button 
                  variant="outline"
                  size="lg" 
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 w-full sm:w-auto"
                >
                  Consulta Profesional
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Support Note */}
      <section className="py-12 px-4 bg-emerald-50 dark:bg-gray-800 border-t-4 border-emerald-500">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white dark:bg-gray-700 rounded-2xl p-8 shadow-lg">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Compromiso Profesional
              </h3>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              <strong>NUXA</strong> está dirigido por psicólogos colegiados especializados en infancia 
              y adolescencia. Entendemos que la participación de los padres no solo es importante, 
              <strong>es fundamental</strong> para el éxito del proceso terapéutico en menores.
            </p>
            
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <strong>Ramón Molons de San Román</strong> - Psicólogo Clínico y Escolar<br />
                Colegiado Colegio de Psicólogos de Barcelona #7851 | Licencia Sanitaria Estatal E-17928702
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}