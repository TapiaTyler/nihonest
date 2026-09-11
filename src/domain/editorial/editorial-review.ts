import { z } from "zod";

const stableIdSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const revisionSchema = z.string().regex(/^[a-f0-9]{64}$/);

export const editorialContentKindSchema = z.enum(["article", "glossary-term", "residence-status", "faq"]);
export const editorialContentStatusSchema = z.enum(["draft", "needs-review", "verified", "archived"]);

export const editorialTargetSchema = z.object({
  kind: editorialContentKindSchema,
  id: stableIdSchema,
  status: editorialContentStatusSchema,
  revision: revisionSchema,
  updatedAt: z.iso.date().optional(),
  lastReviewedAt: z.iso.date().optional(),
});

export const editorialReviewRecordSchema = z.object({
  version: z.literal(1),
  id: stableIdSchema,
  contentKind: editorialContentKindSchema,
  contentId: stableIdSchema,
  contentRevision: revisionSchema,
  approvedStatus: z.literal("verified"),
  reviewedAt: z.iso.date(),
  changeNote: z.string().trim().min(1),
  approvalNote: z.string().trim().min(1),
  validationPerformed: z.array(z.string().trim().min(1)).min(1),
  sourceReviewIds: z.array(stableIdSchema).default([]),
  explicitHumanApproval: z.literal(true),
  recordedAt: z.iso.datetime(),
});

export type EditorialTarget = z.infer<typeof editorialTargetSchema>;
export type EditorialReviewRecord = z.infer<typeof editorialReviewRecordSchema>;

export type EditorialAuditFinding = Readonly<{
  severity: "error";
  code:
    | "duplicate-content-id"
    | "duplicate-review-record"
    | "unknown-review-target"
    | "missing-review-date"
    | "review-before-update"
    | "missing-current-approval"
    | "review-date-mismatch"
    | "future-review-date";
  message: string;
}>;

function targetKey(target: Pick<EditorialTarget, "kind" | "id">): string {
  return `${target.kind}:${target.id}`;
}

/** Creates an immutable approval only for the exact verified revision presented to the human editor. */
export function createEditorialReviewRecord(input: Readonly<{
  target: EditorialTarget;
  reviewedAt: string;
  changeNote: string;
  approvalNote: string;
  validationPerformed: readonly string[];
  sourceReviewIds?: readonly string[];
  recordedAt: string;
}>): EditorialReviewRecord {
  if (input.target.status !== "verified") throw new Error("Only content explicitly set to verified can receive an approval record.");
  if (input.target.lastReviewedAt !== input.reviewedAt) throw new Error("The approval date must match the content's lastReviewedAt metadata.");
  if (input.target.updatedAt && input.reviewedAt < input.target.updatedAt) throw new Error("The approval date cannot precede the current content update.");
  return editorialReviewRecordSchema.parse({
    version: 1,
    id: `${input.target.kind}-${input.target.id}-${input.target.revision.slice(0, 12)}`,
    contentKind: input.target.kind,
    contentId: input.target.id,
    contentRevision: input.target.revision,
    approvedStatus: "verified",
    reviewedAt: input.reviewedAt,
    changeNote: input.changeNote,
    approvalNote: input.approvalNote,
    validationPerformed: input.validationPerformed,
    sourceReviewIds: input.sourceReviewIds ?? [],
    explicitHumanApproval: true,
    recordedAt: input.recordedAt,
  });
}

/** Audits the Git-controlled approval ledger without rewriting content or inferring approval. */
export function auditEditorialState(
  targetsToAudit: readonly EditorialTarget[],
  recordsToAudit: readonly EditorialReviewRecord[],
  today: string,
): readonly EditorialAuditFinding[] {
  const findings: EditorialAuditFinding[] = [];
  const targets = new Map<string, EditorialTarget>();
  for (const target of targetsToAudit) {
    const key = targetKey(target);
    if (targets.has(key)) findings.push({ severity: "error", code: "duplicate-content-id", message: `Content target "${key}" appears more than once.` });
    targets.set(key, target);
  }

  const recordKeys = new Set<string>();
  for (const record of recordsToAudit) {
    const key = `${record.contentKind}:${record.contentId}:${record.contentRevision}`;
    if (recordKeys.has(key)) findings.push({ severity: "error", code: "duplicate-review-record", message: `Approval record "${key}" appears more than once.` });
    recordKeys.add(key);
    if (!targets.has(`${record.contentKind}:${record.contentId}`)) findings.push({ severity: "error", code: "unknown-review-target", message: `Approval record "${record.id}" references unknown content.` });
    if (record.reviewedAt > today) findings.push({ severity: "error", code: "future-review-date", message: `Approval record "${record.id}" has a future review date.` });
  }

  for (const target of targets.values()) {
    if (target.status !== "verified") continue;
    const key = targetKey(target);
    if (!target.lastReviewedAt) {
      findings.push({ severity: "error", code: "missing-review-date", message: `Verified content "${key}" has no lastReviewedAt date.` });
      continue;
    }
    if (target.lastReviewedAt > today) findings.push({ severity: "error", code: "future-review-date", message: `Verified content "${key}" has a future review date.` });
    if (target.updatedAt && target.lastReviewedAt < target.updatedAt) findings.push({ severity: "error", code: "review-before-update", message: `Verified content "${key}" was reviewed before its current update.` });
    const approval = recordsToAudit.find((record) => record.contentKind === target.kind
      && record.contentId === target.id
      && record.contentRevision === target.revision);
    if (!approval) findings.push({ severity: "error", code: "missing-current-approval", message: `Verified content "${key}" has no human approval for its current revision.` });
    else if (approval.reviewedAt !== target.lastReviewedAt) findings.push({ severity: "error", code: "review-date-mismatch", message: `Verified content "${key}" does not match its approval record's review date.` });
  }
  return findings.sort((left, right) => left.code.localeCompare(right.code) || left.message.localeCompare(right.message));
}
