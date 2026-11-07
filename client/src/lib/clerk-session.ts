type ClerkWindow = Window & {
  Clerk?: {
    signOut?: () => Promise<unknown>;
  };
};

/** Clerk is loaded only on its scoped routes; local NUXA logout remains authoritative. */
export async function signOutClerkIfPresent() {
  try {
    const clerk = (window as ClerkWindow).Clerk;
    if (clerk?.signOut) await clerk.signOut();
  } catch {
    // Keep the existing NUXA logout flow available if Clerk is already unavailable.
  }
}
