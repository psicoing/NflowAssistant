import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type SupportedLanguage = 'es' | 'en' | 'fr' | 'de' | 'it' | 'pt' | 'ca' | 'eu' | 'gl';

interface LanguageContextType {
  currentLanguage: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Detect user's preferred language
function detectUserLanguage(): SupportedLanguage {
  // Check localStorage first
  const saved = localStorage.getItem('nflow-language') as SupportedLanguage;
  if (saved && ['es', 'en', 'fr', 'de', 'it', 'pt', 'ca', 'eu', 'gl'].includes(saved)) {
    return saved;
  }

  // Check browser language
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('es')) return 'es';
  if (browserLang.startsWith('en')) return 'en';
  if (browserLang.startsWith('fr')) return 'fr';
  if (browserLang.startsWith('de')) return 'de';
  if (browserLang.startsWith('it')) return 'it';
  if (browserLang.startsWith('pt')) return 'pt';
  if (browserLang.startsWith('ca')) return 'ca';
  if (browserLang.startsWith('eu')) return 'eu';
  if (browserLang.startsWith('gl')) return 'gl';

  // Default to Spanish
  return 'es';
}

// Translations object
const translations: Record<SupportedLanguage, Record<string, string>> = {
  es: {
    // Header
    'nav.login': 'Iniciar Sesión',
    'nav.register': 'Registro',
    'nav.language': 'Idioma',
    'nav.connected': 'Conectado',
    'nav.disconnected': 'Sin conexión',
    
    // Main page
    'hero.title': 'Tu Psicólogo de Bolsillo',
    'hero.subtitle': 'Apoyo emocional profesional disponible 24/7 con inteligencia artificial especializada en salud mental',
    'hero.cta': 'Comenzar Chat',
    'pricing.title': 'Planes de Suscripción',
    'pricing.basic': 'Plan Básico',
    'pricing.price': '€2.99/mes',
    'pricing.features.questions': '10 preguntas mensuales',
    'pricing.features.ai': 'IA especializada en salud mental',
    'pricing.features.support': 'Soporte 24/7',
    
    // Chat
    'chat.placeholder': 'Escribe tu consulta sobre salud mental...',
    'chat.send': 'Enviar',
    'chat.limit.reached': 'Has alcanzado tu límite mensual de preguntas',
    'chat.limit.remaining': 'preguntas restantes este mes',
    'chat.emergency': 'Emergencias',
    'chat.billing': 'Facturación',
    'chat.logout': 'Cerrar Sesión',
    
    // Emergency
    'emergency.title': 'Números de Emergencia',
    'emergency.spain': 'España - Emergencias: 112',
    'emergency.hope': 'Teléfono de la Esperanza: 717 003 717',
    
    // Footer
    'footer.company': 'EMPORDAJOBS SL',
    'footer.cif': 'CIF: B02701100',
    'footer.address': 'C/ Ejemplo 123, 17001 Girona',
    'footer.phone': 'Tel: +34 660 45 21 36',
    'footer.email': 'info@empordajobs.com'
  },
  en: {
    // Header
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.language': 'Language',
    'nav.connected': 'Connected',
    'nav.disconnected': 'Offline',
    
    // Main page
    'hero.title': 'Your Pocket Psychologist',
    'hero.subtitle': 'Professional emotional support available 24/7 with AI specialized in mental health',
    'hero.cta': 'Start Chat',
    'pricing.title': 'Subscription Plans',
    'pricing.basic': 'Basic Plan',
    'pricing.price': '€2.99/month',
    'pricing.features.questions': '10 monthly questions',
    'pricing.features.ai': 'Mental health specialized AI',
    'pricing.features.support': '24/7 support',
    
    // Chat
    'chat.placeholder': 'Write your mental health question...',
    'chat.send': 'Send',
    'chat.limit.reached': 'You have reached your monthly question limit',
    'chat.limit.remaining': 'questions remaining this month',
    'chat.emergency': 'Emergency',
    'chat.billing': 'Billing',
    'chat.logout': 'Logout',
    
    // Emergency
    'emergency.title': 'Emergency Numbers',
    'emergency.spain': 'Spain - Emergency: 112',
    'emergency.hope': 'Hope Phone: 717 003 717',
    
    // Footer
    'footer.company': 'EMPORDAJOBS SL',
    'footer.cif': 'CIF: B02701100', 
    'footer.address': 'C/ Example 123, 17001 Girona',
    'footer.phone': 'Phone: +34 660 45 21 36',
    'footer.email': 'info@empordajobs.com'
  },
  fr: {
    // Header
    'nav.login': 'Connexion',
    'nav.register': 'Inscription',
    'nav.language': 'Langue',
    'nav.connected': 'Connecté',
    'nav.disconnected': 'Hors ligne',
    
    // Main page
    'hero.title': 'Votre Psychologue de Poche',
    'hero.subtitle': 'Soutien émotionnel professionnel disponible 24h/24 avec IA spécialisée en santé mentale',
    'hero.cta': 'Commencer Chat',
    'pricing.title': 'Plans d\'Abonnement',
    'pricing.basic': 'Plan Basique',
    'pricing.price': '€2.99/mois',
    'pricing.features.questions': '10 questions mensuelles',
    'pricing.features.ai': 'IA spécialisée en santé mentale',
    'pricing.features.support': 'Support 24h/24',
    
    // Chat
    'chat.placeholder': 'Écrivez votre question sur la santé mentale...',
    'chat.send': 'Envoyer',
    'chat.limit.reached': 'Vous avez atteint votre limite mensuelle de questions',
    'chat.limit.remaining': 'questions restantes ce mois',
    'chat.emergency': 'Urgences',
    'chat.billing': 'Facturation',
    'chat.logout': 'Déconnexion',
    
    // Emergency
    'emergency.title': 'Numéros d\'Urgence',
    'emergency.spain': 'Espagne - Urgences: 112',
    'emergency.hope': 'Téléphone de l\'Espoir: 717 003 717',
    
    // Footer
    'footer.company': 'EMPORDAJOBS SL',
    'footer.cif': 'CIF: B02701100',
    'footer.address': 'C/ Exemple 123, 17001 Girona',
    'footer.phone': 'Tél: +34 660 45 21 36',
    'footer.email': 'info@empordajobs.com'
  },
  ca: {
    // Header
    'nav.login': 'Iniciar Sessió',
    'nav.register': 'Registre',
    'nav.language': 'Idioma',
    'nav.connected': 'Connectat',
    'nav.disconnected': 'Sense connexió',
    
    // Main page
    'hero.title': 'El Teu Psicòleg de Butxaca',
    'hero.subtitle': 'Suport emocional professional disponible 24/7 amb intel·ligència artificial especialitzada en salut mental',
    'hero.cta': 'Començar Chat',
    'pricing.title': 'Plans de Subscripció',
    'pricing.basic': 'Pla Bàsic',
    'pricing.price': '€2.99/mes',
    'pricing.features.questions': '10 preguntes mensuals',
    'pricing.features.ai': 'IA especialitzada en salut mental',
    'pricing.features.support': 'Suport 24/7',
    
    // Chat
    'chat.placeholder': 'Escriu la teva consulta sobre salut mental...',
    'chat.send': 'Enviar',
    'chat.limit.reached': 'Has arribat al teu límit mensual de preguntes',
    'chat.limit.remaining': 'preguntes restants aquest mes',
    'chat.emergency': 'Emergències',
    'chat.billing': 'Facturació',
    'chat.logout': 'Tancar Sessió',
    
    // Emergency
    'emergency.title': 'Números d\'Emergència',
    'emergency.spain': 'Espanya - Emergències: 112',
    'emergency.hope': 'Telèfon de l\'Esperança: 717 003 717',
    
    // Footer
    'footer.company': 'EMPORDAJOBS SL',
    'footer.cif': 'CIF: B02701100',
    'footer.address': 'C/ Exemple 123, 17001 Girona',
    'footer.phone': 'Tel: +34 660 45 21 36',
    'footer.email': 'info@empordajobs.com'
  },
  de: {
    // Header
    'nav.login': 'Anmelden',
    'nav.register': 'Registrieren',
    'nav.language': 'Sprache',
    'nav.connected': 'Verbunden',
    'nav.disconnected': 'Offline',
    
    // Main page
    'hero.title': 'Ihr Taschen-Psychologe',
    'hero.subtitle': 'Professionelle emotionale Unterstützung 24/7 verfügbar mit KI spezialisiert auf psychische Gesundheit',
    'hero.cta': 'Chat Starten',
    'pricing.title': 'Abonnement-Pläne',
    'pricing.basic': 'Basis-Plan',
    'pricing.price': '€2.99/Monat',
    'pricing.features.questions': '10 monatliche Fragen',
    'pricing.features.ai': 'KI spezialisiert auf psychische Gesundheit',
    'pricing.features.support': '24/7 Support',
    
    // Chat
    'chat.placeholder': 'Schreiben Sie Ihre Frage zur psychischen Gesundheit...',
    'chat.send': 'Senden',
    'chat.limit.reached': 'Sie haben Ihr monatliches Fragenlimit erreicht',
    'chat.limit.remaining': 'verbleibende Fragen diesen Monat',
    'chat.emergency': 'Notfall',
    'chat.billing': 'Abrechnung',
    'chat.logout': 'Abmelden',
    
    // Emergency
    'emergency.title': 'Notrufnummern',
    'emergency.spain': 'Spanien - Notfall: 112',
    'emergency.hope': 'Hoffnungstelefon: 717 003 717',
    
    // Footer
    'footer.company': 'EMPORDAJOBS SL',
    'footer.cif': 'CIF: B02701100',
    'footer.address': 'C/ Beispiel 123, 17001 Girona',
    'footer.phone': 'Tel: +34 660 45 21 36',
    'footer.email': 'info@empordajobs.com'
  },
  it: {
    // Header
    'nav.login': 'Accedi',
    'nav.register': 'Registrati',
    'nav.language': 'Lingua',
    'nav.connected': 'Connesso',
    'nav.disconnected': 'Offline',
    
    // Main page
    'hero.title': 'Il Tuo Psicologo Tascabile',
    'hero.subtitle': 'Supporto emotivo professionale disponibile 24/7 con IA specializzata in salute mentale',
    'hero.cta': 'Inizia Chat',
    'pricing.title': 'Piani di Abbonamento',
    'pricing.basic': 'Piano Base',
    'pricing.price': '€2.99/mese',
    'pricing.features.questions': '10 domande mensili',
    'pricing.features.ai': 'IA specializzata in salute mentale',
    'pricing.features.support': 'Supporto 24/7',
    
    // Chat
    'chat.placeholder': 'Scrivi la tua domanda sulla salute mentale...',
    'chat.send': 'Invia',
    'chat.limit.reached': 'Hai raggiunto il tuo limite mensile di domande',
    'chat.limit.remaining': 'domande rimanenti questo mese',
    'chat.emergency': 'Emergenze',
    'chat.billing': 'Fatturazione',
    'chat.logout': 'Disconnetti',
    
    // Emergency
    'emergency.title': 'Numeri di Emergenza',
    'emergency.spain': 'Spagna - Emergenze: 112',
    'emergency.hope': 'Telefono della Speranza: 717 003 717',
    
    // Footer
    'footer.company': 'EMPORDAJOBS SL',
    'footer.cif': 'CIF: B02701100',
    'footer.address': 'C/ Esempio 123, 17001 Girona',
    'footer.phone': 'Tel: +34 660 45 21 36',
    'footer.email': 'info@empordajobs.com'
  },
  pt: {
    // Header
    'nav.login': 'Entrar',
    'nav.register': 'Registar',
    'nav.language': 'Idioma',
    'nav.connected': 'Conectado',
    'nav.disconnected': 'Offline',
    
    // Main page
    'hero.title': 'O Seu Psicólogo de Bolso',
    'hero.subtitle': 'Apoio emocional profissional disponível 24/7 com IA especializada em saúde mental',
    'hero.cta': 'Iniciar Chat',
    'pricing.title': 'Planos de Subscrição',
    'pricing.basic': 'Plano Básico',
    'pricing.price': '€2.99/mês',
    'pricing.features.questions': '10 perguntas mensais',
    'pricing.features.ai': 'IA especializada em saúde mental',
    'pricing.features.support': 'Suporte 24/7',
    
    // Chat
    'chat.placeholder': 'Escreva a sua pergunta sobre saúde mental...',
    'chat.send': 'Enviar',
    'chat.limit.reached': 'Atingiu o seu limite mensal de perguntas',
    'chat.limit.remaining': 'perguntas restantes este mês',
    'chat.emergency': 'Emergências',
    'chat.billing': 'Faturação',
    'chat.logout': 'Sair',
    
    // Emergency
    'emergency.title': 'Números de Emergência',
    'emergency.spain': 'Espanha - Emergências: 112',
    'emergency.hope': 'Telefone da Esperança: 717 003 717',
    
    // Footer
    'footer.company': 'EMPORDAJOBS SL',
    'footer.cif': 'CIF: B02701100',
    'footer.address': 'C/ Exemplo 123, 17001 Girona',
    'footer.phone': 'Tel: +34 660 45 21 36',
    'footer.email': 'info@empordajobs.com'
  },
  eu: {
    // Header
    'nav.login': 'Saioa Hasi',
    'nav.register': 'Erregistratu',
    'nav.language': 'Hizkuntza',
    'nav.connected': 'Konektatuta',
    'nav.disconnected': 'Konexiorik gabe',
    
    // Main page
    'hero.title': 'Zure Poltsa-psikologoa',
    'hero.subtitle': 'Osasun mentalean espezializatutako AIarekin 24/7 eskuragarri dagoen laguntza emozional profesionala',
    'hero.cta': 'Txata Hasi',
    'pricing.title': 'Harpidetza Planak',
    'pricing.basic': 'Oinarrizko Plana',
    'pricing.price': '€2.99/hilabeteko',
    'pricing.features.questions': '10 galdera hilero',
    'pricing.features.ai': 'Osasun mentalean espezializatutako IA',
    'pricing.features.support': '24/7 laguntza',
    
    // Chat
    'chat.placeholder': 'Idatzi zure osasun mentalari buruzko galdera...',
    'chat.send': 'Bidali',
    'chat.limit.reached': 'Hileko galdera muga iritsi duzu',
    'chat.limit.remaining': 'galdera geratzen dira hilabete honetan',
    'chat.emergency': 'Larrialdia',
    'chat.billing': 'Fakturazio',
    'chat.logout': 'Saioa Itxi',
    
    // Emergency
    'emergency.title': 'Larrialdi Zenbakiak',
    'emergency.spain': 'Espainia - Larrialdia: 112',
    'emergency.hope': 'Itxaropen Telefonoa: 717 003 717',
    
    // Footer
    'footer.company': 'EMPORDAJOBS SL',
    'footer.cif': 'CIF: B02701100',
    'footer.address': 'C/ Adibidea 123, 17001 Girona',
    'footer.phone': 'Tel: +34 660 45 21 36',
    'footer.email': 'info@empordajobs.com'
  },
  gl: {
    // Header
    'nav.login': 'Iniciar Sesión',
    'nav.register': 'Rexistro',
    'nav.language': 'Idioma',
    'nav.connected': 'Conectado',
    'nav.disconnected': 'Sen conexión',
    
    // Main page
    'hero.title': 'O Teu Psicólogo de Peto',
    'hero.subtitle': 'Apoio emocional profesional dispoñible 24/7 con intelixencia artificial especializada en saúde mental',
    'hero.cta': 'Comezar Chat',
    'pricing.title': 'Plans de Subscrición',
    'pricing.basic': 'Plan Básico',
    'pricing.price': '€2.99/mes',
    'pricing.features.questions': '10 preguntas mensuais',
    'pricing.features.ai': 'IA especializada en saúde mental',
    'pricing.features.support': 'Soporte 24/7',
    
    // Chat
    'chat.placeholder': 'Escribe a túa consulta sobre saúde mental...',
    'chat.send': 'Enviar',
    'chat.limit.reached': 'Alcanzaches o teu límite mensual de preguntas',
    'chat.limit.remaining': 'preguntas restantes este mes',
    'chat.emergency': 'Emerxencias',
    'chat.billing': 'Facturación',
    'chat.logout': 'Pechar Sesión',
    
    // Emergency
    'emergency.title': 'Números de Emerxencia',
    'emergency.spain': 'España - Emerxencias: 112',
    'emergency.hope': 'Teléfono da Esperanza: 717 003 717',
    
    // Footer
    'footer.company': 'EMPORDAJOBS SL',
    'footer.cif': 'CIF: B02701100',
    'footer.address': 'C/ Exemplo 123, 17001 Girona',
    'footer.phone': 'Tel: +34 660 45 21 36',
    'footer.email': 'info@empordajobs.com'
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(() => detectUserLanguage());

  const setLanguage = (lang: SupportedLanguage) => {
    setCurrentLanguage(lang);
    localStorage.setItem('nflow-language', lang);
  };

  const t = (key: string): string => {
    return translations[currentLanguage]?.[key] || translations.es[key] || key;
  };

  useEffect(() => {
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  const contextValue = { currentLanguage, setLanguage, t };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}