import { japaneseTermSchema } from "@/domain/glossary/glossary";

/** Status each builder applies when a term omits it. The local CMS reads these to project records. */
export const glossaryBuilderDefaultStatus = { residenceStatusTerm: "draft", occupationalRouteTerm: "needs-review" } as const;

export function residenceStatusTerm({
  id,
  japanese,
  kana,
  romaji,
  englishName,
  shortDefinition,
  detailedExplanation,
  commonContext,
  articleId,
  sourceId,
  searchTerms,
  status = glossaryBuilderDefaultStatus.residenceStatusTerm,
  lastReviewedAt,
  topicIds = ["immigration", "employment"],
}: {
  id: string;
  japanese: string;
  kana: string;
  romaji: string;
  englishName: string;
  shortDefinition?: string;
  detailedExplanation?: string;
  commonContext?: string;
  articleId: string;
  sourceId: string;
  searchTerms: string[];
  status?: "draft" | "needs-review" | "verified";
  lastReviewedAt?: string;
  topicIds?: ("immigration" | "employment")[];
}) {
  return japaneseTermSchema.parse({
    id,
    slug: id,
    japanese,
    kana,
    romaji,
    englishName,
    shortDefinition: shortDefinition ?? `The Japanese status-of-residence category called ${englishName}.`,
    detailedExplanation: detailedExplanation ?? `This category authorizes only activities that fit the legal scope and the person's granted permission. The work, relationship, or official role must be assessed against current immigration requirements rather than the English label alone.`,
    commonContext: commonContext ?? "Appears on immigration applications, landing records, residence cards, and employer or sponsor documentation.",
    topicIds,
    journeyStageIds: ["planning", "preparing", "living-in-japan"],
    relatedArticleIds: [articleId],
    relatedTermIds: ["zairyu-shikaku", "certificate-of-eligibility"],
    sourceIds: [sourceId, "immigration-services-status-appendix"],
    searchTerms,
    status,
    ...(lastReviewedAt ? { lastReviewedAt } : {}),
  });
}

export function occupationalRouteTerm({
  id,
  japanese,
  kana,
  romaji,
  englishName,
  shortDefinition,
  detailedExplanation,
  commonContext,
  articleIds,
  relatedTermIds,
  sourceIds,
  searchTerms,
  status = glossaryBuilderDefaultStatus.occupationalRouteTerm,
  lastReviewedAt,
}: {
  id: string;
  japanese: string;
  kana: string;
  romaji: string;
  englishName: string;
  shortDefinition?: string;
  detailedExplanation?: string;
  commonContext?: string;
  articleIds: string[];
  relatedTermIds: string[];
  sourceIds: string[];
  searchTerms: string[];
  status?: "draft" | "needs-review" | "verified";
  lastReviewedAt?: string;
}) {
  return japaneseTermSchema.parse({
    id,
    slug: id,
    japanese,
    kana,
    romaji,
    englishName,
    shortDefinition: shortDefinition ?? `An official field or occupational category used when assessing ${englishName} work under a defined residence route.`,
    detailedExplanation: detailedExplanation ?? "The field or category name is only the first routing step. The permitted duties, skill or experience standard, examinations, employer or organization conditions, and current implementation rules must still be checked for the applicable residence status.",
    commonContext: commonContext ?? "Appears in immigration field lists, application guidance, employment planning, examinations, and comparisons between workforce routes.",
    topicIds: ["employment", "immigration"],
    primaryBrowseGroupId: "employment",
    journeyStageIds: ["planning", "preparing", "living-in-japan"],
    relatedArticleIds: articleIds,
    relatedTermIds,
    sourceIds,
    searchTerms,
    status,
    ...(lastReviewedAt ? { lastReviewedAt } : {}),
  });
}
