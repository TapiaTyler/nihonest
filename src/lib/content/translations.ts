import { japaneseActivityTranslations } from "@/data/translations/ja/activity-translations";
import { japaneseArticleTranslations } from "@/data/translations/ja/article-translations";
import { japaneseArticleGroupTranslations } from "@/data/translations/ja/article-group-translations";
import { japaneseFaqTranslations } from "@/data/translations/ja/faq-translations";
import { japaneseGlossaryTranslations } from "@/data/translations/ja/glossary-translations";
import { japaneseJourneyTranslations } from "@/data/translations/ja/journey-translations";
import { japaneseResidenceStatusGuidanceTranslations } from "@/data/translations/ja/residence-status-guidance-translations";
import { japaneseResidenceStatusTranslations } from "@/data/translations/ja/residence-status-translations";
import type { JourneyTranslation } from "@/domain/localization/journey-presentation";
import type { ContentLocalePreference } from "@/domain/localization/content-locale";
import type { TranslationArtifact } from "@/domain/translation/translation";
import type { ArticleGroupSearchTranslation, ArticleSearchTranslation } from "@/lib/search/knowledgebase-search";
import type { FaqSearchTranslation } from "@/lib/search/faq-search";
import type { GlossarySearchTranslation } from "@/lib/search/glossary-search";

export type ResidenceStatusTranslation = Readonly<{
  contentId: string;
  targetLocale: string;
  summary: string;
  purpose: string;
  typicalActivities: readonly string[];
  examples: readonly string[];
  considerations: readonly string[];
}>;

type JourneyRouteTranslation = JourneyTranslation["routes"][number];
type JourneyPhaseTranslation = JourneyTranslation["phases"][number];
type JourneyConditionTranslation = JourneyTranslation["conditions"][number];

export function getActiveTranslations(artifacts: readonly TranslationArtifact[]) {
  return artifacts.filter(({ availability }) => availability === "active");
}

export function getArticleTranslation(contentId: string, locale: ContentLocalePreference) {
  if (locale === "en") return undefined;
  return getActiveTranslations(japaneseArticleTranslations).find((artifact) => (
    artifact.contentId === contentId
    && artifact.targetLocale === locale
  ));
}

export function getJapaneseArticleTranslation(contentId: string) {
  return getArticleTranslation(contentId, "ja");
}

export function getArticleSearchTranslations(): readonly ArticleSearchTranslation[] {
  return getActiveTranslations(japaneseArticleTranslations).map((artifact) => ({
    contentId: artifact.contentId,
    targetLocale: artifact.targetLocale,
    title: artifact.fields.title ?? "",
    description: artifact.fields.description ?? "",
  })).filter(({ title, description }) => Boolean(title && description));
}

export function getArticleGroupSearchTranslations(): readonly ArticleGroupSearchTranslation[] {
  return getActiveTranslations(japaneseArticleGroupTranslations).map((artifact) => ({
    contentId: artifact.contentId,
    targetLocale: artifact.targetLocale,
    title: artifact.fields.title ?? "",
    description: artifact.fields.description ?? "",
  })).filter(({ title, description }) => Boolean(title && description));
}

export function getFaqSearchTranslations(): readonly FaqSearchTranslation[] {
  return getActiveTranslations(japaneseFaqTranslations).map((artifact) => ({
    contentId: artifact.contentId,
    targetLocale: artifact.targetLocale,
    question: artifact.fields.question ?? "",
    summary: artifact.fields.summary ?? "",
  })).filter(({ question, summary }) => Boolean(question && summary));
}

export function getGlossarySearchTranslations(): readonly GlossarySearchTranslation[] {
  return getActiveTranslations(japaneseGlossaryTranslations).map((artifact) => ({
    contentId: artifact.contentId,
    targetLocale: artifact.targetLocale,
    shortDefinition: artifact.fields["short-definition"] ?? "",
    detailedExplanation: artifact.fields["detailed-explanation"] ?? "",
    commonContext: artifact.fields["common-context"] ?? "",
  })).filter(({ shortDefinition, detailedExplanation, commonContext }) => (
    Boolean(shortDefinition && detailedExplanation && commonContext)
  ));
}

function parseStringArray(value?: string): readonly string[] {
  if (!value) return [];
  const parsed: unknown = JSON.parse(value);
  if (!Array.isArray(parsed) || parsed.some((item) => typeof item !== "string")) {
    throw new Error("Structured translation field must contain a JSON string array.");
  }
  return parsed;
}

function parseStructuredArray<T>(value: string | undefined, label: string): readonly T[] {
  if (!value) return [];
  const parsed: unknown = JSON.parse(value);
  if (!Array.isArray(parsed)) throw new Error(`${label} translation field must contain a JSON array.`);
  return parsed as readonly T[];
}

export function getResidenceStatusTranslations(): readonly ResidenceStatusTranslation[] {
  return getActiveTranslations(japaneseResidenceStatusTranslations).map((artifact) => ({
    contentId: artifact.contentId,
    targetLocale: artifact.targetLocale,
    summary: artifact.fields.summary ?? "",
    purpose: artifact.fields.purpose ?? "",
    typicalActivities: parseStringArray(artifact.fields["typical-activities"]),
    examples: parseStringArray(artifact.fields.examples),
    considerations: parseStringArray(artifact.fields.considerations),
  })).filter(({ summary, purpose }) => Boolean(summary && purpose));
}

/** Path-keyed Japanese overlay for one status's structured guidance, or undefined when none is active. */
export function getResidenceStatusGuidanceTranslation(contentId: string): Readonly<Record<string, string>> | undefined {
  return getActiveTranslations(japaneseResidenceStatusGuidanceTranslations).find((artifact) => artifact.contentId === contentId)?.fields;
}

/** Path-keyed Japanese overlays for "Can I do this?" activities, keyed by activity ID. */
export function getActivityTranslations(): Readonly<Record<string, Readonly<Record<string, string>>>> {
  return Object.fromEntries(getActiveTranslations(japaneseActivityTranslations).map((artifact) => [artifact.contentId, artifact.fields]));
}

export function getJourneyTranslations(): readonly JourneyTranslation[] {
  return getActiveTranslations(japaneseJourneyTranslations).map((artifact) => ({
    contentId: artifact.contentId,
    targetLocale: artifact.targetLocale,
    title: artifact.fields.title ?? "",
    description: artifact.fields.description ?? "",
    introduction: artifact.fields.introduction ?? "",
    routes: parseStructuredArray<JourneyRouteTranslation>(artifact.fields.routes, "Journey routes"),
    phases: parseStructuredArray<JourneyPhaseTranslation>(artifact.fields.phases, "Journey phases"),
    conditions: parseStructuredArray<JourneyConditionTranslation>(artifact.fields.conditions, "Journey conditions"),
  })).filter(({ title, description, introduction }) => Boolean(title && description && introduction));
}
