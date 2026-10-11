"use client";

import type { ArticleOutlineEntry } from "@/domain/article/article-outline";
import { DisclosureChevron } from "@/components/navigation/disclosure-chevron";
import { useContentLocale } from "./content-locale-provider";
import { useInterfaceMessages } from "./interface-text";

const minimumEntries = 4;

/**
 * A collapsed "On this page" list for long guides. It follows the language the body is shown in, so the English
 * outline and the translated outline never mix; either may be empty, which hides it.
 */
export function ArticleOutline({ english, japanese }: Readonly<{
  english: readonly ArticleOutlineEntry[];
  japanese?: readonly ArticleOutlineEntry[];
}>) {
  const { locale } = useContentLocale();
  const { message } = useInterfaceMessages();
  const showJapanese = locale === "ja" && japanese !== undefined;
  const entries = showJapanese ? japanese : english;
  if (entries.length < minimumEntries) return null;
  const groups = groupBySection(entries);

  return (
    <nav aria-label={message("article.onThisPage")} lang={showJapanese ? "ja" : "en"} className="mt-2">
      <details className="group border-b border-slate-200">
        <summary className="flex min-h-12 cursor-pointer list-none select-none items-center gap-2 font-semibold text-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 [&::-webkit-details-marker]:hidden">
          <span lang={locale === "ja" ? "ja" : "en"}>{message("article.onThisPage")}</span>
          <DisclosureChevron />
        </summary>
        <ul className="pb-4 pt-1 sm:columns-2 sm:gap-x-10">
          {groups.map(({ heading, children }, index) => (
            // A section and its sub-items stay in one column so the indented items never sit apart from their parent.
            <li key={`${heading.id}-${index}`} className="break-inside-avoid">
              <OutlineLink entry={heading} />
              {children.length > 0 && (
                <ul>
                  {children.map((child, childIndex) => <li key={`${child.id}-${childIndex}`}><OutlineLink entry={child} /></li>)}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </details>
    </nav>
  );
}

type OutlineGroup = Readonly<{ heading: ArticleOutlineEntry; children: readonly ArticleOutlineEntry[] }>;

/** Nests each sub-heading under the section heading before it; a sub-heading with no section stands alone. */
function groupBySection(entries: readonly ArticleOutlineEntry[]): OutlineGroup[] {
  const groups: { heading: ArticleOutlineEntry; children: ArticleOutlineEntry[] }[] = [];
  for (const entry of entries) {
    const current = groups.at(-1);
    if (entry.level === 3 && current) current.children.push(entry);
    else groups.push({ heading: entry, children: [] });
  }
  return groups;
}

function OutlineLink({ entry: { level, id, text } }: Readonly<{ entry: ArticleOutlineEntry }>) {
  return (
    <a
      href={`#${id}`}
      className={`flex min-h-11 items-center rounded-sm leading-6 text-slate-700 hover:text-teal-800 hover:underline hover:decoration-teal-300 hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 sm:min-h-9 ${level === 3 ? "pl-4 text-[0.9375rem] text-slate-600" : "font-medium"}`}
    >
      {text}
    </a>
  );
}
