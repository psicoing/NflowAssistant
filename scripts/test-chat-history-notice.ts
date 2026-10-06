import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { storage } from "../server/storage";
import { pool } from "../server/db";

let fixture: { userId: number; username: string; password: string } | undefined;
try {
  fixture = JSON.parse(execFileSync("npx", ["tsx", "scripts/trial-browser-fixture.ts", "create"], { encoding: "utf8" }));
  const base = `https://${process.env.REPLIT_DEV_DOMAIN}`;
  const login = await fetch(`${base}/api/auth/login`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: fixture!.username, password: fixture!.password }),
  });
  assert.equal(login.status, 200);
  await login.json();
  const cookie = login.headers.get("set-cookie")!.split(";")[0];
  const headers = { Cookie: cookie, "Content-Type": "application/json" };
  const created = await fetch(`${base}/api/conversations`, {
    method: "POST", headers, body: JSON.stringify({ title: "Synthetic automatic notice history" }),
  });
  assert.equal(created.status, 200);
  const conversation = await created.json();
  const stored = await storage.createMessage({
    conversationId: conversation.id, isUser: false, responseKind: "automatic", content: "Synthetic automatic notice, not personalised AI",
  });
  const history = await fetch(`${base}/api/conversations/${conversation.id}/messages`, { headers });
  assert.equal(history.status, 200);
  const rows = await history.json();
  assert.ok(rows.some((row: typeof stored) => row.id === stored.id && row.responseKind === "automatic"), "Actual API must return persisted automatic kind");
  const quota = await fetch(`${base}/api/question-limit`, { headers });
  assert.equal((await quota.json()).remaining, 5);
  console.log("PASS: storage/API history agree; automatic reply kind persists and quota remains 5. No AI or notifications.");
} finally {
  if (fixture) execFileSync("npx", ["tsx", "scripts/trial-browser-fixture.ts", "cleanup", String(fixture.userId)], { stdio: "pipe" });
  await pool.end();
}
