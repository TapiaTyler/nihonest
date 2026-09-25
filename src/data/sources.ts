import { officialSourceSchema } from "@/domain/source/source";
import { sourceMonitoringStateSchema } from "@/domain/source/source-monitoring";
import { immigrationServicesSourceEntries } from "@/data/sources/immigration-services";
import { foreignAffairsSourceEntries } from "@/data/sources/foreign-affairs";
import { employmentHealthWelfareSourceEntries } from "@/data/sources/employment-health-welfare";
import { taxBusinessConsumerSourceEntries } from "@/data/sources/tax-business-consumer";
import { educationLanguageSourceEntries } from "@/data/sources/education-language";
import { municipalIdentitySourceEntries } from "@/data/sources/municipal-identity";
import { dailyLifeSafetySourceEntries } from "@/data/sources/daily-life-safety";
import { localGuidanceSourceEntries } from "@/data/local-guidance";
import sourceMonitoringStateJson from "../../content/source-monitoring/state.json";

// Module and local array order make registry assembly deterministic without global sequence numbers.
const declaredSources = [
  ...immigrationServicesSourceEntries,
  ...foreignAffairsSourceEntries,
  ...employmentHealthWelfareSourceEntries,
  ...taxBusinessConsumerSourceEntries,
  ...educationLanguageSourceEntries,
  ...municipalIdentitySourceEntries,
  ...dailyLifeSafetySourceEntries,
  // Sources cited by only one researched location, declared in its file under src/data/local-guidance/locations.
  ...localGuidanceSourceEntries,
];

const sourceMonitoringState = sourceMonitoringStateSchema.parse(sourceMonitoringStateJson);

/** Operational checks override only their own date; editorial review metadata remains human-authored. */
export const sources = declaredSources.map((source) => officialSourceSchema.parse({
  ...source,
  lastCheckedAt: sourceMonitoringState.sources[source.id]?.lastSuccessfulCheckAt ?? source.lastCheckedAt,
  lastReviewedAt: sourceMonitoringState.sources[source.id]?.lastReviewedAt ?? source.lastReviewedAt,
}));

export function getSourceById(id: string) {
  return sources.find((source) => source.id === id);
}
