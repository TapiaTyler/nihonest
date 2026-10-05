import { readFile, readdir } from "node:fs/promises";
import { dirname, resolve, basename } from "node:path";
import ts from "typescript";
import { articleMetadataSchema, type ArticleMetadata } from "@/domain/article/article";
import { splitArticleSource } from "@/domain/article/article-source";

function sourceFile(path: string, text: string): ts.SourceFile {
  const file = ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const diagnostics = (file as ts.SourceFile & { parseDiagnostics: readonly ts.Diagnostic[] }).parseDiagnostics;
  if (diagnostics.length) throw new Error(`${path}: invalid TypeScript syntax.`);
  return file;
}
function unwrap(node: ts.Expression): ts.Expression {
  while (ts.isAsExpression(node) || ts.isSatisfiesExpression(node) || ts.isParenthesizedExpression(node)) node = node.expression;
  return node;
}
function array(node: ts.Expression, context: string): ts.ArrayLiteralExpression {
  const value = unwrap(node);
  if (!ts.isArrayLiteralExpression(value)) throw new Error(`${context}: expected a literal array.`);
  return value;
}
function literal(node: ts.Expression, depth = 0): unknown {
  if (depth > 32) throw new Error("Article metadata exceeds literal depth limit.");
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (ts.isNumericLiteral(node)) return Number(node.text);
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (node.kind === ts.SyntaxKind.NullKeyword) return null;
  if (ts.isArrayLiteralExpression(node)) return node.elements.map((item) => literal(item as ts.Expression, depth + 1));
  if (ts.isObjectLiteralExpression(node)) {
    const result: Record<string, unknown> = Object.create(null);
    for (const property of node.properties) {
      if (!ts.isPropertyAssignment(property) || (!ts.isIdentifier(property.name) && !ts.isStringLiteral(property.name))) {
        throw new Error("Article metadata requires ordinary literal properties.");
      }
      const key = property.name.text;
      if (key === "__proto__" || Object.hasOwn(result, key)) throw new Error("Duplicate or unsafe metadata property.");
      result[key] = literal(property.initializer, depth + 1);
    }
    return result;
  }
  throw new Error("Article metadata requires literals; expressions are not executed.");
}

/** Reads only the controlled metadata literal, never executes MDX, imports or arbitrary JavaScript. */
export function parseCanonicalArticleMetadata(source: string): ArticleMetadata {
  const text = splitArticleSource(source).metadataLiteral;
  if (text.length > 200_000) throw new Error("Article metadata exceeds size limit.");
  const file = sourceFile("metadata.ts", `const value = ${text};`);
  const statement = file.statements[0];
  if (!statement || !ts.isVariableStatement(statement)) throw new Error("Invalid metadata declaration.");
  return articleMetadataSchema.parse(literal(statement.declarationList.declarations[0]!.initializer!));
}

type Registration = { metadata: string; component: string; path: string };
/** Fail closed on registration code that cannot be represented by static import/tuple ordering. */
function readFamily(path: string, text: string, exportName: string, articleDirectory: string): string[] {
  const file = sourceFile(path, text);
  const imports = new Map<string, Registration>();
  let entries: ts.ArrayLiteralExpression | undefined;
  for (const statement of file.statements) {
    if (ts.isImportDeclaration(statement)) {
      if (statement.importClause?.isTypeOnly) continue;
      const clause = statement.importClause;
      if (!ts.isStringLiteral(statement.moduleSpecifier) || !clause?.name || !clause.namedBindings
        || !ts.isNamedImports(clause.namedBindings) || clause.namedBindings.elements.length !== 1) {
        throw new Error(`${path}: expected an MDX default component and one metadata import.`);
      }
      const binding = clause.namedBindings.elements[0]!;
      const target = resolve(dirname(path), statement.moduleSpecifier.text);
      if ((binding.propertyName?.text ?? binding.name.text) !== "metadata" || dirname(target) !== articleDirectory
        || !/^[a-z0-9]+(?:-[a-z0-9]+)*\.mdx$/.test(basename(target)) || imports.has(binding.name.text)) {
        throw new Error(`${path}: invalid or duplicate metadata import.`);
      }
      imports.set(binding.name.text, { metadata: binding.name.text, component: clause.name.text, path: target });
      continue;
    }
    if (!ts.isVariableStatement(statement) || !(statement.declarationList.flags & ts.NodeFlags.Const)
      || !statement.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)
      || statement.declarationList.declarations.length !== 1 || entries) throw new Error(`${path}: unsupported registration statement.`);
    const declaration = statement.declarationList.declarations[0]!;
    if (!ts.isIdentifier(declaration.name) || declaration.name.text !== exportName || !declaration.initializer) {
      throw new Error(`${path}: expected the imported registration export.`);
    }
    entries = array(declaration.initializer, path);
  }
  if (!entries) throw new Error(`${path}: missing registration array.`);
  const paths = entries.elements.map((element) => {
    const tuple = array(element as ts.Expression, path);
    if (tuple.elements.length !== 2 || !ts.isIdentifier(tuple.elements[0]!) || !ts.isIdentifier(tuple.elements[1]!)) {
      throw new Error(`${path}: registration entries must be metadata/component pairs.`);
    }
    const registration = imports.get(tuple.elements[0]!.text);
    if (!registration || registration.component !== tuple.elements[1]!.text) throw new Error(`${path}: unresolved or mismatched tuple.`);
    return registration.path;
  });
  if (paths.length !== imports.size || new Set(paths).size !== paths.length) throw new Error(`${path}: unused or duplicate MDX registration.`);
  return paths;
}

/** The existing compatibility catalog and six family tuples remain the only hand-maintained order inventory. */
export async function readOrderedArticleMetadata(projectRoot: string): Promise<readonly ArticleMetadata[]> {
  const root = resolve(projectRoot);
  const catalogPath = resolve(root, "src/lib/content/articles.ts");
  const registryDirectory = resolve(root, "src/lib/content/article-registry");
  const articleDirectory = resolve(root, "content/articles");
  const catalog = sourceFile(catalogPath, await readFile(catalogPath, "utf8"));
  const imports = new Map<string, { path: string; exportName: string }>();
  let assembly: ts.ArrayLiteralExpression | undefined;
  for (const statement of catalog.statements) {
    if (ts.isImportDeclaration(statement) && ts.isStringLiteral(statement.moduleSpecifier)) {
      const specifier = statement.moduleSpecifier.text;
      const target = specifier.startsWith("@/") ? resolve(root, "src", specifier.slice(2)) : resolve(dirname(catalogPath), specifier);
      if (dirname(target) !== registryDirectory) continue;
      if (statement.importClause?.isTypeOnly || !statement.importClause?.namedBindings
        || !ts.isNamedImports(statement.importClause.namedBindings)) throw new Error("Unsupported registration family import.");
      for (const binding of statement.importClause.namedBindings.elements) {
        if (imports.has(binding.name.text)) throw new Error("Duplicate registration family import.");
        imports.set(binding.name.text, { path: `${target}.ts`, exportName: binding.propertyName?.text ?? binding.name.text });
      }
    }
    if (ts.isVariableStatement(statement)) for (const declaration of statement.declarationList.declarations) {
      if (ts.isIdentifier(declaration.name) && declaration.name.text === "entries") {
        if (assembly || !declaration.initializer || !(statement.declarationList.flags & ts.NodeFlags.Const)) throw new Error("Invalid article assembly.");
        assembly = array(declaration.initializer, catalogPath);
      }
    }
  }
  if (!assembly) throw new Error("Missing article registration assembly.");
  const paths: string[] = [];
  const families = new Set<string>();
  for (const element of assembly.elements) {
    if (!ts.isSpreadElement(element) || !ts.isIdentifier(element.expression)) throw new Error("Article assembly requires ordered family spreads.");
    const name = element.expression.text;
    const family = imports.get(name);
    if (!family || families.has(name)) throw new Error("Unresolved or duplicate article family.");
    families.add(name);
    paths.push(...readFamily(family.path, await readFile(family.path, "utf8"), family.exportName, articleDirectory));
  }
  if (families.size !== imports.size) throw new Error("Unused article registration family.");
  const canonical = (await readdir(articleDirectory)).filter((name) => name.endsWith(".mdx")).map((name) => resolve(articleDirectory, name)).sort();
  if (new Set(paths).size !== paths.length || JSON.stringify([...paths].sort()) !== JSON.stringify(canonical)) {
    throw new Error("Every canonical MDX file must be registered exactly once.");
  }
  const metadata = await Promise.all(paths.map(async (path) => {
    try { return parseCanonicalArticleMetadata(await readFile(path, "utf8")); }
    catch (error) { throw new Error(`${path}: invalid canonical article metadata.`, { cause: error }); }
  }));
  if (new Set(metadata.map(({ id }) => id)).size !== metadata.length || new Set(metadata.map(({ slug }) => slug)).size !== metadata.length) {
    throw new Error("Article metadata IDs and slugs must be unique.");
  }
  return metadata;
}

export function serializeArticleMetadataModule(metadata: readonly ArticleMetadata[]): string {
  return '// Generated by scripts/build-article-metadata.ts; edit canonical MDX/registrations, not this file.\n'
    + 'import type { ArticleMetadata } from "@/domain/article/article";\n\n'
    + 'export const generatedArticleMetadata: readonly ArticleMetadata[] = [\n'
    + metadata.map((record) => `  ${JSON.stringify(record)},`).join("\n") + '\n];\n';
}
