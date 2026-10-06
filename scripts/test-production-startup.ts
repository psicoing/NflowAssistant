import assert from "node:assert/strict";
import { spawn, execFileSync, type ChildProcess } from "node:child_process";
import { once } from "node:events";
import net from "node:net";

// Uses synthetic credentials in the app's configured datastore. No messages,
// SMS, email, AI generation or payment operations; deletes only its fixture.
let fixture: { userId: number; username: string; password: string } | undefined;
let child: ChildProcess | undefined;
let exitState: number | null | undefined;
async function stop() {
  if (!child || child.exitCode !== null || child.signalCode !== null) return;
  const current = child;
  const exited = once(current, "exit");
  current.kill("SIGTERM");
  const force = setTimeout(() => current.kill("SIGKILL"), 5000);
  await exited;
  clearTimeout(force);
}
async function start(port: number) {
  exitState = undefined;
  child = spawn(process.execPath, ["dist/index.js"], {
    env: { ...process.env, NODE_ENV: "production", PORT: String(port) },
    stdio: ["ignore", "ignore", "ignore"],
  });
  child.on("exit", code => { exitState = code; });
  const base = `http://127.0.0.1:${port}`;
  const started = Date.now();
  let firstHealth = false;
  while (Date.now() - started < 60_000) {
    if (exitState !== undefined) throw new Error("Production process exited during startup");
    try {
      const response = await fetch(`${base}/health`, { signal: AbortSignal.timeout(2500) });
      if (response.ok) {
        if (!firstHealth) {
          assert.ok(Date.now() - started < 5000, "Cold health response must succeed within five seconds");
          const root = await fetch(base);
          assert.equal(root.status, 200, "Root must pass startup health checks");
          firstHealth = true;
        }
        if ((await response.json()).status === "ready") return base;
      }
    } catch (error) {
      if (error instanceof assert.AssertionError) throw error;
    }
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  throw new Error("Production startup did not become ready");
}

try {
  const portProbe = net.createServer();
  portProbe.listen(0, "127.0.0.1");
  await once(portProbe, "listening");
  const port = (portProbe.address() as net.AddressInfo).port;
  await new Promise<void>(resolve => portProbe.close(() => resolve()));
  const base = await start(port);
  const page = await fetch(`${base}/prueba-gratis`);
  assert.equal(page.status, 200);
  const html = await page.text();
  const asset = html.match(/src="(\/assets\/[^"]+\.js)"/)?.[1];
  assert.ok(asset, "Production HTML must use compiled assets");
  assert.equal((await fetch(`${base}${asset}`)).status, 200);

  fixture = JSON.parse(execFileSync("npx", ["tsx", "scripts/trial-browser-fixture.ts", "create"], { encoding: "utf8" }));
  const login = await fetch(`${base}/api/auth/login`, {
    method: "POST", headers: { "Content-Type": "application/json", "X-Forwarded-Proto": "https" },
    body: JSON.stringify({ username: fixture!.username, password: fixture!.password }),
  });
  assert.equal(login.status, 200, "Actual production login must succeed");
  const signedIn = await login.json();
  assert.equal(signedIn.userId, fixture!.userId);
  const header = login.headers.get("set-cookie") || "";
  assert.match(header, /HttpOnly/i);
  assert.match(header, /Secure/i);
  const cookie = header.split(";")[0];
  assert.ok(cookie);
  const beforeRestart = await fetch(`${base}/api/question-limit`, {
    headers: { Cookie: cookie, "X-Forwarded-Proto": "https" },
  });
  assert.equal(beforeRestart.status, 200, "Completed login must create a usable session");
  await beforeRestart.json();
  await stop();
  await start(port);
  const quota = await fetch(`${base}/api/question-limit`, {
    headers: { Cookie: cookie, "X-Forwarded-Proto": "https" },
  });
  assert.equal(quota.status, 200, "Signed-in session must survive a real production restart");
  const state = await quota.json();
  assert.equal(state.isTrial, true);
  assert.equal(state.remaining, 5);
  assert.equal(state.canAsk, true);
  console.log("PASS: real production build, cold health/root within 5s, static assets, secure login cookie and PostgreSQL session after process restart. No notifications, AI or payments.");
} finally {
  await stop();
  if (fixture) execFileSync("npx", ["tsx", "scripts/trial-browser-fixture.ts", "cleanup", String(fixture.userId)], { stdio: "pipe" });
}
