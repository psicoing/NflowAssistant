type EmpresaImportBatchEntry = {
  company: string;
  email: string;
};

export const EMPRESA_IMPORT_BATCH_LABEL = "Email incorporado · lote 3";

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

/** Returns the fixed-batch label only when both the company and email match. */
export function getEmpresaImportBatch(company?: string | null, email?: string | null): string | null {
  if (!company?.trim() || !email?.trim()) return null;
  return lote3Pairs.has(`${normalizeCompany(company)}\u0000${normalizeEmail(email)}`)
    ? EMPRESA_IMPORT_BATCH_LABEL
    : null;
}

/** Used only to mark company-selection controls; contact rows still require the exact pair. */
export function isEmpresaInImportBatchCompany(company?: string | null): boolean {
  return Boolean(company?.trim() && lote3Companies.has(normalizeCompany(company)));
}
