import { z } from "zod";

export const readingAidPreferenceSchema = z.enum(["kana", "romaji", "both"]);

export type ReadingAidPreference = z.infer<typeof readingAidPreferenceSchema>;

export const defaultReadingAidPreference: ReadingAidPreference = "both";

export const readingAidOptions = [
  { id: "kana", label: "Kana" },
  { id: "romaji", label: "Romaji" },
  { id: "both", label: "Both" },
] as const satisfies readonly { id: ReadingAidPreference; label: string }[];
