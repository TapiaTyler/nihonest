import type { Metadata } from "next";
import { Suspense } from "react";
import { InterfaceText } from "@/components/localization/interface-text";
import { ReminderManager } from "@/components/notifications/reminder-manager";
import { LocalizedDocumentTitle } from "@/components/localization/localized-document-title";
import { getInterfaceMessage } from "@/domain/localization/interface-messages";

export const metadata: Metadata = {
  title: "Reminders | Nihonest",
  description: "Schedule and manage optional reminders for your journey through Japan.",
  robots: { index: false, follow: false },
};

export default function RemindersPage() {
  return (
    <div className="page-shell py-12 sm:py-16">
      <LocalizedDocumentTitle japanese={getInterfaceMessage("ja", "pageTitle.reminders")} />
      <div className="max-w-3xl">
        <p className="eyebrow"><InterfaceText id="reminders.eyebrow" /></p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl"><InterfaceText id="reminders.heading" /></h1>
        <p className="mt-5 text-lg leading-8 text-slate-600"><InterfaceText id="reminders.intro" /></p>
      </div>
      <Suspense fallback={<p className="mt-10 text-slate-600"><InterfaceText id="reminders.loading" /></p>}><ReminderManager /></Suspense>
    </div>
  );
}
