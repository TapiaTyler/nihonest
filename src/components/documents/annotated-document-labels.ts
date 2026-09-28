import type { InterfaceMessageId } from "@/domain/localization/interface-message-catalogs/english";
import type { ArticleAnnotatedDocument } from "@/lib/content/annotated-documents";

type DocumentVersion = ArticleAnnotatedDocument["versions"][number];
type JurisdictionVariant = ArticleAnnotatedDocument["jurisdictionVariants"][number];

export const documentLifecycleMessageIds = {
  current: "documents.lifecycle.current",
  superseded: "documents.lifecycle.superseded",
  future: "documents.lifecycle.future",
} as const satisfies Record<DocumentVersion["lifecycle"], InterfaceMessageId>;

export const documentReviewMessageIds = {
  "needs-review": "documents.review.needsReview",
  verified: "documents.review.verified",
  stale: "documents.review.stale",
} as const satisfies Record<DocumentVersion["reviewStatus"], InterfaceMessageId>;

export function formatDocumentDate(value: string, locale: string = "en") {
  const date = new Date(`${value}T00:00:00Z`);
  return locale === "ja"
    ? new Intl.DateTimeFormat("ja-JP", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }).format(date)
    : new Intl.DateTimeFormat("en", { dateStyle: "medium", timeZone: "UTC" }).format(date);
}

/**
 * Document content in the reader's language: Japanese from the family's current translation when the interface is
 * Japanese and one exists, otherwise the canonical English. `lang` marks English shown to a Japanese reader.
 */
export function documentText(family: ArticleAnnotatedDocument, locale: string) {
  const japanese = locale === "ja" ? family.japanese : undefined;
  return {
    japanese: Boolean(japanese),
    lang: locale === "ja" && !japanese ? "en" : undefined,
    text: (path: string, english: string) => japanese?.[path] ?? english,
    versionPath: (version: DocumentVersion, variant: JurisdictionVariant | undefined) => (
      variant ? `variants.${variant.id}.versions.${version.id}` : `versions.${version.id}`
    ),
  };
}

export type DocumentText = ReturnType<typeof documentText>;
