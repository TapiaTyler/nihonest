"use client";

import Link from "next/link";
import type { JapaneseTerm } from "@/domain/glossary/glossary";
import { glossaryTermName } from "@/domain/glossary/term-display";
import { JapaneseReading } from "@/components/localization/japanese-reading";
import { InterfaceText, useInterfaceMessages } from "@/components/localization/interface-text";
import type { GlossarySearchTranslation } from "@/lib/search/glossary-search";

export function GlossaryCard({ term, translation, returnTo }: Readonly<{
  term: JapaneseTerm;
  translation?: GlossarySearchTranslation;
  returnTo?: string;
}>) {
  const { locale } = useInterfaceMessages();
  // English (and future) readers get the term's name as the card heading; for Japanese readers the term is the name.
  const name = glossaryTermName(term, locale);
  return (
    <article className="h-full">
      <Link
        href={returnTo ? { pathname: `/glossary/${term.slug}`, query: { returnTo } } : `/glossary/${term.slug}`}
        aria-label={name?.text ?? term.japanese}
        className="group flex h-full cursor-pointer flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md focus-visible:border-teal-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 focus-visible:shadow-md"
      >
        {name ? (
          <p lang="ja" className="text-3xl font-semibold tracking-tight text-slate-950">{term.japanese}</p>
        ) : (
          <h2 lang="ja" className="text-3xl font-semibold tracking-tight text-slate-950 group-hover:text-teal-700">{term.japanese}</h2>
        )}
        {(term.kana || term.romaji) && (
          <p className="mt-2 text-sm text-slate-500">
            <JapaneseReading kana={term.kana} romaji={term.romaji} />
          </p>
        )}
        {name && (
          <h2 lang={name.lang} className="mt-5 text-xl font-semibold tracking-tight text-slate-950 group-hover:text-teal-700">
            {name.text}
          </h2>
        )}
        <p lang={translation ? "ja" : "en"} className="mt-3 flex-1 leading-7 text-slate-600">{translation?.shortDefinition ?? term.shortDefinition}</p>
        <div className="mt-6 border-t border-slate-100 pt-4">
          <span aria-hidden="true" className="inline-flex min-h-11 select-none items-center text-sm font-semibold text-teal-800 transition-transform group-hover:translate-x-0.5">
            <InterfaceText id="content.viewTerm" />
          </span>
        </div>
      </Link>
    </article>
  );
}
