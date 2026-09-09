import { z } from "zod";
import { glossaryStudyProgressSchema } from "@/domain/glossary-study/glossary-study";
import { checklistProgressSchema } from "@/domain/roadmap/personalized-roadmap";
import { savedContentKey, savedContentRecordSchema } from "@/domain/saved-content/saved-content";
import { mergeTimestampedRecords } from "./record-merge";

export const accountContentStateSchema = z.object({
  savedContent: z.array(savedContentRecordSchema),
  glossaryProgress: z.array(glossaryStudyProgressSchema),
  checklistProgress: z.array(checklistProgressSchema),
});

export type AccountContentState = z.infer<typeof accountContentStateSchema>;

export const emptyAccountContentState: AccountContentState = {
  savedContent: [],
  glossaryProgress: [],
  checklistProgress: [],
};

/** Mirrors the database conflict rules for deterministic offline and unit-test behavior. */
export function mergeAccountContentState(deviceState: AccountContentState, accountState: AccountContentState): AccountContentState {
  return accountContentStateSchema.parse({
    savedContent: mergeTimestampedRecords(
      deviceState.savedContent,
      accountState.savedContent,
      savedContentKey,
      ({ state }) => state === "removed",
    ),
    glossaryProgress: mergeTimestampedRecords(
      deviceState.glossaryProgress,
      accountState.glossaryProgress,
      ({ termId }) => termId,
    ),
    checklistProgress: mergeTimestampedRecords(
      deviceState.checklistProgress,
      accountState.checklistProgress,
      ({ checklistId }) => checklistId,
    ),
  });
}
