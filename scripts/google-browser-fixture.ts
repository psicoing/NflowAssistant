import { createServer as createHttpServer } from "node:http";
import { createServer as createViteServer } from "vite";
import viteConfig from "../vite.config";
import { googleTestApp } from "./lib/google-test-app";

const fixture = await googleTestApp();
const vite = await createViteServer({
  ...viteConfig,configFile:false,appType:"spa",
  server:{middlewareMode:true,hmr:false,allowedHosts:true},
});
fixture.app.post("/__fixture/stop", (_req,res) => {
  res.json({stopping:true});
  setTimeout(() => void stop(),100);
});
fixture.app.use(vite.middlewares);
const server = createHttpServer(fixture.app);
const port = process.env.GOOGLE_FIXTURE_PORT === "5000" ? 5000 : 5012;
server.listen(port,"0.0.0.0",() => console.log(`GOOGLE_FIXTURE_READY port=${port} providers=none development-only`));
let stopping = false;
async function stop() {
  if (stopping) return;
  stopping = true;
  server.closeAllConnections();
  await vite.close();
  await new Promise<void>(resolve => server.close(() => resolve()));
  await fixture.close();
  console.log("GOOGLE_FIXTURE_CLEANED");
  process.exit(0);
}
process.on("SIGTERM",stop);
process.on("SIGINT",stop);
