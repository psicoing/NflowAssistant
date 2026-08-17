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
  const [currentView, setCurrentView] = useState<'main' | 'emotional-log' | 'affirmation' | 'evaluation' | 'emotion-history' | 'breathing' | 'gratitude' | 'bad-day' | 'grounding' | 'bilateral' | 'iso-check' | 'emotion-wheel' | 'body-stress' | 'emotion-dashboard' | 'bienestar-test' | 'programa-7dias' | 'meditacion' | 'biblioteca' | 'fichas-situacion'>('main');
  const [wheelSelectedEmotion, setWheelSelectedEmotion] = useState<any>(null);
  const [wheelLayer, setWheelLayer] = useState<'core' | 'middle' | 'outer'>('core');
  const [selectedBodyZone, setSelectedBodyZone] = useState<string | null>(null);
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

  // Dashboard emocional
  const [dashboardLogs, setDashboardLogs] = useState<Array<{emotion: string; note: string; date: string}>>([]);

  // Test de bienestar semanal
  const [bienestarAnswers, setBienestarAnswers] = useState<number[]>([3, 3, 3, 3, 3]);
  const [bienestarHistory, setBienestarHistory] = useState<Array<{date: string; score: number; label: string}>>([]);
  const [bienestarSubmitted, setBienestarSubmitted] = useState(false);

  // Programas de 7 días
  const [selectedPrograma, setSelectedPrograma] = useState<'ansiedad' | 'sueno' | 'autoestima' | null>(null);
  const [programaProgress, setProgramaProgress] = useState<Record<string, number[]>>({});

  // Meditaciones guiadas
  const [meditacionPlayingId, setMeditacionPlayingId] = useState<string | null>(null);
  const [speechSynthRef] = useState<{ current: SpeechSynthesisUtterance | null }>({ current: null });

  // Biblioteca y Fichas
  const [bibliotecaCategoria, setBibliotecaCategoria] = useState<string>('todas');
  const [fichaSeleccionada, setFichaSeleccionada] = useState<string | null>(null);
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
        text: `${text}\n\n${subtext}\n\n- Afirmación del día de NUXA` 
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
    const blob = new Blob([`${text}\n\n${subtext}\n\n- Afirmación del día de NUXA`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'afirmacion-nuxa.txt';
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

  if (currentView === 'body-stress') {
    const bodyZones = [
      {
        id: 'cabeza',
        name: 'Cabeza',
        emoji: '🧠',
        color: '#8B5CF6',
        symptoms: ['Dolor de cabeza', 'Pensamientos acelerados', 'Dificultad para concentrarse', 'Mareos'],
        causes: 'El estrés laboral activa la respuesta de "lucha o huida", liberando cortisol que genera tensión en los vasos sanguíneos craneales.',
        exercises: [
          { name: 'Masaje de sienes', duration: '2 min', steps: ['Coloca los dedos índice y medio en las sienes', 'Haz círculos suaves durante 30 segundos', 'Cambia de dirección otros 30 segundos', 'Presiona suavemente y suelta 5 veces'] },
          { name: 'Técnica 5-4-3-2-1', duration: '3 min', steps: ['Nombra 5 cosas que ves ahora mismo', 'Toca 4 texturas diferentes a tu alrededor', 'Identifica 3 sonidos que escuches', 'Percibe 2 olores distintos', 'Saborea 1 cosa (agua, caramelo...)'] },
        ],
        tip: 'Si el dolor de cabeza persiste más de 3 días seguidos, consulta con un profesional.'
      },
      {
        id: 'ojos',
        name: 'Ojos y Frente',
        emoji: '👁️',
        color: '#6366F1',
        symptoms: ['Vista cansada', 'Tensión en el entrecejo', 'Ojos secos', 'Visión borrosa'],
        causes: 'Las pantallas reducen el parpadeo un 60%. El estrés añade tensión muscular constante en la zona frontal y orbicular.',
        exercises: [
          { name: 'Regla 20-20-20', duration: '1 min', steps: ['Cada 20 minutos de pantalla', 'Mira algo a 20 pies (6 metros) de distancia', 'Durante 20 segundos', 'Parpadea voluntariamente 10 veces'] },
          { name: 'Palming ocular', duration: '2 min', steps: ['Frota las palmas de las manos hasta calentarlas', 'Colócalas sobre los ojos cerrados sin presionar', 'Respira profundamente 5 veces', 'Siente el calor relajando los músculos oculares'] },
        ],
        tip: 'Ajusta el brillo de la pantalla al nivel de la luz ambiente para reducir la fatiga visual.'
      },
      {
        id: 'mandibula',
        name: 'Mandíbula',
        emoji: '😬',
        color: '#EC4899',
        symptoms: ['Apretar los dientes (bruxismo)', 'Dolor al masticar', 'Chasquidos al abrir la boca', 'Tensión facial'],
        causes: 'El bruxismo es una de las respuestas más comunes al estrés crónico. La mandíbula acumula tensión inconsciente, especialmente durante la noche y en situaciones de presión.',
        exercises: [
          { name: 'Relajación mandibular', duration: '2 min', steps: ['Separa los labios manteniendo los dientes sin tocar', 'Coloca la lengua en el paladar, detrás de los dientes', 'Deja caer la mandíbula suavemente por gravedad', 'Mantén 30 segundos, repite 4 veces'] },
          { name: 'Estiramiento de apertura', duration: '1 min', steps: ['Abre la boca despacio todo lo que puedas sin dolor', 'Mueve la mandíbula hacia la derecha, mantén 5s', 'Vuelve al centro', 'Mueve hacia la izquierda, mantén 5s', 'Repite 3 veces'] },
        ],
        tip: 'Si aprietas los dientes al dormir, un protector nocturno puede prevenir el desgaste dental.'
      },
      {
        id: 'cuello',
        name: 'Cuello y Cervicales',
        emoji: '🦒',
        color: '#F59E0B',
        symptoms: ['Rigidez al girar', 'Dolor cervical', 'Tortícolis', 'Sensación de carga pesada'],
        causes: 'La postura frente al ordenador y el estrés emocional generan contracturas en el trapecio superior y los músculos cervicales. "Cargar con responsabilidades" se manifiesta literalmente aquí.',
        exercises: [
          { name: 'Rotación cervical suave', duration: '2 min', steps: ['Siéntate erguido con hombros relajados', 'Gira la cabeza hacia la derecha, mantén 10s', 'Vuelve al centro despacio', 'Gira hacia la izquierda, mantén 10s', 'Repite 5 veces cada lado'] },
          { name: 'Estiramiento lateral', duration: '2 min', steps: ['Inclina la oreja derecha hacia el hombro derecho', 'Con la mano derecha, presiona suavemente la cabeza', 'Mantén 20 segundos sintiendo el estiramiento', 'Cambia al lado izquierdo', 'Repite 3 veces por lado'] },
        ],
        tip: 'Coloca la pantalla a la altura de los ojos. Cada centímetro de inclinación de cabeza añade 5kg de presión a las cervicales.'
      },
      {
        id: 'hombros',
        name: 'Hombros y Trapecio',
        emoji: '💪',
        color: '#EF4444',
        symptoms: ['Hombros elevados involuntariamente', 'Contracturas', 'Dolor al mover los brazos', 'Nudos musculares'],
        causes: 'La respuesta de estrés activa los trapecios como mecanismo de protección primitivo. El trabajo prolongado con ratón y teclado agrava la tensión unilateral.',
        exercises: [
          { name: 'Elevación y soltar', duration: '1 min', steps: ['Sube los hombros hacia las orejas con fuerza', 'Mantén la tensión 5 segundos', 'Suelta de golpe dejándolos caer', 'Siente la diferencia entre tensión y relajación', 'Repite 8 veces'] },
          { name: 'Círculos de hombros', duration: '2 min', steps: ['Haz 10 círculos amplios hacia adelante', 'Haz 10 círculos amplios hacia atrás', 'Junta los omóplatos atrás, mantén 10s', 'Redondea la espalda hacia adelante, mantén 10s', 'Repite toda la secuencia 2 veces'] },
        ],
        tip: 'Programa una alarma cada hora para hacer un "body check": ¿tienes los hombros subidos? Suéltalos.'
      },
      {
        id: 'pecho',
        name: 'Pecho y Respiración',
        emoji: '🫁',
        color: '#14B8A6',
        symptoms: ['Opresión en el pecho', 'Respiración superficial', 'Sensación de ahogo', 'Palpitaciones'],
        causes: 'La ansiedad laboral provoca respiración torácica superficial, reduciendo el oxígeno un 30%. Los músculos intercostales se tensan, creando sensación de opresión.',
        exercises: [
          { name: 'Respiración diafragmática', duration: '3 min', steps: ['Coloca una mano en el pecho y otra en el abdomen', 'Inhala por la nariz 4 segundos: solo la mano del abdomen debe subir', 'Mantén 4 segundos', 'Exhala por la boca 6 segundos: el abdomen baja', 'Repite 6 ciclos completos'] },
          { name: 'Apertura torácica', duration: '2 min', steps: ['De pie, entrelaza las manos detrás de la espalda', 'Estira los brazos y abre el pecho mirando arriba', 'Mantén 15 segundos respirando profundamente', 'Suelta y deja los brazos colgando relajados', 'Repite 4 veces'] },
        ],
        tip: 'Si sientes opresión intensa, palpitaciones fuertes o dolor irradiado al brazo, busca atención médica inmediata.'
      },
      {
        id: 'espalda',
        name: 'Espalda Media y Lumbar',
        emoji: '🔙',
        color: '#F97316',
        symptoms: ['Dolor lumbar crónico', 'Rigidez al levantarse', 'Pinchazos al agacharse', 'Fatiga muscular'],
        causes: 'Estar sentado más de 6 horas al día comprime los discos intervertebrales. El estrés emocional aumenta la tensión de la musculatura paravertebral hasta un 40%.',
        exercises: [
          { name: 'Gato-Vaca en silla', duration: '2 min', steps: ['Siéntate al borde de la silla, pies planos en el suelo', 'Inhala: arquea la espalda sacando pecho (vaca)', 'Exhala: redondea la espalda metiendo la barbilla (gato)', 'Mueve despacio, sincroniza con la respiración', 'Repite 10 ciclos'] },
          { name: 'Rotación espinal sentado', duration: '2 min', steps: ['Siéntate erguido, cruza la pierna derecha sobre la izquierda', 'Gira el torso hacia la derecha, mano izquierda en la rodilla derecha', 'Mantén 20 segundos respirando', 'Cambia de lado', 'Repite 3 veces por lado'] },
        ],
        tip: 'Levántate y camina al menos 2 minutos cada hora. Tu espalda lo agradecerá más que cualquier silla ergonómica.'
      },
      {
        id: 'estomago',
        name: 'Estómago y Digestivo',
        emoji: '🫃',
        color: '#A855F7',
        symptoms: ['Nudos en el estómago', 'Náuseas por ansiedad', 'Digestión pesada', 'Colon irritable'],
        causes: 'El intestino tiene 500 millones de neuronas (el "segundo cerebro"). El estrés altera la microbiota, la motilidad intestinal y la producción de serotonina (el 90% se produce en el intestino).',
        exercises: [
          { name: 'Masaje abdominal', duration: '3 min', steps: ['Túmbate o siéntate cómodamente', 'Coloca ambas manos sobre el ombligo', 'Haz círculos en sentido horario, suaves y amplios', 'Aumenta ligeramente la presión durante 2 minutos', 'Termina con 5 respiraciones abdominales profundas'] },
          { name: 'Postura de liberación', duration: '2 min', steps: ['Siéntate y lleva las rodillas al pecho (o una sola)', 'Abrázalas con las manos', 'Balancea suavemente de lado a lado', 'Respira lenta y profundamente', 'Mantén 1 minuto y suelta despacio'] },
        ],
        tip: 'Evita comer frente al ordenador. Comer con estrés reduce la absorción de nutrientes un 20%.'
      },
      {
        id: 'manos',
        name: 'Manos y Muñecas',
        emoji: '🤲',
        color: '#0EA5E9',
        symptoms: ['Hormigueo en los dedos', 'Dolor al escribir', 'Rigidez matutina', 'Síndrome del túnel carpiano'],
        causes: 'El uso repetitivo del teclado y ratón inflama los tendones flexores. El estrés aumenta la tensión muscular, agravando la compresión del nervio mediano.',
        exercises: [
          { name: 'Estiramientos de muñeca', duration: '2 min', steps: ['Extiende el brazo con la palma hacia arriba', 'Con la otra mano, tira de los dedos hacia abajo suavemente', 'Mantén 15 segundos', 'Gira la palma hacia abajo y repite', 'Haz ambas muñecas, 3 repeticiones'] },
          { name: 'Puño y abanico', duration: '1 min', steps: ['Cierra los puños con fuerza, mantén 5 segundos', 'Abre las manos extendiendo todos los dedos al máximo', 'Separa los dedos como un abanico, mantén 5 segundos', 'Sacude las manos relajadamente 10 segundos', 'Repite toda la secuencia 5 veces'] },
        ],
        tip: 'Coloca el ratón cerca del teclado y usa reposamanos. Tu muñeca debe estar en posición neutra, nunca doblada.'
      },
      {
        id: 'piernas',
        name: 'Piernas y Pies',
        emoji: '🦵',
        color: '#22C55E',
        symptoms: ['Piernas inquietas', 'Hinchazón por retención', 'Calambres nocturnos', 'Pesadez al caminar'],
        causes: 'Estar sentado comprime la circulación venosa. El estrés aumenta la retención de líquidos y la tensión muscular de gemelos y cuádriceps, causando pesadez y calambres.',
        exercises: [
          { name: 'Activación en la silla', duration: '2 min', steps: ['Sentado, levanta los talones del suelo 20 veces', 'Ahora levanta las puntas de los pies 20 veces', 'Extiende una pierna paralela al suelo, mantén 10s', 'Cambia de pierna', 'Repite todo 3 veces'] },
          { name: 'Estiramiento de gemelos', duration: '2 min', steps: ['De pie, apoya las manos en la pared', 'Lleva un pie atrás con el talón en el suelo', 'Inclínate hacia la pared hasta sentir el estiramiento', 'Mantén 20 segundos cada pierna', 'Repite 3 veces por lado'] },
        ],
        tip: 'Si trabajas sentado, usa la regla de las 3S: Sentado 25 min, Sube (camina) 3 min, Stretching (estira) 2 min.'
      },
    ];

    const selectedZone = bodyZones.find(z => z.id === selectedBodyZone);

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        <Header />
        <main className="pt-24 pb-12 px-4">
          <div className="max-w-4xl mx-auto">
            <Button variant="ghost" onClick={() => { setCurrentView('main'); setSelectedBodyZone(null); }} className="mb-6">
              ← Volver
            </Button>

            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-200 px-4 py-2 rounded-full mb-4">
                <span className="text-red-500 font-semibold text-sm">Estrés Laboral</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Mapa de Estrés Corporal</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Tu cuerpo habla. Toca la zona donde sientes tensión y descubre ejercicios específicos para aliviarla en tu puesto de trabajo.
              </p>
            </div>

            {!selectedZone ? (
              <>
                <div className="relative max-w-md mx-auto mb-10">
                  <div className="bg-gradient-to-b from-slate-50 to-slate-100 rounded-3xl p-8 border-2 border-slate-200 shadow-inner">
                    <div className="text-center mb-4">
                      <p className="text-sm text-gray-500 font-medium">Toca donde sientes tensión</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      {/* Head */}
                      <button
                        onClick={() => setSelectedBodyZone('cabeza')}
                        className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 border-2 border-purple-300 hover:border-purple-500 hover:shadow-lg hover:scale-110 transition-all flex items-center justify-center text-3xl cursor-pointer"
                      >🧠</button>

                      {/* Eyes */}
                      <button
                        onClick={() => setSelectedBodyZone('ojos')}
                        className="w-16 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 border-2 border-indigo-300 hover:border-indigo-500 hover:shadow-lg hover:scale-110 transition-all flex items-center justify-center text-xl cursor-pointer"
                      >👁️</button>

                      {/* Jaw */}
                      <button
                        onClick={() => setSelectedBodyZone('mandibula')}
                        className="w-14 h-10 rounded-full bg-gradient-to-br from-pink-100 to-pink-200 border-2 border-pink-300 hover:border-pink-500 hover:shadow-lg hover:scale-110 transition-all flex items-center justify-center text-xl cursor-pointer"
                      >😬</button>

                      {/* Neck */}
                      <button
                        onClick={() => setSelectedBodyZone('cuello')}
                        className="w-12 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-amber-200 border-2 border-amber-300 hover:border-amber-500 hover:shadow-lg hover:scale-110 transition-all flex items-center justify-center text-xl cursor-pointer"
                      >🦒</button>

                      {/* Shoulders */}
                      <button
                        onClick={() => setSelectedBodyZone('hombros')}
                        className="w-48 h-12 rounded-full bg-gradient-to-br from-red-100 to-red-200 border-2 border-red-300 hover:border-red-500 hover:shadow-lg hover:scale-110 transition-all flex items-center justify-center text-xl cursor-pointer"
                      >💪 Hombros 💪</button>

                      {/* Chest */}
                      <button
                        onClick={() => setSelectedBodyZone('pecho')}
                        className="w-36 h-16 rounded-2xl bg-gradient-to-br from-teal-100 to-teal-200 border-2 border-teal-300 hover:border-teal-500 hover:shadow-lg hover:scale-110 transition-all flex items-center justify-center text-xl cursor-pointer"
                      >🫁</button>

                      <div className="flex gap-3 items-start">
                        {/* Hands left */}
                        <button
                          onClick={() => setSelectedBodyZone('manos')}
                          className="w-14 h-14 rounded-xl bg-gradient-to-br from-sky-100 to-sky-200 border-2 border-sky-300 hover:border-sky-500 hover:shadow-lg hover:scale-110 transition-all flex items-center justify-center text-xl cursor-pointer mt-8"
                        >🤲</button>

                        <div className="flex flex-col items-center gap-2">
                          {/* Stomach */}
                          <button
                            onClick={() => setSelectedBodyZone('estomago')}
                            className="w-32 h-14 rounded-2xl bg-gradient-to-br from-violet-100 to-violet-200 border-2 border-violet-300 hover:border-violet-500 hover:shadow-lg hover:scale-110 transition-all flex items-center justify-center text-xl cursor-pointer"
                          >🫃</button>

                          {/* Back */}
                          <button
                            onClick={() => setSelectedBodyZone('espalda')}
                            className="w-32 h-14 rounded-2xl bg-gradient-to-br from-orange-100 to-orange-200 border-2 border-orange-300 hover:border-orange-500 hover:shadow-lg hover:scale-110 transition-all flex items-center justify-center text-xl cursor-pointer"
                          >🔙 Espalda</button>
                        </div>

                        {/* Hands right */}
                        <button
                          onClick={() => setSelectedBodyZone('manos')}
                          className="w-14 h-14 rounded-xl bg-gradient-to-br from-sky-100 to-sky-200 border-2 border-sky-300 hover:border-sky-500 hover:shadow-lg hover:scale-110 transition-all flex items-center justify-center text-xl cursor-pointer mt-8"
                        >✋</button>
                      </div>

                      {/* Legs */}
                      <button
                        onClick={() => setSelectedBodyZone('piernas')}
                        className="w-36 h-20 rounded-2xl bg-gradient-to-br from-green-100 to-green-200 border-2 border-green-300 hover:border-green-500 hover:shadow-lg hover:scale-110 transition-all flex items-center justify-center text-xl cursor-pointer"
                      >🦵 Piernas 🦵</button>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  {bodyZones.map((zone) => (
                    <Card
                      key={zone.id}
                      className="p-4 cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] flex items-center gap-4"
                      onClick={() => setSelectedBodyZone(zone.id)}
                    >
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ backgroundColor: zone.color + '20' }}>
                        {zone.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900">{zone.name}</h3>
                        <p className="text-xs text-gray-500 truncate">{zone.symptoms.slice(0, 2).join(' · ')}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <div className="animate-in fade-in duration-300">
                <Button variant="outline" onClick={() => setSelectedBodyZone(null)} className="mb-6">
                  ← Volver al mapa
                </Button>

                <div className="mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl" style={{ backgroundColor: selectedZone.color + '20' }}>
                      {selectedZone.emoji}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{selectedZone.name}</h3>
                      <p className="text-sm text-gray-500">Zona de estrés laboral</p>
                    </div>
                  </div>
                </div>

                <Card className="p-5 mb-4 border-l-4" style={{ borderLeftColor: selectedZone.color }}>
                  <h4 className="font-bold text-gray-900 mb-3">Síntomas comunes</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedZone.symptoms.map((s, i) => (
                      <Badge key={i} className="bg-gray-100 text-gray-700 border-gray-200 text-sm py-1">{s}</Badge>
                    ))}
                  </div>
                </Card>

                <Card className="p-5 mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                  <h4 className="font-bold text-gray-900 mb-2">¿Por qué duele aquí?</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">{selectedZone.causes}</p>
                </Card>

                <h4 className="font-bold text-gray-900 mb-4 text-lg">Ejercicios recomendados</h4>
                {selectedZone.exercises.map((exercise, exIdx) => (
                  <Card key={exIdx} className="p-5 mb-4 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="font-bold text-gray-900 text-lg">{exercise.name}</h5>
                      <Badge style={{ backgroundColor: selectedZone.color + '20', color: selectedZone.color }} className="border-0 font-semibold">
                        {exercise.duration}
                      </Badge>
                    </div>
                    <ol className="space-y-3">
                      {exercise.steps.map((step, stepIdx) => (
                        <li key={stepIdx} className="flex items-start gap-3">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5" style={{ backgroundColor: selectedZone.color }}>
                            {stepIdx + 1}
                          </div>
                          <p className="text-gray-700 text-sm leading-relaxed">{step}</p>
                        </li>
                      ))}
                    </ol>
                  </Card>
                ))}

                <Card className="p-5 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-amber-800 mb-1">Consejo profesional</h4>
                      <p className="text-amber-700 text-sm">{selectedZone.tip}</p>
                    </div>
                  </div>
                </Card>
              </div>
            )}

          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (currentView === 'emotion-wheel') {
    const plutchikEmotions = {
      core: [
        { name: 'Éxtasis', emoji: '🤩', color: '#FFD700', family: 'Alegría', description: 'Felicidad intensa y desbordante' },
        { name: 'Admiración', emoji: '🤩', color: '#7CFC00', family: 'Confianza', description: 'Profundo respeto y admiración' },
        { name: 'Terror', emoji: '😱', color: '#228B22', family: 'Miedo', description: 'Miedo extremo e incontrolable' },
        { name: 'Asombro', emoji: '😲', color: '#00CED1', family: 'Sorpresa', description: 'Impacto total ante lo inesperado' },
        { name: 'Duelo', emoji: '😭', color: '#4169E1', family: 'Tristeza', description: 'Dolor profundo por una pérdida' },
        { name: 'Asco', emoji: '🤢', color: '#9370DB', family: 'Repugnancia', description: 'Rechazo intenso y visceral' },
        { name: 'Furia', emoji: '🤬', color: '#FF4500', family: 'Ira', description: 'Ira descontrolada y explosiva' },
        { name: 'Vigilancia', emoji: '👁️', color: '#FF8C00', family: 'Anticipación', description: 'Atención máxima ante una amenaza' },
      ],
      middle: [
        { name: 'Alegría', emoji: '😊', color: '#FFD700', family: 'Alegría', description: 'Sensación de bienestar y felicidad' },
        { name: 'Confianza', emoji: '🤝', color: '#7CFC00', family: 'Confianza', description: 'Seguridad en uno mismo o en otros' },
        { name: 'Miedo', emoji: '😨', color: '#228B22', family: 'Miedo', description: 'Reacción ante un peligro percibido' },
        { name: 'Sorpresa', emoji: '😮', color: '#00CED1', family: 'Sorpresa', description: 'Reacción ante algo inesperado' },
        { name: 'Tristeza', emoji: '😢', color: '#4169E1', family: 'Tristeza', description: 'Dolor emocional o melancolía' },
        { name: 'Repugnancia', emoji: '😖', color: '#9370DB', family: 'Repugnancia', description: 'Rechazo hacia algo desagradable' },
        { name: 'Ira', emoji: '😠', color: '#FF4500', family: 'Ira', description: 'Enfado fuerte ante una injusticia' },
        { name: 'Anticipación', emoji: '🔮', color: '#FF8C00', family: 'Anticipación', description: 'Expectativa ante lo que viene' },
      ],
      outer: [
        { name: 'Serenidad', emoji: '😌', color: '#FFD700', family: 'Alegría', description: 'Calma y paz interior' },
        { name: 'Aceptación', emoji: '🙂', color: '#7CFC00', family: 'Confianza', description: 'Apertura a lo que es' },
        { name: 'Aprensión', emoji: '😟', color: '#228B22', family: 'Miedo', description: 'Inquietud ligera ante algo' },
        { name: 'Distracción', emoji: '🫤', color: '#00CED1', family: 'Sorpresa', description: 'Falta de enfoque o atención' },
        { name: 'Melancolía', emoji: '😔', color: '#4169E1', family: 'Tristeza', description: 'Nostalgia suave y reflexiva' },
        { name: 'Aburrimiento', emoji: '😑', color: '#9370DB', family: 'Repugnancia', description: 'Falta de interés o estímulo' },
        { name: 'Molestia', emoji: '😤', color: '#FF4500', family: 'Ira', description: 'Irritación leve por algo' },
        { name: 'Interés', emoji: '🤔', color: '#FF8C00', family: 'Anticipación', description: 'Curiosidad hacia algo nuevo' },
      ]
    };

    const combinedEmotions = [
      { name: 'Amor', emoji: '❤️', from: 'Alegría + Confianza', color: 'from-yellow-400 to-green-400', description: 'Vínculo profundo de afecto y seguridad' },
      { name: 'Sumisión', emoji: '🙇', from: 'Confianza + Miedo', color: 'from-green-400 to-emerald-600', description: 'Ceder ante la autoridad o presión' },
      { name: 'Susto', emoji: '😰', from: 'Miedo + Sorpresa', color: 'from-emerald-600 to-cyan-500', description: 'Reacción repentina de miedo' },
      { name: 'Decepción', emoji: '😞', from: 'Sorpresa + Tristeza', color: 'from-cyan-500 to-blue-500', description: 'Desilusión ante expectativas rotas' },
      { name: 'Remordimiento', emoji: '😣', from: 'Tristeza + Repugnancia', color: 'from-blue-500 to-purple-500', description: 'Culpa por algo que hicimos' },
      { name: 'Desprecio', emoji: '😒', from: 'Repugnancia + Ira', color: 'from-purple-500 to-red-500', description: 'Rechazo con indignación' },
      { name: 'Agresividad', emoji: '💢', from: 'Ira + Anticipación', color: 'from-red-500 to-orange-500', description: 'Impulso de ataque o confrontación' },
      { name: 'Optimismo', emoji: '🌟', from: 'Anticipación + Alegría', color: 'from-orange-500 to-yellow-400', description: 'Expectativa positiva del futuro' },
    ];

    const currentEmotions = plutchikEmotions[wheelLayer];
    const layerLabels = { core: 'Intensas', middle: 'Básicas', outer: 'Suaves' };

    const saveWheelEmotion = (emotion: any) => {
      const log = {
        date: new Date().toISOString(),
        emotion: emotion.name,
        emoji: emotion.emoji,
        family: emotion.family,
        layer: wheelLayer,
        description: emotion.description
      };
      const existing = JSON.parse(localStorage.getItem('nuxa-wheel-history') || '[]');
      existing.push(log);
      localStorage.setItem('nuxa-wheel-history', JSON.stringify(existing));
      toast({ title: `${emotion.emoji} ${emotion.name}`, description: `Registrado: ${emotion.description}` });
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        <Header />
        <main className="pt-24 pb-12 px-4">
          <div className="max-w-3xl mx-auto">
            <Button variant="ghost" onClick={() => { setCurrentView('main'); setWheelSelectedEmotion(null); setWheelLayer('core'); }} className="mb-6">
              ← Volver
            </Button>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Rueda de Emociones</h2>
              <p className="text-gray-600">Basada en la teoría de Robert Plutchik. Explora tus emociones desde las más intensas hasta las más suaves.</p>
            </div>

            <div className="flex justify-center gap-2 mb-8">
              {(['core', 'middle', 'outer'] as const).map((layer) => (
                <Button
                  key={layer}
                  variant={wheelLayer === layer ? 'default' : 'outline'}
                  onClick={() => { setWheelLayer(layer); setWheelSelectedEmotion(null); }}
                  className={wheelLayer === layer ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white' : ''}
                >
                  {layer === 'core' ? '🔥 Intensas' : layer === 'middle' ? '⚡ Básicas' : '🌊 Suaves'}
                </Button>
              ))}
            </div>

            <div className="relative mb-8">
              <div className="grid grid-cols-4 gap-3">
                {currentEmotions.map((emotion, index) => (
                  <Card
                    key={emotion.name}
                    className={`p-4 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg text-center ${
                      wheelSelectedEmotion?.name === emotion.name ? 'ring-2 ring-offset-2 shadow-xl scale-105' : ''
                    }`}
                    style={{
                      borderColor: emotion.color,
                      borderWidth: '2px',
                      background: wheelSelectedEmotion?.name === emotion.name
                        ? `linear-gradient(135deg, ${emotion.color}20, ${emotion.color}10)`
                        : undefined
                    }}
                    onClick={() => setWheelSelectedEmotion(emotion)}
                  >
                    <span className="text-3xl block mb-2">{emotion.emoji}</span>
                    <p className="font-semibold text-sm text-gray-900">{emotion.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{emotion.family}</p>
                  </Card>
                ))}
              </div>
            </div>

            {wheelSelectedEmotion && (
              <Card className="p-6 mb-8 border-2 animate-in fade-in duration-300" style={{ borderColor: wheelSelectedEmotion.color }}>
                <div className="flex items-start gap-4">
                  <span className="text-5xl">{wheelSelectedEmotion.emoji}</span>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900">{wheelSelectedEmotion.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">Familia: {wheelSelectedEmotion.family} · Intensidad: {layerLabels[wheelLayer]}</p>
                    <p className="text-gray-700 mb-4">{wheelSelectedEmotion.description}</p>
                    <Button
                      onClick={() => { saveWheelEmotion(wheelSelectedEmotion); }}
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
                    >
                      📝 Registrar esta emoción
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Emociones Combinadas (Díadas)</h3>
              <p className="text-gray-600 text-center text-sm mb-6">Cuando dos emociones básicas se mezclan, surgen emociones complejas</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {combinedEmotions.map((emotion) => (
                  <Card
                    key={emotion.name}
                    className="p-4 cursor-pointer hover:shadow-lg transition-all text-center hover:scale-105"
                    onClick={() => {
                      setWheelSelectedEmotion({ ...emotion, family: emotion.from });
                    }}
                  >
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${emotion.color} mx-auto mb-2 flex items-center justify-center`}>
                      <span className="text-lg">{emotion.emoji}</span>
                    </div>
                    <p className="font-semibold text-sm text-gray-900">{emotion.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{emotion.from}</p>
                  </Card>
                ))}
              </div>
            </div>

            <Card className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
              <h3 className="font-bold text-gray-900 mb-2">💡 ¿Para qué sirve?</h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• <strong>Ampliar tu vocabulario emocional</strong> — Pasar de "estoy mal" a identificar exactamente qué sientes</li>
                <li>• <strong>Comprender la intensidad</strong> — No es lo mismo molestia que furia, ni melancolía que duelo</li>
                <li>• <strong>Descubrir emociones mixtas</strong> — Muchas veces sentimos combinaciones, como amor (alegría + confianza)</li>
                <li>• <strong>Comunicar mejor</strong> — Saber nombrar lo que sientes facilita la comunicación con los demás</li>
              </ul>
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

  // ─── DASHBOARD EMOCIONAL ────────────────────────────────────────────
  if (currentView === 'emotion-dashboard') {
    const logs: Array<{emotion: string; note: string; date: string}> =
      JSON.parse(localStorage.getItem('nflow-emotion-logs') || '[]');
    const emotions = [
      { emoji: '😊', label: 'Feliz' }, { emoji: '😌', label: 'Tranquilo/a' },
      { emoji: '😔', label: 'Triste' }, { emoji: '😰', label: 'Ansioso/a' },
      { emoji: '😡', label: 'Enfadado/a' }, { emoji: '😴', label: 'Cansado/a' },
      { emoji: '🤩', label: 'Emocionado/a' }, { emoji: '😶', label: 'Neutral' },
    ];
    const last14 = logs.slice(-14);
    const countByEmotion: Record<string, number> = {};
    last14.forEach(l => { countByEmotion[l.emotion] = (countByEmotion[l.emotion] || 0) + 1; });
    const maxCount = Math.max(1, ...Object.values(countByEmotion));
    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split('T')[0];
    });
    const dayLabels = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        <Header />
        <main className="pt-24 pb-12 px-4">
          <div className="max-w-2xl mx-auto">
            <Button variant="ghost" onClick={() => setCurrentView('main')} className="mb-6">← Volver</Button>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">📊 Dashboard Emocional</h2>
            <p className="text-gray-500 mb-8">Tu evolución de las últimas 2 semanas</p>

            {logs.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-gray-500 text-lg mb-2">Aún no tienes registros emocionales</p>
                <p className="text-gray-400 text-sm mb-4">Empieza a registrar cómo te sientes cada día</p>
                <Button onClick={() => setCurrentView('emotional-log')}>Hacer mi primer registro</Button>
              </Card>
            ) : (
              <>
                <Card className="p-6 mb-6">
                  <h3 className="font-bold text-gray-800 mb-4">Últimos 7 días</h3>
                  <div className="flex items-end gap-2 h-24">
                    {weekDays.map((day, i) => {
                      const dayLogs = logs.filter(l => l.date?.startsWith(day));
                      return (
                        <div key={day} className="flex-1 flex flex-col items-center gap-1">
                          <div className="w-full bg-indigo-100 rounded-t-md relative" style={{ height: '80px' }}>
                            {dayLogs.length > 0 && (
                              <div
                                className="absolute bottom-0 w-full bg-gradient-to-t from-indigo-500 to-indigo-400 rounded-t-md flex items-center justify-center text-sm"
                                style={{ height: `${Math.min(100, dayLogs.length * 40)}%` }}
                              >
                                {dayLogs[dayLogs.length - 1]?.emotion}
                              </div>
                            )}
                          </div>
                          <span className="text-xs text-gray-400">{dayLabels[i]}</span>
                        </div>
                      );
                    })}
                  </div>
                </Card>

                <Card className="p-6 mb-6">
                  <h3 className="font-bold text-gray-800 mb-4">Distribución de emociones (últimas 2 semanas)</h3>
                  <div className="space-y-3">
                    {emotions.filter(e => countByEmotion[e.emoji] > 0).sort((a, b) => (countByEmotion[b.emoji] || 0) - (countByEmotion[a.emoji] || 0)).map(e => (
                      <div key={e.emoji} className="flex items-center gap-3">
                        <span className="text-xl w-7">{e.emoji}</span>
                        <span className="text-sm text-gray-600 w-24">{e.label}</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all"
                            style={{ width: `${((countByEmotion[e.emoji] || 0) / maxCount) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold text-gray-700 w-4">{countByEmotion[e.emoji]}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
                  <h3 className="font-bold text-gray-800 mb-2">Total de registros</h3>
                  <p className="text-4xl font-bold text-indigo-600">{logs.length}</p>
                  <p className="text-gray-500 text-sm">días en los que has cuidado tu salud emocional 💜</p>
                </Card>
              </>
            )}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ─── TEST DE BIENESTAR SEMANAL ───────────────────────────────────────
  if (currentView === 'bienestar-test') {
    const questions = [
      '¿Cómo de bien has dormido esta semana?',
      '¿Te has sentido con energía y vitalidad?',
      '¿Has podido disfrutar de las cosas del día a día?',
      '¿Te has sentido conectado/a con las personas que te importan?',
      '¿Has podido manejar el estrés sin que te desbordara?',
    ];
    const labels = ['Muy mal', 'Mal', 'Regular', 'Bien', 'Muy bien'];
    const totalScore = bienestarAnswers.reduce((a, b) => a + b, 0);
    const getLabel = (s: number) => s <= 9 ? { label: 'Bajo', color: 'text-red-600', bg: 'bg-red-100', emoji: '😔' }
      : s <= 14 ? { label: 'Moderado', color: 'text-amber-600', bg: 'bg-amber-100', emoji: '😐' }
      : s <= 19 ? { label: 'Bueno', color: 'text-blue-600', bg: 'bg-blue-100', emoji: '😊' }
      : { label: 'Excelente', color: 'text-emerald-600', bg: 'bg-emerald-100', emoji: '🌟' };
    const result = getLabel(totalScore);

    const handleBienestarSubmit = () => {
      const today = new Date().toISOString().split('T')[0];
      const entry = { date: today, score: totalScore, label: result.label };
      const history = JSON.parse(localStorage.getItem('nuxa-bienestar-history') || '[]');
      const filtered = history.filter((h: any) => h.date !== today);
      filtered.push(entry);
      const last8 = filtered.slice(-8);
      localStorage.setItem('nuxa-bienestar-history', JSON.stringify(last8));
      setBienestarHistory(last8);
      setBienestarSubmitted(true);
    };

    const savedHistory: Array<{date: string; score: number; label: string}> =
      JSON.parse(localStorage.getItem('nuxa-bienestar-history') || '[]');

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        <Header />
        <main className="pt-24 pb-12 px-4">
          <div className="max-w-xl mx-auto">
            <Button variant="ghost" onClick={() => { setCurrentView('main'); setBienestarSubmitted(false); setBienestarAnswers([3,3,3,3,3]); }} className="mb-6">← Volver</Button>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">🧘 Test de Bienestar</h2>
            <p className="text-gray-500 mb-8">5 preguntas para medir cómo estás esta semana</p>

            {bienestarSubmitted ? (
              <div className="space-y-6">
                <Card className={`p-8 text-center border-2 ${result.bg}`}>
                  <div className="text-6xl mb-3">{result.emoji}</div>
                  <p className="text-gray-600 mb-1">Tu índice de bienestar esta semana</p>
                  <p className={`text-5xl font-black mb-1 ${result.color}`}>{totalScore}<span className="text-xl font-normal">/25</span></p>
                  <Badge className={`${result.bg} ${result.color} border-0 text-sm font-bold px-4 py-1`}>{result.label}</Badge>
                </Card>

                {savedHistory.length > 1 && (
                  <Card className="p-6">
                    <h3 className="font-bold text-gray-800 mb-4">Tu evolución</h3>
                    <div className="flex items-end gap-2 h-20">
                      {savedHistory.slice(-6).map((h, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <div className="w-full bg-gray-100 rounded-t relative" style={{ height: '64px' }}>
                            <div
                              className="absolute bottom-0 w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t"
                              style={{ height: `${(h.score / 25) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-400">{h.date.slice(5)}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                <Button className="w-full" variant="outline" onClick={() => { setBienestarSubmitted(false); setBienestarAnswers([3,3,3,3,3]); }}>
                  Repetir test
                </Button>
              </div>
            ) : (
              <Card className="p-6 space-y-6">
                {questions.map((q, i) => (
                  <div key={i}>
                    <p className="font-semibold text-gray-800 mb-3 text-sm">{i + 1}. {q}</p>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(v => (
                        <button
                          key={v}
                          onClick={() => setBienestarAnswers(a => a.map((x, j) => j === i ? v : x))}
                          className={`flex-1 py-2 rounded-lg text-sm font-semibold border-2 transition-all ${bienestarAnswers[i] === v ? 'border-blue-500 bg-blue-100 text-blue-800' : 'border-gray-200 bg-white text-gray-500 hover:border-blue-300'}`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-1 px-1">
                      <span>{labels[0]}</span><span>{labels[4]}</span>
                    </div>
                  </div>
                ))}
                <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleBienestarSubmit}>
                  Ver mi resultado
                </Button>
              </Card>
            )}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ─── PROGRAMAS DE 7 DÍAS ────────────────────────────────────────────
  if (currentView === 'programa-7dias') {
    const programas = {
      ansiedad: {
        title: 'Reducir la Ansiedad',
        emoji: '😰',
        color: 'from-blue-500 to-indigo-500',
        bg: 'from-blue-50 to-indigo-50',
        border: 'border-blue-200',
        days: [
          { title: 'Respira', desc: 'Técnica 4-7-8: inhala 4s, mantén 7s, exhala 8s. Hazlo 3 veces al día.', tool: 'breathing', badge: '🌬️ 5 min' },
          { title: 'Identifica', desc: 'Usa la rueda de emociones para poner nombre exacto a lo que sientes.', tool: 'emotion-wheel', badge: '🎯 10 min' },
          { title: 'Ancla', desc: 'Grounding 5-4-3-2-1: identifica 5 cosas que ves, 4 que tocas...', tool: 'grounding', badge: '🧩 8 min' },
          { title: 'Registra', desc: 'Anota tu emoción principal de hoy. La escritura alivia la carga mental.', tool: 'emotional-log', badge: '📝 3 min' },
          { title: 'Estimula', desc: 'Estimulación bilateral: mueve los ojos de izquierda a derecha siguiendo el punto.', tool: 'bilateral', badge: '👆 5 min' },
          { title: 'Cuadra', desc: 'Respiración cuadrada: inhala 4s, mantén 4s, exhala 4s. Para el bucle mental.', tool: 'breathing', badge: '🌬️ 5 min' },
          { title: 'Celebra', desc: 'Escribe 3 cosas por las que estás agradecido/a esta semana.', tool: 'gratitude', badge: '🙏 5 min' },
        ],
      },
      sueno: {
        title: 'Mejorar el Sueño',
        emoji: '😴',
        color: 'from-indigo-500 to-purple-500',
        bg: 'from-indigo-50 to-purple-50',
        border: 'border-indigo-200',
        days: [
          { title: 'Relajación nocturna', desc: 'Técnica 4-7-8 antes de dormir. Activa el sistema parasimpático.', tool: 'breathing', badge: '🌬️ 5 min' },
          { title: 'Cierra el día', desc: 'Escribe 3 cosas buenas del día antes de dormir. Activa la mente positiva.', tool: 'gratitude', badge: '🙏 3 min' },
          { title: 'Suelta tensión', desc: 'Mapa de estrés corporal: trabaja las zonas tensas antes de acostarte.', tool: 'body-stress', badge: '🧍 10 min' },
          { title: 'Registro emocional', desc: 'Anota cómo has dormido y cómo te has sentido al despertar.', tool: 'emotional-log', badge: '📝 3 min' },
          { title: 'Coherencia cardíaca', desc: 'Respiración coherente: inhala 5s, exhala 5s durante 5 minutos.', tool: 'breathing', badge: '🌬️ 5 min' },
          { title: 'Libera el cuerpo', desc: 'Estimulación bilateral para soltar el estrés acumulado del día.', tool: 'bilateral', badge: '👆 5 min' },
          { title: 'Evalúa tu semana', desc: 'Haz el test de bienestar y celebra haber dedicado 7 días a tu descanso.', tool: 'bienestar-test', badge: '🧘 5 min' },
        ],
      },
      autoestima: {
        title: 'Fortalecer la Autoestima',
        emoji: '💪',
        color: 'from-purple-500 to-pink-500',
        bg: 'from-purple-50 to-pink-50',
        border: 'border-purple-200',
        days: [
          { title: 'Reconócete', desc: 'Escribe 3 cualidades que aprecias de ti mismo/a. Sin filtros.', tool: 'gratitude', badge: '🙏 5 min' },
          { title: 'Identifica tu voz interna', desc: 'Registra las emociones que sientes cuando te juzgas. ¿Qué emociones son?', tool: 'emotion-wheel', badge: '🎯 10 min' },
          { title: 'Evalúa tu autoestima', desc: 'Test de autoestima para conocer tu punto de partida real.', tool: 'evaluation', badge: '📋 5 min' },
          { title: 'Ancla en el presente', desc: 'Grounding para salir del bucle de pensamientos críticos sobre ti.', tool: 'grounding', badge: '🧩 8 min' },
          { title: 'Afirmación del día', desc: 'Lee y repite la afirmación de hoy. Dila en voz alta frente al espejo.', tool: 'affirmation', badge: '✨ 2 min' },
          { title: 'Registra un logro', desc: 'Anota algo que hayas hecho bien hoy, por pequeño que sea.', tool: 'emotional-log', badge: '📝 3 min' },
          { title: 'Celebra la semana', desc: 'Escribe 3 cosas de ti mismo/a que esta semana han mejorado.', tool: 'gratitude', badge: '🙏 5 min' },
        ],
      },
    } as const;

    const savedProgress: Record<string, number[]> = JSON.parse(localStorage.getItem('nuxa-programas') || '{}');

    const toggleDay = (prog: string, day: number) => {
      const current = savedProgress[prog] || [];
      const updated = current.includes(day) ? current.filter(d => d !== day) : [...current, day];
      savedProgress[prog] = updated;
      localStorage.setItem('nuxa-programas', JSON.stringify(savedProgress));
      setProgramaProgress({ ...savedProgress });
    };

    if (selectedPrograma) {
      const prog = programas[selectedPrograma];
      const completed = savedProgress[selectedPrograma] || [];
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
          <Header />
          <main className="pt-24 pb-12 px-4">
            <div className="max-w-xl mx-auto">
              <Button variant="ghost" onClick={() => setSelectedPrograma(null)} className="mb-6">← Programas</Button>
              <div className={`rounded-2xl bg-gradient-to-br ${prog.bg} border ${prog.border} p-6 mb-8`}>
                <div className="text-4xl mb-2">{prog.emoji}</div>
                <h2 className="text-2xl font-bold text-gray-900">7 días para {prog.title}</h2>
                <p className="text-gray-500 text-sm mt-1">{completed.length}/7 días completados</p>
                <div className="flex gap-1 mt-3">
                  {Array.from({length: 7}, (_, i) => (
                    <div key={i} className={`flex-1 h-2 rounded-full ${completed.includes(i) ? `bg-gradient-to-r ${prog.color}` : 'bg-gray-200'}`} />
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {prog.days.map((day, i) => {
                  const done = completed.includes(i);
                  return (
                    <Card key={i} className={`p-4 border-2 transition-all ${done ? `${prog.border} bg-white` : 'border-gray-100'}`}>
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => toggleDay(selectedPrograma, i)}
                          className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${done ? `bg-gradient-to-br ${prog.color} border-transparent` : 'border-gray-300'}`}
                        >
                          {done && <span className="text-white text-xs font-bold">✓</span>}
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Día {i + 1}</span>
                            <Badge className="text-xs bg-gray-100 text-gray-600 border-0">{day.badge}</Badge>
                          </div>
                          <p className="font-bold text-gray-900 text-sm">{day.title}</p>
                          <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{day.desc}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setCurrentView(day.tool as any)}
                          className="flex-shrink-0 text-xs"
                        >
                          Ir →
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {completed.length === 7 && (
                <Card className="mt-6 p-6 text-center bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
                  <div className="text-4xl mb-2">🎉</div>
                  <h3 className="font-bold text-gray-900">¡Programa completado!</h3>
                  <p className="text-gray-500 text-sm">Has dedicado 7 días a cuidar tu salud mental. Eso importa.</p>
                </Card>
              )}
            </div>
          </main>
          <Footer />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        <Header />
        <main className="pt-24 pb-12 px-4">
          <div className="max-w-xl mx-auto">
            <Button variant="ghost" onClick={() => setCurrentView('main')} className="mb-6">← Volver</Button>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">📅 Programas de 7 Días</h2>
            <p className="text-gray-500 mb-8">Guías estructuradas para trabajar un objetivo concreto durante una semana</p>

            <div className="space-y-4">
              {(Object.entries(programas) as Array<[keyof typeof programas, typeof programas[keyof typeof programas]]>).map(([key, prog]) => {
                const done = (savedProgress[key] || []).length;
                return (
                  <Card
                    key={key}
                    className={`p-6 cursor-pointer border-2 ${prog.border} hover:shadow-lg transition-all`}
                    onClick={() => { setSelectedPrograma(key); setProgramaProgress({ ...savedProgress }); }}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${prog.color} flex items-center justify-center text-3xl shadow`}>
                        {prog.emoji}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900">7 días para {prog.title}</p>
                        <div className="flex gap-1 mt-2">
                          {Array.from({length: 7}, (_, i) => (
                            <div key={i} className={`flex-1 h-1.5 rounded-full ${(savedProgress[key] || []).includes(i) ? `bg-gradient-to-r ${prog.color}` : 'bg-gray-200'}`} />
                          ))}
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{done}/7 días completados</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ─── MEDITACIONES GUIADAS ───────────────────────────────────────────
  if (currentView === 'meditacion') {
    const meditaciones = [
      {
        id: 'calma',
        title: 'Calma en 5 minutos',
        emoji: '🌊',
        duracion: '5 min',
        color: 'from-blue-500 to-cyan-500',
        bg: 'from-blue-50 to-cyan-50',
        border: 'border-blue-200',
        texto: 'Cierra los ojos suavemente. Siente el peso de tu cuerpo sobre la silla o el suelo. Respira de forma natural, sin forzar. Inhala... y exhala... Con cada respiración, sientes cómo tu cuerpo se relaja un poco más. Nota tus pies en el suelo. Nota el contacto de tu ropa con tu piel. Estás aquí. Estás a salvo. Permite que tus pensamientos pasen como nubes en el cielo, sin aferrarte a ninguno. Solo respira. Inhala tranquilidad... exhala tensión. Eres suficiente. Estás bien. Poco a poco, cuando estés listo, abre los ojos con suavidad.',
      },
      {
        id: 'sueno',
        title: 'Preparación para dormir',
        emoji: '🌙',
        duracion: '8 min',
        color: 'from-indigo-500 to-purple-500',
        bg: 'from-indigo-50 to-purple-50',
        border: 'border-indigo-200',
        texto: 'Es de noche. El día ha terminado. Permítete soltar todo lo que pasó hoy. No hay nada que resolver ahora. Relaja los pies... las piernas... la barriga... Los hombros... el cuello... la mandíbula. Respira profundamente. Tu cama es tu lugar seguro. Nada puede hacerte daño aquí. Siente el calor de las sábanas. Deja que tu cuerpo se hunda en el colchón. Cada respiración te lleva más cerca del descanso. Inhala... exhala... Tu mente se tranquiliza. No hay nada urgente. Solo este momento, esta respiración, este descanso que mereces. Duerme.',
      },
      {
        id: 'ansiedad',
        title: 'Soltar la ansiedad',
        emoji: '🍃',
        duracion: '6 min',
        color: 'from-green-500 to-emerald-500',
        bg: 'from-green-50 to-emerald-50',
        border: 'border-green-200',
        texto: 'Noto que hay tensión en mi cuerpo. Está bien. No tengo que luchar contra ella. Solo voy a observarla. ¿Dónde la siento? ¿En el pecho? ¿En el estómago? Respiro hacia ese lugar. Inhalo contando hasta cuatro. Uno... dos... tres... cuatro. Mantengo el aire contando hasta siete. Exhalo contando hasta ocho. La tensión empieza a aflojarse. No todo tiene solución ahora mismo. No todo depende de mí. Puedo soltar el control. Inhalo calma, exhalo miedo. Soy capaz de estar con esta incomodidad. Pasará. Siempre pasa.',
      },
      {
        id: 'autoestima',
        title: 'Reconócete',
        emoji: '💛',
        duracion: '5 min',
        color: 'from-amber-500 to-orange-500',
        bg: 'from-amber-50 to-orange-50',
        border: 'border-amber-200',
        texto: 'Pon una mano en el pecho. Siente tu corazón. Está latiendo por ti, sin que tengas que pedírselo. Tu cuerpo trabaja para ti cada segundo. Mereces cuidado. Mereces amabilidad. Especialmente de ti mismo. Hoy has hecho lo que has podido. Con lo que tenías. Eso es suficiente. No tienes que ser perfecto. No tienes que tenerlo todo resuelto. Eres una persona válida, con fortalezas que a veces no ves. Respira. Repite en silencio: soy suficiente. Estoy haciendo lo mejor que puedo. Me merezco compasión.',
      },
    ];

    const playMeditacion = (med: typeof meditaciones[0]) => {
      if (meditacionPlayingId === med.id) {
        window.speechSynthesis.cancel();
        setMeditacionPlayingId(null);
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(med.texto);
      utterance.lang = 'es-ES';
      utterance.rate = 0.8;
      utterance.pitch = 1.0;
      utterance.volume = 1;
      const voices = window.speechSynthesis.getVoices();
      const spanish = voices.find(v => v.lang.startsWith('es'));
      if (spanish) utterance.voice = spanish;
      utterance.onend = () => setMeditacionPlayingId(null);
      utterance.onerror = () => setMeditacionPlayingId(null);
      speechSynthRef.current = utterance;
      setMeditacionPlayingId(med.id);
      window.speechSynthesis.speak(utterance);
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        <Header />
        <main className="pt-24 pb-12 px-4">
          <div className="max-w-xl mx-auto">
            <Button variant="ghost" onClick={() => { window.speechSynthesis.cancel(); setMeditacionPlayingId(null); setCurrentView('main'); }} className="mb-6">← Volver</Button>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">🎧 Meditaciones Guiadas</h2>
            <p className="text-gray-500 mb-2">Pulsa el botón para escuchar la meditación en voz alta</p>
            <p className="text-xs text-gray-400 mb-8">Usa auriculares para una mejor experiencia · Voz del dispositivo</p>

            <div className="space-y-4">
              {meditaciones.map(med => {
                const isPlaying = meditacionPlayingId === med.id;
                return (
                  <Card key={med.id} className={`p-5 border-2 ${med.border} bg-gradient-to-br ${med.bg} transition-all ${isPlaying ? 'shadow-lg' : ''}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${med.color} flex items-center justify-center text-3xl shadow flex-shrink-0`}>
                        {isPlaying ? '🔊' : med.emoji}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900">{med.title}</p>
                        <p className="text-xs text-gray-500">⏱ {med.duracion}</p>
                        {isPlaying && (
                          <div className="flex gap-0.5 mt-2">
                            {[1,2,3,4,5].map(i => (
                              <div key={i} className={`w-1 bg-gradient-to-t ${med.color} rounded-full animate-pulse`} style={{ height: `${8 + (i % 3) * 6}px`, animationDelay: `${i * 100}ms` }} />
                            ))}
                          </div>
                        )}
                      </div>
                      <Button
                        onClick={() => playMeditacion(med)}
                        className={`flex-shrink-0 ${isPlaying ? 'bg-gray-700 hover:bg-gray-800' : `bg-gradient-to-br ${med.color} hover:opacity-90`} text-white border-0`}
                      >
                        {isPlaying ? '⏹ Parar' : '▶ Escuchar'}
                      </Button>
                    </div>
                    {isPlaying && (
                      <p className="text-xs text-gray-500 mt-3 leading-relaxed border-t border-gray-200/60 pt-3 italic">
                        {med.texto.slice(0, 100)}...
                      </p>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ─── BIBLIOTECA DE AUTOAYUDA CONTRASTADA ────────────────────────────
  if (currentView === 'biblioteca') {
    const libros = [
      // ANSIEDAD
      { id: 'b1', cat: 'ansiedad', titulo: 'Sin miedo', autor: 'Rafael Santandreu', nivel: 'Divulgación', evidencia: '⭐⭐⭐⭐', para: 'Personas con ansiedad general y pensamientos catastrofistas', espera: 'Técnicas cognitivas prácticas basadas en la TREC de Albert Ellis. Muy accesible y directo.', noEsPara: 'Ansiedad severa o trastorno de pánico sin diagnóstico previo', emoji: '😌' },
      { id: 'b2', cat: 'ansiedad', titulo: 'El cerebro ansioso', autor: 'Joseph LeDoux', nivel: 'Divulgación científica', evidencia: '⭐⭐⭐⭐⭐', para: 'Quien quiere entender la neurociencia del miedo', espera: 'Comprender por qué el cerebro genera ansiedad y cómo funciona la amígdala. Base teórica sólida.', noEsPara: 'Búsqueda de técnicas rápidas; es más conceptual que práctico', emoji: '🧠' },
      { id: 'b3', cat: 'ansiedad', titulo: 'La trampa de la felicidad', autor: 'Russ Harris', nivel: 'Autoayuda con evidencia', evidencia: '⭐⭐⭐⭐⭐', para: 'Ansiedad, estrés crónico y lucha contra emociones difíciles', espera: 'Terapia de Aceptación y Compromiso (ACT). Aprenderás a relacionarte diferente con tus pensamientos.', noEsPara: 'Quien busca eliminar la ansiedad; ACT trabaja desde la aceptación', emoji: '🍃' },
      // DEPRESIÓN
      { id: 'b4', cat: 'depresion', titulo: 'Sentirse bien', autor: 'David D. Burns', nivel: 'Autoayuda clínica', evidencia: '⭐⭐⭐⭐⭐', para: 'Depresión leve-moderada, baja autoestima, perfeccionismo', espera: 'El clásico de la terapia cognitiva. Ejercicios prácticos para identificar y cambiar pensamientos distorsionados.', noEsPara: 'Depresión severa sin acompañamiento profesional simultáneo', emoji: '☀️' },
      { id: 'b5', cat: 'depresion', titulo: 'El hombre en busca de sentido', autor: 'Viktor Frankl', nivel: 'Autobiografía y psicología', evidencia: '⭐⭐⭐⭐⭐', para: 'Depresión existencial, falta de propósito, pérdida de sentido vital', espera: 'Logoterapia: encontrar sentido incluso en el sufrimiento. Profundamente transformador.', noEsPara: 'Quien busca técnicas prácticas inmediatas', emoji: '🕯️' },
      { id: 'b6', cat: 'depresion', titulo: 'Vencer la depresión', autor: 'Martin Seligman', nivel: 'Divulgación científica', evidencia: '⭐⭐⭐⭐', para: 'Depresión leve y prevención de recaídas', espera: 'Enfoque de psicología positiva. Técnicas para cultivar optimismo realista basado en evidencia.', noEsPara: 'Crisis depresiva aguda; orientado más a la prevención', emoji: '🌱' },
      // RELACIONES
      { id: 'b7', cat: 'relaciones', titulo: 'Amar o depender', autor: 'Walter Riso', nivel: 'Autoayuda', evidencia: '⭐⭐⭐⭐', para: 'Dependencia emocional, relaciones tóxicas, apego ansioso', espera: 'Diferencia entre amor sano y dependencia. Práctico y directo. Ayuda a identificar patrones dañinos.', noEsPara: 'Relaciones con violencia; en ese caso priorizar apoyo profesional urgente', emoji: '💔' },
      { id: 'b8', cat: 'relaciones', titulo: 'Apego', autor: 'Amir Levine y Rachel Heller', nivel: 'Divulgación científica', evidencia: '⭐⭐⭐⭐⭐', para: 'Entender el propio estilo de apego (ansioso, evitativo, seguro)', espera: 'Traducción rigurosa de la teoría del apego de Bowlby a situaciones cotidianas de pareja.', noEsPara: 'Quien prefiere técnicas directas sin marco teórico previo', emoji: '🔗' },
      { id: 'b9', cat: 'relaciones', titulo: 'Límites', autor: 'Henry Cloud y John Townsend', nivel: 'Autoayuda', evidencia: '⭐⭐⭐⭐', para: 'Dificultad para poner límites, complacencia, relaciones desequilibradas', espera: 'Cómo establecer límites sanos en todas las relaciones. Enfoque muy práctico con ejemplos reales.', noEsPara: 'Quien busca marco científico; tiene base más humanista-cristiana que clínica', emoji: '🚧' },
      // DUELO
      { id: 'b10', cat: 'duelo', titulo: 'Sobre la muerte y los moribundos', autor: 'Elisabeth Kübler-Ross', nivel: 'Clásico clínico', evidencia: '⭐⭐⭐⭐⭐', para: 'Duelo por pérdida de seres queridos, enfermedad terminal propia o ajena', espera: 'Las 5 fases del duelo. Marco fundamental para entender el proceso de pérdida.', noEsPara: 'Duelo patológico complicado que requiere intervención especializada', emoji: '🕊️' },
      { id: 'b11', cat: 'duelo', titulo: 'Una pena en observación', autor: 'C.S. Lewis', nivel: 'Autobiografía', evidencia: '⭐⭐⭐⭐', para: 'Duelo reciente, especialmente pérdida de pareja', espera: 'Diario íntimo del autor tras la muerte de su esposa. Honesto, crudo y profundamente humano.', noEsPara: 'Quien busca técnicas; es un relato emocional, no un manual', emoji: '📔' },
      // CRIANZA
      { id: 'b12', cat: 'crianza', titulo: 'El cerebro del niño', autor: 'Daniel J. Siegel y Tina Payne Bryson', nivel: 'Divulgación científica', evidencia: '⭐⭐⭐⭐⭐', para: 'Padres y madres con hijos de 2 a 12 años', espera: 'Neurociencia aplicada a la crianza. Cómo hablar con el niño cuando tiene rabietas y cómo integrar emociones.', noEsPara: 'Adolescentes (hay otros libros más específicos para esa etapa)', emoji: '🧒' },
      { id: 'b13', cat: 'crianza', titulo: 'Cómo hablar para que sus hijos le escuchen', autor: 'Adele Faber y Elaine Mazlish', nivel: 'Autoayuda clínica', evidencia: '⭐⭐⭐⭐⭐', para: 'Comunicación con hijos de cualquier edad', espera: 'Técnicas concretas de comunicación no violenta con niños. Con ejemplos y ejercicios prácticos.', noEsPara: 'Situaciones de trastorno de conducta severo que requieren intervención profesional', emoji: '🗣️' },
      // BURNOUT / TRABAJO
      { id: 'b14', cat: 'burnout', titulo: 'Cuando el cuerpo dice no', autor: 'Gabor Maté', nivel: 'Divulgación médica', evidencia: '⭐⭐⭐⭐⭐', para: 'Estrés crónico, enfermedades relacionadas con el estrés, personas muy exigentes consigo mismas', espera: 'La relación entre represión emocional y enfermedad física. Potente y transformador.', noEsPara: 'Quien busca soluciones rápidas; invita a una reflexión profunda', emoji: '😮‍💨' },
      { id: 'b15', cat: 'burnout', titulo: 'Primero, rompe todas las reglas', autor: 'Marcus Buckingham', nivel: 'Gestión y bienestar laboral', evidencia: '⭐⭐⭐⭐', para: 'Burnout por desajuste vocacional, desenganche laboral', espera: 'Basado en investigación de Gallup. Cómo identificar fortalezas propias y rediseñar el trabajo desde ahí.', noEsPara: 'Burnout clínico severo; ese caso requiere baja laboral y apoyo terapéutico', emoji: '💼' },
      // AUTOESTIMA / TRAUMA
      { id: 'b16', cat: 'autoestima', titulo: 'Los seis pilares de la autoestima', autor: 'Nathaniel Branden', nivel: 'Clásico de psicología', evidencia: '⭐⭐⭐⭐⭐', para: 'Baja autoestima, autocrítica excesiva, dependencia de validación externa', espera: 'El tratado más completo sobre autoestima. Seis prácticas concretas con ejercicios de escritura.', noEsPara: 'Lectura rápida; es denso pero muy valioso si se trabaja despacio', emoji: '💛' },
      { id: 'b17', cat: 'autoestima', titulo: 'Autocompasión', autor: 'Kristin Neff', nivel: 'Investigación + práctica', evidencia: '⭐⭐⭐⭐⭐', para: 'Autocrítica dura, perfeccionismo, vergüenza crónica', espera: 'La investigadora mundial más relevante en autocompasión. Combina ciencia y ejercicios prácticos de mindfulness.', noEsPara: 'Quien rechaza el concepto de autocompasión por confundirlo con debilidad', emoji: '🤍' },
      { id: 'b18', cat: 'trauma', titulo: 'El cuerpo lleva la cuenta', autor: 'Bessel van der Kolk', nivel: 'Divulgación científica', evidencia: '⭐⭐⭐⭐⭐', para: 'Trauma (PTSD, trauma complejo, abuso, accidentes)', espera: 'El libro de referencia mundial sobre trauma. Explica cómo el trauma queda almacenado en el cuerpo y qué tratamientos funcionan.', noEsPara: 'Quien está en plena crisis postraumática sin apoyo profesional; puede activar recuerdos', emoji: '🩹' },
    ];

    const categorias = [
      { id: 'todas', label: 'Todas', emoji: '📚' },
      { id: 'ansiedad', label: 'Ansiedad', emoji: '😰' },
      { id: 'depresion', label: 'Depresión', emoji: '☁️' },
      { id: 'relaciones', label: 'Relaciones', emoji: '❤️' },
      { id: 'duelo', label: 'Duelo', emoji: '🕊️' },
      { id: 'crianza', label: 'Crianza', emoji: '🧒' },
      { id: 'burnout', label: 'Burnout', emoji: '🔥' },
      { id: 'autoestima', label: 'Autoestima', emoji: '💛' },
      { id: 'trauma', label: 'Trauma', emoji: '🩹' },
    ];

    const filtrados = bibliotecaCategoria === 'todas' ? libros : libros.filter(l => l.cat === bibliotecaCategoria);

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-amber-50 to-orange-50">
        <Header />
        <main className="pt-24 pb-12 px-4">
          <div className="max-w-3xl mx-auto">
            <Button variant="ghost" onClick={() => setCurrentView('main')} className="mb-6">← Volver</Button>
            <h2 className="text-3xl font-bold text-gray-900 mb-1">📚 Biblioteca de Autoayuda</h2>
            <p className="text-gray-500 mb-2">Solo libros con base clínica o científica contrastada. Seleccionados por una psicóloga.</p>
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-6">⚠️ Ningún libro sustituye la psicoterapia. Son complementos, no tratamientos.</p>

            {/* Filtros */}
            <div className="flex flex-wrap gap-2 mb-8">
              {categorias.map(c => (
                <button
                  key={c.id}
                  onClick={() => setBibliotecaCategoria(c.id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-semibold border-2 transition-all ${bibliotecaCategoria === c.id ? 'bg-amber-600 text-white border-amber-600' : 'bg-white text-gray-600 border-gray-200 hover:border-amber-400'}`}
                >
                  {c.emoji} {c.label}
                </button>
              ))}
            </div>

            {/* Libros */}
            <div className="space-y-4">
              {filtrados.map(libro => (
                <Card key={libro.id} className="p-5 border border-amber-100 hover:shadow-md transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center text-2xl flex-shrink-0 shadow">
                      {libro.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900">{libro.titulo}</h3>
                        <Badge className="bg-amber-100 text-amber-700 border-0 text-xs">{libro.nivel}</Badge>
                        <span className="text-xs text-gray-400">{libro.evidencia}</span>
                      </div>
                      <p className="text-sm text-gray-500 mb-3">— {libro.autor}</p>
                      <div className="grid sm:grid-cols-3 gap-3 text-xs">
                        <div className="bg-emerald-50 rounded-lg p-2 border border-emerald-100">
                          <p className="font-bold text-emerald-700 mb-0.5">✓ Para quién</p>
                          <p className="text-gray-600 leading-relaxed">{libro.para}</p>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-2 border border-blue-100">
                          <p className="font-bold text-blue-700 mb-0.5">📖 Qué esperar</p>
                          <p className="text-gray-600 leading-relaxed">{libro.espera}</p>
                        </div>
                        <div className="bg-red-50 rounded-lg p-2 border border-red-100">
                          <p className="font-bold text-red-700 mb-0.5">✗ No es para ti si...</p>
                          <p className="text-gray-600 leading-relaxed">{libro.noEsPara}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ─── FICHAS DE SITUACIÓN DE VIDA ────────────────────────────────────
  if (currentView === 'fichas-situacion') {
    const fichas = [
      {
        id: 'separacion',
        emoji: '💔',
        titulo: 'Me acabo de separar o divorciar',
        color: 'from-rose-500 to-pink-500',
        bg: 'from-rose-50 to-pink-50',
        border: 'border-rose-200',
        quePasa: 'Una ruptura activa el mismo circuito cerebral que el dolor físico. Lo que sientes no es debilidad: es una respuesta neurológica real al duelo. El dolor de una ruptura puede durar entre 6 meses y 2 años en función de la intensidad del vínculo.',
        esNormal: 'Sentir tristeza, rabia, alivio, vergüenza y nostalgia a la vez. Pensar en la persona constantemente. Idealizar la relación o demonizarla. No poder concentrarte. Cambios en el sueño y apetito.',
        quePuedes: ['Permite el duelo sin cronometrarlo. No hay plazo correcto.', 'Mantén rutinas básicas: dormir, comer, salir a caminar.', 'Escribe lo que sientes en el diario de gratitud o registro emocional.', 'Habla con personas de confianza, pero no rumiéis juntos la historia.', 'Pon distancia digital: reduce el contacto con redes donde aparezca la otra persona.'],
        noHagas: 'No tomes decisiones importantes (trabajo, casa, economía) en las primeras semanas. No uses el alcohol o el trabajo como anestesia. No retomes el contacto para "ver cómo está" cuando en realidad quieres que vuelva.',
        cuandoProfesional: 'Cuando el dolor no remite después de varios meses, cuando interfiere gravemente con el trabajo o los hijos, o cuando aparecen pensamientos de hacerte daño.',
        herramientas: ['emotional-log', 'gratitude', 'bienestar-test'],
      },
      {
        id: 'hijo-ansiedad',
        emoji: '👧',
        titulo: 'Creo que mi hijo/a tiene ansiedad',
        color: 'from-blue-500 to-indigo-500',
        bg: 'from-blue-50 to-indigo-50',
        border: 'border-blue-200',
        quePasa: 'La ansiedad infantil es la condición de salud mental más frecuente en niños y adolescentes (afecta al 9-15% según la OMS). Muchas veces se expresa en forma de quejas físicas (dolor de barriga, cabeza), irritabilidad o evitación, no siempre como "miedo visible".',
        esNormal: 'Que se resista a ir al colegio. Que tenga miedos específicos intensos. Que necesite mucha tranquilización. Que duerma mal o tenga pesadillas. Que se queje de molestias físicas sin causa médica.',
        quePuedes: ['Valida primero, no minimices ("ya pasará" bloquea la comunicación).', 'Practica respiración guiada con él/ella; hazlo juntos.', 'Mantén rutinas predecibles: la incertidumbre amplifica la ansiedad.', 'Habla con el tutor del colegio para tener contexto escolar.', 'No evites por él/ella las situaciones que le dan miedo; acompáñale gradualmente.'],
        noHagas: 'No digas "no hay nada que temer" ni "no seas exagerado". No sobreprotejas evitando todas las situaciones difíciles. No ignores los síntomas físicos sin consultar al pediatra primero.',
        cuandoProfesional: 'Cuando la ansiedad dura más de 4 semanas, interfiere con el colegio o las amistades, o cuando el niño/a evita un número creciente de situaciones.',
        herramientas: ['breathing', 'grounding', 'bad-day'],
      },
      {
        id: 'duelo',
        emoji: '🕊️',
        titulo: 'He perdido a alguien importante',
        color: 'from-slate-500 to-gray-600',
        bg: 'from-slate-50 to-gray-50',
        border: 'border-slate-200',
        quePasa: 'El duelo no es un proceso lineal. Las 5 fases de Kübler-Ross (negación, ira, negociación, depresión, aceptación) no siguen un orden fijo y pueden repetirse. El duelo agudo suele remitir entre 6 y 18 meses, aunque el dolor puede reactivarse en fechas significativas para siempre.',
        esNormal: 'Sentir que no puedes creerlo. Hablarle a la persona fallecida. Tener momentos buenos y sentirte culpable por ello. Que el dolor vaya y venga en oleadas. Que ciertos objetos, canciones o lugares lo reactiven intensamente.',
        quePuedes: ['No te aisles aunque tengas ganas. La presencia importa más que las palabras.', 'Escribe cartas a quien has perdido: es un recurso terapéutico contrastado.', 'Permite el llanto; no es debilidad, es regulación emocional.', 'Come, duerme e intenta mantener alguna rutina de movimiento.', 'Busca un grupo de duelo si la red de apoyo es pequeña.'],
        noHagas: 'No "superes" el duelo a un ritmo que no es el tuyo. No tomes decisiones importantes los primeros 6 meses. No uses la frase "ya está en un lugar mejor" si no lo sientes así.',
        cuandoProfesional: 'Cuando a los 12 meses el duelo sigue igual de intenso (duelo complicado), cuando aparecen pensamientos de morir para reunirte con la persona, o cuando la vida diaria se ha paralizado.',
        herramientas: ['gratitude', 'meditacion', 'emotional-log'],
      },
      {
        id: 'burnout',
        emoji: '🔥',
        titulo: 'Me siento quemado/a en el trabajo',
        color: 'from-orange-500 to-red-500',
        bg: 'from-orange-50 to-red-50',
        border: 'border-orange-200',
        quePasa: 'El burnout es un síndrome reconocido por la OMS (CIE-11) caracterizado por agotamiento, cinismo hacia el trabajo y menor eficacia profesional. Se desarrolla de forma gradual y suele ser el resultado de meses o años de estrés crónico sin recuperación suficiente.',
        esNormal: 'Levantarte ya cansado/a. Sentir que das más de lo que recibes. Desconectarte emocionalmente de clientes, pacientes o compañeros. No recordar por qué elegiste ese trabajo. Pequeños errores que antes no cometías.',
        quePuedes: ['Pon límites horarios reales y defiéndelos (silencia notificaciones fuera de horario).', 'Identifica qué te queda de energía y empieza por protegerlo.', 'Haz el test ISO 45003 para evaluar el riesgo psicosocial en tu trabajo.', 'Habla con tu médico de cabecera; la baja laboral existe y es un derecho.', 'Recupera una actividad fuera del trabajo que no tenga nada que ver con él.'],
        noHagas: 'No intentes "trabajar más para ponerte al día": eso profundiza el burnout. No ignores síntomas físicos como insomnio, cefaleas o palpitaciones. No esperes a tocar fondo para pedir ayuda.',
        cuandoProfesional: 'Cuando los síntomas llevan más de 3 meses, cuando no puedes desconectar ni en vacaciones, o cuando tu trabajo afecta tu salud física.',
        herramientas: ['iso-check', 'bienestar-test', 'breathing'],
      },
      {
        id: 'pareja-depresion',
        emoji: '🤝',
        titulo: 'Mi pareja o familiar tiene depresión',
        color: 'from-purple-500 to-violet-500',
        bg: 'from-purple-50 to-violet-50',
        border: 'border-purple-200',
        quePasa: 'La depresión no es tristeza voluntaria ni flojera. Es una enfermedad con base neurobiológica que afecta la motivación, la energía, el pensamiento y la percepción de uno mismo. Quien la padece no "puede" simplemente animarse.',
        esNormal: 'Que no responda a lo que antes le hacía feliz. Que se aísle o se muestre irritable. Que duerma demasiado o muy poco. Que piense que es una carga para los demás. Que tenga dificultad para tomar decisiones simples.',
        quePuedes: ['Escucha sin intentar resolver ni dar consejos no pedidos.', 'Ofrece presencia concreta: "¿Puedo llevarte al médico?" en lugar de "dime si necesitas algo".', 'No desaparezcas aunque te rechace; la depresión aísla y quien la padece necesita saber que sigues ahí.', 'Cuida tu propia salud mental: cuidar a alguien con depresión agota.', 'Anima suavemente a buscar ayuda profesional, sin forzar ni ultimátums.'],
        noHagas: 'No digas "anímate", "tienes mucho por lo que estar bien" o "estás mejor que otros". No le dejes solo/a si habla de hacerse daño. No asumas que ya mejorará solo.',
        cuandoProfesional: 'Si menciona ideas de suicidio, autolesiones o plan concreto: actúa de inmediato (acompaña a urgencias o llama al 024).',
        herramientas: ['emotional-log', 'bienestar-test', 'meditacion'],
      },
      {
        id: 'trabajo-perdido',
        emoji: '📉',
        titulo: 'He perdido el trabajo',
        color: 'from-teal-500 to-emerald-500',
        bg: 'from-teal-50 to-emerald-50',
        border: 'border-teal-200',
        quePasa: 'La pérdida de empleo es uno de los eventos vitales más estresantes. Afecta no solo la economía sino la identidad, la rutina, las relaciones sociales y la autoestima. El duelo laboral es real y sigue fases similares al duelo por pérdida.',
        esNormal: 'Sentir vergüenza aunque no hayas hecho nada malo. Perder la rutina y con ella la estructura del día. Que la incertidumbre económica amplifique la ansiedad. Que te cueste concentrarte en la búsqueda de empleo. Que la autoestima profesional caiga.',
        quePuedes: ['Mantén una rutina aunque sea artificial: levántate a la misma hora, vístete.', 'Separa horas de búsqueda activa de empleo de horas de descanso real.', 'Registra cómo te sientes; no reprimas el proceso emocional.', 'Cuida los gastos fijos pero no te aísles por ahorro de energía social.', 'Reformula la situación: tiempo para revisar qué quieres hacer, no solo qué puedes hacer.'],
        noHagas: 'No te encierres en casa. No compartes solo CVs en redes; trabaja también el contacto directo. No midas tu valor como persona por lo que produces.',
        cuandoProfesional: 'Cuando la situación genera ansiedad o depresión que interfiere con la búsqueda, o cuando lleva más de 6 meses y el estado emocional se deteriora progresivamente.',
        herramientas: ['bienestar-test', 'emotional-log', 'gratitude'],
      },
      {
        id: 'pensamientos-asustadores',
        emoji: '💭',
        titulo: 'Tengo pensamientos que me asustan',
        color: 'from-indigo-500 to-blue-600',
        bg: 'from-indigo-50 to-blue-50',
        border: 'border-indigo-200',
        quePasa: 'Los pensamientos intrusivos (imágenes o ideas que aparecen sin quererlas) son más comunes de lo que se cree: el 90% de la población los tiene. El problema no es tener el pensamiento, sino la guerra que hacemos contra él. Cuanto más intentas no pensar en algo, más aparece (efecto supresión)..',
        esNormal: 'Que el pensamiento aparezca sin haberlo llamado. Que te genere asco o miedo. Que intentes no tenerlo y eso lo amplifique. Que te preguntes "¿por qué pienso esto?" sintiéndote raro/a.',
        quePuedes: ['No luches contra el pensamiento: obsérvalalo como una nube que pasa.', 'Practica técnicas de defusión cognitiva (ACT): "Noto que tengo el pensamiento de..."', 'Usa grounding 5-4-3-2-1 cuando el pensamiento se vuelva muy intenso.', 'Habla con alguien de confianza; el secreto les da más poder.', 'Diferencia entre pensamiento y acción: tener el pensamiento no dice nada de quién eres.'],
        noHagas: 'No busques compulsivamente en internet si el pensamiento indica algo sobre ti: eso alimenta la ansiedad. No te quedes solo/a con pensamientos de hacerte daño.',
        cuandoProfesional: 'Si los pensamientos incluyen planes de hacerte daño o hacérselo a otros, busca ayuda de inmediato. Si la intensidad o frecuencia interfiere con tu vida diaria, un psicólogo puede ayudarte con técnicas específicas.',
        herramientas: ['grounding', 'breathing', 'bilateral'],
      },
      {
        id: 'soledad',
        emoji: '🫥',
        titulo: 'Me siento solo/a aunque estoy con gente',
        color: 'from-violet-500 to-purple-600',
        bg: 'from-violet-50 to-purple-50',
        border: 'border-violet-200',
        quePasa: 'La soledad es una experiencia subjetiva que no depende del número de personas alrededor. Es la diferencia entre las conexiones que tienes y las que deseas. La soledad crónica tiene efectos comprobados en la salud física (comparables al tabaquismo) y es un predictor de depresión.',
        esNormal: 'Sentirte incomprendido aunque estés rodeado de gente. Que las conversaciones te parezcan superficiales. Envidiar las relaciones que percibes en los demás. Que las redes sociales te hagan sentir más solo todavía.',
        quePuedes: ['Distingue entre soledad y estar solo: la segunda puede ser elegida y nutritiva.', 'Busca conexión con calidad, no cantidad: una conversación real vale más que diez superficiales.', 'Apúntate a actividades grupales con propósito (voluntariado, deporte, talleres).', 'Trabaja el autorregistro emocional para entender cuándo la soledad es más intensa.', 'Practica la vulnerabilidad: abrirte un poco más con alguien de confianza.'],
        noHagas: 'No uses las redes sociales como sustituto de conexión real: suelen empeorar la sensación. No esperes a que otros den el primer paso indefinidamente.',
        cuandoProfesional: 'Cuando la soledad va acompañada de depresión, cuando lleva meses sin mejorar, o cuando impacta tu salud física (sueño, alimentación, sistema inmune).',
        herramientas: ['emotion-wheel', 'emotional-log', 'meditacion'],
      },
      {
        id: 'adolescente',
        emoji: '🧑‍🎓',
        titulo: 'Mi adolescente está raro/a últimamente',
        color: 'from-green-500 to-teal-500',
        bg: 'from-green-50 to-teal-50',
        border: 'border-green-200',
        quePasa: 'El cerebro adolescente está literalmente en obras: la corteza prefrontal (control de impulsos, planificación) no madura hasta los 25 años. La amígdala (emociones) está hiperactiva. Es neurológicamente normal que busquen riesgo, rechacen a los padres y vivan en extremos emocionales.',
        esNormal: 'Que quieran pasar más tiempo con amigos que con la familia. Que cuestionen todo lo que dices. Que tengan cambios de humor bruscos. Que necesiten privacidad. Que pongan en duda su identidad, valores y orientación.',
        quePuedes: ['Mantén la puerta abierta sin forzar: "Cuando quieras hablar, aquí estoy."', 'No hagas preguntas cerradas; comparte tú algo tuyo primero.', 'Separa el comportamiento de la persona: critica lo que hace, no quién es.', 'Interésate por su mundo: su música, sus juegos, sus creadores favoritos.', 'Pacta límites claros y razonados, no impuestos sin explicación.'],
        noHagas: 'No minimices lo que le preocupa aunque te parezca pequeño. No compares con otros adolescentes o con cómo eras tú. No revises su móvil a escondidas si quieres que confíe en ti.',
        cuandoProfesional: 'Cuando hay autolesiones, pérdida significativa de peso, consumo de sustancias, aislamiento extremo o menciones a no querer seguir viviendo.',
        herramientas: ['breathing', 'emotional-log', 'bienestar-test'],
      },
    ];

    const herramientasMap: Record<string, string> = {
      'emotional-log': '📝 Registro emocional',
      'breathing': '🌬️ Respiración guiada',
      'grounding': '🧩 Grounding',
      'bilateral': '👆 Est. Bilateral',
      'gratitude': '🙏 Gratitud',
      'meditacion': '🎧 Meditación',
      'bienestar-test': '🧘 Test bienestar',
      'iso-check': '📋 ISO 45003',
      'bad-day': '🆘 Día malo',
      'emotion-wheel': '🎯 Rueda emociones',
    };

    if (fichaSeleccionada) {
      const ficha = fichas.find(f => f.id === fichaSeleccionada);
      if (!ficha) return null;
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
          <Header />
          <main className="pt-24 pb-12 px-4">
            <div className="max-w-2xl mx-auto">
              <Button variant="ghost" onClick={() => setFichaSeleccionada(null)} className="mb-6">← Todas las fichas</Button>

              <div className={`rounded-2xl bg-gradient-to-br ${ficha.bg} border-2 ${ficha.border} p-6 mb-6`}>
                <div className="text-4xl mb-2">{ficha.emoji}</div>
                <h2 className="text-2xl font-bold text-gray-900">{ficha.titulo}</h2>
              </div>

              <div className="space-y-4">
                <Card className="p-5 border border-blue-100">
                  <h3 className="font-bold text-blue-800 mb-2">🔍 ¿Qué está pasando?</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{ficha.quePasa}</p>
                </Card>

                <Card className="p-5 border border-emerald-100 bg-emerald-50/50">
                  <h3 className="font-bold text-emerald-800 mb-2">✅ Lo que sientes es normal</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{ficha.esNormal}</p>
                </Card>

                <Card className="p-5 border border-indigo-100">
                  <h3 className="font-bold text-indigo-800 mb-3">💡 Qué puedes hacer ahora</h3>
                  <ul className="space-y-2">
                    {ficha.quePuedes.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-indigo-500 font-bold mt-0.5">→</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                <Card className="p-5 border border-red-100 bg-red-50/50">
                  <h3 className="font-bold text-red-800 mb-2">🚫 Qué NO hacer</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{ficha.noHagas}</p>
                </Card>

                <Card className="p-5 border border-amber-100 bg-amber-50/50">
                  <h3 className="font-bold text-amber-800 mb-2">🏥 Cuándo buscar ayuda profesional</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{ficha.cuandoProfesional}</p>
                </Card>

                <Card className="p-5 border border-purple-100">
                  <h3 className="font-bold text-purple-800 mb-3">🛠️ Herramientas de NUXA para esta situación</h3>
                  <div className="flex flex-wrap gap-2">
                    {ficha.herramientas.map(h => (
                      <Button key={h} size="sm" variant="outline" onClick={() => setCurrentView(h as any)} className="text-xs">
                        {herramientasMap[h] || h}
                      </Button>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        <Header />
        <main className="pt-24 pb-12 px-4">
          <div className="max-w-3xl mx-auto">
            <Button variant="ghost" onClick={() => setCurrentView('main')} className="mb-6">← Volver</Button>
            <h2 className="text-3xl font-bold text-gray-900 mb-1">🗂️ Fichas de Situación de Vida</h2>
            <p className="text-gray-500 mb-8">No por diagnóstico, sino por lo que te está pasando. Guías breves, honestas y con base clínica.</p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {fichas.map(ficha => (
                <Card
                  key={ficha.id}
                  className={`p-5 cursor-pointer border-2 ${ficha.border} bg-gradient-to-br ${ficha.bg} hover:shadow-lg transition-all group`}
                  onClick={() => setFichaSeleccionada(ficha.id)}
                >
                  <div className="text-3xl mb-2">{ficha.emoji}</div>
                  <p className="font-bold text-gray-900 text-sm leading-snug mb-3">{ficha.titulo}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-500 group-hover:text-gray-700 transition-colors">
                    <span>Leer guía</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title="Recursos Gratis - NUXA | Herramientas de Bienestar"
        description="Accede gratis a herramientas de bienestar emocional: registro emocional, afirmaciones diarias, tests de ansiedad y depresión. Sin necesidad de registro."
        keywords="recursos salud mental gratis, test ansiedad gratis, test depresión, afirmaciones positivas, registro emocional"
        ogTitle="Recursos Gratis de Salud Mental - NUXA"
        canonicalUrl="https://nuxa.life/recursos"
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        <Header />
      
      <main className="pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Banner persistente ChatGPT vs NUXA */}
          <div className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl px-5 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
            <p className="text-white text-sm font-medium text-center sm:text-left">
              💡 <strong>Esto es gratis.</strong> Accede a todo — protocolos clínicos, urgencias, recursos locales — por <strong>2,99 €/mes</strong>. Lo que ChatGPT no te da.
            </p>
            <a href="/registro" className="flex-shrink-0 bg-white text-purple-700 font-semibold text-sm px-5 py-2 rounded-full hover:bg-gray-100 transition-colors shadow">
              Probar ahora →
            </a>
          </div>

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

          {/* Banner prueba gratis */}
          <Link href="/prueba-gratis">
            <div className="mb-8 group relative overflow-hidden rounded-2xl border-2 border-emerald-300 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer">
              <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              <div className="relative px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center shadow">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-black text-base sm:text-lg leading-snug mb-0.5">
                    ¿Quieres ir más allá de los ejercicios?
                  </p>
                  <p className="text-emerald-100 text-sm leading-relaxed">
                    Habla directamente con NUXA — 5 consultas gratis, sin tarjeta ni registro. La IA que te escucha de verdad.
                  </p>
                </div>
                <div className="flex-shrink-0 flex items-center gap-2 bg-white text-emerald-700 font-bold text-sm px-5 py-2.5 rounded-xl shadow group-hover:bg-emerald-50 transition-colors whitespace-nowrap">
                  Probar gratis
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          </Link>

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
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
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
              className="p-6 hover:shadow-xl transition-all cursor-pointer bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100"
              onClick={() => setCurrentView('emotion-wheel')}
              data-testid="card-emotion-wheel"
            >
              <Target className="w-10 h-10 text-indigo-500 mb-3" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Rueda de Emociones
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Identifica con precisión lo que sientes con la rueda de Plutchik
              </p>
              <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200">
                🎯 24 emociones
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

          {/* Mapa de Estrés Corporal - Destacado */}
          <Card
            className="mb-12 p-6 md:p-8 hover:shadow-2xl transition-all cursor-pointer bg-gradient-to-r from-red-50 via-orange-50 to-amber-50 border-2 border-red-200 hover:border-red-400 group"
            onClick={() => setCurrentView('body-stress')}
            data-testid="card-body-stress"
          >
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-5xl shadow-lg group-hover:scale-110 transition-transform">
                🧍
              </div>
              <div className="flex-1 text-center md:text-left">
                <Badge className="bg-red-500 text-white border-0 mb-2">Estrés Laboral</Badge>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Mapa de Estrés Corporal</h3>
                <p className="text-gray-600 mb-3">
                  Toca la zona de tu cuerpo donde sientes tensión y descubre ejercicios específicos para aliviarla desde tu puesto de trabajo. 10 zonas, 20 ejercicios guiados paso a paso.
                </p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <Badge className="bg-white text-gray-700 border-gray-200">🧠 Cabeza</Badge>
                  <Badge className="bg-white text-gray-700 border-gray-200">🦒 Cuello</Badge>
                  <Badge className="bg-white text-gray-700 border-gray-200">💪 Hombros</Badge>
                  <Badge className="bg-white text-gray-700 border-gray-200">🔙 Espalda</Badge>
                  <Badge className="bg-white text-gray-700 border-gray-200">+6 más</Badge>
                </div>
              </div>
              <ChevronRight className="w-8 h-8 text-gray-400 group-hover:text-red-500 transition-colors hidden md:block" />
            </div>
          </Card>

          {/* Guías y Biblioteca */}
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Guías y Biblioteca</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card
              className="p-8 hover:shadow-xl transition-all cursor-pointer bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 group"
              onClick={() => { setBibliotecaCategoria('todas'); setCurrentView('biblioteca'); }}
            >
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Biblioteca de Autoayuda</h3>
              <p className="text-gray-600 mb-4">18 libros seleccionados por una psicóloga. Solo con base clínica o científica contrastada. Con ficha de para quién es cada uno.</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {['Ansiedad', 'Depresión', 'Relaciones', 'Duelo', 'Crianza', 'Burnout', 'Trauma'].map(c => (
                  <Badge key={c} className="bg-amber-100 text-amber-700 border-amber-200 text-xs">{c}</Badge>
                ))}
              </div>
              <div className="flex items-center gap-2 text-amber-700 font-semibold text-sm group-hover:gap-3 transition-all">
                <span>Explorar biblioteca</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Card>

            <Card
              className="p-8 hover:shadow-xl transition-all cursor-pointer bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 group"
              onClick={() => { setFichaSeleccionada(null); setCurrentView('fichas-situacion'); }}
            >
              <div className="text-4xl mb-4">🗂️</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Fichas de Situación de Vida</h3>
              <p className="text-gray-600 mb-4">No por diagnóstico, sino por lo que te está pasando. 9 guías honestas con base clínica: qué es normal, qué hacer, qué no hacer y cuándo pedir ayuda.</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {['Separación', 'Hijo ansioso', 'Burnout', 'Duelo', 'Soledad', 'Adolescentes'].map(c => (
                  <Badge key={c} className="bg-blue-100 text-blue-700 border-blue-200 text-xs">{c}</Badge>
                ))}
              </div>
              <div className="flex items-center gap-2 text-blue-700 font-semibold text-sm group-hover:gap-3 transition-all">
                <span>Ver todas las fichas</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Card>
          </div>

          {/* Seguimiento y Programas */}
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Seguimiento y Programas</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card
              className="p-6 hover:shadow-xl transition-all cursor-pointer bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200 border-2"
              onClick={() => setCurrentView('emotion-dashboard')}
            >
              <div className="text-3xl mb-3">📊</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Dashboard Emocional</h3>
              <p className="text-gray-600 text-sm mb-3">Visualiza tu evolución emocional de las últimas 2 semanas con gráficos</p>
              <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200">📈 Tendencias</Badge>
            </Card>

            <Card
              className="p-6 hover:shadow-xl transition-all cursor-pointer bg-gradient-to-br from-blue-50 to-sky-50 border-blue-200 border-2"
              onClick={() => { setBienestarAnswers([3,3,3,3,3]); setBienestarSubmitted(false); setCurrentView('bienestar-test'); }}
            >
              <div className="text-3xl mb-3">🧘</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Test de Bienestar</h3>
              <p className="text-gray-600 text-sm mb-3">5 preguntas para medir tu estado emocional esta semana y ver tu evolución</p>
              <Badge className="bg-blue-100 text-blue-700 border-blue-200">📋 Semanal</Badge>
            </Card>

            <Card
              className="p-6 hover:shadow-xl transition-all cursor-pointer bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 border-2"
              onClick={() => { setSelectedPrograma(null); setCurrentView('programa-7dias'); }}
            >
              <div className="text-3xl mb-3">📅</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Programas de 7 Días</h3>
              <p className="text-gray-600 text-sm mb-3">Guías estructuradas para ansiedad, sueño o autoestima. Un ejercicio por día.</p>
              <Badge className="bg-purple-100 text-purple-700 border-purple-200">🗓️ 3 programas</Badge>
            </Card>

            <Card
              className="p-6 hover:shadow-xl transition-all cursor-pointer bg-gradient-to-br from-cyan-50 to-teal-50 border-cyan-200 border-2"
              onClick={() => { window.speechSynthesis?.cancel(); setMeditacionPlayingId(null); setCurrentView('meditacion'); }}
            >
              <div className="text-3xl mb-3">🎧</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Meditaciones Guiadas</h3>
              <p className="text-gray-600 text-sm mb-3">Escucha 4 meditaciones narradas en voz alta para calma, sueño y autoestima</p>
              <Badge className="bg-cyan-100 text-cyan-700 border-cyan-200">🔊 Audio</Badge>
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
                    <a href="/registro/planes">
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

      {/* Teaser final antes de salir */}
      <div className="bg-gradient-to-r from-gray-900 to-blue-900 py-10 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-white/60 text-sm uppercase tracking-widest mb-2">Esto es solo una muestra</p>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            NUXA hace lo que ChatGPT no puede
          </h2>
          <p className="text-white/80 mb-6 text-base max-w-xl mx-auto">
            Estructura clínica, protocolos de urgencia, recursos locales y acompañamiento real.
            Sin permanencia, desde <strong className="text-white">2,99 €/mes</strong>.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/registro" className="bg-white text-blue-700 font-bold px-8 py-3 rounded-full hover:bg-blue-50 transition-colors shadow-lg">
              Empezar ahora
            </a>
            <a href="/#comparativa" className="border border-white/40 text-white font-medium px-8 py-3 rounded-full hover:bg-white/10 transition-colors">
              Ver comparativa completa
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
    </>
  );
}
