import { useLanguage } from "@/hooks/useLanguage";
import { useEffect } from "react";

interface LanguageProviderProps {
  children: React.ReactNode;
}

export function ClientLanguageProvider({ children }: LanguageProviderProps) {
  const { currentLanguage } = useLanguage();

  useEffect(() => {
    // Set document language
    document.documentElement.lang = currentLanguage;
    
    // Update page title based on language
    const titles = {
      es: 'NUXA - Tu Psicólogo de Bolsillo',
      en: 'NUXA - Your Pocket Psychologist',
      fr: 'NUXA - Votre Psychologue de Poche',
      de: 'NUXA - Ihr Taschen-Psychologe',
      it: 'NUXA - Il Tuo Psicologo Tascabile',
      pt: 'NUXA - O Seu Psicólogo de Bolso',
      ca: 'NUXA - El Teu Psicòleg de Butxaca',
      eu: 'NUXA - Zure Poltsa-psikologoa',
      gl: 'NUXA - O Teu Psicólogo de Peto'
    };
    
    document.title = titles[currentLanguage as keyof typeof titles] || titles.es;
    
    // Update meta description
    const descriptions = {
      es: 'Apoyo emocional profesional 24/7 con IA especializada en salud mental',
      en: 'Professional emotional support 24/7 with AI specialized in mental health',
      fr: 'Soutien émotionnel professionnel 24h/24 avec IA spécialisée en santé mentale',
      de: 'Professionelle emotionale Unterstützung 24/7 mit KI spezialisiert auf psychische Gesundheit',
      it: 'Supporto emotivo professionale 24/7 con IA specializzata in salute mentale',
      pt: 'Apoio emocional profissional 24/7 com IA especializada em saúde mental',
      ca: 'Suport emocional professional 24/7 amb IA especialitzada en salut mental',
      eu: 'Osasun mentalean espezializatutako AIarekin 24/7 laguntza emozional profesionala',
      gl: 'Apoio emocional profesional 24/7 con IA especializada en saúde mental'
    };
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', descriptions[currentLanguage as keyof typeof descriptions] || descriptions.es);
    }
  }, [currentLanguage]);

  return <>{children}</>;
}