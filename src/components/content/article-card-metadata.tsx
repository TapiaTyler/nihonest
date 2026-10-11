"use client";

import type { ArticleMetadata } from "@/domain/article/article";
import type { InterfaceMessageId } from "@/domain/localization/interface-messages";
import type { JourneyStageId, TopicId } from "@/domain/taxonomy/taxonomy";
import { japaneseTaxonomyLabels } from "@/data/translations/ja/taxonomy-labels";
import { useInterfaceMessages } from "@/components/localization/interface-text";
import { journeyStages, topics } from "@/domain/taxonomy/taxonomy";

const articleStatusMessage: Record<ArticleMetadata["status"], InterfaceMessageId> = {
  draft: "article.statusDraft",
  verified: "article.statusReviewed",
  "needs-review": "article.statusEditorial",
  archived: "article.statusArchived",
};

function topicLabel(id: TopicId, locale: "en" | "ja") {
  if (locale === "ja") return japaneseTaxonomyLabels.topic[id];
  return topics.find((topic) => topic.id === id)?.label ?? id;
}

function journeyStageLabel(id: JourneyStageId, locale: "en" | "ja") {
  if (locale === "ja") return japaneseTaxonomyLabels.journeyStage[id];
  return journeyStages.find((stage) => stage.id === id)?.label ?? id;
}

/** Pass only the labels' canonical IDs across the server/client boundary. */
export function ArticleCardBadges({ status, topicIds, stacked = false }: Pick<ArticleMetadata, "status" | "topicIds"> & Readonly<{
  /** List rows stack the status above the topics in their details column. */
  stacked?: boolean;
}>) {
  const { locale, message } = useInterfaceMessages();
  const topicSeparator = locale === "ja" ? "・" : " · ";

  return (
    <div lang={locale} className={`flex text-xs font-semibold uppercase tracking-wide ${stacked ? "flex-col items-start gap-1.5 sm:items-end sm:text-right" : "flex-wrap items-center gap-2"}`}>
      <span className="rounded-full bg-caution-soft px-3 py-1 text-caution-text">
        {message(articleStatusMessage[status])}
      </span>
      <span className="text-brand-accent">
        {topicIds.map((id) => topicLabel(id, locale)).join(topicSeparator)}
      </span>
    </div>
  );
}

/** Article-page header pills: editorial status and one pill per topic. */
export function ArticleHeaderBadges({ status, topicIds }: Pick<ArticleMetadata, "status" | "topicIds">) {
  const { locale, message } = useInterfaceMessages();
  return (
    <div lang={locale} className="flex flex-wrap gap-2 pr-14 text-xs font-semibold uppercase tracking-wide">
      <span className="rounded-full bg-caution-soft px-3 py-1 text-caution-text">{message(articleStatusMessage[status])}</span>
      {topicIds.map((id) => <span key={id} className="rounded-full bg-brand-soft px-3 py-1 text-brand-link">{topicLabel(id, locale)}</span>)}
    </div>
  );
}

export function ArticleHeaderStages({ journeyStageIds }: Pick<ArticleMetadata, "journeyStageIds">) {
  const { locale, message } = useInterfaceMessages();
  return (
    <p lang={locale} className="mt-5 text-sm text-ink-subtle">
      {message("article.journeyStages")} {journeyStageIds.map((id) => journeyStageLabel(id, locale)).join(locale === "ja" ? "、" : ", ")}
    </p>
  );
}

export function ArticleCardRelevance({ journeyStageIds }: Pick<ArticleMetadata, "journeyStageIds">) {
  const { locale, message } = useInterfaceMessages();
  const stageSeparator = locale === "ja" ? "、" : ", ";
  return (
    <p lang={locale} className="text-ink-subtle">
      {message("article.relevantTo")} {journeyStageIds.map((id) => journeyStageLabel(id, locale)).join(stageSeparator)}
    </p>
  );
}
