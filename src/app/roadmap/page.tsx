import type { Metadata } from "next";
import { InterfaceText } from "@/components/localization/interface-text";
import { PersonalizedRoadmap } from "@/components/roadmap/personalized-roadmap";
import { guidedJourneys } from "@/data/discovery";
import { roadmapRecommendationRules } from "@/data/roadmap";
import { getAllArticles } from "@/lib/content/articles";
import { getAllChecklistDefinitions } from "@/lib/content/checklists";
import { getArticleSearchTranslations, getJourneyTranslations } from "@/lib/content/translations";
import { LocalizedDocumentTitle } from "@/components/localization/localized-document-title";
import { getInterfaceMessage } from "@/domain/localization/interface-messages";

export const metadata: Metadata = {
  title: "Your Roadmap | Nihonest",
  description: "Organize guidance around your selected journey, route, and current stage.",
  robots: { index: false, follow: false },
};

export default function RoadmapPage() {
  return (
    <div className="page-shell py-12 sm:py-16">
      <LocalizedDocumentTitle japanese={getInterfaceMessage("ja", "pageTitle.roadmap")} />
      <div className="max-w-3xl">
        <p className="eyebrow"><InterfaceText id="roadmap.eyebrow" /></p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl"><InterfaceText id="roadmap.heading" /></h1>
        <p className="mt-5 text-lg leading-8 text-slate-600"><InterfaceText id="roadmap.intro" /></p>
      </div>
      <PersonalizedRoadmap
        definitions={getAllChecklistDefinitions()}
        rules={roadmapRecommendationRules}
        articles={getAllArticles().map(({ metadata }) => metadata)}
        journeys={guidedJourneys}
        journeyTranslations={getJourneyTranslations()}
        articleTranslations={getArticleSearchTranslations()}
      />
    </div>
  );
}
