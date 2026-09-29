import "server-only";

import type { ReactNode } from "react";
import { localGuidanceSupplements } from "@/data/local-guidance";
import { parseArticleMarkdown, type ArticleComponentBlockKind } from "@/domain/article/article-blocks";
import { getJapaneseSupplementTitles } from "@/lib/content/local-guidance-translations";
import {
  JapanPracticalBasics,
  JapanPrefectureFinder,
  JapanPrefectureRegionCards,
  JapanPrefectureRegionGrid,
  JapanRegionMap,
} from "./japan-geography-reference";
import { ResidenceApplicationFeeSection } from "./residence-application-fee-section";
import { TaxResidenceScopeTable } from "./tax-residence-scope-table";
import { TrainingRouteComparisonTable } from "./training-route-comparison-table";

export type ArticleComponentNodes = Readonly<Partial<Record<ArticleComponentBlockKind, ReactNode>>>;

const finderKinds: readonly ArticleComponentBlockKind[] = ["japan-prefecture-regions", "japan-prefecture-finder"];

/**
 * Renders on the server only the component blocks a Japanese article body uses. The client translated body places
 * these nodes, so browser code receives each component's payload instead of importing the catalogs behind it.
 */
export function renderJapaneseArticleComponents(markdown: string): ArticleComponentNodes {
  const kinds = new Set(parseArticleMarkdown(markdown).flatMap((block) => (block.kind === "component" ? [block.component] : [])));
  const titles = finderKinds.some((kind) => kinds.has(kind)) ? getJapaneseSupplementTitles(localGuidanceSupplements) : {};
  const render: Record<ArticleComponentBlockKind, () => ReactNode> = {
    "residence-application-fees": () => <ResidenceApplicationFeeSection locale="ja" />,
    "tax-residence-scope": () => <TaxResidenceScopeTable locale="ja" />,
    "training-route-comparison": () => <TrainingRouteComparisonTable locale="ja" />,
    "japan-prefecture-regions": () => <JapanPrefectureRegionGrid locale="ja" japaneseSupplementTitles={titles} />,
    "japan-prefecture-finder": () => <JapanPrefectureFinder locale="ja" japaneseSupplementTitles={titles} />,
    "japan-prefecture-region-cards": () => <JapanPrefectureRegionCards locale="ja" />,
    "japan-region-map": () => <JapanRegionMap locale="ja" />,
    "japan-practical-basics": () => <JapanPracticalBasics locale="ja" />,
  };
  return Object.fromEntries([...kinds].map((kind) => [kind, render[kind]()]));
}
