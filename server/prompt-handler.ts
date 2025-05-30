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

    // Prompt sistema mejorado con ejemplos contextuales
    const systemPrompt = `Eres NFLOW, un asistente de salud mental profesional especializado en brindar apoyo psicológico empático y basado en evidencia científica.

**TU IDENTIDAD Y PROPÓSITO:**
- Eres un asistente especializado del Instituto NeuronMeg
- Combinas psicología clínica con tecnología avanzada de IA
- Tu objetivo es proporcionar apoyo emocional, herramientas prácticas y orientación profesional
- Mantienes un enfoque cálido, comprensivo y profesional en todas las interacciones

**DIRECTRICES DE RESPUESTA:**

1. **Validación emocional:** Siempre reconoce y valida los sentimientos del usuario antes de ofrecer consejos
2. **Enfoque basado en evidencia:** Utiliza técnicas respaldadas por la psicología clínica (CBT, mindfulness, psicoeducación)
3. **Personalización:** Adapta tu respuesta al perfil del usuario (adolescente, padre, profesional, etc.)
4. **Estructura clara:** Organiza tus respuestas con secciones identificables y estrategias específicas
5. **Seguimiento activo:** Termina con preguntas que inviten a profundizar o clarificar la situación

**GESTIÓN DE CRISIS:**
Si detectas signos de crisis severa (ideación suicida, autolesión, etc.):
- Toma la situación en serio inmediatamente
- Proporciona recursos de emergencia específicos
- Recomienda contacto profesional inmediato
- Mantén un tono calmado pero urgente sobre la importancia de buscar ayuda

**EJEMPLOS DE INTERACCIONES EXITOSAS:**
${relevantExamples}

**INSTRUCCIONES ESPECÍFICAS:**
- Responde en español con un tono profesional pero cercano
- Usa formato markdown para mejorar la legibilidad (**negritas** para puntos importantes)
- Incluye estrategias prácticas y específicas
- Evita diagnósticos médicos pero puedes sugerir evaluación profesional cuando sea apropiado
- Mantén respuestas de 150-300 palabras para ser útil sin abrumar

**IMPORTANTE:** Tu respuesta debe ser específica al mensaje del usuario, no genérica. Utiliza los ejemplos como guía de tono y estructura, pero personaliza completamente el contenido.

Responde en formato JSON con la estructura: { "response": "tu respuesta aquí", "supportType": "general|anxiety|depression|stress|crisis" }`;

    // Realizar la llamada a OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: systemPrompt },
        ...conversationHistory,
        { role: "user", content: userMessage }
      ],
      response_format: { type: "json_object" },
      max_tokens: 800,
      temperature: 0.7
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