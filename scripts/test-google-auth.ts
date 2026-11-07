import assert from "node:assert/strict";
import { once } from "node:events";
import { googleTestApp } from "./lib/google-test-app";
import { GoogleAccessError, validateGoogleRegistration } from "../server/google-auth-store";

const fixture = await googleTestApp();
const server = fixture.app.listen(0,"127.0.0.1");
await once(server,"listening");
const address = server.address() as { port: number };
const base = `http://127.0.0.1:${address.port}`;
let cookie = "";
async function request(path: string, body?: unknown, headers: Record<string,string> = {}) {
  const response = await fetch(base+path, {
    method: body === undefined ? "GET" : "POST",
    headers: { ...(cookie ? { cookie } : {}),...(body !== undefined ? { "Content-Type": "application/json",origin: base } : {}),...headers },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  const setCookie = response.headers.get("set-cookie");
  if (setCookie) cookie = setCookie.split(";")[0];
  return { status: response.status,body: await response.json() };
}
async function post(body: unknown, csrf: string) {
  return request("/api/auth/google/complete",body,{"X-NUXA-CSRF": csrf});
}
const identity = { key: "https://fixture-issuer.invalid|existing",email: "existing@example.invalid" };
const valid = { action: "register",birthDate: "1990-05-01",acceptedNuxaNotice: true };
try {
  assert.equal(await fixture.store.available(),true);
  assert.throws(() => validateGoogleRegistration({...valid,birthDate:"2024-02-30"}),GoogleAccessError);
  assert.throws(() => validateGoogleRegistration({...valid,birthDate:"2020-01-01"}),GoogleAccessError);
  assert.throws(() => validateGoogleRegistration({...valid,acceptedNuxaNotice:false}),GoogleAccessError);
  assert.equal((await request("/api/auth/me")).status,401);
  let status = await request("/api/auth/google/status");
  assert.equal(status.body.state,"onboarding");
  assert.equal((await post(valid,"forged")).status,403);
  assert.equal((await request("/api/auth/google/complete",valid,{
    origin: "https://attacker.invalid","X-NUXA-CSRF":status.body.csrfToken })).status,403);
  fixture.state.verified = false;
  assert.equal((await request("/api/auth/google/status")).status,403);
  fixture.state.verified = true;
  const created = await post({...valid,role:"admin",monthlyQuestionLimit:999999,hasCompletedPayment:true,userId:2,email:"forged@example.invalid"},status.body.csrfToken);
  assert.equal(created.status,200);
  const createdRow = (await fixture.pool.query("SELECT * FROM users WHERE id=$1",[created.body.userId])).rows[0];
  assert.equal(createdRow.email,"new@example.invalid");
  assert.equal(createdRow.role,"user");
  assert.equal(createdRow.has_completed_payment,false);
  assert.equal(createdRow.monthly_question_limit,10);
  assert.equal(createdRow.questions_used_this_month,0);
  assert.equal(createdRow.trial_phone_verified_at,null);
  assert.equal(createdRow.trial_email_verified_at,null);
  assert.equal((await request("/api/auth/me")).body.id,created.body.userId);
  // Repeat callback/login neither duplicates users nor grants another trial.
  status = await request("/api/auth/google/status");
  assert.equal(status.body.state,"linked");
  assert.equal((await post({action:"login"},status.body.csrfToken)).status,200);
  assert.equal((await fixture.pool.query("SELECT count(*)::int AS n FROM users")).rows[0].n,3);
  // A verified matching email does not authorize the existing account.
  await request("/__fixture/identity",{mode:"existing"});
  status = await request("/api/auth/google/status");
  assert.equal((await post(valid,status.body.csrfToken)).body.code,"ACCOUNT_EXISTS");
  assert.equal((await post({action:"link",username:"fixture-paid",password:"wrong"},status.body.csrfToken)).status,401);
  assert.equal((await post({action:"link",username:"fixture-admin",password:fixture.password},status.body.csrfToken)).status,401);
  const before = (await fixture.pool.query("SELECT * FROM users WHERE username='fixture-paid'")).rows[0];
  assert.equal((await post({action:"link",username:"fixture-paid",password:fixture.password},status.body.csrfToken)).status,200);
  const after = (await fixture.pool.query("SELECT * FROM users WHERE username='fixture-paid'")).rows[0];
  assert.deepEqual(after,before,"Linking must preserve every existing local field");
  assert.equal((await fixture.store.linked(identity))?.id,before.id);
  // Prevent a different Google identity from silently replacing an active local user.
  const mismatch = { key:"https://another-issuer.invalid|same-subject",email:"other@example.invalid" };
  await assert.rejects(fixture.store.complete(mismatch,valid,before.id),/Cierra la sesión/);
  assert.equal(await fixture.store.linked(mismatch),undefined);
  // A different issuer is not the same identity.
  assert.equal(await fixture.store.linked({...identity,key:"https://other-issuer.invalid|existing"}),undefined);
  await request("/api/auth/logout",{});
  assert.equal((await request("/api/auth/me")).status,401);
  await request("/__fixture/identity",{mode:"admin"});
  status = await request("/api/auth/google/status");
  assert.equal((await post({action:"link",username:"fixture-admin",password:fixture.password},status.body.csrfToken)).status,401);
  // Concurrent OAuth callbacks produce only one account and one mapping.
  const concurrentIdentity = {key:"https://fixture-issuer.invalid|concurrent",email:"concurrent@example.invalid"};
  const concurrent = await Promise.all([
    fixture.store.complete(concurrentIdentity,valid),
    fixture.store.complete(concurrentIdentity,valid),
  ]);
  assert.equal(concurrent[0].id,concurrent[1].id);
  assert.equal((await fixture.pool.query("SELECT count(*)::int AS n FROM users WHERE email='concurrent@example.invalid'")).rows[0].n,1);
  await request("/__fixture/identity",{mode:"disabled"});
  assert.equal((await request("/api/auth/google/config")).body.enabled,false);
  assert.equal((await request("/api/auth/google/status")).status,503);
  console.log("PASS Google auth: CSRF, forged payloads, verified identity, no email-only takeover, credential link, admin denial, quota/payment preservation, age/legal notice, logout, repeat/concurrent callbacks and issuer isolation. Real provider calls: 0.");
} finally {
  await new Promise<void>(resolve => server.close(() => resolve()));
  await fixture.close();
}
