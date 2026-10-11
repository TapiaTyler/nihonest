import type { Metadata } from "next";
import Link from "next/link";
import { OnboardingForm } from "@/components/personalization/onboarding-form";
import { InterfaceText } from "@/components/localization/interface-text";
import { getAllArticles, getAllArticleGroups, getAllGuidedJourneys } from "@/lib/content/article-metadata";
import { getArticleGroupSearchTranslations, getJourneyTranslations } from "@/lib/content/translations";
import { LocalizedDocumentTitle } from "@/components/localization/localized-document-title";
import { getInterfaceMessage } from "@/domain/localization/interface-messages";

export const metadata: Metadata = {
  title: "Find your starting point | Nihonest",
  description: "Optionally choose your journey stage, a guided path, and a focused route for locally saved starting points.",
};

export default async function OnboardingPage({ searchParams }: PageProps<"/onboarding">) {
  const query = await searchParams;
  const returnTo = query.returnTo === "/roadmap" || query.returnTo === "/my-journey" ? query.returnTo : "/";
  const articles = getAllArticles().map(({ metadata }) => metadata);

  return (
    <div className="page-shell py-12 sm:py-20">
      <LocalizedDocumentTitle japanese={getInterfaceMessage("ja", "pageTitle.onboarding")} />
      <Link href={returnTo} className="inline-flex min-h-11 items-center rounded-sm text-sm font-semibold text-brand-link hover:text-brand-link-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus">
        <InterfaceText id={returnTo === "/roadmap" ? "onboarding.backRoadmap" : returnTo === "/my-journey" ? "onboarding.backMyJourney" : "onboarding.backHome"} />
      </Link>
      <header className="mt-8 max-w-3xl">
        <p className="eyebrow"><InterfaceText id="onboarding.eyebrow" /></p>
        <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          <InterfaceText id="onboarding.title" />
        </h1>
        <p className="mt-6 text-lg leading-8 text-ink-muted">
          <InterfaceText id="onboarding.description" />
        </p>
      </header>
      <OnboardingForm
        journeys={getAllGuidedJourneys()}
        groups={getAllArticleGroups()}
        articles={articles}
        returnTo={returnTo}
        journeyTranslations={getJourneyTranslations()}
        groupTranslations={getArticleGroupSearchTranslations()}
      />
    </div>
  );
}
