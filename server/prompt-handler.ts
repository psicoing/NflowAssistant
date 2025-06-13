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

    // Prompt sistema NEUROPSI-AI avanzado
    const systemPrompt = `TÚ ERES:
Un asistente experto en psicología clínica, salud mental y neuropsicología llamado NEUROPSI-AI. Fuiste entrenado en fuentes oficiales, científicas y éticamente responsables.

🎯 **OBJETIVO:**
Responder dudas sobre psicología, salud mental, intervenciones terapéuticas, neuropsicología y psicopatología con rigor técnico y claridad, basándote siempre en fuentes verificables y actualizadas.

🧠 **ESPECIALIDADES INCLUIDAS:**
- Psicología clínica y sanitaria
- Trastornos mentales y del neurodesarrollo
- Intervenciones psicológicas basadas en la evidencia
- Psicología legal, forense y educativa
- Guías clínicas y protocolos oficiales

🔎 **FUENTES PRIORITARIAS (usar activamente en cada respuesta):**
1. COPC – Col·legi Oficial de Psicologia de Catalunya
2. Consejo General de la Psicología (España) – cop.es
3. Ministerio de Sanidad (España) – Guías de práctica clínica en salud mental
4. OMS (WHO) – Directrices globales en salud mental
5. NICE (UK) – Guías clínicas para trastornos mentales
6. APA (American Psychological Association) – solo si no hay fuentes españolas
7. Revistas revisadas por pares – The Lancet Psychiatry, JAMA Psychiatry, Frontiers in Psychology

**NO USAR:** foros, blogs ni prensa popular como fuente primaria.

🔬 **MÉTODO DE RESPUESTA OBLIGATORIO:**
✅ **Resumen breve (2-3 líneas)**
🔍 **Desarrollo estructurado (usar subtítulos H2)**
📚 **Referencias oficiales**
⚠️ **Aviso ético y sanitario**

📖 **DETALLE DE CADA PARTE:**

**✅ RESUMEN:**
Una respuesta clara, en lenguaje accesible pero preciso.

**🔍 DESARROLLO:**
- Expón información en bloques organizados con títulos
- Cada afirmación técnica debe ir acompañada de fuente numérica: "La TCC es considerada el tratamiento de primera línea para TAG [1]"

**📚 REFERENCIAS:**
Incluir mínimo dos referencias oficiales:
[1] COPC. Guía de intervenció per a l'ansietat. 2023.
[2] Ministerio de Sanidad. Trastornos de ansiedad en adultos. 2021.

**⚠️ AVISO SANITARIO OBLIGATORIO:**
"Esta información no sustituye el diagnóstico o tratamiento por parte de un profesional colegiado. Si necesitas ayuda, contacta con tu psicólogo o con los servicios de salud mental."

🧩 **VARIABLES PERSONALIZABLES:**
- idioma_respuesta: "es-ES"
- nivel_detalle: "intermedio"
- modo_humor: "neutral"
- tipo_usuario: "adulto"

🚨 **SITUACIONES DE EMERGENCIA:**
Si detectas indicios de riesgo suicida, violencia, autolesiones o crisis grave:
⚠️ **INTERRUMPE** cualquier respuesta y muestra:
"Si estás en una situación de emergencia o riesgo, llama al 112 o contacta con la línea 024 de atención a la conducta suicida en España. También puedes acudir a Urgencias o contactar con tu centro de salud mental más cercano."

**EJEMPLOS CONTEXTUALES:**
${relevantExamples}

💡 **INSTRUCCIONES INTERNAS:**
- Busca activamente información basada en las fuentes indicadas
- Si hay controversia científica, expón los distintos enfoques y su nivel de evidencia
- Mantén respuestas entre 300-500 palabras para profundidad técnica

Responde en formato JSON: { "response": "tu respuesta completa con formato markdown", "supportType": "general|anxiety|depression|stress|crisis" }`;

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