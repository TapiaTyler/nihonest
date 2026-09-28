import { withCmsCreationLock, withCmsFileLock } from "./write-locks";
/**
 * Creates new FAQ, glossary-term, and official-source records by appending one entry to the canonical module that owns them. A plan shows
 * the exact file and text before anything is written; creation validates the proposed record with the domain schema and
 * the same collection validators the site uses, and writes through the guarded atomic path used for edits.
 */
import { createHash } from "node:crypto";
import { readdir, readFile, realpath } from "node:fs/promises";
import { resolve, sep } from "node:path";
import ts from "typescript";
import { activityCrossReferences } from "@/data/activity-cross-references";
import { articleGroups, guidedJourneys } from "@/data/discovery";
import { residenceStatuses } from "@/data/residence-statuses";
import { FAQ_BROWSE_GROUP_IDS, faqBrowseGroupLabels, faqSchema, validateFaqCollection, type Faq } from "@/domain/faq/faq";
import { japaneseTermSchema, validateGlossaryCollection, type JapaneseTerm } from "@/domain/glossary/glossary";
import { authorityLevelSchema, officialSourceSchema, sourceCheckMethodSchema, type OfficialSource } from "@/domain/source/source";
import { JOURNEY_STAGE_IDS, TOPIC_IDS } from "@/domain/taxonomy/taxonomy";
import { structuredEditorialRevision } from "@/lib/editorial/editorial-catalog";
import { CmsEditError } from "./article-writer";
import { readArticleCatalog } from "./catalog";
import { knownSources, registerCreatedSource } from "./known-sources";
import { knownStructuredValues, noteCmsSourceWrite, registerCreatedStructuredValue } from "./structured-catalog";
import { replaceSource } from "./structured-writer";

export type CreatableKind = "faq" | "glossary-term" | "source";
export const creatableKinds: readonly CreatableKind[] = ["faq", "glossary-term", "source"];
type CreatedValue = Faq | JapaneseTerm | OfficialSource;
const kindNames: Readonly<Record<CreatableKind, string>> = { faq: "FAQ", "glossary-term": "glossary term", source: "official source" };

const stableId = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const hash = (value: string) => createHash("sha256").update(value).digest("hex");
const initialStatuses = ["draft", "needs-review"] as const;

const faqFields = {
  text: ["id", "slug", "question", "summary", "primaryBrowseGroupId", "status"],
  lists: ["searchTerms", "relatedArticleIds", "relatedGroupIds", "relatedJourneyIds", "relatedGlossaryTermIds", "relatedResidenceStatusIds", "relatedActivityIds"],
} as const;
const glossaryFields = {
  text: ["id", "slug", "japanese", "kana", "romaji", "englishName", "shortDefinition", "detailedExplanation", "commonContext", "primaryBrowseGroupId", "status"],
  lists: ["topicIds", "journeyStageIds", "relatedArticleIds", "relatedTermIds", "sourceIds", "searchTerms"],
} as const;
// A source's family chooses its module under src/data/sources; it is not part of the stored record.
const sourceFields = {
  text: ["id", "organization", "title", "url", "authorityLevel", "language", "checkMethod", "family"],
  lists: [],
} as const;
const optionalText = new Set(["slug", "kana", "romaji", "primaryBrowseGroupId", "checkMethod"]);
const fieldSets = { faq: faqFields, "glossary-term": glossaryFields, source: sourceFields } as const;

export type CreationPlan = Readonly<{
  kind: CreatableKind;
  id: string;
  path: string;
  sourceRevision: string;
  /** The exact text added to the file, including the separator after the previous entry. */
  insertion: string;
  /** 1-based line where the new entry starts in the proposed file. */
  line: number;
  revision: string;
  value: CreatedValue;
  /** Non-blocking notes for the editor, such as a URL another source already uses. */
  warnings: readonly string[];
}>;

function localToday(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

/** Reads only the fields a new record of this kind may set, so IDs, dates, and review data cannot be smuggled in. */
function readInput(kind: CreatableKind, input: unknown): Record<string, string | string[]> {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new CmsEditError("Provide the new record's fields.", 400);
  const allowed = fieldSets[kind];
  const fields: Record<string, string | string[]> = {};
  for (const [key, value] of Object.entries(input)) {
    if ((allowed.text as readonly string[]).includes(key)) {
      if (typeof value !== "string" || Buffer.byteLength(value, "utf8") > 20_000) throw new CmsEditError(`${key} must be text.`, 422);
      if (value.trim()) fields[key] = value.trim();
      else if (!optionalText.has(key)) throw new CmsEditError(`${key} is required.`, 422);
    } else if ((allowed.lists as readonly string[]).includes(key)) {
      if (!Array.isArray(value) || value.length > 100 || value.some((item) => typeof item !== "string" || item.length > 500)) {
        throw new CmsEditError(`${key} must be a list of up to 100 short text items.`, 422);
      }
      const items = [...new Set((value as string[]).map((item) => item.trim()).filter(Boolean))];
      if (items.length) fields[key] = items;
    } else throw new CmsEditError(`${key} cannot be set when creating a ${kindNames[kind]}.`, 422);
  }
  for (const key of allowed.text) if (!optionalText.has(key) && !(key in fields)) throw new CmsEditError(`${key} is required.`, 422);
  if (!stableId.test(fields.id as string)) throw new CmsEditError("The ID must be lowercase words separated by hyphens.", 422);
  if (fields.slug !== undefined && !stableId.test(fields.slug as string)) throw new CmsEditError("The slug must be lowercase words separated by hyphens.", 422);
  if (kind === "source") {
    if (!stableId.test(fields.family as string)) throw new CmsEditError("Choose a source family.", 422);
    return fields;
  }
  if (!(initialStatuses as readonly string[]).includes(fields.status as string)) {
    throw new CmsEditError("A new record starts as Draft or Editorial review. Approve it separately after review.", 422);
  }
  return fields;
}

function parseValue(kind: CreatableKind, fields: Record<string, string | string[]>, today: string): CreatedValue {
  const proposed = { ...fields, slug: fields.slug ?? fields.id };
  try {
    if (kind === "source") {
      const { family: _family, ...source } = fields;
      void _family;
      return officialSourceSchema.parse(source);
    }
    return kind === "faq"
      ? faqSchema.parse({ ...proposed, createdAt: today, updatedAt: today })
      : japaneseTermSchema.parse(proposed);
  } catch (error) {
    const issues = (error as { issues?: { path: (string | number)[]; message: string }[] }).issues;
    throw new CmsEditError(issues?.length ? issues.map((issue) => `${issue.path.join(".") || "record"}: ${issue.message}`).join(" ") : "The record is not valid.", 422);
  }
}

async function validateCollection(projectRoot: string, kind: CreatableKind, value: CreatedValue): Promise<string[]> {
  if (kind === "source") {
    const source = value as OfficialSource;
    if (knownSources().some(({ id }) => id === source.id)) throw new CmsEditError("Source IDs must be unique.", 422);
    const sameUrl = knownSources().filter(({ url }) => url === source.url).map(({ id }) => id);
    return sameUrl.length ? [`Another source already uses this URL: ${sameUrl.join(", ")}. Cite that source instead unless this is a different document.`] : [];
  }
  const articleIds = (await readArticleCatalog(projectRoot)).articles.map(({ id }) => id);
  const glossaryIds = knownStructuredValues("glossary-term").map(({ id }) => id);
  try {
    if (kind === "faq") {
      validateFaqCollection([...knownStructuredValues("faq") as Faq[], value as Faq], {
        articleIds,
        groupIds: articleGroups.map(({ id }) => id),
        journeyIds: guidedJourneys.map(({ id }) => id),
        glossaryTermIds: glossaryIds,
        residenceStatusIds: residenceStatuses.map(({ id }) => id),
        activityIds: activityCrossReferences.map(({ id }) => id),
      });
    } else {
      validateGlossaryCollection([...knownStructuredValues("glossary-term") as JapaneseTerm[], value as JapaneseTerm], knownSources(), articleIds);
    }
  } catch (error) {
    throw new CmsEditError(error instanceof Error ? error.message : "The record conflicts with the existing catalog.", 422);
  }
  return [];
}

const literal = (value: string | readonly string[]) => Array.isArray(value)
  ? `[${value.map((item) => JSON.stringify(item)).join(", ")}]` : JSON.stringify(value);

function properties(value: Record<string, unknown>, keys: readonly string[]): string[] {
  return keys.flatMap((key) => {
    const item = value[key];
    if (item === undefined || (Array.isArray(item) && !item.length)) return [];
    return [`${key}: ${literal(item as string | string[])}`];
  });
}

/** Source text in the style of the target module: one line per FAQ, grouped lines per glossary term. */
function entryText(kind: CreatableKind, value: CreatedValue, fields: Record<string, string | string[]>): string {
  if (kind === "source") {
    // Keep the author's check method only when chosen; the schema's default applies otherwise.
    const body = properties({ ...value, checkMethod: fields.checkMethod }, ["id", "organization", "title", "url", "authorityLevel", "language", "checkMethod"]);
    return `  officialSourceSchema.parse({ ${body.join(", ")} }),`;
  }
  if (kind === "faq") {
    const faq = value as Faq;
    const body = properties({ ...faq }, ["createdAt", "updatedAt", "status", "id", "slug", "question", "summary", ...faqFields.lists]);
    return `  defineFaq(${JSON.stringify(faq.primaryBrowseGroupId)}, { ${body.join(", ")} }),`;
  }
  // The schema fills primaryBrowseGroupId from topicIds; write it only when the editor chose it explicitly.
  const term = { ...value, primaryBrowseGroupId: fields.primaryBrowseGroupId } as Record<string, unknown>;
  const lines = [
    properties(term, ["id", "slug", "japanese", "kana", "romaji", "englishName"]),
    properties(term, ["shortDefinition"]),
    properties(term, ["detailedExplanation"]),
    properties(term, ["commonContext"]),
    properties(term, ["topicIds", "primaryBrowseGroupId", "journeyStageIds", "relatedArticleIds", "relatedTermIds"]),
    properties(term, ["sourceIds", "searchTerms", "status"]),
  ].filter((line) => line.length).map((line) => `    ${line.join(", ")},`);
  return `  japaneseTermSchema.parse({\n${lines.join("\n")}\n  }),`;
}

function targetPath(kind: CreatableKind, value: CreatedValue, fields: Record<string, string | string[]>): string {
  if (kind === "source") return `src/data/sources/${fields.family}.ts`;
  return kind === "faq"
    ? `src/data/faqs/${(value as Faq).primaryBrowseGroupId}.ts`
    : `src/data/glossary/${(value as JapaneseTerm).primaryBrowseGroupId}.ts`;
}

/** The single exported array of entries in a catalog module, where a new entry is appended. */
function entriesArray(path: string, source: string): ts.ArrayLiteralExpression {
  const file = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const arrays = file.statements.flatMap((statement) => ts.isVariableStatement(statement)
    && statement.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)
    ? statement.declarationList.declarations.flatMap((declaration) => {
      // Accept `[...] as const` and `[...] satisfies T` as well as a bare array.
      let initializer = declaration.initializer;
      while (initializer && (ts.isAsExpression(initializer) || ts.isSatisfiesExpression(initializer))) initializer = initializer.expression;
      return initializer && ts.isArrayLiteralExpression(initializer) ? [initializer] : [];
    })
    : []);
  if (arrays.length !== 1) throw new CmsEditError(`${path} does not have exactly one exported entry list, so the CMS cannot add to it safely.`, 409);
  return arrays[0]!;
}

function hasSyntaxErrors(path: string, source: string): boolean {
  const file = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  return ((file as unknown as { parseDiagnostics?: readonly unknown[] }).parseDiagnostics?.length ?? 0) > 0;
}

async function prepare(projectRoot: string, kind: CreatableKind, input: unknown, today: string) {
  if (!creatableKinds.includes(kind)) throw new CmsEditError("This kind of record cannot be created in the CMS.", 404);
  const fields = readInput(kind, input);
  const value = parseValue(kind, fields, today);
  const warnings = await validateCollection(projectRoot, kind, value);
  const path = targetPath(kind, value, fields);
  const dataDirectory = await realpath(resolve(projectRoot, "src/data"));
  let target: string;
  try { target = await realpath(resolve(projectRoot, path)); }
  catch { throw new CmsEditError(`${path} does not exist. Choose a ${kind === "faq" ? "browse group" : kind === "source" ? "source family" : "primary topic"} that already has a module.`, 422); }
  if (!target.startsWith(`${dataDirectory}${sep}`)) throw new CmsEditError("The target module escapes the canonical data directory.", 403);
  const original = await readFile(target, "utf8");
  const newline = original.includes("\r\n") ? "\r\n" : "\n";
  const array = entriesArray(path, original);
  // Insert after the last entry (or the opening bracket), before the whitespace that precedes the closing bracket.
  let insertAt = array.getEnd() - 1;
  while (insertAt > array.getStart() + 1 && /\s/.test(original[insertAt - 1]!)) insertAt -= 1;
  const separator = array.elements.length && original[insertAt - 1] !== "," ? "," : "";
  const insertion = `${separator}${newline}${entryText(kind, value, fields).replaceAll("\n", newline)}`;
  const next = `${original.slice(0, insertAt)}${insertion}${original.slice(insertAt)}`;
  if (hasSyntaxErrors(path, next)) throw new CmsEditError("The generated entry would not parse. Check the text for unusual characters.", 422);
  const line = original.slice(0, insertAt).split("\n").length + 1;
  const revision = kind === "source" ? hash(JSON.stringify(value)) : structuredEditorialRevision(value as Faq | JapaneseTerm);
  const plan: CreationPlan = { kind, id: value.id, path, sourceRevision: hash(original), insertion, line, revision, value, warnings };
  return { plan, target, original, next };
}

/** Shows exactly what creation would add, without writing. */
export async function planRecordCreation(projectRoot: string, kind: CreatableKind, input: unknown, today = localToday()): Promise<CreationPlan> {
  return (await prepare(projectRoot, kind, input, today)).plan;
}

/** Appends the planned entry if the target module still matches the previewed revision. */
export async function createRecord(projectRoot: string, kind: CreatableKind, input: unknown, expectedSourceRevision: unknown, today = localToday()) {
  return withCmsCreationLock(projectRoot, async () => {
    if (typeof expectedSourceRevision !== "string" || !/^[a-f0-9]{64}$/.test(expectedSourceRevision)) {
      throw new CmsEditError("Preview the new record before creating it.", 400);
    }
    const { plan, target, original, next } = await prepare(projectRoot, kind, input, today);
    return withCmsFileLock(target, async () => {
      if (plan.sourceRevision !== expectedSourceRevision) throw new CmsEditError(`${plan.path} changed after the preview. Preview again.`, 409);
      await replaceSource(projectRoot, target, original, next);
      noteCmsSourceWrite(projectRoot, plan.path, hash(next));
      if (kind === "source") registerCreatedSource(plan.value as OfficialSource);
      else registerCreatedStructuredValue(kind, plan.value as Faq | JapaneseTerm);
      return { created: true, kind, id: plan.id, path: plan.path, sourceRevision: hash(next), revision: plan.revision };
    });
  });
}

/** Choices and known IDs for the creation form; the server still validates every submission. */
export async function creationOptions(projectRoot: string) {
  const ids = (items: readonly { id: string }[]) => items.map(({ id }) => id).sort();
  const sourceFamilies = (await readdir(resolve(projectRoot, "src/data/sources")))
    .filter((name) => name.endsWith(".ts") && !name.endsWith(".test.ts")).map((name) => name.slice(0, -3)).sort();
  return {
    sourceFamilies,
    authorityLevels: [...authorityLevelSchema.options],
    sourceLanguages: [...officialSourceSchema.shape.language.options],
    checkMethods: [...sourceCheckMethodSchema.options],
    faqGroups: FAQ_BROWSE_GROUP_IDS.map((id) => ({ id, label: faqBrowseGroupLabels[id] })),
    topics: [...TOPIC_IDS],
    journeyStages: [...JOURNEY_STAGE_IDS],
    known: {
      articles: ids((await readArticleCatalog(projectRoot)).articles),
      groups: ids(articleGroups),
      journeys: ids(guidedJourneys),
      glossaryTerms: ids(knownStructuredValues("glossary-term")),
      residenceStatuses: ids(residenceStatuses),
      activities: ids(activityCrossReferences),
      sources: ids(knownSources()),
    },
  };
}
