import type { Metadata } from "next";
import { ExploreDiscovery } from "@/components/discovery/explore-discovery";
import { StageRecommendations } from "@/components/personalization/stage-recommendations";
import { residenceStatuses } from "@/data/residence-statuses";
import { getAllArticles, getAllArticleGroups, getAllGuidedJourneys } from "@/lib/content/articles";
import { getAllGlossaryTerms } from "@/lib/content/glossary";
import { getAllFaqEntries } from "@/lib/content/faqs";
import { getPilotArticleSearchTranslations } from "@/lib/content/translations";

export const metadata: Metadata = {
  title: "Explore | Nihonest",
  description: "Browse or search practical, sourced guidance for moving to and living in Japan.",
};

export default function ExplorePage() {
  const articles = getAllArticles().map(({ metadata }) => metadata);

  return (
    <div className="page-shell py-16 sm:py-24">
      <header className="max-w-3xl">
        <p className="eyebrow">Explore</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          Find the guidance that fits your situation.
        </h1>
        <p className="mt-6 text-lg leading-8 text-slate-600">
          Browse a high-level group or search the complete knowledgebase. Individual guides and Japanese terms remain public and link to the responsible authorities.
        </p>
      </header>
      <StageRecommendations articles={articles} journeys={getAllGuidedJourneys()} location="explore" />
      <ExploreDiscovery
        groups={getAllArticleGroups()}
        articles={articles}
        terms={getAllGlossaryTerms()}
        residenceStatuses={residenceStatuses}
        faqEntries={getAllFaqEntries()}
        articleTranslations={getPilotArticleSearchTranslations()}
      />
    </div>
  );
}
