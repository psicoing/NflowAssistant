import type { AdminUserMetrics, RegistrationMetricPeriod, UserMetricPeriod } from "../../../../shared/admin-user-metrics";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminUserMetricsPanelProps {
  metrics: AdminUserMetrics | null;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

const numberFormat = new Intl.NumberFormat("es-ES");
const count = (value: number | null | undefined) =>
  typeof value === "number" ? numberFormat.format(value) : "—";
const dateFormat = new Intl.DateTimeFormat("es-ES", {
  dateStyle: "medium",
  timeStyle: "short",
});
const formatDate = (value: string | null | undefined) => {
  if (!value) return "Sin fecha de cobertura";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : dateFormat.format(date);
};

function MetricValue({ value }: { value: number | null | undefined }) {
  return <span className="font-mono text-lg font-semibold tabular-nums text-slate-100">{count(value)}</span>;
}

function MetricRow({ label, value, detail }: { label: string; value: number | null | undefined; detail?: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-700/70 py-3 last:border-b-0">
      <div className="min-w-0">
        <div className="text-sm font-medium text-slate-200">{label}</div>
        {detail && <p className="mt-1 text-xs leading-relaxed text-slate-400">{detail}</p>}
      </div>
      <MetricValue value={value} />
    </div>
  );
}

function PeriodTable({ periods }: { periods: UserMetricPeriod[] }) {
  const ordered = [7, 15, 30].map((days) => periods.find((period) => period.days === days));
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[620px] text-left text-sm">
        <caption className="sr-only">Actividad de clientes y administradores por periodo</caption>
        <thead>
          <tr className="border-b border-slate-700 text-xs uppercase tracking-wide text-slate-400">
            <th scope="col" className="py-3 pr-4 font-medium">Actividad</th>
            {[7, 15, 30].map((days) => <th scope="col" key={days} className="px-3 py-3 text-right font-medium">{days} días</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/70">
          {([
            ["Nuevas cuentas de clientes", "newUsers"],
            ["Clientes con inicio de sesión", "customerLogins"],
            ["Administradores con inicio de sesión", "adminLogins"],
            ["Clientes que escribieron en el chat", "chatActiveUsers"],
            ["Mensajes escritos por clientes", "chatUserMessages"],
          ] as const).map(([label, key]) => (
            <tr key={key}>
              <th scope="row" className="py-3 pr-4 font-medium text-slate-200">{label}</th>
              {ordered.map((period, index) => (
                <td key={`${key}-${index}`} className="px-3 py-3 text-right font-mono tabular-nums text-slate-300">
                  {count(period?.[key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 text-xs leading-relaxed text-slate-400">
        Los inicios de sesión son cuentas únicas según su último acceso dentro del periodo. La actividad de chat cuenta autores de mensajes de clientes, no conversaciones.
      </p>
    </div>
  );
}

function RegistrationAuditTable({ periods }: { periods: RegistrationMetricPeriod[] }) {
  const ordered = [7, 15, 30].map((days) => periods.find((period) => period.days === days));
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[620px] text-left text-sm">
        <caption className="sr-only">Operaciones de registro capturadas por periodo</caption>
        <thead>
          <tr className="border-b border-slate-700 text-xs uppercase tracking-wide text-slate-400">
            <th scope="col" className="py-3 pr-4 font-medium">Operaciones registradas</th>
            {[7, 15, 30].map((days) => <th scope="col" key={days} className="px-3 py-3 text-right font-medium">{days} días</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/70">
          {([
            ["Operaciones", "operations"],
            ["Completadas", "successfulOperations"],
            ["Rechazadas", "rejectedOperations"],
            ["Fallidas", "failedOperations"],
            ["Interrumpidas", "interruptedOperations"],
            ["Cuentas creadas", "accountsCreated"],
            ["Fallos de sesión", "sessionFailures"],
          ] as const).map(([label, key]) => (
            <tr key={key}>
              <th scope="row" className="py-3 pr-4 font-medium text-slate-200">{label}</th>
              {ordered.map((period, index) => (
                <td key={`${key}-${index}`} className="px-3 py-3 text-right font-mono tabular-nums text-slate-300">
                  {count(period?.[key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 text-xs leading-relaxed text-slate-400">
        Son eventos operativos registrados; no representan personas ni intentos únicos. La retención es de hasta 30 días.
      </p>
    </div>
  );
}

export default function AdminUserMetricsPanel({ metrics, loading, error, onRefresh }: AdminUserMetricsPanelProps) {
  const updatedAt = metrics ? formatDate(metrics.generatedAt) : null;
  const registrationAudit = metrics?.registrationAudit;
  const revenueLabel = metrics && metrics.totalRevenue !== null && metrics.revenueStatus !== "not_reconciled"
    ? new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(metrics.totalRevenue)
    : "No conciliados";

  return (
    <section aria-labelledby="admin-user-metrics-title" className="mb-8 space-y-4">
      <div className="flex flex-col gap-3 rounded-xl border border-slate-700 bg-slate-900/75 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">Indicadores de cuentas y uso</p>
          <h2 id="admin-user-metrics-title" className="mt-1 text-lg font-semibold text-slate-50">Clientes separados de la actividad interna</h2>
          <p className="mt-1 text-sm text-slate-400" aria-live="polite">
            {updatedAt ? `Datos generados: ${updatedAt}` : loading ? "Cargando indicadores…" : "Sin datos disponibles"}
            {error && metrics ? " · Mostrando la última lectura disponible" : ""}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={onRefresh}
          disabled={loading}
          className="min-h-10 shrink-0 border-slate-600 bg-slate-800 text-slate-100 hover:bg-slate-700"
          aria-label="Actualizar indicadores de administración"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} aria-hidden="true" />
          {loading ? "Actualizando" : "Actualizar"}
        </Button>
      </div>

      {error && (
        <div role="alert" className="rounded-lg border border-amber-700/70 bg-amber-950/40 px-4 py-3 text-sm text-amber-100">
          <p className="font-medium">{error}</p>
          {!metrics && <p className="mt-1 text-amber-200/80">No se mostrarán ceros como sustituto de datos ausentes. Usa Actualizar para volver a consultar.</p>}
        </div>
      )}

      {loading && !metrics && (
        <div className="grid gap-4 lg:grid-cols-2" aria-label="Cargando indicadores" aria-busy="true">
          {[0, 1].map((item) => <div key={item} className="h-56 animate-pulse rounded-xl border border-slate-700 bg-slate-800/70" />)}
        </div>
      )}

      {!loading && !metrics && !error && (
        <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-6 text-sm text-slate-300">
          Los indicadores aparecerán cuando el servidor publique la versión 2 de estas métricas.
        </div>
      )}

      {metrics && (
        <>
          <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            <section aria-labelledby="account-scope-title" className="rounded-xl border border-slate-700 bg-slate-900/65 p-4 sm:p-5">
              <h3 id="account-scope-title" className="mb-1 text-base font-semibold text-slate-100">Cuentas por tipo</h3>
              <p className="mb-2 text-xs text-slate-400">El total incluye todas las cuentas almacenadas.</p>
              <MetricRow label="Total de cuentas" value={metrics.totalUsers} detail="Incluye clientes, administradores y otras cuentas." />
              <MetricRow label="Clientes registrados" value={metrics.registeredUsers} detail="Excluye administradores y partners." />
              <MetricRow label="Administradores" value={metrics.adminUsers} detail="Actividad interna; no se suma como cliente." />
              <MetricRow label="Otras cuentas" value={metrics.otherAccounts} detail="Cuentas que no pertenecen a las categorías anteriores." />
            </section>

            <section aria-labelledby="service-state-title" className="rounded-xl border border-slate-700 bg-slate-900/65 p-4 sm:p-5">
              <h3 id="service-state-title" className="mb-1 text-base font-semibold text-slate-100">Estado del servicio</h3>
              <p className="mb-2 text-xs text-slate-400">Estados de cuenta y uso de clientes.</p>
              <MetricRow label="Suscripciones activas" value={metrics.activeSubscriptions} detail="Estado activo en base de datos y no vencido; no confirma por sí solo un pago en Stripe." />
              <MetricRow label="Pruebas" value={metrics.trialUsers} />
              <MetricRow label="Pruebas verificadas" value={metrics.verifiedTrialUsers} detail="Solo marcas del nuevo flujo de verificación por email y teléfono." />
              <MetricRow label="Pagos pendientes" value={metrics.pendingPayments} />
              <MetricRow label="Estados activos vencidos" value={metrics.expiredActiveStatuses} detail="Cuentas con estado activo cuya fecha ya venció." />
              <MetricRow label="Conversaciones de clientes" value={metrics.totalConversations} detail="Conversaciones propiedad de cuentas cliente; no incluye actividad administrativa." />
              <div className="mt-4 rounded-lg border border-amber-700/60 bg-amber-950/30 p-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-amber-100">Ingresos</span>
                  <span className="text-sm font-semibold text-amber-100">{revenueLabel}</span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-amber-200/80">
                  No hay una cifra de ingresos conciliada disponible. El estado de suscripción no equivale a ingreso real.
                </p>
              </div>
            </section>
          </div>

          <section aria-labelledby="period-activity-title" className="rounded-xl border border-slate-700 bg-slate-900/65 p-4 sm:p-5">
            <h3 id="period-activity-title" className="text-base font-semibold text-slate-100">Actividad por periodo</h3>
            <p className="mb-3 mt-1 text-xs text-slate-400">Cuentas y actividad de clientes se muestran por separado de los accesos de administración.</p>
            <PeriodTable periods={metrics.periods || []} />
          </section>

          <section aria-labelledby="registration-audit-title" className="rounded-xl border border-slate-700 bg-slate-900/65 p-4 sm:p-5">
            <div className="mb-4">
              <h3 id="registration-audit-title" className="text-base font-semibold text-slate-100">Auditoría de registros</h3>
              {registrationAudit?.available && registrationAudit.coverageStartedAt ? (
                <p className="mt-1 text-xs text-slate-400">Cobertura desde {formatDate(registrationAudit.coverageStartedAt)} · Retención de hasta 30 días.</p>
              ) : (
                <p className="mt-1 text-sm text-amber-200">
                  {registrationAudit?.available
                    ? "La auditoría está disponible, pero no hay fecha de inicio de cobertura. Los periodos sin cobertura no deben interpretarse como cero fallos."
                    : "Auditoría no disponible o sin cobertura confirmada. No se muestran ceros históricos como si fueran ausencia de fallos."}
                </p>
              )}
            </div>
            {registrationAudit?.available && registrationAudit.coverageStartedAt ? (
              <RegistrationAuditTable periods={registrationAudit.periods || []} />
            ) : (
              <p className="rounded-lg border border-slate-700 bg-slate-800/50 p-4 text-sm text-slate-300">
                Los conteos de operaciones solo son interpretables desde el inicio de cobertura indicado por el servidor.
              </p>
            )}
          </section>

          <section aria-labelledby="monthly-history-title" className="rounded-xl border border-slate-700 bg-slate-900/65 p-4 sm:p-5">
            <h3 id="monthly-history-title" className="text-base font-semibold text-slate-100">Evolución mensual de cuentas</h3>
            <p className="mb-4 mt-1 text-xs leading-relaxed text-slate-400">
              Instantánea mensual de las cuentas que siguen existiendo; no es un historial inmutable de altas.
            </p>
            {metrics.history?.length ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[360px] text-left text-sm">
                  <caption className="sr-only">Instantáneas mensuales de cuentas supervivientes</caption>
                  <thead><tr className="border-b border-slate-700 text-xs uppercase tracking-wide text-slate-400">
                    <th scope="col" className="py-3 pr-4 font-medium">Mes</th>
                    <th scope="col" className="px-3 py-3 text-right font-medium">Nuevas en la instantánea</th>
                    <th scope="col" className="px-3 py-3 text-right font-medium">Acumuladas supervivientes</th>
                  </tr></thead>
                  <tbody className="divide-y divide-slate-700/70">
                    {metrics.history.map((month) => (
                      <tr key={month.month}>
                        <th scope="row" className="py-3 pr-4 font-medium text-slate-200">{month.month}</th>
                        <td className="px-3 py-3 text-right font-mono tabular-nums text-slate-300">{count(month.newUsers)}</td>
                        <td className="px-3 py-3 text-right font-mono tabular-nums text-slate-300">{count(month.cumulativeUsers)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <p className="text-sm text-slate-400">No hay instantáneas mensuales disponibles.</p>}
          </section>
        </>
      )}
    </section>
  );
}
