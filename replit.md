# NFLOW - Asistente de Salud Mental con IA

## Overview
NFLOW (now NUXA) is an AI-powered mental health application offering continuous emotional support for individuals, families, and workers. It integrates mental health and professional development solutions, adhering to ISO 45003 standards for psychological well-being at work. The platform supports an unlimited number of users with automated subscription activation and aims to foster a brand identity that emphasizes science, emotion, and human connection in mental wellness. Its business vision is to provide an AI-driven psychological guide, not as a substitute for therapy, but to improve mental health for people and businesses across multiple languages.

The platform implements a **hybrid monetization model**: monthly subscriptions (€2.99-€32/year) combined with pay-per-use prepaid credit packs (€5/15 questions, €10/35 questions). Prepaid credits never expire and are consumed before monthly quota, providing flexibility for occasional users.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### UI/UX Decisions
The application utilizes a professional, responsive design built with Shadcn/ui components and Tailwind CSS. Key design elements include gradients, PWA-guided installation, accessibility features, and a consistent brand identity (NUXA.life). The UI prioritizes clear calls to action, seamless content integration, and optimized experiences across mobile and desktop, featuring clean white backgrounds for new sections and an emerald/teal color scheme for a WhatsApp-style chat interface option.

### Technical Implementations
The frontend is developed using React 18, TypeScript, Vite, and Wouter for routing, with TanStack Query managing server state. The backend is a Node.js and Express.js application written in TypeScript, employing `express-session` for authentication and `bcrypt` for secure password hashing. Data persistence is handled by PostgreSQL, configured for Neon serverless, and managed with Drizzle ORM.

### Feature Specifications
- **Prepaid Credits System (Pay-Per-Use)**: Allows users to purchase question packs without subscription commitment. Credits are stored in `users.prepaidQuestions` column and consumed before monthly quota. Includes:
  - **Pack Options**: €5 for 15 questions, €10 for 35 questions (better value)
  - **Purchase Flow**: Stripe Checkout integration with server-side validation of pack types and amounts
  - **Security**: Webhook validates payment amounts match pack types before adding credits
  - **UI Integration**: Credits displayed in QuestionLimitIndicator with purple badge
  - **Consumption Priority**: Prepaid credits → Monthly subscription quota
  - **No Expiration**: Credits persist indefinitely until used
- **AI Chat System**: Integrates OpenAI GPT-4o for contextual, persistent, and multi-language conversations, offering both a classic and a WhatsApp-style bubble interface with full markdown and interactive elements support. The WhatsApp bubble mode features:
  - **Intelligent Segmentation**: AI responses split into logical bubbles (titles, techniques, exercises, paragraphs, interactive elements)
  - **Progressive Reveal**: New messages appear one-by-one with typing indicators (300ms) and delays (500ms) between bubbles
  - **Smart Pause System**: Responses with >6 bubbles pause mid-conversation with "Continuar leyendo ▼" button
  - **Historical Optimization**: Past messages load instantly (no replay), only new AI responses use progressive reveal
  - **Implementation**: Uses hasHydratedHistory ref to distinguish initial message load from new streaming responses
- **Voice Output (TTS)**: Text-to-Speech functionality allowing NUXA to read responses aloud:
  - **Toggle Control**: Voice ON/OFF button in the chat navbar with visual indicator (purple when active)
  - **Automatic Playback**: When voice is enabled, new AI responses are automatically read aloud
  - **Natural Voice**: Uses OpenAI TTS-1 with "nova" voice for warm, natural speech
  - **Persistence**: Voice preference saved in localStorage (`nuxa-voice-enabled`)
  - **API Endpoint**: `/api/tts` POST endpoint converts text to MP3 audio
  - **All Chat Modes**: Works with Classic, Bubbles, and Brief interfaces
- **User & Subscription Management**: Supports user roles, registration, login, and automated subscription activation via PayPal and Stripe webhooks, including various plans (basic, individual, premium, group) and chat access control.
- **Comprehensive Pricing Page** (`/precios`): Complete pricing presentation featuring:
  - **Hybrid Model Explanation**: Visual cards explaining the two payment options (Subscriptions vs Pay-Per-Use)
  - **Full Comparison Table**: 8-row table comparing all options (2 credit packs, 3 personal plans, 3 business plans) with columns for price, questions included, renewal, and ideal use case
  - **Credit Packs Section**: Dedicated showcase of Pack Básico (€5/15q) and Pack Premium (€10/35q) with "Comprar Ahora" buttons that open PurchaseCreditsModal
  - **Personal Plans Section**: Three subscription tiers (Básico €2.99/mes, Individual €5.99/mes, Premium €32/año)
  - **Business Plans Section**: Enterprise solutions (Profesional €149.50/mes, Empresarial €598/mes, Corporativo custom)
  - **Updated SEO**: Meta tags include "pago por uso" and "créditos prepagados" keywords
- **Content & Partner Management**: Provides categorized articles, guides, exercises, and a comprehensive partner program with application, approval, referral tracking, and a dedicated dashboard.
- **Partner Bulk User Import**: Partners can upload users in bulk via CSV, XLSX, XLS, or ODS files. Features:
  - **File Upload**: Drag-and-drop or click to upload (max 5MB)
  - **Required Columns**: `email` (or `correo`) and `nombre` (or `name`/`usuario`)
  - **Optional Password**: Auto-generates secure passwords if not provided
  - **License Validation**: Checks partner's `activeUsersLimit` before creating users
  - **User Creation**: Creates users with `subscriptionPlan='partner'`, `monthlyQuestionLimit=100`
  - **Counter Update**: Automatically updates partner's `activeUsersCount`
  - **API Endpoint**: `POST /api/partners/upload-users` using multer for file handling
  - **UI Location**: "Importar Usuarios" section in partner dashboard at `/partners/dashboard`
- **Partner License Management**: Dashboard displays license status with visual indicators:
  - **Metrics**: Active users, user limit, available slots, monthly quota
  - **Status Badge**: Green (active), yellow (pending), red (suspended)
  - **Database Fields**: `activeUsersCount`, `activeUsersLimit`, `monthlyQuota`, `licenseStatus` in partners table
- **Partner Contract Info**: Prominent section displaying rental agreement details:
  - **Monthly Cost**: Display `monthlyCost` field (e.g., €1350/month)
  - **Users Contracted**: Total user limit from license agreement
  - **Renewal Date**: `licenseRenewalDate` field showing next billing date
- **Multiple Administrators**: Partners can delegate admin access to multiple team members:
  - **Tables**: `partnerAdmins` stores additional admin accounts per partner
  - **Roles**: Admin or Viewer roles for granular permissions
  - **CRUD Operations**: Create, view, delete admins via `/api/partners/admins` endpoints
  - **Owner Protection**: Primary partner account cannot be deleted
- **Activity Log**: Complete audit trail of all administrative actions:
  - **Table**: `partnerActivityLog` stores all tracked events
  - **Actions Tracked**: create_user, delete_user, block_user, activate_user, import_users, create_admin, delete_admin, login
  - **Details**: Stores actor email, target user email, timestamps, and metadata
  - **UI**: Scrollable activity feed in partner dashboard
- **Company Logo Upload**: Partners can upload and display their company branding:
  - **API Endpoints**: `POST/DELETE /api/partners/logo` for upload/removal
  - **Formats Supported**: JPG, PNG, GIF, WebP (max 2MB) - SVG excluded for security
  - **Storage**: Base64 data URL stored in `companyLogo` field
  - **UI**: Preview with upload/delete controls in dashboard
- **Free Resources** (`/recursos`): Offers unauthenticated access to mental health tools, primarily managed client-side with localStorage:
  - **Emotional Logging**: Register daily emotions with emojis and optional notes
  - **Emotion History Calendar**: Interactive monthly calendar view showing registered emotions with emojis for each day, month navigation, and monthly summaries
  - **Breathing Exercises**: Animated guided breathing with 3 techniques:
    - Technique 4-7-8: Inhale 4s, hold 7s, exhale 8s (ideal for sleep)
    - Box Breathing: Inhale 4s, hold 4s, exhale 4s (reduces anxiety)
    - Cardiac Coherence: Inhale 5s, exhale 5s (balances nervous system)
    - Visual animated circle with phase indicators (INHALA/MANTÉN/EXHALA) and countdown
  - **Gratitude Journal**: Write 3 positive things per day, saved to localStorage with history
  - **Daily Affirmations**: Positive messages with share/download functionality
  - **Professional Assessments**: Anxiety, depression, and self-esteem evaluations
  - **Daily Streak Tracking**: Gamification element encouraging consistent engagement
  - **Regulation & Emergency Tools** (new section):
    - **Bad Day Protocol**: 3-step emergency protocol (breathing, grounding, simple action) with links to detailed exercises
    - **Alert Signals**: Toast notification showing when to seek professional help (warning signs like suicidal ideation, extreme isolation, panic attacks)
    - **Grounding 5-4-3-2-1**: Progressive sensory anchoring technique (5 things to see, 4 to touch, 3 to hear, 2 to smell, 1 to taste)
    - **Bilateral Stimulation**: Visual tapping exercise with moving ball for emotional regulation (EMDR-style), 3 speed options
    - **ISO 45003 Self-Check**: 6-question workplace psychosocial risk assessment with risk level calculation (Bajo/Medio/Alto) and recommendations
- **SEO**: Implements dynamic meta tags, Schema.org JSON-LD, sitemap, and optimized content.
- **Cookie Consent**: Includes a GDPR-compliant cookie consent system.
- **Interactive Showcase**: Features an interactive carousel of phone mockups demonstrating NUXA's mental health conversations.
- **Book Library**: Integrates an affiliate book library with Amazon affiliate links, displaying psychology-focused books on the homepage.
- **Department of Health Endorsement**: Homepage features a prominent clickable banner below the feature cards displaying "Recomendado por Departamento de Salud". Clicking opens a modal with the official informative note PDF from the Departament de Salut, showcasing the platform's credibility and official recognition.
- **Shopify E-commerce Integration**: Seamless webhook-based integration allowing users to purchase NUXA products through Shopify storefronts. Features:
  - **Webhook Endpoint**: `/api/shopify/webhook` receives order notifications from Shopify
  - **HMAC Validation**: Cryptographic signature verification using `X-Shopify-Hmac-Sha256` header for security
  - **SKU Mapping**: Centralized product mapping (8 SKUs) linking Shopify products to NUXA services:
    - Credit Packs: NUXA-PACK-BASIC-15 (€5/15q), NUXA-PACK-PREMIUM-35 (€10/35q)
    - Personal Plans: NUXA-SUB-BASIC-MONTH (€2.99), NUXA-SUB-INDIV-MONTH (€5.99), NUXA-SUB-PREMIUM-YEAR (€32)
    - Business Plans: NUXA-BUS-PROF-MONTH (€149.50), NUXA-BUS-CORP-MONTH (€598), NUXA-BUS-CUSTOM (custom pricing)
  - **Idempotency**: `shopifyTransactions` table stores order IDs to prevent duplicate processing
  - **Security Validation**: Price verification ensures payment amounts match expected product prices
  - **Automatic Activation**: On successful payment, immediately activates credits or subscriptions
  - **Required Secret**: `SHOPIFY_WEBHOOK_SECRET` environment variable for signature verification
  - **Event Handling**: Processes `orders/paid` events from Shopify, skipping non-paid orders
  - **Transaction Logging**: Complete audit trail of all Shopify purchases in database

### System Design Choices
The architecture is designed for serverless deployment with Neon, emphasizing full automation of user and payment flows. It promotes modularity in both frontend and backend components, ensuring robust authentication and data persistence. The system includes a robust referral system and has fully transitioned its branding from NFLOW to NUXA.

## External Dependencies

### AI and APIs
- **OpenAI API**: Powers the GPT-4o model for the AI chat system with configuration: max_tokens=4000 (increased to handle comprehensive structured responses), temperature=0.4, response_format=json_object. Includes robust error handling for JSON parsing and fallback responses.
- **PayPal SDK**: Integrated for payment processing and subscription management.
- **Stripe**: Utilized for payment processing and subscription management.

### UI and Styling
- **Radix UI**: Provides headless components for enhanced accessibility.
- **Tailwind CSS**: Used as the utility-first CSS framework for styling.
- **Lucide React**: The icon library used across the application.

### Development Tools
- **TypeScript**: Ensures type safety across the project.
- **ESBuild**: Used for fast bundling in production environments.
- **Drizzle Kit**: Manages database migrations and schema.