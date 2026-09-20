import { ArticleGroupCard } from "@/components/discovery/article-group-card";
import type { ArticleGroup } from "@/domain/discovery/discovery";

export function ExploreGroupBrowser({ groups }: Readonly<{ groups: readonly ArticleGroup[] }>) {
  const sortedGroups = [...groups].sort((left, right) => left.title.localeCompare(right.title, "en", { sensitivity: "base" }));

  return (
    <section className="mt-14" aria-labelledby="content-groups-heading">
      <p className="eyebrow">Browse by group</p>
      <h2 id="content-groups-heading" className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Choose a place to begin</h2>
      <p className="mt-4 max-w-3xl leading-7 text-slate-600">Open a group to see its guides. Search above can take you directly to any individual article or glossary term.</p>
      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {sortedGroups.map((group) => <ArticleGroupCard key={group.id} group={group} />)}
      </div>
    </section>
  );
}
