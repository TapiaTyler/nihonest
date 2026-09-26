/** Read-only inventory of right-facing arrow text in website source and content. */
import { readFileSync, readdirSync } from "node:fs";
import { extname, join } from "node:path";
import ts from "typescript";

const root = process.cwd();
const extensions = new Set([".css", ".js", ".jsx", ".json", ".md", ".mdx", ".ts", ".tsx"]);
const arrowPattern = /→|➡|➔|➜|➝|⟶|⮕|⇒|⇢|&#(?:8594|x0*2192);?|&(?:rarr|rightarrow);?|\\u(?:2192|\{2192\})|\\2192\b/gi;
const summaryOnly = process.argv.includes("--summary");
const asJson = process.argv.includes("--json");

function filesUnder(directory) {
  return readdirSync(join(root, directory), { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return filesUnder(path);
    return entry.isFile() && extensions.has(extname(entry.name)) ? [path] : [];
  });
}

function jsxContainer(sourceFile, offset) {
  let container;
  function visit(node) {
    if (offset < node.pos || offset >= node.end) return;
    if (ts.isJsxElement(node)) {
      const name = node.openingElement.tagName.getText(sourceFile);
      if (name === "Link" || name === "a" || name === "button") container = name;
    }
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);
  return container;
}

function categoryFor(path, line, sourceFile, offset) {
  if (/\.test\.[jt]sx?$|\.spec\.[jt]sx?$/.test(path)) return "test expectation";
  if (line.includes("glossaryStudy.prompt")) return "study direction label";
  if (/\[[^\]]*(?:→|➡|➔|➜|➝|⟶|⮕|⇒|⇢|&#(?:8594|x0*2192);?|&(?:rarr|rightarrow);?)[^\]]*\]\([^)]*\)/i.test(line)) {
    return path.startsWith("src/data/translations/") ? "translated Markdown link label" : "Markdown link label";
  }
  if (path.startsWith("src/data/translations/")) return "translated copy (usage to check)";
  if (path.includes("/interface-message-catalogs/japanese.")) return "Japanese interface copy (usage to check)";
  if (sourceFile) {
    const container = jsxContainer(sourceFile, offset);
    if (container) return `${container} UI`;
  }
  if (path.includes("/interface-message-catalogs/")) return "interface copy (usage to check)";
  if (path.endsWith(".css")) return "CSS";
  return "other source (usage to check)";
}

const findings = [];
for (const path of [...filesUnder("src"), ...filesUnder("content")].sort()) {
  const source = readFileSync(join(root, path), "utf8");
  const extension = extname(path);
  const sourceFile = [".js", ".jsx", ".ts", ".tsx"].includes(extension)
    ? ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, extension.endsWith("x") ? ts.ScriptKind.TSX : ts.ScriptKind.TS)
    : undefined;
  const normalizedPath = path.replaceAll("\\", "/");
  for (const match of source.matchAll(arrowPattern)) {
    const offset = match.index;
    const start = source.lastIndexOf("\n", offset - 1) + 1;
    const end = source.indexOf("\n", offset);
    const line = source.slice(start, end === -1 ? undefined : end).replace(/\r$/, "");
    const before = source.slice(0, offset);
    const lineNumber = before.split("\n").length;
    findings.push({
      category: categoryFor(normalizedPath, line, sourceFile, offset),
      path: normalizedPath,
      offset,
      line: lineNumber,
      column: offset - start + 1,
      arrow: match[0],
      context: line.trim().slice(0, 180),
    });
  }
}

const counts = Object.fromEntries(
  [...new Set(findings.map(({ category }) => category))].sort().map((category) => [category, findings.filter((finding) => finding.category === category).length]),
);

if (asJson) {
  process.stdout.write(`${JSON.stringify({ total: findings.length, files: new Set(findings.map(({ path }) => path)).size, counts, findings }, null, 2)}\n`);
} else {
  console.log(`Found ${findings.length} right-facing arrow occurrences in ${new Set(findings.map(({ path }) => path)).size} website source files.`);
  for (const [category, count] of Object.entries(counts)) console.log(`  ${category}: ${count}`);
  if (!summaryOnly) {
    console.log("\nLocations:");
    for (const finding of findings) {
      console.log(`${finding.path}:${finding.line}:${finding.column} [${finding.category}] ${finding.context}`);
    }
  }
}
