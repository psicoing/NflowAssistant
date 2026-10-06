import session, { type SessionOptions } from "express-session";
import connectPgSimple from "connect-pg-simple";
import type { Pool } from "@neondatabase/serverless";

const PostgresStore = connectPgSimple(session);

export function productionSessionOptions(
  developmentDefaults: SessionOptions,
  pool: Pool,
  env: NodeJS.ProcessEnv = process.env,
  schemaName = "public",
): SessionOptions {
  const production = env.NODE_ENV === "production";
  if (production && !env.SESSION_SECRET?.trim()) {
    throw new Error("SESSION_SECRET is required for production sessions");
  }
  return {
    ...developmentDefaults,
    secret: env.SESSION_SECRET || developmentDefaults.secret,
    store: production ? new PostgresStore({
      pool,
      schemaName,
      tableName: "nuxa_auth_sessions",
      createTableIfMissing: true,
      errorLog: () => console.error("[session] Database session operation failed"),
    }) : developmentDefaults.store,
    resave: false,
    saveUninitialized: false,
    cookie: {
      ...developmentDefaults.cookie,
      httpOnly: true,
      secure: production,
      sameSite: "lax",
    },
  };
}
