import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import * as translations from "@/lib/content/article-component-translations";
import { trainingRouteComparisonComponent } from "@/data/article-components";
import { TaxResidenceScopeTable } from "./tax-residence-scope-table";
import { TrainingRouteComparisonTable } from "./training-route-comparison-table";
import { JapanPracticalBasics } from "./japan-geography-reference";

// Captured from ded19b4 before extraction. Do not update these to conceal markup/copy changes.
describe("article component extraction markup", () => {
  afterEach(() => vi.restoreAllMocks());
  for (const [name, Component] of [
    ["tax", TaxResidenceScopeTable], ["training", TrainingRouteComparisonTable], ["practical", JapanPracticalBasics],
  ] as const) {
    for (const locale of ["en", "ja"] as const) {
      it(`preserves ${name} ${locale} parent markup byte for byte`, () => {
        expect(renderToStaticMarkup(<Component locale={locale} />)).toMatchSnapshot();
      });
    }
  }

  it("preserves every canonical training href in both locales", () => {
    for (const locale of ["en", "ja"] as const) {
      const document = new DOMParser().parseFromString(renderToStaticMarkup(<TrainingRouteComparisonTable locale={locale} />), "text/html");
      expect([...document.querySelectorAll("tbody a")].map((link) => link.getAttribute("href")))
        .toEqual(trainingRouteComparisonComponent.rows.map(({ href }) => href));
    }
  });

  it("renders complete English tables with English language tags when Japanese is unavailable", () => {
    const selector = vi.spyOn(translations, "selectArticleComponentTranslation").mockReturnValue(undefined);
    for (const Table of [TaxResidenceScopeTable, TrainingRouteComparisonTable]) {
      expect(renderToStaticMarkup(<Table locale="ja" />)).toBe(renderToStaticMarkup(<Table locale="en" />));
    }
    // English bypasses artifact selection; only the two Japanese renders call it.
    expect(selector).toHaveBeenCalledTimes(2);
  });

  it("renders all English practical paragraphs and marks fallback language", () => {
    vi.spyOn(translations, "selectArticleComponentTranslation").mockReturnValue(undefined);
    const fallback = new DOMParser().parseFromString(renderToStaticMarkup(<JapanPracticalBasics locale="ja" />), "text/html");
    const english = new DOMParser().parseFromString(renderToStaticMarkup(<JapanPracticalBasics locale="en" />), "text/html");
    expect([...fallback.querySelectorAll("p")].map((paragraph) => paragraph.outerHTML))
      .toEqual([...english.querySelectorAll("p")].map((paragraph) => paragraph.outerHTML));
    expect(fallback.querySelector("div")?.getAttribute("lang")).toBe("en");
  });
});
