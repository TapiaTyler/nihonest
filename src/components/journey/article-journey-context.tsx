"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { InterfaceFormat, InterfaceText, LocalizedText } from "@/components/localization/interface-text";
import { BackToExploreLink } from "@/components/navigation/back-to-explore-link";
import { DisclosureChevron } from "@/components/navigation/disclosure-chevron";
import { resolveArticleJourneyContext, type ArticleJourneyData } from "@/lib/navigation/article-journey";
import { articleJourneyHref, journeyHref } from "@/lib/navigation/journey-context";
import { articleReturnDestination, singleQueryValue } from "@/lib/navigation/query-values";

/*
 * Query-dependent parts of the prebuilt article page. Each renders inside Suspense; the fallback is the page
 * without query context (Explore back link, no journey section, default journey links).
 */

function useArticleJourneyContext(data: ArticleJourneyData) {
  const query = useSearchParams();
  return resolveArticleJourneyContext(data, singleQueryValue(query, "journey"), singleQueryValue(query, "route"));
}

const backLinkClass = "inline-flex min-h-11 items-center rounded-sm text-sm font-semibold text-brand-link hover:text-brand-link-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus";

export function ArticleBackLink({ data }: Readonly<{ data: ArticleJourneyData }>) {
  const query = useSearchParams();
  const returnTo = articleReturnDestination(singleQueryValue(query, "returnTo"));
  const context = useArticleJourneyContext(data);
  if (returnTo) {
    return <Link href={returnTo} className={backLinkClass}><InterfaceText id={returnTo === "/roadmap" ? "back.roadmap" : "back.myJourney"} /></Link>;
  }
  if (context) {
    return (
      <Link href={journeyHref(context.journey.id, context.route?.id)} className={backLinkClass}>
        <InterfaceFormat id="back.toTitle" values={{ title: context.journey.title }} japaneseValues={{ title: context.journey.japaneseTitle }} />
      </Link>
    );
  }
  return <BackToExploreLink />;
}

export function ArticleJourneySection({ data }: Readonly<{ data: ArticleJourneyData }>) {
  const context = useArticleJourneyContext(data);
  if (!context) return null;
  const { journey, route, steps, index } = context;
  const article = (articleIndex: number) => data.articles[articleIndex];
  const previous = steps[index - 1];
  const next = steps[index + 1];

  return (
    <section className="mt-12" aria-labelledby="your-journey-heading">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-accent"><InterfaceText id="article.yourJourney" /></p>
      <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 id="your-journey-heading" className="text-2xl font-semibold tracking-tight text-slate-950"><LocalizedText english={journey.title} japanese={journey.japaneseTitle} /></h2>
          {route && <p className="mt-2 font-medium text-brand-deep-soft"><InterfaceFormat id="roadmap.routeSuffix" values={{ route: route.title }} japaneseValues={{ route: route.japaneseTitle }} /></p>}
        </div>
        <Link href={journeyHref(journey.id, route?.id)} className="inline-flex min-h-11 items-center rounded-full bg-brand px-4 text-sm font-semibold text-white hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"><InterfaceText id="article.viewOutline" /></Link>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {previous !== undefined ? (
          <Link href={articleJourneyHref(article(previous).slug, journey.id, route?.id)} className="group rounded-2xl border border-brand-line bg-white p-5 hover:border-brand-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500"><InterfaceText id="article.previous" /></span>
            <span className="mt-2 block font-semibold text-slate-950 group-hover:text-brand-accent">← <LocalizedText english={article(previous).title} japanese={article(previous).japaneseTitle} /></span>
          </Link>
        ) : <div className="rounded-2xl border border-dashed border-brand-line p-5 text-sm text-slate-600"><InterfaceText id="article.firstGuide" /></div>}
        {next !== undefined ? (
          <Link href={articleJourneyHref(article(next).slug, journey.id, route?.id)} className="group rounded-2xl border border-brand-line bg-white p-5 hover:border-brand-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500"><InterfaceText id="article.next" /></span>
            <span className="mt-2 block font-semibold text-slate-950 group-hover:text-brand-accent"><LocalizedText english={article(next).title} japanese={article(next).japaneseTitle} /></span>
          </Link>
        ) : <div className="rounded-2xl border border-dashed border-brand-line p-5 text-sm text-slate-600"><InterfaceText id="article.finalGuide" /></div>}
      </div>
      <details className="group mt-5 rounded-2xl border border-brand-line bg-white p-5">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-brand-deep-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus [&::-webkit-details-marker]:hidden"><span><InterfaceText id="article.showContents" /></span><DisclosureChevron /></summary>
        <ol className="mt-4 space-y-3">
          {steps.map((articleIndex, stepIndex) => {
            const outlineArticle = article(articleIndex);
            const condition = journey.conditions[articleIndex];
            return (
              <li key={articleIndex} className="flex gap-3 text-sm leading-6">
                <span className="shrink-0 font-semibold text-brand-accent">{stepIndex + 1}.</span>
                {stepIndex === index ? (
                  <span aria-current="step" className="font-semibold text-slate-950"><LocalizedText english={outlineArticle.title} japanese={outlineArticle.japaneseTitle} /> <span className="text-brand-accent"><InterfaceText id="article.current" /></span></span>
                ) : (
                  <Link href={articleJourneyHref(outlineArticle.slug, journey.id, route?.id)} className="text-brand-link underline decoration-brand-300 underline-offset-4 hover:text-brand-link-hover"><LocalizedText english={outlineArticle.title} japanese={outlineArticle.japaneseTitle} />{condition && <> — <LocalizedText english={condition.english} japanese={condition.japanese} /></>}</Link>
                )}
              </li>
            );
          })}
        </ol>
      </details>
    </section>
  );
}

/** A related-journey card keeps the route from the current journey context, otherwise the article's own route. */
export function RelatedJourneyLink({ data, journeyId, defaultRouteId, className, children }: Readonly<{
  data: ArticleJourneyData;
  journeyId: string;
  defaultRouteId?: string;
  className: string;
  children: ReactNode;
}>) {
  const context = useArticleJourneyContext(data);
  const routeId = context?.journey.id === journeyId ? context.route?.id : defaultRouteId;
  return <Link href={journeyHref(journeyId, routeId)} className={className}>{children}</Link>;
}
