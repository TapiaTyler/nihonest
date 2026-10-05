import Link from "next/link";
import type { ResidenceStatus } from "@/domain/residence-status/residence-status";
import { residenceStatusCategoryLabels } from "@/domain/residence-status/residence-status";
import { JapaneseReading } from "@/components/localization/japanese-reading";
import { InterfaceText } from "@/components/localization/interface-text";
import { LocalizedStatusBadge } from "@/components/localization/localized-residence-status-chrome";
import type { ResidenceStatusTranslation } from "@/lib/content/translations";
import { listRowClassName, listRowDetailsClassName, listRowFocusClassName } from "@/components/navigation/view-mode-items";

type ResidenceStatusCardProps = Readonly<{
  residenceStatus: ResidenceStatus;
  returnTo?: string;
  translation?: ResidenceStatusTranslation;
  categoryLabel?: string;
  /** "row" is the compact list presentation; `showCategory` is off when rows are already grouped by category. */
  variant?: "card" | "row";
  showCategory?: boolean;
  /** Japanese readers see the Japanese name first in list rows. */
  locale?: "en" | "ja";
}>;

export function ResidenceStatusCard({ residenceStatus, returnTo, translation, categoryLabel, variant = "card", showCategory = true, locale = "en" }: ResidenceStatusCardProps) {
  const href = returnTo
    ? { pathname: `/residence-statuses/${residenceStatus.slug}`, query: { returnTo } }
    : `/residence-statuses/${residenceStatus.slug}`;
  if (variant === "row") {
    return (
      <article className="min-w-0">
        <Link href={href} aria-label={residenceStatus.englishName} className={`${listRowClassName} ${listRowFocusClassName}`}>
          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              {locale === "ja" ? (
                <>
                  <h2 lang="ja" className="text-lg font-semibold tracking-tight text-slate-950 group-hover:text-teal-700">{residenceStatus.japaneseName}</h2>
                  <span lang="en" className="text-sm text-slate-500">{residenceStatus.englishName}</span>
                </>
              ) : (
                <>
                  <h2 className="text-lg font-semibold tracking-tight text-slate-950 group-hover:text-teal-700">{residenceStatus.englishName}</h2>
                  <span lang="ja" className="text-sm text-slate-500">{residenceStatus.japaneseName}</span>
                </>
              )}
            </div>
            <p lang={translation ? "ja" : "en"} className="mt-1 line-clamp-2 text-sm leading-6 text-slate-600 sm:line-clamp-1">{translation?.summary ?? residenceStatus.summary}</p>
          </div>
          <div className={listRowDetailsClassName}>
            <LocalizedStatusBadge status={residenceStatus.status} />
            {showCategory && <span className="text-slate-500">{categoryLabel ?? residenceStatusCategoryLabels[residenceStatus.category]}</span>}
          </div>
        </Link>
      </article>
    );
  }
  return (
    <article className="h-full min-w-0">
      <Link
        href={href}
        aria-label={residenceStatus.englishName}
        className="group flex h-full min-w-0 cursor-pointer flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md focus-visible:border-teal-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 focus-visible:shadow-md"
      >
        <div className="flex items-start justify-between gap-4">
          <LocalizedStatusBadge status={residenceStatus.status} />
          <span className="min-w-0 text-right text-slate-500">
            <span lang="ja" className="block break-words text-lg font-medium">{residenceStatus.japaneseName}</span>
            <span className="mt-1 block break-words text-xs">
              <JapaneseReading kana={residenceStatus.japaneseKana} romaji={residenceStatus.romaji} />
            </span>
          </span>
        </div>
        <h2 className="mt-5 text-2xl font-semibold tracking-tight text-slate-950 group-hover:text-teal-700">
          {residenceStatus.englishName}
        </h2>
        <p lang={translation ? "ja" : "en"} className="mt-4 flex-1 leading-7 text-slate-600">{translation?.summary ?? residenceStatus.summary}</p>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 text-sm">
          <p className="text-slate-500"><InterfaceText id="status.category" /> {categoryLabel ?? residenceStatusCategoryLabels[residenceStatus.category]}</p>
          <span aria-hidden="true" className="select-none font-semibold text-teal-800 transition-transform group-hover:translate-x-0.5">
            <InterfaceText id="content.viewStatus" />
          </span>
        </div>
      </Link>
    </article>
  );
}
