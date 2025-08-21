# NFLOW - Asistente de Salud Mental con IA

## Overview
NFLOW es una plataforma web de salud mental que integra un asistente conversacional basado en IA con recursos educativos y un sistema de suscripciones completamente automatizado. Su objetivo es proporcionar apoyo de salud mental accesible, profesional y anónimo. La plataforma está diseñada para una capacidad ilimitada de usuarios, con activación automática de suscripciones a través de PayPal y Stripe, sin requerir intervención manual.

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