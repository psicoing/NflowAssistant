import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, Check, FileText, LoaderCircle, Save, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type LetterData = {
  subject: string;
  body: string;
  updatedAt: string | null;
  ctaLabel: "Conocer los planes de NUXA";
  ctaUrl: "https://nuxa.life/precios";
  footer: string;
  previewUnsubscribeUrl: string;
  commercialSendingEnabled: false;
};

type ApiError = Error & { code?: string; status?: number };
type SaveState = "idle" | "saving" | "saved" | "error";

async function responseError(response: Response): Promise<ApiError> {
  let payload: { message?: string; code?: string } = {};
  try {
    payload = await response.json();
  } catch {
    // Use a local message if the server did not return JSON.
  }
  const error = new Error(payload.message || `No se pudo completar la solicitud (${response.status}).`) as ApiError;
  error.code = payload.code;
  error.status = response.status;
  return error;
}

function formatUpdatedAt(value: string | null) {
  if (!value) return "Aún no se ha guardado";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Fecha de guardado no disponible";
  return new Intl.DateTimeFormat("es-ES", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

export default function StripeLetterEditor() {
  const [serverData, setServerData] = useState<LetterData | null>(null);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<ApiError | null>(null);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [saveError, setSaveError] = useState<ApiError | null>(null);
  const [preview, setPreview] = useState(false);

  const loadLetter = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const response = await fetch("/api/admin/stripe-contacts/letter", { credentials: "include" });
      if (!response.ok) throw await responseError(response);
      const data = (await response.json()) as LetterData;
      setServerData(data);
      setSubject(data.subject);
      setBody(data.body);
      setSaveState("idle");
      setSaveError(null);
    } catch (caught) {
      setLoadError(caught instanceof Error ? caught as ApiError : new Error("No se pudo cargar el borrador.") as ApiError);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadLetter();
  }, [loadLetter]);

  const isDirty = useMemo(
    () => !!serverData && (subject !== serverData.subject || body !== serverData.body),
    [serverData, subject, body],
  );
  const schemaPending = loadError?.code === "stripe_contacts_schema_pending" || saveError?.code === "stripe_contacts_schema_pending";
  const authenticatedError = loadError?.status === 401 || saveError?.status === 401;

  const saveDraft = async () => {
    if (!serverData || (!isDirty && serverData.updatedAt !== null) || !subject.trim() || !body.trim() || subject.length > 180 || body.length > 10000) return;
    setSaveState("saving");
    setSaveError(null);
    try {
      const response = await fetch("/api/admin/stripe-contacts/letter", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, body }),
      });
      if (!response.ok) throw await responseError(response);
      const data = (await response.json()) as LetterData;
      setServerData(data);
      setSubject(data.subject);
      setBody(data.body);
      setSaveState("saved");
    } catch (caught) {
      setSaveError(caught instanceof Error ? caught as ApiError : new Error("No se pudo guardar el borrador.") as ApiError);
      setSaveState("error");
    }
  };

  const subjectInvalid = subject.trim().length === 0 || subject.length > 180;
  const bodyInvalid = body.trim().length === 0 || body.length > 10000;

  return (
    <Card className="overflow-hidden border-border/80 shadow-sm" aria-labelledby="stripe-letter-title">
      <CardHeader className="gap-4 border-b bg-muted/20 px-4 py-4 sm:px-5">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              <FileText className="h-3.5 w-3.5" />
              Borrador · no se envía
            </div>
            <CardTitle id="stripe-letter-title" className="text-base">Invitación a conocer NUXA</CardTitle>
            <CardDescription className="mt-1 max-w-2xl leading-5">
              Edita y guarda el texto de la invitación a la suscripción. Guardar solo conserva un borrador; no autoriza ni inicia comunicaciones a contactos importados.
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {serverData && (
              <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-900">
                <ShieldCheck className="mr-1.5 h-3.5 w-3.5" /> Envío desactivado
              </Badge>
            )}
            <Button type="button" variant={preview ? "default" : "outline"} size="sm" onClick={() => setPreview((value) => !value)} disabled={!serverData}>
              {preview ? "Volver a editar" : "Vista previa"}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5">
        {loading && !serverData ? (
          <div className="space-y-4" aria-label="Cargando borrador" aria-busy="true">
            <div className="h-4 w-40 animate-pulse rounded bg-muted" />
            <div className="h-10 animate-pulse rounded-md bg-muted/70" />
            <div className="h-40 animate-pulse rounded-md bg-muted/70" />
          </div>
        ) : loadError && !serverData ? (
          <div role="alert" className="flex flex-col gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 sm:flex-row sm:items-start">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">
                {authenticatedError ? "Tu sesión necesita renovarse" : schemaPending ? "El borrador aún no está disponible" : "No se pudo cargar el borrador"}
              </p>
              <p className="mt-1 text-sm leading-5 text-muted-foreground">
                {authenticatedError
                  ? "Vuelve a iniciar sesión en el panel y después intenta cargar el borrador de nuevo."
                  : schemaPending
                    ? "Vuelve a publicar la aplicación para aplicar el esquema y, después, inténtalo de nuevo."
                    : loadError.message}
              </p>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={() => void loadLetter()} disabled={loading}>Reintentar</Button>
          </div>
        ) : serverData && preview ? (
          <div className="mx-auto max-w-2xl overflow-hidden rounded-xl border border-border bg-background shadow-sm">
            <div className="border-b border-border bg-muted/30 px-5 py-4 sm:px-7">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Vista de destinatario · demo</p>
              <p className="mt-2 text-xs text-muted-foreground">Asunto</p>
              <p className="mt-0.5 font-medium text-foreground">{subject || "Sin asunto"}</p>
            </div>
            <div className="px-5 py-7 sm:px-7 sm:py-9">
              <div className="mb-6 flex items-center justify-between border-b border-border/70 pb-4">
                <span className="font-semibold tracking-[0.12em] text-foreground">NUXA</span>
                <span className="text-xs text-muted-foreground">Bienestar, a tu ritmo</span>
              </div>
              <p className="whitespace-pre-wrap break-words text-sm leading-7 text-foreground">{body}</p>
              <div className="my-7">
                <a
                  href={serverData.ctaUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  {serverData.ctaLabel}
                </a>
              </div>
              <div className="border-t border-border/70 pt-4 text-xs leading-5 text-muted-foreground">
                <p className="whitespace-pre-wrap">{serverData.footer}</p>
                <p className="mt-2">
                  <a href={serverData.previewUnsubscribeUrl} target="_blank" rel="noreferrer" className="font-medium text-primary underline underline-offset-2">
                    Vista de demostración del enlace para dejar de recibir comunicaciones
                  </a>
                  <span className="ml-1.5 rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Demo</span>
                </p>
                <p className="mt-1">Este enlace de demostración no modifica suscripciones ni da de baja a ningún contacto.</p>
              </div>
            </div>
          </div>
        ) : serverData ? (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
            <div className="space-y-5">
              {loadError && (
                <div role="alert" className="rounded-md border border-amber-300/70 bg-amber-50/70 px-3.5 py-3 text-sm text-amber-950">
                  No se pudo actualizar el borrador desde el servidor. Tus cambios locales se mantienen. {loadError.message}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="stripe-letter-subject">Asunto</Label>
                <Input id="stripe-letter-subject" value={subject} maxLength={180} onChange={(event) => { setSubject(event.target.value); setSaveState("idle"); }} />
                <p className={`text-xs ${subjectInvalid ? "text-destructive" : "text-muted-foreground"}`}>{subject.length}/180 · No puede quedar vacío.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="stripe-letter-body">Cuerpo de la invitación</Label>
                <Textarea id="stripe-letter-body" value={body} maxLength={10000} onChange={(event) => { setBody(event.target.value); setSaveState("idle"); }} rows={14} className="min-h-[280px] resize-y leading-6" />
                <p className={`text-xs ${bodyInvalid ? "text-destructive" : "text-muted-foreground"}`}>{body.length}/10.000 caracteres · Texto sin formato HTML; no puede quedar vacío.</p>
              </div>
              {saveError && (
                <div role="alert" className="rounded-md border border-destructive/30 bg-destructive/5 px-3.5 py-3 text-sm text-foreground">
                  <p className="font-semibold">{saveError.status === 401 ? "Tu sesión necesita renovarse" : saveError.code === "stripe_contacts_schema_pending" ? "El esquema requiere volver a publicar la aplicación" : "No se pudo guardar el borrador"}</p>
                  <p className="mt-1 text-muted-foreground">{saveError.status === 401 ? "Vuelve a iniciar sesión en el panel y guarda de nuevo." : saveError.code === "stripe_contacts_schema_pending" ? "Vuelve a publicar la aplicación para aplicar el esquema y después intenta guardar de nuevo." : saveError.message}</p>
                </div>
              )}
              <div className="flex flex-col justify-between gap-3 border-t border-border/70 pt-4 sm:flex-row sm:items-center">
                <p role="status" className="min-h-5 text-sm text-muted-foreground">
                  {saveState === "saved" ? <span className="inline-flex items-center gap-1.5 text-emerald-800"><Check className="h-4 w-4" /> Borrador guardado</span> : isDirty ? "Cambios sin guardar" : `Último guardado: ${formatUpdatedAt(serverData.updatedAt)}`}
                </p>
                <Button type="button" onClick={() => void saveDraft()} disabled={(!isDirty && serverData.updatedAt !== null) || subjectInvalid || bodyInvalid || saveState === "saving"}>
                  {saveState === "saving" ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  {saveState === "saving" ? "Guardando…" : "Guardar borrador"}
                </Button>
              </div>
            </div>
            <aside className="h-fit rounded-lg border border-amber-300/70 bg-amber-50/60 p-4 text-amber-950">
              <p className="text-sm font-semibold">Este panel no envía mensajes</p>
              <p className="mt-1.5 text-sm leading-5 text-amber-900/80">Una compra o una dirección importada no acredita consentimiento. Este borrador no es permiso para promocionar NUXA a esos contactos.</p>
              <div className="mt-4 border-t border-amber-300/60 pt-3 text-xs leading-5 text-amber-900/80">
                <p>En nombre de: <span className="font-medium">NUXA &lt;avisos@nuxa.life&gt;</span></p>
                <p className="mt-1">Responder a: <span className="font-medium">correo del propietario</span></p>
              </div>
              <p className="mt-3 text-xs text-amber-900/70">El botón de planes y el texto de pie se reciben del servidor y no se editan aquí.</p>
            </aside>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
