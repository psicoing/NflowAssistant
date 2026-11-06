import type { RequestHandler } from "express";
import type { Pool } from "@neondatabase/serverless";
import { isEmpresaEmail } from "../shared/empresa-email-policy";
import { parseEmpresaCsv } from "../shared/empresa-csv";

export function empresaSimpleImportHandler(pool: Pool): RequestHandler {
  return async (req, res) => {
    if (!req.session.isAdmin) return res.status(401).json({ message: "No autorizado" });
    const rows = req.body?.rows;
    if (!Array.isArray(rows) || !rows.length || rows.length > 5000) {
      return res.status(400).json({ message: "Se requieren entre 1 y 5000 filas." });
    }
    let imported = 0, duplicates = 0, invalid = 0, failed = 0;
    const errors: string[] = [];
    const sizes = new Set(["200k_plus","100k_199999","50k_99999","20k_49999","5k_19999","2k_4999","under_5k","under_2k","pending","unclassified"]);
    for (let index = 0; index < rows.length; index++) {
      const row = rows[index];
      if (!row || !isEmpresaEmail(row.email)) {
        invalid++; errors.push(`Fila ${index + 1}: email vacío o inválido.`); continue;
      }
      try {
        const result = await pool.query(`INSERT INTO empresa_contacts(email,name,company,company_size,company_size_source)
          VALUES($1,$2,$3,$4,'manual') ON CONFLICT(email) DO NOTHING RETURNING id`,
        [row.email.trim().toLowerCase(), typeof row.name === "string" ? row.name.trim() || null : null,
          typeof row.company === "string" ? row.company.trim() || null : null,
          sizes.has(row.companySize) ? row.companySize : "unclassified"]);
        if (result.rowCount) imported++; else duplicates++;
      } catch {
        failed++; errors.push(`Fila ${index + 1}: no se pudo guardar. No se ha enviado ningún correo.`);
      }
    }
    res.status(failed === rows.length ? 503 : 200).json({
      imported, skipped: duplicates + invalid + failed, duplicates, invalid, failed, errors: errors.slice(0,20),
    });
  };
}

export function empresaBulkImportHandler(pool: Pool): RequestHandler {
  return async (req, res) => {
    if (!req.session.isAdmin) return res.status(401).json({ message: "No autorizado" });
    const text = req.body?.text;
    if (typeof text !== "string" || !text.trim()) return res.status(400).json({ message: "Sin contenido" });
    const preview = parseEmpresaCsv(text, "bulk");
    if (preview.total > 5000) return res.status(400).json({ message: "Máximo 5000 filas por importación." });
    if (!preview.rows.length) return res.status(400).json({
      message: "No hay registros válidos para importar.", created: 0, updated: 0,
      skipped: preview.invalid, errors: preview.errors.slice(0,20),
    });
    let created = 0, updated = 0, failed = 0;
    const errors = [...preview.errors];
    for (const row of preview.rows) {
      try {
        const outcome = await upsertEmpresaBulkRow(pool, row.fields);
        if (outcome === "created") created++; else updated++;
      } catch {
        failed++; errors.push(`Línea ${row.line}: no se pudo guardar el contacto.`);
      }
    }
    res.status(failed === preview.rows.length ? 503 : 200).json({
      created,updated,skipped: preview.invalid + failed,failed,
      withEmail: preview.validEmail,withoutEmail: preview.withoutEmail,errors: errors.slice(0,20),
    });
  };
}

/** Preserve the empty-field-only merge and nullable-email contact rules. */
export async function upsertEmpresaBulkRow(pool: Pool, fields: string[]) {
  const [company, rawEmail, phone, address, postalCode, municipio, provincia, employeesRaw, contactArea, priority, source] = fields;
  const email = rawEmail.trim().toLowerCase();
  const employeeMatch = employeesRaw.match(/\d{1,3}(?:\.\d{3})+|\d+/);
  const employeeCount = employeeMatch ? parseInt(employeeMatch[0].replace(/\./g, ""), 10) : null;
  const existing = email
    ? await pool.query("SELECT id FROM empresa_contacts WHERE lower(trim(email))=$1", [email])
    : await pool.query("SELECT id FROM empresa_contacts WHERE email IS NULL AND lower(trim(company))=lower(trim($1))", [company]);
  if (existing.rowCount) {
    await pool.query(`UPDATE empresa_contacts SET
      company=COALESCE(NULLIF(company,''),NULLIF($1,'')),phone=COALESCE(NULLIF(phone,''),NULLIF($2,'')),
      address=COALESCE(NULLIF(address,''),NULLIF($3,'')),postal_code=COALESCE(NULLIF(postal_code,''),NULLIF($4,'')),
      municipio=COALESCE(NULLIF(municipio,''),NULLIF($5,'')),provincia=COALESCE(NULLIF(provincia,''),NULLIF($6,'')),
      employee_count=COALESCE(employee_count,$7),contact_area=COALESCE(NULLIF(contact_area,''),NULLIF($8,'')),
      priority=COALESCE(NULLIF(priority,''),NULLIF($9,'')),source=COALESCE(NULLIF(source,''),NULLIF($10,''))
      WHERE id=$11`,
    [company,phone,address,postalCode,municipio,provincia,employeeCount,contactArea,priority,source,existing.rows[0].id]);
    return "updated" as const;
  }
  await pool.query(`INSERT INTO empresa_contacts(email,company,phone,address,postal_code,municipio,provincia,
    employee_count,contact_area,priority,source,company_size_source)
    VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'manual')`,
  [email || null,company,phone,address,postalCode,municipio,provincia,employeeCount,contactArea,priority,source]);
  return "created" as const;
}
