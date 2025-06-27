import { useState, useEffect } from 'react';

export type Language = 'es' | 'en' | 'fr' | 'de' | 'it' | 'pt' | 'ca' | 'eu' | 'gl';

export const languages = [
  { code: 'es' as Language, name: 'Español', flag: '🇪🇸' },
  { code: 'en' as Language, name: 'English', flag: '🇺🇸' },
  { code: 'fr' as Language, name: 'Français', flag: '🇫🇷' },
  { code: 'de' as Language, name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it' as Language, name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt' as Language, name: 'Português', flag: '🇵🇹' },
  { code: 'ca' as Language, name: 'Català', flag: '🏴' },
  { code: 'eu' as Language, name: 'Euskera', flag: '🏴' },
  { code: 'gl' as Language, name: 'Galego', flag: '🏴' }
];

const translations = {
  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.chat': 'Chat de Apoyo',
    'nav.resources': 'Recursos',
    'nav.examples': 'Ejemplos',
    'nav.subscribe': 'Suscribirse',
    'nav.login': 'Iniciar Sesión',
    'nav.register': 'Registrarse',
    'nav.connected': 'Conectado',
    'nav.disconnected': 'Desconectado',
    
    // Hero Section
    'hero.title': 'Tu psicólogo personal',
    'hero.subtitle': 'disponible 24/7',
    'hero.description': 'Apoyo profesional en salud mental con inteligencia artificial avanzada. Conversaciones confidenciales y respuestas personalizadas para tu bienestar emocional.',
    'hero.cta.primary': 'Empezar Chat Gratis',
    'hero.cta.secondary': 'Ver Ejemplos',
    'hero.cta': 'Empezar Chat Gratis',
    'hero.trusted': 'Confiado por más de 1,000 usuarios',
    
    // Age Notice
    'age.title': '⚠️ Aviso Importante: Edad Mínima',
    'age.description': 'Este servicio está diseñado para personas de 12 a 95 años. Si eres menor de 18, recomendamos supervisión adulta.',
    'age.emergency': 'En caso de emergencia, contacta inmediatamente con los servicios de emergencia (112 en España).',
    'ageWarning.title': '⚠️ Aviso Importante: Edad Mínima',
    'ageWarning.subtitle': 'Este servicio está diseñado para personas de 12 a 95 años. Si eres menor de 18, recomendamos supervisión adulta.',
    'ageWarning.years': 'años',
    
    // Services
    'services.title': 'Cuatro Soluciones Especializadas',
    'services.subtitle': 'Cada una diseñada para abordar necesidades específicas de salud mental',
    'services.modern.title1': 'Cuatro Soluciones',
    'services.modern.title2': 'Especializadas',
    'services.modern.description': 'Cada una diseñada para abordar necesidades específicas de salud mental',
    'services.modern.feature1': 'NFLOW Familias - Apoyo para toda la familia',
    'services.modern.feature2': 'NFLOW Laboral - Salud mental en el trabajo',
    'services.modern.feature3': 'NFLOW Adultos - Terapia personalizada',
    
    // Examples Section
    'examples.assistant.title': 'Tu Asistente de IA Especializado',
    'examples.assistant.description': 'Experimenta conversaciones naturales con nuestro asistente de salud mental',
    'examples.features.language.title': 'Multiidioma',
    'examples.features.language.description': 'Respuestas en 9 idiomas diferentes',
    'examples.features.ages.title': 'Para Todas las Edades',
    'examples.features.ages.description': 'Adaptado para adolescentes y adultos',
    'examples.features.professional.title': 'Respuestas Profesionales',
    'examples.features.professional.description': 'Basado en psicología clínica',
    'examples.cta.title': 'Ver Ejemplos Reales',
    'examples.cta.description': 'Explora cómo nuestro asistente de psicología responde a diferentes consultas según tu edad y situación personal.',
    'examples.cta.includes': 'Ejemplos incluyen:',
    'examples.cta.item1': 'Ansiedad en adolescentes',
    'examples.cta.item2': 'Crisis profesional en adultos',
    'examples.cta.item3': 'Duelo en la tercera edad',
    'examples.cta.item4': 'Problemas familiares',
    'examples.cta.button': 'Ver ejemplos del chat',
    'examples.cta.note': 'Gratis • Sin necesidad de registro',
    
    // Pricing Section
    'pricing.title': 'NFLOW Premium',
    'pricing.subtitle': 'Suscripción Premium',
    'pricing.description': 'Desbloquea acceso completo a recursos exclusivos y servicios personalizados',
    'pricing.popular': 'Más Popular',
    'pricing.perMonth': 'por mes',
    'pricing.activeSubscription': 'Suscripción Activa',
    'pricing.selectPlan': 'Seleccionar Plan',
    
    // Pricing Plans
    'pricing.basic.name': 'Plan Básico',
    'pricing.basic.description': 'Acceso a recursos premium',
    'pricing.basic.feature1': 'Acceso completo a todos los recursos premium',
    'pricing.basic.feature2': 'Consejos personalizados',
    'pricing.basic.feature3': 'Contenido actualizado semanalmente',
    'pricing.basic.feature4': 'Sin publicidad',
    
    'pricing.group.name': 'Plan Grupal',
    'pricing.group.description': 'Chat grupal quincenal',
    'pricing.group.feature1': 'Todo lo incluido en el Plan Básico',
    'pricing.group.feature2': 'Recursos adicionales de terapia grupal',
    'pricing.group.feature3': 'Ejercicios prácticos guiados',
    'pricing.group.feature4': 'Prioridad en soporte',
    
    'pricing.individual.name': 'Plan Individual',
    'pricing.individual.description': 'Chat semanal personalizado',
    'pricing.individual.feature1': 'Todo lo incluido en el Plan Grupal',
    'pricing.individual.feature2': 'Plan de seguimiento personalizado',
    'pricing.individual.feature3': 'Acceso anticipado a nuevas funcionalidades',
    
    // Chat
    'chat.welcome.title': 'Bienvenido a NFLOW Chat',
    'chat.welcome.description': 'Selecciona una conversación existente o crea una nueva para comenzar a chatear con nuestro asistente de IA.',
    'chat.welcome.cta': 'Crear Nueva Conversación',
    'chat.select.conversation': 'Seleccionar conversación',
    'chat.conversations.new': 'Nuevo',
    'chat.conversations.search': 'Buscar conversaciones...',
    'chat.suggestions.anxiety': 'Me siento ansioso',
    'chat.suggestions.sleep': 'Necesito consejos para dormir mejor',
    'chat.suggestions.sleepShort': 'Problemas para dormir',
    'chat.suggestions.stress': '¿Cómo puedo manejar el estrés?',
    'chat.suggestions.stressShort': 'Manejo del estrés',
    
    // PWA Install
    'pwa.title': 'Instalar NFLOW',
    'pwa.subtitle': 'Descarga la app para acceso rápido',
    'pwa.install': 'Instalar App',
    'pwa.dismiss': 'Ahora no',
    'pwa.feature1': 'Acceso Instantáneo',
    'pwa.feature1.desc': 'Sin esperas, desde tu pantalla inicio',
    'pwa.feature2': 'Privacidad Total',
    'pwa.feature2.desc': 'Tus conversaciones son 100% confidenciales',
    'pwa.feature3': 'Funciona Sin Internet',
    'pwa.feature3.desc': 'Accede a recursos guardados offline',

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
    'nav.connected': 'Connected',
    'nav.disconnected': 'Disconnected',
    
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
    'ageWarning.years': 'years old',
    
    // Services
    'services.title': 'Four Specialized Solutions',
    'services.subtitle': 'Each designed to address specific mental health needs',
    'services.modern.title1': 'Four Specialized',
    'services.modern.title2': 'Solutions',
    'services.modern.description': 'Each designed to address specific mental health needs',
    'services.modern.feature1': 'NFLOW Families - Support for the whole family',
    'services.modern.feature2': 'NFLOW Workplace - Mental health at work',
    'services.modern.feature3': 'NFLOW Adults - Personalized therapy',
    
    // Examples Section
    'examples.assistant.title': 'Your Specialized AI Assistant',
    'examples.assistant.description': 'Experience natural conversations with our mental health assistant',
    'examples.features.language.title': 'Multilingual',
    'examples.features.language.description': 'Responses in 9 different languages',
    'examples.features.ages.title': 'For All Ages',
    'examples.features.ages.description': 'Adapted for teenagers and adults',
    'examples.features.professional.title': 'Professional Responses',
    'examples.features.professional.description': 'Based on clinical psychology',
    'examples.cta.title': 'See Real Examples',
    'examples.cta.description': 'Explore how our psychology assistant responds to different queries based on your age and personal situation.',
    'examples.cta.includes': 'Examples include:',
    'examples.cta.item1': 'Teen anxiety',
    'examples.cta.item2': 'Adult career crisis',
    'examples.cta.item3': 'Senior grief support',
    'examples.cta.item4': 'Family problems',
    'examples.cta.button': 'View chat examples',
    'examples.cta.note': 'Free • No registration required',
    
    // Pricing Section
    'pricing.title': 'NFLOW Premium',
    'pricing.subtitle': 'Premium Subscription',
    'pricing.description': 'Unlock complete access to exclusive resources and personalized services',
    'pricing.popular': 'Most Popular',
    'pricing.perMonth': 'per month',
    'pricing.activeSubscription': 'Active Subscription',
    'pricing.selectPlan': 'Select Plan',
    
    // Pricing Plans
    'pricing.basic.name': 'Basic Plan',
    'pricing.basic.description': 'Access to premium resources',
    'pricing.basic.feature1': 'Complete access to all premium resources',
    'pricing.basic.feature2': 'Personalized advice',
    'pricing.basic.feature3': 'Weekly updated content',
    'pricing.basic.feature4': 'Ad-free experience',
    
    'pricing.group.name': 'Group Plan',
    'pricing.group.description': 'Bi-weekly group chat',
    'pricing.group.feature1': 'Everything included in Basic Plan',
    'pricing.group.feature2': 'Additional group therapy resources',
    'pricing.group.feature3': 'Guided practical exercises',
    'pricing.group.feature4': 'Priority support',
    
    'pricing.individual.name': 'Individual Plan',
    'pricing.individual.description': 'Weekly personalized chat',
    'pricing.individual.feature1': 'Everything included in Group Plan',
    'pricing.individual.feature2': 'Personalized follow-up plan',
    'pricing.individual.feature3': 'Early access to new features',
    
    // Chat
    'chat.welcome.title': 'Welcome to NFLOW Chat',
    'chat.welcome.description': 'Select an existing conversation or create a new one to start chatting with our AI assistant.',
    'chat.welcome.cta': 'Create New Conversation',
    'chat.select.conversation': 'Select conversation',
    'chat.conversations.new': 'New',
    'chat.conversations.search': 'Search conversations...',
    'chat.suggestions.anxiety': 'I feel anxious',
    'chat.suggestions.sleep': 'I need advice to sleep better',
    'chat.suggestions.sleepShort': 'Sleep problems',
    'chat.suggestions.stress': 'How can I manage stress?',
    'chat.suggestions.stressShort': 'Stress management',
    
    // PWA Install
    'pwa.title': 'Install NFLOW',
    'pwa.subtitle': 'Download the app for quick access',
    'pwa.install': 'Install App',
    'pwa.dismiss': 'Not now',
    'pwa.feature1': 'Instant Access',
    'pwa.feature1.desc': 'No waiting, from your home screen',
    'pwa.feature2': 'Total Privacy',
    'pwa.feature2.desc': 'Your conversations are 100% confidential',
    'pwa.feature3': 'Works Offline',
    'pwa.feature3.desc': 'Access saved resources without internet',

    // Emergency
    'emergency.title': 'Emergency Numbers',
    'emergency.description': 'If you need immediate help, contact these emergency services',
    'emergency.spain': 'Spain - Emergency',
    'emergency.hope': 'Telephone of Hope',
    'emergency.suicide': 'Suicide Prevention',
    'emergency.close': 'Close',
  },
  
  // Placeholder for other languages
  fr: {
    'nav.home': 'Accueil',
    'chat.welcome.title': 'Bienvenue dans NFLOW Chat',
  },
  de: {
    'nav.home': 'Startseite',
    'chat.welcome.title': 'Willkommen bei NFLOW Chat',
  },
  it: {
    'nav.home': 'Casa',
    'chat.welcome.title': 'Benvenuto in NFLOW Chat',
  },
  pt: {
    'nav.home': 'Início',
    'chat.welcome.title': 'Bem-vindo ao NFLOW Chat',
  },
  ca: {
    'nav.home': 'Inici',
    'chat.welcome.title': 'Benvingut a NFLOW Chat',
  },
  eu: {
    'nav.home': 'Hasiera',
    'chat.welcome.title': 'Ongi etorri NFLOW Chat-era',
  },
  gl: {
    'nav.home': 'Inicio',
    'chat.welcome.title': 'Benvido a NFLOW Chat',
  }
};

export function useLanguage() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('es');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('nflow-language') as Language;
    if (savedLanguage && languages.find(lang => lang.code === savedLanguage)) {
      setCurrentLanguage(savedLanguage);
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

  return {
    currentLanguage,
    changeLanguage,
    t,
    languages
  };
}

