"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabasePublicConfig, isSupabaseConfigured } from "./config";
import type { Database } from "@/types/database";

let browserClient: SupabaseClient<Database> | undefined;

/** Returns one browser client per tab, or undefined when the optional local backend is not configured. */
export function getSupabaseBrowserClient(): SupabaseClient<Database> | undefined {
  if (!isSupabaseConfigured()) return undefined;
  if (!browserClient) {
    const { url, publishableKey } = getSupabasePublicConfig();
    browserClient = createBrowserClient<Database>(url, publishableKey);
  }
  return browserClient;
}
