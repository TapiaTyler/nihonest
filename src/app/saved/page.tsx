import type { Metadata } from "next";
import { SavedContentLibrary } from "@/components/saved-content/saved-content-library";
import { getAllArticles } from "@/lib/content/articles";
import { getAllGlossaryTerms } from "@/lib/content/glossary";
import { residenceStatuses } from "@/data/residence-statuses";

export const metadata: Metadata = {
  title: "Saved Content | Nihonest",
  description: "Return to the Nihonest guides, residence statuses, and Japanese terms saved on this device.",
  robots: { index: false, follow: false },
};

export default function SavedPage() {
  return (
    <div className="page-shell py-12 sm:py-16">
      <div className="max-w-3xl">
        <p className="eyebrow">Saved content</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">Keep useful guidance close.</h1>
        <p className="mt-5 text-lg leading-8 text-slate-600">Guides, residence statuses, and glossary terms saved here remain available in this browser. An account is not required. For now, saved content stays on this device.</p>
      </div>
      <SavedContentLibrary articles={getAllArticles().map(({ metadata: article }) => article)} residenceStatuses={residenceStatuses} terms={getAllGlossaryTerms()} />
    </div>
  );
}
