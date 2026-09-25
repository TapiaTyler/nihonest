import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleTerminology } from "@/components/content/article-terminology";
import { OfficialSourceList } from "@/components/content/official-source-list";
import { BackToExploreLink } from "@/components/navigation/back-to-explore-link";
import { SaveContentButton } from "@/components/saved-content/save-content-button";
import type { ArticleMetadata } from "@/domain/article/article";
import { ArticleHeaderBadges, ArticleHeaderStages } from "@/components/content/article-card-metadata";
import { localizeJourney } from "@/domain/localization/journey-presentation";
import type { InterfaceMessageId } from "@/domain/localization/interface-messages";
import { getSourceById } from "@/data/sources";
import { getAdministrativeGeography } from "@/data/geography";
import { getAllArticles, getArticleById, getArticleBySlug, getArticleGroupsByArticleIds, getGuidedJourneysByArticleIds } from "@/lib/content/articles";
import { getJourneySteps } from "@/lib/content/articles";
import { getGlossaryTermById } from "@/lib/content/glossary";
import { getJourneyRouteById, getJourneyRouteForArticle } from "@/domain/discovery/discovery";
import { articleJourneyHref, journeyHref } from "@/lib/navigation/journey-context";
import {
  ArticleTranslationNotice,
  LocalizedArticleBody,
  LocalizedArticleHeading,
} from "@/components/localization/localized-article";
import { getArticleGroupSearchTranslations, getJapaneseArticleTranslation, getJourneyTranslations } from "@/lib/content/translations";
import { ContinueExploringList } from "@/components/content/continue-exploring-list";
import { InterfaceFormat, InterfaceText, LocalizedText } from "@/components/localization/interface-text";
import { LocalGuidancePanel } from "@/components/local-guidance/local-guidance-panel";
import { getGeneralLocalAdvice } from "@/data/local-guidance/general-advice";
import { getLocalGuidanceForArticle, getSelectableLocalGuidanceLocations } from "@/lib/content/local-guidance";
import { AnnotatedDocumentViewer } from "@/components/documents/annotated-document-viewer";
import { getAnnotatedDocumentsForArticle } from "@/lib/content/annotated-documents";
import { LocalizedDocumentTitle } from "@/components/localization/localized-document-title";
import { formatInterfaceMessage } from "@/domain/localization/interface-messages";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllArticles().map(({ metadata }) => ({ slug: metadata.slug }));
}

export async function generateMetadata({ params }: PageProps<"/articles/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {};
  }

  return {
    title: `${article.metadata.title} | Nihonest`,
    description: article.metadata.description,
  };
}

const relationshipLabels = {
  related: "article.relationship.related",
  prerequisite: "article.relationship.prerequisite",
  "next-step": "article.relationship.next-step",
} as const satisfies Record<string, InterfaceMessageId>;

/** Current Japanese title of a guide, if one exists; LocalizedText falls back to the English title. */
function japaneseArticleTitle(id: string) {
  return getJapaneseArticleTranslation(id)?.fields.title;
}

export default async function ArticlePage({ params, searchParams }: PageProps<"/articles/[slug]">) {
  const { slug } = await params;
  const query = await searchParams;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const { Content, metadata } = article;
  const japaneseTranslation = getJapaneseArticleTranslation(metadata.id);
  const localGuidance = getLocalGuidanceForArticle(metadata.id);
  const requestedLocalId = typeof query.local === "string" ? query.local : undefined;
  const localGuidanceLocations = getSelectableLocalGuidanceLocations();
  const linkedLocalGuidanceId = localGuidanceLocations.find(({ geography }) => (
    getAdministrativeGeography(geography.id)?.id === getAdministrativeGeography(requestedLocalId ?? "")?.id
  ))?.geography.id;
  const annotatedDocuments = getAnnotatedDocumentsForArticle(metadata.id);
  const articleSources = metadata.sourceIds.flatMap((sourceId) => {
    const source = getSourceById(sourceId);
    return source ? [source] : [];
  });
  const relatedArticles = metadata.relationships.flatMap((relationship) => {
    const relatedArticle = getArticleById(relationship.articleId);
    return relatedArticle ? [{ relationship, article: relatedArticle.metadata }] : [];
  });
  const glossaryTerms = metadata.termIds.flatMap((termId) => {
    const term = getGlossaryTermById(termId);
    return term ? [term] : [];
  });
  const relatedGroups = getArticleGroupsByArticleIds([metadata.id]);
  const relatedJourneys = getGuidedJourneysByArticleIds([metadata.id]);
  const requestedJourneyId = typeof query.journey === "string" ? query.journey : undefined;
  const requestedRouteId = typeof query.route === "string" ? query.route : undefined;
  const contextualJourney = relatedJourneys.find(({ id }) => id === requestedJourneyId);
  const contextualRoute = contextualJourney ? getJourneyRouteById(contextualJourney, requestedRouteId) : undefined;
  const contextualSteps = contextualJourney ? getJourneySteps(contextualJourney.id, contextualRoute?.id) : [];
  const contextualIndex = contextualSteps.findIndex(({ article: contextualArticle }) => contextualArticle.metadata.id === metadata.id);
  const journeyContext = contextualJourney && contextualIndex >= 0 ? {
    journey: contextualJourney,
    route: contextualRoute,
    steps: contextualSteps,
    index: contextualIndex,
  } : undefined;
  const journeyTranslations = getJourneyTranslations();
  const japaneseJourney = (journey: (typeof relatedJourneys)[number]) =>
    localizeJourney(journey, journeyTranslations.find(({ contentId }) => contentId === journey.id));
  const japaneseContext = journeyContext ? japaneseJourney(journeyContext.journey) : undefined;
  const japaneseRoute = japaneseContext && journeyContext?.route ? japaneseContext.routes.find(({ id }) => id === journeyContext.route?.id) : undefined;
  const japaneseConditionLabels = new Map(japaneseContext?.phases.flatMap(({ steps }) => steps.flatMap((step) => step.type === "article" && step.conditionLabel ? [[step.articleId, step.conditionLabel] as const] : [])) ?? []);
  const groupTranslations = getArticleGroupSearchTranslations();
  const continueGuides = new Map<string, { article: ArticleMetadata; label: InterfaceMessageId }>(
    relatedArticles.map(({ relationship, article: relatedArticle }) => [
      relatedArticle.id,
      { article: relatedArticle, label: relationshipLabels[relationship.type] },
    ]),
  );

  return (
    <article className="page-shell py-12 sm:py-20">
      <LocalizedDocumentTitle japanese={japaneseTranslation?.fields.title ? formatInterfaceMessage("ja", "pageTitle.withSite", { title: japaneseTranslation.fields.title }) : undefined} />
      <div className="mx-auto max-w-3xl">
        {query.returnTo === "/roadmap" || query.returnTo === "/my-journey" ? (
          <Link href={query.returnTo} className="rounded-sm text-sm font-semibold text-teal-800 hover:text-teal-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700">
            <InterfaceText id={query.returnTo === "/roadmap" ? "back.roadmap" : "back.myJourney"} />
          </Link>
        ) : journeyContext ? (
          <Link href={journeyHref(journeyContext.journey.id, journeyContext.route?.id)} className="rounded-sm text-sm font-semibold text-teal-800 hover:text-teal-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700">
            <InterfaceFormat id="back.toTitle" values={{ title: journeyContext.journey.title }} japaneseValues={{ title: japaneseContext?.title }} />
          </Link>
        ) : <BackToExploreLink />}
        <ArticleTranslationNotice translation={japaneseTranslation} />
        <header className="relative mt-8 border-b border-slate-200 pb-8">
          <div className="absolute right-0 top-0"><SaveContentButton kind="article" contentId={metadata.id} /></div>
          <ArticleHeaderBadges status={metadata.status} topicIds={metadata.topicIds} />
          <LocalizedArticleHeading
            canonicalTitle={metadata.title}
            canonicalDescription={metadata.description}
            translation={japaneseTranslation}
          />
          <ArticleHeaderStages journeyStageIds={metadata.journeyStageIds} />
        </header>

        <div className="mt-8">
          <LocalizedArticleBody translation={japaneseTranslation}>
            <Content />
          </LocalizedArticleBody>
        </div>

        <AnnotatedDocumentViewer key={`documents-${linkedLocalGuidanceId ?? "saved"}`} families={annotatedDocuments} linkedLocationId={linkedLocalGuidanceId} />

        {(localGuidance.length > 0 || getGeneralLocalAdvice(metadata.id)) && <LocalGuidancePanel key={`local-guidance-${linkedLocalGuidanceId ?? "saved"}`} articleId={metadata.id} options={localGuidance} locations={localGuidanceLocations} linkedLocationId={linkedLocalGuidanceId} />}

        <div className="mt-12">
          <ArticleTerminology terms={glossaryTerms} />
        </div>

        {journeyContext && (
          <section className="mt-12 rounded-3xl border border-teal-200 bg-teal-50/60 p-5 sm:p-7" aria-labelledby="your-journey-heading">
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-700"><InterfaceText id="article.yourJourney" /></p>
            <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 id="your-journey-heading" className="text-2xl font-semibold tracking-tight text-slate-950"><LocalizedText english={journeyContext.journey.title} japanese={japaneseContext?.title} /></h2>
                {journeyContext.route && <p className="mt-2 font-medium text-teal-900"><InterfaceFormat id="roadmap.routeSuffix" values={{ route: journeyContext.route.title }} japaneseValues={{ route: japaneseRoute?.title }} /></p>}
              </div>
              <Link href={journeyHref(journeyContext.journey.id, journeyContext.route?.id)} className="inline-flex min-h-11 items-center rounded-full bg-teal-800 px-4 text-sm font-semibold text-white hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"><InterfaceText id="article.viewOutline" /></Link>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {journeyContext.steps[journeyContext.index - 1] ? (
                <Link href={articleJourneyHref(journeyContext.steps[journeyContext.index - 1].article.metadata.slug, journeyContext.journey.id, journeyContext.route?.id)} className="group rounded-2xl border border-teal-200 bg-white p-5 hover:border-teal-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500"><InterfaceText id="article.previous" /></span>
                  <span className="mt-2 block font-semibold text-slate-950 group-hover:text-teal-700">← <LocalizedText english={journeyContext.steps[journeyContext.index - 1].article.metadata.title} japanese={japaneseArticleTitle(journeyContext.steps[journeyContext.index - 1].article.metadata.id)} /></span>
                </Link>
              ) : <div className="rounded-2xl border border-dashed border-teal-200 p-5 text-sm text-slate-600"><InterfaceText id="article.firstGuide" /></div>}
              {journeyContext.steps[journeyContext.index + 1] ? (
                <Link href={articleJourneyHref(journeyContext.steps[journeyContext.index + 1].article.metadata.slug, journeyContext.journey.id, journeyContext.route?.id)} className="group rounded-2xl border border-teal-200 bg-white p-5 hover:border-teal-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500"><InterfaceText id="article.next" /></span>
                  <span className="mt-2 block font-semibold text-slate-950 group-hover:text-teal-700"><LocalizedText english={journeyContext.steps[journeyContext.index + 1].article.metadata.title} japanese={japaneseArticleTitle(journeyContext.steps[journeyContext.index + 1].article.metadata.id)} /> →</span>
                </Link>
              ) : <div className="rounded-2xl border border-dashed border-teal-200 p-5 text-sm text-slate-600"><InterfaceText id="article.finalGuide" /></div>}
            </div>
            <details className="mt-5 rounded-2xl border border-teal-200 bg-white p-5">
              <summary className="cursor-pointer font-semibold text-teal-900"><InterfaceText id="article.showContents" /></summary>
              <ol className="mt-4 space-y-3">
                {journeyContext.steps.map(({ article: outlineArticle, step }, index) => (
                  <li key={outlineArticle.metadata.id} className="flex gap-3 text-sm leading-6">
                    <span className="shrink-0 font-semibold text-teal-700">{index + 1}.</span>
                    {index === journeyContext.index ? (
                      <span aria-current="step" className="font-semibold text-slate-950"><LocalizedText english={outlineArticle.metadata.title} japanese={japaneseArticleTitle(outlineArticle.metadata.id)} /> <span className="text-teal-700"><InterfaceText id="article.current" /></span></span>
                    ) : (
                      <Link href={articleJourneyHref(outlineArticle.metadata.slug, journeyContext.journey.id, journeyContext.route?.id)} className="text-teal-800 underline decoration-teal-300 underline-offset-4 hover:text-teal-600"><LocalizedText english={outlineArticle.metadata.title} japanese={japaneseArticleTitle(outlineArticle.metadata.id)} />{step.requiredness === "conditional" && <> — <LocalizedText english={step.conditionLabel ?? ""} japanese={japaneseConditionLabels.get(outlineArticle.metadata.id)} /></>}</Link>
                    )}
                  </li>
                ))}
              </ol>
            </details>
          </section>
        )}

        {(relatedGroups.length > 0 || relatedJourneys.length > 0 || continueGuides.size > 0) && (
          <section className="mt-12 border-t border-slate-200 pt-8" aria-labelledby="related-heading">
            <h2 id="related-heading" className="text-2xl font-semibold tracking-tight text-slate-950">
              <InterfaceText id="content.continueExploring" />
            </h2>
            <p className="mt-3 leading-7 text-slate-600"><InterfaceText id="article.continueIntro" /></p>
            <ContinueExploringList
              key={metadata.id}
              cards={[
                ...relatedJourneys.map((journey) => (
                  <Link
                    key={`journey-${journey.id}`}
                    href={journeyHref(journey.id, journeyContext?.journey.id === journey.id ? journeyContext.route?.id : getJourneyRouteForArticle(journey, metadata.id)?.id)}
                    className="group rounded-2xl border border-slate-200 bg-white p-5 hover:border-teal-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
                  >
                    <span className="text-xs font-semibold uppercase tracking-wide text-teal-700"><InterfaceText id="journey.guidedJourney" /></span>
                    <span className="mt-2 block font-semibold text-slate-950 group-hover:text-teal-700"><LocalizedText english={journey.title} japanese={japaneseJourney(journey).title} /> →</span>
                  </Link>
                )),
                ...relatedGroups.map((group) => (
                  <Link
                    key={`group-${group.id}`}
                    href={`/explore/${group.id}`}
                    className="group rounded-2xl border border-slate-200 bg-white p-5 hover:border-teal-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
                  >
                    <span className="text-xs font-semibold uppercase tracking-wide text-teal-700"><InterfaceText id="content.contentGroup" /></span>
                    <span className="mt-2 block font-semibold text-slate-950 group-hover:text-teal-700"><LocalizedText english={group.title} japanese={groupTranslations.find(({ contentId }) => contentId === group.id)?.title} /> →</span>
                  </Link>
                )),
              ]}
              guides={[...continueGuides.values()].map(({ article: relatedArticle, label }) => (
                  <li key={relatedArticle.id}>
                    <span className="mr-2 text-sm font-semibold uppercase tracking-wide text-slate-500"><InterfaceText id={label} />:</span>
                    <Link href={`/articles/${relatedArticle.slug}`} className="font-medium text-teal-800 underline decoration-teal-300 underline-offset-4 hover:text-teal-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">
                      <LocalizedText english={relatedArticle.title} japanese={japaneseArticleTitle(relatedArticle.id)} />
                    </Link>
                  </li>
                ))}
            />
          </section>
        )}

        <OfficialSourceList sources={articleSources} />
      </div>
    </article>
  );
}
