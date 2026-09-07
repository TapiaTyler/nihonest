import type { Metadata } from "next";
import { AccountDashboard } from "@/components/account/account-dashboard";
import { AuthPanel } from "@/components/account/auth-panel";
import { accountPreferenceRowSchema, accountRowToAnonymousPreferences } from "@/domain/account/account";
import { getAuthenticatedRequest } from "@/lib/auth/server-identity";
import { enabledSocialProviders, isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "Account | Nihonest",
  description: "Optionally synchronize your Nihonest starting point across devices.",
};

export const dynamic = "force-dynamic";

type AccountPageProps = Readonly<{
  searchParams: Promise<{ auth?: string | string[]; account?: string | string[] }>;
}>;

export default async function AccountPage({ searchParams }: AccountPageProps) {
  const resolvedSearchParams = await searchParams;
  const authResult = resolvedSearchParams.auth;
  const accountResult = resolvedSearchParams.account;
  const authMessage = authResult === "error"
    ? "That sign-in link was invalid or expired. Request a new link and try again."
    : authResult === "unavailable"
      ? "Account services are not configured in this environment."
      : accountResult === "deleted"
        ? "Your account and synchronized data were permanently deleted."
        : undefined;
  const configured = isSupabaseConfigured();
  let user: { id: string; email?: string } | null = null;
  let displayName: string | undefined;
  let cloudPreferences;
  let storageAvailable = configured;

  if (configured) {
    const { client, identity } = await getAuthenticatedRequest();
    user = identity;
    if (user) {
      const [profileResult, preferenceResult] = await Promise.all([
        client.from("profiles").select("display_name").maybeSingle(),
        client.from("user_preferences").select("*").maybeSingle(),
      ]);
      storageAvailable = !profileResult.error && !preferenceResult.error;
      if (!storageAvailable) {
        console.error("[account] User-owned account storage could not be read.", {
          profileError: profileResult.error?.code,
          preferenceError: preferenceResult.error?.code,
        });
      }
      displayName = profileResult.data?.display_name ?? undefined;
      const parsedPreferences = accountPreferenceRowSchema.safeParse(preferenceResult.data);
      cloudPreferences = parsedPreferences.success
        ? accountRowToAnonymousPreferences(parsedPreferences.data)
        : undefined;
    }
  }

  return (
    <div className="page-shell py-12 sm:py-16">
      <div className="max-w-3xl">
        <p className="eyebrow">Account</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">Keep useful preferences, not unnecessary personal data.</h1>
        <p className="mt-5 text-lg leading-8 text-slate-600">Accounts are optional and exist for continuity. Every public guide, journey, FAQ, status, and glossary entry remains available without signing in.</p>
      </div>

      <div className="mt-10">
        {!configured ? (
          <section className="rounded-3xl border border-amber-300 bg-amber-50 p-6 sm:p-8" aria-labelledby="account-setup-heading">
            <h2 id="account-setup-heading" className="text-2xl font-semibold text-amber-950">Local account services are not running</h2>
            <p className="mt-3 leading-7 text-amber-950">Start the repository’s local Supabase stack, copy its URL and keys into <code>.env.local</code> using <code>.env.example</code>, and restart the development server. The public knowledgebase remains fully usable meanwhile.</p>
          </section>
        ) : user ? (
          <AccountDashboard userId={user.id} email={user.email ?? "Email unavailable"} initialDisplayName={displayName} initialCloudPreferences={cloudPreferences} storageAvailable={storageAvailable} />
        ) : (
          <AuthPanel googleEnabled={enabledSocialProviders.google} appleEnabled={enabledSocialProviders.apple} initialMessage={authMessage} initialIsError={Boolean(authMessage)} />
        )}
      </div>
    </div>
  );
}
