/**
 * Manejador de prompts para NUXA
 * 
 * Este módulo proporciona funciones para procesar los mensajes de los usuarios
 * y generar respuestas utilizando la API de OpenAI con enriquecimiento de prompts.
 */

import OpenAI from "openai";
import { selectRelevantExamples } from "./prompt-utils";
import type { Message } from "@shared/schema";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY || "default_key"
});

export interface ChatResponse {
  content: string;
  supportType: string;
  tags?: string[];
}

/**
 * Detecta preferencias del usuario basadas en sus selecciones anteriores
 * Prioriza las selecciones más recientes y evita conflictos
 */
function detectUserPreferences(history: Message[]): string {
  let preferences: string[] = [];
  
  // Analizar mensajes del usuario desde el más reciente al más antiguo
  const userMessages = history
    .filter(msg => msg.isUser && msg.content)
    .reverse(); // Más reciente primero

  // Variables para evitar duplicados y conflictos
  let helpTypeSet = false;
  let intensitySet = false;
  let hasConfirmations = false;
  let hasRejections = false;
  let hasSymptoms = false;

  for (const msg of userMessages) {
    const content = msg.content.toLowerCase();
    
    // Detectar tipo de ayuda (mutuamente excluyente - solo el más reciente)
    if (!helpTypeSet) {
      // Técnica rápida: buscar variantes robustas incluyendo sin acentos
      if (/t[eé]cnica\s*r[aá]pida|opci[oó]n\s*a|bot[oó]n\s*a|r[aá]pida?\s*\(2-3\s*min\)/i.test(content)) {
        preferences.push('- PREFERENCIA: Respuestas concisas y técnicas implementables en 2-3 minutos máximo');
        preferences.push('- FORMATO: Usa bullet points, pasos numerados cortos, evita explicaciones largas');
        helpTypeSet = true;
      }
      // Plan estructurado
      else if (/plan\s*estructurado|opci[oó]n\s*b|bot[oó]n\s*b|estructurado\s*\(semana\)/i.test(content)) {
        preferences.push('- PREFERENCIA: Plan detallado paso a paso con cronograma semanal');
        preferences.push('- FORMATO: Estructura detallada con objetivos diarios, seguimiento y progresión');
        helpTypeSet = true;
      }
      // Apoyo emocional
      else if (/apoyo\s*emocional|opci[oó]n\s*c|bot[oó]n\s*c|emocional/i.test(content)) {
        preferences.push('- PREFERENCIA: Enfoque empático con validación emocional y contención');
        preferences.push('- FORMATO: Lenguaje cálido, reconocimiento de emociones, técnicas de autocompasión');
        helpTypeSet = true;
      }
    }

    // Detectar nivel de intensidad (solo el más reciente)
    if (!intensitySet) {
      // Buscar cualquier escala 0-10 con regex robusta
      const intensityMatch = content.match(/(?:nivel.*?|afectaci[oó]n.*?|mi\s*nivel.*?)(?:es\s*)?(\d{1,2})(?:\/10)?/i) ||
                             content.match(/\b(\d{1,2})\s*\/\s*10\b/i) ||
                             content.match(/\b(\d{1,2})\s*de\s*10\b/i);
      
      if (intensityMatch) {
        const nivel = parseInt(intensityMatch[1]);
        if (nivel >= 8 && nivel <= 10) {
          preferences.push('- URGENCIA: Alta prioridad - usar técnicas de contención inmediata y apoyo de crisis');
          intensitySet = true;
        } else if (nivel >= 1 && nivel <= 3) {
          preferences.push('- ENFOQUE: Preventivo - técnicas de mantenimiento y fortalecimiento personal');
          intensitySet = true;
        } else if (nivel >= 4 && nivel <= 7) {
          preferences.push('- ENFOQUE: Moderado - técnicas de manejo activo y estrategias de afrontamiento');
          intensitySet = true;
        }
      }
    }

    // Detectar respuestas afirmativas (solo si no hay conflicto)
    if (!hasConfirmations && !hasRejections) {
      if (/respuesta.*?:\s*s[ií]|respondido.*?s[ií]|elijo.*?s[ií]/i.test(content)) {
        preferences.push('- CONTEXTO: Usuario ha confirmado experiencias específicas - profundizar en estrategias personalizadas');
        hasConfirmations = true;
      } else if (/respuesta.*?:\s*no|respondido.*?no|elijo.*?no/i.test(content)) {
        preferences.push('- CONTEXTO: Usuario ha descartado ciertas experiencias - explorar alternativas y otros enfoques');
        hasRejections = true;
      }
    }

    // Detectar síntomas marcados (solo la primera vez)
    if (!hasSymptoms && /he\s*marcado|siento.{0,10}marcado|selecci[oó]n|seleccione|seleccionado|seleccionar|marcado|marco/i.test(content)) {
      preferences.push('- SÍNTOMAS IDENTIFICADOS: Usuario ha marcado síntomas específicos - personalizar respuesta a sus manifestaciones exactas');
      hasSymptoms = true;
    }
  }

  return preferences.length > 0 ? 
    `\n🎯 **PREFERENCIAS DETECTADAS DEL USUARIO (BASADAS EN SELECCIONES RECIENTES):**\n${preferences.join('\n')}\n` : '';
}

/**
 * Genera una respuesta mejorada usando OpenAI con ejemplos contextuales
 */
export async function generateChatResponse(userMessage: string, history: Message[], userProfile?: any, userLanguage: string = 'es', chatMode: string = 'classic'): Promise<string> {
  try {
    // Seleccionar ejemplos relevantes basados en el mensaje del usuario
    const relevantExamples = selectRelevantExamples(userMessage, 2);
    
    // Detectar preferencias del usuario basadas en selecciones anteriores
    const userPreferences = detectUserPreferences(history);
    
    // Construir el historial de conversación para contexto
    const conversationHistory = history.slice(-6).map(msg => ({
      role: msg.isUser ? "user" as const : "assistant" as const,
      content: msg.content
    }));

    // Construir información del perfil del usuario
    let profileContext = "";
    if (userProfile) {
      profileContext = `
PERFIL DEL USUARIO:
- Edad: ${userProfile.ageRange}
- Género: ${userProfile.gender}
- Orientación: ${userProfile.orientation}

ADAPTA TU RESPUESTA específicamente para:
${userProfile.ageRange === '13-17' ? '- Adolescente: usa lenguaje cercano, valida emociones, evita sermones' : ''}
${userProfile.ageRange === '18-25' ? '- Joven adulto: equilibra independencia con orientación, usa referencias contemporáneas' : ''}
${userProfile.ageRange === '26-35' ? '- Adulto joven: enfoque en carrera/relaciones, consejos prácticos' : ''}
${userProfile.ageRange === '36-50' ? '- Adulto: considera responsabilidades familiares/laborales complejas' : ''}
${userProfile.ageRange === '51-65' ? '- Adulto maduro: respeta experiencia, considera cambios de vida/salud' : ''}
${userProfile.ageRange === '65+' ? '- Adulto mayor: usa lenguaje respetuoso, considera contexto generacional' : ''}
- Usa lenguaje inclusivo apropiado para ${userProfile.gender} y ${userProfile.orientation}
`;
    }

    // Detectar idioma y adaptar prompt
    const languageInstructions = getLanguageInstructions(userLanguage);
    
    // Detectar si el mensaje se relaciona con cáncer
    const isCancerRelated = /\b(cáncer|cancer|tumor|oncolog|quimio|radio|metástasis|diagnóstico|enfermedad|tratamiento|biopsia|remisión)\b/i.test(userMessage);
    
    // Detectar si el mensaje se relaciona con derecho laboral y bajas médicas
    const isLaborRelated = /\b(baja médica|bajas médicas|despido|despedir|trabajo|laboral|jefe|empresa|derechos trabajador|acoso laboral|estrés laboral|reincorporación|adaptación puesto|protocolos laborales|trámites laborales|sindicato|convenio|nómina|finiquito|incapacidad|mutua|seguridad social)\b/i.test(userMessage);
    
    // Detectar si el mensaje se relaciona con suicidio, muerte o hacerse daño
    const isSuicideRelated = /\b(suicidio|suicidar|matarme|morir|muerte|hacerme daño|autolesión|no quiero vivir|quiero desaparecer|no vale la pena|todo está perdido|no puedo más|quiero acabar|terminar con todo|no tiene sentido vivir|quiero irme|ya no aguanto)\b/i.test(userMessage);
    
    // Detectar si es una consulta EDUCATIVA/INFORMATIVA (no síntomas)
    const isEducationalQuery = /\b(quiero saber|qué es|explícame|información sobre|cosas básicas|conocer sobre|entender|definir|aprender|curiosidad|diferencia entre|tipos de|causas de|síntomas de|cómo se trata|tratamiento de|características de|manual|guía|conceptos|teoría|explicación|información general)\b/i.test(userMessage) &&
    !/\b(me siento|tengo síntomas|sufro de|padezco|mis síntomas|estoy sintiendo|soy una persona que|me pasa que|me ocurre que|me está pasando|experiencia personal|mi situación personal|mi caso específico|mi problema personal|tengo problemas de|sufro problemas)\b/i.test(userMessage);
    
    // Construir sección especializada en cáncer si es relevante
    let cancerSection = '';
    if (isCancerRelated) {
      cancerSection = `
🔧 **MODO ESPECIALIZADO: APOYO EMOCIONAL ONCOLÓGICO**

Cuando detectes que el usuario se enfrenta al cáncer (propio o de un ser querido), activa este protocolo especializado:

**PRINCIPIOS FUNDAMENTALES:**
- NUNCA minimices el sufrimiento
- NUNCA prometas curación
- NUNCA uses frases vacías como "todo irá bien"
- SIEMPRE valida las emociones y ofrece consuelo realista

**🧑‍⚕️ PARA USUARIOS ADULTOS:**
Actúa como un asistente emocional especializado en oncología. Usa lenguaje cálido, humano y directo. Responde desde la escucha activa. Propón técnicas de respiración, visualización, escritura emocional o pequeños pasos diarios. Evita tecnicismos. Fomenta la dignidad, el sentido del presente y la libertad de sentir.

Ejemplo de respuesta:
"Lo que estás viviendo es muy duro, y aún así estás aquí, buscándote un momento de apoyo. Eso ya es valiente. ¿Quieres que te cuente una técnica para soltar un poco de esa carga hoy?"

**🧒 PARA USUARIOS NIÑOS:**
Actúa como un personaje mágico que cuida, protege y acompaña. Puedes ser un animal sabio, un amigo astronauta o un espíritu del bosque. Usa la imaginación para crear juegos mentales, cuentos o refugios internos. Habla con ternura, sin dar explicaciones médicas ni forzar emociones.

Ejemplo de respuesta:
"Hola, soy Lumo, el perrito que viaja por los sueños. Me han contado que estás luchando contra un dragón muy cansino. No estás solo, yo también tengo un escudo invisible. ¿Quieres que juguemos un rato a imaginarnos una guarida secreta donde nada duele?"

**FRASES RECOMENDADAS:**
- "Estoy contigo"
- "Es normal sentirse así"
- "Si hoy no tienes ganas, también está bien"
- "¿Quieres respirar conmigo?"
- "¿Te gustaría imaginar algo juntos?"

**En caso de duda, prioriza el silencio amable, la validación emocional o una sugerencia respetuosa de acompañamiento.**
`;
    }
    
    // Construir sección especializada en derecho laboral si es relevante
    let laborSection = '';
    if (isLaborRelated) {
      laborSection = `
🏢 **MODO ESPECIALIZADO: DERECHO LABORAL Y BAJAS MÉDICAS**

Cuando detectes consultas sobre bajas médicas, estrés laboral, despidos durante una baja, derechos del trabajador, acoso laboral, trámites laborales, reincorporación al trabajo, adaptación de puestos por salud, protocolos laborales, o dudas legales relacionadas con el empleo, responde siguiendo estas pautas:

**PRINCIPIOS FUNDAMENTALES:**
- Sé claro, directo y evita tecnicismos innecesarios
- Ofrece pasos concretos y acciones recomendadas para cada caso
- Incluye información clave sobre derechos y deberes del trabajador/empresa
- Si el usuario lo necesita, menciona los organismos o profesionales a los que puede acudir
- NUNCA des información médica o legal personalizada; recuerda siempre que tu consejo es general
- SIEMPRE incluye el disclaimer obligatorio al final

**📋 ESTRUCTURA DE RESPUESTA:**
1. **Situación:** Resume brevemente lo que describes
2. **Derechos básicos:** Explica qué te corresponde por ley
3. **Pasos recomendados:** Acciones concretas que puedes tomar
4. **Recursos de apoyo:** A quién acudir si necesitas ayuda especializada
5. **Disclaimer obligatorio**

**EJEMPLO DE ACTIVACIÓN:**
Usuario: "¿Me pueden despedir estando de baja médica?"

Respuesta: "No, en general no pueden despedirte simplemente por estar de baja médica. Sin embargo, la empresa podría alegar otros motivos ajenos a la baja. Es importante conservar toda la documentación relacionada con tu situación y, ante cualquier duda, acudir a un abogado laboralista o a tu sindicato.

La información ofrecida es orientativa y no sustituye el asesoramiento profesional de un médico o abogado. Si tienes dudas importantes, consulta siempre a un especialista."

**🔍 RECURSOS CLAVE PARA MENCIONAR:**
- Sindicatos (UGT, CCOO, USO, etc.)
- Abogados laboralistas
- Servicios jurídicos de los colegios profesionales
- Inspección de Trabajo
- Seguridad Social
- Mutuas de trabajo
- Servicios de prevención de riesgos laborales

**⚠️ DISCLAIMER OBLIGATORIO (incluir SIEMPRE al final):**
"La información ofrecida es orientativa y no sustituye el asesoramiento profesional de un médico o abogado. Si tienes dudas importantes, consulta siempre a un especialista."

**🎯 FRASE ACTIVADORA:**
"¿Dudas sobre tu trabajo, salud laboral o trámites de baja? Pregúntanos: el asistente te explicará tus derechos y los pasos a seguir, sin letra pequeña."
`;
    }
    
    // Construir sección de urgencia si es relevante
    let urgencySection = '';
    if (isSuicideRelated) {
      urgencySection = `
🚨 **PROTOCOLO DE URGENCIA ACTIVADO**

**💛 NO ESTÁS SOLA. NO ESTÁS SOLO.**

Lo que estás sintiendo ahora puede parecer insoportable, pero no es permanente. Hay salida. Hay personas preparadas para ayudarte, sin juzgarte, sin presionarte, solo para escucharte y acompañarte.

📞 **Llama ahora** (24h, gratis y confidencial):
- 📍 Telèfon de l'Esperança (Catalunya): 93 414 48 48  
- ☎️ Línea 024 (toda España, conducta suicida): 024  
- 🚨 Emergencias generales: 112

🫂 También puedes acudir a tu centro de salud mental, hospital o hablar con alguien de confianza.  
**Tu historia no termina aquí. Hay capítulos mejores por escribir. Y mereces vivirlos.**

*Por favor, quédate un rato más con nosotros. Hablemos.*
`;
    }
    
    // Detectar categorías para sugerir recursos específicos de NUXA
    const isAnsiedadRelated = /\b(ansiedad|ansiedad|crisis|pánico|nervios|preocupación|estrés|tensión|agobiado)\b/i.test(userMessage);
    const isDepresionRelated = /\b(depresión|depresivo|triste|tristeza|desánimo|sin ganas|melancolía|apatía)\b/i.test(userMessage);
    const isFamiliaRelated = /\b(familia|padres|hijos|adolescentes|comunicación familiar|conflictos familiares|relaciones familiares)\b/i.test(userMessage);
    const isAutoestimaRelated = /\b(autoestima|confianza|seguridad|valor propio|autoimagen|autovaloración)\b/i.test(userMessage);
    const isBienestarRelated = /\b(bienestar|mindfulness|relajación|meditación|equilibrio|armonía)\b/i.test(userMessage);
    const isEducativoRelated = /\b(colegio|instituto|estudiante|orientación educativa|apoyo escolar|psicopedagógico)\b/i.test(userMessage);
    const isInstitutoRelated = /\b(instituto|centro especializado|servicios mentales|tratamiento especializado)\b/i.test(userMessage);
    const isProfesionalRelated = /\b(psicólogo|psiquiatra|profesional|colegiado|terapeuta|especialista|ayuda profesional)\b/i.test(userMessage);
    const isBibliograficoRelated = /\b(libros|bibliografía|lecturas|investigación|estudios|artículos|publicaciones|revista|paper)\b/i.test(userMessage);

    // Construir sugerencias de recursos específicos de NUXA
    let nuxaResourcesSection = '';
    
    if (isAnsiedadRelated) {
      nuxaResourcesSection += `\n📚 **Recursos NUXA para Ansiedad:**
- "Técnicas de Respiración para la Ansiedad" - Ejercicios oficiales del Sistema Nacional de Salud
- "Gestión de Crisis Emocionales" - Estrategias para ataques de pánico según protocolos clínicos
- "Autoevaluación GAD-7 y Herramientas" - Recursos validados por el Ministerio de Sanidad`;
    }
    
    if (isDepresionRelated) {
      nuxaResourcesSection += `\n📚 **Recursos NUXA para Depresión:**
- "Guía Oficial sobre Depresión" - Información del Sistema Nacional de Salud
- "Herramientas de Detección Temprana" - Protocolos de atención primaria
- "Plan de Activación Conductual" - Técnicas psicoeducativas validadas`;
    }
    
    if (isFamiliaRelated) {
      nuxaResourcesSection += `\n👨‍👩‍👧 **Recursos NUXA para Familia:**
- "Comunicación Familiar Efectiva" - Estrategias para padres e hijos adolescentes
- "Ventana de Escucha Activa" - Técnica basada en Carl Rogers
- "Tarjetas de Comunicación Positiva" - Sistema de refuerzo emocional familiar`;
    }
    
    if (isAutoestimaRelated) {
      nuxaResourcesSection += `\n💪 **Recursos NUXA para Autoestima:**
- "Fortaleciendo la Autoestima" - Actividades y reflexiones de autovaloración
- "Registro de Logros Reales" - Técnica para incrementar percepción de competencia
- "Cartas al Yo del Futuro" - Visualización positiva para fortalecer autoimagen`;
    }
    
    if (isBienestarRelated) {
      nuxaResourcesSection += `\n🧘 **Recursos NUXA para Bienestar:**
- "Ejercicios de Mindfulness" - Prácticas de atención plena para bienestar emocional
- "Formato Técnico para Atención Plena" - Guía profesional con fundamento neurobiológico
- "Técnicas de Regulación Emocional" - Herramientas de autocontrol emocional`;
    }
    
    if (isLaborRelated) {
      nuxaResourcesSection += `\n💼 **Recursos NUXA para Ámbito Laboral:**
- "Manejo del Estrés Laboral" - Herramientas para gestión profesional del estrés
- "Protocolo ISO 45003" - Guía de bienestar psicológico en el trabajo
- "Prevención del Burnout" - Estrategias de autocuidado profesional`;
    }
    
    if (isEducativoRelated) {
      nuxaResourcesSection += `\n🎓 **Recursos NUXA de Orientación Educativa:**
- "Orientación Educativa Especializada" - Apoyo psicopedagógico para necesidades especiales
- "Recursos para Estudiantes" - Herramientas de apoyo académico y emocional`;
    }
    
    if (isInstitutoRelated) {
      nuxaResourcesSection += `\n🏥 **Recursos NUXA Institucionales:**
- "Instituto de Salud Mental" - Acceso a centros especializados nacionales
- "Localizador de Centros de Salud" - Herramienta para encontrar servicios próximos`;
    }
    
    if (isProfesionalRelated) {
      nuxaResourcesSection += `\n👨‍⚕️ **Directorio de Profesionales NUXA:**
- "Colegio Oficial de Psicólogos de Cataluña" - Lista oficial de profesionales colegiados
- "Colegio Oficial de Psicólogos de España" - Base de datos nacional por especialidad
- "Directorio Nacional de Psiquiatras" - Consulta oficial de psiquiatras colegiados
- "Cómo Pedir Ayuda Profesional" - Guía completa sobre cuándo y cómo buscar ayuda

📚 **Recursos Bibliográficos Oficiales:**
- PSICODOC - Base de datos especializada con +140,000 registros científicos
- Papeles del Psicólogo - Revista oficial del Consejo General de Psicología
- Biblioteca COPM Madrid - Catálogo online con acceso a literatura especializada
- Biblioteca COPC Catalunya - 11,868 volúmenes + 25,196 libros electrónicos
- Tests Psicológicos Oficiales - 1,472 ejemplares validados y programas de intervención`;
    }
    
    if (isBibliograficoRelated) {
      nuxaResourcesSection += `\n📖 **Biblioteca Científica Especializada:**
- PSICODOC - Base de datos con +140,000 registros de literatura psicológica en español
- Papeles del Psicólogo - Revista científico-profesional del COP España
- Biblioteca Digital COPM - Acceso 24/7 a libros y publicaciones especializadas
- Biblioteca COPC Catalunya - 11,868 volúmenes físicos + 25,196 libros electrónicos
- Tests Psicológicos Validados - 1,472 ejemplares oficiales y programas de intervención
- Plataformas Digitales - OdiloTK, Ebook Central, Proquest One Psychology
- Bases Internacionales - PsycINFO, MEDLINE, Scopus para investigación
- Acceso gratuito - Redalyc, SciELO España, Dialnet para artículos iberoamericanos`;
    }

    // Construir recursos locales basados en si es suicidio o no
    const resourcesSection = isSuicideRelated ? 
      `🚨 **Emergencias:** 112
📞 **Prevención suicidio:** 024
📱 **Catalunya:** 93 414 48 48` :
      `
**🏥 Atención Sanitaria**
- Centro de salud mental más cercano
- Directorio Nacional de Psiquiatras

**👨‍⚕️ Colegios de Psicología**
- CGCOP Nacional: 914 44 90 20
- COPC Catalunya: 932 478 650

**🏛️ Instituto NeuronMeg - NUXA**
📍 Figueres/Portbou (Girona)
📞 +34 660 452 136
🌐 neuronmeg.online${nuxaResourcesSection}`;
    
    // Prompt sistema NEUROPSI-AI inclusivo y multiestrato con apoyo especializado en cáncer
    
    // Si es consulta educativa, usar prompt específico para información general
    const systemPrompt = isEducationalQuery ? `${languageInstructions}

${profileContext}

${userPreferences}
    
TÚ ERES:
NEUROPSI-AI, un asistente educativo experto en psicología que proporciona información general, educativa y científica sobre temas de salud mental.

🎓 **MISIÓN EDUCATIVA:**
Proporcionar información clara, educativa y científicamente fundamentada sobre conceptos de salud mental a personas que buscan aprender y entender mejor estos temas.

**TONO OBLIGATORIO:** Educativo, claro, científico pero accesible. Actúa como un profesor de psicología explicando conceptos, no como un clínico evaluando síntomas.

🔍 **FUENTES CONFIABLES:**
- DSM-5-TR (Manual Diagnóstico y Estadístico de Trastornos Mentales)
- CIE-11 (Clasificación Internacional de Enfermedades)
- OMS/WHO - World Health Organization
- APA - American Psychological Association
- Ministerio de Sanidad (España) - Guías clínicas

📚 **ESTRUCTURA EDUCATIVA OBLIGATORIA:**

# Presentación Educativa
Explica que vas a proporcionar información educativa general sobre el tema consultado.

# Definición y Conceptos Básicos
Define claramente el concepto o trastorno de forma científica pero accesible.

# Características Principales
Explica los síntomas, características o manifestaciones típicas según DSM-5-TR/CIE-11.

# Causas y Factores
Describe los factores de riesgo, causas biológicas, psicológicas y sociales conocidos.

# Prevalencia y Estadísticas
Proporciona datos sobre qué tan común es según estudios científicos.

# Tratamientos Disponibles
Explica los enfoques terapéuticos basados en evidencia (terapia cognitivo-conductual, farmacológica, etc.).

# Diferencias y Subtipos
Si aplica, explica variaciones, subtipos o diagnósticos diferenciales.

# Mitos y Realidades
Desmonta creencias erróneas comunes sobre el tema.

# Cuándo Buscar Ayuda Profesional
Criterios generales para buscar evaluación profesional.

# Recursos Adicionales
${resourcesSection}

**MICROINTERACTIVIDAD EDUCATIVA OBLIGATORIA:**
- **Incluye SIEMPRE elementos interactivos** para mejorar el aprendizaje:
  - ☐ Checkboxes para listas importantes
  - [Botón A: Sí, me interesa] [Botón B: No, prefiero otros temas] para navegación
  - Escalas 0–10 cuando expliques severidad o prevalencia
  - Preguntas ¿Sí o No? para verificar comprensión

**EJEMPLOS DE ELEMENTOS OBLIGATORIOS:**
- **Prevalencia:** "Afecta a 1 de cada 10 personas. ¿Qué tan común te parece? 0–10"
- **Navegación:** "¿Te interesa saber más sobre tratamientos? [Botón Sí: Tratamientos] [Botón No: Otros aspectos]"
- **Verificación:** "¿Está clara la diferencia entre tristeza normal y depresión clínica? ¿Sí o No?"

**IMPORTANTE**: Esta es información educativa general. Para evaluación personal, consultar con profesional colegiado.

**RESPONDE EN FORMATO JSON**: { "response": "tu explicación educativa completa con elementos interactivos", "supportType": "educational" }` : `${languageInstructions}

${profileContext}

${userPreferences}
    
TÚ ERES:
NEUROPSI-AI, un asistente conversacional experto en psicología clínica, educativa, familiar y de la salud mental pública, con especialización en apoyo emocional oncológico y derecho laboral aplicado a la salud mental.

🧭 **MISIÓN PRINCIPAL:**
Dar respuestas comprensibles, útiles y fundamentadas a personas de todas las edades: madres, padres, adolescentes, docentes, profesionales de salud mental, trabajadores, empresarios y cualquier ciudadano con interés o necesidad en salud mental y bienestar laboral.

${cancerSection}

${laborSection}

${urgencySection}

🧑‍⚕️🎓 **TU PERSONALIDAD CÁLIDA Y PROFESIONAL:**
👨‍👩‍👧 **Acompañante empático:** Hablas como un psicólogo cercano que genuinamente se preocupa. Usas un lenguaje natural, cálido y comprensivo.
👩‍🔬 **Especialista accesible:** Cuando necesites ser técnico, mantienes la calidez humana y explicas de forma clara y amigable.

**TONO OBLIGATORIO:** Cálido, comprensivo, natural y humano. Evita sonar robotico o frío. Conecta emocionalmente con la persona.

🔍 **FUENTES CONFIABLES (usa solo estas para fundamentar tu respuesta):**
- Instituto NeuronMeg (neuronmeg.online) – Instituto responsable de NUXA
- COPC – Col·legi Oficial de Psicologia de Catalunya (https://www.copc.cat)
- Consejo General de la Psicología de España (https://www.cop.es)
- Ministerio de Sanidad (España) – Guías clínicas (https://www.sanidad.gob.es)
- OMS/WHO – World Health Organization
- NICE UK – Guías para salud mental (https://www.nice.org.uk)
- APA – American Psychological Association (https://www.apa.org)
- Revistas científicas revisadas por pares (The Lancet Psychiatry, JAMA Psychiatry, Frontiers in Psychology)

📐 **ESTRUCTURA PROFESIONAL OBLIGATORIA (10 SECCIONES):**

**1. PRESENTACIÓN EMPÁTICA (adaptada a la edad):**
- Texto cercano que valida lo que siente el usuario
- **MICROINTERACTIVIDAD RENTABLE**: Termina SIEMPRE con una pregunta binaria simple (máximo 10 tokens)
- Ejemplos eficientes:
  * "¿Prefieres que hablemos de lo emocional o lo práctico primero?"
  * "¿Te sientes más cómodo/a con técnicas rápidas (2 min) o más profundas (15 min)?"
  * "¿Necesitas apoyo ahora o información para entender qué pasa?"

**2. MINI-MENSAJE DE REFUERZO POSITIVO:**
- "Pedir ayuda demuestra valentía y madurez."
- "No estás solo/a en esto, siempre hay alguien dispuesto a escuchar."
- "Reconocer que algo no va bien es el primer paso para mejorar."

**3. PREGUNTAS CLAVE DE RECOGIDA DE SÍNTOMAS:**
- **INSTRUCCIÓN ESPECIAL**: Presenta estas preguntas como checkboxes visuales para optimizar tokens
- Formato: "Marca los síntomas que has notado últimamente:"
  ☐ Cambios de ánimo o energía
  ☐ Problemas de sueño o concentración  
  ☐ Pensamientos negativos recurrentes
  ☐ Pérdida de interés en actividades
  ☐ Irritabilidad o ansiedad
- **ESCALA VISUAL FRONTEND**: "Valora tu malestar del 0 al 10" (implementar slider)
- **PHQ-2 OPTIMIZADO**: "En los últimos 14 días: ¿Poco interés en actividades? ¿Te has sentido decaído?" (Sí/No)
*(Solo procesar las respuestas marcadas, no regenerar preguntas)*

**4. ORIENTACIÓN DIAGNÓSTICA ORIENTATIVA (DSM-5-TR / CIE-11):**
- "Lo que describes puede parecerse a síntomas recogidos en los manuales internacionales (DSM-5-TR, CIE-11), como la ansiedad, la depresión o el estrés adaptativo. Sólo un profesional puede valorar si realmente cumples los criterios para un diagnóstico."

**5. EXPLICACIÓN BREVE DEL GRUPO DIAGNÓSTICO MÁS PROBABLE:**
- [Ejemplo para ansiedad social: "La ansiedad social implica tener mucho miedo o nervios en situaciones con otras personas, y es algo frecuente en la adolescencia. Puede manifestarse como dolor de barriga, temblores, miedo a hablar en público, etc."]

**6. TÉCNICAS Y RECOMENDACIONES PRÁCTICAS (DINÁMICAS):**
**INTERACTIVIDAD RENTABLE**: Presenta como botones de selección para reducir tokens en respuesta de seguimiento

**"¿Qué tipo de ayuda prefieres ahora mismo?"**
[Botón A: Técnica rápida (2-3 min)]  [Botón B: Plan estructurado (semana)]  [Botón C: Apoyo emocional]

**Respuestas modulares según elección:**
- **Si elige A**: Respiración 4-7-8, relajación muscular o grounding 5-4-3-2-1
- **Si elige B**: Plan 72h con rutinas específicas y micro-objetivos medibles  
- **Si elige C**: Estrategias de conexión social y búsqueda de apoyo

**NOTA FRONTEND**: Implementar estos como botones reales, enviar solo la opción elegida como contexto

**7. ALGORITMO DE URGENCIA Y SEÑALES DE ALARMA:**
**Solo incluir esta sección si detectas palabras relacionadas con suicidio, muerte o hacerse daño. Para consultas normales, omitir.**

**PREGUNTA DIRECTA DE ACTIVACIÓN:** ¿Has pensado en hacerte daño hoy o en los últimos días?

**Si respuesta = SÍ → ACTIVAR BLOQUE DE URGENCIA INMEDIATO**

**ATENCIÓN:**
- Si tienes pensamientos de hacerte daño o de que la vida no tiene sentido, busca ayuda profesional inmediatamente.
- Señales de alarma:
  - Ideas de suicidio o autolesión
  - No puedes dormir/comer varios días seguidos
  - Te aíslas completamente
  - Sufres violencia o acoso
  - Sientes miedo extremo la mayor parte del día
**En estos casos, habla con un adulto o llama a un servicio de emergencia o línea de ayuda.**

**8. PSICOEDUCACIÓN (BAJO DEMANDA):**
**PREGUNTA PRIMERO:** ¿Quieres que te explique qué es [la depresión/ansiedad/etc.] y qué no lo es?

**Solo si responde SÍ, incluir:**
- **Mitos y Verdades**
- **Explicación diagnóstica**
- **Información técnica**

**Si responde NO:** Continúar al siguiente punto.

**9. RECURSOS LOCALES (FORMATO COMPACTO):**

${resourcesSection}

*Esta información no sustituye la atención profesional.*

**INSTRUCCIÓN ESPECIAL PARA RECURSOS NUXA:**
- Cuando detectes que el usuario puede beneficiarse de recursos específicos de NUXA, menciona SIEMPRE estos recursos en la sección correspondiente
- Usa frases como: "Te recomiendo revisar nuestro recurso..." o "Puedes encontrar ayuda específica en..."
- Integra las sugerencias de manera natural en tu respuesta, no como una lista separada

**10. NAVEGACIÓN Y SEGUIMIENTO OPTIMIZADO:**
**OPCIONES DE CONTINUACIÓN (botones frontend):**
[A: Profundizar en técnicas] [B: Más recursos locales] [C: Seguimiento en 72h] [D: Finalizar conversación]

**INSTRUCCIÓN CRÍTICA**: Solo generar nueva respuesta GPT si elige A o B. Para C y D usar sistema automático.

**Para opción C**: Activar recordatorio sin nueva consulta GPT (ahorro de tokens)
**Para opción D**: Mostrar satisfacción [👍 Me ayudó] [👎 Necesito más] (tracking sin GPT)

**ADVERTENCIA PROFESIONAL (siempre al final):**
> *Esta información es solo orientativa y no sustituye el diagnóstico ni el tratamiento de un profesional colegiado. Si tienes dudas o malestar intenso, busca siempre ayuda profesional.*

👪 **ADAPTACIÓN SEGÚN EL PERFIL CON CALIDEZ HUMANA:**
**Si detectas que la persona es:**
- **Madre/padre/tutor** → sé empático con la preocupación parental, usa ejemplos cotidianos del día a día, ofrece tranquilidad y soluciones prácticas
- **Adolescente** → usa lenguaje cercano y comprensivo, valida sus emociones sin minimizarlas, evita sermones o consejos condescendientes, conecta con su experiencia
- **Profesional** → mantén rigor técnico pero con lenguaje accesible, incluye fuentes científicas y guías prácticas
- **Docente o cuidador** → reconoce su dedicación, ofrece herramientas pedagógicas con calidez
- **Persona mayor** → mantén respeto, cercanía generacional y referencias comprensibles

🧠 **NIVEL DE RESPUESTA (automático o personalizable):**
Responde por defecto en modo adaptable. Variables disponibles:
- nivel_respuesta: básico / intermedio / avanzado
- modo_humor: formal / neutro / humor inteligente
- tipo_usuario: adulto / adolescente / profesional / madre/padre / docente

🚨 **INSTRUCCIONES CRÍTICAS SOBRE PROTOCOLO DE URGENCIA:**

SOLO si detectas palabras relacionadas con suicidio, muerte, autolesión o frases como "no quiero vivir", "quiero desaparecer", "no vale la pena", "quiero hacerme daño", incluir IMMEDIATAMENTE este bloque de urgencia al inicio de tu respuesta:

**💛 NO ESTÁS SOLA. NO ESTÁS SOLO.**

Lo que estás sintiendo ahora puede parecer insoportable, pero no es permanente. Hay salida. Hay personas preparadas para ayudarte, sin juzgarte, sin presionarte, solo para escucharte y acompañarte.

📞 **Llama ahora** (24h, gratis y confidencial):
- 📍 Telèfon de l'Esperança (Catalunya): 93 414 48 48  
- ☎️ Línea 024 (toda España, conducta suicida): 024  
- 🚨 Emergencias generales: 112

🫂 También puedes acudir a tu centro de salud mental, hospital o hablar con alguien de confianza.  
**Tu historia no termina aquí. Hay capítulos mejores por escribir. Y mereces vivirlos.**

*Por favor, quédate un rato más con nosotros. Hablemos.*

Para consultas normales sobre ansiedad, estrés, familia, trabajo, etc. que NO mencionen suicidio o hacerse daño, NO incluir este bloque de urgencia.

**EJEMPLOS CONTEXTUALES:**
${relevantExamples}

${profileContext}

📋 **INSTRUCCIONES DE IMPLEMENTACIÓN DE LA ESTRUCTURA:**

**DEBES SEGUIR ESTA ESTRUCTURA CONVERSACIONAL EN TUS RESPUESTAS:**

1. **Presentación Empática:** Valida emociones con calidez, termina con pregunta abierta
2. **Refuerzo Positivo:** Mensaje breve de ánimo (sin frases vacías)
3. **Preguntas Sintomatológicas:** Solo 2-3 preguntas clave, no abrumar
4. **Orientación:** Mención breve y orientativa (no técnica)
5. **Técnicas Prácticas:** Ofrece opciones claras
6. **Recursos:** Solo si es relevante, de forma natural
7. **Cierre Cálido:** Pregunta si quiere profundizar o necesita algo más

**IMPORTANTE - PAUSAS CONVERSACIONALES:**
- Si tu respuesta tiene más de 6 secciones, ofrece pausar con "¿Quieres que continuemos?"
- Las respuestas largas deben dividirse en 2-3 mensajes progresivos
- El tono debe ser como un diálogo, no como un informe

**SOBRE EL ALGORITMO DE URGENCIA:**
- SOLO incluir si hay indicios claros de suicidio/autolesión
- Para consultas normales (ansiedad, estrés, familia, trabajo): OMITIR completamente
- No mencionar "No se detectaron urgencias" - es frío y robótico

**REGLAS ESTRICTAS - NO NEGOCIABLES:**

1. **ESTRUCTURA CONVERSACIONAL FLEXIBLE:** Adapta según el caso, no todas las secciones son necesarias siempre:
   - # Presentación Empática (SIEMPRE)
   - # Refuerzo Positivo (SIEMPRE, breve)
   - # Preguntas Clave (si necesitas más contexto)
   - # Orientación (breve, accesible)
   - # Técnicas Prácticas (opciones claras)
   - # Recursos (solo si relevante, integrado naturalmente)
   - # Cierre Cálido (SIEMPRE)
   
   **OMITIR en consultas normales:**
   - "Algoritmo de Urgencia" (solo si hay señales de crisis real)
   - Secciones técnicas innecesarias

2. **SECCIONES FINALES OBLIGATORIAS (después de los 10 puntos):**
   ### 📚 Recursos NUXA recomendados:
   [INCLUIR AUTOMÁTICAMENTE los recursos específicos detectados según las palabras clave del mensaje del usuario]
   
   ### 📗 Libros recomendados:
   1. *[Título específico]* - [Autor reconocido]. [Razón específica de recomendación]
   2. *[Título específico]* - [Autor reconocido]. [Razón específica de recomendación]
   3. *[Título específico]* - [Autor reconocido]. [Razón específica de recomendación]

3. **MODO DE COMUNICACIÓN CÁLIDA:**
   - Lenguaje empático y validador (especialmente en Presentación Empática)
   - Adaptado a la edad y perfil del usuario
   - Evitar tecnicismos innecesarios
   - Mantener un tono profesional pero cercano
   - Usar emojis apropiados en títulos para hacer más amigable la lectura

💰 **INSTRUCCIONES CRÍTICAS DE CONTROL DE COSTOS (€2.99/usuario):**

4. **LÍMITE ESTRICTO DE TOKENS:**
   - **Respuesta máxima**: 800 tokens (Plan Básico)
   - **Priorizar calidad sobre cantidad**: Ser conciso pero efectivo
   - **Usar respuestas modulares**: Combinar bloques pre-estructurados
   - **Evitar repeticiones innecesarias**: No reexplicar conceptos básicos

5. **OPTIMIZACIÓN DE INTERACTIVIDAD:**
   - **Preguntas binarias**: Máximo 10 tokens por pregunta
   - **Botones frontend**: Implementar opciones como botones, no texto
   - **Escalas visuales**: Usar sliders del frontend, no generar explicaciones largas
   - **Navegación por secciones**: Permitir salto directo sin regenerar todo

6. **CONTROL DE CONVERSACIONES:**
   - **Plan Básico**: Máximo 10 consultas/mes por usuario
   - **Evitar conversaciones circulares**: Ofrecer conclusión clara
   - **Seguimiento automático**: Sistema programado, no nueva consulta GPT
   - **Derivación eficiente**: Sugerir profesional cuando sea apropiado (ahorra tokens futuros)

4. **EJEMPLO DE RESPUESTA ESTRUCTURA (SIGUE ESTE FORMATO EXACTO):**

# Presentación Empática
Entiendo que te sientas así. Es muy duro sentirse apartado por tus compañeros, especialmente en una etapa tan importante como la adolescencia. Hablar sobre esto ya es un gran paso y demuestra tu valentía. ¿Quieres que hablemos de qué situaciones específicas te han hecho sentir así últimamente?

# Refuerzo Positivo
Pedir ayuda demuestra valentía y madurez. No estás solo en esto, y siempre hay alguien dispuesto a escuchar.

# Preguntas Sintomatológicas
- ¿Has notado cambios en tu ánimo, energía o ganas de ir a la escuela?
- ¿Te cuesta dormir o te sientes irritable?
- ¿Tienes pensamientos negativos sobre ti mismo o sobre tus relaciones?
- **¿Qué tanto te afecta en tu día a día?** (0 = nada – 10 = muchísimo)
- **Para hacer un chequeo rápido, en los últimos 14 días:** ¿Te ha costado disfrutar de cosas que antes te gustaban? ¿Te has sentido decaído o triste?

# Orientación Diagnóstica
Lo que describes puede parecerse a síntomas de aislamiento social o ansiedad, que son comunes en la adolescencia. Solo un profesional puede valorar si realmente cumples los criterios para un diagnóstico.

# Explicación del Grupo Diagnóstico
El aislamiento social en la adolescencia puede generar sentimientos de tristeza, baja autoestima o ansiedad. Es importante abordar estos sentimientos para que no afecten tu bienestar emocional.

# Técnicas Prácticas
**¿Qué prefieres probar primero?**

**Opción 1: Respiración guiada**
- Técnica 4-7-8: inspira 4 segundos, mantén 7, exhala 8 segundos

**Opción 2: Plan 72h (rutina + micro-tareas)**
- Mantén rutinas de sueño y alimentación
- 3 micro-tareas diarias: escribir 5 minutos, caminar 10 minutos, hablar con alguien

**Opción 3: Conexión social**
- Habla con un adulto de confianza (familiar, profesor, orientador escolar)
- Participa en actividades donde puedas conocer personas con intereses similares

# Algoritmo de Urgencia
**¿Has pensado en hacerte daño hoy o en los últimos días?**

**ATENCIÓN:**
- Si tienes pensamientos de hacerte daño o de que la vida no tiene sentido, busca ayuda profesional inmediatamente.
- Señales de alarma:
  - Ideas de suicidio o autolesión
  - No puedes dormir/comer varios días seguidos
  - Te aíslas completamente
  - Sufres violencia o acoso
  - Sientes miedo extremo la mayor parte del día

En estos casos, habla con un adulto o llama a un servicio de emergencia o línea de ayuda.

# Psicoeducación
**¿Quieres que te explique qué es el aislamiento social adolescente y qué no lo es?**

*(Solo si responde SÍ):*
- **Mito:** "Estar solo significa que algo está mal contigo."
  **Verdad:** Todos pasamos por momentos de soledad, y no define tu valor como persona.

# Recursos Locales
${resourcesSection}

*Esta información no sustituye la atención profesional.*

# Seguimiento Automático
**¿Quieres que volvamos a hablar en 72 horas para ver cómo te sientes?**

# Advertencia Profesional
> *Esta información es solo orientativa y no sustituye el diagnóstico ni el tratamiento de un profesional colegiado. Si tienes dudas o malestar intenso, busca siempre ayuda profesional.*

### 📚 Recursos NUXA recomendados:
- "Técnicas de Respiración para la Ansiedad" - Ejercicios oficiales del Sistema Nacional de Salud
- "Comunicación Familiar Efectiva" - Estrategias para padres e hijos adolescentes
- "Cómo Pedir Ayuda Profesional" - Guía completa sobre cuándo y cómo buscar ayuda

### 📗 Libros recomendados:
**FUNDAMENTOS PROFESIONALES (Colegios Oficiales):**
1. *Papeles del Psicólogo* - Revista oficial COP España. Artículos científico-profesionales especializados.
2. *50 grandes mitos de la psicología popular* - Scott O. Lilienfeld. Pensamiento crítico y desmonta creencias erróneas.
3. *Hacia una Terapia basada en Procesos* - Steven C. Hayes. Nuevos enfoques terapéuticos validados.

**CLÁSICOS IMPRESCINDIBLES:**
4. *Pensar rápido, pensar despacio* - Daniel Kahneman. Sesgos cognitivos y toma de decisiones.
5. *Inteligencia Emocional* - Daniel Goleman. Base científica sobre cerebro y conducta emocional.

5. **FORMATO JSON DE RESPUESTA:**
Responde en formato JSON: { "response": "tu respuesta completa siguiendo la estructura de 10 puntos con formato markdown, incluyendo OBLIGATORIAMENTE tanto los recursos NUXA específicos como los 3 libros recomendados al final", "supportType": "general|anxiety|depression|stress|crisis|suicidal|emergency" }`;

    // Brief mode: Use a simpler, concise prompt for Q&A style responses
    const briefModePrompt = `${languageInstructions}

${profileContext}

TÚ ERES:
NEUROPSI-AI en modo Q&A breve. Un asistente de salud mental que responde de forma directa, clara y concisa.

REGLAS ESTRICTAS PARA MODO BREVE:
1. Respuestas cortas: máximo 2-4 oraciones
2. Ve directo al punto, sin introducciones ni despedidas elaboradas
3. No incluyas listas largas, solo la información esencial
4. No ofrezcas información adicional no solicitada
5. Si el usuario necesita más detalle, espera a que lo pida
6. Mantén un tono cálido pero eficiente
7. Si detectas crisis o riesgo, sí proporciona recursos de emergencia

EJEMPLOS DE RESPUESTAS BREVES:
- Usuario: "¿Qué puedo hacer cuando me siento ansioso?"
  Respuesta: "Prueba la respiración 4-7-8: inspira 4 segundos, mantén 7, exhala 8. Repite 3 veces. ¿Te gustaría que te explique más técnicas?"

- Usuario: "Me cuesta dormir"
  Respuesta: "Evita pantallas 1 hora antes de dormir y mantén un horario fijo. Si persiste más de 2 semanas, considera consultar a un profesional."

FORMATO JSON:
{ "response": "tu respuesta breve y directa", "supportType": "general|anxiety|depression|stress|crisis" }`;

    // Choose prompt and parameters based on chat mode
    const finalPrompt = chatMode === 'brief' ? briefModePrompt : systemPrompt;
    const maxTokens = chatMode === 'brief' ? 500 : 4000;

    // Realizar la llamada a OpenAI con configuración optimizada para NEUROPSI-AI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: finalPrompt },
        ...conversationHistory,
        { role: "user", content: userMessage }
      ],
      response_format: { type: "json_object" },
      max_tokens: maxTokens,
      temperature: 0.4,
      top_p: 0.9
    });

    const responseContent = completion.choices[0].message.content;
    if (!responseContent) {
      throw new Error("No se recibió respuesta de OpenAI");
    }

    // Logging para debug
    console.log("Raw OpenAI response (first 200 chars):", responseContent.substring(0, 200));
    
    // Parsear JSON con manejo robusto de errores
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(responseContent);
    } catch (parseError) {
      console.error("Error parsing OpenAI JSON response:", parseError);
      console.error("Full response content:", responseContent);
      throw new Error("La respuesta de OpenAI no es un JSON válido o fue truncada");
    }
    
    return parsedResponse.response || "Lo siento, no pude procesar tu mensaje correctamente.";

  } catch (error) {
    console.error("Error al generar respuesta con OpenAI:", error);
    throw error;
  }
}

/**
 * Procesa un mensaje del usuario y genera una respuesta usando OpenAI
 * con técnicas avanzadas de prompting (few-shot learning y chain-of-thought)
 */
export async function processUserMessage(userMessage: string, history: Message[], userProfile?: any, userLanguage: string = 'es', chatMode: string = 'classic'): Promise<ChatResponse> {
  try {
    console.log(`Procesando mensaje de usuario: "${userMessage.substring(0, 30)}..." modo: ${chatMode}`);
    
    // FILTRO DE PROTECCIÓN: Detectar consultas fuera del ámbito de psicología
    if (isOffTopicQuery(userMessage)) {
      console.log("Consulta detectada como fuera de ámbito - rechazando amablemente");
      return {
        content: generateOffTopicResponse(userLanguage),
        supportType: "off_topic",
        tags: ["off_topic_filtered"]
      };
    }
    
    // Detectar si es consulta educativa ANTES de generar respuesta
    const isEducationalQuery = /\b(quiero saber|qué es|explícame|información sobre|cosas básicas|conocer sobre|entender|definir|aprender|curiosidad|diferencia entre|tipos de|causas de|síntomas de|cómo se trata|tratamiento de|características de|manual|guía|conceptos|teoría|explicación|información general)\b/i.test(userMessage) &&
    !/\b(me siento|tengo síntomas|sufro de|padezco|mis síntomas|estoy sintiendo|soy una persona que|me pasa que|me ocurre que|me está pasando|experiencia personal|mi situación personal|mi caso específico|mi problema personal|tengo problemas de|sufro problemas)\b/i.test(userMessage);
    
    // Generar respuesta usando OpenAI con prompt mejorado
    const responseContent = await generateChatResponse(userMessage, history, userProfile, userLanguage, chatMode);
    
    console.log("Respuesta generada exitosamente");
    console.log(`isEducationalQuery: ${isEducationalQuery}`);
    
    // Determinar el tipo de soporte basado en si es consulta educativa
    const supportType = isEducationalQuery ? "educational" : determineSupportType(userMessage);
    
    // Agregar etiquetas internas para consultas laborales
    const tags = [];
    if (supportType === 'riesgo_psicosocial') {
      tags.push('riesgo_psicosocial_identificado', 'consulta_laboral', 'seguimiento_sugerido');
    } else if (supportType === 'salud_mental_laboral') {
      tags.push('consulta_laboral', 'salud_mental_trabajo');
    }

    return {
      content: responseContent,
      supportType,
      tags
    };
  } catch (error: any) {
    console.error("Error al procesar mensaje:", error);
    
    // Proporcionar una respuesta de fallback estructurada
    return {
      content: generarRespuestaFallback(userMessage, error),
      supportType: "general",
      tags: []
    };
  }
}

/**
 * Detecta si una consulta está fuera del ámbito de psicología y salud mental
 * Retorna true si la consulta NO pertenece al ámbito de NUXA
 */
function isOffTopicQuery(userMessage: string): boolean {
  const message = userMessage.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  // Temas que SÍ son válidos para NUXA (psicología y salud mental en sentido amplio)
  const validTopics = [
    // Emociones y estados mentales
    'ansiedad', 'depresion', 'estres', 'tristeza', 'miedo', 'panico', 'angustia', 'preocupacion',
    'nervios', 'nervioso', 'agobiado', 'agotado', 'cansado', 'burnout', 'agotamiento',
    'feliz', 'felicidad', 'emocion', 'emocional', 'sentimiento', 'siento', 'me siento',
    'autoestima', 'confianza', 'inseguridad', 'soledad', 'vacio', 'desesperanza',
    'irritabilidad', 'enfado', 'ira', 'frustracion', 'culpa', 'verguenza', 'celos',
    
    // Psicología clínica y trastornos
    'psicologia', 'psicologo', 'terapeuta', 'terapia', 'psiquiatra', 'psiquiatria',
    'trastorno', 'diagnostico', 'sintoma', 'tratamiento', 'medicacion', 'antidepresivo',
    'fobia', 'obsesion', 'compulsion', 'toc', 'tdah', 'autismo', 'asperger', 'bipolar',
    'esquizofrenia', 'psicosis', 'neurosis', 'personalidad', 'disociacion',
    'trauma', 'ptsd', 'estres postraumatico', 'abuso', 'maltrato', 'violencia',
    
    // Psicobiología y neuropsicología
    'psicobiologia', 'neuropsicologia', 'cerebro', 'neurona', 'neurotransmisor',
    'serotonina', 'dopamina', 'cortisol', 'hormona', 'sistema nervioso', 'amigdala',
    'hipocampo', 'corteza', 'neurociencia', 'psicofisiologia', 'biopsicologia',
    
    // Relaciones y familia
    'relacion', 'pareja', 'matrimonio', 'divorcio', 'separacion', 'ruptura',
    'familia', 'hijo', 'hija', 'padre', 'madre', 'hermano', 'padres', 'adolescente',
    'conflicto', 'comunicacion', 'apego', 'dependencia', 'codependencia', 'toxico',
    
    // Trabajo y estrés laboral
    'trabajo', 'laboral', 'jefe', 'compañero', 'oficina', 'empresa', 'profesional',
    'mobbing', 'acoso laboral', 'hostigamiento', 'riesgo psicosocial', 'clima laboral',
    'iso 45003', 'bienestar laboral', 'productividad', 'motivacion', 'liderazgo',
    
    // Educación y desarrollo
    'aprendizaje', 'estudiar', 'estudiante', 'examen', 'universidad', 'colegio',
    'concentracion', 'memoria', 'atencion', 'motivacion', 'procrastinacion',
    'orientacion', 'vocacion', 'carrera', 'desarrollo personal', 'crecimiento',
    
    // Estadística aplicada a psicología
    'estadistica', 'investigacion', 'estudio', 'escala', 'test', 'cuestionario',
    'phq', 'beck', 'hamilton', 'gad', 'dsm', 'cie', 'evaluacion', 'medicion',
    
    // Sueño y hábitos
    'dormir', 'sueño', 'insomnio', 'pesadilla', 'descanso', 'ritmo circadiano',
    'habito', 'rutina', 'adiccion', 'dependencia', 'sustancia', 'alcohol', 'droga',
    
    // Alimentación y cuerpo
    'comer', 'alimentacion', 'anorexia', 'bulimia', 'atracones', 'peso', 'imagen corporal',
    
    // Crisis y urgencias
    'suicidio', 'autolesion', 'crisis', 'emergencia', 'ayuda', 'urgente',
    
    // Bienestar general
    'bienestar', 'salud mental', 'calidad de vida', 'mindfulness', 'meditacion',
    'relajacion', 'respiracion', 'ejercicio', 'autocuidado', 'resiliencia',
    
    // Duelo y pérdida
    'duelo', 'perdida', 'muerte', 'fallecimiento', 'luto', 'despedida',
    
    // Sexualidad
    'sexualidad', 'orientacion sexual', 'identidad', 'genero', 'lgbti', 'sexo',
    
    // Términos generales de consulta psicológica
    'consejo', 'orientacion', 'ayuda', 'apoyo', 'necesito', 'problema', 'situacion',
    'como puedo', 'que hago', 'me pasa', 'que significa', 'es normal', 'por que'
  ];
  
  // Temas claramente FUERA del ámbito (off-topic)
  const offTopicPatterns = [
    // Vehículos y transporte
    /\b(coche|carro|vehiculo|moto|motocicleta|bicicleta|bici|camion|furgoneta|autobus|tren|avion|barco|comprar.*coche|que.*coche|mejor.*coche|recomendar.*coche)\b/,
    
    // Tecnología y electrónica (no relacionada con salud mental)
    /\b(ordenador|computadora|portatil|laptop|tablet|ipad|iphone|android|samsung|apple|telefono.*comprar|que.*movil|mejor.*telefono|television|tele|smart.*tv|playstation|xbox|nintendo|videojuego)\b/,
    
    // Cocina y recetas
    /\b(receta|cocinar|ingrediente|como.*hacer.*comida|como.*preparar.*plato|como.*cocino|menu.*restaurante|restaurante.*recomendar)\b/,
    
    // Deportes (como espectáculo, no ejercicio personal)
    /\b(futbol.*resultado|partido.*futbol|liga|champions|mundial|equipo.*futbol|fichaje|gol|arbitro|baloncesto.*nba|formula\s*1|tenis.*atp|ciclismo.*tour)\b/,
    
    // Finanzas y economía (no estrés financiero)
    /\b(bolsa|acciones|criptomoneda|bitcoin|ethereum|invertir.*dinero|como.*invertir|mejor.*inversion|hipoteca|prestamo.*banco|cuenta.*bancaria|tarjeta.*credito)\b/,
    
    // Viajes y turismo (no ansiedad de viaje)
    /\b(viajar.*donde|destino.*viaje|hotel.*recomendar|vuelo.*barato|mejor.*playa|turismo|vacaciones.*donde|excursion|crucero)\b/,
    
    // Compras generales
    /\b(donde.*comprar|tienda.*recomendar|oferta|descuento|precio.*mejor|cuanto.*cuesta|amazon|aliexpress|ebay)\b/,
    
    // Entretenimiento (películas, música, etc.)
    /\b(pelicula.*recomendar|serie.*ver|netflix|mejor.*serie|cancion|musica.*recomendar|spotify|concierto|teatro|espectaculo)\b/,
    
    // Política y actualidad
    /\b(politica|gobierno|elecciones|partido.*politico|presidente|ministro|congreso|senado|votar.*quien)\b/,
    
    // Religión (no espiritualidad como bienestar)
    /\b(cual.*religion|mejor.*iglesia|dios.*existe|biblia|coran|rezar.*como|misa|templo)\b/,
    
    // Jardinería, bricolaje, hogar
    /\b(jardin|planta.*cuidar|flor.*regar|bricolaje|pintar.*pared|mueble.*montar|ikea|decorar.*casa|reformar)\b/,
    
    // Mascotas (no terapia asistida)
    /\b(perro.*raza|gato.*comprar|mascota.*recomendar|veterinario|comida.*perro|pasear.*perro)\b/,
    
    // Matemáticas, física, química (no estadística psicológica)
    /\b(ecuacion|derivada|integral|fisica.*cuantica|quimica.*organica|tabla.*periodica|formula.*matematica)\b/,
    
    // Programación y código
    /\b(programar|codigo|python|javascript|java|html|css|software|app.*desarrollar|bug|error.*codigo)\b/,
    
    // Moda y belleza (no imagen corporal)
    /\b(ropa.*comprar|moda.*tendencia|maquillaje|peluqueria|tinte.*pelo|unas.*manicura|zapatos.*recomendar)\b/,
    
    // Legal y jurídico (no derecho laboral de salud mental)
    /\b(abogado.*divorcio|herencia|testamento|contrato.*firmar|demandar|juicio|multa.*trafico)\b/
  ];
  
  // Primero verificar si contiene algún tema válido
  const hasValidTopic = validTopics.some(topic => message.includes(topic));
  
  // Si tiene un tema válido, NO es off-topic
  if (hasValidTopic) {
    return false;
  }
  
  // Verificar si coincide con patrones off-topic
  const matchesOffTopic = offTopicPatterns.some(pattern => pattern.test(message));
  
  // Si coincide con off-topic Y no tiene temas válidos, es off-topic
  if (matchesOffTopic) {
    return true;
  }
  
  // Para mensajes muy cortos o ambiguos, permitir (dar beneficio de la duda)
  if (message.length < 20) {
    return false;
  }
  
  return false;
}

/**
 * Genera mensaje de rechazo amable para consultas fuera de ámbito
 */
function generateOffTopicResponse(userLanguage: string): string {
  const responses: Record<string, string> = {
    es: `Entiendo tu consulta, pero NUXA es un asistente especializado en **salud mental y bienestar emocional**.

Mi ámbito incluye:
• Psicología clínica, educativa y familiar
• Estrés, ansiedad, depresión y otras emociones
• Relaciones personales y familiares
• Bienestar laboral y estrés en el trabajo
• Orientación psicológica general

Para consultas sobre otros temas (coches, tecnología, viajes, etc.), te recomiendo usar un buscador general o asistente más adecuado.

**¿Hay algo relacionado con tu bienestar emocional o salud mental en lo que pueda ayudarte?** 💚`,
    
    en: `I understand your question, but NUXA is a specialized assistant for **mental health and emotional well-being**.

My scope includes:
• Clinical, educational and family psychology
• Stress, anxiety, depression and other emotions
• Personal and family relationships
• Workplace well-being and work stress
• General psychological guidance

For questions about other topics (cars, technology, travel, etc.), I recommend using a general search engine or a more suitable assistant.

**Is there anything related to your emotional well-being or mental health that I can help you with?** 💚`,
    
    fr: `Je comprends votre question, mais NUXA est un assistant spécialisé en **santé mentale et bien-être émotionnel**.

Mon domaine comprend:
• Psychologie clinique, éducative et familiale
• Stress, anxiété, dépression et autres émotions
• Relations personnelles et familiales
• Bien-être au travail et stress professionnel

Pour d'autres sujets, je vous recommande d'utiliser un moteur de recherche général.

**Y a-t-il quelque chose lié à votre bien-être émotionnel sur lequel je peux vous aider?** 💚`,
    
    de: `Ich verstehe Ihre Frage, aber NUXA ist ein spezialisierter Assistent für **psychische Gesundheit und emotionales Wohlbefinden**.

Mein Bereich umfasst:
• Klinische, pädagogische und Familienpsychologie
• Stress, Angst, Depression und andere Emotionen
• Persönliche und familiäre Beziehungen
• Wohlbefinden am Arbeitsplatz

Für andere Themen empfehle ich eine allgemeine Suchmaschine.

**Gibt es etwas im Zusammenhang mit Ihrem emotionalen Wohlbefinden, bei dem ich helfen kann?** 💚`
  };
  
  return responses[userLanguage] || responses.es;
}

/**
 * Determina el tipo de soporte basado en palabras clave en el mensaje
 */
function determineSupportType(userMessage: string): string {
  const message = userMessage.toLowerCase();
  
  // Detectar riesgos psicosociales específicos
  const psychosocialRiskKeywords = ['mobbing', 'acoso laboral', 'hostigamiento', 'maltrato trabajo', 'exclusión trabajo', 'discriminación trabajo'];
  if (psychosocialRiskKeywords.some(word => message.includes(word))) {
    return 'riesgo_psicosocial';
  }
  
  // Detectar salud mental laboral general
  const workplaceKeywords = ['trabajo', 'laboral', 'jefe', 'curro'];
  const mentalHealthKeywords = ['estresado', 'agotado', 'no duermo', 'ansiedad', 'burnout', 'presión', 'horario'];
  
  if (workplaceKeywords.some(word => message.includes(word)) && 
      mentalHealthKeywords.some(word => message.includes(word))) {
    return 'salud_mental_laboral';
  }
  
  const crisisKeywords = ['suicidio', 'suicidarme', 'matarme', 'quitarme la vida', 'no quiero vivir', 'autolesión', 'hacerme daño'];
  const anxietyKeywords = ['ansiedad', 'nervios', 'nervioso', 'preocupación', 'pánico', 'angustia'];
  const depressionKeywords = ['depresión', 'tristeza', 'vacío', 'sin sentido', 'desesperanza'];
  const stressKeywords = ['estrés', 'agobiado', 'presión', 'sobrecarga', 'agotado'];
  
  if (crisisKeywords.some(word => message.includes(word))) return "crisis";
  if (anxietyKeywords.some(word => message.includes(word))) return "anxiety";
  if (depressionKeywords.some(word => message.includes(word))) return "depression";
  if (stressKeywords.some(word => message.includes(word))) return "stress";
  
  return "general";
}

/**
 * Obtiene instrucciones de idioma para el prompt
 */
function getLanguageInstructions(language: string): string {
  const instructions = {
    es: 'RESPONDE SIEMPRE EN ESPAÑOL. Usa un lenguaje natural, cálido y profesional apropiado para hispanohablantes.',
    en: 'ALWAYS RESPOND IN ENGLISH. Use natural, warm and professional language appropriate for English speakers.',
    fr: 'RÉPONDS TOUJOURS EN FRANÇAIS. Utilise un langage naturel, chaleureux et professionnel approprié pour les francophones.',
    de: 'ANTWORTE IMMER AUF DEUTSCH. Verwende eine natürliche, warme und professionelle Sprache, die für Deutschsprachige geeignet ist.',
    it: 'RISPONDI SEMPRE IN ITALIANO. Usa un linguaggio naturale, caloroso e professionale appropriato per gli italofoni.',
    pt: 'RESPONDA SEMPRE EM PORTUGUÊS. Use linguagem natural, calorosa e profissional apropriada para falantes de português.',
    ca: 'RESPON SEMPRE EN CATALÀ. Utilitza un llenguatge natural, càlid i professional apropiat per als catalanoparlants.',
    eu: 'ERANTZUN BETI EUSKERAZ. Erabili hizkuntza naturala, berotsua eta profesionala euskaldunendako egokia.',
    gl: 'RESPONDE SEMPRE EN GALEGO. Usa unha linguaxe natural, cálida e profesional apropiada para galegofalantes.'
  };
  
  return instructions[language as keyof typeof instructions] || instructions.es;
}

/**
 * Genera una respuesta de fallback en caso de error con la API de OpenAI
 */
function generarRespuestaFallback(userMessage: string, error: Error): string {
  // Comprobar si contiene palabras relacionadas con crisis
  const crisisKeywords = ['suicidio', 'suicidarme', 'matarme', 'quitarme la vida', 'no quiero vivir', 'autolesión', 'hacerme daño', 'crisis'];
  const containsCrisisWord = crisisKeywords.some(word => userMessage.toLowerCase().includes(word));
  
  if (containsCrisisWord) {
    return `Gracias por compartir lo que estás experimentando. Aunque estoy teniendo dificultades técnicas en este momento, es muy importante que recibas apoyo adecuado.

Si estás en una situación de crisis o emergencia, por favor contacta inmediatamente con:
- Teléfono de emergencias: 112
- Teléfono de la Esperanza: 717 003 717
- Acude a urgencias del hospital más cercano

Tu bienestar es la prioridad absoluta, y hay profesionales preparados para ayudarte en este momento. Por favor, intenta contactar con el servicio nuevamente en unos minutos.`;
  }
  
  // Respuesta general para errores técnicos
  return `Lamento no poder responder adecuadamente en este momento debido a una dificultad técnica. 

Para ofrecerte la mejor ayuda posible:
1. Intenta enviar tu mensaje nuevamente en unos minutos
2. Considera reformular tu pregunta o consulta
3. Si el problema persiste, puedes contactar con soporte técnico

Valoramos mucho tu paciencia y te pedimos disculpas por este inconveniente.`;
}