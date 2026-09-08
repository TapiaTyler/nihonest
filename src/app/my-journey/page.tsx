import type { Metadata } from "next";
import { Suspense } from "react";
import { MyJourney } from "@/components/journey/my-journey";
import { articleGroups, guidedJourneys } from "@/data/discovery";
import { getAllArticles } from "@/lib/content/articles";

export const metadata: Metadata = {
  title: "My Journey | Nihonest",
  description: "Return to your selected route-aware journey and locally saved progress.",
  robots: { index: false, follow: false },
};

export default function MyJourneyPage() {
  return (
    <Suspense fallback={<div className="page-shell py-12 sm:py-20"><p className="text-slate-600">Loading your journey…</p></div>}>
      <MyJourney journeys={guidedJourneys} groups={articleGroups} articles={getAllArticles().map(({ metadata }) => metadata)} />
    </Suspense>
  );
}
