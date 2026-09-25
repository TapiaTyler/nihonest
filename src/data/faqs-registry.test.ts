import { describe, expect, it } from "vitest";
import { faqs } from "@/data/faqs";
import { arrivalAndDailyLifeFaqEntries } from "@/data/faqs/arrival-and-daily-life";
import { familyAndLongTermResidenceFaqEntries } from "@/data/faqs/family-and-long-term-residence";
import { immigrationAndEntryFaqEntries } from "@/data/faqs/immigration-and-entry";
import { ongoingResponsibilitiesFaqEntries } from "@/data/faqs/ongoing-responsibilities";
import { studyFaqEntries } from "@/data/faqs/study";
import { workAndBusinessFaqEntries } from "@/data/faqs/work-and-business";

const faqEntries = [
  ...immigrationAndEntryFaqEntries,
  ...studyFaqEntries,
  ...arrivalAndDailyLifeFaqEntries,
  ...workAndBusinessFaqEntries,
  ...familyAndLongTermResidenceFaqEntries,
  ...ongoingResponsibilitiesFaqEntries,
];

describe("FAQ registry assembly", () => {
  it("assembles every browse-group-owned FAQ exactly once in deterministic module order", () => {
    expect(faqEntries).toHaveLength(116);
    expect(faqs.map(({ id }) => id)).toEqual(faqEntries.map(({ id }) => id));
    expect(new Set(faqs.map(({ id }) => id)).size).toBe(faqs.length);
  });
});
