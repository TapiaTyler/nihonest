import { isValidElement, type ReactNode } from "react";
import type { MDXComponents } from "mdx/types";
import { headingId } from "@/domain/article/article-outline";
import { InlineGlossaryTerm } from "@/components/glossary/inline-glossary-term";
import { ResidenceApplicationFeeSection } from "@/components/content/residence-application-fee-section";
import { TaxResidenceScopeTable } from "@/components/content/tax-residence-scope-table";
import { TrainingRouteComparisonTable } from "@/components/content/training-route-comparison-table";
import { JapanPrefectureFinder, JapanPrefectureRegionCards, JapanPrefectureRegionGrid, JapanPracticalBasics, JapanRegionMap } from "@/components/content/japan-geography-reference";
import { getGlossaryTermBySlug } from "@/lib/content/glossary";
import { getLocalizedGlossaryText } from "@/lib/content/translations";

/** The visible text of rendered MDX children, so a heading's id matches the one the article outline derives. */
function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  return isValidElement<{ children?: ReactNode }>(node) ? textOf(node.props.children) : "";
}

const components = {
  ResidenceApplicationFeeSection,
  TaxResidenceScopeTable,
  TrainingRouteComparisonTable,
  JapanPrefectureRegionGrid,
  JapanPrefectureFinder,
  JapanPrefectureRegionCards,
  JapanRegionMap,
  JapanPracticalBasics,
  h2: ({ children }) => (
    <h2 id={headingId(textOf(children).replace(/\s+/g, " ").trim())} className="mt-10 scroll-mt-24 text-2xl font-semibold tracking-tight text-ink lg:scroll-mt-6">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 id={headingId(textOf(children).replace(/\s+/g, " ").trim())} className="mt-8 scroll-mt-24 text-xl font-semibold tracking-tight text-ink lg:scroll-mt-6">{children}</h3>
  ),
  p: ({ children }) => <p className="mt-4 leading-8 text-ink-body">{children}</p>,
  ul: ({ children }) => <ul className="mt-4 list-disc space-y-2 pl-6 text-ink-body">{children}</ul>,
  ol: ({ children }) => <ol className="mt-4 list-decimal space-y-2 pl-6 text-ink-body">{children}</ol>,
  blockquote: ({ children }) => (
    <blockquote className="mt-6 rounded-r-xl border-l-4 border-brand-600 bg-brand-soft px-5 py-1 text-ink-firm">
      {children}
    </blockquote>
  ),
  a: ({ children, href }) => {
    const glossarySlug = href?.match(/^\/glossary\/([a-z0-9-]+)$/)?.[1];
    const glossaryTerm = glossarySlug ? getGlossaryTermBySlug(glossarySlug) : undefined;
    if (glossaryTerm) return <InlineGlossaryTerm term={glossaryTerm} localized={getLocalizedGlossaryText(glossaryTerm.id)}>{children}</InlineGlossaryTerm>;

    return (
      <a
        href={href}
        className="font-medium text-brand-link underline decoration-brand-300 underline-offset-4 hover:text-brand-link-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
      >
        {children}
      </a>
    );
  },
  strong: ({ children }) => <strong className="font-semibold text-ink">{children}</strong>,
} satisfies MDXComponents;

export function useMDXComponents(): MDXComponents {
  return components;
}
