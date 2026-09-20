import { articleGroups, guidedJourneys } from "@/data/discovery";
import { glossaryTerms } from "@/data/glossary";
import { annotatedDocumentFamilies } from "@/data/annotated-documents";
import { localGuidanceSupplements } from "@/data/local-guidance";
import { residenceStatuses } from "@/data/residence-statuses";
import { sources } from "@/data/sources";
import { getJourneyArticleIds } from "@/domain/discovery/discovery";
import {
  auditSourceRegistry,
  buildSourceDependencyGraph,
  type SourceArticleContainer,
  type SourceReferenceRecord,
} from "@/domain/source/source-dependency";
import type { ArticleSourceMetadata } from "@/lib/source-monitoring/article-source-metadata";

function annotatedDocumentSourceIds(family: (typeof annotatedDocumentFamilies)[number]): readonly string[] {
  const versions = family.jurisdictionVariants.length > 0
    ? family.jurisdictionVariants.flatMap(({ versions: variantVersions }) => variantVersions)
    : family.versions;
  return [...new Set(versions.flatMap(({ sourceIds }) => sourceIds))];
}

/** Builds the same registry for MDX-aware app code and filesystem-based editorial commands. */
export function buildRepositorySourceRegistry(articles: readonly ArticleSourceMetadata[]) {
  const references: readonly SourceReferenceRecord[] = [
    ...articles.map((article) => ({ kind: "article" as const, id: article.id, sourceIds: article.sourceIds })),
    ...glossaryTerms.map((term) => ({ kind: "glossary-term" as const, id: term.id, sourceIds: term.sourceIds })),
    ...residenceStatuses.map((status) => ({ kind: "residence-status" as const, id: status.id, sourceIds: status.sourceIds })),
    ...annotatedDocumentFamilies.map((family) => ({
      kind: "annotated-document" as const,
      id: family.id,
      sourceIds: annotatedDocumentSourceIds(family),
      viaArticleIds: [family.articleId],
    })),
    ...localGuidanceSupplements.map((supplement) => ({
      kind: "local-guidance" as const,
      id: supplement.id,
      sourceIds: supplement.sourceIds,
      viaArticleIds: [supplement.articleId],
    })),
  ];
  const containers: readonly SourceArticleContainer[] = [
    ...articleGroups.map((group) => ({ kind: "article-group" as const, id: group.id, articleIds: group.articleIds })),
    ...guidedJourneys.map((journey) => ({ kind: "guided-journey" as const, id: journey.id, articleIds: getJourneyArticleIds(journey) })),
  ];
  const sourceIds = sources.map(({ id }) => id);
  return {
    graph: buildSourceDependencyGraph({ sourceIds, references, containers }),
    findings: auditSourceRegistry({ sourceIds, references }),
  } as const;
}
