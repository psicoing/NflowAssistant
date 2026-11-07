import { selectEmpresaRecipients, type EmpresaCampaignContact } from "../../../shared/empresa-email-policy";
import { getEmpresaImportBatchColor, type EmpresaImportBatchColor } from "./empresa-import-batches";

export type EmpresaSector = "restaurants" | "campings" | "hotels" | "industry" | "bankinginsurance" | "health" | "unclassified";
export type EmpresaGroupBatch = EmpresaImportBatchColor | "previous" | "none";
export type EmpresaCompanyContact = EmpresaCampaignContact & {
  id?: number | string;
  email?: string | null;
  contact_area?: string | null;
  provincia?: string | null;
  municipio?: string | null;
  campaigns_sent?: number | string | null;
};

export interface EmpresaCompanyGroup {
  company: string;
  selectionCompanies: string[];
  normalizedCompany: string;
  contacts: EmpresaCompanyContact[];
  eligibleRecipients: number;
  sector: EmpresaSector;
  provincia: string;
  municipio: string;
  provincias: string[];
  municipios: string[];
  batch: EmpresaGroupBatch;
  previouslyEmailed: boolean;
}

export interface EmpresaCompanyFilters {
  sector?: EmpresaSector | "all";
  provincia?: string;
  municipio?: string;
  batch?: EmpresaGroupBatch | "all";
  contacted?: "all" | "contacted" | "not-contacted";
  search?: string;
}

export const normalizeEmpresaCompany = (value: string) =>
  value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLocaleLowerCase().replace(/\s+/g, " ");

export function hasEmpresaAcceptedCampaign(contact: EmpresaCompanyContact): boolean {
  const count = Number(contact.campaigns_sent);
  return Number.isFinite(count) && count > 0;
}

/** History is aggregated over the complete contact set; it is informational, never eligibility. */
export function getEmpresaPreviouslyEmailedCompanies(contacts: EmpresaCompanyContact[]): Set<string> {
  return new Set(contacts.filter(hasEmpresaAcceptedCampaign)
    .map(contact => normalizeEmpresaCompany(contact.company || ""))
    .filter(Boolean));
}

export function hasEmpresaCompanyBeenEmailed(company: string, contacts: EmpresaCompanyContact[]): boolean {
  return getEmpresaPreviouslyEmailedCompanies(contacts).has(normalizeEmpresaCompany(company));
}

export function getEmpresaSector(contactArea?: string | null): EmpresaSector {
  const text = (contactArea || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  if (/\b(restaurante|restaurantes|restaurant|restaurants)\b/.test(text)) return "restaurants";
  if (/\b(camping|campings)\b/.test(text)) return "campings";
  if (/\b(hotel|hoteles|hotels)\b/.test(text)) return "hotels";
  if (/\b(industria|industrial|industry|fabricacion|manufactura)\b/.test(text)) return "industry";
  if (/\b(banca|bancario|bancaria|banking|seguros|aseguradora|insurance)\b/.test(text)) return "bankinginsurance";
  // Occupational health/HR describes the contact's role, not the company's sector.
  if (/\b(sanitario|sanitaria|hospital|clinica|healthcare|farmaceutica|farmaceutico)\b/.test(text) || /\bsector (salud|sanitario)\b/.test(text)) return "health";
  return "unclassified";
}

export function groupEmpresaCompanies(
  contacts: EmpresaCompanyContact[],
  policyAvailable: boolean,
  selectedSizes: string[] = [],
): EmpresaCompanyGroup[] {
  const groups = new Map<string, EmpresaCompanyContact[]>();
  for (const contact of contacts) {
    const company = typeof contact.company === "string" ? contact.company.trim() : "";
    if (!company) continue;
    const key = normalizeEmpresaCompany(company);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(contact);
  }
  const previouslyEmailed = getEmpresaPreviouslyEmailedCompanies(contacts);
  return Array.from(groups, ([normalizedCompany, members]) => {
    const company = members.find(item => item.company?.trim())!.company!.trim();
    const batchColors = members.map(member => getEmpresaImportBatchColor(company, member.email ?? null)).filter(Boolean);
    const batch: EmpresaImportBatchColor | "none" =
      (["green", "red", "blue", "brown"] as const).find(color => batchColors.includes(color)) || "none";
    const first = members[0];
    const recipients = policyAvailable ? selectEmpresaRecipients(members, [], selectedSizes) : [];
    return {
      company, selectionCompanies: Array.from(new Set(members.map(member => member.company!).filter(Boolean))),
      normalizedCompany, contacts: members, eligibleRecipients: recipients.length,
      sector: members.reduce<EmpresaSector>((result, member) => result !== "unclassified" ? result : getEmpresaSector(member.contact_area), "unclassified"),
      provincia: first.provincia?.trim() || "Sin provincia",
      municipio: first.municipio?.trim() || "Sin municipio",
      provincias: Array.from(new Set(members.map(member => member.provincia?.trim() || "Sin provincia"))),
      municipios: Array.from(new Set(members.map(member => member.municipio?.trim() || "Sin municipio"))),
      batch,
      previouslyEmailed: previouslyEmailed.has(normalizedCompany),
    };
  }).sort((a, b) => a.company.localeCompare(b.company, "es"));
}

export function filterEmpresaCompanyGroups(groups: EmpresaCompanyGroup[], filters: EmpresaCompanyFilters): EmpresaCompanyGroup[] {
  const search = (filters.search || "").trim().toLocaleLowerCase();
  return groups.filter(group =>
    (!filters.sector || filters.sector === "all" || group.sector === filters.sector)
    && (!filters.provincia || filters.provincia === "all" || group.provincias.includes(filters.provincia))
    && (!filters.municipio || filters.municipio === "all" || group.municipios.includes(filters.municipio))
    && (!filters.batch || filters.batch === "all" || (filters.batch === "previous" ? group.previouslyEmailed : group.batch === filters.batch))
    && (!filters.contacted || filters.contacted === "all" || (filters.contacted === "contacted" ? group.previouslyEmailed : !group.previouslyEmailed))
    && (!search || group.company.toLocaleLowerCase().includes(search) || group.contacts.some(contact => (contact.contact_area || "").toLocaleLowerCase().includes(search)))
  );
}

export const EMPRESA_SECTOR_LABELS: Record<EmpresaSector, string> = {
  restaurants: "Restaurantes", campings: "Campings", hotels: "Hoteles", industry: "Industria",
  bankinginsurance: "Banca y seguros", health: "Salud", unclassified: "Sin clasificar",
};
export const EMPRESA_BATCH_LABELS: Record<EmpresaGroupBatch, string> = {
  green: "Lote verde", red: "Bloques 4–8", blue: "Lote azul", brown: "Alt Empordà",
  previous: "Envío previo", none: "Sin lote",
};
