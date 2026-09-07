export type SupabasePublicConfig = Readonly<{
  url: string;
  publishableKey: string;
}>;

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL
    && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}

export function getSupabasePublicConfig(): SupabasePublicConfig {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !publishableKey) {
    throw new Error("Supabase is not configured. Add the public URL and publishable key to the local environment.");
  }
  return { url, publishableKey };
}

export const enabledSocialProviders = {
  google: process.env.NEXT_PUBLIC_SUPABASE_GOOGLE_AUTH_ENABLED === "true",
  apple: process.env.NEXT_PUBLIC_SUPABASE_APPLE_AUTH_ENABLED === "true",
} as const;
