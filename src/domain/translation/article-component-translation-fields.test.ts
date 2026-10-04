import { describe, expect, it } from "vitest";
import { japaneseArticleComponentTranslations } from "@/data/translations/ja/article-components";
import { residenceApplicationFeesComponent } from "@/data/article-components";
import { articleComponentEnglishFixture } from "@/lib/content/article-component-english.fixture";
import { areArticleComponentTranslationFieldsValid } from "./article-component-translation-fields";
import type { ArticleComponentSource } from "./translation-source-fields";

const sources: readonly ArticleComponentSource[] = [...articleComponentEnglishFixture, residenceApplicationFeesComponent];
const component = (kind: ArticleComponentSource["kind"]) => sources.find((source) => source.kind === kind)!;
const fields = (kind: ArticleComponentSource["kind"]) => japaneseArticleComponentTranslations.find(({ contentId }) => contentId === kind)!.fields;
const valid = (kind: ArticleComponentSource["kind"], changes: Readonly<Record<string, string | undefined>>) => {
  const next: Record<string, string> = { ...fields(kind) };
  for (const [key, value] of Object.entries(changes)) {
    if (value === undefined) delete next[key];
    else next[key] = value;
  }
  return areArticleComponentTranslationFieldsValid(component(kind), next);
};

describe("areArticleComponentTranslationFieldsValid", () => {
  it("accepts every current artifact as stored", () => {
    for (const source of sources) expect(areArticleComponentTranslationFieldsValid(source, fields(source.kind))).toBe(true);
  });

  it("requires exactly the English field keys", () => {
    expect(valid("tax-residence-scope", { caption: undefined })).toBe(false);
    expect(valid("tax-residence-scope", { "rows.extra.0": "追加" })).toBe(false);
    expect(valid("tax-residence-scope", { caption: undefined, "rows.extra.0": "追加" })).toBe(false);
  });

  it("rejects blank table values but keeps untrimmed text", () => {
    expect(valid("tax-residence-scope", { "headers.0": "  " })).toBe(false);
    expect(valid("tax-residence-scope", { "headers.0": " 税務上の居住者区分 " })).toBe(true);
  });

  it("keeps empty English route suffixes exactly empty and non-empty ones visible", () => {
    expect(valid("training-route-comparison", { "rows.student.2": " " })).toBe(false);
    expect(valid("training-route-comparison", { "rows.student.2": "（補足）" })).toBe(false);
    expect(valid("training-route-comparison", { "rows.technical-intern-training.2": "" })).toBe(false);
  });

  it("requires practical paragraphs to keep grammar, label, body, and ordered link targets", () => {
    const emergencies = fields("japan-practical-basics")["paragraphs.emergencies"]!;
    expect(valid("japan-practical-basics", { "paragraphs.time": "日本は日本標準時を使用します。" })).toBe(false);
    expect(valid("japan-practical-basics", { "paragraphs.time": "**時刻：**" })).toBe(false);
    expect(valid("japan-practical-basics", { "paragraphs.time": "**時刻：**日本標準時`閉じていないコード" })).toBe(false);
    const swapped = emergencies.replace("/articles/calling-police-fire-and-ambulance-services-in-japan", "__first__")
      .replace("/articles/preparing-for-disasters-and-evacuation-in-japan", "/articles/calling-police-fire-and-ambulance-services-in-japan")
      .replace("__first__", "/articles/preparing-for-disasters-and-evacuation-in-japan");
    expect(valid("japan-practical-basics", { "paragraphs.emergencies": swapped })).toBe(false);
    expect(valid("japan-practical-basics", { "paragraphs.emergencies": emergencies.replace(/\]\([^)]+\)/, "](/articles/other)") })).toBe(false);
  });

  it("requires fee copy to keep exactly the English placeholders, in any order", () => {
    const previous = fields("residence-application-fees")["messages.previous-schedule"]!;
    expect(valid("residence-application-fees", { "messages.previous-schedule": previous.replace("{previousOnline}", "5,500円") })).toBe(false);
    expect(valid("residence-application-fees", { "messages.heading": "手数料{reducedFee}" })).toBe(false);
    expect(valid("residence-application-fees", { "messages.previous-schedule": previous.replace("{previousFrom}", "{previousTemp}").replace("{previousThrough}", "{previousFrom}").replace("{previousTemp}", "{previousThrough}") })).toBe(true);
    expect(valid("residence-application-fees", { "messages.fraud-label": " " })).toBe(false);
  });
});
