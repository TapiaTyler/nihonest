// @vitest-environment node
import { execFileSync } from "node:child_process";
import { once } from "node:events";
import { cp, mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { basename, join, resolve, sep } from "node:path";
import { tmpdir } from "node:os";
import { describe, expect, it } from "vitest";
import { faqSchema } from "@/domain/faq/faq";
import { japaneseTermSchema } from "@/domain/glossary/glossary";
import { startGitSession } from "./git-session";
import { createRecord, creationOptions, planRecordCreation } from "./record-creator";
import { createCmsServer } from "./server";
import { readStructuredCatalog } from "./structured-catalog";

const root = resolve(import.meta.dirname, "../..");
const faqPath = "src/data/faqs/study.ts";
const glossaryPath = "src/data/glossary/banking.ts";
const articleId = "opening-a-bank-account-after-moving-to-japan";
const today = "2026-09-28";

async function fixture() {
  const fixtureRoot = await mkdtemp(join(tmpdir(), "nihonest-cms-test-"));
  for (const path of [faqPath, glossaryPath]) {
    await mkdir(resolve(fixtureRoot, path, ".."), { recursive: true });
    await writeFile(resolve(fixtureRoot, path), await readFile(resolve(root, path), "utf8"));
  }
  // Collection validation checks every FAQ's links, so the fixture needs the real article catalog.
  await cp(resolve(root, "content/articles"), resolve(fixtureRoot, "content/articles"), { recursive: true });
  return fixtureRoot;
}

async function removeFixture(fixtureRoot: string) {
  if (!resolve(fixtureRoot).startsWith(`${resolve(tmpdir())}${sep}`) || !basename(fixtureRoot).startsWith("nihonest-cms-test-")) {
    throw new Error("Refusing to remove a fixture outside the temporary directory.");
  }
  await rm(fixtureRoot, { recursive: true, force: true });
}

const faqFields = (id: string) => ({
  id, question: "Can a fixture FAQ be created in the CMS?", summary: "Yes. It is appended to its browse group's module.",
  primaryBrowseGroupId: "study", status: "needs-review", relatedArticleIds: [articleId], searchTerms: ["fixture faq"],
});
const termFields = (id: string) => ({
  id, japanese: "試験用語", kana: "しけんようご", romaji: "shiken yōgo", englishName: "Fixture Term",
  shortDefinition: "A term created by the CMS fixture.", detailedExplanation: "It exists only in this test fixture.",
  commonContext: "Appears only in automated tests.", topicIds: ["banking"], relatedArticleIds: [articleId], status: "draft",
});

// Fixtures copy the article catalog and run Git, which can exceed the 5-second default under full-suite load.
describe("CMS record creation", { timeout: 30_000 }, () => {
  it("previews and appends a FAQ and a glossary term without touching the surrounding source", async () => {
    const fixtureRoot = await fixture();
    try {
      for (const [kind, path, fields] of [["faq", faqPath, faqFields("cms-fixture-created-faq")], ["glossary-term", glossaryPath, termFields("cms-fixture-created-term")]] as const) {
        const before = await readFile(resolve(fixtureRoot, path), "utf8");
        const plan = await planRecordCreation(fixtureRoot, kind, fields, today);
        expect(plan.path).toBe(path);
        expect(plan.insertion).toContain(`"${fields.id}"`);
        expect(await readFile(resolve(fixtureRoot, path), "utf8")).toBe(before);
        const created = await createRecord(fixtureRoot, kind, fields, plan.sourceRevision, today);
        expect(created).toMatchObject({ created: true, id: fields.id, path });
        const after = await readFile(resolve(fixtureRoot, path), "utf8");
        // Only the planned text was added; every existing byte is preserved in place.
        expect(after.replace(plan.insertion, "")).toBe(before);
        const record = (await readStructuredCatalog(fixtureRoot)).records.get(`${kind}:${fields.id}`);
        expect(record).toBeDefined();
        expect(record!.status).toBe(fields.status);
        expect(record!.translation).toBe("missing");
        expect(record!.revision).toBe(plan.revision);
      }
      const faq = (await readStructuredCatalog(fixtureRoot)).records.get("faq:cms-fixture-created-faq")!.value;
      expect(faqSchema.parse(faq)).toMatchObject({ slug: "cms-fixture-created-faq", createdAt: today, updatedAt: today });
      expect(faq).not.toHaveProperty("lastReviewedAt");
      expect(await readFile(resolve(fixtureRoot, faqPath), "utf8")).toContain(`defineFaq("study", { createdAt: "${today}", updatedAt: "${today}", status: "needs-review", id: "cms-fixture-created-faq"`);
      const term = (await readStructuredCatalog(fixtureRoot)).records.get("glossary-term:cms-fixture-created-term")!.value;
      expect(japaneseTermSchema.parse(term).primaryBrowseGroupId).toBe("banking");
      expect(await readFile(resolve(fixtureRoot, glossaryPath), "utf8")).toMatch(/japaneseTermSchema\.parse\(\{\n {4}id: "cms-fixture-created-term", slug: "cms-fixture-created-term", japanese: "試験用語"/);
    } finally { await removeFixture(fixtureRoot); }
  });

  it("rejects duplicates, unknown references, verified status, extra fields, and stale previews", async () => {
    const fixtureRoot = await fixture();
    try {
      const existingFaq = (await readStructuredCatalog(fixtureRoot)).records.values().next().value!;
      await expect(planRecordCreation(fixtureRoot, "faq", faqFields(existingFaq.id), today)).rejects.toMatchObject({ status: 422, message: "FAQ IDs must be unique." });
      await expect(planRecordCreation(fixtureRoot, "faq", { ...faqFields("cms-fixture-unknown-link"), relatedArticleIds: ["not-an-article"] }, today))
        .rejects.toMatchObject({ status: 422, message: expect.stringContaining("not-an-article") });
      await expect(planRecordCreation(fixtureRoot, "faq", { ...faqFields("cms-fixture-no-links"), relatedArticleIds: [] }, today))
        .rejects.toMatchObject({ status: 422, message: expect.stringContaining("at least one canonical resource") });
      await expect(planRecordCreation(fixtureRoot, "glossary-term", { ...termFields("cms-fixture-bad-source"), sourceIds: ["not-a-source"] }, today))
        .rejects.toMatchObject({ status: 422 });
      await expect(planRecordCreation(fixtureRoot, "faq", { ...faqFields("cms-fixture-verified"), status: "verified" }, today))
        .rejects.toMatchObject({ status: 422, message: expect.stringContaining("Draft or Editorial review") });
      await expect(planRecordCreation(fixtureRoot, "faq", { ...faqFields("cms-fixture-dated"), lastReviewedAt: today }, today))
        .rejects.toMatchObject({ status: 422, message: expect.stringContaining("lastReviewedAt cannot be set") });
      await expect(planRecordCreation(fixtureRoot, "faq", { ...faqFields("Bad ID"), id: "Bad ID" }, today)).rejects.toMatchObject({ status: 422 });
      await expect(planRecordCreation(fixtureRoot, "glossary-term", { ...termFields("cms-fixture-no-module"), topicIds: ["healthcare"] }, today))
        .rejects.toMatchObject({ status: 422, message: expect.stringContaining("src/data/glossary/healthcare.ts does not exist") });
      const fields = faqFields("cms-fixture-stale-preview");
      const plan = await planRecordCreation(fixtureRoot, "faq", fields, today);
      await writeFile(resolve(fixtureRoot, faqPath), `${await readFile(resolve(fixtureRoot, faqPath), "utf8")}\n// changed after preview\n`);
      const changed = await readFile(resolve(fixtureRoot, faqPath), "utf8");
      await expect(createRecord(fixtureRoot, "faq", fields, plan.sourceRevision, today)).rejects.toMatchObject({ status: 409 });
      await expect(createRecord(fixtureRoot, "faq", fields, undefined, today)).rejects.toMatchObject({ status: 400 });
      expect(await readFile(resolve(fixtureRoot, faqPath), "utf8")).toBe(changed);
    } finally { await removeFixture(fixtureRoot); }
  });

  it("refuses to add to a module that was dirty when the session started", async () => {
    const fixtureRoot = await fixture();
    try {
      // Commit only the data modules: the session needs them clean, and a small commit avoids transient Windows
      // file-lock failures when antivirus scans many new objects during parallel test runs.
      for (const args of [["init", "-q"], ["config", "user.email", "cms-test@example.invalid"], ["config", "user.name", "CMS test"],
        ["config", "core.autocrlf", "false"], ["add", "src"], ["commit", "-q", "-m", "fixture"]]) {
        try { execFileSync("git", args, { cwd: fixtureRoot, stdio: ["ignore", "ignore", "pipe"] }); }
        catch { execFileSync("git", args, { cwd: fixtureRoot, stdio: ["ignore", "ignore", "pipe"] }); }
      }
      await writeFile(resolve(fixtureRoot, faqPath), `${await readFile(resolve(fixtureRoot, faqPath), "utf8")}\n// uncommitted work\n`);
      await startGitSession(fixtureRoot);
      const fields = faqFields("cms-fixture-dirty-module");
      const dirty = await readFile(resolve(fixtureRoot, faqPath), "utf8");
      const plan = await planRecordCreation(fixtureRoot, "faq", fields, today);
      await expect(createRecord(fixtureRoot, "faq", fields, plan.sourceRevision, today)).rejects.toMatchObject({ status: 423 });
      expect(await readFile(resolve(fixtureRoot, faqPath), "utf8")).toBe(dirty);
    } finally { await removeFixture(fixtureRoot); }
  });

  it("creates through the HTTP boundary only with the local session", async () => {
    const fixtureRoot = await fixture();
    try {
      for (const args of [["init", "-q"], ["config", "user.email", "cms-test@example.invalid"], ["config", "user.name", "CMS test"],
        ["config", "core.autocrlf", "false"], ["add", "src"], ["commit", "-q", "-m", "fixture"]]) {
        try { execFileSync("git", args, { cwd: fixtureRoot, stdio: ["ignore", "ignore", "pipe"] }); }
        catch { execFileSync("git", args, { cwd: fixtureRoot, stdio: ["ignore", "ignore", "pipe"] }); }
      }
      const server = createCmsServer(fixtureRoot);
      server.listen(0, "127.0.0.1");
      await once(server, "listening");
      try {
        const address = server.address();
        if (!address || typeof address === "string") throw new Error("Expected an IPv4 listener.");
        const base = `http://127.0.0.1:${address.port}`;
        const { token } = await (await fetch(`${base}/api/session`)).json();
        const post = (path: string, body: unknown, headers: Record<string, string> = { Origin: base, "X-CMS-Token": token }) =>
          fetch(`${base}${path}`, { method: "POST", headers: { "Content-Type": "application/json", ...headers }, body: JSON.stringify(body) });
        const fields = faqFields("cms-fixture-http-faq");
        expect((await post("/api/create/faq/preview", { fields }, { Origin: base })).status).toBe(403);
        expect((await post("/api/create/faq/preview", { fields }, { Origin: "http://evil.example", "X-CMS-Token": token })).status).toBe(403);
        const preview = await post("/api/create/faq/preview", { fields });
        expect(preview.status).toBe(200);
        const plan = await preview.json();
        expect((await post("/api/create/faq", { fields, expectedSourceRevision: plan.sourceRevision, extra: true })).status).toBe(400);
        const created = await post("/api/create/faq", { fields, expectedSourceRevision: plan.sourceRevision });
        expect(created.status).toBe(200);
        expect(await readFile(resolve(fixtureRoot, faqPath), "utf8")).toContain('id: "cms-fixture-http-faq"');
        const record = await (await fetch(`${base}/api/records/faq/cms-fixture-http-faq`)).json();
        expect(record).toMatchObject({ id: "cms-fixture-http-faq", status: "needs-review", translation: "missing" });
        expect((await (await fetch(`${base}/api/git`)).json()).cmsChanges).toEqual([faqPath]);
      } finally {
        server.close();
        await once(server, "close");
      }
    } finally { await removeFixture(fixtureRoot); }
  });

  it("lists creation choices from the domain and registries", async () => {
    const options = await creationOptions(root);
    expect(options.faqGroups.map(({ id }) => id)).toContain("study");
    expect(options.topics).toContain("banking");
    expect(options.known.articles).toContain(articleId);
    expect(options.known.sources.length).toBeGreaterThan(100);
  });
});
