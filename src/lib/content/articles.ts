import type { ComponentType } from "react";
import Planning, { metadata as planning } from "../../../content/articles/planning-your-studies-in-japan.mdx";
import ShortTermStudy, { metadata as shortTermStudy } from "../../../content/articles/short-term-study-in-japan.mdx";
import Visa, { metadata as visa } from "../../../content/articles/student-visa-and-certificate-of-eligibility.mdx";
import Preparing, { metadata as preparing } from "../../../content/articles/preparing-to-enter-japan.mdx";
import Documents, { metadata as documents } from "../../../content/articles/documents-received-when-entering-japan.mdx";
import Address, { metadata as address } from "../../../content/articles/registering-your-address-after-arrival.mdx";
import MyNumber, { metadata as myNumber } from "../../../content/articles/understanding-my-number.mdx";
import Insurance, { metadata as insurance } from "../../../content/articles/joining-national-health-insurance.mdx";
import Pension, { metadata as pension } from "../../../content/articles/national-pension-after-moving-to-japan.mdx";
import Housing, { metadata as housing } from "../../../content/articles/finding-housing-and-moving-in.mdx";
import Phone, { metadata as phone } from "../../../content/articles/getting-a-phone-number-in-japan.mdx";
import Banking, { metadata as banking } from "../../../content/articles/opening-a-bank-account-after-moving-to-japan.mdx";
import School, { metadata as school } from "../../../content/articles/completing-school-arrival-procedures.mdx";
import Work, { metadata as work } from "../../../content/articles/working-part-time-on-student-status.mdx";
import CulturalActivities, { metadata as culturalActivities } from "../../../content/articles/cultural-activities-visa.mdx";
import Training, { metadata as training } from "../../../content/articles/training-visa.mdx";
import DependentVisa, { metadata as dependentVisa } from "../../../content/articles/dependent-family-stay-visa.mdx";
import Startup, { metadata as startup } from "../../../content/articles/startup-visa.mdx";
import Diplomatic, { metadata as diplomatic } from "../../../content/articles/diplomatic-visa.mdx";
import Official, { metadata as official } from "../../../content/articles/official-visa.mdx";
import {
  articleMetadataSchema,
  validateArticleCollection,
  type ArticleMetadata,
} from "@/domain/article/article";
import { sources } from "@/data/sources";
import { residenceStatuses } from "@/data/residence-statuses";
import { articleGroups, guidedJourneys } from "@/data/discovery";
import { validateDiscoveryModel } from "@/domain/discovery/discovery";
import { glossaryTerms } from "@/data/glossary";
import { validateGlossaryCollection } from "@/domain/glossary/glossary";

export type ArticleRecord = Readonly<{
  metadata: ArticleMetadata;
  Content: ComponentType;
}>;

const entries = [
  [planning, Planning], [shortTermStudy, ShortTermStudy], [visa, Visa], [preparing, Preparing], [documents, Documents],
  [address, Address], [myNumber, MyNumber], [insurance, Insurance], [pension, Pension],
  [housing, Housing], [phone, Phone], [banking, Banking], [school, School], [work, Work],
  [culturalActivities, CulturalActivities], [training, Training], [dependentVisa, DependentVisa],
  [startup, Startup], [diplomatic, Diplomatic], [official, Official],
] as const;

const articles: readonly ArticleRecord[] = entries.map(([metadata, Content]) => ({
  metadata: articleMetadataSchema.parse(metadata),
  Content,
}));

validateArticleCollection(
  articles.map((article) => article.metadata),
  sources,
  residenceStatuses.map((status) => status.id),
  glossaryTerms.map((term) => term.id),
);
validateGlossaryCollection(
  glossaryTerms,
  sources,
  articles.map(({ metadata }) => metadata.id),
);
validateDiscoveryModel(
  articleGroups,
  guidedJourneys,
  articles.map(({ metadata }) => metadata.id),
);

export function getAllArticles(): readonly ArticleRecord[] {
  return articles;
}

function resolveArticleIds(articleIds: readonly string[]) {
  return articleIds.flatMap((articleId) => {
    const article = getArticleById(articleId);
    return article ? [article] : [];
  });
}

export function getArticlesByGroup(groupId: string) {
  const group = articleGroups.find(({ id }) => id === groupId);
  return group ? resolveArticleIds(group.articleIds) : [];
}

export function getArticlesByJourney(journeyId: string) {
  const journey = guidedJourneys.find(({ id }) => id === journeyId);
  return journey ? resolveArticleIds(journey.steps.map(({ articleId }) => articleId)) : [];
}

export function getJourneySteps(journeyId: string) {
  const journey = guidedJourneys.find(({ id }) => id === journeyId);
  if (!journey) return [];

  return journey.steps.flatMap((step) => {
    const article = getArticleById(step.articleId);
    return article ? [{ step, article }] : [];
  });
}

export function getArticleBySlug(slug: string): ArticleRecord | undefined {
  return articles.find((article) => article.metadata.slug === slug);
}

export function getArticleById(id: string): ArticleRecord | undefined {
  return articles.find((article) => article.metadata.id === id);
}
