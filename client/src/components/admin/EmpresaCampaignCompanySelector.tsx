import { useMemo, useState } from "react";
import { Check, Circle, Search, X } from "lucide-react";
import {
  EMPRESA_BATCH_LABELS, EMPRESA_SECTOR_LABELS, filterEmpresaCompanyGroups, groupEmpresaCompanies,
  normalizeEmpresaCompany,
  type EmpresaCompanyContact, type EmpresaGroupBatch, type EmpresaSector,
} from "@/lib/empresa-company-groups";

interface Props {
  contacts: EmpresaCompanyContact[];
  selectedCompanies: string[];
  onChange: (companies: string[]) => void;
  selectedSizes: string[];
  policyAvailable: boolean;
}

const batchClass: Record<EmpresaGroupBatch, string> = {
  green: "bg-emerald-400", red: "bg-red-400", blue: "bg-sky-400", brown: "bg-amber-700",
  previous: "bg-blue-400", none: "bg-slate-500",
};

export default function EmpresaCampaignCompanySelector({
  contacts, selectedCompanies, onChange, selectedSizes, policyAvailable,
}: Props) {
  const [search, setSearch] = useState("");
  const [sector, setSector] = useState<EmpresaSector | "all">("all");
  const [provincia, setProvincia] = useState("all");
  const [municipio, setMunicipio] = useState("all");
  const [batch, setBatch] = useState<EmpresaGroupBatch | "all">("all");
  const [contacted, setContacted] = useState<"all" | "contacted" | "not-contacted">("all");
  const groups = useMemo(() => groupEmpresaCompanies(contacts, policyAvailable, selectedSizes), [contacts, policyAvailable, selectedSizes]);
  const provinces = useMemo(() => Array.from(new Set(groups.flatMap(group => group.provincias))).sort((a, b) => a.localeCompare(b, "es")), [groups]);
  const municipalities = useMemo(() => Array.from(new Set(groups
    .filter(group => provincia === "all" || group.provincias.includes(provincia))
    .flatMap(group => group.municipios))).sort((a, b) => a.localeCompare(b, "es")), [groups, provincia]);
  const filtered = useMemo(() => filterEmpresaCompanyGroups(groups, { search, sector, provincia, municipio, batch, contacted }), [groups, search, sector, provincia, municipio, batch, contacted]);
  const eligibleGroups = filtered.filter(group => group.eligibleRecipients > 0);
  const selectedNormalized = useMemo(() => new Set(selectedCompanies.map(normalizeEmpresaCompany)), [selectedCompanies]);
  const selectedCount = selectedNormalized.size;
  const chosenFromGroup = Array.from(new Set(eligibleGroups.flatMap(group => group.selectionCompanies)));
  const updateSelection = (company: string, checked: boolean) => {
    const key = normalizeEmpresaCompany(company);
    const next = selectedCompanies.filter(value => normalizeEmpresaCompany(value) !== key);
    if (!checked && selectedCount === 1) return;
    const companyNames = groups.find(group => group.normalizedCompany === key)?.selectionCompanies || [company];
    onChange(checked ? [...next, ...companyNames] : next);
  };

  return (
    <section aria-labelledby="empresa-company-selector-title" className="space-y-3 rounded-xl border border-gray-700 bg-gray-900/35 p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 id="empresa-company-selector-title" className="text-xs font-semibold text-gray-100">Empresas destinatarias</h3>
          <p className="mt-1 text-[11px] text-gray-400">
            {selectedCount ? `${selectedCount} ${selectedCount === 1 ? "empresa seleccionada" : "empresas seleccionadas"}` : "Todas las empresas"}
            {" · "}{policyAvailable ? `${eligibleGroups.length} empresas elegibles en esta vista` : "Elegibilidad no disponible"}
          </p>
        </div>
        <button type="button" onClick={() => onChange([])} disabled={!selectedCount}
          className="rounded-md border border-gray-600 px-2.5 py-1.5 text-[11px] text-gray-300 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40">
          Usar todas las empresas
        </button>
      </div>
      <p className="rounded-md border border-sky-400/20 bg-sky-400/5 px-2.5 py-2 text-[10px] leading-relaxed text-gray-300">
        La lista de empresas vacía significa todas las empresas. Los filtros solo sirven para explorar; usa un grupo para cambiar la selección. El punto azul registra un envío aceptado, no confirma entrega ni permiso.
      </p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <label className="relative sm:col-span-2 lg:col-span-1">
          <span className="sr-only">Buscar empresa o área de contacto</span>
          <Search aria-hidden="true" className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-500" />
          <input value={search} onChange={event => setSearch(event.target.value)} placeholder="Buscar empresa o área…"
            className="w-full rounded-md border border-gray-700 bg-gray-950/60 py-2 pl-8 pr-3 text-xs text-gray-100 placeholder:text-gray-500 focus:border-sky-400 focus:outline-none" />
        </label>
        <label className="sr-only" htmlFor="empresa-sector-filter">Sector</label>
        <select id="empresa-sector-filter" value={sector} onChange={event => setSector(event.target.value as EmpresaSector | "all")} className="rounded-md border border-gray-700 bg-gray-950/60 px-2.5 py-2 text-xs text-gray-200 focus:border-sky-400 focus:outline-none">
          <option value="all">Todos los sectores</option>
          {(Object.entries(EMPRESA_SECTOR_LABELS) as [EmpresaSector, string][]).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
        <label className="sr-only" htmlFor="empresa-province-filter">Provincia</label>
        <select id="empresa-province-filter" value={provincia} onChange={event => { setProvincia(event.target.value); setMunicipio("all"); }} className="rounded-md border border-gray-700 bg-gray-950/60 px-2.5 py-2 text-xs text-gray-200 focus:border-sky-400 focus:outline-none">
          <option value="all">Todas las provincias</option>{provinces.map(value => <option key={value} value={value}>{value}</option>)}
        </select>
        <label className="sr-only" htmlFor="empresa-municipality-filter">Municipio</label>
        <select id="empresa-municipality-filter" value={municipio} onChange={event => setMunicipio(event.target.value)} className="rounded-md border border-gray-700 bg-gray-950/60 px-2.5 py-2 text-xs text-gray-200 focus:border-sky-400 focus:outline-none">
          <option value="all">Todos los municipios</option>{municipalities.map(value => <option key={value} value={value}>{value}</option>)}
        </select>
        <label className="sr-only" htmlFor="empresa-batch-filter">Lote o envío previo</label>
        <select id="empresa-batch-filter" value={batch} onChange={event => setBatch(event.target.value as EmpresaGroupBatch | "all")} className="rounded-md border border-gray-700 bg-gray-950/60 px-2.5 py-2 text-xs text-gray-200 focus:border-sky-400 focus:outline-none">
          <option value="all">Todos los lotes</option>{(Object.entries(EMPRESA_BATCH_LABELS) as [EmpresaGroupBatch, string][]).filter(([key]) => key !== "none").map(([key, label]) => <option key={key} value={key}>{label}</option>)}
          <option value="none">{EMPRESA_BATCH_LABELS.none}</option>
        </select>
        <label className="sr-only" htmlFor="empresa-contacted-filter">Estado de envíos</label>
        <select id="empresa-contacted-filter" value={contacted} onChange={event => setContacted(event.target.value as typeof contacted)} className="rounded-md border border-gray-700 bg-gray-950/60 px-2.5 py-2 text-xs text-gray-200 focus:border-sky-400 focus:outline-none">
          <option value="all">Con y sin envíos previos</option><option value="contacted">Envío aceptado registrado</option><option value="not-contacted">Sin envío registrado</option>
        </select>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-gray-400">
        <span>{filtered.length} empresas · {policyAvailable ? `${eligibleGroups.reduce((sum, group) => sum + group.eligibleRecipients, 0)} destinatarios elegibles · ${filtered.filter(group => group.eligibleRecipients === 0).length} empresas sin destinatarios elegibles` : "destinatarios pendientes de comprobar"}{selectedSizes.length ? " con los tamaños elegidos" : ""}</span>
        <button type="button" disabled={!policyAvailable || chosenFromGroup.length === 0} onClick={() => onChange(chosenFromGroup)}
          className="rounded-md border border-sky-400/40 bg-sky-400/10 px-2.5 py-1.5 font-medium text-sky-200 hover:bg-sky-400/20 disabled:cursor-not-allowed disabled:opacity-40">
          Usar este grupo {eligibleGroups.length ? `(${eligibleGroups.length})` : ""}
        </button>
      </div>
      <div role="group" aria-label="Empresas de la vista filtrada" className="max-h-56 overflow-y-auto rounded-lg border border-gray-700/80 bg-gray-950/40">
        {filtered.length === 0 ? <p className="px-3 py-5 text-center text-xs text-gray-500">No hay empresas en esta vista.</p> : filtered.map(group => {
          const selected = selectedNormalized.has(group.normalizedCompany);
          const disabled = !policyAvailable || group.eligibleRecipients === 0;
          return (
            <label key={group.normalizedCompany} className={`flex cursor-pointer items-center gap-2.5 border-b border-gray-800 px-3 py-2 last:border-0 hover:bg-gray-800/60 ${disabled ? "opacity-50" : ""}`}>
              <input type="checkbox" checked={selected} disabled={disabled} onChange={event => updateSelection(group.company, event.target.checked)}
                className="h-3.5 w-3.5 shrink-0 accent-sky-400" />
              <span title={EMPRESA_BATCH_LABELS[group.batch]} aria-label={EMPRESA_BATCH_LABELS[group.batch]} className={`h-2 w-2 shrink-0 rounded-sm ${batchClass[group.batch]}`} />
              <span className="min-w-0 flex-1 truncate text-xs text-gray-200">{group.company}</span>
              {group.previouslyEmailed && <span title="Envío aceptado registrado; no confirma entrega" aria-label="Envío aceptado registrado; no confirma entrega"><Circle className="h-2.5 w-2.5 shrink-0 fill-blue-400 text-blue-400" /></span>}
              <span className="hidden text-[10px] text-gray-500 sm:inline">{EMPRESA_SECTOR_LABELS[group.sector]}</span>
              <span className="w-14 text-right text-[10px] tabular-nums text-gray-400">{policyAvailable ? `${group.eligibleRecipients} eleg.` : "—"}</span>
              {selected && <Check aria-label="Seleccionada" className="h-3 w-3 text-sky-300" />}
            </label>
          );
        })}
      </div>
      {!policyAvailable && <p role="status" className="text-[10px] text-amber-300">Los recuentos y la selección de grupos están desactivados hasta que la política de elegibilidad esté disponible.</p>}
      {selectedCompanies.length > 0 && (
        <details className="group">
          <summary className="flex cursor-pointer list-none items-center gap-1.5 text-[11px] text-gray-400 hover:text-gray-200">
            <span>Revisar {selectedCount} empresas seleccionadas</span><span className="text-gray-600">· expandir para quitar empresas</span>
          </summary>
          <div className="mt-2 max-h-36 space-y-1 overflow-y-auto rounded-md border border-gray-700 p-2">
            {selectedCompanies.map(company => (
              <div key={company} className="flex items-center gap-2 text-xs text-gray-300">
                <span className="min-w-0 flex-1 truncate">{company}</span>
                <button type="button" aria-label={`Quitar ${company}`} title={selectedCount === 1 ? "Selecciona otra empresa o usa todas para vaciar la selección" : `Quitar ${company}`}
                  disabled={selectedCount === 1} onClick={() => updateSelection(company, false)} className="rounded p-1 text-gray-400 hover:bg-gray-800 hover:text-white disabled:opacity-30">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </details>
      )}
    </section>
  );
}
