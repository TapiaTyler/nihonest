import { officialSourceSchema } from "@/domain/source/source";

export const sources = [
  officialSourceSchema.parse({
    id: "japan-government-portal",
    organization: "Government of Japan",
    title: "JapanGov",
    url: "https://www.japan.go.jp/",
    authorityLevel: "national-government",
    language: "en",
    lastCheckedAt: "2026-09-05",
  }),
  officialSourceSchema.parse({
    id: "immigration-services-status-appendix",
    organization: "Immigration Services Agency of Japan",
    title: "Appendix: List of Status of Residence",
    url: "https://www.moj.go.jp/isa/content/001425124.pdf",
    authorityLevel: "national-government",
    language: "en",
    lastCheckedAt: "2026-09-05",
  }),
  officialSourceSchema.parse({
    id: "mofa-work-long-term-stay",
    organization: "Ministry of Foreign Affairs of Japan",
    title: "Work or Long-term Stay",
    url: "https://www.mofa.go.jp/j_info/visit/visa/long/",
    authorityLevel: "national-government",
    language: "en",
    lastCheckedAt: "2026-09-05",
  }),
  officialSourceSchema.parse({ id: "study-in-japan-planning", organization: "Japan Student Services Organization", title: "Planning studies in Japan", url: "https://www.studyinjapan.go.jp/en/planning/", authorityLevel: "public-institution", language: "en", lastCheckedAt: "2026-09-05" }),
  officialSourceSchema.parse({ id: "study-in-japan-immigration", organization: "Japan Student Services Organization", title: "Immigration and student visas", url: "https://www.studyinjapan.go.jp/en/planning/immigration-procedures/", authorityLevel: "public-institution", language: "en", lastCheckedAt: "2026-09-05" }),
  officialSourceSchema.parse({ id: "mofa-student-visa", organization: "Ministry of Foreign Affairs of Japan", title: "General visa: Student", url: "https://www.mofa.go.jp/j_info/visit/visa/long/visa6.html", authorityLevel: "national-government", language: "en", lastCheckedAt: "2026-09-05" }),
  officialSourceSchema.parse({ id: "isa-new-entrant-guidance", organization: "Immigration Services Agency of Japan", title: "Guidance for new entrants", url: "https://www.moj.go.jp/isa/support/guidance/?hl=en", authorityLevel: "national-government", language: "en", lastCheckedAt: "2026-09-05" }),
  officialSourceSchema.parse({ id: "my-number-faq", organization: "Japan Agency for Local Authority Information Systems", title: "My Number Card FAQ", url: "https://www.kojinbango-card.go.jp/en-faq/", authorityLevel: "public-institution", language: "en", lastCheckedAt: "2026-09-05" }),
  officialSourceSchema.parse({ id: "study-in-japan-insurance", organization: "Japan Student Services Organization", title: "Insurance", url: "https://www.studyinjapan.go.jp/en/life/insurance/", authorityLevel: "public-institution", language: "en", lastCheckedAt: "2026-09-05" }),
  officialSourceSchema.parse({ id: "jps-national-pension-enrollment", organization: "Japan Pension Service", title: "National Pension enrollment", url: "https://www.nenkin.go.jp/international/english/japanese-system/nationalpension/np_enroll.html", authorityLevel: "public-institution", language: "en", lastCheckedAt: "2026-09-05" }),
  officialSourceSchema.parse({ id: "jps-pension-exemption", organization: "Japan Pension Service", title: "Contribution exemption and payment postponement", url: "https://www.nenkin.go.jp/international/english/japanese-system/nationalpension/np_exemption.html", authorityLevel: "public-institution", language: "en", lastCheckedAt: "2026-09-05" }),
  officialSourceSchema.parse({ id: "study-in-japan-accommodation", organization: "Japan Student Services Organization", title: "Accommodation", url: "https://www.studyinjapan.go.jp/en/life/accomodation/", authorityLevel: "public-institution", language: "en", lastCheckedAt: "2026-09-05" }),
  officialSourceSchema.parse({ id: "mlit-rental-guide", organization: "Ministry of Land, Infrastructure, Transport and Tourism", title: "Apartment Search Guidebook", url: "https://www.mlit.go.jp/jutakukentiku/house/jutakukentiku_house_tk3_000017.html", authorityLevel: "national-government", language: "en", lastCheckedAt: "2026-09-05" }),
  officialSourceSchema.parse({ id: "isa-daily-life-guidebook", organization: "Immigration Services Agency of Japan", title: "Guidebook on Living and Working", url: "https://www.moj.go.jp/isa/support/portal/guidebook_all.html?hl=en", authorityLevel: "national-government", language: "en", lastCheckedAt: "2026-09-05" }),
  officialSourceSchema.parse({ id: "fsa-bank-account-guide", organization: "Financial Services Agency", title: "Living in Japan: How to Open a Bank Account and Send Money", url: "https://www.fsa.go.jp/en/user/livinginjapan.html", authorityLevel: "national-government", language: "en", lastCheckedAt: "2026-09-05" }),
  officialSourceSchema.parse({ id: "study-in-japan-part-time", organization: "Japan Student Services Organization", title: "Part-time work", url: "https://www.studyinjapan.go.jp/en/work-in-japan/part-time-jobs/", authorityLevel: "public-institution", language: "en", lastCheckedAt: "2026-09-05" }),
] as const;

export function getSourceById(id: string) {
  return sources.find((source) => source.id === id);
}
