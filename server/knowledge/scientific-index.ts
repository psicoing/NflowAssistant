import { createHash } from "node:crypto";
import { pilotSources } from "./pilot-sources";
import type { EvidenceLevel, RankedDocument, ScientificDocument, ScientificQuery } from "./scientific-types";

const primary: Record<string, string[]> = {
  E01: ["anxiety"], E02: ["anxiety", "worry"], E03: ["panic"], E04: ["anxiety", "panic"],
  E05: ["breathing"], E06: ["sleep"], E07: ["stress"], E08: ["anxiety", "panic"],
  E09: ["stress"], E10: ["work-stress"], E11: ["burnout"], E12: ["work-stress"],
  E13: ["work-stress"], E14: ["work-stress"], E15: ["work-stress"], E16: ["bullying"],
};
const secondary: Record<string, string[]> = {
  E01: ["worry"], E02: ["attention", "sleep", "rumination"], E03: ["anxiety"],
  E04: ["stress"], E05: ["anxiety", "stress", "work-stress"],
  E06: ["anxiety", "stress", "work-stress"], E07: ["sleep", "attention", "worry", "work-stress"],
  E08: ["worry"], E09: ["anxiety", "work-stress"], E10: ["bullying", "burnout"],
  E11: ["work-stress"], E12: ["stress"], E13: ["stress"], E14: ["bullying"],
  E15: ["stress"], E16: ["work-stress"],
};

export function adaptPilotDocuments(): ScientificDocument[] {
  return pilotSources.map((source): ScientificDocument => {
    const dates = source.publicationDate?.match(/\b\d{4}\b/g)?.map(Number) ?? [];
    return {
      ...source, topics: [...source.topics], tags: [...source.tags],
      authors: [], year: dates[0] ?? null, updatedYear: dates.length > 1 ? dates[dates.length - 1] : null,
      journal: null, doi: null, language: source.id === "E12" ? "es" : "en", summaryLanguage: "es",
      domains: source.topics.length === 1 && source.topics[0] === "work-stress"
        ? ["work-organisational"] : source.id === "E08" ? ["clinical-psychology", "psychotherapy"] : ["mental-health"],
      population: source.id === "E08" ? "adults" : "general",
      primaryConcepts: primary[source.id] ?? [], secondaryConcepts: secondary[source.id] ?? [],
      keywords: [...source.tags, ...(primary[source.id] ?? [])],
      evidenceLevel: source.kind === "clinical-guideline" ? "guideline" : "authoritative-health-guidance",
      methodologicalQuality: null, appraisalNote: null, sampleSize: null,
      replication: "not-established", consistency: "not-established",
      accessStatus: "public-summary", contentRights: "original-editorial-summary",
      rightsNote: "Síntesis editorial original de la página pública comprobada; no se copia ni indexa su texto completo.",
      indexedAt: new Date().toISOString(), disabled: false, obsolete: false,
    };
  });
}

const hierarchy: Record<EvidenceLevel, number> = {
  guideline: 8, "authoritative-health-guidance": 7, "systematic-review": 6,
  "peer-reviewed-research": 5, "professional-journal": 4, "academic-reference": 3,
  "professional-consensus": 2, "theoretical-literature": 1, unappraised: 0,
};

export function canRetrieveDocument(source: ScientificDocument): boolean {
  if (source.disabled || source.obsolete || !source.summary.trim()) return false;
  if (["restricted", "unconfirmed"].includes(source.accessStatus)) return false;
  if (!["original-editorial-summary", "authorised-content"].includes(source.contentRights)) return false;
  if (!source.rightsNote.trim()) return false;
  if (source.methodologicalQuality !== null &&
      (!Number.isFinite(source.methodologicalQuality) || source.methodologicalQuality < 0 ||
       source.methodologicalQuality > 1 || !source.appraisalNote)) return false;
  return true;
}

function freeze<T>(value: T): T {
  if (value && typeof value === "object") {
    for (const item of Object.values(value)) freeze(item);
    Object.freeze(value);
  }
  return value;
}

export class ScientificKnowledgeIndex {
  readonly documents: readonly ScientificDocument[];
  readonly revision: string;
  private readonly byId: Map<string, ScientificDocument>;

  constructor(documents: readonly ScientificDocument[]) {
    const ids = new Set<string>();
    const dois = new Set<string>();
    for (const source of documents) {
      if (!/^E\d{2,}$/.test(source.id)) throw new Error("Scientific document identifiers must use E followed by at least two digits");
      if (ids.has(source.id)) throw new Error(`Duplicate scientific document: ${source.id}`);
      ids.add(source.id);
      const url = new URL(source.url);
      if (url.protocol !== "https:" || url.username || url.password) throw new Error("Scientific source URL must be HTTPS without credentials");
      if (!source.title || !source.publisher || !source.verifiedAt || !source.indexedAt) throw new Error("Incomplete source provenance");
      if (source.year !== null && (!Number.isInteger(source.year) || source.year > new Date().getUTCFullYear())) throw new Error("Invalid scientific publication year");
      if (source.sampleSize !== null && (!Number.isInteger(source.sampleSize) || source.sampleSize < 1)) throw new Error("Invalid study sample size");
      if (source.doi !== null) {
        const doi = source.doi.toLowerCase();
        if (!/^10\.\d{4,9}\/\S+$/.test(doi) || dois.has(doi)) throw new Error("Invalid or duplicate DOI");
        dois.add(doi);
      }
    }
    // Clone before freezing: callers cannot mutate the corpus or cached results.
    this.documents = freeze(documents.map(source => JSON.parse(JSON.stringify(source)) as ScientificDocument));
    this.byId = new Map(this.documents.map(source => [source.id, source]));
    this.revision = createHash("sha256").update(JSON.stringify(this.documents)).digest("hex").slice(0, 16);
  }

  get(id: string): ScientificDocument | undefined { return this.byId.get(id); }

  rank(query: ScientificQuery): RankedDocument[] {
    if (query.intent === "urgent" || query.intent === "conversation") return [];
    return this.documents.filter(source => {
      if (!canRetrieveDocument(source)) return false;
      if (query.population === "children-adolescents" && source.population === "adults") return false;
      if (query.population === "adults" && source.population === "children-adolescents") return false;
      // Occupational guidance is not automatically relevant to school/family bullying.
      if (source.topics.length === 1 && source.topics[0] === "work-stress" && !query.concepts.includes("work-stress")) return false;
      return query.concepts.some(id => source.primaryConcepts.includes(id) || source.secondaryConcepts.includes(id));
    }).map(source => {
      const main = query.concepts.filter(id => source.primaryConcepts.includes(id));
      const related = query.concepts.filter(id => source.secondaryConcepts.includes(id));
      const featureMatches = source.tags.filter(tag => query.features.includes(tag));
      const exactPopulation = source.population !== "general" && source.population === query.population;
      const age = source.updatedYear ?? source.year;
      const recency = age === null ? 0 : Math.max(0, 2 - (new Date().getUTCFullYear() - age) * 0.2);
      const quality = source.methodologicalQuality === null ? 0 : source.methodologicalQuality * 2;
      // Sample size alone is not quality. Only a documented study appraisal
      // permits this small, bounded contribution.
      const sample = source.sampleSize && source.appraisalNote &&
        source.evidenceLevel === "peer-reviewed-research" ? Math.min(1, Math.log10(source.sampleSize) / 4) : 0;
      const score = main.length * 14 + related.length * 4 + Math.min(featureMatches.length * 3, 9)
        + hierarchy[source.evidenceLevel] + (exactPopulation ? 3 : 0) + recency + quality
        + (source.replication === "supported" ? 1 : 0) + (source.consistency === "supported" ? 1 : 0) + sample;
      const reasons = [
        ...main.map(id => `concepto principal: ${id}`), ...related.map(id => `contexto relacionado: ${id}`),
        `tipo de evidencia: ${source.evidenceLevel}`,
        source.methodologicalQuality === null ? "calidad metodológica no evaluada" : "valoración metodológica documentada",
        source.population === "general" ? "población general; comprobar aplicabilidad" : `población: ${source.population}`,
        age === null ? "fecha de publicación desconocida" : `año disponible: ${age}`,
      ];
      return { source, score, reasons };
    }).sort((a, b) => b.score - a.score || a.source.id.localeCompare(b.source.id));
  }
}
