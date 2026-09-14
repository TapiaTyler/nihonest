import { annotatedDocumentFamilies } from "@/data/annotated-documents";
import { supportedGeographies } from "@/data/local-guidance";
import { sources } from "@/data/sources";
import type { AnnotatedDocumentFamily } from "@/domain/document/annotated-document";

export function getAnnotatedDocumentsForArticle(articleId: string) {
  return annotatedDocumentFamilies
    .filter((family) => family.articleId === articleId)
    .map(enrichDocumentFamily);
}

export function getAnnotatedDocumentsForGlossaryTerm(termId: string) {
  return annotatedDocumentFamilies
    .filter((family) => family.glossaryTermIds.some((id) => id === termId))
    .map(enrichDocumentFamily);
}

function enrichDocumentFamily(family: AnnotatedDocumentFamily) {
  return {
    ...family,
    versions: family.versions.map(enrichDocumentVersion),
    jurisdictionVariants: family.jurisdictionVariants.map((variant) => {
      const geography = supportedGeographies.find(({ id }) => id === variant.geographyId);
      const parentGeography = supportedGeographies.find(({ id }) => id === geography?.parentId);
      if (!geography || !parentGeography) throw new Error(`Missing geography hierarchy for document variant "${variant.id}".`);
      return {
        ...variant,
        geography,
        parentGeography,
        versions: variant.versions.map(enrichDocumentVersion),
      };
    }),
  };
}

function enrichDocumentVersion(version: AnnotatedDocumentFamily["versions"][number]) {
  return {
    ...version,
    officialVisuals: version.officialVisuals.map((visual) => ({
      ...visual,
      source: sources.find(({ id }) => id === visual.sourceId),
      rightsSource: sources.find(({ id }) => id === visual.rightsSourceId),
    })),
    sources: version.sourceIds.flatMap((sourceId) => {
      const source = sources.find(({ id }) => id === sourceId);
      return source ? [source] : [];
    }),
  };
}

export type ArticleAnnotatedDocument = ReturnType<typeof getAnnotatedDocumentsForArticle>[number];
