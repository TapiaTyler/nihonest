import { glossaryStudyProgressSchema, type GlossaryStudyProgress } from "@/domain/glossary-study/glossary-study";
import { parseStoredJson, storedValue, type KeyValueStore } from "./key-value-store";

export const glossaryStudyStorageKey = "nihonest:glossary-study:v1";
const glossaryStudy = storedValue(glossaryStudyStorageKey);

export function readGlossaryStudyProgress(storage: KeyValueStore | undefined = glossaryStudy.store()): readonly GlossaryStudyProgress[] {
  return parseStoredJson(glossaryStudy.read(storage), glossaryStudyProgressSchema.array()) ?? [];
}

export const getGlossaryStudySnapshot = (): string => glossaryStudy.snapshot();
export const subscribeToGlossaryStudy = glossaryStudy.subscribe;

export function writeGlossaryStudyProgress(records: readonly GlossaryStudyProgress[], storage: KeyValueStore | undefined = glossaryStudy.store()): void {
  glossaryStudy.write(JSON.stringify(records), storage);
}
