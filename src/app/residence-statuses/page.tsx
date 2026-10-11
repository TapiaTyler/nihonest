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
    <div className="page-shell py-12 sm:py-16">
      <LocalizedDocumentTitle japanese={getInterfaceMessage("ja", "pageTitle.residenceStatuses")} />
      <header className="max-w-3xl">
        <p className="eyebrow"><InterfaceText id="statusesPage.eyebrow" /></p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          <InterfaceText id="statusesPage.heading" />
        </h1>
      </header>
      <p className="mt-5 max-w-3xl leading-7 text-slate-600">
        <InterfaceText id="statusesPage.activityPrompt" />{" "}
        <Link href="/can-i-do-this" className="inline-flex min-h-11 items-center font-semibold text-teal-800 underline decoration-teal-300 underline-offset-4 hover:text-teal-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"><InterfaceText id="statusesPage.activityLink" /></Link>
      </p>

      <ResidenceStatusExplorer residenceStatuses={residenceStatuses} translations={getResidenceStatusTranslations()} />

      {/* Special Permanent Resident belongs to a separate statute, not the selectable ordinary-status catalog. */}
      <aside className="mt-12 max-w-3xl border-t border-slate-200 pt-6 text-sm leading-6 text-slate-700">
        <p><InterfaceText id="statusesPage.specialPermanentBody" /></p>
        <Link href="/articles/special-permanent-residents-in-japan" className="mt-2 inline-flex min-h-11 items-center font-semibold text-teal-800 underline decoration-teal-300 underline-offset-4 hover:text-teal-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">
          <InterfaceText id="statusesPage.specialPermanentLink" />
        </Link>
      </aside>
    </div>
  );
}
