import { SEO_SITE_URL } from "./types";

/** One factual public organization identity, also usable by lightweight UI
 * schemas without importing all of the international editorial catalogue. */
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": SEO_SITE_URL + "/#organization",
  name: "NUXA",
  legalName: "EMPORDAJOBS SL",
  url: SEO_SITE_URL + "/",
  logo: SEO_SITE_URL + "/icon-512.png",
  description: "NUXA es una plataforma digital de orientación psicoeducativa y bienestar emocional basada en inteligencia artificial. No sustituye la atención sanitaria ni los servicios de emergencias.",
};