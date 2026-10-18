import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { auditEditorialState } from "@/domain/editorial/editorial-review";
import { loadEditorialReviewRecords, loadEditorialTargets } from "@/lib/editorial/editorial-catalog";

describe("repository editorial catalog", () => {
  it("loads the current catalog and passes the approval-ledger audit", async () => {
    const targets = await loadEditorialTargets(process.cwd());
    const records = await loadEditorialReviewRecords(resolve(process.cwd(), "content/editorial-reviews"));

    expect(targets.some(({ kind }) => kind === "article")).toBe(true);
    expect(targets.some(({ kind }) => kind === "glossary-term")).toBe(true);
    expect(targets.some(({ kind }) => kind === "residence-status")).toBe(true);
    expect(targets.some(({ kind }) => kind === "faq")).toBe(true);
    // The same "today" as scripts/audit-editorial-state.ts, so approvals recorded today are not future-dated.
    expect(auditEditorialState(targets, records, new Date().toISOString().slice(0, 10))).toEqual([]);
  });
});
