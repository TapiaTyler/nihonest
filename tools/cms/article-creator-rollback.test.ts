// @vitest-environment node
import { cp, mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { basename, join, resolve, sep } from "node:path";
import { tmpdir } from "node:os";
import { describe, expect, it, vi } from "vitest";

// Make the registry write fail after the MDX file exists, to prove the two writes are undone together.
vi.mock("./structured-writer", async (original) => ({
  ...await original<typeof import("./structured-writer")>(),
  replaceSource: vi.fn(async () => { throw new Error("Simulated registry write failure."); }),
}));

const { createArticle, planArticleCreation } = await import("./article-creator");
const root = resolve(import.meta.dirname, "../..");

// Fixtures copy the article catalog and run Git, which can exceed the 5-second default under full-suite load.
describe("CMS article creation rollback", { timeout: 30_000 }, () => {
  it("removes the new MDX file when the registry write fails", async () => {
    const fixtureRoot = await mkdtemp(join(tmpdir(), "nihonest-cms-test-"));
    try {
      await cp(resolve(root, "content/articles"), resolve(fixtureRoot, "content/articles"), { recursive: true });
      await cp(resolve(root, "src/lib/content/article-registry"), resolve(fixtureRoot, "src/lib/content/article-registry"), { recursive: true });
      const registry = "src/lib/content/article-registry/transport-safety-and-daily-life.ts";
      const before = await readFile(resolve(fixtureRoot, registry), "utf8");
      const articlesBefore = (await readdir(resolve(fixtureRoot, "content/articles"))).sort();
      const fields = {
        id: "cms-fixture-rollback", family: "transport-safety-and-daily-life", title: "Rollback fixture", description: "A rollback fixture.",
        journeyStageIds: ["living-in-japan"], topicIds: ["daily-life"], geographicScopes: ["national"], importance: "informational",
        contentType: "guide", status: "draft", body: "## Section\n\nText.",
      };
      const plan = await planArticleCreation(fixtureRoot, fields, "2026-09-28");
      await expect(createArticle(fixtureRoot, fields, plan.registrySourceRevision, "2026-09-28")).rejects.toThrow("Simulated registry write failure.");
      expect((await readdir(resolve(fixtureRoot, "content/articles"))).sort()).toEqual(articlesBefore);
      expect(await readFile(resolve(fixtureRoot, registry), "utf8")).toBe(before);
    } finally {
      if (!resolve(fixtureRoot).startsWith(`${resolve(tmpdir())}${sep}`) || !basename(fixtureRoot).startsWith("nihonest-cms-test-")) {
        throw new Error("Refusing to remove a fixture outside the temporary directory.");
      }
      await rm(fixtureRoot, { recursive: true, force: true });
    }
  });
});
