import { z } from "zod";

const prefectureCode = z.string().regex(/^(?:0[1-9]|[1-3][0-9]|4[0-7])$/);
const label = z.string().refine((value) => value.trim().length > 0, "Label cannot be blank.");
const bilingualLabel = z.object({ en: label, ja: label }).strict();

/** Project only canonical prefecture/metropolis records into this reference contract. */
export const orientationPrefectureReferenceSchema = z.object({
  id: z.string().regex(/^jp-(?:0[1-9]|[1-3][0-9]|4[0-7])000$/),
  code: z.string().regex(/^(?:0[1-9]|[1-3][0-9]|4[0-7])000$/),
  names: bilingualLabel,
}).strict().refine((record) => record.id === `jp-${record.code}`, "Prefecture ID and code must agree.");

/** Orientation groups are ordered presentation data, not administrative parents or new stable IDs. */
export const orientationRegionSchema = z.object({
  name: bilingualLabel,
  prefectureIds: orientationPrefectureReferenceSchema.shape.id.array().min(1).max(47),
  prefectures: bilingualLabel,
}).strict();

/**
 * The existing generator emits fixed-one-decimal projected coordinates and closed M/L/Z rings.
 * This deliberately supports that representation only, not arbitrary SVG or longitude/latitude.
 * Scan tokens once; never normalize geometry bytes or use browser APIs. The 200,000-character
 * per-path ceiling is an explicit input bound, not a measured maximum or a geographic limit.
 */
export function isOrientationMapPath(value: string): boolean {
  if (!value.length || value.length > 200_000) return false;
  const token = /([ML])(-?\d+\.\d),(-?\d+\.\d)|(Z)/gy;
  let offset = 0;
  let vertices = 0;
  let rings = 0;
  while (offset < value.length) {
    token.lastIndex = offset;
    const match = token.exec(value);
    if (!match) return false;
    offset = token.lastIndex;
    if (match[4]) {
      if (vertices < 3) return false;
      vertices = 0;
      rings++;
    } else {
      if (!Number.isFinite(Number(match[2])) || !Number.isFinite(Number(match[3]))) return false;
      if (match[1] === "M") {
        if (vertices !== 0) return false;
        vertices = 1;
      } else {
        if (vertices === 0) return false;
        vertices++;
      }
    }
  }
  return vertices === 0 && rings > 0;
}

export const orientationMapPathSchema = z.object({
  code: prefectureCode,
  name: label,
  focus: z.tuple([z.number(), z.number(), z.number().positive()]),
  d: z.string().refine(isOrientationMapPath, "Expected bounded, closed projected M/L/Z rings."),
}).strict();

export type OrientationPrefectureReference = z.infer<typeof orientationPrefectureReferenceSchema>;
export type OrientationRegion = z.infer<typeof orientationRegionSchema>;
export type OrientationMapPath = z.infer<typeof orientationMapPathSchema>;

/**
 * Validate both collections against caller-supplied canonical prefecture references. Require an exact
 * partition and exact path coverage; preserve collection/member order and all label/geometry bytes.
 * This assigns no source license, review date or translation approval and does not adopt export wiring.
 */
export function parseOrientationMapData(
  regions: unknown,
  paths: unknown,
  prefectures: unknown,
): { regions: OrientationRegion[]; paths: OrientationMapPath[] } {
  const references = orientationPrefectureReferenceSchema.array().min(1).max(47).parse(prefectures);
  const byId = new Map(references.map((record) => [record.id, record]));
  if (byId.size !== references.length) throw new Error("Duplicate orientation prefecture reference.");
  const byCode = new Map(references.map((record) => [record.code.slice(0, 2), record]));
  return z.object({
    regions: orientationRegionSchema.array().min(1).max(47),
    paths: orientationMapPathSchema.array().min(1).max(47),
  }).strict().superRefine((data, context) => {
    const issue = (path: (string | number)[], message: string) => context.addIssue({ code: "custom", path, message });
    const members = new Set<string>();
    data.regions.forEach((region, index) => {
      region.prefectureIds.forEach((id, memberIndex) => {
        if (!byId.has(id) || members.has(id)) issue(["regions", index, "prefectureIds", memberIndex], "Unknown or repeated prefecture membership.");
        members.add(id);
      });
      for (const locale of ["en", "ja"] as const) {
        const expected = region.prefectureIds.map((id) => byId.get(id)?.names[locale]).join(locale === "en" ? ", " : "、");
        if (region.prefectures[locale] !== expected) issue(["regions", index, "prefectures", locale], "Member labels must match reference names in order.");
      }
    });
    if (references.some(({ id }) => !members.has(id))) issue(["regions"], "Region partition omits prefectures.");
    const codes = new Set<string>();
    data.paths.forEach((path, index) => {
      const reference = byCode.get(path.code);
      if (!reference || codes.has(path.code)) issue(["paths", index, "code"], "Unknown or repeated map code.");
      if (reference && reference.names.ja !== path.name) issue(["paths", index, "name"], "Map name must match the reference name.");
      codes.add(path.code);
    });
    if (references.some(({ code }) => !codes.has(code.slice(0, 2)))) issue(["paths"], "Map coverage omits prefectures.");
  }).parse({ regions, paths });
}
