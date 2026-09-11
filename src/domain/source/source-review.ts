import { z } from "zod";
import type { OfficialSource } from "@/domain/source/source";
import { SOURCE_DEPENDENT_KINDS, type SourceDependencyEntry } from "@/domain/source/source-dependency";
import {
  sourceMonitoringStateSchema,
  type SourceMonitoringState,
} from "@/domain/source/source-monitoring";
import type { ArticleSourceMetadata } from "@/lib/source-monitoring/article-source-metadata";

const stableIdSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const fingerprintSchema = z.string().regex(/^[a-f0-9]{64}$/);

export const sourceReviewOutcomeSchema = z.enum([
  "no-substantive-change",
  "guidance-remains-accurate",
  "guidance-update-required",
  "redirect-or-replacement",
  "temporarily-unavailable",
  "manual-review-required",
]);
export const sourceReviewDecisionSchema = z.enum(["accept", "reject"]);
export const sourceReviewPrioritySchema = z.enum(["low", "medium", "high", "critical"]);
export const sourceReviewNoteKindSchema = z.enum(["human", "codex-advisory"]);

const sourceDependentSchema = z.object({
  kind: z.enum(SOURCE_DEPENDENT_KINDS),
  id: stableIdSchema,
  viaArticleIds: z.array(stableIdSchema),
});

const sourceReviewDifferenceSchema = z.object({
  basis: z.enum(["initial-baseline", "normalized-text", "fingerprint-only"]),
  summary: z.string().min(1),
  beforeExcerpts: z.array(z.string().min(1).max(240)).max(3).default([]),
  afterExcerpts: z.array(z.string().min(1).max(240)).max(3).default([]),
});

const sourceReviewNoteSchema = z.object({
  kind: sourceReviewNoteKindSchema,
  text: z.string().min(1),
  createdAt: z.iso.datetime(),
});

const associatedContentChangeSchema = z.object({
  kind: z.enum(SOURCE_DEPENDENT_KINDS),
  id: stableIdSchema,
  note: z.string().min(1),
});

const sourceReviewResolutionSchema = z.object({
  decision: sourceReviewDecisionSchema,
  outcome: sourceReviewOutcomeSchema,
  reviewedAt: z.iso.date(),
  approvalNote: z.string().min(1),
  unresolvedUncertainty: z.string().min(1),
  validationPerformed: z.array(z.string().min(1)).min(1),
  explicitHumanApproval: z.literal(true),
  reviewedDependencies: z.array(sourceDependentSchema),
  associatedContentChanges: z.array(associatedContentChangeSchema).default([]),
});

export const sourceReviewRecordSchema = z.object({
  version: z.literal(1),
  id: stableIdSchema,
  sourceId: stableIdSchema,
  sourceTitle: z.string().min(1),
  officialUrl: z.url({ protocol: /^https$/ }),
  detectedAs: z.enum(["changed", "redirected"]),
  candidateFingerprint: fingerprintSchema,
  detectedAt: z.iso.datetime(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  status: z.enum(["open", "resolved"]),
  priority: z.object({
    level: sourceReviewPrioritySchema,
    score: z.number().int().min(0).max(100),
    reasons: z.array(z.string().min(1)).min(1),
  }),
  difference: sourceReviewDifferenceSchema,
  potentiallyAffectedClaims: z.array(z.string().min(1)),
  dependencies: z.array(sourceDependentSchema),
  notes: z.array(sourceReviewNoteSchema).default([]),
  resolution: sourceReviewResolutionSchema.optional(),
}).superRefine((record, context) => {
  if ((record.status === "resolved") !== Boolean(record.resolution)) {
    context.addIssue({
      code: "custom",
      path: ["resolution"],
      message: "Resolved source reviews require an explicitly approved resolution.",
    });
  }
});

export type SourceReviewDifference = z.infer<typeof sourceReviewDifferenceSchema>;
export type SourceReviewRecord = z.infer<typeof sourceReviewRecordSchema>;
export type SourceReviewOutcome = z.infer<typeof sourceReviewOutcomeSchema>;

const authorityScores: Record<OfficialSource["authorityLevel"], number> = {
  "national-government": 40,
  "prefectural-government": 35,
  "municipal-government": 35,
  "public-institution": 25,
};
const importanceScores = { informational: 0, recommended: 10, important: 20, critical: 30 } as const;
const highRiskTopics = new Set(["immigration", "taxes", "healthcare", "employment"]);

function assessPriority(
  source: OfficialSource,
  dependency: SourceDependencyEntry,
  articles: readonly ArticleSourceMetadata[],
) {
  const directArticleIds = new Set(dependency.dependents.filter(({ kind }) => kind === "article").map(({ id }) => id));
  const relevantArticles = articles.filter(({ id }) => directArticleIds.has(id));
  const maxImportance = Math.max(0, ...relevantArticles.map(({ importance }) => importanceScores[importance]));
  const risky = relevantArticles.some(({ topicIds }) => topicIds.some((topicId) => highRiskTopics.has(topicId)));
  const breadth = Math.min(15, dependency.dependents.length * 2);
  const score = Math.min(100, authorityScores[source.authorityLevel] + maxImportance + (risky ? 20 : 0) + breadth);
  const level = score >= 85 ? "critical" : score >= 65 ? "high" : score >= 40 ? "medium" : "low";
  return {
    level,
    score,
    reasons: [
      `${source.authorityLevel.replaceAll("-", " ")} source`,
      maxImportance > 0 ? `dependent guidance reaches ${relevantArticles.find(({ importance }) => importanceScores[importance] === maxImportance)?.importance} importance` : "no ranked article dependency",
      risky ? "dependent guidance covers a high-risk subject" : "no high-risk article topic detected",
      `${dependency.dependents.length} direct or inherited dependencies`,
    ],
  } as const;
}

function affectedClaims(articles: readonly ArticleSourceMetadata[], dependency: SourceDependencyEntry): readonly string[] {
  const directArticleIds = new Set(dependency.dependents.filter(({ kind }) => kind === "article").map(({ id }) => id));
  const topics = new Set(articles.filter(({ id }) => directArticleIds.has(id)).flatMap(({ topicIds }) => topicIds));
  const claims = new Set<string>();
  if (topics.has("immigration")) ["eligibility and route scope", "permitted activities and exclusions", "periods, renewals, deadlines, and evidence"].forEach((claim) => claims.add(claim));
  if (topics.has("employment")) ["work permissions and activity limits", "employer, contract, and notification obligations"].forEach((claim) => claims.add(claim));
  if (topics.has("taxes")) ["tax residence, filing, payment, and departure obligations", "amounts, thresholds, and deadlines"].forEach((claim) => claims.add(claim));
  if (topics.has("healthcare")) ["enrollment, eligibility, contributions, and covered care"].forEach((claim) => claims.add(claim));
  if (topics.has("municipal-procedures")) claims.add("municipal forms, timing, evidence, and local variation");
  if (topics.has("housing")) claims.add("contract, cost, guarantor, and move-in requirements");
  if (topics.has("banking")) claims.add("identity, address, screening, and account-opening requirements");
  if (topics.has("transportation")) claims.add("licensing, registration, and safety rules");
  if (claims.size === 0) claims.add("definitions, instructions, examples, and linked official procedures");
  return [...claims].sort();
}

export function createSourceReviewRecord(input: Readonly<{
  source: OfficialSource;
  dependency: SourceDependencyEntry;
  articles: readonly ArticleSourceMetadata[];
  candidateFingerprint: string;
  detectedAs: "changed" | "redirected";
  detectedAt: string;
  createdAt: string;
  difference: SourceReviewDifference;
}>): SourceReviewRecord {
  return sourceReviewRecordSchema.parse({
    version: 1,
    id: `${input.source.id}-${input.candidateFingerprint.slice(0, 12)}`,
    sourceId: input.source.id,
    sourceTitle: input.source.title,
    officialUrl: input.source.url,
    detectedAs: input.detectedAs,
    candidateFingerprint: input.candidateFingerprint,
    detectedAt: input.detectedAt,
    createdAt: input.createdAt,
    updatedAt: input.createdAt,
    status: "open",
    priority: assessPriority(input.source, input.dependency, input.articles),
    difference: input.difference,
    potentiallyAffectedClaims: affectedClaims(input.articles, input.dependency),
    dependencies: input.dependency.dependents,
    notes: [],
  });
}

export function addSourceReviewNote(
  record: SourceReviewRecord,
  note: Readonly<{ kind: "human" | "codex-advisory"; text: string; createdAt: string }>,
): SourceReviewRecord {
  if (record.status === "resolved") throw new Error("Resolved source reviews cannot receive new notes.");
  return sourceReviewRecordSchema.parse({
    ...record,
    updatedAt: note.createdAt,
    notes: [...record.notes, note],
  });
}

export function resolveSourceReview(input: Readonly<{
  record: SourceReviewRecord;
  monitoringState: SourceMonitoringState;
  decision: "accept" | "reject";
  outcome: SourceReviewOutcome;
  reviewedAt: string;
  approvalNote: string;
  unresolvedUncertainty: string;
  validationPerformed: readonly string[];
  resolvedAt: string;
  reviewedDependencies: readonly z.input<typeof sourceDependentSchema>[];
  associatedContentChanges?: readonly z.input<typeof associatedContentChangeSchema>[];
}>): Readonly<{ record: SourceReviewRecord; monitoringState: SourceMonitoringState }> {
  if (input.record.status !== "open") throw new Error("Only open source reviews can be resolved.");
  const monitoringEntry = input.monitoringState.sources[input.record.sourceId];
  if (!monitoringEntry?.candidate || monitoringEntry.candidate.fingerprint !== input.record.candidateFingerprint) {
    throw new Error("The review does not match the current candidate source revision.");
  }

  const record = sourceReviewRecordSchema.parse({
    ...input.record,
    updatedAt: input.resolvedAt,
    status: "resolved",
    resolution: {
      decision: input.decision,
      outcome: input.outcome,
      reviewedAt: input.reviewedAt,
      approvalNote: input.approvalNote,
      unresolvedUncertainty: input.unresolvedUncertainty,
      validationPerformed: input.validationPerformed,
      explicitHumanApproval: true,
      reviewedDependencies: input.reviewedDependencies,
      associatedContentChanges: input.associatedContentChanges ?? [],
    },
  });
  const monitoringState = sourceMonitoringStateSchema.parse({
    ...input.monitoringState,
    sources: {
      ...input.monitoringState.sources,
      [input.record.sourceId]: {
        ...monitoringEntry,
        lastReviewedAt: input.reviewedAt,
        accepted: input.decision === "accept" ? monitoringEntry.candidate : monitoringEntry.accepted,
        candidate: undefined,
      },
    },
  });
  return { record, monitoringState };
}
