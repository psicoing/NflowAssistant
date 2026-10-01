import { SEOHead } from "@/components/SEOHead";
import { getAlternates, getInternationalPage, getPageJsonLd, markets, SEO_SITE_URL } from "@shared/seo";
import { renderInternationalPage } from "@shared/seo/render";
import { internationalSeoCss } from "@shared/seo/styles";
import { useLocation } from "wouter";

export default function InternationalSeoPage() {
  const [location] = useLocation();
  const page = getInternationalPage(location);
  if (!page) return null;
  return (
    <>
      <SEOHead
        title={page.title}
        description={page.description}
        canonicalUrl={SEO_SITE_URL + page.path}
        ogUrl={SEO_SITE_URL + page.path}
        ogType={page.kind === "Article" ? "article" : "website"}
        language={markets[page.market].language}
        alternates={getAlternates(page)}
        jsonLd={getPageJsonLd(page)}
      />
      <style>{internationalSeoCss}</style>
      <div dangerouslySetInnerHTML={{ __html: renderInternationalPage(page) }} />
    </>
  );
}