import { z } from "zod";
import {
  audienceIdSchema,
  contentTypeSchema,
  geographicScopeIdSchema,
  importanceSchema,
  journeyStageIdSchema,
  topicIdSchema,
} from "@/domain/taxonomy/taxonomy";
import type { OfficialSource } from "@/domain/source/source";

const stableIdSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const articleRelationshipTypeSchema = z.enum(["related", "prerequisite", "next-step"]);

export const articleRelationshipSchema = z.object({
  type: articleRelationshipTypeSchema,
  articleId: stableIdSchema,
});

export const articleMetadataSchema = z.object({
  id: stableIdSchema,
  title: z.string().min(1),
  description: z.string().min(1).max(180),
  slug: stableIdSchema,
  journeyStageIds: z.array(journeyStageIdSchema).min(1),
  topicIds: z.array(topicIdSchema).min(1),
  audienceIds: z.array(audienceIdSchema).default([]),
  geographicScopes: z.array(geographicScopeIdSchema).min(1),
  importance: importanceSchema,
  contentType: contentTypeSchema,
  sourceIds: z.array(stableIdSchema).default([]),
  relationships: z.array(articleRelationshipSchema).default([]),
  status: z.enum(["draft", "verified", "needs-review", "archived"]),
  createdAt: z.iso.date(),
  updatedAt: z.iso.date(),
  lastReviewedAt: z.iso.date().optional(),
});

export type ArticleMetadata = z.infer<typeof articleMetadataSchema>;

export function validateArticleCollection(
  articles: readonly ArticleMetadata[],
  sources: readonly OfficialSource[],
): void {
  const articleIds = new Set(articles.map((article) => article.id));
  const articleSlugs = new Set(articles.map((article) => article.slug));
  const sourceIds = new Set(sources.map((source) => source.id));

  if (articleIds.size !== articles.length) {
    throw new Error("Article IDs must be unique.");
  }

  if (articleSlugs.size !== articles.length) {
    throw new Error("Article slugs must be unique.");
  }

  if (sourceIds.size !== sources.length) {
    throw new Error("Source IDs must be unique.");
  }

  for (const article of articles) {
    for (const sourceId of article.sourceIds) {
      if (!sourceIds.has(sourceId)) {
        throw new Error(`Article \"${article.id}\" references unknown source \"${sourceId}\".`);
      }
    }

    for (const relationship of article.relationships) {
      if (relationship.articleId === article.id) {
        throw new Error(`Article \"${article.id}\" cannot relate to itself.`);
      }

      if (!articleIds.has(relationship.articleId)) {
        throw new Error(
          `Article \"${article.id}\" references unknown article \"${relationship.articleId}\".`,
        );
      }
    }
  }
}
