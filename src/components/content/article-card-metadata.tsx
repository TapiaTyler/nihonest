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
export function ArticleCardBadges({ status, topicIds }: Pick<ArticleMetadata, "status" | "topicIds">) {
  const { locale, message } = useInterfaceMessages();
  const topicSeparator = locale === "ja" ? "・" : " · ";

  return (
    <div lang={locale} className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide">
      <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-800">
        {message(articleStatusMessage[status])}
      </span>
      <span className="text-teal-700">
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
      <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-800">{message(articleStatusMessage[status])}</span>
      {topicIds.map((id) => <span key={id} className="rounded-full bg-teal-50 px-3 py-1 text-teal-800">{topicLabel(id, locale)}</span>)}
    </div>
  );
}

export function ArticleHeaderStages({ journeyStageIds }: Pick<ArticleMetadata, "journeyStageIds">) {
  const { locale, message } = useInterfaceMessages();
  return (
    <p lang={locale} className="mt-5 text-sm text-slate-500">
      {message("article.journeyStages")} {journeyStageIds.map((id) => journeyStageLabel(id, locale)).join(locale === "ja" ? "、" : ", ")}
    </p>
  );
}

export function ArticleCardRelevance({ journeyStageIds }: Pick<ArticleMetadata, "journeyStageIds">) {
  const { locale, message } = useInterfaceMessages();
  const stageSeparator = locale === "ja" ? "、" : ", ";
  return (
    <p lang={locale} className="text-slate-500">
      {message("article.relevantTo")} {journeyStageIds.map((id) => journeyStageLabel(id, locale)).join(stageSeparator)}
    </p>
  );
}
