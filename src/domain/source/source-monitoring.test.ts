import { describe, expect, it } from "vitest";
import { officialSourceSchema } from "@/domain/source/source";
import {
  classifySourceSnapshot,
  recordSourceCheck,
  sourceMonitoringStateSchema,
  sourceSnapshotSchema,
} from "@/domain/source/source-monitoring";

const source = officialSourceSchema.parse({
  id: "official-guide",
  organization: "Example Ministry",
  title: "Official guide",
  url: "https://example.go.jp/guide",
  authorityLevel: "national-government",
  language: "en",
});
const snapshot = sourceSnapshotSchema.parse({
  fingerprint: "a".repeat(64),
  capturedAt: "2026-09-11T12:00:00.000Z",
  resolvedUrl: source.url,
  contentKind: "html",
  normalizedLength: 120,
});

describe("source snapshot classification", () => {
  it("requires human acceptance for a first or changed observation", () => {
    expect(classifySourceSnapshot(source, snapshot, snapshot.capturedAt, 200).status).toBe("changed");
    expect(classifySourceSnapshot(source, snapshot, snapshot.capturedAt, 200, {
      ...snapshot,
      fingerprint: "b".repeat(64),
    }).status).toBe("changed");
  });

  it("recognizes an accepted fingerprint and a redirected URL", () => {
    expect(classifySourceSnapshot(source, snapshot, snapshot.capturedAt, 200, snapshot).status).toBe("unchanged");
    expect(classifySourceSnapshot(source, {
      ...snapshot,
      resolvedUrl: "https://example.go.jp/new-guide",
    }, snapshot.capturedAt, 200, snapshot).status).toBe("redirected");
  });
});

describe("source monitoring state", () => {
  it("records successful observations as candidates without accepting them", () => {
    const initial = sourceMonitoringStateSchema.parse({ version: 1, sources: {} });
    const result = classifySourceSnapshot(source, snapshot, snapshot.capturedAt, 200);
    const state = recordSourceCheck(initial, result);

    expect(state.sources[source.id]).toMatchObject({
      lastSuccessfulCheckAt: "2026-09-11",
      candidate: snapshot,
    });
    expect(state.sources[source.id]?.accepted).toBeUndefined();
  });

  it("does not advance the successful date or discard a candidate after a failed check", () => {
    const existing = sourceMonitoringStateSchema.parse({
      version: 1,
      sources: {
        [source.id]: {
          lastSuccessfulCheckAt: "2026-09-10",
          candidate: snapshot,
        },
      },
    });
    const state = recordSourceCheck(existing, {
      sourceId: source.id,
      requestedUrl: source.url,
      checkedAt: "2026-09-11T12:00:00.000Z",
      status: "unavailable",
      detail: "The source could not be reached.",
    });

    expect(state.sources[source.id]?.lastSuccessfulCheckAt).toBe("2026-09-10");
    expect(state.sources[source.id]?.candidate).toEqual(snapshot);
  });
});
