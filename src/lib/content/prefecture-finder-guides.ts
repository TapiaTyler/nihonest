import type { generalLocalAdvice } from "@/data/local-guidance/general-advice";
import type { InterfaceMessageId } from "@/domain/localization/interface-message-catalogs/english";

/**
 * Lightweight finder constants and payload types for the browser. This module must not import geography or
 * guidance catalogs; the server assembles finder data in ./prefecture-finder and passes only the payload.
 */
export type FinderCoverage = Readonly<{
  prefectureId: string;
  municipalities: readonly Readonly<{
    id: string;
    name: string;
    supplements: readonly Readonly<{
      id: string;
      title: string;
      articleId: string;
      lastCheckedAt: string;
      status: "needs-review";
    }>[];
  }>[];
}>;

export type FinderMunicipality = Readonly<{
  id: string;
  code: string;
  name: string;
  japaneseName: string;
  prefectureId: string;
  parentId?: string;
  /** Designated cities run procedures city-wide through ward offices whose details can differ. */
  isDesignatedCity: boolean;
}>;

/** Short guide labels live in the interface catalogs (`finder.nationalGuide.*`, `finder.generalGuide.*`). */
export const prefectureNationalGuides = [
  { articleId: "registering-your-address-after-arrival", messageId: "finder.nationalGuide.address" },
  { articleId: "joining-national-health-insurance", messageId: "finder.nationalGuide.healthInsurance" },
  { articleId: "preparing-for-disasters-and-evacuation-in-japan", messageId: "finder.nationalGuide.disasters" },
  { articleId: "finding-japanese-language-and-local-support", messageId: "finder.nationalGuide.languageSupport" },
] as const satisfies readonly { articleId: string; messageId: InterfaceMessageId }[];

export const prefectureGeneralGuides = [
  { articleId: "registering-your-address-after-arrival", messageId: "finder.generalGuide.address" },
  { articleId: "joining-national-health-insurance", messageId: "finder.generalGuide.healthInsurance" },
  { articleId: "sorting-household-waste-and-arranging-disposal", messageId: "finder.generalGuide.waste" },
  { articleId: "preparing-for-disasters-and-evacuation-in-japan", messageId: "finder.generalGuide.disasters" },
  { articleId: "finding-japanese-language-and-local-support", messageId: "finder.generalGuide.languageSupport" },
  { articleId: "income-and-resident-tax-after-moving-to-japan", messageId: "finder.generalGuide.tax" },
  { articleId: "national-pension-after-moving-to-japan", messageId: "finder.generalGuide.pension" },
] as const satisfies readonly { articleId: keyof typeof generalLocalAdvice; messageId: InterfaceMessageId }[];
