import type { Metadata } from "next";
import { GlossaryExplorer } from "@/components/glossary/glossary-explorer";
import { getAllGlossaryTerms } from "@/lib/content/glossary";
import { getGlossarySearchTranslations } from "@/lib/content/translations";
import { InterfaceText } from "@/components/localization/interface-text";
import { LocalizedDocumentTitle } from "@/components/localization/localized-document-title";
import { getInterfaceMessage } from "@/domain/localization/interface-messages";

export const metadata: Metadata = {
  title: "Japanese Glossary | Nihonest",
  description: "Search practical Japanese terms used in immigration, municipal, health, pension, and daily-life procedures.",
};

export default function GlossaryPage() {
  return (
    <div className="page-shell py-12 sm:py-16">
      <LocalizedDocumentTitle japanese={getInterfaceMessage("ja", "pageTitle.glossary")} />
      <header className="max-w-3xl">
        <p className="eyebrow"><InterfaceText id="glossaryIndex.eyebrow" /></p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          <InterfaceText id="glossaryIndex.title" />
        </h1>
        <p className="mt-6 text-lg leading-8 text-slate-600">
          <InterfaceText id="glossaryIndex.description" />
        </p>
      </header>

      <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600">
        <InterfaceText id="glossaryIndex.aside" />
      </p>

      <GlossaryExplorer terms={getAllGlossaryTerms()} translations={getGlossarySearchTranslations()} />
    </div>
  );
}
