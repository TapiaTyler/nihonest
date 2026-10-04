import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { JapanPracticalBasics } from "@/components/content/japan-geography-reference";
import { TaxResidenceScopeTable } from "@/components/content/tax-residence-scope-table";
import { TrainingRouteComparisonTable } from "@/components/content/training-route-comparison-table";
import { japaneseArticleComponentTranslations } from "@/data/translations/ja/article-components";
import { parseArticleInline, type ArticleInline } from "@/domain/article/article-inline";
import { translationArtifactSchema, type TranslationArtifact } from "@/domain/translation/translation";
import { translationSourceFields, type ArticleComponentSource } from "@/domain/translation/translation-source-fields";
import { createTranslationSourceRevision } from "@/lib/translation/source-revision-core";
import { articleComponentEnglishFixture } from "./article-component-english.fixture";
import { selectArticleComponentTranslation } from "./article-component-translations";

const english = (kind: ArticleComponentSource["kind"]) => articleComponentEnglishFixture.find((component) => component.kind === kind)!;
const artifact = (kind: string) => japaneseArticleComponentTranslations.find(({ contentId }) => contentId === kind)!;
const withFields = (kind: string, change: (fields: Record<string, string>) => void): TranslationArtifact[] => {
  const fields = { ...artifact(kind).fields };
  change(fields);
  return [translationArtifactSchema.parse({ ...artifact(kind), fields })];
};

/** Visible table cells in order: caption, headers, then each row's activity/classification and linked/plain text. */
function tableCells(markup: string) {
  const document = new DOMParser().parseFromString(markup, "text/html");
  return {
    caption: document.querySelector("caption")!.textContent,
    headers: [...document.querySelectorAll("thead th")].map((cell) => cell.textContent),
    rows: [...document.querySelectorAll("tbody tr")].map((row) => ({
      head: row.querySelector("th")!.textContent,
      cell: row.querySelector("td")!.textContent,
      link: row.querySelector("td a")?.textContent,
      href: row.querySelector("td a")?.getAttribute("href"),
    })),
  };
}

function inlineText(nodes: readonly ArticleInline[]): string {
  return nodes.map((node) => ("children" in node ? inlineText(node.children) : "text" in node ? node.text : node.raw)).join("");
}

function inlineLinks(nodes: readonly ArticleInline[]): [string, string][] {
  return nodes.flatMap((node) => node.kind === "link" ? [[inlineText(node.children), node.href] as [string, string]]
    : "children" in node ? inlineLinks(node.children) : []);
}

describe("article component translations", () => {
  it("are machine-translated and addressed to the agreed English revisions", () => {
    expect(japaneseArticleComponentTranslations.map(({ contentId }) => contentId)).toEqual(["tax-residence-scope", "training-route-comparison", "japan-practical-basics"]);
    for (const component of articleComponentEnglishFixture) {
      const current = artifact(component.kind);
      expect(current.reviewState).toBe("machine-translated");
      expect(current.contentKind).toBe("article-component");
      expect(current.sourceRevision).toBe(createTranslationSourceRevision(translationSourceFields["article-component"](component)));
      expect(Object.keys(current.fields)).toEqual(Object.keys(translationSourceFields["article-component"](component)));
      expect(selectArticleComponentTranslation(component)).toBe(current.fields);
    }
  });

  it("enumerates fields as caption, headers, then rows and cells in display order", () => {
    expect(Object.keys(translationSourceFields["article-component"](english("tax-residence-scope")))).toEqual([
      "caption", "headers.0", "headers.1", "rows.resident.0", "rows.resident.1",
      "rows.non-permanent-resident.0", "rows.non-permanent-resident.1", "rows.non-resident.0", "rows.non-resident.1",
    ]);
    expect(Object.keys(translationSourceFields["article-component"](english("japan-practical-basics"))))
      .toEqual(["paragraphs.time", "paragraphs.money", "paragraphs.measurements", "paragraphs.emergencies"]);
  });

  it("match the rendered tax and training tables byte for byte in both languages", () => {
    for (const [kind, Table] of [["tax-residence-scope", TaxResidenceScopeTable], ["training-route-comparison", TrainingRouteComparisonTable]] as const) {
      const source = english(kind) as Extract<ArticleComponentSource, { rows: unknown }>;
      const fields = artifact(kind).fields;
      for (const locale of ["en", "ja"] as const) {
        const rendered = tableCells(renderToStaticMarkup(<Table locale={locale} />));
        const text = (key: string, value: string) => (locale === "ja" ? fields[key]! : value);
        expect(rendered.caption).toBe(text("caption", source.caption));
        expect(rendered.headers).toEqual(source.headers.map((header, index) => text(`headers.${index}`, header)));
        expect(rendered.rows.map(({ head }) => head)).toEqual(source.rows.map((row) => text(`rows.${row.id}.0`, row.cells[0])));
        expect(rendered.rows.map(({ cell }) => cell)).toEqual(source.rows.map((row) => row.cells.slice(1).map((cell, index) => text(`rows.${row.id}.${index + 1}`, cell)).join("")));
        if (kind === "training-route-comparison") {
          expect(rendered.rows.map(({ link }) => link)).toEqual(source.rows.map((row) => text(`rows.${row.id}.1`, row.cells[1])));
        }
      }
    }
  });

  it("match the rendered practical basics text and links in both languages", () => {
    const source = english("japan-practical-basics") as Extract<ArticleComponentSource, { paragraphs: unknown }>;
    const fields = artifact("japan-practical-basics").fields;
    for (const locale of ["en", "ja"] as const) {
      const document = new DOMParser().parseFromString(renderToStaticMarkup(<JapanPracticalBasics locale={locale} />), "text/html");
      const paragraphs = [...document.querySelectorAll("p")];
      expect(paragraphs).toHaveLength(source.paragraphs.length);
      source.paragraphs.forEach((paragraph, index) => {
        const nodes = parseArticleInline(locale === "ja" ? fields[`paragraphs.${paragraph.id}`]! : paragraph.text);
        expect(paragraphs[index]!.textContent).toBe(inlineText(nodes));
        expect(paragraphs[index]!.querySelector("strong")!.textContent).toBe((nodes[0] && "children" in nodes[0] ? inlineText(nodes[0].children) : ""));
        expect([...paragraphs[index]!.querySelectorAll("a")].map((link) => [link.textContent, link.getAttribute("href")])).toEqual(inlineLinks(nodes));
      });
    }
  });

  it("falls back to English for stale, inactive, or missing artifacts", () => {
    const changed = { ...english("tax-residence-scope"), caption: "Changed English caption" } as ArticleComponentSource;
    expect(selectArticleComponentTranslation(changed)).toBeUndefined();
    expect(selectArticleComponentTranslation(english("tax-residence-scope"), [translationArtifactSchema.parse({ ...artifact("tax-residence-scope"), availability: "stale" })])).toBeUndefined();
    expect(selectArticleComponentTranslation(english("tax-residence-scope"), [])).toBeUndefined();
  });

  it("requires every field, rejects extra or blank values, and keeps empty suffixes exactly empty", () => {
    const training = english("training-route-comparison");
    expect(selectArticleComponentTranslation(training, withFields("training-route-comparison", (fields) => { delete fields["rows.student.1"]; }))).toBeUndefined();
    expect(selectArticleComponentTranslation(training, withFields("training-route-comparison", (fields) => { fields["rows.student.1"] = "  "; }))).toBeUndefined();
    expect(selectArticleComponentTranslation(training, withFields("training-route-comparison", (fields) => { fields["rows.student.2"] = "（追加）"; }))).toBeUndefined();
    expect(selectArticleComponentTranslation(training, withFields("training-route-comparison", (fields) => { fields["rows.technical-intern-training.2"] = ""; }))).toBeUndefined();
    expect(selectArticleComponentTranslation(training, withFields("training-route-comparison", (fields) => { fields.extra = "余分"; }))).toBeUndefined();
    // Stored values are returned untrimmed.
    const spaced = withFields("training-route-comparison", (fields) => { fields["rows.technical-intern-training.2"] = " （移行措置を含む）"; });
    expect(selectArticleComponentTranslation(training, spaced)?.["rows.technical-intern-training.2"]).toBe(" （移行措置を含む）");
  });

  it("rejects practical paragraphs without a label, with protected markup, or with different link targets", () => {
    const practical = english("japan-practical-basics");
    const emergencies = artifact("japan-practical-basics").fields["paragraphs.emergencies"]!;
    for (const value of [
      "時刻：日本は日本標準時を使用します。",
      "**時刻：**",
      "**時刻：**日本は<span>日本標準時</span>を使用します。",
    ]) {
      expect(selectArticleComponentTranslation(practical, withFields("japan-practical-basics", (fields) => { fields["paragraphs.time"] = value; })), value).toBeUndefined();
    }
    const swapped = emergencies.replace("/articles/calling-police-fire-and-ambulance-services-in-japan", "__FIRST__")
      .replace("/articles/preparing-for-disasters-and-evacuation-in-japan", "/articles/calling-police-fire-and-ambulance-services-in-japan")
      .replace("__FIRST__", "/articles/preparing-for-disasters-and-evacuation-in-japan");
    expect(selectArticleComponentTranslation(practical, withFields("japan-practical-basics", (fields) => { fields["paragraphs.emergencies"] = swapped; }))).toBeUndefined();
    const missingLink = emergencies.replace(/\[災害・避難のガイド\]\([^)]+\)/, "災害・避難のガイド");
    expect(selectArticleComponentTranslation(practical, withFields("japan-practical-basics", (fields) => { fields["paragraphs.emergencies"] = missingLink; }))).toBeUndefined();
  });
});
