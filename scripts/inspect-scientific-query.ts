import { scientificEvidenceEngine } from "../server/knowledge/scientific-engine";

// Local diagnostic only. Does not call an LLM, write histories or access accounts.
const question = process.argv.slice(2).join(" ") || "Mi hijo de 8 años no se concentra en la escuela. ¿Es TDAH?";
const result = scientificEvidenceEngine.retrieve(question);
console.log(JSON.stringify({
  warning: "Análisis de lenguaje y recuperación documental; no diagnóstico ni respuesta real del modelo.",
  analysis: result.analysis, coverage: result.coverage, uncoveredConcepts: result.uncoveredConcepts,
  selectedSources: result.ranking.map(({ source, score, reasons }) => ({
    id: source.id, title: source.title, url: source.url, evidenceLevel: source.evidenceLevel,
    population: source.population, language: source.language, score, reasons,
  })),
  cache: scientificEvidenceEngine.stats(),
}, null, 2));
