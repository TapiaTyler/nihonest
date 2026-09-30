import { z } from "zod";
import { createAdministrativeGeographyRegistry } from "@/domain/geography/administrative-geography";
import type { SupportedGeography } from "@/domain/geography/local-guidance";

export const bundledGeographySourceSchema = z.object({
  id: z.string().min(1),
  url: z.url(),
  retrievedAt: z.iso.date(),
  sourceUpdatedAt: z.iso.date().optional(),
  recordCount: z.number().int().nonnegative(),
}).strict();

export const bundledGeographyAliasSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  geographyId: z.string().regex(/^jp-\d{5}$/),
}).strict();

/** Aliases preserve saved IDs; source counts describe this repository snapshot only. */
export function validateBundledGeographies(records: readonly unknown[], sources: readonly z.infer<typeof bundledGeographySourceSchema>[],
  aliases: readonly z.infer<typeof bundledGeographyAliasSchema>[], supported: readonly SupportedGeography[]) {
  const registry = createAdministrativeGeographyRegistry(records);
  const sourceIds = new Set(sources.map(({ id }) => id));
  if (sourceIds.size !== sources.length) throw new Error("Duplicate geography source ID.");
  for (const record of registry.records) {
    if (!sourceIds.has(record.sourceId)) throw new Error("Unknown administrative geography source.");
  }
  for (const source of sources) {
    if (registry.records.filter(({ sourceId }) => sourceId === source.id).length !== source.recordCount) {
      throw new Error("Geography source snapshot record count mismatch.");
    }
  }
  const aliasIds = new Map(aliases.map(({ id, geographyId }) => [id, geographyId]));
  if (aliasIds.size !== aliases.length) throw new Error("Duplicate geography alias ID.");
  for (const alias of aliases) {
    if (registry.get(alias.id) || !registry.get(alias.geographyId)) throw new Error("Invalid geography alias target or collision.");
  }
  const resolve = (id: string) => registry.get(aliasIds.get(id) ?? id);
  for (const geography of supported) {
    const canonical = resolve(geography.id);
    if (!canonical || canonical.type !== geography.type || (geography.parentId && !resolve(geography.parentId))
      || canonical.parentId !== (geography.parentId ? resolve(geography.parentId)?.id : undefined)) {
      throw new Error("Supported geography identity or hierarchy mismatch.");
    }
  }
}
