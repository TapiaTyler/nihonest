import type { Metadata } from "next";
import Link from "next/link";
import { InterfaceFormat, InterfaceText } from "@/components/localization/interface-text";
import { notFound } from "next/navigation";
import { LocalizedArticleCard } from "@/components/localization/localized-article-card";
import { LocalizedArticleGroupHeading } from "@/components/localization/localized-article-group";
import { BackToExploreLink } from "@/components/navigation/back-to-explore-link";
import { getAllArticleGroups, getArticleGroupById, getArticlesByGroup, getJourneysByGroup } from "@/lib/content/article-metadata";
import { getArticleGroupSearchTranslations, getArticleSearchTranslations, getJourneyTranslations } from "@/lib/content/translations";
import { LocalizedDocumentTitle } from "@/components/localization/localized-document-title";
import { formatInterfaceMessage } from "@/domain/localization/interface-messages";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllArticleGroups().map(({ id }) => ({ groupId: id }));
}

export async function generateMetadata({ params }: PageProps<"/explore/[groupId]">): Promise<Metadata> {
  const { groupId } = await params;
  const group = getArticleGroupById(groupId);
  return group ? { title: `${group.title} | Nihonest`, description: group.description } : {};
}

export default async function ArticleGroupPage({ params }: PageProps<"/explore/[groupId]">) {
  const { groupId } = await params;
  const group = getArticleGroupById(groupId);
  if (!group) notFound();
  const articles = getArticlesByGroup(group.id);
  const journeys = getJourneysByGroup(group.id);
  const journeyTitles = new Map(getJourneyTranslations().map(({ contentId, title }) => [contentId, title]));
  const articleTranslations = getArticleSearchTranslations().filter(({ contentId }) => articles.some(({ metadata }) => metadata.id === contentId));
  const groupTitle = getArticleGroupSearchTranslations().find(({ contentId }) => contentId === group.id)?.title;

  return (
    <div className="page-shell py-12 sm:py-20">
      <LocalizedDocumentTitle japanese={groupTitle ? formatInterfaceMessage("ja", "pageTitle.withSite", { title: groupTitle }) : undefined} />
      <BackToExploreLink />
      <LocalizedArticleGroupHeading group={group} guideCount={articles.length} translations={getArticleGroupSearchTranslations()} />

      {journeys.length > 0 && (
        <section className="mt-10 rounded-2xl border border-teal-200 bg-teal-50 p-6" aria-labelledby="guided-journeys-heading">
          <h2 id="guided-journeys-heading" className="text-lg font-semibold text-teal-950"><InterfaceText id="group.orderedHeading" /></h2>
          <p className="mt-1 leading-7 text-teal-900/80"><InterfaceText id="group.orderedBody" /></p>
          <div className="mt-5 flex flex-wrap gap-3">
            {journeys.map((journey) => (
              <Link key={journey.id} href={`/explore/journeys/${journey.id}`} className="inline-flex min-h-11 items-center justify-center rounded-full bg-teal-800 px-5 text-sm font-semibold text-white hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">
                <InterfaceFormat id="group.openJourney" values={{ journey: journey.title.toLowerCase() }} japaneseValues={{ journey: journeyTitles.get(journey.id) }} />
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-10" aria-labelledby="group-guides-heading">
        <h2 id="group-guides-heading" className="sr-only"><InterfaceFormat id="group.guidesIn" values={{ group: group.title }} japaneseValues={{ group: groupTitle }} /></h2>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {articles.map((article) => <LocalizedArticleCard key={article.metadata.id} article={article.metadata} translations={articleTranslations} />)}
        </div>
      </section>
    </div>
  );
}
