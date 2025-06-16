# NFLOW - Asistente de Salud Mental con IA

## Overview

NFLOW es una plataforma web de salud mental que combina un asistente conversacional basado en IA con recursos educativos y un sistema de suscripciones. La aplicación está construida como un full-stack con React + TypeScript en el frontend y Express + Node.js en el backend, utilizando PostgreSQL como base de datos.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 con TypeScript
- **Build Tool**: Vite para desarrollo y empaquetado
- **UI Framework**: Shadcn/ui components con Tailwind CSS
- **State Management**: TanStack Query (React Query) para manejo de estado del servidor
- **Routing**: Wouter para navegación client-side
- **Styling**: Tailwind CSS con variables CSS personalizadas para el tema NFLOW

### Backend Architecture
- **Runtime**: Node.js con TypeScript
- **Framework**: Express.js
- **Session Management**: Express-session para autenticación de admin y partners
- **Authentication**: bcrypt para hash de contraseñas
- **API Design**: RESTful endpoints con validación mediante Zod schemas

### Database Architecture
- **Database**: PostgreSQL (configurado para Neon serverless)
- **ORM**: Drizzle ORM con migraciones automáticas
- **Connection**: Pool de conexiones con @neondatabase/serverless
- **Schema Location**: `shared/schema.ts` para tipos compartidos

## Key Components

### 1. Chat System
- **AI Integration**: OpenAI GPT-4o para generar respuestas contextuales
- **Prompt Engineering**: Sistema inteligente de selección de ejemplos relevantes
- **Message History**: Persistencia de conversaciones por usuario
- **Real-time Interface**: Chat interface responsive con auto-scroll

### 2. User Management
- **Registration/Login**: Sistema básico de autenticación con username/password
- **User Roles**: user, admin, partner con diferentes niveles de acceso
- **Session Tracking**: Login count y last login tracking

### 3. Subscription System
- **Payment Integration**: PayPal SDK para pagos y suscripciones
- **Subscription Plans**: basic, group, individual
- **Access Control**: Verificación de suscripción activa para acceso al chat

### 4. Content Management
- **Resources**: Sistema de artículos, guías y ejercicios categorizados
- **Categories**: ansiedad, familia, bienestar, laboral, autoestima
- **Content Types**: article, guide, exercise con íconos diferenciados

### 5. Partner Program
- **Partner Registration**: Sistema de aplicación y aprobación para partners
- **Referral System**: Códigos de referencia y tracking de comisiones
- **Partner Dashboard**: Interface para gestión de referidos y ganancias

## Data Flow

### User Journey
1. **Registration** → User creates account → Stored in users table
2. **Subscription** → PayPal payment → Updates user subscription status
3. **Chat Access** → Subscription verified → Access to chat interface
4. **Conversation** → Messages sent to OpenAI → Responses stored in messages table

### Admin Flow
1. **Admin Login** → Session-based authentication → Access to dashboard
2. **User Management** → View all users and transactions
3. **Content Management** → Create/edit resources and content

### Partner Flow
1. **Partner Application** → Registration with company details
2. **Approval Process** → Admin review and status update
3. **Referral Tracking** → Generate codes and track conversions

## External Dependencies

### AI and APIs
- **OpenAI API**: GPT-4o model for chat responses
- **PayPal SDK**: Payment processing and subscription management

### UI and Styling
- **Radix UI**: Headless components for accessibility
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library

### Development Tools
- **TypeScript**: Type safety across frontend and backend
- **ESBuild**: Fast bundling for production
- **Drizzle Kit**: Database migrations and schema management

## Deployment Strategy

### Development Environment
- **Platform**: Replit with Node.js 20 runtime
- **Development Server**: Vite dev server with HMR
- **Database**: PostgreSQL 16 module on Replit

### Production Build
- **Frontend**: Vite build output to `dist/public`
- **Backend**: ESBuild bundle to `dist/index.js`
- **Deployment**: Autoscale deployment target
- **Port Configuration**: Internal port 5000, external port 80

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `OPENAI_API_KEY`: OpenAI API access
- `PAYPAL_CLIENT_ID` & `PAYPAL_SECRET`: PayPal integration
- `NODE_ENV`: Environment detection

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- June 16, 2025. Moved subscription cards above "Cuatro Soluciones" section for better user flow
- June 16, 2025. Enhanced INS NEURONMEG showcase with custom image and clickable service buttons linking to neuronmeg.jobda.es
- June 16, 2025. Set INS NEURONMEG as default active card in showcase section
- June 16, 2025. Updated "Cuatro Soluciones" to include: NFLOW Familias, INS NEURONMEG, NFLOW Laboral, NFLOW Adultos
- June 16, 2025. Integrated INS NEURONMEG with direct links to neuronmeg.jobda.es for consultation booking
- June 16, 2025. Completely redesigned "Cuatro Soluciones" cards with modern visual design
- June 16, 2025. Implemented responsive grid layout (1-2-4 columns) with enhanced hover effects
- June 16, 2025. Added interactive app selection with dynamic showcase section
- June 16, 2025. Enhanced visual effects: glowing borders, floating accents, and shimmer animations
- June 15, 2025. Added complete partner management system with admin notifications
- June 15, 2025. Implemented elegant PWA installation prompt for mobile users
- June 15, 2025. Removed action buttons from services section while maintaining subscription access
- June 15, 2025. Simplified chat profile form for minors: only age and gender fields with appropriate options
- June 15, 2025. Enhanced subscription button in navigation to auto-scroll to pricing section
- June 15, 2025. Removed rewards program from navigation menu
- June 15, 2025. Added detailed stress management content modal for workplace stress article
- June 15, 2025. Improved resources page filters: removed unnecessary buttons and enhanced contrast
- June 15, 2025. Fixed white button visibility issue in resources page filters
- June 15, 2025. Removed psychologist session references from subscription cards
- June 15, 2025. Removed support button from PWA installation section
- June 15, 2025. Added GRUPO JOBDA card with button to jobda.biz in footer
- June 15, 2025. Optimized profile form to show only once per user (first time access)
- June 15, 2025. Enhanced user profile form with educational context about age and orientation importance
- June 15, 2025. Integrated user profile system for personalized AI responses
- June 13, 2025. Initial setup