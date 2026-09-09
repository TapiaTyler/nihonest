import type { Metadata } from "next";
import { Suspense } from "react";
import { ReminderManager } from "@/components/notifications/reminder-manager";

export const metadata: Metadata = {
  title: "Reminders | Nihonest",
  description: "Schedule and manage optional reminders for your journey through Japan.",
  robots: { index: false, follow: false },
};

export default function RemindersPage() {
  return (
    <div className="page-shell py-12 sm:py-16">
      <div className="max-w-3xl">
        <p className="eyebrow">Your reminders</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">Keep important dates from slipping away.</h1>
        <p className="mt-5 text-lg leading-8 text-slate-600">Schedule a date connected to a journey step or create your own deadline. Reminder preferences remain entirely optional and separate from authentication.</p>
      </div>
      <Suspense fallback={<p className="mt-10 text-slate-600">Loading reminders…</p>}><ReminderManager /></Suspense>
    </div>
  );
}
