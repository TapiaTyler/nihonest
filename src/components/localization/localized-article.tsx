"use client";

import { Fragment, type ReactNode } from "react";
import type { TranslationArtifact } from "@/domain/translation/translation";
import { useContentLocale } from "./content-locale-provider";

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
  return children.split(/(\*\*[^*]+\*\*)/g).map((part, index) => (
    part.startsWith("**") && part.endsWith("**")
      ? <strong key={index} className="font-semibold text-slate-950">{part.slice(2, -2)}</strong>
      : <Fragment key={index}>{part}</Fragment>
  ));
}

type MarkdownBlock =
  | Readonly<{ kind: "heading"; level: 2 | 3; text: string }>
  | Readonly<{ kind: "paragraph"; text: string }>
  | Readonly<{ kind: "blockquote"; text: string }>
  | Readonly<{ kind: "unordered-list"; items: readonly string[] }>
  | Readonly<{ kind: "ordered-list"; items: readonly string[] }>;

/** Parses the deliberately small Markdown subset accepted by repository translation artifacts. */
export function parseTranslatedArticleMarkdown(markdown: string): readonly MarkdownBlock[] {
  const blocks: MarkdownBlock[] = [];
  const lines = markdown.replaceAll("\r\n", "\n").split("\n");
  let paragraph: string[] = [];

  function flushParagraph() {
    if (paragraph.length > 0) blocks.push({ kind: "paragraph", text: paragraph.join(" ") });
    paragraph = [];
  }

  for (let index = 0; index < lines.length;) {
    const line = lines[index].trim();
    if (!line) {
      flushParagraph();
      index += 1;
      continue;
    }
    const heading = line.match(/^(#{2,3})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      blocks.push({ kind: "heading", level: heading[1].length as 2 | 3, text: heading[2] });
      index += 1;
      continue;
    }
    if (line.startsWith("> ")) {
      flushParagraph();
      const quoteLines: string[] = [];
      while (index < lines.length && lines[index].trim().startsWith("> ")) {
        quoteLines.push(lines[index].trim().slice(2));
        index += 1;
      }
      blocks.push({ kind: "blockquote", text: quoteLines.join(" ") });
      continue;
    }
    const unordered = line.match(/^[-*]\s+(.+)$/);
    const ordered = line.match(/^\d+[.)]\s+(.+)$/);
    if (unordered || ordered) {
      flushParagraph();
      const kind = unordered ? "unordered-list" : "ordered-list";
      const items: string[] = [];
      const pattern = unordered ? /^[-*]\s+(.+)$/ : /^\d+[.)]\s+(.+)$/;
      while (index < lines.length) {
        const item = lines[index].trim().match(pattern);
        if (!item) break;
        items.push(item[1]);
        index += 1;
      }
      blocks.push({ kind, items });
      continue;
    }
    paragraph.push(line);
    index += 1;
  }

  flushParagraph();
  return blocks;
}

export function TranslatedArticleBody({ markdown }: Readonly<{ markdown: string }>) {
  return parseTranslatedArticleMarkdown(markdown).map((block, index) => {
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
  if (locale === "en") return null;

  const activeTranslation = completeJapaneseTranslation(translation);
  return (
    <aside aria-live="polite" className={`mt-6 rounded-2xl border p-4 text-sm leading-6 ${activeTranslation ? "border-sky-200 bg-sky-50 text-sky-950" : "border-amber-200 bg-amber-50 text-amber-950"}`}>
      <p className="font-semibold">{activeTranslation ? "Machine-translated Japanese" : "Japanese translation unavailable"}</p>
      <p className="mt-1">
        {activeTranslation
          ? "This Japanese version was generated from the canonical English guide and has not yet received independent human translation review. Compare important details with the English guide and official sources."
          : "This guide has not been translated into Japanese yet, so its canonical English version is shown instead."}
      </p>
      <button type="button" onClick={() => setLocale("en")} className="mt-2 rounded-sm font-semibold text-teal-800 underline decoration-teal-300 underline-offset-4 hover:text-teal-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700">
        Read in English
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
