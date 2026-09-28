import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, isAbsolute, relative, resolve, sep } from "node:path";
import ts from "typescript";
import { sources as officialSources } from "@/data/sources";
import { japaneseLocalGuidanceLocationTranslations } from "@/data/translations/ja/local-guidance";
import { localGuidanceArticleOrder, localGuidanceLocations } from "@/data/local-guidance";
import { localGuidanceSupplementSchema, type LocalGuidanceRecheck, type LocalGuidanceSupplement } from "@/domain/geography/local-guidance";
import { translationSourceFields } from "@/domain/translation/translation-source-fields";
import { createTranslationSourceRevision } from "@/lib/translation/source-revision-core";
import { structuredEditorialRevision } from "@/lib/editorial/editorial-catalog";
import type { LocalGuidanceGenerator } from "@/data/translations/ja/local-guidance/define";

export type LocalGuidanceTranslationState = "current" | "stale" | "missing";
export type LocalGuidanceTranslationReviewState = "machine-translated" | "human-reviewed";
export type LocalGuidanceFieldValues = Readonly<Record<string, readonly [number, number] | undefined>>;
export type LocalGuidanceDetail = Readonly<{
  id: string;
  locationId: string;
  locationName: string;
  articleId: string;
  title: string;
  revision: string;
  source: Readonly<{
    path: string;
    sourceRevision: string;
    objectStart: number;
    objectEnd: number;
    fieldValues: LocalGuidanceFieldValues;
    fieldProperties: Readonly<Record<"receivingOffice" | "sourceFormatNote", readonly [number, number] | undefined>>;
  }>;
  value: LocalGuidanceSupplement;
  sources: readonly Readonly<{ id: string; title: string; organization: string; url: string; language?: string; lastCheckedAt?: string; lastReviewedAt?: string }> [];
  recheck: readonly LocalGuidanceRecheck[];
  translation: LocalGuidanceTranslationState;
  generator?: LocalGuidanceGenerator;
  translationReviewState?: LocalGuidanceTranslationReviewState;
}>;
export type LocalGuidanceSupplementSummary = Readonly<{
  id: string;
  articleId: string;
  title: string;
  translation: LocalGuidanceTranslationState;
  generator?: LocalGuidanceGenerator;
}>;
export type LocalGuidanceLocationSummary = Readonly<{
  id: string;
  name: string;
  prefectureId?: string;
  supplements: readonly LocalGuidanceSupplementSummary[];
}>;
export type LocalGuidanceCatalogFailure = Readonly<{ path: string; error: string }>;

type RegistrationPath = { path: string; locationPath: string; prefectureId: string };
type ParsedSupplement = { object: ts.ObjectLiteralExpression; id: string };
type TranslationInfo = { sourceRevision: string; generator: LocalGuidanceGenerator; reviewState: string };

const sha256 = (value: string) => createHash("sha256").update(value, "utf8").digest("hex");
const sourceBaselines = new Map<string, string>();
const valueOverlays = new Map<string, Map<string, LocalGuidanceSupplement>>();
const parsedFiles = new Map<string, { source: string; file: ts.SourceFile; revision: string }>();
const registrationsByRoot = new Map<string, readonly RegistrationPath[]>();
const pathByRootAndSupplementId = new Map<string, string>();

function property(object: ts.ObjectLiteralExpression, name: string): ts.PropertyAssignment | undefined {
  return object.properties.find((item): item is ts.PropertyAssignment => ts.isPropertyAssignment(item)
    && (ts.isIdentifier(item.name) || ts.isStringLiteral(item.name)) && item.name.text === name);
}

function stringValue(node: ts.Expression | undefined): string | undefined {
  return node && (ts.isStringLiteralLike(node) || ts.isNoSubstitutionTemplateLiteral(node)) ? node.text : undefined;
}

function editableStringExpression(node: ts.Expression): boolean {
  return ts.isStringLiteralLike(node) || ts.isTemplateExpression(node);
}

function namedConst(file: ts.SourceFile, name: string): ts.Expression | undefined {
  for (const statement of file.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (ts.isIdentifier(declaration.name) && declaration.name.text === name) return declaration.initializer;
    }
  }
  return undefined;
}

function unwrapAssertions(expression: ts.Expression | undefined): ts.Expression | undefined {
  let current = expression;
  while (current && (ts.isAsExpression(current) || ts.isTypeAssertionExpression(current) || ts.isSatisfiesExpression(current))) {
    current = current.expression;
  }
  return current;
}

function importBindings(file: ts.SourceFile): Map<string, string> {
  const result = new Map<string, string>();
  for (const statement of file.statements) {
    if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier)) continue;
    const clause = statement.importClause;
    const bindings = clause?.namedBindings;
    if (!bindings || !ts.isNamedImports(bindings)) continue;
    for (const item of bindings.elements) result.set(item.name.text, statement.moduleSpecifier.text);
  }
  return result;
}

function resolveRegistrationPath(root: string, fromPath: string, modulePath: string): string {
  if (!modulePath.startsWith(".")) throw new Error(`Registration import must be relative: ${modulePath}`);
  const moduleBase = resolve(root, dirname(fromPath), modulePath);
  const candidate = existsSync(`${moduleBase}.ts`) ? `${moduleBase}.ts` : resolve(moduleBase, "index.ts");
  const rel = relative(root, candidate);
  if (isAbsolute(rel) || rel === ".." || rel.startsWith(`..${sep}`)) throw new Error(`Registration path escapes the repository: ${modulePath}`);
  return rel.split(sep).join("/");
}

function findCallObject(file: ts.SourceFile, callName: string): ts.ObjectLiteralExpression | undefined {
  let found: ts.ObjectLiteralExpression | undefined;
  const visit = (node: ts.Node) => {
    if (ts.isCallExpression(node) && node.expression.getText(file) === callName
      && node.arguments[0] && ts.isObjectLiteralExpression(node.arguments[0])) found = node.arguments[0];
    if (!found) ts.forEachChild(node, visit);
  };
  visit(file);
  return found;
}

async function sourceFile(root: string, path: string): Promise<{ source: string; file: ts.SourceFile; revision: string }> {
  const source = await readFile(resolve(root, path), "utf8");
  const revision = sha256(source);
  const absolutePath = resolve(root, path);
  const cached = parsedFiles.get(absolutePath);
  if (cached?.revision === revision) return cached;
  const parsed = { source, file: ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS), revision };
  parsedFiles.set(absolutePath, parsed);
  return parsed;
}

/**
 * Follow the import and array registrations all the way from the canonical location index to each location module.
 * This intentionally does not infer paths from IDs or enumerate folders.
 */
async function registeredPaths(root: string, failures: LocalGuidanceCatalogFailure[]): Promise<RegistrationPath[]> {
  const cached = registrationsByRoot.get(resolve(root));
  if (cached) return [...cached];
  const rootIndex = "src/data/local-guidance/locations/index.ts";
  let source: string;
  try { source = await readFile(resolve(root, rootIndex), "utf8"); }
  catch (error) {
    failures.push({ path: rootIndex, error: error instanceof Error ? error.message : String(error) });
    return [];
  }
  const file = ts.createSourceFile(rootIndex, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const bindings = importBindings(file);
  const registered = unwrapAssertions(namedConst(file, "prefectureGuidance"));
  if (!registered || !ts.isArrayLiteralExpression(registered)) {
    failures.push({ path: rootIndex, error: "prefectureGuidance must be a registered array of imported prefecture identifiers." });
    return [];
  }
  const result: RegistrationPath[] = [];
  for (const item of registered.elements) {
    if (!ts.isIdentifier(item) || !bindings.has(item.text)) {
      failures.push({ path: rootIndex, error: "The prefecture registry contains an unsupported non-import entry." });
      continue;
    }
    try {
      const prefecturePath = resolveRegistrationPath(root, rootIndex, bindings.get(item.text)!);
      const prefectureSource = await readFile(resolve(root, prefecturePath), "utf8");
      const prefectureFile = ts.createSourceFile(prefecturePath, prefectureSource, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
      const prefectureBindings = importBindings(prefectureFile);
      const object = findCallObject(prefectureFile, "definePrefectureGuidance");
      const prefectureGeography = object && property(object, "geography")?.initializer;
      const prefectureId = prefectureGeography && ts.isObjectLiteralExpression(prefectureGeography)
        ? stringValue(property(prefectureGeography, "id")?.initializer) : undefined;
      if (!prefectureId) {
        failures.push({ path: prefecturePath, error: "The prefecture registration must have a literal geography ID." });
        continue;
      }
      const locationsProperty = object && property(object, "locations");
      if (!locationsProperty || !ts.isArrayLiteralExpression(locationsProperty.initializer)) {
        failures.push({ path: prefecturePath, error: "The prefecture registration must contain a literal locations array." });
        continue;
      }
      for (const location of locationsProperty.initializer.elements) {
        if (!ts.isIdentifier(location) || !prefectureBindings.has(location.text)) {
          failures.push({ path: prefecturePath, error: "The locations array contains an unsupported non-import entry." });
          continue;
        }
        result.push({ path: prefecturePath, prefectureId, locationPath: resolveRegistrationPath(root, prefecturePath, prefectureBindings.get(location.text)!) });
      }
    } catch (error) {
      failures.push({ path: rootIndex, error: error instanceof Error ? error.message : String(error) });
    }
  }
  if (!failures.length) registrationsByRoot.set(resolve(root), result);
  return result;
}

function translationInfoBySupplement(): Map<string, TranslationInfo> {
  const result = new Map<string, TranslationInfo>();
  for (const location of japaneseLocalGuidanceLocationTranslations) {
    const artifacts = new Map(location.artifacts.map((artifact) => [artifact.contentId, artifact]));
    for (const entry of location.entries) {
      const artifact = artifacts.get(entry.supplementId);
      if (artifact) result.set(entry.supplementId, { sourceRevision: entry.sourceRevision, generator: entry.generator, reviewState: artifact.reviewState });
    }
  }
  return result;
}

function parseSupplementObjects(file: ts.SourceFile, path: string): ParsedSupplement[] {
  const call = (() => {
    let result: ts.CallExpression | undefined;
    const visit = (node: ts.Node) => {
      if (ts.isCallExpression(node) && node.expression.getText(file) === "defineLocationGuidance") result = node;
      if (!result) ts.forEachChild(node, visit);
    };
    visit(file);
    return result;
  })();
  const input = call?.arguments[0];
  if (!input || !ts.isObjectLiteralExpression(input)) throw new Error(`${path}: guidance must call defineLocationGuidance with an object literal.`);
  const list = property(input, "supplements")?.initializer;
  if (!list || !ts.isArrayLiteralExpression(list)) throw new Error(`${path}: supplements must be a literal array.`);
  return list.elements.map((item) => {
    if (!ts.isObjectLiteralExpression(item)) throw new Error(`${path}: every supplement must be a direct object literal.`);
    const id = stringValue(property(item, "id")?.initializer);
    if (!id) throw new Error(`${path}: every supplement must have a literal ID.`);
    return { object: item, id };
  });
}

function fieldRanges(sourceFile: ts.SourceFile, object: ts.ObjectLiteralExpression, path: string): {
  values: LocalGuidanceFieldValues;
  properties: Readonly<Record<"receivingOffice" | "sourceFormatNote", readonly [number, number] | undefined>>;
} {
  const ranges: Record<string, readonly [number, number] | undefined> = {};
  const properties: Record<"receivingOffice" | "sourceFormatNote", readonly [number, number] | undefined> = {
    receivingOffice: undefined,
    sourceFormatNote: undefined,
  };
  for (const name of ["title", "summary", "applicability", "responsibleBody", "receivingOffice", "sourceFormatNote"]) {
    const item = property(object, name);
    if (!item) { ranges[name] = undefined; continue; }
    if (!editableStringExpression(item.initializer)) throw new Error(`${path}: ${name} must be a string literal or template expression for safe CMS editing.`);
    ranges[name] = [item.initializer.getStart(sourceFile), item.initializer.getEnd()];
    if (name === "receivingOffice" || name === "sourceFormatNote") {
      properties[name] = [item.getStart(sourceFile), item.getEnd()];
    }
  }
  const actions = property(object, "actions")?.initializer;
  if (!actions || !ts.isArrayLiteralExpression(actions)) throw new Error(`${path}: actions must be a literal array.`);
  actions.elements.forEach((action, index) => {
    if (!ts.isObjectLiteralExpression(action)) throw new Error(`${path}: actions[${index}] must be an object literal.`);
    for (const field of ["title", "description"] as const) {
      const item = property(action, field);
      if (!item || !editableStringExpression(item.initializer)) throw new Error(`${path}: actions[${index}].${field} must be a string literal or template expression.`);
      ranges[`actions.${index}.${field}`] = [item.initializer.getStart(sourceFile), item.initializer.getEnd()];
    }
  });
  return { values: ranges, properties };
}

export function localGuidanceTranslationState(value: LocalGuidanceSupplement, sourceRevision?: string): LocalGuidanceTranslationState {
  if (!sourceRevision) return "missing";
  const current = createTranslationSourceRevision(translationSourceFields["local-guidance-supplement"](value));
  return current === sourceRevision ? "current" : "stale";
}

/** Called only after a guarded CMS save succeeds, so a refresh can use the new in-process value and file revision. */
export function noteCmsLocalGuidanceWrite(root: string, supplementId: string, nextValue: LocalGuidanceSupplement, nextSourceRevision: string): void {
  const absoluteRoot = resolve(root);
  const rootAndId = `${absoluteRoot}:${supplementId}`;
  const path = pathByRootAndSupplementId.get(rootAndId);
  if (!path) throw new Error(`Cannot track CMS save for unknown local guidance supplement ${supplementId}.`);
  const absolutePath = resolve(absoluteRoot, path);
  sourceBaselines.set(absolutePath, nextSourceRevision);
  const overlays = valueOverlays.get(absoluteRoot) ?? new Map<string, LocalGuidanceSupplement>();
  overlays.set(supplementId, localGuidanceSupplementSchema.parse(nextValue));
  valueOverlays.set(absoluteRoot, overlays);
}

export async function readLocalGuidanceCatalog(root: string) {
  const absoluteRoot = resolve(root);
  const failures: LocalGuidanceCatalogFailure[] = [];
  const registrations = await registeredPaths(absoluteRoot, failures);
  const registeredLocationById = new Map(localGuidanceLocations.map((location) => [location.geography.id, location]));
  const translationEntries = translationInfoBySupplement();
  const details = new Map<string, LocalGuidanceDetail>();
  const locations: LocalGuidanceLocationSummary[] = [];
  const sourceById = new Map(officialSources.map((source) => [source.id, source]));
  const locationPathsSeen = new Set<string>();

  for (const registration of registrations) {
    if (locationPathsSeen.has(registration.locationPath)) {
      failures.push({ path: registration.locationPath, error: "The same location module is registered more than once." });
      continue;
    }
    locationPathsSeen.add(registration.locationPath);
    try {
      const parsed = await sourceFile(absoluteRoot, registration.locationPath);
      const baseline = sourceBaselines.get(resolve(absoluteRoot, registration.locationPath));
      if (baseline && baseline !== parsed.revision) throw new Error("This location source changed outside the CMS. Restart the CMS before editing it.");
      sourceBaselines.set(resolve(absoluteRoot, registration.locationPath), parsed.revision);
      const locationObject = findCallObject(parsed.file, "defineLocationGuidance");
      const geography = locationObject && property(locationObject, "geography")?.initializer;
      if (!geography || !ts.isObjectLiteralExpression(geography)) throw new Error("The location must declare geography as a direct object literal.");
      const locationId = stringValue(property(geography, "id")?.initializer);
      if (!locationId) throw new Error("The location geography must have a literal ID.");
      const registered = registeredLocationById.get(locationId);
      if (!registered) throw new Error(`Registered location ${locationId} is absent from the loaded location catalog.`);
      const parsedSupplements = parseSupplementObjects(parsed.file, registration.locationPath);
      const byId = new Map(parsedSupplements.map((item) => [item.id, item]));
      if (byId.size !== registered.supplements.length || registered.supplements.some(({ id }) => !byId.has(id))) {
        throw new Error("The source supplement IDs do not match the loaded location registry.");
      }
      const summarySupplements: LocalGuidanceSupplementSummary[] = [];
      for (const registeredValue of registered.supplements) {
        const parsedSupplement = byId.get(registeredValue.id)!;
        const value = valueOverlays.get(absoluteRoot)?.get(registeredValue.id) ?? registeredValue;
        const translation = translationEntries.get(value.id);
        const state = localGuidanceTranslationState(value, translation?.sourceRevision);
        const ranges = fieldRanges(parsed.file, parsedSupplement.object, registration.locationPath);
        const resolvedSources = value.sourceIds.flatMap((id) => {
          const source = sourceById.get(id);
          if (!source) {
            failures.push({ path: registration.locationPath, error: `${value.id} cites unknown official source ${id}.` });
            return [];
          }
          return [source];
        });
        const recheck = registered.recheck.filter((item) => item.records.includes(value.id));
        const detail: LocalGuidanceDetail = {
          id: value.id,
          locationId,
          locationName: registered.geography.name,
          articleId: value.articleId,
          title: value.title,
          revision: structuredEditorialRevision(value),
          source: {
            path: registration.locationPath,
            sourceRevision: parsed.revision,
            objectStart: parsedSupplement.object.getStart(parsed.file),
            objectEnd: parsedSupplement.object.getEnd(),
            fieldValues: ranges.values,
            fieldProperties: ranges.properties,
          },
          value,
          sources: resolvedSources.map(({ id, title, organization, url, language, lastCheckedAt, lastReviewedAt }) => ({ id, title, organization, url, language, lastCheckedAt, lastReviewedAt })),
          recheck,
          translation: state,
          ...(translation ? { generator: translation.generator, translationReviewState: translation.reviewState as LocalGuidanceTranslationReviewState } : {}),
        };
        details.set(value.id, detail);
        pathByRootAndSupplementId.set(`${absoluteRoot}:${value.id}`, registration.locationPath);
        summarySupplements.push({ id: value.id, articleId: value.articleId, title: value.title, translation: state, ...(translation ? { generator: translation.generator } : {}) });
      }
      locations.push({ id: locationId, name: registered.geography.name, prefectureId: registration.prefectureId, supplements: summarySupplements });
    } catch (error) {
      failures.push({ path: registration.locationPath, error: error instanceof Error ? error.message : String(error) });
    }
  }

  const loadedIds = new Set(locations.map(({ id }) => id));
  for (const location of localGuidanceLocations) {
    if (!loadedIds.has(location.geography.id)) failures.push({ path: "src/data/local-guidance/locations/index.ts", error: `Registered location ${location.geography.id} has no supported source registration.` });
  }
  const guides = [...localGuidanceArticleOrder];
  return { locations, guides, details, failures };
}
