import { createServer as createHttpServer } from "node:http";
import { createServer as createViteServer } from "vite";
import viteConfig from "../vite.config";
import { empresaTestApp } from "./lib/empresa-test-app";

// Only synthetic data in a fingerprint-verified development schema.
// Never imports server/index.ts or a mail/AI/payment provider.
const fixture = await empresaTestApp();
await fixture.pool.query(`INSERT INTO empresa_contacts(email,company,opted_out,company_size) VALUES
  ('ready@example.invalid','Fixture Elegible',false,'5k_19999'),
  (NULL,'Fixture Sin correo',false,'unclassified'),
  ('bad@','Fixture Inválida',false,'unclassified'),
  ('out@example.invalid','Fixture Baja',true,'unclassified'),
  ('mail@blocked.invalid','Fixture Suprimida',false,'unclassified');
  INSERT INTO empresa_suppression_list VALUES('domain','blocked.invalid');`);
const vite = await createViteServer({
  ...viteConfig,configFile: false,appType: "spa",
  server: { middlewareMode: true,hmr: false,allowedHosts: true },
});
fixture.app.use(vite.middlewares);
const server = createHttpServer(fixture.app);
server.listen(5012, "0.0.0.0", () => console.log("EMPRESA_FIXTURE_READY port=5012 providers=none development-only"));
let stopping = false;
async function stop() {
  if (stopping) return;
  stopping = true;
  server.closeAllConnections();
  await vite.close();
  await new Promise<void>(resolve => server.close(() => resolve()));
  await fixture.close();
  process.exit(0);
}
process.on("SIGTERM", stop);
process.on("SIGINT", stop);
