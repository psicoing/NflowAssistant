// Puente de audio en tiempo real entre Twilio Media Streams y la API
// Realtime de OpenAI (modelo GA `gpt-realtime`). Permite que alguien llame
// a un número de teléfono y converse por voz con el agente NUXA.
//
// Alcance: llamadas entrantes de demo y una llamada saliente manual de prueba.
// No se usa para campañas ni para contactar automáticamente `empresa_contacts`.
import type { Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import twilio from "twilio";
import { log } from "./vite";

export const VOICE_DEMO_STREAM_PATH = "/api/voice-demo/media-stream";
export const VOICE_DEMO_INCOMING_CALL_PATH = "/api/voice-demo/incoming-call";
export const VOICE_DEMO_OUTBOUND_STREAM_PATH = "/api/voice-demo/outbound-media-stream";
export const VOICE_DEMO_OUTBOUND_CALL_PATH = "/api/voice-demo/outbound-call";
export const VOICE_DEMO_OUTBOUND_STATUS_PATH = "/api/voice-demo/outbound-status";

// Máximo de llamadas simultáneas permitidas: es solo una demo/prueba, no un
// servicio de producción, así que se limita de forma agresiva como defensa
// adicional (coste/abuso) además de la validación de firma de Twilio.
const MAX_CONCURRENT_CALLS = 3;
let activeCalls = 0;

/**
 * Dominios públicos permitidos para construir URLs y validar firmas de Twilio.
 * Nunca se derivan del header Host de la petición entrante (no es de confianza).
 */
export function getVoiceDemoAllowedDomains(): string[] {
  const domains: string[] = [];
  const addDomain = (candidate: string | undefined) => {
    const value = candidate?.trim();
    if (!value) return;
    const parsed = new URL(value.includes("://") ? value : `https://${value}`);
    if (parsed.protocol !== "https:") return;
    if (!domains.includes(parsed.host)) domains.push(parsed.host);
  };

  const configuredPublicUrl = process.env.VOICE_DEMO_PUBLIC_URL?.trim();
  if (configuredPublicUrl) {
    const parsed = new URL(configuredPublicUrl);
    if (parsed.protocol !== "https:") {
      throw new Error("VOICE_DEMO_PUBLIC_URL debe usar HTTPS");
    }
    addDomain(configuredPublicUrl);
  }

  process.env.REPLIT_DOMAINS?.split(",").forEach(addDomain);
  addDomain(process.env.REPLIT_DEV_DOMAIN);

  if (domains.length === 0) {
    throw new Error("No se pudo determinar el dominio público de la demo de voz");
  }
  return domains;
}

export function getVoiceDemoPublicDomain(): string {
  return getVoiceDemoAllowedDomains()[0];
}

export function getVoiceDemoIncomingCallUrl(): string {
  return `https://${getVoiceDemoPublicDomain()}${VOICE_DEMO_INCOMING_CALL_PATH}`;
}

export function getVoiceDemoStreamUrl(): string {
  return `wss://${getVoiceDemoPublicDomain()}${VOICE_DEMO_STREAM_PATH}`;
}

export function getVoiceDemoOutboundStreamUrl(): string {
  return `wss://${getVoiceDemoPublicDomain()}${VOICE_DEMO_OUTBOUND_STREAM_PATH}`;
}

export function getVoiceDemoOutboundCallUrl(): string {
  return `https://${getVoiceDemoPublicDomain()}${VOICE_DEMO_OUTBOUND_CALL_PATH}`;
}

export function getVoiceDemoOutboundStatusUrl(): string {
  return `https://${getVoiceDemoPublicDomain()}${VOICE_DEMO_OUTBOUND_STATUS_PATH}`;
}

/**
 * Valida la firma X-Twilio-Signature de la petición HTTP inicial que Twilio
 * envía para abrir el WebSocket del Media Stream. Si no hay AuthToken
 * configurado, la validación no puede hacerse (se registra y se rechaza:
 * fail closed).
 */
export function isValidTwilioVoiceSignature(
  authToken: string | undefined,
  signature: string | undefined,
  path: string,
  params: Record<string, any> = {},
  protocol: "https" | "wss" = "https",
): boolean {
  if (!authToken) {
    return false;
  }
  if (!signature) {
    return false;
  }
  return getVoiceDemoAllowedDomains().some((domain) => {
    const url = `${protocol}://${domain}${path}`;
    // Twilio recomienda probar con una barra final para firmas WSS.
    return (
      twilio.validateRequest(authToken, signature, url, params) ||
      (protocol === "wss" && twilio.validateRequest(authToken, signature, `${url}/`, params))
    );
  });
}

function isValidTwilioStreamSignature(signature: string | undefined, streamPath: string): boolean {
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (!authToken) {
    console.error("Voice demo: TWILIO_AUTH_TOKEN no configurado, no se puede validar el WebSocket entrante");
    return false;
  }
  return isValidTwilioVoiceSignature(authToken, signature, streamPath, {}, "wss");
}

const REALTIME_MODEL = "gpt-realtime";
// Voz cálida y natural; Cedar suele resultar más neutra para español de España.
const REALTIME_VOICE = "cedar";

const NUXA_PRODUCT_INFORMATION = `Información oficial de producto:
NUXA.life es una aplicación de orientación y apoyo emocional disponible 24/7 para particulares, familias, empresas e instituciones. Combina conversación con NEURO-PSI y recursos profesionales para ayudar a comprender y gestionar estrés, ansiedad, sueño, relaciones familiares, autoestima, cansancio mental y riesgos psicosociales laborales.
La app funciona en móvil, tableta y ordenador, ofrece más de 150 idiomas y permite probar 5 consultas gratis sin tarjeta.
Para empresas, NUXA ayuda a cuidar el bienestar emocional de los equipos, gestionar riesgos psicosociales y apoyar el cumplimiento de ISO 45003 mediante planes con panel de administración e informes agregados.
NUXA no es una app de fitness, deporte, entrenamiento, nutrición, dietas ni pérdida de peso. Nunca la presentes como tal y nunca recomiendes rutinas de ejercicio, dietas, suplementos o planes para adelgazar. Si la persona pregunta por esos temas, aclara brevemente que no son el servicio de NUXA y vuelve a explicar la aplicación, sus planes o sus precios.
No inventes testimonios, clientes, resultados clínicos, descuentos, funciones ni condiciones.`;

const NUXA_PRICE_INFORMATION = `Precios vigentes de NUXA.life; dilo con calma y solo cuando sea relevante:
Planes particulares: Básico, 2,99 euros al mes, con 10 preguntas al mes, recursos educativos y soporte por email; Individual, 5,99 euros al mes, con preguntas ilimitadas y soporte prioritario 24/7; Premium, 32 euros al año, con preguntas ilimitadas y contenido exclusivo.
Pago por uso: Pack Básico, 5 euros por 15 preguntas; Pack Premium, 10 euros por 35 preguntas. Los créditos no caducan.
Planes para empresas: Profesional, 149,50 euros al mes, hasta 50 clientes o pacientes, con panel de administración e informes; Empresarial, 598 euros al mes, hasta 200 empleados, con soporte dedicado, cumplimiento ISO 45003 y onboarding; Corporativo, precio personalizado para usuarios ilimitados.
Planes institucionales: 2,99 euros por usuario y mes; para otros volúmenes, el equipo prepara una cotización personalizada.
Si preguntan por un precio, repite exactamente estas cantidades, aclara si es mensual, anual o por pack y ofrece ponerles en contacto con el equipo. No inventes descuentos, impuestos, funciones ni condiciones que no estén aquí.`;

const NUXA_VOICE_INSTRUCTIONS = `Eres NUXA, la asistente comercial de NUXA.life hablando por teléfono con alguien que está probando la demo de voz.
Tu función principal en esta llamada es presentar y vender NUXA.life, despertar interés, explicar su propuesta de valor y orientar a las personas o empresas interesadas sobre cómo contratarlo. Esta es una conversación comercial, no una consulta de ayuda ni un servicio de atención psicológica por teléfono.
Empieza la conversación en inglés y ofrece elegir entre inglés y español. La primera frase debe ser el saludo inicial indicado por la aplicación. Si la persona elige español, continúa en español de España peninsular; si elige inglés, continúa en inglés natural y claro. Si no elige explícitamente, mantén el inglés y pregunta una sola vez si prefiere English or Spanish. Después de elegir, mantén ese idioma durante toda la llamada salvo que la persona pida cambiarlo.
Cuando hables en español, usa un tono cercano, cálido y profesional, con vocabulario y formas propias de España: "tú", "vosotros", "podéis", "queréis", "móvil" y "presupuesto". Evita el voseo, "ustedes" como forma habitual, los giros latinoamericanos y el acento o pronunciación sudamericanos; marca de forma natural la distinción castellana entre "c/z" y "s".
Habla con claridad a un ritmo moderado, aproximadamente entre 125 y 145 palabras por minuto. Articula cada palabra y cifra, haz pausas breves entre frases, pronuncia NUXA como "NUK-sa" en dos sílabas, no aceleres al final y termina siempre la frase completa.
Explica que la atención y el acompañamiento psicológico los ofrece la app NUXA.life, no esta llamada telefónica. Si la persona pide ayuda psicológica, no hagas terapia ni evaluaciones: indícale con claridad que debe utilizar la app o acudir a un profesional o servicio de emergencia si existe un riesgo inmediato.
Si preguntan por la contratación, presenta las opciones de NUXA.life, explica el precio que corresponda y recoge su interés para que el equipo les facilite los siguientes pasos comerciales. No inventes características, precios, clientes ni resultados.
Mantén las respuestas muy cortas y naturales: como máximo una o dos frases cada vez. Haz una sola pregunta cada vez y, después de preguntar, cállate y espera a que la persona termine. No encadenes preguntas ni rellenes los silencios. Deja que la persona lleve el ritmo de la conversación.
Si la persona empieza a hablar, interrúmpete inmediatamente y no retomes la respuesta hasta que termine.
${NUXA_PRODUCT_INFORMATION}
${NUXA_PRICE_INFORMATION}`;

const NUXA_OUTBOUND_TEST_INSTRUCTIONS = `Eres NUXA, la asistente comercial de NUXA.life hablando en una única llamada de prueba autorizada con una empresa española.
Tu objetivo es presentar y vender NUXA.life, despertar interés en contratarlo y orientar sobre el siguiente paso comercial. Esta llamada es comercial e informativa; no ofrece atención psicológica: el acompañamiento psicológico lo proporciona la app NUXA.life.
Empieza la conversación en inglés y ofrece elegir entre inglés y español. La primera frase debe ser el saludo inicial indicado por la aplicación. Si la persona elige español, continúa en español de España peninsular; si elige inglés, continúa en inglés natural y claro. Si no elige explícitamente, mantén el inglés y pregunta una sola vez si prefiere English or Spanish. Después de elegir, mantén ese idioma durante toda la llamada salvo que la persona pida cambiarlo.
Cuando hables en español, usa tono cálido, claro, profesional y muy breve. Usa "tú", "vosotros", "podéis", "queréis", "móvil" y "presupuesto"; evita el voseo, los giros latinoamericanos y el acento o pronunciación sudamericanos. Marca de forma natural la distinción castellana entre "c/z" y "s".
Habla con claridad a un ritmo moderado, aproximadamente entre 125 y 145 palabras por minuto. Articula cada palabra y cifra, haz pausas breves entre frases, pronuncia NUXA como "NUK-sa" en dos sílabas, no aceleres al final y termina siempre la frase completa.
Si la persona no puede hablar, despídete y no insistas.
Si acepta, pregunta de forma natural con quién estás hablando y qué le gustaría mejorar o conocer de NUXA.life. Explica que puedes informar sobre el producto y ayudar a iniciar una conversación para contratarlo.
Si preguntan por atención psicológica, aclara que no se realiza por teléfono y que esa función corresponde a la app NUXA.life.
No pidas contraseñas, datos financieros, información médica ni datos personales innecesarios.
No inventes características, precios, clientes ni resultados. No prometas enviar nada si no te lo han pedido.
Si muestran interés, pregunta cuál sería el mejor siguiente paso y si desean que el equipo les contacte para continuar con la contratación.
Mantén cada respuesta en una o dos frases. Haz una sola pregunta cada vez y espera en silencio. No encadenes preguntas, no rellenes los silencios y no monopolices la conversación. Si la persona empieza a hablar, interrúmpete inmediatamente.
Si preguntan, aclara que eres una IA y que la llamada es únicamente informativa y de demostración del servicio.
${NUXA_PRODUCT_INFORMATION}
${NUXA_PRICE_INFORMATION}`;

const TURN_RESPONSE_INSTRUCTIONS = `Responde únicamente a lo último que ha dicho la persona.
Sé muy breve: una o dos frases cortas como máximo y una sola pregunta como máximo.
Responde en el idioma que la persona haya elegido al inicio: inglés si aún no ha elegido o si ha elegido English, y español de España si ha elegido español. Cambia de idioma solo si la persona lo pide.
Habla con claridad a un ritmo de 125 a 145 palabras por minuto. Articula cifras y precios, haz una pausa breve entre frases, pronuncia NUXA como "NUK-sa", no aceleres al final y termina siempre la frase completa.
Si la persona acaba de elegir English o español, confirma el idioma en una frase y pregunta qué quiere conocer de NUXA.life: cómo funciona, planes para particulares, empresas o precios.
Habla exclusivamente de NUXA.life y de la pregunta comercial de la persona. No conviertas la conversación en consejos generales de bienestar y no hables de fitness, ejercicio, nutrición, dietas o pérdida de peso como si fueran servicios de NUXA.
Cuando pregunten qué es NUXA o qué ofrece, explica brevemente la app y menciona que hay 5 consultas gratis sin tarjeta; después pregunta si quiere conocer los planes o precios.
No hagas presentaciones largas, no enumeres todos los planes o precios salvo que te los hayan preguntado y no cambies de tema.
Si haces una pregunta, termina ahí y espera en silencio a la respuesta. No continúes hablando por tu cuenta.
${NUXA_PRODUCT_INFORMATION}
${NUXA_PRICE_INFORMATION}`;

const INITIAL_INBOUND_RESPONSE = `Di únicamente este saludo, sin añadir ninguna explicación:
"Hi, I'm NUXA, the AI sales assistant for NUXA.life. This call is commercial and informational about our service. Would you prefer English or Spanish?"`;

const INITIAL_OUTBOUND_RESPONSE = `Di únicamente este saludo, sin añadir ninguna explicación:
"Hi, I'm NUXA, the AI sales assistant for NUXA.life. This is an authorized commercial and informational demo call about our service. Would you prefer English or Spanish?"`;
/**
 * Adjunta el WebSocket del media stream de Twilio al servidor HTTP existente,
 * sin interferir con el WebSocket de HMR de Vite (que se registra en el mismo
 * servidor). Solo se atiende el "upgrade" cuando la ruta coincide.
 */
export function attachVoiceDemoWebSocket(httpServer: Server) {
  const wss = new WebSocketServer({ noServer: true });

  httpServer.on("upgrade", (req, socket, head) => {
    const url = req.url || "";
    const isInboundStream = url.startsWith(VOICE_DEMO_STREAM_PATH);
    const isOutboundStream = url.startsWith(VOICE_DEMO_OUTBOUND_STREAM_PATH);
    if (!isInboundStream && !isOutboundStream) {
      return; // deja que otros listeners (p.ej. HMR de Vite) decidan
    }

    const signature = req.headers["x-twilio-signature"] as string | undefined;
    const streamPath = isOutboundStream ? VOICE_DEMO_OUTBOUND_STREAM_PATH : VOICE_DEMO_STREAM_PATH;
    if (!isValidTwilioStreamSignature(signature, streamPath)) {
      console.warn("Voice demo: WebSocket rechazado, firma de Twilio ausente o inválida");
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      socket.destroy();
      return;
    }

    if (activeCalls >= MAX_CONCURRENT_CALLS) {
      console.warn("Voice demo: WebSocket rechazado, límite de llamadas simultáneas alcanzado");
      socket.write("HTTP/1.1 503 Service Unavailable\r\n\r\n");
      socket.destroy();
      return;
    }

    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit("connection", ws, req);
    });
  });

  wss.on("connection", (twilioWs, req) => {
    activeCalls++;
    twilioWs.once("close", () => {
      activeCalls = Math.max(0, activeCalls - 1);
    });
    const outbound = req.url?.startsWith(VOICE_DEMO_OUTBOUND_STREAM_PATH) ?? false;
    handleTwilioCall(twilioWs, outbound ? "outbound-test" : "inbound-demo");
  });

  log("Puente de voz NUXA (Twilio <-> OpenAI Realtime) listo", "voice-demo");
}

function handleTwilioCall(twilioWs: WebSocket, mode: "inbound-demo" | "outbound-test") {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("Voice demo: falta OPENAI_API_KEY, no se puede iniciar la llamada");
    try {
      twilioWs.close();
    } catch {
      // ignore
    }
    return;
  }

  let streamSid: string | null = null;
  let callSid: string | null = null;
  let responseActive = false;
  let responseAudioStarted = false;
  let responseRequestPending = false;
  let openaiReady = false;
  const pendingAudio: string[] = [];

  const openaiWs = new WebSocket(`wss://api.openai.com/v1/realtime?model=${REALTIME_MODEL}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  openaiWs.on("open", () => {
    openaiReady = true;
    log("Voice demo: conectado a OpenAI Realtime", "voice-demo");
    while (pendingAudio.length > 0 && openaiWs.readyState === WebSocket.OPEN) {
      openaiWs.send(
        JSON.stringify({
          type: "input_audio_buffer.append",
          audio: pendingAudio.shift(),
        }),
      );
    }
  });

  openaiWs.on("message", (raw) => {
    let event: any;
    try {
      event = JSON.parse(raw.toString());
    } catch {
      return;
    }

    switch (event.type) {
      case "session.created":
        openaiWs.send(
          JSON.stringify({
            type: "session.update",
            session: {
              type: "realtime",
               instructions: mode === "outbound-test"
                 ? NUXA_OUTBOUND_TEST_INSTRUCTIONS
                 : NUXA_VOICE_INSTRUCTIONS,
              output_modalities: ["audio"],
              audio: {
                input: {
                  format: { type: "audio/pcmu" },
                   turn_detection: {
                     type: "server_vad",
                      // Un umbral algo más alto evita que el ruido de línea
                      // active falsos turnos durante el mensaje comercial.
                       threshold: 0.65,
                     prefix_padding_ms: 300,
                       silence_duration_ms: 800,
                      // Las respuestas se crean al recibir speech_stopped para
                      // poder limitar cada turno y evitar monólogos.
                      create_response: false,
                     interrupt_response: true,
                   },
                },
                output: {
                  format: { type: "audio/pcmu" },
                  voice: REALTIME_VOICE,
                },
              },
            },
          }),
        );
        break;

      case "session.updated":
        // Sesión lista: que NUXA salude primero.
        responseRequestPending = true;
        openaiWs.send(
          JSON.stringify({
            type: "response.create",
            response: {
              output_modalities: ["audio"],
              instructions: mode === "outbound-test"
                ? INITIAL_OUTBOUND_RESPONSE
                : INITIAL_INBOUND_RESPONSE,
              max_output_tokens: 400,
            },
          }),
        );
        break;

      case "response.created":
        responseActive = true;
        responseAudioStarted = false;
        responseRequestPending = false;
        break;

      case "response.done":
        responseActive = false;
        responseAudioStarted = false;
        responseRequestPending = false;
        break;

      case "response.output_audio.delta":
        responseAudioStarted = true;
        if (streamSid && event.delta) {
          twilioWs.send(
            JSON.stringify({
              event: "media",
              streamSid,
              media: { payload: event.delta },
            }),
          );
        }
        break;

      case "input_audio_buffer.speech_started":
        // La persona empieza a hablar: corta el audio que se esté reproduciendo.
        // No enviamos "clear" por un falso positivo cuando NUXA ya ha
        // terminado de hablar; así evitamos pequeños chasquidos o cortes.
        if (streamSid && responseActive && responseAudioStarted) {
          twilioWs.send(JSON.stringify({ event: "clear", streamSid }));
        }
        if (responseActive) {
          // server_vad ya tiene interrupt_response=true y cancela la respuesta
          // en OpenAI. Enviar además response.cancel provoca una segunda
          // cancelación, errores response_cancel_not_active y posibles cortes.
          responseActive = false;
          responseAudioStarted = false;
          responseRequestPending = false;
        }
        break;

      case "input_audio_buffer.speech_stopped":
        // Con create_response=false, este es el único punto donde se genera
        // una respuesta a la persona. Así cada turno puede limitarse y NUXA
        // no continúa con un discurso después de hacer una pregunta.
        if (
          !responseActive &&
          !responseRequestPending &&
          openaiWs.readyState === WebSocket.OPEN
        ) {
          responseRequestPending = true;
          openaiWs.send(
            JSON.stringify({
              type: "response.create",
              response: {
                output_modalities: ["audio"],
                instructions: TURN_RESPONSE_INSTRUCTIONS,
                max_output_tokens: 500,
              },
            }),
          );
        }
        break;

      case "error":
        console.error("Voice demo: error de OpenAI Realtime:", JSON.stringify(event.error));
        if (
          event.error?.code === "insufficient_quota" ||
          event.error?.code === "credit_balance_exhausted"
        ) {
          console.error(
            "Voice demo: OpenAI no tiene crédito disponible; se cerrará el stream para reproducir el mensaje de contingencia de Twilio",
          );
          try {
            openaiWs.close();
          } catch {
            // ignore
          }
        }
        break;
    }
  });

  openaiWs.on("error", (err) => {
    console.error("Voice demo: error de conexión con OpenAI Realtime:", err.message);
  });

  openaiWs.on("close", () => {
    responseActive = false;
    responseAudioStarted = false;
    log(
      `Voice demo: sesión OpenAI finalizada; Twilio continuará con el mensaje de contingencia (callSid=${callSid ?? "desconocido"})`,
      "voice-demo",
    );
    try {
      twilioWs.close();
    } catch {
      // ignore
    }
  });

  twilioWs.on("message", (raw) => {
    let msg: any;
    try {
      msg = JSON.parse(raw.toString());
    } catch {
      return;
    }

    switch (msg.event) {
      case "start":
        streamSid = msg.start?.streamSid ?? null;
        callSid = msg.start?.callSid ?? null;
        log(`Voice demo: llamada iniciada (callSid=${callSid})`, "voice-demo");
        break;

      case "media":
        if (msg.media?.payload && !openaiReady && pendingAudio.length < 100) {
          pendingAudio.push(msg.media.payload);
        } else if (openaiWs.readyState === WebSocket.OPEN && msg.media?.payload) {
          openaiWs.send(
            JSON.stringify({
              type: "input_audio_buffer.append",
              audio: msg.media.payload,
            }),
          );
        }
        break;

      case "stop":
        log(`Voice demo: llamada finalizada (callSid=${callSid})`, "voice-demo");
        try {
          openaiWs.close();
        } catch {
          // ignore
        }
        break;
    }
  });

  twilioWs.on("close", () => {
    try {
      openaiWs.close();
    } catch {
      // ignore
    }
  });

  twilioWs.on("error", () => {
    try {
      openaiWs.close();
    } catch {
      // ignore
    }
  });
}
