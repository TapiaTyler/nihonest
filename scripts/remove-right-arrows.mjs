/** Remove audited right-facing UI arrows while preserving study directions and map panning. */
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = process.cwd();
const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const dryRun = process.argv.includes("--dry-run");
const check = process.argv.includes("--check");
const audit = JSON.parse(execFileSync(process.execPath, [join(scriptDirectory, "audit-right-arrows.mjs"), "--json"], { cwd: root, encoding: "utf8" }));

function preserve({ category, path, context }) {
  return category === "study direction label"
    || (path === "src/components/content/prefecture-map.tsx" && context.includes('aria-label="Pan map east"'));
}

const removals = audit.findings.filter((finding) => !preserve(finding));
const preserved = audit.findings.length - removals.length;
if (check) {
  console.log(`${removals.length} removable right-facing arrows remain; ${preserved} intentional arrows are preserved.`);
  if (removals.length) process.exitCode = 1;
  process.exit();
}

function sourceRevision(source) {
  return createHash("sha256").update(JSON.stringify({ source: source.replace(/\r\n?/g, "\n") }), "utf8").digest("hex");
}

const byPath = new Map();
for (const finding of removals) byPath.set(finding.path, [...(byPath.get(finding.path) ?? []), finding]);
const changed = new Map();
const articleRevisions = new Map();

for (const [path, findings] of byPath) {
  const original = readFileSync(join(root, path), "utf8");
  let source = original;
  for (const { offset, arrow } of findings.sort((left, right) => right.offset - left.offset)) {
    if (source.slice(offset, offset + arrow.length) !== arrow) throw new Error(`Arrow changed during audit: ${path}:${offset}`);
    let start = offset;
    let end = offset + arrow.length;
    const openingSpan = source.slice(0, start).match(/<span\b[^>]*aria-hidden="true"[^>]*>$/);
    if (openingSpan && source.slice(end).startsWith("</span>")) {
      start -= openingSpan[0].length;
      end += "</span>".length;
      const lineStart = source.lastIndexOf("\n", start - 1) + 1;
      const lineEnd = source.indexOf("\n", end);
      if (!source.slice(lineStart, start).trim() && !source.slice(end, lineEnd === -1 ? undefined : lineEnd).trim()) {
        start = lineStart;
        end = lineEnd === -1 ? source.length : lineEnd + 1;
      }
    } else if (source[start - 1] === " " && /[\]<"'`}\r\n]/.test(source[end] ?? "")) {
      start -= 1;
    }
    source = source.slice(0, start) + source.slice(end);
  }
  changed.set(path, source);
  if (path.startsWith("content/articles/") && path.endsWith(".mdx")) {
    const id = original.match(/\bid:\s*"([a-z0-9-]+)"/)?.[1];
    if (id) articleRevisions.set(id, { before: sourceRevision(original), after: sourceRevision(source) });
  }
}

let updatedRevisions = 0;
const staleBeforeCleanup = new Set();
for (const entry of readdirSync(join(root, "src/data/translations/ja"), { withFileTypes: true })) {
  if (!entry.isFile() || !/article-translations.*\.ts$/.test(entry.name)) continue;
  const path = `src/data/translations/ja/${entry.name}`;
  const source = changed.get(path) ?? readFileSync(join(root, path), "utf8");
  const sourceFile = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const replacements = [];

  function recordRevision(idNode, revisionNode) {
    if (!idNode || !revisionNode || !ts.isStringLiteral(idNode) || !ts.isStringLiteral(revisionNode)) return;
    const revision = articleRevisions.get(idNode.text);
    if (!revision) return;
    if (revisionNode.text !== revision.before) {
      staleBeforeCleanup.add(idNode.text);
      return;
    }
    replacements.push({ start: revisionNode.getStart(sourceFile) + 1, end: revisionNode.end - 1, text: revision.after });
  }

  function visit(node) {
    if (ts.isCallExpression(node) && node.expression.getText(sourceFile) === "defineJapaneseArticleTranslation") {
      recordRevision(node.arguments[0], node.arguments[1]);
    }
    if (ts.isObjectLiteralExpression(node)) {
      const property = (name) => node.properties.find((item) => ts.isPropertyAssignment(item) && item.name.getText(sourceFile).replaceAll('"', "") === name);
      recordRevision(property("contentId")?.initializer, property("sourceRevision")?.initializer);
    }
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);
  if (replacements.length) {
    let result = source;
    for (const replacement of replacements.sort((left, right) => right.start - left.start)) {
      result = result.slice(0, replacement.start) + replacement.text + result.slice(replacement.end);
    }
    changed.set(path, result);
    updatedRevisions += replacements.length;
  }
}

if (!dryRun) for (const [path, source] of changed) writeFileSync(join(root, path), source);
console.log(`${dryRun ? "Would remove" : "Removed"} ${removals.length} right-facing arrows in ${byPath.size} files; preserved ${preserved} intentional arrows.`);
console.log(`${dryRun ? "Would refresh" : "Refreshed"} ${updatedRevisions} matching article translation source revisions.`);
if (staleBeforeCleanup.size) console.log(`Left ${staleBeforeCleanup.size} already-stale article revisions unchanged: ${[...staleBeforeCleanup].sort().join(", ")}.`);
