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
  CheckCircle2,
  Clock,
  CalendarDays,
  TreePine,
  Leaf,
  Eye,
  Waves,
  Moon,
  Apple,
  Dumbbell,
  BookOpen,
  Star,
  AlertTriangle,
  X,
  Crown,
  Users,
  Briefcase,
  ArrowRight,
  Shield,
  FileText
} from "lucide-react";
import { Link } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

interface Actividad {
  id: string;
  nombre: string;
  categoria: string;
  categoriaColor: string;
  descripcion: string;
  duracion: string;
  frecuencia: string;
  icono: any;
  pasos: string[];
  beneficios: string[];
}

const actividades: Actividad[] = [
  {
    id: 'bitacora',
    nombre: 'Bitácora de la Mente',
    categoria: 'Activación Emocional',
    categoriaColor: 'bg-amber-100 text-amber-800',
    descripcion: 'Detectar ciclos mentales e identificar distorsiones',
    duracion: '5-10 minutos',
    frecuencia: 'Diario',
    icono: Brain,
    pasos: ['¿Qué sentí hoy?', '¿Qué pensamiento dominó?', '¿Cómo reaccioné?', '¿Qué puedo cambiar?'],
    beneficios: ['Autoconciencia', 'Detección de patrones', 'Claridad mental']
  },
  {
    id: 'mapa-sensorial',
    nombre: 'Mapa Sensorial Diario',
    categoria: 'Activación Emocional',
    categoriaColor: 'bg-amber-100 text-amber-800',
    descripcion: 'Registrar olores, sonidos, sabores, texturas del día',
    duracion: '10 minutos',
    frecuencia: 'Diario',
    icono: Heart,
    pasos: ['Registra 3 olores del día', 'Identifica 3 sonidos significativos', 'Recuerda 2 texturas tocadas', 'Nota sensaciones internas'],
    beneficios: ['Anclaje al presente', 'Reduce rumiación', 'Conexión sensorial']
  },
  {
    id: 'escaner-corporal',
    nombre: 'Escáner Corporal Guiado',
    categoria: 'Regulación Física-Emocional',
    categoriaColor: 'bg-blue-100 text-blue-800',
    descripcion: 'Recorrido consciente desde pies a cabeza',
    duracion: '15 minutos',
    frecuencia: 'Semanal',
    icono: Activity,
    pasos: ['Encuentra posición cómoda', 'Comienza por los pies', 'Sube lentamente al torso', 'Termina en la cabeza'],
    beneficios: ['Relajación', 'Consciencia corporal', 'Reducción estrés']
  },
  {
    id: 'tecnica-54321',
    nombre: 'Técnica 5-4-3-2-1 para Crisis',
    categoria: 'Regulación Física-Emocional',
    categoriaColor: 'bg-blue-100 text-blue-800',
    descripcion: 'Herramienta de grounding para momentos de ansiedad',
    duracion: '5 minutos',
    frecuencia: 'Según necesidad',
    icono: Eye,
    pasos: ['5 cosas que ves', '4 cosas que tocas', '3 sonidos que oyes', '2 olores que percibes', '1 sabor o respiración profunda'],
    beneficios: ['Control de ansiedad', 'Vuelta al presente', 'Calma inmediata']
  },
  {
    id: 'banos-bosque',
    nombre: 'Baños de Bosque (Shinrin-Yoku)',
    categoria: 'Conexión Naturaleza-Mente',
    categoriaColor: 'bg-green-100 text-green-800',
    descripcion: 'Caminata consciente en entorno verde',
    duracion: '30 minutos',
    frecuencia: 'Semanal',
    icono: TreePine,
    pasos: ['Encuentra un espacio verde', 'Camina en silencio', 'Respira aire puro', 'Conecta con la naturaleza'],
    beneficios: ['Reducción cortisol', 'Conexión natural', 'Paz mental']
  },
  {
    id: 'huerto-mental',
    nombre: 'Huerto Mental',
    categoria: 'Conexión Naturaleza-Mente',
    categoriaColor: 'bg-green-100 text-green-800',
    descripcion: 'Plantar y cuidar una planta como metáfora de crecimiento',
    duracion: 'Variable',
    frecuencia: 'Diario',
    icono: Leaf,
    pasos: ['Elige una planta pequeña', 'Cuídala diariamente', 'Observa su crecimiento', 'Registra tus emociones'],
    beneficios: ['Paciencia', 'Cuidado personal', 'Simbolismo positivo']
  }
];

const reglasHigieneMental = [
  { icono: Moon, titulo: 'Sueño como primer tratamiento', descripcion: 'Dormir antes de la 1:00 AM, rutina sin pantallas', color: 'text-blue-600' },
  { icono: Apple, titulo: 'Nutrición emocional', descripcion: 'Alimentos ricos en triptófano: avena, plátano, pescado azul', color: 'text-red-500' },
  { icono: Dumbbell, titulo: 'Ejercicio como fármaco', descripcion: '20 minutos diarios = efecto antidepresivo natural', color: 'text-green-600' }
];

const lecturasRecomendadas = {
  jovenes: [
    { titulo: 'El cerebro adolescente', autor: 'Frances E. Jensen' },
    { titulo: 'Emocionario', autor: 'Cristina Núñez' }
  ],
  adultos: [
    { titulo: 'Más Platón y menos Prozac', autor: 'Lou Marinoff' },
    { titulo: 'Vivir con plenitud las crisis', autor: 'Jon Kabat-Zinn' }
  ]
};

const terapiasRecomendadas = [
  { nombre: 'TCC', descripcion: 'Terapia Cognitivo-Conductual' },
  { nombre: 'ACT', descripcion: 'Aceptación y Compromiso' },
  { nombre: 'EMDR', descripcion: 'Para trauma' },
  { nombre: 'Terapia Sistémica', descripcion: 'Para relaciones' }
];

const alertasClinicas = [
  'Tristeza diaria > 14 días',
  'Insomnio persistente',
  'Ideación suicida o de inutilidad',
  'Aislamiento social',
  'Ansiedad intensa en lugares comunes',
  'Reacciones explosivas fuera de contexto'
];

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
  const [selectedActividad, setSelectedActividad] = useState<Actividad | null>(null);

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

          {/* Sección de Actividades Integrales */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Activación integral de recursos psicológicos y neurales
              </h2>
              <p className="text-gray-600">para el bienestar personal</p>
              
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                <Badge className="bg-gray-100 text-gray-700">Neuropsicología</Badge>
                <Badge className="bg-gray-100 text-gray-700">TCC</Badge>
                <Badge className="bg-gray-100 text-gray-700">Mindfulness</Badge>
                <Badge className="bg-gray-100 text-gray-700">ACT</Badge>
              </div>
            </div>

            <Tabs defaultValue="actividades" className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-1 mb-6 bg-gray-100 h-auto p-1">
                <TabsTrigger value="actividades" data-testid="tab-actividades">Actividades</TabsTrigger>
                <TabsTrigger value="recomendaciones" data-testid="tab-recomendaciones">Recomendaciones</TabsTrigger>
                <TabsTrigger value="alertas" data-testid="tab-alertas">Alertas</TabsTrigger>
                <TabsTrigger value="recursos" data-testid="tab-recursos">Recursos</TabsTrigger>
              </TabsList>

              {/* Tab Actividades */}
              <TabsContent value="actividades">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {actividades.map((actividad) => {
                    const IconComponent = actividad.icono;
                    return (
                      <Card
                        key={actividad.id}
                        className="p-5 hover:shadow-lg transition-all cursor-pointer bg-gradient-to-br from-white to-gray-50 border border-gray-200"
                        onClick={() => setSelectedActividad(actividad)}
                        data-testid={`card-actividad-${actividad.id}`}
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                            <IconComponent className="w-5 h-5 text-gray-700" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-900 text-sm leading-tight">{actividad.nombre}</h4>
                            <Badge className={`${actividad.categoriaColor} text-xs mt-1`}>
                              {actividad.categoria}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{actividad.descripcion}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{actividad.duracion}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <CalendarDays className="w-3 h-3" />
                            <span>{actividad.frecuencia}</span>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              {/* Tab Recomendaciones */}
              <TabsContent value="recomendaciones">
                {/* Reglas de Higiene Mental */}
                <Card className="p-6 mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Sun className="w-5 h-5 text-yellow-500" />
                    <h3 className="text-lg font-bold text-gray-900">Reglas Básicas de Higiene Mental</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">Basadas en la Guía de Práctica Clínica del SNS y neuroplasticidad</p>
                  <div className="space-y-4">
                    {reglasHigieneMental.map((regla, index) => {
                      const IconComponent = regla.icono;
                      return (
                        <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <IconComponent className={`w-5 h-5 ${regla.color} flex-shrink-0 mt-0.5`} />
                          <div>
                            <h4 className="font-semibold text-gray-900 text-sm">{regla.titulo}</h4>
                            <p className="text-gray-600 text-sm">{regla.descripcion}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>

                {/* Lecturas y Terapias */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-bold text-gray-900">Lecturas Recomendadas</h3>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-700 text-sm mb-2">Para usuarios jóvenes</h4>
                      {lecturasRecomendadas.jovenes.map((libro, index) => (
                        <div key={index} className="flex items-center gap-2 mb-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          <span className="text-sm"><strong>{libro.titulo}</strong> - {libro.autor}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-700 text-sm mb-2">Adultos en crisis</h4>
                      {lecturasRecomendadas.adultos.map((libro, index) => (
                        <div key={index} className="flex items-center gap-2 mb-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          <span className="text-sm"><strong>{libro.titulo}</strong> - {libro.autor}</span>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Star className="w-5 h-5 text-amber-500" />
                      <h3 className="text-lg font-bold text-gray-900">Terapias Recomendadas</h3>
                    </div>
                    <div className="space-y-3">
                      {terapiasRecomendadas.map((terapia, index) => (
                        <div key={index} className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                          <Star className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-bold text-gray-900 text-sm">{terapia.nombre}</h4>
                            <p className="text-gray-600 text-xs">{terapia.descripcion}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </TabsContent>

              {/* Tab Alertas */}
              <TabsContent value="alertas">
                <Card className="p-6 bg-red-50 border-red-200">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                    <h3 className="text-xl font-bold text-red-800">Indicadores de Alerta Clínica</h3>
                  </div>
                  <p className="text-red-700 text-sm mb-6">
                    Si aparece alguno de estos síntomas: derivación inmediata a psicólogo o médico
                  </p>
                  <div className="space-y-3">
                    {alertasClinicas.map((alerta, index) => (
                      <div 
                        key={index} 
                        className="flex items-center gap-3 p-4 bg-red-100 border border-red-200 rounded-lg"
                      >
                        <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <span className="text-red-800 font-medium">{alerta}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              {/* Tab Recursos */}
              <TabsContent value="recursos">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Líneas de Ayuda</h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="font-bold text-blue-800">Teléfono de la Esperanza</p>
                        <p className="text-blue-600 text-lg font-mono">717 003 717</p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="font-bold text-green-800">Emergencias</p>
                        <p className="text-green-600 text-lg font-mono">112</p>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <p className="font-bold text-purple-800">Atención al menor</p>
                        <p className="text-purple-600 text-lg font-mono">116 111</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Apps Complementarias</h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="font-semibold text-gray-800">Headspace</p>
                        <p className="text-gray-600 text-sm">Meditación guiada</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="font-semibold text-gray-800">Calm</p>
                        <p className="text-gray-600 text-sm">Relajación y sueño</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="font-semibold text-gray-800">Insight Timer</p>
                        <p className="text-gray-600 text-sm">Meditación gratuita</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Modal Actividad Detalle */}
          <Dialog open={!!selectedActividad} onOpenChange={() => setSelectedActividad(null)}>
            <DialogContent className="max-w-md">
              {selectedActividad && (
                <>
                  <DialogHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                        <selectedActividad.icono className="w-6 h-6 text-gray-700" />
                      </div>
                      <div>
                        <DialogTitle className="text-xl">{selectedActividad.nombre}</DialogTitle>
                        <Badge className={`${selectedActividad.categoriaColor} text-xs mt-1`}>
                          {selectedActividad.categoria}
                        </Badge>
                      </div>
                    </div>
                  </DialogHeader>
                  
                  <p className="text-gray-600">{selectedActividad.descripcion}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{selectedActividad.duracion}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CalendarDays className="w-4 h-4" />
                      <span>{selectedActividad.frecuencia}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-900 mb-3">Pasos a seguir:</h4>
                    <div className="space-y-2">
                      {selectedActividad.pasos.map((paso, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600 flex-shrink-0">
                            {index + 1}
                          </span>
                          <span className="text-gray-700">{paso}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-900 mb-3">Beneficios:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedActividad.beneficios.map((beneficio, index) => (
                        <Badge key={index} variant="outline" className="bg-gray-50">
                          {beneficio}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>

          {/* Tarjeta Empresas y Empleados - Riesgos Psicosociales */}
          <Card className="mb-10 relative overflow-hidden border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 shadow-xl">
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-400/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
            
            <div className="relative p-6 md:p-8">
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-600 rounded-xl">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                    Para Empresas y Empleados
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Riesgos psicosociales laborales · ISO 45003
                  </p>
                </div>
              </div>

              {/* Grid de 6 riesgos */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {/* 1. Estrés laboral */}
                <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">😰</span>
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm">Estrés laboral crónico</h3>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    Carga excesiva, plazos imposibles, falta de control.
                  </p>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">Ansiedad</Badge>
                    <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">Insomnio</Badge>
                  </div>
                </div>

                {/* 2. Burnout */}
                <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">🔥</span>
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm">Burnout</h3>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    No es cansancio. Es quemarse por dentro.
                  </p>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">Cinismo</Badge>
                    <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">Fatiga</Badge>
                  </div>
                </div>

                {/* 3. Acoso laboral */}
                <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">⚠️</span>
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm">Acoso laboral (mobbing)</h3>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    Violencia psicológica: aislamiento, desacreditación.
                  </p>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">Depresión</Badge>
                    <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">TEPT</Badge>
                  </div>
                </div>

                {/* 4. Inseguridad laboral */}
                <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">📋</span>
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm">Inseguridad y precariedad</h3>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    Contrato basura = mente en alerta permanente.
                  </p>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">Ansiedad</Badge>
                    <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">Bloqueo</Badge>
                  </div>
                </div>

                {/* 5. Falta de reconocimiento */}
                <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">👻</span>
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm">Falta de reconocimiento</h3>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    Trabajar sin sentido: trituradora silenciosa.
                  </p>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs bg-gray-100 text-gray-700 border-gray-300">Desmotivación</Badge>
                    <Badge variant="outline" className="text-xs bg-gray-100 text-gray-700 border-gray-300">Depresión</Badge>
                  </div>
                </div>

                {/* 6. Riesgos organizativos */}
                <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">🏢</span>
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm">Riesgos organizativos</h3>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    Liderazgos tóxicos, cultura del miedo, caos.
                  </p>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs bg-indigo-50 text-indigo-700 border-indigo-200">Toxicidad</Badge>
                    <Badge variant="outline" className="text-xs bg-indigo-50 text-indigo-700 border-indigo-200">Confusión</Badge>
                  </div>
                </div>
              </div>

              {/* Footer con CTA */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong className="text-blue-700 dark:text-blue-400">NUXA para empresas:</strong> Guías, tests orientativos y estrategias de prevención
                </p>
                <Link href="/precios">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                    Ver planes empresas
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          {/* Tarjeta de Recursos Premium */}
          <Card className="mb-10 relative overflow-hidden border-0 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 shadow-2xl">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-yellow-400/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl" />
            
            <div className="relative p-8 md:p-10">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Left content */}
                <div className="space-y-5">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                    <Crown className="w-4 h-4" />
                    <span>Recursos Premium en el Chat</span>
                  </div>
                  
                  <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                    ¿No te apetece chatear? Accede a recursos profesionales
                  </h2>
                  
                  <p className="text-lg text-white/90 leading-relaxed">
                    Con cualquier plan NUXA, tienes acceso a <strong>guías, ejercicios y protocolos profesionales</strong> dentro del chat. 
                    Solo tienes que pedirlos.
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-white">
                      <div className="p-2 bg-white/20 rounded-lg flex-shrink-0">
                        <Heart className="w-5 h-5" />
                      </div>
                      <span><strong>Para ti:</strong> Técnicas de relajación, mindfulness, gestión emocional</span>
                    </div>
                    <div className="flex items-center gap-3 text-white">
                      <div className="p-2 bg-white/20 rounded-lg flex-shrink-0">
                        <Users className="w-5 h-5" />
                      </div>
                      <span><strong>Para tu familia:</strong> Comunicación, crianza, apoyo a adolescentes</span>
                    </div>
                    <div className="flex items-center gap-3 text-white">
                      <div className="p-2 bg-white/20 rounded-lg flex-shrink-0">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <span><strong>Para tu empresa:</strong> Gestión del estrés laboral, burnout, liderazgo</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 pt-2">
                    <Link href="/precios">
                      <Button 
                        size="lg" 
                        className="w-full sm:w-auto bg-white text-emerald-700 hover:bg-gray-100 font-bold text-lg px-8 py-6 shadow-xl"
                        data-testid="button-recursos-premium"
                      >
                        Escoge tu plan
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                  </div>
                  
                  <p className="text-white/70 text-sm">
                    Sin permanencia · Cancela cuando quieras · También pago por uso
                  </p>
                </div>
                
                {/* Right content - Examples */}
                <div className="space-y-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Ejemplos de lo que puedes pedir:
                    </h3>
                    <ul className="space-y-3 text-white/90 text-sm">
                      <li className="flex items-start gap-3">
                        <span className="text-emerald-300 font-bold">→</span>
                        <span>"Dame una guía de respiración para la ansiedad"</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-emerald-300 font-bold">→</span>
                        <span>"Necesito ejercicios para hablar con mi hijo adolescente"</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-emerald-300 font-bold">→</span>
                        <span>"Dame técnicas para gestionar el estrés en el trabajo"</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-emerald-300 font-bold">→</span>
                        <span>"Quiero un plan de autocuidado semanal"</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-emerald-300 font-bold">→</span>
                        <span>"Explícame cómo ayudar a alguien con depresión"</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-yellow-400/20 backdrop-blur-sm rounded-xl p-4 border border-yellow-400/30">
                    <p className="text-white text-center font-medium text-sm">
                      <Shield className="w-4 h-4 inline mr-2" />
                      Recursos basados en protocolos clínicos reales
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
    </>
  );
}
