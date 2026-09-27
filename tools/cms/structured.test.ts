// @vitest-environment node
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { basename, join, resolve, sep } from "node:path";
import { tmpdir } from "node:os";
import { describe, expect, it } from "vitest";
import ts from "typescript";
import { auditEditorialState } from "@/domain/editorial/editorial-review";
import { faqs } from "@/data/faqs";
import { glossaryTerms } from "@/data/glossary";
import { residenceStatuses } from "@/data/residence-statuses";
import { loadEditorialTargets } from "@/lib/editorial/editorial-catalog";
import { readStructuredCatalog } from "./structured-catalog";
import { approveStructuredReview, changeStructuredStatus, saveStructuredContent } from "./structured-writer";

const root = resolve(import.meta.dirname, "../..");

describe("CMS structured editorial workflow", () => {
  it("locates every FAQ, residence status, and glossary term", async () => {
    const catalog = await readStructuredCatalog(root);
    expect(catalog.failures).toEqual([]);
    expect([...catalog.records.values()].filter((item) => item.kind === "faq")).toHaveLength(faqs.length);
    expect([...catalog.records.values()].filter((item) => item.kind === "residence-status")).toHaveLength(residenceStatuses.length);
    expect([...catalog.records.values()].filter((item) => item.kind === "glossary-term")).toHaveLength(glossaryTerms.length);
    const targetRevisions = new Map((await loadEditorialTargets(root)).map((item) => [`${item.kind}:${item.id}`, item.revision]));
    for (const [key, record] of catalog.records) expect(record.revision).toBe(targetRevisions.get(key));
    // The translation catalog tests keep every artifact current, so the CMS must agree with them.
    const translated = [...catalog.records.values()].filter((record) => record.translation !== "missing");
    expect(translated.length).toBeGreaterThan(0);
    expect(translated.filter((record) => record.translation !== "current").map(({ kind, id }) => `${kind}:${id}`)).toEqual([]);
  });

  it("changes and approves representative records without rewriting their neighbors", async () => {
    const fixtureRoot = await mkdtemp(join(tmpdir(), "nihonest-cms-test-"));
    const cases = [
      { kind: "faq" as const, id: "work-in-japan-without-japanese", path: "src/data/faqs/work-and-business.ts" },
      { kind: "residence-status" as const, id: "diplomat", path: "src/data/residence-statuses.ts" },
      { kind: "glossary-term" as const, id: "sasho", path: "src/data/glossary/immigration.ts" },
      { kind: "glossary-term" as const, id: "kaigo-bunya", path: "src/data/glossary/employment.ts" },
    ];
    try {
      for (const { path } of cases) {
        await mkdir(resolve(fixtureRoot, path, ".."), { recursive: true });
        await writeFile(resolve(fixtureRoot, path), await readFile(resolve(root, path), "utf8"));
      }
      for (const item of cases) {
        let record = (await readStructuredCatalog(fixtureRoot)).records.get(`${item.kind}:${item.id}`)!;
        expect(record).toBeDefined();
        if (record.status !== "needs-review") {
          const changed = await changeStructuredStatus(fixtureRoot, item.kind, item.id, {
            expectedRevision: record.revision, expectedSourceRevision: record.source.sourceRevision, status: "needs-review",
          });
          expect(changed.changed).toBe(true);
          record = (await readStructuredCatalog(fixtureRoot)).records.get(`${item.kind}:${item.id}`)!;
        }
        const before = await readFile(resolve(fixtureRoot, item.path), "utf8");
        const input = {
          expectedRevision: record.revision, expectedSourceRevision: record.source.sourceRevision,
          reviewedAt: "2026-09-26", changeNote: "Reviewed the complete fixture record and links.",
          approvalNote: "I approve this exact fixture revision.", validationPerformed: ["Focused CMS structured test passed."],
          sourceReviewIds: [], explicitHumanApproval: true as const,
        };
        await expect(approveStructuredReview(fixtureRoot, item.kind, item.id, { ...input, explicitHumanApproval: false as true }))
          .rejects.toMatchObject({ status: 422 });
        const approved = await approveStructuredReview(fixtureRoot, item.kind, item.id, input);
        const current = (await readStructuredCatalog(fixtureRoot)).records.get(`${item.kind}:${item.id}`)!;
        expect(current.status).toBe("verified");
        expect(current.lastReviewedAt).toBe("2026-09-26");
        expect(current.revision).toBe(approved.revision);
        const approval = JSON.parse(await readFile(resolve(fixtureRoot, approved.approvalRecord), "utf8"));
        expect(auditEditorialState([{ kind: item.kind, id: item.id, status: "verified", revision: current.revision,
          updatedAt: current.updatedAt, lastReviewedAt: current.lastReviewedAt }], [approval], "2026-09-26")).toEqual([]);
        const after = await readFile(resolve(fixtureRoot, item.path), "utf8");
        expect(after.length - before.length).toBeLessThan(100);
        const parsed = ts.createSourceFile(item.path, after, ts.ScriptTarget.Latest, true) as ts.SourceFile & { parseDiagnostics: readonly ts.Diagnostic[] };
        expect(parsed.parseDiagnostics).toEqual([]);
        const fields = item.kind === "faq" ? { summary: `${(current.value as { summary: string }).summary} Fixture correction.` }
          : item.kind === "residence-status" ? {
            purpose: `${(current.value as { purpose: string }).purpose} Fixture correction.`,
            typicalActivities: [...(current.value as { typicalActivities: string[] }).typicalActivities, "Fixture activity"],
          } : { shortDefinition: `${(current.value as { shortDefinition: string }).shortDefinition} Fixture correction.` };
        const unchangedSource = await readFile(resolve(fixtureRoot, item.path), "utf8");
        await expect(saveStructuredContent(fixtureRoot, item.kind, item.id, {
          expectedRevision: approved.revision, expectedSourceRevision: approved.sourceRevision,
          fields: { sourceIds: ["forbidden-source"] }, updatedAt: "2026-09-26",
        })).rejects.toMatchObject({ status: 422 });
        if (item.kind === "faq") {
          await expect(saveStructuredContent(fixtureRoot, item.kind, item.id, {
            expectedRevision: approved.revision, expectedSourceRevision: approved.sourceRevision,
            fields: { summary: "x".repeat(321) }, updatedAt: "2026-09-26",
          })).rejects.toMatchObject({ status: 422 });
        }
        expect(await readFile(resolve(fixtureRoot, item.path), "utf8")).toBe(unchangedSource);
        const edited = await saveStructuredContent(fixtureRoot, item.kind, item.id, {
          expectedRevision: approved.revision, expectedSourceRevision: approved.sourceRevision,
          fields, ...(item.kind === "faq" ? { updatedAt: "2026-09-26" } : {}),
        });
        expect(edited.changed).toBe(true);
        expect(edited.status).toBe("needs-review");
        const needsReview = (await readStructuredCatalog(fixtureRoot)).records.get(`${item.kind}:${item.id}`)!;
        expect(needsReview.status).toBe("needs-review");
        expect(needsReview.revision).toBe(edited.revision);
        expect(record.translation).toBe("current");
        expect(needsReview.translation).toBe("stale");
        for (const [field, expected] of Object.entries(fields)) expect(needsReview.value[field as keyof typeof needsReview.value]).toEqual(expected);
        if (item.kind === "faq") expect(needsReview.updatedAt).toBe("2026-09-26");
        if (item.kind !== "residence-status") expect(needsReview.lastReviewedAt).toBeUndefined();
        expect(JSON.parse(await readFile(resolve(fixtureRoot, approved.approvalRecord), "utf8")).contentRevision).toBe(approved.revision);
        const editedSource = await readFile(resolve(fixtureRoot, item.path), "utf8");
        expect((ts.createSourceFile(item.path, editedSource, ts.ScriptTarget.Latest, true) as ts.SourceFile & { parseDiagnostics: readonly ts.Diagnostic[] }).parseDiagnostics).toEqual([]);
        await expect(changeStructuredStatus(fixtureRoot, item.kind, item.id, {
          expectedRevision: record.revision, expectedSourceRevision: record.source.sourceRevision, status: "draft",
        })).rejects.toMatchObject({ status: 409 });
      }
    } finally {
      if (!resolve(fixtureRoot).startsWith(`${resolve(tmpdir())}${sep}`) || !basename(fixtureRoot).startsWith("nihonest-cms-test-")) {
        throw new Error("Refusing to remove a fixture outside the temporary directory.");
      }
      await rm(fixtureRoot, { recursive: true, force: true });
    }
  });
});
