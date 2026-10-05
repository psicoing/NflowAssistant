import type { ScientificDomain } from "./scientific-types";

// Proposed resources from the user's brief. Catalogue inclusion never grants
// copyright permission, proves peer review, or means articles have been indexed.
export interface ProposedJournal {
  name: string;
  domains: ScientificDomain[];
  status: "catalogue-only";
  url: null;
  indexedDocuments: 0;
  access: "not-verified";
}
const journal = (name: string, domains: ScientificDomain[]): ProposedJournal =>
  ({ name, domains, status: "catalogue-only", url: null, indexedDocuments: 0, access: "not-verified" });
export const proposedJournals: readonly ProposedJournal[] = [
  journal("ALOMA", ["educational-psychology", "child-adolescent"]),
  journal("Anuario de Psicología", ["clinical-psychology", "social-psychology"]),
  journal("Anuario de Psicología Jurídica", ["legal-forensic"]),
  journal("Apuntes de Psicología", ["clinical-psychology", "social-psychology"]),
  journal("Clínica y Salud", ["clinical-psychology", "psychotherapy"]),
  journal("Intervención Psicosocial", ["social-intervention"]),
  journal("Papeles del Psicólogo", ["clinical-psychology", "mental-health"]),
  journal("Psicología Educativa", ["educational-psychology"]),
  journal("Revista de Neurología", ["neurology", "neuropsychology"]),
  journal("Revista de Psicología del Trabajo y de las Organizaciones", ["work-organisational"]),
  journal("Revista de Psicopatología y Salud Mental del Niño y del Adolescente", ["psychopathology", "child-adolescent"]),
  journal("Revista Española de Drogodependencias", ["addictions"]),
  journal("Revista de Psicoterapia", ["psychotherapy"]),
  journal("RTS — Revista de Trabajo Social", ["social-intervention"]),
  journal("Revista Catalana de Psicoanàlisi", ["psychoanalysis"]),
  journal("Intercanvis — Papeles de Psicoanálisis", ["psychoanalysis"]),
  journal("Freudiana", ["psychoanalysis"]),
];

export interface BibliographicConnector {
  provider: "PSICODOC" | "ProQuest One Psychology";
  status: "not-configured" | "authorised";
  // Only professional concepts, never original messages/patient histories.
  searchConcepts(concepts: readonly string[]): Promise<{
    status: "not-configured" | "ok";
    records: { title: string; doi: string | null; url: string | null; contentPermission: "metadata-only" | "authorised" }[];
    reason?: string;
  }>;
}

export function createUnconfiguredConnector(provider: BibliographicConnector["provider"]): BibliographicConnector {
  return {
    provider, status: "not-configured",
    async searchConcepts() {
      return { status: "not-configured", records: [], reason: "Requiere acceso/API autorizado y comprobación de permisos. No se ha consultado esta base." };
    },
  };
}
export const bibliographicConnectors = [
  createUnconfiguredConnector("PSICODOC"), createUnconfiguredConnector("ProQuest One Psychology"),
];
