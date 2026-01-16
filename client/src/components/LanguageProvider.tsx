import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { Language, languages, translations } from '@/hooks/useLanguage';

interface LanguageContextType {
  currentLanguage: Language;
  changeLanguage: (language: Language) => void;
  t: (key: string) => string;
  languages: typeof languages;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('es');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('nflow-language') as Language;
    if (savedLanguage && languages.find(lang => lang.code === savedLanguage)) {
      setCurrentLanguage(savedLanguage);
    } else {
      // Auto-detect browser language
      const browserLang = navigator.language.toLowerCase().split('-')[0];
      if (browserLang === 'en') {
        setCurrentLanguage('en');
        localStorage.setItem('nflow-language', 'en');
      } else if (browserLang === 'fr') {
        setCurrentLanguage('fr');
        localStorage.setItem('nflow-language', 'fr');
      } else {
        // Default to Spanish for all other languages
        setCurrentLanguage('es');
        localStorage.setItem('nflow-language', 'es');
      }
    }
  }, []);

  const changeLanguage = (language: Language) => {
    setCurrentLanguage(language);
    localStorage.setItem('nflow-language', language);
  };

  const t = (key: string): string => {
    const translation = translations[currentLanguage]?.[key as keyof typeof translations[typeof currentLanguage]];
    return translation || translations.es[key as keyof typeof translations.es] || key;
  };

  const value = {
    currentLanguage,
    changeLanguage,
    t,
    languages
  };
  
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// Hook to use language context
export function useLanguageContext() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguageContext must be used within a LanguageProvider');
  }
  return context;
}