import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

const databaseUrl = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "NEON_DATABASE_URL or DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: databaseUrl });

// Neon serverless connections are terminated periodically by the server.
// Without this handler the 'error' event would be unhandled and crash the process.
pool.on("error", (err) => {
  console.error("[db] Idle pool client error (connection dropped by server):", err.message);
});

export const db = drizzle({ client: pool, schema });