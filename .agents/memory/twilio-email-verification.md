---
name: Twilio Email verification
description: Managed-domain email testing, restricted API permissions, and delivery confirmation.
---

Twilio Email is distinct from the existing SendGrid connection. Test it with its own restricted API key, without replacing voice/SMS credentials or silently switching application email providers.

**Why:** The existing SendGrid connection rejected authentication, while a separate Twilio Email test successfully delivered a transactional email.

**How to apply:** The console exposes the necessary permissions under Comms: `emails` Create and `emails.operations` Read. These were sufficient for a real send and operation-status lookup. Authenticate the sending domain first. Keep the credentials in secrets and never include them in logs or screenshots.

Sending is asynchronous: HTTP 202 confirms acceptance, not delivery. The operation may initially report PROCESSING with zero totals, then show delivered emails while its status still says PROCESSING.

**Why:** This behavior occurred during the successful real test; relying on status alone would have missed delivery confirmation.

**How to apply:** Consult the operation statistics, distinguish delivered from inbox placement/read confirmation, and never resend automatically merely because processing or delivery is uncertain.
