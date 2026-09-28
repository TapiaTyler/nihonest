// @vitest-environment node
import { execFileSync } from "node:child_process";
import { cp, mkdtemp, readFile, readdir, realpath, rm } from "node:fs/promises";
import { basename, join, resolve, sep } from "node:path";
import { tmpdir } from "node:os";
import { describe, expect, it } from "vitest";
import { readArticleCatalog } from "./catalog";
import { planArticleCreation, createArticle } from "./article-creator";
import { approveArticleReview, changeArticleStatus } from "./editorial-writer";
import { startGitSession } from "./git-session";
import { saveArticleBody } from "./article-writer";
import { createRecord, planRecordCreation } from "./record-creator";
import { replaceSource } from "./structured-writer";

const repo = resolve(import.meta.dirname, "../..");
const today = new Date().toISOString().slice(0, 10);
const registry = "src/lib/content/article-registry/transport-safety-and-daily-life.ts";

// Retry once: under parallel test load on Windows, antivirus scanning new objects can briefly deny Git's writes.
function git(root: string, ...args: string[]) {
  try { execFileSync("git", args, { cwd: root, stdio: "ignore" }); }
  catch { execFileSync("git", args, { cwd: root, stdio: "ignore" }); }
}

async function fixture() {
  const root = await mkdtemp(join(tmpdir(), "nihonest-cms-concurrency-"));
  await cp(resolve(repo, "content/articles"), resolve(root, "content/articles"), { recursive: true });
  await cp(resolve(repo, "src/lib/content/article-registry"), resolve(root, "src/lib/content/article-registry"), { recursive: true });
  await cp(resolve(repo, "src/data/sources"), resolve(root, "src/data/sources"), { recursive: true });
  git(root, "init", "-q");
  git(root, "config", "user.email", "cms-test@example.invalid");
  git(root, "config", "user.name", "CMS concurrency test");
  git(root, "config", "core.autocrlf", "false");
  // Commit only the modules the tests write; new article files are created during the session, and a small
  // commit avoids the parallel-load failures a full copy of the article catalog caused.
  git(root, "add", "src");
  git(root, "commit", "-q", "-m", "fixture baseline");
  await startGitSession(root);
  return root;
}

async function removeFixture(root: string) {
  if (!resolve(root).startsWith(`${await realpath(tmpdir())}${sep}`) || !basename(root).startsWith("nihonest-cms-concurrency-")) {
    throw new Error("Refusing to remove a fixture outside the temporary directory.");
  }
  await rm(root, { recursive: true, force: true });
}

const sourceFields = (id: string, family: string) => ({
  id, family, organization: "Concurrency Fixture", title: "Concurrency fixture source",
  url: `https://www.example.go.jp/${id}`, authorityLevel: "national-government", language: "en",
});

const articleFields = (id: string) => ({
  id, family: "transport-safety-and-daily-life", title: "Concurrency fixture article", description: "A fixture.",
  journeyStageIds: ["living-in-japan"], topicIds: ["daily-life"], geographicScopes: ["national"], importance: "informational",
  contentType: "guide", status: "draft", body: "## Fixture section\n\nInitial body.",
});

// Fixtures copy the article catalog and run Git, which can exceed the 5-second default under full-suite load.
describe("CMS write concurrency", { timeout: 30_000 }, () => {
  it("keeps an approval bound to the winning revision when a status change competes", async () => {
    const root = await fixture();
    try {
      const id = "cms-race-review-status";
      const fields = { ...articleFields(id), status: "needs-review" };
      const plan = await planArticleCreation(root, fields, today);
      await createArticle(root, fields, plan.registrySourceRevision, today);
      const original = (await readArticleCatalog(root)).details.get(id)!;
      const results = await Promise.allSettled([
        approveArticleReview(root, id, {
          expectedRevision: original.summary.revision, reviewedAt: today, explicitHumanApproval: true,
          changeNote: "Fixture review only.", approvalNote: "Fixture approval only.",
          validationPerformed: ["Concurrency fixture"], sourceReviewIds: [],
        }),
        changeArticleStatus(root, id, { expectedRevision: original.summary.revision, status: "draft" }),
      ]);
      expect(results.filter((result) => result.status === "fulfilled")).toHaveLength(1);
      expect(results.filter((result) => result.status === "rejected" && (result.reason as { status?: number }).status === 409)).toHaveLength(1);
      const saved = (await readArticleCatalog(root)).details.get(id)!;
      const approvals = await readdir(resolve(root, "content/editorial-reviews")).catch(() => []);
      const approved = results[0]!.status === "fulfilled";
      expect(saved.metadata.status).toBe(approved ? "verified" : "draft");
      expect(approvals).toHaveLength(approved ? 1 : 0);
      if (approved) {
        const record = JSON.parse(await readFile(resolve(root, "content/editorial-reviews", approvals[0]!), "utf8"));
        expect(record.contentRevision).toBe(saved.summary.editorialRevision);
      }
    } finally { await removeFixture(root); }
  });
  it("serializes replacements that started from the same original and preserves neighboring source", async () => {
    const root = await fixture();
    try {
      const target = resolve(root, "src/data/sources/daily-life-safety.ts");
      const neighbor = resolve(root, "src/data/sources/tax-business-consumer.ts");
      const original = await readFile(target, "utf8");
      const neighborBefore = await readFile(neighbor, "utf8");
      const nextA = `${original}\n// concurrent winner A\n`;
      const nextB = `${original}\n// concurrent winner B\n`;
      const results = await Promise.allSettled([
        replaceSource(root, target, original, nextA),
        replaceSource(root, target, original, nextB),
      ]);
      expect(results.filter((result) => result.status === "fulfilled")).toHaveLength(1);
      expect(results.filter((result) => result.status === "rejected" && (result.reason as { status?: number }).status === 409)).toHaveLength(1);
      expect([nextA, nextB]).toContain(await readFile(target, "utf8"));
      expect(await readFile(neighbor, "utf8")).toBe(neighborBefore);
    } finally { await removeFixture(root); }
  });

  it("allows only one article body or status change from the same revision", async () => {
    const root = await fixture();
    try {
      const id = "cms-race-body-status";
      const fields = articleFields(id);
      const plan = await planArticleCreation(root, fields, today);
      await createArticle(root, fields, plan.registrySourceRevision, today);
      const original = (await readArticleCatalog(root)).details.get(id)!;
      const results = await Promise.allSettled([
        saveArticleBody(root, id, { expectedRevision: original.summary.revision, body: "## Fixture section\n\nEdited body.", updatedAt: today }),
        changeArticleStatus(root, id, { expectedRevision: original.summary.revision, status: "needs-review" }),
      ]);
      expect(results.filter((result) => result.status === "fulfilled")).toHaveLength(1);
      expect(results.filter((result) => result.status === "rejected" && (result.reason as { status?: number }).status === 409)).toHaveLength(1);
      const saved = (await readArticleCatalog(root)).details.get(id)!;
      expect(saved.metadata.status === "needs-review" || saved.body.includes("Edited body.")).toBe(true);
      expect(await readFile(resolve(root, registry), "utf8")).toContain(plan.entryLine);
    } finally { await removeFixture(root); }
  });

  it("rejects concurrent duplicate source IDs across different families", async () => {
    const root = await fixture();
    try {
      const id = "cms-race-source-shared-id";
      const fieldsA = sourceFields(id, "daily-life-safety");
      const fieldsB = sourceFields(id, "tax-business-consumer");
      const [planA, planB] = await Promise.all([
        planRecordCreation(root, "source", fieldsA, today),
        planRecordCreation(root, "source", fieldsB, today),
      ]);
      const results = await Promise.allSettled([
        createRecord(root, "source", fieldsA, planA.sourceRevision, today),
        createRecord(root, "source", fieldsB, planB.sourceRevision, today),
      ]);
      expect(results.filter((result) => result.status === "fulfilled")).toHaveLength(1);
      expect(results.filter((result) => result.status === "rejected" && (result.reason as { status?: number }).status === 422)).toHaveLength(1);
      const sourceFiles = await Promise.all(["daily-life-safety", "tax-business-consumer"].map(async (family) =>
        readFile(resolve(root, `src/data/sources/${family}.ts`), "utf8")));
      expect(sourceFiles.filter((source) => source.includes(`id: "${id}"`))).toHaveLength(1);
    } finally { await removeFixture(root); }
  });

  it("allows one of two different articles targeting the same registry revision", async () => {
    const root = await fixture();
    try {
      const fieldsA = articleFields("cms-race-registry-first");
      const fieldsB = articleFields("cms-race-registry-second");
      const [planA, planB] = await Promise.all([
        planArticleCreation(root, fieldsA, today),
        planArticleCreation(root, fieldsB, today),
      ]);
      const results = await Promise.allSettled([
        createArticle(root, fieldsA, planA.registrySourceRevision, today),
        createArticle(root, fieldsB, planB.registrySourceRevision, today),
      ]);
      expect(results.filter((result) => result.status === "fulfilled")).toHaveLength(1);
      expect(results.filter((result) => result.status === "rejected" && (result.reason as { status?: number }).status === 409)).toHaveLength(1);
      const registryAfter = await readFile(resolve(root, registry), "utf8");
      const mdxNames = await readdir(resolve(root, "content/articles"));
      const succeeded = results.findIndex((result) => result.status === "fulfilled") === 0 ? fieldsA.id : fieldsB.id;
      const orphan = results.findIndex((result) => result.status === "fulfilled") === 0 ? fieldsB.id : fieldsA.id;
      expect(registryAfter).toContain(`/${succeeded}.mdx\"`);
      expect(registryAfter).not.toContain(`/${orphan}.mdx\"`);
      expect(mdxNames).toContain(`${succeeded}.mdx`);
      expect(mdxNames).not.toContain(`${orphan}.mdx`);
    } finally { await removeFixture(root); }
  });
});
