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