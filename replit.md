# NFLOW - Asistente de Salud Mental con IA

## Overview
NFLOW es una aplicación para la salud mental de personas individuales, familias y trabajadores. Ofrece soluciones innovadoras que integren salud mental y desarrollo laboral, alineadas con los principios de la normativa ISO 45003, centrada en el bienestar psicológico en el entorno de trabajo. NFLOW funciona como un recurso digital de apoyo emocional continuo, diseñado para una capacidad ilimitada de usuarios, con activación automática de suscripciones a través de PayPal y Stripe, sin requerir intervención manual.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 con TypeScript
- **Build Tool**: Vite
- **UI Framework**: Shadcn/ui components con Tailwind CSS
- **State Management**: TanStack Query (React Query) para estado del servidor
- **Routing**: Wouter
- **Styling**: Tailwind CSS con variables CSS personalizadas

### Backend
- **Runtime**: Node.js con TypeScript
- **Framework**: Express.js
- **Session Management**: Express-session para autenticación de admin y partners
- **Authentication**: bcrypt para hash de contraseñas
- **API Design**: RESTful endpoints con validación mediante Zod schemas

### Database
- **Database**: PostgreSQL (configurado para Neon serverless)
- **ORM**: Drizzle ORM con migraciones automáticas
- **Connection**: Pool de conexiones con @neondatabase/serverless
- **Schema Location**: `shared/schema.ts`

### Key Features
- **AI Chat System**: Integración con OpenAI GPT-4o, prompt engineering contextual, persistencia de conversaciones, interfaz responsiva y soporte multi-idioma.
- **User Management**: Registro/login, roles de usuario (user, admin, partner), seguimiento de sesión.
- **Subscription System**: Integración con PayPal y Stripe SDK para pagos y suscripciones, activación automática vía webhooks, planes de suscripción (basic, group, individual), control de acceso al chat.
- **Content Management**: Sistema de artículos, guías y ejercicios categorizados (ansiedad, familia, bienestar, laboral, autoestima).
- **Partner Program**: Sistema de aplicación y aprobación de partners, referidos, y dashboard de gestión.
- **UI/UX Decisions**: Diseño profesional con componentes Shadcn/ui y Tailwind CSS, uso de gradientes y elementos visuales para mejorar la experiencia del usuario, navegación simplificada.
- **Technical Implementations**: PWA instalación guiada para acceso móvil, integración de Google Translate para soporte multi-idioma.
- **System Design Choices**: Soporte para arquitectura serverless con Neon, énfasis en automatización completa del flujo de usuarios y pagos, modularidad de componentes frontend y backend.
- **Pricing Page Architecture**: Página de precios completamente informativa sin lógica de pagos, usuarios no registrados ven botón "Crear Cuenta Gratis", usuarios registrados ven "Ir a Mi Cuenta".
- **User Flow Verification (21/8/2025)**: Flujo completo verificado exitosamente - registro, login, activación de suscripción PayPal, acceso al chat con respuestas NEUROPSI-AI completas y control de límites operativo.
- **Authentication System Fully Operational (22/8/2025)**: Sistema de login completamente funcional después de corregir problemas de hash de contraseña. Usuario de prueba prueba2025/nflow2025 con suscripción activa y acceso completo al chat NEUROPSI-AI verificado.
- **Single Page Experience (22/8/2025)**: Página principal transformada en experiencia fluida con todas las secciones del menú integradas: Blog, Precios, Partners, App Móvil, Nosotros, Contacto, Testimonios reales y sección del Fundador. Navegación suave entre secciones con múltiples botones "Comenzar Ahora" para maximizar conversiones. Imagen profesional del fundador Ramón Molons de San Román integrada con credenciales completas y especialización ISO 45003.
- **Navigation Consolidation (22/8/2025)**: Navegación unificada completamente - eliminado botón "Acceso" redundante del header, todos los botones "Comenzar Ahora" redirigen a /login, menú móvil actualizado con "Comenzar Ahora", eliminado bucle de registro /registro, colores estandarizados a Tailwind, navegación limpia sin redundancias para mejor UX y conversión.
- **Mobile UX & Chat Fixes (12/9/2025)**: Solucionados bugs críticos del sistema de chat - implementado scroll responsive móvil usando clases Tailwind (md:overflow-hidden, md:h-[calc(100vh-64px)]) permitiendo scroll natural en móvil vs scroll fijo en desktop, arreglado bug de input deshabilitado después de crear conversación usando mutateAsync() con await correcto, corregida microinteractividad de NEUROPSI-AI donde checkboxes y botones Sí/No no respondían a clicks añadiendo visibleSections como dependencia del useEffect para re-attach de event listeners. Sistema de chat completamente funcional en móvil y desktop.
- **Partner Dashboard Enhancement - Phase 1 (25/9/2025)**: Implementadas mejoras comprehensivas del dashboard de partners para maximizar conversiones y engagement. Agregadas tres nuevas secciones: Analytics y Conversión con métricas de tasa conversión, pagos exitosos, pendientes y promedio por referido; Kit de Enlaces Promocionales con mensajes preformateados para WhatsApp, email, redes sociales y enlace general con funcionalidad de copia; Lista de Referidos con historial completo, estados y comisiones detalladas. Contadores de partner ceo@nflow.test reseteados a cero para uso comercial. Todas las funcionalidades probadas exitosamente con 18 verificaciones completadas.
- **Video Demo Cross-Browser Compatibility (29/9/2025)**: Resueltos definitivamente los problemas de compatibilidad de video entre navegadores mediante implementación de solución CSS profesional. Reemplazado video problemático con diseño visual gradiente azul que simula interfaz de NEUROPSI-AI usando iconos Lucide (Brain, MessageCircle). Mantiene marco de TV y soporte visual pero elimina completamente dependencias de archivos multimedia externos. Solución 100% compatible, carga instantánea, sin errores de codec ni DEMUXER_ERROR_NO_SUPPORTED_STREAMS. Resultado: demostración professional y estable que funciona perfectamente en todos los entornos (development, production, todos los navegadores).
- **Free Resources Section - Recursos Gratis (30/9/2025)**: Implementada nueva sección de recursos gratuitos completamente funcional SIN necesidad de autenticación inspirada en Yana app. Página /recursos rediseñada para funcionar 100% en el navegador usando localStorage. Características: (1) Registro Emocional - selector de 6 emociones con notas opcionales, guardado en localStorage; (2) Sistema de Racha Diaria - tracking automático de días consecutivos con localStorage, incremento solo en nuevos días; (3) Afirmaciones - 5 afirmaciones rotativas con Web Share API y descarga; (4) Evaluaciones Profesionales - tests de ansiedad/depresión/autoestima con 4 preguntas c/u, resultados inmediatos calculados como porcentaje y categorizados; (5) CTA final para upgrade a NEUROPSI-AI premium. Todo funciona sin backend, sin modales que bloqueen, datos persisten localmente. Agregado "Recursos Gratis" con ícono Gift al menú. Tests end-to-end completados: registro emocional guardado, racha incrementada 0→1, afirmaciones rotadas, evaluación ansiedad completada con resultado "Moderado", CTA redirect a /login exitoso.
- **Partner Referral Links System (4/10/2025)**: Implementado sistema completo de links referenciados para partners, maximizando conversiones mediante pre-relleno automático. Dashboard de partners ahora muestra AMBOS: (1) Código de referencia tradicional para copiar/pegar manual, y (2) Link referenciado directo con formato `/registro?ref={codigo}` que pre-rellena automáticamente el campo al abrir. Hook useReferralCode mejorado para detectar parámetro URL ?ref=, guardar en localStorage, validar en tiempo real con API, y rastrear origen (manual vs URL). Página de registro con campo visible de código de referencia, bloqueado (readonly) cuando viene desde link, validación visual con checkmarks verde/rojo, mensaje confirmación "✓ Código aplicado automáticamente". Kit de Enlaces Promocionales actualizado con URLs correctas para WhatsApp, Email, Redes Sociales. Test e2e exitoso: partner generó código NFLOWCEO_3_4503, link funcionó correctamente, campo pre-rellenado y bloqueado, registro completado, código guardado en partner_referrals tabla. Sistema 100% operacional para maximizar conversiones de partners.
- **Permanent Referral Code System (4/10/2025)**: Implementado sistema de código de referencia PERMANENTE para cada partner. Agregado campo `referralCode` a tabla `partners` con constraint unique. Cada partner tiene UN ÚNICO código permanente guardado en su perfil. Endpoint `/api/partners/generate-code` modificado para verificar si ya existe código antes de generar uno nuevo. Dashboard carga automáticamente el código existente al iniciar sesión. Webhook de Stripe actualizado para buscar `partner_referrals` pendientes incluso sin metadata, asegurando comisiones correctas tanto para códigos manuales como links referenciados. Soluciona bug donde cada generación creaba códigos duplicados. Sistema totalmente automático: registro con link → pending referral → pago Stripe → webhook actualiza a completed con comisión €0.30 (10% de €2.99).
- **Registration Page Branding Enhancement (4/10/2025)**: Rediseñada página de registro con elementos visuales elegantes en laterales para mostrar claramente la identidad de marca NFLOW.style. Implementados paneles decorativos izquierdo y derecho (256px c/u) visibles solo en desktop (≥1024px) con gradientes azul, logo, features (Chat IA NEUROPSI, ISO 45003, Recursos Gratis), y dominio nflow.style destacado. En móvil/tablet, laterales ocultos automáticamente mostrando solo card central. Usuarios que llegan desde links de partners ahora ven claramente que están en NFLOW.style. Test e2e verificado: laterales visibles desktop, código de referencia pre-rellenado, responsive móvil funcionando correctamente.
- **Gift Box Prizes Modal (12/10/2025)**: Implementada cajita de regalo en header con modal informativo de premios. Cajita naranja con animación hover posicionada a la izquierda del selector de idiomas ES/GB. Al hacer clic abre modal elegante con información de sorteos de premios por hitos de usuarios activos (15K→10 iPhones, 30K→20 iPhones, 150K→10 bicicletas, 300K→20 portátiles). Modal incluye botón "Fecha sorteos" enlazando a https://jobda.org/. Diseño responsive en móvil/tablet/desktop, totalmente accesible con navegación por teclado y aria-labels. Tests e2e verificados: modal abre correctamente, link externo funciona, accesibilidad confirmada.
- **Homepage Hero Section Optimization (12/10/2025)**: Rediseñado Hero principal (FamilySupportHeroSection) para maximizar conversiones. Cambios implementados: (1) Título actualizado de "Apoyo emocional para las personas" a "Tu Psicólogo IA Disponible 24/7" (más específico y action-oriented); (2) Subtítulo mejorado destacando "español" y "30+ años de experiencia clínica"; (3) Agregados dos botones CTA prominentes: "Comenzar Ahora" (primario, gradiente naranja, navega a /login) y "Ver Cómo Funciona" (secundario, outline, scroll a #tour-nflow sección del tour); (4) Prueba social visible: "+15,000 conversaciones de apoyo" con avatares de usuarios y rating "⭐⭐⭐⭐⭐ 4.8/5" con aria-label para accesibilidad; (5) Botones responsive apilados verticalmente en móvil. Architect aprobó implementación, tests e2e exitosos en desktop/móvil: navegación a /login funciona, scroll suave a tour de NFLOW operativo, accesibilidad verificada.
- **SEO Implementation Complete (14/10/2025)**: Implementado sistema SEO comprehensivo para mejorar posicionamiento en Google. Componentes creados: (1) SEOHead - componente reutilizable para meta tags dinámicos (title, description, keywords, OG, Twitter Cards, canonical); (2) StructuredData - Schema.org JSON-LD para Organization y WebApplication. Meta tags optimizados implementados en todas las páginas principales: Home (título "NFLOW - Psicólogo IA 24/7 | Salud Mental"), Login, Registro, Precios (con pricing €2.99/mes), Chat (NEUROPSI-AI), Recursos, Partners. Sitemap.xml creado con todas URLs públicas. Keywords SEO integradas naturalmente: "psicólogo IA", "salud mental", "apoyo emocional", "chat psicológico", "ISO 45003", "24/7", "terapia online". Estructura HTML semántica verificada (H1, H2, H3). Open Graph y Twitter Cards funcionando para compartir en redes sociales. Tests e2e exitosos confirmando meta tags, Schema.org y canonical URLs. Architect aprobó implementación completa - lista para producción.

## External Dependencies

### AI and APIs
- **OpenAI API**: GPT-4o model for chat responses
- **PayPal SDK**: Payment processing and subscription management
- **Stripe**: Payment processing and subscription management

### UI and Styling
- **Radix UI**: Headless components for accessibility
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library

### Development Tools
- **TypeScript**: Type safety across frontend and backend
- **ESBuild**: Fast bundling for production
- **Drizzle Kit**: Database migrations and schema management