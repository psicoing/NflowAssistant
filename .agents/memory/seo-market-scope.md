---
name: International SEO scope and development headers
description: Preserve transactional journeys while adding market-specific public content; distinguish Replit preview controls from application indexing.
---

International SEO work is additive: preserve the existing commercial landing
and useful Spanish URLs rather than forcing visitors into language or country
redirects. International informational content does not imply that signup,
payments, chat or legal documents have been fully localized.

**Why:** The international SEO brief explicitly protects the app's existing
functional journeys and SEO equity. Publishing translated information must not
silently change access, payment behavior or the legal meaning of a policy.

**How to apply:** Keep new public documents separate from transactional logic;
use market links to equivalent content, not IP/browser-language redirects.
Localize legal explanations without inventing new legal terms or clinical
review credentials. Keep large editorial catalogues lazily loaded so SEO work
does not inflate the core checkout/chat bundle.

Replit's `.replit.dev` proxy adds noindex headers even when the app's origin
returns an indexable public document.

**Why:** HTTP verification found noindex on every public preview URL; direct
origin headers lacked it, and Replit's official development-URL documentation
confirms previews are not intended for search indexing.

**How to apply:** Do not try to remove the platform's development protection.
Separate application-origin checks from proxy checks, then validate the
published domain before claiming it is indexable. Private-route noindex cannot
be verified merely by observing the preview proxy's universal noindex.