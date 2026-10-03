import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import { currentJapaneseArticleTranslations } from "@/data/translations/ja/article-translations";
import { bundledArticleArtifactSchema } from "@/domain/content-bundle/article-provenance";
import { contentBundleVersionInput, verifyContentBundle } from "@/domain/content-bundle/content-bundle-integrity";
import { getArticleTranslation } from "./translations";
import { articleSourceRevision, readCanonicalArticleSources, currentArticleTranslationArtifacts, buildContentBundle, type ContentBundle } from "./content-bundle";

const directory = resolve("content/articles");
const sha256 = (text: string) => createHash("sha256").update(text, "utf8").digest("hex");
let bundle: ContentBundle;
let canonical: Awaited<ReturnType<typeof readCanonicalArticleSources>>;
beforeAll(async () => {
  canonical = await readCanonicalArticleSources(directory);
  bundle = await buildContentBundle({ articleDirectory: directory, generatedAt: "2026-09-30T00:00:00.000Z" });
});
describe("article provenance bundle", () => {
  it("preserves all source revisions and complete active current artifacts in registration order", () => {
    expect(JSON.parse(bundle.files.get("article-provenance.en.json")!)).toEqual(
      canonical.map(({ article, sourceRevision }) => ({ id: article.metadata.id, sourceRevision })));
    const expected = currentJapaneseArticleTranslations.filter((artifact) => artifact.availability === "active"
      && artifact.targetLocale === "ja" && canonical.some(({ article, sourceRevision }) =>
        article.metadata.id === artifact.contentId && sourceRevision === artifact.sourceRevision));
    const actual = JSON.parse(bundle.files.get("article-translation-artifacts.ja.json")!);
    expect(actual).toEqual(expected);
    for (const artifact of expected) expect(artifact).toEqual(getArticleTranslation(artifact.contentId, "ja"));
  });
  it("hashes the whole normalized MDX source independently of portable rendering", async () => {
    for (const file of (await readdir(directory)).filter((name) => name.endsWith(".mdx"))) {
      const source = await readFile(resolve(directory, file), "utf8");
      const expected = sha256(JSON.stringify({ source: source.replace(/\r\n?/g, "\n") }));
      expect(articleSourceRevision(source)).toBe(expected);
      expect(articleSourceRevision(source.replace(/\r\n?/g, "\n").replaceAll("\n", "\r\n"))).toBe(expected);
      expect(canonical.some(({ sourceRevision }) => sourceRevision === expected)).toBe(true);
    }
  });
  it("omits missing, source-stale, inactive and other-locale artifacts without mutating evidence", () => {
    const artifact = currentJapaneseArticleTranslations[0]!;
    const before = structuredClone(artifact);
    expect(currentArticleTranslationArtifacts(canonical, [artifact])).toEqual([artifact]);
    expect(currentArticleTranslationArtifacts([], [artifact])).toEqual([]);
    for (const mutation of [{ sourceRevision: "0".repeat(64) }, { availability: "stale" as const }, { targetLocale: "fr" }]) {
      expect(currentArticleTranslationArtifacts(canonical, [{ ...artifact, ...mutation }])).toEqual([]);
    }
    expect(artifact).toEqual(before);
  });
  it("preserves human review evidence only when the existing artifact contract permits it", () => {
    const artifact = currentJapaneseArticleTranslations[0]!;
    const reviewed = { ...artifact, reviewState: "human-reviewed" as const, reviewedAt: "2026-09-30T00:00:00.000Z" };
    expect(currentArticleTranslationArtifacts(canonical, [reviewed])).toEqual([reviewed]);
    expect(bundledArticleArtifactSchema.parse(reviewed)).toEqual(reviewed);
    expect(() => bundledArticleArtifactSchema.parse({ ...reviewed, reviewedAt: undefined })).toThrow();
  });
  it.each(["missing-provenance", "unknown-target", "revision", "title", "body", "review", "missing-artifact", "protected-field", "empty-body", "inactive", "kind"])(
    "rejects %s corruption after recomputing checksums", (mode) => {
      const manifest = structuredClone(bundle.manifest);
      const files = new Map(bundle.files);
      const path = mode === "missing-provenance" ? "article-provenance.en.json" : "article-translation-artifacts.ja.json";
      const records = JSON.parse(files.get(path)!);
      if (mode === "missing-provenance" || mode === "missing-artifact") records.pop();
      if (mode === "unknown-target") records[0].contentId = "unknown-article";
      if (mode === "revision") records[0].sourceRevision = "0".repeat(64);
      if (mode === "title") records[0].fields.title += " changed";
      if (mode === "body") records[0].fields.body += "\n\nChanged body.";
      if (mode === "review") { records[0].reviewState = "human-reviewed"; records[0].reviewedAt = "2026-09-30T00:00:00.000Z"; }
      if (mode === "protected-field") records[0].fields.editorialState = "approved";
      if (mode === "empty-body") records[0].fields.body = " ";
      if (mode === "inactive") records[0].availability = "stale";
      if (mode === "kind") records[0].contentKind = "faq";
      const json = `${JSON.stringify(records)}\n`;
      files.set(path, json);
      const descriptor = manifest.files.find((file) => file.path === path)!;
      descriptor.checksum = sha256(json);
      descriptor.records = records.length;
      manifest.catalogVersion = sha256(contentBundleVersionInput(manifest.files));
      expect(() => verifyContentBundle(manifest, files, sha256)).toThrow();
    });
});
