import type { Metadata } from "next";
import Link from "next/link";
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
      <Link href="/articles/understanding-japan-geography-government-and-language" className="mt-6 inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold text-teal-800 hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">
        New to Japan? Start with the country basics →
      </Link>
      <aside className="mt-8 max-w-3xl rounded-2xl border border-teal-200 bg-teal-50 p-5 sm:flex sm:items-center sm:justify-between sm:gap-6">
        <div>
          <p className="font-semibold text-teal-950">Not sure which rule or status applies?</p>
          <p className="mt-1 text-sm leading-6 text-teal-900">Start with an activity and see the separate facts, guidance, and authorities you need to check.</p>
        </div>
        <Link href="/can-i-do-this" className="mt-4 inline-flex min-h-11 shrink-0 items-center rounded-full bg-teal-800 px-5 text-sm font-semibold text-white hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 sm:mt-0">Explore an activity →</Link>
      </aside>
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
