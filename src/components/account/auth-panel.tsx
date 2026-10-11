"use client";

import { type FormEvent, useState } from "react";
import { useInterfaceMessages } from "@/components/localization/interface-text";
import type { InterfaceMessageId } from "@/domain/localization/interface-messages";
import {
  beginSocialSignIn,
  type EmailAccountIntent,
  requestMagicLink,
} from "@/lib/accounts/client-account-service";

type AuthPanelProps = Readonly<{
  googleEnabled: boolean;
  appleEnabled: boolean;
  initialMessageId?: InterfaceMessageId;
  initialIsError?: boolean;
}>;

export function AuthPanel({ googleEnabled, appleEnabled, initialMessageId, initialIsError = false }: AuthPanelProps) {
  const { message: t, serviceMessage } = useInterfaceMessages();
  const [email, setEmail] = useState("");
  const [intent, setIntent] = useState<EmailAccountIntent>("sign-in");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string>();
  // The server notice stays a key and is translated at render time, since the stored language applies after hydration.
  const [noticeId, setNoticeId] = useState(initialMessageId);
  const [isError, setIsError] = useState(initialIsError);

  async function submitEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage(undefined);
    setNoticeId(undefined);
    const result = await requestMagicLink(email.trim(), intent);
    setPending(false);
    setIsError(!result.ok);
    setMessage(result.ok ? t(intent === "create" ? "auth.checkEmailCreate" : "auth.checkEmailSignIn") : result.message);
  }

  async function submitSocial(provider: "google" | "apple") {
    setPending(true);
    setMessage(undefined);
    setNoticeId(undefined);
    const result = await beginSocialSignIn(provider);
    if (!result.ok) {
      setPending(false);
      setIsError(true);
      setMessage(result.message);
    }
  }

  return (
    <section className="rounded-3xl border border-line bg-surface p-6 shadow-sm sm:p-8" aria-labelledby="sign-in-heading">
      <p className="eyebrow">{t("auth.eyebrow")}</p>
      <h2 id="sign-in-heading" className="mt-2 text-2xl font-semibold tracking-tight text-ink">{t(intent === "sign-in" ? "auth.signInHeading" : "auth.createHeading")}</h2>
      <p className="mt-3 leading-7 text-ink-muted">{t("auth.intro")}</p>

      <div className="mt-6 grid grid-cols-2 gap-2 rounded-2xl bg-surface-muted p-1" role="group" aria-label={t("auth.action")}>
        {(["sign-in", "create"] as const).map((option) => (
          <button key={option} type="button" aria-pressed={intent === option} onClick={() => { setIntent(option); setMessage(undefined); setNoticeId(undefined); }} className="min-h-11 rounded-xl px-4 text-sm font-semibold text-ink-body hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus aria-pressed:bg-surface aria-pressed:text-brand-link aria-pressed:shadow-sm">
            {t(option === "sign-in" ? "auth.signIn" : "auth.create")}
          </button>
        ))}
      </div>

      <form onSubmit={submitEmail} className="mt-6">
        <label htmlFor="account-email" className="text-sm font-semibold text-ink-strong">{t("auth.email")}</label>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <input id="account-email" name="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="min-h-12 flex-1 rounded-xl border border-field bg-surface px-4 text-base text-ink shadow-sm outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20" />
          <button type="submit" disabled={pending} className="min-h-12 rounded-xl bg-brand px-5 text-sm font-semibold text-on-brand hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-wait disabled:opacity-60">
            {pending ? t("auth.pleaseWait") : t(intent === "sign-in" ? "auth.sendSignIn" : "auth.sendCreate")}
          </button>
        </div>
      </form>

      {(googleEnabled || appleEnabled) && (
        <div className="mt-6 border-t border-line pt-6">
          <p className="text-sm text-ink-subtle">{t("auth.orContinue")}</p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            {googleEnabled && <button type="button" disabled={pending} onClick={() => submitSocial("google")} className="min-h-11 rounded-xl border border-line-strong px-5 text-sm font-semibold text-ink-firm hover:border-brand-500 hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus">Google</button>}
            {appleEnabled && <button type="button" disabled={pending} onClick={() => submitSocial("apple")} className="min-h-11 rounded-xl border border-line-strong px-5 text-sm font-semibold text-ink-firm hover:border-brand-500 hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus">Apple</button>}
          </div>
        </div>
      )}

      <p role="status" aria-live="polite" className={`mt-5 min-h-6 text-sm ${isError ? "text-danger-accent" : "text-brand-link"}`}>{message !== undefined ? serviceMessage(message) : noticeId && t(noticeId)}</p>
      <p className="mt-4 text-xs leading-5 text-ink-subtle">{t("auth.linkNote")}</p>
    </section>
  );
}
