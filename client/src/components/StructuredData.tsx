import { useEffect } from 'react';

interface StructuredDataProps {
  type: 'Organization' | 'WebApplication' | 'WebSite' | 'Product' | 'FAQPage';
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

// Predefined structured data for NFLOW
export const NFlowOrganizationData = {
  name: 'NFLOW',
  url: 'https://nflow.style',
  logo: 'https://nflow.style/icon-512.png',
  description: 'Psicólogo IA disponible 24/7. Apoyo emocional profesional con inteligencia artificial certificada ISO 45003.',
  sameAs: [
    'https://www.linkedin.com/company/nflow',
    'https://twitter.com/nflowstyle',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    email: 'soporte@nflow.style',
    availableLanguage: ['es', 'en'],
  },
};

export const NFlowWebAppData = {
  name: 'NFLOW - Psicólogo IA',
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
  description: 'Psicólogo virtual con IA disponible 24/7. Apoyo emocional profesional en español para personas, familias y trabajadores.',
};
