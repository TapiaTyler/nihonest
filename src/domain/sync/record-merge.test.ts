import { describe, expect, it } from "vitest";
import { mergeTimestampedRecords } from "./record-merge";

describe("synchronization merge contracts", () => {
  it("uses the latest record and lets an equal-time removal prevent resurrection", () => {
    const local = [{ id: "article:banking", state: "removed", updatedAt: "2026-09-07T12:00:00.000Z" }] as const;
    const cloud = [{ id: "article:banking", state: "saved", updatedAt: "2026-09-07T12:00:00.000Z" }] as const;
    const merged = mergeTimestampedRecords(local, cloud, ({ id }) => id, ({ state }) => state === "removed");

    expect(merged).toEqual(local);
  });
});
