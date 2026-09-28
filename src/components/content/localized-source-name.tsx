"use client";

import { useInterfaceMessages } from "@/components/localization/interface-text";
import type { OfficialSource } from "@/domain/source/source";

type NamedSource = Pick<OfficialSource, "title" | "organization" | "japaneseTitle" | "japaneseOrganization">;

/** A source's title or organization in the reader's language: Japanese where recorded, otherwise English marked as English. */
export function sourceNameParts(source: NamedSource, locale: string) {
  const japanese = locale === "ja";
  const part = (english: string, translated: string | undefined) => (
    japanese ? (translated ? { text: translated, lang: "ja" } : { text: english, lang: "en" }) : { text: english, lang: undefined }
  );
  return { title: part(source.title, source.japaneseTitle), organization: part(source.organization, source.japaneseOrganization) };
}

/** "Title — Organization" (`title-first`) or "Organization: Title" (`organization-first`) in the reader's language. */
export function LocalizedSourceName({ source, order = "title-first", part }: Readonly<{
  source: NamedSource;
  order?: "title-first" | "organization-first";
  /** Render only one part, such as the organization in "{organization} official image". */
  part?: "title" | "organization";
}>) {
  const { locale } = useInterfaceMessages();
  const { title, organization } = sourceNameParts(source, locale);
  const titleSpan = <span lang={title.lang}>{title.text}</span>;
  const organizationSpan = <span lang={organization.lang}>{organization.text}</span>;
  if (part === "title") return titleSpan;
  if (part === "organization") return organizationSpan;
  return order === "title-first"
    ? <>{titleSpan} — {organizationSpan}</>
    : <>{organizationSpan}{locale === "ja" ? "：" : ": "}{titleSpan}</>;
}
