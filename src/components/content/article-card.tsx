import Link from "next/link";
import { articleStatusLabels, type ArticleMetadata } from "@/domain/article/article";
import { journeyStages, topics } from "@/domain/taxonomy/taxonomy";

type ArticleCardProps = Readonly<{
  article: ArticleMetadata;
  returnTo?: string;
}>;

function labelsFor(ids: readonly string[], options: readonly { id: string; label: string }[]) {
  return ids.map((id) => options.find((option) => option.id === id)?.label ?? id);
}

export function ArticleCard({ article, returnTo }: ArticleCardProps) {
  const topicLabels = labelsFor(article.topicIds, topics);
  const stageLabels = labelsFor(article.journeyStageIds, journeyStages);

  return (
    <article className="h-full">
      <Link
        href={returnTo ? { pathname: `/articles/${article.slug}`, query: { returnTo } } : `/articles/${article.slug}`}
        aria-label={article.title}
        className="group flex h-full cursor-pointer flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md focus-visible:border-teal-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 focus-visible:shadow-md"
      >
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide">
          <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-800">
            {articleStatusLabels[article.status]}
          </span>
          <span className="text-teal-700">{topicLabels.join(" · ")}</span>
        </div>
        <h2 className="mt-5 text-2xl font-semibold tracking-tight text-slate-950 group-hover:text-teal-700">
          {article.title}
        </h2>
        <p className="mt-3 flex-1 leading-7 text-slate-600">{article.description}</p>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 text-sm">
          <p className="text-slate-500">Relevant to: {stageLabels.join(", ")}</p>
          <span aria-hidden="true" className="select-none font-semibold text-teal-800 transition-transform group-hover:translate-x-0.5">
            Read guide →
          </span>
        </div>
      </Link>
    </article>
  );
}
