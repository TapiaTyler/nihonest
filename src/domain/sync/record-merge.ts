export type TimestampedSyncRecord = Readonly<{
  updatedAt: string;
}>;

/** Newest update wins; exact ties prefer a removal, then the existing account record. */
export function mergeTimestampedRecords<T extends TimestampedSyncRecord>(
  deviceRecords: readonly T[],
  accountRecords: readonly T[],
  keyOf: (record: T) => string,
  isRemoval: (record: T) => boolean = () => false,
): readonly T[] {
  const merged = new Map<string, { record: T; source: "device" | "account" }>();

  for (const [source, records] of [["device", deviceRecords], ["account", accountRecords]] as const) {
    for (const record of records) {
      const key = keyOf(record);
      const current = merged.get(key);
      if (!current || record.updatedAt > current.record.updatedAt) {
        merged.set(key, { record, source });
      } else if (record.updatedAt === current.record.updatedAt) {
        if (isRemoval(record) && !isRemoval(current.record)) merged.set(key, { record, source });
        else if (isRemoval(record) === isRemoval(current.record) && source === "account") merged.set(key, { record, source });
      }
    }
  }

  return [...merged.entries()].sort(([left], [right]) => left.localeCompare(right)).map(([, value]) => value.record);
}
