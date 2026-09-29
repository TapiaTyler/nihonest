/**
 * Browser-payload boundary rules for the production bundle check (scripts/check-client-bundles.ts), kept pure so
 * fixtures can exercise them. Catalog rules apply to every emitted browser chunk, including async chunks loaded
 * on demand; the map-geometry rule applies only to route entry chunks, because the map is meant to load lazily.
 */
export type BundleChunk = Readonly<{
  path: string;
  text: string;
  /** Loaded as part of a route's initial entry, rather than on demand. */
  entry: boolean;
}>;

export type BundleBoundaryMarkers = Readonly<{
  guidance: readonly string[];
  sourceUrls: readonly string[];
  mapGeometry: readonly string[];
}>;

export type BundleChunkFindings = Readonly<{
  path: string;
  entry: boolean;
  guidanceMatches: number;
  sourceUrlMatches: number;
  mapGeometryMatches: number;
}>;

/** A source-registry fraction above this in any one chunk means the registry, not a few links, reached the browser. */
export const maximumSourceUrlShare = 0.05;

/**
 * The longest leading run without quotes, backticks, backslashes, or newlines (characters minifiers escape), so the
 * marker survives quoting. Ordinary letters, including "n", stay in the marker.
 */
export function catalogMarker(text: string): string | undefined {
  const run = /^[^"'`\\\n]+/.exec(text)?.[0].trim() ?? "";
  return run.length >= 30 ? run.slice(0, 80) : undefined;
}

export function findBundleBoundaryViolations(chunks: readonly BundleChunk[], markers: BundleBoundaryMarkers): Readonly<{
  findings: readonly BundleChunkFindings[];
  violations: readonly string[];
}> {
  const violations: string[] = [];
  if (!markers.guidance.length || !markers.sourceUrls.length || !markers.mapGeometry.length) {
    violations.push("The catalog markers are empty; the check would pass vacuously.");
  }
  const findings = chunks.map(({ path, text, entry }) => {
    const finding = {
      path,
      entry,
      guidanceMatches: markers.guidance.filter((value) => text.includes(value)).length,
      sourceUrlMatches: markers.sourceUrls.filter((url) => text.includes(url)).length,
      mapGeometryMatches: markers.mapGeometry.filter((value) => text.includes(value)).length,
    };
    const kind = entry ? "entry" : "async";
    if (finding.guidanceMatches) violations.push(`${path} (${kind}) contains prose from ${finding.guidanceMatches} municipality guidance supplement(s)`);
    if (finding.sourceUrlMatches > markers.sourceUrls.length * maximumSourceUrlShare) {
      violations.push(`${path} (${kind}) contains ${finding.sourceUrlMatches} of ${markers.sourceUrls.length} official source URLs`);
    }
    if (entry && finding.mapGeometryMatches) violations.push(`${path} carries prefecture map geometry in a route entry chunk; load it on demand`);
    return finding;
  });
  return { findings, violations };
}
