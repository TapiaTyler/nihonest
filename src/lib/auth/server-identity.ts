import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AuthenticatedIdentity = Readonly<{
  id: string;
  email?: string;
  authenticatedAt?: string;
}>;

/** Validates the cookie-backed JWT before exposing identity to server routes or components. */
export async function getAuthenticatedRequest() {
  const client = await createSupabaseServerClient();
  const { data, error } = await client.auth.getClaims();
  const claims = data?.claims;
  if (error || !claims?.sub || claims.role !== "authenticated") {
    return { client, identity: null } as const;
  }

  const identity: AuthenticatedIdentity = {
    id: claims.sub,
    email: typeof claims.email === "string" ? claims.email : undefined,
    authenticatedAt: typeof claims.iat === "number"
      ? new Date(claims.iat * 1000).toISOString()
      : undefined,
  };
  return { client, identity } as const;
}
