---
name: Twilio Spanish number verification
description: Requirements and support path when Twilio blocks purchase of a Spanish phone number.
---

Twilio requires a verified identity document before purchasing many Spanish numbers. Individual registrations generally need name, Spanish fiscal ID (DNI/NIF/NIE), and Spanish address; business registrations need business name, CIF, and business/address documentation. A facial-verification retry loop must be resolved in Twilio Console or by Twilio Support, not in application code.

**Why:** Spanish number purchases are subject to local regulatory requirements, and Twilio documents an explicit verified-document prerequisite.

**How to apply:** Check Phone Numbers > Documents / compliance status. Pending verification may take up to 48 business hours; failed verification needs its failure reason corrected or a support-requested verification reset. Never share authentication tokens in support tickets or chat.