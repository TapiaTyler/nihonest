"use client";

import Link from "next/link";
import { type FormEvent, useEffect, useState } from "react";
import type { NotificationPreferences } from "@/domain/notifications/notifications";
import {
  loadNotificationPreferences,
  saveNotificationPreferences,
} from "@/lib/notifications/client-notification-service";

type LoadState = "loading" | "ready" | "error";

export function NotificationPreferencesForm({ userId }: Readonly<{ userId: string }>) {
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [preferences, setPreferences] = useState<NotificationPreferences>();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string>();
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let active = true;
    void loadNotificationPreferences(userId).then((result) => {
      if (!active) return;
      if (result.ok) {
        setPreferences(result.data);
        setLoadState("ready");
      } else {
        setMessage(result.message);
        setIsError(true);
        setLoadState("error");
      }
    });
    return () => { active = false; };
  }, [userId]);

  function updatePreference<Key extends keyof Pick<NotificationPreferences, "emailEnabled" | "deadlineRemindersEnabled" | "criticalUpdatesEnabled" | "timeZone">>(key: Key, value: NotificationPreferences[Key]) {
    setPreferences((current) => current ? { ...current, [key]: value } : current);
    setMessage(undefined);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!preferences) return;
    setSaving(true);
    setMessage(undefined);
    const result = await saveNotificationPreferences(userId, {
      emailEnabled: preferences.emailEnabled,
      deadlineRemindersEnabled: preferences.deadlineRemindersEnabled,
      criticalUpdatesEnabled: preferences.criticalUpdatesEnabled,
      timeZone: preferences.timeZone,
    });
    setSaving(false);
    setIsError(!result.ok);
    if (result.ok) setPreferences(result.data);
    setMessage(result.ok ? "Notification preferences saved." : result.message);
  }

  return (
    <section id="notification-preferences" className="scroll-mt-24 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8" aria-labelledby="notification-preferences-heading">
      <p className="eyebrow">Optional communication</p>
      <h2 id="notification-preferences-heading" className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Notification preferences</h2>
      <p className="mt-3 leading-7 text-slate-600">Authentication emails never subscribe you to reminders or updates. Every optional setting starts off.</p>

      {loadState === "loading" && <p className="mt-5 text-sm text-slate-600">Loading notification preferences…</p>}
      {preferences && (
        <form onSubmit={submit} className="mt-6 space-y-5">
          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 p-4 hover:border-teal-300">
            <input type="checkbox" checked={preferences.emailEnabled} onChange={(event) => updatePreference("emailEnabled", event.target.checked)} className="mt-1 size-5 accent-teal-700" />
            <span><span className="block font-semibold text-slate-950">Allow optional email</span><span className="mt-1 block text-sm leading-6 text-slate-600">Master switch for the email topics selected below.</span></span>
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-slate-50 p-4">
              <input type="checkbox" checked={preferences.deadlineRemindersEnabled} onChange={(event) => updatePreference("deadlineRemindersEnabled", event.target.checked)} className="mt-1 size-5 accent-teal-700" />
              <span><span className="block font-semibold text-slate-950">Requested deadline reminders</span><span className="mt-1 block text-sm leading-6 text-slate-600">Reminders you deliberately schedule.</span></span>
            </label>
            <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-slate-50 p-4">
              <input type="checkbox" checked={preferences.criticalUpdatesEnabled} onChange={(event) => updatePreference("criticalUpdatesEnabled", event.target.checked)} className="mt-1 size-5 accent-teal-700" />
              <span><span className="block font-semibold text-slate-950">Targeted critical updates</span><span className="mt-1 block text-sm leading-6 text-slate-600">Important reviewed changes relevant to your saved context.</span></span>
            </label>
          </div>
          <div>
            <label htmlFor="notification-time-zone" className="text-sm font-semibold text-slate-900">Reminder time zone</label>
            <input id="notification-time-zone" value={preferences.timeZone} onChange={(event) => updatePreference("timeZone", event.target.value)} placeholder="Asia/Tokyo" autoComplete="off" className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20" />
            <p className="mt-2 text-xs leading-5 text-slate-500">Use an IANA time zone such as Asia/Tokyo or America/New_York. Each reminder keeps the zone in which you scheduled it.</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <button type="submit" disabled={saving} className="min-h-11 cursor-pointer rounded-full bg-teal-800 px-5 text-sm font-semibold text-white hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 disabled:cursor-wait disabled:opacity-60">{saving ? "Saving…" : "Save notification preferences"}</button>
            <Link href="/reminders" className="inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold text-teal-800 hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">Manage reminders →</Link>
          </div>
        </form>
      )}
      {loadState === "error" && <button type="button" onClick={() => window.location.reload()} className="mt-4 min-h-11 cursor-pointer rounded-full border border-teal-700 px-5 text-sm font-semibold text-teal-800 hover:bg-teal-50">Try again</button>}
      <p role="status" aria-live="polite" className={`mt-4 min-h-5 text-sm font-medium ${isError ? "text-red-700" : "text-teal-800"}`}>{message}</p>
      <p className="mt-3 text-xs leading-5 text-slate-500">Email delivery is not active during this local implementation stage. Saved choices will control delivery after hosted validation.</p>
    </section>
  );
}
