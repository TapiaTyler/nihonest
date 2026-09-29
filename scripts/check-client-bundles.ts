/**
 * Production browser-payload boundary check. After `npm run build`, inventories every emitted browser JavaScript
 * file under .next/static, including async chunks loaded on demand, and fails when any contains municipality
 * guidance prose or the official source registry, or when a route entry chunk carries the prefecture map geometry
 * (it must load on demand where a map renders). Rules live in src/lib/build/client-bundle-boundary.ts. Markers
 * come from the canonical catalogs at run time, so the check needs no hashed filenames or fixed catalog counts.
 *
 * Initial route sizes (layout + page entry chunks, from each route's client reference manifest) are reported
 * separately from async payloads.
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
import { catalogMarker, findBundleBoundaryViolations } from "@/lib/build/client-bundle-boundary";

const projectRoot = resolve(import.meta.dirname, "..");
const buildRoot = join(projectRoot, ".next");

type ChunkSize = Readonly<{ raw: number; gzip: number; brotli: number }>;
type RouteChunks = Readonly<{ route: string; chunks: readonly string[] }>;

async function filesUnder(directory: string, accept: (name: string) => boolean): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return filesUnder(path, accept);
    return accept(entry.name) ? [path] : [];
  }));
  return nested.flat();
}

/** Each manifest assigns `globalThis.__RSC_MANIFEST[route]`; entryJSFiles lists the chunks per entry module. */
async function routeChunks(): Promise<RouteChunks[]> {
  const files = await filesUnder(join(buildRoot, "server", "app"), (name) => name.endsWith("_client-reference-manifest.js"));
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

const kb = (bytes: number) => `${(bytes / 1024).toFixed(1)} KB`;
const displayPath = (path: string) => relative(buildRoot, path).split(sep).join("/");

async function main(): Promise<void> {
  const { values } = parseArgs({ options: { report: { type: "boolean", default: false }, json: { type: "string" } } });
  const routes = await routeChunks().catch(() => [] as RouteChunks[]);
  if (!routes.length) throw new Error("No production client manifests found. Run `npm run build` first.");

  // Every browser script the build emitted, not only those named in route entries.
  const emitted = (await filesUnder(join(buildRoot, "static"), (name) => name.endsWith(".js"))).map(displayPath).sort();
  const entryChunks = new Set(routes.flatMap(({ chunks }) => chunks));
  const missing = [...entryChunks].filter((chunk) => !emitted.includes(chunk));
  if (missing.length) throw new Error(`Route manifests name chunks that were not emitted: ${missing.join(", ")}`);
  const sharedChunks = new Set(routes.find(({ route }) => route === "/_not-found")?.chunks ?? []);

  const chunks = await Promise.all(emitted.map(async (path) => {
    const buffer = await readFile(join(buildRoot, path));
    return { path, buffer, text: buffer.toString("utf8"), entry: entryChunks.has(path) };
  }));
  const { findings, violations } = findBundleBoundaryViolations(chunks, {
    guidance: localGuidanceSupplements.map(({ summary }) => catalogMarker(summary)).filter((value): value is string => Boolean(value)),
    sourceUrls: [...new Set(sources.map(({ url }) => url))],
    mapGeometry: prefectureMapPaths.map(({ d }) => d.slice(0, 40)),
  });

  const sizes = new Map(chunks.map(({ path, buffer }) => [path, measure(buffer)]));
  const report = findings.map((finding) => ({
    ...finding,
    size: sizes.get(finding.path)!,
    usedBy: routes.filter(({ chunks: list }) => list.includes(finding.path)).map(({ route }) => route),
    shared: sharedChunks.has(finding.path),
  }));
  const routeTotals = routes.map(({ route, chunks: list }) => ({
    route,
    ...list.reduce((total, chunk) => {
      const size = sizes.get(chunk)!;
      return { raw: total.raw + size.raw, gzip: total.gzip + size.gzip, brotli: total.brotli + size.brotli };
    }, { raw: 0, gzip: 0, brotli: 0 }),
  }));
  const asyncChunks = report.filter(({ entry }) => !entry);
  const asyncTotal = asyncChunks.reduce((total, { size }) => total + size.raw, 0);

  console.log(`Browser JS files: ${report.length} (${report.length - asyncChunks.length} in route entries, ${asyncChunks.length} async or runtime, ${kb(asyncTotal)} raw); routes: ${routes.length}.`);
  console.log("Sizes are raw / gzip -9 / Brotli q11.");
  const largest = [...report].sort((left, right) => right.size.raw - left.size.raw);
  for (const entry of values.report ? largest : largest.slice(0, 8)) {
    const scope = !entry.entry ? "async or runtime" : entry.shared ? "shared by every route" : `${entry.usedBy.length} route(s)`;
    console.log(`  ${entry.path.replace(/^static\/chunks\//, "")}  ${kb(entry.size.raw)} / ${kb(entry.size.gzip)} / ${kb(entry.size.brotli)}  ${scope}  guidance:${entry.guidanceMatches} sources:${entry.sourceUrlMatches} map:${entry.mapGeometryMatches}`);
  }
  const routeReport = [...routeTotals].sort((left, right) => right.raw - left.raw);
  console.log("Heaviest routes, initial JS (layout + page entry chunks):");
  for (const total of values.report ? routeReport : routeReport.slice(0, 8)) {
    console.log(`  ${total.route}  ${kb(total.raw)} / ${kb(total.gzip)} / ${kb(total.brotli)}`);
  }

  if (values.json) {
    await writeFile(values.json, `${JSON.stringify({ chunks: report, routes: routeTotals }, null, 2)}\n`);
  }

  if (violations.length) {
    for (const violation of violations) console.error(`Boundary violation: ${violation}`);
    process.exitCode = 1;
    return;
  }
  console.log("No browser JS file contains municipality guidance prose or the official source registry, and no route entry loads map geometry.");
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
