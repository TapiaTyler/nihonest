import { z } from "zod";
import type { OfficialSource } from "@/domain/source/source";

const fingerprintSchema = z.string().regex(/^[a-f0-9]{64}$/);

export const sourceContentKindSchema = z.enum(["html", "text", "pdf", "binary"]);
export const sourceCheckStatusSchema = z.enum([
  "unchanged",
  "changed",
  "redirected",
  "unavailable",
  "manual",
]);

export const sourceSnapshotSchema = z.object({
  fingerprint: fingerprintSchema,
  capturedAt: z.iso.datetime(),
  resolvedUrl: z.url({ protocol: /^https$/ }),
  contentKind: sourceContentKindSchema,
  normalizedLength: z.number().int().nonnegative(),
});

export const sourceCheckResultSchema = z.object({
  sourceId: z.string().min(1),
  requestedUrl: z.url({ protocol: /^https$/ }),
  checkedAt: z.iso.datetime(),
  status: sourceCheckStatusSchema,
  httpStatus: z.number().int().min(100).max(599).optional(),
  detail: z.string().min(1),
  snapshot: sourceSnapshotSchema.optional(),
}).superRefine((result, context) => {
  const successful = result.status === "unchanged" || result.status === "changed" || result.status === "redirected";
  if (successful && (!result.snapshot || !result.httpStatus)) {
    context.addIssue({
      code: "custom",
      message: "Successful source checks require an HTTP status and snapshot.",
    });
  }
  if (!successful && result.snapshot) {
    context.addIssue({
      code: "custom",
      path: ["snapshot"],
      message: "Unavailable and manual source checks cannot create snapshots.",
    });
  }
});

export const sourceMonitoringEntrySchema = z.object({
  lastSuccessfulCheckAt: z.iso.date().optional(),
  lastReviewedAt: z.iso.date().optional(),
  lastCheck: sourceCheckResultSchema.optional(),
  accepted: sourceSnapshotSchema.optional(),
  candidate: sourceSnapshotSchema.optional(),
});

export const sourceMonitoringStateSchema = z.object({
  version: z.literal(1),
  sources: z.record(z.string(), sourceMonitoringEntrySchema),
});

export type SourceContentKind = z.infer<typeof sourceContentKindSchema>;
export type SourceSnapshot = z.infer<typeof sourceSnapshotSchema>;
export type SourceCheckResult = z.infer<typeof sourceCheckResultSchema>;
export type SourceMonitoringState = z.infer<typeof sourceMonitoringStateSchema>;

/** Candidate revisions remain separate until a later human resolution accepts them. */
export function recordSourceCheck(
  state: SourceMonitoringState,
  result: SourceCheckResult,
): SourceMonitoringState {
  const previous = state.sources[result.sourceId] ?? {};
  const successful = ["unchanged", "changed", "redirected"].includes(result.status);
  const matchingCandidate = previous.candidate
    && result.snapshot
    && previous.candidate.fingerprint === result.snapshot.fingerprint
    && previous.candidate.resolvedUrl === result.snapshot.resolvedUrl;
  const candidate = result.status === "changed" || result.status === "redirected"
    ? matchingCandidate
      ? previous.candidate
      : result.snapshot
    : result.status === "unchanged"
      ? undefined
      : previous.candidate;

  return sourceMonitoringStateSchema.parse({
    ...state,
    sources: {
      ...state.sources,
      [result.sourceId]: {
        ...previous,
        ...(successful ? { lastSuccessfulCheckAt: result.checkedAt.slice(0, 10) } : {}),
        lastCheck: result,
        ...(candidate ? { candidate } : { candidate: undefined }),
      },
    },
  });
}

export function classifySourceSnapshot(
  source: OfficialSource,
  snapshot: SourceSnapshot,
  checkedAt: string,
  httpStatus: number,
  accepted?: SourceSnapshot,
  redirected = false,
): SourceCheckResult {
  if (redirected || snapshot.resolvedUrl !== source.url) {
    return sourceCheckResultSchema.parse({
      sourceId: source.id,
      requestedUrl: source.url,
      checkedAt,
      status: "redirected",
      httpStatus,
      detail: `The source resolved to ${snapshot.resolvedUrl}; confirm the canonical URL before accepting it.`,
      snapshot,
    });
  }

  if (accepted?.fingerprint === snapshot.fingerprint) {
    return sourceCheckResultSchema.parse({
      sourceId: source.id,
      requestedUrl: source.url,
      checkedAt,
      status: "unchanged",
      httpStatus,
      detail: "The normalized source content matches the accepted revision.",
      snapshot,
    });
  }

  return sourceCheckResultSchema.parse({
    sourceId: source.id,
    requestedUrl: source.url,
    checkedAt,
    status: "changed",
    httpStatus,
    detail: accepted
      ? "The normalized source content differs from the accepted revision."
      : "No accepted revision exists; this first observation requires human acceptance.",
    snapshot,
  });
}
