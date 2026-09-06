import type { Metadata } from "next";
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

      <ResidenceStatusExplorer residenceStatuses={residenceStatuses} />
    </div>
  );
}
