"use client";

import Link from "next/link";

export const reminderReturnStorageKey = "nihonest:reminder-return-to:v1";

export function ReminderLink({ targetId, title, returnTo }: Readonly<{ targetId: string; title: string; returnTo: string }>) {
  return (
    <Link
      href={{ pathname: "/reminders", query: { target: "checklist", targetId, title, returnTo } }}
      aria-label={`Set reminder for ${title}`}
      title="Set reminder"
      onClick={() => sessionStorage.setItem(reminderReturnStorageKey, returnTo)}
      className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-slate-300 bg-slate-50 text-teal-800 hover:border-teal-500 hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </Link>
  );
}
