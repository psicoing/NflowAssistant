import assert from "node:assert/strict";
import { build } from "esbuild";
import { mkdtemp, rm } from "node:fs/promises";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

// Exercise real send helpers, trial provider and campaign routing with offline SDKs.
const state = { messages: [] as any[], fail: false, connectorFail: false, resendCalls: 0, paced: 0 };
(globalThis as any).__nuxaMailTest = state;
const originalFetch = globalThis.fetch;
const envKeys = ["REPLIT_CONNECTORS_HOSTNAME", "REPL_IDENTITY", "RESEND_API_KEY"];
const previousEnv = Object.fromEntries(envKeys.map(key => [key, process.env[key]]));
// Keep external dependency resolution under the project's node_modules.
const dir = await mkdtemp(join(process.cwd(), "node_modules", ".nuxa-mail-test-"));
try {
  process.env.REPLIT_CONNECTORS_HOSTNAME = "connector.example.invalid";
  process.env.REPL_IDENTITY = "offline-test";
  process.env.RESEND_API_KEY = "offline-test";
  globalThis.fetch = (async (url: string) => {
    assert(String(url).startsWith("https://connector.example.invalid/api/v2/connection?"));
    if (state.connectorFail) throw Error("offline connector failure");
    return { json: async () => ({ items: [{ settings: {
      api_key: "offline-not-a-secret", from_email: "legacy@example.invalid",
    } }] }) } as Response;
  }) as typeof fetch;
  const output = join(dir, "mail.mjs");
  await build({
    stdin: {
      contents: `
        export { sendNuxaSendGridEmail } from "./server/sendgridClient";
        export { sendEmpresaEmail } from "./server/emailService";
        export { productionTrialProviders } from "./server/trial/providers";
        export { getEmpresaBrandStatus, getEmpresaBrandStatuses } from "./server/empresaBrands";
      `,
      resolveDir: process.cwd(),
      loader: "ts",
    },
    outfile: output, bundle: true, platform: "node", format: "esm", packages: "external",
    plugins: [{
      name: "offline-mail",
      setup(builder) {
        builder.onResolve({ filter: /^(@sendgrid\/mail|resend|node-fetch)$|campaign-email-control$/ },
          args => ({ path: args.path, namespace: "offline" }));
        builder.onLoad({ filter: /.*/, namespace: "offline" }, args => ({
          loader: "js",
          contents: args.path.endsWith("campaign-email-control") ? `
            export async function paceCommercialEmail(_pool, send) {
              globalThis.__nuxaMailTest.paced++;
              return send();
            }
          ` : args.path === "@sendgrid/mail" ? `
            export default {
              setApiKey() {},
              async send(message) {
                const state = globalThis.__nuxaMailTest;
                state.messages.push(message);
                if (state.fail) throw Object.assign(Error("offline rejection"), {code:403});
                return [{statusCode:202,headers:{"x-message-id":"offline-message"}}];
              }
            };
          ` : args.path === "resend" ? `
            export class Resend {
              emails = { send: async () => {
                globalThis.__nuxaMailTest.resendCalls++;
                throw Error("Unexpected Resend send");
              }};
            }
          ` : `export default async () => ({ json: async () => ({data: []}) });`,
        }));
      },
    }],
  });
  const app = await import(pathToFileURL(output).href);
  const assertIdentity = (message: any) => {
    assert.deepEqual(message.from, { email: "avisos@nuxa.life", name: "NUXA" });
    assert.deepEqual(message.replyTo, { email: "rmportbou@gmail.com", name: "NUXA" });
  };
  await app.sendNuxaSendGridEmail({ to: "recipient@example.invalid", subject: "offline", text: "offline" });
  assertIdentity(state.messages.at(-1));
  await app.productionTrialProviders.email("trial@example.invalid", "123456");
  assertIdentity(state.messages.at(-1));
  assert.equal(state.messages.at(-1).to, "trial@example.invalid");
  assert.equal(state.messages.at(-1).trackingSettings.openTracking.enable, false);
  const campaign = { email: "company@example.invalid", subject: "offline campaign",
    body: "Original text", empresaId: 0, brand: "nuxa", campaignId: 42,
    fromEmailOverride: "hola@nuxa.life", fromNameOverride: "Legacy" };
  const result = await app.sendEmpresaEmail(campaign);
  assert.equal(result.ok, true);
  const sent = state.messages.at(-1);
  assertIdentity(sent);
  assert.equal(sent.to, campaign.email);
  assert(sent.text.includes(campaign.body));
  assert(sent.text.includes("unsubscribe-empresa"));
  assert(sent.html.includes("unsubscribe-empresa"));
  assert.deepEqual(sent.categories, ["empresa-42"]);
  assert.equal(state.resendCalls, 0);
  const status = await app.getEmpresaBrandStatus("nuxa");
  assert.equal(status.from, "avisos@nuxa.life");
  assert.equal(status.available, true);
  assert.equal(status.verified, false, "Credential presence is not delivery or domain verification");
  const statuses = await app.getEmpresaBrandStatuses();
  assert.equal(statuses.find((item: any) => item.id === "nuxa").from, "avisos@nuxa.life");
  assert.equal(statuses.find((item: any) => item.id === "jobda").from, "avisos@nuxa.life");
  assert.equal(statuses.find((item: any) => item.id === "empordajobs").from, "hola@nuxa.life",
    "EMPORDAJOBS legacy routing must remain unchanged");
  const jobda = await app.sendEmpresaEmail({ ...campaign, brand: "jobda",
    fromEmailOverride: "unverified@gmail.com", fromNameOverride: "Untrusted override" });
  assert.equal(jobda.ok, true);
  assert.equal(jobda.provider, "sendgrid");
  assert.deepEqual(state.messages.at(-1).from, { email: "avisos@nuxa.life", name: "JOBDA" });
  assert.deepEqual(state.messages.at(-1).replyTo, { email: "rmportbou@gmail.com", name: "JOBDA" });
  assert.deepEqual(state.messages.at(-1).categories, ["empresa-42"]);
  assert.equal(state.messages.at(-1).trackingSettings.openTracking.enable, true);
  assert(state.paced >= 2, "Commercial helper always passes through pacing");
  assert.equal(state.resendCalls, 0, "JOBDA must not fall back to Resend");
  state.fail = true;
  const before = state.messages.length;
  assert.equal((await app.sendEmpresaEmail(campaign)).ok, false);
  assert.equal(state.messages.length, before + 1, "No retry after rejection or uncertain delivery");
  assert.equal(state.resendCalls, 0, "No silent fallback to another provider");
  const jobdaFailed = await app.sendEmpresaEmail({ ...campaign, brand: "jobda" });
  assert.equal(jobdaFailed.ok, false);
  assert.equal(jobdaFailed.provider, "sendgrid");
  assert.equal(jobdaFailed.errorCode, "403");
  assert.equal(state.resendCalls, 0, "No JOBDA fallback after rejection");
  state.connectorFail = true;
  assert.equal((await app.getEmpresaBrandStatus("nuxa")).available, false);
  assert.equal((await app.getEmpresaBrandStatus("jobda")).available, false);
  const jobdaDisconnected = await app.sendEmpresaEmail({ ...campaign, brand: "jobda" });
  assert.equal(jobdaDisconnected.ok, false);
  assert.equal(state.resendCalls, 0);
  await assert.rejects(app.productionTrialProviders.email("trial@example.invalid", "123456"));
  assert.equal(state.messages.length, before + 2);
  console.log("PASS: NUXA and JOBDA authenticated From/Reply-To, codes, forced identity, tracking, pacing hook, status, failures without retry/fallback; EMPORDAJOBS unchanged. No real emails, database writes or AI calls.");
} finally {
  globalThis.fetch = originalFetch;
  for (const key of envKeys) {
    if (previousEnv[key] === undefined) delete process.env[key];
    else process.env[key] = previousEnv[key];
  }
  delete (globalThis as any).__nuxaMailTest;
  await rm(dir, { recursive: true, force: true });
}
