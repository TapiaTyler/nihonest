import { withCmsCreationLock, withCmsFileLock } from "./write-locks";
/**
 * Creates a new article: a create-only MDX file and its import and registration in one article registry module. The
 * two writes succeed together or the new MDX file is removed, so every article file stays registered exactly once.
 * A plan shows both changes before anything is written.
 */
import { createHash, randomUUID } from "node:crypto";
import { link, mkdir, readdir, readFile, realpath, rm, unlink, writeFile } from "node:fs/promises";
import { join, resolve, sep } from "node:path";
import ts from "typescript";
import { articleGroups, guidedJourneys } from "@/data/discovery";
import { residenceStatuses } from "@/data/residence-statuses";
import { articleMetadataSchema, articleRelationshipTypeSchema, validateArticleCollection, type ArticleMetadata } from "@/domain/article/article";
import { AUDIENCE_IDS, CONTENT_TYPE_IDS, GEOGRAPHIC_SCOPE_IDS, IMPORTANCE_IDS, JOURNEY_STAGE_IDS, TOPIC_IDS } from "@/domain/taxonomy/taxonomy";
import { articleSourceRevision } from "@/lib/content/content-bundle";
import { CmsEditError, previewArticleBody } from "./article-writer";
import { readArticleCatalog } from "./catalog";
import { guardCmsWrite, noteCmsWrite } from "./git-session";
import { knownSources } from "./known-sources";
import { knownStructuredValues } from "./structured-catalog";
import { replaceSource } from "./structured-writer";

const stableId = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const hash = (value: string) => createHash("sha256").update(value).digest("hex");
const registryDirectory = "src/lib/content/article-registry";
const textFields = ["id", "slug", "title", "description", "importance", "contentType", "status", "family", "body"] as const;
const listFields = ["journeyStageIds", "topicIds", "audienceIds", "geographicScopes", "sourceIds", "termIds", "searchTerms", "residenceStatusIds"] as const;
const metadataOrder = ["id", "title", "description", "slug", "journeyStageIds", "topicIds", "audienceIds", "geographicScopes", "importance", "contentType",
  "sourceIds", "termIds", "searchTerms", "residenceStatusIds", "relationships", "status", "createdAt", "updatedAt"] as const;

export type ArticleCreationPlan = Readonly<{
  id: string;
  mdxPath: string;
  mdxText: string;
  registryPath: string;
  registrySourceRevision: string;
  importLine: string;
  entryLine: string;
  revision: string;
  warnings: readonly string[];
}>;

function localToday(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function readInput(input: unknown) {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new CmsEditError("Provide the new article's fields.", 400);
  const fields: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input)) {
    if ((textFields as readonly string[]).includes(key)) {
      if (typeof value !== "string" || Buffer.byteLength(value, "utf8") > (key === "body" ? 1_000_000 : 20_000)) throw new CmsEditError(`${key} must be text.`, 422);
      if (value.trim()) fields[key] = key === "body" ? value.replace(/\r\n?/g, "\n").trim() : value.trim();
    } else if ((listFields as readonly string[]).includes(key)) {
      if (!Array.isArray(value) || value.length > 100 || value.some((item) => typeof item !== "string" || item.length > 500)) {
        throw new CmsEditError(`${key} must be a list of up to 100 short text items.`, 422);
      }
      const items = [...new Set((value as string[]).map((item) => item.trim()).filter(Boolean))];
      if (items.length) fields[key] = items;
    } else if (key === "relationships") {
      if (!Array.isArray(value) || value.length > 50 || value.some((item) => !item || typeof item !== "object"
        || Object.keys(item).some((field) => !["type", "articleId"].includes(field))
        || !articleRelationshipTypeSchema.options.includes((item as { type?: string }).type as never)
        || typeof (item as { articleId?: unknown }).articleId !== "string")) {
        throw new CmsEditError("Each relationship needs a type (related, prerequisite, or next-step) and an article ID.", 422);
      }
      if (value.length) fields.relationships = (value as { type: string; articleId: string }[]).map(({ type, articleId }) => ({ type, articleId: articleId.trim() }));
    } else throw new CmsEditError(`${key} cannot be set when creating an article.`, 422);
  }
  for (const key of ["id", "title", "description", "importance", "contentType", "status", "family", "body"]) {
    if (!(key in fields)) throw new CmsEditError(`${key} is required.`, 422);
  }
  if (!stableId.test(fields.id as string)) throw new CmsEditError("The ID must be lowercase words separated by hyphens.", 422);
  if (fields.slug !== undefined && !stableId.test(fields.slug as string)) throw new CmsEditError("The slug must be lowercase words separated by hyphens.", 422);
  if (!stableId.test(fields.family as string)) throw new CmsEditError("Choose an article registry family.", 422);
  if (!["draft", "needs-review"].includes(fields.status as string)) {
    throw new CmsEditError("A new article starts as Draft or Editorial review. Approve it separately after review.", 422);
  }
  return fields;
}

function parseMetadata(fields: Record<string, unknown>, today: string): ArticleMetadata {
  const { family: _family, body: _body, ...metadata } = fields;
  void _family; void _body;
  try {
    return articleMetadataSchema.parse({ ...metadata, slug: fields.slug ?? fields.id, createdAt: today, updatedAt: today });
  } catch (error) {
    const issues = (error as { issues?: { path: (string | number)[]; message: string }[] }).issues;
    throw new CmsEditError(issues?.length ? issues.map((issue) => `${issue.path.join(".") || "article"}: ${issue.message}`).join(" ") : "The article metadata is not valid.", 422);
  }
}

const literal = (value: unknown): string => Array.isArray(value)
  ? `[${value.map((item) => typeof item === "object" && item
    ? `{ ${Object.entries(item).map(([key, entry]) => `${key}: ${JSON.stringify(entry)}`).join(", ")} }`
    : JSON.stringify(item)).join(", ")}]`
  : JSON.stringify(value);

/** MDX in the style of the existing articles: one metadata property per line, then the body. */
function mdxText(metadata: ArticleMetadata, body: string): string {
  const properties = metadataOrder.flatMap((key) => {
    const value = metadata[key as keyof ArticleMetadata];
    if (value === undefined) return [];
    return [`  ${key}: ${literal(value)},`];
  });
  return `export const metadata = {\n${properties.join("\n")}\n}\n\n${body}\n`;
}

function pascalCase(id: string): string {
  return id.split("-").map((part) => part[0]!.toUpperCase() + part.slice(1)).join("");
}

/** Identifiers for the new import that do not collide with any name already used in the module. */
function importNames(source: string, id: string) {
  const base = /^[0-9]/.test(id) ? `Article${pascalCase(id)}` : pascalCase(id);
  for (let suffix = 0; suffix < 100; suffix += 1) {
    const component = suffix ? `${base}${suffix + 1}` : base;
    const metadata = `${component[0]!.toLowerCase()}${component.slice(1)}Metadata`;
    if (!new RegExp(`\\b(${component}|${metadata})\\b`).test(source)) return { component, metadata };
  }
  throw new CmsEditError("Could not choose a unique import name for this article.", 422);
}

async function registryFamilies(projectRoot: string): Promise<string[]> {
  return (await readdir(resolve(projectRoot, registryDirectory)))
    .filter((name) => name.endsWith(".ts") && !name.endsWith(".test.ts") && name !== "registration.ts").map((name) => name.slice(0, -3)).sort();
}

async function prepare(projectRoot: string, input: unknown, today: string) {
  const fields = readInput(input);
  const metadata = parseMetadata(fields, today);
  const body = fields.body as string;
  await previewArticleBody(body);
  const catalog = await readArticleCatalog(projectRoot);
  try {
    validateArticleCollection([...[...catalog.details.values()].map(({ metadata: existing }) => existing), metadata], knownSources(),
      residenceStatuses.map(({ id }) => id), knownStructuredValues("glossary-term").map(({ id }) => id));
  } catch (error) {
    throw new CmsEditError(error instanceof Error ? error.message : "The article conflicts with the existing catalog.", 422);
  }
  const mdxPath = `content/articles/${metadata.id}.mdx`;
  const articleDirectory = await realpath(resolve(projectRoot, "content/articles"));
  const mdxTarget = join(articleDirectory, `${metadata.id}.mdx`);
  if (await readFile(mdxTarget).then(() => true, () => false)) throw new CmsEditError(`${mdxPath} already exists.`, 409);

  const registryPath = `${registryDirectory}/${fields.family as string}.ts`;
  if (!(await registryFamilies(projectRoot)).includes(fields.family as string)) {
    throw new CmsEditError(`${registryPath} is not an article registry module.`, 422);
  }
  const registryRoot = await realpath(resolve(projectRoot, registryDirectory));
  const registryTarget = await realpath(resolve(projectRoot, registryPath));
  if (!registryTarget.startsWith(`${registryRoot}${sep}`)) throw new CmsEditError("The registry module escapes the registry directory.", 403);
  const original = await readFile(registryTarget, "utf8");
  const newline = original.includes("\r\n") ? "\r\n" : "\n";
  const file = ts.createSourceFile(registryPath, original, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const articleImports = file.statements.filter((statement): statement is ts.ImportDeclaration => ts.isImportDeclaration(statement)
    && ts.isStringLiteral(statement.moduleSpecifier) && statement.moduleSpecifier.text.endsWith(".mdx"));
  const arrays = file.statements.flatMap((statement) => ts.isVariableStatement(statement)
    && statement.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)
    ? statement.declarationList.declarations.flatMap((declaration) => {
      let initializer = declaration.initializer;
      while (initializer && (ts.isSatisfiesExpression(initializer) || ts.isAsExpression(initializer))) initializer = initializer.expression;
      return initializer && ts.isArrayLiteralExpression(initializer) ? [initializer] : [];
    })
    : []);
  if (!articleImports.length || arrays.length !== 1) throw new CmsEditError(`${registryPath} does not have the expected imports and one registration list.`, 409);
  const names = importNames(original, metadata.id);
  const importLine = `import ${names.component}, { metadata as ${names.metadata} } from "../../../../content/articles/${metadata.id}.mdx";`;
  const entryLine = `  [${names.metadata}, ${names.component}],`;
  const array = arrays[0]!;
  let entryAt = array.getEnd() - 1;
  while (entryAt > array.getStart() + 1 && /\s/.test(original[entryAt - 1]!)) entryAt -= 1;
  const separator = array.elements.length && original[entryAt - 1] !== "," ? "," : "";
  const importAt = articleImports[articleImports.length - 1]!.getEnd();
  // Apply the later edit first so the earlier offset stays valid.
  let next = `${original.slice(0, entryAt)}${separator}${newline}${entryLine}${original.slice(entryAt)}`;
  next = `${next.slice(0, importAt)}${newline}${importLine}${next.slice(importAt)}`;
  const parsed = ts.createSourceFile(registryPath, next, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  if (((parsed as unknown as { parseDiagnostics?: readonly unknown[] }).parseDiagnostics?.length ?? 0) > 0) {
    throw new CmsEditError("The registry change would not parse.", 422);
  }
  // Follow the line endings of the existing articles.
  const sample = (await readdir(articleDirectory)).find((name) => name.endsWith(".mdx"));
  const articleNewline = sample && (await readFile(join(articleDirectory, sample), "utf8")).includes("\r\n") ? "\r\n" : "\n";
  const text = mdxText(metadata, body).replaceAll("\n", articleNewline);
  const inGroups = articleGroups.some(({ articleIds }) => articleIds.includes(metadata.id));
  const inJourneys = guidedJourneys.some((journey) => JSON.stringify(journey).includes(`"${metadata.id}"`));
  const warnings = inGroups || inJourneys ? [] : [
    "The new article is not in any article group or guided journey, so those pages will not include it until their registries do (in code). Catalog and search listings include it.",
  ];
  const plan: ArticleCreationPlan = {
    id: metadata.id, mdxPath, mdxText: text, registryPath, registrySourceRevision: hash(original), importLine, entryLine,
    revision: articleSourceRevision(text), warnings,
  };
  return { plan, mdxTarget, registryTarget, original, next };
}

export async function planArticleCreation(projectRoot: string, input: unknown, today = localToday()): Promise<ArticleCreationPlan> {
  return (await prepare(projectRoot, input, today)).plan;
}

/** Writes the MDX file (create-only) and the registry change; removes the new file again if the registry write fails. */
export async function createArticle(projectRoot: string, input: unknown, expectedRegistryRevision: unknown, today = localToday()) {
  return withCmsCreationLock(projectRoot, async () => {
    if (typeof expectedRegistryRevision !== "string" || !/^[a-f0-9]{64}$/.test(expectedRegistryRevision)) {
      throw new CmsEditError("Preview the new article before creating it.", 400);
    }
    const { plan, mdxTarget, registryTarget, original, next } = await prepare(projectRoot, input, today);
    if (plan.registrySourceRevision !== expectedRegistryRevision) throw new CmsEditError(`${plan.registryPath} changed after the preview. Preview again.`, 409);
    return withCmsFileLock(mdxTarget, async () => {
      await guardCmsWrite(projectRoot, mdxTarget);
      await guardCmsWrite(projectRoot, registryTarget);
      const cmsDirectory = join(await realpath(projectRoot), ".cms");
      await mkdir(cmsDirectory, { recursive: true });
      const temporary = join(cmsDirectory, `${plan.id}-${randomUUID()}.tmp`);
      try {
        await writeFile(temporary, plan.mdxText, { flag: "wx" });
        // link() fails if the file exists, so an article created meanwhile is never replaced.
        try { await link(temporary, mdxTarget); }
        catch (error) {
          if ((error as NodeJS.ErrnoException).code === "EEXIST") throw new CmsEditError(`${plan.mdxPath} already exists.`, 409);
          throw error;
        }
      } finally { await rm(temporary, { force: true }); }
      try {
        await replaceSource(projectRoot, registryTarget, original, next);
      } catch (error) {
        if (hash(await readFile(mdxTarget, "utf8")) === hash(plan.mdxText)) await unlink(mdxTarget);
        throw error;
      }
      await noteCmsWrite(projectRoot, mdxTarget);
      return { created: true, kind: "article" as const, id: plan.id, path: plan.mdxPath, registryPath: plan.registryPath, revision: plan.revision };
    });
  });
}

/** Choices for the article form; the server validates every submission again. */
export async function articleCreationOptions(projectRoot: string) {
  return {
    registryFamilies: await registryFamilies(projectRoot),
    journeyStages: [...JOURNEY_STAGE_IDS], topics: [...TOPIC_IDS], audiences: [...AUDIENCE_IDS],
    geographicScopes: [...GEOGRAPHIC_SCOPE_IDS], importance: [...IMPORTANCE_IDS], contentTypes: [...CONTENT_TYPE_IDS],
    relationshipTypes: [...articleRelationshipTypeSchema.options],
  };
}
