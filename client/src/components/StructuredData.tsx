import { useEffect } from 'react';

interface StructuredDataProps {
  type: 'Organization' | 'WebApplication' | 'WebSite' | 'Product' | 'FAQPage' | 'BlogPosting' | 'Article' | 'CollectionPage';
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
export const NuxaOrganizationData = {
  name: 'NUXA',
  url: 'https://nuxa.life',
  logo: 'https://nuxa.life/icon-512.png',
  description: 'Tu psicólogo IA disponible 24/7. Apoyo emocional profesional con inteligencia artificial certificada ISO 45003.',
  sameAs: [
    'https://www.linkedin.com/company/nuxa',
    'https://twitter.com/nuxalife',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    email: 'soporte@nuxa.life',
    availableLanguage: ['es', 'en'],
  },
};

export const NuxaWebAppData = {
  name: 'NUXA - Tu Psicólogo IA 24/7',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'Web, iOS, Android',
  offers: {
    '@type': 'Offer',
    price: '2.99',
    priceCurrency: 'EUR',
    availability: 'https://schema.org/InStock',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '15000',
  },
  description: 'Tu psicólogo IA disponible 24/7. Apoyo emocional profesional en español para personas, familias y trabajadores.',
};

// Legacy exports for backwards compatibility (deprecated)
export const NFlowOrganizationData = NuxaOrganizationData;
export const NFlowWebAppData = NuxaWebAppData;
