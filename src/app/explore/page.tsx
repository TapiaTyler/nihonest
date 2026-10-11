import type { Metadata } from "next";
import Link from "next/link";
import { InterfaceText } from "@/components/localization/interface-text";
import { ExploreDiscovery } from "@/components/discovery/explore-discovery";
import { StageRecommendations } from "@/components/personalization/stage-recommendations";
import { residenceStatuses } from "@/data/residence-statuses";
import { getAllArticles, getAllArticleGroups, getAllGuidedJourneys } from "@/lib/content/article-metadata";
import { getAllGlossaryTerms } from "@/lib/content/glossary";
import { getAllFaqEntries } from "@/lib/content/faqs";
import { getArticleGroupSearchTranslations, getArticleSearchTranslations, getFaqSearchTranslations, getGlossarySearchTranslations, getJourneyTitleTranslations } from "@/lib/content/translations";
import { LocalizedDocumentTitle } from "@/components/localization/localized-document-title";
import { getInterfaceMessage } from "@/domain/localization/interface-messages";

export const metadata: Metadata = {
  title: "Explore | Nihonest",
  description: "Browse or search practical, sourced guidance for moving to and living in Japan.",
};

export default function ExplorePage() {
  const articles = getAllArticles().map(({ metadata }) => metadata);

  return (
    <div className="page-shell py-12 sm:py-16">
      <LocalizedDocumentTitle japanese={getInterfaceMessage("ja", "pageTitle.explore")} />
      <header className="max-w-3xl">
        <p className="eyebrow"><InterfaceText id="explore.eyebrow" /></p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          <InterfaceText id="explore.title" />
        </h1>
        <p className="mt-6 text-lg leading-8 text-slate-600">
          <InterfaceText id="explore.description" />
        </p>
      </header>
      <ExploreDiscovery
        groups={getAllArticleGroups()}
        articles={articles}
        terms={getAllGlossaryTerms()}
        residenceStatuses={residenceStatuses}
        faqEntries={getAllFaqEntries()}
        articleTranslations={getArticleSearchTranslations()}
        groupTranslations={getArticleGroupSearchTranslations()}
        faqTranslations={getFaqSearchTranslations()}
        glossaryTranslations={getGlossarySearchTranslations()}
        supplement={(
          <>
            <Link href="/articles/understanding-japan-geography-government-and-language" className="mt-6 inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold text-brand-link hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus">
              <InterfaceText id="explore.countryBasics" />
            </Link>
            <aside className="mt-8 max-w-3xl rounded-2xl border border-brand-line bg-brand-soft p-5 sm:flex sm:items-center sm:justify-between sm:gap-6">
              <div>
                <p className="font-semibold text-brand-deep"><InterfaceText id="explore.activityPrompt" /></p>
                <p className="mt-1 text-sm leading-6 text-brand-deep-soft"><InterfaceText id="explore.activityDescription" /></p>
              </div>
              <Link href="/can-i-do-this" className="mt-4 inline-flex min-h-11 shrink-0 items-center rounded-full bg-brand px-5 text-sm font-semibold text-white hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus sm:mt-0"><InterfaceText id="explore.activityLink" /></Link>
            </aside>
            <StageRecommendations articles={articles} journeys={getAllGuidedJourneys()} location="explore" articleTranslations={getArticleSearchTranslations()} journeyTitles={getJourneyTitleTranslations()} />
          </>
        )}
      />
    </div>
  );
}
