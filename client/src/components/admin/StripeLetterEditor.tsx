import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, Check, FileText, LoaderCircle, Save, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { commercialAudience, type CommercialAudienceId } from "@shared/commercial-audience";

type Language = "es" | "en";
type LetterData = { language: Language; subject: string; body: string; updatedAt: string | null; ctaLabel: string; ctaUrl: string; footer: string; previewUnsubscribeUrl: string; commercialSendingEnabled: boolean };
type Draft = { server: LetterData; subject: string; body: string; saved: boolean };
type ApiError = Error & { code?: string; status?: number };
type SaveState = "idle" | "saving" | "saved" | "error";

async function responseError(response: Response): Promise<ApiError> {
  let payload: { message?: string; code?: string } = {};
  try { payload = await response.json(); } catch { /* use status as fallback */ }
  const error = new Error(payload.message || `No se pudo completar la solicitud (${response.status}).`) as ApiError;
  error.code = payload.code; error.status = response.status; return error;
}
function formatUpdatedAt(value: string | null) {
  if (!value) return "Aún no se ha guardado";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Fecha de guardado no disponible" : new Intl.DateTimeFormat("es-ES", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

export default function StripeLetterEditor({ audience = "stripe" }: { audience?: CommercialAudienceId }) {
  const config = commercialAudience(audience);
  const letterPath = `${config.base}/letter`;
  const [language, setLanguage] = useState<Language>("es");
  const [drafts, setDrafts] = useState<Partial<Record<Language, Draft>>>({});
  const [loading, setLoading] = useState(true);
  const [loadingLanguage, setLoadingLanguage] = useState<Language | null>(null);
  const [loadErrors, setLoadErrors] = useState<Partial<Record<Language, ApiError>>>({});
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [saveErrors, setSaveErrors] = useState<Partial<Record<Language, ApiError>>>({});
  const [preview, setPreview] = useState(false);

  const loadLetter = useCallback(async (lang: Language, initial = false) => {
    if (initial) setLoading(true);
    else setLoadingLanguage(lang);
    setLoadErrors((old) => ({ ...old, [lang]: undefined }));
    try {
      const response = await fetch(`${letterPath}?language=${lang}`, { credentials: "include" });
      if (!response.ok) throw await responseError(response);
      const data = await response.json() as LetterData;
      setDrafts((old) => {
        const existing = old[lang];
        // Refresh is never allowed to erase an in-progress local edit.
        if (existing && (existing.subject !== existing.server.subject || existing.body !== existing.server.body)) return old;
        return { ...old, [lang]: { server: data, subject: data.subject, body: data.body, saved: false } };
      });
    } catch (caught) {
      setLoadErrors((old) => ({ ...old, [lang]: caught as ApiError }));
    } finally {
      if (initial) setLoading(false);
      else setLoadingLanguage(null);
    }
  }, [letterPath]);

  useEffect(() => { void loadLetter("es", true); }, [loadLetter]);

  const draft = drafts[language];
  const isDirty = !!draft && (draft.subject !== draft.server.subject || draft.body !== draft.server.body);
  const loadError = loadErrors[language];
  const saveError = saveErrors[language];
  const schemaPending = loadError?.code === "stripe_contacts_schema_pending" || saveError?.code === "stripe_contacts_schema_pending";
  const authenticatedError = loadError?.status === 401 || saveError?.status === 401;
  const subjectInvalid = !draft?.subject.trim() || (draft?.subject.length ?? 0) > 180;
  const bodyInvalid = !draft?.body.trim() || (draft?.body.length ?? 0) > 10000;
  const saveEnabled = !!draft && !subjectInvalid && !bodyInvalid && saveState !== "saving" && (isDirty || draft.server.updatedAt === null);

  async function switchLanguage(next: Language) {
    if (next === language) return;
    if (isDirty && !window.confirm("Hay cambios sin guardar. Cambiar de idioma conservará este borrador local para que puedas volver; no se guardará en el servidor. ¿Continuar?")) return;
    setLanguage(next); setPreview(false); setSaveState("idle");
    if (!drafts[next]) await loadLetter(next);
  }
  function edit(field: "subject" | "body", value: string) {
    setSaveState("idle");
    setDrafts((old) => {
      const current = old[language];
      if (!current) return old;
      return { ...old, [language]: { ...current, [field]: value, saved: false } };
    });
  }
  async function saveDraft() {
    if (!draft || !saveEnabled) return;
    setSaveState("saving"); setSaveErrors((old) => ({ ...old, [language]: undefined }));
    try {
      const response = await fetch(letterPath, {
        method: "PUT", credentials: "include", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, subject: draft.subject, body: draft.body }),
      });
      if (!response.ok) throw await responseError(response);
      const data = await response.json() as LetterData;
      setDrafts((old) => {
        const current = old[language];
        // Preserve edits typed while the save request was in flight.
        const editedDuringSave = current && (current.subject !== draft.subject || current.body !== draft.body);
        return { ...old, [language]: {
          server: data, subject: editedDuringSave ? current.subject : data.subject,
          body: editedDuringSave ? current.body : data.body, saved: !editedDuringSave,
        } };
      });
      setSaveState("saved");
    } catch (caught) {
      setSaveErrors((old) => ({ ...old, [language]: caught as ApiError }));
      setSaveState("error");
    }
  }
  const previewSubject = useMemo(() => draft?.subject || (language === "es" ? "Sin asunto" : "No subject"), [draft?.subject, language]);
  const languageLabel = language === "es" ? "Español" : "English";

  const subjectId = `${audience}-letter-subject`;
  const bodyId = `${audience}-letter-body`;
  return <Card className="overflow-hidden border-border/80 shadow-sm" aria-labelledby={`${audience}-letter-title`}>
    <CardHeader className="gap-4 border-b bg-muted/20 px-4 py-4 sm:px-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
         <div><div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground"><FileText className="h-3.5 w-3.5" />Borrador · no se envía</div><CardTitle id={`${audience}-letter-title`} className="text-base">{audience === "stripe" ? "Invitación comercial de NUXA" : "Invitación comercial para probadores"}</CardTitle><CardDescription className="mt-1 max-w-2xl leading-5">Edita y guarda cada idioma por separado. Preparar un envío usará la última versión guardada; guardar nunca envía mensajes.</CardDescription></div>
        <div className="flex flex-wrap items-center gap-2">
          {draft && <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-900"><ShieldCheck className="mr-1.5 h-3.5 w-3.5" />Envío solo manual</Badge>}
          <Button type="button" variant={preview ? "default" : "outline"} size="sm" onClick={() => setPreview((value) => !value)} disabled={!draft}>{preview ? "Volver a editar" : "Vista previa"}</Button>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Idioma de la carta">
        <Button type="button" size="sm" variant={language === "es" ? "default" : "outline"} onClick={() => void switchLanguage("es")} disabled={!!loadingLanguage}>ES · Español</Button>
        <Button type="button" size="sm" variant={language === "en" ? "default" : "outline"} onClick={() => void switchLanguage("en")} disabled={!!loadingLanguage}>EN · English</Button>
        <span className="ml-1 text-xs text-muted-foreground">Los borradores de ambos idiomas se guardan de forma independiente.</span>
      </div>
    </CardHeader>
    <CardContent className="p-4 sm:p-5">
      {(loading || (!!loadingLanguage && !draft)) && <div className="space-y-4" aria-label="Cargando borrador" aria-busy="true"><div className="h-4 w-40 animate-pulse rounded bg-muted" /><div className="h-10 animate-pulse rounded-md bg-muted/70" /><div className="h-40 animate-pulse rounded-md bg-muted/70" /></div>}
      {draft && preview && <div className="mx-auto max-w-2xl overflow-hidden rounded-xl border border-border bg-background shadow-sm">
        <div className="border-b bg-muted/30 px-5 py-4 sm:px-7"><p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Vista de destinatario · demostración · {languageLabel}</p><p className="mt-2 text-xs text-muted-foreground">Asunto</p><p className="mt-0.5 font-medium">{previewSubject}</p></div>
        <div className="px-5 py-7 sm:px-7 sm:py-9"><div className="mb-6 flex items-center justify-between border-b border-border/70 pb-4"><span className="font-semibold tracking-[0.12em]">NUXA</span><span className="text-xs text-muted-foreground">{language === "es" ? "Bienestar, a tu ritmo" : "Wellbeing, at your pace"}</span></div>
          <p className="whitespace-pre-wrap break-words text-sm leading-7">{draft.body}</p>
          <div className="my-7"><a href={draft.server.ctaUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">{draft.server.ctaLabel}</a></div>
          <div className="border-t border-border/70 pt-4 text-xs leading-5 text-muted-foreground"><p className="whitespace-pre-wrap">{draft.server.footer}</p><p className="mt-2"><a href={draft.server.previewUnsubscribeUrl} target="_blank" rel="noreferrer" className="font-medium text-primary underline underline-offset-2">{language === "es" ? "Vista de demostración del enlace para dejar de recibir comunicaciones" : "Demo view of the unsubscribe link"}</a><span className="ml-1.5 rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide">Demo</span></p><p className="mt-1">{language === "es" ? "Este enlace de demostración no modifica suscripciones ni da de baja a ningún contacto." : "This demonstration link does not change subscriptions or unsubscribe any contact."}</p></div>
        </div>
      </div>}
      {draft && !preview && <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
        <div className="space-y-5">
          {loadError && <div role="alert" className="rounded-md border border-amber-300/70 bg-amber-50/70 px-3.5 py-3 text-sm text-amber-950">No se pudo actualizar este idioma. Tus cambios locales se mantienen. {loadError.message}</div>}
           <div className="space-y-2"><Label htmlFor={subjectId}>Asunto · {languageLabel}</Label><Input id={subjectId} value={draft.subject} maxLength={180} onChange={(event) => edit("subject", event.target.value)} /><p className={`text-xs ${subjectInvalid ? "text-destructive" : "text-muted-foreground"}`}>{draft.subject.length}/180 · {language === "es" ? "No puede quedar vacío." : "Cannot be empty."}</p></div>
           <div className="space-y-2"><Label htmlFor={bodyId}>Cuerpo de la invitación</Label><Textarea id={bodyId} value={draft.body} maxLength={10000} onChange={(event) => edit("body", event.target.value)} rows={14} className="min-h-[280px] resize-y leading-6" /><p className={`text-xs ${bodyInvalid ? "text-destructive" : "text-muted-foreground"}`}>{draft.body.length.toLocaleString("es-ES")}/10.000 caracteres · {language === "es" ? "Texto sin formato HTML; no puede quedar vacío." : "Plain text only; cannot be empty."}</p></div>
          {saveError && <div role="alert" className="rounded-md border border-destructive/30 bg-destructive/5 px-3.5 py-3 text-sm"><p className="font-semibold">{saveError.status === 401 ? "Tu sesión necesita renovarse" : schemaPending ? "El esquema requiere volver a publicar la aplicación" : "No se pudo guardar el borrador"}</p><p className="mt-1 text-muted-foreground">{saveError.status === 401 ? "Vuelve a iniciar sesión en el panel y guarda de nuevo." : schemaPending ? "Vuelve a publicar la aplicación antes de continuar." : saveError.message}</p></div>}
          <div className="flex flex-col justify-between gap-3 border-t border-border/70 pt-4 sm:flex-row sm:items-center"><p role="status" className="min-h-5 text-sm text-muted-foreground">{saveState === "saved" && !isDirty ? <span className="inline-flex items-center gap-1.5 text-emerald-800"><Check className="h-4 w-4" />Borrador guardado para {languageLabel}</span> : isDirty ? "Cambios sin guardar" : `Último guardado: ${formatUpdatedAt(draft.server.updatedAt)}`}</p><Button type="button" onClick={() => void saveDraft()} disabled={!saveEnabled}>{saveState === "saving" ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}{saveState === "saving" ? "Guardando…" : `Guardar ${languageLabel}`}</Button></div>
        </div>
        <aside className="h-fit rounded-lg border border-amber-300/70 bg-amber-50/60 p-4 text-amber-950"><p className="text-sm font-semibold">Preparación no significa envío</p><p className="mt-1.5 text-sm leading-5 text-amber-900/80">El envío requiere destinatarios autorizados y una revisión final separada. Nada se envía automáticamente.</p><div className="mt-4 border-t border-amber-300/60 pt-3 text-xs leading-5 text-amber-900/80"><p>De: <span className="font-medium">NUXA &lt;avisos@nuxa.life&gt;</span></p><p className="mt-1">Responder a: <span className="font-medium">correo del propietario</span></p></div><p className="mt-3 text-xs text-amber-900/70">El CTA y el pie legal localizado son fijos del servidor. El enlace de baja de la vista previa es solo una demostración.</p></aside>
      </div>}
      {!draft && !loading && !loadingLanguage && <div role="alert" className="flex flex-col gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 sm:flex-row sm:items-start"><AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" /><div className="flex-1"><p className="text-sm font-semibold">{authenticatedError ? "Tu sesión necesita renovarse" : schemaPending ? "El borrador aún no está disponible" : "No se pudo cargar el borrador"}</p><p className="mt-1 text-sm leading-5 text-muted-foreground">{authenticatedError ? "Vuelve a iniciar sesión en el panel y después intenta cargarlo." : schemaPending ? "Vuelve a publicar la aplicación para aplicar el esquema. No se aplicará un valor alternativo." : loadError?.message || "Comprueba la conexión e inténtalo de nuevo."}</p></div><Button type="button" variant="outline" size="sm" onClick={() => void loadLetter(language)} disabled={!!loadingLanguage}>Reintentar</Button></div>}
    </CardContent>
  </Card>;
}
