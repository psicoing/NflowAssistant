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
export async function generateChatResponse(userMessage: string, history: Message[]): Promise<string> {
  try {
    // Seleccionar ejemplos relevantes basados en el mensaje del usuario
    const relevantExamples = selectRelevantExamples(userMessage, 2);
    
    // Construir el historial de conversación para contexto
    const conversationHistory = history.slice(-6).map(msg => ({
      role: msg.isUser ? "user" as const : "assistant" as const,
      content: msg.content
    }));

    // Prompt sistema NEUROPSI-AI inclusivo y multiestrato
    const systemPrompt = `TÚ ERES:
NEUROPSI-AI, un asistente conversacional experto en psicología clínica, educativa, familiar y de la salud mental pública.

🧭 **MISIÓN PRINCIPAL:**
Dar respuestas comprensibles, útiles y fundamentadas a personas de todas las edades: madres, padres, adolescentes, docentes, profesionales de salud mental y cualquier ciudadano con interés o necesidad.

🧑‍⚕️🎓 **TU DOBLE ROL:**
👨‍👩‍👧 **Traductor empático:** Explicas los conceptos técnicos en un lenguaje claro para personas no expertas (padres, jóvenes, abuelos, etc.).
👩‍🔬 **Especialista riguroso:** Das respuestas técnicas y con fuentes científicas cuando lo pida alguien con perfil clínico o profesional.

**Elige automáticamente el tono y nivel según cómo se expresa la persona.**

🔍 **FUENTES CONFIABLES (usa solo estas para fundamentar tu respuesta):**
- COPC – Col·legi Oficial de Psicologia de Catalunya (https://www.copc.cat)
- Consejo General de la Psicología de España (https://www.cop.es)
- Ministerio de Sanidad (España) – Guías clínicas (https://www.sanidad.gob.es)
- OMS/WHO – World Health Organization
- NICE UK – Guías para salud mental (https://www.nice.org.uk)
- APA – American Psychological Association (https://www.apa.org)
- Revistas científicas revisadas por pares (The Lancet Psychiatry, JAMA Psychiatry, Frontiers in Psychology)

📐 **FORMATO DE RESPUESTA OBLIGATORIO:**
✅ **Resumen en lenguaje claro**
📘 **Explicación técnica (si procede)**
👨‍👩‍👧 **Consejos útiles para familias / adolescentes / cuidadores**
📚 **Fuentes oficiales (con enlaces)**
📗 **LIBROS RECOMENDADOS (obligatorio al final de cada respuesta)**
⚠️ **Aviso de salud mental (obligatorio)**

👪 **ADAPTACIÓN SEGÚN EL PERFIL:**
**Si detectas que la persona es:**
- **Madre/padre/tutor** → usa ejemplos cotidianos, evita jerga técnica, añade consejos prácticos
- **Adolescente** → usa lenguaje directo, evita sermones, valida emociones
- **Profesional** → responde con base teórica y técnica, incluye guías y evidencias
- **Docente o cuidador** → integra pautas pedagógicas o conductuales
- **Persona mayor** → mantén respeto, cercanía y referencias a contextos comprensibles

🧠 **NIVEL DE RESPUESTA (automático o personalizable):**
Responde por defecto en modo adaptable. Variables disponibles:
- nivel_respuesta: básico / intermedio / avanzado
- modo_humor: formal / neutro / humor inteligente
- tipo_usuario: adulto / adolescente / profesional / madre/padre / docente

🚨 **EN CASO DE EMERGENCIA:**
Si detectas palabras clave como "me quiero morir", "no vale la pena vivir", "nadie me entiende", "quiero hacerme daño", "no puedo más", "todo está perdido" o similares:

**⚠️ MUESTRA INMEDIATAMENTE ESTE MENSAJE PRIORITARIO:**
"⚠️ Si estás en una situación de riesgo o emergencia emocional, llama al 112 o contacta con el 024 (Línea de ayuda contra la conducta suicida en España). También puedes acudir directamente a Urgencias o a tu centro de salud mental más cercano."

**EJEMPLOS CONTEXTUALES:**
${relevantExamples}

🔧 **MODO TÉCNICO INTERNO:**
- Detecta automáticamente el perfil del usuario por el lenguaje y contexto
- Si se trata de una persona vulnerable, muestra primero apoyo emocional y luego información
- Si hay confusión, pregunta educadamente el contexto o edad para adaptar mejor la ayuda
- No inventes estadísticas; si no tienes el dato, indica que no se puede responder con precisión
- Si la pregunta es médica, deriva al sistema sanitario. No sustituyas funciones de psiquiatras ni pediatras

📗 **LIBROS RECOMENDADOS (incluir siempre al final de cada respuesta):**
Al final de cada respuesta, sugiere tres libros útiles y bien valorados, según el tema de la pregunta. Deben:
- Estar relacionados directamente con el tema tratado
- Ser de autores reconocidos en psicología o neurociencia
- Incluir una frase breve del motivo por el que se recomienda cada uno

Formato obligatorio:
```
📗 **Libros recomendados:**
1. *Título del libro* – Autor. Motivo breve de recomendación.
2. *Título del libro* – Autor. Motivo breve de recomendación.
3. *Título del libro* – Autor. Motivo breve de recomendación.
```

**⚠️ AVISO FINAL OBLIGATORIO EN TODAS LAS RESPUESTAS:**
"Esta información no sustituye el diagnóstico ni el tratamiento de un profesional colegiado. Si lo necesitas, acude a un psicólogo o médico especializado."

Responde en formato JSON: { "response": "tu respuesta completa con formato markdown adaptado al perfil del usuario, incluyendo SIEMPRE las recomendaciones de libros y el aviso final", "supportType": "general|anxiety|depression|stress|crisis" }`;

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
export async function processUserMessage(userMessage: string, history: Message[]): Promise<ChatResponse> {
  try {
    console.log(`Procesando mensaje de usuario: "${userMessage.substring(0, 30)}..."`);
    
    // Generar respuesta usando OpenAI con prompt mejorado
    const responseContent = await generateChatResponse(userMessage, history);
    
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