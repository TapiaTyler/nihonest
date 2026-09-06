import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/content/article-card";
import { BackToExploreLink } from "@/components/navigation/back-to-explore-link";
import { getAllArticleGroups, getArticleGroupById, getArticlesByGroup, getJourneysByGroup } from "@/lib/content/articles";

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

  return (
    <div className="page-shell py-12 sm:py-20">
      <BackToExploreLink />
      <header className="mt-8 max-w-3xl">
        <p className="eyebrow">Content group</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">{group.title}</h1>
        <p className="mt-6 text-lg leading-8 text-slate-600">{group.description}</p>
        <p className="mt-4 text-sm font-medium text-slate-500">{articles.length} {articles.length === 1 ? "guide" : "guides"}</p>
      </header>

      {journeys.length > 0 && (
        <section className="mt-10 rounded-2xl border border-teal-200 bg-teal-50 p-6" aria-labelledby="guided-journeys-heading">
          <h2 id="guided-journeys-heading" className="text-lg font-semibold text-teal-950">Prefer an ordered path?</h2>
          <p className="mt-1 leading-7 text-teal-900/80">Choose a journey to combine route-specific guidance with shared arrival steps.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            {journeys.map((journey) => (
              <Link key={journey.id} href={`/explore/journeys/${journey.id}`} className="inline-flex min-h-11 items-center justify-center rounded-full bg-teal-800 px-5 text-sm font-semibold text-white hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">
                Open {journey.title.toLowerCase()}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-10" aria-labelledby="group-guides-heading">
        <h2 id="group-guides-heading" className="sr-only">Guides in {group.title}</h2>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {articles.map((article) => <ArticleCard key={article.metadata.id} article={article.metadata} />)}
        </div>
      </section>
    </div>
  );
}
