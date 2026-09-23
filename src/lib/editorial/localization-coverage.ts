import type { TranslationArtifact } from "@/domain/translation/translation";

export type TranslationCoverageState =
  | "current-machine-translated"
  | "current-human-reviewed"
  | "stale"
  | "missing"
  | "outdated-active";

export type TranslationCoverageEntry = Readonly<{
  contentId: string;
  state: TranslationCoverageState;
}>;

export type TranslationCoverageReport = Readonly<{
  targetLocale: string;
  total: number;
  current: number;
  machineTranslated: number;
  humanReviewed: number;
  stale: number;
  staleArtifacts: number;
  missing: number;
  outdatedActive: number;
  entries: readonly TranslationCoverageEntry[];
  errors: readonly string[];
}>;

type CoverageInput = Readonly<{
  contentIds: readonly string[];
  sourceRevisions: ReadonlyMap<string, string>;
  artifacts: readonly TranslationArtifact[];
  targetLocale: string;
  terminologyRevision: string;
  promptRevision: string;
}>;

/** Measures repository artifacts without treating incomplete locale coverage as a failing build. */
export function createArticleTranslationCoverageReport({
  contentIds,
  sourceRevisions,
  artifacts,
  targetLocale,
  terminologyRevision,
  promptRevision,
}: CoverageInput): TranslationCoverageReport {
  const expectedIds = new Set(contentIds);
  const relevantArtifacts = artifacts.filter((artifact) => (
    artifact.contentKind === "article" && artifact.targetLocale === targetLocale
  ));
  const errors: string[] = [];

  for (const artifact of relevantArtifacts) {
    if (!expectedIds.has(artifact.contentId)) {
      errors.push(`Translation references unknown article "${artifact.contentId}".`);
    }
  }

  const entries = [...contentIds].sort().map((contentId): TranslationCoverageEntry => {
    const candidates = relevantArtifacts.filter((artifact) => artifact.contentId === contentId);
    const active = candidates.filter((artifact) => artifact.availability === "active");
    if (active.length > 1) errors.push(`Article "${contentId}" has multiple active ${targetLocale} translations.`);

    const currentSourceRevision = sourceRevisions.get(contentId);
    const currentArtifact = active.find((artifact) => (
      artifact.sourceRevision === currentSourceRevision
      && artifact.terminologyRevision === terminologyRevision
      && artifact.promptRevision === promptRevision
    ));
    if (currentArtifact) {
      return {
        contentId,
        state: currentArtifact.reviewState === "human-reviewed"
          ? "current-human-reviewed"
          : "current-machine-translated",
      };
    }
    if (active.length > 0) {
      errors.push(`Article "${contentId}" has an active ${targetLocale} translation with an outdated revision.`);
      return { contentId, state: "outdated-active" };
    }
    if (candidates.length > 0) return { contentId, state: "stale" };
    return { contentId, state: "missing" };
  });

  const count = (state: TranslationCoverageState) => entries.filter((entry) => entry.state === state).length;
  const machineTranslated = count("current-machine-translated");
  const humanReviewed = count("current-human-reviewed");

  return {
    targetLocale,
    total: entries.length,
    current: machineTranslated + humanReviewed,
    machineTranslated,
    humanReviewed,
    stale: count("stale"),
    staleArtifacts: relevantArtifacts.filter(({ availability }) => availability === "stale").length,
    missing: count("missing"),
    outdatedActive: count("outdated-active"),
    entries,
    errors,
  };
}
