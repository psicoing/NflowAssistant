---
name: Resend delivery visibility
description: Constraint when diagnosing email delivery with a restricted Resend API key
---

A successful Resend send response and message ID confirm provider acceptance only; they do not confirm delivery to the recipient. A send-only API key cannot query the message status endpoint, so delivery or bounce diagnosis requires Resend dashboard access, a permitted read-capable key, or configured delivery webhooks.

**Why:** A test email returned an ID but did not arrive, and the provider rejected a status lookup because the API key was restricted to sending.

**How to apply:** Never report an email as delivered based only on the send response. Do not retry automatically; first obtain delivery visibility or explicit permission for another controlled test.

For the current sending limitation, the user clarified that the email provider's balance was exhausted and needs a top-up/payment; they believe the provider is Twilio SendGrid. It is not a software failure or the delivery-status issue above. Do not equate these two separate incidents or assume a code fix is needed. Confirm the provider's billing status in its account before attributing the balance to a specific service.

**Why:** An earlier delivery investigation was mistakenly presented as the cause of a later inability to send.

**How to apply:** If diagnosing a new failure, check the provider's billing/usage status before attributing it to delivery or domain verification. The app also uses Resend, so usage of one service in code does not prove which account needs a top-up.