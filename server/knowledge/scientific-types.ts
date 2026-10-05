import type { EvidenceSource } from "./pilot-sources";

export const scientificDomains = [
  "clinical-psychology", "psychopathology", "neuropsychology", "neurology",
  "child-adolescent", "educational-psychology", "social-psychology", "work-organisational",
  "legal-forensic", "psychotherapy", "psychoanalysis", "addictions",
  "social-intervention", "mental-health", "cognitive-sciences",
] as const;
export type ScientificDomain = typeof scientificDomains[number];
export type Population = "general" | "adults" | "children-adolescents";
export type EvidenceLevel =
  | "guideline" | "authoritative-health-guidance" | "systematic-review"
  | "peer-reviewed-research" | "professional-journal" | "academic-reference"
  | "professional-consensus" | "theoretical-literature" | "unappraised";

export interface ScientificDocument extends EvidenceSource {
  authors: string[];
  year: number | null;
  updatedYear: number | null;
  journal: string | null;
  doi: string | null;
  language: "es" | "en" | "fr" | "ca";
  summaryLanguage: "es" | "en" | "fr" | "ca";
  domains: ScientificDomain[];
  population: Population;
  primaryConcepts: string[];
  secondaryConcepts: string[];
  keywords: string[];
  evidenceLevel: EvidenceLevel;
  // Unknown is explicit. An institutional domain is NOT a study appraisal.
  methodologicalQuality: number | null; // 0..1, only with documented appraisal
  appraisalNote: string | null;
  sampleSize: number | null;
  replication: "supported" | "not-established";
  consistency: "supported" | "not-established";
  accessStatus: "public-summary" | "open-access" | "licensed" | "restricted" | "unconfirmed";
  contentRights: "original-editorial-summary" | "authorised-content" | "metadata-only" | "unconfirmed";
  rightsNote: string;
  indexedAt: string;
  disabled: boolean;
  obsolete: boolean;
}

export type QueryIntent = "conversation" | "psychological-question" | "complex-question" | "evidence-request" | "urgent";
export interface ScientificQuery {
  intent: QueryIntent;
  concepts: string[];
  domains: ScientificDomain[];
  population: Population;
  features: string[];
  followUp: boolean;
  alternatives: string[];
}

export interface RankedDocument {
  source: ScientificDocument;
  score: number;
  reasons: string[];
}

export interface ScientificRetrieval {
  analysis: ScientificQuery;
  sources: ScientificDocument[];
  ranking: RankedDocument[];
  coverage: "none" | "partial" | "covered";
  uncoveredConcepts: string[];
  cacheHit: boolean;
}
