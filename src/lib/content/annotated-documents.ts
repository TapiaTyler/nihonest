import { annotatedDocumentFamilies } from "@/data/annotated-documents";
import { getAdministrativeGeography } from "@/data/geography";
import { japaneseAnnotatedDocumentTranslations } from "@/data/translations/ja/annotated-documents";
import { translationSourceFields } from "@/domain/translation/translation-source-fields";
import { createTranslationSourceRevision } from "@/lib/translation/source-revision";
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

/**
 * Current Japanese text for a family, path-keyed as in `translationSourceFields["annotated-document"]`. A stale or
 * incomplete artifact is left out, so the viewer shows canonical English instead of outdated Japanese.
 */
function japaneseDocumentFields(family: AnnotatedDocumentFamily): Readonly<Record<string, string>> | undefined {
  const artifact = japaneseAnnotatedDocumentTranslations.find(({ contentId }) => contentId === family.id);
  if (!artifact || artifact.availability !== "active") return undefined;
  const english = translationSourceFields["annotated-document"](family);
  if (artifact.sourceRevision !== createTranslationSourceRevision(english)) return undefined;
  return Object.keys(english).every((key) => artifact.fields[key]) ? artifact.fields : undefined;
}

function enrichDocumentFamily(family: AnnotatedDocumentFamily) {
  return {
    ...family,
    japanese: japaneseDocumentFields(family),
    versions: family.versions.map(enrichDocumentVersion),
    jurisdictionVariants: family.jurisdictionVariants.map((variant) => {
      const geography = supportedGeographies.find(({ id }) => id === variant.geographyId);
      const parentGeography = supportedGeographies.find(({ id }) => id === geography?.parentId);
      if (!geography || !parentGeography) throw new Error(`Missing geography hierarchy for document variant "${variant.id}".`);
      return {
        ...variant,
        geography: { ...geography, japaneseName: getAdministrativeGeography(geography.id)?.names.ja },
        parentGeography: { ...parentGeography, japaneseName: getAdministrativeGeography(parentGeography.id)?.names.ja },
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
