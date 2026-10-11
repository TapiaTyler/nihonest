import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArticleTerminology } from "@/components/content/article-terminology";
import { OfficialSourceList } from "@/components/content/official-source-list";
import { BackToExploreLink } from "@/components/navigation/back-to-explore-link";
import { SaveContentButton } from "@/components/saved-content/save-content-button";
import type { ArticleMetadata } from "@/domain/article/article";
import { ArticleHeaderBadges, ArticleHeaderStages } from "@/components/content/article-card-metadata";
import { localizeJourney } from "@/domain/localization/journey-presentation";
import type { InterfaceMessageId } from "@/domain/localization/interface-messages";
import { getSourceById } from "@/data/sources";
import { getAllArticles, getArticleById, getArticleBySlug, getArticleGroupsByArticleIds, getGuidedJourneysByArticleIds } from "@/lib/content/article-metadata";
// Only the article body needs the MDX registry; every other lookup uses the plain metadata catalog.
import { getArticleBySlug as getRenderableArticleBySlug } from "@/lib/content/articles";
import { getArticleJourneyData } from "@/lib/content/article-journey-data";
import { getGlossaryTermById } from "@/lib/content/glossary";
import { getJourneyRouteForArticle } from "@/domain/discovery/discovery";
import { journeyHref } from "@/lib/navigation/journey-context";
import { ArticleBackLink, ArticleJourneySection, RelatedJourneyLink } from "@/components/journey/article-journey-context";
import {
  ArticleTranslationNotice,
  LocalizedArticleBody,
  LocalizedArticleHeading,
} from "@/components/localization/localized-article";
import { getArticleGroupSearchTranslations, getJapaneseArticleTranslation, getJourneyTranslations, getLocalizedGlossaryText } from "@/lib/content/translations";
import { ContinueExploringList } from "@/components/content/continue-exploring-list";
import { InterfaceText, LocalizedText } from "@/components/localization/interface-text";
import { LinkedAnnotatedDocumentViewer, LinkedLocalGuidancePanel } from "@/components/local-guidance/linked-location";
import { getGeneralLocalAdvice } from "@/data/local-guidance/general-advice";
import { getLocalGuidanceForArticle, getLocalLocationAliases, getSelectableLocalGuidanceLocations } from "@/lib/content/local-guidance";
import { getJapaneseGeneralLocalAdvice, getJapaneseLocalGuidanceFields } from "@/lib/content/local-guidance-translations";
import { renderJapaneseArticleComponents } from "@/components/content/japanese-article-components";
import { getAnnotatedDocumentsForArticle } from "@/lib/content/annotated-documents";
import { LocalizedDocumentTitle } from "@/components/localization/localized-document-title";
import { ArticleOutline } from "@/components/localization/article-outline";
import { getEnglishArticleOutline } from "@/lib/content/article-outline";
import { articleOutline } from "@/domain/article/article-outline";
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

export default async function ArticlePage({ params }: PageProps<"/articles/[slug]">) {
  const { slug } = await params;
  const article = getRenderableArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const { Content, metadata } = article;
  const japaneseTranslation = getJapaneseArticleTranslation(metadata.id);
  const localGuidance = getLocalGuidanceForArticle(metadata.id);
  const localGuidanceLocations = getSelectableLocalGuidanceLocations();
  // The page is prebuilt; client boundaries apply `?local=`, `?journey=&route=`, and `?returnTo=` after hydration.
  const locationAliases = getLocalLocationAliases(localGuidanceLocations);
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
  const journeyTranslations = getJourneyTranslations();
  const japaneseJourney = (journey: (typeof relatedJourneys)[number]) =>
    localizeJourney(journey, journeyTranslations.find(({ contentId }) => contentId === journey.id));
  const journeyData = getArticleJourneyData(metadata.id);
  const localGuidancePanelProps = {
    articleId: metadata.id,
    options: localGuidance,
    japaneseFields: getJapaneseLocalGuidanceFields(localGuidance.map(({ supplement }) => supplement)),
    japaneseGeneralAdvice: getJapaneseGeneralLocalAdvice(metadata.id),
    locations: localGuidanceLocations,
  };
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
      <div className="relative mx-auto max-w-3xl">
        <Suspense fallback={<BackToExploreLink />}>
          <ArticleBackLink data={journeyData} />
        </Suspense>
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

        <ArticleOutline
          english={getEnglishArticleOutline(metadata.slug)}
          japanese={typeof japaneseTranslation?.fields.body === "string" ? articleOutline(japaneseTranslation.fields.body) : undefined}
        />

        <div className="mt-8">
          <LocalizedArticleBody translation={japaneseTranslation} components={typeof japaneseTranslation?.fields.body === "string" ? renderJapaneseArticleComponents(japaneseTranslation.fields.body) : undefined}>
            <Content />
          </LocalizedArticleBody>
        </div>

        {annotatedDocuments.length > 0 && (
          <LinkedAnnotatedDocumentViewer families={annotatedDocuments} locationAliases={locationAliases} />
        )}

        {(localGuidance.length > 0 || getGeneralLocalAdvice(metadata.id)) && (
          <LinkedLocalGuidancePanel {...localGuidancePanelProps} locationAliases={locationAliases} />
        )}

        <div className="mt-12">
          <ArticleTerminology terms={glossaryTerms} localized={Object.fromEntries(glossaryTerms.map((term) => [term.id, getLocalizedGlossaryText(term.id)]))} />
        </div>

        <Suspense fallback={null}>
          <ArticleJourneySection data={journeyData} />
        </Suspense>

        {(relatedGroups.length > 0 || relatedJourneys.length > 0 || continueGuides.size > 0) && (
          <section className="mt-12 border-t border-slate-200 pt-8" aria-labelledby="related-heading">
            <h2 id="related-heading" className="text-2xl font-semibold tracking-tight text-slate-950">
              <InterfaceText id="content.continueExploring" />
            </h2>
            <p className="mt-3 leading-7 text-slate-600"><InterfaceText id="article.continueIntro" /></p>
            <ContinueExploringList
              key={metadata.id}
              cards={[
                ...relatedJourneys.map((journey) => {
                  const className = "group rounded-2xl border border-slate-200 bg-white p-5 hover:border-teal-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700";
                  const defaultRouteId = getJourneyRouteForArticle(journey, metadata.id)?.id;
                  const content = (
                    <>
                      <span className="text-xs font-semibold uppercase tracking-wide text-teal-700"><InterfaceText id="journey.guidedJourney" /></span>
                      <span className="mt-2 block font-semibold text-slate-950 group-hover:text-teal-700"><LocalizedText english={journey.title} japanese={japaneseJourney(journey).title} /></span>
                    </>
                  );
                  return (
                    <Suspense key={`journey-${journey.id}`} fallback={<Link href={journeyHref(journey.id, defaultRouteId)} className={className}>{content}</Link>}>
                      <RelatedJourneyLink data={journeyData} journeyId={journey.id} defaultRouteId={defaultRouteId} className={className}>{content}</RelatedJourneyLink>
                    </Suspense>
                  );
                }),
                ...relatedGroups.map((group) => (
                  <Link
                    key={`group-${group.id}`}
                    href={`/explore/${group.id}`}
                    className="group rounded-2xl border border-slate-200 bg-white p-5 hover:border-teal-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
                  >
                    <span className="text-xs font-semibold uppercase tracking-wide text-teal-700"><InterfaceText id="content.contentGroup" /></span>
                    <span className="mt-2 block font-semibold text-slate-950 group-hover:text-teal-700"><LocalizedText english={group.title} japanese={groupTranslations.find(({ contentId }) => contentId === group.id)?.title} /></span>
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
