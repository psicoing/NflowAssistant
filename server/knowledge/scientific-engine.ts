import { ScientificKnowledgeIndex, adaptPilotDocuments } from "./scientific-index";
import { analyseScientificQuery, type QueryHistory } from "./scientific-query";
import type { RankedDocument, ScientificRetrieval } from "./scientific-types";

interface CacheEntry { expires: number; ranking: { id: string; score: number; reasons: string[] }[] }
export class ScientificEvidenceEngine {
  private readonly cache = new Map<string, CacheEntry>();
  private hits = 0;
  private misses = 0;
  private requests = 0;
  private skipped = 0;
  private readonly usedSources = new Map<string, number>();

  constructor(
    readonly index: ScientificKnowledgeIndex,
    private readonly ttlMs = 5 * 60_000,
    private readonly maxEntries = 256,
    private readonly now: () => number = Date.now,
  ) {
    if (!Number.isFinite(ttlMs) || ttlMs <= 0 || !Number.isInteger(maxEntries) || maxEntries < 1) throw new Error("Invalid scientific cache limits");
  }

  retrieve(message: string, history: readonly QueryHistory[] = [], profile?: Record<string, unknown>): ScientificRetrieval {
    const analysis = analyseScientificQuery(message, history, profile);
    this.requests++;
    if (analysis.intent === "urgent" || analysis.intent === "conversation") {
      this.skipped++;
      return { analysis, sources: [], ranking: [], coverage: "none", uncoveredConcepts: [...analysis.concepts], cacheHit: false };
    }
    // Key contains concepts/intent/population, NOT text, accounts, age or history.
    const key = JSON.stringify({
      revision: this.index.revision, concepts: [...analysis.concepts].sort(),
      features: [...analysis.features].sort(), intent: analysis.intent, population: analysis.population,
    });
    const cached = this.cache.get(key);
    const cacheHit = !!cached && cached.expires > this.now();
    let ranking: RankedDocument[];
    if (cacheHit) {
      this.hits++;
      this.cache.delete(key);
      this.cache.set(key, cached!);
      ranking = cached!.ranking.flatMap(item => {
        const source = this.index.get(item.id);
        return source ? [{ source, score: item.score, reasons: [...item.reasons] }] : [];
      });
    } else {
      this.misses++;
      this.cache.delete(key);
      ranking = this.index.rank(analysis);
      while (this.cache.size >= this.maxEntries && this.cache.size) this.cache.delete(this.cache.keys().next().value!);
      this.cache.set(key, { expires: this.now() + this.ttlMs, ranking: ranking.map(({ source, score, reasons }) => ({ id: source.id, score, reasons: [...reasons] })) });
    }
    const chosen = ranking.length ? [ranking[0]] : [];
    // Ensure mixed anxiety/work questions receive both contexts, when available.
    for (const concept of analysis.concepts.filter(id => id === "anxiety" || id === "work-stress")) {
      if (!chosen.some(item => item.source.primaryConcepts.includes(concept))) {
        const match = ranking.find(item => item.source.primaryConcepts.includes(concept));
        if (match && !chosen.some(item => item.source.id === match.source.id)) {
          chosen.push(match);
        }
      }
    }
    for (const item of ranking) {
      if (chosen.length >= 3) break;
      if (!chosen.some(existing => existing.source.id === item.source.id)) chosen.push(item);
    }
    const uncoveredConcepts = analysis.concepts.filter(id => !chosen.some(item => item.source.primaryConcepts.includes(id)));
    for (const { source } of chosen) this.usedSources.set(source.id, (this.usedSources.get(source.id) ?? 0) + 1);
    return {
      analysis, sources: chosen.map(item => item.source), ranking: chosen, cacheHit,
      coverage: !chosen.length ? "none" : uncoveredConcepts.length ? "partial" : "covered", uncoveredConcepts,
    };
  }

  stats() {
    for (const [key, entry] of Array.from(this.cache.entries())) if (entry.expires <= this.now()) this.cache.delete(key);
    return {
      requests: this.requests, skipped: this.skipped, cacheHits: this.hits, cacheMisses: this.misses,
      cacheEntries: this.cache.size, maxCacheEntries: this.maxEntries, cacheTtlMs: this.ttlMs,
      documents: this.index.documents.length, revision: this.index.revision,
      sourceSelections: Array.from(this.usedSources.entries()).map(([id, count]) => ({ id, count })).sort((a, b) => b.count - a.count),
      networkRequests: 0,
    };
  }
}

export const scientificEvidenceEngine = new ScientificEvidenceEngine(new ScientificKnowledgeIndex(adaptPilotDocuments()));

export function scientificAnalysisInstructions(result: ScientificRetrieval): string {
  const { analysis } = result;
  if (analysis.intent === "conversation") return "";
  return `ANÁLISIS CONCEPTUAL NO DIAGNÓSTICO — MOTOR CIENTÍFICO INTERNO:
${JSON.stringify({
    intent: analysis.intent, concepts: analysis.concepts, domains: analysis.domains,
    targetPopulation: analysis.population, coverage: result.coverage, unsupportedConcepts: result.uncoveredConcepts,
    contextualAlternatives: analysis.alternatives,
  })}
Los conceptos son señales de lenguaje, no conclusiones sobre la persona. Un síntoma no establece una hipótesis confirmada, una evaluación ni un diagnóstico.
Considera explicaciones alternativas y pregunta lo útil (duración, contexto, descanso, impacto), sin atribuir trastornos ni desplegar un listado de diagnósticos.
Distingue datos empíricos, interpretación teórica y orientación general. No equipares escuelas psicológicas ni infieras eficacia por el nombre de una revista.
La cobertura es documental, no confianza clínica. Cuando sea parcial o nula, no atribuyas a las fuentes conceptos que no respaldan; puedes escuchar y orientar sin fingir evidencia.
Con menores, adapta el lenguaje y no extrapoles guías adultas. Las urgencias prevalecen sobre este análisis.
Comunica de forma accesible y cálida. No expongas una cadena de razonamiento ni fuerces citas en una conversación sencilla.`;
}
