import { japaneseTermSchema } from "@/domain/glossary/glossary";

export function residenceStatusTerm({
  id,
  japanese,
  kana,
  romaji,
  englishName,
  articleId,
  sourceId,
  searchTerms,
  topicIds = ["immigration", "employment"],
}: {
  id: string;
  japanese: string;
  kana: string;
  romaji: string;
  englishName: string;
  articleId: string;
  sourceId: string;
  searchTerms: string[];
  topicIds?: ("immigration" | "employment")[];
}) {
  return japaneseTermSchema.parse({
    id,
    slug: id,
    japanese,
    kana,
    romaji,
    englishName,
    shortDefinition: `The Japanese status-of-residence category called ${englishName}.`,
    detailedExplanation: `This category authorizes only activities that fit the legal scope and the person's granted permission. The work, relationship, or official role must be assessed against current immigration requirements rather than the English label alone.`,
    commonContext: "Appears on immigration applications, landing records, residence cards, and employer or sponsor documentation.",
    topicIds,
    journeyStageIds: ["planning", "preparing", "living-in-japan"],
    relatedArticleIds: [articleId],
    relatedTermIds: ["zairyu-shikaku", "certificate-of-eligibility"],
    sourceIds: [sourceId, "immigration-services-status-appendix"],
    searchTerms,
    status: "draft",
  });
}

export function occupationalRouteTerm({
  id,
  japanese,
  kana,
  romaji,
  englishName,
  articleIds,
  relatedTermIds,
  sourceIds,
  searchTerms,
}: {
  id: string;
  japanese: string;
  kana: string;
  romaji: string;
  englishName: string;
  articleIds: string[];
  relatedTermIds: string[];
  sourceIds: string[];
  searchTerms: string[];
}) {
  return japaneseTermSchema.parse({
    id,
    slug: id,
    japanese,
    kana,
    romaji,
    englishName,
    shortDefinition: `An official field or occupational category used when assessing ${englishName} work under a defined residence route.`,
    detailedExplanation: "The field or category name is only the first routing step. The permitted duties, skill or experience standard, examinations, employer or organization conditions, and current implementation rules must still be checked for the applicable residence status.",
    commonContext: "Appears in immigration field lists, application guidance, employment planning, examinations, and comparisons between workforce routes.",
    topicIds: ["employment", "immigration"],
    primaryBrowseGroupId: "employment",
    journeyStageIds: ["planning", "preparing", "living-in-japan"],
    relatedArticleIds: articleIds,
    relatedTermIds,
    sourceIds,
    searchTerms,
    status: "needs-review",
  });
}
