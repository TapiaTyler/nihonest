import type { Metadata } from "next";
import { PersonalizedRoadmap } from "@/components/roadmap/personalized-roadmap";
import { guidedJourneys } from "@/data/discovery";
import { roadmapRecommendationRules } from "@/data/roadmap";
import { getAllArticles } from "@/lib/content/articles";
import { getAllChecklistDefinitions } from "@/lib/content/checklists";

export const metadata: Metadata = {
  title: "Your Roadmap | Nihonest",
  description: "Organize guidance around your selected journey, route, and current stage.",
  robots: { index: false, follow: false },
};

export default function RoadmapPage() {
  return (
    <div className="page-shell py-12 sm:py-16">
      <div className="max-w-3xl">
        <p className="eyebrow">Personalized roadmap</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">Keep your next steps in view.</h1>
        <p className="mt-5 text-lg leading-8 text-slate-600">Your roadmap uses the starting point saved on this device and the progress you set in guided journeys. All linked guidance remains public and available without an account.</p>
      </div>
      <PersonalizedRoadmap
        definitions={getAllChecklistDefinitions()}
        rules={roadmapRecommendationRules}
        articles={getAllArticles().map(({ metadata }) => metadata)}
        journeys={guidedJourneys}
      />
    </div>
  );
}
