import { createContext, useContext, ReactNode } from 'react';
import { useLanguage } from '@/hooks/useLanguage';

const LanguageContext = createContext<ReturnType<typeof useLanguage> | null>(null);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const languageValue = useLanguage();
  
  return (
    <LanguageContext.Provider value={languageValue}>
      {children}
    </LanguageContext.Provider>
  );
}

// Hook to use language context (optional - components can use useLanguage directly)
export function useLanguageContext() {
  const context = useContext(LanguageContext);
  return context || useLanguage();
}