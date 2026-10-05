import { hasSafetySignal } from "../chat-policy";
import type { Population, ScientificDomain, ScientificQuery } from "./scientific-types";

export type QueryHistory = { content: string; isUser: boolean };
export const normaliseScientificText = (text: string) =>
  text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

// Precautionary text signals, not medical triage or diagnosis. Negated and
// educational mentions may also match: context must still be assessed by NUXA.
export function requiresUrgentHumanSupport(text: string): boolean {
  const value = normaliseScientificText(text);
  return hasSafetySignal(text) ||
    /\b(no vull viure|fer-me mal|matar-me|dolor (?:de|en el) pecho|chest pain|douleur thoracique|douleur (?:a|dans) la poitrine|dolor al pit|no puedo respirar|cannot breathe|can't breathe|je ne peux pas respirer|no puc respirar|he tomado todas las pastillas|sobredosis|overdose|surdose|sobredosi|me amenaza con matarme|threatens to kill me|menace de me tuer|amenaca de matar-me)\b/.test(value);
}

export function hasRecentUrgentSupportNeed(message: string, history: readonly QueryHistory[] = []): boolean {
  return requiresUrgentHumanSupport(message) ||
    history.slice(-6).some(item => item.isUser && requiresUrgentHumanSupport(item.content));
}

const conceptRules: { id: string; domain: ScientificDomain; pattern: RegExp }[] = [
  { id: "anxiety", domain: "mental-health", pattern: /\b(ansied\w*|ansiet\w*|ansios\w*|anxiet\w*|anxious|anxieux|angoix\w*|angoiss\w*)\b/ },
  { id: "panic", domain: "mental-health", pattern: /\b(panic\w*|panico|panique)\b/ },
  { id: "rumination", domain: "clinical-psychology", pattern: /\b(rumia\w*|ruminat\w*|darle vueltas|dejar de pensar|stop thinking|thoughts keep|mes pensees tournent|arreter de penser|deixar de pensar|donar voltes)\b/ },
  { id: "worry", domain: "mental-health", pattern: /\b(preocup\w*|worr\w*|inquiet\w*)\b/ },
  { id: "sleep", domain: "mental-health", pattern: /\b(insomn\w*|dorm\w*|suen\w*|sleep\w*|sommeil|noche\w*|night\w*|nocturn\w*|nuit\w*|nit|nits|tinc son)\b/ },
  { id: "stress", domain: "mental-health", pattern: /\b(estres\w*|stress\w*|presion|pressure|pression|pressio|sobrecarg\w*|workload|surcharg\w*|carrega)\b/ },
  { id: "burnout", domain: "work-organisational", pattern: /\b(burnout|burn out|agotamiento|exhaust\w*|epuis\w*|esgot\w*)\b/ },
  { id: "bullying", domain: "work-organisational", pattern: /\b(acos\w*|humill\w*|bully\w*|mobbing|harcel\w*|assetj\w*)\b/ },
  { id: "breathing", domain: "mental-health", pattern: /\b(respir\w*|breath\w*)\b/ },
  { id: "attention", domain: "neuropsychology", pattern: /\b(atenc\w*|attent\w*|concentr\w*|focus\w*)\b/ },
  { id: "memory", domain: "neuropsychology", pattern: /\b(memori\w*|memory|memoire|olvid\w*|forget\w*|oblid\w*)\b/ },
  { id: "executive-functions", domain: "neuropsychology", pattern: /\b(ejecutiv\w*|executiv\w*|executif\w*|planificar|organizarme|planification)\b/ },
  { id: "language", domain: "neuropsychology", pattern: /\b(afasi\w*|aphasi\w*|lenguaje|langage|llenguatge)\b/ },
  { id: "processing-speed", domain: "cognitive-sciences", pattern: /\b(velocidad de procesamiento|processing speed|vitesse de traitement|velocitat de processament)\b/ },
  { id: "visuospatial", domain: "neuropsychology", pattern: /\b(visuoespacial|visuospatial|visoespacial)\b/ },
  { id: "social-cognition", domain: "cognitive-sciences", pattern: /\b(cognicion social|social cognition|cognition sociale|cognicio social)\b/ },
  { id: "emotional-regulation", domain: "mental-health", pattern: /\b(regulacion emocional|emotion\w* regulation|regulation emotionnelle|regulacio emocional)\b/ },
  { id: "development", domain: "child-adolescent", pattern: /\b(desarrollo infantil|child development|developpement de l'enfant|desenvolupament infantil|neurodesarrollo|neurodevelopment|neurodesenvolupament)\b/ },
  { id: "ageing", domain: "neuropsychology", pattern: /\b(envejec\w*|ageing|aging|vieill\w*|envell\w*)\b/ },
  { id: "brain-injury", domain: "neurology", pattern: /\b(dano cerebral|lesion cerebral|brain injury|lesion cerebrale|dany cerebral|ictus|stroke|avc)\b/ },
  { id: "adhd", domain: "child-adolescent", pattern: /\b(tdah|adhd|deficit d'atencio)\b/ },
  { id: "autism", domain: "child-adolescent", pattern: /\b(autis\w*|autism\w*)\b/ },
  { id: "depression", domain: "mental-health", pattern: /\b(depres\w*|depress\w*)\b/ },
  { id: "grief", domain: "mental-health", pattern: /\b(duelo|grief|bereave\w*|deuil|dol|muerte de|death of|mort de)\b/ },
  { id: "loneliness", domain: "social-psychology", pattern: /\b(soledad|lonel\w*|solitude|solitud)\b/ },
  { id: "relationships", domain: "social-psychology", pattern: /\b(pareja|relaciones|relationship\w*|couple|relacions)\b/ },
  { id: "self-esteem", domain: "mental-health", pattern: /\b(autoestima|self esteem|self-esteem|estime de soi)\b/ },
  { id: "addictions", domain: "addictions", pattern: /\b(adic\w*|addic\w*|dependencia de sustancias|substance use|consum de substancies)\b/ },
  { id: "educational-environment", domain: "educational-psychology", pattern: /\b(escuela|colegio|school|ecole|escola|aprendizaje|learning|apprentissage|aprenentatge)\b/ },
];

const featureRules: Record<string, RegExp> = {
  practical: /\b(tecnica\w*|ejercicio\w*|exercise\w*|exercice\w*|exercici\w*|practic\w*|pratiqu\w*|rapida|rapid\w*)\b/,
  treatment: /\b(tratamiento|terapia|treatment|therapy|therapie|tractament|medic\w*|antidepres\w*)\b/,
  evidence: /\b(fuente\w*|bibliograf\w*|evidenc\w*|source\w*|reference\w*|referenc\w*|fonts|base cientifica|scientific basis|porcentaje)\b/,
  help: /\b(profesional|professional|professionnel|ayuda|help|aide|ajuda)\b/,
  workload: /\b(carga\w*|sobrecarg\w*|plazos|workload|deadline\w*|surcharg\w*|carrega)\b/,
  control: /\b(control|autonomia|autonomy|autonomie)\b/,
  support: /\b(apoyo|support|soutien|suport)\b/,
  prevention: /\b(preven\w*|riesgo\w*|risk\w*|risque\w*|risc\w*|psicosocial\w*|psychosocial\w*)\b/,
  manager: /\b(dirijo|responsable|manager|equipo|team|equipe|equip|rrhh)\b/,
  return: /\b(reincorpor\w*|return|retour|tornar a la feina)\b/,
  shifts: /\b(turnos|shift\w*|horaires|torns)\b/,
};
const workPattern = /\b(trabaj\w*|laboral\w*|jefe|empresa|emplead\w*|work\w*|job|boss|employ\w*|travail\w*|boulot|patron|feina|treball\w*)\b/;
const followUpPattern = /\b(si|yes|oui|tecnica|fuentes?|sources?|referencias?|fonts|mes|mas|more|davantage|profundiza|de donde|where|d'ou|que hago|what can i do|que puc fer|respir\w*)\b/;

function detectConcepts(text: string): string[] {
  const concepts = conceptRules.filter(rule => rule.pattern.test(text)).map(rule => rule.id);
  if (workPattern.test(text) && (concepts.some(id => ["anxiety", "stress", "burnout", "bullying", "sleep"].includes(id)) ||
      featureRules.prevention.test(text) || featureRules.return.test(text) || featureRules.shifts.test(text))) concepts.push("work-stress");
  if (concepts.includes("burnout")) concepts.push("work-stress");
  return Array.from(new Set(concepts));
}

function targetPopulation(text: string, profile?: Record<string, unknown>): Population {
  // Explicit subject age takes precedence over the account owner's age.
  const age = text.match(/\b(?:hijo|hija|nino|nina|nen|nena|fill|filla|enfant|tengo|i am|j'ai|tinc)(?: de)?\s+(\d{1,2})\s*(?:anos|years|ans|anys)?\b/) ??
    text.match(/\b(?:my\s+)?(\d{1,2})[- ]year[- ]old\b/);
  if (age) return Number(age[1]) < 18 ? "children-adolescents" : "adults";
  if (/\b(menor|adolesc\w*|child\w*|teen\w*|enfant\w*|nino|nina|nen|nena|fill|filla)\b/.test(text)) return "children-adolescents";
  const declared = String(profile?.ageRange ?? profile?.age ?? "");
  const lowerAge = declared.match(/\d{1,3}/);
  if (lowerAge) return Number(lowerAge[0]) < 18 ? "children-adolescents" : "adults";
  return "general";
}

export function analyseScientificQuery(message: string, history: readonly QueryHistory[] = [], profile?: Record<string, unknown>): ScientificQuery {
  const recent = history.slice(-6).filter(item => item.isUser);
  const urgent = hasRecentUrgentSupportNeed(message, history);
  let text = normaliseScientificText(message.slice(0, 4000));
  let concepts = detectConcepts(text);
  let followUp = false;
  // Only carry context into short follow-ups, not an explicit new subject.
  if (text.length < 160 && followUpPattern.test(text) && concepts.every(id => id === "breathing")) {
    const prior = [...recent].reverse().find(item => detectConcepts(normaliseScientificText(item.content)).length);
    if (prior) {
      text += ` ${normaliseScientificText(prior.content.slice(0, 1200))}`;
      concepts = detectConcepts(text);
      followUp = true;
    }
  }
  const features = Object.entries(featureRules).filter(([, pattern]) => pattern.test(text)).map(([id]) => id);
  const domains = Array.from(new Set(conceptRules.filter(rule => concepts.includes(rule.id)).map(rule => rule.domain)));
  if (concepts.includes("work-stress") && !domains.includes("work-organisational")) domains.push("work-organisational");
  const complex = concepts.length >= 3 || domains.some(domain => ["neuropsychology", "neurology", "cognitive-sciences"].includes(domain));
  return {
    intent: urgent ? "urgent" : !concepts.length ? "conversation" : features.includes("evidence") ? "evidence-request" : complex ? "complex-question" : "psychological-question",
    concepts, domains, features, followUp, population: targetPopulation(text, profile),
    alternatives: concepts.includes("attention")
      ? ["descanso y sueño", "preocupación o estrés", "condiciones de aprendizaje y entorno", "efectos de medicación o sustancias", "factores evolutivos o médicos que requieren valoración"]
      : concepts.includes("memory") ? ["descanso", "estrés y atención", "medicación", "cambios evolutivos o médicos que requieren valoración"]
      : [],
  };
}
