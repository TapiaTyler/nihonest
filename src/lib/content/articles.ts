import type { ComponentType } from "react";
import Planning, { metadata as planning } from "../../../content/articles/planning-your-studies-in-japan.mdx";
import Visa, { metadata as visa } from "../../../content/articles/student-visa-and-certificate-of-eligibility.mdx";
import Preparing, { metadata as preparing } from "../../../content/articles/preparing-to-enter-japan.mdx";
import Documents, { metadata as documents } from "../../../content/articles/documents-received-when-entering-japan.mdx";
import Address, { metadata as address } from "../../../content/articles/registering-your-address-after-arrival.mdx";
import MyNumber, { metadata as myNumber } from "../../../content/articles/understanding-my-number.mdx";
import Insurance, { metadata as insurance } from "../../../content/articles/joining-national-health-insurance.mdx";
import Pension, { metadata as pension } from "../../../content/articles/national-pension-for-students.mdx";
import Housing, { metadata as housing } from "../../../content/articles/finding-housing-and-moving-in.mdx";
import Phone, { metadata as phone } from "../../../content/articles/getting-a-phone-number-in-japan.mdx";
import Banking, { metadata as banking } from "../../../content/articles/opening-a-bank-account-as-a-student.mdx";
import School, { metadata as school } from "../../../content/articles/completing-school-arrival-procedures.mdx";
import Work, { metadata as work } from "../../../content/articles/working-part-time-on-student-status.mdx";
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

const entries = [
  [planning, Planning], [visa, Visa], [preparing, Preparing], [documents, Documents],
  [address, Address], [myNumber, MyNumber], [insurance, Insurance], [pension, Pension],
  [housing, Housing], [phone, Phone], [banking, Banking], [school, School], [work, Work],
] as const;

const articles: readonly ArticleRecord[] = entries.map(([metadata, Content]) => ({
  metadata: articleMetadataSchema.parse(metadata),
  Content,
}));

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
