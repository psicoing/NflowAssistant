# NFLOW - Asistente de Salud Mental con IA

## Overview
NFLOW is an AI-powered mental health application designed for individuals, families, and workers. It offers innovative solutions integrating mental health and professional development, aligned with ISO 45003 standards for psychological well-being at work. NFLOW provides continuous emotional support as a digital resource, supporting an unlimited number of users with automated subscription activation via PayPal and Stripe. The project also introduces NUXA as an evolutionary brand, focusing on science, emotion, and human connection in mental wellness.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### UI/UX Decisions
The application features a professional design leveraging Shadcn/ui components and Tailwind CSS, incorporating gradients and visual elements for an enhanced user experience. Key elements include responsive design for mobile and desktop, PWA guided installation, accessibility features, and a consistent brand identity (NFLOW.style, evolving to NUXA.life). The design emphasizes clear calls to action and a seamless, borderless integration of content.

### Technical Implementations
The frontend is built with React 18, TypeScript, Vite, and Wouter for routing, utilizing TanStack Query for server state management. The backend uses Node.js with TypeScript and Express.js, employing `express-session` for authentication and `bcrypt` for password hashing. PostgreSQL, configured for Neon serverless, serves as the database, managed by Drizzle ORM.

### Feature Specifications
- **AI Chat System**: Integrates OpenAI GPT-4o for contextual, persistent, and multi-language conversations.
- **User & Subscription Management**: Supports user roles, registration, login, and automated subscription activation via PayPal and Stripe webhooks, including various plans (basic, individual, premium, group) and chat access control.
- **Content & Partner Management**: Features categorized articles, guides, exercises, and a comprehensive partner program with application, approval, referral tracking, and a dedicated dashboard.
- **Free Resources**: Offers unauthenticated access to emotional logging, daily streak tracking, affirmations, and professional assessments, managed client-side using `localStorage`.
- **SEO**: Comprehensive implementation including dynamic meta tags, Schema.org JSON-LD, sitemap, and optimized content.
- **Cookie Consent**: Implemented a GDPR-compliant cookie consent system.

### System Design Choices
The architecture supports serverless deployment with Neon, emphasizing full automation of user and payment flows. It promotes modularity in both frontend and backend components and ensures robust authentication and data persistence. Referral systems are designed for maximum conversion. The branding has fully migrated from NFLOW to NUXA, including logos, PWA assets, and all primary hero section content.

## External Dependencies

### AI and APIs
- **OpenAI API**: Used for the GPT-4o model powering the AI chat system.
- **PayPal SDK**: Integrated for payment processing and subscription management.
- **Stripe**: Utilized for payment processing and subscription management.

### UI and Styling
- **Radix UI**: Provides headless components for enhanced accessibility.
- **Tailwind CSS**: Employed as a utility-first CSS framework for styling.
- **Lucide React**: Icon library used across the application.

### Development Tools
- **TypeScript**: Ensures type safety throughout the project.
- **ESBuild**: Used for fast bundling in production environments.
- **Drizzle Kit**: Manages database migrations and schema.

## Recent Changes

### Activación de Planes Múltiples (27/10/2025)
**Summary:** Implementado sistema completo de selección entre 3 planes de suscripción (Básico, Individual, Premium).

**Planes Disponibles:**
1. **Plan Básico** (€2.99/mes):
   - Precio: €2.99/mes (sin descuento)
   - Chat ilimitado con IA
   - Soporte 24/7
   - Activación instantánea
   - Acceso a recursos básicos
   - Icono: MessageCircle, Color: Azul

2. **Plan Individual** (€5.99/mes - MÁS POPULAR):
   - Precio: €5.99/mes (antes €19.99 - Ahorra 70%)
   - Consultas ilimitadas con NEUROPSI-AI
   - Acceso completo a todos los recursos
   - Soporte prioritario 24/7
   - Planes de bienestar personalizados
   - Icono: Star, Color: Naranja

3. **Plan Premium** (€32/12 meses):
   - Precio: €32/12 meses (antes €35.56 - Ahorra 10%)
   - Acceso completo por 12 meses
   - Todas las características del plan Individual
   - Contenido exclusivo y actualizaciones
   - Análisis avanzado personalizado
   - Icono: Gem, Color: Morado

**Backend Changes (server/routes.ts):**
- Endpoint `/api/stripe/create-checkout-session` acepta parámetro `plan` ('basic', 'individual', 'premium')
- Configuración de precios: basic (299 cents), individual (599 cents), premium (3200 cents)
- Plan Premium usa interval_count: 12 (anual)
- Metadatos de sesión incluyen plan seleccionado para activación
- Webhook actualizado para procesar plan desde metadata y actualizar suscripción
- Expiración: 30 días (basic/individual), 365 días (premium)
- Sistema de referidos integrado con los 3 planes

**Frontend Changes (client/src/pages/activar-cuenta.tsx):**
- Grid de 3 columnas (md:grid-cols-3) mostrando los 3 planes
- Plan Individual marcado como "MÁS POPULAR" con badge
- Cada plan muestra: precio original tachado (si aplica), precio actual, descuento, características
- Botones individuales de pago por plan
- Diseño responsive: 3 columnas en desktop, apilado en móvil
- Gradientes distintivos: azul (Basic), naranja (Individual), morado (Premium)

**Status:** ✅ Complete and tested. All 3 plans verified on desktop and mobile.

### Actualización de Texto Hero (28/10/2025)
**Summary:** Actualizado el texto principal del hero section para enfatizar el alcance multilingüe.

**Cambio Realizado:**
- **Texto anterior:** "Apoyo emocional y salud mental con IA en español, cuando lo necesites. Chat psicológico profesional que conecta familias, adolescentes y adultos con herramientas de bienestar respaldadas por 30+ años de experiencia clínica ISO 45003."
- **Texto nuevo:** 
  - "NUXA, para personas y empresas."
  - "Apoyo emocional y salud mental con IA en español y más de 150 idiomas."

**Archivo modificado:**
- client/src/components/sections/family-support-hero-section.tsx (línea 28-31)

**Impacto:**
- Mensaje más conciso y directo
- Énfasis en el soporte multilingüe (150+ idiomas)
- Destaca tanto el uso personal como empresarial

**Status:** ✅ Complete and tested. Text verified on desktop and mobile.

### Nueva Sección "¿Para quién es NUXA?" (28/10/2025)
**Summary:** Creada nueva sección antes de "Presentamos NUXA" que clarifica los dos públicos objetivo principales.

**Funcionalidad:**
- Dos columnas mostrando claramente:
  1. **Para Personas**: Adolescentes, jóvenes y adultos que buscan orientación emocional
  2. **Para Empresas**: Organizaciones que cuidan la salud mental de sus empleados (ISO 45003)

**Diseño:**
- Iconos circulares animados con gradientes (User para personas, Building2 para empresas)
- Globos de diálogo simulando conversaciones reales con NUXA
- Características destacadas con bullet points
- Color emerald/teal para personas, blue/cyan para empresas
- Responsive: dos columnas en desktop, apilado en móvil

**Ejemplos de conversación:**
- Persona: "Me siento ansioso últimamente, no sé cómo manejar el estrés..."
- Empresa: "Tengo dificultades para equilibrar el trabajo y mi vida personal..."
- NUXA responde con empatía y orientación profesional

**Archivo:**
- client/src/components/sections/nuxa-purpose-section.tsx
- Incluida en home.tsx (línea 66, antes de NuxaBrandEvolutionSection)

**Status:** ✅ Complete and tested. Section verified on desktop and mobile with proper responsive behavior.

### Migración de Partners a Subpágina Dedicada (28/10/2025)
**Summary:** Toda la información sobre Partners se movió de la página principal a una subpágina dedicada `/partners`.

**Cambios Realizados:**
- **Página Principal (/)**: Ya no muestra ninguna sección de partners
- **Nueva Subpágina (/partners)**: Contiene todas las secciones de partners:
  1. PartnersSection - Programa con comisiones hasta 40%
  2. ReferralInfoSection - Información sobre códigos de referido
  3. CommercialPartnersSection - Equipo comercial de partners

**Navegación:**
- Menú hamburguesa actualizado: opción "Partners" redirige a `/partners` (isPage: true)
- Botón "Volver al Inicio" en la página de partners para regresar a home
- Hero section destacado con título "Programa de Partners"

**Archivos Modificados:**
- client/src/pages/partners.tsx - Reemplazada con nuevo contenido enfocado
- client/src/pages/home.tsx - Eliminadas todas las secciones e importaciones de partners
- client/src/components/ui/smooth-scroll-menu.tsx - Partners configurado como página (isPage: true)

**SEO:**
- Título: "Programa de Partners - NUXA | Gana con Salud Mental"
- Meta description optimizada para conversión
- URL canónica: https://nuxa.life/partners

**Status:** ✅ Complete and tested. Navigation, content segregation, and menu redirection verified.

### Migración de Precios a Subpágina Dedicada (28/10/2025)
**Summary:** Toda la información de Precios se movió de la página principal a una subpágina dedicada `/precios`.

**Cambios Realizados:**
- **Página Principal (/)**: Ya no muestra la sección de precios
- **Nueva Subpágina (/precios)**: Contiene toda la información de precios:
  1. PreciosSection - Completa con planes personales y empresariales
  
**Planes Personales:**
- Plan Básico: €2.99/mes (antes €9.99)
- Plan Individual: €5.99/mes (antes €19.99) - MÁS POPULAR
- Plan Premium: €32/12 meses (antes €35.56)

**Planes Empresariales:**
- Plan Profesional: €149.50/mes (antes €299.99)
- Plan Empresarial: €598/mes (antes €999.99) - RECOMENDADO
- Plan Corporativo: Precio personalizado

**Navegación:**
- Menú hamburguesa actualizado: opción "Precios" redirige a `/precios` (isPage: true)
- Botón "Volver al Inicio" en la página de precios para regresar a home
- Hero section destacado con título "Planes y Precios"

**Archivos Modificados:**
- client/src/pages/precios.tsx - Actualizada con hero section, botón de volver y PreciosSection
- client/src/pages/home.tsx - Eliminada la sección PreciosSection
- client/src/components/ui/smooth-scroll-menu.tsx - Precios configurado como página (isPage: true)

**SEO:**
- Título: "Precios - NUXA | Planes desde €2.99/mes"
- Meta description optimizada para conversión
- URL canónica: https://nuxa.life/precios

**Status:** ✅ Complete and tested. Navigation, pricing display, and back button functionality verified.