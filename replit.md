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

### Books Library with Affiliate Links (02/11/2025)
- **Database Table Created:** Added `books` table with fields: id, author, title, affiliate_link, category, created_at
- **Affiliate Links:** All links use Amazon affiliate tag `nexora090-21` for commission tracking
- **Total Books:** 23 books across multiple categories:
  - Ficción: 14 books (La sombra del viento, El último secreto, El círculo de los días, La ciudad y los perros, Como agua para chocolate, La casa de los espíritus, Tatá, Café a solas, La enfermera de Auschwitz, Cuando ya no queden estrellas que contar, La asistenta)
  - Psicología: 4 books (La paciente silenciosa, Inteligencia Emocional, TDAH, Cómo hacer que te pasen cosas buenas)
  - Desarrollo Personal: 2 books (Café a solas, El monje que vendió su Ferrari)
  - Salud: 2 books (Auxiliar de enfermería, Manual de medicina forense)
  - Educación: 1 book (Ordenanza Ayuntamientos)
- **Multiple Formats:** Some books available in different formats (tapa dura, Kindle, bolsillo, tapa blanda)
- **Frontend Section:** Created BooksSection component displayed at the end of homepage
  - Heading: "Leer también da salud mental"
  - **ALL links point to Nexora library:** https://nexora.republican/
  - **Displays only psychology books** (category="psicologia"): 4 books total
    - La paciente silenciosa - Alex Michaelides
    - Inteligencia Emocional - Varios autores
    - TDAH: Domina tu Mente - Fabián Goleman
    - Cómo hacer que te pasen cosas buenas - Marian Rojas Estapé
  - Responsive grid layout (4 columns on desktop)
  - Each book card shows: category badge, title, author, "Librería Nexora" link
  - Badge shows "4 libros de psicología"
  - Prominent CTA button "Visita nuestra librería Nexora"
  - Footer: "Encuentra estos libros en Librería Nexora"
- **Backend Implementation:**
  - Added getAllBooks() and getBooksByCategory() methods to IStorage interface
  - Created GET /api/books route with optional category filtering
  - Fully integrated with TanStack Query on frontend
- Files modified: shared/schema.ts, server/storage.ts, server/routes.ts
- Files created: client/src/components/sections/books-section.tsx
- Status: ✅ Complete - 23 books with affiliate links displayed on homepage

### Interactive Phone Showcase Section + White Backgrounds (30/10/2025)
- **New Section Created:** NuxaPhonesShowcaseSection - Interactive carousel showing 6 phone mockups with NUXA mental health conversations
- **Generated Assets:** 6 AI-generated phone mockup images showing different mental health topics:
  1. Anxiety support (Ansiedad)
  2. Work stress management (Estrés Laboral)
  3. Family relationships (Relaciones Familiares)
  4. Self-esteem building (Autoestima)
  5. Emotional wellness (Bienestar Emocional)
  6. Sleep & relaxation (Sueño y Relajación)
- **Features:** Auto-rotating carousel (4s intervals), manual navigation with prev/next arrows, 6 dot indicators, gradient icon badges per topic, hover effects
- **Design:** 2-column layout (phone + content), glow effects on active phone, clean white background, topic grid overview, modern aesthetic with NUXA branding
- **Position:** Placed immediately after "Presentamos NUXA" (NuxaBrandEvolutionSection) on homepage
- **Background Updates:** Changed all new sections to clean white backgrounds:
  - Hero section (FamilySupportHeroSection): Changed from gradient grey/blue to pure white
  - "Presentamos NUXA" section (NuxaBrandEvolutionSection): Rebuilt from scratch with white background and orange accent colors
  - Phone carousel section (NuxaPhonesShowcaseSection): White background with clean design
- Files created: nuxa-phones-showcase-section.tsx
- Files modified: home.tsx, family-support-hero-section.tsx, nuxa-brand-evolution-section.tsx
- Status: ✅ Complete and tested - carousel works perfectly, all backgrounds are clean white

### Hero Section Complete Redesign (30/10/2025)
- **Description update:** Updated main hero description to clarify NUXA's role
  - Changed from: "NUXA, para personas y empresas. Apoyo emocional y salud mental con IA en español y más de 150 idiomas."
  - Changed to: "NUXA es un orientador en psicología que no hace tratamientos ni psicoterapia, ayuda a las personas y empresas a mejorar la salud mental. Habla 150 idiomas."
- **Removed star rating:** Removed "⭐⭐⭐⭐⭐ 4.8/5" rating display from social proof section
- **Removed phone image:** Eliminated phone mockup from hero section (already shown in mobile app section below)
- **Layout redesign:** Changed from 2-column grid to centered single-column layout
- **Enhanced typography:** NUXA heading uses solid color with antialiasing for crisp display, larger sizes (5xl-7xl)
- **Improved text clarity:** Removed all blur effects, increased font weights (extrabold), enhanced contrast (darker grays), solid backgrounds instead of transparent
- **Improved CTAs:** Larger, more prominent buttons with better spacing and centering
- **Redesigned social proof:** Badge with solid background, no blur effects, clearer text with better contrast
- **Redesigned feature cards:** 4-column vertical layout with gradient icon backgrounds, solid white backgrounds, thicker borders (border-2), better hover effects, unique colors per card
- **Removed duplicate content:** Eliminated "NUXA Phone Showcase" section from intro-card-section (duplicate of mobile app section)
- Files modified: family-support-hero-section.tsx, intro-card-section.tsx
- Status: ✅ Complete and tested

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