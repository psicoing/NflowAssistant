import type { InternationalPage, Market } from "../types";

export const marketSources: Record<Market, InternationalPage["sources"]> = {
  es: [
    { label: "OMS: salud mental", href: "https://www.who.int/es/news-room/fact-sheets/detail/mental-health-strengthening-our-response" },
    { label: "Ministerio de Sanidad: Línea 024", href: "https://www.sanidad.gob.es/linea024/home.htm" },
  ],
  "en-us": [
    { label: "NIMH: caring for your mental health", href: "https://www.nimh.nih.gov/health/topics/caring-for-your-mental-health" },
    { label: "988 Suicide & Crisis Lifeline", href: "https://988lifeline.org/" },
  ],
  "en-gb": [
    { label: "NHS: mental health", href: "https://www.nhs.uk/mental-health/" },
    { label: "Samaritans: contact us", href: "https://www.samaritans.org/how-we-can-help/contact-samaritan/" },
  ],
  fr: [
    { label: "Assurance Maladie: santé mentale", href: "https://www.ameli.fr/assure/sante/themes/sante-mentale" },
    { label: "3114: numéro national de prévention du suicide", href: "https://3114.fr/" },
  ],
};

export const topicSources: Record<string, Record<Market, InternationalPage["sources"][number]>> = {
  wellbeing: {
    es: { label: "OMS: salud mental", href: "https://www.who.int/es/news-room/fact-sheets/detail/mental-health-strengthening-our-response" },
    "en-us": { label: "NIMH: mental health information", href: "https://www.nimh.nih.gov/health/topics" },
    "en-gb": { label: "NHS: mental health", href: "https://www.nhs.uk/mental-health/" },
    fr: { label: "OMS: santé mentale", href: "https://www.who.int/fr/news-room/fact-sheets/detail/mental-health-strengthening-our-response" },
  },
  anxiety: {
    es: { label: "OMS: trastornos de ansiedad", href: "https://www.who.int/es/news-room/fact-sheets/detail/anxiety-disorders" },
    "en-us": { label: "NIMH: anxiety disorders", href: "https://www.nimh.nih.gov/health/topics/anxiety-disorders" },
    "en-gb": { label: "NHS: generalised anxiety disorder", href: "https://www.nhs.uk/mental-health/conditions/generalised-anxiety-disorder/overview/" },
    fr: { label: "OMS: troubles anxieux", href: "https://www.who.int/fr/news-room/fact-sheets/detail/anxiety-disorders" },
  },
  "sleep-stress": {
    es: { label: "NHS: consejos para dormir mejor", href: "https://www.nhs.uk/every-mind-matters/mental-wellbeing-tips/self-help-cbt-techniques/sleep/" },
    "en-us": { label: "CDC: about sleep", href: "https://www.cdc.gov/sleep/about/index.html" },
    "en-gb": { label: "NHS: insomnia", href: "https://www.nhs.uk/conditions/insomnia/" },
    fr: { label: "Assurance Maladie: insomnie", href: "https://www.ameli.fr/assure/sante/themes/insomnie" },
  },
  "work-stress": {
    es: { label: "INSST: riesgos psicosociales", href: "https://www.insst.es/materias/riesgos/riesgos-psicosociales" },
    "en-us": { label: "NIOSH: stress at work", href: "https://www.cdc.gov/niosh/docs/99-101/default.html" },
    "en-gb": { label: "HSE: management standards for work-related stress", href: "https://www.hse.gov.uk/stress/standards/" },
    fr: { label: "INRS: stress au travail", href: "https://www.inrs.fr/risques/stress/ce-qu-il-faut-retenir.html" },
  },
  grief: {
    es: { label: "NHS: duelo y pérdida", href: "https://www.nhs.uk/mental-health/feelings-symptoms-behaviours/feelings-and-symptoms/grief-bereavement-loss/" },
    "en-us": { label: "NIMH: caring for your mental health", href: "https://www.nimh.nih.gov/health/topics/caring-for-your-mental-health" },
    "en-gb": { label: "NHS: grief and bereavement", href: "https://www.nhs.uk/mental-health/feelings-symptoms-behaviours/feelings-and-symptoms/grief-bereavement-loss/" },
    fr: { label: "OMS: santé mentale", href: "https://www.who.int/fr/news-room/fact-sheets/detail/mental-health-strengthening-our-response" },
  },
  loneliness: {
    es: { label: "NHS: soledad", href: "https://www.nhs.uk/mental-health/feelings-symptoms-behaviours/feelings-and-symptoms/loneliness/" },
    "en-us": { label: "CDC: social connectedness", href: "https://www.cdc.gov/social-connectedness/about/index.html" },
    "en-gb": { label: "NHS: loneliness", href: "https://www.nhs.uk/mental-health/feelings-symptoms-behaviours/feelings-and-symptoms/loneliness/" },
    fr: { label: "OMS: santé mentale", href: "https://www.who.int/fr/news-room/fact-sheets/detail/mental-health-strengthening-our-response" },
  },
  "self-esteem": {
    es: { label: "NHS: bienestar mental", href: "https://www.nhs.uk/mental-health/self-help/tips-and-support/mental-wellbeing/" },
    "en-us": { label: "NIMH: caring for your mental health", href: "https://www.nimh.nih.gov/health/topics/caring-for-your-mental-health" },
    "en-gb": { label: "NHS: mental wellbeing", href: "https://www.nhs.uk/mental-health/self-help/tips-and-support/mental-wellbeing/" },
    fr: { label: "Assurance Maladie: santé mentale", href: "https://www.ameli.fr/assure/sante/themes/sante-mentale" },
  },
  "relationship-breakup": {
    es: { label: "Ministerio de Igualdad: atención a víctimas de violencia contra las mujeres", href: "https://violenciagenero.igualdad.gob.es/informacionUtil/recursos/telefono016/" },
    "en-us": { label: "Office on Women's Health: relationships and safety", href: "https://womenshealth.gov/relationships-and-safety" },
    "en-gb": { label: "NHS: domestic abuse", href: "https://www.nhs.uk/live-well/getting-help-for-domestic-violence/" },
    fr: { label: "Service-Public.fr: violences conjugales", href: "https://www.service-public.fr/particuliers/vosdroits/F12544" },
  },
  boundaries: {
    es: { label: "OMS: salud mental", href: "https://www.who.int/es/news-room/fact-sheets/detail/mental-health-strengthening-our-response" },
    "en-us": { label: "NIMH: caring for your mental health", href: "https://www.nimh.nih.gov/health/topics/caring-for-your-mental-health" },
    "en-gb": { label: "NHS: mental wellbeing", href: "https://www.nhs.uk/mental-health/self-help/tips-and-support/mental-wellbeing/" },
    fr: { label: "Assurance Maladie: santé mentale", href: "https://www.ameli.fr/assure/sante/themes/sante-mentale" },
  },
  "teen-anxiety": {
    es: { label: "NIMH: salud mental infantil y adolescente", href: "https://www.nimh.nih.gov/health/topics/child-and-adolescent-mental-health" },
    "en-us": { label: "NIMH: child and adolescent mental health", href: "https://www.nimh.nih.gov/health/topics/child-and-adolescent-mental-health" },
    "en-gb": { label: "NHS: mental health in children and young people", href: "https://www.nhs.uk/mental-health/children-and-young-adults/" },
    fr: { label: "OMS: santé mentale des adolescents", href: "https://www.who.int/news-room/fact-sheets/detail/adolescent-mental-health" },
  },
  "emotional-exhaustion": {
    es: { label: "OMS: el burnout, un fenómeno ocupacional", href: "https://www.who.int/news/item/28-05-2019-burn-out-an-occupational-phenomenon-international-classification-of-diseases" },
    "en-us": { label: "WHO: burnout as an occupational phenomenon", href: "https://www.who.int/news/item/28-05-2019-burn-out-an-occupational-phenomenon-international-classification-of-diseases" },
    "en-gb": { label: "WHO: burnout as an occupational phenomenon", href: "https://www.who.int/news/item/28-05-2019-burn-out-an-occupational-phenomenon-international-classification-of-diseases" },
    fr: { label: "OMS : le burn-out, phénomène professionnel", href: "https://www.who.int/news/item/28-05-2019-burn-out-an-occupational-phenomenon-international-classification-of-diseases" },
  },
  "family-conflicts": {
    es: { label: "Ministerio de Igualdad: recursos ante violencia de género", href: "https://violenciagenero.igualdad.gob.es/informacionUtil/recursos/telefono016/" },
    "en-us": { label: "Office on Women's Health: relationships and safety", href: "https://womenshealth.gov/relationships-and-safety" },
    "en-gb": { label: "NHS: domestic abuse", href: "https://www.nhs.uk/live-well/getting-help-for-domestic-violence/" },
    fr: { label: "Service-Public.fr: violences au sein du couple", href: "https://www.service-public.fr/particuliers/vosdroits/F12544" },
  },
};
