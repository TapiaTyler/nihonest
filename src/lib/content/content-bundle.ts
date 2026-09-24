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
import { parseArticleMarkdown } from "@/domain/article/article-blocks";
import { articleMetadataSchema } from "@/domain/article/article";
import { splitArticleSource, toPortableArticleMarkdown } from "@/domain/article/article-source";
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
  const entries: readonly [Omit<ContentBundleFile, "checksum" | "records">, readonly unknown[]][] = [
    [{ path: "articles.en.json", kind: "articles", locale: "en" }, articles.map(({ article }) => article)],
    [{ path: "article-translations.ja.json", kind: "article-translations", locale: "ja" }, currentArticleTranslations(articles)],
    [{ path: "glossary.en.json", kind: "catalog", locale: "en" }, glossaryTerms],
    [{ path: "faqs.en.json", kind: "catalog", locale: "en" }, faqs],
    [{ path: "sources.en.json", kind: "catalog", locale: "en" }, sources],
    [{ path: "residence-statuses.en.json", kind: "catalog", locale: "en" }, residenceStatuses],
    [{ path: "article-groups.en.json", kind: "catalog", locale: "en" }, articleGroups],
    [{ path: "journeys.en.json", kind: "catalog", locale: "en" }, guidedJourneys],
  ];

  const files = new Map<string, string>();
  const manifestFiles: ContentBundleFile[] = entries.map(([file, records]) => {
    const json = `${JSON.stringify(records)}\n`;
    files.set(file.path, json);
    return { ...file, records: records.length, checksum: sha256(json) };
  });
  const manifest = contentBundleManifestSchema.parse({
    formatVersion: contentBundleFormatVersion,
    catalogVersion: sha256(manifestFiles.map(({ path, checksum }) => `${path}:${checksum}`).join("\n")),
    generatedAt: options.generatedAt,
    files: manifestFiles,
  });
  return { manifest, files };
}
