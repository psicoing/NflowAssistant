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
