import { createHash } from "node:crypto";
import { resolve } from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import { contentBundleVersionInput, verifyContentBundle } from "@/domain/content-bundle/content-bundle-integrity";
import { buildContentBundle, type ContentBundle } from "./content-bundle";

const sha256 = (text: string) => createHash("sha256").update(text, "utf8").digest("hex");
let bundle: ContentBundle;
beforeAll(async () => {
  bundle = await buildContentBundle({ articleDirectory: resolve("content/articles"), generatedAt: "2026-09-30T00:00:00.000Z" });
});

function verifyChanged(path: string, mutate: (records: Record<string, unknown>[]) => void) {
  const manifest = structuredClone(bundle.manifest);
  const files = new Map(bundle.files);
  const records = JSON.parse(files.get(path)!);
  mutate(records);
  const json = `${JSON.stringify(records)}\n`;
  files.set(path, json);
  manifest.files.find((file) => file.path === path)!.checksum = sha256(json);
  manifest.catalogVersion = sha256(contentBundleVersionInput(manifest.files));
  return () => verifyContentBundle(manifest, files, sha256);
}

describe("portable catalog relationships", () => {
  it("accepts canonical relationships without changing serialized content or review metadata", () => {
    const manifest = structuredClone(bundle.manifest);
    const files = new Map(bundle.files);
    expect(verifyContentBundle(manifest, files, sha256)).toEqual(bundle.manifest);
    expect(files).toEqual(bundle.files);
  });
  it.each(["source", "term", "status", "relationship", "self", "slug"])(
    "rejects an invalid article %s even when checksums match", (mode) => {
      const verify = verifyChanged("articles.en.json", (records) => {
        const first = records[0]!.metadata as Record<string, unknown>;
        if (mode === "source") first.sourceIds = ["unknown-source"];
        if (mode === "term") first.termIds = ["unknown-term"];
        if (mode === "status") first.residenceStatusIds = ["unknown-status"];
        if (mode === "relationship") first.relationships = [{ type: "related", articleId: "unknown-article" }];
        if (mode === "self") first.relationships = [{ type: "related", articleId: first.id }];
        if (mode === "slug") first.slug = (records[1]!.metadata as Record<string, unknown>).slug;
      });
      expect(verify).toThrow(mode === "self" ? "cannot relate to itself" : mode === "slug" ? "slugs must be unique" : "references unknown");
    });
  it.each(["source", "article", "term", "self", "slug"])(
    "rejects an invalid glossary %s even when checksums match", (mode) => {
      const verify = verifyChanged("glossary.en.json", (records) => {
        const first = records[0]!;
        if (mode === "source") first.sourceIds = ["unknown-source"];
        if (mode === "article") first.relatedArticleIds = ["unknown-article"];
        if (mode === "term") first.relatedTermIds = ["unknown-term"];
        if (mode === "self") first.relatedTermIds = [first.id];
        if (mode === "slug") first.slug = records[1]!.slug;
      });
      expect(verify).toThrow(mode === "self" ? "cannot relate to itself" : mode === "slug" ? "slugs must be unique" : "references unknown");
    });
  it.each(["relatedArticleIds", "relatedGroupIds", "relatedJourneyIds", "relatedGlossaryTermIds", "relatedResidenceStatusIds", "relatedActivityIds"])(
    "rejects FAQ %s pointing outside the candidate catalogs", (field) => {
      const verify = verifyChanged("faqs.en.json", (records) => { records[0]![field] = ["unknown-target"]; });
      expect(verify).toThrow("references unknown target");
    });
  it("rejects duplicate FAQ slugs with distinct IDs", () => {
    const verify = verifyChanged("faqs.en.json", (records) => { records[0]!.slug = records[1]!.slug; });
    expect(verify).toThrow("FAQ slugs must be unique");
  });
});
