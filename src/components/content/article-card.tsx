import Link, { type LinkProps } from "next/link";
import type { ReactNode } from "react";
import { articleStatusLabels, type ArticleMetadata } from "@/domain/article/article";
import { journeyStages, topics } from "@/domain/taxonomy/taxonomy";

type ArticleCardProps = Readonly<{
  article: ArticleMetadata;
  returnTo?: string;
  href?: LinkProps["href"];
  notice?: string;
  headerAction?: ReactNode;
}>;

function labelsFor(ids: readonly string[], options: readonly { id: string; label: string }[]) {
  return ids.map((id) => options.find((option) => option.id === id)?.label ?? id);
}

export function ArticleCard({ article, returnTo, href, notice, headerAction }: ArticleCardProps) {
  const topicLabels = labelsFor(article.topicIds, topics);
  const stageLabels = labelsFor(article.journeyStageIds, journeyStages);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md">
      {notice && (
        <p className="border-b border-teal-200 bg-teal-50 px-6 py-3 text-sm font-semibold leading-6 text-teal-950">
          {notice}
        </p>
      )}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide">
            <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-800">
              {articleStatusLabels[article.status]}
            </span>
            <span className="text-teal-700">{topicLabels.join(" · ")}</span>
          </div>
          {headerAction && <div className="relative z-10 shrink-0">{headerAction}</div>}
        </div>
        <h2 className="mt-5 text-2xl font-semibold tracking-tight text-slate-950 group-hover:text-teal-700">
          <Link
            href={href ?? (returnTo ? { pathname: `/articles/${article.slug}`, query: { returnTo } } : `/articles/${article.slug}`)}
            aria-label={article.title}
            className="rounded-2xl before:absolute before:inset-0 before:rounded-2xl focus-visible:outline-none focus-visible:before:outline-2 focus-visible:before:outline-offset-2 focus-visible:before:outline-teal-700"
          >
            {article.title}
          </Link>
        </h2>
        <p className="mt-3 flex-1 leading-7 text-slate-600">{article.description}</p>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 text-sm">
          <p className="text-slate-500">Relevant to: {stageLabels.join(", ")}</p>
          <span aria-hidden="true" className="select-none font-semibold text-teal-800 transition-transform group-hover:translate-x-0.5">
            Read guide →
          </span>
        </div>
      </div>
    </article>
  );
}
