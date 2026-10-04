import { validateArticleCollection } from "@/domain/article/article";
import { sources } from "@/data/sources";
import { residenceStatuses } from "@/data/residence-statuses";
import { validateResidenceStatusCollection } from "@/domain/residence-status/residence-status";
import { glossaryTerms } from "@/data/glossary";
import { validateGlossaryCollection } from "@/domain/glossary/glossary";
import { localGuidanceSupplements, supportedGeographies } from "@/data/local-guidance";
import { validateLocalGuidanceCollection } from "@/domain/geography/local-guidance";
import { annotatedDocumentFamilies } from "@/data/annotated-documents";
import { validateAnnotatedDocumentCollection } from "@/domain/document/annotated-document";

import type { ArticleMetadata } from "@/domain/article/article";
import { articleGroups, guidedJourneys } from "@/data/discovery";
import { validateDiscoveryModel } from "@/domain/discovery/discovery";

/** Same collection/reference gates as the web registry; source generation also calls this before writing. */
export function validateArticleMetadataReferences(metadata: readonly ArticleMetadata[]): void {
  const articleIds = metadata.map(({ id }) => id);
  const termIds = glossaryTerms.map(({ id }) => id);
  validateResidenceStatusCollection(residenceStatuses, sources, articleIds, termIds);
  validateArticleCollection(metadata, sources, residenceStatuses.map(({ id }) => id), termIds);
  validateGlossaryCollection(glossaryTerms, sources, articleIds);
  validateDiscoveryModel(articleGroups, guidedJourneys, articleIds);
  validateLocalGuidanceCollection(supportedGeographies, localGuidanceSupplements, articleIds, sources.map(({ id }) => id));
  validateAnnotatedDocumentCollection(annotatedDocumentFamilies, articleIds, termIds, sources.map(({ id }) => id),
    supportedGeographies.filter(({ selectable }) => selectable).map(({ id }) => id));
}
