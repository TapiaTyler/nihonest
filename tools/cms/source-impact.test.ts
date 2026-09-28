import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { sources } from "@/data/sources";
import { loadArticleSourceMetadata } from "@/lib/source-monitoring/article-source-metadata";
import { buildRepositorySourceRegistry } from "@/lib/source-monitoring/repository-source-registry";
import { buildCmsSourceImpactCatalog, CMS_SOURCE_IMPACT_COVERAGE_NOTE } from "./source-impact";

describe("CMS source impact", () => {
  it("matches the repository graph for source dependents and includes source identity", async () => {
    const articles = await loadArticleSourceMetadata(resolve(process.cwd(), "content/articles"));
    const repositoryRegistry = buildRepositorySourceRegistry(articles);
    const catalog = buildCmsSourceImpactCatalog(articles);
    const expected = repositoryRegistry.graph.find(({ sourceId }) => sourceId === "isa-artist-status");
    const actual = catalog.sources.find(({ id }) => id === "isa-artist-status");
    const source = sources.find(({ id }) => id === "isa-artist-status");

    expect(expected).toBeDefined();
    expect(source).toBeDefined();
    expect(actual).toMatchObject({
      id: source!.id,
      title: source!.title,
      organization: source!.organization,
      url: source!.url,
      dependents: expected!.dependents,
    });
    expect(catalog.findings).toEqual(repositoryRegistry.findings);
    expect(catalog.coverageNote).toBe(CMS_SOURCE_IMPACT_COVERAGE_NOTE);
    expect(catalog.coverageNote).toMatch(/FAQs are not represented/);
  });

  it("resolves article source IDs back to source details and reports partial or unknown coverage", async () => {
    const articles = await loadArticleSourceMetadata(resolve(process.cwd(), "content/articles"));
    const article = articles.find(({ id }) => id === "artist-status");
    expect(article).toBeDefined();
    const catalog = buildCmsSourceImpactCatalog(articles);

    const inverse = catalog.findContentSources({
      kind: "article",
      id: article!.id,
      declaredSourceIds: article!.sourceIds,
    });
    expect(inverse.coverage).toBe("complete");
    expect(inverse.sourceIds).toEqual([...article!.sourceIds].sort());
    expect(inverse.sources.map(({ id }) => id)).toEqual([...article!.sourceIds].sort());
    expect(inverse.sources.find(({ id }) => id === "isa-artist-status")).toMatchObject({
      title: "Status of residence: Artist",
      url: "https://www.moj.go.jp/isa/applications/status/artist.html",
    });

    const missingDeclaration = catalog.findContentSources({ kind: "article", id: article!.id });
    expect(missingDeclaration.coverage).toBe("partial");
    expect(missingDeclaration.note).toMatch(/declared source IDs were not supplied/);

    const unknownReference = catalog.findContentSources({
      kind: "article",
      id: article!.id,
      declaredSourceIds: [...article!.sourceIds, "missing-source-id"],
    });
    expect(unknownReference.coverage).toBe("partial");
    expect(unknownReference.unknownSourceIds).toEqual(["missing-source-id"]);
    expect(unknownReference.note).toMatch(/Unknown source IDs/);

    expect(catalog.findContentSources({ kind: "article", id: "not-an-article", declaredSourceIds: [] }).coverage)
      .toBe("unknown");
    const faq = catalog.findContentSources({ kind: "faq", id: "any-faq", declaredSourceIds: [] });
    expect(faq.coverage).toBe("unknown");
    expect(faq.note).toMatch(/FAQs are not represented/);
  });
});
