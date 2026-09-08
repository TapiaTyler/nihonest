import Link from "next/link";
import type { ResidenceStatus } from "@/domain/residence-status/residence-status";
import { residenceStatusCategoryLabels } from "@/domain/residence-status/residence-status";

type ResidenceStatusCardProps = Readonly<{
  residenceStatus: ResidenceStatus;
  returnTo?: string;
}>;

export function ResidenceStatusCard({ residenceStatus, returnTo }: ResidenceStatusCardProps) {
  return (
    <article className="h-full min-w-0">
      <Link
        href={returnTo
          ? { pathname: `/residence-statuses/${residenceStatus.slug}`, query: { returnTo } }
          : `/residence-statuses/${residenceStatus.slug}`}
        aria-label={residenceStatus.englishName}
        className="group flex h-full min-w-0 cursor-pointer flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md focus-visible:border-teal-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 focus-visible:shadow-md"
      >
        <div className="flex items-start justify-between gap-4">
          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-800">
            Draft
          </span>
          <span className="min-w-0 text-right text-slate-500">
            <span lang="ja" className="block break-words text-lg font-medium">{residenceStatus.japaneseName}</span>
            <span className="mt-1 block break-words text-xs">
              <span lang="ja">{residenceStatus.japaneseKana}</span> · {residenceStatus.romaji}
            </span>
          </span>
        </div>
        <h2 className="mt-5 text-2xl font-semibold tracking-tight text-slate-950 group-hover:text-teal-700">
          {residenceStatus.englishName}
        </h2>
        <p className="mt-4 flex-1 leading-7 text-slate-600">{residenceStatus.summary}</p>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 text-sm">
          <p className="text-slate-500">Category: {residenceStatusCategoryLabels[residenceStatus.category]}</p>
          <span aria-hidden="true" className="select-none font-semibold text-teal-800 transition-transform group-hover:translate-x-0.5">
            View status and related guidance →
          </span>
        </div>
      </Link>
    </article>
  );
}
