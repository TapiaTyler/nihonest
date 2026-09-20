import { japaneseTermSchema } from "@/domain/glossary/glossary";

/** Glossary records whose primary browse subject is municipal procedures. */
export const municipalProceduresGlossaryEntries = [
  japaneseTermSchema.parse({
    id: "jumin-toroku", slug: "jumin-toroku", japanese: "住民登録", kana: "じゅうみんとうろく", romaji: "jūmin tōroku", englishName: "Resident Registration",
    shortDefinition: "Registration of an eligible resident and address in a municipality's resident records.",
    detailedExplanation: "Resident registration connects an eligible resident to municipal procedures. It is not the same as receiving a visa, landing permission, or simply writing an address on a private contract.",
    commonContext: "Completed or updated through moving notifications at the responsible municipal office.",
    topicIds: ["municipal-procedures"], journeyStageIds: ["recently-arrived", "living-in-japan"], relatedArticleIds: ["registering-your-address-after-arrival", "understanding-my-number"], relatedTermIds: ["tennyu-todoke", "tenshutsu-todoke", "tenkyo-todoke", "juminhyo"], sourceIds: ["isa-new-entrant-guidance", "isa-daily-life-guidebook"], searchTerms: ["resident registration", "address registration", "basic resident register", "jumin toroku"], status: "draft",
  }),
  japaneseTermSchema.parse({
    id: "tenshutsu-todoke", slug: "tenshutsu-todoke", japanese: "転出届", kana: "てんしゅつとどけ", romaji: "tenshutsu todoke", englishName: "Moving-out Notification",
    shortDefinition: "The notification used when moving out of a municipality or otherwise ending the registered address there.",
    detailedExplanation: "A resident moving to another municipality normally completes the applicable moving-out procedure before registering the new address. Timing, online availability, and documents depend on the municipality and circumstances.",
    commonContext: "Filed with the municipality being left and paired with a moving-in notification at the destination when applicable.",
    topicIds: ["municipal-procedures"], journeyStageIds: ["living-in-japan"], relatedArticleIds: ["registering-your-address-after-arrival"], relatedTermIds: ["tennyu-todoke", "tenkyo-todoke", "jumin-toroku"], sourceIds: ["isa-daily-life-guidebook"], searchTerms: ["move out notice", "moving out form", "leaving municipality", "tenshutsu todoke"], status: "draft",
  }),
  japaneseTermSchema.parse({
    id: "tenkyo-todoke", slug: "tenkyo-todoke", japanese: "転居届", kana: "てんきょとどけ", romaji: "tenkyo todoke", englishName: "Change-of-address Notification",
    shortDefinition: "The notification generally used for a move to a new address within the same municipality.",
    detailedExplanation: "This updates the registered address without the separate move-out and move-in sequence used between municipalities. The responsible counter and required records vary locally.",
    commonContext: "Filed after an in-city or in-ward move under the municipality's deadline and instructions.",
    topicIds: ["municipal-procedures"], journeyStageIds: ["living-in-japan"], relatedArticleIds: ["registering-your-address-after-arrival"], relatedTermIds: ["tennyu-todoke", "tenshutsu-todoke", "jumin-toroku"], sourceIds: ["isa-daily-life-guidebook"], searchTerms: ["address change notice", "moving within city", "tenkyo todoke"], status: "draft",
  }),
  japaneseTermSchema.parse({
    id: "kojin-bango", slug: "kojin-bango", japanese: "個人番号", kana: "こじんばんごう", romaji: "kojin bangō", englishName: "Individual Number",
    shortDefinition: "The official Japanese name for the 12-digit number commonly called My Number.",
    detailedExplanation: "The number is assigned through the resident-register system and is used only for legally specified administration. It is the number itself, not the photo My Number Card or the residence-card number.",
    commonContext: "Appears on tax, social-security, municipal, and My Number documents.",
    topicIds: ["municipal-procedures", "taxes"], journeyStageIds: ["recently-arrived", "living-in-japan"], relatedArticleIds: ["understanding-my-number"], relatedTermIds: ["my-number", "my-number-card", "jumin-toroku"], sourceIds: ["my-number-faq"], searchTerms: ["personal number", "individual number", "kojin bango", "12 digit number"], status: "draft",
  }),
  japaneseTermSchema.parse({
    id: "my-number-card", slug: "my-number-card", japanese: "マイナンバーカード", kana: "まいなんばーかーど", romaji: "mai nanbā kādo", englishName: "My Number Card",
    shortDefinition: "An optional photo identification card associated with a resident's Individual Number.",
    detailedExplanation: "A resident applies for the card; receiving an Individual Number does not automatically order it. The card is distinct from both the initial number notice and a foreign resident's residence card.",
    commonContext: "Used for identification and supported government or municipal services, subject to current procedures and validity.",
    topicIds: ["municipal-procedures"], journeyStageIds: ["recently-arrived", "living-in-japan"], relatedArticleIds: ["understanding-my-number"], relatedTermIds: ["my-number", "kojin-bango", "zairyu-card"], sourceIds: ["my-number-faq"], searchTerms: ["individual number card", "personal number card", "photo number card", "mainanba card"], status: "draft",
  }),
  japaneseTermSchema.parse({
    id: "gakusei-nofu-tokurei-seido", slug: "gakusei-nofu-tokurei-seido", japanese: "学生納付特例制度", kana: "がくせいのうふとくれいせいど", romaji: "gakusei nōfu tokurei seido", englishName: "Student Special Payment System",
    shortDefinition: "A National Pension system allowing eligible students to postpone contribution payments for an approved period.",
    detailedExplanation: "Student status does not create an automatic pension exemption. An eligible student applies, approval is period-specific, and postponed periods affect pension records differently from paid contributions unless later repaid under the rules.",
    commonContext: "Discussed at municipal pension counters and in Japan Pension Service notices sent to students.",
    topicIds: ["municipal-procedures"], journeyStageIds: ["recently-arrived", "living-in-japan"], relatedArticleIds: ["national-pension-after-moving-to-japan"], relatedTermIds: ["kokumin-nenkin"], sourceIds: ["jps-pension-exemption"], searchTerms: ["student pension exemption", "pension postponement", "student special payment", "gakusei nofu tokurei"], status: "draft",
  }),
  japaneseTermSchema.parse({ id: "todofuken", slug: "todofuken", japanese: "都道府県", kana: "とどうふけん", romaji: "todōfuken", englishName: "Prefectures", shortDefinition: "The collective term for Japan's 47 prefectural-level governments.", detailedExplanation: "The English umbrella 'prefecture' covers Tokyo-to, Hokkaido-do, Kyoto-fu and Osaka-fu, and forty-three ken. Prefectural responsibility is distinct from national agencies, municipalities, and private organizations.", commonContext: "Used when identifying a prefectural government, prefectural police service, licensing authority, school system, tax layer, or location.", topicIds: ["municipal-procedures", "daily-life"], journeyStageIds: ["planning", "preparing", "recently-arrived", "living-in-japan"], relatedArticleIds: ["understanding-japan-geography-government-and-language"], relatedTermIds: ["shichoson", "tokubetsu-ku", "chiho"], sourceIds: ["clair-local-government-japan-2024"], searchTerms: ["prefecture", "prefectural government", "47 prefectures", "Tokyo to", "Hokkaido do", "fu ken"], status: "needs-review" }),
  japaneseTermSchema.parse({ id: "shichoson", slug: "shichoson", japanese: "市町村", kana: "しちょうそん", romaji: "shichōson", englishName: "Municipalities", shortDefinition: "Japan's cities, towns, and villages as local-government bodies below the prefectural level.", detailedExplanation: "Municipalities commonly administer resident records, address-linked insurance procedures, waste services, and other local functions. Tokyo's special wards are a separate municipal category, while a ward inside a designated city is part of that city.", commonContext: "Used when identifying the government responsible for an address, resident record, local tax, insurance counter, waste calendar, or community service.", topicIds: ["municipal-procedures", "daily-life"], journeyStageIds: ["planning", "preparing", "recently-arrived", "living-in-japan"], relatedArticleIds: ["understanding-japan-geography-government-and-language", "registering-your-address-after-arrival"], relatedTermIds: ["todofuken", "tokubetsu-ku", "shiyakusho", "kuyakusho"], sourceIds: ["clair-local-government-japan-2024"], searchTerms: ["municipality", "municipal government", "city town village", "local government", "city hall"], status: "needs-review" }),
  japaneseTermSchema.parse({ id: "tokubetsu-ku", slug: "tokubetsu-ku", japanese: "特別区", kana: "とくべつく", romaji: "tokubetsu-ku", englishName: "Special Ward", shortDefinition: "One of Tokyo's 23 wards, which has municipal status for many local-government purposes.", detailedExplanation: "A Tokyo special ward is not the same governmental structure as a ward used as an administrative subdivision inside a designated city such as Nagoya. Readers should check the exact municipality and responsible counter.", commonContext: "Used for Tokyo address registration, local tax, insurance, waste, elections, and other ward-level municipal services.", topicIds: ["municipal-procedures", "daily-life"], journeyStageIds: ["planning", "preparing", "recently-arrived", "living-in-japan"], relatedArticleIds: ["understanding-japan-geography-government-and-language", "registering-your-address-after-arrival"], relatedTermIds: ["shichoson", "kuyakusho", "todofuken"], sourceIds: ["clair-local-government-japan-2024"], searchTerms: ["Tokyo special ward", "23 wards", "tokubetsuku", "ward government", "Shinjuku ward"], status: "needs-review" }),
];
