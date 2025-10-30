# NFLOW - Asistente de Salud Mental con IA

## Overview
NFLOW (now NUXA) is an AI-powered mental health application designed for individuals, families, and workers, offering continuous emotional support. It integrates mental health and professional development solutions, aligning with ISO 45003 standards for psychological well-being at work. The platform supports an unlimited number of users with automated subscription activation and focuses on a brand identity that emphasizes science, emotion, and human connection in mental wellness.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### UI/UX Decisions
The application features a professional, responsive design using Shadcn/ui components and Tailwind CSS. It incorporates gradients, PWA-guided installation, accessibility features, and a consistent brand identity (NUXA.life). The design prioritizes clear calls to action and seamless content integration for both mobile and desktop experiences.

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
The architecture supports serverless deployment with Neon, emphasizing full automation of user and payment flows. It promotes modularity in both frontend and backend components and ensures robust authentication and data persistence. The referral system is designed for maximum conversion. The branding has fully migrated from NFLOW to NUXA.

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

### "Qué es" Section Branding: NFLOW → NUXA (30/10/2025)
- Updated badge from "Conoce NFLOW" to "Conoce NUXA"
- Updated heading from "¿Qué es NFLOW?" to "¿Qué es NUXA?"
- Added branding transition note: "Anteriormente conocido como NFLOW, ahora somos NUXA"
- Updated key arguments: "NFLOW no sustituye al psicólogo" → "NUXA no sustituye al psicólogo"
- Updated key arguments: "NFLOW acerca la salud mental" → "NUXA acerca la salud mental"
- Files modified: que-es-nflow-section.tsx
- Status: ✅ Complete and tested

### Blog Section Branding: NFLOW → NUXA (30/10/2025)
- Updated blog section title from "Blog NFLOW" to "Blog NUXA"
- Updated blog post content reference: "Plataformas como NFLOW..." → "Plataformas como NUXA..."
- Files modified: blog-section.tsx
- Status: ✅ Complete and tested

### Comparison Section Branding: NFLOW → NUXA (29/10/2025)
- Updated comparison section heading from "¿Por qué NFLOW supera a GPT-5?" to "¿Por qué NUXA supera a GPT-5?"
- Updated table column header: "NFLOW" → "NUXA"
- Updated all result badges (6 instances): "NFLOW mejora" → "NUXA mejora"
- Updated footer text: "robot interno de NFLOW" → "robot interno de NUXA"
- Updated mobile version labels to "NUXA"
- Files modified: nflow-comparison-section.tsx
- Status: ✅ Complete and tested

### Carousel Section Branding: NFLOW → NUXA (29/10/2025)
- Updated carousel section heading from "Descubre NFLOW en Acción" to "Descubre NUXA en Acción"
- Updated subtitle from "Explora cómo NFLOW transforma vidas" to "Explora cómo NUXA transforma vidas"
- Updated carousel description: "...a través de NFLOW" to "...a través de NUXA"
- Files modified: nflow-carousel-section.tsx
- Status: ✅ Complete and tested

### Tour Section Branding: NFLOW → NUXA (29/10/2025)
- Updated demo section heading from "Haz un tour por NFLOW" to "Haz un tour por NUXA"
- Files modified: neuropsi-demo-section.tsx
- Status: ✅ Complete and tested

### Domain Banner Removal (29/10/2025)
- Removed blue domain info banner showing NFLOW official domains (nflow.es, nflow.biz, nflow.gal, nflow.store, nflow.style)
- Banner displayed security/verification message: "Dominio oficial de la app: nflow.style • Conexión 100% segura"
- Updated Web contact link from nflow.biz to nuxa.life  
- Removed DomainInfoBanner component from intro-card-section.tsx
- Cleaned up unused imports from App.tsx
- Files modified: intro-card-section.tsx, contacto-section.tsx, App.tsx
- Status: ✅ Complete and tested - banner no longer visible, contact shows nuxa.life

### Navigation Branding Update: NFLOW → NUXA (29/10/2025)
- Updated navbar and hamburger menu to display "NUXA" instead of "NFLOW"
- Reason: Avoid user confusion as brand has evolved to NUXA
- Files modified: header.tsx, smooth-scroll-menu.tsx
- Status: ✅ Complete and tested

### Statistics Removal (29/10/2025)
- Removed internal metrics from testimonials section (Users: 37, Conversations: 134)
- Kept only public-facing stats: Availability 24/7 and Satisfaction 4.9/5
- Files modified: testimonials-section.tsx
- Status: ✅ Complete and tested

### Mobile App Section Scroll Fix (29/10/2025)
- Added AppMovilSection to home.tsx to enable scroll functionality
- Menu item "Aplicación Móvil" now scrolls to section correctly
- Status: ✅ Complete and tested

### Content Migration to Subpages (28-29/10/2025)
- Partners content → /partners (program info, referrals, commercial partners)
- Pricing content → /precios (personal & business plans)
- About Us content → /quienes-somos (Instituto NeuronMeg, CEO, credentials, company info)
- All accessible via hamburger menu with proper navigation
- Status: ✅ Complete and tested