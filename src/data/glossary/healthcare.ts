import { japaneseTermSchema } from "@/domain/glossary/glossary";

/** Glossary records whose primary browse subject is healthcare. */
export const healthcareGlossaryEntries = [
  japaneseTermSchema.parse({
    id: "iryo-taizai", slug: "iryo-taizai", japanese: "医療滞在", kana: "いりょうたいざい", romaji: "iryō taizai", englishName: "Medical Stay",
    shortDefinition: "Japan's visa scheme for qualifying planned medical treatment and an accompanying person where necessary.",
    detailedExplanation: "Medical Stay can cover examinations, treatment, dental care, and recuperation instructed by a Japanese medical institution. The correct immigration route depends on the plan: qualifying stays of up to ninety days and longer hospitalization under Designated Activities do not use identical procedures.",
    commonContext: "Appears in medical-coordinator, treatment-plan, guarantor, visa, hospitalization, and medical-attendant guidance.",
    topicIds: ["healthcare", "immigration"], journeyStageIds: ["planning", "preparing"], relatedArticleIds: ["medical-stay-visa"], relatedTermIds: ["tanki-taizai", "tokutei-katsudo", "sasho"], sourceIds: ["mofa-medical-stay", "isa-medical-stay"], searchTerms: ["medical stay visa", "treatment visa", "hospital visa", "medical attendant", "iryo taizai"], status: "needs-review",
  }),
  japaneseTermSchema.parse({ id: "kyukyusha", slug: "kyukyusha", japanese: "救急車", kana: "きゅうきゅうしゃ", romaji: "kyūkyūsha", englishName: "Ambulance", shortDefinition: "An emergency medical response vehicle dispatched through 119.", detailedExplanation: "Dispatchers ask for the medical emergency, location, condition, and caller information. Ambulance transport does not by itself decide the receiving hospital, treatment, insurance coverage, or later cost.", commonContext: "Requested through 119 for serious illness or injury requiring emergency response.", topicIds: ["healthcare", "daily-life"], journeyStageIds: ["planning", "living-in-japan"], relatedArticleIds: ["calling-police-fire-and-ambulance-services-in-japan"], relatedTermIds: ["hyakujukyuban"], sourceIds: ["fdma-ambulance-foreign-visitors"], searchTerms: ["ambulance", "emergency medical transport", "call 119"], status: "needs-review" }),
];
