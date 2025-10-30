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