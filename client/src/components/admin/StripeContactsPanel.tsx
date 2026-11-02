import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { AlertCircle, Check, ChevronDown, Clock3, Database, Eye, LoaderCircle, Mail, RefreshCw, Search, ShieldCheck, Users, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import StripeLetterEditor from "@/components/admin/StripeLetterEditor";
import { STRIPE_LETTERS, STRIPE_LETTER_CTA } from "@shared/stripe-commercial-letter";

type Language = "es" | "en";
type Contact = { id: number; email: string; source: "stripe"; status: "pending_review" | "suppressed" | "authorized"; importedAt: string; lastSeenAt: string; canSend: boolean };
type ContactSummary = { total: number; pendingReview: number; suppressed: number; sendable: number };
type DispatchRecipient = { contactId: number; email: string; status: "pending" | "attempting" | "accepted" | "rejected" | "skipped" | "uncertain"; reason: string | null; messageId: string | null };
type Dispatch = { id: string; language: Language; subject: string; body: string; status: "prepared" | "running" | "completed" | "stopped"; createdAt: string; recipients: DispatchRecipient[] };
type AuthRecord = { id: number; action: "grant" | "revoke"; source: string; evidence: string; obtainedAt: string; recordedAt: string };
type ApiError = Error & { code?: string; status?: number; reference?: string };
type ImportResult = { inserted: number; existing: number; invalidEmailRecords: number; duplicateEmailRecords: number };

async function apiError(response: Response): Promise<ApiError> {
  let payload: { message?: string; code?: string; reference?: string } = {};
  try { payload = await response.json(); } catch { /* status text is enough */ }
  const error = new Error(payload.message || `La solicitud no pudo completarse (${response.status}).`) as ApiError;
  error.code = payload.code;
  error.status = response.status;
  if (typeof payload.reference === "string" && /^[a-f0-9-]{36}$/i.test(payload.reference)) error.reference = payload.reference;
  return error;
}
async function jsonRequest<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, { credentials: "include", ...init });
  if (!response.ok) throw await apiError(response);
  return response.json() as Promise<T>;
}
const dateLabel = (value: string | null) => {
  if (!value) return "No consta";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Fecha no disponible" : new Intl.DateTimeFormat("es-ES", { dateStyle: "medium", timeStyle: "short" }).format(date);
};
const dispatchPath = "/api/admin/stripe-contacts/dispatches";

export default function StripeContactsPanel() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [summary, setSummary] = useState<ContactSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [retryOperation, setRetryOperation] = useState<"load" | "import">("load");
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [authContact, setAuthContact] = useState<Contact | null>(null);
  const [authRecords, setAuthRecords] = useState<AuthRecord[]>([]);
  const [authSuppressed, setAuthSuppressed] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<ApiError | null>(null);
  const [authBusy, setAuthBusy] = useState(false);
  const [source, setSource] = useState<"form" | "documented_email" | "signed_document">("form");
  const [evidence, setEvidence] = useState("");
  const [obtainedAt, setObtainedAt] = useState("");
  const [attested, setAttested] = useState(false);
  const [language, setLanguage] = useState<Language>("es");
  const [dispatches, setDispatches] = useState<Dispatch[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState<ApiError | null>(null);
  const [dispatchBusy, setDispatchBusy] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [dispatchError, setDispatchError] = useState<ApiError | null>(null);
  const [reviewDispatch, setReviewDispatch] = useState<Dispatch | null>(null);
  const [confirmation, setConfirmation] = useState("");
  const [detailDispatch, setDetailDispatch] = useState<Dispatch | null>(null);

  const loadContacts = useCallback(async (quiet = false) => {
    setRetryOperation("load");
    quiet ? setRefreshing(true) : setLoading(true);
    setError(null);
    try {
      const result = await jsonRequest<{ contacts: Contact[]; summary: ContactSummary }>("/api/admin/stripe-contacts");
      setContacts(Array.isArray(result.contacts) ? result.contacts : []);
      setSummary(result.summary);
      setSelected((old) => old.filter((id) => result.contacts.some((contact) => contact.id === id && contact.canSend)));
    } catch (caught) { setError(caught as ApiError); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  const loadDispatches = useCallback(async () => {
    setHistoryLoading(true); setHistoryError(null);
    try {
      const result = await jsonRequest<{ dispatches: Dispatch[] }>(dispatchPath);
      setDispatches(Array.isArray(result.dispatches) ? result.dispatches : []);
    } catch (caught) { setHistoryError(caught as ApiError); }
    finally { setHistoryLoading(false); }
  }, []);
  useEffect(() => { void loadContacts(); void loadDispatches(); }, [loadContacts, loadDispatches]);

  const visibleContacts = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return contacts.filter((contact) => !needle || contact.email.toLocaleLowerCase().includes(needle));
  }, [contacts, query]);
  const selectedContacts = useMemo(() => contacts.filter((contact) => selected.includes(contact.id) && contact.canSend), [contacts, selected]);
  const schemaPending = error?.code === "stripe_contacts_schema_pending" || authError?.code === "stripe_contacts_schema_pending" || dispatchError?.code === "stripe_contacts_schema_pending" || historyError?.code === "stripe_contacts_schema_pending";

  async function importContacts() {
    setImporting(true); setError(null); setImportResult(null);
    try {
      const result = await jsonRequest<ImportResult>("/api/admin/stripe-contacts/import", { method: "POST", headers: { "Content-Type": "application/json" } });
      setImportResult(result);
      await loadContacts(true);
    } catch (caught) { setRetryOperation("import"); setError(caught as ApiError); }
    finally { setImporting(false); }
  }

  async function openAuthorization(contact: Contact) {
    setAuthContact(contact); setAuthRecords([]); setAuthError(null); setAuthLoading(true);
    setAuthSuppressed(contact.status === "suppressed");
    setEvidence(""); setObtainedAt(""); setAttested(false);
    try {
      const result = await jsonRequest<{ records: AuthRecord[]; suppressed: boolean }>(`/api/admin/stripe-contacts/authorizations/${contact.id}`);
      setAuthRecords(result.records || []);
      setAuthSuppressed(result.suppressed);
    } catch (caught) { setAuthError(caught as ApiError); }
    finally { setAuthLoading(false); }
  }
  async function registerAuthorization(event: FormEvent) {
    event.preventDefault();
    if (!authContact || evidence.trim().length < 20 || evidence.trim().length > 1000 || !obtainedAt || !attested || authBusy) return;
    setAuthBusy(true); setAuthError(null);
    try {
      await jsonRequest(`/api/admin/stripe-contacts/authorizations/${authContact.id}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "grant", source, evidence: evidence.trim(), obtainedAt: new Date(obtainedAt).toISOString(), attested: true }),
      });
      await Promise.all([loadContacts(true), openAuthorization(authContact)]);
    } catch (caught) { setAuthError(caught as ApiError); }
    finally { setAuthBusy(false); }
  }
  async function revokeAuthorization() {
    if (!authContact || authBusy || !window.confirm(`¿Revocar la autorización comercial de ${authContact.email}?`)) return;
    setAuthBusy(true); setAuthError(null);
    try {
      await jsonRequest(`/api/admin/stripe-contacts/authorizations/${authContact.id}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "revoke" }) });
      await Promise.all([loadContacts(true), openAuthorization(authContact)]);
    } catch (caught) { setAuthError(caught as ApiError); }
    finally { setAuthBusy(false); }
  }

  async function prepareDispatch() {
    if (dispatchBusy || selectedContacts.length === 0 || selectedContacts.length > 10) return;
    setDispatchBusy(true); setDispatchError(null);
    try {
      const result = await jsonRequest<Dispatch>(dispatchPath, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ language, contactIds: selectedContacts.map((contact) => contact.id) }) });
      setReviewDispatch(result); setConfirmation("");
      await loadDispatches();
    } catch (caught) {
      setDispatchError(caught as ApiError);
      if ((caught as ApiError).status === 409) await loadContacts(true);
    } finally { setDispatchBusy(false); }
  }
  async function sendDispatch() {
    if (!reviewDispatch || reviewDispatch.status !== "prepared" || confirmation !== "ENVIAR" || dispatchBusy) return;
    setDispatchBusy(true); setDispatchError(null);
    const current = reviewDispatch;
    try {
      const result = await jsonRequest<Dispatch>(`${dispatchPath}/${encodeURIComponent(current.id)}/send`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ confirmation: "ENVIAR" }) });
      setReviewDispatch(null); setDetailDispatch(result); setDispatches((old) => [result, ...old.filter((item) => item.id !== result.id)].slice(0, 20));
      await loadContacts(true);
    } catch (caught) {
      const sendError = caught as ApiError;
      setDispatchError(sendError);
      // A lost response is recovered by reading state; this deliberately never retries send.
      try {
        const recovered = await jsonRequest<Dispatch>(`${dispatchPath}/${encodeURIComponent(current.id)}`);
        setReviewDispatch(null); setDetailDispatch(recovered); setDispatches((old) => [recovered, ...old.filter((item) => item.id !== recovered.id)].slice(0, 20));
      } catch { /* Keep the exact error and the prepared dispatch visible for manual recovery. */ }
    } finally { setDispatchBusy(false); }
  }
  async function cancelDispatch(dispatch: Dispatch) {
    if (cancelling || !window.confirm("Cancelar lo que aún no se haya aceptado. Los emails ya aceptados no se pueden retirar.")) return;
    setCancelling(true); setDispatchError(null);
    try {
      const result = await jsonRequest<Dispatch>(`${dispatchPath}/${encodeURIComponent(dispatch.id)}/cancel`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
      setDispatches((old) => [result, ...old.filter((item) => item.id !== result.id)].slice(0, 20));
      if (detailDispatch?.id === result.id) setDetailDispatch(result);
      if (reviewDispatch?.id === result.id) { setReviewDispatch(null); setDetailDispatch(result); }
    } catch (caught) { setDispatchError(caught as ApiError); }
    finally { setCancelling(false); }
  }
  async function recoverDispatch(dispatch: Dispatch) {
    setDispatchBusy(true); setDispatchError(null);
    try {
      const result = await jsonRequest<Dispatch>(`${dispatchPath}/${encodeURIComponent(dispatch.id)}`);
      setDispatches((old) => [result, ...old.filter((item) => item.id !== result.id)].slice(0, 20));
      setDetailDispatch(result);
    } catch (caught) { setDispatchError(caught as ApiError); }
    finally { setDispatchBusy(false); }
  }

  const schemaMessage = "La estructura comercial de la base de datos está pendiente. Revisa su preparación al publicar; no se usará una lista local alternativa.";
  return (
    <section className="space-y-6" aria-labelledby="stripe-contacts-title">
      <div className="flex flex-col justify-between gap-4 border-b border-border/70 pb-5 sm:flex-row sm:items-end">
        <div className="max-w-2xl">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground"><span className="h-2 w-2 rounded-full bg-amber-500" />Área comercial · solo propietario</div>
          <h2 id="stripe-contacts-title" className="text-2xl font-semibold tracking-tight text-foreground">Contactos de Stripe</h2>
          <p className="mt-1.5 text-sm leading-6 text-muted-foreground">Cada invitación requiere permiso explícito registrado y una revisión manual antes del envío. Importar no concede autorización.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => void loadContacts(true)} disabled={loading || refreshing || importing}><RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />Actualizar</Button>
          <Button onClick={() => void importContacts()} disabled={loading || refreshing || importing} className="bg-slate-900 text-white hover:bg-slate-800">{importing ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Database className="mr-2 h-4 w-4" />}{importing ? "Importando…" : "Importar desde Stripe"}</Button>
        </div>
      </div>

      <div role="note" className="flex items-start gap-3 rounded-lg border border-amber-300/70 bg-amber-50/70 px-4 py-3.5 text-amber-950">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
        <div><p className="text-sm font-semibold">La compra no es permiso para marketing</p><p className="mt-0.5 text-sm leading-5 text-amber-900/80">Registra una autorización afirmativa, específica para emails comerciales de NUXA. Guarda solo una referencia a la prueba; no incluyas información clínica.</p></div>
      </div>

      <StripeLetterEditor />

      {(error || dispatchError || historyError) && <div role="alert" className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" /><div className="flex-1"><p className="text-sm font-semibold">{[error, dispatchError, historyError].some((item) => item?.status === 401) ? "La sesión de administrador necesita renovarse" : schemaPending ? "Esquema pendiente" : "No se pudo completar la operación"}</p><p className="mt-1 text-sm text-muted-foreground">{schemaPending ? schemaMessage : (dispatchError || error || historyError)?.message}</p></div>
        {error?.reference && <span className="text-xs text-muted-foreground">Referencia: {error.reference}</span>}
        {error && <Button variant="outline" size="sm" onClick={() => void (retryOperation === "import" ? importContacts() : loadContacts())} disabled={loading || importing || refreshing}>{importing ? "Importando…" : retryOperation === "import" ? "Reintentar importación" : "Reintentar carga"}</Button>}
      </div>}
      {importResult && <div role="status" className="rounded-lg border border-emerald-300/70 bg-emerald-50/70 p-4 text-sm text-emerald-950"><p className="font-semibold"><Check className="mr-1.5 inline h-4 w-4" />Importación completada</p><p className="mt-1">{importResult.inserted} nuevas · {importResult.existing} ya existentes · {importResult.invalidEmailRecords} inválidas · {importResult.duplicateEmailRecords} duplicadas. Ninguna dirección quedó autorizada por importar.</p></div>}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Metric label="Contactos importados" value={summary?.total ?? 0} icon={<Users className="h-4 w-4" />} />
        <Metric label="Pendientes de revisión" value={summary?.pendingReview ?? 0} tone="amber" icon={<Clock3 className="h-4 w-4" />} />
        <Metric label="Suprimidos" value={summary?.suppressed ?? 0} tone="rose" icon={<ShieldCheck className="h-4 w-4" />} />
        <Metric label="Autorizados y elegibles" value={summary?.sendable ?? 0} tone="green" icon={<Mail className="h-4 w-4" />} />
      </div>

      <Card className="overflow-hidden border-border/80 shadow-sm">
        <CardHeader className="gap-4 border-b bg-muted/20 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div><CardTitle className="text-base">Contactos y permisos</CardTitle><CardDescription className="mt-1">Selecciona solo destinatarios elegibles. Un lote admite hasta 10 emails.</CardDescription></div>
          <div className="relative w-full sm:max-w-xs"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por email" aria-label="Buscar contactos por email" className="pl-9" /></div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? <div className="space-y-3 p-5" aria-label="Cargando contactos" aria-busy="true"><div className="h-4 w-44 animate-pulse rounded bg-muted" /><div className="h-12 animate-pulse rounded-md bg-muted/70" /><div className="h-12 animate-pulse rounded-md bg-muted/70" /></div>
            : contacts.length === 0 ? <div className="px-6 py-12 text-center"><Users className="mx-auto mb-3 h-8 w-8 text-muted-foreground" /><p className="text-sm font-medium">Aún no hay contactos importados</p><p className="mt-1 text-sm text-muted-foreground">Importa desde Stripe para iniciar una revisión individual.</p></div>
              : visibleContacts.length === 0 ? <p className="px-6 py-12 text-center text-sm text-muted-foreground">No hay coincidencias. Prueba con otro email.</p>
                : <div className="overflow-x-auto"><table className="w-full min-w-[790px] text-left text-sm">
                  <thead className="bg-muted/30 text-xs font-medium uppercase tracking-wide text-muted-foreground"><tr><th className="w-12 px-4 py-3"><span className="sr-only">Seleccionar</span></th><th className="px-3 py-3">Email</th><th className="px-3 py-3">Estado</th><th className="px-3 py-3">Importado</th><th className="px-3 py-3">Última importación</th><th className="px-4 py-3 text-right">Permiso</th></tr></thead>
                  <tbody className="divide-y divide-border/70">{visibleContacts.map((contact) => <tr key={contact.id} className="transition-colors hover:bg-muted/20">
                    <td className="px-4 py-3.5"><input type="checkbox" aria-label={`Seleccionar ${contact.email}`} checked={selected.includes(contact.id)} disabled={!contact.canSend || (!selected.includes(contact.id) && selectedContacts.length >= 10)} onChange={(event) => setSelected((old) => event.target.checked ? [...old, contact.id] : old.filter((id) => id !== contact.id))} className="h-4 w-4 rounded border-input accent-primary disabled:opacity-40" /></td>
                    <td className="px-3 py-3.5 font-medium text-foreground">{contact.email}</td>
                    <td className="px-3 py-3.5">{contact.status === "suppressed" ? <Badge variant="outline" className="border-rose-200 bg-rose-50 text-rose-800">Suprimido</Badge> : contact.canSend ? <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-900">Elegible</Badge> : <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-900">Pendiente</Badge>}</td>
                    <td className="px-3 py-3.5 text-muted-foreground">{dateLabel(contact.importedAt)}</td><td className="px-3 py-3.5 text-muted-foreground">{dateLabel(contact.lastSeenAt)}</td>
                    <td className="px-4 py-3.5 text-right"><Button variant="outline" size="sm" onClick={() => void openAuthorization(contact)}><ShieldCheck className="mr-1.5 h-3.5 w-3.5" />Revisar permiso</Button></td>
                  </tr>)}</tbody></table><div className="flex flex-col gap-3 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5"><p className="text-xs text-muted-foreground">{selectedContacts.length} de 10 seleccionados · {visibleContacts.length} de {contacts.length} contactos</p><div className="flex flex-col gap-2 sm:flex-row sm:items-center"><Label htmlFor="dispatch-language" className="text-xs text-muted-foreground">Idioma de todo el lote</Label><div className="relative"><select id="dispatch-language" value={language} onChange={(event) => setLanguage(event.target.value as Language)} className="h-9 appearance-none rounded-md border border-input bg-background px-3 pr-8 text-sm"><option value="es">Español</option><option value="en">English</option></select><ChevronDown className="pointer-events-none absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" /></div><Button onClick={() => void prepareDispatch()} disabled={dispatchBusy || selectedContacts.length === 0}>{dispatchBusy ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}Preparar revisión</Button></div></div></div>}
        </CardContent>
      </Card>

      <DispatchHistory dispatches={dispatches} loading={historyLoading} error={historyError} busy={dispatchBusy} onRefresh={() => void loadDispatches()} onOpen={(dispatch) => { if (dispatch.status === "prepared") { setReviewDispatch(dispatch); setConfirmation(""); } else setDetailDispatch(dispatch); }} onRecover={recoverDispatch} onCancel={cancelDispatch} />

      {authContact && <Modal title="Autorización comercial" onClose={() => setAuthContact(null)}>
        <div className="mb-4 rounded-md bg-muted/50 p-3"><p className="text-sm font-semibold">{authContact.email}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">La supresión prevalece siempre: una dirección suprimida nunca se puede seleccionar ni enviar.</p></div>
        {authLoading ? <div className="space-y-3" aria-busy="true"><div className="h-4 w-40 animate-pulse rounded bg-muted" /><div className="h-16 animate-pulse rounded bg-muted/70" /></div> : <>
          {authSuppressed && <p role="alert" className="mb-4 rounded-md border border-rose-200 bg-rose-50 p-3 text-sm font-medium text-rose-900">Este contacto está suprimido. No se puede autorizar ni enviar.</p>}
          {authRecords.length > 0 && <div className="mb-5 space-y-2"><p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Registro de evidencia</p>{authRecords.map((record) => <div key={record.id} className="rounded-md border p-3 text-xs"><div className="flex justify-between gap-3"><Badge variant="outline" className={record.action === "grant" ? "border-emerald-200 text-emerald-800" : "border-rose-200 text-rose-800"}>{record.action === "grant" ? "Permiso registrado" : "Permiso revocado"}</Badge><span className="text-muted-foreground">{dateLabel(record.recordedAt)}</span></div><p className="mt-2 leading-5 text-foreground">{record.evidence}</p><p className="mt-1 text-muted-foreground">Fuente: {record.source} · Obtenido: {dateLabel(record.obtainedAt)}</p></div>)}</div>}
          {!authSuppressed && authContact.status !== "suppressed" && authContact.canSend && <div className="mb-4 flex items-center justify-between rounded-md border border-emerald-200 bg-emerald-50/60 p-3"><p className="text-sm font-medium text-emerald-950">Autorización activa y elegible</p><Button variant="outline" size="sm" onClick={() => void revokeAuthorization()} disabled={authBusy}>{authBusy ? "Guardando…" : "Revocar permiso"}</Button></div>}
          <form onSubmit={(event) => void registerAuthorization(event)} className="space-y-4 border-t pt-4">
            <div><h3 className="text-sm font-semibold">Registrar permiso explícito</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">Confirma solo consentimiento real y afirmativo para recibir emails de marketing de NUXA. Una compra, el uso del servicio o el email de Stripe no bastan.</p></div>
            <div className="grid gap-3 sm:grid-cols-2"><div className="space-y-1.5"><Label htmlFor="auth-source">Cómo se obtuvo</Label><select id="auth-source" value={source} onChange={(event) => setSource(event.target.value as typeof source)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"><option value="form">Formulario</option><option value="documented_email">Email documentado</option><option value="signed_document">Documento firmado</option></select></div><div className="space-y-1.5"><Label htmlFor="auth-date">Fecha y hora del permiso</Label><Input id="auth-date" type="datetime-local" value={obtainedAt} onChange={(event) => setObtainedAt(event.target.value)} required /></div></div>
            <div className="space-y-1.5"><Label htmlFor="auth-evidence">Referencia a la prueba</Label><textarea id="auth-evidence" value={evidence} onChange={(event) => setEvidence(event.target.value)} minLength={20} maxLength={1000} required rows={3} placeholder="Referencia de archivo, formulario o mensaje que documenta el permiso; no incluyas detalles clínicos." className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm leading-5" /><p className="text-xs text-muted-foreground">{evidence.trim().length}/1000 · mínimo 20 caracteres</p></div>
            <label className="flex cursor-pointer items-start gap-2.5 rounded-md border border-amber-200 bg-amber-50/60 p-3 text-xs leading-5 text-amber-950"><input type="checkbox" checked={attested} onChange={(event) => setAttested(event.target.checked)} className="mt-0.5 h-4 w-4 accent-primary" /><span>Atestiguo que la persona dio permiso explícito para recibir emails comerciales de NUXA. No se infiere del pago ni de la compra.</span></label>
            {authError && <div role="alert" className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{authError.status === 401 ? "Tu sesión de administrador necesita renovarse." : authError.code === "stripe_contacts_schema_pending" ? schemaMessage : authError.message}</div>}
            <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setAuthContact(null)}>Cerrar</Button><Button type="submit" disabled={authBusy || authLoading || !!authError || authSuppressed || authContact.status === "suppressed" || evidence.trim().length < 20 || !obtainedAt || !attested}>{authBusy ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}Registrar autorización</Button></div>
          </form>
        </>}
      </Modal>}

      {reviewDispatch && <Modal title="Revisión final del envío" onClose={() => !dispatchBusy && setReviewDispatch(null)} wide>
        <div className="mb-4 rounded-md border border-amber-300 bg-amber-50/70 p-3 text-sm leading-5 text-amber-950"><strong>No se ha enviado nada.</strong> Revisa exactamente el idioma, asunto, cuerpo y cada dirección. La acción siguiente inicia el envío manual, síncrono, una sola vez.</div>
        <div className="mb-4 grid gap-3 sm:grid-cols-2"><Info label="Idioma" value={reviewDispatch.language === "es" ? "Español" : "English"} /><Info label="De" value="NUXA <avisos@nuxa.life>" /><Info label="Responder a" value="Correo del propietario" /><Info label="Lote" value={`${reviewDispatch.recipients.length} destinatarios`} /></div>
        <div className="mb-4 rounded-md border bg-muted/20 p-4"><p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Asunto exacto</p><p className="mt-1 text-sm font-semibold">{reviewDispatch.subject}</p><p className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Cuerpo exacto</p><p className="mt-1 whitespace-pre-wrap text-sm leading-6">{reviewDispatch.body}</p></div>
        <div className="mb-4 max-h-40 overflow-y-auto rounded-md border"><div className="divide-y">{reviewDispatch.recipients.map((recipient) => <div key={recipient.contactId} className="px-3 py-2 text-sm">{recipient.email}</div>)}</div></div>
        <div className="mb-4 rounded-md border p-4 text-sm leading-6">
          <a className="font-semibold text-primary underline" href={STRIPE_LETTER_CTA.url} target="_blank" rel="noreferrer">{STRIPE_LETTERS[reviewDispatch.language].ctaLabel}</a>
          <p className="mt-3 text-xs text-muted-foreground">{STRIPE_LETTERS[reviewDispatch.language].footer}</p>
          <a className="text-xs text-primary underline" href={`/api/stripe-commercial/unsubscribe?preview=1&language=${reviewDispatch.language}`} target="_blank" rel="noreferrer">{STRIPE_LETTERS[reviewDispatch.language].unsubscribeLabel} · Demo</a>
        </div>
        <p className="mb-4 text-xs leading-5 text-muted-foreground">Cada correo llevará su enlace personal de baja. Esta demostración no da de baja a nadie. Los emails ya aceptados no se pueden retirar.</p>
        <div className="space-y-2"><Label htmlFor="send-confirmation">Para habilitar el envío, escribe ENVIAR</Label><Input id="send-confirmation" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} autoComplete="off" placeholder="ENVIAR" /></div>
        {dispatchError && <p role="alert" className="mt-3 text-sm text-destructive">{dispatchError.status === 401 ? "La sesión de administrador necesita renovarse." : dispatchError.status === 409 ? dispatchError.message : dispatchError.message}</p>}
        {dispatchBusy && <Button className="mt-4" variant="outline" disabled={cancelling} onClick={() => void cancelDispatch(reviewDispatch)}>{cancelling ? "Deteniendo…" : "Detener los pendientes"}</Button>}
        <div className="mt-5 flex flex-col-reverse justify-end gap-2 sm:flex-row"><Button variant="outline" onClick={() => setReviewDispatch(null)} disabled={dispatchBusy}>Volver sin enviar</Button><Button onClick={() => void sendDispatch()} disabled={dispatchBusy || reviewDispatch.status !== "prepared" || confirmation !== "ENVIAR"} className="bg-rose-800 text-white hover:bg-rose-900">{dispatchBusy ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}Enviar ahora · {reviewDispatch.recipients.length}</Button></div>
      </Modal>}

      {detailDispatch && <Modal title="Resultado del envío" onClose={() => setDetailDispatch(null)} wide><DispatchDetail dispatch={detailDispatch} /><div className="mt-5 flex flex-wrap justify-end gap-2">{detailDispatch.status === "running" && <Button variant="outline" onClick={() => void cancelDispatch(detailDispatch)} disabled={dispatchBusy}>Cancelar lo pendiente</Button>}<Button variant="outline" onClick={() => void recoverDispatch(detailDispatch)} disabled={dispatchBusy}><RefreshCw className="mr-2 h-4 w-4" />Actualizar estado</Button><Button onClick={() => setDetailDispatch(null)}>Cerrar</Button></div></Modal>}
    </section>
  );
}

function Metric({ label, value, tone = "default", icon }: { label: string; value: number; tone?: "default" | "amber" | "rose" | "muted" | "green"; icon: React.ReactNode }) {
  const toneClass = { default: "text-foreground bg-primary/10", amber: "text-amber-800 bg-amber-100", rose: "text-rose-800 bg-rose-100", muted: "text-muted-foreground bg-muted", green: "text-emerald-800 bg-emerald-100" }[tone];
  return <Card className="border-border/80 shadow-sm"><CardContent className="flex items-start justify-between gap-2 p-4 sm:p-5"><div className="min-w-0"><p className="text-xs leading-5 text-muted-foreground sm:text-sm">{label}</p><p className="mt-1 font-mono text-2xl font-semibold tracking-tight text-foreground">{value.toLocaleString("es-ES")}</p></div><span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${toneClass}`}>{icon}</span></CardContent></Card>;
}
function Modal({ title, onClose, children, wide = false }: { title: string; onClose: () => void; children: React.ReactNode; wide?: boolean }) {
  return <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/45 p-0 backdrop-blur-[2px] sm:items-center sm:p-5" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section role="dialog" aria-modal="true" aria-labelledby="commercial-dialog-title" className={`max-h-[94dvh] w-full overflow-y-auto rounded-t-xl border bg-background p-4 shadow-xl sm:rounded-xl sm:p-6 ${wide ? "max-w-3xl" : "max-w-xl"}`}><div className="mb-5 flex items-start justify-between gap-4 border-b pb-3"><h2 id="commercial-dialog-title" className="text-lg font-semibold">{title}</h2><Button variant="ghost" size="icon" onClick={onClose} aria-label="Cerrar"><X className="h-4 w-4" /></Button></div>{children}</section></div>;
}
function Info({ label, value }: { label: string; value: string }) { return <div className="rounded-md border bg-muted/20 p-3"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 break-words text-sm font-medium">{value}</p></div>; }
function DispatchHistory({ dispatches, loading, error, busy, onRefresh, onOpen, onRecover, onCancel }: { dispatches: Dispatch[]; loading: boolean; error: ApiError | null; busy: boolean; onRefresh: () => void; onOpen: (dispatch: Dispatch) => void; onRecover: (dispatch: Dispatch) => void; onCancel: (dispatch: Dispatch) => void }) {
  return <Card className="overflow-hidden border-border/80 shadow-sm"><CardHeader className="flex flex-row items-center justify-between border-b bg-muted/20 px-4 py-4 sm:px-5"><div><CardTitle className="text-base">Historial de envíos</CardTitle><CardDescription className="mt-1">Los estados reflejan aceptación del proveedor, no entrega en bandeja.</CardDescription></div><Button variant="outline" size="sm" onClick={onRefresh} disabled={loading || busy}><RefreshCw className={`mr-2 h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />Actualizar</Button></CardHeader><CardContent className="p-0">{loading ? <div className="space-y-3 p-5" aria-busy="true"><div className="h-4 w-40 animate-pulse rounded bg-muted" /><div className="h-14 animate-pulse rounded bg-muted/70" /></div> : error ? <p role="alert" className="p-5 text-sm text-destructive">{error.code === "stripe_contacts_schema_pending" ? "Esquema pendiente: vuelve a publicar la aplicación." : error.message}</p> : dispatches.length === 0 ? <div className="px-6 py-10 text-center"><Mail className="mx-auto mb-2 h-7 w-7 text-muted-foreground" /><p className="text-sm font-medium">No hay envíos preparados</p><p className="mt-1 text-sm text-muted-foreground">Preparar un lote no envía nada hasta completar la revisión final.</p></div> : <div className="divide-y">{dispatches.map((dispatch) => <div key={dispatch.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><p className="font-medium">{dispatch.subject}</p><Badge variant="outline">{dispatch.language.toUpperCase()}</Badge><Badge variant="outline" className={dispatch.status === "completed" ? "border-emerald-200 text-emerald-800" : dispatch.status === "running" ? "border-amber-200 text-amber-900" : ""}>{dispatch.status === "prepared" ? "Preparado · sin enviar" : dispatch.status === "running" ? "En curso" : dispatch.status === "completed" ? "Completado" : "Detenido"}</Badge></div><p className="mt-1 text-xs text-muted-foreground">{dateLabel(dispatch.createdAt)} · {recipientCounts(dispatch.recipients).accepted} aceptados · {recipientCounts(dispatch.recipients).rejected} rechazados · {recipientCounts(dispatch.recipients).skipped} omitidos · {recipientCounts(dispatch.recipients).uncertain} inciertos · {recipientCounts(dispatch.recipients).attempting} intentando · {recipientCounts(dispatch.recipients).pending} pendientes</p></div><div className="flex shrink-0 gap-2"><Button variant="outline" size="sm" onClick={() => onOpen(dispatch)}><Eye className="mr-1.5 h-3.5 w-3.5" />{dispatch.status === "prepared" ? "Revisar para enviar" : "Ver"}</Button>{dispatch.status === "running" && <Button variant="outline" size="sm" onClick={() => onCancel(dispatch)} disabled={busy}>Cancelar</Button>}{(dispatch.status === "running" || dispatch.recipients.some((r) => r.status === "attempting" || r.status === "uncertain")) && <Button variant="outline" size="sm" onClick={() => onRecover(dispatch)} disabled={busy}>Recuperar estado</Button>}</div></div>)}</div>}</CardContent></Card>;
}
function recipientCounts(recipients: DispatchRecipient[]) { return { accepted: recipients.filter((r) => r.status === "accepted").length, rejected: recipients.filter((r) => r.status === "rejected").length, skipped: recipients.filter((r) => r.status === "skipped").length, uncertain: recipients.filter((r) => r.status === "uncertain").length, attempting: recipients.filter((r) => r.status === "attempting").length, pending: recipients.filter((r) => r.status === "pending").length }; }
function DispatchDetail({ dispatch }: { dispatch: Dispatch }) {
  const counts = recipientCounts(dispatch.recipients);
  return <><div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-5"><Count label="Aceptados" value={counts.accepted} detail="No confirma entrega" /><Count label="Rechazados" value={counts.rejected} /><Count label="Omitidos" value={counts.skipped} /><Count label="Inciertos" value={counts.uncertain} detail="No reintentar" /><Count label="Intentando" value={counts.attempting} detail="Resultado desconocido" /></div><p className="mb-3 rounded-md border border-amber-200 bg-amber-50/60 p-3 text-xs leading-5 text-amber-950">Un resultado incierto o «intentando» no debe reenviarse: el proveedor pudo haber aceptado el email. Los emails aceptados no equivalen a entregados.</p><div className="max-h-[45dvh] overflow-auto rounded-md border"><table className="w-full min-w-[520px] text-left text-sm"><thead className="sticky top-0 bg-muted text-xs uppercase text-muted-foreground"><tr><th className="px-3 py-2">Email</th><th className="px-3 py-2">Estado</th><th className="px-3 py-2">Motivo</th></tr></thead><tbody className="divide-y">{dispatch.recipients.map((recipient) => <tr key={recipient.contactId}><td className="px-3 py-2.5">{recipient.email}</td><td className="px-3 py-2.5">{recipient.status === "accepted" ? "Aceptado, no necesariamente entregado" : recipient.status === "attempting" ? "Intentando · resultado desconocido" : recipient.status === "uncertain" ? "Incierto · no reintentar" : recipient.status === "rejected" ? "Rechazado" : recipient.status === "skipped" ? "Omitido" : "Pendiente"}</td><td className="px-3 py-2.5 text-muted-foreground">{recipient.reason || "—"}</td></tr>)}</tbody></table></div></>;
}
function Count({ label, value, detail }: { label: string; value: number; detail?: string }) { return <div className="rounded-md border p-2.5"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 font-mono text-xl font-semibold">{value}</p>{detail && <p className="text-[10px] leading-4 text-muted-foreground">{detail}</p>}</div>; }
