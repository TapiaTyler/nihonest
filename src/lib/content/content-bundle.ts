import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { runInNewContext } from "node:vm";
import { articleGroups, guidedJourneys } from "@/data/discovery";
import { faqs } from "@/data/faqs";
import { glossaryTerms } from "@/data/glossary";
import { residenceStatuses } from "@/data/residence-statuses";
import { sources } from "@/data/sources";
import { currentJapaneseArticleTranslations } from "@/data/translations/ja/article-translations";
import { japaneseFaqTranslations } from "@/data/translations/ja/faq-translations";
import { japaneseGlossaryTranslations } from "@/data/translations/ja/glossary-translations";
import { japaneseResidenceStatusTranslations } from "@/data/translations/ja/residence-status-translations";
import { translationSourceFields } from "@/domain/translation/translation-source-fields";
import { createTranslationSourceRevision } from "@/lib/translation/source-revision-core";
import { selectCurrentBundleTranslations, selectCurrentGeneralAdviceTranslations, selectCurrentStatusGuidanceTranslations,
  selectCurrentAnnotatedDocumentTranslations } from "./content-bundle-translations";
import { annotatedDocumentFamilies } from "@/data/annotated-documents";
import { japaneseAnnotatedDocumentTranslations } from "@/data/translations/ja/annotated-documents";
import { activityCrossReferences } from "@/data/activity-cross-references";
import { japaneseActivityTranslations } from "@/data/translations/ja/activity-translations";
import { extractActivityText } from "@/domain/activity-cross-reference/activity-text";
import { japaneseResidenceStatusGuidanceTranslations } from "@/data/translations/ja/residence-status-guidance-translations";
import { japaneseArticleGroupTranslations } from "@/data/translations/ja/article-group-translations";
import { japaneseJourneyTranslations } from "@/data/translations/ja/journey-translations";
import { bundledGroupSourceFields, bundledJourneySourceFields } from "@/domain/content-bundle/discovery-payloads";
import { localGuidanceSupplements, supportedGeographies } from "@/data/local-guidance";
import { generalLocalAdvice } from "@/data/local-guidance/general-advice";
import { japaneseLocalGuidanceTranslations } from "@/data/translations/ja/local-guidance";
import { japaneseGeneralLocalAdviceTranslations } from "@/data/translations/ja/local-guidance-general-advice";
import { parseArticleMarkdown } from "@/domain/article/article-blocks";
import { articleMetadataSchema } from "@/domain/article/article";
import { splitArticleSource, toPortableArticleMarkdown } from "@/domain/article/article-source";
import { contentBundleVersionInput, validateContentBundlePayload, verifyContentBundle } from "@/domain/content-bundle/content-bundle-integrity";
import {
  bundledArticleSchema,
  bundledArticleTranslationSchema,
  contentBundleFormatVersion,
  contentBundleManifestSchema,
  type BundledArticle,
  type BundledArticleTranslation,
  type ContentBundleFile,
  type ContentBundleManifest,
} from "@/domain/content-bundle/content-bundle";

/**
 * Builds the public content bundle described in `src/domain/content-bundle/content-bundle.ts` from the canonical
 * repository sources. Node-only: it reads article MDX as text instead of compiling it.
 */

const sha256 = (text: string) => createHash("sha256").update(text, "utf8").digest("hex");

/** Same revision as `npm run localization:audit`: the hash of the whole normalized MDX source. */
export function articleSourceRevision(source: string): string {
  return sha256(JSON.stringify({ source: source.replace(/\r\n?/g, "\n") }));
}

export type CanonicalArticleSource = Readonly<{ article: BundledArticle; sourceRevision: string }>;

/**
 * Reads every article in `directory`. The metadata literal is repository-controlled content, evaluated in an
 * empty VM context and then validated by the article schema.
 */
export async function readCanonicalArticleSources(directory: string): Promise<CanonicalArticleSource[]> {
  const files = (await readdir(directory)).filter((name) => name.endsWith(".mdx")).sort();
  const articles = await Promise.all(files.map(async (file) => {
    const source = await readFile(join(directory, file), "utf8");
    try {
      const { metadataLiteral, body } = splitArticleSource(source);
      const metadata = articleMetadataSchema.parse(runInNewContext(`(${metadataLiteral})`, {}, { timeout: 1000 }));
      const article = bundledArticleSchema.parse({ metadata, blocks: parseArticleMarkdown(toPortableArticleMarkdown(body)) });
      return { article, sourceRevision: articleSourceRevision(source) };
    } catch (error) {
      throw new Error(`${file}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }));
  return articles.sort((left, right) => left.article.metadata.id.localeCompare(right.article.metadata.id, "en"));
}

/** Japanese translations whose source revision still matches the English article; stale ones are left out. */
export function currentArticleTranslations(articles: readonly CanonicalArticleSource[]): BundledArticleTranslation[] {
  const revisions = new Map(articles.map(({ article, sourceRevision }) => [article.metadata.id, sourceRevision]));
  return currentJapaneseArticleTranslations
    .filter((artifact) => revisions.get(artifact.contentId) === artifact.sourceRevision)
    .map((artifact) => bundledArticleTranslationSchema.parse({
      articleId: artifact.contentId,
      sourceRevision: artifact.sourceRevision,
      reviewState: artifact.reviewState,
      title: artifact.fields.title,
      description: artifact.fields.description,
      blocks: parseArticleMarkdown(artifact.fields.body ?? ""),
    }))
    .sort((left, right) => left.articleId.localeCompare(right.articleId, "en"));
}

export type ContentBundle = Readonly<{ manifest: ContentBundleManifest; files: ReadonlyMap<string, string> }>;

export async function buildContentBundle(options: Readonly<{ articleDirectory: string; generatedAt: string }>): Promise<ContentBundle> {
  const articles = await readCanonicalArticleSources(options.articleDirectory);
  const advice = Object.entries(generalLocalAdvice).map(([id, value]) => ({ id, kind: "general-lookup-prompts" as const, ...value }));
  const currentAdviceTranslations = selectCurrentGeneralAdviceTranslations(japaneseGeneralLocalAdviceTranslations, advice);
  const entries: readonly [Omit<ContentBundleFile, "checksum" | "records">, readonly unknown[]][] = [
    [{ path: "articles.en.json", kind: "articles", locale: "en" }, articles.map(({ article }) => article)],
    [{ path: "article-translations.ja.json", kind: "article-translations", locale: "ja" }, currentArticleTranslations(articles)],
    [{ path: "glossary.en.json", kind: "catalog", locale: "en" }, glossaryTerms],
    [{ path: "faqs.en.json", kind: "catalog", locale: "en" }, faqs],
    [{ path: "sources.en.json", kind: "catalog", locale: "en" }, sources],
    [{ path: "residence-statuses.en.json", kind: "catalog", locale: "en" }, residenceStatuses],
    [{ path: "article-groups.en.json", kind: "catalog", locale: "en" }, articleGroups],
    [{ path: "journeys.en.json", kind: "catalog", locale: "en" }, guidedJourneys],
    [{ path: "faq-translations.ja.json", kind: "catalog-translations", locale: "ja" }, selectCurrentBundleTranslations(japaneseFaqTranslations,
      new Map(faqs.map((faq) => [faq.id, createTranslationSourceRevision(translationSourceFields.faq(faq))])))],
    [{ path: "glossary-translations.ja.json", kind: "catalog-translations", locale: "ja" }, selectCurrentBundleTranslations(japaneseGlossaryTranslations,
      new Map(glossaryTerms.map((term) => [term.id, createTranslationSourceRevision(translationSourceFields["glossary-term"](term))])))],
    [{ path: "residence-status-translations.ja.json", kind: "catalog-translations", locale: "ja" }, selectCurrentBundleTranslations(japaneseResidenceStatusTranslations,
      new Map(residenceStatuses.map((status) => [status.id, createTranslationSourceRevision(translationSourceFields["residence-status"](status))])))],
    [{ path: "local-guidance.en.json", kind: "catalog", locale: "en" }, localGuidanceSupplements],
    [{ path: "supported-geographies.en.json", kind: "catalog", locale: "en" }, supportedGeographies],
    [{ path: "general-local-advice.en.json", kind: "catalog", locale: "en" }, advice],
    [{ path: "local-guidance-translations.ja.json", kind: "catalog-translations", locale: "ja" }, selectCurrentBundleTranslations(japaneseLocalGuidanceTranslations,
      new Map(localGuidanceSupplements.map((record) => [record.id, createTranslationSourceRevision(translationSourceFields["local-guidance-supplement"](record))])))],
    [{ path: "general-local-advice-translations.ja.json", kind: "catalog-translations", locale: "ja" }, currentAdviceTranslations],
    [{ path: "residence-status-guidance-translations.ja.json", kind: "catalog-translations", locale: "ja" },
      selectCurrentStatusGuidanceTranslations(japaneseResidenceStatusGuidanceTranslations, residenceStatuses)],
    [{ path: "article-group-translations.ja.json", kind: "catalog-translations", locale: "ja" }, selectCurrentBundleTranslations(japaneseArticleGroupTranslations,
      new Map(articleGroups.map((record) => [record.id, createTranslationSourceRevision(bundledGroupSourceFields(record))])))],
    [{ path: "journey-translations.ja.json", kind: "catalog-translations", locale: "ja" }, selectCurrentBundleTranslations(japaneseJourneyTranslations,
      new Map(guidedJourneys.map((record) => [record.id, createTranslationSourceRevision(bundledJourneySourceFields(record))])))],
    [{ path: "annotated-documents.en.json", kind: "catalog", locale: "en" }, annotatedDocumentFamilies],
    [{ path: "annotated-document-translations.ja.json", kind: "catalog-translations", locale: "ja" },
      selectCurrentAnnotatedDocumentTranslations(japaneseAnnotatedDocumentTranslations, annotatedDocumentFamilies)],
    [{ path: "activity-cross-references.en.json", kind: "catalog", locale: "en" }, activityCrossReferences],
    [{ path: "activity-translations.ja.json", kind: "catalog-translations", locale: "ja" }, selectCurrentBundleTranslations(japaneseActivityTranslations,
      new Map(activityCrossReferences.map((record) => [record.id, createTranslationSourceRevision(extractActivityText(record))])))],
  ];

  const files = new Map<string, string>();
  const manifestFiles: ContentBundleFile[] = entries.map(([file, records]) => {
    validateContentBundlePayload(file, records);
    const json = `${JSON.stringify(records)}\n`;
    files.set(file.path, json);
    return { ...file, records: records.length, checksum: sha256(json) };
  });
  const manifest = contentBundleManifestSchema.parse({
    formatVersion: contentBundleFormatVersion,
    catalogVersion: sha256(contentBundleVersionInput(manifestFiles)),
    generatedAt: options.generatedAt,
    files: manifestFiles,
  });
  verifyContentBundle(manifest, files, sha256);
  return { manifest, files };
}
