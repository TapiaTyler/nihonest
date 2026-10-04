import { resolve } from "node:path";
import { createElement, type ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { TaxResidenceScopeTable } from "@/components/content/tax-residence-scope-table";
import { TrainingRouteComparisonTable } from "@/components/content/training-route-comparison-table";
import { JapanPracticalBasics } from "@/components/content/japan-geography-reference";
import { ResidenceApplicationFeeSection } from "@/components/content/residence-application-fee-section";
import { bundledArticleComponentSchema, bundledArticleComponentArtifactSchema, bundledFeeDataSchema } from "@/domain/content-bundle/component-payloads";
import { calculateResidenceApplicationOnlineTotal } from "@/domain/article/residence-application-fees";
import { buildContentBundle, type ContentBundle } from "./content-bundle";

type Renderer = ComponentType<{ locale: "en" | "ja" }>;
const renderers: Record<string, Renderer> = {
  "tax-residence-scope": TaxResidenceScopeTable,
  "training-route-comparison": TrainingRouteComparisonTable,
  "japan-practical-basics": JapanPracticalBasics,
  "residence-application-fees": ResidenceApplicationFeeSection,
};
const markup = (renderer: Renderer, locale: "en" | "ja") => renderToStaticMarkup(createElement(renderer, { locale }));
let bundle: ContentBundle;
const baseline = new Map<string, string>();
beforeAll(async () => {
  // Capture the integrated web output before replacing only its data dependencies with parsed export files.
  for (const [kind, renderer] of Object.entries(renderers)) for (const locale of ["en", "ja"] as const) {
    baseline.set(`${kind}:${locale}`, markup(renderer, locale));
  }
  bundle = await buildContentBundle({ articleDirectory: resolve("content/articles"), generatedAt: "2026-10-04T12:00:00.000Z" });
});
afterEach(() => {
  vi.doUnmock("@/data/article-components");
  vi.doUnmock("@/data/translations/ja/article-components");
  vi.doUnmock("@/data/residence-application-fees");
  vi.resetModules();
});
async function exportedRenderers(withJapanese = true, changeCaption = false): Promise<Record<string, Renderer>> {
  const sources = bundledArticleComponentSchema.array().parse(JSON.parse(bundle.files.get("article-components.en.json")!));
  const byKind = Object.fromEntries(sources.map(({ id, component }) => [id, component]));
  const artifacts = bundledArticleComponentArtifactSchema.array().parse(JSON.parse(bundle.files.get("article-component-translations.ja.json")!));
  if (changeCaption) artifacts.find(({ contentId }) => contentId === "tax-residence-scope")!.fields.caption += "!";
  // Validate numeric fees before passing them to formatters or rendering amounts.
  const fees = bundledFeeDataSchema.array().length(1).parse(JSON.parse(bundle.files.get("residence-application-fees.en.json")!))[0]!.fees;
  vi.resetModules();
  vi.doMock("@/data/article-components", () => ({ articleComponents: byKind,
    taxResidenceScopeComponent: byKind["tax-residence-scope"], trainingRouteComparisonComponent: byKind["training-route-comparison"],
    japanPracticalBasicsComponent: byKind["japan-practical-basics"], residenceApplicationFeesComponent: byKind["residence-application-fees"] }));
  vi.doMock("@/data/translations/ja/article-components", () => ({ japaneseArticleComponentTranslations: withJapanese ? artifacts : [] }));
  vi.doMock("@/data/residence-application-fees", () => ({ residenceApplicationFees: fees,
    residenceApplicationOnlineTotal: (band: Parameters<typeof calculateResidenceApplicationOnlineTotal>[0]) =>
      calculateResidenceApplicationOnlineTotal(band, fees.currentSchedule.processingYen) }));
  const [tax, training, practical, fee] = await Promise.all([
    import("@/components/content/tax-residence-scope-table"), import("@/components/content/training-route-comparison-table"),
    import("@/components/content/japan-geography-reference"), import("@/components/content/residence-application-fee-section"),
  ]);
  return { "tax-residence-scope": tax.TaxResidenceScopeTable, "training-route-comparison": training.TrainingRouteComparisonTable,
    "japan-practical-basics": practical.JapanPracticalBasics, "residence-application-fees": fee.ResidenceApplicationFeeSection };
}

describe("component export render round trip", () => {
  it.each(["en", "ja"] as const)("preserves byte-exact %s static markup for all four integrated renderers", async (locale) => {
    const exported = await exportedRenderers();
    for (const [kind, renderer] of Object.entries(exported)) {
      expect(markup(renderer, locale), `${kind}:${locale}`).toBe(baseline.get(`${kind}:${locale}`));
    }
  });
  it("renders every component wholly in English when no Japanese artifact is exported", async () => {
    const exported = await exportedRenderers(false);
    for (const [kind, renderer] of Object.entries(exported)) {
      const document = new DOMParser().parseFromString(markup(renderer, "ja"), "text/html");
      const english = new DOMParser().parseFromString(baseline.get(`${kind}:en`)!, "text/html");
      expect(document.body.textContent, kind).toBe(english.body.textContent);
      expect(document.querySelector("[lang]")?.getAttribute("lang"), kind).toBe("en");
      expect([...document.querySelectorAll("a")].map((link) => link.getAttribute("href")), kind)
        .toEqual([...english.querySelectorAll("a")].map((link) => link.getAttribute("href")));
    }
  });
  it("detects a one-character translation mutation through the actual renderer dependencies", async () => {
    const exported = await exportedRenderers(true, true);
    expect(markup(exported["tax-residence-scope"]!, "ja")).not.toBe(baseline.get("tax-residence-scope:ja"));
    expect(markup(exported["tax-residence-scope"]!, "en")).toBe(baseline.get("tax-residence-scope:en"));
  });
});
