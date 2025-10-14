import { useState, useEffect } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { 
  Heart, 
  Brain, 
  Target,
  MessageCircle,
  Sparkles,
  Calendar,
  Download,
  Share2,
  ChevronRight,
  Activity,
  Sun,
  Smile,
  Meh,
  Frown,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SEOHead } from "@/components/SEOHead";

interface Emotion {
  id: string;
  name: string;
  emoji: string;
  color: string;
}

interface EvaluationQuestion {
  id: string;
  text: string;
  options: { value: number; label: string }[];
}

export default function RecursosGratis() {
  const { toast } = useToast();
  const [currentView, setCurrentView] = useState<'main' | 'emotional-log' | 'affirmation' | 'evaluation'>('main');
  const [selectedEmotion, setSelectedEmotion] = useState<string>('');
  const [emotionalNote, setEmotionalNote] = useState('');
  const [currentAffirmationIndex, setCurrentAffirmationIndex] = useState(0);
  const [streak, setStreak] = useState(0);
  const [evaluationType, setEvaluationType] = useState<'ansiedad' | 'depresion' | 'autoestima'>('ansiedad');
  const [evaluationAnswers, setEvaluationAnswers] = useState<Record<string, number>>({});
  const [evaluationResult, setEvaluationResult] = useState<number | null>(null);

  const emotions: Emotion[] = [
    { id: 'feliz', name: 'Feliz', emoji: '😊', color: 'bg-green-100 hover:bg-green-200 border-green-300' },
    { id: 'tranquilo', name: 'Tranquilo', emoji: '😌', color: 'bg-blue-100 hover:bg-blue-200 border-blue-300' },
    { id: 'ansioso', name: 'Ansioso', emoji: '😰', color: 'bg-yellow-100 hover:bg-yellow-200 border-yellow-300' },
    { id: 'triste', name: 'Triste', emoji: '😢', color: 'bg-purple-100 hover:bg-purple-200 border-purple-300' },
    { id: 'enojado', name: 'Enojado', emoji: '😠', color: 'bg-red-100 hover:bg-red-200 border-red-300' },
    { id: 'solo', name: 'Solo', emoji: '😔', color: 'bg-gray-100 hover:bg-gray-200 border-gray-300' },
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
    },
    {
      text: "Mis emociones son válidas y merecen ser escuchadas",
      subtext: "No tengo que justificar lo que siento. Acepto mis emociones como mensajeros que me ayudan a comprenderme mejor.",
      color: "from-purple-100 to-violet-200",
      illustration: "🦋"
    },
    {
      text: "Tengo el poder de crear cambios positivos en mi vida",
      subtext: "Cada pequeña acción cuenta. Confío en mi capacidad para tomar decisiones que mejoren mi bienestar.",
      color: "from-amber-100 to-yellow-200",
      illustration: "⚡"
    }
  ];

  const evaluationQuestions: Record<string, EvaluationQuestion[]> = {
    ansiedad: [
      {
        id: 'q1',
        text: '¿Con qué frecuencia te sientes nervioso/a o ansioso/a?',
        options: [
          { value: 0, label: 'Nunca' },
          { value: 1, label: 'Raramente' },
          { value: 2, label: 'A veces' },
          { value: 3, label: 'Frecuentemente' },
          { value: 4, label: 'Siempre' }
        ]
      },
      {
        id: 'q2',
        text: '¿Te resulta difícil controlar tus preocupaciones?',
        options: [
          { value: 0, label: 'Nunca' },
          { value: 1, label: 'Raramente' },
          { value: 2, label: 'A veces' },
          { value: 3, label: 'Frecuentemente' },
          { value: 4, label: 'Siempre' }
        ]
      },
      {
        id: 'q3',
        text: '¿Experimentas tensión muscular o inquietud?',
        options: [
          { value: 0, label: 'Nunca' },
          { value: 1, label: 'Raramente' },
          { value: 2, label: 'A veces' },
          { value: 3, label: 'Frecuentemente' },
          { value: 4, label: 'Siempre' }
        ]
      },
      {
        id: 'q4',
        text: '¿Tienes dificultad para concentrarte debido a la ansiedad?',
        options: [
          { value: 0, label: 'Nunca' },
          { value: 1, label: 'Raramente' },
          { value: 2, label: 'A veces' },
          { value: 3, label: 'Frecuentemente' },
          { value: 4, label: 'Siempre' }
        ]
      }
    ],
    depresion: [
      {
        id: 'q1',
        text: '¿Con qué frecuencia te sientes triste o sin esperanza?',
        options: [
          { value: 0, label: 'Nunca' },
          { value: 1, label: 'Raramente' },
          { value: 2, label: 'A veces' },
          { value: 3, label: 'Frecuentemente' },
          { value: 4, label: 'Siempre' }
        ]
      },
      {
        id: 'q2',
        text: '¿Has perdido interés en actividades que antes disfrutabas?',
        options: [
          { value: 0, label: 'Nunca' },
          { value: 1, label: 'Raramente' },
          { value: 2, label: 'A veces' },
          { value: 3, label: 'Frecuentemente' },
          { value: 4, label: 'Siempre' }
        ]
      },
      {
        id: 'q3',
        text: '¿Experimentas cambios en tu apetito o sueño?',
        options: [
          { value: 0, label: 'Nunca' },
          { value: 1, label: 'Raramente' },
          { value: 2, label: 'A veces' },
          { value: 3, label: 'Frecuentemente' },
          { value: 4, label: 'Siempre' }
        ]
      },
      {
        id: 'q4',
        text: '¿Te sientes cansado/a o sin energía la mayor parte del tiempo?',
        options: [
          { value: 0, label: 'Nunca' },
          { value: 1, label: 'Raramente' },
          { value: 2, label: 'A veces' },
          { value: 3, label: 'Frecuentemente' },
          { value: 4, label: 'Siempre' }
        ]
      }
    ],
    autoestima: [
      {
        id: 'q1',
        text: '¿Te sientes satisfecho/a contigo mismo/a?',
        options: [
          { value: 4, label: 'Siempre' },
          { value: 3, label: 'Frecuentemente' },
          { value: 2, label: 'A veces' },
          { value: 1, label: 'Raramente' },
          { value: 0, label: 'Nunca' }
        ]
      },
      {
        id: 'q2',
        text: '¿Crees que tienes cualidades positivas?',
        options: [
          { value: 4, label: 'Siempre' },
          { value: 3, label: 'Frecuentemente' },
          { value: 2, label: 'A veces' },
          { value: 1, label: 'Raramente' },
          { value: 0, label: 'Nunca' }
        ]
      },
      {
        id: 'q3',
        text: '¿Te comparas negativamente con otras personas?',
        options: [
          { value: 0, label: 'Nunca' },
          { value: 1, label: 'Raramente' },
          { value: 2, label: 'A veces' },
          { value: 3, label: 'Frecuentemente' },
          { value: 4, label: 'Siempre' }
        ]
      },
      {
        id: 'q4',
        text: '¿Sientes que mereces respeto y amor?',
        options: [
          { value: 4, label: 'Siempre' },
          { value: 3, label: 'Frecuentemente' },
          { value: 2, label: 'A veces' },
          { value: 1, label: 'Raramente' },
          { value: 0, label: 'Nunca' }
        ]
      }
    ]
  };

  useEffect(() => {
    const savedStreak = localStorage.getItem('nflow-streak');
    const lastVisit = localStorage.getItem('nflow-last-visit');
    const today = new Date().toDateString();

    if (lastVisit === today) {
      setStreak(parseInt(savedStreak || '0'));
    } else if (lastVisit && new Date(lastVisit).getTime() < new Date().getTime() - 86400000) {
      localStorage.setItem('nflow-streak', '0');
      setStreak(0);
    }
  }, []);

  const saveEmotionalLog = () => {
    if (!selectedEmotion) {
      toast({
        title: "Selecciona una emoción",
        description: "Por favor selecciona cómo te sientes hoy",
        variant: "destructive"
      });
      return;
    }

    const today = new Date().toDateString();
    const lastVisit = localStorage.getItem('nflow-last-visit');
    let isNewDay = false;
    let finalStreak = streak;
    
    if (lastVisit !== today) {
      finalStreak = streak + 1;
      localStorage.setItem('nflow-streak', finalStreak.toString());
      localStorage.setItem('nflow-last-visit', today);
      setStreak(finalStreak);
      isNewDay = true;
    }

    const emotionLog = {
      emotion: selectedEmotion,
      note: emotionalNote,
      date: new Date().toISOString()
    };

    const existingLogs = JSON.parse(localStorage.getItem('nflow-emotion-logs') || '[]');
    existingLogs.push(emotionLog);
    localStorage.setItem('nflow-emotion-logs', JSON.stringify(existingLogs));

    toast({
      title: "¡Registro guardado!",
      description: isNewDay 
        ? `¡Nueva racha! Llevas ${finalStreak} día${finalStreak !== 1 ? 's' : ''} consecutivos`
        : "Tu registro emocional ha sido guardado",
    });

    setCurrentView('main');
    setSelectedEmotion('');
    setEmotionalNote('');
  };

  const calculateEvaluationScore = () => {
    const questions = evaluationQuestions[evaluationType];
    const totalAnswered = Object.keys(evaluationAnswers).length;

    if (totalAnswered < questions.length) {
      toast({
        title: "Completa todas las preguntas",
        description: "Por favor responde todas las preguntas para ver tu resultado",
        variant: "destructive"
      });
      return;
    }

    const totalScore = Object.values(evaluationAnswers).reduce((sum, val) => sum + val, 0);
    const maxScore = questions.length * 4;
    const percentage = (totalScore / maxScore) * 100;

    setEvaluationResult(percentage);
  };

  const getResultMessage = (percentage: number) => {
    if (evaluationType === 'autoestima') {
      if (percentage >= 75) return { level: 'Alta', message: 'Tu autoestima está en un nivel saludable. Continúa cuidando de ti mismo/a.', color: 'text-green-600', icon: CheckCircle2 };
      if (percentage >= 50) return { level: 'Media', message: 'Tu autoestima está en un nivel moderado. Hay espacio para fortalecer tu amor propio.', color: 'text-yellow-600', icon: Meh };
      return { level: 'Baja', message: 'Podrías beneficiarte de trabajar en tu autoestima. Considera hablar con un profesional.', color: 'text-red-600', icon: AlertCircle };
    } else {
      if (percentage >= 75) return { level: 'Severo', message: 'Tus síntomas parecen significativos. Te recomendamos buscar apoyo profesional.', color: 'text-red-600', icon: AlertCircle };
      if (percentage >= 50) return { level: 'Moderado', message: 'Experimentas algunos síntomas. Podría ser útil hablar con un profesional.', color: 'text-yellow-600', icon: Meh };
      return { level: 'Leve', message: 'Tus síntomas son leves. Continúa monitoreando tu bienestar emocional.', color: 'text-green-600', icon: CheckCircle2 };
    }
  };

  const handleShare = (text: string, subtext: string) => {
    if (navigator.share) {
      navigator.share({ 
        title: text, 
        text: `${text}\n\n${subtext}\n\n- Afirmación del día de NFLOW` 
      });
    } else {
      navigator.clipboard.writeText(`${text}\n\n${subtext}`);
      toast({
        title: "¡Copiado!",
        description: "La afirmación se ha copiado al portapapeles"
      });
    }
  };

  const handleDownload = (text: string, subtext: string) => {
    const blob = new Blob([`${text}\n\n${subtext}\n\n- Afirmación del día de NFLOW`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'afirmacion-nflow.txt';
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "¡Descargado!",
      description: "La afirmación se ha guardado en tu dispositivo"
    });
  };

  if (currentView === 'emotional-log') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        <Header />
        <main className="pt-24 pb-12 px-4">
          <div className="max-w-2xl mx-auto">
            <Button
              variant="ghost"
              onClick={() => setCurrentView('main')}
              className="mb-6"
              data-testid="button-back-to-main"
            >
              ← Volver
            </Button>

            <Card className="p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                ¿Cómo te sientes hoy?
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {emotions.map((emotion) => (
                  <Card
                    key={emotion.id}
                    className={`p-6 cursor-pointer transition-all ${
                      selectedEmotion === emotion.id 
                        ? 'ring-4 ring-blue-500 scale-105' 
                        : emotion.color
                    }`}
                    onClick={() => setSelectedEmotion(emotion.id)}
                    data-testid={`emotion-${emotion.id}`}
                  >
                    <div className="text-center">
                      <div className="text-5xl mb-2">{emotion.emoji}</div>
                      <p className="font-semibold text-gray-700">{emotion.name}</p>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="mb-6">
                <Label className="text-lg font-semibold mb-2 block">
                  ¿Quieres agregar una nota? (opcional)
                </Label>
                <Textarea
                  placeholder="Escribe cómo te sientes, qué ha pasado hoy, o cualquier pensamiento que quieras registrar..."
                  value={emotionalNote}
                  onChange={(e) => setEmotionalNote(e.target.value)}
                  rows={4}
                  data-testid="textarea-emotional-note"
                />
              </div>

              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                onClick={saveEmotionalLog}
                data-testid="button-save-emotional-log"
              >
                Guardar Registro
              </Button>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (currentView === 'affirmation') {
    const affirmation = afirmaciones[currentAffirmationIndex];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        <Header />
        <main className="pt-24 pb-12 px-4">
          <div className="max-w-3xl mx-auto">
            <Button
              variant="ghost"
              onClick={() => setCurrentView('main')}
              className="mb-6"
              data-testid="button-back-to-main"
            >
              ← Volver
            </Button>

            <Card className={`p-12 bg-gradient-to-br ${affirmation.color} border-none`}>
              <div className="text-center mb-8">
                <div className="text-8xl mb-6">{affirmation.illustration}</div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  {affirmation.text}
                </h2>
                <p className="text-xl text-gray-700 leading-relaxed">
                  {affirmation.subtext}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  variant="outline"
                  className="bg-white/80 hover:bg-white"
                  onClick={() => handleShare(affirmation.text, affirmation.subtext)}
                  data-testid="button-share-affirmation"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Compartir
                </Button>
                <Button
                  variant="outline"
                  className="bg-white/80 hover:bg-white"
                  onClick={() => handleDownload(affirmation.text, affirmation.subtext)}
                  data-testid="button-download-affirmation"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Guardar
                </Button>
                <Button
                  variant="outline"
                  className="bg-white/80 hover:bg-white"
                  onClick={() => setCurrentAffirmationIndex((prev) => (prev + 1) % afirmaciones.length)}
                  data-testid="button-next-affirmation"
                >
                  <ChevronRight className="w-4 h-4 mr-2" />
                  Siguiente
                </Button>
              </div>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (currentView === 'evaluation') {
    const questions = evaluationQuestions[evaluationType];
    const progress = (Object.keys(evaluationAnswers).length / questions.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        <Header />
        <main className="pt-24 pb-12 px-4">
          <div className="max-w-3xl mx-auto">
            <Button
              variant="ghost"
              onClick={() => {
                setCurrentView('main');
                setEvaluationAnswers({});
                setEvaluationResult(null);
              }}
              className="mb-6"
              data-testid="button-back-to-main"
            >
              ← Volver
            </Button>

            <Card className="p-8">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Evaluación de {evaluationType}
                </h2>
                <p className="text-gray-600 mb-4">
                  Responde honestamente para obtener una evaluación precisa
                </p>
                <Progress value={progress} className="h-2" />
              </div>

              {!evaluationResult ? (
                <>
                  <div className="space-y-8 mb-6">
                    {questions.map((question, index) => (
                      <div key={question.id} className="space-y-3">
                        <Label className="text-lg font-semibold">
                          {index + 1}. {question.text}
                        </Label>
                        <RadioGroup
                          value={evaluationAnswers[question.id]?.toString()}
                          onValueChange={(value) => 
                            setEvaluationAnswers(prev => ({ ...prev, [question.id]: parseInt(value) }))
                          }
                        >
                          {question.options.map((option) => (
                            <div key={option.value} className="flex items-center space-x-2">
                              <RadioGroupItem 
                                value={option.value.toString()} 
                                id={`${question.id}-${option.value}`}
                                data-testid={`radio-${question.id}-${option.value}`}
                              />
                              <Label 
                                htmlFor={`${question.id}-${option.value}`}
                                className="cursor-pointer"
                              >
                                {option.label}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    ))}
                  </div>

                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                    onClick={calculateEvaluationScore}
                    data-testid="button-calculate-result"
                  >
                    Ver Resultado
                  </Button>
                </>
              ) : (
                <div className="text-center py-8">
                  {(() => {
                    const result = getResultMessage(evaluationResult);
                    const ResultIcon = result.icon;
                    return (
                      <>
                        <ResultIcon className={`w-20 h-20 mx-auto mb-4 ${result.color}`} />
                        <h3 className="text-2xl font-bold mb-2">Nivel: {result.level}</h3>
                        <p className="text-lg text-gray-600 mb-6">{result.message}</p>
                        <div className="bg-gray-100 rounded-lg p-4 mb-6">
                          <p className="text-sm text-gray-600">
                            Esta evaluación es solo informativa. Para un diagnóstico profesional, consulta con un especialista en salud mental.
                          </p>
                        </div>
                        <Button
                          onClick={() => {
                            setEvaluationAnswers({});
                            setEvaluationResult(null);
                          }}
                          variant="outline"
                          data-testid="button-retake-evaluation"
                        >
                          Volver a evaluar
                        </Button>
                      </>
                    );
                  })()}
                </div>
              )}
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title="Recursos Gratis - NFLOW | Herramientas de Bienestar"
        description="Accede gratis a herramientas de bienestar emocional: registro emocional, afirmaciones diarias, tests de ansiedad y depresión. Sin necesidad de registro."
        keywords="recursos salud mental gratis, test ansiedad gratis, test depresión, afirmaciones positivas, registro emocional"
        ogTitle="Recursos Gratis de Salud Mental - NFLOW"
        canonicalUrl="https://nflow.style/recursos"
      />
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
              Ejercicios, evaluaciones y contenido profesional sin costo. Todo funciona directamente en tu navegador, sin necesidad de registro.
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
                  <h3 className="text-2xl font-bold text-gray-900">Tu Racha Diaria</h3>
                  <p className="text-gray-600">Días consecutivos cuidando tu salud mental</p>
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center space-x-2">
                  <span className="text-3xl">🔥</span>
                  <span className="text-4xl font-bold text-orange-600" data-testid="streak-count">{streak}</span>
                </div>
                <p className="text-sm text-gray-600">días de racha</p>
              </div>
            </div>
          </Card>

          {/* Actividades Principales */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card 
              className="p-8 hover:shadow-xl transition-all cursor-pointer bg-gradient-to-br from-orange-50 to-pink-50 border-orange-100"
              onClick={() => setCurrentView('emotional-log')}
              data-testid="card-emotional-log"
            >
              <Heart className="w-12 h-12 text-orange-500 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Registro Emocional
              </h3>
              <p className="text-gray-600 mb-4">
                Registra cómo te sientes hoy. Toma conciencia de tus emociones y construye tu racha diaria.
              </p>
              <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                30 segundos
              </Badge>
            </Card>

            <Card 
              className="p-8 hover:shadow-xl transition-all cursor-pointer bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100"
              onClick={() => setCurrentView('affirmation')}
              data-testid="card-affirmation"
            >
              <Sparkles className="w-12 h-12 text-purple-500 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Afirmación del Día
              </h3>
              <p className="text-gray-600 mb-4">
                Comienza tu día con una afirmación positiva que fortalecerá tu bienestar emocional.
              </p>
              <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                1 minuto
              </Badge>
            </Card>
          </div>

          {/* Evaluaciones */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Evaluaciones profesionales</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <Card
                className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={() => {
                  setEvaluationType('ansiedad');
                  setCurrentView('evaluation');
                  setEvaluationAnswers({});
                  setEvaluationResult(null);
                }}
                data-testid="card-evaluation-ansiedad"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Evaluación de ansiedad
                </h3>
                <Badge className="bg-gray-100 text-gray-700 border-gray-200">
                  5 min
                </Badge>
              </Card>

              <Card
                className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={() => {
                  setEvaluationType('depresion');
                  setCurrentView('evaluation');
                  setEvaluationAnswers({});
                  setEvaluationResult(null);
                }}
                data-testid="card-evaluation-depresion"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Evaluación de depresión
                </h3>
                <Badge className="bg-gray-100 text-gray-700 border-gray-200">
                  5 min
                </Badge>
              </Card>

              <Card
                className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={() => {
                  setEvaluationType('autoestima');
                  setCurrentView('evaluation');
                  setEvaluationAnswers({});
                  setEvaluationResult(null);
                }}
                data-testid="card-evaluation-autoestima"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Evaluación de autoestima
                </h3>
                <Badge className="bg-gray-100 text-gray-700 border-gray-200">
                  5 min
                </Badge>
              </Card>
            </div>
          </div>

          {/* CTA Final */}
          <Card className="p-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white border-none">
            <div className="text-center">
              <Brain className="w-16 h-16 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">
                ¿Necesitas apoyo profesional personalizado?
              </h2>
              <p className="text-xl text-blue-100 mb-6">
                Accede a NEUROPSI-AI, nuestra IA especializada en salud mental con conversaciones ilimitadas y seguimiento personalizado
              </p>
              <Button
                size="lg"
                className="bg-white text-indigo-600 hover:bg-gray-100 font-semibold px-8"
                onClick={() => window.location.href = "/login"}
                data-testid="button-cta-premium"
              >
                Comenzar Ahora
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
    </>
  );
}
