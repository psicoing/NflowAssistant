import assert from "node:assert/strict";
import { createStripeUnsubscribeToken } from "../server/stripe-commercial-letter";

// Called only inside the isolated development fixture of the parent test.
export async function testStripeManualDispatch(context: {
  request: (path: string, options?: RequestInit) => Promise<Response>;
  publicRequest: (path: string, options?: RequestInit) => Promise<Response>;
  headers: Record<string, string>;
  client: any;
  deliveryState: { messages: any[]; mode: string; beforePace?: () => Promise<void>; duringDelivery?: () => Promise<void> };
}) {
  const { request, publicRequest, headers, client, deliveryState: delivery } = context;
  const post = (path: string, data: unknown) => request(path, { method: "POST", headers, body: JSON.stringify(data) });
  const save = (language: string, subject: string, body: string) =>
    request("/letter", { method: "PUT", headers, body: JSON.stringify({ language, subject, body }) });
  const grant = (id: number) => post(`/authorizations/${id}`, {
    action: "grant", source: "form", evidence: "Synthetic explicit NUXA email marketing permission, fixture proof only",
    obtainedAt: "2026-01-01T00:00:00Z", attested: true,
  });
  const prepare = (ids: number[], language = "en") => post("/dispatches", { contactIds: ids, language });
  const send = (id: string) => post(`/dispatches/${id}/send`, { confirmation: "ENVIAR" });
  assert.equal((await request("/dispatches")).status, 401);
  assert.equal((await request("/authorizations/1")).status, 401);
  assert.equal((await request("/dispatches", { method: "POST", headers: { ...headers, origin: "https://attacker.invalid" }, body: "{}" })).status, 403);
  assert.equal((await request("/authorizations/1", { method: "POST", headers: { ...headers, origin: "https://attacker.invalid" }, body: "{}" })).status, 403);
  const english = await (await request("/letter?language=en", { headers })).json();
  assert.equal(english.language, "en");
  assert(english.body.includes("subscribe"));
  assert(english.footer.includes("does not delete"));
  assert.equal((await request("/letter?language=fr", { headers })).status, 400);
  assert.equal((await save("fr", "Bad", "Bad")).status, 400);
  const englishPage = await publicRequest("?preview=1&language=en");
  assert((await englishPage.text()).includes("Unsubscribe preview"));

  const contacts = (await client.query(`INSERT INTO stripe_commercial_contacts(email)
    SELECT 'send'||n::text||'@example.invalid' FROM generate_series(1,12) n RETURNING id,email`)).rows;
  const ids = contacts.map((c: any) => c.id);
  assert.equal((await prepare([ids[0]])).status, 409, "Purchase/import alone never permits send");
  assert.equal((await post(`/authorizations/${ids[0]}`, { action: "grant" })).status, 400);
  assert.equal((await post(`/authorizations/${ids[0]}`, {
    action: "grant", source: "form", evidence: "Synthetic fixture proof with sufficient length",
    obtainedAt: "2099-01-01T00:00:00Z", attested: true,
  })).status, 400);
  for (const id of ids) assert.equal((await grant(id)).status, 200);
  assert.equal((await grant(1)).status, 409, "Suppression cannot be undone by a grant");
  assert.equal((await prepare([ids[0]])).status, 409, "English letter must be saved first");
  assert.equal((await save("en", "English NUXA invitation", "Hello. Discover NUXA at your own pace.")).status, 200);
  assert((await (await request("/letter?language=es", { headers })).json()).body.includes("Texto editable"), "Saving EN preserves ES");
  assert.equal((await prepare(ids.slice(0,11))).status, 400);
  assert.equal((await prepare([ids[0], ids[0]])).status, 400);
  const eligible = await (await request("", { headers })).json();
  assert.equal(eligible.summary.sendable, 12);

  const prepared = await (await prepare([ids[0]])).json();
  assert.equal(prepared.status, "prepared");
  assert.equal(delivery.messages.length, 0, "Preparation never sends");
  assert.equal((await prepare([ids[0]])).status, 409, "Cross-batch duplicate reservation blocked");
  assert.equal((await save("en", "New unsent subject", "New draft must not change the prepared snapshot.")).status, 200);
  assert.equal((await post(`/dispatches/${prepared.id}/send`, { confirmation: "yes" })).status, 400);
  const sent = await (await send(prepared.id)).json();
  assert.equal(sent.status, "completed");
  assert.equal(sent.recipients[0].status, "accepted");
  assert.equal(sent.recipients[0].messageId, "mock1");
  assert.equal(delivery.messages[0].subject, "English NUXA invitation", "Send frozen reviewed content, not latest draft");
  assert(delivery.messages[0].html.includes('lang="en"'));
  assert(delivery.messages[0].html.includes("Unsubscribe from marketing emails"));
  assert(!delivery.messages[0].html.includes("Darse de baja"));
  assert(delivery.messages[0].text.includes("language=en"));
  await send(prepared.id);
  assert.equal(delivery.messages.length, 1, "Repeated send cannot resend");

  const revokedBatch = await (await prepare([ids[1]])).json();
  assert.equal((await post(`/authorizations/${ids[1]}`, { action: "revoke" })).status, 200);
  const revokedResult = await (await send(revokedBatch.id)).json();
  assert.equal(revokedResult.recipients[0].status, "skipped");
  assert.equal(delivery.messages.length, 1);
  assert.equal((await grant(ids[1])).status, 200);
  const cancelledBatch = await (await prepare([ids[1]])).json();
  assert.equal((await post(`/dispatches/${cancelledBatch.id}/cancel`, {})).status, 200);
  await send(cancelledBatch.id);
  assert.equal(delivery.messages.length, 1, "Cancelled dispatch cannot send");
  assert.equal((await prepare([ids[1]])).status, 200, "Never-attempted content can be prepared again");

  const suppressedBatch = await (await prepare([ids[2]])).json();
  delivery.beforePace = async () => {
    await client.query("INSERT INTO empresa_suppression_list VALUES ('email',$1)", [contacts[2].email]);
  };
  assert.equal((await (await send(suppressedBatch.id)).json()).recipients[0].status, "skipped");
  assert.equal(delivery.messages.length, 1, "Suppression rechecked after pacing");

  const quotaBatch = await (await prepare([ids[3], ids[4]])).json();
  delivery.mode = "quota";
  const quotaResult = await (await send(quotaBatch.id)).json();
  assert.equal(quotaResult.status, "stopped");
  assert.deepEqual(quotaResult.recipients.map((r: any) => r.status), ["rejected", "skipped"]);
  assert.equal(delivery.messages.length, 2, "429 stops immediately, no fallback or retry");
  delivery.mode = "uncertain";
  const uncertainBatch = await (await prepare([ids[5]])).json();
  assert.equal((await (await send(uncertainBatch.id)).json()).recipients[0].status, "uncertain");
  await send(uncertainBatch.id);
  assert.equal(delivery.messages.length, 3, "Ambiguous provider outcome never retries");
  assert.equal((await prepare([ids[5]])).status, 409, "New batch cannot bypass ambiguous outcome dedupe");
  delivery.mode = "ok";

  const concurrent = await (await prepare([ids[6]])).json();
  let signalStarted!: () => void;
  let releaseDelivery!: () => void;
  const started = new Promise<void>(resolve => { signalStarted = resolve; });
  const release = new Promise<void>(resolve => { releaseDelivery = resolve; });
  delivery.duringDelivery = async () => { signalStarted(); await release; };
  const firstSend = send(concurrent.id);
  await started;
  const duplicate = await send(concurrent.id);
  assert.equal(duplicate.status, 200);
  assert.equal((await duplicate.json()).status, "running");
  releaseDelivery();
  await firstSend;
  delivery.duringDelivery = undefined;
  assert.equal(delivery.messages.length, 4, "Concurrent confirm is idempotent");

  const cancelledRunning = await (await prepare([ids[7], ids[8]])).json();
  delivery.duringDelivery = async () => { await post(`/dispatches/${cancelledRunning.id}/cancel`, {}); };
  const cancelledResult = await (await send(cancelledRunning.id)).json();
  delivery.duringDelivery = undefined;
  assert.equal(cancelledResult.status, "stopped");
  assert.deepEqual(cancelledResult.recipients.map((r: any) => r.status), ["accepted", "skipped"]);
  assert.equal(delivery.messages.length, 5, "Cancel stops remaining recipients, never recalls accepted mail");

  const enToken = createStripeUnsubscribeToken(contacts[9], "offline-fixture-secret");
  const enConfirm = await publicRequest(`?token=${enToken}&language=en`);
  assert((await enConfirm.text()).includes("Confirm unsubscribe"));
  const enUnsubscribe = await publicRequest("", { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ token: enToken, language: "en" }) });
  assert((await enUnsubscribe.text()).includes("You have been unsubscribed"));
  assert.equal((await grant(ids[9])).status, 409, "Unsubscribe beats older grant");
  assert.equal((await prepare([ids[9]])).status, 409);
  await client.query("INSERT INTO empresa_suppression_list VALUES ('domain','example.invalid')");
  assert.equal((await prepare([ids[10]])).status, 409, "Domain-wide suppression respected");
  assert.equal((await (await request("", { headers })).json()).summary.sendable, 0);
  assert.equal((await request("/dispatches", { headers })).status, 200);
  console.log("PASS manual mail: independent ES/EN, permission evidence/revocation, opt-out priority, snapshot review, explicit confirm, max10, duplicate/concurrent guard, quota cutoff, uncertain outcomes, cancel before/during, localized unsubscribe. Mock sender only.");
}
