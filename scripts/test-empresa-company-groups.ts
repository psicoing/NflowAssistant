import assert from "node:assert/strict";
import {
  filterEmpresaCompanyGroups,
  getEmpresaPreviouslyEmailedCompanies,
  getEmpresaSector,
  groupEmpresaCompanies,
  normalizeEmpresaCompany,
  type EmpresaCompanyContact,
} from "../client/src/lib/empresa-company-groups";
import { selectEmpresaRecipients } from "../shared/empresa-email-policy";

// Pure fixtures only. No database, providers, HTTP requests or real mail.
const contacts: EmpresaCompanyContact[] = [
  { id: 1, company: " Café Uno ", email: "first@example.test", contact_area: "Restaurant / hostaleria", provincia: "Girona", municipio: "Figueres", campaigns_sent: 0, email_campaign_eligible: true },
  { id: 2, company: "CAFE UNO", email: "old@example.test", contact_area: "RR. HH.", campaigns_sent: "2", email_campaign_eligible: false },
  { id: 3, company: "Sin correo", email: null, contact_area: "Restaurant / hostaleria", provincia: "Girona", campaigns_sent: 0, email_campaign_eligible: false },
  { id: 4, company: "Campamento", email: "camp@example.test", contact_area: "Càmping / allotjament turístic", provincia: "Girona", municipio: "Roses", campaigns_sent: "NaN", company_size: "small", email_campaign_eligible: true },
  { id: 5, company: "Fallido", email: "failed@example.test", contact_area: "Dirección de Personas / Salud Laboral y Bienestar Corporativo", campaigns_sent: 0, email_campaign_eligible: false },
  { id: 6, company: "Desconocido", email: "unknown@example.test", campaigns_sent: null },
];

const history = getEmpresaPreviouslyEmailedCompanies(contacts);
assert.deepEqual([...history], ["cafe uno"]);
assert.equal(history.has(normalizeEmpresaCompany("Café Uno")), true);
assert.equal(history.has("fallido"), false);
assert.equal(history.has("campamento"), false);

assert.equal(getEmpresaSector("Restaurant / hostaleria"), "restaurants");
assert.equal(getEmpresaSector("Càmping / allotjament turístic"), "campings");
assert.equal(getEmpresaSector("Dirección / Personas / Industrial"), "industry");
assert.equal(getEmpresaSector("Dirección / Salud Laboral y Bienestar"), "unclassified");
assert.equal(getEmpresaSector("Corporate / HR"), "unclassified");
assert.equal(getEmpresaSector(null), "unclassified");

const groups = groupEmpresaCompanies(contacts, true);
assert.equal(groups.length, 5);
const cafe = groups.find(group => group.normalizedCompany === "cafe uno")!;
assert.equal(cafe.previouslyEmailed, true);
assert.equal(cafe.eligibleRecipients, 1);
assert.deepEqual(cafe.selectionCompanies, [" Café Uno ", "CAFE UNO"]);
assert.equal(selectEmpresaRecipients(contacts, cafe.selectionCompanies).length, cafe.eligibleRecipients);
assert.equal(cafe.contacts.length, 2);

const restaurants = filterEmpresaCompanyGroups(groups, { sector: "restaurants", provincia: "Girona" });
assert.equal(restaurants.length, 2); // Includes company-only entry, not an email recipient.
assert.equal(restaurants.reduce((sum, group) => sum + group.eligibleRecipients, 0), 1);
assert.equal(filterEmpresaCompanyGroups(groups, { contacted: "contacted" }).length, 1);
assert.equal(filterEmpresaCompanyGroups(groups, { sector: "campings", municipio: "Roses" }).length, 1);
assert.equal(filterEmpresaCompanyGroups(groups, { search: "not-a-company" }).length, 0);
assert.ok(groupEmpresaCompanies(contacts, false).every(group => group.eligibleRecipients === 0));
assert.equal(groupEmpresaCompanies(contacts, true, ["small"]).reduce((sum, group) => sum + group.eligibleRecipients, 0), 1);

const batches = groupEmpresaCompanies([
  { company: "Abanca", email: "contacto@abanca.com", campaigns_sent: 0 },
  { company: "Generali España", email: "servicioatencionalcliente.es@generali.com", campaigns_sent: 0 },
  { company: "Grupo ACS", email: "infogrupoacs@grupoacs.com", campaigns_sent: 0 },
  { company: "Restaurant Pensió Fluvià", email: "info@pensiofluvia.com", campaigns_sent: 0 },
], true);
assert.deepEqual(new Set(batches.map(group => group.batch)), new Set(["green", "red", "blue", "brown"]));
assert.ok(batches.every(group => group.eligibleRecipients === 0 && !group.previouslyEmailed));
console.log("PASS: company history dots, classifications, filtering, batch colors, exact-name audience selection and fail-closed eligibility.");
