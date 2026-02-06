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
  FileText,
  Globe,
  Phone
} from "lucide-react";
import { Link } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { SEOHead } from "@/components/SEOHead";
import nuxaF1Img from "@assets/image_1768242728947.png";

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
  const [currentView, setCurrentView] = useState<'main' | 'emotional-log' | 'affirmation' | 'evaluation' | 'emotion-history' | 'breathing' | 'gratitude' | 'bad-day' | 'grounding' | 'bilateral' | 'iso-check'>('main');
  const [selectedEmotion, setSelectedEmotion] = useState<string>('');
  const [emotionalNote, setEmotionalNote] = useState('');
  const [currentAffirmationIndex, setCurrentAffirmationIndex] = useState(0);
  const [streak, setStreak] = useState(0);
  const [evaluationType, setEvaluationType] = useState<'ansiedad' | 'depresion' | 'autoestima'>('ansiedad');
  const [evaluationAnswers, setEvaluationAnswers] = useState<Record<string, number>>({});
  const [evaluationResult, setEvaluationResult] = useState<number | null>(null);
  const [selectedActividad, setSelectedActividad] = useState<Actividad | null>(null);
  const [showHelpLinesModal, setShowHelpLinesModal] = useState(false);
  
  // New features states
  const [emotionHistory, setEmotionHistory] = useState<Array<{emotion: string; note: string; date: string}>>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [breathingPhase, setBreathingPhase] = useState<'idle' | 'inhale' | 'hold' | 'exhale'>('idle');
  const [breathingCount, setBreathingCount] = useState(0);
  const [breathingTechnique, setBreathingTechnique] = useState<'4-7-8' | 'box' | 'coherence'>('4-7-8');
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [gratitudeItems, setGratitudeItems] = useState<string[]>(['', '', '']);
  const [todayGratitudeSaved, setTodayGratitudeSaved] = useState(false);
  
  // New features: grounding, bilateral, ISO check
  const [groundingStep, setGroundingStep] = useState(0);
  const [groundingInputs, setGroundingInputs] = useState<string[]>(['', '', '', '', '']);
  const [bilateralActive, setBilateralActive] = useState(false);
  const [bilateralSide, setBilateralSide] = useState<'left' | 'right'>('left');
  const [bilateralSpeed, setBilateralSpeed] = useState<'slow' | 'medium' | 'fast'>('medium');
  const [isoAnswers, setIsoAnswers] = useState<number[]>([2, 2, 2, 2, 2, 2]);
  const [isoResult, setIsoResult] = useState<{level: string; score: number; recommendations: string[]} | null>(null);
  const [showBibliographyModal, setShowBibliographyModal] = useState(false);

  // Bibliography data by topic
  const bibliographyData = {
    ansiedad: [
      { title: "El poder del ahora", author: "Eckhart Tolle", description: "Guía para vivir en el presente y reducir la ansiedad anticipatoria." },
      { title: "Mindfulness para principiantes", author: "Jon Kabat-Zinn", description: "Introducción práctica a la atención plena para calmar la mente." },
      { title: "Ansiedad: cómo enfrentar el mal del siglo", author: "Daniel López Rosetti", description: "Comprensión médica y psicológica de la ansiedad con estrategias prácticas." },
      { title: "La trampa de la felicidad", author: "Russ Harris", description: "Terapia de Aceptación y Compromiso (ACT) aplicada a la ansiedad." }
    ],
    depresion: [
      { title: "Salir del abismo", author: "Rafael Santandreu", description: "Técnicas cognitivo-conductuales para superar la depresión." },
      { title: "El demonio de la depresión", author: "Andrew Solomon", description: "Exploración profunda de la depresión desde múltiples perspectivas." },
      { title: "La auténtica felicidad", author: "Martin Seligman", description: "Psicología positiva aplicada para construir bienestar duradero." },
      { title: "Mindfulness y ciencia", author: "Vicente Simón", description: "Base científica de la meditación para la salud mental." }
    ],
    estres: [
      { title: "El estrés laboral", author: "Francisco Gil-Monte", description: "Análisis del síndrome de burnout y estrategias de prevención." },
      { title: "La trampa del trabajo", author: "Bryan E. Robinson", description: "Cómo identificar y superar la adicción al trabajo." },
      { title: "Mindfulness en la vida cotidiana", author: "Jon Kabat-Zinn", description: "Aplicación de la atención plena en el día a día laboral." },
      { title: "Trabajar sin sufrir", author: "Christophe Dejours", description: "Psicodinámica del trabajo y bienestar ocupacional." }
    ]
  };

  // Check URL params to auto-open helplines modal
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('helplines') === 'true') {
      setShowHelpLinesModal(true);
    }
  }, []);

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
    
    // Load emotion history
    const logs = JSON.parse(localStorage.getItem('nflow-emotion-logs') || '[]');
    setEmotionHistory(logs);
    
    // Check if gratitude was saved today
    const savedGratitude = localStorage.getItem('nflow-gratitude-today');
    if (savedGratitude === today) {
      setTodayGratitudeSaved(true);
      const todayItems = JSON.parse(localStorage.getItem('nflow-gratitude-items') || '["","",""]');
      setGratitudeItems(todayItems);
    }
  }, []);
  
  // Breathing exercise effect
  useEffect(() => {
    if (!isBreathingActive) return;
    
    const techniques = {
      '4-7-8': { inhale: 4, hold: 7, exhale: 8 },
      'box': { inhale: 4, hold: 4, exhale: 4 },
      'coherence': { inhale: 5, hold: 0, exhale: 5 }
    };
    
    const timing = techniques[breathingTechnique];
    let phase: 'inhale' | 'hold' | 'exhale' = 'inhale';
    let seconds = timing.inhale;
    
    setBreathingPhase('inhale');
    setBreathingCount(timing.inhale);
    
    const interval = setInterval(() => {
      seconds--;
      
      // Check for phase transition before updating count
      if (seconds <= 0) {
        if (phase === 'inhale' && timing.hold > 0) {
          phase = 'hold';
          seconds = timing.hold;
          setBreathingPhase('hold');
        } else if ((phase === 'inhale' && timing.hold === 0) || phase === 'hold') {
          phase = 'exhale';
          seconds = timing.exhale;
          setBreathingPhase('exhale');
        } else if (phase === 'exhale') {
          phase = 'inhale';
          seconds = timing.inhale;
          setBreathingPhase('inhale');
        }
      }
      
      // Update count after potential transition
      setBreathingCount(seconds);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isBreathingActive, breathingTechnique]);

  // Bilateral stimulation effect
  useEffect(() => {
    if (!bilateralActive) return;
    
    const speeds = { slow: 1200, medium: 800, fast: 500 };
    const interval = setInterval(() => {
      setBilateralSide(prev => prev === 'left' ? 'right' : 'left');
    }, speeds[bilateralSpeed]);
    
    return () => clearInterval(interval);
  }, [bilateralActive, bilateralSpeed]);

  // ISO 45003 calculation
  const calculateIsoResult = () => {
    const avg = isoAnswers.reduce((a, b) => a + b, 0) / isoAnswers.length;
    const riskScore = 4 - avg;
    
    let level = "Bajo";
    let recommendations = [
      "Mantener rutinas de descanso y límites razonables.",
      "Revisar carga de trabajo periódicamente.",
      "Refuerzo de reconocimiento y comunicación clara."
    ];
    
    if (riskScore >= 1.6 && riskScore < 2.8) {
      level = "Medio";
      recommendations = [
        "Revisar carga, plazos y autonomía (ajustes rápidos).",
        "Formación breve en liderazgo y prevención de desgaste.",
        "Canal de conflictos seguro y trazable.",
        "Evaluar distribución de tareas y recursos."
      ];
    }
    
    if (riskScore >= 2.8) {
      level = "Alto";
      recommendations = [
        "Evaluación psicosocial formal y plan de acción con responsables.",
        "Medidas inmediatas: carga, horarios, rol y recursos.",
        "Intervención sobre liderazgo tóxico / cultura del miedo.",
        "Seguimiento con indicadores y revisiones periódicas.",
        "Considerar apoyo psicológico para el equipo."
      ];
    }
    
    setIsoResult({ level, score: riskScore, recommendations });
  };

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
    
    // Update emotion history state immediately so calendar reflects new entry
    setEmotionHistory(existingLogs);

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

  const saveGratitude = () => {
    const filledItems = gratitudeItems.filter(item => item.trim() !== '');
    if (filledItems.length === 0) {
      toast({
        title: "Escribe al menos una cosa",
        description: "Por favor escribe al menos una cosa por la que estés agradecido/a",
        variant: "destructive"
      });
      return;
    }

    const today = new Date().toDateString();
    localStorage.setItem('nflow-gratitude-today', today);
    localStorage.setItem('nflow-gratitude-items', JSON.stringify(gratitudeItems));
    
    // Save to history
    const gratitudeHistory = JSON.parse(localStorage.getItem('nflow-gratitude-history') || '[]');
    gratitudeHistory.push({
      items: gratitudeItems.filter(i => i.trim()),
      date: new Date().toISOString()
    });
    localStorage.setItem('nflow-gratitude-history', JSON.stringify(gratitudeHistory));
    
    setTodayGratitudeSaved(true);
    
    toast({
      title: "¡Gratitud guardada!",
      description: "Tu diario de gratitud de hoy ha sido guardado"
    });
  };

  const getEmotionEmoji = (emotionId: string) => {
    const emotion = emotions.find(e => e.id === emotionId);
    return emotion?.emoji || '📅';
  };

  const getMonthDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    return { daysInMonth, startingDay };
  };

  const getEmotionForDay = (day: number) => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    const targetDate = new Date(year, month, day).toDateString();
    
    const logs = emotionHistory.filter(log => {
      const logDate = new Date(log.date).toDateString();
      return logDate === targetDate;
    });
    
    return logs.length > 0 ? logs[logs.length - 1] : null;
  };

  // Emotion History View
  if (currentView === 'emotion-history') {
    const { daysInMonth, startingDay } = getMonthDays(selectedMonth);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const emptyDays = Array.from({ length: startingDay }, (_, i) => i);
    
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    
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
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                📅 Historial Emocional
              </h2>
              <p className="text-gray-600 mb-6">Visualiza tus emociones registradas en el calendario</p>
              
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-6">
                <Button
                  variant="outline"
                  onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1))}
                >
                  ← Anterior
                </Button>
                <h3 className="text-xl font-bold text-gray-800">
                  {monthNames[selectedMonth.getMonth()]} {selectedMonth.getFullYear()}
                </h3>
                <Button
                  variant="outline"
                  onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1))}
                >
                  Siguiente →
                </Button>
              </div>
              
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2 mb-6">
                {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                  <div key={day} className="text-center text-sm font-semibold text-gray-500 py-2">
                    {day}
                  </div>
                ))}
                
                {emptyDays.map(i => (
                  <div key={`empty-${i}`} className="aspect-square"></div>
                ))}
                
                {days.map(day => {
                  const log = getEmotionForDay(day);
                  const isToday = new Date().toDateString() === new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), day).toDateString();
                  
                  return (
                    <div
                      key={day}
                      className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm transition-all ${
                        isToday ? 'ring-2 ring-blue-500 bg-blue-50' : 'bg-gray-50 hover:bg-gray-100'
                      } ${log ? 'cursor-pointer' : ''}`}
                      title={log?.note || ''}
                    >
                      <span className="text-gray-600 text-xs">{day}</span>
                      {log && (
                        <span className="text-xl">{getEmotionEmoji(log.emotion)}</span>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {/* Legend */}
              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-700 mb-3">Leyenda de emociones:</h4>
                <div className="flex flex-wrap gap-3">
                  {emotions.map(emotion => (
                    <div key={emotion.id} className="flex items-center gap-1 text-sm">
                      <span className="text-lg">{emotion.emoji}</span>
                      <span className="text-gray-600">{emotion.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Stats */}
              <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl">
                <h4 className="font-semibold text-gray-700 mb-2">Resumen del mes:</h4>
                <p className="text-gray-600">
                  Has registrado <span className="font-bold text-purple-600">
                    {emotionHistory.filter(log => {
                      const logDate = new Date(log.date);
                      return logDate.getMonth() === selectedMonth.getMonth() && 
                             logDate.getFullYear() === selectedMonth.getFullYear();
                    }).length}
                  </span> emociones este mes
                </p>
              </div>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Breathing Exercise View
  if (currentView === 'breathing') {
    const phaseColors = {
      idle: 'from-gray-200 to-gray-300',
      inhale: 'from-blue-400 to-cyan-500',
      hold: 'from-purple-400 to-violet-500',
      exhale: 'from-teal-400 to-green-500'
    };
    
    const phaseText = {
      idle: 'Preparado',
      inhale: 'INHALA',
      hold: 'MANTÉN',
      exhale: 'EXHALA'
    };
    
    const techniqueInfo = {
      '4-7-8': { name: 'Técnica 4-7-8', desc: 'Inhala 4s, mantén 7s, exhala 8s. Ideal para dormir.' },
      'box': { name: 'Respiración Cuadrada', desc: 'Inhala 4s, mantén 4s, exhala 4s. Reduce ansiedad.' },
      'coherence': { name: 'Coherencia Cardíaca', desc: 'Inhala 5s, exhala 5s. Equilibra el sistema nervioso.' }
    };
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        <Header />
        <main className="pt-24 pb-12 px-4">
          <div className="max-w-2xl mx-auto">
            <Button
              variant="ghost"
              onClick={() => {
                setCurrentView('main');
                setIsBreathingActive(false);
                setBreathingPhase('idle');
              }}
              className="mb-6"
              data-testid="button-back-to-main"
            >
              ← Volver
            </Button>

            <Card className="p-8 text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                🌬️ Ejercicios de Respiración
              </h2>
              <p className="text-gray-600 mb-8">Técnicas de respiración guiada para reducir el estrés</p>
              
              {/* Technique Selector */}
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {(Object.keys(techniqueInfo) as Array<'4-7-8' | 'box' | 'coherence'>).map(tech => (
                  <Button
                    key={tech}
                    variant={breathingTechnique === tech ? 'default' : 'outline'}
                    onClick={() => {
                      setBreathingTechnique(tech);
                      setIsBreathingActive(false);
                      setBreathingPhase('idle');
                    }}
                    className={breathingTechnique === tech ? 'bg-gradient-to-r from-blue-500 to-purple-500' : ''}
                    disabled={isBreathingActive}
                  >
                    {techniqueInfo[tech].name}
                  </Button>
                ))}
              </div>
              
              <p className="text-sm text-gray-500 mb-8">{techniqueInfo[breathingTechnique].desc}</p>
              
              {/* Animated Circle */}
              <div className="relative w-64 h-64 mx-auto mb-8">
                <div 
                  className={`absolute inset-0 rounded-full bg-gradient-to-br ${phaseColors[breathingPhase]} transition-all duration-1000 flex items-center justify-center ${
                    isBreathingActive && breathingPhase === 'inhale' ? 'scale-110' : 
                    isBreathingActive && breathingPhase === 'exhale' ? 'scale-90' : 'scale-100'
                  }`}
                  style={{
                    boxShadow: isBreathingActive ? '0 0 60px rgba(99, 102, 241, 0.5)' : 'none'
                  }}
                >
                  <div className="text-center text-white">
                    <div className="text-5xl font-bold mb-2">
                      {isBreathingActive ? breathingCount : '•'}
                    </div>
                    <div className="text-xl font-semibold uppercase tracking-wider">
                      {phaseText[breathingPhase]}
                    </div>
                  </div>
                </div>
                
                {/* Pulsing ring animation */}
                {isBreathingActive && (
                  <div className={`absolute inset-0 rounded-full border-4 animate-ping opacity-20 ${
                    breathingPhase === 'inhale' ? 'border-blue-400' : 
                    breathingPhase === 'hold' ? 'border-purple-400' : 'border-green-400'
                  }`}></div>
                )}
              </div>
              
              {/* Control Button */}
              <Button
                size="lg"
                onClick={() => setIsBreathingActive(!isBreathingActive)}
                className={`text-lg px-12 ${
                  isBreathingActive 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
                }`}
              >
                {isBreathingActive ? '⏹ Detener' : '▶ Comenzar'}
              </Button>
              
              {/* Tips */}
              <div className="mt-8 p-4 bg-gray-50 rounded-xl text-left">
                <h4 className="font-semibold text-gray-700 mb-2">💡 Consejos:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Siéntate cómodo con la espalda recta</li>
                  <li>• Respira por la nariz si es posible</li>
                  <li>• Practica 3-5 minutos para mejores resultados</li>
                </ul>
              </div>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Gratitude Journal View
  if (currentView === 'gratitude') {
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
              <div className="text-center mb-8">
                <span className="text-6xl mb-4 block">🙏</span>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Diario de Gratitud
                </h2>
                <p className="text-gray-600">
                  Escribe 3 cosas por las que estés agradecido/a hoy
                </p>
              </div>
              
              {todayGratitudeSaved ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">¡Ya has escrito tu gratitud de hoy!</h3>
                  <div className="bg-green-50 rounded-xl p-6 mt-6 text-left">
                    <h4 className="font-semibold text-green-800 mb-3">Tus agradecimientos de hoy:</h4>
                    {gratitudeItems.filter(i => i.trim()).map((item, index) => (
                      <div key={index} className="flex items-start gap-2 mb-2">
                        <span className="text-green-500">✓</span>
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    className="mt-6"
                    onClick={() => {
                      // Clear localStorage so changes persist on refresh
                      localStorage.removeItem('nflow-gratitude-today');
                      localStorage.removeItem('nflow-gratitude-items');
                      setTodayGratitudeSaved(false);
                      setGratitudeItems(['', '', '']);
                    }}
                  >
                    Escribir de nuevo
                  </Button>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {[0, 1, 2].map(index => (
                      <div key={index} className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <Textarea
                          placeholder={`¿Por qué estás agradecido/a? ${index === 0 ? '(ej: Mi familia, mi salud...)' : ''}`}
                          value={gratitudeItems[index]}
                          onChange={(e) => {
                            const newItems = [...gratitudeItems];
                            newItems[index] = e.target.value;
                            setGratitudeItems(newItems);
                          }}
                          className="pl-16 min-h-[60px]"
                        />
                      </div>
                    ))}
                  </div>

                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                    onClick={saveGratitude}
                  >
                    💛 Guardar mi gratitud
                  </Button>
                  
                  <div className="mt-6 p-4 bg-amber-50 rounded-xl">
                    <h4 className="font-semibold text-amber-800 mb-2">🌟 Beneficios del diario de gratitud:</h4>
                    <ul className="text-sm text-amber-700 space-y-1">
                      <li>• Mejora el estado de ánimo y bienestar general</li>
                      <li>• Reduce el estrés y la ansiedad</li>
                      <li>• Fortalece las relaciones personales</li>
                      <li>• Mejora la calidad del sueño</li>
                    </ul>
                  </div>
                </>
              )}
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Bad Day - Emergency Protocol View
  if (currentView === 'bad-day') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50 to-rose-50">
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
              <div className="text-center mb-8">
                <span className="text-6xl mb-4 block">🆘</span>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  No estoy bien hoy
                </h2>
                <p className="text-gray-600">
                  Vamos a lo básico. No hay que "arreglarlo todo". Solo bajar el volumen.
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <Card className="p-5 bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-100">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">1</div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">🫁 Respira 2 minutos</h3>
                      <p className="text-gray-600 text-sm mb-3">La respiración lenta activa el sistema nervioso parasimpático y baja la alerta.</p>
                      <Button 
                        size="sm" 
                        className="bg-blue-500 hover:bg-blue-600"
                        onClick={() => {
                          setBreathingTechnique('4-7-8');
                          setCurrentView('breathing');
                        }}
                      >
                        Ir a respiración guiada
                      </Button>
                    </div>
                  </div>
                </Card>

                <Card className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 border-green-100">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">2</div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">🧩 Grounding 5-4-3-2-1</h3>
                      <p className="text-gray-600 text-sm mb-3">Usa tus sentidos para volver al presente. Funciona muy bien para ansiedad.</p>
                      <Button 
                        size="sm" 
                        className="bg-green-500 hover:bg-green-600"
                        onClick={() => {
                          setGroundingStep(0);
                          setGroundingInputs(['', '', '', '', '']);
                          setCurrentView('grounding');
                        }}
                      >
                        Ir a Grounding
                      </Button>
                    </div>
                  </div>
                </Card>

                <Card className="p-5 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-100">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">3</div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">🚿 Una acción pequeña</h3>
                      <p className="text-gray-600 text-sm">
                        Elige una cosa pequeña que puedas hacer ahora mismo:
                      </p>
                      <ul className="text-sm text-gray-600 mt-2 space-y-1">
                        <li>• Beber un vaso de agua</li>
                        <li>• Ducharte o lavarte la cara</li>
                        <li>• Abrir una ventana</li>
                        <li>• Caminar 3 minutos</li>
                        <li>• Cambiar de habitación</li>
                      </ul>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-800 mb-1">Si hay riesgo real</h4>
                    <p className="text-sm text-red-700">
                      Si tienes ideas de hacerte daño, descontrol severo o crisis intensa, pide ayuda profesional inmediata. 
                      <Button 
                        variant="link" 
                        className="text-red-700 underline p-0 h-auto font-semibold"
                        onClick={() => setShowHelpLinesModal(true)}
                      >
                        Ver líneas de ayuda
                      </Button>
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Grounding 5-4-3-2-1 View
  if (currentView === 'grounding') {
    const groundingSteps = [
      { count: 5, sense: 'VER', icon: '👁️', prompt: '5 cosas que puedas VER ahora mismo', color: 'from-blue-500 to-cyan-500' },
      { count: 4, sense: 'TOCAR', icon: '✋', prompt: '4 cosas que puedas TOCAR', color: 'from-green-500 to-emerald-500' },
      { count: 3, sense: 'OÍR', icon: '👂', prompt: '3 cosas que puedas OÍR', color: 'from-purple-500 to-violet-500' },
      { count: 2, sense: 'OLER', icon: '👃', prompt: '2 cosas que puedas OLER', color: 'from-amber-500 to-orange-500' },
      { count: 1, sense: 'SABOREAR', icon: '👅', prompt: '1 cosa que puedas SABOREAR', color: 'from-pink-500 to-rose-500' }
    ];
    
    const currentStep = groundingSteps[groundingStep];
    const isComplete = groundingStep >= 5;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-emerald-50">
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
              <div className="text-center mb-8">
                <span className="text-6xl mb-4 block">🧩</span>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Grounding 5-4-3-2-1
                </h2>
                <p className="text-gray-600">
                  Usa tus sentidos para anclarte al presente
                </p>
              </div>

              {/* Progress */}
              <div className="flex justify-center gap-2 mb-8">
                {groundingSteps.map((step, idx) => (
                  <div 
                    key={idx}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold transition-all ${
                      idx < groundingStep 
                        ? 'bg-green-500 text-white' 
                        : idx === groundingStep 
                          ? `bg-gradient-to-r ${step.color} text-white scale-110` 
                          : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {idx < groundingStep ? '✓' : step.count}
                  </div>
                ))}
              </div>

              {isComplete ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">¡Ejercicio completado!</h3>
                  <p className="text-gray-600 mb-6">
                    Has recorrido tus 5 sentidos y estás más conectado/a con el presente.
                  </p>
                  <div className="bg-green-50 rounded-xl p-4 mb-6">
                    <p className="text-green-800 text-sm">
                      💡 <strong>Tip:</strong> Repite este ejercicio cada vez que sientas que tu mente se acelera o te desconectas del momento presente.
                    </p>
                  </div>
                  <Button 
                    onClick={() => {
                      setGroundingStep(0);
                      setGroundingInputs(['', '', '', '', '']);
                    }}
                    className="bg-gradient-to-r from-green-500 to-emerald-500"
                  >
                    Repetir ejercicio
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className={`bg-gradient-to-r ${currentStep.color} rounded-2xl p-6 text-white text-center`}>
                    <div className="text-5xl mb-3">{currentStep.icon}</div>
                    <h3 className="text-2xl font-bold mb-2">{currentStep.prompt}</h3>
                    <p className="text-white/80 text-sm">
                      Nombra {currentStep.count} cosa{currentStep.count > 1 ? 's' : ''} en voz alta o escríbelo abajo
                    </p>
                  </div>

                  <Textarea
                    placeholder={`Escribe ${currentStep.count} cosa${currentStep.count > 1 ? 's' : ''} que puedas ${currentStep.sense.toLowerCase()}...`}
                    value={groundingInputs[groundingStep]}
                    onChange={(e) => {
                      const newInputs = [...groundingInputs];
                      newInputs[groundingStep] = e.target.value;
                      setGroundingInputs(newInputs);
                    }}
                    rows={3}
                    className="text-lg"
                  />

                  <div className="flex gap-3">
                    {groundingStep > 0 && (
                      <Button 
                        variant="outline"
                        onClick={() => setGroundingStep(prev => prev - 1)}
                      >
                        ← Anterior
                      </Button>
                    )}
                    <Button 
                      className={`flex-1 bg-gradient-to-r ${currentStep.color}`}
                      onClick={() => setGroundingStep(prev => prev + 1)}
                    >
                      {groundingStep === 4 ? 'Finalizar' : 'Siguiente →'}
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Bilateral Stimulation View
  if (currentView === 'bilateral') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-violet-50">
        <Header />
        <main className="pt-24 pb-12 px-4">
          <div className="max-w-2xl mx-auto">
            <Button
              variant="ghost"
              onClick={() => {
                setBilateralActive(false);
                setCurrentView('main');
              }}
              className="mb-6"
              data-testid="button-back-to-main"
            >
              ← Volver
            </Button>

            <Card className="p-8">
              <div className="text-center mb-8">
                <span className="text-6xl mb-4 block">👆</span>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Estimulación Bilateral
                </h2>
                <p className="text-gray-600">
                  Sigue el punto con los ojos (tipo EMDR). Ayuda a regular emociones intensas.
                </p>
              </div>

              {/* Speed selector */}
              <div className="flex justify-center gap-2 mb-8">
                <Button
                  variant={bilateralSpeed === 'slow' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setBilateralSpeed('slow')}
                >
                  🐢 Lento
                </Button>
                <Button
                  variant={bilateralSpeed === 'medium' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setBilateralSpeed('medium')}
                >
                  🚶 Medio
                </Button>
                <Button
                  variant={bilateralSpeed === 'fast' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setBilateralSpeed('fast')}
                >
                  🏃 Rápido
                </Button>
              </div>

              {/* Visual stimulus */}
              <div className="bg-gray-900 rounded-2xl p-8 mb-6 h-48 relative overflow-hidden">
                <div 
                  className={`absolute top-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full shadow-lg shadow-purple-500/50 transition-all ${
                    bilateralActive 
                      ? bilateralSpeed === 'slow' 
                        ? 'duration-[1200ms]' 
                        : bilateralSpeed === 'medium' 
                          ? 'duration-[800ms]' 
                          : 'duration-[500ms]'
                      : 'duration-300'
                  }`}
                  style={{
                    left: bilateralActive 
                      ? bilateralSide === 'left' ? '10%' : 'calc(90% - 48px)'
                      : '50%',
                    transform: bilateralActive 
                      ? 'translateY(-50%)' 
                      : 'translate(-50%, -50%)'
                  }}
                />
                {!bilateralActive && (
                  <div className="absolute inset-0 flex items-center justify-center text-white/60 text-sm">
                    Pulsa "Iniciar" para comenzar
                  </div>
                )}
              </div>

              <div className="flex justify-center gap-4 mb-6">
                <Button
                  size="lg"
                  className={bilateralActive 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600'
                  }
                  onClick={() => setBilateralActive(!bilateralActive)}
                >
                  {bilateralActive ? '⏹ Detener' : '▶ Iniciar'}
                </Button>
              </div>

              <div className="bg-purple-50 rounded-xl p-4">
                <h4 className="font-semibold text-purple-800 mb-2">💡 Cómo usar:</h4>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>• Sigue el punto con los ojos sin mover la cabeza</li>
                  <li>• Respira con calma mientras miras</li>
                  <li>• Si te cansas, cierra los ojos unos segundos</li>
                  <li>• Haz entre 1-3 minutos según necesites</li>
                </ul>
              </div>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ISO 45003 Check View
  if (currentView === 'iso-check') {
    const isoQuestions = [
      { id: 0, text: '¿Cómo percibes tu carga de trabajo?', low: 'Muy alta', high: 'Adecuada' },
      { id: 1, text: '¿Tienes claridad sobre tu rol y responsabilidades?', low: 'Nada claro', high: 'Muy claro' },
      { id: 2, text: '¿Tienes autonomía para tomar decisiones en tu trabajo?', low: 'Ninguna', high: 'Mucha' },
      { id: 3, text: '¿Cómo es el apoyo de tus superiores/compañeros?', low: 'Muy malo', high: 'Excelente' },
      { id: 4, text: '¿Cómo calificarías el clima laboral?', low: 'Muy tóxico', high: 'Muy positivo' },
      { id: 5, text: '¿Puedes conciliar tu vida laboral y personal?', low: 'Imposible', high: 'Perfectamente' }
    ];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100">
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
              <div className="text-center mb-8">
                <span className="text-6xl mb-4 block">📋</span>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Autochequeo ISO 45003
                </h2>
                <p className="text-gray-600">
                  Evalúa tu riesgo psicosocial en el trabajo (orientativo)
                </p>
              </div>

              {isoResult ? (
                <div className="space-y-6">
                  <div className={`text-center p-6 rounded-2xl ${
                    isoResult.level === 'Bajo' 
                      ? 'bg-green-100 border-2 border-green-300' 
                      : isoResult.level === 'Medio' 
                        ? 'bg-amber-100 border-2 border-amber-300' 
                        : 'bg-red-100 border-2 border-red-300'
                  }`}>
                    <div className="text-4xl mb-2">
                      {isoResult.level === 'Bajo' ? '🟢' : isoResult.level === 'Medio' ? '🟡' : '🔴'}
                    </div>
                    <h3 className={`text-2xl font-bold ${
                      isoResult.level === 'Bajo' 
                        ? 'text-green-800' 
                        : isoResult.level === 'Medio' 
                          ? 'text-amber-800' 
                          : 'text-red-800'
                    }`}>
                      Riesgo {isoResult.level}
                    </h3>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-5">
                    <h4 className="font-semibold text-gray-900 mb-3">📌 Recomendaciones:</h4>
                    <ul className="space-y-2">
                      {isoResult.recommendations.map((rec, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-700">
                          <span className="text-blue-500">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-slate-100 rounded-xl p-4">
                    <p className="text-xs text-gray-500 text-center">
                      Este resultado es orientativo basado en el enfoque ISO 45003. Para decisiones organizativas, 
                      se recomienda una evaluación psicosocial formal por profesionales.
                    </p>
                  </div>

                  <Button 
                    className="w-full"
                    variant="outline"
                    onClick={() => {
                      setIsoAnswers([2, 2, 2, 2, 2, 2]);
                      setIsoResult(null);
                    }}
                  >
                    Repetir evaluación
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {isoQuestions.map((q) => (
                    <div key={q.id} className="space-y-2">
                      <label className="font-medium text-gray-900">{q.text}</label>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-500 w-20">{q.low}</span>
                        <input
                          type="range"
                          min="0"
                          max="4"
                          value={isoAnswers[q.id]}
                          onChange={(e) => {
                            const newAnswers = [...isoAnswers];
                            newAnswers[q.id] = parseInt(e.target.value);
                            setIsoAnswers(newAnswers);
                          }}
                          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                        <span className="text-xs text-gray-500 w-20 text-right">{q.high}</span>
                      </div>
                    </div>
                  ))}

                  <Button 
                    size="lg"
                    className="w-full bg-gradient-to-r from-slate-600 to-gray-700 hover:from-slate-700 hover:to-gray-800"
                    onClick={calculateIsoResult}
                  >
                    📊 Calcular resultado
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
          
          {/* NUXA Racing Banner - Top */}
          <div className="mb-10 overflow-hidden rounded-3xl shadow-2xl">
            {/* Mobile: Stack layout */}
            <div className="md:hidden">
              <img 
                src={nuxaF1Img} 
                alt="NUXA - Tu bienestar, tu decisión" 
                className="w-full h-48 object-cover object-right"
              />
              <div className="bg-gradient-to-b from-slate-800 to-slate-900 p-6">
                <p className="text-lime-400 text-xs font-bold mb-2 tracking-wider">🏎️ NUXA · TU RITMO, TU CAMINO</p>
                <h2 className="text-lg font-bold text-white mb-3 leading-tight">
                  Con o sin psicofármacos, pero siempre psicoterapia. Lo importante es encontrarse bien.
                </h2>
                <p className="text-white/90 text-sm mb-2 leading-relaxed">
                  No importa lo que piensen de ti. Hay cosas que se comparten en la intimidad, no con todo el mundo.
                </p>
                <p className="text-white/70 text-xs italic mb-3">
                  A nadie le importa si vas o no al psicólogo. Lo que importa es lo que tú decidas explicar, y a quién, si lo necesitas.
                </p>
                <p className="text-gray-400 text-xs border-t border-white/20 pt-3">
                  With or without medication. What matters is feeling well. You decide what to share and with whom.
                </p>
              </div>
            </div>
            {/* Desktop: Overlay layout */}
            <div className="hidden md:block relative">
              <img 
                src={nuxaF1Img} 
                alt="NUXA - Tu bienestar, tu decisión" 
                className="w-full h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent flex items-center">
                <div className="p-12 max-w-2xl">
                  <p className="text-lime-400 text-sm font-bold mb-3 tracking-wider">🏎️ NUXA · TU RITMO, TU CAMINO</p>
                  <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
                    Con o sin psicofármacos, pero siempre psicoterapia.<br/>
                    Lo importante es encontrarse bien.
                  </h2>
                  <p className="text-white/90 text-base mb-3 leading-relaxed">
                    No importa lo que piensen de ti. Hay cosas que se comparten en la intimidad, no con todo el mundo.
                  </p>
                  <p className="text-white/70 text-sm italic">
                    A nadie le importa si vas o no al psicólogo. Lo que importa es lo que tú decidas explicar, y a quién, si lo necesitas.
                  </p>
                  <p className="text-gray-400 text-xs mt-4 border-t border-white/20 pt-3">
                    With or without medication. What matters is feeling well. You decide what to share and with whom.
                  </p>
                </div>
              </div>
            </div>
          </div>

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
                Reflexiona sobre cómo te sientes hoy. Tus registros se guardan en este navegador para tu seguimiento personal.
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

          {/* Nuevas Herramientas */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card 
              className="p-6 hover:shadow-xl transition-all cursor-pointer bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100"
              onClick={() => setCurrentView('emotion-history')}
              data-testid="card-emotion-history"
            >
              <Calendar className="w-10 h-10 text-blue-500 mb-3" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Historial Emocional
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Visualiza tus emociones en un calendario mensual con emojis
              </p>
              <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                📅 Calendario
              </Badge>
            </Card>

            <Card 
              className="p-6 hover:shadow-xl transition-all cursor-pointer bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-100"
              onClick={() => setCurrentView('breathing')}
              data-testid="card-breathing"
            >
              <Activity className="w-10 h-10 text-teal-500 mb-3" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Respiración Guiada
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Ejercicios animados de respiración para reducir el estrés
              </p>
              <Badge className="bg-teal-100 text-teal-700 border-teal-200">
                🌬️ 3 técnicas
              </Badge>
            </Card>

            <Card 
              className="p-6 hover:shadow-xl transition-all cursor-pointer bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100"
              onClick={() => setCurrentView('gratitude')}
              data-testid="card-gratitude"
            >
              <Star className="w-10 h-10 text-amber-500 mb-3" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Diario de Gratitud
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Escribe 3 cosas positivas del día para mejorar tu bienestar
              </p>
              <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                🙏 Diario
              </Badge>
            </Card>
          </div>

          {/* Regulación y Emergencias */}
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Regulación y Emergencias</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <Card 
              className="p-6 hover:shadow-xl transition-all cursor-pointer bg-gradient-to-br from-red-50 to-rose-50 border-red-100"
              onClick={() => setCurrentView('bad-day')}
              data-testid="card-bad-day"
            >
              <AlertTriangle className="w-10 h-10 text-red-500 mb-3" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                🆘 Día Malo
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Protocolo de emergencia suave cuando no estás bien
              </p>
              <Badge className="bg-red-100 text-red-700 border-red-200">
                Primeros auxilios
              </Badge>
            </Card>

            <Card 
              className="p-6 hover:shadow-xl transition-all cursor-pointer bg-gradient-to-br from-orange-50 to-amber-50 border-orange-100"
              onClick={() => {
                toast({
                  title: "🚦 Señales de Alerta",
                  description: (
                    <div className="mt-2 text-sm">
                      <p className="font-semibold mb-2">Si pasa esto, pide ayuda profesional:</p>
                      <ul className="list-disc pl-4 space-y-1">
                        <li>Empeoras rápido o cada día estás peor</li>
                        <li>Ideas de hacerte daño o no querer seguir</li>
                        <li>Aislamiento extremo</li>
                        <li>Insomnio casi total varios días</li>
                        <li>Crisis de pánico repetidas</li>
                        <li>Consumo de sustancias para aguantar</li>
                      </ul>
                      <p className="mt-3 text-xs text-gray-500">La gente fuerte también pide ayuda.</p>
                    </div>
                  ),
                  duration: 15000
                });
              }}
              data-testid="card-alerts"
            >
              <Shield className="w-10 h-10 text-orange-500 mb-3" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                🚦 Señales de Alerta
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Cuándo parar y buscar ayuda profesional
              </p>
              <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                Seguridad
              </Badge>
            </Card>

            <Card 
              className="p-6 hover:shadow-xl transition-all cursor-pointer bg-gradient-to-br from-green-50 to-emerald-50 border-green-100"
              onClick={() => {
                setGroundingStep(0);
                setGroundingInputs(['', '', '', '', '']);
                setCurrentView('grounding');
              }}
              data-testid="card-grounding"
            >
              <Eye className="w-10 h-10 text-green-500 mb-3" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                🧩 Grounding 5-4-3-2-1
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Técnica de anclaje sensorial para volver al presente
              </p>
              <Badge className="bg-green-100 text-green-700 border-green-200">
                Ansiedad
              </Badge>
            </Card>

            <Card 
              className="p-6 hover:shadow-xl transition-all cursor-pointer bg-gradient-to-br from-purple-50 to-violet-50 border-purple-100"
              onClick={() => {
                setBilateralActive(false);
                setBilateralSide('left');
                setCurrentView('bilateral');
              }}
              data-testid="card-bilateral"
            >
              <Waves className="w-10 h-10 text-purple-500 mb-3" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                👆 Estimulación Bilateral
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Tapping visual para regulación emocional (tipo EMDR)
              </p>
              <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                Regulación
              </Badge>
            </Card>

            <Card 
              className="p-6 hover:shadow-xl transition-all cursor-pointer bg-gradient-to-br from-slate-50 to-gray-100 border-slate-200"
              onClick={() => {
                setIsoAnswers([2, 2, 2, 2, 2, 2]);
                setIsoResult(null);
                setCurrentView('iso-check');
              }}
              data-testid="card-iso-check"
            >
              <Briefcase className="w-10 h-10 text-slate-600 mb-3" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                📋 Autochequeo ISO 45003
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Evalúa tu riesgo psicosocial en el trabajo
              </p>
              <Badge className="bg-slate-100 text-slate-700 border-slate-300">
                Empresas
              </Badge>
            </Card>

            <Card 
              className="p-6 hover:shadow-xl transition-all cursor-pointer bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-100"
              onClick={() => setShowBibliographyModal(true)}
              data-testid="card-bibliography"
            >
              <BookOpen className="w-10 h-10 text-amber-600 mb-3" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                📚 Bibliografía Recomendada
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Lecturas básicas sobre ansiedad, depresión y estrés laboral
              </p>
              <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                Autoayuda
              </Badge>
            </Card>
          </div>

          {/* Evaluaciones */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Screening Orientativo</h2>
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
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <Card className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Globe className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-bold text-gray-900">Líneas de Ayuda Nacionales e Internacionales</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🇪🇸</span>
                          <p className="font-bold text-blue-800">Teléfono de la Esperanza</p>
                        </div>
                        <p className="text-blue-600 text-lg font-mono">717 003 717</p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🆘</span>
                          <p className="font-bold text-green-800">Emergencias</p>
                        </div>
                        <p className="text-green-600 text-lg font-mono">112</p>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">👧</span>
                          <p className="font-bold text-purple-800">Atención al menor</p>
                        </div>
                        <p className="text-purple-600 text-lg font-mono">116 111</p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => setShowHelpLinesModal(true)}
                      className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      data-testid="button-show-helplines"
                    >
                      <Globe className="w-4 h-4 mr-2" />
                      Ver todas las líneas internacionales
                    </Button>
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

                {/* Artículo sobre Resiliencia */}
                <Card className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Resiliencia: Concepto, bases y desarrollo práctico</h3>
                      <p className="text-sm text-emerald-700">Recurso psicoeducativo</p>
                    </div>
                  </div>

                  <div className="space-y-6 text-gray-700">
                    <div>
                      <h4 className="font-bold text-emerald-800 mb-2">¿Qué es la resiliencia?</h4>
                      <p className="text-sm leading-relaxed">
                        La resiliencia es la capacidad de superar, adaptarse y recuperarse de situaciones adversas —traumas, pérdidas, estrés intenso— manteniendo un funcionamiento psicológico, social y vital adecuado. No es una cualidad heroica ni un don reservado a unos pocos. Es un proceso dinámico, aprendible y entrenable.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-bold text-emerald-800 mb-2">Bases de la resiliencia</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-3 bg-white/60 rounded-lg">
                          <p className="font-semibold text-emerald-700 text-sm mb-1">🧠 Biológicas</p>
                          <p className="text-xs text-gray-600">Sistemas de regulación del estrés, neurotransmisores, corteza prefrontal, hipocampo, amígdala y microbioma intestinal.</p>
                        </div>
                        <div className="p-3 bg-white/60 rounded-lg">
                          <p className="font-semibold text-emerald-700 text-sm mb-1">💚 Psicológicas y sociales</p>
                          <p className="text-xs text-gray-600">Autoestima, planificación realista, comunicación, regulación emocional y apoyo social/familiar.</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-emerald-800 mb-2">Impacto en salud y bienestar</h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-emerald-100 text-emerald-800 text-xs">Mayor bienestar físico y mental</Badge>
                        <Badge className="bg-emerald-100 text-emerald-800 text-xs">Mejor adaptación al estrés</Badge>
                        <Badge className="bg-emerald-100 text-emerald-800 text-xs">Envejecimiento saludable</Badge>
                        <Badge className="bg-emerald-100 text-emerald-800 text-xs">Menor riesgo de depresión</Badge>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-emerald-800 mb-3">Estrategias prácticas para desarrollar resiliencia</h4>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        <div className="p-3 bg-white/60 rounded-lg">
                          <p className="font-semibold text-sm text-gray-800">✔ Actitud positiva realista</p>
                          <p className="text-xs text-gray-600">No negar la realidad, sino interpretarla con margen de maniobra.</p>
                        </div>
                        <div className="p-3 bg-white/60 rounded-lg">
                          <p className="font-semibold text-sm text-gray-800">✔ Flexibilidad cognitiva</p>
                          <p className="text-xs text-gray-600">Aceptar lo que no se puede cambiar, replantear situaciones.</p>
                        </div>
                        <div className="p-3 bg-white/60 rounded-lg">
                          <p className="font-semibold text-sm text-gray-800">✔ Coherencia con valores</p>
                          <p className="text-xs text-gray-600">Identificar qué es importante y actuar en consecuencia.</p>
                        </div>
                        <div className="p-3 bg-white/60 rounded-lg">
                          <p className="font-semibold text-sm text-gray-800">✔ Afrontar, no evitar</p>
                          <p className="text-xs text-gray-600">La evitación cronifica el miedo. Avanzar aunque incomode.</p>
                        </div>
                        <div className="p-3 bg-white/60 rounded-lg">
                          <p className="font-semibold text-sm text-gray-800">✔ Red de apoyo</p>
                          <p className="text-xs text-gray-600">Relaciones de confianza y participación comunitaria.</p>
                        </div>
                        <div className="p-3 bg-white/60 rounded-lg">
                          <p className="font-semibold text-sm text-gray-800">✔ Cuidado físico</p>
                          <p className="text-xs text-gray-600">Sueño, alimentación, ejercicio y técnicas de relajación.</p>
                        </div>
                        <div className="p-3 bg-white/60 rounded-lg">
                          <p className="font-semibold text-sm text-gray-800">✔ Reconocer fortalezas</p>
                          <p className="text-xs text-gray-600">La adversidad también revela capacidades. Potenciar lo que funciona.</p>
                        </div>
                        <div className="p-3 bg-white/60 rounded-lg">
                          <p className="font-semibold text-sm text-gray-800">✔ Pedir ayuda profesional</p>
                          <p className="text-xs text-gray-600">Saber cuándo no se puede solo es signo de fortaleza.</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-emerald-100 rounded-xl border border-emerald-300">
                      <p className="text-sm font-semibold text-emerald-900 text-center">
                        💡 La resiliencia no elimina el dolor, pero evita que el dolor destruya a la persona. Se construye, se entrena y se refuerza a lo largo de la vida.
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Artículo sobre Salud Emocional en el Trabajo */}
                <Card className="p-6 mt-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Salud emocional en el trabajo</h3>
                      <p className="text-sm text-blue-700">Gestión del estrés laboral</p>
                    </div>
                  </div>

                  <div className="space-y-6 text-gray-700">
                    <div>
                      <h4 className="font-bold text-blue-800 mb-2">¿Qué es la salud emocional en el trabajo?</h4>
                      <p className="text-sm leading-relaxed">
                        Es la capacidad de gestionar las emociones de manera adecuada, mantener un equilibrio mental y desarrollar relaciones saludables dentro del entorno laboral. Implica autorregulación emocional, comunicación efectiva, sentido del propósito y autocuidado.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-bold text-blue-800 mb-2">¿Cómo afrontar el estrés laboral?</h4>
                      <p className="text-sm leading-relaxed mb-3">
                        El estrés laboral puede gestionarse mediante estrategias de autogestión, intervenciones individuales, fomento de la resiliencia y regulación emocional.
                      </p>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-3 bg-white/60 rounded-lg">
                          <p className="font-semibold text-blue-700 text-sm mb-1">🧠 Modificar la experiencia</p>
                          <p className="text-xs text-gray-600">Trabajar en pensamientos, sentimientos y comportamiento ante el estrés.</p>
                        </div>
                        <div className="p-3 bg-white/60 rounded-lg">
                          <p className="font-semibold text-blue-700 text-sm mb-1">🧘 Desconexión psicológica</p>
                          <p className="text-xs text-gray-600">Relajación y ejercicio como herramientas de desconexión del estrés.</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-blue-800 mb-3">Factores clave para gestionar el estrés</h4>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div className="p-3 bg-white/60 rounded-lg">
                          <p className="font-semibold text-sm text-gray-800">✔ Resiliencia individual</p>
                          <p className="text-xs text-gray-600">Rasgos estables, estilo de afrontamiento y autoeficacia para manejar estresores.</p>
                        </div>
                        <div className="p-3 bg-white/60 rounded-lg">
                          <p className="font-semibold text-sm text-gray-800">✔ Regulación emocional</p>
                          <p className="text-xs text-gray-600">Pensamiento positivo, cambio de humor y búsqueda de apoyo social.</p>
                        </div>
                        <div className="p-3 bg-white/60 rounded-lg">
                          <p className="font-semibold text-sm text-gray-800">✔ Responsabilidad personal</p>
                          <p className="text-xs text-gray-600">Las estrategias de afrontamiento influyen directamente en el bienestar emocional.</p>
                        </div>
                        <div className="p-3 bg-white/60 rounded-lg">
                          <p className="font-semibold text-sm text-gray-800">✔ Intervenciones a corto plazo</p>
                          <p className="text-xs text-gray-600">Técnicas con efectos beneficiosos a corto y mediano plazo para reducir síntomas.</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-100 rounded-xl border border-blue-300">
                      <p className="text-sm font-semibold text-blue-900 text-center">
                        💼 Un ambiente de trabajo positivo aumenta la productividad sin sacrificar el bienestar personal.
                      </p>
                    </div>
                  </div>
                </Card>
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

          {/* Modal Líneas de Ayuda Internacionales */}
          <Dialog open={showHelpLinesModal} onOpenChange={setShowHelpLinesModal}>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl">
                  <Globe className="w-6 h-6 text-blue-600" />
                  Líneas de Ayuda Internacionales
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                {/* España */}
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🇪🇸</span>
                    <h4 className="font-bold text-gray-900">España</h4>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-semibold">Teléfono de la Esperanza:</span> <span className="font-mono text-blue-600">717 003 717</span></p>
                    <p><span className="font-semibold">Emergencias:</span> <span className="font-mono text-green-600">112</span></p>
                    <p><span className="font-semibold">Atención al menor:</span> <span className="font-mono text-purple-600">116 111</span></p>
                  </div>
                </div>

                {/* Estados Unidos */}
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🇺🇸</span>
                    <h4 className="font-bold text-gray-900">Estados Unidos</h4>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-semibold">Suicide & Crisis Lifeline:</span> <span className="font-mono text-blue-600">988</span> (24/7)</p>
                    <p><span className="font-semibold">Emergencias:</span> <span className="font-mono text-green-600">911</span></p>
                    <p><span className="font-semibold">Crisis Text Line:</span> text HOME al <span className="font-mono text-purple-600">741741</span></p>
                  </div>
                </div>

                {/* Canadá */}
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🇨🇦</span>
                    <h4 className="font-bold text-gray-900">Canadá</h4>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-semibold">Suicide Crisis Helpline:</span> <span className="font-mono text-blue-600">988</span> (24/7, bilingüe)</p>
                    <p><span className="font-semibold">Emergencias:</span> <span className="font-mono text-green-600">911</span></p>
                  </div>
                </div>

                {/* Reino Unido */}
                <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🇬🇧</span>
                    <h4 className="font-bold text-gray-900">Reino Unido</h4>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-semibold">Samaritans:</span> <span className="font-mono text-blue-600">+44 (0)8457 90 90 90</span></p>
                    <p><span className="font-semibold">Emergencias:</span> <span className="font-mono text-green-600">999 / 112</span></p>
                  </div>
                </div>

                {/* Irlanda */}
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🇮🇪</span>
                    <h4 className="font-bold text-gray-900">Irlanda</h4>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-semibold">Samaritans Ireland:</span> <span className="font-mono text-blue-600">116 123</span></p>
                    <p><span className="font-semibold">Emergencias:</span> <span className="font-mono text-green-600">112 / 999</span></p>
                  </div>
                </div>

                {/* Francia */}
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🇫🇷</span>
                    <h4 className="font-bold text-gray-900">Francia</h4>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-semibold">Prévention du suicide:</span> <span className="font-mono text-blue-600">3114</span> (24/7)</p>
                    <p><span className="font-semibold">Emergencias:</span> <span className="font-mono text-green-600">112 / 15</span></p>
                  </div>
                </div>

                {/* Alemania */}
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🇩🇪</span>
                    <h4 className="font-bold text-gray-900">Alemania</h4>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-semibold">TelefonSeelsorge:</span> <span className="font-mono text-blue-600">0800 111 0 111</span> / <span className="font-mono text-blue-600">0800 111 0 222</span></p>
                    <p><span className="font-semibold">Niños y jóvenes:</span> <span className="font-mono text-purple-600">116 111</span></p>
                    <p><span className="font-semibold">Emergencias:</span> <span className="font-mono text-green-600">112</span></p>
                  </div>
                </div>

                {/* Países Bajos */}
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🇳🇱</span>
                    <h4 className="font-bold text-gray-900">Países Bajos</h4>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-semibold">113 Suicide Prevention:</span> <span className="font-mono text-blue-600">113</span> / <span className="font-mono text-blue-600">+31 80 00113</span></p>
                    <p><span className="font-semibold">Emergencias:</span> <span className="font-mono text-green-600">112</span></p>
                  </div>
                </div>

                {/* Bélgica */}
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🇧🇪</span>
                    <h4 className="font-bold text-gray-900">Bélgica</h4>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-semibold">Zelfmoordlijn:</span> <span className="font-mono text-blue-600">1813</span></p>
                    <p><span className="font-semibold">Emergencias:</span> <span className="font-mono text-green-600">112</span></p>
                  </div>
                </div>

                {/* Suiza */}
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🇨🇭</span>
                    <h4 className="font-bold text-gray-900">Suiza</h4>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-semibold">Dargebotene Hand:</span> <span className="font-mono text-blue-600">143</span></p>
                    <p><span className="font-semibold">Emergencias:</span> <span className="font-mono text-green-600">112 / 144</span></p>
                  </div>
                </div>

                {/* Italia */}
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🇮🇹</span>
                    <h4 className="font-bold text-gray-900">Italia</h4>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-semibold">Telefono Amico:</span> <span className="font-mono text-blue-600">+39 02 2327 2327</span></p>
                    <p><span className="font-semibold">Emergencias:</span> <span className="font-mono text-green-600">112</span></p>
                  </div>
                </div>

                {/* Portugal */}
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🇵🇹</span>
                    <h4 className="font-bold text-gray-900">Portugal</h4>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-semibold">Voz de Apoio:</span> <span className="font-mono text-blue-600">225 50 60 70</span></p>
                    <p><span className="font-semibold">Emergencias:</span> <span className="font-mono text-green-600">112</span></p>
                  </div>
                </div>

                {/* Latinoamérica Header */}
                <div className="border-t border-gray-300 pt-4 mt-4">
                  <h3 className="font-bold text-lg text-gray-900 mb-3">🌎 Latinoamérica</h3>
                </div>

                {/* Brasil */}
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🇧🇷</span>
                    <h4 className="font-bold text-gray-900">Brasil</h4>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-semibold">CVV:</span> <span className="font-mono text-blue-600">188</span> (24/7, gratuito)</p>
                    <p><span className="font-semibold">Emergencias:</span> <span className="font-mono text-green-600">190 / 192</span></p>
                  </div>
                </div>

                {/* México */}
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🇲🇽</span>
                    <h4 className="font-bold text-gray-900">México</h4>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-semibold">Línea de la Vida:</span> <span className="font-mono text-blue-600">800 911 2000</span></p>
                    <p><span className="font-semibold">Emergencias:</span> <span className="font-mono text-green-600">911</span></p>
                  </div>
                </div>

                {/* Argentina */}
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🇦🇷</span>
                    <h4 className="font-bold text-gray-900">Argentina</h4>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-semibold">Centro de Atención al Suicida:</span> <span className="font-mono text-blue-600">+54 (11) 5275-1135</span></p>
                    <p><span className="font-semibold">Emergencias:</span> <span className="font-mono text-green-600">911 / 107</span></p>
                  </div>
                </div>

                {/* Chile */}
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🇨🇱</span>
                    <h4 className="font-bold text-gray-900">Chile</h4>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-semibold">Salud Responde:</span> <span className="font-mono text-blue-600">600 360 7777</span></p>
                    <p><span className="font-semibold">Emergencias:</span> <span className="font-mono text-green-600">131 / 133</span></p>
                  </div>
                </div>

                {/* Colombia */}
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🇨🇴</span>
                    <h4 className="font-bold text-gray-900">Colombia</h4>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-semibold">Línea 106 (Bogotá):</span> <span className="font-mono text-blue-600">106</span></p>
                    <p><span className="font-semibold">Emergencias:</span> <span className="font-mono text-green-600">123</span></p>
                  </div>
                </div>

                {/* Asia-Pacífico Header */}
                <div className="border-t border-gray-300 pt-4 mt-4">
                  <h3 className="font-bold text-lg text-gray-900 mb-3">🌏 Asia-Pacífico</h3>
                </div>

                {/* India */}
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🇮🇳</span>
                    <h4 className="font-bold text-gray-900">India</h4>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-semibold">Tele-MANAS:</span> <span className="font-mono text-blue-600">14416</span> / <span className="font-mono text-blue-600">1-800-891-4416</span></p>
                    <p><span className="font-semibold">Emergencias:</span> <span className="font-mono text-green-600">112</span></p>
                  </div>
                </div>

                {/* Japón */}
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🇯🇵</span>
                    <h4 className="font-bold text-gray-900">Japón</h4>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-semibold">Yorisoi Hotline:</span> <span className="font-mono text-blue-600">0120-279-338</span></p>
                    <p><span className="font-semibold">Emergencias:</span> <span className="font-mono text-green-600">110 / 119</span></p>
                  </div>
                </div>

                {/* Australia */}
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🇦🇺</span>
                    <h4 className="font-bold text-gray-900">Australia</h4>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-semibold">Lifeline:</span> <span className="font-mono text-blue-600">13 11 14</span></p>
                    <p><span className="font-semibold">Emergencias:</span> <span className="font-mono text-green-600">000</span></p>
                  </div>
                </div>

                {/* Recursos Globales */}
                <div className="border-t border-gray-300 pt-4 mt-4">
                  <h3 className="font-bold text-lg text-gray-900 mb-3">🌐 Recursos Globales (cualquier país)</h3>
                  <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
                    <div className="space-y-2 text-sm">
                      <p><span className="font-semibold">Befrienders Worldwide:</span> Directorio mundial de líneas de ayuda</p>
                      <p><span className="font-semibold">Find A Helpline:</span> Buscador automático por país</p>
                      <p><span className="font-semibold">IFRC / Cruz Roja:</span> Recursos locales en crisis</p>
                    </div>
                    <p className="text-xs text-gray-600 mt-3 italic">Si no encuentras tu país, estos directorios te ayudarán a localizar ayuda local.</p>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Modal Bibliografía Recomendada */}
          <Dialog open={showBibliographyModal} onOpenChange={setShowBibliographyModal}>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl">
                  <BookOpen className="w-6 h-6 text-amber-600" />
                  Bibliografía Recomendada
                </DialogTitle>
              </DialogHeader>
              
              <Tabs defaultValue="ansiedad" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="ansiedad" className="text-sm">😰 Ansiedad</TabsTrigger>
                  <TabsTrigger value="depresion" className="text-sm">😢 Depresión</TabsTrigger>
                  <TabsTrigger value="estres" className="text-sm">💼 Estrés Laboral</TabsTrigger>
                </TabsList>

                <TabsContent value="ansiedad" className="space-y-3">
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-1 flex items-center gap-2">
                      <Brain className="w-4 h-4" /> Lecturas para la ansiedad
                    </h4>
                    <p className="text-xs text-blue-600">Libros validados por la evidencia científica</p>
                  </div>
                  {bibliographyData.ansiedad.map((book, idx) => (
                    <div key={idx} className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                      <h5 className="font-bold text-gray-900">📖 {book.title}</h5>
                      <p className="text-sm text-gray-600 italic">por {book.author}</p>
                      <p className="text-sm text-gray-700 mt-2">{book.description}</p>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="depresion" className="space-y-3">
                  <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                    <h4 className="font-semibold text-purple-800 mb-1 flex items-center gap-2">
                      <Heart className="w-4 h-4" /> Lecturas para la depresión
                    </h4>
                    <p className="text-xs text-purple-600">Recursos para entender y afrontar estados depresivos</p>
                  </div>
                  {bibliographyData.depresion.map((book, idx) => (
                    <div key={idx} className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                      <h5 className="font-bold text-gray-900">📖 {book.title}</h5>
                      <p className="text-sm text-gray-600 italic">por {book.author}</p>
                      <p className="text-sm text-gray-700 mt-2">{book.description}</p>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="estres" className="space-y-3">
                  <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
                    <h4 className="font-semibold text-amber-800 mb-1 flex items-center gap-2">
                      <Briefcase className="w-4 h-4" /> Lecturas para estrés laboral
                    </h4>
                    <p className="text-xs text-amber-600">Prevención del burnout y bienestar ocupacional</p>
                  </div>
                  {bibliographyData.estres.map((book, idx) => (
                    <div key={idx} className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                      <h5 className="font-bold text-gray-900">📖 {book.title}</h5>
                      <p className="text-sm text-gray-600 italic">por {book.author}</p>
                      <p className="text-sm text-gray-700 mt-2">{book.description}</p>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>

              <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                <p className="text-xs text-gray-600 text-center">
                  💡 Estos libros son recomendaciones orientativas. Para tratamiento profesional, consulta con un psicólogo o psiquiatra.
                </p>
              </div>
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
                <a href="https://jobda.org/partners" target="_blank" rel="noopener noreferrer">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                    Ver planes empresas
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </a>
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
                    <a href="https://jobda.org/partners" target="_blank" rel="noopener noreferrer">
                      <Button 
                        size="lg" 
                        className="w-full sm:w-auto bg-white text-emerald-700 hover:bg-gray-100 font-bold text-lg px-8 py-6 shadow-xl"
                        data-testid="button-recursos-premium"
                      >
                        Escoge tu plan
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </a>
                  </div>
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
