import { localGuidanceRecheckSchema, type LocalGuidanceRecheck, type LocalGuidanceSupplement } from "@/domain/geography/local-guidance";
import { officialSourceSchema, type OfficialSource } from "@/domain/source/source";
import { defineLocalGuidanceSupplements } from "@/data/local-guidance/shared";

type GeographyEntry = Readonly<{
  id: string;
  name: string;
  aliases: readonly string[];
  /**
   * The coverage-plan group of a city that is neither in Tokyo nor a designated city (docs/LOCAL-GUIDANCE-COVERAGE-PLAN.md).
   * Tokyo municipalities and designated cities are grouped by type.
   */
  planGroup?: "prefectural-capital" | "major-city";
}>;

/** A source cited by one location. Organization defaults to the location's name; authority to municipal government. */
type LocationSourceInput = Readonly<{
  id: string;
  title: string;
  url: string;
  language: "en" | "ja";
  lastCheckedAt?: string;
  organization?: string;
  authorityLevel?: OfficialSource["authorityLevel"];
  lastReviewedAt?: string;
  checkMethod?: OfficialSource["checkMethod"];
}>;

export type LocationGuidance = Readonly<{
  geography: GeographyEntry;
  sources: readonly OfficialSource[];
  supplements: readonly LocalGuidanceSupplement[];
  recheck: readonly LocalGuidanceRecheck[];
}>;

export type PrefectureGuidance = Readonly<{
  geography: GeographyEntry;
  locations: readonly LocationGuidance[];
}>;

/**
 * One researched location (src/data/local-guidance/locations/<prefecture>/<location>.ts): its selector entry, the
 * official sources only it cites, its supplements for every guide, and what to recheck later. Supplements take the
 * location's geographyId, so records omit it. Sources shared with articles or other locations stay in src/data/sources.
 */
export function defineLocationGuidance(input: Readonly<{
  geography: GeographyEntry;
  sources?: readonly LocationSourceInput[];
  supplements: readonly Record<string, unknown>[];
  recheck?: readonly Record<string, unknown>[];
}>): LocationGuidance {
  const supplements = defineLocalGuidanceSupplements(input.supplements.map((record) => {
    if ("geographyId" in record && record.geographyId !== input.geography.id) {
      throw new Error(`Supplement "${String(record.id)}" belongs to ${input.geography.id}, not ${String(record.geographyId)}.`);
    }
    return { ...record, geographyId: input.geography.id };
  }));
  const recheck = (input.recheck ?? []).map((item) => localGuidanceRecheckSchema.parse(item));
  const supplementIds = new Set(supplements.map(({ id }) => id));
  for (const item of recheck) {
    for (const record of item.records) {
      if (!supplementIds.has(record)) throw new Error(`Recheck item for ${input.geography.name} names "${record}", which is not one of its supplements.`);
    }
  }
  return {
    geography: input.geography,
    sources: (input.sources ?? []).map((source) => officialSourceSchema.parse({
      organization: input.geography.name,
      authorityLevel: "municipal-government",
      ...source,
    })),
    supplements,
    recheck,
  };
}

/** A prefecture folder's index: the prefecture's parent entry and its researched locations, in any order. */
export function definePrefectureGuidance(input: Readonly<{ geography: GeographyEntry; locations: readonly LocationGuidance[] }>): PrefectureGuidance {
  return input;
}
