export type Market = "es" | "en-us" | "en-gb" | "fr";
export type PageSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};
export type ContentLink = { label: string; href: string };
export type InternationalPage = {
  id: string;
  market: Market;
  path: string;
  title: string;
  description: string;
  h1: string;
  summary: string;
  sections: PageSection[];
  faqs: { question: string; answer: string }[];
  sources: ContentLink[];
  relatedIds: string[];
  kind: "WebPage" | "AboutPage" | "Article";
  publishedAt: string;
  updatedAt: string;
};

export const SEO_SITE_URL = "https://nuxa.life";
export const CONTENT_DATE = "2026-10-01";
export const markets: Record<Market, { language: string; country: string; label: string }> = {
  es: { language: "es-ES", country: "España", label: "España · Español" },
  "en-us": { language: "en-US", country: "United States", label: "United States · English" },
  "en-gb": { language: "en-GB", country: "United Kingdom", label: "United Kingdom · English" },
  fr: { language: "fr-FR", country: "France", label: "France · Français" },
};