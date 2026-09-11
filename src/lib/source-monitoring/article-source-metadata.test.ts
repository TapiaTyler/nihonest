import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { parseArticleSourceMetadata, loadArticleSourceMetadata } from "@/lib/source-monitoring/article-source-metadata";
import { buildRepositorySourceRegistry } from "@/lib/source-monitoring/repository-source-registry";

describe("article source metadata reader", () => {
  it("reads only the required metadata fields from MDX", () => {
    expect(parseArticleSourceMetadata(`
      export const metadata = {
        id: "example-guide",
        title: "Example guide",
        sourceIds: ["official-example"],
        importance: "important",
        topicIds: ["immigration"],
        body: { ignored: true },
      };
      # Article
    `)).toEqual({
      id: "example-guide",
      title: "Example guide",
      sourceIds: ["official-example"],
      importance: "important",
      topicIds: ["immigration"],
    });
  });

  it("builds an error-free registry from the repository article catalog", async () => {
    const articles = await loadArticleSourceMetadata(resolve(process.cwd(), "content/articles"));
    const registry = buildRepositorySourceRegistry(articles);

    expect(articles.length).toBeGreaterThan(0);
    expect(registry.findings.filter(({ severity }) => severity === "error")).toEqual([]);
  });
});
