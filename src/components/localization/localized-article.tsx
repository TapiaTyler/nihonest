"use client";

import { Fragment, type ReactNode } from "react";
import Link from "next/link";
import { parseArticleMarkdown, type ArticleComponentBlockKind } from "@/domain/article/article-blocks";
import { parseArticleInline, type ArticleInline } from "@/domain/article/article-inline";
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

/** Protected spans stay visible as inert raw text, including existing form blanks; never evaluate HTML/MDX. */
function inlineNodes(nodes: readonly ArticleInline[]): ReactNode[] {
  const rendered: ReactNode[] = [];
  let literal = "";
  const flush = () => {
    if (literal) rendered.push(literal);
    literal = "";
  };
  for (const [index, node] of nodes.entries()) {
    if (node.kind === "text" || node.kind === "protected") {
      // Coalesce adjacent literal spans so protected syntax does not add text boundaries to existing markup.
      literal += node.kind === "text" ? node.text : node.raw;
      continue;
    }
    flush();
    if (node.kind === "code") rendered.push(<code key={index}>{node.text}</code>);
    else if (node.kind === "strong") rendered.push(<strong key={index} className="font-semibold text-slate-950">{inlineNodes(node.children)}</strong>);
    else if (node.kind === "emphasis") rendered.push(<em key={index}>{inlineNodes(node.children)}</em>);
    else if (node.kind === "link") {
      const className = "font-medium text-teal-800 underline decoration-teal-300 underline-offset-4 hover:text-teal-600";
      const label = inlineNodes(node.children);
      rendered.push(node.href.startsWith("/")
        ? <Link key={index} href={node.href} className={className}>{label}</Link>
        : <a key={index} href={node.href} className={className}>{label}</a>);
    }
    else throw new Error("Unsupported article inline node.");
  }
  flush();
  return rendered;
}

function InlineMarkdown({ children }: Readonly<{ children: string }>) {
  return inlineNodes(parseArticleInline(children));
}

/** Server-rendered component blocks by kind; see renderJapaneseArticleComponents. */
export type TranslatedArticleComponents = Readonly<Partial<Record<ArticleComponentBlockKind, ReactNode>>>;

export function TranslatedArticleBody({ markdown, components = {} }: Readonly<{ markdown: string; components?: TranslatedArticleComponents }>) {
  return parseArticleMarkdown(markdown).map((block, index) => {
    if (block.kind === "component") {
      // Dropping a block silently would hide content; the server renders every kind the body uses.
      if (!(block.component in components)) throw new Error(`The translated article uses the "${block.component}" block, but it was not rendered.`);
      return <Fragment key={index}>{components[block.component]}</Fragment>;
    }
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

export function LocalizedArticleBody({ children, translation, components }: Readonly<{
  children: ReactNode;
  translation?: ArticleTranslation;
  components?: TranslatedArticleComponents;
}>) {
  const { locale } = useContentLocale();
  const activeTranslation = locale === "ja" ? completeJapaneseTranslation(translation) : undefined;

  return activeTranslation
    ? <div lang="ja"><TranslatedArticleBody markdown={activeTranslation.fields.body} components={components} /></div>
    : <div lang="en">{children}</div>;
}
