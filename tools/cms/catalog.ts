/** Read-only projection of canonical articles for the local editorial workspace. */
import { readdir, readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { join, resolve } from "node:path";
import { runInNewContext } from "node:vm";
import { sources } from "@/data/sources";
import { currentJapaneseArticleTranslations } from "@/data/translations/ja/article-translations";
import { articleMetadataSchema, type ArticleMetadata } from "@/domain/article/article";
import { splitArticleSource, toPortableArticleMarkdown } from "@/domain/article/article-source";
import { articleComponentBlocks, parseArticleMarkdown, type ArticleBlock } from "@/domain/article/article-blocks";
import { articleSourceRevision } from "@/lib/content/content-bundle";

export type ArticleSummary = Readonly<{
  id: string;
  title: string;
  status: ArticleMetadata["status"];
  updatedAt: string;
  sourceCount: number;
  translation: "current" | "stale" | "missing";
  path: string;
  revision: string;
  editorialRevision: string;
  groups: readonly string[];
}>;

export type ArticleFailure = Readonly<{ path: string; error: string }>;
export type ArticleDetail = Readonly<{
  summary: ArticleSummary;
  metadata: ArticleMetadata;
  body: string;
  blocks: readonly ArticleBlock[];
  componentTags: typeof articleComponentBlocks;
  sources: readonly Readonly<{
    id: string; title: string; organization: string; url: string;
    language?: string; authorityLevel?: string; lastCheckedAt?: string; lastReviewedAt?: string;
  }>[];
  outboundRelationships: readonly Readonly<{ id: string; title: string; type: string }>[];
  inboundRelationships: readonly Readonly<{ id: string; title: string; type: string }>[];
}>;

export type ArticleCatalog = Readonly<{
  articles: readonly ArticleSummary[];
  failures: readonly ArticleFailure[];
  details: ReadonlyMap<string, ArticleDetail>;
}>;

const translationByArticle = new Map(currentJapaneseArticleTranslations.map((artifact) => [artifact.contentId, artifact]));
const sourceById = new Map(sources.map((source) => [source.id, source]));

/** Re-read files on each request so the workspace never displays a stale in-memory catalog. */
export async function readArticleCatalog(projectRoot: string): Promise<ArticleCatalog> {
  const articleDirectory = resolve(projectRoot, "content/articles");
  const filenames = (await readdir(articleDirectory)).filter((name) => name.endsWith(".mdx")).sort();
  const failures: ArticleFailure[] = [];
  const parsed: { metadata: ArticleMetadata; body: string; blocks: readonly ArticleBlock[]; summary: ArticleSummary }[] = [];

  for (const filename of filenames) {
    const relativePath = `content/articles/${filename}`;
    try {
      const content = await readFile(join(articleDirectory, filename), "utf8");
      const { metadataLiteral, body } = splitArticleSource(content);
      // This matches the existing bundle reader. Only repository-controlled metadata is evaluated.
      const metadata = articleMetadataSchema.parse(runInNewContext(`(${metadataLiteral})`, {}, { timeout: 1000 }));
      const blocks = parseArticleMarkdown(toPortableArticleMarkdown(body));
      const revision = articleSourceRevision(content);
      const artifact = translationByArticle.get(metadata.id);
      parsed.push({
        metadata,
        body,
        blocks,
        summary: {
          id: metadata.id,
          title: metadata.title,
          status: metadata.status,
          updatedAt: metadata.updatedAt,
          sourceCount: metadata.sourceIds.length,
          translation: !artifact ? "missing" : artifact.sourceRevision === revision ? "current" : "stale",
          path: relativePath,
          revision,
          editorialRevision: createHash("sha256").update(content.replaceAll("\r\n", "\n")).digest("hex"),
          groups: metadata.topicIds,
        },
      });
    } catch (error) {
      failures.push({ path: relativePath, error: error instanceof Error ? error.message : String(error) });
    }
  }

  const details = new Map<string, ArticleDetail>();
  const titleById = new Map(parsed.map(({ metadata }) => [metadata.id, metadata.title]));
  for (const { metadata, body, blocks, summary } of parsed) {
    if (details.has(metadata.id)) {
      failures.push({ path: summary.path, error: `Duplicate article ID: ${metadata.id}` });
      continue;
    }
    const inboundRelationships = parsed.flatMap(({ metadata: other }) => other.relationships
      .filter((relationship) => relationship.articleId === metadata.id)
      .map((relationship) => ({ id: other.id, title: other.title, type: relationship.type })));
    details.set(metadata.id, {
      summary,
      metadata,
      body,
      blocks,
      componentTags: articleComponentBlocks,
      sources: metadata.sourceIds.map((id) => sourceById.get(id) ?? { id, title: "Unknown source", organization: "", url: "" }),
      outboundRelationships: metadata.relationships.map((relationship) => ({
        id: relationship.articleId,
        title: titleById.get(relationship.articleId) ?? relationship.articleId,
        type: relationship.type,
      })),
      inboundRelationships,
    });
  }
  return {
    articles: [...details.values()].map(({ summary }) => summary).sort((a, b) => a.title.localeCompare(b.title, "en")),
    failures,
    details,
  };
}
