import { storedValue, type KeyValueStore } from "./key-value-store";

export const localGuidanceLocationStorageKey = "nihonest:local-guidance-location:v1";
const localGuidanceLocation = storedValue(localGuidanceLocationStorageKey);

export const getLocalGuidanceLocationSnapshot = (): string => localGuidanceLocation.snapshot();
export const subscribeToLocalGuidanceLocation = localGuidanceLocation.subscribe;

/** An empty value clears the saved location. */
export function writeLocalGuidanceLocation(value: string, storage: KeyValueStore | undefined = localGuidanceLocation.store()): void {
  localGuidanceLocation.write(value || null, storage);
}
