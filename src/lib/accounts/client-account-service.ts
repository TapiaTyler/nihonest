"use client";

import type { Provider } from "@supabase/supabase-js";
import {
  accountPreferenceRowSchema,
  accountProfileSchema,
  accountRowToAnonymousPreferences,
  anonymousPreferencesToAccountRow,
} from "@/domain/account/account";
import type { AnonymousPreferences } from "@/domain/personalization/preferences";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export type AccountOperationResult = Readonly<{ ok: true }> | Readonly<{ ok: false; message: string }>;
export type EmailAccountIntent = "sign-in" | "create";

function unavailable(): AccountOperationResult {
  return { ok: false, message: "Account services are not configured in this environment." };
}

export async function requestMagicLink(email: string, intent: EmailAccountIntent): Promise<AccountOperationResult> {
  const client = getSupabaseBrowserClient();
  if (!client) return unavailable();
  const { error } = await client.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback?next=/account`,
      shouldCreateUser: intent === "create",
    },
  });
  return error
    ? { ok: false, message: "The sign-in email could not be sent. Please wait and try again." }
    : { ok: true };
}

export async function beginSocialSignIn(provider: Extract<Provider, "google" | "apple">): Promise<AccountOperationResult> {
  const client = getSupabaseBrowserClient();
  if (!client) return unavailable();
  const { error } = await client.auth.signInWithOAuth({
    provider,
    options: { redirectTo: `${window.location.origin}/auth/callback?next=/account` },
  });
  return error
    ? { ok: false, message: `Sign in with ${provider === "google" ? "Google" : "Apple"} could not start.` }
    : { ok: true };
}

export async function loadSignedInPreferences(): Promise<AnonymousPreferences | undefined> {
  const client = getSupabaseBrowserClient();
  if (!client) return undefined;
  const { data: { user } } = await client.auth.getUser();
  if (!user) return undefined;

  const { data, error } = await client.from("user_preferences").select("*").maybeSingle();
  if (error || !data) return undefined;
  const parsed = accountPreferenceRowSchema.safeParse(data);
  return parsed.success ? accountRowToAnonymousPreferences(parsed.data) : undefined;
}

export async function saveSignedInPreferences(preferences: AnonymousPreferences): Promise<AccountOperationResult> {
  const client = getSupabaseBrowserClient();
  if (!client) return unavailable();
  const { data: { user } } = await client.auth.getUser();
  if (!user) return { ok: false, message: "Sign in before saving preferences across devices." };

  const row = anonymousPreferencesToAccountRow(user.id, preferences);
  const { error } = await client.from("user_preferences").upsert(row, { onConflict: "user_id" });
  return error
    ? { ok: false, message: "Your preferences could not be saved to the account." }
    : { ok: true };
}

export async function saveDisplayName(userId: string, displayName: string): Promise<AccountOperationResult> {
  const client = getSupabaseBrowserClient();
  if (!client) return unavailable();
  const profile = accountProfileSchema.safeParse({ displayName });
  if (!profile.success) return { ok: false, message: "Display names must be 80 characters or fewer." };
  const { error } = await client.from("profiles").upsert({
    user_id: userId,
    display_name: profile.data.displayName || null,
  }, { onConflict: "user_id" });
  return error
    ? { ok: false, message: "Your profile could not be updated." }
    : { ok: true };
}

export async function signOut(): Promise<AccountOperationResult> {
  const client = getSupabaseBrowserClient();
  if (!client) return unavailable();
  const { error } = await client.auth.signOut({ scope: "local" });
  return error ? { ok: false, message: "Sign out failed. Please try again." } : { ok: true };
}
