"use client";

import { InlineGlossaryTerm, type InlineGlossaryLocalizedText } from "@/components/glossary/inline-glossary-term";
import { useInterfaceMessages } from "@/components/localization/interface-text";
import type { JapaneseTerm } from "@/domain/glossary/glossary";
import { glossaryTermGloss } from "@/domain/glossary/term-display";

export function ArticleTerminology({ terms, localized = {} }: Readonly<{
  terms: readonly JapaneseTerm[];
  /** Localized glossary text by term ID, then locale; see `getLocalizedGlossaryText`. */
  localized?: Readonly<Record<string, InlineGlossaryLocalizedText>>;
}>) {
  const { locale, message } = useInterfaceMessages();
  if (terms.length === 0) return null;

  return (
    <aside className="border-t border-line pt-8" aria-labelledby="article-terminology-heading">
      <h2 id="article-terminology-heading" className="text-lg font-semibold tracking-tight text-ink">
        {message("article.terminologyHeading")}
      </h2>
      <p className="mt-2 text-sm leading-6 text-ink-muted">{message("article.terminologyHint")}</p>
      <ul className="mt-4 flex flex-wrap gap-3">
        {terms.map((term) => {
          const gloss = glossaryTermGloss(term, locale, localized[term.id]?.[locale]?.name);
          return (
            <li key={term.id} className="rounded-xl border border-brand-line bg-surface px-4 py-3 text-sm shadow-sm">
              <InlineGlossaryTerm term={term} className="text-base" localized={localized[term.id]}>
                <span lang="ja">{term.japanese}</span>
              </InlineGlossaryTerm>
              {gloss && <span className="ml-2 text-ink-muted" lang={gloss.lang}>{gloss.text}</span>}
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
