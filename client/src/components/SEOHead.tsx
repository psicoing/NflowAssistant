import { useEffect } from 'react';
import { isNonIndexablePath } from "@shared/seo/policy";

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: 'website' | 'article';
  twitterCard?: 'summary' | 'summary_large_image';
  canonicalUrl?: string;
  language?: string;
  alternates?: { hreflang: string; href: string }[];
  jsonLd?: object[];
}

export function SEOHead({
  title,
  description,
  keywords,
  ogTitle,
  ogDescription,
  ogImage = 'https://nuxa.life/icon-512.png',
  ogUrl,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  canonicalUrl,
  language = "es-ES",
  alternates,
  jsonLd,
}: SEOHeadProps) {
  useEffect(() => {
    // Update page title
    document.title = title;
    document.documentElement.lang = language;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };

    // Basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('robots', isNonIndexablePath(window.location.pathname) ? 'noindex, nofollow' : 'index, follow');
    if (keywords) {
      updateMetaTag('keywords', keywords);
    }

    // Open Graph tags
    updateMetaTag('og:title', ogTitle || title, true);
    updateMetaTag('og:description', ogDescription || description, true);
    updateMetaTag('og:image', ogImage, true);
    updateMetaTag('og:type', ogType, true);
    updateMetaTag('og:locale', language.replace("-", "_"), true);
    if (ogUrl || canonicalUrl) {
      updateMetaTag('og:url', ogUrl || canonicalUrl!, true);
    }

    // Twitter Card tags
    updateMetaTag('twitter:card', twitterCard);
    updateMetaTag('twitter:title', ogTitle || title);
    updateMetaTag('twitter:description', ogDescription || description);
    updateMetaTag('twitter:image', ogImage);

    // Canonical URL
    if (canonicalUrl) {
      let linkElement = document.querySelector('link[rel="canonical"]');
      
      if (!linkElement) {
        linkElement = document.createElement('link');
        linkElement.setAttribute('rel', 'canonical');
        document.head.appendChild(linkElement);
      }
      
      linkElement.setAttribute('href', canonicalUrl);
    }
    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(node => node.remove());
    for (const alternate of alternates || []) {
      const link = document.createElement("link");
      link.rel = "alternate";
      link.hreflang = alternate.hreflang;
      link.href = alternate.href;
      document.head.appendChild(link);
    }
    document.querySelectorAll("script[data-nuxa-route-schema]").forEach(node => node.remove());
    for (const schema of jsonLd || []) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.dataset.nuxaRouteSchema = "";
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    }
    return () => {
      document.querySelectorAll('link[rel="alternate"][hreflang],script[data-nuxa-route-schema]').forEach(node => node.remove());
    };
  }, [title, description, keywords, ogTitle, ogDescription, ogImage, ogUrl, ogType, twitterCard, canonicalUrl, language, alternates, jsonLd]);

  return null;
}
