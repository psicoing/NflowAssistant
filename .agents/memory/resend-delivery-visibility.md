---
name: Resend delivery visibility
description: Constraint when diagnosing email delivery with a restricted Resend API key
---

A successful Resend send response and message ID confirm provider acceptance only; they do not confirm delivery to the recipient. A send-only API key cannot query the message status endpoint, so delivery or bounce diagnosis requires Resend dashboard access, a permitted read-capable key, or configured delivery webhooks.

**Why:** A test email returned an ID but did not arrive, and the provider rejected a status lookup because the API key was restricted to sending.

**How to apply:** Never report an email as delivered based only on the send response. Do not retry automatically; first obtain delivery visibility or explicit permission for another controlled test.