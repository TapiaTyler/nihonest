"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import { useAccountSession } from "@/components/account/account-session-provider";
import { reminderReturnStorageKey } from "@/components/notifications/reminder-link";
import type { NotificationPreferences, Reminder } from "@/domain/notifications/notifications";
import {
  browserTimeZone,
  cancelScheduledReminder,
  createScheduledReminder,
  loadNotificationPreferences,
  loadScheduledReminders,
} from "@/lib/notifications/client-notification-service";

function formatReminderTime(reminder: Reminder): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: reminder.timeZone,
  }).format(new Date(reminder.scheduledFor));
}

export function ReminderManager() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const accountSession = useAccountSession();
  const requestedTarget = useMemo<Reminder["target"]>(() => {
    const targetId = searchParams.get("targetId");
    return searchParams.get("target") === "checklist" && targetId
      ? { kind: "checklist", id: targetId }
      : { kind: "custom" };
  }, [searchParams]);
  const requestedTitle = searchParams.get("title")?.slice(0, 120) ?? "";
  const returnTo = searchParams.get("returnTo");
  const [title, setTitle] = useState(requestedTitle);
  const [localDateTime, setLocalDateTime] = useState("");
  const [preferences, setPreferences] = useState<NotificationPreferences>();
  const [reminders, setReminders] = useState<readonly Reminder[]>([]);
  const [loadedUserId, setLoadedUserId] = useState<string>();
  const [pendingId, setPendingId] = useState<string>();
  const [message, setMessage] = useState<string>();
  const [isError, setIsError] = useState(false);
  const safeReturnTo = returnTo?.startsWith("/") && !returnTo.startsWith("//") ? returnTo : undefined;

  function returnToSource() {
    if (!safeReturnTo) return;
    if (sessionStorage.getItem(reminderReturnStorageKey) === safeReturnTo) {
      sessionStorage.removeItem(reminderReturnStorageKey);
      router.back();
      return;
    }
    router.push(safeReturnTo);
  }

  useEffect(() => {
    if (accountSession.status !== "signed-in") {
      return;
    }
    let active = true;
    void Promise.all([
      loadNotificationPreferences(accountSession.userId),
      loadScheduledReminders(accountSession.userId),
    ]).then(([preferenceResult, reminderResult]) => {
      if (!active) return;
      if (preferenceResult.ok) setPreferences(preferenceResult.data);
      if (reminderResult.ok) setReminders(reminderResult.data);
      const error = !preferenceResult.ok ? preferenceResult.message : !reminderResult.ok ? reminderResult.message : undefined;
      setMessage(error);
      setIsError(Boolean(error));
      setLoadedUserId(accountSession.userId);
    });
    return () => { active = false; };
  }, [accountSession.status, accountSession.userId]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (accountSession.status !== "signed-in") return;
    setPendingId("create");
    setMessage(undefined);
    const result = await createScheduledReminder({
      userId: accountSession.userId,
      title,
      target: requestedTarget,
      localDateTime,
      timeZone: preferences?.timeZone ?? browserTimeZone(),
    });
    setPendingId(undefined);
    setIsError(!result.ok);
    if (result.ok) {
      setReminders((current) => [...current, result.data].sort((left, right) => left.scheduledFor.localeCompare(right.scheduledFor)));
      setLocalDateTime("");
      if (requestedTarget.kind === "custom") setTitle("");
      if (safeReturnTo) {
        returnToSource();
        return;
      }
    }
    setMessage(result.ok ? "Reminder scheduled." : result.message);
  }

  async function cancel(reminderId: string) {
    if (accountSession.status !== "signed-in") return;
    setPendingId(reminderId);
    setMessage(undefined);
    const result = await cancelScheduledReminder(accountSession.userId, reminderId);
    setPendingId(undefined);
    setIsError(!result.ok);
    if (result.ok) setReminders((current) => current.filter(({ id }) => id !== reminderId));
    setMessage(result.ok ? "Reminder cancelled." : result.message);
  }

  if (accountSession.status === "loading" || (accountSession.status === "signed-in" && loadedUserId !== accountSession.userId)) return <p className="mt-10 text-slate-600">Loading reminders…</p>;

  if (accountSession.status !== "signed-in") {
    return (
      <section className="mt-10 rounded-3xl border border-teal-200 bg-teal-50/60 p-7 sm:p-9">
        <h2 className="text-2xl font-semibold text-slate-950">Sign in to schedule reminders</h2>
        <p className="mt-3 max-w-2xl leading-7 text-slate-600">Reminders require an optional account because the requested time and delivery preferences must be stored securely. All guidance remains available without an account.</p>
        <Link href="/account" className="mt-6 inline-flex min-h-11 items-center rounded-full bg-teal-800 px-5 text-sm font-semibold text-white hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">Login or create an account</Link>
      </section>
    );
  }

  const deliveryPaused = !preferences?.emailEnabled || !preferences.deadlineRemindersEnabled;

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(22rem,1.15fr)]">
      <section className="self-start rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8" aria-labelledby="schedule-reminder-heading">
        <p className="eyebrow">New reminder</p>
        <h2 id="schedule-reminder-heading" className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Choose when to be reminded</h2>
        {requestedTarget.kind !== "custom" && <p className="mt-4 rounded-xl bg-teal-50 p-4 text-sm font-medium leading-6 text-teal-950">Journey step selected: {requestedTitle}</p>}
        <form onSubmit={submit} className="mt-6 space-y-5">
          <div><label htmlFor="reminder-title" className="text-sm font-semibold text-slate-900">Reminder title</label><input id="reminder-title" required maxLength={120} value={title} onChange={(event) => setTitle(event.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 px-4 text-base outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20" /></div>
          <div><label htmlFor="reminder-time" className="text-sm font-semibold text-slate-900">Date and time</label><input id="reminder-time" required type="datetime-local" value={localDateTime} onChange={(event) => setLocalDateTime(event.target.value)} className="mt-2 min-h-12 w-full cursor-pointer rounded-xl border border-slate-300 px-4 text-base outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20" /></div>
          <p className="rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">Time zone: <span className="font-semibold text-slate-900">{preferences?.timeZone ?? browserTimeZone()}</span>. <Link href="/account#notification-preferences" className="font-semibold text-teal-800 hover:text-teal-600">Change in Account</Link>.</p>
          {deliveryPaused && <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">Email delivery is paused by your preferences. You can still save this reminder, then enable optional email and requested deadline reminders in Account.</p>}
          <button type="submit" disabled={pendingId === "create"} className="min-h-11 cursor-pointer rounded-full bg-teal-800 px-5 text-sm font-semibold text-white hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 disabled:cursor-wait disabled:opacity-60">{pendingId === "create" ? "Scheduling…" : "Schedule reminder"}</button>
          {safeReturnTo && <button type="button" onClick={returnToSource} className="ml-3 inline-flex min-h-11 cursor-pointer items-center rounded-full px-4 text-sm font-semibold text-teal-800 hover:bg-teal-50">Return to journey</button>}
        </form>
        <p role="status" aria-live="polite" className={`mt-4 min-h-5 text-sm font-medium ${isError ? "text-red-700" : "text-teal-800"}`}>{message}</p>
      </section>

      <section className="self-start rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8" aria-labelledby="upcoming-reminders-heading">
        <p className="eyebrow">Scheduled</p>
        <h2 id="upcoming-reminders-heading" className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Upcoming reminders</h2>
        {reminders.length ? (
          <ul className="mt-6 divide-y divide-slate-200">
            {reminders.map((reminder) => (
              <li key={reminder.id} className="flex flex-col gap-4 py-5 first:pt-0 sm:flex-row sm:items-center sm:justify-between">
                <div><p className="font-semibold text-slate-950">{reminder.title}</p><p className="mt-1 text-sm text-slate-600">{formatReminderTime(reminder)} · {reminder.timeZone}</p></div>
                <button type="button" disabled={Boolean(pendingId)} onClick={() => void cancel(reminder.id)} className="min-h-11 cursor-pointer self-start rounded-full border border-slate-300 px-4 text-sm font-semibold text-slate-700 hover:border-red-300 hover:bg-red-50 hover:text-red-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700 disabled:cursor-wait disabled:opacity-60">{pendingId === reminder.id ? "Cancelling…" : "Cancel"}</button>
              </li>
            ))}
          </ul>
        ) : <p className="mt-5 rounded-2xl bg-slate-50 p-5 leading-7 text-slate-600">You have no upcoming reminders. Create a custom deadline here or use the bell beside a step in My Journey.</p>}
        <p className="mt-5 text-xs leading-5 text-slate-500">Email delivery remains disabled until the provider and hosted scheduler are validated. This page currently stores and manages your reminder requests.</p>
      </section>
    </div>
  );
}
