import "server-only";

import { createClient } from "@supabase/supabase-js";
import { readSupabaseSecretKey } from "@/lib/config/deployment-config";
import { getSupabasePublicConfig } from "./config";
import type { Database } from "@/types/database";

/** Administrative access is isolated to server-only account lifecycle operations and never carries a user token. */
export function createSupabaseAdminClient() {
  const secretKey = readSupabaseSecretKey(process.env);
  if (!secretKey) throw new Error("A server-only Supabase secret key is required for account deletion.");
  const { url } = getSupabasePublicConfig();
  return createClient<Database>(url, secretKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
