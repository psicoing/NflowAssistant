/**
 * Preview can share the live database in legacy installations. Restarting its
 * server must not reseed contacts, reset the administrator, or apply startup DDL.
 * Production behavior remains unchanged; development schema setup is explicit.
 */
export function shouldRunStartupDataBootstrap(env: NodeJS.ProcessEnv = process.env): boolean {
  return env.NODE_ENV !== "development";
}
