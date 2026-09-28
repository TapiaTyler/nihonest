/**
 * Production browser-payload boundary check. After `npm run build`, reads each route's client reference manifest,
 * measures the JavaScript chunks each route loads (raw, gzip, and Brotli), and fails when browser chunks contain
 * municipality guidance prose or the official source registry, or when a route's entry chunks carry the prefecture map
 * geometry (it must load on demand where a map renders). Markers come from the canonical catalogs at run time,
 * so the check needs no hashed filenames or fixed catalog counts.
 *
 *   npm run build && npm run bundle:check
 *   npm run bundle:check -- --report      # also print every chunk and route
 *   npm run bundle:check -- --json out.json
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, relative, resolve, sep } from "node:path";
import { brotliCompressSync, constants, gzipSync } from "node:zlib";
import { parseArgs } from "node:util";
import { runInNewContext } from "node:vm";
import { prefectureMapPaths } from "@/data/geography/prefecture-map-paths";
import { localGuidanceSupplements } from "@/data/local-guidance";
import { sources } from "@/data/sources";

const projectRoot = resolve(import.meta.dirname, "..");
const buildRoot = join(projectRoot, ".next");

/** A source-registry fraction above this in any one chunk means the registry, not a few links, reached the browser. */
const maximumSourceUrlShare = 0.05;

type ChunkSize = Readonly<{ raw: number; gzip: number; brotli: number }>;
type RouteChunks = Readonly<{ route: string; chunks: readonly string[] }>;

async function manifestFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return manifestFiles(path);
    return entry.name.endsWith("_client-reference-manifest.js") ? [path] : [];
  }));
  return nested.flat();
}

/** Each manifest assigns `globalThis.__RSC_MANIFEST[route]`; entryJSFiles lists the chunks per entry module. */
async function routeChunks(): Promise<RouteChunks[]> {
  const files = await manifestFiles(join(buildRoot, "server", "app"));
  const routes: RouteChunks[] = [];
  for (const file of files) {
    const context: { globalThis?: unknown; __RSC_MANIFEST?: Record<string, { entryJSFiles?: Record<string, string[]> }> } = {};
    context.globalThis = context;
    runInNewContext(await readFile(file, "utf8"), context);
    for (const [route, manifest] of Object.entries(context.__RSC_MANIFEST ?? {})) {
      const entries = manifest.entryJSFiles ?? {};
      const pageEntry = Object.keys(entries).find((key) => key.endsWith(`/app${route}`));
      const chunks = new Set<string>();
      for (const [key, list] of Object.entries(entries)) {
        if (key === pageEntry || key.endsWith("/app/layout") || /\/app\/.*\/layout$/.test(key)) list.forEach((chunk) => chunks.add(chunk));
      }
      routes.push({ route: route.replace(/\/page$/, "") || "/", chunks: [...chunks].sort() });
    }
  }
  return routes.sort((left, right) => left.route.localeCompare(right.route));
}

function measure(source: Buffer): ChunkSize {
  return {
    raw: source.byteLength,
    gzip: gzipSync(source, { level: 9 }).byteLength,
    brotli: brotliCompressSync(source, { params: { [constants.BROTLI_PARAM_QUALITY]: 11 } }).byteLength,
  };
}

/** The longest leading run without characters minifiers escape, so the marker survives quoting. */
function marker(text: string): string | undefined {
  const run = /^[^"'`\\\n]+/.exec(text)?.[0].trim() ?? "";
  return run.length >= 30 ? run.slice(0, 80) : undefined;
}

const kb = (bytes: number) => `${(bytes / 1024).toFixed(1)} KB`;

async function main(): Promise<void> {
  const { values } = parseArgs({ options: { report: { type: "boolean", default: false }, json: { type: "string" } } });
  const routes = await routeChunks().catch(() => {
    throw new Error("No production client manifests found. Run `npm run build` first.");
  });
  if (!routes.length) throw new Error("No production client manifests found. Run `npm run build` first.");

  const allChunks = [...new Set(routes.flatMap(({ chunks }) => chunks))].sort();
  const layoutChunks = new Set(routes.find(({ route }) => route === "/_not-found")?.chunks ?? []);
  const guidanceMarkers = localGuidanceSupplements.map(({ summary }) => marker(summary)).filter((value): value is string => Boolean(value));
  const sourceUrls = [...new Set(sources.map(({ url }) => url))];
  const mapGeometry = prefectureMapPaths.map(({ d }) => d.slice(0, 40));

  const chunks = await Promise.all(allChunks.map(async (chunk) => {
    const buffer = await readFile(join(buildRoot, chunk));
    const text = buffer.toString("utf8");
    const usedBy = routes.filter(({ chunks: list }) => list.includes(chunk)).map(({ route }) => route);
    return {
      chunk,
      size: measure(buffer),
      usedBy,
      shared: layoutChunks.has(chunk),
      guidanceMatches: guidanceMarkers.filter((value) => text.includes(value)).length,
      sourceUrlMatches: sourceUrls.filter((url) => text.includes(url)).length,
      mapGeometryMatches: mapGeometry.filter((value) => text.includes(value)).length,
    };
  }));

  const sizeOf = new Map(chunks.map(({ chunk, size }) => [chunk, size]));
  const routeTotals = routes.map(({ route, chunks: list }) => ({
    route,
    ...list.reduce((total, chunk) => {
      const size = sizeOf.get(chunk)!;
      return { raw: total.raw + size.raw, gzip: total.gzip + size.gzip, brotli: total.brotli + size.brotli };
    }, { raw: 0, gzip: 0, brotli: 0 }),
  }));

  const largest = [...chunks].sort((left, right) => right.size.raw - left.size.raw);
  console.log(`Client chunks: ${chunks.length}; routes: ${routes.length}. Sizes are raw / gzip -9 / Brotli q11.`);
  for (const entry of values.report ? largest : largest.slice(0, 8)) {
    const scope = entry.shared ? "shared by every route" : `${entry.usedBy.length} route(s)`;
    console.log(`  ${relative("static/chunks", entry.chunk).split(sep).join("/")}  ${kb(entry.size.raw)} / ${kb(entry.size.gzip)} / ${kb(entry.size.brotli)}  ${scope}  guidance:${entry.guidanceMatches} sources:${entry.sourceUrlMatches}`);
  }
  const routeReport = [...routeTotals].sort((left, right) => right.raw - left.raw);
  console.log("Heaviest routes (layout + page chunks):");
  for (const total of values.report ? routeReport : routeReport.slice(0, 8)) {
    console.log(`  ${total.route}  ${kb(total.raw)} / ${kb(total.gzip)} / ${kb(total.brotli)}`);
  }

  if (values.json) {
    await writeFile(values.json, `${JSON.stringify({ chunks, routes: routeTotals }, null, 2)}\n`);
  }

  const failures = chunks.flatMap(({ chunk, guidanceMatches, sourceUrlMatches, mapGeometryMatches, usedBy }) => [
    ...(mapGeometryMatches ? [`${chunk} carries prefecture map geometry in the entry chunks of ${usedBy.length} route(s); load it on demand`] : []),
    ...(guidanceMatches ? [`${chunk} contains prose from ${guidanceMatches} municipality guidance supplement(s)`] : []),
    ...(sourceUrlMatches > sourceUrls.length * maximumSourceUrlShare ? [`${chunk} contains ${sourceUrlMatches} of ${sourceUrls.length} official source URLs`] : []),
  ]);
  if (!guidanceMarkers.length || !sourceUrls.length || !mapGeometry.length) failures.push("The catalog markers are empty; the check would pass vacuously.");
  if (failures.length) {
    for (const failure of failures) console.error(`Boundary violation: ${failure}`);
    process.exitCode = 1;
    return;
  }
  console.log("No browser chunk contains municipality guidance prose or the official source registry, and no route entry loads map geometry.");
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
