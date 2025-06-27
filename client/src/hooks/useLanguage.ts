import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

const translations: Record<SupportedLanguage, Record<string, string>> = {
  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.chat': 'Chat de Apoyo',
    'nav.resources': 'Recursos',
    'nav.examples': 'Ejemplos',
    'nav.subscribe': 'Suscribirse',
    'nav.login': 'Iniciar Sesión',
    'nav.register': 'Registrarse',
    
    // Hero Section
    'hero.title': 'Tu psicólogo personal',
    'hero.subtitle': 'disponible 24/7',
    'hero.description': 'Apoyo profesional en salud mental con inteligencia artificial avanzada. Conversaciones confidenciales y respuestas personalizadas para tu bienestar emocional.',
    'hero.cta.primary': 'Comenzar Chat Gratis',
    'hero.cta.secondary': 'Ver Ejemplos',
    'hero.cta': 'Comenzar Chat Gratis',
    'hero.trusted': 'Confiado por más de 1,000 usuarios',
    
    // Age Notice
    'age.title': '⚠️ Aviso Importante: Edad Mínima',
    'age.description': 'Este servicio está diseñado para personas de 12 a 95 años. Si tienes menos de 18 años, recomendamos supervisión de un adulto.',
    'age.emergency': 'En caso de emergencia, contacta inmediatamente con los servicios de emergencia (112 en España).',
    'ageWarning.title': '⚠️ Aviso Importante: Edad Mínima',
    'ageWarning.subtitle': 'Este servicio está diseñado para personas de 12 a 95 años. Si tienes menos de 18 años, recomendamos supervisión de un adulto.',
    
    // Services
    'services.title': 'Cuatro Soluciones Especializadas',
    'services.subtitle': 'Cada una diseñada para atender necesidades específicas de salud mental',
    'services.modern.title1': 'Cuatro Soluciones',
    'services.modern.title2': 'Especializadas',
    'services.modern.description': 'Cada una diseñada para atender necesidades específicas de salud mental',
    'services.modern.feature1': 'NFLOW Familias - Apoyo para toda la familia',
    'services.modern.feature2': 'NFLOW Laboral - Salud mental en el trabajo',
    'services.modern.feature3': 'NFLOW Adultos - Terapia personalizada',
    
    // Pricing
    'pricing.title': 'Elige Tu Plan',
    'pricing.subtitle': 'Acceso completo a todas las funciones premium',
    'pricing.basic.title': 'Plan Básico',
    'pricing.basic.price': '€2.99',
    'pricing.basic.period': '/mes',
    'pricing.basic.description': 'Perfecto para uso personal',
    'pricing.basic.feature1': '10 preguntas por mes',
    'pricing.basic.feature2': 'Respuestas especializadas',
    'pricing.basic.feature3': 'Historial de conversaciones',
    'pricing.basic.feature4': 'Soporte multiidioma',
    'pricing.basic.cta': 'Empezar Ahora',
    
    // Footer
    'footer.company': 'EMPORDAJOBS SL',
    'footer.cif': 'CIF: B02701100',
    'footer.address': 'C/ Ejemplo 123, 17001 Girona',
    'footer.phone': 'Tel: +34 660 45 21 36',
    'footer.email': 'info@empordajobs.com',
    'footer.copyright': '© 2025 NFLOW - EMPORDAJOBS SL. Todos los derechos reservados.',
    'footer.developed': 'Desarrollado con',
    'footer.tagline': 'para tu bienestar mental',
    
    // Chat
    'chat.placeholder': 'Escribe tu consulta sobre salud mental...',
    'chat.send': 'Enviar',
    'chat.limit.reached': 'Has alcanzado tu límite mensual de preguntas',
    'chat.limit.remaining': 'preguntas restantes',
    'chat.limit.of': 'de',
    'chat.emergency': 'Emergencias',
    'chat.billing': 'Facturación',
    'chat.logout': 'Cerrar Sesión',
    'chat.support.title': 'Chat de Apoyo',
    'chat.conversations.title': 'Conversaciones',
    'chat.conversations.new': 'Nueva',
    'chat.conversations.empty': 'No tienes conversaciones aún',
    'chat.conversations.search': 'Buscar conversaciones...',
    'chat.conversations.noResults': 'No se encontraron conversaciones con estos filtros',
    'chat.conversations.creating': 'Creando...',
    'chat.conversations.createFirst': 'Crear primera conversación',
    'chat.filters.all': 'Todo',
    'chat.filters.today': 'Hoy',
    'chat.filters.week': 'Semana',
    'chat.filters.month': 'Mes',
    'chat.language.banner.title': 'Idioma de las Respuestas',
    'chat.language.banner.description': 'El asistente responderá en el idioma seleccionado. Cambia el idioma en cualquier momento para recibir respuestas personalizadas.',
    'chat.welcome.title': 'Bienvenido al Chat de NFLOW',
    'chat.welcome.description': 'Selecciona una conversación existente o crea una nueva para empezar a chatear con nuestro asistente de IA.',
    'chat.welcome.cta': 'Crear Nueva Conversación',
    'chat.select.conversation': 'Selecciona una conversación',
    'chat.assistant.greeting': '¡Hola! Soy tu asistente de salud mental especializado. Puedes preguntarme sobre:',
    'chat.suggestions.anxiety': 'Me siento ansioso',
    'chat.suggestions.sleep': 'Necesito consejos para dormir mejor',
    'chat.suggestions.sleepShort': 'Problemas para dormir',
    'chat.suggestions.stress': '¿Cómo puedo manejar el estrés?',
    'chat.suggestions.stressShort': 'Manejo del estrés',
    
    // Examples Section
    'examples.assistant.title': 'Tu Asistente de IA Especializado',
    'examples.assistant.description': 'Experimenta conversaciones naturales con nuestro asistente de salud mental',
    'examples.features.language.title': 'Multiidioma',
    'examples.features.language.description': 'Respuestas en 9 idiomas diferentes',
    'examples.features.ages.title': 'Para Todas las Edades',
    'examples.features.ages.description': 'Adaptado para adolescentes y adultos',
    'examples.features.professional.title': 'Respuestas Profesionales',
    'examples.features.professional.description': 'Basado en psicología clínica',
    
    // Emergency
    'emergency.title': 'Números de Emergencia',
    'emergency.description': 'Si necesitas ayuda inmediata, contacta con estos servicios de emergencia',
    'emergency.spain': 'España - Emergencias',
    'emergency.hope': 'Teléfono de la Esperanza',
    'emergency.suicide': 'Prevención del Suicidio',
    'emergency.close': 'Cerrar',
  },
  
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.chat': 'Support Chat',
    'nav.resources': 'Resources',
    'nav.examples': 'Examples',
    'nav.subscribe': 'Subscribe',
    'nav.login': 'Login',
    'nav.register': 'Register',
    
    // Hero Section
    'hero.title': 'Your personal psychologist',
    'hero.subtitle': 'available 24/7',
    'hero.description': 'Professional mental health support with advanced artificial intelligence. Confidential conversations and personalized responses for your emotional wellbeing.',
    'hero.cta.primary': 'Start Free Chat',
    'hero.cta.secondary': 'View Examples',
    'hero.cta': 'Start Free Chat',
    'hero.trusted': 'Trusted by over 1,000 users',
    
    // Age Notice
    'age.title': '⚠️ Important Notice: Minimum Age',
    'age.description': 'This service is designed for people aged 12 to 95. If you are under 18, we recommend adult supervision.',
    'age.emergency': 'In case of emergency, immediately contact emergency services (112 in Spain).',
    'ageWarning.title': '⚠️ Important Notice: Minimum Age',
    'ageWarning.subtitle': 'This service is designed for people aged 12 to 95. If you are under 18, we recommend adult supervision.',
    
    // Services
    'services.title': 'Four Specialized Solutions',
    'services.subtitle': 'Each designed to address specific mental health needs',
    
    // Pricing
    'pricing.title': 'Choose Your Plan',
    'pricing.subtitle': 'Complete access to all premium features',
    'pricing.basic.title': 'Basic Plan',
    'pricing.basic.price': '€2.99',
    'pricing.basic.period': '/month',
    'pricing.basic.description': 'Perfect for personal use',
    'pricing.basic.feature1': '10 questions per month',
    'pricing.basic.feature2': 'Specialized responses',
    'pricing.basic.feature3': 'Conversation history',
    'pricing.basic.feature4': 'Multilingual support',
    'pricing.basic.cta': 'Start Now',
    
    // Footer
    'footer.company': 'EMPORDAJOBS SL',
    'footer.cif': 'CIF: B02701100',
    'footer.address': 'C/ Example 123, 17001 Girona',
    'footer.phone': 'Tel: +34 660 45 21 36',
    'footer.email': 'info@empordajobs.com',
    'footer.copyright': '© 2025 NFLOW - EMPORDAJOBS SL. All rights reserved.',
    'footer.developed': 'Developed with',
    'footer.tagline': 'for your mental wellbeing',
    
    // Chat
    'chat.placeholder': 'Write your mental health question...',
    'chat.send': 'Send',
    'chat.limit.reached': 'You have reached your monthly question limit',
    'chat.limit.remaining': 'questions remaining',
    'chat.limit.of': 'of',
    'chat.emergency': 'Emergency',
    'chat.billing': 'Billing',
    'chat.logout': 'Logout',
    'chat.support.title': 'Support Chat',
    'chat.conversations.title': 'Conversations',
    'chat.conversations.new': 'New',
    'chat.conversations.empty': 'You have no conversations yet',
    'chat.conversations.search': 'Search conversations...',
    'chat.conversations.noResults': 'No conversations found with these filters',
    'chat.conversations.creating': 'Creating...',
    'chat.conversations.createFirst': 'Create first conversation',
    'chat.filters.all': 'All',
    'chat.filters.today': 'Today',
    'chat.filters.week': 'Week',
    'chat.filters.month': 'Month',
    'chat.language.banner.title': 'Response Language',
    'chat.language.banner.description': 'The assistant will respond in the selected language. Change the language at any time to receive personalized responses.',
    'chat.welcome.title': 'Welcome to NFLOW Chat',
    'chat.welcome.description': 'Select an existing conversation or create a new one to start chatting with our AI assistant.',
    'chat.welcome.cta': 'Create New Conversation',
    'chat.select.conversation': 'Select a conversation',
    'chat.assistant.greeting': 'Hello! I am your specialized mental health assistant. You can ask me about:',
    'chat.suggestions.anxiety': 'I feel anxious',
    'chat.suggestions.sleep': 'I need advice to sleep better',
    'chat.suggestions.sleepShort': 'Sleep problems',
    'chat.suggestions.stress': 'How can I manage stress?',
    'chat.suggestions.stressShort': 'Stress management',
    
    // Emergency
    'emergency.title': 'Emergency Numbers',
    'emergency.description': 'If you need immediate help, contact these emergency services',
    'emergency.spain': 'Spain - Emergency',
    'emergency.hope': 'Telephone of Hope',
    'emergency.suicide': 'Suicide Prevention',
    'emergency.close': 'Close',
  },
  
  // Placeholder for other languages - they would follow the same structure
  fr: {
    'nav.home': 'Accueil',
    'chat.welcome.title': 'Bienvenue dans NFLOW Chat',
    'chat.welcome.description': 'Sélectionnez une conversation existante ou créez-en une nouvelle pour commencer à discuter avec notre assistant IA.',
    'chat.welcome.cta': 'Créer une Nouvelle Conversation',
    'chat.select.conversation': 'Sélectionner une conversation',
    'chat.conversations.new': 'Nouveau',
    'chat.conversations.search': 'Rechercher des conversations...',
    'chat.conversations.empty': 'Vous n\'avez pas encore de conversations',
    'chat.filters.all': 'Tout',
    'chat.filters.today': 'Aujourd\'hui',
    'chat.filters.week': 'Semaine',
    'chat.filters.month': 'Mois',
    'chat.conversations.noResults': 'Aucune conversation trouvée avec ces filtres',
    'chat.conversations.creating': 'Création...',
    'chat.conversations.createFirst': 'Créer la première conversation',
    'chat.assistant.greeting': 'Bonjour! Je suis votre assistant spécialisé en santé mentale. Vous pouvez me demander:',
    'chat.suggestions.anxiety': 'Je me sens anxieux',
    'chat.suggestions.sleep': 'J\'ai besoin de conseils pour mieux dormir',
    'chat.suggestions.sleepShort': 'Problèmes de sommeil',
    'chat.suggestions.stress': 'Comment puis-je gérer le stress?',
    'chat.suggestions.stressShort': 'Gestion du stress',
    'chat.placeholder': 'Écrivez votre question sur la santé mentale...',
    'chat.send': 'Envoyer',
    'chat.limit.reached': 'Vous avez atteint votre limite mensuelle de questions',
    'chat.limit.remaining': 'questions restantes',
    'chat.limit.of': 'de',
  },
  
  de: {
    'nav.home': 'Startseite',
    'chat.welcome.title': 'Willkommen im NFLOW Chat',
    'chat.welcome.description': 'Wählen Sie ein bestehendes Gespräch aus oder erstellen Sie ein neues, um mit unserem KI-Assistenten zu chatten.',
    'chat.welcome.cta': 'Neues Gespräch erstellen',
    'chat.select.conversation': 'Gespräch auswählen',
    'chat.conversations.new': 'Neu',
    'chat.conversations.search': 'Gespräche suchen...',
    'chat.conversations.empty': 'Sie haben noch keine Gespräche',
    'chat.filters.all': 'Alle',
    'chat.filters.today': 'Heute',
    'chat.filters.week': 'Woche',
    'chat.filters.month': 'Monat',
    'chat.conversations.noResults': 'Keine Gespräche mit diesen Filtern gefunden',
    'chat.conversations.creating': 'Erstellen...',
    'chat.conversations.createFirst': 'Erstes Gespräch erstellen',
    'chat.assistant.greeting': 'Hallo! Ich bin Ihr spezialisierter Assistent für psychische Gesundheit. Sie können mich fragen zu:',
    'chat.suggestions.anxiety': 'Ich fühle mich ängstlich',
    'chat.suggestions.sleep': 'Ich brauche Rat zum besseren Schlafen',
    'chat.suggestions.sleepShort': 'Schlafprobleme',
    'chat.suggestions.stress': 'Wie kann ich Stress bewältigen?',
    'chat.suggestions.stressShort': 'Stressbewältigung',
    'chat.placeholder': 'Schreiben Sie Ihre Frage zur psychischen Gesundheit...',
    'chat.send': 'Senden',
    'chat.limit.reached': 'Sie haben Ihr monatliches Fragenlimit erreicht',
    'chat.limit.remaining': 'Fragen verbleibend',
    'chat.limit.of': 'von',
  },
  
  it: {
    'nav.home': 'Home',
    'chat.welcome.title': 'Benvenuto nella Chat NFLOW',
    'chat.welcome.description': 'Seleziona una conversazione esistente o creane una nuova per iniziare a chattare con il nostro assistente AI.',
    'chat.welcome.cta': 'Crea Nuova Conversazione',
    'chat.select.conversation': 'Seleziona una conversazione',
    'chat.conversations.new': 'Nuovo',
    'chat.conversations.search': 'Cerca conversazioni...',
    'chat.conversations.empty': 'Non hai ancora conversazioni',
    'chat.filters.all': 'Tutto',
    'chat.filters.today': 'Oggi',
    'chat.filters.week': 'Settimana',
    'chat.filters.month': 'Mese',
    'chat.conversations.noResults': 'Nessuna conversazione trovata con questi filtri',
    'chat.conversations.creating': 'Creazione...',
    'chat.conversations.createFirst': 'Crea prima conversazione',
    'chat.assistant.greeting': 'Ciao! Sono il tuo assistente specializzato in salute mentale. Puoi chiedermi di:',
    'chat.suggestions.anxiety': 'Mi sento ansioso',
    'chat.suggestions.sleep': 'Ho bisogno di consigli per dormire meglio',
    'chat.suggestions.sleepShort': 'Problemi di sonno',
    'chat.suggestions.stress': 'Come posso gestire lo stress?',
    'chat.suggestions.stressShort': 'Gestione dello stress',
    'chat.placeholder': 'Scrivi la tua domanda sulla salute mentale...',
    'chat.send': 'Invia',
    'chat.limit.reached': 'Hai raggiunto il tuo limite mensile di domande',
    'chat.limit.remaining': 'domande rimanenti',
    'chat.limit.of': 'di',
  },
  
  pt: {
    'nav.home': 'Início',
    'chat.welcome.title': 'Bem-vindo ao Chat NFLOW',
    'chat.welcome.description': 'Selecione uma conversa existente ou crie uma nova para começar a conversar com nosso assistente de IA.',
    'chat.welcome.cta': 'Criar Nova Conversa',
    'chat.select.conversation': 'Selecionar uma conversa',
    'chat.conversations.new': 'Nova',
    'chat.conversations.search': 'Buscar conversas...',
    'chat.conversations.empty': 'Você ainda não tem conversas',
    'chat.filters.all': 'Todas',
    'chat.filters.today': 'Hoje',
    'chat.filters.week': 'Semana',
    'chat.filters.month': 'Mês',
    'chat.conversations.noResults': 'Nenhuma conversa encontrada com estes filtros',
    'chat.conversations.creating': 'Criando...',
    'chat.conversations.createFirst': 'Criar primeira conversa',
    'chat.assistant.greeting': 'Olá! Sou seu assistente especializado em saúde mental. Você pode me perguntar sobre:',
    'chat.suggestions.anxiety': 'Estou me sentindo ansioso',
    'chat.suggestions.sleep': 'Preciso de conselhos para dormir melhor',
    'chat.suggestions.sleepShort': 'Problemas de sono',
    'chat.suggestions.stress': 'Como posso lidar com o estresse?',
    'chat.suggestions.stressShort': 'Gestão do estresse',
    'chat.placeholder': 'Escreva sua pergunta sobre saúde mental...',
    'chat.send': 'Enviar',
    'chat.limit.reached': 'Você atingiu seu limite mensal de perguntas',
    'chat.limit.remaining': 'perguntas restantes',
    'chat.limit.of': 'de',
  },
  
  ca: {
    'nav.home': 'Inici',
    'chat.welcome.title': 'Benvingut al Xat NFLOW',
    'chat.welcome.description': 'Selecciona una conversa existent o crea\'n una de nova per començar a xerrar amb el nostre assistent d\'IA.',
    'chat.welcome.cta': 'Crear Nova Conversa',
    'chat.select.conversation': 'Seleccionar una conversa',
    'chat.conversations.new': 'Nova',
    'chat.conversations.search': 'Buscar converses...',
    'chat.conversations.empty': 'Encara no tens converses',
    'chat.filters.all': 'Tot',
    'chat.filters.today': 'Avui',
    'chat.filters.week': 'Setmana',
    'chat.filters.month': 'Mes',
    'chat.conversations.noResults': 'No s\'han trobat converses amb aquests filtres',
    'chat.conversations.creating': 'Creant...',
    'chat.conversations.createFirst': 'Crear primera conversa',
    'chat.assistant.greeting': 'Hola! Sóc el teu assistent especialitzat en salut mental. Pots preguntar-me sobre:',
    'chat.suggestions.anxiety': 'Em sento ansiós',
    'chat.suggestions.sleep': 'Necessito consells per dormir millor',
    'chat.suggestions.sleepShort': 'Problemes de son',
    'chat.suggestions.stress': 'Com puc gestionar l\'estrès?',
    'chat.suggestions.stressShort': 'Gestió de l\'estrès',
    'chat.placeholder': 'Escriu la teva pregunta sobre salut mental...',
    'chat.send': 'Enviar',
    'chat.limit.reached': 'Has arribat al teu límit mensual de preguntes',
    'chat.limit.remaining': 'preguntes restants',
    'chat.limit.of': 'de',
  },
  
  eu: {
    'nav.home': 'Hasiera',
    'chat.welcome.title': 'Ongi etorri NFLOW Txatera',
    'chat.welcome.description': 'Hautatu existitzen den elkarrizketa bat edo sortu berri bat gure AI laguntzailearekin hitz egiten hasteko.',
    'chat.welcome.cta': 'Elkarrizketa Berria Sortu',
    'chat.select.conversation': 'Elkarrizketa bat hautatu',
    'chat.conversations.new': 'Berria',
    'chat.conversations.search': 'Bilatu elkarrizketak...',
    'chat.conversations.empty': 'Oraindik ez duzu elkarrizketarik',
    'chat.filters.all': 'Guztiak',
    'chat.filters.today': 'Gaur',
    'chat.filters.week': 'Astea',
    'chat.filters.month': 'Hilabetea',
    'chat.conversations.noResults': 'Ez da elkarrizketarik aurkitu iragazki hauekin',
    'chat.conversations.creating': 'Sortzen...',
    'chat.conversations.createFirst': 'Lehen elkarrizketa sortu',
    'chat.assistant.greeting': 'Kaixo! Osasun mentaleko laguntzaile espezializatua naiz. Galde diezadakezu:',
    'chat.suggestions.anxiety': 'Antsietatea sentitzen dut',
    'chat.suggestions.sleep': 'Hobeto lotzeko aholkuak behar ditut',
    'chat.suggestions.sleepShort': 'Lo hartzeko arazoak',
    'chat.suggestions.stress': 'Nola kudeatu estresa?',
    'chat.suggestions.stressShort': 'Estres kudeaketa',
    'chat.placeholder': 'Idatzi zure osasun mentalari buruzko galdera...',
    'chat.send': 'Bidali',
    'chat.limit.reached': 'Zure hilabeteko galdera muga bete duzu',
    'chat.limit.remaining': 'galdera geratzen dira',
    'chat.limit.of': '-tik',
  },
  
  gl: {
    'nav.home': 'Inicio',
    'chat.welcome.title': 'Benvido ao Chat NFLOW',
    'chat.welcome.description': 'Selecciona unha conversa existente ou crea unha nova para comezar a falar co noso asistente de IA.',
    'chat.welcome.cta': 'Crear Nova Conversa',
    'chat.select.conversation': 'Seleccionar unha conversa',
    'chat.conversations.new': 'Nova',
    'chat.conversations.search': 'Buscar conversas...',
    'chat.conversations.empty': 'Aínda non tes conversas',
    'chat.filters.all': 'Todo',
    'chat.filters.today': 'Hoxe',
    'chat.filters.week': 'Semana',
    'chat.filters.month': 'Mes',
    'chat.conversations.noResults': 'Non se atoparon conversas con estes filtros',
    'chat.conversations.creating': 'Creando...',
    'chat.conversations.createFirst': 'Crear primeira conversa',
    'chat.assistant.greeting': 'Ola! Son o teu asistente especializado en saúde mental. Podes preguntarme sobre:',
    'chat.suggestions.anxiety': 'Síntome ansioso',
    'chat.suggestions.sleep': 'Necesito consellos para durmir mellor',
    'chat.suggestions.sleepShort': 'Problemas de sono',
    'chat.suggestions.stress': 'Como podo xestionar o estrés?',
    'chat.suggestions.stressShort': 'Xestión do estrés',
    'chat.placeholder': 'Escribe a túa pregunta sobre saúde mental...',
    'chat.send': 'Enviar',
    'chat.limit.reached': 'Alcanzaches o teu límite mensual de preguntas',
    'chat.limit.remaining': 'preguntas restantes',
    'chat.limit.of': 'de',
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
    const translation = translations[currentLanguage]?.[key] || translations['es']?.[key];
    return translation || key;
  };

  useEffect(() => {
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  const contextValue = { currentLanguage, setLanguage, t };

  return React.createElement(
    LanguageContext.Provider,
    { value: contextValue },
    children
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}