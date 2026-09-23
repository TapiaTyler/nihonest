import { HomeHero } from "@/components/personalization/home-hero";
import { StageRecommendations } from "@/components/personalization/stage-recommendations";
import { InterfaceText } from "@/components/localization/interface-text";
import { getAllArticles, getAllGuidedJourneys } from "@/lib/content/articles";

const principles = [
  {
    label: "home.principleClarity",
    title: "home.principleClarityTitle",
    description: "home.principleClarityDescription",
  },
  {
    label: "home.principleSources",
    title: "home.principleSourcesTitle",
    description: "home.principleSourcesDescription",
  },
  {
    label: "home.principleAccess",
    title: "home.principleAccessTitle",
    description: "home.principleAccessDescription",
  },
] as const;

export default function Home() {
  const articles = getAllArticles().map(({ metadata }) => metadata);
  const journeys = getAllGuidedJourneys();

  return (
    <>
      <HomeHero journeys={journeys} articles={articles} />
      <StageRecommendations articles={articles} journeys={journeys} location="home" />

      <section className="border-y border-slate-200 bg-white" aria-labelledby="what-to-expect">
        <div className="page-shell py-16 sm:py-20">
          <p className="eyebrow"><InterfaceText id="home.expectEyebrow" /></p>
          <h2 id="what-to-expect" className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            <InterfaceText id="home.expectTitle" />
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {principles.map(({ label, title, description }) => (
              <article key={title} className="rounded-2xl border border-slate-200 bg-stone-50 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-teal-700"><InterfaceText id={label} /></p>
                <h3 className="mt-4 text-xl font-semibold tracking-tight text-slate-950"><InterfaceText id={title} /></h3>
                <p className="mt-3 leading-7 text-slate-600"><InterfaceText id={description} /></p>
              </article>
            ))}
          </div>
          <p className="mt-8 max-w-3xl text-sm leading-6 text-slate-500">
            <strong className="font-semibold text-slate-700"><InterfaceText id="home.legalDisclaimerTitle" /></strong>{" "}
            <InterfaceText id="home.legalDisclaimerBody" />
          </p>
        </div>
      </section>
    </>
  );
}
