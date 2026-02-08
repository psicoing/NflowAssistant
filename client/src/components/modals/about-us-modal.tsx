import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
  Users, 
  Calendar,
  Stethoscope,
  Computer,
  BookOpen,
  Star,
  Shield,
  Heart,
  TrendingUp
} from "lucide-react";

interface AboutUsModalProps {
  trigger?: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
}

export default function AboutUsModal({ trigger, onOpenChange }: AboutUsModalProps) {
  const DefaultTrigger = (
    <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10">
      <Users className="h-4 w-4 mr-2" />
      Nosotros
    </Button>
  );

  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {trigger || DefaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Heart className="h-6 w-6 text-nflow-orange" />
            Nosotros - NUXA Psychology
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Director y Fundador */}
          <Card className="border-nflow-orange/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-nflow-orange to-nflow-blue rounded-full flex items-center justify-center">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-nflow-orange mb-1">
                    Dr. Ramón Molons de San Román
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-3">
                    Director y Fundador de NUXA • NeuroEngineer & PsychoClinic
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      <Shield className="h-3 w-3 mr-1" />
                      Col. 7851 Barcelona
                    </Badge>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <Award className="h-3 w-3 mr-1" />
                      30+ años experiencia
                    </Badge>
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                      <Star className="h-3 w-3 mr-1" />
                      Mejor Psicólogo Doctoralia
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Formación Académica */}
          <Card>
            <CardContent className="p-6">
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-nflow-orange" />
                Formación Académica Especializada
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Stethoscope className="h-4 w-4 text-blue-500 mt-1" />
                    <div>
                      <p className="font-medium">Psicología Clínica y Educativa</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Universidad Autónoma de Barcelona (1989-1993)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Computer className="h-4 w-4 text-purple-500 mt-1" />
                    <div>
                      <p className="font-medium">Ingeniería de Telecomunicaciones</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Universidad Oberta de Catalunya</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Brain className="h-4 w-4 text-green-500 mt-1" />
                    <div>
                      <p className="font-medium">Biomatemática y Bioinformática</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Universidad de Barcelona (2020-2021)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <BookOpen className="h-4 w-4 text-orange-500 mt-1" />
                    <div>
                      <p className="font-medium">Psicología de la Salud</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Universidad de Girona (1994-1995)</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Experiencia Profesional */}
          <Card>
            <CardContent className="p-6">
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Building className="h-5 w-5 text-nflow-orange" />
                Experiencia Profesional
              </h4>
              <div className="space-y-4">
                <div className="border-l-4 border-nflow-orange pl-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h5 className="font-medium text-nflow-orange">NUXA Psychology - Director de Proyecto</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Marzo 2025 - Presente</p>
                    </div>
                    <Badge variant="outline" className="bg-orange-50 text-orange-700">Actual</Badge>
                  </div>
                  <p className="text-sm mt-2">Desarrollo de aplicación de apoyo psicológico con IA</p>
                </div>
                
                <div className="border-l-4 border-blue-500 pl-4">
                  <div>
                    <h5 className="font-medium text-blue-600">INS NEURONMEG - Psicólogo Clínico</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Septiembre 1994 - Marzo 2025 (30 años 7 meses)</p>
                  </div>
                  <p className="text-sm mt-2">Consulta de Psicología especializada a domicilio</p>
                </div>
                
                <div className="border-l-4 border-purple-500 pl-4">
                  <div>
                    <h5 className="font-medium text-purple-600">NEURON MEG - Investigador</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Octubre 2010 - Marzo 2025 (14 años 6 meses)</p>
                  </div>
                  <p className="text-sm mt-2">Investigación en neuroingeniería y análisis de señales bioeléctricas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Especialización y Enfoque */}
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
            <CardContent className="p-6">
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-nflow-orange" />
                Especialización NUXA
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium mb-2 text-blue-700 dark:text-blue-300">Neuroingeniería Aplicada</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Sistemas neurocomputacionales y análisis de redes neuronales para mejorar la salud mental
                  </p>
                </div>
                <div>
                  <h5 className="font-medium mb-2 text-purple-700 dark:text-purple-300">Inteligencia Artificial Clínica</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Desarrollo de chatbots avanzados de psicología con respuestas basadas en principios clínicos
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información de Contacto */}
          <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
            <CardContent className="p-6">
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Phone className="h-5 w-5 text-green-600" />
                Información de Contacto
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="font-medium">JOBDA, filial de EMPORDAJOBS SL</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">CIF: B02701100</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Portbou, Girona, España</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="font-medium">Teléfono profesional</p>
                      <p className="text-sm text-blue-600">+34 660 45 21 36</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-purple-500" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-purple-600">empordajobs@gmail.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Misión NUXA */}
          <Card className="border-nflow-orange/30 bg-gradient-to-r from-orange-50 to-blue-50 dark:from-orange-950/10 dark:to-blue-950/10">
            <CardContent className="p-6">
              <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Heart className="h-5 w-5 text-nflow-orange" />
                Misión de NUXA
              </h4>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Integrar neurociencia e inteligencia artificial para crear una herramienta de salud mental 
                accesible y efectiva. NUXA representa un avance en la democratización del apoyo psicológico, 
                proporcionando respuestas basadas en principios de psicología clínica y escolar con un 
                lenguaje cercano y profesional.
              </p>
              <Separator className="my-4" />
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                  "Más de 30 años de experiencia clínica al servicio de la innovación en salud mental"
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}