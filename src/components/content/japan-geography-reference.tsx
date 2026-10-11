import "server-only";

import type { ReactNode } from "react";
import { japanPracticalBasicsComponent } from "@/data/article-components";
import { parseArticleInline, type ArticleInline } from "@/domain/article/article-inline";
import { selectArticleComponentTranslation } from "@/lib/content/article-component-translations";
import { japanPrefectureRegions } from "@/data/geography/regions";
import { getInterfaceMessageGroup } from "@/domain/localization/interface-messages";
import { getPrefectureFinderData } from "@/lib/content/prefecture-finder";
import Link from "next/link";
import { LazyJapanRegionMapView, LazyPrefectureFinder } from "./lazy-geography";

export { japanPrefectureRegions };

type Locale = "en" | "ja";
type SupplementTitles = Readonly<Record<string, string>>;

/**
 * Server entry points for the geography blocks. They assemble catalog-derived payloads here and pass only those to
 * client components, so browser code never imports the geography registry or municipality guidance catalogs.
 */
export function JapanRegionMap({ locale = "en" }: Readonly<{ locale?: Locale }>) {
  return <LazyJapanRegionMapView regions={japanPrefectureRegions} messages={getInterfaceMessageGroup(locale, "regionMap.")} locale={locale} />;
}

export { JapanRegionMap as JapanPrefectureRegionCards };

export function JapanPrefectureRegionGrid({ locale = "en", japaneseSupplementTitles }: Readonly<{ locale?: Locale; japaneseSupplementTitles?: SupplementTitles }>) {
  return (
    <div className="not-prose space-y-4">
      <JapanPrefectureFinder locale={locale} japaneseSupplementTitles={japaneseSupplementTitles} />
      <JapanRegionMap locale={locale} />
    </div>
  );
}

export function JapanPrefectureFinder({ locale = "en", japaneseSupplementTitles }: Readonly<{ locale?: Locale; japaneseSupplementTitles?: SupplementTitles }>) {
  const { prefectures, municipalities, coverage } = getPrefectureFinderData();
  return <LazyPrefectureFinder locale={locale} messages={getInterfaceMessageGroup(locale, "finder.")} prefectures={prefectures} municipalities={municipalities} coverage={coverage} japaneseSupplementTitles={japaneseSupplementTitles} />;
}

/** Validated component inline text keeps its label/link markup; unsupported spans must fail explicitly. */
function practicalInline(nodes: readonly ArticleInline[]): ReactNode[] {
  return nodes.map((node, index) => {
    switch (node.kind) {
      case "text": return node.text;
      case "strong": return <strong key={index}>{practicalInline(node.children)}</strong>;
      case "emphasis": return <em key={index}>{practicalInline(node.children)}</em>;
      case "code": return <code key={index}>{node.text}</code>;
      case "link": return <Link key={index} className="font-semibold text-brand-deep-soft underline" href={node.href}>{practicalInline(node.children)}</Link>;
      case "protected": throw new Error("Practical component contains unsupported inline markup.");
    }
  });
}

/** Japanese is applied as one current component; incomplete/stale artifacts render the whole English source. */
export function JapanPracticalBasics({ locale = "en" }: Readonly<{ locale?: Locale }>) {
  const translated = locale === "ja" ? selectArticleComponentTranslation(japanPracticalBasicsComponent) : undefined;
  return (
    <div lang={locale === "ja" && !translated ? "en" : undefined} className="not-prose mt-4 space-y-4 text-slate-700">
      {japanPracticalBasicsComponent.paragraphs.map((paragraph) => (
        <p key={paragraph.id} className="leading-8">{practicalInline(parseArticleInline(translated?.[`paragraphs.${paragraph.id}`] ?? paragraph.text))}</p>
      ))}
    </div>
  );
}
