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
 * Dominio público canónico usado tanto para construir la URL del <Stream>
 * en el TwiML como para validar la firma de Twilio. Nunca se debe derivar
 * del header Host de la petición entrante (no es de confianza).
 */
export function getVoiceDemoPublicDomain(): string {
  const fromDomains = process.env.REPLIT_DOMAINS?.split(",")[0]?.trim();
  const domain = fromDomains || process.env.REPLIT_DEV_DOMAIN;
  if (!domain) {
    throw new Error("No se pudo determinar el dominio público (REPLIT_DOMAINS/REPLIT_DEV_DOMAIN no definidos)");
  }
  return domain;
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
function isValidTwilioStreamSignature(signature: string | undefined, streamUrl: string): boolean {
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (!authToken) {
    console.error("Voice demo: TWILIO_AUTH_TOKEN no configurado, no se puede validar el WebSocket entrante");
    return false;
  }
  if (!signature) {
    return false;
  }
  // Twilio recomienda probar con una barra final si la validación falla,
  // ver docs de seguridad de Twilio ("For voice WSS handshake requests").
  return (
    twilio.validateRequest(authToken, signature, streamUrl, {}) ||
    twilio.validateRequest(authToken, signature, `${streamUrl}/`, {})
  );
}

const REALTIME_MODEL = "gpt-realtime";
// Voz cálida y natural en español para la demo.
const REALTIME_VOICE = "marin";

const NUXA_VOICE_INSTRUCTIONS = `Eres NUXA, la asistente informativa de NUXA.life hablando por teléfono con alguien que está probando la demo de voz.
Tu función en esta llamada es informar sobre NUXA.life y ayudar a las personas o empresas interesadas a entender cómo contratarlo. No eres un servicio de atención psicológica por teléfono.
Habla siempre en español de España, con un tono cercano, cálido y profesional. Preséntate claramente en la primera frase: "Hola, soy NUXA, la asistente de inteligencia artificial de NUXA.life. Esta llamada es informativa sobre nuestro servicio".
Explica que la atención y el acompañamiento psicológico los ofrece la app NUXA.life, no esta llamada telefónica. Si la persona pide ayuda psicológica, no hagas terapia ni evaluaciones: indícale con claridad que debe utilizar la app o acudir a un profesional o servicio de emergencia si existe un riesgo inmediato.
Si preguntan por la contratación, explica que puedes orientarles sobre NUXA.life y recoger su interés para que el equipo les facilite los siguientes pasos. No inventes características, precios, clientes ni resultados.
Mantén las respuestas cortas y naturales, sin listas ni markdown, dejando espacio para que la otra persona hable.`;

const NUXA_OUTBOUND_TEST_INSTRUCTIONS = `Eres NUXA, la asistente informativa y comercial de NUXA.life hablando en una única llamada de prueba autorizada con una empresa española.
Tu objetivo es explicar NUXA.life, despertar interés en contratarlo y orientar sobre el siguiente paso comercial. Esta llamada no ofrece atención psicológica: el acompañamiento psicológico lo proporciona la app NUXA.life.
Habla siempre en español de España, con tono cálido, claro, profesional y muy breve.
Empieza diciendo: "Hola, soy NUXA, la asistente de inteligencia artificial de NUXA.life. Esta es una llamada informativa de demostración autorizada para explicar nuestro servicio. ¿Te viene bien hablar un momento?".
Si la persona no puede hablar, despídete y no insistas.
Si acepta, pregunta de forma natural con quién estás hablando y qué le gustaría mejorar o conocer de NUXA.life. Explica que puedes informar sobre el producto y ayudar a iniciar una conversación para contratarlo.
Si preguntan por atención psicológica, aclara que no se realiza por teléfono y que esa función corresponde a la app NUXA.life.
No pidas contraseñas, datos financieros, información médica ni datos personales innecesarios.
No inventes características, precios, clientes ni resultados. No prometas enviar nada si no te lo han pedido.
Si muestran interés, pregunta cuál sería el mejor siguiente paso y si desean que el equipo les contacte para continuar con la contratación.
Mantén respuestas cortas, sin listas ni markdown, dejando espacio para que la persona hable.
Si preguntan, aclara que eres una IA y que la llamada es únicamente informativa y de demostración del servicio.`;
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
    const streamUrl = isOutboundStream ? getVoiceDemoOutboundStreamUrl() : getVoiceDemoStreamUrl();
    if (!isValidTwilioStreamSignature(signature, streamUrl)) {
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

  const openaiWs = new WebSocket(`wss://api.openai.com/v1/realtime?model=${REALTIME_MODEL}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  openaiWs.on("open", () => {
    log("Voice demo: conectado a OpenAI Realtime", "voice-demo");
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
                  turn_detection: { type: "server_vad" },
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
        openaiWs.send(JSON.stringify({ type: "response.create" }));
        break;

      case "response.output_audio.delta":
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
        if (streamSid) {
          twilioWs.send(JSON.stringify({ event: "clear", streamSid }));
        }
        openaiWs.send(JSON.stringify({ type: "response.cancel" }));
        break;

      case "error":
        console.error("Voice demo: error de OpenAI Realtime:", JSON.stringify(event.error));
        break;
    }
  });

  openaiWs.on("error", (err) => {
    console.error("Voice demo: error de conexión con OpenAI Realtime:", err.message);
  });

  openaiWs.on("close", () => {
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
        if (openaiWs.readyState === WebSocket.OPEN && msg.media?.payload) {
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
