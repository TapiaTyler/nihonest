export const SOURCE_DEPENDENT_KINDS = [
  "article",
  "glossary-term",
  "residence-status",
  "article-group",
  "guided-journey",
] as const;

export type SourceDependentKind = (typeof SOURCE_DEPENDENT_KINDS)[number];
export type DirectSourceDependentKind = Extract<
  SourceDependentKind,
  "article" | "glossary-term" | "residence-status"
>;
export type DerivedSourceDependentKind = Extract<
  SourceDependentKind,
  "article-group" | "guided-journey"
>;

export type SourceReferenceRecord = Readonly<{
  kind: DirectSourceDependentKind;
  id: string;
  sourceIds: readonly string[];
}>;

export type SourceArticleContainer = Readonly<{
  kind: DerivedSourceDependentKind;
  id: string;
  articleIds: readonly string[];
}>;

export type SourceDependent = Readonly<{
  kind: SourceDependentKind;
  id: string;
  /** Indirect group and journey dependencies retain the articles that created the relationship. */
  viaArticleIds: readonly string[];
}>;

export type SourceDependencyEntry = Readonly<{
  sourceId: string;
  dependents: readonly SourceDependent[];
}>;

export type SourceRegistryFinding = Readonly<{
  severity: "error" | "warning";
  code:
    | "duplicate-source-id"
    | "missing-source-reference"
    | "duplicate-source-reference"
    | "unknown-source-reference"
    | "unused-source";
  message: string;
  sourceId?: string;
  dependent?: Readonly<{ kind: DirectSourceDependentKind; id: string }>;
}>;

type SourceDependencyInput = Readonly<{
  sourceIds: readonly string[];
  references: readonly SourceReferenceRecord[];
  containers?: readonly SourceArticleContainer[];
}>;

const kindOrder = new Map(SOURCE_DEPENDENT_KINDS.map((kind, index) => [kind, index]));

function sortDependents(left: SourceDependent, right: SourceDependent): number {
  return (kindOrder.get(left.kind)! - kindOrder.get(right.kind)!) || left.id.localeCompare(right.id);
}

/** Builds direct source dependencies and derives group/journey exposure through article membership. */
export function buildSourceDependencyGraph({
  sourceIds,
  references,
  containers = [],
}: SourceDependencyInput): readonly SourceDependencyEntry[] {
  const dependencies = new Map<string, Map<string, { kind: SourceDependentKind; id: string; viaArticleIds: Set<string> }>>();
  for (const sourceId of new Set(sourceIds)) dependencies.set(sourceId, new Map());

  const articleSources = new Map<string, Set<string>>();
  const addDependency = (sourceId: string, kind: SourceDependentKind, id: string, viaArticleId?: string) => {
    const sourceDependencies = dependencies.get(sourceId);
    if (!sourceDependencies) return;
    const key = `${kind}:${id}`;
    const dependency = sourceDependencies.get(key) ?? { kind, id, viaArticleIds: new Set<string>() };
    if (viaArticleId) dependency.viaArticleIds.add(viaArticleId);
    sourceDependencies.set(key, dependency);
  };

  for (const reference of references) {
    const uniqueSourceIds = new Set(reference.sourceIds);
    if (reference.kind === "article") articleSources.set(reference.id, uniqueSourceIds);
    for (const sourceId of uniqueSourceIds) addDependency(sourceId, reference.kind, reference.id);
  }

  for (const container of containers) {
    const sourceArticles = new Map<string, Set<string>>();
    for (const articleId of new Set(container.articleIds)) {
      for (const sourceId of articleSources.get(articleId) ?? []) {
        const articles = sourceArticles.get(sourceId) ?? new Set<string>();
        articles.add(articleId);
        sourceArticles.set(sourceId, articles);
      }
    }
    for (const [sourceId, articleIds] of sourceArticles) {
      for (const articleId of articleIds) addDependency(sourceId, container.kind, container.id, articleId);
    }
  }

  return [...dependencies].map(([sourceId, sourceDependencies]) => ({
    sourceId,
    dependents: [...sourceDependencies.values()].map((dependency) => ({
      kind: dependency.kind,
      id: dependency.id,
      viaArticleIds: [...dependency.viaArticleIds].sort(),
    })).sort(sortDependents),
  })).sort((left, right) => left.sourceId.localeCompare(right.sourceId));
}

/** Reports registry defects without coupling editorial tooling to a UI or throwing on warnings. */
export function auditSourceRegistry({
  sourceIds,
  references,
}: Pick<SourceDependencyInput, "sourceIds" | "references">): readonly SourceRegistryFinding[] {
  const findings: SourceRegistryFinding[] = [];
  const sourceIdCounts = new Map<string, number>();
  for (const sourceId of sourceIds) sourceIdCounts.set(sourceId, (sourceIdCounts.get(sourceId) ?? 0) + 1);

  for (const [sourceId, count] of sourceIdCounts) {
    if (count > 1) findings.push({
      severity: "error",
      code: "duplicate-source-id",
      sourceId,
      message: `Source ID "${sourceId}" appears ${count} times.`,
    });
  }

  const knownSourceIds = new Set(sourceIds);
  const usedSourceIds = new Set<string>();
  for (const reference of references) {
    if (reference.sourceIds.length === 0) findings.push({
      severity: "error",
      code: "missing-source-reference",
      dependent: { kind: reference.kind, id: reference.id },
      message: `${reference.kind} "${reference.id}" does not reference a source.`,
    });

    const counts = new Map<string, number>();
    for (const sourceId of reference.sourceIds) counts.set(sourceId, (counts.get(sourceId) ?? 0) + 1);
    for (const [sourceId, count] of counts) {
      if (count > 1) findings.push({
        severity: "error",
        code: "duplicate-source-reference",
        sourceId,
        dependent: { kind: reference.kind, id: reference.id },
        message: `${reference.kind} "${reference.id}" references source "${sourceId}" ${count} times.`,
      });
      if (!knownSourceIds.has(sourceId)) findings.push({
        severity: "error",
        code: "unknown-source-reference",
        sourceId,
        dependent: { kind: reference.kind, id: reference.id },
        message: `${reference.kind} "${reference.id}" references unknown source "${sourceId}".`,
      });
      else usedSourceIds.add(sourceId);
    }
  }

  for (const sourceId of new Set(sourceIds)) {
    if (!usedSourceIds.has(sourceId)) findings.push({
      severity: "warning",
      code: "unused-source",
      sourceId,
      message: `Source "${sourceId}" has no direct content dependencies.`,
    });
  }

  return findings.sort((left, right) => (
    left.severity.localeCompare(right.severity)
    || left.code.localeCompare(right.code)
    || (left.sourceId ?? "").localeCompare(right.sourceId ?? "")
    || (left.dependent?.kind ?? "").localeCompare(right.dependent?.kind ?? "")
    || (left.dependent?.id ?? "").localeCompare(right.dependent?.id ?? "")
  ));
}
