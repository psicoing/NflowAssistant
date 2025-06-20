import { useState } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Bot, User, MessageCircle, Brain, Heart, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatExample {
  ageRange: string;
  question: string;
  response: string;
  tone: string;
}

const chatExamples: ChatExample[] = [
  {
    ageRange: "12-14 años",
    question: "Me siento muy nervioso en el instituto y no sé por qué",
    response: `### ✅ Te entiendo perfectamente
Es super normal sentirse nervioso en el instituto. Muchos chicos y chicas de tu edad pasan por lo mismo. Tu cuerpo y tu mente están cambiando un montón y eso puede hacer que te sientas así.

### 🎒 Consejos para el instituto
1. **Respira hondo:** Cuando te sientas nervioso, para un momento y respira profundo 3 veces
2. **Habla con alguien:** Cuéntale a tus padres, un profe de confianza o un amigo cómo te sientes
3. **Actividades que te gusten:** Apúntate a algo que te haga feliz: deporte, música, arte...

### 📗 Libros recomendados:
1. *Wonder* - R.J. Palacio. Una historia sobre aceptarse a uno mismo
2. *El diario de Greg* - Jeff Kinney. Historias divertidas sobre la vida escolar

Esta información no sustituye el diagnóstico ni el tratamiento de un profesional colegiado.`,
    tone: "Lenguaje simple, cercano y comprensivo. Usa ejemplos concretos."
  },
  {
    ageRange: "14-16 años",
    question: "No me gusta mi cuerpo y siempre me comparo con otros",
    response: `### ✅ Entiendo tu preocupación
La adolescencia es una etapa donde el cuerpo cambia mucho y es normal que a veces no te sientas cómodo con estos cambios. Compararse con otros es algo que hacemos todos, pero puede hacerte sentir mal.

### 🌟 Trabajando en tu autoestima
1. **Enfócate en lo que puedes hacer:** Tu cuerpo es increíble por todo lo que te permite hacer, no solo por cómo se ve
2. **Redes sociales con cuidado:** Recuerda que lo que ves online no siempre es real
3. **Actividad física:** Encuentra algún deporte o ejercicio que te haga sentir bien y fuerte

### 📗 Libros recomendados:
1. *Ni gorda ni flaca* - Patricia Ramírez. Sobre la relación sana con el cuerpo
2. *Autoestima para Dummies* - Rhena Branch. Técnicas prácticas para adolescentes

Esta información no sustituye el diagnóstico ni el tratamiento de un profesional colegiado.`,
    tone: "Empático pero más directo. Incluye técnicas prácticas."
  },
  {
    ageRange: "16-18 años",
    question: "Tengo mucha ansiedad por los exámenes de selectividad",
    response: `### ✅ La ansiedad ante selectividad es muy común
Es completamente normal sentir ansiedad ante un examen tan importante. La presión académica y social puede ser abrumadora, pero hay estrategias efectivas para manejarla.

### 📚 Técnicas de manejo de ansiedad académica
1. **Planificación realista:** Divide el temario en bloques manejables y crea un cronograma factible
2. **Técnicas de relajación:** Practica respiración diafragmática y mindfulness antes de estudiar
3. **Descanso activo:** Incluye pausas regulares y actividades que disfrutes
4. **Perspectiva balanceada:** Recuerda que hay múltiples caminos hacia tus objetivos

### 📗 Libros recomendados:
1. *Ansiedad y estrés* - Matthew McKay. Técnicas cognitivo-conductuales
2. *El estudiante exitoso* - Cal Newport. Estrategias de estudio eficiente

Esta información no sustituye el diagnóstico ni el tratamiento de un profesional colegiado.`,
    tone: "Más técnico pero accesible. Incluye estrategias específicas."
  },
  {
    ageRange: "18-21 años",
    question: "No sé qué carrera estudiar y me siento perdido con mi futuro",
    response: `### ✅ La incertidumbre vocacional es normal
Esta etapa de transición hacia la adultez genera muchas dudas. La presión social y familiar para "tener todo claro" puede intensificar esta ansiedad, pero es importante recordar que las decisiones vocacionales pueden evolucionar.

### 🎯 Proceso de autoconocimiento vocacional
1. **Autoevaluación:** Identifica tus valores, intereses y habilidades usando tests vocacionales validados
2. **Exploración activa:** Realiza entrevistas informativas con profesionales de áreas que te interesen
3. **Experiencias prácticas:** Busca voluntariados, prácticas o trabajos de verano relacionados
4. **Flexibilidad cognitiva:** Considera que las carreras actuales pueden no existir en el futuro

### 📗 Libros recomendados:
1. *¿Qué color es tu paracaídas?* - Richard N. Bolles. Guía clásica de orientación vocacional
2. *Ikigai* - Héctor García. Encuentra tu propósito de vida

Esta información no sustituye el diagnóstico ni el tratamiento de un profesional colegiado.`,
    tone: "Profesional y estructurado. Incluye terminología técnica apropiada."
  },
  {
    ageRange: "21-25 años",
    question: "Tengo problemas en mi relación de pareja y no sé si continuar",
    response: `### ✅ Las dificultades relacionales son complejas
Las relaciones de pareja en esta etapa vital enfrentan desafíos únicos: consolidación de identidad, expectativas de compromiso y desarrollo profesional. Evaluar la viabilidad de una relación requiere análisis objetivo y emocional.

### 💝 Evaluación de la relación
1. **Comunicación efectiva:** Analiza si existe diálogo abierto, escucha activa y resolución constructiva de conflictos
2. **Compatibilidad de valores:** Revisa si comparten objetivos de vida, valores fundamentales y visión de futuro
3. **Crecimiento individual:** Evalúa si la relación potencia o limita vuestro desarrollo personal
4. **Apoyo mutuo:** Considera si existe soporte emocional, respeto y admiración recíproca

### 📗 Libros recomendados:
1. *Los 7 principios para hacer que el matrimonio funcione* - John Gottman. Basado en investigación científica
2. *Amar o depender* - Walter Riso. Sobre relaciones saludables vs dependientes

Esta información no sustituye el diagnóstico ni el tratamiento de un profesional colegiado.`,
    tone: "Analítico y maduro. Terminología psicológica más avanzada."
  },
  {
    ageRange: "25-30 años",
    question: "Siento que no he logrado lo que esperaba a esta edad",
    response: `### ✅ El síndrome de logro tardío es frecuente
Esta percepción es común en la generación actual, influenciada por expectativas sociales aceleradas y comparación constante. La presión por alcanzar hitos específicos a determinadas edades puede generar frustración existencial significativa.

### 🎯 Reevaluación de expectativas vitales
1. **Deconstrucción de narrativas sociales:** Cuestiona los estándares impuestos externamente vs. tus valores auténticos
2. **Redefinición de éxito:** Desarrolla métricas personales de realización que incluyan bienestar, relaciones y crecimiento
3. **Perspectiva temporal:** Considera tu trayectoria como proceso continuo, no como serie de deadlines
4. **Mindfulness y aceptación:** Practica la aceptación del momento presente sin negación de aspiraciones futuras

### 📗 Libros recomendados:
1. *The Defining Decade* - Meg Jay. Sobre maximizar los veintitantos
2. *Mindset* - Carol Dweck. Mentalidad de crecimiento vs. fija

Esta información no sustituye el diagnóstico ni el tratamiento de un profesional colegiado.`,
    tone: "Sofisticado y reflexivo. Incluye conceptos psicológicos avanzados."
  },
  {
    ageRange: "35-40 años",
    question: "Estoy pasando por una crisis profesional y personal",
    response: `### ✅ La crisis de la mediana edad es un fenómeno reconocido
Esta etapa vital frecuentemente incluye cuestionamiento profundo de decisiones previas, reevaluación de prioridades y confrontación con la mortalidad. Es un período de transición psicológica natural, aunque desafiante.

### 🔄 Navegando la transición de mediana edad
1. **Análisis existencial:** Reflexiona sobre la congruencia entre tus valores actuales y tus decisiones de vida
2. **Reconexión con pasiones:** Identifica intereses y sueños postergados que podrían reactivarse
3. **Balance trabajo-vida:** Evalúa si tu inversión temporal refleja tus prioridades reales
4. **Legacy thinking:** Considera qué impacto deseas tener y cómo tus acciones actuales contribuyen a ello
5. **Apoyo profesional:** Un coach ejecutivo o terapeuta puede facilitar este proceso de transición

### 📗 Libros recomendados:
1. *The Happiness Curve* - Jonathan Rauch. Sobre la U-curve de la felicidad
2. *Transitions* - William Bridges. Navegando cambios de vida importantes

Esta información no sustituye el diagnóstico ni el tratamiento de un profesional colegiado.`,
    tone: "Analítico y profundo. Lenguaje profesional con conceptos de desarrollo adulto."
  },
  {
    ageRange: "50-55 años",
    question: "Me siento invisible y como si mis mejores años hubieran pasado",
    response: `### ✅ La invisibilidad percibida es una experiencia válida
Esta sensación refleja cambios socioculturales reales sobre el valor asignado a diferentes etapas vitales. Sin embargo, investigaciones en psicología positiva demuestran que esta década puede ser profundamente gratificante y productiva.

### 🌟 Redescubriendo propósito en la madurez
1. **Reframing cognitivo:** Desafía creencias limitantes sobre el envejecimiento mediante evidencia contradictoria
2. **Mentoring y transmisión:** Considera roles de mentoría que aprovechen tu experiencia acumulada
3. **Nuevos aprendizajes:** Explora habilidades o conocimientos que siempre te interesaron pero postergaste
4. **Contribución social:** Identifica causas que resuenen con tus valores y experiencia vital
5. **Cuidado personal integral:** Invierte en salud física, mental y relaciones significativas

### 📗 Libros recomendados:
1. *Being Mortal* - Atul Gawande. Sobre envejecer con dignidad y propósito
2. *The Gifts of Imperfection* - Brené Brown. Autoaceptación y vulnerabilidad

Esta información no sustituye el diagnóstico ni el tratamiento de un profesional colegiado.`,
    tone: "Respetuoso y empoderador. Reconoce la sabiduría de la experiencia."
  },
  {
    ageRange: "65-70 años",
    question: "Me preocupa mi memoria y si estoy desarrollando demencia",
    response: `### ✅ Las preocupaciones cognitivas son comprensibles
Los cambios cognitivos normales del envejecimiento pueden generar ansiedad legítima. Es importante distinguir entre declive cognitivo normal y patológico, manteniendo una perspectiva equilibrada.

### 🧠 Envejecimiento cognitivo saludable
1. **Evaluación profesional:** Considera una evaluación neuropsicológica para establecer una línea base objetiva
2. **Estimulación cognitiva:** Mantén actividades intelectualmente desafiantes: lectura, puzzles, aprendizaje de nuevas habilidades
3. **Ejercicio físico:** La actividad aeróbica regular mejora la neuroplasticidad y función cognitiva
4. **Conexiones sociales:** Las relaciones interpersonales activas protegen contra el declive cognitivo
5. **Gestión de factores de riesgo:** Controla hipertensión, diabetes y otros factores modificables

### 📗 Libros recomendados:
1. *Successful Aging* - Rowe & Kahn. Investigación sobre envejecimiento óptimo
2. *The Memory Bible* - Gary Small. Estrategias para mantener la agudeza mental

Esta información no sustituye el diagnóstico ni el tratamiento de un profesional colegiado.`,
    tone: "Científico pero tranquilizador. Información precisa sobre envejecimiento."
  },
  {
    ageRange: "30-35 años",
    question: "Siento presión por tener hijos pero no estoy seguro de querer ser padre/madre",
    response: `### ✅ La ambivalencia parental es más común de lo que parece
La decisión de tener hijos es una de las más significativas en la vida adulta. La presión social, familiar y del reloj biológico puede complicar un proceso que debería ser reflexivo y personal.

### 🍼 Reflexión sobre la parentalidad
1. **Autoexploración profunda:** Examina tus motivaciones reales vs. expectativas externas sobre la parentalidad
2. **Discusión en pareja:** Si tienes pareja, es fundamental alinear expectativas y deseos mutuos
3. **Perspectiva temporal:** Considera cómo te visualizas en diferentes escenarios futuros
4. **Recursos de apoyo:** Consulta con profesionales en orientación familiar si es necesario
5. **Respeto por tu decisión:** Recuerda que tanto tener como no tener hijos son opciones válidas

### 📗 Libros recomendados:
1. *The Baby Decision* - Merle Bombardieri. Guía para tomar la decisión de ser padres
2. *Maybe Baby* - Liz Crain. Explorando la ambivalencia sobre la parentalidad

Esta información no sustituye el diagnóstico ni el tratamiento de un profesional colegiado.`,
    tone: "Equilibrado y no prescriptivo. Respeta diferentes opciones de vida."
  },
  {
    ageRange: "40-45 años",
    question: "Estoy cuidando a mis padres mayores y me siento agotado emocionalmente",
    response: `### ✅ El agotamiento del cuidador es real y válido
La generación sandwich enfrenta múltiples responsabilidades simultáneas. El cuidado de padres mayores mientras se mantienen otras obligaciones familiares y profesionales puede llevar al burnout del cuidador.

### 👥 Manejo del rol de cuidador
1. **Red de apoyo:** Identifica familiares, amigos o servicios profesionales que puedan compartir responsabilidades
2. **Autocuidado prioritario:** Tu bienestar es fundamental para poder cuidar efectivamente a otros
3. **Límites saludables:** Establece límites claros sobre lo que puedes y no puedes hacer
4. **Recursos comunitarios:** Investiga centros de día, servicios de respiro y apoyo gubernamental disponible
5. **Apoyo emocional:** Considera grupos de apoyo para cuidadores o terapia individual

### 📗 Libros recomendados:
1. *The 36-Hour Day* - Nancy Mace. Guía completa para el cuidado de personas mayores
2. *Being Mortal* - Atul Gawande. Perspectivas sobre envejecimiento y cuidados

Esta información no sustituye el diagnóstico ni el tratamiento de un profesional colegiado.`,
    tone: "Compasivo y práctico. Reconoce la carga emocional del cuidado."
  },
  {
    ageRange: "45-50 años",
    question: "Mis hijos son adolescentes y siento que no me respetan",
    response: `### ✅ Los conflictos parent-adolescente son evolutivamente normales
La adolescencia implica individuación y cuestionamiento de autoridad. Aunque desafiante, estos conflictos son parte del desarrollo saludable hacia la autonomía adulta.

### 👨‍👩‍👧‍👦 Navegando la parentalidad de adolescentes
1. **Comunicación no confrontativa:** Practica escucha activa y evita reacciones defensivas inmediatas
2. **Límites flexibles:** Adapta reglas según la madurez demostrada, manteniendo límites no negociables
3. **Modelado de comportamiento:** Los adolescentes aprenden más de lo que observan que de lo que escuchan
4. **Validación emocional:** Reconoce sus emociones sin necesariamente aprobar comportamientos
5. **Perspectiva a largo plazo:** Mantén la conexión emocional por encima de batallas menores

### 📗 Libros recomendados:
1. *The Teenage Brain* - Frances Jensen. Neurociencia del desarrollo adolescente
2. *Untangled* - Lisa Damour. Entendiendo a las chicas adolescentes

Esta información no sustituye el diagnóstico ni el tratamiento de un profesional colegiado.`,
    tone: "Empático con la frustración parental pero educativo sobre desarrollo adolescente."
  },
  {
    ageRange: "55-60 años",
    question: "Me han diagnosticado una enfermedad crónica y no sé cómo afrontarlo",
    response: `### ✅ El diagnóstico de enfermedad crónica requiere ajuste psicológico
Recibir un diagnóstico médico significativo en esta etapa vital puede generar múltiples emociones: miedo, ira, tristeza y incertidumbre sobre el futuro. Estas reacciones son completamente normales.

### 🏥 Adaptación a enfermedad crónica
1. **Procesamiento emocional:** Permite experimentar el duelo por la pérdida de salud anterior
2. **Educación médica:** Comprende tu condición, tratamientos disponibles y pronóstico realista
3. **Equipo de apoyo:** Construye una red de profesionales sanitarios, familiares y amigos
4. **Adaptación de objetivos:** Redefine metas y expectativas de manera realista pero esperanzadora
5. **Grupos de apoyo:** Conecta con otros que enfrentan condiciones similares
6. **Calidad de vida:** Enfócate en maximizar bienestar dentro de las nuevas circunstancias

### 📗 Libros recomendados:
1. *Full Catastrophe Living* - Jon Kabat-Zinn. Mindfulness para la gestión del dolor crónico
2. *The Illness Narratives* - Arthur Kleinman. Experiencias de enfermedad crónica

Esta información no sustituye el diagnóstico ni el tratamiento de un profesional colegiado.`,
    tone: "Realista pero esperanzador. Valida las emociones difíciles del diagnóstico."
  },
  {
    ageRange: "60-65 años",
    question: "Me estoy acercando a la jubilación y siento ansiedad por el futuro",
    response: `### ✅ La ansiedad pre-jubilatoria es muy común
La transición hacia la jubilación representa uno de los cambios vitales más significativos. La pérdida de identidad profesional, rutina estructurada e ingresos puede generar incertidumbre considerable.

### 🎯 Preparación integral para la jubilación
1. **Planificación de identidad:** Desarrolla intereses y actividades que definan tu valor más allá del trabajo
2. **Estructura temporal:** Crea rutinas significativas que reemplacen la estructura laboral
3. **Conexiones sociales:** Mantén y desarrolla relaciones fuera del ámbito profesional
4. **Salud proactiva:** Invierte en bienestar físico y mental como base para años activos
5. **Propósito renovado:** Identifica formas de contribuir y mantenerte involucrado
6. **Transición gradual:** Si es posible, considera jubilación parcial o trabajo de transición

### 📗 Libros recomendados:
1. *Retirement Without Borders* - Barry Golson. Planificación integral de jubilación
2. *Finding Meaning in the Second Half of Life* - James Hollis. Propósito en la madurez

Esta información no sustituye el diagnóstico ni el tratamiento de un profesional colegiado.`,
    tone: "Práctico y tranquilizador. Enfoque en preparación proactiva."
  },
  {
    ageRange: "70-75 años",
    question: "He perdido a mi pareja después de 45 años de matrimonio",
    response: `### ✅ El duelo por pérdida de pareja de larga duración es profundo
Después de décadas compartiendo vida, la pérdida de su pareja representa no solo duelo por la persona, sino por la identidad compartida, rutinas y futuro imaginado juntos. Este proceso requiere tiempo y comprensión.

### 💜 Navegando el duelo en la tercera edad
1. **Proceso individual:** Su duelo será único; no hay timeline "correcto" para la recuperación
2. **Mantenimiento de rutinas:** Preserve estructura diaria mientras permite flexibilidad emocional
3. **Conexiones significativas:** Mantenga contacto con familiares y amigos que comprendan su pérdida
4. **Memoria honrante:** Encuentre formas de honrar y recordar la relación compartida
5. **Cuidado personal:** Atienda necesidades básicas de alimentación, descanso y atención médica
6. **Apoyo profesional:** Considere consejería de duelo especializada en pérdidas de pareja

### 📗 Libros recomendados:
1. *A Grief Observed* - C.S. Lewis. Reflexiones profundas sobre pérdida de pareja
2. *Being a Widow* - Lynn Caine. Guía práctica para viudez

Esta información no sustituye el diagnóstico ni el tratamiento de un profesional colegiado.`,
    tone: "Extremadamente compasivo y respetuoso. Reconoce la magnitud de la pérdida."
  },
  {
    ageRange: "75-80 años",
    question: "Me siento solo y como una carga para mi familia",
    response: `### ✅ La soledad en la tercera edad es un desafío real
El aislamiento social en esta etapa vital tiene impactos significativos en salud física y mental. Sus sentimientos son válidos y abordarlos es importante para su bienestar general.

### 🤝 Estrategias para el bienestar en la tercera edad
1. **Comunicación familiar:** Exprese sus necesidades emocionales de manera clara y específica a sus seres queridos
2. **Participación comunitaria:** Explore centros de día, grupos religiosos o actividades de voluntariado
3. **Tecnología como herramienta:** Considere videollamadas regulares y redes sociales para mantener conexiones
4. **Contribución significativa:** Identifique formas de aportar valor basándose en su experiencia y sabiduría
5. **Cuidado de la salud mental:** No subestime la importancia del apoyo psicológico profesional

### 📗 Libros recomendados:
1. *Aging Well* - George Vaillant. Estudio longitudinal sobre envejecimiento exitoso
2. *The Longevity Project* - Howard Friedman. Factores que contribuyen a una vida larga y satisfactoria

Esta información no sustituye el diagnóstico ni el tratamiento de un profesional colegiado.`,
    tone: "Respetuoso y comprensivo. Reconoce la dignidad y valor de la experiencia vital."
  }
];

export default function EjemplosChat() {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (ageRange: string) => {
    setOpenItems(prev => 
      prev.includes(ageRange) 
        ? prev.filter(item => item !== ageRange)
        : [...prev, ageRange]
    );
  };

  return (
    <div className="min-h-screen bg-nflow-dark">
      <Header />
      
      <main className="pt-20 pb-16">
        {/* Hero Section */}
        <section className="py-16 px-4 bg-gradient-to-b from-nflow-dark to-nflow-navy">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-br from-nflow-orange to-orange-600 rounded-2xl shadow-lg">
                <MessageCircle className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              ¿Cómo responde el chat?
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Descubre cómo nuestro asistente de psicología NEUROPSI-AI adapta sus respuestas según tu edad, 
              ofreciendo apoyo personalizado y apropiado para cada etapa de la vida.
            </p>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card className="bg-gray-800/50 border-gray-700/50">
                <CardContent className="p-6 text-center">
                  <Brain className="w-8 h-8 text-nflow-orange mx-auto mb-4" />
                  <h3 className="text-white font-semibold mb-2">Lenguaje Adaptado</h3>
                  <p className="text-gray-400 text-sm">
                    Respuestas ajustadas al nivel de comprensión y madurez de cada edad
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700/50">
                <CardContent className="p-6 text-center">
                  <Heart className="w-8 h-8 text-red-400 mx-auto mb-4" />
                  <h3 className="text-white font-semibold mb-2">Contenido Relevante</h3>
                  <p className="text-gray-400 text-sm">
                    Consejos y estrategias específicas para los desafíos de cada etapa vital
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700/50">
                <CardContent className="p-6 text-center">
                  <Users className="w-8 h-8 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-white font-semibold mb-2">Tono Apropiado</h3>
                  <p className="text-gray-400 text-sm">
                    Desde lenguaje cercano para adolescentes hasta análisis profundo para adultos
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Examples Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Ejemplos reales por edades
            </h2>

            <div className="space-y-4">
              {chatExamples.map((example, index) => (
                <Card key={index} className="bg-gray-800/60 border-gray-700/50 overflow-hidden">
                  <Collapsible 
                    open={openItems.includes(example.ageRange)}
                    onOpenChange={() => toggleItem(example.ageRange)}
                  >
                    <CollapsibleTrigger className="w-full">
                      <div className="p-6 flex items-center justify-between hover:bg-gray-700/30 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-nflow-orange to-orange-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {example.ageRange.split('-')[0]}
                            </span>
                          </div>
                          <div className="text-left">
                            <h3 className="text-white font-semibold text-lg">
                              {example.ageRange}
                            </h3>
                            <p className="text-gray-400 text-sm">
                              {example.tone}
                            </p>
                          </div>
                        </div>
                        {openItems.includes(example.ageRange) ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <div className="px-6 pb-6 space-y-6">
                        {/* User Question */}
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-white" />
                          </div>
                          <div className="bg-blue-600/20 border border-blue-500/30 p-4 rounded-lg rounded-tl-md flex-1">
                            <p className="text-gray-200 text-sm leading-relaxed">
                              {example.question}
                            </p>
                          </div>
                        </div>

                        {/* AI Response */}
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-nflow-orange to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Bot className="w-4 h-4 text-white" />
                          </div>
                          <div className="bg-gray-700/50 border border-gray-600/30 p-4 rounded-lg rounded-tl-md flex-1">
                            <div className="text-gray-200 text-sm leading-relaxed whitespace-pre-line">
                              {example.response}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              ))}
            </div>

            {/* CTA Section */}
            <div className="mt-16 text-center">
              <Card className="bg-gradient-to-r from-nflow-orange/10 to-orange-600/10 border-nflow-orange/30 max-w-2xl mx-auto">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-4">
                    ¿Te gusta lo que ves?
                  </h3>
                  <p className="text-gray-300 mb-6">
                    Accede a respuestas personalizadas ilimitadas suscribiéndote a NFLOW. 
                    Tu psicólogo digital disponible 24/7.
                  </p>
                  <Button 
                    className="bg-nflow-orange hover:bg-nflow-orange-light text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                    onClick={() => window.location.href = '/registro'}
                  >
                    Comenzar ahora
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}