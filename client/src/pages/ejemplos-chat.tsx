import { useState, useEffect } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Bot, User, MessageCircle, MessageSquare, Brain, Heart, Users, Sparkles, Shield, Clock, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

// Función para convertir Markdown a HTML formateado
function formatMarkdownToHtml(content: string): string {
  return content
    // Encabezados
    .replace(/^# (.+)$/gm, '<h1 class="text-lg font-bold text-white mt-4 mb-2 first:mt-0">$1</h1>')
    .replace(/^## (.+)$/gm, '<h2 class="text-base font-semibold text-white mt-3 mb-2">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="text-sm font-medium text-white mt-2 mb-1">$1</h3>')
    // Texto en negrita
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
    // Texto en cursiva
    .replace(/\*(.+?)\*/g, '<em class="italic text-gray-200">$1</em>')
    // Citas (blockquotes)
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-nflow-orange pl-4 text-gray-200 italic my-2">$1</blockquote>')
    // Listas con viñetas
    .replace(/^- (.+)$/gm, '<li class="text-gray-100 ml-4">• $1</li>')
    // Listas numeradas
    .replace(/^(\d+)\. (.+)$/gm, '<li class="text-gray-100 ml-4">$1. $2</li>')
    // Párrafos (líneas que no son encabezados ni listas)
    .replace(/^(?!<[h|l|b])(.+)$/gm, '<p class="text-gray-100 mb-2">$1</p>')
    // Saltos de línea dobles se convierten en espacios entre párrafos
    .replace(/\n\s*\n/g, '\n')
    // Saltos de línea simples se convierten en <br>
    .replace(/\n/g, '<br/>');
}

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
    response: `# Presentación Empática
Entiendo perfectamente cómo te sientes. Es super normal sentirse nervioso en el instituto - muchos chicos y chicas de tu edad pasan por lo mismo. Tu cuerpo y tu mente están cambiando un montón y eso puede generar estos nervios. ¿Hay alguna situación específica en el instituto que te pone más nervioso?

# Refuerzo Positivo
Pedir ayuda demuestra valentía y madurez. No estás solo en esto, y reconocer que te sientes nervioso ya es un gran paso.

# Preguntas Sintomatológicas
- ¿Has notado cambios en tu ánimo o energía para ir al instituto?
- ¿Te cuesta dormir pensando en el día siguiente?
- ¿Sientes síntomas físicos como dolor de barriga antes de ir?
- **¿Qué tanto te afecta en tu día a día?** (0 = nada – 10 = muchísimo)

# Orientación Diagnóstica
Lo que describes puede parecerse a ansiedad social o ansiedad académica, común en la adolescencia. Solo un profesional puede evaluar si cumples criterios diagnósticos.

# Explicación del Grupo Diagnóstico
La ansiedad en el instituto puede manifestarse como nervios, preocupación excesiva por el rendimiento o miedo al juicio de otros compañeros.

# Técnicas Prácticas
**¿Qué prefieres probar primero?**

**Opción 1: Respiración guiada**
- Técnica 4-7-8: inspira 4, mantén 7, exhala 8

**Opción 2: Plan 72h**
- Rutinas de sueño saludables
- Preparar la mochila la noche anterior

**Opción 3: Conexión social**
- Habla con tus padres o un profesor de confianza

# Algoritmo de Urgencia
No hay señales de alarma inmediatas, pero si los nervios te impiden ir al instituto o afectan mucho tu día a día, es importante hablar con un adulto.

# Psicoeducación
**¿Quieres que te explique qué es la ansiedad y por qué la sientes?**

# Recursos Locales
🏥 **Orientador/a** del instituto
🏥 **Centro de salud mental** más cercano

*Esta información no sustituye la atención profesional.*

# Seguimiento Automático
¿Quieres que volvamos a hablar en 72 horas para ver cómo te sientes?

# Advertencia Profesional
> *Esta información es solo orientativa y no sustituye el diagnóstico ni el tratamiento de un profesional colegiado. Si tienes dudas o malestar intenso, busca siempre ayuda profesional.*

### 📗 Libros recomendados:
1. *Wonder* - R.J. Palacio. Una historia sobre aceptarse a uno mismo y enfrentar las diferencias con valentía.
2. *El diario de Greg* - Jeff Kinney. Historias divertidas sobre la vida escolar que ayudan a normalizar los problemas adolescentes.
3. *Invisible* - Eloy Moreno. Novela que aborda el acoso escolar y la importancia de la empatía.`,
    tone: "Lenguaje simple, cercano y comprensivo. Usa ejemplos concretos."
  },
  {
    ageRange: "14-16 años",
    question: "No me gusta mi cuerpo y siempre me comparo con otros",
    response: `# Presentación Empática
Entiendo perfectamente tu preocupación. La adolescencia es una etapa donde el cuerpo cambia muchísimo y es completamente normal que a veces no te sientas cómodo con estos cambios. Compararse con otros es algo muy humano, pero sé que puede hacerte sentir mal. ¿Hay momentos específicos donde te sientes peor con tu imagen?

# Refuerzo Positivo
Hablar sobre esto ya demuestra mucha madurez y autoconocimiento. No estás solo/a en estos sentimientos.

# Preguntas Sintomatológicas
- ¿Has notado cambios en tu estado de ánimo relacionados con cómo te ves?
- ¿Evitas situaciones sociales por cómo te sientes con tu cuerpo?
- ¿Te comparas frecuentemente en redes sociales?
- **¿Qué tanto te afecta en tu día a día?** (0 = nada – 10 = muchísimo)

# Orientación Diagnóstica
Lo que describes puede relacionarse con insatisfacción corporal típica de la adolescencia, pero si interfiere mucho en tu vida, podría necesitar atención profesional.

# Explicación del Grupo Diagnóstico
La imagen corporal en adolescentes está influenciada por cambios hormonales, presión social y desarrollo de identidad. Es una fase normal pero que requiere apoyo.

# Técnicas Prácticas
**¿Qué prefieres probar primero?**

**Opción 1: Autocompasión**
- Habla contigo mismo como harías con tu mejor amigo

**Opción 2: Actividad física placentera**
- Encuentra ejercicio que te haga sentir bien, no por cambiar tu cuerpo

**Opción 3: Límites con redes sociales**
- Reduce tiempo en Instagram o apps que te hagan compararte

# Algoritmo de Urgencia
No hay señales de alarma inmediatas, pero si estos sentimientos te impiden hacer actividades que disfrutas, es importante buscar apoyo.

# Psicoeducación
**¿Quieres que te explique por qué es normal sentirse así en la adolescencia?**

# Recursos Locales
🏥 **Orientador/a** del instituto
🏥 **Centro de salud mental** más cercano

*Esta información no sustituye la atención profesional.*

# Seguimiento Automático
¿Quieres que volvamos a hablar en 72 horas para ver cómo te sientes?

# Advertencia Profesional
> *Esta información es solo orientativa y no sustituye el diagnóstico ni el tratamiento de un profesional colegiado. Si tienes dudas o malestar intenso, busca siempre ayuda profesional.*

### 📗 Libros recomendados:
1. *Ni gorda ni flaca* - Patricia Ramírez. Sobre la relación sana con el cuerpo y autoaceptación.
2. *Autoestima para Dummies* - Rhena Branch. Técnicas prácticas para adolescentes.
3. *El poder de la autoestima* - Nathaniel Branden. Fundamentos para construir confianza personal.`,
    tone: "Empático pero más directo. Incluye técnicas prácticas."
  },
  {
    ageRange: "16-18 años",
    question: "Tengo mucha ansiedad por los exámenes de selectividad",
    response: `# Presentación Empática
Entiendo perfectamente tu ansiedad ante selectividad. Es completamente normal sentirse así ante un examen tan importante - la presión académica y social puede ser muy abrumadora. ¿Hay algún aspecto específico de selectividad que te genera más ansiedad?

# Refuerzo Positivo
Buscar apoyo demuestra inteligencia emocional. Reconocer que algo no va bien es el primer paso para mejorar.

# Preguntas Sintomatológicas
- ¿Has notado cambios en tu sueño o apetito por la presión del estudio?
- ¿Te cuesta concentrarte o te sientes irritable?
- ¿Tienes pensamientos muy negativos sobre tu futuro si no consigues la nota?
- **¿Qué tanto te afecta en tu día a día?** (0 = nada – 10 = muchísimo)

# Orientación Diagnóstica
Lo que describes puede parecerse a ansiedad de rendimiento académico, común en estudiantes de bachillerato. Solo un profesional puede valorar si cumples criterios diagnósticos.

# Explicación del Grupo Diagnóstico
La ansiedad ante exámenes importantes puede manifestarse como preocupación excesiva, síntomas físicos y pensamientos catastrofistas sobre el futuro.

# Técnicas Prácticas
**¿Qué prefieres probar primero?**

**Opción 1: Planificación realista**
- Divide el temario en bloques manejables con cronograma factible

**Opción 2: Técnicas de relajación**
- Respiración diafragmática y mindfulness antes de estudiar

**Opción 3: Perspectiva balanceada**
- Recuerda que hay múltiples caminos hacia tus objetivos

# Algoritmo de Urgencia
No hay señales de alarma inmediatas, pero si la ansiedad te impide estudiar o dormir, busca apoyo profesional.

# Psicoeducación
**¿Quieres que te explique por qué es normal sentir ansiedad ante exámenes importantes?**

# Recursos Locales
🏥 **Orientador/a** del instituto
🏥 **Centro de salud mental** más cercano

*Esta información no sustituye la atención profesional.*

# Seguimiento Automático
¿Quieres que volvamos a hablar en 72 horas para ver cómo te sientes?

# Advertencia Profesional
> *Esta información es solo orientativa y no sustituye el diagnóstico ni el tratamiento de un profesional colegiado. Si tienes dudas o malestar intenso, busca siempre ayuda profesional.*

### 📗 Libros recomendados:
1. *Ansiedad y estrés* - Matthew McKay. Técnicas cognitivo-conductuales para el manejo de ansiedad académica.
2. *El estudiante exitoso* - Cal Newport. Estrategias de estudio eficiente y manejo del tiempo.
3. *Mindfulness para principiantes* - Jon Kabat-Zinn. Técnicas de atención plena para reducir estrés.`,
    tone: "Más técnico pero accesible. Incluye estrategias específicas."
  },
  {
    ageRange: "18-21 años",
    question: "No sé qué carrera estudiar y me siento perdido con mi futuro",
    response: `# Presentación Empática
Entiendo completamente tu sensación de estar perdido. Esta etapa de transición hacia la adultez genera muchas dudas y la presión social para "tener todo claro" puede intensificar esta ansiedad. ¿Hay alguna presión específica (familiar, social, económica) que más te agobia?

# Refuerzo Positivo
Reconocer esta incertidumbre demuestra autoconocimiento y responsabilidad hacia tu futuro. No tener todo claro a esta edad es completamente normal.

# Preguntas Sintomatológicas
- ¿Has experimentado cambios en tu estado de ánimo por esta incertidumbre?
- ¿Evitas conversaciones sobre el futuro o te generan ansiedad?
- ¿Sientes presión de tiempo o comparación con peers?
- **¿Qué tanto te afecta en tu día a día?** (0 = nada – 10 = muchísimo)

# Orientación Diagnóstica
Lo que describes se relaciona con ansiedad vocacional y posible estrés adaptativo típico del emerging adulthood. Solo un profesional puede evaluar si requiere intervención especializada.

# Explicación del Grupo Diagnóstico
La incertidumbre vocacional en esta etapa es evolutivamente normal. El cerebro aún está madurando la capacidad de planificación a largo plazo.

# Técnicas Prácticas
**¿Qué prefieres probar primero?**

**Opción 1: Autoevaluación**
- Tests vocacionales validados para identificar valores, intereses y habilidades

**Opción 2: Exploración activa**
- Entrevistas informativas con profesionales de áreas que te interesen

**Opción 3: Experiencias prácticas**
- Voluntariados, prácticas o trabajos de verano relacionados

# Algoritmo de Urgencia
No hay señales de alarma inmediatas, pero si la ansiedad te paraliza o afecta tu funcionamiento, busca orientación profesional.

# Psicoeducación
**¿Quieres que te explique por qué es normal no tener todo claro a tu edad?**

# Recursos Locales
🏥 **Orientador/a** universitario o vocacional
🏥 **Servicios de orientación laboral** municipales

*Esta información no sustituye la atención profesional.*

# Seguimiento Automático
¿Quieres que volvamos a hablar en 72 horas para seguir explorando tus opciones?

# Advertencia Profesional
> *Esta información es solo orientativa y no sustituye el diagnóstico ni el tratamiento de un profesional colegiado. Si tienes dudas o malestar intenso, busca siempre ayuda profesional.*

### 📗 Libros recomendados:
1. *¿Qué color es tu paracaídas?* - Richard N. Bolles. Guía clásica de orientación vocacional y autoconocimiento.
2. *Ikigai* - Héctor García. Encuentra tu propósito de vida y razón de ser.
3. *Designing Your Life* - Bill Burnett. Metodología de design thinking aplicada a decisiones vitales.`,
    tone: "Profesional y estructurado. Incluye terminología técnica apropiada."
  },
  {
    ageRange: "21-25 años",
    question: "Tengo problemas en mi relación de pareja y no sé si continuar",
    response: `# Presentación Empática
Entiendo la complejidad de tu situación. Las relaciones de pareja en esta etapa enfrentan desafíos únicos: consolidación de identidad, expectativas de compromiso y desarrollo profesional. ¿Podrías contarme qué aspectos específicos te hacen dudar sobre continuar?

# Refuerzo Positivo
Cuestionar la relación demuestra madurez emocional y responsabilidad hacia tu bienestar a largo plazo.

# Preguntas Sintomatológicas
- ¿Has notado cambios en tu estado de ánimo o nivel de estrés relacionados con la relación?
- ¿Sientes que puedes ser auténtico/a con tu pareja?
- ¿Hay conflictos recurrentes que no se resuelven?
- **¿Qué tanto te afecta en tu día a día?** (0 = nada – 10 = muchísimo)

# Orientación Diagnóstica
Lo que describes puede relacionarse con ansiedad relacional o estrés adaptativo. La evaluación de relaciones requiere análisis cuidadoso.

# Explicación del Grupo Diagnóstico
Los conflictos relacionales pueden generar ansiedad, depresión situacional y estrés que afecta otras áreas de la vida.

# Técnicas Prácticas
**¿Qué prefieres explorar primero?**

**Opción 1: Evaluación objetiva**
- Análisis de comunicación, compatibilidad y crecimiento mutuo

**Opción 2: Conversación directa**
- Diálogo honesto con tu pareja sobre tus preocupaciones

**Opción 3: Espacio personal**
- Tiempo individual para clarificar tus necesidades y expectativas

# Algoritmo de Urgencia
No hay señales de alarma inmediatas, pero si hay violencia o control excesivo, busca apoyo especializado.

# Psicoeducación
**¿Quieres que te explique qué características tienen las relaciones saludables?**

# Recursos Locales
🏥 **Terapia de pareja** especializada
🏥 **Centro de salud mental** más cercano

*Esta información no sustituye la atención profesional.*

# Seguimiento Automático
¿Quieres que volvamos a hablar en 72 horas para seguir explorando esta situación?

# Advertencia Profesional
> *Esta información es solo orientativa y no sustituye el diagnóstico ni el tratamiento de un profesional colegiado. Si tienes dudas o malestar intenso, busca siempre ayuda profesional.*

### 📗 Libros recomendados:
1. *Los 7 principios para hacer que el matrimonio funcione* - John Gottman. Basado en investigación científica sobre relaciones exitosas.
2. *Amar o depender* - Walter Riso. Sobre relaciones saludables vs dependientes emocionales.
3. *Hold Me Tight* - Sue Johnson. Técnicas de terapia emotiva para parejas.`,
    tone: "Analítico y maduro. Terminología psicológica más avanzada."
  },
  {
    ageRange: "25-30 años",
    question: "Siento que no he logrado lo que esperaba a esta edad",
    response: `# Presentación Empática
Entiendo profundamente esta sensación de no haber logrado lo esperado. Es una percepción muy común en tu generación, influenciada por expectativas sociales aceleradas y comparación constante en redes sociales. ¿Hay logros específicos que sientes que "deberías" haber alcanzado?

# Refuerzo Positivo
Reflexionar sobre tus expectativas demuestra madurez y capacidad de autoevaluación. Estar en proceso no significa estar atrasado.

# Preguntas Sintomatológicas
- ¿Has experimentado cambios en tu autoestima o motivación?
- ¿Te comparas frecuentemente con peers en redes sociales?
- ¿Sientes presión familiar o social sobre tus logros?
- **¿Qué tanto te afecta en tu día a día?** (0 = nada – 10 = muchísimo)

# Orientación Diagnóstica
Lo que describes puede relacionarse con ansiedad de logro, depresión situacional o síndrome del impostor. La evaluación profesional puede clarificar si requiere intervención.

# Explicación del Grupo Diagnóstico
La presión por alcanzar hitos específicos a determinadas edades puede generar frustración existencial y afectar el bienestar emocional.

# Técnicas Prácticas
**¿Qué prefieres explorar primero?**

**Opción 1: Redefinición de éxito**
- Desarrolla métricas personales que incluyan bienestar y crecimiento

**Opción 2: Perspectiva temporal**
- Considera tu trayectoria como proceso continuo, no como serie de deadlines

**Opción 3: Mindfulness**
- Práctica de aceptación del momento presente sin negar aspiraciones

# Algoritmo de Urgencia
No hay señales de alarma inmediatas, pero si estos sentimientos afectan significativamente tu funcionamiento, considera apoyo profesional.

# Psicoeducación
**¿Quieres que te explique por qué esta generación siente más presión de logro?**

# Recursos Locales
🏥 **Psicólogo especializado** en adultos jóvenes
🏥 **Coach de vida** profesional

*Esta información no sustituye la atención profesional.*

# Seguimiento Automático
¿Quieres que volvamos a hablar en 72 horas para revisar tu progreso?

# Advertencia Profesional
> *Esta información es solo orientativa y no sustituye el diagnóstico ni el tratamiento de un profesional colegiado. Si tienes dudas o malestar intenso, busca siempre ayuda profesional.*

### 📗 Libros recomendados:
1. *The Defining Decade* - Meg Jay. Sobre maximizar los veintitantos y tomar decisiones importantes.
2. *Mindset* - Carol Dweck. Mentalidad de crecimiento vs. fija para el desarrollo personal.
3. *The Gifts of Imperfection* - Brené Brown. Autoaceptación y vulnerabilidad en el desarrollo adulto.`,
    tone: "Sofisticado y reflexivo. Incluye conceptos psicológicos avanzados."
  },
  {
    ageRange: "35-40 años",
    question: "Estoy pasando por una crisis profesional y personal",
    response: `# Presentación Empática
Entiendo profundamente lo que estás atravesando. La crisis de mediana edad es un fenómeno reconocido que incluye cuestionamiento profundo de decisiones previas y confrontación con la mortalidad. ¿Podrías contarme qué áreas de tu vida sientes que necesitan más cambios?

# Refuerzo Positivo
Cuestionar tu trayectoria demuestra valentía y compromiso con tu crecimiento personal. Muchas personas evitan esta reflexión necesaria.

# Preguntas Sintomatológicas
- ¿Has experimentado cambios significativos en tu estado de ánimo o motivación?
- ¿Sientes desconformidad con decisiones pasadas importantes?
- ¿Has perdido interés en actividades que antes disfrutabas?
- **¿Qué tanto te afecta en tu día a día?** (0 = nada – 10 = muchísimo)

# Orientación Diagnóstica
Lo que describes puede relacionarse con depresión situacional, ansiedad existencial o crisis de identidad de mediana edad. La evaluación profesional puede ser útil.

# Explicación del Grupo Diagnóstico
Las crisis de mediana edad implican reevaluación de logros, relaciones y propósito vital, pudiendo generar ansiedad y depresión situacional.

# Técnicas Prácticas
**¿Qué prefieres explorar primero?**

**Opción 1: Análisis existencial**
- Reflexión sobre congruencia entre valores actuales y decisiones de vida

**Opción 2: Reconexión con pasiones**
- Identifica intereses postergados que podrían reactivarse

**Opción 3: Balance trabajo-vida**
- Evalúa si tu inversión temporal refleja tus prioridades reales

# Algoritmo de Urgencia
No hay señales de alarma inmediatas, pero si sientes desesperanza profunda o pensamientos de daño, busca ayuda inmediata.

# Psicoeducación
**¿Quieres que te explique por qué las crisis de mediana edad son normales y necesarias?**

# Recursos Locales
🏥 **Psicólogo especializado** en adultos
🏥 **Coach ejecutivo** profesional

*Esta información no sustituye la atención profesional.*

# Seguimiento Automático
¿Quieres que volvamos a hablar en 72 horas para continuar explorando estos cambios?

# Advertencia Profesional
> *Esta información es solo orientativa y no sustituye el diagnóstico ni el tratamiento de un profesional colegiado. Si tienes dudas o malestar intenso, busca siempre ayuda profesional.*

### 📗 Libros recomendados:
1. *The Happiness Curve* - Jonathan Rauch. Sobre la U-curve de la felicidad y cómo navegar la mediana edad.
2. *Transitions* - William Bridges. Navegando cambios de vida importantes y transformaciones personales.
3. *Finding Meaning in the Second Half of Life* - James Hollis. Propósito y desarrollo en la madurez.`,
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
    response: `# Presentación Empática
Entiendo profundamente sus preocupaciones sobre su memoria. Los cambios cognitivos del envejecimiento pueden generar ansiedad legítima y es natural querer distinguir entre lo normal y lo patológico. ¿Ha notado cambios específicos en su memoria que le preocupen más?

# Refuerzo Positivo
Su preocupación proactiva por su salud cognitiva demuestra responsabilidad y cuidado personal admirable.

# Preguntas Sintomatológicas
- ¿Ha experimentado dificultades para recordar nombres o palabras familiares?
- ¿Se olvida de conversaciones recientes o citas importantes?
- ¿Familiares han comentado cambios en su memoria?
- **¿Qué tanto le afecta en su día a día?** (0 = nada – 10 = muchísimo)

# Orientación Diagnóstica
Lo que describe puede relacionarse con cambios cognitivos normales del envejecimiento, pero solo una evaluación neuropsicológica puede descartar patología.

# Explicación del Grupo Diagnóstico
El envejecimiento normal incluye algunos cambios en velocidad de procesamiento y memoria, pero la función global debe mantenerse.

# Técnicas Prácticas
**¿Qué prefiere implementar primero?**

**Opción 1: Evaluación profesional**
- Evaluación neuropsicológica para establecer línea base objetiva

**Opción 2: Estimulación cognitiva**
- Actividades intelectualmente desafiantes: lectura, puzzles, aprendizaje

**Opción 3: Ejercicio físico**
- Actividad aeróbica regular mejora neuroplasticidad

# Algoritmo de Urgencia
Si experimenta desorientación, olvidos graves recientes o cambios de personalidad, busque evaluación médica inmediata.

# Psicoeducación
**¿Quiere que le explique qué cambios cognitivos son normales en el envejecimiento?**

# Recursos Locales
🏥 **Neuropsicólogo** especializado
🏥 **Geríatra** o médico de familia

*Esta información no sustituye la atención profesional.*

# Seguimiento Automático
¿Quiere que volvamos a hablar en 72 horas para revisar su situación?

# Advertencia Profesional
> *Esta información es solo orientativa y no sustituye el diagnóstico ni el tratamiento de un profesional colegiado. Si tiene dudas o malestar intenso, busque siempre ayuda profesional.*

### 📗 Libros recomendados:
1. *Successful Aging* - Rowe & Kahn. Investigación sobre envejecimiento óptimo y salud cognitiva.
2. *The Memory Bible* - Gary Small. Estrategias para mantener la agudeza mental en la madurez.
3. *Aging Well* - George Vaillant. Estudio longitudinal sobre factores de envejecimiento saludable.`,
    tone: "Científico pero tranquilizador. Información precisa sobre envejecimiento."
  },
  {
    ageRange: "30-35 años",
    question: "Siento presión por tener hijos pero no estoy seguro de querer ser padre/madre",
    response: `# Presentación Empática
Entiendo completamente tu ambivalencia sobre la parentalidad. Esta es una de las decisiones más significativas en la vida adulta y la presión social, familiar y del reloj biológico puede complicar lo que debería ser un proceso reflexivo y personal. ¿Sientes más presión externa o interna sobre esta decisión?

# Refuerzo Positivo
Cuestionar profundamente esta decisión demuestra responsabilidad y madurez. No hay prisa para decidir algo tan importante.

# Preguntas Sintomatológicas
- ¿Has experimentado ansiedad o estrés relacionado con esta decisión?
- ¿Sientes presión temporal por factores biológicos o sociales?
- ¿Hay discrepancias con tu pareja sobre este tema?
- **¿Qué tanto te afecta en tu día a día?** (0 = nada – 10 = muchísimo)

# Orientación Diagnóstica
Lo que describes puede relacionarse con ansiedad de decisión, estrés de rol adulto o conflicto de valores. La orientación familiar puede clarificar tus sentimientos.

# Explicación del Grupo Diagnóstico
La ambivalencia parental puede generar ansiedad, estrés relacional y afectar la toma de decisiones importantes sobre el futuro.

# Técnicas Prácticas
**¿Qué prefieres explorar primero?**

**Opción 1: Autoexploración profunda**
- Examina motivaciones reales vs. expectativas externas

**Opción 2: Diálogo en pareja**
- Alinea expectativas y deseos mutuos si tienes pareja

**Opción 3: Perspectiva temporal**
- Visualízate en diferentes escenarios futuros

# Algoritmo de Urgencia
No hay señales de alarma inmediatas, pero si la decisión está causando conflictos severos en tu relación, considera orientación de pareja.

# Psicoeducación
**¿Quieres que te explique por qué es válido sentir ambivalencia sobre la parentalidad?**

# Recursos Locales
🏥 **Orientación familiar** especializada
🏥 **Terapia de pareja** si es necesario

*Esta información no sustituye la atención profesional.*

# Seguimiento Automático
¿Quieres que volvamos a hablar en 72 horas para continuar explorando tus sentimientos?

# Advertencia Profesional
> *Esta información es solo orientativa y no sustituye el diagnóstico ni el tratamiento de un profesional colegiado. Si tienes dudas o malestar intenso, busca siempre ayuda profesional.*

### 📗 Libros recomendados:
1. *The Baby Decision* - Merle Bombardieri. Guía completa para tomar la decisión de ser padres de manera informada.
2. *Maybe Baby* - Liz Crain. Explorando la ambivalencia sobre la parentalidad y opciones de vida.
3. *Selfish, Shallow, and Self-Absorbed* - Meghan Daum. Perspectivas sobre la decisión de no tener hijos.`,
    tone: "Equilibrado y no prescriptivo. Respeta diferentes opciones de vida."
  },
  {
    ageRange: "40-45 años",
    question: "Estoy cuidando a mis padres mayores y me siento agotado emocionalmente",
    response: `# Presentación Empática
Entiendo completamente tu agotamiento emocional. La generación sandwich enfrenta múltiples responsabilidades simultáneas y el cuidado de padres mayores puede llevar al burnout del cuidador. ¿Hace cuánto tiempo llevas en esta situación de cuidado?

# Refuerzo Positivo
Tu dedicación al cuidado de tus padres demuestra amor y compromiso familiar extraordinarios. Reconocer tu agotamiento es valiente y necesario.

# Preguntas Sintomatológicas
- ¿Has experimentado cambios en tu sueño, apetito o nivel de energía?
- ¿Sientes resentimiento o culpabilidad por el cuidado que proporcionas?
- ¿Has descuidado tus propias necesidades o relaciones?
- **¿Qué tanto te afecta en tu día a día?** (0 = nada – 10 = muchísimo)

# Orientación Diagnóstica
Lo que describes puede relacionarse con síndrome de burnout del cuidador, depresión situacional o ansiedad crónica. La evaluación profesional es recomendable.

# Explicación del Grupo Diagnóstico
El burnout del cuidador incluye agotamiento físico, emocional y mental por el estrés prolongado del cuidado de otros.

# Técnicas Prácticas
**¿Qué prefieres implementar primero?**

**Opción 1: Red de apoyo**
- Identifica familiares o servicios que puedan compartir responsabilidades

**Opción 2: Autocuidado prioritario**
- Tu bienestar es fundamental para cuidar efectivamente a otros

**Opción 3: Límites saludables**
- Establece qué puedes y no puedes hacer sin culpabilidad

# Algoritmo de Urgencia
Si sientes desesperanza extrema o pensamientos de daño hacia ti o tus padres, busca ayuda profesional inmediata.

# Psicoeducación
**¿Quieres que te explique qué es el síndrome del cuidador y por qué es tan común?**

# Recursos Locales
🏥 **Servicios sociales** municipales
🏥 **Grupos de apoyo** para cuidadores

*Esta información no sustituye la atención profesional.*

# Seguimiento Automático
¿Quieres que volvamos a hablar en 72 horas para revisar tu situación?

# Advertencia Profesional
> *Esta información es solo orientativa y no sustituye el diagnóstico ni el tratamiento de un profesional colegiado. Si tienes dudas o malestar intenso, busca siempre ayuda profesional.*

### 📗 Libros recomendados:
1. *The 36-Hour Day* - Nancy Mace. Guía completa para el cuidado de personas mayores con demencia.
2. *Being Mortal* - Atul Gawande. Perspectivas sobre envejecimiento digno y cuidados paliativos.
3. *The Caregiver's Survival Handbook* - Alexis Abramson. Estrategias prácticas para evitar el burnout.`,
    tone: "Compasivo y práctico. Reconoce la carga emocional del cuidado."
  },
  {
    ageRange: "45-50 años",
    question: "Mis hijos son adolescentes y siento que no me respetan",
    response: `# Presentación Empática
Entiendo perfectamente tu frustración. Los conflictos con adolescentes son evolutivamente normales - implican individuación y cuestionamiento de autoridad como parte del desarrollo hacia la autonomía adulta. ¿Hay comportamientos específicos que más te preocupan o te hacen sentir irrespetado/a?

# Refuerzo Positivo
Tu preocupación por la relación con tus hijos demuestra amor y compromiso parental. Buscar mejores formas de conectar es un acto de amor.

# Preguntas Sintomatológicas
- ¿Has notado cambios en tu nivel de estrés o paciencia en casa?
- ¿Sientes que los conflictos están afectando la armonía familiar?
- ¿Te encuentras reaccionando de formas que luego lamentas?
- **¿Qué tanto te afecta en tu día a día?** (0 = nada – 10 = muchísimo)

# Orientación Diagnóstica
Lo que describes puede relacionarse con estrés parental, posible burnout familiar o conflictos de roles. La orientación familiar puede ser muy útil.

# Explicación del Grupo Diagnóstico
Los conflictos parent-adolescente intensos pueden generar estrés crónico, ansiedad y afectar la dinámica familiar global.

# Técnicas Prácticas
**¿Qué prefieres implementar primero?**

**Opción 1: Comunicación no confrontativa**
- Escucha activa evitando reacciones defensivas inmediatas

**Opción 2: Límites flexibles**
- Adapta reglas según madurez demostrada, manteniendo límites no negociables

**Opción 3: Validación emocional**
- Reconoce sus emociones sin necesariamente aprobar comportamientos

# Algoritmo de Urgencia
No hay señales de alarma inmediatas, pero si hay agresividad física o verbal extrema, busca orientación familiar especializada.

# Psicoeducación
**¿Quieres que te explique por qué los adolescentes necesitan cuestionar la autoridad?**

# Recursos Locales
🏥 **Terapia familiar** especializada
🏥 **Orientador/a** del instituto de tus hijos

*Esta información no sustituye la atención profesional.*

# Seguimiento Automático
¿Quieres que volvamos a hablar en 72 horas para revisar cómo van las cosas?

# Advertencia Profesional
> *Esta información es solo orientativa y no sustituye el diagnóstico ni el tratamiento de un profesional colegiado. Si tienes dudas o malestar intenso, busca siempre ayuda profesional.*

### 📗 Libros recomendados:
1. *The Teenage Brain* - Frances Jensen. Neurociencia del desarrollo adolescente para entender sus comportamientos.
2. *Untangled* - Lisa Damour. Entendiendo específicamente a las chicas adolescentes y sus necesidades.
3. *The Conscious Parent* - Shefali Tsabary. Parentalidad consciente y conexión emocional con adolescentes.`,
    tone: "Empático con la frustración parental pero educativo sobre desarrollo adolescente."
  },
  {
    ageRange: "55-60 años",
    question: "Me han diagnosticado una enfermedad crónica y no sé cómo afrontarlo",
    response: `# Presentación Empática
Entiendo profundamente el impacto emocional de recibir un diagnóstico de enfermedad crónica. Es completamente normal experimentar múltiples emociones: miedo, ira, tristeza e incertidumbre sobre el futuro. ¿Podría contarme cómo se ha sentido desde que recibió el diagnóstico?

# Refuerzo Positivo
Buscar apoyo emocional para procesar este diagnóstico demuestra fortaleza y sabiduría. Reconocer que necesita ayuda es valiente.

# Preguntas Sintomatológicas
- ¿Ha experimentado cambios en su estado de ánimo, sueño o apetito?
- ¿Siente miedo intenso sobre el progreso de la enfermedad?
- ¿Ha notado aislamiento social o pérdida de interés en actividades?
- **¿Qué tanto le afecta en su día a día?** (0 = nada – 10 = muchísimo)

# Orientación Diagnóstica
Lo que describe puede relacionarse con trastorno de adaptación, ansiedad médica o depresión situacional secundaria al diagnóstico. La evaluación profesional es recomendable.

# Explicación del Grupo Diagnóstico
Los diagnósticos de enfermedad crónica pueden desencadenar respuestas de estrés postraumático, ansiedad generalizada y procesos de duelo complejos.

# Técnicas Prácticas
**¿Qué prefiere implementar primero?**

**Opción 1: Procesamiento emocional**
- Permite experimentar el duelo por la pérdida de salud anterior

**Opción 2: Educación médica**
- Comprenda su condición, tratamientos y pronóstico realista

**Opción 3: Red de apoyo**
- Construya equipo de profesionales sanitarios, familiares y amigos

# Algoritmo de Urgencia
Si experimenta pensamientos de desesperanza profunda o ideas de no querer seguir viviendo, busque ayuda psicológica inmediata.

# Psicoeducación
**¿Quiere que le explique las etapas emocionales normales tras un diagnóstico médico?**

# Recursos Locales
🏥 **Psicólogo de la salud** especializado
🏥 **Grupos de apoyo** para su condición específica

*Esta información no sustituye la atención profesional.*

# Seguimiento Automático
¿Quiere que volvamos a hablar en 72 horas para acompañarle en este proceso?

# Advertencia Profesional
> *Esta información es solo orientativa y no sustituye el diagnóstico ni el tratamiento de un profesional colegiado. Si tiene dudas o malestar intenso, busque siempre ayuda profesional.*

### 📗 Libros recomendados:
1. *Full Catastrophe Living* - Jon Kabat-Zinn. Mindfulness para la gestión del dolor crónico y estrés médico.
2. *The Illness Narratives* - Arthur Kleinman. Experiencias de enfermedad crónica y adaptación psicológica.
3. *When the Body Says No* - Gabor Maté. Conexión entre estrés emocional y enfermedad física.`,
    tone: "Realista pero esperanzador. Valida las emociones difíciles del diagnóstico."
  },
  {
    ageRange: "60-65 años",
    question: "Me estoy acercando a la jubilación y siento ansiedad por el futuro",
    response: `# Presentación Empática
Entiendo perfectamente su ansiedad ante la jubilación. Esta transición representa uno de los cambios vitales más significativos - la pérdida de identidad profesional y rutina puede generar incertidumbre considerable. ¿Qué aspectos de la jubilación le generan más ansiedad?

# Refuerzo Positivo
Planificar proactivamente su jubilación demuestra sabiduría y responsabilidad hacia su bienestar futuro.

# Preguntas Sintomatológicas
- ¿Ha experimentado cambios en su sueño o estado de ánimo por esta preocupación?
- ¿Siente pérdida de identidad al pensar en dejar de trabajar?
- ¿Le preocupa el aislamiento social o la falta de estructura?
- **¿Qué tanto le afecta en su día a día?** (0 = nada – 10 = muchísimo)

# Orientación Diagnóstica
Lo que describe puede relacionarse con ansiedad de transición, posible depresión anticipatoria o estrés adaptativo. La orientación especializada puede ser muy útil.

# Explicación del Grupo Diagnóstico
La ansiedad pre-jubilatoria es común y puede manifestarse como preocupación excesiva por el futuro, pérdida de propósito y síntomas somáticos.

# Técnicas Prácticas
**¿Qué prefiere explorar primero?**

**Opción 1: Planificación de identidad**
- Desarrolle intereses que definan su valor más allá del trabajo

**Opción 2: Estructura temporal**
- Cree rutinas significativas que reemplacen la estructura laboral

**Opción 3: Conexiones sociales**
- Mantenga relaciones fuera del ámbito profesional

# Algoritmo de Urgencia
No hay señales de alarma inmediatas, pero si la ansiedad interfiere significativamente con su funcionamiento, considere apoyo profesional.

# Psicoeducación
**¿Quiere que le explique por qué la jubilación puede generar ansiedad y cómo prepararse?**

# Recursos Locales
🏥 **Psicólogo especializado** en transiciones vitales
🏥 **Grupos de preparación** para jubilación

*Esta información no sustituye la atención profesional.*

# Seguimiento Automático
¿Quiere que volvamos a hablar en 72 horas para continuar planificando?

# Advertencia Profesional
> *Esta información es solo orientativa y no sustituye el diagnóstico ni el tratamiento de un profesional colegiado. Si tiene dudas o malestar intenso, busque siempre ayuda profesional.*

### 📗 Libros recomendados:
1. *Retirement Without Borders* - Barry Golson. Planificación integral de jubilación y nuevas oportunidades.
2. *Finding Meaning in the Second Half of Life* - James Hollis. Propósito y desarrollo en la madurez.
3. *Your Retirement Your Way* - Alan Bernstein. Guía personalizada para una jubilación plena.`,
    tone: "Práctico y tranquilizador. Enfoque en preparación proactiva."
  },
  {
    ageRange: "70-75 años",
    question: "He perdido a mi pareja después de 45 años de matrimonio",
    response: `# Presentación Empática
Mi más sentido pésame por la pérdida de su pareja. Después de 45 años juntos, esta pérdida representa no solo duelo por la persona, sino por la identidad compartida, rutinas y futuro imaginado. ¿Cómo se ha sentido desde que ocurrió esta pérdida?

# Refuerzo Positivo
Compartir estos sentimientos demuestra valentía en un momento de profundo dolor. Su capacidad de reflexión es admirable.

# Preguntas Sintomatológicas
- ¿Ha experimentado cambios significativos en sueño, apetito o energía?
- ¿Siente que ha perdido interés en actividades que solían disfrutar juntos?
- ¿Experimenta momentos de intensa soledad o vacío?
- **¿Qué tanto le afecta en su día a día?** (0 = nada – 10 = muchísimo)

# Orientación Diagnóstica
Lo que describe es consistente con duelo complejo por pérdida de pareja de larga duración. El apoyo profesional especializado puede ser muy beneficioso.

# Explicación del Grupo Diagnóstico
El duelo por pareja de larga duración implica múltiples pérdidas: compañía, identidad compartida, rutinas y planes futuros.

# Técnicas Prácticas
**¿Qué prefiere intentar primero?**

**Opción 1: Mantenimiento de rutinas**
- Preserve estructura diaria permitiendo flexibilidad emocional

**Opción 2: Conexiones significativas**
- Mantenga contacto con familiares y amigos comprensivos

**Opción 3: Memoria honrante**
- Encuentre formas de honrar y recordar la relación compartida

# Algoritmo de Urgencia
Si experimenta pensamientos de no querer seguir viviendo o dañarse, busque ayuda inmediata.

# Psicoeducación
**¿Quiere que le explique las etapas normales del duelo y qué esperar?**

# Recursos Locales
🏥 **Consejería de duelo** especializada
🏥 **Grupos de apoyo** para viudez

*Esta información no sustituye la atención profesional.*

# Seguimiento Automático
¿Quiere que volvamos a hablar en 72 horas para acompañarle en este proceso?

# Advertencia Profesional
> *Esta información es solo orientativa y no sustituye el diagnóstico ni el tratamiento de un profesional colegiado. Si tiene dudas o malestar intenso, busque siempre ayuda profesional.*

### 📗 Libros recomendados:
1. *A Grief Observed* - C.S. Lewis. Reflexiones profundas sobre pérdida de pareja y proceso de duelo.
2. *Being a Widow* - Lynn Caine. Guía práctica para navegar la viudez y reconstruir la vida.
3. *On Death and Dying* - Elisabeth Kübler-Ross. Comprensión clásica de las etapas del duelo.`,
    tone: "Extremadamente compasivo y respetuoso. Reconoce la magnitud de la pérdida."
  },
  {
    ageRange: "75-80 años",
    question: "Me siento solo y como una carga para mi familia",
    response: `# Presentación Empática
Entiendo profundamente su sentimiento de soledad y preocupación por ser una carga. El aislamiento social en esta etapa tiene impactos reales en la salud, pero sus sentimientos son completamente válidos. ¿Podría contarme qué situaciones le hacen sentir más como una carga?

# Refuerzo Positivo
Compartir estos sentimientos demuestra valentía y confianza. Su experiencia y sabiduría tienen un valor incalculable para su familia.

# Preguntas Sintomatológicas
- ¿Ha experimentado cambios en su ánimo, sueño o apetito?
- ¿Siente que ha perdido interés en actividades que antes disfrutaba?
- ¿Tiene dificultades para mantener contacto social?
- **¿Qué tanto le afecta en su día a día?** (0 = nada – 10 = muchísimo)

# Orientación Diagnóstica
Lo que describe puede relacionarse con depresión gerítrica, aislamiento social crónico o duelo por pérdidas vitales. La evaluación profesional es recomendable.

# Explicación del Grupo Diagnóstico
La soledad crónica en la tercera edad puede manifestarse como depresión, ansiedad y deterioro cognitivo acelerado.

# Técnicas Prácticas
**¿Qué prefiere probar primero?**

**Opción 1: Comunicación familiar**
- Exprese sus necesidades emocionales de manera clara a sus seres queridos

**Opción 2: Participación comunitaria**
- Explore centros de día, grupos religiosos o voluntariado

**Opción 3: Contribución significativa**
- Identifique formas de aportar valor basándose en su experiencia

# Algoritmo de Urgencia
Si experimenta pensamientos de no querer seguir viviendo o siente desesperanza profunda, busque ayuda inmediata.

# Psicoeducación
**¿Quiere que le explique por qué la soledad afecta tanto en esta etapa y cómo combatirla?**

# Recursos Locales
🏥 **Centro de día** para mayores
🏥 **Servicios sociales** municipales

*Esta información no sustituye la atención profesional.*

# Seguimiento Automático
¿Quiere que volvamos a hablar en 72 horas para ver cómo se siente?

# Advertencia Profesional
> *Esta información es solo orientativa y no sustituye el diagnóstico ni el tratamiento de un profesional colegiado. Si tiene dudas o malestar intenso, busque siempre ayuda profesional.*

### 📗 Libros recomendados:
1. *Aging Well* - George Vaillant. Estudio longitudinal sobre envejecimiento exitoso y factores protectores.
2. *The Longevity Project* - Howard Friedman. Factores que contribuyen a una vida larga y satisfactoria.
3. *Successful Aging* - Rowe & Kahn. Cómo mantener independencia y bienestar en la tercera edad.`,
    tone: "Respetuoso y comprensivo. Reconoce la dignidad y valor de la experiencia vital."
  }
];

export default function EjemplosChat() {
  const [openItems, setOpenItems] = useState<string[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleItem = (ageRange: string) => {
    const isCurrentlyOpen = openItems.includes(ageRange);
    
    setOpenItems(prev => 
      prev.includes(ageRange) 
        ? prev.filter(item => item !== ageRange)
        : [...prev, ageRange]
    );
    
    // Si se está abriendo el item, hacer scroll al principio del contenido después de la expansión
    if (!isCurrentlyOpen) {
      setTimeout(() => {
        const element = document.querySelector(`[data-age-range="${ageRange}"]`);
        if (element) {
          const offset = 120; // Account for fixed header
          const elementPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top: elementPosition, behavior: "smooth" });
        }
      }, 300); // Wait for expansion animation
    }
  };

  return (
    <div className="min-h-screen bg-nflow-dark">
      <Header />
      
      <main className="pt-20 pb-16">
        {/* Promotional Hero Card - Conversion focused */}
        <section className="py-8 px-4 bg-gradient-to-br from-nflow-dark via-purple-900/20 to-nflow-dark">
          <div className="max-w-5xl mx-auto">
            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-emerald-600/90 via-teal-600/90 to-cyan-600/90 shadow-2xl shadow-emerald-500/20">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-400/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
              
              <CardContent className="relative p-8 md:p-12">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  {/* Left content */}
                  <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                      <Sparkles className="w-4 h-4" />
                      <span>Psicología + IA Especializada</span>
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                      NUXA no es ChatGPT con otro nombre
                    </h2>
                    
                    <p className="text-lg text-white/90 leading-relaxed">
                      Es un <strong>asistente de salud mental real</strong>, entrenado por psicólogos, 
                      que te escucha, te entiende y te acompaña con técnicas profesionales adaptadas a ti.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 text-white">
                        <div className="p-2 bg-white/20 rounded-lg">
                          <Shield className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium">100% Confidencial</span>
                      </div>
                      <div className="flex items-center gap-3 text-white">
                        <div className="p-2 bg-white/20 rounded-lg">
                          <Clock className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium">Disponible 24/7</span>
                      </div>
                      <div className="flex items-center gap-3 text-white">
                        <div className="p-2 bg-white/20 rounded-lg">
                          <Zap className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium">Respuestas al instante</span>
                      </div>
                      <div className="flex items-center gap-3 text-white">
                        <div className="p-2 bg-white/20 rounded-lg">
                          <Heart className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium">Apoyo emocional real</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                      <Link href="/precios">
                        <Button 
                          size="lg" 
                          className="w-full sm:w-auto bg-white text-emerald-700 hover:bg-gray-100 font-bold text-lg px-8 py-6 shadow-xl"
                          data-testid="button-get-nuxa"
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
                  
                  {/* Right content - Key differentiators */}
                  <div className="space-y-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <span className="text-2xl">🧠</span> ¿Por qué NUXA es diferente?
                      </h3>
                      <ul className="space-y-3 text-white/90">
                        <li className="flex items-start gap-3">
                          <span className="text-emerald-300 font-bold">✓</span>
                          <span><strong>Protocolos clínicos reales</strong> - No respuestas genéricas</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-emerald-300 font-bold">✓</span>
                          <span><strong>Técnicas de respiración, CBT, mindfulness</strong> guiadas paso a paso</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-emerald-300 font-bold">✓</span>
                          <span><strong>Detecta urgencias</strong> y te invita a que tomes decisiones voluntariamente</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-emerald-300 font-bold">✓</span>
                          <span><strong>Memoria contextual</strong> - Recuerda tu historial</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-emerald-300 font-bold">✓</span>
                          <span><strong>+150 idiomas</strong> - Te entiende en tu lengua</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-yellow-400/20 backdrop-blur-sm rounded-xl p-4 border border-yellow-400/30">
                      <p className="text-white text-center font-medium">
                        <span className="text-yellow-300">💡</span> <strong>NUXA</strong> está ayudando a muchas personas cada día
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

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
            <h2 className="text-3xl font-bold text-white text-center mb-6">
              Ejemplos reales por edades
            </h2>

            {/* Tres modos de chat - PRIMERA POSICIÓN */}
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-400/20 rounded-lg p-6 mb-8">
              <h3 className="text-white font-semibold text-lg mb-2 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-400" />
                Tres formas de hablar con NUXA
              </h3>
              <p className="text-gray-400 text-sm mb-5">Elige el estilo de conversación que mejor se adapte a tus necesidades</p>
              
              <div className="grid md:grid-cols-3 gap-4">
                {/* Modo Clásico */}
                <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 rounded-xl p-5 border border-nflow-orange/30 hover:border-nflow-orange/50 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-nflow-orange/20 flex items-center justify-center">
                      <Brain className="w-5 h-5 text-nflow-orange" />
                    </div>
                    <div>
                      <span className="text-white font-semibold text-sm block">Modo Clásico</span>
                      <span className="text-nflow-orange text-xs">Completo y estructurado</span>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed mb-3">
                    Respuestas detalladas con estructura profesional: técnicas paso a paso, ejercicios prácticos, recursos recomendados y libros especializados.
                  </p>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Ideal para explorar temas en profundidad</span>
                  </div>
                </div>
                
                {/* Modo Burbujas */}
                <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 rounded-xl p-5 border border-emerald-400/30 hover:border-emerald-400/50 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <span className="text-white font-semibold text-sm block">Modo Burbujas</span>
                      <span className="text-emerald-400 text-xs">Estilo WhatsApp</span>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed mb-3">
                    La misma información completa pero presentada en burbujas separadas que aparecen progresivamente, como una conversación natural de mensajería.
                  </p>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Experiencia más cercana y amigable</span>
                  </div>
                </div>
                
                {/* Modo Q&A Breve */}
                <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-xl p-5 border border-blue-400/30 hover:border-blue-400/50 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <span className="text-white font-semibold text-sm block">Modo Q&A Breve</span>
                      <span className="text-blue-400 text-xs">Respuestas rápidas</span>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed mb-3">
                    Respuestas directas de 2-4 oraciones. NUXA te contesta lo esencial y espera tu siguiente pregunta sin añadir información extra.
                  </p>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <ArrowRight className="w-3 h-3" />
                    <span>Perfecto para consultas rápidas</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-5 p-3 bg-gray-800/50 rounded-lg border border-gray-700/30">
                <p className="text-gray-400 text-xs text-center">
                  <strong className="text-gray-300">Cambiar de modo:</strong> Toca el icono <MessageSquare className="w-3 h-3 inline mx-1" /> en la barra del chat para alternar entre los tres modos en cualquier momento.
                </p>
              </div>
            </div>

            {/* Explicación sobre los ejemplos */}
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-emerald-500/30 rounded-2xl p-6 mb-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl mb-3">🤖✨</div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-3">
                  Mira cómo NUXA puede ayudarte
                </h3>
                <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-4">
                  Te dejamos ver <span className="text-emerald-400 font-semibold">ejemplos reales</span> de cómo procesa NUXA diferentes situaciones — quizás alguna refleje la tuya. La experiencia es tan auténtica que <span className="text-emerald-400 font-semibold">pensarás que hablas con un psicólogo sabio y experimentado</span>.
                </p>
                <p className="text-gray-400 text-sm mb-3">
                  Para hacer tus propias preguntas, elige un plan. Cada conversación usa IA avanzada que requiere servidores, licencias y tokens — costes que todos pagamos para usar esta tecnología.
                </p>
                <p className="text-white/90 text-sm italic mb-4 border-l-2 border-emerald-400 pl-3">
                  "Esto no solo responde: calma, orienta y te hace sentir escuchado."
                </p>
                <p className="text-emerald-400 font-semibold text-sm">
                  💚 Consulta nuestros planes en el menú ☰ · Sin permanencia
                </p>
              </div>
            </div>

            {/* Cartel informativo sobre las mejoras semanales */}
            <div className="bg-gradient-to-r from-nflow-orange/20 to-orange-600/20 border border-nflow-orange/30 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <Bot className="w-5 h-5 text-nflow-orange flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-nflow-orange font-semibold text-sm mb-1">
                    Ejemplos en constante evolución
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Estos ejemplos mejoran cada semana dado que la versión del robot se va mejorando cada semana y es más potente y extenso en sus respuestas con diferentes mejoras. Nosotros te presentamos una versión beta 3.0.1 que es muy rigurosa.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {chatExamples.map((example, index) => (
                <Card 
                  key={index} 
                  className="bg-gray-800/60 border-gray-700/50 overflow-hidden"
                  data-age-range={example.ageRange}
                >
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
                            <div 
                              className="text-gray-200 text-sm leading-relaxed"
                              dangerouslySetInnerHTML={{
                                __html: formatMarkdownToHtml(example.response)
                              }}
                            />
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
              <Card className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 border-0 max-w-3xl mx-auto shadow-2xl overflow-hidden">
                <CardContent className="p-10 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent pointer-events-none"></div>
                  
                  <div className="relative z-10">
                    <div className="text-5xl mb-4">💬🌟</div>
                    
                    <h3 className="text-2xl md:text-4xl font-extrabold text-white mb-4">
                      ¿Y tú, qué necesitas resolver?
                    </h3>
                    
                    <p className="text-lg md:text-xl text-emerald-100 mb-6 max-w-xl mx-auto leading-relaxed px-2">
                      Estos son solo ejemplos. <span className="font-bold text-white">Entra y expón tus preocupaciones</span> — NUXA te escucha, te orienta y te ayuda a encontrar respuestas personalizadas.
                    </p>
                    
                    <div className="flex justify-center items-center mb-6 px-4">
                      <Button 
                        className="bg-white hover:bg-gray-100 text-emerald-700 px-6 md:px-10 py-5 md:py-6 rounded-2xl font-bold text-base md:text-xl transition-all duration-300 hover:scale-105 shadow-xl w-full max-w-sm md:w-auto"
                        onClick={() => window.location.href = '/login'}
                        data-testid="button-probar-ahora"
                      >
                        💬 Empezamos a hablar
                      </Button>
                    </div>
                    
                    <p className="text-emerald-200 text-sm px-2">
                      Escoge el plan que mejor se ajuste a tus necesidades · <span className="font-bold text-white">Sin permanencia</span>
                    </p>
                  </div>
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