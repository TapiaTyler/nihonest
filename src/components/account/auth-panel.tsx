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
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8" aria-labelledby="sign-in-heading">
      <p className="eyebrow">{t("auth.eyebrow")}</p>
      <h2 id="sign-in-heading" className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{t(intent === "sign-in" ? "auth.signInHeading" : "auth.createHeading")}</h2>
      <p className="mt-3 leading-7 text-slate-600">{t("auth.intro")}</p>

      <div className="mt-6 grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1" role="group" aria-label={t("auth.action")}>
        {(["sign-in", "create"] as const).map((option) => (
          <button key={option} type="button" aria-pressed={intent === option} onClick={() => { setIntent(option); setMessage(undefined); setNoticeId(undefined); }} className="min-h-11 rounded-xl px-4 text-sm font-semibold text-slate-700 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 aria-pressed:bg-white aria-pressed:text-teal-800 aria-pressed:shadow-sm">
            {t(option === "sign-in" ? "auth.signIn" : "auth.create")}
          </button>
        ))}
      </div>

      <form onSubmit={submitEmail} className="mt-6">
        <label htmlFor="account-email" className="text-sm font-semibold text-slate-900">{t("auth.email")}</label>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <input id="account-email" name="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="min-h-12 flex-1 rounded-xl border border-slate-300 bg-white px-4 text-base text-slate-950 shadow-sm outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20" />
          <button type="submit" disabled={pending} className="min-h-12 rounded-xl bg-teal-800 px-5 text-sm font-semibold text-white hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 disabled:cursor-wait disabled:opacity-60">
            {pending ? t("auth.pleaseWait") : t(intent === "sign-in" ? "auth.sendSignIn" : "auth.sendCreate")}
          </button>
        </div>
      </form>

      {(googleEnabled || appleEnabled) && (
        <div className="mt-6 border-t border-slate-200 pt-6">
          <p className="text-sm text-slate-500">{t("auth.orContinue")}</p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            {googleEnabled && <button type="button" disabled={pending} onClick={() => submitSocial("google")} className="min-h-11 rounded-xl border border-slate-300 px-5 text-sm font-semibold text-slate-800 hover:border-teal-500 hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">Google</button>}
            {appleEnabled && <button type="button" disabled={pending} onClick={() => submitSocial("apple")} className="min-h-11 rounded-xl border border-slate-300 px-5 text-sm font-semibold text-slate-800 hover:border-teal-500 hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">Apple</button>}
          </div>
        </div>
      )}

      <p role="status" aria-live="polite" className={`mt-5 min-h-6 text-sm ${isError ? "text-red-700" : "text-teal-800"}`}>{message !== undefined ? serviceMessage(message) : noticeId && t(noticeId)}</p>
      <p className="mt-4 text-xs leading-5 text-slate-500">{t("auth.linkNote")}</p>
    </section>
  );
}
