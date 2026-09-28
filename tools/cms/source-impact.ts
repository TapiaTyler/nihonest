import { sources } from "@/data/sources";
import {
  SOURCE_DEPENDENT_KINDS,
  type SourceRegistryFinding,
  type SourceDependent,
} from "@/domain/source/source-dependency";
import type { OfficialSource } from "@/domain/source/source";
import { loadArticleSourceMetadata } from "@/lib/source-monitoring/article-source-metadata";
import { buildRepositorySourceRegistry } from "@/lib/source-monitoring/repository-source-registry";

export const CMS_SOURCE_IMPACT_COVERAGE_NOTE =
  "Source relationships use the repository source registry. FAQs are not represented in that registry, so FAQ source impact is unavailable here.";

export type CmsSourceImpactSource = Pick<OfficialSource, "id" | "title" | "organization" | "url"> & Readonly<{
  dependents: readonly SourceDependent[];
}>;

export type CmsContentSourceLookup = Readonly<{
  kind: string;
  id: string;
  sourceIds: readonly string[];
  sources: readonly Pick<OfficialSource, "id" | "title" | "organization" | "url">[];
  unknownSourceIds: readonly string[];
  coverage: "complete" | "partial" | "unknown";
  note?: string;
}>;

export type CmsSourceImpactCatalog = Readonly<{
  sources: readonly CmsSourceImpactSource[];
  findings: readonly SourceRegistryFinding[];
  coverageNote: string;
  findContentSources(input: Readonly<{
    kind?: string;
    id: string;
    /** Pass the selected record's declared IDs when available to expose unknown references. */
    declaredSourceIds?: readonly string[];
  }>): CmsContentSourceLookup;
}>;

const sourceById = new Map(sources.map((source) => [source.id, source]));
const dependentKinds = new Set<string>(SOURCE_DEPENDENT_KINDS);

function dependentKey(kind: string, id: string): string {
  return `${kind}:${id}`;
}

/** Build read-only impact views from the same dependency graph used by source-review commands. */
export function buildCmsSourceImpactCatalog(
  articles: Parameters<typeof buildRepositorySourceRegistry>[0],
): CmsSourceImpactCatalog {
  const registry = buildRepositorySourceRegistry(articles);
  const dependentByKey = new Map<string, { sourceIds: Set<string>; viaArticleIds: Set<string> }>();
  for (const entry of registry.graph) {
    for (const dependent of entry.dependents) {
      const key = dependentKey(dependent.kind, dependent.id);
      const aggregate = dependentByKey.get(key) ?? { sourceIds: new Set<string>(), viaArticleIds: new Set<string>() };
      aggregate.sourceIds.add(entry.sourceId);
      for (const articleId of dependent.viaArticleIds) aggregate.viaArticleIds.add(articleId);
      dependentByKey.set(key, aggregate);
    }
  }

  const listedSources = registry.graph.flatMap((entry) => {
    const source = sourceById.get(entry.sourceId);
    return source ? [{
      id: source.id,
      title: source.title,
      organization: source.organization,
      url: source.url,
      dependents: entry.dependents,
    }] : [];
  });

  const findContentSources: CmsSourceImpactCatalog["findContentSources"] = ({ kind, id, declaredSourceIds }) => {
    const kindIsKnown = kind !== undefined && dependentKinds.has(kind);
    if (!kindIsKnown) {
      return {
        kind: kind ?? "",
        id,
        sourceIds: [],
        sources: [],
        unknownSourceIds: [],
        coverage: "unknown",
        note: kind === "faq"
          ? "FAQs are not represented in the repository source dependency graph."
          : kind === undefined
            ? "A content kind is required; FAQs are not represented in this graph."
            : `Content kind "${kind}" is not represented in the repository source dependency graph.`,
      };
    }

    const key = dependentKey(kind, id);
    const graphRecord = dependentByKey.get(key);
    const recordFindings = registry.findings.filter((finding) => (
      finding.dependent?.kind === kind && finding.dependent.id === id
    ));
    if (!graphRecord && recordFindings.length === 0) {
      return {
        kind,
        id,
        sourceIds: [],
        sources: [],
        unknownSourceIds: [],
        coverage: "unknown",
        note: "This content ID is not present in the loaded source dependency graph.",
      };
    }

    const graphSourceIds = [...(graphRecord?.sourceIds ?? [])].sort();
    const idsWereProvided = declaredSourceIds !== undefined;
    const requestedIds = idsWereProvided ? [...new Set(declaredSourceIds)].sort() : graphSourceIds;
    const unknownSourceIds = requestedIds.filter((sourceId) => !sourceById.has(sourceId));
    const availableIds = requestedIds.filter((sourceId) => sourceById.has(sourceId));
    const hasRegistryDefect = recordFindings.some(({ code }) => code !== "unused-source");
    const coverage = unknownSourceIds.length > 0 || hasRegistryDefect || !idsWereProvided
      ? "partial"
      : "complete";
    const notes = [
      !idsWereProvided ? "The record's declared source IDs were not supplied; graph matches may be incomplete." : undefined,
      unknownSourceIds.length > 0 ? `Unknown source IDs: ${unknownSourceIds.join(", ")}.` : undefined,
      hasRegistryDefect ? "The source registry reports missing, duplicate, or unknown references for this record." : undefined,
    ].filter((note): note is string => Boolean(note));
    return {
      kind,
      id,
      sourceIds: availableIds,
      sources: availableIds.flatMap((sourceId) => {
        const source = sourceById.get(sourceId);
        return source ? [{ id: source.id, title: source.title, organization: source.organization, url: source.url }] : [];
      }),
      unknownSourceIds,
      coverage,
      ...(notes.length > 0 ? { note: notes.join(" ") } : {}),
    };
  };

  return {
    sources: listedSources,
    findings: registry.findings,
    coverageNote: CMS_SOURCE_IMPACT_COVERAGE_NOTE,
    findContentSources,
  };
}

export async function loadCmsSourceImpactCatalog(articleDirectory: string): Promise<CmsSourceImpactCatalog> {
  return buildCmsSourceImpactCatalog(await loadArticleSourceMetadata(articleDirectory));
}
