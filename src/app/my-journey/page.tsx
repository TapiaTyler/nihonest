import type { Metadata } from "next";
import { Suspense } from "react";
import { InterfaceText } from "@/components/localization/interface-text";
import { LocalizedDocumentTitle } from "@/components/localization/localized-document-title";
import { getInterfaceMessage } from "@/domain/localization/interface-messages";
import { MyJourney } from "@/components/journey/my-journey";
import { getArticleGroupSearchTranslations, getArticleSearchTranslations, getJourneyTranslations } from "@/lib/content/translations";
import { articleGroups, guidedJourneys } from "@/data/discovery";
import { getAllArticles } from "@/lib/content/article-metadata";

export const metadata: Metadata = {
  title: "My Journey | Nihonest",
  description: "Return to your selected route-aware journey and locally saved progress.",
  robots: { index: false, follow: false },
};

export default function MyJourneyPage() {
  return (
    <>
      <LocalizedDocumentTitle japanese={getInterfaceMessage("ja", "pageTitle.myJourney")} />
      <Suspense fallback={<div className="page-shell py-12 sm:py-20"><p className="text-slate-600"><InterfaceText id="myJourney.loading" /></p></div>}>
        <MyJourney journeys={guidedJourneys} groups={articleGroups} articles={getAllArticles().map(({ metadata }) => metadata)} translations={getJourneyTranslations()} groupTranslations={getArticleGroupSearchTranslations()} articleTranslations={getArticleSearchTranslations()} />
      </Suspense>
    </>
  );
}
