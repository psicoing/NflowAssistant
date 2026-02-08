import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Brain, 
  GraduationCap, 
  Building, 
  MapPin, 
  Phone, 
  Mail, 
  Award, 
  Calendar,
  Stethoscope,
  Computer,
  BookOpen,
  Star,
  Shield,
  Heart,
  TrendingUp,
  ArrowLeft,
  Home,
  CheckCircle
} from "lucide-react";

export default function NosotrosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
      {/* Header Navigation */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/">
              <Button variant="ghost" className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                <ArrowLeft className="h-4 w-4" />
                Volver a la página principal
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-nflow-orange" />
              <span className="text-xl font-bold text-nflow-orange">NUXA</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Nosotros - NUXA Psychology
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Más de 30 años de experiencia en psicología clínica aplicada a la innovación tecnológica
          </p>
        </div>

        <div className="space-y-8">
          {/* Director y Fundador */}
          <Card className="border-nflow-orange/20 shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 bg-gradient-to-br from-nflow-orange to-nflow-blue rounded-full flex items-center justify-center">
                  <Brain className="h-10 w-10 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-nflow-orange mb-2">
                    Llic. Ramón Molons de San Román
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 text-lg">
                    Director y Fundador de NUXA • NeuroEngineer & PsychoClinic
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 py-1 px-3">
                      <Shield className="h-3 w-3 mr-1" />
                      Colegiado Colegio de Psicólogos de Barcelona #7851
                    </Badge>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 py-1 px-3">
                      <Award className="h-3 w-3 mr-1" />
                      30+ años experiencia
                    </Badge>
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 py-1 px-3">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Licencia Sanitaria E-17928702
                    </Badge>
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 py-1 px-3">
                      <Star className="h-3 w-3 mr-1" />
                      Mejor Psicólogo Doctoralia 2016
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Formación Académica */}
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                <GraduationCap className="h-6 w-6 text-nflow-orange" />
                Formación Académica Especializada
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <Stethoscope className="h-5 w-5 text-blue-500 mt-1" />
                    <div>
                      <h4 className="font-semibold text-lg">Psicología Clínica y Educativa</h4>
                      <p className="text-gray-600 dark:text-gray-400">Universidad Autónoma de Barcelona (1989-1993)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Computer className="h-5 w-5 text-purple-500 mt-1" />
                    <div>
                      <h4 className="font-semibold text-lg">Ingeniería de Telecomunicaciones</h4>
                      <p className="text-gray-600 dark:text-gray-400">Universidad Oberta de Catalunya (en curso)</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <Brain className="h-5 w-5 text-green-500 mt-1" />
                    <div>
                      <h4 className="font-semibold text-lg">Máster Bioestadística</h4>
                      <p className="text-gray-600 dark:text-gray-400">Universidad de Barcelona (en curso)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <BookOpen className="h-5 w-5 text-orange-500 mt-1" />
                    <div>
                      <h4 className="font-semibold text-lg">Postgrado Psicología de la Salud</h4>
                      <p className="text-gray-600 dark:text-gray-400">Universidad de Girona (1994-1995)</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Experiencia Profesional */}
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                <Building className="h-6 w-6 text-nflow-orange" />
                Experiencia Profesional
              </h3>
              <div className="space-y-6">
                <div className="border-l-4 border-nflow-orange pl-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-lg text-nflow-orange">NUXA Psychology - Director de Proyecto</h4>
                      <p className="text-gray-600 dark:text-gray-400">Marzo 2025 - Presente</p>
                    </div>
                    <Badge variant="outline" className="bg-orange-50 text-orange-700">Actual</Badge>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">Desarrollo de aplicación de apoyo psicológico con IA</p>
                </div>
                
                <div className="border-l-4 border-blue-500 pl-6">
                  <div className="mb-2">
                    <h4 className="font-semibold text-lg text-blue-600">INS NEURONMEG - Psicólogo Clínico</h4>
                    <p className="text-gray-600 dark:text-gray-400">Septiembre 1994 - Marzo 2025 (30 años 7 meses)</p>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">Consulta de Psicología especializada a domicilio</p>
                </div>

                <div className="border-l-4 border-indigo-500 pl-6">
                  <div className="mb-2">
                    <h4 className="font-semibold text-lg text-indigo-600">Psicólogo - Centro Alzheimer de Figueres</h4>
                    <p className="text-gray-600 dark:text-gray-400">2000 - 2001 • Figueres, Girona</p>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">Neuropsicología geriátrica y terapias cognitivas para demencias</p>
                </div>

                <div className="border-l-4 border-yellow-500 pl-6">
                  <div className="mb-2">
                    <h4 className="font-semibold text-lg text-yellow-600">Psicólogo - Colegio Cor De Maria</h4>
                    <p className="text-gray-600 dark:text-gray-400">1995 - 1998 • Centro Educativo Privado</p>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">Psicología escolar y orientación educativa especializada</p>
                </div>

                <div className="border-l-4 border-green-500 pl-6">
                  <div className="mb-2">
                    <h4 className="font-semibold text-lg text-green-600">Psicólogo Forense - Juzgados de Girona</h4>
                    <p className="text-gray-600 dark:text-gray-400">1995 - 2003 • Girona, La Bisbal, Sant Feliu de Guíxols y Figueres</p>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">Peritajes psicológicos forenses y evaluaciones psicológicas judiciales</p>
                </div>

                <div className="border-l-4 border-red-500 pl-6">
                  <div className="mb-2">
                    <h4 className="font-semibold text-lg text-red-600">Psicólogo - Institutos Públicos de Cataluña</h4>
                    <p className="text-gray-600 dark:text-gray-400">2003 - 2023 • 23 centros educativos • 6 años trabajados en intervalo de 20 años como sustituto interino</p>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">Psicología educativa y apoyo psicopedagógico en centros públicos catalanes</p>
                </div>
                
                <div className="border-l-4 border-purple-500 pl-6">
                  <div className="mb-2">
                    <h4 className="font-semibold text-lg text-purple-600">NEURON MEG - Investigador</h4>
                    <p className="text-gray-600 dark:text-gray-400">Octubre 2010 - Marzo 2025 (14 años 6 meses)</p>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">Investigación en neuroingeniería y análisis de señales bioeléctricas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Especialización y Enfoque */}
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                <TrendingUp className="h-6 w-6 text-nflow-orange" />
                Especialización NUXA
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-lg mb-3 text-blue-700 dark:text-blue-300">Neuroingeniería Aplicada</h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    Sistemas neurocomputacionales y análisis de redes neuronales para mejorar la salud mental
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-3 text-purple-700 dark:text-purple-300">Inteligencia Artificial Clínica</h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    Desarrollo de chatbots avanzados de psicología con respuestas basadas en principios clínicos
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información de Contacto */}
          <Card className="border-green-200 bg-green-50 dark:bg-green-950/20 shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                <Phone className="h-6 w-6 text-green-600" />
                Información de Contacto
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <div>
                      <h4 className="font-semibold">JOBDA, filial de EMPORDAJOBS SL</h4>
                      <p className="text-gray-600 dark:text-gray-400">CIF: B02701100</p>
                      <p className="text-gray-600 dark:text-gray-400">Portbou, Girona, España</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Phone className="h-5 w-5 text-blue-500" />
                    <div>
                      <h4 className="font-semibold">Teléfono profesional</h4>
                      <p className="text-blue-600 font-medium">+34 660 45 21 36</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Mail className="h-5 w-5 text-purple-500" />
                    <div>
                      <h4 className="font-semibold">Email</h4>
                      <p className="text-purple-600 font-medium">empordajobs@gmail.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Grupo JOBDA */}
          <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/10 dark:to-indigo-950/10 shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                <Building className="h-6 w-6 text-blue-600" />
                Grupo JOBDA - Plataforma de Multiservicios
              </h3>
              
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-blue-100 dark:border-blue-900">
                  <h4 className="text-xl font-semibold text-blue-700 dark:text-blue-400 mb-4">
                    JOBDA.BIZ - Ecosistema Integral de Servicios
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    NUXA forma parte del <strong>Grupo JOBDA</strong>, una plataforma integral de multiservicios 
                    que opera bajo la marca <strong>JOBDA.BIZ</strong>. Este ecosistema empresarial está 
                    legalmente constituido bajo <strong>JOBDA, filial de EMPORDAJOBS SL</strong> (CIF: B02701100).
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6 mt-6">
                    <div className="space-y-3">
                      <h5 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        Servicios del Grupo
                      </h5>
                      <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <li>• Consultoría en Salud Mental</li>
                        <li>• Desarrollo de Tecnología IA</li>
                        <li>• Servicios Psicológicos Especializados</li>
                        <li>• Formación y Capacitación</li>
                        <li>• Innovación en NeuroTecnología</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-3">
                      <h5 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <Shield className="h-4 w-4 text-blue-600" />
                        Información Corporativa
                      </h5>
                      <div className="space-y-2 text-sm">
                        <p><strong>Razón Social:</strong> EMPORDAJOBS SL</p>
                        <p><strong>CIF:</strong> B02701100</p>
                        <p><strong>Domicilio:</strong> Portbou, Girona, España</p>
                        <p><strong>Plataforma:</strong> <span className="text-blue-600 font-medium">JOBDA.BIZ</span></p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-center bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6">
                  <p className="text-gray-700 dark:text-gray-300 text-lg italic">
                    "Un grupo empresarial comprometido con la innovación en salud mental y el desarrollo tecnológico al servicio del bienestar humano"
                  </p>
                  <div className="mt-4">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 py-2 px-4">
                      Parte del Ecosistema JOBDA.BIZ
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Misión NUXA */}
          <Card className="border-nflow-orange/30 bg-gradient-to-r from-orange-50 to-blue-50 dark:from-orange-950/10 dark:to-blue-950/10 shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                <Heart className="h-6 w-6 text-nflow-orange" />
                Misión de NUXA
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg mb-6">
                Integrar neurociencia e inteligencia artificial para crear una herramienta de salud mental 
                accesible y efectiva. NUXA representa un avance en la democratización del apoyo psicológico, 
                proporcionando respuestas basadas en principios de psicología clínica y escolar con un 
                lenguaje cercano y profesional.
              </p>
              <Separator className="my-6" />
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400 italic text-lg">
                  "Más de 30 años de experiencia clínica al servicio de la innovación en salud mental"
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <div className="text-center py-8">
            <Link href="/">
              <Button size="lg" className="bg-nflow-orange hover:bg-nflow-orange/90 text-white px-8 py-3 text-lg flex items-center gap-2">
                <Home className="h-5 w-5" />
                Volver a la página de inicio
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}