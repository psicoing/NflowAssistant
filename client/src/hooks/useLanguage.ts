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
    'hero.title': 'un psicólogo en tu bolsillo',
    'hero.subtitle': 'Chatbot de psicología para todos los públicos',
    'hero.cta': 'Comenzar ahora',
    'pricing.title': 'Planes de Suscripción',
    'pricing.subtitle': 'Elige el plan que mejor se adapte a tus necesidades',
    'pricing.basic': 'Plan Básico',
    'pricing.price': '€2.99',
    'pricing.features.questions': '10 preguntas mensuales',
    'pricing.features.support': 'Soporte 24/7',
    'pricing.features.conversations': 'Conversaciones ilimitadas',
    'pricing.features.mobile': 'Acceso móvil',
    'pricing.features.ai': 'IA especializada en salud mental',
    
    // Services section
    'services.title': 'Cuatro Soluciones, Una Plataforma',
    'services.subtitle': 'Descubre nuestro ecosistema integral de bienestar mental diseñado para cada etapa de la vida',
    'services.families.title': 'NFLOW Familias',
    'services.families.description': 'Apoyo especializado para la salud mental familiar',
    'services.families.feature1': 'Terapia familiar',
    'services.families.feature2': 'Comunicación efectiva',
    'services.families.feature3': 'Resolución de conflictos',
    'services.adolescents.title': 'NFLOW Adolescentes',
    'services.adolescents.description': 'Apoyo especializado en gestión emocional y estrés escolar',
    'services.adolescents.feature1': 'Gestión del estrés',
    'services.adolescents.feature2': 'Habilidades sociales',
    'services.adolescents.feature3': 'Autoestima',
    'services.workplace.title': 'NFLOW Laboral',
    'services.workplace.description': 'Bienestar mental en el entorno de trabajo',
    'services.workplace.feature1': 'Gestión del estrés laboral',
    'services.workplace.feature2': 'Prevención del burnout',
    'services.workplace.feature3': 'Ambiente saludable',
    'services.adults.title': 'NFLOW Adultos',
    'services.adults.description': 'Apoyo integral para la salud mental en la vida adulta',
    'services.adults.feature1': 'Terapia individual',
    'services.adults.feature2': 'Manejo de ansiedad',
    'services.adults.feature3': 'Crecimiento personal',
    'services.modern.title1': 'Apoyo',
    'services.modern.title2': 'moderno',
    'services.modern.description': 'NFLOW te ofrece herramientas psicológicas basadas en evidencia científica y adaptadas a tu estilo de vida digital.',
    'services.modern.feature1': 'Chat de apoyo psicológico 24/7',
    'services.modern.feature2': 'Seguimiento de tu bienestar emocional',
    'services.modern.feature3': 'Recursos para adolescentes, padres y profesionales',
    
    // Examples section
    'examples.title': 'Ejemplos de Conversación',
    'examples.subtitle': 'Descubre cómo nuestro asistente puede ayudarte con consultas reales',
    'examples.anxiety.title': 'Manejo de Ansiedad',
    'examples.anxiety.query': 'Me siento muy ansioso antes de los exámenes, ¿qué puedo hacer?',
    'examples.anxiety.response': 'Entiendo tu preocupación por los exámenes. Te sugiero técnicas de respiración profunda, planificación de estudio estructurada y ejercicios de relajación progresiva...',
    'examples.anxiety.category': 'Estrés Académico',
    'examples.family.title': 'Comunicación Familiar',
    'examples.family.query': 'Mis padres y yo no nos entendemos, siempre terminamos discutiendo',
    'examples.family.response': 'Los conflictos familiares son normales en la adolescencia. Te recomiendo practicar la escucha activa, expresar tus sentimientos sin atacar y buscar momentos de calma para dialogar...',
    'examples.family.category': 'Relaciones Familiares',
    'examples.selfesteem.title': 'Autoestima',
    'examples.selfesteem.query': 'No me siento bien conmigo mismo, creo que no valgo nada',
    'examples.selfesteem.response': 'Comprendo que te sientes así, y quiero que sepas que estos pensamientos son más comunes de lo que imaginas. Trabajemos en identificar tus fortalezas y logros...',
    'examples.selfesteem.category': 'Bienestar Personal',
    'examples.cta': 'Probar el Chat Ahora',
    'examples.assistant.title': '¿Cómo responde nuestro asistente?',
    'examples.assistant.description': 'Descubre ejemplos reales de cómo NEUROPSI-AI adapta sus respuestas según tu edad, desde adolescentes hasta adultos mayores.',
    'examples.features.language.title': 'Lenguaje Adaptado por Edad',
    'examples.features.language.description': 'Desde un lenguaje cercano y comprensible para adolescentes hasta análisis psicológicos profundos para adultos.',
    'examples.features.ages.title': '16 Franjas de Edad Diferentes',
    'examples.features.ages.description': 'Ejemplos específicos para cada etapa vital, desde 12 hasta 80 años, con situaciones y desafíos reales de cada edad.',
    'examples.features.professional.title': 'Respuestas Profesionales',
    'examples.features.professional.description': 'Consejos estructurados, técnicas específicas y bibliografía especializada para cada situación.',
    
    // Age warning section
    'ageWarning.title': 'Chat disponible a partir de los 12 años',
    'ageWarning.subtitle': 'Edad suficiente para leer, escribir y reflexionar',
    'ageWarning.description': 'NFLOW está diseñado para usuarios de 12 a 95 años. Nuestro sistema de IA especializada proporciona apoyo emocional apropiado para cada etapa de la vida.',
    'ageWarning.badge': '✓ Contenido adaptado por grupos de edad',
    
    // Footer
    'footer.description': 'Tu compañero de bienestar mental, siempre disponible para apoyarte en tu crecimiento personal y emocional.',
    'footer.links.title': 'Enlaces Útiles',
    'footer.links.chat': 'Chat de Apoyo',
    'footer.links.contact': 'Contacto',
    'footer.company.title': 'GRUPO JOBDA',
    'footer.company.description': 'Innovación en tecnología y bienestar digital',
    'footer.company.visit': 'Visitar jobda.biz',
    'footer.copyright': '© 2025 NFLOW - EMPORDAJOBS SL. Todos los derechos reservados.',
    'footer.developed': 'Desarrollado con',
    'footer.tagline': 'para tu bienestar mental',
    
    // Chat
    'chat.placeholder': 'Escribe tu consulta sobre salud mental...',
    'chat.send': 'Enviar',
    'chat.limit.reached': 'Has alcanzado tu límite mensual de preguntas',
    'chat.limit.remaining': 'preguntas restantes este mes',
    'chat.emergency': 'Emergencias',
    'chat.billing': 'Facturación',
    'chat.logout': 'Cerrar Sesión',
    'chat.support.title': 'Chat de Apoyo',
    'chat.conversations.title': 'Conversaciones',
    'chat.conversations.new': 'Nueva Conversación',
    'chat.conversations.empty': 'No hay conversaciones',
    'chat.conversations.search': 'Buscar conversaciones...',
    'chat.filters.all': 'Todas',
    'chat.filters.today': 'Hoy',
    'chat.filters.week': 'Semana',
    'chat.filters.month': 'Mes',
    'chat.language.banner.title': 'Idioma de las Respuestas',
    'chat.language.banner.description': 'El asistente responderá en el idioma seleccionado. Cambia el idioma en cualquier momento para recibir respuestas personalizadas.',
    'chat.welcome.title': 'Bienvenido al Chat de NFLOW',
    'chat.welcome.description': 'Selecciona una conversación existente o crea una nueva para empezar a chatear con nuestro asistente de IA.',
    'chat.welcome.cta': 'Crear Nueva Conversación',
    'chat.select.conversation': 'Selecciona una conversación',
    'chat.conversations.noResults': 'No se encontraron conversaciones con estos filtros',
    'chat.conversations.creating': 'Creando...',
    'chat.conversations.createFirst': 'Crear primera conversación',
    'chat.assistant.greeting': '¡Hola! Soy tu asistente de salud mental especializado. Puedes preguntarme sobre:',
    'chat.suggestions.anxiety': 'Me siento ansioso',
    'chat.suggestions.sleep': 'Necesito consejos para dormir mejor',
    'chat.suggestions.sleepShort': 'Problemas para dormir',
    'chat.suggestions.stress': '¿Cómo puedo manejar el estrés?',
    'chat.suggestions.stressShort': 'Manejo del estrés',
    
    // Emergency
    'emergency.title': 'Números de Emergencia',
    'emergency.description': 'Si necesitas ayuda inmediata, contacta con estos servicios de emergencia',
    'emergency.spain': 'España - Emergencias',
    'emergency.hope': 'Teléfono de la Esperanza',
    'emergency.general': 'Servicio de emergencias general',
    'emergency.suicide': 'Prevención del suicidio y apoyo emocional',
    
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
    'hero.title': 'a psychologist in your pocket',
    'hero.subtitle': 'Psychology chatbot for all audiences',
    'hero.cta': 'Start now',
    'pricing.title': 'Subscription Plans',
    'pricing.subtitle': 'Choose the plan that best fits your needs',
    'pricing.basic': 'Basic Plan',
    'pricing.price': '€2.99',
    'pricing.features.questions': '10 monthly questions',
    'pricing.features.support': '24/7 Support',
    'pricing.features.conversations': 'Unlimited conversations',
    'pricing.features.mobile': 'Mobile access',
    'pricing.features.ai': 'Mental health specialized AI',
    
    // Services section
    'services.title': 'Four Solutions, One Platform',
    'services.subtitle': 'Discover our comprehensive mental wellness ecosystem designed for every stage of life',
    'services.families.title': 'NFLOW Families',
    'services.families.description': 'Specialized support for family mental health',
    'services.families.feature1': 'Family therapy',
    'services.families.feature2': 'Effective communication',
    'services.families.feature3': 'Conflict resolution',
    'services.adolescents.title': 'NFLOW Adolescents',
    'services.adolescents.description': 'Specialized support in emotional management and school stress',
    'services.adolescents.feature1': 'Stress management',
    'services.adolescents.feature2': 'Social skills',
    'services.adolescents.feature3': 'Self-esteem',
    'services.workplace.title': 'NFLOW Workplace',
    'services.workplace.description': 'Mental wellness in the work environment',
    'services.workplace.feature1': 'Workplace stress management',
    'services.workplace.feature2': 'Burnout prevention',
    'services.workplace.feature3': 'Healthy environment',
    'services.adults.title': 'NFLOW Adults',
    'services.adults.description': 'Comprehensive support for mental health in adult life',
    'services.adults.feature1': 'Individual therapy',
    'services.adults.feature2': 'Anxiety management',
    'services.adults.feature3': 'Personal growth',
    'services.modern.title1': 'Modern',
    'services.modern.title2': 'support',
    'services.modern.description': 'NFLOW offers you evidence-based psychological tools adapted to your digital lifestyle.',
    'services.modern.feature1': '24/7 psychological support chat',
    'services.modern.feature2': 'Track your emotional wellbeing',
    'services.modern.feature3': 'Resources for adolescents, parents and professionals',
    
    // Examples section
    'examples.title': 'Conversation Examples',
    'examples.subtitle': 'Discover how our assistant can help you with real queries',
    'examples.anxiety.title': 'Anxiety Management',
    'examples.anxiety.query': 'I feel very anxious before exams, what can I do?',
    'examples.anxiety.response': 'I understand your concern about exams. I suggest deep breathing techniques, structured study planning and progressive relaxation exercises...',
    'examples.anxiety.category': 'Academic Stress',
    'examples.family.title': 'Family Communication',
    'examples.family.query': 'My parents and I don\'t understand each other, we always end up arguing',
    'examples.family.response': 'Family conflicts are normal in adolescence. I recommend practicing active listening, expressing your feelings without attacking and finding calm moments to dialogue...',
    'examples.family.category': 'Family Relationships',
    'examples.selfesteem.title': 'Self-Esteem',
    'examples.selfesteem.query': 'I don\'t feel good about myself, I think I\'m worthless',
    'examples.selfesteem.response': 'I understand you feel that way, and I want you to know that these thoughts are more common than you imagine. Let\'s work on identifying your strengths and achievements...',
    'examples.selfesteem.category': 'Personal Wellbeing',
    'examples.cta': 'Try the Chat Now',
    'examples.assistant.title': 'How does our assistant respond?',
    'examples.assistant.description': 'Discover real examples of how NEUROPSI-AI adapts its responses according to your age, from teenagers to older adults.',
    'examples.features.language.title': 'Age-Adapted Language',
    'examples.features.language.description': 'From close and understandable language for teenagers to deep psychological analysis for adults.',
    'examples.features.ages.title': '16 Different Age Groups',
    'examples.features.ages.description': 'Specific examples for each life stage, from 12 to 80 years, with real situations and challenges for each age.',
    'examples.features.professional.title': 'Professional Responses',
    'examples.features.professional.description': 'Structured advice, specific techniques and specialized bibliography for each situation.',
    
    // Age warning section
    'ageWarning.title': 'Chat available from age 12',
    'ageWarning.subtitle': 'Old enough to read, write and reflect',
    'ageWarning.description': 'NFLOW is designed for users aged 12 to 95 years. Our specialized AI system provides appropriate emotional support for every stage of life.',
    'ageWarning.badge': '✓ Content adapted by age groups',
    
    // Footer
    'footer.description': 'Your mental wellness companion, always available to support you in your personal and emotional growth.',
    'footer.links.title': 'Useful Links',
    'footer.links.chat': 'Support Chat',
    'footer.links.contact': 'Contact',
    'footer.company.title': 'GRUPO JOBDA',
    'footer.company.description': 'Innovation in technology and digital wellness',
    'footer.company.visit': 'Visit jobda.biz',
    'footer.copyright': '© 2025 NFLOW - EMPORDAJOBS SL. All rights reserved.',
    'footer.developed': 'Developed with',
    'footer.tagline': 'for your mental wellness',
    
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
    'chat.conversations.new': 'New Conversation',
    'chat.conversations.empty': 'No conversations',
    'chat.conversations.search': 'Search conversations...',
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
    'chat.conversations.noResults': 'No conversations found with these filters',
    'chat.conversations.creating': 'Creating...',
    'chat.conversations.createFirst': 'Create first conversation',
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
    'emergency.hope': 'Hope Phone',
    'emergency.general': 'General emergency service',
    'emergency.suicide': 'Suicide prevention and emotional support',
    
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