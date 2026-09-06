import type { ComponentType } from "react";
import GettingStarted, {
  metadata as rawGettingStartedMetadata,
} from "../../../content/articles/getting-started-with-nihonest.mdx";
import FindingOfficialInformation, {
  metadata as rawFindingOfficialInformationMetadata,
} from "../../../content/articles/finding-official-information.mdx";
import {
  articleMetadataSchema,
  validateArticleCollection,
  type ArticleMetadata,
} from "@/domain/article/article";
import { sources } from "@/data/sources";
import { residenceStatuses } from "@/data/residence-statuses";

export type ArticleRecord = Readonly<{
  metadata: ArticleMetadata;
  Content: ComponentType;
}>;

const articles: readonly ArticleRecord[] = [
  {
    metadata: articleMetadataSchema.parse(rawGettingStartedMetadata),
    Content: GettingStarted,
  },
  {
    metadata: articleMetadataSchema.parse(rawFindingOfficialInformationMetadata),
    Content: FindingOfficialInformation,
  },
];

validateArticleCollection(
  articles.map((article) => article.metadata),
  sources,
  residenceStatuses.map((status) => status.id),
);

export function getAllArticles(): readonly ArticleRecord[] {
  return articles;
}

export function getArticleBySlug(slug: string): ArticleRecord | undefined {
  return articles.find((article) => article.metadata.slug === slug);
}

export function getArticleById(id: string): ArticleRecord | undefined {
  return articles.find((article) => article.metadata.id === id);
}
