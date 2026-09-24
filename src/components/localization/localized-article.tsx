"use client";

import { Fragment, type ReactNode } from "react";
import Link from "next/link";
import { ResidenceApplicationFeeSection } from "@/components/content/residence-application-fee-section";
import { TaxResidenceScopeTable } from "@/components/content/tax-residence-scope-table";
import { TrainingRouteComparisonTable } from "@/components/content/training-route-comparison-table";
import { JapanPrefectureRegionGrid, JapanPracticalBasics } from "@/components/content/japan-geography-reference";
import { parseArticleMarkdown, type ArticleComponentBlockKind } from "@/domain/article/article-blocks";
import type { TranslationArtifact } from "@/domain/translation/translation";
import { useContentLocale } from "./content-locale-provider";
import { useInterfaceMessages } from "./interface-text";

type ArticleTranslation = Pick<TranslationArtifact, "fields" | "reviewState" | "sourceLocale" | "targetLocale">;

function completeJapaneseTranslation(translation?: ArticleTranslation) {
  return translation?.targetLocale === "ja"
    && typeof translation.fields.title === "string"
    && typeof translation.fields.description === "string"
    && typeof translation.fields.body === "string"
    ? translation
    : undefined;
}

function InlineMarkdown({ children }: Readonly<{ children: string }>) {
  return children.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\\?\((?:\/|https?:\/\/)[^)\s]+\))/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold text-slate-950">
          <InlineMarkdown>{part.slice(2, -2)}</InlineMarkdown>
        </strong>
      );
    }
    const link = part.match(/^\[([^\]]+)\]\\?\(((?:\/|https?:\/\/)[^)\s]+)\)$/);
    if (!link) return <Fragment key={index}>{part}</Fragment>;
    const className = "font-medium text-teal-800 underline decoration-teal-300 underline-offset-4 hover:text-teal-600";
    return link[2].startsWith("/")
      ? <Link key={index} href={link[2]} className={className}>{link[1]}</Link>
      : <a key={index} href={link[2]} className={className}>{link[1]}</a>;
  });
}

const componentBlocks: Record<ArticleComponentBlockKind, () => ReactNode> = {
  "residence-application-fees": () => <ResidenceApplicationFeeSection locale="ja" />,
  "tax-residence-scope": () => <TaxResidenceScopeTable locale="ja" />,
  "training-route-comparison": () => <TrainingRouteComparisonTable locale="ja" />,
  "japan-prefecture-regions": () => <JapanPrefectureRegionGrid locale="ja" />,
  "japan-practical-basics": () => <JapanPracticalBasics locale="ja" />,
};

export function TranslatedArticleBody({ markdown }: Readonly<{ markdown: string }>) {
  return parseArticleMarkdown(markdown).map((block, index) => {
    if (block.kind === "component") return <Fragment key={index}>{componentBlocks[block.component]()}</Fragment>;
    if (block.kind === "heading") {
      return block.level === 2
        ? <h2 key={index} className="mt-10 text-2xl font-semibold tracking-tight text-slate-950"><InlineMarkdown>{block.text}</InlineMarkdown></h2>
        : <h3 key={index} className="mt-8 text-xl font-semibold tracking-tight text-slate-950"><InlineMarkdown>{block.text}</InlineMarkdown></h3>;
    }
    if (block.kind === "blockquote") {
      return <blockquote key={index} className="mt-6 rounded-r-xl border-l-4 border-teal-600 bg-teal-50 px-5 py-1 text-slate-800"><p className="my-4 leading-8"><InlineMarkdown>{block.text}</InlineMarkdown></p></blockquote>;
    }
    if (block.kind === "unordered-list" || block.kind === "ordered-list") {
      const List = block.kind === "unordered-list" ? "ul" : "ol";
      return <List key={index} className={`mt-4 space-y-2 pl-6 text-slate-700 ${block.kind === "unordered-list" ? "list-disc" : "list-decimal"}`}>{block.items.map((item, itemIndex) => <li key={itemIndex}><InlineMarkdown>{item}</InlineMarkdown></li>)}</List>;
    }
    return <p key={index} className="mt-4 leading-8 text-slate-700"><InlineMarkdown>{block.text}</InlineMarkdown></p>;
  });
}

export function ArticleTranslationNotice({ translation }: Readonly<{ translation?: ArticleTranslation }>) {
  const { locale, setLocale } = useContentLocale();
  const { message } = useInterfaceMessages();
  if (locale === "en") return null;

  const activeTranslation = completeJapaneseTranslation(translation);
  return (
    <aside aria-live="polite" className={`mt-6 rounded-2xl border p-4 text-sm leading-6 ${activeTranslation ? "border-sky-200 bg-sky-50 text-sky-950" : "border-amber-200 bg-amber-50 text-amber-950"}`}>
      <p className="font-semibold">{message(activeTranslation ? "translation.machineTitle" : "translation.unavailableTitle")}</p>
      <p className="mt-1">
        {activeTranslation
          ? message("translation.machineBody")
          : message("translation.unavailableBody")}
      </p>
      <button type="button" onClick={() => setLocale("en")} className="mt-2 rounded-sm font-semibold text-teal-800 underline decoration-teal-300 underline-offset-4 hover:text-teal-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700">
        {message("translation.readEnglish")}
      </button>
    </aside>
  );
}

export function LocalizedArticleHeading({
  canonicalTitle,
  canonicalDescription,
  translation,
}: Readonly<{
  canonicalTitle: string;
  canonicalDescription: string;
  translation?: ArticleTranslation;
}>) {
  const { locale } = useContentLocale();
  const activeTranslation = locale === "ja" ? completeJapaneseTranslation(translation) : undefined;

  return (
    <div lang={activeTranslation ? "ja" : "en"}>
      <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
        {activeTranslation?.fields.title ?? canonicalTitle}
      </h1>
      <p className="mt-5 text-lg leading-8 text-slate-600">
        {activeTranslation?.fields.description ?? canonicalDescription}
      </p>
    </div>
  );
}

export function LocalizedArticleBody({ children, translation }: Readonly<{
  children: ReactNode;
  translation?: ArticleTranslation;
}>) {
  const { locale } = useContentLocale();
  const activeTranslation = locale === "ja" ? completeJapaneseTranslation(translation) : undefined;

  return activeTranslation
    ? <div lang="ja"><TranslatedArticleBody markdown={activeTranslation.fields.body} /></div>
    : <div lang="en">{children}</div>;
}
