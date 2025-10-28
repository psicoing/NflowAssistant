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