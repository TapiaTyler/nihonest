import type { Metadata } from "next";
import { ArticleCard } from "@/components/content/article-card";
import { getArticlesByGroup, getJourneySteps } from "@/lib/content/articles";

const applicabilityLabels = {
  "all-students": "All study routes",
  "student-status": "Student status only",
  "temporary-visitor": "Temporary Visitor only",
  "registered-resident": "Resident registration required",
} as const;

export const metadata: Metadata = {
  title: "Explore | Nihonest",
  description: "Follow practical, sourced guidance for an international student's move to Japan.",
};

export default function ExplorePage() {
  const studentSteps = getJourneySteps("student-moving-to-japan");
  const visaArticles = getArticlesByGroup("visas-and-residence");

  return (
    <div className="page-shell py-16 sm:py-24">
      <header className="max-w-3xl">
        <p className="eyebrow">Explore</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          Practical guidance for moving to Japan.
        </h1>
        <p className="mt-6 text-lg leading-8 text-slate-600">
          Start with an ordered journey or compare focused guidance by visa and residence route. Every article stays public and links back to the responsible authorities.
        </p>
      </header>
      <section className="mt-14" aria-labelledby="student-journey-heading">
        <p className="eyebrow">Start here</p>
        <h2 id="student-journey-heading" className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
          Student journey
        </h2>
        <p className="mt-4 max-w-3xl leading-7 text-slate-600">
          First identify whether you will enter as a Temporary Visitor or under Student status. Each later step shows which route it applies to.
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {studentSteps.map(({ article, step }, index) => (
            <div key={article.metadata.id} className="relative pt-5">
              <div className="absolute left-5 top-0 z-10 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-teal-800 px-3 py-1 text-xs font-semibold text-white">
                  Step {index + 1}
                </span>
                {step.applicability.map((scope) => (
                  <span key={scope} className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-900">
                    {applicabilityLabels[scope]}
                  </span>
                ))}
              </div>
              <ArticleCard article={article.metadata} />
            </div>
          ))}
        </div>
      </section>

      <section className="mt-20 border-t border-slate-200 pt-14" aria-labelledby="visa-guides-heading">
        <p className="eyebrow">Compare routes</p>
        <h2 id="visa-guides-heading" className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
          Visa and residence guidance
        </h2>
        <p className="mt-4 max-w-3xl leading-7 text-slate-600">
          Plain-language introductions to selected visa pathways and their corresponding activities in Japan. A visa and a status of residence are related, but they are not the same document or decision.
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {visaArticles.map((article) => (
            <ArticleCard key={article.metadata.id} article={article.metadata} />
          ))}
        </div>
      </section>
    </div>
  );
}
