import type { Metadata } from "next";
import Link from "next/link";
import { ResidenceStatusExplorer } from "@/components/residence-status/residence-status-explorer";
import { residenceStatuses } from "@/data/residence-statuses";

export const metadata: Metadata = {
  title: "Residence Statuses | Nihonest",
  description:
    "Browse draft residence-status records linked to official Japanese sources.",
};

export default function ResidenceStatusesPage() {
  return (
    <div className="page-shell py-16 sm:py-24">
      <header className="max-w-3xl">
        <p className="eyebrow">Residence statuses</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          Understand the categories, then verify the details.
        </h1>
        <p className="mt-6 text-lg leading-8 text-slate-600">
          This draft directory organizes Japan&apos;s residence statuses by purpose. It does not determine eligibility or whether a particular activity is permitted.
        </p>
      </header>

      <aside className="mt-8 max-w-3xl rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
        <strong>Draft coverage:</strong> These records are incomplete and provided for product development. Confirm current requirements with the Immigration Services Agency or a qualified professional.
      </aside>

      <aside className="mt-4 max-w-3xl rounded-2xl border border-teal-200 bg-teal-50 p-5 sm:flex sm:items-center sm:justify-between sm:gap-6">
        <div>
          <p className="font-semibold text-teal-950">Know the activity, but not the status?</p>
          <p className="mt-1 text-sm leading-6 text-teal-900">Use the educational cross-reference to identify the separate questions and routes worth examining.</p>
        </div>
        <Link href="/can-i-do-this" className="mt-4 inline-flex min-h-11 shrink-0 items-center rounded-full bg-teal-800 px-5 text-sm font-semibold text-white hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 sm:mt-0">Start with an activity →</Link>
      </aside>

      <ResidenceStatusExplorer residenceStatuses={residenceStatuses} />
    </div>
  );
}
