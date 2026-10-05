import { readFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import ts from "typescript";
import { describe, expect, it } from "vitest";
import * as web from "./articles";
import * as plain from "./article-metadata";
import { generatedArticleMetadata } from "@/data/generated/article-metadata";
import { readOrderedArticleMetadata, serializeArticleMetadataModule, parseCanonicalArticleMetadata } from "./article-metadata-producer";

const onlyMetadata = (records: ReturnType<typeof web.getAllArticles>) => records.map(({ metadata }) => ({ metadata }));
describe("standalone article metadata", () => {
  it("is current, deterministic, and deep-equal to the web registry in its exact family/tuple order", async () => {
    const produced = await readOrderedArticleMetadata(process.cwd());
    expect(produced).toEqual(web.getAllArticles().map(({ metadata }) => metadata));
    expect(generatedArticleMetadata).toEqual(produced);
    expect(serializeArticleMetadataModule(produced)).toBe(await readFile(resolve("src/data/generated/article-metadata.ts"), "utf8"));
    expect(serializeArticleMetadataModule(await readOrderedArticleMetadata(process.cwd()))).toBe(serializeArticleMetadataModule(produced));
    expect(plain.getAllArticles()).toEqual(onlyMetadata(web.getAllArticles()));
    expect(plain.getAllArticles()).toHaveLength(98);
    expect(plain.getAllArticles().every((article) => !Object.hasOwn(article, "Content"))).toBe(true);
  });
  it("preserves every known ID/slug lookup and unknown lookup behavior", () => {
    for (const { metadata } of web.getAllArticles()) {
      expect(plain.getArticleById(metadata.id)).toEqual({ metadata });
      expect(plain.getArticleBySlug(metadata.slug)).toEqual({ metadata });
      expect(plain.getArticleGroupsByArticleIds([metadata.id])).toEqual(web.getArticleGroupsByArticleIds([metadata.id]));
      expect(plain.getGuidedJourneysByArticleIds([metadata.id])).toEqual(web.getGuidedJourneysByArticleIds([metadata.id]));
    }
    expect(plain.getArticleById("unknown")).toBeUndefined();
    expect(plain.getArticleBySlug("unknown")).toBeUndefined();
    expect(plain.getArticleGroupsByArticleIds([])).toEqual([]);
    expect(plain.getGuidedJourneysByArticleIds(["unknown"])).toEqual([]);
    const ids = [web.getAllArticles()[0]!.metadata.id, web.getAllArticles().at(-1)!.metadata.id, "unknown"];
    expect(plain.getArticleGroupsByArticleIds(ids)).toEqual(web.getArticleGroupsByArticleIds(ids));
    expect(plain.getGuidedJourneysByArticleIds(ids)).toEqual(web.getGuidedJourneysByArticleIds(ids));
  });
  it("preserves all group/journey memberships, order, steps and known/unknown route variants", () => {
    expect(plain.getAllArticleGroups()).toEqual(web.getAllArticleGroups());
    expect(plain.getAllGuidedJourneys()).toEqual(web.getAllGuidedJourneys());
    for (const groupId of [...web.getAllArticleGroups().map(({ id }) => id), "unknown"]) {
      expect(plain.getArticleGroupById(groupId)).toEqual(web.getArticleGroupById(groupId));
      expect(plain.getArticlesByGroup(groupId)).toEqual(onlyMetadata(web.getArticlesByGroup(groupId)));
      expect(plain.getJourneysByGroup(groupId)).toEqual(web.getJourneysByGroup(groupId));
    }
    for (const journeyId of [...web.getAllGuidedJourneys().map(({ id }) => id), "unknown"]) {
      expect(plain.getGuidedJourneyById(journeyId)).toEqual(web.getGuidedJourneyById(journeyId));
      expect(plain.getArticlesByJourney(journeyId)).toEqual(onlyMetadata(web.getArticlesByJourney(journeyId)));
      const journey = web.getGuidedJourneyById(journeyId);
      for (const routeId of [undefined, "unknown", ...journey?.routes.map(({ id }) => id) ?? []]) {
        expect(plain.getJourneyRoute(journeyId, routeId)).toEqual(web.getJourneyRoute(journeyId, routeId));
        expect(plain.getJourneySteps(journeyId, routeId)).toEqual(web.getJourneySteps(journeyId, routeId)
          .map(({ step, article }) => ({ step, article: { metadata: article.metadata } })));
      }
    }
  });
  it("reads metadata without executing expressions, including in protected property positions", async () => {
    const source = await readFile(resolve("content/articles/planning-your-studies-in-japan.mdx"), "utf8");
    expect(parseCanonicalArticleMetadata(source)).toEqual(web.getArticleById("planning-your-studies-in-japan")!.metadata);
    for (const expression of ["(() => { throw new Error('executed'); })()", "globalThis.process.env", "`value${unknown}`"]) {
      const malicious = source.replace('export const metadata = {', `export const metadata = { malicious: ${expression},`);
      expect(() => parseCanonicalArticleMetadata(malicious)).toThrow("literals");
    }
    expect(() => parseCanonicalArticleMetadata(source.replace("export const metadata = {", "export const metadata = { __proto__: {},"))).toThrow("unsafe");
    expect(() => parseCanonicalArticleMetadata(source.replace("export const metadata = {", 'export const metadata = { title: "duplicate",'))).toThrow("Duplicate");
  });
  it("has no transitive runtime React/Next/MDX/Node dependency, including the complete catalog facade", async () => {
    const seen = new Set<string>();
    const queue = [resolve("src/lib/content/article-metadata.ts"), resolve("src/domain/article/article-metadata-catalog.ts")];
    while (queue.length) {
      const path = queue.pop()!;
      if (seen.has(path)) continue;
      seen.add(path);
      expect(path).not.toMatch(/\.(?:tsx|mdx)$/);
      const source = ts.createSourceFile(path, await readFile(path, "utf8"), ts.ScriptTarget.Latest, true);
      const visit = (node: ts.Node) => {
        expect(ts.isCallExpression(node) && (node.expression.kind === ts.SyntaxKind.ImportKeyword
          || (ts.isIdentifier(node.expression) && node.expression.text === "require")), path).toBe(false);
        ts.forEachChild(node, visit);
      };
      visit(source);
      for (const statement of source.statements) {
        if (!ts.isImportDeclaration(statement) && !ts.isExportDeclaration(statement)) continue;
        if (ts.isImportDeclaration(statement) && statement.importClause?.isTypeOnly) continue;
        if (ts.isExportDeclaration(statement) && statement.isTypeOnly) continue;
        if (!statement.moduleSpecifier || !ts.isStringLiteral(statement.moduleSpecifier)) continue;
        const bindings = ts.isImportDeclaration(statement) ? statement.importClause?.namedBindings : statement.exportClause;
        if (bindings && (ts.isNamedImports(bindings) || ts.isNamedExports(bindings)) && bindings.elements.length
          && bindings.elements.every((binding) => binding.isTypeOnly) && !(ts.isImportDeclaration(statement) && statement.importClause?.name)) continue;
        const specifier = statement.moduleSpecifier.text;
        if (specifier === "zod") continue;
        expect(specifier.startsWith("@/") || specifier.startsWith("."), `${path}: ${specifier}`).toBe(true);
        const target = specifier.startsWith("@/") ? resolve("src", specifier.slice(2)) : resolve(dirname(path), specifier);
        let resolved: string | undefined;
        for (const candidate of [target, `${target}.ts`, resolve(target, "index.ts")]) {
          try { await readFile(candidate); resolved = candidate; break; } catch { /* Try the next module path. */ }
        }
        expect(resolved, `${path}: ${specifier}`).toBeDefined();
        queue.push(resolved!);
      }
    }
    expect(seen.has(resolve("src/data/generated/article-metadata.ts"))).toBe(true);
    expect(seen.has(resolve("src/lib/content/articles.ts"))).toBe(false);
    expect(seen.size).toBeGreaterThan(20);
    // Parses the whole runtime import tree (large data modules included), which exceeds 5s under full-suite load.
  }, 30_000);
});
