"use client";

import Link from "next/link";
import { journeyStages } from "@/domain/taxonomy/taxonomy";
import type { JourneyStageId } from "@/domain/taxonomy/taxonomy";
import type { InterfaceMessageId } from "@/domain/localization/interface-message-catalogs/english";
import { japaneseTaxonomyLabels } from "@/data/translations/ja/taxonomy-labels";
import { useInterfaceMessages } from "@/components/localization/interface-text";
import { usePersonalization } from "./personalization-provider";

const stageDescriptions: Record<JourneyStageId, InterfaceMessageId> = {
  planning: "onboarding.stagePlanningDescription",
  preparing: "onboarding.stagePreparingDescription",
  "recently-arrived": "onboarding.stageRecentlyArrivedDescription",
  "living-in-japan": "onboarding.stageLivingInJapanDescription",
};

/**
 * Lets a visitor without a saved starting point reach real guidance from the home page. It renders on the server
 * and until preferences load so it stays visible without scripts, then yields to the personalized recommendations.
 */
export function StageBrowse() {
  const { preferences, isReady } = usePersonalization();
  const { locale, message } = useInterfaceMessages();
  if (isReady && preferences.journeyStage) return null;

  return (
    <section lang={locale} className="border-b border-slate-200 bg-white" aria-labelledby="home-stage-browse-heading">
      <div className="page-shell py-14 sm:py-18">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">{message("home.stagesEyebrow")}</p>
            <h2 id="home-stage-browse-heading" className="mt-3 text-balance text-3xl font-semibold tracking-tight text-slate-950">
              {message("home.stagesTitle")}
            </h2>
          </div>
          <Link href="/explore" className="inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold text-teal-800 hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">
            {message("home.browseAllGuides")}
          </Link>
        </div>
        <p className="ja-prose mt-4 max-w-3xl leading-7 text-slate-600">{message("home.stagesDescription")}</p>
        <ul className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {journeyStages.map(({ id, label }) => (
            <li key={id}>
              <Link
                href={`/explore?stage=${id}`}
                className="flex h-full flex-col rounded-2xl border border-slate-200 bg-stone-50 p-5 transition-colors hover:border-teal-300 hover:bg-teal-50/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
              >
                <span className="text-lg font-semibold tracking-tight text-slate-950">
                  {locale === "ja" ? japaneseTaxonomyLabels.journeyStage[id] : label}
                </span>
                <span className="mt-2 leading-7 text-slate-600">{message(stageDescriptions[id])}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
