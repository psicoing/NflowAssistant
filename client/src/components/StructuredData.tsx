import { useEffect } from 'react';
import { organizationSchema } from "@shared/seo/identity";

interface StructuredDataProps {
  type: 'Organization' | 'WebApplication' | 'WebSite' | 'Product' | 'FAQPage' | 'BlogPosting' | 'Article' | 'CollectionPage' | 'BreadcrumbList';
  data: Record<string, any>;
}

export function StructuredData({ type, data }: StructuredDataProps) {
  useEffect(() => {
    const scriptId = `structured-data-${type}`;
    
    // Remove existing script if present
    const existingScript = document.getElementById(scriptId);
    if (existingScript) {
      existingScript.remove();
    }

    // Create new script element
    const script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': type,
      ...data,
    });

    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.getElementById(scriptId);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [type, data]);

  return null;
}

// Predefined structured data for NUXA
export const NuxaOrganizationData = organizationSchema;

export const NuxaWebSiteData = {
  '@id': 'https://nuxa.life/#website',
  name: 'NUXA',
  url: 'https://nuxa.life',
  publisher: { '@id': 'https://nuxa.life/#organization' },
};

export const NuxaWebAppData = {
  '@id': 'https://nuxa.life/#webapp',
  name: 'NUXA',
  url: 'https://nuxa.life',
  publisher: { '@id': 'https://nuxa.life/#organization' },
  description: 'NUXA es una plataforma digital con herramientas conversacionales e información general relacionada con el bienestar emocional. No sustituye la atención profesional.',
};

// Legacy exports for backwards compatibility (deprecated)
export const NFlowOrganizationData = NuxaOrganizationData;
export const NFlowWebAppData = NuxaWebAppData;
