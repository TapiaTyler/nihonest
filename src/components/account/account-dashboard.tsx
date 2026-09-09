"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAccountContentSync } from "@/components/account/account-content-sync-provider";
import { useAccountSession } from "@/components/account/account-session-provider";
import type { AnonymousPreferences } from "@/domain/personalization/preferences";
import {
  saveDisplayName,
  saveSignedInPreferences,
} from "@/lib/accounts/client-account-service";
import { readAnonymousPreferences } from "@/lib/storage/anonymous-preferences";

type AccountDashboardProps = Readonly<{
  userId: string;
  email: string;
  initialDisplayName?: string;
  initialAccountPreferences?: AnonymousPreferences;
  storageAvailable: boolean;
}>;

type Feedback = Readonly<{
  scope: "profile" | "preferences" | "sign-out" | "delete";
  isError: boolean;
  text: string;
}>;

function ActionFeedback({ feedback, scope }: Readonly<{ feedback?: Feedback; scope: Feedback["scope"] }>) {
  if (feedback?.scope !== scope) return null;
  return <p role="status" aria-live="polite" className={`mt-4 text-sm font-medium ${feedback.isError ? "text-red-700" : "text-teal-800"}`}>{feedback.text}</p>;
}

export function AccountDashboard({
  userId,
  email,
  initialDisplayName = "",
  initialAccountPreferences,
  storageAvailable,
}: AccountDashboardProps) {
  const router = useRouter();
  const accountContentSync = useAccountContentSync();
  const accountSession = useAccountSession();
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [accountPreferences, setAccountPreferences] = useState(initialAccountPreferences);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [pendingAction, setPendingAction] = useState<Feedback["scope"]>();
  const [feedback, setFeedback] = useState<Feedback>();

  async function updateProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPendingAction("profile");
    const result = await saveDisplayName(userId, displayName);
    setPendingAction(undefined);
    if (result.ok) accountSession.updateDisplayName(displayName);
    setFeedback({ scope: "profile", isError: !result.ok, text: result.ok ? "Display name saved." : result.message });
  }

  async function importThisDevice() {
    const devicePreferences = readAnonymousPreferences();
    setPendingAction("preferences");
    const result = await saveSignedInPreferences(devicePreferences);
    setPendingAction(undefined);
    if (result.ok) setAccountPreferences(devicePreferences);
    setFeedback({ scope: "preferences", isError: !result.ok, text: result.ok ? "This device’s starting point is now saved to your account." : result.message });
  }

  async function endSession() {
    setPendingAction("sign-out");
    const result = await accountSession.endSession();
    if (result.ok) {
      router.replace("/");
      router.refresh();
    }
    else {
      setPendingAction(undefined);
      setFeedback({ scope: "sign-out", isError: true, text: result.message });
    }
  }

  async function deleteAccount() {
    if (deleteConfirmation !== "DELETE") return;
    setPendingAction("delete");
    setFeedback(undefined);
    const response = await fetch("/api/account", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ confirmation: deleteConfirmation }),
    });
    if (response.ok) {
      await accountSession.endSession();
      window.location.replace("/account?account=deleted");
      return;
    }
    const body = await response.json().catch(() => ({})) as { error?: string };
    setPendingAction(undefined);
    setFeedback({ scope: "delete", isError: true, text: body.error ?? "Account deletion failed. Please try again." });
  }

  return (
    <div className="space-y-6">
      {!storageAvailable && <div role="alert" className="rounded-2xl border border-amber-300 bg-amber-50 p-5 text-sm leading-6 text-amber-950">The account database is unavailable. Apply the local migration before saving profile or preference data.</div>}

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8" aria-labelledby="profile-heading">
        <div className="flex flex-col gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="eyebrow">Your account</p>
            <h2 id="profile-heading" className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Account details</h2>
            <p className="mt-2 break-all text-sm text-slate-500">Signed in as {email}</p>
          </div>
          <button type="button" disabled={Boolean(pendingAction)} onClick={endSession} className="min-h-11 self-start rounded-full border border-slate-300 px-5 text-sm font-semibold text-slate-800 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 disabled:opacity-50">Sign out</button>
        </div>
        <form onSubmit={updateProfile} className="mt-6">
          <label htmlFor="display-name" className="text-sm font-semibold text-slate-900">Display name <span className="font-normal text-slate-500">(optional)</span></label>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <input id="display-name" maxLength={80} value={displayName} onChange={(event) => setDisplayName(event.target.value)} className="min-h-12 flex-1 rounded-xl border border-slate-300 px-4 text-base outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20" />
            <button type="submit" disabled={Boolean(pendingAction) || !storageAvailable} className="min-h-12 rounded-xl bg-teal-800 px-5 text-sm font-semibold text-white hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 disabled:opacity-50">Save display name</button>
          </div>
          <ActionFeedback feedback={feedback} scope="profile" />
        </form>
        <ActionFeedback feedback={feedback} scope="sign-out" />
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8" aria-labelledby="sync-heading">
        <p className="eyebrow">Starting point</p>
        <h2 id="sync-heading" className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Use this device’s choices across devices</h2>
        <p className="mt-3 leading-7 text-slate-600">Importing replaces the account’s saved starting point with the choice stored in this browser. It does not upload browsing history or searches.</p>
        <dl className="mt-5 grid gap-2 rounded-2xl bg-slate-50 p-4 text-sm sm:grid-cols-2">
          <div><dt className="font-semibold text-slate-900">Saved stage</dt><dd className="mt-1 text-slate-600">{accountPreferences?.journeyStage ?? "Not saved"}</dd></div>
          <div><dt className="font-semibold text-slate-900">Saved journey</dt><dd className="mt-1 break-words text-slate-600">{accountPreferences?.journeyId ?? "Not saved"}</dd></div>
        </dl>
        <button type="button" disabled={Boolean(pendingAction) || !storageAvailable} onClick={importThisDevice} className="mt-5 min-h-11 rounded-full border border-teal-700 px-5 text-sm font-semibold text-teal-800 hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 disabled:opacity-50">Import this device’s starting point</button>
        <ActionFeedback feedback={feedback} scope="preferences" />
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8" aria-labelledby="content-sync-heading">
        <p className="eyebrow">Account synchronization</p>
        <h2 id="content-sync-heading" className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Saved content and progress</h2>
        <p className="mt-3 leading-7 text-slate-600">Saved guides, statuses, glossary terms, glossary review progress, and journey checklist progress synchronize automatically while you are signed in.</p>
        <div className="mt-5 flex flex-wrap items-center gap-3" aria-live="polite">
          <span className={`rounded-full px-4 py-2 text-sm font-semibold ${accountContentSync.status === "error" ? "bg-red-50 text-red-800" : "bg-teal-50 text-teal-800"}`}>
            {accountContentSync.status === "synchronizing" ? "Synchronizing…" : accountContentSync.status === "synchronized" ? "Synchronized" : accountContentSync.status === "error" ? "Synchronization needs attention" : "Waiting for account session"}
          </span>
          {accountContentSync.status === "error" && <button type="button" onClick={accountContentSync.retry} className="min-h-11 rounded-full border border-teal-700 px-5 text-sm font-semibold text-teal-800 hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">Try again</button>}
        </div>
        {accountContentSync.errorMessage && <p role="status" className="mt-3 text-sm font-medium text-red-700">{accountContentSync.errorMessage}</p>}
      </section>

      <details className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <summary className="cursor-pointer text-lg font-semibold text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">Privacy and account data</summary>
        <div className="mt-6 space-y-8 border-t border-slate-100 pt-6">
          <section aria-labelledby="data-heading">
            <h2 id="data-heading" className="text-lg font-semibold text-slate-950">Download a copy of your data</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">This optional technical record includes the profile, starting point, saved content, and progress associated with your account.</p>
            <a href="/api/account/export" download className="mt-3 inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold text-teal-800 hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">Download account data →</a>
          </section>

          <section className="rounded-2xl border border-red-200 bg-red-50 p-5" aria-labelledby="delete-heading">
            <h2 id="delete-heading" className="text-lg font-semibold text-red-950">Delete account</h2>
            <p className="mt-2 text-sm leading-6 text-red-900">This permanently removes the account, profile, synchronized preferences, saved content, and progress. Browser-local data on this device remains available until you clear it separately.</p>
            <label htmlFor="delete-confirmation" className="mt-4 block text-sm font-semibold text-red-950">Type DELETE to confirm</label>
            <input id="delete-confirmation" value={deleteConfirmation} onChange={(event) => setDeleteConfirmation(event.target.value)} autoComplete="off" className="mt-2 min-h-11 w-full rounded-xl border border-red-300 bg-white px-3 outline-none focus:border-red-700 focus:ring-2 focus:ring-red-700/20" />
            <button type="button" disabled={Boolean(pendingAction) || deleteConfirmation !== "DELETE"} onClick={deleteAccount} className="mt-4 min-h-11 rounded-full bg-red-800 px-5 text-sm font-semibold text-white hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800 disabled:opacity-50">Permanently delete account</button>
            <ActionFeedback feedback={feedback} scope="delete" />
          </section>
        </div>
      </details>
    </div>
  );
}
