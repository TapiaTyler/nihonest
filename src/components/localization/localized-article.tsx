"use client";

import { Fragment, type ReactNode } from "react";
import Link from "next/link";
import { parseArticleMarkdown, type ArticleComponentBlockKind } from "@/domain/article/article-blocks";
import { headingId, headingPlainText } from "@/domain/article/article-outline";
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
    else if (node.kind === "strong") rendered.push(<strong key={index} className="font-semibold text-ink">{inlineNodes(node.children)}</strong>);
    else if (node.kind === "emphasis") rendered.push(<em key={index}>{inlineNodes(node.children)}</em>);
    else if (node.kind === "link") {
      const className = "font-medium text-brand-link underline decoration-brand-300 underline-offset-4 hover:text-brand-link-hover";
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
        ? <h2 key={index} id={headingId(headingPlainText(block.text))} className="mt-10 scroll-mt-24 text-2xl font-semibold tracking-tight text-ink lg:scroll-mt-6"><InlineMarkdown>{block.text}</InlineMarkdown></h2>
        : <h3 key={index} id={headingId(headingPlainText(block.text))} className="mt-8 scroll-mt-24 text-xl font-semibold tracking-tight text-ink lg:scroll-mt-6"><InlineMarkdown>{block.text}</InlineMarkdown></h3>;
    }
    if (block.kind === "blockquote") {
      return <blockquote key={index} className="mt-6 rounded-r-xl border-l-4 border-brand-600 bg-brand-soft px-5 py-1 text-ink-firm"><p className="my-4 leading-8"><InlineMarkdown>{block.text}</InlineMarkdown></p></blockquote>;
    }
    if (block.kind === "unordered-list" || block.kind === "ordered-list") {
      const List = block.kind === "unordered-list" ? "ul" : "ol";
      return <List key={index} className={`mt-4 space-y-2 pl-6 text-ink-body ${block.kind === "unordered-list" ? "list-disc" : "list-decimal"}`}>{block.items.map((item, itemIndex) => <li key={itemIndex}><InlineMarkdown>{item}</InlineMarkdown></li>)}</List>;
    }
    return <p key={index} className="mt-4 leading-8 text-ink-body"><InlineMarkdown>{block.text}</InlineMarkdown></p>;
  });
}

export function ArticleTranslationNotice({ translation }: Readonly<{ translation?: ArticleTranslation }>) {
  const { locale, setLocale } = useContentLocale();
  const { message } = useInterfaceMessages();
  if (locale === "en") return null;

  const activeTranslation = completeJapaneseTranslation(translation);
  return (
    <aside aria-live="polite" className={`mt-6 rounded-2xl border p-4 text-sm leading-6 ${activeTranslation ? "border-info-line bg-info-soft text-info-ink" : "border-caution-line bg-caution-soft text-caution-ink"}`}>
      <p className="font-semibold">{message(activeTranslation ? "translation.machineTitle" : "translation.unavailableTitle")}</p>
      <p className="mt-1">
        {activeTranslation
          ? message("translation.machineBody")
          : message("translation.unavailableBody")}
      </p>
      <button type="button" onClick={() => setLocale("en")} className="mt-1 inline-flex min-h-11 items-center rounded-sm font-semibold text-brand-link underline decoration-brand-300 underline-offset-4 hover:text-brand-link-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus">
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
      <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
        {activeTranslation?.fields.title ?? canonicalTitle}
      </h1>
      <p className="mt-5 text-lg leading-8 text-ink-muted">
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
