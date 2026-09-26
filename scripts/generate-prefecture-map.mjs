// Usage: node scripts/generate-prefecture-map.mjs <prefectures.geojson>
// Input and reuse terms: docs/research/JAPAN-PREFECTURE-MAP.md.
import * as fs from "node:fs";

const sourcePath = process.argv[2];
if (!sourcePath) throw new Error("Pass the source GeoJSON path.");
const source = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
if (source.type !== "FeatureCollection" || source.features.length !== 47) {
  throw new Error("Expected a GeoJSON FeatureCollection with 47 prefectures.");
}
const registry = fs.readFileSync("src/data/geography/administrative-records.ts", "utf8");
const prefectureNames = new Map(
  [...registry.matchAll(/"id":"jp-(\d{2})000","code":"\d{2}000".*?"names":\{"ja":"([^"]+)"/g)]
    .map((match) => [match[1], match[2]]),
);
const sx = (lon) => (lon - 122) * 23 + 20;
const sy = (lat) => (46 - lat) * 27 + 14;
const distanceToSegmentSquared = (p, a, b) => {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const t = dx || dy ? Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy))) : 0;
  return (p[0] - a[0] - t * dx) ** 2 + (p[1] - a[1] - t * dy) ** 2;
};
function simplify(points, toleranceSquared = 0.15 ** 2) {
  if (points.length < 4) return points;
  let farthest = 0;
  let index = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const distance = distanceToSegmentSquared(points[i], points[0], points[points.length - 1]);
    if (distance > farthest) {
      farthest = distance;
      index = i;
    }
  }
  if (farthest <= toleranceSquared) return [points[0], points[points.length - 1]];
  return [...simplify(points.slice(0, index + 1), toleranceSquared).slice(0, -1), ...simplify(points.slice(index), toleranceSquared)];
}
function area(points) {
  let twice = 0;
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    twice += points[i][0] * points[j][1] - points[j][0] * points[i][1];
  }
  return Math.abs(twice) / 2;
}
const paths = source.features.map((feature, index) => {
  const code = String(index + 1).padStart(2, "0");
  if (prefectureNames.get(code) !== feature.properties.P) {
    throw new Error(`Prefecture ${code} differs from the administrative registry: ${feature.properties.P}`);
  }
  const polygons = feature.geometry.type === "MultiPolygon" ? feature.geometry.coordinates : [feature.geometry.coordinates];
  const rings = [];
  let largestRing = [];
  let largestArea = 0;
  for (const polygon of polygons) {
    for (const ring of polygon) {
      const projected = ring.map(([lon, lat]) => [sx(lon), sy(lat)]);
      const ringArea = area(projected);
      if (ringArea < 0.5) continue;
      if (ringArea > largestArea) {
        largestArea = ringArea;
        largestRing = projected;
      }
      const simplified = simplify(projected.slice(0, -1));
      if (simplified.length < 3) continue;
      rings.push("M" + simplified.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join("L") + "Z");
    }
  }
  if (!rings.length) throw new Error(`No geometry for prefecture ${index + 1}`);
  const xs = largestRing.map(([x]) => x);
  const ys = largestRing.map(([, y]) => y);
  const focus = [
    (Math.min(...xs) + Math.max(...xs)) / 2,
    (Math.min(...ys) + Math.max(...ys)) / 2,
    Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)),
  ].map((value) => Number(value.toFixed(1)));
  return { code, name: feature.properties.P, d: rings.join(""), focus };
});
const output = [
  "/** Simplified prefecture boundaries for orientation. See docs/research/JAPAN-PREFECTURE-MAP.md for provenance. */",
  "export const prefectureMapPaths = [",
  ...paths.map(({ code, name, d, focus }) => `  { code: "${code}", name: "${name}", focus: [${focus.join(", ")}], d: "${d}" },`),
  "] as const;",
  "",
].join("\n");
fs.writeFileSync("src/data/geography/prefecture-map-paths.ts", output);
console.log(`Generated ${paths.length} prefecture paths (${Buffer.byteLength(output)} bytes).`);
