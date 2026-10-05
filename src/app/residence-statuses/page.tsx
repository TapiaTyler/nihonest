import type { Metadata } from "next";
import Link from "next/link";
import { InterfaceText } from "@/components/localization/interface-text";
import { ResidenceStatusExplorer } from "@/components/residence-status/residence-status-explorer";
import { residenceStatuses } from "@/data/residence-statuses";
import { getResidenceStatusTranslations } from "@/lib/content/translations";
import { LocalizedDocumentTitle } from "@/components/localization/localized-document-title";
import { getInterfaceMessage } from "@/domain/localization/interface-messages";

export const metadata: Metadata = {
  title: "Residence Statuses | Nihonest",
  description:
    "Browse residence-status records linked to official Japanese sources.",
};

export default function ResidenceStatusesPage() {
  return (
    <div className="page-shell py-16 sm:py-24">
      <LocalizedDocumentTitle japanese={getInterfaceMessage("ja", "pageTitle.residenceStatuses")} />
      <header className="max-w-3xl">
        <p className="eyebrow"><InterfaceText id="statusesPage.eyebrow" /></p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          <InterfaceText id="statusesPage.heading" />
        </h1>
      </header>
      <aside className="mt-8 max-w-3xl rounded-2xl border border-teal-200 bg-teal-50 p-5 sm:flex sm:items-center sm:justify-between sm:gap-6">
        <div>
          <p className="font-semibold text-teal-950"><InterfaceText id="statusesPage.activityPrompt" /></p>
          <p className="mt-1 text-sm leading-6 text-teal-900"><InterfaceText id="statusesPage.activityBody" /></p>
        </div>
        <Link href="/can-i-do-this" className="mt-4 inline-flex min-h-11 shrink-0 items-center rounded-full bg-teal-800 px-5 text-sm font-semibold text-white hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 sm:mt-0"><InterfaceText id="statusesPage.activityLink" /></Link>
      </aside>

      {/* Special Permanent Resident belongs to a separate statute, not the selectable ordinary-status catalog. */}
      <aside className="mt-4 max-w-3xl rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-700">
        <p><InterfaceText id="statusesPage.specialPermanentBody" /></p>
        <Link href="/articles/special-permanent-residents-in-japan" className="mt-2 inline-flex min-h-11 items-center font-semibold text-teal-800 underline decoration-teal-300 underline-offset-4 hover:text-teal-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">
          <InterfaceText id="statusesPage.specialPermanentLink" />
        </Link>
      </aside>

      <ResidenceStatusExplorer residenceStatuses={residenceStatuses} translations={getResidenceStatusTranslations()} />
    </div>
  );
}
