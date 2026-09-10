import { z } from "zod";

export const contentLocalePreferenceSchema = z.enum(["en", "ja"]);

export type ContentLocalePreference = z.infer<typeof contentLocalePreferenceSchema>;

export const defaultContentLocale: ContentLocalePreference = "en";

export const contentLocaleOptions = [
  { id: "en", label: "English" },
  { id: "ja", label: "日本語（試験版）" },
] as const satisfies readonly { id: ContentLocalePreference; label: string }[];
