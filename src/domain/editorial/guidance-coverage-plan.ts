import { z } from "zod";

const stableIdSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const GUIDANCE_COVERAGE_DIMENSIONS = [
  "entry-and-residence",
  "school-selection",
  "status-eligibility",
  "education-and-experience",
  "activity-scope",
  "reentry-and-travel",
  "renewal-and-change",
  "family-and-dependants",
  "tax",
  "employment-and-side-work",
  "social-insurance",
  "housing-and-consumer",
  "mobility-and-safety",
  "civic-and-disaster",
  "culture-and-language",
  "municipal-variation",
  "documents-and-forms",
  "accepting-organization-duties",
  "search-and-navigation",
] as const;

export const GUIDANCE_DISCOVERY_OUTPUTS = [
  "topic-candidates",
  "user-situations",
  "edge-cases-and-exceptions",
  "jurisdiction-variables",
  "primary-source-candidates",
  "content-impacts",
  "scope-boundaries",
  "unresolved-questions",
] as const;

const batchSchema = z.object({
  id: stableIdSchema,
  targetIteration: z.number().int().min(3).max(11),
  articleIds: z.array(stableIdSchema).default([]),
  residenceStatusIds: z.array(stableIdSchema).default([]),
});

const coverageTrackSchema = z.object({
  id: stableIdSchema,
  targetIterations: z.array(z.number().int().min(2).max(16)).min(1),
  dimensionIds: z.array(z.enum(GUIDANCE_COVERAGE_DIMENSIONS)).min(1),
  plannedArticleIds: z.array(stableIdSchema).default([]),
  summary: z.string().min(1),
});

export const guidanceCoveragePlanSchema = z.object({
  version: z.literal(1),
  catalogSnapshotDate: z.iso.date(),
  workflow: z.object({
    discoveryRequiredBeforeImplementation: z.literal(true),
    requiredDiscoveryOutputs: z.array(z.enum(GUIDANCE_DISCOVERY_OUTPUTS)),
  }),
  articleBatches: z.array(batchSchema).min(1),
  residenceStatusBatches: z.array(batchSchema).min(1),
  coverageTracks: z.array(coverageTrackSchema).min(1),
});

export const guidanceDiscoveryRecordSchema = z.object({
  version: z.literal(1),
  id: stableIdSchema,
  workstreamId: stableIdSchema,
  preparedAt: z.iso.date(),
  reviewState: z.enum(["proposed", "scope-approved"]),
  topicCandidates: z.array(z.string().min(1)).min(1),
  userSituations: z.array(z.string().min(1)).min(1),
  edgeCasesAndExceptions: z.array(z.string().min(1)).min(1),
  jurisdictionVariables: z.array(z.string().min(1)),
  primarySourceCandidates: z.array(z.object({
    organization: z.string().min(1),
    url: z.url({ protocol: /^https$/ }),
    supports: z.array(z.string().min(1)).min(1),
  })).min(1),
  contentImpacts: z.array(z.object({
    kind: z.enum(["article", "residence-status", "glossary-term", "faq", "group", "journey", "new-article"]),
    id: stableIdSchema,
    action: z.enum(["create", "update", "review"]),
    reason: z.string().min(1),
  })).min(1),
  scopeBoundaries: z.array(z.string().min(1)).min(1),
  unresolvedQuestions: z.array(z.string().min(1)),
  scopeApproval: z.object({ approvedAt: z.iso.date(), note: z.string().min(1) }).optional(),
}).superRefine((record, context) => {
  if ((record.reviewState === "scope-approved") !== Boolean(record.scopeApproval)) {
    context.addIssue({ code: "custom", path: ["scopeApproval"], message: "Scope approval metadata must match the discovery review state." });
  }
});

export type GuidanceCoveragePlan = z.infer<typeof guidanceCoveragePlanSchema>;
export type GuidanceDiscoveryRecord = z.infer<typeof guidanceDiscoveryRecordSchema>;

export type GuidanceCoverageFinding = Readonly<{
  code: "missing-id" | "unknown-id" | "duplicate-id" | "missing-coverage-dimension" | "missing-discovery-output";
  message: string;
}>;

function compareInventory(
  kind: "article" | "residence status",
  knownIds: readonly string[],
  plannedIds: readonly string[],
): GuidanceCoverageFinding[] {
  const findings: GuidanceCoverageFinding[] = [];
  const known = new Set(knownIds);
  const counts = new Map<string, number>();
  for (const id of plannedIds) counts.set(id, (counts.get(id) ?? 0) + 1);
  for (const id of known) if (!counts.has(id)) findings.push({ code: "missing-id", message: `${kind} "${id}" is not assigned to a guidance research batch.` });
  for (const [id, count] of counts) {
    if (!known.has(id)) findings.push({ code: "unknown-id", message: `The guidance coverage plan references unknown ${kind} "${id}".` });
    if (count > 1) findings.push({ code: "duplicate-id", message: `${kind} "${id}" is assigned ${count} times.` });
  }
  return findings;
}

/** Ensures catalog growth and edge-case scope cannot silently bypass editorial planning. */
export function auditGuidanceCoverage(
  planInput: unknown,
  articleIds: readonly string[],
  residenceStatusIds: readonly string[],
): readonly GuidanceCoverageFinding[] {
  const plan = guidanceCoveragePlanSchema.parse(planInput);
  const findings = [
    ...compareInventory("article", articleIds, plan.articleBatches.flatMap(({ articleIds: ids }) => ids)),
    ...compareInventory("residence status", residenceStatusIds, plan.residenceStatusBatches.flatMap(({ residenceStatusIds: ids }) => ids)),
  ];
  const coveredDimensions = new Set(plan.coverageTracks.flatMap(({ dimensionIds }) => dimensionIds));
  for (const dimension of GUIDANCE_COVERAGE_DIMENSIONS) {
    if (!coveredDimensions.has(dimension)) findings.push({ code: "missing-coverage-dimension", message: `Coverage dimension "${dimension}" has no guidance coverage track.` });
  }
  const discoveryOutputs = new Set(plan.workflow.requiredDiscoveryOutputs);
  for (const output of GUIDANCE_DISCOVERY_OUTPUTS) {
    if (!discoveryOutputs.has(output)) findings.push({ code: "missing-discovery-output", message: `Required discovery output "${output}" is missing from the workflow.` });
  }
  return findings.sort((left, right) => left.code.localeCompare(right.code) || left.message.localeCompare(right.message));
}
