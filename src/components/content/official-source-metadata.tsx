"use client";

import type { OfficialSource } from "@/domain/source/source";
import { useInterfaceMessages } from "@/components/localization/interface-text";
import type { InterfaceMessageId } from "@/domain/localization/interface-messages";

const authorityMessageIds: Record<OfficialSource["authorityLevel"], InterfaceMessageId> = {
  "national-government": "sources.authority.national",
  "prefectural-government": "sources.authority.prefectural",
  "municipal-government": "sources.authority.municipal",
  "public-institution": "sources.authority.public",
};

type SourcePresentationMetadata = Pick<OfficialSource, "authorityLevel" | "language" | "lastCheckedAt" | "lastReviewedAt">;

export function OfficialSourceMetadata({ source }: Readonly<{ source: SourcePresentationMetadata }>) {
  const { locale, message } = useInterfaceMessages();
  const formatDate = (date: string) => new Intl.DateTimeFormat(locale === "ja" ? "ja-JP" : "en", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));

  return (
    <p className="mt-2 text-sm leading-6 text-slate-500">
      {message(authorityMessageIds[source.authorityLevel])} · {message(source.language === "en" ? "sources.language.english" : "sources.language.japanese")}
      {source.lastCheckedAt ? ` · ${message("sources.lastLinkCheck")}: ${formatDate(source.lastCheckedAt)}` : ""}
      {source.lastReviewedAt ? ` · ${message("sources.lastSubstantiveReview")}: ${formatDate(source.lastReviewedAt)}` : ""}
    </p>
  );
}
