import { describe, expect, it } from "vitest";
import { mergeTimestampedRecords } from "./record-merge";

describe("synchronization merge contracts", () => {
  it("uses the latest record and lets an equal-time removal prevent resurrection", () => {
    type TestRecord = Readonly<{ id: string; state: "saved" | "removed"; updatedAt: string }>;
    const deviceRecords: readonly TestRecord[] = [{ id: "article:banking", state: "removed", updatedAt: "2026-09-07T12:00:00.000Z" }];
    const accountRecords: readonly TestRecord[] = [{ id: "article:banking", state: "saved", updatedAt: "2026-09-07T12:00:00.000Z" }];
    const merged = mergeTimestampedRecords(deviceRecords, accountRecords, ({ id }) => id, ({ state }) => state === "removed");

    expect(merged).toEqual(deviceRecords);
  });
});
