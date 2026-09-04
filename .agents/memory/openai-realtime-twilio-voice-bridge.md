---
name: OpenAI Realtime + Twilio voice bridge
description: Non-obvious pitfalls when wiring Twilio Media Streams to OpenAI's Realtime API for a phone-call voice bridge.
---

## OpenAI Realtime API schema has moved past the widely-documented beta shape
The `gpt-4o-realtime-preview-*` beta models and their flat `session.update` schema (e.g.
`input_audio_format: "g711_ulaw"`) are disabled server-side now (`beta_api_shape_disabled`). The
current GA model nests audio config differently and uses MIME-style format strings instead of the
old `g711_ulaw`/`g711_alaw` names. Public docs/forum posts on the exact GA shape were inconsistent
as of 2026-08.

**Why it matters:** don't trust a remembered or copy-pasted `session.update` payload — the schema
has changed shape entirely, not just gained fields.

**How to apply:** before building any Realtime-API integration, open a live `ws` connection and
empirically confirm the current `session.update` schema by sending a candidate payload and checking
for `session.updated` vs `error`, rather than trusting docs/snippets/memory. Official SDKs
(`@openai/agents-extensions`'s Twilio transport) handle this for you but may pull in peer deps
(e.g. zod v4) that can conflict with an existing project's pinned major version — check that before
adding the SDK.

## Twilio trial accounts often have zero purchased phone numbers
A configured `TWILIO_FROM_NUMBER`/`TWILIO_ACCOUNT_SID` does not imply an inbound-capable number
exists — verify purchased numbers before wiring an inbound voice webhook to one.

Buying a **local number outside the US** (e.g. GB) commonly requires extra regulatory setup (a
registered `AddressSid`) that isn't available in an automated flow. **US local numbers** typically
have no such requirement and are the reliable fallback for "get a working inbound voice number
right now," even for a non-US product — flag this tradeoff to the user rather than silently
substituting country.

For the current voice demo, the working end-to-end tests used Twilio's US trial number. Treat
the Spanish-number issue as a separate provisioning/availability problem; do not replace the
known-working US test route until a Spanish number is actually provisioned and tested.

## Media Streams WebSocket handshake must be authenticated, not just the TwiML webhook
Twilio signs the initial HTTP request that upgrades to a Media Streams WebSocket the same way it
signs regular webhooks (`X-Twilio-Signature`, validated against the exact `<Stream url>` you
configured — try appending a trailing `/` if validation fails). Anyone who discovers the raw
WebSocket path can otherwise open it directly and drive an authenticated upstream (e.g. OpenAI
Realtime) at your expense — treat the `upgrade` handler as an unauthenticated attack surface by
default and validate the signature (plus a concurrent-connection cap as defense in depth) before
ever proxying to the upstream API. Same fail-closed rule applies to the TwiML webhook itself: treat
a missing/invalid signature as rejected whenever an auth token is configured, never as "skip
validation."

## Use the authenticated app control plane for Twilio provisioning
If direct Twilio API calls from the shell return 401 while the authenticated admin panel can
successfully check the same account, do not retry purchases from the shell or guess which account
the credentials belong to. Perform account operations through a protected server-side route using
the workflow's current secret, with an explicit confirmation before any charge.

**Why:** workflow secrets and the shell environment can be out of sync after credentials are
updated, and a provisioning retry risks charging the wrong Twilio account or buying duplicates.

**How to apply:** gate provisioning routes behind admin authentication, validate the submitted
Account SID, check existing numbers before buying, configure the webhook at purchase time, and
return the purchased number to the panel.

## Do not use a custom domain for Twilio while its TLS certificate is unavailable
A custom domain can resolve correctly in DNS but still terminate the TLS handshake without
presenting a certificate. Twilio then plays its generic English application-error message before
the request ever reaches the webhook, so there are no application logs to diagnose.

**Why:** the voice webhook failed this way while the deployment's generated Replit domain remained
reachable with a valid HTTPS response.

**How to apply:** verify the exact webhook hostname with an external TLS/HTTPS check before blaming
Twilio or OpenAI. Until the custom-domain certificate is healthy, use the deployment's generated
`replit.app` domain consistently for both the TwiML webhook and Media Streams signature validation.
When a deployment exposes several approved domains, validate Twilio signatures against the
explicit configured URL and every runtime-provided Replit domain; choosing only the first domain
can reject legitimate requests after a webhook hostname change.

## Do not cancel Realtime audio twice
When server VAD has `interrupt_response` enabled, OpenAI already cancels the active response when
the caller starts speaking. The bridge should clear Twilio's buffered playback and release its
local state, but must not also send a manual `response.cancel`.

**Why:** automatic plus manual cancellation produces `response_cancel_not_active`; repeated false
VAD triggers can then make the telephone audio sound clipped or noisy.

**How to apply:** track response lifecycle separately from whether audio deltas have actually
started, clear Twilio only after audio output begins, and let server VAD own upstream cancellation.
Buffer a short amount of early caller audio until the OpenAI socket is ready.

## Realtime audio needs a much larger token budget than text
Small output limits that look sufficient for one or two written sentences can cut telephone audio
after only a few seconds. PCMU tests showed that a 300-token response could still end incomplete,
while larger limits completed cleanly and transcribed correctly.

**Why:** generated audio consumes output tokens at a much higher rate than the equivalent transcript;
mid-sentence token exhaustion sounds like choppy audio rather than an obvious model error.

**How to apply:** constrain response length through instructions, not an extremely small hard cap.
Before changing voice pacing or limits, generate a PCMU 8 kHz sample, require a `completed` status,
measure clipping/noise, and transcribe it to verify every phrase and price.

## Voice demo language selection starts in English
The phone demo opens in English and asks whether the caller prefers English or Spanish; after the
choice, the assistant should stay in that language. Spanish responses remain specifically
peninsular Spanish, while the phone call remains commercial rather than psychological support.

**Why:** the first greeting needs to be understandable to international callers without weakening
the existing Spanish-market positioning or moving psychological care into the phone call.

**How to apply:** keep the initial greeting and per-turn language instruction aligned in both
inbound and authorized outbound demo modes; test the language choice on a real call after
publishing.

## Approved phone CTA presentation
The localized phone CTA on the opening splash is an accepted pattern: a visible, accessible
`tel:` link presented as a compact dark capsule with a cyan border and clear localized label.

**Why:** this makes the voice demo immediately discoverable without relying on an image or
requiring users to copy a number manually.

**How to apply:** reuse the same presentation for future voice-contact entry points unless a
different context needs a more prominent call-to-action.
