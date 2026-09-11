import type { SourceDependentKind } from "@/domain/source/source-dependency";
import {
  sourceReviewRecordSchema,
  type SourceReviewDifference,
  type SourceReviewRecord,
} from "@/domain/source/source-review";
import type { SourceSnapshot } from "@/domain/source/source-monitoring";

function excerpts(value: string): readonly string[] {
  return value.split(/(?<=[.!?。！？])\s+/u).map((part) => part.trim()).filter(Boolean);
}

function uniqueChangedExcerpts(primary: string, comparison: string): readonly string[] {
  const comparisonSet = new Set(excerpts(comparison));
  return excerpts(primary).filter((part) => !comparisonSet.has(part)).slice(0, 3).map((part) => part.slice(0, 240));
}

/** Produces short evidence excerpts; it never treats a text diff as a legal interpretation. */
export function summarizeSourceDifference(input: Readonly<{
  accepted?: SourceSnapshot;
  candidate: SourceSnapshot;
  acceptedText?: string;
  candidateText?: string;
}>): SourceReviewDifference {
  if (!input.accepted) return {
    basis: "initial-baseline",
    summary: "This is the first observed revision. It requires human review before becoming the accepted baseline.",
    beforeExcerpts: [],
    afterExcerpts: input.candidateText ? excerpts(input.candidateText).slice(0, 3).map((part) => part.slice(0, 240)) : [],
  };

  if (input.acceptedText !== undefined && input.candidateText !== undefined) {
    const beforeExcerpts = uniqueChangedExcerpts(input.acceptedText, input.candidateText);
    const afterExcerpts = uniqueChangedExcerpts(input.candidateText, input.acceptedText);
    return {
      basis: "normalized-text",
      summary: `Normalized text changed from ${input.accepted.normalizedLength} to ${input.candidate.normalizedLength} bytes; excerpts show textual differences, not their legal meaning.`,
      beforeExcerpts: [...beforeExcerpts],
      afterExcerpts: [...afterExcerpts],
    };
  }

  return {
    basis: "fingerprint-only",
    summary: `The fingerprint changed and normalized length moved from ${input.accepted.normalizedLength} to ${input.candidate.normalizedLength} bytes. Textual comparison is unavailable for this format or local cache.`,
    beforeExcerpts: [],
    afterExcerpts: [],
  };
}

const dependentLabels: Record<SourceDependentKind, string> = {
  article: "Articles",
  "glossary-term": "Glossary terms",
  "residence-status": "Residence statuses",
  "article-group": "Content groups",
  "guided-journey": "Guided journeys",
};

export function renderSourceReviewMarkdown(recordToRender: SourceReviewRecord): string {
  const record = sourceReviewRecordSchema.parse(recordToRender);
  const dependencySections = Object.entries(dependentLabels).flatMap(([kind, label]) => {
    const dependencies = record.dependencies.filter((dependency) => dependency.kind === kind);
    return dependencies.length === 0 ? [] : [
      `### ${label}`,
      "",
      ...dependencies.map((dependency) => `- \`${dependency.id}\`${dependency.viaArticleIds.length > 0 ? ` via ${dependency.viaArticleIds.map((id) => `\`${id}\``).join(", ")}` : ""}`),
      "",
    ];
  });
  const noteLines = record.notes.length === 0
    ? ["- No reviewer notes yet."]
    : record.notes.map((note) => `- **${note.kind === "codex-advisory" ? "Codex advisory" : "Human note"} (${note.createdAt}):** ${note.text}`);
  const resolutionLines = record.resolution ? [
    `- Decision: **${record.resolution.decision} candidate**`,
    `- Outcome: \`${record.resolution.outcome}\``,
    `- Reviewed: ${record.resolution.reviewedAt}`,
    `- Approval: ${record.resolution.approvalNote}`,
    `- Unresolved uncertainty: ${record.resolution.unresolvedUncertainty}`,
    ...record.resolution.validationPerformed.map((validation) => `- Validation: ${validation}`),
    `- Dependencies examined: ${record.resolution.reviewedDependencies.length}`,
    ...record.resolution.reviewedDependencies.map((dependency) => `- Reviewed \`${dependency.kind}:${dependency.id}\``),
    ...record.resolution.associatedContentChanges.map((change) => `- Changed \`${change.kind}:${change.id}\`: ${change.note}`),
  ] : ["- Awaiting explicit human resolution."];

  return [
    `# Source Review: ${record.sourceId}`,
    "",
    `- Official source: [${record.sourceTitle}](${record.officialUrl})`,
    `- Status: **${record.status}**`,
    `- Detected as: \`${record.detectedAs}\``,
    `- Priority: **${record.priority.level}** (${record.priority.score}/100)`,
    `- Candidate: \`${record.candidateFingerprint}\``,
    `- Detected: ${record.detectedAt}`,
    "",
    "## Priority reasons",
    "",
    ...record.priority.reasons.map((reason) => `- ${reason}`),
    "",
    "## Detected difference",
    "",
    record.difference.summary,
    "",
    ...(record.difference.beforeExcerpts.length > 0 ? ["### Before excerpts", "", ...record.difference.beforeExcerpts.map((value) => `- ${value}`), ""] : []),
    ...(record.difference.afterExcerpts.length > 0 ? ["### After excerpts", "", ...record.difference.afterExcerpts.map((value) => `- ${value}`), ""] : []),
    "## Potentially affected claims",
    "",
    ...record.potentiallyAffectedClaims.map((claim) => `- ${claim}`),
    "",
    "## Dependencies",
    "",
    ...dependencySections,
    "## Review notes",
    "",
    ...noteLines,
    "",
    "## Resolution",
    "",
    ...resolutionLines,
    "",
    "Automated differences and Codex suggestions are advisory. Only explicit human approval resolves this record.",
    "",
  ].join("\n");
}
