import assert from "node:assert/strict";
import { parseEmpresaCsv, empresaImportSummary } from "../shared/empresa-csv";
import { isEmpresaEmail, selectEmpresaRecipients } from "../shared/empresa-email-policy";
import { empresaEmailEligibilitySql } from "../server/empresa-email-eligibility";
import { empresaTestApp } from "./lib/empresa-test-app";

const preview = parseEmpresaCsv('\uFEFFemail,nombre,empresa,tamaño\r\nGOOD@EXAMPLE.INVALID,"Ana, D.","Empresa ""Uno""",5k_19999\r\n,Sin correo,Empresa Dos,\r\nmal@,Nombre,Empresa Tres,', "simple");
assert.equal(preview.total, 3);
assert.equal(preview.validEmail, 1);
assert.equal(preview.withoutEmail, 1);
assert.equal(preview.invalid, 1);
assert.equal(preview.rows[0].email, "good@example.invalid");
assert.equal(preview.rows[0].name, "Ana, D.");
assert.equal(preview.rows[0].company, 'Empresa "Uno"');
assert.deepEqual(empresaImportSummary(preview, { imported: 1, skipped: 0 }), { imported: 1, skipped: 2 });
assert.deepEqual(empresaImportSummary(preview, { imported: 0, skipped: 1 }), { imported: 0, skipped: 3 });
assert.equal(parseEmpresaCsv('\n\nemail,nombre,empresa\na@b.invalid,A,B', "simple").validEmail, 1);
assert.equal(parseEmpresaCsv('Empresa;Correo;Nombre\nUno;a@b.invalid;Persona', "simple").rows[0].company, "Uno");
assert.equal(parseEmpresaCsv('email,nombre,empresa\na@b.invalid,"sin cierre,Uno', "simple").invalid, 1);
const bulkHeader = "EMPRESA;EMAIL;TELÉFONO;DIRECCIÓN;CP;MUNICIPIO;PROVINCIA;EMPLEADOS;ÁREA;PRIORIDAD;FUENTE";
const rich = `${bulkHeader}\n"Empresa; A";bulk@example.invalid;123;"calle\nsegunda línea";1;Ciudad;Prov;1.400;RRHH;A;URL\nSolo compañía;;;;;;;;;;URL\n${bulkHeader}\nMala;mal@;;;;;;;;;URL`;
const parsed = parseEmpresaCsv(rich, "bulk");
assert.equal(parsed.total, 3);
assert.equal(parsed.rows.length, 2);
assert.equal(parsed.validEmail, 1);
assert.equal(parsed.withoutEmail, 1);
assert.equal(parsed.invalid, 1);
assert.equal(parsed.rows[0].fields[3], "calle\nsegunda línea");
assert.equal(parseEmpresaCsv("Empresa;;123;;;;;500+;RRHH;A", "bulk").rows[0].fields.length, 11);
assert.equal(parseEmpresaCsv(rich, "simple").rows.length, 0, "Wrong import format must not discard columns silently");
for (const invalid of ["", "a@", "a@b", "a b@c.invalid", "a@b.invalid;other", '"a"@b.invalid']) assert(!isEmpresaEmail(invalid));

const fixture = await empresaTestApp();
const { pool } = fixture;
const server = fixture.app.listen(0, "127.0.0.1");
await new Promise<void>(resolve => server.once("listening", resolve));
const base = `http://127.0.0.1:${(server.address() as {port:number}).port}`;
async function post(path: string, body: unknown, denied = false) {
  const response = await fetch(base + path, { method: "POST",headers: {
    "Content-Type": "application/json",...(denied ? {"x-fixture-auth":"denied"} : {}),
  },body: JSON.stringify(body) });
  return { status: response.status,data: await response.json() };
}
try {
  assert.equal((await post("/api/admin/empresas/import-csv", {rows:preview.rows}, true)).status, 401);
  const imported = await post("/api/admin/empresas/import-csv", { rows: preview.rows });
  assert.equal(imported.data.imported, 1);
  const duplicate = await post("/api/admin/empresas/import-csv", { rows: preview.rows });
  assert.equal(duplicate.data.duplicates, 1);
  const invalid = await post("/api/admin/empresas/import-csv", { rows: [{email:"bad@"}, {email:null}] });
  assert.equal(invalid.data.invalid, 2);
  assert.equal((await post("/api/admin/empresas/import-bulk", {text:rich}, true)).status, 401);
  const richImported = await post("/api/admin/empresas/import-bulk", {text:rich});
  assert.equal(richImported.data.created, 2);
  assert.equal(richImported.data.skipped, 1);
  assert.equal(richImported.data.withoutEmail, 1);
  const before = (await pool.query("SELECT company,address,employee_count FROM empresa_contacts WHERE email='bulk@example.invalid'")).rows[0];
  assert.equal(before.employee_count, 1400);
  const repeat = await post("/api/admin/empresas/import-bulk", {text:'Cambiar;bulk@example.invalid;999;Otra calle;2;Otra;Otra;9999;Otro;B;Otra fuente'});
  assert.equal(repeat.data.updated, 1);
  assert.deepEqual((await pool.query("SELECT company,address,employee_count FROM empresa_contacts WHERE email='bulk@example.invalid'")).rows[0], before);
  assert.equal((await post("/api/admin/empresas/import-bulk", {text:42})).status, 400);
  assert.equal((await post("/api/admin/empresas/import-bulk", {text:"columnas;erróneas"})).status, 400);
  await pool.query(`INSERT INTO empresa_contacts(email,company,company_size,opted_out) VALUES
    ('out@example.invalid','Opted out','5k_19999',true),
    ('bad@','Bad','unclassified',false),
    ('domain@blocked.invalid','Blocked domain','unclassified',false),
    ('suppressed@example.invalid','Suppressed email','unclassified',false),
    ('company@example.invalid','  Empresa   suprimida  ','unclassified',false),
    ('other@example.invalid','Other','2k_4999',false);
    INSERT INTO empresa_suppression_list VALUES('domain','blocked.invalid'),
      ('email','suppressed@example.invalid'),('company','empresa suprimida');`);
  const list = await (await fetch(base + "/api/admin/empresas")).json();
  const selected = selectEmpresaRecipients(list);
  assert.equal(selected.length, 3);
  const actual = (await pool.query(`SELECT ec.id FROM empresa_contacts ec WHERE ${empresaEmailEligibilitySql} ORDER BY ec.id`)).rows;
  assert.deepEqual(selected.map(c => c.id), actual.map(c => c.id));
  assert.equal(selectEmpresaRecipients(list, [], ["5k_19999"]).length, 1);
  assert.equal(selectEmpresaRecipients(list, ['Empresa "Uno"']).length, 1);
  assert.equal(selectEmpresaRecipients([{company:"Unknown",email_campaign_eligible:undefined}]).length, 0);
  assert(list.filter((c: any) => !c.email).every((c: any) => !c.email_campaign_eligible));
  // Last-second permission checks use the same policy as the displayed count.
  const first = selected[0].id;
  await pool.query("UPDATE empresa_contacts SET opted_out=true WHERE id=$1", [first]);
  assert.equal((await pool.query(`SELECT 1 FROM empresa_contacts ec WHERE id=$1 AND ${empresaEmailEligibilitySql}`, [first])).rowCount, 0);
  assert.equal(fixture.state.sendAttempts, 0);
  console.log("PASS: CSV preview BOM/quotes/multiline/headers/10-11 columns, wrong format, missing/invalid emails, real import handlers/admin guard, dedupe and non-destructive merge, persisted null emails, exact campaign counts/suppression/filters/revocation. Development-only temporary schema; zero sends.");
} finally {
  await new Promise<void>(resolve => server.close(() => resolve()));
  await fixture.close();
}
