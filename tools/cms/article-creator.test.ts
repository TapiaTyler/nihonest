// @vitest-environment node
import { cp, mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { basename, join, resolve, sep } from "node:path";
import { tmpdir } from "node:os";
import { describe, expect, it } from "vitest";
import { articleCreationOptions, createArticle, planArticleCreation } from "./article-creator";
import { readArticleCatalog } from "./catalog";
import { knownSourceById } from "./known-sources";
import { createRecord, planRecordCreation } from "./record-creator";

const root = resolve(import.meta.dirname, "../..");
const registryPath = "src/lib/content/article-registry/transport-safety-and-daily-life.ts";
const sourcePath = "src/data/sources/daily-life-safety.ts";
const today = "2026-09-28";

async function fixture() {
  const fixtureRoot = await mkdtemp(join(tmpdir(), "nihonest-cms-test-"));
  await cp(resolve(root, "content/articles"), resolve(fixtureRoot, "content/articles"), { recursive: true });
  await cp(resolve(root, "src/lib/content/article-registry"), resolve(fixtureRoot, "src/lib/content/article-registry"), { recursive: true });
  await mkdir(resolve(fixtureRoot, "src/data/sources"), { recursive: true });
  await writeFile(resolve(fixtureRoot, sourcePath), await readFile(resolve(root, sourcePath), "utf8"));
  return fixtureRoot;
}

async function removeFixture(fixtureRoot: string) {
  if (!resolve(fixtureRoot).startsWith(`${resolve(tmpdir())}${sep}`) || !basename(fixtureRoot).startsWith("nihonest-cms-test-")) {
    throw new Error("Refusing to remove a fixture outside the temporary directory.");
  }
  await rm(fixtureRoot, { recursive: true, force: true });
}

const sourceFields = (id: string) => ({
  id, family: "daily-life-safety", organization: "Fixture Agency", title: "Fixture official page",
  url: `https://www.example.go.jp/${id}`, authorityLevel: "national-government", language: "en",
});
export const articleFields = (id: string, sourceIds: string[] = ["jma-emergency-warnings"]) => ({
  id, family: "transport-safety-and-daily-life", title: "A fixture article created in the CMS", description: "A short description of the fixture article.",
  journeyStageIds: ["living-in-japan"], topicIds: ["daily-life"], geographicScopes: ["national"], importance: "informational", contentType: "guide",
  sourceIds, relationships: [{ type: "related", articleId: "preparing-for-disasters-and-evacuation-in-japan" }], status: "draft",
  body: "## First section\n\nThe fixture body links to [a guide](/articles/preparing-for-disasters-and-evacuation-in-japan).",
});

describe("CMS article and source creation", () => {
  it("creates an official source, then an article that cites it, without touching surrounding source", async () => {
    const fixtureRoot = await fixture();
    try {
      const sourceBefore = await readFile(resolve(fixtureRoot, sourcePath), "utf8");
      const sourcePlan = await planRecordCreation(fixtureRoot, "source", sourceFields("cms-fixture-created-source"), today);
      expect(sourcePlan.path).toBe(sourcePath);
      expect(sourcePlan.insertion).toContain('officialSourceSchema.parse({ id: "cms-fixture-created-source", organization: "Fixture Agency"');
      expect(sourcePlan.warnings).toEqual([]);
      await createRecord(fixtureRoot, "source", sourceFields("cms-fixture-created-source"), sourcePlan.sourceRevision, today);
      expect((await readFile(resolve(fixtureRoot, sourcePath), "utf8")).replace(sourcePlan.insertion, "")).toBe(sourceBefore);
      expect(knownSourceById("cms-fixture-created-source")?.title).toBe("Fixture official page");

      const registryBefore = await readFile(resolve(fixtureRoot, registryPath), "utf8");
      const fields = articleFields("cms-fixture-created-article", ["cms-fixture-created-source"]);
      const plan = await planArticleCreation(fixtureRoot, fields, today);
      expect(plan).toMatchObject({ mdxPath: "content/articles/cms-fixture-created-article.mdx", registryPath });
      expect(plan.importLine).toBe('import CmsFixtureCreatedArticle, { metadata as cmsFixtureCreatedArticleMetadata } from "../../../../content/articles/cms-fixture-created-article.mdx";');
      expect(plan.entryLine).toBe("  [cmsFixtureCreatedArticleMetadata, CmsFixtureCreatedArticle],");
      expect(plan.warnings[0]).toContain("not in any article group or guided journey");
      expect(plan.mdxText).toContain('  relationships: [{ type: "related", articleId: "preparing-for-disasters-and-evacuation-in-japan" }],');
      expect(await readFile(resolve(fixtureRoot, plan.mdxPath)).catch(() => null)).toBeNull();
      const created = await createArticle(fixtureRoot, fields, plan.registrySourceRevision, today);
      expect(created).toMatchObject({ created: true, id: "cms-fixture-created-article", path: plan.mdxPath });
      expect(await readFile(resolve(fixtureRoot, plan.mdxPath), "utf8")).toBe(plan.mdxText);
      const registryAfter = await readFile(resolve(fixtureRoot, registryPath), "utf8");
      expect(registryAfter).toContain(plan.importLine);
      expect(registryAfter).toContain(plan.entryLine);
      // Only the import line and the registration entry were added.
      const newline = registryBefore.includes("\r\n") ? "\r\n" : "\n";
      expect(registryAfter.replace(`${newline}${plan.importLine}`, "").replace(`${newline}${plan.entryLine}`, "")).toBe(registryBefore);
      const article = (await readArticleCatalog(fixtureRoot)).details.get("cms-fixture-created-article");
      expect(article?.metadata).toMatchObject({ status: "draft", createdAt: today, updatedAt: today, slug: "cms-fixture-created-article" });
      expect(article?.metadata.lastReviewedAt).toBeUndefined();
      expect(article?.summary.translation).toBe("missing");
      expect(article?.sources[0]?.title).toBe("Fixture official page");
      expect(article?.summary.revision).toBe(plan.revision);
    } finally { await removeFixture(fixtureRoot); }
  });

  it("rejects conflicts, unknown references, unsupported bodies, verified status, and stale previews", async () => {
    const fixtureRoot = await fixture();
    try {
      await expect(planRecordCreation(fixtureRoot, "source", { ...sourceFields("jma-emergency-warnings") }, today)).rejects.toMatchObject({ status: 422, message: "Source IDs must be unique." });
      await expect(planRecordCreation(fixtureRoot, "source", { ...sourceFields("cms-fixture-http"), url: "http://www.example.go.jp/" }, today)).rejects.toMatchObject({ status: 422 });
      await expect(planRecordCreation(fixtureRoot, "source", { ...sourceFields("cms-fixture-no-family"), family: "no-such-family" }, today)).rejects.toMatchObject({ status: 422, message: expect.stringContaining("source family") });
      const existingUrl = (await planRecordCreation(fixtureRoot, "source", { ...sourceFields("cms-fixture-same-url"), url: knownSourceById("jma-emergency-warnings")!.url }, today)).warnings;
      expect(existingUrl[0]).toContain("jma-emergency-warnings");
      await expect(planArticleCreation(fixtureRoot, articleFields("preparing-for-disasters-and-evacuation-in-japan"), today)).rejects.toMatchObject({ status: 422, message: "Article IDs must be unique." });
      await expect(planArticleCreation(fixtureRoot, articleFields("cms-fixture-bad-source", ["no-such-source"]), today)).rejects.toMatchObject({ status: 422, message: expect.stringContaining("no-such-source") });
      await expect(planArticleCreation(fixtureRoot, { ...articleFields("cms-fixture-bad-link"), relationships: [{ type: "related", articleId: "no-such-article" }] }, today)).rejects.toMatchObject({ status: 422, message: expect.stringContaining("no-such-article") });
      await expect(planArticleCreation(fixtureRoot, { ...articleFields("cms-fixture-script"), body: "<script>alert(1)</script>" }, today)).rejects.toMatchObject({ status: 422 });
      await expect(planArticleCreation(fixtureRoot, { ...articleFields("cms-fixture-inline-expression"), body: "A paragraph with {not valid JavaScript}." }, today)).rejects.toMatchObject({ status: 422, message: expect.stringMatching(/line 1, column \d+/) });
      await expect(planArticleCreation(fixtureRoot, { ...articleFields("cms-fixture-verified"), status: "verified" }, today)).rejects.toMatchObject({ status: 422, message: expect.stringContaining("Draft or Editorial review") });
      await expect(planArticleCreation(fixtureRoot, { ...articleFields("cms-fixture-dated"), lastReviewedAt: today }, today)).rejects.toMatchObject({ status: 422, message: expect.stringContaining("lastReviewedAt cannot be set") });
      await expect(planArticleCreation(fixtureRoot, { ...articleFields("cms-fixture-family"), family: "registration" }, today)).rejects.toMatchObject({ status: 422 });
      const fields = articleFields("cms-fixture-stale-registry");
      const plan = await planArticleCreation(fixtureRoot, fields, today);
      await writeFile(resolve(fixtureRoot, registryPath), `${await readFile(resolve(fixtureRoot, registryPath), "utf8")}\n// changed after preview\n`);
      await expect(createArticle(fixtureRoot, fields, plan.registrySourceRevision, today)).rejects.toMatchObject({ status: 409 });
      expect(await readFile(resolve(fixtureRoot, plan.mdxPath)).catch(() => null)).toBeNull();
      await writeFile(resolve(fixtureRoot, "content/articles/cms-fixture-existing-file.mdx"), "stray file");
      await expect(planArticleCreation(fixtureRoot, articleFields("cms-fixture-existing-file"), today)).rejects.toMatchObject({ status: 409 });
    } finally { await removeFixture(fixtureRoot); }
  });

  it("lists article choices from the taxonomy and the registry directory", async () => {
    const options = await articleCreationOptions(root);
    expect(options.registryFamilies).toContain("transport-safety-and-daily-life");
    expect(options.registryFamilies).not.toContain("registration");
    expect(options.contentTypes).toContain("guide");
    expect(options.relationshipTypes).toEqual(["related", "prerequisite", "next-step"]);
  });
});
