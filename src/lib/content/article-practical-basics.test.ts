import { resolve } from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import { articlePracticalBasicsSchema, validateArticlePracticalBasics, type ArticlePracticalBasics } from "@/domain/article/article-practical-basics";
import { readCanonicalArticleSources } from "./content-bundle";
import { japanPracticalBasicsComponent } from "@/data/article-components";
import { articleComponentEnglishFixture } from "./article-component-english.fixture";

let content: ArticlePracticalBasics;
let slugs: string[];
beforeAll(async () => {
  content = articlePracticalBasicsSchema.parse(japanPracticalBasicsComponent);
  expect(content).toEqual(japanPracticalBasicsComponent);
  const fixture = articleComponentEnglishFixture.find(({ kind }) => kind === "japan-practical-basics")!;
  expect({ kind: content.kind, paragraphs: content.paragraphs }).toEqual(fixture);
  slugs = (await readCanonicalArticleSources(resolve("content/articles"))).map(({ article }) => article.metadata.slug);
});

describe("Stage-C English-only v2 practical basics", () => {
  it("preserves canonical English labels, spacing, paragraph order and linked targets", () => {
    expect(validateArticlePracticalBasics(content, slugs)).toEqual(content);
    expect(content.paragraphs.map(({ id }) => id)).toEqual(["time", "money", "measurements", "emergencies"]);
    expect(JSON.parse(JSON.stringify(content))).toEqual(content);
  });

  it.each(["version", "locale", "id", "duplicate", "unknown"])("rejects ambiguous or old %s records", (mode) => {
    const copy = JSON.parse(JSON.stringify(content));
    if (mode === "version") copy.schemaVersion = 1;
    if (mode === "locale") copy.paragraphs[0].ja = "Japanese belongs to artifacts";
    if (mode === "id") copy.paragraphs[0].id = "bad id";
    if (mode === "duplicate") copy.paragraphs.push(copy.paragraphs[0]);
    if (mode === "unknown") copy.approved = true;
    expect(() => articlePracticalBasicsSchema.parse(copy)).toThrow();
  });

  it.each([
    "Plain body without a label", "**Label:**", "**Label:**   ", "** ** body",
    "**Label:** <script>unsafe</script>", "**Label:** **unclosed", "**Label:** [ ]",
    "**Label:** [outside](https://example.com)", "**Label:** [outside](//example.com)",
    "**Label:** [outside](/account)",
  ])("rejects invalid body/label/grammar/target %j", (text) => {
    const copy = structuredClone(content);
    copy.paragraphs[0]!.text = text;
    expect(() => articlePracticalBasicsSchema.parse(copy)).toThrow();
  });

  it("validates links by canonical slug and preserves inline source without trimming", () => {
    const copy = structuredClone(content);
    copy.paragraphs = [{ id: "fixture", text: "**Label:**  [visible label](/articles/public-slug)  " }];
    expect(validateArticlePracticalBasics(copy, ["public-slug"])).toEqual(copy);
    expect(() => validateArticlePracticalBasics(copy, ["different-record-id"])).toThrow("unknown article slug");
  });
});
