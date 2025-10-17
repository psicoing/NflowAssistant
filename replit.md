# NFLOW - Asistente de Salud Mental con IA

## Overview
NFLOW is an AI-powered mental health application designed for individuals, families, and workers. It offers innovative solutions integrating mental health and professional development, aligned with ISO 45003 standards for psychological well-being at work. NFLOW provides continuous emotional support as a digital resource, supporting an unlimited number of users with automated subscription activation via PayPal and Stripe. The project also introduces NUXA as an evolutionary brand, focusing on science, emotion, and human connection in mental wellness.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### UI/UX Decisions
The application features a professional design leveraging Shadcn/ui components and Tailwind CSS, incorporating gradients and visual elements for an enhanced user experience. Navigation is simplified and unified across the platform, with a focus on clear calls to action and a consistent brand identity (NFLOW.style, evolving to NUXA.life). Key elements include responsive design for mobile and desktop, PWA guided installation, and accessibility features (keyboard navigation, aria-labels).

### Technical Implementations
The frontend is built with React 18, TypeScript, Vite, and Wouter for routing, utilizing TanStack Query for server state management. The backend uses Node.js with TypeScript and Express.js, employing `express-session` for authentication and `bcrypt` for password hashing. PostgreSQL, configured for Neon serverless, serves as the database, managed by Drizzle ORM for migrations and schema definition.

### Feature Specifications
- **AI Chat System**: Integrates OpenAI GPT-4o for contextual, persistent, and multi-language conversations.
- **User & Subscription Management**: Supports user roles (user, admin, partner), registration, login, and automated subscription activation via PayPal and Stripe webhooks, including various plans (basic, group, individual) and chat access control.
- **Content & Partner Management**: Features categorized articles, guides, exercises, and a comprehensive partner program with application, approval, referral tracking, and a dedicated dashboard with analytics and promotional tools.
- **Free Resources**: Offers unauthenticated access to emotional logging, daily streak tracking, affirmations, and professional assessments, all managed client-side using `localStorage`.
- **SEO**: Comprehensive implementation including dynamic meta tags, Schema.org JSON-LD, sitemap, and optimized content for search engines.

### System Design Choices
The architecture supports serverless deployment with Neon, emphasizing full automation of user and payment flows. It promotes modularity in both frontend and backend components and ensures robust authentication and data persistence. Referral systems are designed for maximum conversion through pre-filled links and permanent partner codes.

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

## Recent Updates

### Complete NUXA Branding Migration (17/10/2025)
**Summary:** Complete migration from NFLOW to NUXA branding across all PWA, SEO, and visual assets.

**Logo & Visual Assets:**
- Generated new NUXA logo featuring circular emerald→teal→cyan gradient with person silhouette, prominent "NUXA" text, and subtle "nflow" text below
- Updated PWA Installation Section with NUXA branding:
  - Added NUXA logo display (48x48 mobile, 56x56 desktop)
  - Changed all text references from "NFLOW" to "NUXA"
  - Updated color scheme from orange/blue to emerald/teal/cyan gradients
  - Step numbers: emerald-500, Completion badges: teal-500
- Updated NUXA Brand Evolution Section:
  - Added prominent NUXA app icon display (112x128px responsive)
  - Logo features animated glow effect with emerald→teal gradient

**PWA Configuration:**
- Generated new PWA icons (192x192 and 512x512) with NUXA branding
- Updated manifest.json: name "NUXA - Tu Psicólogo IA 24/7", theme color #14b8a6 (teal-500), background #0f172a
- Replaced all old NFLOW icons (icon-192.png, icon-512.png, favicon.png) with NUXA versions
- Updated index.html: title, description, theme-color, apple-mobile-web-app-title all reflect NUXA

**SEO & Structured Data:**
- Updated home.tsx SEOHead: title, description, ogTitle, ogDescription, canonical/OG URLs to nuxa.life
- Migrated JSON-LD structured data: NuxaOrganizationData and NuxaWebAppData with complete NUXA branding
- All Schema.org data now references nuxa.life, soporte@nuxa.life, and NUXA branding

**Logo files:**
- Brand/Display: `attached_assets/generated_images/NUXA_logo_with_circle_person_ba9dba6f.png`
- PWA Icons: `attached_assets/generated_images/NUXA_PWA_icon_192x192_0fcf9f49.png`, `NUXA_PWA_icon_512x512_763e7500.png`

**Status:** ✅ Production-ready. 100% NUXA branding across PWA, SEO, and all assets.