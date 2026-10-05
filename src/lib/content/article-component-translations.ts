import { japaneseArticleComponentTranslations } from "@/data/translations/ja/article-components";
import { areArticleComponentTranslationFieldsValid } from "@/domain/translation/article-component-translation-fields";
import type { TranslationArtifact } from "@/domain/translation/translation";
import { translationSourceFields, type ArticleComponentSource } from "@/domain/translation/translation-source-fields";
import { createTranslationSourceRevision } from "@/lib/translation/source-revision";

export type ArticleComponentTranslationFields = Readonly<Record<string, string>>;

/**
 * Current Japanese fields for a shared article component, or undefined to render the whole component in English.
 * Applies only an active artifact whose revision matches the English and whose every field is present and valid.
 * Values are returned exactly as stored (no trimming), so suffix spacing and punctuation survive.
 */
export function selectArticleComponentTranslation(
  component: ArticleComponentSource,
  artifacts: readonly TranslationArtifact[] = japaneseArticleComponentTranslations,
): ArticleComponentTranslationFields | undefined {
  const revision = createTranslationSourceRevision(translationSourceFields["article-component"](component));
  const artifact = artifacts.find((candidate) => candidate.availability === "active" && candidate.contentKind === "article-component"
    && candidate.contentId === component.kind && candidate.targetLocale === "ja");
  if (!artifact || artifact.sourceRevision !== revision || !areArticleComponentTranslationFieldsValid(component, artifact.fields)) return undefined;
  return artifact.fields;
}
