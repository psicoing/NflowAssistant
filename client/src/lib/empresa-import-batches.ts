type EmpresaImportBatchEntry = {
  company: string;
  email: string;
};

export const EMPRESA_IMPORT_BATCH_LABEL = "Email incorporado · lote 3";
export const EMPRESA_IMPORT_BATCH_RED_LABEL = "Email incorporado · bloques 4–8";

// Fixed manifest of the 19 ASCII-email contacts parsed from the lote 3 CSV.
// The non-ASCII comunicación@estrellagalicia.es contact is intentionally excluded.
const lote3Entries: EmpresaImportBatchEntry[] = [
  { company: "Abanca", email: "contacto@abanca.com" },
  { company: "Alcampo", email: "atencioncliente@alcampo.es" },
  { company: "Allianz Seguros", email: "allianz.spain@allianz.es" },
  { company: "Alsa", email: "alsa@alsa.es" },
  { company: "Angelini Pharma", email: "customerservice@angelini.es" },
  { company: "Applus+ Idiada", email: "idiada@idiada.com" },
  { company: "Bayer Iberia", email: "atencionalcliente.es@bayer.com" },
  { company: "Becton Dickinson", email: "info_spain@bd.com" },
  { company: "Boehringer Ingelheim España", email: "hr.es@boehringer-ingelheim.com" },
  { company: "CAF", email: "rrhh@caf.net" },
  { company: "Chiesi España", email: "chiesi.es@chiesi.com" },
  { company: "Cofares", email: "atencionalcliente@cofares.es" },
  { company: "Consum Cooperativa", email: "atencionalcliente@coop.consum.es" },
  { company: "Dentsu España", email: "hr.spain@dentsu.com" },
  { company: "DKV Seguros", email: "atencion.cliente@dkvseguros.es" },
  { company: "Donte Group", email: "info_donte@dontegroup.com" },
  { company: "Ence Energía y Celulosa", email: "info@ence.es" },
  { company: "Esprinet Ibérica", email: "comercial@esprinet.com" },
  { company: "Exolum", email: "info@exolum.com" },
];

// Fixed manifest of the 9 exact company/email pairs for blocks 4–8.
const bloques48Entries: EmpresaImportBatchEntry[] = [
  { company: "Generali España", email: "servicioatencionalcliente.es@generali.com" },
  { company: "Leroy Merlin España", email: "servicios.empresas@leroymerlin.es" },
  { company: "Lidl España", email: "supplier@lidl.es" },
  { company: "Meliá Hotels International", email: "atencionalcliente.reservas@melia.com" },
  { company: "Molins", email: "info@molins.es" },
  { company: "Logista", email: "mkt@logista.es" },
  { company: "Unicaja Banco", email: "atencion.al.cliente@unicaja.es" },
  { company: "Ebro Foods", email: "departamentodepersonal@ebrofoods.es" },
  { company: "Viscofan", email: "info@viscofan.com" },
];

function normalizeCompany(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase().replace(/\s+/g, " ");
}

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

const lote3Pairs = new Set(
  lote3Entries.map(({ company, email }) => `${normalizeCompany(company)}\u0000${normalizeEmail(email)}`),
);
const lote3Companies = new Set(lote3Entries.map(({ company }) => normalizeCompany(company)));
const bloques48Pairs = new Set(
  bloques48Entries.map(({ company, email }) => `${normalizeCompany(company)}\u0000${normalizeEmail(email)}`),
);
const bloques48Companies = new Set(bloques48Entries.map(({ company }) => normalizeCompany(company)));

export type EmpresaImportBatchColor = "green" | "red";

/** Resolves a batch color for exact contact pairs or company-only selection chips. */
export function getEmpresaImportBatchColor(company?: string | null, email?: string | null): EmpresaImportBatchColor | null {
  if (!company?.trim()) return null;
  if (email === null) return null;
  const normalizedCompany = normalizeCompany(company);
  if (email !== undefined && email !== null) {
    if (!email.trim()) return null;
    const pair = `${normalizedCompany}\u0000${normalizeEmail(email)}`;
    if (lote3Pairs.has(pair)) return "green";
    if (bloques48Pairs.has(pair)) return "red";
    return null;
  }
  if (lote3Companies.has(normalizedCompany)) return "green";
  if (bloques48Companies.has(normalizedCompany)) return "red";
  return null;
}

/** Returns the fixed-batch label only when both the company and email match. */
export function getEmpresaImportBatch(company?: string | null, email?: string | null): string | null {
  if (!company?.trim() || !email?.trim()) return null;
  const color = getEmpresaImportBatchColor(company, email);
  if (color === "green") return EMPRESA_IMPORT_BATCH_LABEL;
  if (color === "red") return EMPRESA_IMPORT_BATCH_RED_LABEL;
  return null;
}

/** Used only to mark company-selection controls; contact rows still require the exact pair. */
export function isEmpresaInImportBatchCompany(company?: string | null): boolean {
  return getEmpresaImportBatchColor(company) !== null;
}
