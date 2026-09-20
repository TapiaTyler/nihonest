import { japaneseTermSchema } from "@/domain/glossary/glossary";

/** Glossary records whose primary browse subject is housing. */
export const housingGlossaryEntries = [
  japaneseTermSchema.parse({
    id: "shikikin", slug: "shikikin", japanese: "敷金", kana: "しききん", romaji: "shikikin", englishName: "Security Deposit",
    shortDefinition: "Money held under a rental agreement to cover specified tenant obligations, subject to the contract and settlement.",
    detailedExplanation: "A deposit may be applied to unpaid rent or permitted restoration costs, with any balance handled under the lease and applicable rules. It is different from non-refundable key money and agency fees.",
    commonContext: "Listed in rental advertisements, initial-cost estimates, leases, and move-out settlements.",
    topicIds: ["housing"], journeyStageIds: ["preparing", "recently-arrived", "living-in-japan"], relatedArticleIds: ["finding-housing-and-moving-in"], relatedTermIds: ["reikin", "chukai-tesuryo", "rentai-hosho-gaisha"], sourceIds: ["mlit-rental-guide"], searchTerms: ["deposit", "rental deposit", "security money", "shikikin"], status: "draft",
  }),
  japaneseTermSchema.parse({
    id: "reikin", slug: "reikin", japanese: "礼金", kana: "れいきん", romaji: "reikin", englishName: "Key Money",
    shortDefinition: "A typically non-refundable payment to a landlord required by some Japanese rental agreements.",
    detailedExplanation: "Key money is an initial housing cost and is distinct from a refundable security deposit, rent, insurance, guarantee-company charges, and the real-estate agent's fee. Whether it is charged depends on the property and contract.",
    commonContext: "Shown in property listings and move-in cost breakdowns, sometimes as a multiple or fraction of monthly rent.",
    topicIds: ["housing"], journeyStageIds: ["preparing", "recently-arrived"], relatedArticleIds: ["finding-housing-and-moving-in"], relatedTermIds: ["shikikin", "chukai-tesuryo"], sourceIds: ["mlit-rental-guide"], searchTerms: ["key money", "gratitude money", "rental gift", "reikin"], status: "draft",
  }),
  japaneseTermSchema.parse({
    id: "chukai-tesuryo", slug: "chukai-tesuryo", japanese: "仲介手数料", kana: "ちゅうかいてすうりょう", romaji: "chūkai tesūryō", englishName: "Brokerage Fee",
    shortDefinition: "A fee charged by a real-estate intermediary for arranging a rental transaction.",
    detailedExplanation: "The brokerage fee is separate from rent, deposit, key money, insurance, and guarantee-company charges. Confirm the amount, tax treatment, recipient, and timing in the written cost breakdown.",
    commonContext: "Appears on rental estimates and contracts prepared by a real-estate agency.",
    topicIds: ["housing"], journeyStageIds: ["preparing", "recently-arrived"], relatedArticleIds: ["finding-housing-and-moving-in"], relatedTermIds: ["shikikin", "reikin", "rentai-hosho-gaisha"], sourceIds: ["mlit-rental-guide"], searchTerms: ["agency fee", "agent fee", "broker fee", "chukai tesuryo"], status: "draft",
  }),
  japaneseTermSchema.parse({
    id: "rentai-hosho-gaisha", slug: "rentai-hosho-gaisha", japanese: "賃貸保証会社", kana: "ちんたいほしょうがいしゃ", romaji: "chintai hoshō gaisha", englishName: "Rental Guarantee Company",
    shortDefinition: "A company that guarantees specified rent obligations for a tenant under a separate agreement and fee structure.",
    detailedExplanation: "A landlord or agent may require screening and a contract with a guarantee company instead of, or alongside, a personal guarantor. Coverage, fees, renewal charges, and recourse differ by agreement.",
    commonContext: "Common in private rental applications, especially when a tenant cannot provide the landlord's preferred personal guarantor.",
    topicIds: ["housing"], journeyStageIds: ["preparing", "recently-arrived", "living-in-japan"], relatedArticleIds: ["finding-housing-and-moving-in"], relatedTermIds: ["shikikin", "chukai-tesuryo"], sourceIds: ["mlit-rental-guide"], searchTerms: ["guarantor company", "rent guarantee", "housing guarantor", "hosho gaisha"], status: "draft",
  }),
  japaneseTermSchema.parse({ id: "kanri-gaisha", slug: "kanri-gaisha", japanese: "管理会社", kana: "かんりがいしゃ", romaji: "kanri gaisha", englishName: "Property Management Company", shortDefinition: "A company handling specified management tasks for a rental building or property owner.", detailedExplanation: "Its authority and duties depend on the management arrangement and issue. Residents should preserve the lease and identify whether the landlord, broker, management company, guarantor, insurer, or municipality is responsible.", commonContext: "Contacted about building rules, repairs, common areas, noise, keys, notices, and move-out procedures.", topicIds: ["housing", "daily-life"], journeyStageIds: ["preparing", "living-in-japan"], relatedArticleIds: ["living-in-a-japanese-neighborhood-and-shared-spaces", "finding-housing-and-moving-in"], relatedTermIds: ["chonaikai-jichikai"], sourceIds: ["mlit-rental-guide"], searchTerms: ["building management", "rental manager", "apartment complaint", "landlord contact"], status: "needs-review" }),
];
