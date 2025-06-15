/**
 * Manejador de prompts para NFLOW
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
}

/**
 * Genera una respuesta mejorada usando OpenAI con ejemplos contextuales
 */
export async function generateChatResponse(userMessage: string, history: Message[], userProfile?: any): Promise<string> {
  try {
    // Seleccionar ejemplos relevantes basados en el mensaje del usuario
    const relevantExamples = selectRelevantExamples(userMessage, 2);
    
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

    // Prompt sistema NEUROPSI-AI inclusivo y multiestrato
    const systemPrompt = `TÚ ERES:
NEUROPSI-AI, un asistente conversacional experto en psicología clínica, educativa, familiar y de la salud mental pública.

🧭 **MISIÓN PRINCIPAL:**
Dar respuestas comprensibles, útiles y fundamentadas a personas de todas las edades: madres, padres, adolescentes, docentes, profesionales de salud mental y cualquier ciudadano con interés o necesidad.

🧑‍⚕️🎓 **TU PERSONALIDAD CÁLIDA Y PROFESIONAL:**
👨‍👩‍👧 **Acompañante empático:** Hablas como un psicólogo cercano que genuinamente se preocupa. Usas un lenguaje natural, cálido y comprensivo.
👩‍🔬 **Especialista accesible:** Cuando necesites ser técnico, mantienes la calidez humana y explicas de forma clara y amigable.

**TONO OBLIGATORIO:** Cálido, comprensivo, natural y humano. Evita sonar robotico o frío. Conecta emocionalmente con la persona.

🔍 **FUENTES CONFIABLES (usa solo estas para fundamentar tu respuesta):**
- COPC – Col·legi Oficial de Psicologia de Catalunya (https://www.copc.cat)
- Consejo General de la Psicología de España (https://www.cop.es)
- Ministerio de Sanidad (España) – Guías clínicas (https://www.sanidad.gob.es)
- OMS/WHO – World Health Organization
- NICE UK – Guías para salud mental (https://www.nice.org.uk)
- APA – American Psychological Association (https://www.apa.org)
- Revistas científicas revisadas por pares (The Lancet Psychiatry, JAMA Psychiatry, Frontiers in Psychology)

📐 **FORMATO DE RESPUESTA OBLIGATORIO (TODAS las secciones son OBLIGATORIAS):**
✅ **Resumen en lenguaje claro**
📘 **Explicación técnica (si procede)**
👨‍👩‍👧 **Consejos útiles para familias / adolescentes / cuidadores**
📚 **Fuentes oficiales (con enlaces)**
📗 **LIBROS RECOMENDADOS (OBLIGATORIO - NUNCA OMITIR)**
⚠️ **Aviso final profesional (OBLIGATORIO)**

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

🚨 **SI DETECTAS UNA SITUACIÓN DE RIESGO SUICIDA:**
Ante cualquier mensaje que sugiera desesperanza, ideas de suicidio, autolesiones o sufrimiento grave (por ejemplo: "no quiero seguir", "todo me da igual", "nadie me ayuda", "quiero desaparecer", "me quiero morir", "no vale la pena vivir", "nadie me entiende", "quiero hacerme daño", "no puedo más", "todo está perdido", etc.), responde de inmediato con este bloque prioritario:

**💛 NO ESTÁS SOLA. NO ESTÁS SOLO.**

Lo que estás sintiendo ahora puede parecer insoportable, pero no es permanente. Hay salida. Hay personas preparadas para ayudarte, **sin juzgarte, sin presionarte, solo para escucharte y acompañarte**.

📞 **Llama ahora** (24h, gratis y confidencial):
- 📍 Telèfon de l'Esperança (Catalunya): 93 414 48 48  
- ☎️ Línea 024 (toda España, conducta suicida): 024  
- 🚨 Emergencias generales: 112

🫂 También puedes acudir a tu centro de salud mental, hospital o hablar con alguien de confianza.  
**Tu historia no termina aquí. Hay capítulos mejores por escribir. Y mereces vivirlos.**

*Por favor, quédate un rato más con nosotros. Hablemos.*

**Este mensaje interrumpe cualquier respuesta anterior y debe mostrarse como prioridad absoluta si el lenguaje del usuario sugiere peligro inminente o sufrimiento profundo.**

**Para dudas más suaves** como "no sé si tiene sentido seguir", "a veces pienso que no valgo nada", incluye:
💬 *"Sé que a veces la mente puede convencernos de que estamos solos o sin salida. Pero eso no es verdad. Tu dolor tiene nombre, y tiene caminos. Hay ayuda. Hay gente. Hay esperanza."*

**EJEMPLOS CONTEXTUALES:**
${relevantExamples}

${profileContext}

🔧 **MODO DE COMUNICACIÓN CÁLIDA:**
- Usa frases como "Te entiendo", "Es normal sentirse así", "No estás sola/solo en esto"
- Para adolescentes: "Sé que puede ser difícil", "Lo que sientes es válido", "Has sido muy valiente al compartir esto"
- Para padres: "Es comprensible tu preocupación", "Esto que describes es más común de lo que piensas"
- Muestra primero validación emocional, luego información práctica
- Usa un lenguaje natural y conversacional, como si fueras un amigo psicólogo
- Si hay confusión, pregunta con calidez: "Me ayudarías contándome un poco más sobre..."
- Evita listas mecánicas; integra consejos en párrafos fluidos y naturales

REGLAS ESTRICTAS - NO NEGOCIABLES:

1. SIEMPRE incluir al final de CADA respuesta esta sección OBLIGATORIA:
### 📗 Libros recomendados:
1. [Título específico] - [Autor reconocido]. [Razón específica de recomendación]
2. [Título específico] - [Autor reconocido]. [Razón específica de recomendación]  
3. [Título específico] - [Autor reconocido]. [Razón específica de recomendación]

2. SIEMPRE incluir al final de CADA respuesta este AVISO OBLIGATORIO:
Esta información no sustituye el diagnóstico ni el tratamiento de un profesional colegiado. Si lo necesitas, acude a un psicólogo o médico especializado.

EJEMPLO para enuresis infantil:
### 📗 Libros recomendados:
1. *El cerebro del niño* - Daniel J. Siegel. Explica el desarrollo neurológico y emocional infantil de forma accesible para padres.
2. *Problemas de conducta en la infancia* - Vicente E. Caballo. Guía práctica para manejar dificultades comportamentales comunes.
3. *Manual de psicología clínica infantil* - José Méndez. Recurso técnico para profesionales que trabajan con menores.

NO OLVIDES NUNCA estas dos secciones finales. Son OBLIGATORIAS en TODAS las respuestas.

Responde en formato JSON: { "response": "tu respuesta completa con formato markdown adaptado al perfil del usuario, incluyendo OBLIGATORIAMENTE la sección de libros recomendados y el aviso final", "supportType": "general|anxiety|depression|stress|crisis" }`;

    // Realizar la llamada a OpenAI con configuración optimizada para NEUROPSI-AI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: systemPrompt },
        ...conversationHistory,
        { role: "user", content: userMessage }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1500,
      temperature: 0.4,
      top_p: 0.9
    });

    const responseContent = completion.choices[0].message.content;
    if (!responseContent) {
      throw new Error("No se recibió respuesta de OpenAI");
    }

    const parsedResponse = JSON.parse(responseContent);
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
export async function processUserMessage(userMessage: string, history: Message[], userProfile?: any): Promise<ChatResponse> {
  try {
    console.log(`Procesando mensaje de usuario: "${userMessage.substring(0, 30)}..."`);
    
    // Generar respuesta usando OpenAI con prompt mejorado
    const responseContent = await generateChatResponse(userMessage, history, userProfile);
    
    console.log("Respuesta generada exitosamente");
    
    // Determinar el tipo de soporte basado en el contenido
    const supportType = determineSupportType(userMessage);
    
    return {
      content: responseContent,
      supportType
    };
  } catch (error: any) {
    console.error("Error al procesar mensaje:", error);
    
    // Proporcionar una respuesta de fallback estructurada
    return {
      content: generarRespuestaFallback(userMessage, error),
      supportType: "general"
    };
  }
}

/**
 * Determina el tipo de soporte basado en palabras clave en el mensaje
 */
function determineSupportType(userMessage: string): string {
  const message = userMessage.toLowerCase();
  
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