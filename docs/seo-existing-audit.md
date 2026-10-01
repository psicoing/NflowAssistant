# Existing public SEO content: trust cleanup

## Scope and findings

This concise follow-up records the read-only audit findings and the requested changes to the existing public blog, structured data, and `llms.txt`. It is not a clinical, legal, privacy, security, or accessibility review.

The original blog used named authors with unverified medical credentials, unsourced prevalence and adoption figures, claimed clinical or workplace outcomes, and promotional statements about anonymity and continuous availability. It also displayed unverified view and like counts. Structured data repeated unsupported author identities and included a 4.8 rating from 15,000 reviews, pricing, and an ISO 45003 claim. The old `llms.txt` described NUXA as an AI psychologist and made unsupported claims about confidentiality, GDPR compliance, certification, availability, and prices.

## Changes and preservation policy

- Keep `/blog` and the existing `/blog/1`, `/blog/2`, and `/blog/3` routes and IDs. Preserve the existing article publication dates and topic intent.
- Attribute articles to the publishing organization, NUXA / EMPORDAJOBS SL, not unverified individual experts. Do not imply clinical review.
- Replace unsupported efficacy, adoption, access, and engagement claims with cautious explanatory content, clear limits, and links to official WHO, NIMH, and NHS information. Institutional pages can change; readers are directed to check each source’s own publication or review date.
- Use the shared organization identity `https://nuxa.life/#organization` and website identity `https://nuxa.life/#website`. Remove the unsupported aggregate rating, review count, offer price, ISO claim, and availability guarantees.
- Describe NUXA in `llms.txt` as a non-clinical digital platform. Include the requested language hubs and institutional pages, retain useful public legacy links, and avoid prices, private paths, or unsupported service promises.
- Keep server-side metadata and Vite configuration outside this change; metadata matching remains with the owning implementation.

## Blog records for server-schema matching

| Route | Article title | Byline | Publication date |
| --- | --- | --- | --- |
| `/blog/1` | IA y salud mental adolescente: posibilidades y límites | NUXA — EMPORDAJOBS SL | 2025-08-23 (23 Agosto 2025) |
| `/blog/2` | Chatbots y bienestar emocional en empresas: usos y límites | NUXA — EMPORDAJOBS SL | 2025-08-22 (22 Agosto 2025) |
| `/blog/3` | IA y psicoterapia: una herramienta digital no sustituye al profesional | NUXA — EMPORDAJOBS SL | 2025-08-21 (21 Agosto 2025) |

## Manual checks before relying on the content

- Confirm the organization’s legal name, publishing responsibility, current public URLs, and the original publication dates with the business owner.
- Verify each cited institutional source, the specific information attributed to it, and its current publication or review date. Keep source updates distinct from the article’s publication date.
- Have an appropriately qualified, independent reviewer assess any future clinical statements; do not add a clinical-review byline or endorsement without documented review and consent.
- Ask legal/privacy owners to verify the privacy, data-handling, audience, safety, and service statements against current policies and applicable requirements. Do not infer confidentiality, anonymity, security, certification, or clinical efficacy from this content.
- Check that each retained legacy URL is public and still relevant. Verify image rights and provenance, and do not restore traffic or review figures without a reliable source.
- Ensure any later changes to article titles, dates, or authors are reflected consistently in both client-rendered and server-rendered metadata. Server metadata corrections are intentionally outside this task.