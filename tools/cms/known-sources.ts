/**
 * Official sources the CMS can resolve: the registry loaded at start, plus sources the CMS created in this process.
 * Records created in the same session can cite a new source before a restart loads it normally.
 */
import { sources } from "@/data/sources";
import type { OfficialSource } from "@/domain/source/source";

const loaded = new Map(sources.map((source) => [source.id, source]));
const created = new Map<string, OfficialSource>();

export function registerCreatedSource(source: OfficialSource) {
  created.set(source.id, source);
}

export function knownSources(): readonly OfficialSource[] {
  return [...sources, ...[...created.values()].filter(({ id }) => !loaded.has(id))];
}

export function knownSourceById(id: string): OfficialSource | undefined {
  return loaded.get(id) ?? created.get(id);
}
