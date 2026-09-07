import type { Metadata } from "next";
import Link from "next/link";
import { OnboardingForm } from "@/components/personalization/onboarding-form";
import { getAllArticles, getAllArticleGroups, getAllGuidedJourneys } from "@/lib/content/articles";

export const metadata: Metadata = {
  title: "Find your starting point | Nihonest",
  description: "Optionally choose your journey stage, a guided path, and a focused route for locally saved starting points.",
};

export default function OnboardingPage() {
  const articles = getAllArticles().map(({ metadata }) => metadata);

  return (
    <div className="page-shell py-12 sm:py-20">
      <Link href="/" className="rounded-sm text-sm font-semibold text-teal-800 hover:text-teal-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700">
        ← Back to Home
      </Link>
      <header className="mt-8 max-w-3xl">
        <p className="eyebrow">Optional personalization</p>
        <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          Where are you in your Japan journey?
        </h1>
        <p className="mt-6 text-lg leading-8 text-slate-600">
          Choose your timing and, if useful, a route-aware journey. Nihonest will adjust a few starting points without hiding public information or treating your choices as an eligibility decision.
        </p>
      </header>
      <OnboardingForm
        journeys={getAllGuidedJourneys()}
        groups={getAllArticleGroups()}
        articles={articles}
      />
    </div>
  );
}
