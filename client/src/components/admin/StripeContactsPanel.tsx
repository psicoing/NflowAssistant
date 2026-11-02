import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { AlertCircle, Check, Clock3, Database, LoaderCircle, RefreshCw, Search, ShieldCheck, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import StripeLetterEditor from "@/components/admin/StripeLetterEditor";

type StripeContact = {
  id: number;
  email: string;
  source: "stripe";
  status: "pending_review" | "suppressed";
  importedAt: string;
  lastSeenAt: string;
  canSend: false;
};

type ContactsResponse = {
  contacts: StripeContact[];
  summary: { total: number; pendingReview: number; suppressed: number; sendable: 0 };
};

type ImportResponse = {
  sourceRecords: number;
  validEmailRecords: number;
  uniqueEmails: number;
  duplicateEmailRecords: number;
  invalidEmailRecords: number;
  inserted: number;
  existing: number;
  total: number;
  commercialSendingEnabled: false;
};

type ApiError = Error & { code?: string };

async function readError(response: Response): Promise<ApiError> {
  let payload: { message?: string; code?: string } = {};
  try {
    payload = await response.json();
  } catch {
    // Fall back to a useful status message if the response is not JSON.
  }
  const error = new Error(payload.message || `No se pudo completar la solicitud (${response.status}).`) as ApiError;
  error.code = payload.code;
  return error;
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Fecha no disponible";
  return new Intl.DateTimeFormat("es-ES", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

export default function StripeContactsPanel() {
  const [contacts, setContacts] = useState<StripeContact[]>([]);
  const [summary, setSummary] = useState<ContactsResponse["summary"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [importResult, setImportResult] = useState<ImportResponse | null>(null);
  const [query, setQuery] = useState("");

  const loadContacts = useCallback(async (quiet = false) => {
    if (quiet) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/stripe-contacts", { credentials: "include" });
      if (!response.ok) throw await readError(response);
      const data = (await response.json()) as ContactsResponse;
      setContacts(Array.isArray(data.contacts) ? data.contacts : []);
      setSummary(data.summary);
    } catch (caught) {
      setError(caught instanceof Error ? caught as ApiError : new Error("No se pudieron cargar los contactos.") as ApiError);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadContacts();
  }, [loadContacts]);

  const visibleContacts = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    if (!needle) return contacts;
    return contacts.filter((contact) => contact.email.toLocaleLowerCase().includes(needle));
  }, [contacts, query]);

  const importContacts = async () => {
    setImporting(true);
    setError(null);
    setImportResult(null);
    try {
      const response = await fetch("/api/admin/stripe-contacts/import", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw await readError(response);
      setImportResult((await response.json()) as ImportResponse);
      await loadContacts(true);
    } catch (caught) {
      setError(caught instanceof Error ? caught as ApiError : new Error("No se pudo importar la lista de Stripe.") as ApiError);
    } finally {
      setImporting(false);
    }
  };

  const schemaPending = error?.code === "stripe_contacts_schema_pending";

  return (
    <section className="space-y-5" aria-labelledby="stripe-contacts-title">
      <div className="flex flex-col justify-between gap-4 border-b border-border/70 pb-5 sm:flex-row sm:items-end">
        <div className="max-w-2xl">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            Área comercial · acceso restringido
          </div>
          <h2 id="stripe-contacts-title" className="text-2xl font-semibold tracking-tight text-foreground">Contactos de Stripe</h2>
          <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
            Revisión de direcciones importadas. Una compra no acredita consentimiento para comunicaciones comerciales.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => void loadContacts(true)} disabled={loading || refreshing || importing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Actualizar
          </Button>
          <Button onClick={importContacts} disabled={loading || refreshing || importing} className="bg-slate-900 text-white hover:bg-slate-800">
            {importing ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Database className="mr-2 h-4 w-4" />}
            {importing ? "Importando…" : "Importar desde Stripe"}
          </Button>
        </div>
      </div>

      <div role="note" className="flex items-start gap-3 rounded-lg border border-amber-300/70 bg-amber-50/70 px-4 py-3.5 text-amber-950">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
        <div>
          <p className="text-sm font-semibold">Envío comercial bloqueado para todos los contactos</p>
          <p className="mt-0.5 text-sm leading-5 text-amber-900/80">
            Esta sección permite importar, revisar direcciones y guardar borradores. No se envían mensajes ni se concede consentimiento.
          </p>
        </div>
      </div>

      <StripeLetterEditor />

      {error && (
        <div role="alert" className="flex flex-col gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 sm:flex-row sm:items-start">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">
              {schemaPending ? "La tabla de contactos aún no está disponible" : "No se pudo completar la operación"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {schemaPending
                ? "Vuelve a publicar la aplicación para aplicar el esquema y, después, intenta importar de nuevo."
                : error.message}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => void loadContacts()} disabled={loading}>
            Reintentar
          </Button>
        </div>
      )}

      {importResult && (
        <div role="status" className="rounded-lg border border-emerald-300/70 bg-emerald-50/70 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-emerald-950">
            <Check className="h-4 w-4" /> Importación completada
          </div>
          <p className="mt-1 text-sm leading-5 text-emerald-900/80">
            {importResult.inserted} nuevas · {importResult.existing} ya existentes · {importResult.invalidEmailRecords} direcciones no válidas · {importResult.duplicateEmailRecords} duplicadas.
            {" "}El envío comercial permanece desactivado.
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Metric label="Contactos importados" value={summary?.total ?? 0} icon={<Users className="h-4 w-4" />} />
        <Metric label="Pendientes de revisión" value={summary?.pendingReview ?? 0} tone="amber" icon={<Clock3 className="h-4 w-4" />} />
        <Metric label="Suprimidos" value={summary?.suppressed ?? 0} tone="rose" icon={<ShieldCheck className="h-4 w-4" />} />
        <Metric label="Habilitados para envío" value={0} tone="muted" icon={<ShieldCheck className="h-4 w-4" />} />
      </div>

      <Card className="overflow-hidden border-border/80 shadow-sm">
        <CardHeader className="gap-4 border-b bg-muted/20 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div>
            <CardTitle className="text-base">Lista de contactos</CardTitle>
            <CardDescription className="mt-1">Solo se muestran el email, el estado y las fechas de revisión.</CardDescription>
          </div>
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por email"
              aria-label="Buscar contactos por email"
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-3 p-5" aria-label="Cargando contactos" aria-busy="true">
              <div className="h-4 w-44 animate-pulse rounded bg-muted" />
              <div className="h-12 animate-pulse rounded-md bg-muted/70" />
              <div className="h-12 animate-pulse rounded-md bg-muted/70" />
              <div className="h-12 animate-pulse rounded-md bg-muted/70" />
            </div>
          ) : error && contacts.length === 0 ? (
            <div className="px-6 py-12 text-center text-sm text-muted-foreground">
              No hay datos para mostrar hasta que la conexión vuelva a estar disponible.
            </div>
          ) : visibleContacts.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <Users className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium text-foreground">{query ? "No se encontraron coincidencias" : "Todavía no hay contactos importados"}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {query ? "Prueba con otra dirección de email." : "Importa las direcciones de Stripe para iniciar su revisión."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead className="bg-muted/30 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-5 py-3">Email</th>
                    <th className="px-4 py-3">Origen</th>
                    <th className="px-4 py-3">Estado de revisión</th>
                    <th className="px-4 py-3">Importado</th>
                    <th className="px-5 py-3">Última importación</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/70">
                  {visibleContacts.map((contact) => (
                    <tr key={contact.id} className="transition-colors hover:bg-muted/20">
                      <td className="px-5 py-3.5 font-medium text-foreground">{contact.email}</td>
                      <td className="px-4 py-3.5">
                        <Badge variant="outline" className="border-slate-300 bg-slate-50 font-medium text-slate-700">Stripe</Badge>
                      </td>
                      <td className="px-4 py-3.5">
                        {contact.status === "suppressed" ? (
                          <Badge variant="outline" className="border-rose-200 bg-rose-50 text-rose-800">Suprimido</Badge>
                        ) : (
                          <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-900">Pendiente de revisión</Badge>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-muted-foreground">{formatDate(contact.importedAt)}</td>
                      <td className="px-5 py-3.5 text-muted-foreground">{formatDate(contact.lastSeenAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="border-t px-5 py-3 text-xs text-muted-foreground">
                Mostrando {visibleContacts.length} de {contacts.length} contactos. El envío está bloqueado en todos los casos.
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

function Metric({ label, value, tone = "default", icon }: { label: string; value: number; tone?: "default" | "amber" | "rose" | "muted"; icon: ReactNode }) {
  const toneClass = {
    default: "text-foreground bg-primary/10",
    amber: "text-amber-800 bg-amber-100",
    rose: "text-rose-800 bg-rose-100",
    muted: "text-muted-foreground bg-muted",
  }[tone];
  return (
    <Card className="border-border/80 shadow-sm">
      <CardContent className="flex items-start justify-between gap-2 p-4 sm:p-5">
        <div className="min-w-0">
          <p className="text-xs leading-5 text-muted-foreground sm:text-sm">{label}</p>
          <p className="mt-1 font-mono text-2xl font-semibold tracking-tight text-foreground">{value.toLocaleString("es-ES")}</p>
        </div>
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${toneClass}`}>{icon}</span>
      </CardContent>
    </Card>
  );
}
