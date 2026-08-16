---
name: NUXA i18n translation approach
description: How EN/FR/ES translation is implemented, which files are done, and which still need it.
---

## The system

- Language dictionary: `client/src/hooks/useLanguage.ts` — keyed objects for `es`, `en`, `fr` (and stub `de`).
- Context provider: `client/src/components/LanguageProvider.tsx` — exports `useLanguageContext()`.
- Usage pattern in components: `import { useLanguageContext } from "@/components/LanguageProvider"; const { t } = useLanguageContext();` then `{t('key')}` in JSX.
- Language detection: browser locale on first visit (en-US/en-GB → English, fr-FR → French). Persisted in localStorage.

**Why:** Browser locale detection already worked; the gap was that 50+ components had hardcoded Spanish and ignored the context.

**How to apply:** Add keys to all three language blocks in `useLanguage.ts`, then add the import + `const { t }` + replace hardcoded strings in each component.

## Already translated (session Aug 2026)

- `hero-section.tsx` — main title, subtitle, CTA button
- `features-section.tsx` — both cards (chat + resources), all feature bullets, CTA
- `footer.tsx` — tagline, Services section, Legal section, rights line
- `testimonials-section.tsx` — stats labels (Availability, User Satisfaction), join section, opening notice
- `login.tsx` — title, username/password labels + placeholders, submit button, access link, back link

## Still hardcoded (need translation)

High visibility:
- `intro-card-section.tsx` — "Votre application de santé mentale…" (already has some FR but check)
- `registro.tsx` — registration form labels
- `blog-section.tsx`
- `chat-examples-section.tsx`
- `app-movil-section.tsx`
- `borderless-support-section.tsx`
- `global-support-section.tsx`
- `recursos.tsx`
- `sorteo-recursos.tsx`
- `nuxa-robot-scenes.tsx` — has some text, shares mobile seal

Lower priority (admin/legal):
- Legal pages (aviso-legal, privacidad, cookies) — these are always in ES by design
- Admin dashboard — internal tool, ES is fine
