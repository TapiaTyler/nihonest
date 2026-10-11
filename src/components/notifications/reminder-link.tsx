"use client";

import Link from "next/link";
import { useInterfaceMessages } from "@/components/localization/interface-text";

export const reminderReturnStorageKey = "nihonest:reminder-return-to:v1";

export function ReminderLink({ targetId, title, returnTo }: Readonly<{ targetId: string; title: string; returnTo: string }>) {
  const { message, format } = useInterfaceMessages();
  return (
    <Link
      href={{ pathname: "/reminders", query: { target: "checklist", targetId, title, returnTo } }}
      aria-label={format("reminders.setFor", { title })}
      title={message("reminders.set")}
      onClick={() => sessionStorage.setItem(reminderReturnStorageKey, returnTo)}
      className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-slate-300 bg-slate-50 text-brand-link hover:border-brand-500 hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </Link>
  );
}
