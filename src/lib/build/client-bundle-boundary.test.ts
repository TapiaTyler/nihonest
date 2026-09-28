import { describe, expect, it } from "vitest";
import { prefectureMapPaths } from "@/data/geography/prefecture-map-paths";
import { localGuidanceSupplements } from "@/data/local-guidance";
import { sources } from "@/data/sources";
import { catalogMarker, findBundleBoundaryViolations, maximumSourceUrlShare, type BundleChunk } from "./client-bundle-boundary";

// The same catalog-derived markers the production check uses.
const markers = {
  guidance: localGuidanceSupplements.map(({ summary }) => catalogMarker(summary)).filter((value): value is string => Boolean(value)),
  sourceUrls: [...new Set(sources.map(({ url }) => url))],
  mapGeometry: prefectureMapPaths.map(({ d }) => d.slice(0, 40)),
};
const clean = 'self.__chunk=function(){return"ordinary interface code"}';
const guidanceLeak = `var a=${JSON.stringify(markers.guidance[0])}`;
const registryLeak = markers.sourceUrls.map((url) => JSON.stringify(url)).join(",");
const mapGeometry = prefectureMapPaths.map(({ d }) => JSON.stringify(d)).join(",");

function check(...chunks: BundleChunk[]) {
  return findBundleBoundaryViolations(chunks, markers).violations;
}

describe("client bundle boundary", () => {
  it("derives non-empty markers from the catalogs", () => {
    expect(markers.guidance.length).toBeGreaterThan(0);
    expect(markers.sourceUrls.length).toBeGreaterThan(0);
    expect(markers.mapGeometry.length).toBeGreaterThan(0);
  });

  it("passes clean entry chunks and the intended async map chunk", () => {
    expect(check(
      { path: "static/chunks/entry.js", text: clean, entry: true },
      { path: "static/chunks/map.js", text: mapGeometry, entry: false },
    )).toEqual([]);
  });

  it("fails guidance prose or the source registry in an async chunk", () => {
    expect(check({ path: "static/chunks/lazy.js", text: `${mapGeometry};${guidanceLeak}`, entry: false }))
      .toEqual([expect.stringContaining("static/chunks/lazy.js (async) contains prose from 1 municipality guidance supplement")]);
    expect(check({ path: "static/chunks/lazy.js", text: registryLeak, entry: false }))
      .toEqual([expect.stringContaining(`static/chunks/lazy.js (async) contains ${markers.sourceUrls.length} of ${markers.sourceUrls.length} official source URLs`)]);
  });

  it("allows a few source links but not the registry", () => {
    // A handful of explicit links, well under the threshold (some registry URLs are prefixes of others).
    const links = markers.sourceUrls.slice(0, 3).map((url) => JSON.stringify(url)).join(",");
    const { findings, violations } = findBundleBoundaryViolations([{ path: "static/chunks/lazy.js", text: links, entry: false }], markers);
    expect(findings[0].sourceUrlMatches).toBeLessThanOrEqual(markers.sourceUrls.length * maximumSourceUrlShare);
    expect(violations).toEqual([]);
  });

  it("fails map geometry in a route entry chunk", () => {
    expect(check({ path: "static/chunks/entry.js", text: mapGeometry, entry: true }))
      .toEqual(["static/chunks/entry.js carries prefecture map geometry in a route entry chunk; load it on demand"]);
  });

  it("reproduces the pre-H1 negative control: catalogs and map geometry in a shared entry chunk", () => {
    expect(check({ path: "static/chunks/shared.js", text: `${guidanceLeak};${registryLeak};${mapGeometry}`, entry: true })).toHaveLength(3);
  });

  it("refuses to pass with empty markers", () => {
    expect(findBundleBoundaryViolations([], { guidance: [], sourceUrls: ["x"], mapGeometry: ["y"] }).violations)
      .toEqual(["The catalog markers are empty; the check would pass vacuously."]);
  });
});
