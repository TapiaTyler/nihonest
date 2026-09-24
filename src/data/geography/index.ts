import { createAdministrativeGeographyRegistry, hasValidLocalGovernmentCheckDigit, type GeographySort } from "@/domain/geography/administrative-geography";
import { administrativeGeographyRecords } from "./administrative-records";
import { administrativeGeographySources } from "./sources";

const sourceIds = new Set(administrativeGeographySources.map(({ id }) => id));
for (const record of administrativeGeographyRecords) {
  if (!sourceIds.has(record.sourceId)) throw new Error(`Missing geography source for ${record.id}.`);
}

const registry = createAdministrativeGeographyRegistry(administrativeGeographyRecords);
export const administrativeGeographies = registry.records;
export { administrativeGeographySources } from "./sources";

/** Existing saved-location, document, and supplement IDs remain valid during migration. */
export const legacyGeographyIds = Object.freeze({
  tokyo: "jp-13000",
  aichi: "jp-23000",
  shinjuku: "jp-13104",
  nagoya: "jp-23100",
} as const);

const legacyIds = new Map<string, string>(Object.entries(legacyGeographyIds));

export function getAdministrativeGeography(id: string) {
  return registry.get(legacyIds.get(id) ?? id);
}

/** Accept only exact official codes; a malformed check digit must not resolve a place. */
export function getAdministrativeGeographyByCode(code: string) {
  if (/^\d{5}$/.test(code)) return registry.get(`jp-${code}`);
  if (hasValidLocalGovernmentCheckDigit(code)) return registry.get(`jp-${code.slice(0, 5)}`);
  return undefined;
}

export function getAdministrativeGeographyChildren(id: string, order: GeographySort = "code") {
  return registry.children(legacyIds.get(id) ?? id, order);
}

export function getAdministrativeGeographyAncestors(id: string) {
  return registry.ancestors(legacyIds.get(id) ?? id);
}
