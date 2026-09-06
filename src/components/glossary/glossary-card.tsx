import Link from "next/link";
import type { JapaneseTerm } from "@/domain/glossary/glossary";

export function GlossaryCard({ term }: Readonly<{ term: JapaneseTerm }>) {
  return (
    <article className="h-full">
      <Link
        href={`/glossary/${term.slug}`}
        aria-label={term.englishName}
        className="group flex h-full cursor-pointer flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md focus-visible:border-teal-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 focus-visible:shadow-md"
      >
        <p lang="ja" className="text-3xl font-semibold tracking-tight text-slate-950">
          {term.japanese}
        </p>
        {(term.kana || term.romaji) && (
          <p className="mt-2 text-sm text-slate-500">
            {term.kana && <span lang="ja">{term.kana}</span>}
            {term.kana && term.romaji && <span> · </span>}
            {term.romaji && <span>{term.romaji}</span>}
          </p>
        )}
        <h2 className="mt-5 text-xl font-semibold tracking-tight text-slate-950 group-hover:text-teal-700">
          {term.englishName}
        </h2>
        <p className="mt-3 flex-1 leading-7 text-slate-600">{term.shortDefinition}</p>
        <div className="mt-6 border-t border-slate-100 pt-4">
          <span aria-hidden="true" className="inline-flex min-h-11 select-none items-center text-sm font-semibold text-teal-800 transition-transform group-hover:translate-x-0.5">
            View term and context →
          </span>
        </div>
      </Link>
    </article>
  );
}
