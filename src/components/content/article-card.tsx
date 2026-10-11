import Link, { type LinkProps } from "next/link";
import type { ReactNode } from "react";
import type { ArticleMetadata } from "@/domain/article/article";
import { InterfaceText } from "@/components/localization/interface-text";
import { ArticleCardBadges, ArticleCardRelevance } from "@/components/content/article-card-metadata";
import { listRowClassName, listRowDetailsClassName } from "@/components/navigation/view-mode-items";

type ArticleCardProps = Readonly<{
  article: ArticleMetadata;
  returnTo?: string;
  href?: LinkProps["href"];
  notice?: string;
  headerAction?: ReactNode;
  contentLanguage?: string;
  /** "row" is the compact list presentation. */
  variant?: "card" | "row";
}>;

export function ArticleCard({ article, returnTo, href, notice, headerAction, contentLanguage, variant = "card" }: ArticleCardProps) {
  const target = href ?? (returnTo ? { pathname: `/articles/${article.slug}`, query: { returnTo } } : `/articles/${article.slug}`);
  if (variant === "row") {
    // The title link stretches over the row, so an optional header action stays independently clickable.
    return (
      <article className={listRowClassName}>
        <div className="min-w-0 flex-1">
          <h2 lang={contentLanguage} className="text-lg font-semibold tracking-tight text-slate-950 group-hover/item:text-brand-accent">
            <Link href={target} aria-label={article.title} className="before:absolute before:inset-0 focus-visible:outline-none focus-visible:before:outline-2 focus-visible:before:outline-offset-[-2px] focus-visible:before:outline-focus">
              {article.title}
            </Link>
          </h2>
          <p lang={contentLanguage} className="mt-1 line-clamp-2 text-sm leading-6 text-slate-600 sm:line-clamp-1">{article.description}</p>
          {notice && <p className="mt-1 text-xs font-semibold leading-5 text-brand-deep-soft">{notice}</p>}
        </div>
        <div className={listRowDetailsClassName}>
          <ArticleCardBadges status={article.status} topicIds={article.topicIds} stacked />
          {headerAction && <div className="relative z-10 shrink-0">{headerAction}</div>}
        </div>
      </article>
    );
  }
  return (
    <article className="group/item relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md">
      {notice && (
        <p className="border-b border-brand-line bg-brand-soft px-6 py-3 text-sm font-semibold leading-6 text-brand-deep">
          {notice}
        </p>
      )}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <ArticleCardBadges status={article.status} topicIds={article.topicIds} />
          {headerAction && <div className="relative z-10 shrink-0">{headerAction}</div>}
        </div>
        <h2 lang={contentLanguage} className="mt-5 text-2xl font-semibold tracking-tight text-slate-950 group-hover/item:text-brand-accent">
          <Link
            href={target}
            aria-label={article.title}
            className="rounded-2xl before:absolute before:inset-0 before:rounded-2xl focus-visible:outline-none focus-visible:before:outline-2 focus-visible:before:outline-offset-2 focus-visible:before:outline-focus"
          >
            {article.title}
          </Link>
        </h2>
        <p lang={contentLanguage} className="mt-3 flex-1 leading-7 text-slate-600">{article.description}</p>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 text-sm">
          <ArticleCardRelevance journeyStageIds={article.journeyStageIds} />
          <span aria-hidden="true" className="select-none font-semibold text-brand-link transition-transform group-hover/item:translate-x-0.5">
            <InterfaceText id="content.readGuide" />
          </span>
        </div>
      </div>
    </article>
  );
}
