import { arrivalAndDailyLifeFaqEntries } from "@/data/faqs/arrival-and-daily-life";
import { familyAndLongTermResidenceFaqEntries } from "@/data/faqs/family-and-long-term-residence";
import { immigrationAndEntryFaqEntries } from "@/data/faqs/immigration-and-entry";
import { ongoingResponsibilitiesFaqEntries } from "@/data/faqs/ongoing-responsibilities";
import { studyFaqEntries } from "@/data/faqs/study";
import { workAndBusinessFaqEntries } from "@/data/faqs/work-and-business";

// Module order follows FAQ_BROWSE_GROUP_IDS; array order within each module is editorial.
export const faqs = [
  ...immigrationAndEntryFaqEntries,
  ...studyFaqEntries,
  ...arrivalAndDailyLifeFaqEntries,
  ...workAndBusinessFaqEntries,
  ...familyAndLongTermResidenceFaqEntries,
  ...ongoingResponsibilitiesFaqEntries,
];
