import { getAlternates, getInternationalPage, getPageJsonLd, markets, SEO_SITE_URL } from "../shared/seo";
import { renderInternationalPage } from "../shared/seo/render";
import { internationalSeoCss } from "../shared/seo/styles";

export function getInternationalRouteMetadata(url: string) {
  const page = getInternationalPage(url);
  if (!page) return undefined;
  return {
    title: page.title,
    description: page.description,
    canonical: SEO_SITE_URL + page.path,
    language: markets[page.market].language,
    alternates: getAlternates(page),
    ogType: page.kind === "Article" ? "article" : "website",
    jsonLd: getPageJsonLd(page),
    bodyHtml: renderInternationalPage(page),
    inlineCss: internationalSeoCss,
    persistentBody: true,
  };
}