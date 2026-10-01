import { entityPages } from "./entity-pages";
import { topicPages } from "./topic-pages";
import { markets, SEO_SITE_URL, type InternationalPage, type Market } from "./types";
import { organizationSchema } from "./identity";
export { organizationSchema } from "./identity";

export { markets, SEO_SITE_URL } from "./types";
export type { InternationalPage, Market } from "./types";

export const internationalPages: InternationalPage[] = [...entityPages, ...topicPages];

export function normalizeSeoPath(path: string): string {
  const clean = path.split(/[?#]/)[0];
  return clean === "/" ? clean : clean.replace(/\/+$/, "");
}

const byPath = new Map(internationalPages.map(page => [normalizeSeoPath(page.path), page]));
export function getInternationalPage(path: string): InternationalPage | undefined {
  return byPath.get(normalizeSeoPath(path));
}
export function getPageById(id: string, market: Market): InternationalPage | undefined {
  return internationalPages.find(page => page.id === id && page.market === market);
}
export function getAlternates(page: InternationalPage) {
  const variants = internationalPages.filter(candidate => candidate.id === page.id);
  const spanish = variants.find(candidate => candidate.market === "es");
  return [
    ...variants.map(candidate => ({
      hreflang: markets[candidate.market].language,
      href: SEO_SITE_URL + candidate.path,
    })),
    ...(spanish ? [{ hreflang: "x-default", href: SEO_SITE_URL + spanish.path }] : []),
  ];
}
export function getRelatedPages(page: InternationalPage) {
  return page.relatedIds
    .map(id => getPageById(id, page.market))
    .filter((candidate): candidate is InternationalPage => Boolean(candidate));
}

export function getPageJsonLd(page: InternationalPage): object[] {
  const url = SEO_SITE_URL + page.path;
  const home = getPageById("home", page.market);
  const schemas: object[] = [
    organizationSchema,
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": SEO_SITE_URL + "/#website",
      name: "NUXA",
      url: SEO_SITE_URL + "/",
      publisher: { "@id": organizationSchema["@id"] },
      inLanguage: Object.values(markets).map(market => market.language),
    },
    {
      "@context": "https://schema.org",
      "@type": page.kind === "Article" ? "WebPage" : page.kind,
      "@id": url + "#webpage",
      url,
      name: page.title,
      description: page.description,
      inLanguage: markets[page.market].language,
      isPartOf: { "@id": SEO_SITE_URL + "/#website" },
      publisher: { "@id": organizationSchema["@id"] },
      ...(page.id === "about-nuxa" ? { about: { "@id": organizationSchema["@id"] } } : {}),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: home?.h1 || "NUXA", item: SEO_SITE_URL + (home?.path || "/") },
        ...(page.id === "home" ? [] : [{ "@type": "ListItem", position: 2, name: page.h1, item: url }]),
      ],
    },
  ];
  if (page.kind === "Article") {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": url + "#article",
      headline: page.h1,
      description: page.summary,
      inLanguage: markets[page.market].language,
      datePublished: page.publishedAt,
      dateModified: page.updatedAt,
      author: { "@id": organizationSchema["@id"] },
      publisher: { "@id": organizationSchema["@id"] },
      mainEntityOfPage: { "@id": url + "#webpage" },
      image: SEO_SITE_URL + "/icon-512.png",
      citation: page.sources.map(source => source.href),
    });
  }
  return schemas;
}

// Unprefixed entity names requested in the brief are stable, non-indexable
// redirects. Existing Spanish routes are never redirected or renamed.
export const seoAliases: Record<string, string> = {
  "/about": "/es/about-nuxa",
  "/about-nuxa": "/es/about-nuxa",
  "/how-nuxa-works": "/es/how-nuxa-works",
  "/science": "/es/science",
  "/safety": "/es/safety",
  "/privacy": "/es/privacy",
  "/for-organizations": "/es/for-organizations",
  "/for-professionals": "/es/for-professionals",
  "/editorial-policy": "/es/editorial-policy",
};

export function isInternationalNamespace(path: string): boolean {
  return /^\/(es|en-us|en-gb|fr)(\/|$)/.test(path);
}