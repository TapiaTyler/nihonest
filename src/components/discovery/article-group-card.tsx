import Link from "next/link";
import type { ArticleGroup } from "@/domain/discovery/discovery";

export function ArticleGroupCard({ group }: Readonly<{ group: ArticleGroup }>) {
  const articleLabel = group.articleIds.length === 1 ? "guide" : "guides";

  return (
    <article className="h-full">
      <Link
        href={`/explore/${group.id}`}
        aria-label={`Explore ${group.title}`}
        className="group flex h-full cursor-pointer flex-col rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md focus-visible:border-teal-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 focus-visible:shadow-md"
      >
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm font-semibold text-teal-700">Content group</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            {group.articleIds.length} {articleLabel}
          </span>
        </div>
        <h2 className="mt-8 text-2xl font-semibold tracking-tight text-slate-950 group-hover:text-teal-700">{group.title}</h2>
        <p className="mt-4 flex-1 leading-7 text-slate-600">{group.description}</p>
        <p aria-hidden="true" className="mt-7 select-none border-t border-slate-100 pt-5 text-sm font-semibold text-teal-800">Browse this group →</p>
      </Link>
    </article>
  );
}
