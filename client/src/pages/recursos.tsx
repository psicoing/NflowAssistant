import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Heart, 
  Brain, 
  Target,
  MessageCircle,
  Sparkles,
  TrendingUp,
  Calendar,
  CheckCircle,
  Download,
  Share2,
  ChevronRight,
  Users,
  Activity,
  Sun,
  Moon
} from "lucide-react";

interface DailyActivity {
  id: string;
  title: string;
  type: "exercise" | "chat" | "evaluation";
  duration: string;
  icon: any;
  color: string;
  description: string;
}

export default function RecursosGratis() {
  const [selectedActivity, setSelectedActivity] = useState<DailyActivity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dailyActivities: DailyActivity[] = [
    {
      id: "registro-emocional",
      title: "Hacer un registro emocional",
      type: "exercise",
      duration: "30 seg",
      icon: Heart,
      color: "bg-orange-50 border-orange-100",
      description: "Registra cómo te sientes hoy. Toma conciencia de tus emociones y aprende a identificarlas mejor cada día."
    },
    {
      id: "afirmacion-dia",
      title: "Leer afirmación del día",
      type: "exercise",
      duration: "30 seg",
      icon: Sparkles,
      color: "bg-purple-50 border-purple-100",
      description: "Comienza tu día con una afirmación positiva que te ayudará a mantener una mentalidad constructiva."
    },
    {
      id: "soledad",
      title: "Dónde vive la soledad",
      type: "chat",
      duration: "5 min",
      icon: MessageCircle,
      color: "bg-blue-50 border-blue-100",
      description: "Una conversación guiada sobre la soledad. Explora tus sentimientos y encuentra formas saludables de gestionarlos."
    },
    {
      id: "depresion",
      title: "Monitorear síntomas de depresión",
      type: "evaluation",
      duration: "5 min",
      icon: Brain,
      color: "bg-amber-50 border-amber-100",
      description: "Evaluación rápida para monitorear tu estado emocional y detectar posibles señales de depresión."
    },
    {
      id: "companía",
      title: "Primeras luces de compañía",
      type: "chat",
      duration: "5 min",
      icon: Sun,
      color: "bg-pink-50 border-pink-100",
      description: "Conversación sobre conexión y relaciones. Aprende a reconocer y valorar las conexiones significativas."
    },
    {
      id: "bienestar",
      title: "Practicar hábitos de bienestar",
      type: "exercise",
      duration: "10 min",
      icon: Activity,
      color: "bg-green-50 border-green-100",
      description: "Ejercicios prácticos para incorporar hábitos saludables en tu rutina diaria."
    }
  ];

  const evaluacionList = [
    {
      title: "Evaluación de ansiedad",
      icon: Brain,
      color: "from-blue-500 to-indigo-500",
      badge: "5 min"
    },
    {
      title: "Evaluación de depresión",
      icon: Heart,
      color: "from-purple-500 to-pink-500",
      badge: "5 min"
    },
    {
      title: "Evaluación de autoestima",
      icon: Sparkles,
      color: "from-amber-500 to-orange-500",
      badge: "5 min"
    }
  ];

  const afirmaciones = [
    {
      text: "Yo construyo mi identidad con conciencia y libertad",
      subtext: "No me limito a repetir lo que aprendí sin cuestionarlo. Hoy elijo conscientemente quién quiero ser, qué valores me definen y cómo quiero vivir mi vida.",
      color: "from-blue-100 to-indigo-200",
      illustration: "🌟"
    },
    {
      text: "Merezco amor y respeto, empezando por mí mismo/a",
      subtext: "Reconozco mi valor intrínseco y me trato con la misma compasión que ofrecería a un ser querido.",
      color: "from-pink-100 to-rose-200",
      illustration: "💝"
    },
    {
      text: "Cada día es una oportunidad para crecer",
      subtext: "Los desafíos son oportunidades de aprendizaje. Confío en mi capacidad de adaptarme y evolucionar.",
      color: "from-green-100 to-emerald-200",
      illustration: "🌱"
    }
  ];

  const handleActivityClick = (activity: DailyActivity) => {
    setSelectedActivity(activity);
    setIsModalOpen(true);
  };

  const handleStartActivity = () => {
    // Redirect to chat or start activity
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <Header />
      
      <main className="pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-2 rounded-full mb-4">
              <Target className="w-5 h-5" />
              <span className="font-semibold">Recursos 100% Gratuitos</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Tu bienestar emocional, cada día
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ejercicios, evaluaciones y contenido profesional sin costo. Porque cuidar tu salud mental debe estar al alcance de todos.
            </p>
          </div>

          {/* Racha Diaria */}
          <Card className="mb-8 p-6 bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Soledad</h3>
                  <p className="text-gray-600">Estado emocional del día</p>
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center space-x-2">
                  <span className="text-3xl">🔥</span>
                  <span className="text-4xl font-bold text-orange-600">0</span>
                </div>
                <p className="text-sm text-gray-600">días de racha</p>
              </div>
            </div>
          </Card>

          {/* Actividades Diarias */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Actividades de hoy</h2>
              <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                6 disponibles
              </Badge>
            </div>

            <div className="space-y-3">
              {dailyActivities.map((activity) => {
                const IconComponent = activity.icon;
                return (
                  <Card
                    key={activity.id}
                    className={`p-4 hover:shadow-lg transition-all duration-300 cursor-pointer ${activity.color}`}
                    onClick={() => handleActivityClick(activity)}
                    data-testid={`card-activity-${activity.id}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className={`w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm`}>
                          <IconComponent className="w-6 h-6 text-gray-700" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {activity.title}
                          </h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <span className="capitalize">{activity.type === 'exercise' ? 'Ejercicio' : activity.type === 'chat' ? 'Chat' : 'Evaluación'}</span>
                            <span>•</span>
                            <span>{activity.duration}</span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Evaluaciones */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Evaluaciones profesionales</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {evaluacionList.map((evaluacion, index) => {
                const IconComponent = evaluacion.icon;
                return (
                  <Card
                    key={index}
                    className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                    onClick={() => window.location.href = "/login"}
                    data-testid={`card-evaluation-${index}`}
                  >
                    <div className={`w-16 h-16 bg-gradient-to-br ${evaluacion.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {evaluacion.title}
                    </h3>
                    <Badge className="bg-gray-100 text-gray-700 border-gray-200">
                      {evaluacion.badge}
                    </Badge>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Afirmaciones del Día */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Afirmaciones del día</h2>
            <div className="space-y-4">
              {afirmaciones.map((afirmacion, index) => (
                <Card
                  key={index}
                  className={`p-8 bg-gradient-to-br ${afirmacion.color} border-none hover:shadow-xl transition-all duration-300`}
                  data-testid={`card-affirmation-${index}`}
                >
                  <div className="flex items-start space-x-6">
                    <div className="text-6xl">{afirmacion.illustration}</div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        {afirmacion.text}
                      </h3>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        {afirmacion.subtext}
                      </p>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white/80 hover:bg-white border-gray-200"
                        >
                          <Share2 className="w-4 h-4 mr-2" />
                          Compartir
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white/80 hover:bg-white border-gray-200"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Guardar
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA Final */}
          <Card className="p-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white border-none">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">
                ¿Quieres acceso completo a NEUROPSI-AI?
              </h2>
              <p className="text-xl text-blue-100 mb-6">
                Desbloquea conversaciones ilimitadas con nuestra IA especializada en salud mental
              </p>
              <Button
                size="lg"
                className="bg-white text-indigo-600 hover:bg-gray-100 font-semibold px-8"
                onClick={() => window.location.href = "/login"}
              >
                Comenzar Ahora
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </Card>
        </div>
      </main>

      {/* Modal de Actividad */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              {selectedActivity?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              {selectedActivity?.description}
            </p>
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                {selectedActivity?.type === 'exercise' ? 'Ejercicio' : selectedActivity?.type === 'chat' ? 'Chat Guiado' : 'Evaluación'}
              </Badge>
              <span>•</span>
              <span>{selectedActivity?.duration}</span>
            </div>
            <Button
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold"
              onClick={handleStartActivity}
              data-testid="button-start-activity"
            >
              Comenzar Ahora
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
