---
name: Contact seeding environments
description: How to verify seeded campaign contacts across development and production.
---

Seeded campaign contacts are environment-scoped: a server restart updates the development database, while the published application will not show those records until the current version is published.

**Why:** Development and production use separate database states, so checking only the code or preview can incorrectly suggest that a contact was not imported.

**How to apply:** After adding contacts, verify the exact emails and active status in the target environment; publish before expecting them in the production admin panel.