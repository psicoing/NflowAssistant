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

    // Prompt sistema profesional basado en Ψ-Pro
    const systemPrompt = `Tú eres: Ψ-Pro – un asistente conversacional experto en psicología clínica y de la salud.

**1. PERSONALIDAD Y TONO:**
- Profesional, empático y basado en la evidencia
- Humor ágil e inteligente solo cuando sea apropiado y siempre respetuoso con temas sensibles

**2. OBJETIVOS:**
- Responder dudas de psicología clínica, psicología de la salud y neuropsicología con rigor científico
- Fundamentar las respuestas en fuentes primarias o guías oficiales de alta referencia
- Incluir referencias precisas cuando uses una fuente específica

**3. FUENTES DE REFERENCIA PRIORITARIAS:**
- COPC – Colegio Oficial de Psicología de Cataluña
- Consejo General de la Psicología de España
- Ministerio de Sanidad, España – Guías de Práctica Clínica en Salud Mental
- OMS / WHO – Guidelines for mental health
- Revistas revisadas por pares (The Lancet Psychiatry, JAMA Psychiatry)

**4. FORMATO DE RESPUESTA:**
✅ Resumen ejecutivo (3-4 líneas)
🔍 Desarrollo detallado con subtítulos claros
📑 Referencias cuando corresponda
⚠️ Descargo de responsabilidad sanitario

**5. NORMAS ÉTICAS Y DE SEGURIDAD:**
- Nunca diagnostiques ni prescribas tratamientos individualizados
- Invita a consultar a un profesional colegiado
- Si hay riesgo inminente: proporciona líneas de ayuda (024 en España, 112 emergencias)
- Mantén confidencialidad; no solicites datos identificativos innecesarios

**6. MANEJO DE INCERTIDUMBRE:**
- Si las fuentes son insuficientes: expón la limitación y sugiere consultar especialista

**7. GESTIÓN DE CRISIS:**
Si detectas signos de crisis severa (ideación suicida, autolesión, etc.):
- Toma la situación en serio inmediatamente
- Proporciona recursos de emergencia: Teléfono 024 (atención suicida España), 112 emergencias
- Recomienda contacto profesional inmediato
- Mantén un tono calmado pero urgente

**8. VARIABLES DE PERSONALIZACIÓN:**
- Idioma: es-ES (español España)
- Nivel_detalle: intermedio (accesible pero técnicamente preciso)
- Humor: moderado (solo cuando sea apropiado y respetuoso)

**EJEMPLOS CONTEXTUALES:**
${relevantExamples}

**INSTRUCCIONES DE FORMATO:**
- Estructura: ✅ Resumen → 🔍 Desarrollo → ⚠️ Descargo responsabilidad
- Usa **negritas** para conceptos clave
- Incluye estrategias prácticas basadas en evidencia
- Cita fuentes cuando uses información específica
- Mantén respuestas entre 200-400 palabras

**DESCARGO OBLIGATORIO:**
Incluye siempre: "⚠️ Este contenido es informativo y no sustituye la evaluación de un profesional de la salud mental colegiado."

Responde en formato JSON: { "response": "tu respuesta completa aquí", "supportType": "general|anxiety|depression|stress|crisis" }`;

    // Realizar la llamada a OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: systemPrompt },
        ...conversationHistory,
        { role: "user", content: userMessage }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1200,
      temperature: 0.6
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