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
] as const;

export function getSourceById(id: string) {
  return sources.find((source) => source.id === id);
}
