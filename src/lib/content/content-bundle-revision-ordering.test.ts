import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { activityCrossReferences } from "@/data/activity-cross-references";
import { annotatedDocumentFamilies } from "@/data/annotated-documents";
import { articleGroups, guidedJourneys } from "@/data/discovery";
import { faqs } from "@/data/faqs";
import { glossaryTerms } from "@/data/glossary";
import { localGuidanceSupplements } from "@/data/local-guidance";
import { generalLocalAdvice } from "@/data/local-guidance/general-advice";
import { residenceStatuses } from "@/data/residence-statuses";
import { extractActivityText } from "@/domain/activity-cross-reference/activity-text";
import { bundledGroupSourceFields, bundledJourneySourceFields } from "@/domain/content-bundle/discovery-payloads";
import { extractGuidanceText } from "@/domain/residence-status/guidance-text";
import { translationSourceFields } from "@/domain/translation/translation-source-fields";
import { createTranslationSourceRevision } from "@/lib/translation/source-revision-core";
import { articleSourceRevision } from "./content-bundle";

type SourceFields = Readonly<Record<string, string>>;
type RevisionRecord = Readonly<{ id: string; fields: SourceFields }>;

// Read canonical English inputs, including untranslated records; never modify translation artifacts.
const families: readonly Readonly<{ name: string; records: readonly RevisionRecord[] }>[] = [
  { name: "faq", records: faqs.map((record) => ({ id: record.id, fields: translationSourceFields.faq(record) })) },
  { name: "glossary", records: glossaryTerms.map((record) => ({ id: record.id, fields: translationSourceFields["glossary-term"](record) })) },
  { name: "residence-status", records: residenceStatuses.map((record) => ({ id: record.id, fields: translationSourceFields["residence-status"](record) })) },
  { name: "local-guidance", records: localGuidanceSupplements.map((record) => ({ id: record.id, fields: translationSourceFields["local-guidance-supplement"](record) })) },
  { name: "general-advice", records: Object.entries(generalLocalAdvice).map(([id, record]) => ({ id, fields: translationSourceFields["local-guidance-general-advice"](record) })) },
  { name: "status-guidance", records: residenceStatuses.flatMap((record) => record.structuredGuidance
    ? [{ id: record.id, fields: extractGuidanceText(record.structuredGuidance) }] : []) },
  { name: "article-group", records: articleGroups.map((record) => ({ id: record.id, fields: bundledGroupSourceFields(record) })) },
  { name: "journey", records: guidedJourneys.map((record) => ({ id: record.id, fields: bundledJourneySourceFields(record) })) },
  { name: "annotated-document", records: annotatedDocumentFamilies.map((record) => ({ id: record.id, fields: translationSourceFields["annotated-document"](record) })) },
  { name: "activity", records: activityCrossReferences.map((record) => ({ id: record.id, fields: extractActivityText(record) })) },
];

function codeUnitRevision(fields: SourceFields): string {
  const canonical = Object.fromEntries(Object.keys(fields).sort().map((key) => [key, fields[key]!.replace(/\r\n?/g, "\n")]));
  return createHash("sha256").update(JSON.stringify(canonical), "utf8").digest("hex");
}

function checkRecord({ id, fields }: RevisionRecord) {
  const keys = Object.keys(fields);
  expect(keys.length, `${id}: nonempty revision input`).toBeGreaterThan(0);
  expect([...keys].sort((a, b) => a.localeCompare(b)), `${id}: locale versus code-unit field order`).toEqual([...keys].sort());
  const expected = codeUnitRevision(fields);
  expect(createTranslationSourceRevision(fields), `${id}: current revision versus code-unit digest`).toBe(expected);
  expect(createTranslationSourceRevision(Object.fromEntries(Object.entries(fields).reverse())),
    `${id}: revision independent of field insertion order`).toBe(expected);
}

describe("current bundle revision field ordering acceptance", () => {
  it.each(families)("preserves code-unit revision parity for every $name record", ({ records }) => {
    expect(records.length).toBeGreaterThan(0);
    for (const record of records) checkRecord(record);
  });

  it("includes every article's single normalized whole-source revision input", async () => {
    const directory = join(process.cwd(), "content/articles");
    const files = (await readdir(directory)).filter((file) => file.endsWith(".mdx"));
    expect(files.length).toBeGreaterThan(0);
    for (const file of files) {
      const source = await readFile(join(directory, file), "utf8");
      checkRecord({ id: file, fields: { source } });
      expect(articleSourceRevision(source), file).toBe(codeUnitRevision({ source }));
    }
  });

  it("does not assume locale collation equals code-unit sorting for arbitrary new keys", () => {
    const keys = ["a", "A"];
    expect([...keys].sort((a, b) => a.localeCompare(b, "en", { caseFirst: "lower" }))).not.toEqual([...keys].sort());
  });

  it("rejects a deliberately reversed comparator without changing production revision code", () => {
    const comparator = vi.spyOn(String.prototype, "localeCompare").mockImplementation(function (this: string, other: string) {
      return String(this) < other ? 1 : String(this) > other ? -1 : 0;
    });
    try {
      expect(() => checkRecord(families[0]!.records[0]!)).toThrow("locale versus code-unit field order");
    } finally {
      comparator.mockRestore();
    }
  });
});
