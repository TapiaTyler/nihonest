import { readdir, readFile, stat } from "node:fs/promises";
import { dirname, extname, join, relative, resolve, sep } from "node:path";

const projectRoot = process.cwd();
const sourceRoot = join(projectRoot, "src");
const sourceExtensions = [".ts", ".tsx"];
const importPattern = /(?:import|export)\s+(?:type\s+)?(?:[^"']*?\sfrom\s*)?["']([^"']+)["']|import\(\s*["']([^"']+)["']\s*\)/g;

function isTestFile(path: string): boolean {
  return /\.(?:test|spec)\.[^.]+$/.test(path);
}

async function sourceFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return sourceExtensions.includes(extname(entry.name)) && !isTestFile(path) ? [path] : [];
  }));
  return nested.flat();
}

async function existingFile(candidate: string): Promise<string | undefined> {
  const candidates = extname(candidate)
    ? [candidate]
    : [...sourceExtensions.map((extension) => `${candidate}${extension}`), ...sourceExtensions.map((extension) => join(candidate, `index${extension}`))];
  for (const path of candidates) {
    try {
      if ((await stat(path)).isFile()) return path;
    }
    catch {
      // An unresolved package, asset, or MDX import is outside the TypeScript module graph.
    }
  }
  return undefined;
}

async function resolveLocalImport(importer: string, specifier: string): Promise<string | undefined> {
  if (specifier.startsWith("@/")) return existingFile(join(sourceRoot, specifier.slice(2)));
  if (specifier.startsWith(".")) return existingFile(resolve(dirname(importer), specifier));
  return undefined;
}

function displayPath(path: string): string {
  return relative(projectRoot, path).split(sep).join("/");
}

const files = await sourceFiles(sourceRoot);
const graph = new Map<string, string[]>();
const violations: string[] = [];

for (const file of files) {
  const source = await readFile(file, "utf8");
  const imports = [...source.matchAll(importPattern)].map((match) => match[1] ?? match[2]!).filter(Boolean);
  const localDependencies = (await Promise.all(imports.map((specifier) => resolveLocalImport(file, specifier))))
    .filter((dependency): dependency is string => Boolean(dependency));
  graph.set(file, localDependencies);

  const normalizedFile = displayPath(file);
  if (normalizedFile.startsWith("src/domain/")) {
    for (const specifier of imports) {
      if (/^@\/(?:app|components|data|lib)\//.test(specifier) || /^(?:next(?:\/|$)|react(?:\/|$)|@supabase\/)/.test(specifier)) {
        violations.push(`${normalizedFile} imports prohibited dependency ${specifier}`);
      }
    }
  }
  if (normalizedFile.startsWith("src/data/")) {
    for (const specifier of imports) {
      if (/^@\/(?:app|components)\//.test(specifier)) {
        violations.push(`${normalizedFile} imports prohibited dependency ${specifier}`);
      }
    }
  }
}

const visiting = new Set<string>();
const visited = new Set<string>();
const stack: string[] = [];
const cycles = new Set<string>();

function visit(file: string): void {
  if (visiting.has(file)) {
    const cycleStart = stack.indexOf(file);
    cycles.add([...stack.slice(cycleStart), file].map(displayPath).join(" -> "));
    return;
  }
  if (visited.has(file)) return;
  visiting.add(file);
  stack.push(file);
  for (const dependency of graph.get(file) ?? []) visit(dependency);
  stack.pop();
  visiting.delete(file);
  visited.add(file);
}

for (const file of files) visit(file);

if (violations.length > 0 || cycles.size > 0) {
  for (const violation of violations) console.error(`Boundary violation: ${violation}`);
  for (const cycle of cycles) console.error(`Circular dependency: ${cycle}`);
  process.exitCode = 1;
}
else {
  console.log(`Architecture check passed for ${files.length} production modules.`);
}

