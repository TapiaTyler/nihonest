import { describe, expect, it } from "vitest";
import { dailyLifeSafetySourceEntries } from "@/data/sources/daily-life-safety";
import { educationLanguageSourceEntries } from "@/data/sources/education-language";
import { employmentHealthWelfareSourceEntries } from "@/data/sources/employment-health-welfare";
import { foreignAffairsSourceEntries } from "@/data/sources/foreign-affairs";
import { immigrationServicesSourceEntries } from "@/data/sources/immigration-services";
import { municipalIdentitySourceEntries } from "@/data/sources/municipal-identity";
import { taxBusinessConsumerSourceEntries } from "@/data/sources/tax-business-consumer";
import { sources } from "@/data/sources";

const sourceEntries = [
  ...immigrationServicesSourceEntries,
  ...foreignAffairsSourceEntries,
  ...employmentHealthWelfareSourceEntries,
  ...taxBusinessConsumerSourceEntries,
  ...educationLanguageSourceEntries,
  ...municipalIdentitySourceEntries,
  ...dailyLifeSafetySourceEntries,
];

describe("official source registry assembly", () => {
  it("assembles every subject-owned source exactly once in deterministic module order", () => {
    expect(sourceEntries).toHaveLength(330);
    expect(sources.map(({ id }) => id)).toEqual(sourceEntries.map(({ id }) => id));
    expect(new Set(sources.map(({ id }) => id)).size).toBe(sources.length);
  });
});
