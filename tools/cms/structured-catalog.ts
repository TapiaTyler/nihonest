/** Source-aware projections for the three structured editorial catalogs. */
import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import ts from "typescript";
import { faqs } from "@/data/faqs";
import { glossaryTerms } from "@/data/glossary";
import { residenceStatuses } from "@/data/residence-statuses";
import { sources } from "@/data/sources";
import { faqSchema, type Faq } from "@/domain/faq/faq";
import { japaneseTermSchema, type JapaneseTerm } from "@/domain/glossary/glossary";
import { residenceStatusSchema, type ResidenceStatus } from "@/domain/residence-status/residence-status";
import { structuredEditorialRevision } from "@/lib/editorial/editorial-catalog";

export type StructuredKind = "faq" | "residence-status" | "glossary-term";
export type StructuredValue = Faq | ResidenceStatus | JapaneseTerm;
export type SourceLocation = Readonly<{
  path: string;
  sourceRevision: string;
  objectStart: number;
  objectEnd: number;
  statusValue?: readonly [number, number];
  reviewDateValue?: readonly [number, number];
  statusInSource?: string;
  reviewDateInSource?: string;
  omitsUndefinedReviewDate: boolean;
  fieldValues: Readonly<Record<string, readonly [number, number]>>;
}>;
export type StructuredRecord = Readonly<{
  kind: StructuredKind;
  id: string;
  title: string;
  status: string;
  groups: readonly string[];
  lastReviewedAt?: string;
  updatedAt?: string;
  revision: string;
  source: SourceLocation;
  value: StructuredValue;
  sources: readonly Readonly<{ id: string; title: string; organization: string; url: string }>[];
  editableFields: readonly string[];
}>;

export const structuredContentFields: Readonly<Record<StructuredKind, readonly string[]>> = {
  faq: ["question", "summary"],
  "residence-status": ["summary", "purpose", "typicalActivities", "examples", "considerations"],
  "glossary-term": ["englishName", "shortDefinition", "detailedExplanation", "commonContext"],
};
const arrayFields = new Set(["typicalActivities", "examples", "considerations"]);

const values: Readonly<Record<StructuredKind, ReadonlyMap<string, StructuredValue>>> = {
  faq: new Map(faqs.map((item) => [item.id, item])),
  "residence-status": new Map(residenceStatuses.map((item) => [item.id, item])),
  "glossary-term": new Map(glossaryTerms.map((item) => [item.id, item])),
};
const sourceById = new Map(sources.map((item) => [item.id, item]));
const knownSourceRevisions = new Map<string, string>();

/** Only CMS writes advance the in-process source baseline; external edits require a restart. */
export function noteCmsSourceWrite(projectRoot: string, path: string, sourceRevision: string) {
  knownSourceRevisions.set(resolve(projectRoot, path), sourceRevision);
}

const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");
const validCallNames: Readonly<Record<StructuredKind, readonly string[]>> = {
  faq: ["defineFaq"],
  "residence-status": ["defineStatus"],
  "glossary-term": ["japaneseTermSchema.parse", "residenceStatusTerm", "occupationalRouteTerm"],
};

function property(object: ts.ObjectLiteralExpression, name: string): ts.PropertyAssignment | undefined {
  return object.properties.find((item): item is ts.PropertyAssignment =>
    ts.isPropertyAssignment(item) && (ts.isIdentifier(item.name) || ts.isStringLiteral(item.name)) && item.name.text === name);
}

function stringProperty(object: ts.ObjectLiteralExpression, name: string): string | undefined {
  const item = property(object, name);
  return item && ts.isStringLiteralLike(item.initializer) ? item.initializer.text : undefined;
}

function literalField(object: ts.ObjectLiteralExpression, name: string): string | string[] | undefined {
  const item = property(object, name);
  if (!item) return undefined;
  if (ts.isStringLiteralLike(item.initializer)) return item.initializer.text;
  if (arrayFields.has(name) && ts.isArrayLiteralExpression(item.initializer)
    && item.initializer.elements.every(ts.isStringLiteralLike)) {
    return item.initializer.elements.map((element) => (element as ts.StringLiteral).text);
  }
  throw new Error(`The ${name} field uses an expression the CMS cannot safely edit.`);
}

function findObject(call: ts.CallExpression, kind: StructuredKind): ts.ObjectLiteralExpression | undefined {
  const expression = call.expression.getText();
  if (!validCallNames[kind].includes(expression)) return undefined;
  const candidate = kind === "faq" ? call.arguments[1] : call.arguments[0];
  return candidate && ts.isObjectLiteralExpression(candidate) ? candidate : undefined;
}

function derivedStatus(kind: StructuredKind, call: ts.CallExpression, explicit?: string): string {
  if (explicit) return explicit;
  if (kind === "faq" || kind === "residence-status" || call.expression.getText() === "residenceStatusTerm") return "draft";
  if (call.expression.getText() === "occupationalRouteTerm") return "needs-review";
  return "draft";
}

function projectValue(kind: StructuredKind, base: StructuredValue, status: string, date?: string, datePropertyPresent = false,
  omitUndefinedDate = false, fields: Readonly<Record<string, string | string[]>> = {}): StructuredValue {
  const proposed = { ...base, ...fields, status } as Record<string, unknown>;
  if (kind === "residence-status") proposed.lastReviewedAt = date ?? "2026-09-06";
  else if (date === undefined && omitUndefinedDate) delete proposed.lastReviewedAt;
  else if (date !== undefined || datePropertyPresent || Object.hasOwn(base, "lastReviewedAt")) proposed.lastReviewedAt = date;
  else delete proposed.lastReviewedAt;
  if (kind === "faq") return faqSchema.parse(proposed);
  if (kind === "residence-status") return residenceStatusSchema.parse(proposed);
  return japaneseTermSchema.parse(proposed);
}

export function proposedStructuredValue(record: StructuredRecord, status: string, date?: string,
  fields: Readonly<Record<string, string | string[]>> = {}): StructuredValue {
  return projectValue(record.kind, record.value, status, date, false, record.source.omitsUndefinedReviewDate, fields);
}

async function sourcePaths(projectRoot: string): Promise<readonly { path: string; kind: StructuredKind }[]> {
  const files: { path: string; kind: StructuredKind }[] = [
    { path: "src/data/residence-statuses.ts", kind: "residence-status" },
    { path: "src/data/glossary.ts", kind: "glossary-term" },
  ];
  for (const [folder, kind] of [["faqs", "faq"], ["glossary", "glossary-term"]] as const) {
    let names: string[];
    try { names = await readdir(resolve(projectRoot, "src/data", folder)); }
    catch (error) { if ((error as NodeJS.ErrnoException).code === "ENOENT") continue; throw error; }
    for (const name of names.filter((item) => item.endsWith(".ts") && !["faq-builder.ts", "term-builders.ts"].includes(item))) {
      files.push({ path: `src/data/${folder}/${name}`, kind });
    }
  }
  return files;
}

export async function readStructuredCatalog(projectRoot: string) {
  const records = new Map<string, StructuredRecord>();
  const failures: { path: string; error: string }[] = [];
  for (const { path, kind } of await sourcePaths(projectRoot)) {
    let source: string;
    try { source = await readFile(join(projectRoot, path), "utf8"); }
    catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") continue;
      failures.push({ path, error: error instanceof Error ? error.message : String(error) });
      continue;
    }
    const file = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
    const sourceRevision = sha256(source);
    const absolutePath = resolve(projectRoot, path);
    const baseline = knownSourceRevisions.get(absolutePath);
    if (baseline && baseline !== sourceRevision) {
      failures.push({ path, error: "This TypeScript source changed outside the CMS. Restart the CMS to reload its data before reviewing it." });
      continue;
    }
    knownSourceRevisions.set(absolutePath, sourceRevision);
    function visit(node: ts.Node) {
      if (ts.isCallExpression(node)) {
        const object = findObject(node, kind);
        const id = object && stringProperty(object, "id");
        if (id && object) {
          const base = values[kind].get(id);
          if (!base) failures.push({ path, error: `Source record ${kind}:${id} is not in the loaded registry. Restart the CMS if it was added externally.` });
          else {
            try {
              const statusItem = property(object, "status");
              const dateItem = property(object, "lastReviewedAt");
              const status = derivedStatus(kind, node, stringProperty(object, "status"));
              const date = stringProperty(object, "lastReviewedAt") ?? (kind === "residence-status" ? "2026-09-06" : undefined);
              const omitsUndefinedReviewDate = kind === "glossary-term" && node.expression.getText() !== "japaneseTermSchema.parse";
              const editableFields = structuredContentFields[kind].filter((field) =>
                field !== "englishName" || !omitsUndefinedReviewDate);
              const fieldNames = kind === "faq" ? [...editableFields, "updatedAt"] : editableFields;
              const fieldValues: Record<string, readonly [number, number]> = {};
              const fields: Record<string, string | string[]> = {};
              for (const field of fieldNames) {
                const item = property(object, field);
                if (!item) continue;
                const literal = literalField(object, field);
                if (literal !== undefined) fields[field] = literal;
                fieldValues[field] = [item.initializer.getStart(file), item.initializer.getEnd()];
              }
              const value = projectValue(kind, base, status, date, Boolean(dateItem), omitsUndefinedReviewDate, fields);
              const key = `${kind}:${id}`;
              if (records.has(key)) throw new Error(`Duplicate source record ${key}.`);
              records.set(key, {
                kind, id,
                title: kind === "faq" ? (value as Faq).question
                  : kind === "residence-status" ? (value as ResidenceStatus).englishName : (value as JapaneseTerm).englishName,
                status: value.status, lastReviewedAt: value.lastReviewedAt,
                groups: kind === "faq" ? [(value as Faq).primaryBrowseGroupId]
                  : kind === "residence-status" ? [(value as ResidenceStatus).category] : (value as JapaneseTerm).topicIds,
                updatedAt: kind === "faq" ? (value as Faq).updatedAt : undefined,
                revision: structuredEditorialRevision(value),
                source: {
                  path, sourceRevision, objectStart: object.getStart(file), objectEnd: object.getEnd(),
                  statusValue: statusItem && [statusItem.initializer.getStart(file), statusItem.initializer.getEnd()],
                  reviewDateValue: dateItem && [dateItem.initializer.getStart(file), dateItem.initializer.getEnd()],
                  statusInSource: stringProperty(object, "status"), reviewDateInSource: stringProperty(object, "lastReviewedAt"),
                  omitsUndefinedReviewDate,
                  fieldValues,
                },
                value,
                editableFields,
                sources: ("sourceIds" in value ? value.sourceIds : []).map((sourceId: string) =>
                  sourceById.get(sourceId) ?? { id: sourceId, title: "Unknown source", organization: "", url: "" }),
              });
            } catch (error) { failures.push({ path, error: `${kind}:${id}: ${error instanceof Error ? error.message : String(error)}` }); }
          }
        }
      }
      ts.forEachChild(node, visit);
    }
    visit(file);
  }
  return { records, failures, summaries: [...records.values()].map(({ kind, id, title, status, groups, revision, source }) =>
    ({ kind, id, title, status, groups, revision, path: source.path })).sort((a, b) => a.title.localeCompare(b.title, "en")) };
}
