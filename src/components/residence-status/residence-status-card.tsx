import Link from "next/link";
import type { ResidenceStatus } from "@/domain/residence-status/residence-status";

type ResidenceStatusCardProps = Readonly<{
  residenceStatus: ResidenceStatus;
}>;

export function ResidenceStatusCard({ residenceStatus }: ResidenceStatusCardProps) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-800">
          Draft sample
        </span>
        <span lang="ja" className="text-lg font-medium text-slate-500">
          {residenceStatus.japaneseName}
        </span>
      </div>
      <h2 className="mt-5 text-2xl font-semibold tracking-tight text-slate-950">
        <Link
          href={`/residence-statuses/${residenceStatus.slug}`}
          className="rounded-sm hover:text-teal-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700"
        >
          {residenceStatus.englishName}
        </Link>
      </h2>
      <p className="mt-4 flex-1 leading-7 text-slate-600">{residenceStatus.summary}</p>
      <p className="mt-6 border-t border-slate-100 pt-4 text-sm capitalize text-slate-500">
        Category: {residenceStatus.category}
      </p>
    </article>
  );
}
