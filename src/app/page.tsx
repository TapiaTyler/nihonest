import { HomeHero } from "@/components/personalization/home-hero";
import { StageRecommendations } from "@/components/personalization/stage-recommendations";
import { getAllArticles, getAllGuidedJourneys } from "@/lib/content/articles";

const principles = [
  {
    label: "Clarity",
    title: "Understand what matters",
    description:
      "Clear explanations will help connect official processes, practical steps, and the terms you will encounter.",
  },
  {
    label: "Sources",
    title: "Follow reliable sources",
    description:
      "Important guidance will point back to the authorities responsible for the rules and procedures.",
  },
  {
    label: "Access",
    title: "Use it without an account",
    description:
      "The public knowledgebase will remain freely accessible. Personal features will always be optional.",
  },
];

export default function Home() {
  const articles = getAllArticles().map(({ metadata }) => metadata);
  const journeys = getAllGuidedJourneys();

  return (
    <>
      <HomeHero journeys={journeys} articles={articles} />
      <StageRecommendations articles={articles} journeys={journeys} location="home" />

      <section className="border-y border-slate-200 bg-white" aria-labelledby="what-to-expect">
        <div className="page-shell py-16 sm:py-20">
          <p className="eyebrow">What to expect</p>
          <h2 id="what-to-expect" className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Useful information, presented with care.
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {principles.map((principle) => (
              <article key={principle.title} className="rounded-2xl border border-slate-200 bg-stone-50 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-teal-700">{principle.label}</p>
                <h3 className="mt-4 text-xl font-semibold tracking-tight text-slate-950">{principle.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{principle.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
