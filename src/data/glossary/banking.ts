import { japaneseTermSchema } from "@/domain/glossary/glossary";

/** Glossary records whose primary browse subject is banking. */
export const bankingGlossaryEntries = [
  japaneseTermSchema.parse({
    id: "honnin-kakunin", slug: "honnin-kakunin", japanese: "本人確認", kana: "ほんにんかくにん", romaji: "honnin kakunin", englishName: "Identity Verification",
    shortDefinition: "A procedure used to confirm that a person is who they claim to be.",
    detailedExplanation: "Banks, mobile providers, landlords, and public offices may require different acceptable documents and matching name, address, or contact information. Passing one organization's check does not guarantee another uses the same requirements.",
    commonContext: "Appears on account, phone, payment, contract, and administrative application instructions.",
    topicIds: ["banking", "daily-life"], journeyStageIds: ["recently-arrived", "living-in-japan"], relatedArticleIds: ["opening-a-bank-account-after-moving-to-japan", "getting-a-phone-number-in-japan"], relatedTermIds: ["zairyu-card", "juminhyo"], sourceIds: ["fsa-bank-account-guide", "isa-daily-life-guidebook"], searchTerms: ["ID check", "identity check", "know your customer", "KYC", "honnin kakunin"], status: "draft",
  }),
  japaneseTermSchema.parse({
    id: "futsu-yokin", slug: "futsu-yokin", japanese: "普通預金", kana: "ふつうよきん", romaji: "futsū yokin", englishName: "Ordinary Deposit Account",
    shortDefinition: "A common Japanese bank deposit account used for everyday deposits, withdrawals, transfers, and payments.",
    detailedExplanation: "Available features, screening, fees, cards, online access, and transfer limits depend on the bank and customer circumstances. The term describes the account type, not an assurance that every new arrival can open one immediately.",
    commonContext: "Appears on account-opening forms, bankbooks, online banking, payroll forms, and direct-debit applications.",
    topicIds: ["banking"], journeyStageIds: ["recently-arrived", "living-in-japan"], relatedArticleIds: ["opening-a-bank-account-after-moving-to-japan"], relatedTermIds: ["honnin-kakunin"], sourceIds: ["fsa-bank-account-guide"], searchTerms: ["savings account", "regular account", "bank account", "futsu yokin"], status: "draft",
  }),
];
