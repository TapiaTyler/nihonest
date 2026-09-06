import Link from "next/link";
import type { ArticleMetadata } from "@/domain/article/article";
import { journeyStages, topics } from "@/domain/taxonomy/taxonomy";

type ArticleCardProps = Readonly<{
  article: ArticleMetadata;
}>;

function labelsFor(ids: readonly string[], options: readonly { id: string; label: string }[]) {
  return ids.map((id) => options.find((option) => option.id === id)?.label ?? id);
}

export function ArticleCard({ article }: ArticleCardProps) {
  const topicLabels = labelsFor(article.topicIds, topics);
  const stageLabels = labelsFor(article.journeyStageIds, journeyStages);

  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide">
        <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-800">
          {article.status === "verified" ? "Reviewed" : "Editorial review"}
        </span>
        <span className="text-teal-700">{topicLabels.join(" · ")}</span>
      </div>
      <h2 className="mt-5 text-2xl font-semibold tracking-tight text-slate-950">
        <Link
          href={`/articles/${article.slug}`}
          className="rounded-sm hover:text-teal-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700"
        >
          {article.title}
        </Link>
      </h2>
      <p className="mt-3 flex-1 leading-7 text-slate-600">{article.description}</p>
      <p className="mt-6 border-t border-slate-100 pt-4 text-sm text-slate-500">
        Relevant to: {stageLabels.join(", ")}
      </p>
    </article>
  );
}
