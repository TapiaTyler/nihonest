import type { NextRequest } from "next/server";
import { updateSupabaseSession } from "@/lib/supabase/proxy";

/**
 * Session refresh runs only where the server needs a verified identity: the account page, account APIs, and the
 * authentication callback. Prebuilt public pages make no per-request Auth call; on them the browser Supabase client
 * refreshes the session itself and rewrites the cookies, which these routes then read.
 */
export async function proxy(request: NextRequest) {
  return updateSupabaseSession(request);
}

export const config = {
  matcher: ["/account", "/account/:path*", "/api/account", "/api/account/:path*", "/auth/:path*"],
};
