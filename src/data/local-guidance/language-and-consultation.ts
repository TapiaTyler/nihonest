import { defineLocalGuidanceSupplements } from "@/data/local-guidance/shared";

export const languageAndConsultationSupplements = defineLocalGuidanceSupplements([
  {
    id: "shinjuku-language-and-consultation", articleId: "finding-japanese-language-and-local-support", geographyId: "shinjuku",
    title: "Language learning and consultation in Shinjuku", summary: "Shinjuku provides foreign-resident consultation and multiple local Japanese-learning routes.",
    applicability: "Eligibility, languages, availability, schedules, and fees can change; confirm them on the current service page.", responsibleBody: "Shinjuku City and named local service providers", receivingOffice: "Foreign Resident Advisory Corner or the provider named for a class",
    actions: [{ title: "Choose help by purpose", description: "Use the consultation route for daily-life questions and the language-learning directory for classes. Check the current language, age, residency-priority, registration, and availability rules before attending." }],
    sourceIds: ["shinjuku-foreign-resident-consultation", "shinjuku-japanese-language-classes"],
  },
  {
    id: "nagoya-language-and-consultation", articleId: "finding-japanese-language-and-local-support", geographyId: "nagoya",
    title: "Language and consultation support in Nagoya", summary: "Nagoya International Center provides multilingual living information, consultation, referrals, and local support resources.",
    applicability: "The Center is a public institution linked to local support, but it does not replace the ward office or decide another authority's case.", responsibleBody: "Nagoya International Center",
    actions: [{ title: "Start with the service directory", description: "Choose the service matching your language and question, then confirm current hours, appointment requirements, and whether the Center provides information, interpretation, referral, or professional consultation." }],
    sourceIds: ["nagoya-international-center"],
  },
]);
