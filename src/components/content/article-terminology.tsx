import { InlineGlossaryTerm } from "@/components/glossary/inline-glossary-term";
import type { JapaneseTerm } from "@/domain/glossary/glossary";

export function ArticleTerminology({ terms }: Readonly<{ terms: readonly JapaneseTerm[] }>) {
  if (terms.length === 0) return null;

  return (
    <aside className="rounded-2xl border border-teal-200 bg-teal-50 p-5 sm:p-6" aria-labelledby="article-terminology-heading">
      <h2 id="article-terminology-heading" className="text-lg font-semibold tracking-tight text-teal-950">
        Key Japanese terminology
      </h2>
      <p className="mt-2 text-sm leading-6 text-teal-950/80">
        Hover, focus, or tap a highlighted term for its reading. On touch screens, tap it again to open the full glossary entry.
      </p>
      <ul className="mt-4 flex flex-wrap gap-3">
        {terms.map((term) => (
          <li key={term.id} className="rounded-xl border border-teal-200 bg-white px-4 py-3 text-sm shadow-sm">
            <InlineGlossaryTerm term={term} className="text-base">
              <span lang="ja">{term.japanese}</span>
            </InlineGlossaryTerm>
            <span className="ml-2 text-slate-600">{term.englishName}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
