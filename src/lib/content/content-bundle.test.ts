import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { articleGroups, guidedJourneys } from "@/data/discovery";
import { faqs } from "@/data/faqs";
import { glossaryTerms } from "@/data/glossary";
import { residenceStatuses } from "@/data/residence-statuses";
import { sources } from "@/data/sources";
import { articleBlockSchema } from "@/domain/article/article-blocks";
import { bundledArticleSchema, bundledArticleTranslationSchema } from "@/domain/content-bundle/content-bundle";
import { buildContentBundle } from "./content-bundle";

const articleDirectory = resolve(process.cwd(), "content/articles");

describe("public content bundle", () => {
  it("converts every canonical article and current translation into schema-valid portable blocks", async () => {
    const { manifest, files } = await buildContentBundle({ articleDirectory, generatedAt: "2026-09-23T00:00:00.000Z" });
    const articles = bundledArticleSchema.array().parse(JSON.parse(files.get("articles.en.json")!));
    const translations = bundledArticleTranslationSchema.array().parse(JSON.parse(files.get("article-translations.ja.json")!));

    expect(articles.length).toBeGreaterThan(90);
    expect(new Set(articles.map(({ metadata }) => metadata.id)).size).toBe(articles.length);
    expect(translations.every(({ articleId }) => articles.some(({ metadata }) => metadata.id === articleId))).toBe(true);
    for (const { blocks } of [...articles, ...translations]) {
      for (const block of blocks) expect(() => articleBlockSchema.parse(block)).not.toThrow();
    }
    expect(manifest.files.map(({ path }) => path).sort()).toEqual([...files.keys()].sort());
  });

  it("derives the catalog version from content only", async () => {
    const first = await buildContentBundle({ articleDirectory, generatedAt: "2026-09-23T00:00:00.000Z" });
    const second = await buildContentBundle({ articleDirectory, generatedAt: "2026-09-24T12:00:00.000Z" });
    expect(second.manifest.catalogVersion).toBe(first.manifest.catalogVersion);
  });
  it("keeps catalogs plain JSON so clients receive exactly the canonical records", async () => {
    const { files } = await buildContentBundle({ articleDirectory, generatedAt: "2026-09-23T00:00:00.000Z" });
    const catalogs = { "glossary.en.json": glossaryTerms, "faqs.en.json": faqs, "sources.en.json": sources, "residence-statuses.en.json": residenceStatuses, "article-groups.en.json": articleGroups, "journeys.en.json": guidedJourneys };
    for (const [path, records] of Object.entries(catalogs)) {
      expect(JSON.parse(files.get(path)!), path).toStrictEqual(JSON.parse(JSON.stringify(records)));
      expect(JSON.parse(files.get(path)!), path).toEqual(records);
    }
  });
});
