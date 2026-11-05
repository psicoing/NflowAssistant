import { randomUUID } from "node:crypto";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

neonConfig.webSocketConstructor = ws;
const fingerprint = "SELECT md5(current_database()||':'||(SELECT oid::text FROM pg_database WHERE datname=current_database())) AS identity";

/** Refuse even temporary-schema writes when development matches the app database. */
export async function isolatedDevelopmentDatabase(prefix: string) {
  if (!/^[a-z_]+$/.test(prefix) || !process.env.DATABASE_URL) throw new Error("Development database required");
  const development = new Pool({ connectionString: process.env.DATABASE_URL });
  const application = new Pool({ connectionString: process.env.NEON_DATABASE_URL || process.env.DATABASE_URL });
  try {
    const [dev, app] = await Promise.all([development.query(fingerprint), application.query(fingerprint)]);
    if (dev.rows[0].identity === app.rows[0].identity) {
      throw new Error("Refusing writes: development and application databases coincide");
    }
  } catch (error) {
    await development.end();
    throw error;
  } finally { await application.end(); }
  const schema = `${prefix}_${randomUUID().replaceAll("-", "")}`;
  await development.query(`CREATE SCHEMA "${schema}"`);
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    options: `-c search_path=${schema}`,
  });
  if ((await pool.query("SELECT current_schema() AS name")).rows[0].name !== schema) {
    await pool.end();
    await development.end();
    throw new Error("Fixture schema isolation failed");
  }
  return {
    pool, schema,
    async close() {
      await pool.end();
      await development.query(`DROP SCHEMA "${schema}" CASCADE`);
      await development.end();
    },
  };
}
