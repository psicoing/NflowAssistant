// Puente de audio en tiempo real entre Twilio Media Streams y la API
// Realtime de OpenAI (modelo GA `gpt-realtime`). Permite que alguien llame
// a un número de teléfono y converse por voz con el agente NUXA.
//
// Alcance: SOLO llamadas entrantes de demo/prueba. No se usa para llamadas
// salientes ni para contactar `empresa_contacts`/instituciones/mutuas.
import type { Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import twilio from "twilio";
import { log } from "./vite";

export const VOICE_DEMO_STREAM_PATH = "/api/voice-demo/media-stream";
export const VOICE_DEMO_INCOMING_CALL_PATH = "/api/voice-demo/incoming-call";

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

/**
 * Valida la firma X-Twilio-Signature de la petición HTTP inicial que Twilio
 * envía para abrir el WebSocket del Media Stream. Si no hay AuthToken
 * configurado, la validación no puede hacerse (se registra y se rechaza:
 * fail closed).
 */
function isValidTwilioStreamSignature(signature: string | undefined): boolean {
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (!authToken) {
    console.error("Voice demo: TWILIO_AUTH_TOKEN no configurado, no se puede validar el WebSocket entrante");
    return false;
  }
  if (!signature) {
    return false;
  }
  const baseUrl = getVoiceDemoStreamUrl();
  // Twilio recomienda probar con una barra final si la validación falla,
  // ver docs de seguridad de Twilio ("For voice WSS handshake requests").
  return (
    twilio.validateRequest(authToken, signature, baseUrl, {}) ||
    twilio.validateRequest(authToken, signature, `${baseUrl}/`, {})
  );
}

const REALTIME_MODEL = "gpt-realtime";
// Voz cálida y natural en español para la demo.
const REALTIME_VOICE = "marin";

const NUXA_VOICE_INSTRUCTIONS = `Eres NUXA, un asistente de psicología por IA hablando por teléfono con alguien que está probando la demo de voz.
Habla siempre en español de España, con un tono cercano, cálido y profesional, como lo haría un psicólogo empático.
Preséntate brevemente en la primera frase ("Hola, soy NUXA, tu psicólogo IA") y pregunta cómo se encuentra la persona o en qué le gustaría que le ayudaras hoy.
Mantén las respuestas cortas y naturales, como una conversación real por teléfono: frases breves, sin listas ni markdown, dejando espacio para que la otra persona hable.
No sustituyes a un profesional sanitario: si detectas una crisis grave o riesgo para la persona, recomiéndale con calma buscar ayuda profesional o de emergencia inmediata.
Esta llamada es una demostración de producto: si te preguntan, puedes explicar que NUXA también está disponible por chat 24/7 en la web y la app.`;

/**
 * Adjunta el WebSocket del media stream de Twilio al servidor HTTP existente,
 * sin interferir con el WebSocket de HMR de Vite (que se registra en el mismo
 * servidor). Solo se atiende el "upgrade" cuando la ruta coincide.
 */
export function attachVoiceDemoWebSocket(httpServer: Server) {
  const wss = new WebSocketServer({ noServer: true });

  httpServer.on("upgrade", (req, socket, head) => {
    const url = req.url || "";
    if (!url.startsWith(VOICE_DEMO_STREAM_PATH)) {
      return; // deja que otros listeners (p.ej. HMR de Vite) decidan
    }

    const signature = req.headers["x-twilio-signature"] as string | undefined;
    if (!isValidTwilioStreamSignature(signature)) {
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

  wss.on("connection", (twilioWs) => {
    activeCalls++;
    twilioWs.once("close", () => {
      activeCalls = Math.max(0, activeCalls - 1);
    });
    handleTwilioCall(twilioWs);
  });

  log("Puente de voz NUXA (Twilio <-> OpenAI Realtime) listo", "voice-demo");
}

function handleTwilioCall(twilioWs: WebSocket) {
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
              instructions: NUXA_VOICE_INSTRUCTIONS,
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
