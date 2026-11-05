import { createServer as createHttpServer } from "node:http";
import { createServer as createViteServer } from "vite";
import viteConfig from "../vite.config";
import { registrationTestApp, auditTableFixtureSql } from "./lib/registration-test-app";

// Intentionally does not import or start server/index.ts. No production jobs,
// provider clients, real authentication service or application DB writes.
const fixture = await registrationTestApp();
await fixture.pool.query(auditTableFixtureSql);
const vite = await createViteServer({
  ...viteConfig, configFile: false, appType: "spa",
  server: { middlewareMode: true, hmr: false, allowedHosts: true },
});
fixture.app.use(vite.middlewares);
const server = createHttpServer(fixture.app);
server.listen(5011, "0.0.0.0", () => console.log("ISOLATED_REGISTRATION_FIXTURE_READY port=5011 development-only providers=mock"));
let stopping = false;
async function stop() {
  if (stopping) return;
  stopping = true;
  await vite.close();
  await new Promise<void>(resolve => server.close(() => resolve()));
  await fixture.close();
  process.exit(0);
}
process.on("SIGTERM", stop);
process.on("SIGINT", stop);
