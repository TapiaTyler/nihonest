"use client";

import Link from "next/link";
import { useInterfaceMessages } from "@/components/localization/interface-text";
import type { ArticleGroup } from "@/domain/discovery/discovery";
import type { ContentLocalePreference } from "@/domain/localization/content-locale";
import { listRowClassName, listRowDetailsClassName, listRowFocusClassName } from "@/components/navigation/view-mode-items";

export function ArticleGroupCard({ group, returnTo, contentLanguage = "en", variant = "card" }: Readonly<{
  group: ArticleGroup;
  returnTo?: string;
  contentLanguage?: ContentLocalePreference;
  /** "row" is the compact list presentation. */
  variant?: "card" | "row";
}>) {
  const { message } = useInterfaceMessages();
  const articleLabel = message(group.articleIds.length === 1 ? "content.guide" : "content.guides");
  const href = returnTo ? { pathname: `/explore/${group.id}`, query: { returnTo } } : `/explore/${group.id}`;

  if (variant === "row") {
    return (
      <article className="min-w-0" lang={contentLanguage}>
        <Link href={href} aria-label={`${message("content.exploreGroup")} ${group.title}`} className={`${listRowClassName} ${listRowFocusClassName}`}>
          <div className="min-w-0">
            <h2 className="text-lg font-semibold tracking-tight text-slate-950 group-hover:text-teal-700">{group.title}</h2>
            <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-600 sm:line-clamp-1">{group.description}</p>
          </div>
          <div className={listRowDetailsClassName}>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{group.articleIds.length} {articleLabel}</span>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article className="h-full" lang={contentLanguage}>
      <Link
        href={href}
        aria-label={`${message("content.exploreGroup")} ${group.title}`}
        className="group flex h-full cursor-pointer flex-col rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md focus-visible:border-teal-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 focus-visible:shadow-md"
      >
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm font-semibold text-teal-700">{message("content.contentGroup")}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            {group.articleIds.length} {articleLabel}
          </span>
        </div>
        <h2 className="mt-8 text-2xl font-semibold tracking-tight text-slate-950 group-hover:text-teal-700">{group.title}</h2>
        <p className="mt-4 flex-1 leading-7 text-slate-600">{group.description}</p>
        <p aria-hidden="true" className="mt-7 select-none border-t border-slate-100 pt-5 text-sm font-semibold text-teal-800">{message("content.browseGroup")}</p>
      </Link>
    </article>
  );
}
