import type { Metadata } from "next";
import { AccountDashboard } from "@/components/account/account-dashboard";
import { AuthPanel } from "@/components/account/auth-panel";
import { InterfaceText } from "@/components/localization/interface-text";
import type { InterfaceMessageId } from "@/domain/localization/interface-messages";
import { accountPreferenceRowSchema, accountRowToAnonymousPreferences } from "@/domain/account/account";
import { getAuthenticatedRequest } from "@/lib/auth/server-identity";
import { enabledSocialProviders, isSupabaseConfigured } from "@/lib/supabase/config";
import { LocalizedDocumentTitle } from "@/components/localization/localized-document-title";
import { getInterfaceMessage } from "@/domain/localization/interface-messages";

export const metadata: Metadata = {
  title: "Account | Nihonest",
  description: "Optionally synchronize your Nihonest starting point, saved guidance, progress, and reminders across devices.",
};

export const dynamic = "force-dynamic";

type AccountPageProps = Readonly<{
  searchParams: Promise<{ auth?: string | string[]; account?: string | string[] }>;
}>;

export default async function AccountPage({ searchParams }: AccountPageProps) {
  const resolvedSearchParams = await searchParams;
  const authResult = resolvedSearchParams.auth;
  const accountResult = resolvedSearchParams.account;
  // A message key, so the client panel can show the notice in the selected language.
  const authMessageId: InterfaceMessageId | undefined = authResult === "error"
    ? "account.authError"
    : authResult === "unavailable"
      ? "account.authUnavailable"
      : accountResult === "deleted"
        ? "account.deleted"
        : undefined;
  const configured = isSupabaseConfigured();
  let user: { id: string; email?: string } | null = null;
  let displayName: string | undefined;
  let accountPreferences;
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
      accountPreferences = parsedPreferences.success
        ? accountRowToAnonymousPreferences(parsedPreferences.data)
        : undefined;
    }
  }

  return (
    <div className="page-shell py-12 sm:py-16">
      <LocalizedDocumentTitle japanese={getInterfaceMessage("ja", "pageTitle.account")} />
      <div className="max-w-3xl">
        <p className="eyebrow"><InterfaceText id="account.eyebrow" /></p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink sm:text-5xl"><InterfaceText id="account.heading" /></h1>
        <p className="mt-5 text-lg leading-8 text-ink-muted"><InterfaceText id="account.intro" /></p>
      </div>

      <div className="mt-10">
        {!configured ? (
          <section className="rounded-3xl border border-caution-line-strong bg-caution-soft p-6 sm:p-8" aria-labelledby="account-setup-heading">
            <h2 id="account-setup-heading" className="text-2xl font-semibold text-caution-ink"><InterfaceText id="account.setupHeading" /></h2>
            <p className="mt-3 leading-7 text-caution-ink"><InterfaceText id="account.setupBody" /></p>
          </section>
        ) : user ? (
          <AccountDashboard userId={user.id} email={user.email} initialDisplayName={displayName} initialAccountPreferences={accountPreferences} storageAvailable={storageAvailable} />
        ) : (
          <AuthPanel googleEnabled={enabledSocialProviders.google} appleEnabled={enabledSocialProviders.apple} initialMessageId={authMessageId} initialIsError={authMessageId === "account.authError" || authMessageId === "account.authUnavailable"} />
        )}
      </div>

      {!user && (
        <section className="mt-8 rounded-3xl border border-brand-line bg-brand-soft/70 p-6 sm:p-8" aria-labelledby="account-benefits-heading">
          <p className="eyebrow"><InterfaceText id="account.benefitsEyebrow" /></p>
          <h2 id="account-benefits-heading" className="mt-2 text-2xl font-semibold tracking-tight text-ink"><InterfaceText id="account.benefitsHeading" /></h2>
          <ul className="mt-5 grid gap-3 text-sm leading-6 text-ink-body sm:grid-cols-2">
            <li className="rounded-2xl bg-surface p-4"><span className="font-semibold text-ink"><InterfaceText id="account.benefit.saved" /></span><span className="mt-1 block"><InterfaceText id="account.benefit.savedBody" /></span></li>
            <li className="rounded-2xl bg-surface p-4"><span className="font-semibold text-ink"><InterfaceText id="account.benefit.review" /></span><span className="mt-1 block"><InterfaceText id="account.benefit.reviewBody" /></span></li>
            <li className="rounded-2xl bg-surface p-4"><span className="font-semibold text-ink"><InterfaceText id="account.benefit.progress" /></span><span className="mt-1 block"><InterfaceText id="account.benefit.progressBody" /></span></li>
            <li className="rounded-2xl bg-surface p-4"><span className="font-semibold text-ink"><InterfaceText id="account.benefit.direction" /></span><span className="mt-1 block"><InterfaceText id="account.benefit.directionBody" /></span></li>
            <li className="rounded-2xl bg-surface p-4"><span className="font-semibold text-ink"><InterfaceText id="account.benefit.reminders" /></span><span className="mt-1 block"><InterfaceText id="account.benefit.remindersBody" /></span></li>
          </ul>
          <p className="mt-5 text-sm font-medium leading-6 text-brand-deep"><InterfaceText id="account.benefitsNote" /></p>
        </section>
      )}
    </div>
  );
}
