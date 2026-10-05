import type { Metadata } from "next";
import { InterfaceText } from "@/components/localization/interface-text";
import { SavedContentLibrary } from "@/components/saved-content/saved-content-library";
import { getAllArticles } from "@/lib/content/article-metadata";
import { getAllGlossaryTerms } from "@/lib/content/glossary";
import { getArticleSearchTranslations, getGlossarySearchTranslations, getResidenceStatusTranslations } from "@/lib/content/translations";
import { residenceStatuses } from "@/data/residence-statuses";
import { LocalizedDocumentTitle } from "@/components/localization/localized-document-title";
import { getInterfaceMessage } from "@/domain/localization/interface-messages";

export const metadata: Metadata = {
  title: "Saved Content | Nihonest",
  description: "Return to the Nihonest guides, residence statuses, and Japanese terms saved on this device.",
  robots: { index: false, follow: false },
};

export default function SavedPage() {
  return (
    <div className="page-shell py-12 sm:py-16">
      <LocalizedDocumentTitle japanese={getInterfaceMessage("ja", "pageTitle.saved")} />
      <div className="max-w-3xl">
        <p className="eyebrow"><InterfaceText id="saved.eyebrow" /></p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl"><InterfaceText id="saved.heading" /></h1>
        <p className="mt-5 text-lg leading-8 text-slate-600"><InterfaceText id="saved.intro" /></p>
      </div>
      <SavedContentLibrary articles={getAllArticles().map(({ metadata: article }) => article)} residenceStatuses={residenceStatuses} terms={getAllGlossaryTerms()} translations={{ articles: getArticleSearchTranslations(), statuses: getResidenceStatusTranslations(), terms: getGlossarySearchTranslations() }} />
    </div>
  );
}
