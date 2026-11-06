import { isEmpresaEmail } from "./empresa-email-policy";

export type EmpresaCsvMode = "simple" | "bulk";
export interface EmpresaCsvRow {
  line: number;
  email: string | null;
  name?: string;
  company: string;
  companySize?: string;
  /** Fixed-order bulk columns, never shifted or filled with invented values. */
  fields: string[];
}
export interface EmpresaCsvPreview {
  rows: EmpresaCsvRow[];
  total: number;
  validEmail: number;
  withoutEmail: number;
  invalid: number;
  errors: string[];
}

/** Include locally rejected rows, not just rows submitted to the server. */
export function empresaImportSummary(preview: EmpresaCsvPreview, saved: { imported: number; skipped: number }) {
  return {
    imported: saved.imported,
    skipped: saved.skipped + Math.max(0, preview.total - preview.rows.length),
  };
}

/** Quoted delimiters, escaped quotes and multiline cells; malformed records fail closed. */
function readRecords(text: string, delimiter: string) {
  const result: { line: number; fields: string[]; error?: string }[] = [];
  let fields: string[] = [], cell = "", quoted = false, endedQuote = false;
  let bad = false, line = 1, startLine = 1;
  const finish = () => {
    fields.push(cell.trim());
    if (fields.some(Boolean)) result.push({ line: startLine, fields, ...(bad ? { error: "Comillas CSV inválidas" } : {}) });
    fields = []; cell = ""; endedQuote = false; bad = false;
  };
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (char === '"') { quoted = false; endedQuote = true; }
      else { cell += char; if (char === "\n") line++; }
    } else if (char === '"' && !cell.trim() && !endedQuote) {
      cell = ""; quoted = true;
    } else if (char === delimiter) {
      fields.push(cell.trim()); cell = ""; endedQuote = false;
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && text[i + 1] === "\n") i++;
      finish(); line++; startLine = line;
    } else {
      if ((endedQuote && char.trim()) || char === '"') bad = true;
      cell += char;
    }
  }
  if (quoted) bad = true;
  finish();
  return result;
}

function normalizeHeader(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[\s_-]/g, "");
}

export function parseEmpresaCsv(input: string, mode: EmpresaCsvMode): EmpresaCsvPreview {
  const text = input.replace(/^\uFEFF/, "");
  // Choose only outside quotes in the first logical record.
  let quotes = false, semicolons = 0, commas = 0, recordStarted = false;
  for (let i = 0; i < text.length; i++) {
    if (text[i] === '"' && quotes && text[i + 1] === '"') { i++; continue; }
    if (text[i] === '"') quotes = !quotes;
    if (!quotes && /[\r\n]/.test(text[i])) {
      if (recordStarted) break;
      continue;
    }
    if (text[i].trim()) recordStarted = true;
    if (!quotes && text[i] === ";") semicolons++;
    if (!quotes && text[i] === ",") commas++;
  }
  const delimiter = mode === "bulk" || semicolons >= commas ? ";" : ",";
  const records = readRecords(text, delimiter);
  const result: EmpresaCsvPreview = { rows: [], total: 0, validEmail: 0, withoutEmail: 0, invalid: 0, errors: [] };
  let columns = { email: 0, name: 1, company: 2, size: 3 };
  let headerWidth: number | null = null;
  records.forEach((record, index) => {
    const header = record.fields.map(normalizeHeader);
    const emailIndex = header.findIndex(h => ["email", "correo", "correoelectronico"].includes(h));
    if (!record.error && emailIndex >= 0) {
      if (mode === "bulk" && header[0] === "empresa" && emailIndex === 1 && [10,11].includes(header.length)) return;
      if (index === 0 && mode === "simple") {
        columns = {
          email: emailIndex,
          name: header.findIndex(h => ["nombre", "name"].includes(h)),
          company: header.findIndex(h => ["empresa", "company"].includes(h)),
          size: header.findIndex(h => ["tamano", "size", "companysize"].includes(h)),
        };
        headerWidth = [3,4].includes(header.length) ? header.length : -1;
        return;
      }
    }
    result.total++;
    const invalid = (reason: string) => {
      result.invalid++;
      result.errors.push(`Línea ${record.line}: ${reason}`);
    };
    if (record.error) return invalid(record.error);
    const fields = record.fields;
    if (mode === "bulk" && ![10,11].includes(fields.length)) {
      return invalid("Se esperan 10 u 11 campos separados por punto y coma.");
    }
    if (mode === "simple" && (headerWidth ? fields.length !== headerWidth : ![3,4].includes(fields.length))) {
      return invalid("Se esperan email, nombre, empresa y, opcionalmente, tamaño. Para 10/11 campos utiliza Importar registros.");
    }
    const rawEmail = fields[mode === "bulk" ? 1 : columns.email] || "";
    const email = rawEmail.trim().toLowerCase();
    const company = fields[mode === "bulk" ? 0 : columns.company] || "";
    if (!email) {
      result.withoutEmail++;
      if (mode === "simple") {
        result.errors.push(`Línea ${record.line}: sin email; no se importará como destinatario.`);
        return;
      }
      if (!company) return invalid("Sin empresa ni email para identificar el contacto.");
    } else if (!isEmpresaEmail(email)) return invalid("Email con formato inválido; revisa el orden de columnas.");
    else result.validEmail++;
    result.rows.push({
      line: record.line, email: email || null, company,
      name: mode === "simple" ? fields[columns.name] || "" : undefined,
      companySize: mode === "simple" ? fields[columns.size] || "unclassified" : undefined,
      fields: mode === "bulk" ? [...fields, ...(fields.length === 10 ? [""] : [])] : fields,
    });
  });
  return result;
}
